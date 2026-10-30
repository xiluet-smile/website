# SEO audit notes — fix pass 1 (2026-10-30)

Phase 0 of the "SEO fix & improvement pass (round 1)" brief. The brief was written for an Astro site; this repo is **Next.js 16 (App Router, `output: "export"`)** built into `out/` and deployed on Cloudflare Pages. Astro names in the brief map to: `astro.config` → `next.config.ts`; content collections → `src/content/*.json`; `JsonLd.astro` → `src/components/JsonLd.tsx`; `@astrojs/sitemap` → `src/app/sitemap.ts`; `scripts/check-jsonld.mjs` → `scripts/check-site.mjs` (`npm run check`).

## Where things live

| Topic | Location | State before this pass |
| --- | --- | --- |
| Prices | `src/content/prices.json` (+ `es/prices.json`): four packages with `priceUsd`, the à-la-carte groups, deposit in `site.json` → `depositUsd` | Already the single source. Home cards, cost page cards, fee tables, `OfferCatalog` and `Offer` schema all read from it. Package prices in `nav.json` and in page titles/descriptions are literal strings; `npm run check` verifies every schema price is visible in the HTML. No `$7,999` anywhere; `$6,999` only ever refers to Smile Makeover (20 restorations). The brief's claim that the cost page shows Smile Design at $6,999 was stale. |
| `<head>` | `src/lib/seo.ts` → `pageMetadata()` from `pages.json` / `es/pages.json`: title, description, canonical, hreflang (`en-US`, `es-US`, `x-default` = English), Open Graph | Complete except `og:locale:alternate`. |
| JSON-LD | `src/lib/schema.ts` + `JsonLd.tsx`; one `@graph` per page: `Dentist` (`#dentist`), `WebPage`, `WebSite`, `BreadcrumbList`, plus `FAQPage`, `MedicalProcedure` + `Offer`, `OfferCatalog`, `Person`, `Article`/`MedicalWebPage`, `ImageGallery`, `ContactPage` | Emitted on all 108 routes (the "no JSON-LD on 94 pages" finding in the brief predates the rebuild). Missing fields on `Dentist`: email, hasMap, Maps link in `sameAs`, payment/currency, medicalSpecialty, employee links; on `Person`: honorificSuffix, Dentist additionalType, knowsAbout. |
| i18n pairing | `src/lib/i18n.ts` → `esPaths` (page routes); blog posts pair by `esSlug` in each `src/content/blog/<slug>.json`, registered by `scripts/sync-blog.mjs` | Works for every route; legal pages are English-only on purpose (canonical to EN, no hreflang). A `translationKey` is not needed. |
| Blog index | `src/components/pages/BlogPage.tsx` lists `posts(locale)` = every registered post | 23 EN and 23 ES posts, all listed in both languages (the "12 vs 23" mismatch in the brief is stale). Author byline with photo and doctor link, `reviewedBy`, read-next grid, related treatments and a CTA already exist. |
| Redirects | `scripts/redirects.txt` → `scripts/build-redirects.mjs` → `public/_redirects` (301, with and without trailing slash, no chains, never shadows a live route); `www` → apex in `functions/_middleware.ts` | Every legacy URL in the brief is already mapped (some to a different, deliberately chosen target, see OPEN_ITEMS.md "Migration"). Three rules pointed at `/` (`/palatal-expanders`, `/thank-you`, `/sample-page`). |
| Headers | `public/_headers` | HSTS carried `includeSubDomains`, which the brief forbids (app. and lp. are on other providers). Cache headers for `/_next/static`, `/images`, `/videos`, `/fonts` already long-lived. |
| robots / sitemap | `public/robots.txt` → `Sitemap: https://xiluetsmiledesign.com/sitemap.xml`; `src/app/sitemap.ts` lists every EN/ES route with hreflang alternates and blog `lastmod` | OK; redirected URLs are not in the sitemap. |
| Reviews | `src/content/reviews.json` + `src/components/home/GoogleReviews.tsx` (live feed via `/api/reviews` when `GOOGLE_PLACES_API_KEY` is set) | Five named quotes from the design files (Maria G., Daniel R., Sofia M., Carlos V., Andrea L.) were still rendered and could not be verified against Google. |
| Rating / count | `site.json` + `es/site.json` → `rating` (5.0 · 255) | Already one constant; no date of last update. |
| Media | `Img.tsx` (lazy, async, intrinsic width/height), `LazyVideo.tsx` and `PatientStories.tsx` (`preload="none"`, poster attached only when playing), no `data:` URIs in content | OK. Hero video still streams from the designer's CloudFront URL (open item). |
| Fee disclaimer | Treatment pages (`price.footnote`), most blog posts | Not under the home "What it costs" grid or the cost-page package grid; All-on-X uses a different sentence. Added in this pass, then removed site-wide at Janse's request (2026-10-30), including the treatment-page footnotes and articles. |
| Titles / descriptions | `pages.json`, `es/pages.json`, blog `seoTitle` | 43 EN and 33 ES routes had titles over 60 chars (some over 85); ~20 descriptions outside 110–160. |
| Home H1 | `pages.json` → `/` → `h1` | Contained the 🏝️ emoji inside the heading text (the hero eyebrow in `home.json` carries it too). |
| "All answers →" | `TreatmentPage.tsx` | Linked to `/contact` from beside the FAQ accordion. |
| `npm run build` (before) | exit 0, no warnings; `npm run check`: 54 EN + 54 ES routes passed | — |

## Brief items judged not applicable (and why)

- **Pricing TypeScript module (1.1)**: `prices.json` already is the typed single source (it is imported with types in `content-i18n.ts`); converting the few literal prices in `nav.json`/`pages.json` to templates adds a build step for no reader-visible change. The checker now fails on `$7,999` and on "Smile Design … $6,999" instead.
- **"$174 a month" wording (1.1)**: no page shows that figure any more. Blog posts show "$5,999 over 48 months at 9% APR ≈ $149 a month" with the lender wording; the financing page shows no monthly figure and already carries "Financing is provided by third-party lenders, subject to credit approval. Terms vary by partner."
- **Phase 2 `/porcelain-veneers-miami` and `/es/carillas-de-porcelana-miami`**: these URLs were merged into `/smile-design-miami` on 2026-10-11 (one 20-veneer package, see OPEN_ITEMS.md "Treatments") and both 301 there. Re-creating them would split one topic across two pages; the documented fallback if "veneers miami" rankings stall is a material article. Left for Janse to decide; not built.
- **Phase 2 `/zirconia-veneers`**: candidate for a later content pass; two zirconia articles already exist and are internally linked. Not built.
- **Phase 2 city pages**: the brief itself requires ≥700 unique, true words per city plus a city-specific story; most cities have no story and no verified flight/hotel facts. Not built, to avoid doorway pages.
- **Lighthouse before/after**: not run in this pass (no rendering changes; the only perf-relevant change is the HSTS header). Numbers from the 2026-10 launch review are in OPEN_ITEMS.md.
- **Search Console 404 export**: needs Janse (see TODO list in the report).
