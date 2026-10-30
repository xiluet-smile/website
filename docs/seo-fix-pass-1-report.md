# SEO fix pass 1 — report (2026-10-30)

Branch `seo/fix-pass-1`. The brief assumed an Astro site with no structured data, a blog index missing posts and wrong prices on the cost page; the audit (`docs/seo-audit-notes.md`) found a Next.js static export that already had JSON-LD on every route, a complete redirect map, hreflang both ways, a single price source and a post-build checker. This pass applies only what was still missing or wrong. Nothing was deployed; Cloudflare builds the PR preview.

## What changed

**Compliance and head**
- Minimum-fee disclaimer: the pass added it under the home and cost-page package grids and on All-on-X; Janse asked for that addition to be removed (2026-10-30), so those three places are back to their previous wording. The sentence still appears on the Smile Design, Smile Makeover and Full Mouth pages and in several articles, as before. Florida's dental advertising rule expects advertised fees to say whether they are minimums; if the clinic wants it off everywhere, say so and the treatment-page footnotes change too.
- `og:locale:alternate` added for the paired language on every non-legal page.
- Home `<h1>` no longer contains the 🏝️ emoji (it stays in the hero eyebrow).
- "All answers →" (which linked to /contact from beside the FAQ) removed from the four treatment pages.
- One Spanish article heading and sentence said "todo incluido"; reworded to "con todos los gastos".

**Titles and descriptions** (`pages.json`, `es/pages.json`, blog `seoTitle`): every route now has a title ≤ 60 characters and a description of 110–160 characters, both languages, 108 routes. Key titles follow the brief: `Smile Design Miami | 20 Porcelain Veneers $5,999 | Xiluet`, `Veneers Cost in Miami 2026 | Full Price List | Xiluet`, `Smile Makeover Miami | Crowns, Bridges & Veneers | Xiluet`, `Full Mouth Reconstruction Miami | 28 Units $10,000 | Xiluet`, `All-on-X Dental Implants Miami | $10,000 Per Arch | Xiluet`, `Veneers in Miami for Out-of-State Patients | Xiluet Smiles`, `Veneer Financing & Payment Plans | 6 Lenders | Xiluet Smiles`. H1s and article titles are unchanged.

**Structured data** (`src/lib/schema.ts`)
- `Dentist` gains `alternateName`, `email`, `hasMap`, the Maps place link in `sameAs`, `availableLanguage`, `currenciesAccepted`, `paymentAccepted`, `medicalSpecialty`, and `employee` → the three DMDs' `Person` `@id`s (Edgar Castaños is not listed as a dentist).
- Doctor `Person` nodes gain `honorificSuffix "DMD"`, `additionalType Dentist` and `knowsAbout` (their listed focus). The manager keeps his job title only.

**Reviews**: the five unverified design placeholders (Maria G., Daniel R., Sofia M., Carlos V., Andrea L.) are gone. The home section shows the Google rating, "Leave a review" and "Read all on Google" and renders quotes only from `src/content/reviews.json` (verbatim Google reviews, optional `lang`) or the live Places feed. `site.json` → `rating` now records `updated: 2026-10-30`.

**Blog**: posts show "Published <date>" and, when different, "· Updated <date>". The index already listed all 23 EN and 23 ES posts; author box, reviewer, read-next and treatment links already existed.

**Redirects** (`scripts/redirects.txt` → generated `public/_redirects`): no rule lands on the homepage any more. `/palatal-expanders` → `/blog/veneers-vs-crowns-vs-invisalign`, `/thank-you` → `/contact`, `/sample-page` removed (404). Every legacy URL in the brief was already mapped; where the repo chooses a different target (dentures → All-on-X, services → cost page, frenectomy → contact) it follows decisions logged in `OPEN_ITEMS.md`. `/porcelain-veneers/` keeps pointing at `/smile-design-miami` because the veneers page was merged there on 2026-10-11. The full map is `scripts/redirects.txt`; `www` → apex is `functions/_middleware.ts`.

**Headers**: `Strict-Transport-Security` no longer carries `includeSubDomains` (app. and lp. subdomains are served by other providers). `nosniff`, long cache for `/images/*`, `/videos/*`, `/fonts/*` and `/_next/static/*` were already there.

**Checker** (`npm run check`, runs after `npm run build`): now also fails on title > 60, description outside 110–160, banned advertising words inside `<main>` (guaranteed, painless, pain-free, all-inclusive, stain-proof, #1 and the Spanish equivalents), `$7,999` anywhere, "Smile Design" next to `$6,999`, any internal link to a URL in `_redirects`, missing `og:locale:alternate`, and now checks hreflang on the English side too (the Spanish side was already checked). It reports, without failing, how often best/top/permanent appear (104 uses, all in neutral wording such as "on top", "permanent denture", "the best plan for…").

## Results

- `npm run build`: exit 0, no warnings (before and after).
- `npm run check`: ✓ 54 English + 54 Spanish routes passed.
- `npm run lint`: 0 errors (1 pre-existing warning about `<img>` in `LazyVideo.tsx`).
- `tsc --noEmit`: clean.
- Lighthouse: not run in this pass; nothing rendered above the fold changed. Launch numbers are in `OPEN_ITEMS.md`.

## Not done (needs a decision or data from Janse)

- **TODO(janse): real reviews.** Paste verbatim Google reviews into `src/content/reviews.json` (name as on Google, month, treatment, text, `lang`). Until then the section shows rating + links only. Or set `GOOGLE_PLACES_API_KEY` / `GOOGLE_PLACE_ID` on the Pages project for the live feed.
- **TODO(janse): confirm www → non-www.** `functions/_middleware.ts` 301s `www.` to the apex, but only if `www.xiluetsmiledesign.com` is attached to the Pages project. Check Cloudflare → Pages → Custom domains, or add a Redirect Rule (Rules → Redirect Rules) if it is not.
- **TODO(janse): Search Console "Not found (404)" export.** Send it and any URL not in `scripts/redirects.txt` gets mapped to the closest topical page.
- **TODO(janse): GBP website field** should be `https://xiluetsmiledesign.com` (non-www).
- **Phase 2 pages not built**: `/porcelain-veneers-miami` (+ES) conflicts with the 2026-10-11 merge into Smile Design; `/zirconia-veneers` (+ES) and the six city pages need real city facts and stories (only Atlanta, Dallas, Houston, Orlando and PA/NY have clips). Say which, if any, you want and they become a content pass of their own.
- Geo coordinates were already in `site.json` (25.7616318, -80.3312765); no TODO needed.

## Post-deploy checklist

1. Merge the PR and let Cloudflare Pages deploy.
2. Search Console → Sitemaps → resubmit `https://xiluetsmiledesign.com/sitemap.xml`; URL Inspection → Request indexing for `/`, `/veneers-cost-miami`, `/smile-design-miami`, `/smile-makeover-miami` and their `/es/` twins (titles changed).
3. Rich Results Test on `/`, `/smile-design-miami`, `/veneers-cost-miami`, `/doctors/dr-roger-ramos-navarro` and one blog post; fix anything flagged.
4. Re-run the Semrush Site Audit on the new build and schedule it weekly.
5. Update `src/content/site.json` and `es/site.json` → `rating` (value, count, updated) monthly.
