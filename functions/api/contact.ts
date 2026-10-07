// POST /api/contact: Contact form. JSON from the client script, or a native
// form post (urlencoded / multipart) when JS is off.
import contactJson from "../../src/content/contact.json";
import contactEsJson from "../../src/content/es/contact.json";
import {
  type ConsentContent,
  type Env,
  type Locale,
  LIMITS,
  clean,
  consentRecord,
  consentRows,
  guard,
  isEmail,
  isSameOrigin,
  localeOf,
  methodNotAllowed,
  postWebhook,
  renderRows,
  respond,
  sendEmail,
  siteUrl,
} from "./_shared";

const PAGE = "/contact" as const;
const MAX_BODY_BYTES = 64 * 1024;

type ContactContent = {
  topics: string[];
  replyVia: string[];
  consent: ConsentContent;
};
/** Option values (`topics`, `replyVia`) are the same English strings on both language versions of the form. */
const content = contactJson as ContactContent;
const consents: Record<Locale, ConsentContent> = { en: content.consent, es: (contactEsJson as ContactContent).consent };

async function readBody(
  request: Request,
): Promise<Record<string, unknown> | null> {
  try {
    if (
      (request.headers.get("Content-Type") ?? "").includes("application/json")
    ) {
      const text = await request.text();
      if (text.length > MAX_BODY_BYTES) return null;
      const data: unknown = JSON.parse(text);
      return data && typeof data === "object" && !Array.isArray(data)
        ? (data as Record<string, unknown>)
        : null;
    }
    const form = await request.formData();
    const out: Record<string, unknown> = {};
    for (const [k, v] of form.entries())
      if (typeof v === "string" && !(k in out)) out[k] = v;
    return out;
  } catch {
    return null;
  }
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let locale: Locale = "en";
  try {
    if (!isSameOrigin(request, env))
      return respond(request, PAGE, { ok: false, error: "origin" });

    const declared = Number(request.headers.get("Content-Length") ?? "0");
    if (declared > MAX_BODY_BYTES)
      return respond(request, PAGE, { ok: false, error: "too_large" });

    const body = await readBody(request);
    if (!body) return respond(request, PAGE, { ok: false, error: "invalid" });
    const field = (name: string, max: number, multiline = false) =>
      clean(body[name], max, multiline);
    locale = localeOf(field("locale", 2));

    const checked = await guard(request, env, "contact", {
      token: field("cf-turnstile-response", 4096),
      honeypot: field("company", 200),
      nojs: field("nojs", 4) === "1",
    });
    if (!checked.pass) return respond(request, PAGE, checked.result, locale);

    const first = field("first", LIMITS.name);
    const last = field("last", LIMITS.name);
    const email = field("email", LIMITS.email);
    const phone = field("phone", LIMITS.phone);
    const message = field("message", LIMITS.message, true);
    const consentText = field("consent", LIMITS.consent);
    if (!first || !last || !isEmail(email) || !message || !consentText) {
      return respond(request, PAGE, { ok: false, error: "invalid" }, locale);
    }
    // Only the options offered on the page are kept.
    const topicIn = field("topic", LIMITS.short);
    const topic = content.topics.includes(topicIn) ? topicIn : "";
    const viaIn = field("replyVia", LIMITS.short);
    const replyVia = content.replyVia.includes(viaIn) ? viaIn : "";

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const consent = consentRecord(
      request,
      env,
      PAGE,
      consentText,
      consents,
    );

    const rows = renderRows([
      ["Name", `${first} ${last}`],
      ["Email", email],
      ["Phone", phone],
      ["Subject", topic],
      ["Reply by", replyVia],
      ["Message", message],
      ["Language", locale],
      ["Message ID", id],
      ["Received", createdAt],
      ...consentRows(consent),
    ]);

    let delivered = true;
    const clinicEmail = sendEmail(env, {
      to: env.NOTIFY_EMAIL ?? "",
      replyTo: email,
      subject: `Contact form: ${first} ${last}${topic ? ` (${topic})` : ""}`,
      html: rows.html,
      text: rows.text,
    }).catch((err: unknown) => {
      delivered = false;
      console.error("clinic email failed", err);
    });
    // Flat snake_case keys first: they are what the CRM (GoHighLevel inbound webhook) maps onto contact fields.
    const webhook = postWebhook(env, {
      type: "contact",
      id,
      createdAt,
      first_name: first,
      last_name: last,
      full_name: `${first} ${last}`.trim(),
      form: "Contact",
      first,
      last,
      email,
      phone,
      topic,
      message,
      replyVia,
      locale,
      consent,
      source: siteUrl(env) + PAGE,
    });
    await Promise.all([clinicEmail, webhook]);

    // Contact messages are not stored anywhere else: if the email did not go
    // out and there is no CRM to catch it, the visitor must be told.
    if (!delivered && !env.CRM_WEBHOOK_URL)
      return respond(request, PAGE, { ok: false, error: "server" }, locale);
    return respond(request, PAGE, { ok: true }, locale);
  } catch (err) {
    console.error("contact handler failed", err);
    return respond(request, PAGE, { ok: false, error: "server" }, locale);
  }
};

export const onRequest: PagesFunction<Env> = async () =>
  methodNotAllowed("POST");
