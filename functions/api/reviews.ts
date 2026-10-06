// GET /api/reviews — live Google rating and latest reviews for the Home page.
// Reads Google Places API (New) with the practice's Place ID and caches the
// result at the edge for 6 hours so the Places quota is barely touched.

type Env = { GOOGLE_PLACES_API_KEY?: string; GOOGLE_PLACE_ID?: string };

type PlaceReview = {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  googleMapsUri?: string;
};

const CACHE_SECONDS = 6 * 60 * 60;

const json = (body: unknown, status = 200, cache = `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}`) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": cache, "x-robots-tag": "noindex" },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const { GOOGLE_PLACES_API_KEY: key, GOOGLE_PLACE_ID: placeId } = env;
  if (!key || !placeId) return json({ ok: false, error: "not-configured" }, 503, "no-store");

  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/reviews", request.url).toString(), { method: "GET" });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const upstream = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
    },
  });
  if (!upstream.ok) {
    console.error("places api", upstream.status, await upstream.text());
    return json({ ok: false, error: "upstream" }, 502, "no-store");
  }
  const place = (await upstream.json()) as { rating?: number; userRatingCount?: number; reviews?: PlaceReview[]; googleMapsUri?: string };

  const body = {
    ok: true,
    rating: place.rating ?? null,
    count: place.userRatingCount ?? null,
    url: place.googleMapsUri ?? null,
    writeReviewUrl: `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`,
    reviews: (place.reviews ?? [])
      .filter((r) => (r.rating ?? 0) >= 4 && (r.text?.text || r.originalText?.text))
      .map((r) => ({
        name: r.authorAttribution?.displayName ?? "Google user",
        rating: r.rating ?? 5,
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
        when: r.relativePublishTimeDescription ?? "",
        time: r.publishTime ?? "",
        url: r.googleMapsUri ?? null,
      })),
    fetchedAt: new Date().toISOString(),
  };
  const res = json(body);
  await cache.put(cacheKey, res.clone());
  return res;
};

export const onRequest: PagesFunction<Env> = async (ctx) =>
  ctx.request.method === "GET" ? onRequestGet(ctx) : new Response("Method not allowed", { status: 405, headers: { allow: "GET" } });
