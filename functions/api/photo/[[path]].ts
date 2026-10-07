// GET /api/photo/{yyyy}/{uuid}/{n}.{ext}?e=…&s=…: compact signed photo link (see signedPhotoUrl).
import { type Env, PHOTO_KEY, methodNotAllowed, verifyShort } from "../_shared";

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

export const onRequestGet: PagesFunction<Env> = async ({ request, env, params }) => {
  try {
    const url = new URL(request.url);
    const segments = Array.isArray(params.path) ? params.path : params.path ? [String(params.path)] : [];
    const key = `leads/${segments.join("/")}`;
    const expRaw = url.searchParams.get("e") ?? "";
    const sig = url.searchParams.get("s") ?? "";

    if (!env.LINK_SIGNING_SECRET || !env.R2_PHOTOS) {
      console.error("photo endpoint is not configured");
      return deny(403);
    }
    if (!PHOTO_KEY.test(key) || !/^\d{9,11}$/.test(expRaw)) return deny(403);
    const exp = Number(expRaw);
    if (!(await verifyShort(env.LINK_SIGNING_SECRET, key, exp, sig))) return deny(403);
    if (exp < Math.floor(Date.now() / 1000)) return deny(403);

    const object = await env.R2_PHOTOS.get(key);
    if (!object) return deny(404);

    const ext = key.slice(key.lastIndexOf(".") + 1);
    return new Response(object.body, {
      headers: {
        "Content-Type": object.httpMetadata?.contentType ?? "application/octet-stream",
        "Content-Length": String(object.size),
        "Content-Disposition": `inline; filename="photo.${ext}"`,
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
