// GET /api/photo?key=…&exp=…&sig=…: serves one patient photo from R2 to the
// holder of a signed, unexpired link (sent to the clinic inbox by /api/lead).
import { type Env, PHOTO_KEY, methodNotAllowed, verifySignature } from "./_shared";

const PRIVATE = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

const deny = (status: 403 | 404) =>
  new Response(status === 403 ? "Forbidden" : "Not Found", {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", ...PRIVATE },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const params = new URL(request.url).searchParams;
    const key = params.get("key") ?? "";
    const expRaw = params.get("exp") ?? "";
    const sig = params.get("sig") ?? "";

    if (!env.LINK_SIGNING_SECRET || !env.R2_PHOTOS) {
      console.error("photo endpoint is not configured");
      return deny(403);
    }
    if (!PHOTO_KEY.test(key) || !/^\d{9,11}$/.test(expRaw)) return deny(403);
    const exp = Number(expRaw);
    // Verify the signature before looking at expiry or the bucket, so nothing leaks to unsigned requests.
    if (!(await verifySignature(env.LINK_SIGNING_SECRET, key, exp, sig))) return deny(403);
    if (exp < Math.floor(Date.now() / 1000)) return deny(403);

    const object = await env.R2_PHOTOS.get(key);
    if (!object) return deny(404);

    const ext = key.slice(key.lastIndexOf(".") + 1);
    return new Response(object.body, {
      headers: {
        "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
        "Content-Length": String(object.size),
        "Content-Disposition": `inline; filename="photo.${ext}"`,
        // Never execute anything from this origin, whatever the bytes are.
        "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
        ...PRIVATE,
      },
    });
  } catch (err) {
    console.error("photo handler failed", err);
    return deny(404);
  }
};

export const onRequest: PagesFunction<Env> = async () => methodNotAllowed("GET");
