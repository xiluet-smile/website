// POST /api/lead: Free Photo Evaluation form (multipart).
// Stores photos + the lead record (with TCPA consent) in R2, emails the clinic
// signed photo links, pushes to the CRM webhook and sends the patient autoresponder.
import leadFormJson from "../../src/content/lead-form.json";
import leadFormEsJson from "../../src/content/es/lead-form.json";
import {
  type ConsentContent,
  type Env,
  type Locale,
  LIMITS,
  PHOTO_LINK_TTL_SEC,
  clean,
  consentRecord,
  consentRows,
  escapeHtml,
  fill,
  guard,
  isEmail,
  isPhone,
  isSameOrigin,
  localeOf,
  methodNotAllowed,
  postWebhook,
  renderRows,
  respond,
  sendEmail,
  settle,
  signedPhotoUrl,
  site,
  siteUrl,
} from "./_shared";

const PAGE = "/free-photo-evaluation" as const;

type LeadContent = {
  limits: { maxPhotos: number; maxPhotoMb: number };
  concerns: string[];
  consent: ConsentContent;
  confirmation: { receivedOne: string; receivedMany: string };
  autoresponder: { subject: string; photosLine: string; body: string };
};
/** English copy; `concerns` values are the same English strings on the Spanish form. */
const content = leadFormJson as LeadContent;
/** Per-language copy for the consent check and the patient autoresponder. */
const byLocale: Record<Locale, LeadContent> = { en: content, es: leadFormEsJson as LeadContent };
const consents: Record<Locale, ConsentContent> = { en: content.consent, es: byLocale.es.consent };

const MAX_PHOTOS = content.limits.maxPhotos;
const MAX_PHOTO_BYTES = content.limits.maxPhotoMb * 1024 * 1024;
/** All photos plus 1 MB for the text fields and multipart framing. */
const MAX_BODY_BYTES = MAX_PHOTOS * MAX_PHOTO_BYTES + 1024 * 1024;

type Sniffed = { ext: "jpg" | "png" | "webp" | "heic" | "gif"; contentType: string };

const HEIF_BRANDS = new Set(["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1"]);

/** Identifies the image by its magic bytes; the client-supplied type and name are not trusted. */
async function sniffImage(file: File): Promise<Sniffed | null> {
  const b = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (b.length < 12) return null;
  const ascii = (from: number, to: number) => String.fromCharCode(...b.subarray(from, to));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", contentType: "image/jpeg" };
  if (b[0] === 0x89 && ascii(1, 4) === "PNG" && b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a) {
    return { ext: "png", contentType: "image/png" };
  }
  if (ascii(0, 6) === "GIF87a" || ascii(0, 6) === "GIF89a") return { ext: "gif", contentType: "image/gif" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { ext: "webp", contentType: "image/webp" };
  if (ascii(4, 8) === "ftyp" && HEIF_BRANDS.has(ascii(8, 12))) return { ext: "heic", contentType: "image/heic" };
  return null;
}

/** image/* only, never SVG. Some browsers send HEIC with an empty type; the sniff decides those. */
function mimeAllowed(type: string): boolean {
  const t = type.toLowerCase();
  if (t.includes("svg")) return false;
  return t === "" || t === "application/octet-stream" || t.startsWith("image/");
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let locale: Locale = "en";
  try {
    if (!isSameOrigin(request, env)) return respond(request, PAGE, { ok: false, error: "origin" });

    const declared = Number(request.headers.get("Content-Length") ?? "0");
    if (declared > MAX_BODY_BYTES) return respond(request, PAGE, { ok: false, error: "too_large" });

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return respond(request, PAGE, { ok: false, error: "invalid" });
    }
    const field = (name: string, max: number, multiline = false) => clean(form.get(name), max, multiline);
    locale = localeOf(field("locale", 2));

    const checked = await guard(request, env, "lead", {
      token: field("cf-turnstile-response", 4096),
      honeypot: field("company", 200),
      nojs: field("nojs", 4) === "1",
    });
    if (!checked.pass) return respond(request, PAGE, checked.result, locale);

    // The page has first/last inputs that share the field name "name".
    const name = clean(
      form
        .getAll("name")
        .filter((v): v is string => typeof v === "string")
        .map((v) => v.trim())
        .filter(Boolean)
        .join(" "),
      LIMITS.name,
    );
    const phone = field("phone", LIMITS.phone);
    const email = field("email", LIMITS.email);
    const consentText = field("consent", LIMITS.consent);
    if (!name || !isPhone(phone) || !isEmail(email) || !consentText) {
      return respond(request, PAGE, { ok: false, error: "invalid" }, locale);
    }
    const submittedConcerns = new Set(form.getAll("concerns").filter((v): v is string => typeof v === "string"));
    const concerns = content.concerns.filter((c) => submittedConcerns.has(c)).slice(0, LIMITS.concerns);
    const origin = field("origin", LIMITS.short);
    const notes = field("notes", LIMITS.message, true);

    // Photos are optional. An untouched file input submits one empty file.
    const files = form.getAll("photos").filter((v): v is File => typeof v !== "string" && v.size > 0);
    if (files.length > MAX_PHOTOS) return respond(request, PAGE, { ok: false, error: "photos" }, locale);
    const sniffed: Sniffed[] = [];
    for (const file of files) {
      if (file.size > MAX_PHOTO_BYTES || !mimeAllowed(file.type)) return respond(request, PAGE, { ok: false, error: "photos" }, locale);
      const kind = await sniffImage(file);
      if (!kind) return respond(request, PAGE, { ok: false, error: "photos" }, locale);
      sniffed.push(kind);
    }

    if (!env.R2_PHOTOS) {
      console.error("R2_PHOTOS binding is missing");
      return respond(request, PAGE, { ok: false, error: "server" }, locale);
    }

    const id = crypto.randomUUID();
    const now = new Date();
    const prefix = `leads/${now.getUTCFullYear()}/${id}`;
    const consent = consentRecord(request, env, PAGE, consentText, consents);

    const photos: { key: string; contentType: string; size: number; originalName: string }[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const key = `${prefix}/${i + 1}.${sniffed[i].ext}`;
        await env.R2_PHOTOS.put(key, files[i], { httpMetadata: { contentType: sniffed[i].contentType } });
        photos.push({
          key,
          contentType: sniffed[i].contentType,
          size: files[i].size,
          originalName: clean(files[i].name, LIMITS.short),
        });
      }
      const record = { id, createdAt: now.toISOString(), name, phone, email, concerns, origin, notes, photos, consent };
      await env.R2_PHOTOS.put(`${prefix}/lead.json`, JSON.stringify(record, null, 2), {
        httpMetadata: { contentType: "application/json" },
      });
    } catch (err) {
      console.error("lead storage failed", err);
      // Best effort: do not leave orphaned photos behind.
      if (photos.length) await settle("orphan cleanup", env.R2_PHOTOS.delete(photos.map((p) => p.key)));
      return respond(request, PAGE, { ok: false, error: "server" }, locale);
    }

    // The lead is stored. Nothing below may fail the request.
    const exp = Math.floor(now.getTime() / 1000) + PHOTO_LINK_TTL_SEC;
    const expiresAt = new Date(exp * 1000).toISOString();
    let links: string[] = [];
    try {
      links = await Promise.all(photos.map((p) => signedPhotoUrl(env, p.key, exp)));
    } catch (err) {
      console.error("photo links could not be signed", err);
    }

    const rows = renderRows([
      ["Name", name],
      ["Phone", phone],
      ["Email", email],
      ["Concerns", concerns.join(", ")],
      ["Notes", notes],
      ["Origin", origin],
      ["Language", locale],
      ["Lead ID", id],
      ["Received", now.toISOString()],
      ...consentRows(consent),
    ]);
    const photoHtml = photos.length
      ? links.length
        ? `<p style="font:15px/1.5 Arial,sans-serif"><strong>Photos</strong> (links expire ${escapeHtml(expiresAt)})</p><ol style="font:15px/1.5 Arial,sans-serif">${links
            .map((url, i) => `<li><a href="${escapeHtml(url)}">Photo ${i + 1}</a> (${escapeHtml(photos[i].contentType)})</li>`)
            .join("")}</ol>`
        : `<p style="font:15px/1.5 Arial,sans-serif"><strong>Photos</strong>: ${photos.length} stored in R2 under ${escapeHtml(prefix)}/ (links could not be signed)</p>`
      : `<p style="font:15px/1.5 Arial,sans-serif"><strong>Photos</strong>: none sent</p>`;
    const photoText = photos.length
      ? links.length
        ? `Photos (links expire ${expiresAt}):\n${links.map((url, i) => `${i + 1}. ${url}`).join("\n")}`
        : `Photos: ${photos.length} stored in R2 under ${prefix}/ (links could not be signed)`
      : "Photos: none sent";

    const tasks: Promise<void>[] = [
      settle(
        "clinic email",
        sendEmail(env, {
          to: env.NOTIFY_EMAIL ?? "",
          replyTo: email,
          subject: `New photo evaluation: ${name}`,
          html: `${rows.html}${photoHtml}`,
          text: `${rows.text}\n\n${photoText}`,
        }),
      ),
      postWebhook(env, {
        type: "lead",
        id,
        createdAt: now.toISOString(),
        name,
        phone,
        email,
        concerns,
        origin,
        notes,
        locale,
        photos: photos.map((p, i) => ({
          url: links[i] ?? null,
          expiresAt: links[i] ? expiresAt : null,
          contentType: p.contentType,
          size: p.size,
        })),
        consent,
        source: siteUrl(env) + PAGE,
      }),
      settle("autoresponder", sendEmail(env, autoresponder(email, photos.length, locale))),
    ];
    // TODO(clinic): SMS autoresponder provider
    await Promise.all(tasks);

    return respond(request, PAGE, { ok: true }, locale);
  } catch (err) {
    console.error("lead handler failed", err);
    return respond(request, PAGE, { ok: false, error: "server" }, locale);
  }
};

/**
 * Patient autoresponder. The wording is the page's own hero and confirmation
 * copy (src/content/lead-form.json, or the Spanish twin for /es leads); nothing the visitor typed is echoed back.
 */
function autoresponder(to: string, photoCount: number, locale: Locale) {
  const copy = byLocale[locale];
  const a = copy.autoresponder;
  const lines: string[] = [];
  if (photoCount > 0) {
    const received = photoCount === 1 ? copy.confirmation.receivedOne : copy.confirmation.receivedMany;
    lines.push(`${fill(received, { count: photoCount })}. ${a.photosLine}`);
  }
  lines.push(fill(a.body, { replyHours: site.replyHours, officeHours: site.hours.display }));
  lines.push(site.name);
  return {
    to,
    subject: a.subject,
    html: lines.map((l) => `<p style="font:16px/1.55 Arial,sans-serif;color:#1a1a1a">${escapeHtml(l)}</p>`).join(""),
    text: lines.join("\n\n"),
  };
}

export const onRequest: PagesFunction<Env> = async () => methodNotAllowed("POST");
