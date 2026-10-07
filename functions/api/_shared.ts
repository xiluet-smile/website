// Shared helpers for the form endpoints (Cloudflare Pages Functions).
import siteJson from "../../src/content/site.json";

export interface Env {
  /** R2 bucket for patient photos and lead records. */
  R2_PHOTOS: R2Bucket;
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  /** Clinic inbox that receives leads and contact messages. */
  NOTIFY_EMAIL?: string;
  /** e.g. `Xiluet Smiles <hello@xiluetsmiledesign.com>` */
  FROM_EMAIL?: string;
  CRM_WEBHOOK_URL?: string;
  /** GoHighLevel private-integration token (scopes: contacts.readonly, contacts.write, forms.write). */
  GHL_API_TOKEN?: string;
  /** GoHighLevel sub-account (location) id. */
  GHL_LOCATION_ID?: string;
  /** Id of the contact custom field of type "File Upload" that receives the smile photos. */
  GHL_PHOTO_FIELD_ID?: string;
  LINK_SIGNING_SECRET?: string;
  /** Optional KV namespace; rate limiting is skipped without it. */
  RATE_LIMIT?: KVNamespace;
  /** "1" rejects every submission without a Turnstile token (disables the no-JS path). */
  REQUIRE_TURNSTILE?: string;
  /** Defaults to https://xiluetsmiledesign.com */
  SITE_URL?: string;
}

/** Facts from src/content/site.json used in emails. */
export const site = siteJson as {
  name: string;
  url: string;
  replyHours: number;
  hours: { display: string };
};

export type FormPage = "/free-photo-evaluation" | "/contact";
export type Locale = "en" | "es";

/**
 * Spanish URLs of the two form pages. Duplicated from src/lib/i18n.ts (esPaths)
 * because that module pulls in the site's `@/` imports, which the functions
 * tsconfig cannot resolve. Keep both in sync.
 */
const ES_PAGES: Record<FormPage, string> = {
  "/free-photo-evaluation": "/es/evaluacion-gratuita-por-fotos",
  "/contact": "/es/contacto",
};

/** Value of the form's hidden `locale` field, defaulting to English. */
export const localeOf = (value: unknown): Locale => (value === "es" ? "es" : "en");

/** The form page's URL path in the given language (no-JS redirects land back on the same-language page). */
export const pagePath = (page: FormPage, locale: Locale) => (locale === "es" ? ES_PAGES[page] : page);
export type ErrorCode = "invalid" | "photos" | "turnstile" | "rate" | "origin" | "too_large" | "server";
export type Result = { ok: true } | { ok: false; error: ErrorCode };

const STATUS: Record<ErrorCode, number> = {
  invalid: 400,
  photos: 400,
  turnstile: 403,
  origin: 403,
  rate: 429,
  too_large: 413,
  server: 500,
};

const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export const siteUrl = (env: Env) => (env.SITE_URL || site.url).replace(/\/+$/, "");

/** True for fetch() submissions; native form posts get redirects instead. */
export function wantsJson(request: Request): boolean {
  const accept = request.headers.get("Accept") ?? "";
  const type = request.headers.get("Content-Type") ?? "";
  return accept.includes("application/json") || type.includes("application/json");
}

/**
 * JSON `{ok:true}` / `{ok:false,error}` for fetch clients, or a 303 back to the
 * page for native form posts: `?sent=1#sent` or `?error=<code>#form-error`.
 */
export function respond(request: Request, page: FormPage, result: Result, locale: Locale = "en"): Response {
  if (wantsJson(request)) {
    return new Response(JSON.stringify(result), {
      status: result.ok ? 200 : STATUS[result.error],
      headers: { "Content-Type": "application/json; charset=utf-8", ...NO_STORE },
    });
  }
  // Relative to the request so preview deployments redirect to themselves.
  const target = new URL(pagePath(page, locale), request.url);
  if (result.ok) {
    target.searchParams.set("sent", "1");
    target.hash = "sent";
  } else {
    target.searchParams.set("error", result.error);
    target.hash = "form-error";
  }
  return new Response(null, { status: 303, headers: { Location: target.toString(), ...NO_STORE } });
}

export function methodNotAllowed(allow: string): Response {
  return new Response("Method Not Allowed", { status: 405, headers: { Allow: allow, ...NO_STORE } });
}

/** POSTs must come from this deployment or the production site. */
export function isSameOrigin(request: Request, env: Env): boolean {
  const allowed = new Set<string>([new URL(request.url).origin]);
  try {
    allowed.add(new URL(siteUrl(env)).origin);
  } catch {
    // malformed SITE_URL: fall back to the request origin only
  }
  const source = request.headers.get("Origin") ?? request.headers.get("Referer");
  if (!source) return false;
  try {
    return allowed.has(new URL(source).origin);
  } catch {
    return false;
  }
}

export const clientIp = (request: Request) => request.headers.get("CF-Connecting-IP") ?? "";

// ---------- input ----------

export const LIMITS = {
  name: 120,
  phone: 40,
  email: 254,
  short: 120,
  message: 5000,
  consent: 600,
  concerns: 12,
  userAgent: 512,
  url: 2048,
} as const;

/** Trims, strips control characters (keeps tab/newline when multiline) and caps length. */
export function clean(value: unknown, max: number, multiline = false): string {
  if (typeof value !== "string") return "";
  const stripped = multiline
    ? value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    : value.replace(/[\u0000-\u001F\u007F]+/g, " ");
  return stripped.trim().slice(0, max);
}

export const isEmail = (v: string) => v.length <= LIMITS.email && /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]{2,}$/.test(v);

/** At least 7 digits, only phone punctuation otherwise. */
export const isPhone = (v: string) => /^[0-9+().\-\s]{7,40}$/.test(v) && v.replace(/\D/g, "").length >= 7;

const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

/** Escaped text with line breaks kept, for multi-line fields in HTML emails. */
export const escapeHtmlMultiline = (value: unknown) => escapeHtml(value).replace(/\n/g, "<br>");

/** Fills `{key}` placeholders in content strings. */
export const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));

/** Two-column HTML table + plain-text version of the same rows. Values are escaped here. */
export function renderRows(rows: [label: string, value: string][]): { html: string; text: string } {
  const shown = rows.filter(([, v]) => v !== "");
  const html =
    '<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font:15px/1.5 Arial,sans-serif">' +
    shown
      .map(
        ([l, v]) =>
          `<tr><th align="left" valign="top" style="color:#6b6960;font-weight:600;white-space:nowrap">${escapeHtml(l)}</th><td valign="top">${escapeHtmlMultiline(v)}</td></tr>`,
      )
      .join("") +
    "</table>";
  const text = shown.map(([l, v]) => `${l}: ${v}`).join("\n");
  return { html, text };
}

// ---------- consent ----------

export interface ConsentRecord {
  /** Consent wording exactly as submitted with the form. */
  text: string;
  /** Version id of the published wording, or "unrecognized" if the submitted text differs from it. */
  version: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  pageUrl: string;
}

export interface ConsentContent {
  version: string;
  text: string;
  privacyLabel: string;
}

/** The full sentence the visitor ticks (the checkbox value on the page is built the same way). */
export const consentString = (c: ConsentContent) => `${c.text} ${c.privacyLabel}.`;

/**
 * TCPA consent record: wording, time, IP, user agent and the page it was given on.
 * `current` lists the published wordings (English and Spanish); the version is
 * taken from whichever one the submitted text matches, suffixed with the
 * language when it is not the English one.
 */
export function consentRecord(
  request: Request,
  env: Env,
  page: FormPage,
  submitted: string,
  current: ConsentContent | Partial<Record<Locale, ConsentContent>>,
): ConsentRecord {
  const referer = clean(request.headers.get("Referer"), LIMITS.url);
  const published: [Locale, ConsentContent][] =
    "version" in current ? [["en", current as ConsentContent]] : (Object.entries(current) as [Locale, ConsentContent][]);
  const match = published.find(([, c]) => submitted === consentString(c));
  return {
    text: submitted,
    version: match ? (match[0] === "en" ? match[1].version : `${match[1].version}-${match[0]}`) : "unrecognized",
    timestamp: new Date().toISOString(),
    ip: clientIp(request),
    userAgent: clean(request.headers.get("User-Agent"), LIMITS.userAgent),
    pageUrl: referer || siteUrl(env) + pagePath(page, match?.[0] ?? "en"),
  };
}

export const consentRows = (c: ConsentRecord): [string, string][] => [
  ["Consent text", c.text],
  ["Consent version", c.version],
  ["Consent time", c.timestamp],
  ["IP", c.ip],
  ["User agent", c.userAgent],
  ["Page", c.pageUrl],
];

// ---------- spam protection ----------

export async function verifyTurnstile(token: string, ip: string, secret: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("turnstile verify failed", err);
    return false;
  }
}

/**
 * Fixed-window counter in KV. Returns true when the request is allowed.
 * Skipped (always true) when the RATE_LIMIT binding is absent. KV is not
 * atomic, so this is a best-effort brake, not an exact limit.
 */
export async function rateLimit(env: Env, key: string, limit: number, windowSec: number): Promise<boolean> {
  const kv = env.RATE_LIMIT;
  if (!kv) return true;
  try {
    const bucket = Math.floor(Date.now() / 1000 / windowSec);
    const k = `rl:${key}:${bucket}`;
    const count = Number.parseInt((await kv.get(k)) ?? "0", 10) || 0;
    if (count >= limit) return false;
    await kv.put(k, String(count + 1), { expirationTtl: Math.max(60, windowSec * 2) });
    return true;
  } catch (err) {
    console.error("rate limit unavailable", err);
    return true;
  }
}

export interface GuardInput {
  /** `cf-turnstile-response` */
  token: string;
  /** Honeypot field `company`; humans leave it empty. */
  honeypot: string;
  /** `nojs=1`, sent from inside <noscript>. */
  nojs: boolean;
}

export type GuardResult = { pass: true } | { pass: false; result: Result };

/**
 * Bot checks shared by both forms. `pass:false` carries the response to send:
 * a filled honeypot gets a silent success so bots learn nothing.
 *
 * Turnstile policy: a token, when present, must verify. Without a token the
 * request is rejected if REQUIRE_TURNSTILE is "1"; otherwise it is accepted
 * only as a no-JS submission (`nojs=1`) under a stricter rate limit.
 */
export async function guard(request: Request, env: Env, scope: string, input: GuardInput): Promise<GuardResult> {
  const fail = (error: ErrorCode): GuardResult => ({ pass: false, result: { ok: false, error } });

  if (input.honeypot !== "") return { pass: false, result: { ok: true } };

  const ip = clientIp(request) || "unknown";
  if (!(await rateLimit(env, `${scope}:${ip}`, 6, 600))) return fail("rate");

  const required = env.REQUIRE_TURNSTILE === "1";
  if (!env.TURNSTILE_SECRET) {
    // Not configured (local dev / first preview). Never silently open when the clinic asked for enforcement.
    if (required) {
      console.error("REQUIRE_TURNSTILE is set but TURNSTILE_SECRET is missing");
      return fail("server");
    }
    console.warn("TURNSTILE_SECRET is not set: Turnstile verification skipped");
    return { pass: true };
  }

  if (input.token) {
    return (await verifyTurnstile(input.token, clientIp(request), env.TURNSTILE_SECRET)) ? { pass: true } : fail("turnstile");
  }
  if (required || !input.nojs) return fail("turnstile");
  // No-JS fallback: 2 per hour per IP.
  if (!(await rateLimit(env, `${scope}:nojs:${ip}`, 2, 3600))) return fail("rate");
  return { pass: true };
}

// ---------- outbound ----------

export interface Email {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/** Sends through the Resend REST API. Throws on any failure so callers can log it. */
export async function sendEmail(env: Env, email: Email): Promise<void> {
  // Email is optional: the clinic works from the CRM (GoHighLevel), which sends its own
  // notifications. Without a Resend key this is a quiet no-op rather than an error.
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) return;
  if (!email.to) throw new Error("email recipient is empty");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [email.to],
      // Header values must be a single line.
      subject: email.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
      html: email.html,
      text: email.text,
      ...(email.replyTo ? { reply_to: email.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

/** Posts to the CRM webhook. No-op without CRM_WEBHOOK_URL; never throws. */
export async function postWebhook(env: Env, payload: unknown): Promise<void> {
  if (!env.CRM_WEBHOOK_URL) return;
  try {
    const res = await fetch(env.CRM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) console.error(`CRM webhook responded ${res.status}`);
  } catch (err) {
    console.error("CRM webhook failed", err);
  }
}

/** Runs follow-up work, logging failures instead of throwing. */
export async function settle(label: string, task: Promise<unknown>): Promise<void> {
  try {
    await task;
  } catch (err) {
    console.error(`${label} failed`, err);
  }
}

// ---------- signed photo links ----------

const encoder = new TextEncoder();

const hmacKey = (secret: string, usage: "sign" | "verify") =>
  crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [usage]);

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

function fromHex(hex: string): Uint8Array | null {
  if (!/^[0-9a-f]{64}$/.test(hex)) return null;
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) out[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

const signedMessage = (key: string, exp: number) => encoder.encode(`${key}\n${exp}`);

/** HMAC-SHA256 over the object key and expiry (unix seconds), hex encoded. */
export async function sign(secret: string, key: string, exp: number): Promise<string> {
  return toHex(await crypto.subtle.sign("HMAC", await hmacKey(secret, "sign"), signedMessage(key, exp)));
}

/** Constant-time check of a signature made by sign(). Does not check expiry. */
export async function verifySignature(secret: string, key: string, exp: number, sig: string): Promise<boolean> {
  const bytes = fromHex(sig);
  if (!bytes) return false;
  return crypto.subtle.verify("HMAC", await hmacKey(secret, "verify"), bytes, signedMessage(key, exp));
}

export const PHOTO_LINK_TTL_SEC = 7 * 24 * 60 * 60;

/** Photo objects only: leads/{yyyy}/{uuid}/{n}.{ext}. lead.json is never served. */
export const PHOTO_KEY = /^leads\/\d{4}\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/\d{1,2}\.(jpg|png|webp|heic|gif)$/;

/** Short signature: the first 24 hex chars (96 bits) of sign(). Used by the compact link format. */
export async function signShort(secret: string, key: string, exp: number): Promise<string> {
  return (await sign(secret, key, exp)).slice(0, 24);
}

/** Constant-time check of a signature made by signShort(). Does not check expiry. */
export async function verifyShort(secret: string, key: string, exp: number, sig: string): Promise<boolean> {
  if (!/^[0-9a-f]{24}$/.test(sig)) return false;
  const expected = await signShort(secret, key, exp);
  let diff = 0;
  for (let i = 0; i < 24; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

/**
 * Compact photo link: /api/photo/{yyyy}/{uuid}/{n}.{ext}?e={exp}&s={sig}. About 130 characters,
 * with no encoded slashes, so CRM notes and SMS clients keep it in one piece. Served by
 * functions/api/photo/[[path]].ts; the older ?key=&exp=&sig= links stay valid in photo.ts.
 */
export async function signedPhotoUrl(env: Env, key: string, exp: number): Promise<string> {
  if (!env.LINK_SIGNING_SECRET) throw new Error("LINK_SIGNING_SECRET is not set");
  const sig = await signShort(env.LINK_SIGNING_SECRET, key, exp);
  return `${siteUrl(env)}/api/photo/${key.replace(/^leads\//, "")}?e=${exp}&s=${sig}`;
}

// ---------- GoHighLevel API (direct) ----------

const GHL_API = "https://services.leadconnectorhq.com";

export type GhlLead = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Shown as the contact's lead source. */
  source: string;
  tags: string[];
  /** Written as a note on the contact. */
  note: string;
};

/**
 * Pushes a lead straight into GoHighLevel: upserts the contact (deduped by email/phone),
 * writes a note, and attaches the photos to the file-upload custom field so they appear
 * in the contact's documents. No-op without GHL_API_TOKEN + GHL_LOCATION_ID. Never throws;
 * returns the contact id when the upsert succeeded.
 */
export async function ghlPushLead(env: Env, lead: GhlLead, files: File[] = []): Promise<string | undefined> {
  if (!env.GHL_API_TOKEN || !env.GHL_LOCATION_ID) return undefined;
  const headers = { Authorization: `Bearer ${env.GHL_API_TOKEN}`, Version: "2021-07-28" };
  try {
    const up = await fetch(`${GHL_API}/contacts/upsert`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        locationId: env.GHL_LOCATION_ID,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email || undefined,
        phone: lead.phone || undefined,
        source: lead.source,
        tags: lead.tags,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!up.ok) {
      console.error(`GHL upsert responded ${up.status}: ${(await up.text()).slice(0, 300)}`);
      return undefined;
    }
    const contactId: string | undefined = ((await up.json()) as { contact?: { id?: string } }).contact?.id;
    if (!contactId) return undefined;

    if (lead.note) {
      await settle(
        "GHL note",
        fetch(`${GHL_API}/contacts/${contactId}/notes`, {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ body: lead.note }),
          signal: AbortSignal.timeout(10000),
        }).then(async (r) => {
          if (!r.ok) throw new Error(`${r.status}: ${(await r.text()).slice(0, 300)}`);
        }),
      );
    }

    if (files.length && env.GHL_PHOTO_FIELD_ID) {
      const form = new FormData();
      files.forEach((f, i) => {
        const ext = (f.type.split("/")[1] || "jpg").replace("jpeg", "jpg");
        form.append(`${env.GHL_PHOTO_FIELD_ID}_${crypto.randomUUID()}`, f, `smile-${i + 1}.${ext}`);
      });
      const q = new URLSearchParams({ contactId, locationId: env.GHL_LOCATION_ID });
      await settle(
        "GHL photo upload",
        fetch(`${GHL_API}/forms/upload-custom-files?${q}`, {
          method: "POST",
          headers,
          body: form,
          signal: AbortSignal.timeout(30000),
        }).then(async (r) => {
          if (!r.ok) throw new Error(`${r.status}: ${(await r.text()).slice(0, 300)}`);
        }),
      );
    }
    return contactId;
  } catch (err) {
    console.error("GHL push failed", err);
    return undefined;
  }
}
