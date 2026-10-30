# SEO pass 2 — porcelain veneers, zirconia, out-of-state hub and city pages (2026-10-30)

Branch `claude/seo-pass-2-e47209` off `main` (after PR #1). Eight new routes in each language, one expanded hub, two treatment-page cross-links, redirect changes. `npm run build` and `npm run check` pass (62 English + 62 Spanish routes).

## New URLs

Word counts are the visible text inside `<main>` of the built HTML, header and footer excluded (the hub was 420 words before this pass). The treatment pages include the shared glossary, material and price sections.

| English URL | words | Spanish URL | words |
| --- | ---: | --- | ---: |
| `/porcelain-veneers-miami` | 2871 | `/es/carillas-de-porcelana-miami` | 3161 |
| `/zirconia-veneers` | 3081 | `/es/carillas-de-zirconia` | 3476 |
| `/out-of-state-patients` | 1464 | `/es/pacientes-de-otros-estados` | 1647 |
| `/veneers-atlanta` | 1383 | `/es/carillas-atlanta` | 1613 |
| `/veneers-houston` | 1449 | `/es/carillas-houston` | 1660 |
| `/veneers-dallas` | 1439 | `/es/carillas-dallas` | 1658 |
| `/veneers-new-york` | 1488 | `/es/carillas-nueva-york` | 1677 |
| `/veneers-orlando` | 1478 | `/es/carillas-orlando` | 1685 |
| `/veneers-tampa` | 1390 | `/es/carillas-tampa` | 1579 |

## What was built

### `/porcelain-veneers-miami` + `/es/carillas-de-porcelana-miami`
Veneers as a treatment, distinct from the 20-veneer Smile Design package. Rendered by `TreatmentPage` from `src/content/treatments/porcelain-veneers.json` (+ `es/`), with two additions to the component used by every treatment page:
- `sections[]`: prose sections with `[text](href)` links, bullet cards and link pills; `{price}`, `{veneerPrice}`, `{warrantyYears}`, `{replyHours}`, `{depositUsd}` are filled from `prices.json`/`site.json` so no dollar figure lives in the copy. Also applied to the price block and the FAQ answers (accordion and `FAQPage` schema share the filled strings).
- `crossLink`: a link under the candidates grid. Smile Design → "Just want veneers, not a full design? →"; veneers → "Want all 20 planned as one design? →"; zirconia → the veneers page.
- A `veneerPrice` hero stat kind ($1,000 from the "Veneer" line of the à-la-carte list).

Covers: what a veneer is (and that it is not a crown); candidacy and the three "not yet" cases (active gum disease, bruxism without a guard, large fillings/root-canal teeth) plus missing teeth; 8 vs 10 vs 20 with the per-tooth arithmetic; zirconia vs e.max vs composite (and Lumineers) linking the three comparison articles and the zirconia page; 0.3 mm and what no-prep really means; care and lifespan; the visit-by-visit week linking the out-of-state hub; cost ($1,000 à la carte vs $5,999 for 20); results carousel (`caseTypes: ["Veneers"]`, 57 consented cases, 12 shown); six doctor-attributed FAQs; `MedicalProcedure` + `Offer` schema. In the Treatments nav and footer. Blog articles tagged `porcelain-veneers` show in "Guides from the doctors" (guide, how-long, composite-vs-porcelain, who-is-a-candidate, both zirconia articles).

### `/zirconia-veneers` + `/es/carillas-de-zirconia`
Material page on the same component, opted into the shared "The material" section (which already carries the zirconia vs e.max table). Sections: what zirconia is; translucency grades (3Y/4Y/5Y, multilayer); strength vs lithium disilicate and thickness; how a veneer is finished in the on-site lab (from `lab.json`); when e.max is the better pick; cost (same package, no material upcharge). Linked from the veneers page, from `/custom-lab` (new link pills under the lab facts, `lab.json` → `links`) and from both zirconia articles (`related`).

### `/out-of-state-patients` hub (+ ES)
`src/content/out-of-state.json` gained `intro`, `fromHome` (six steps from photos to booking flights), `travel` (what the clinic does and does not arrange: hotel list sent, partner rate, rides and hotels booked by the patient, 15 min from MIA, free parking), `pack`, `companions`, and the `cities` grid; two FAQs added ("Can I fly home the same day as delivery?", "Do you arrange the hotel or the rides?"). `OutOfStatePage.tsx` renders the new sections; the existing week and perks are unchanged.

### Six city pages (+ ES)
`src/content/cities/<city>.json` rendered by the new `CityPage.tsx`: hero with breadcrumb Home / Out of State / Veneers City; three intro paragraphs; "Getting here" (nonstop time, carriers, airport-to-clinic, drive/train); a sample Mon–Thu itinerary with departure and return times; the city's consented clip from `stories.json` (Atlanta story-17, Houston story-24, Dallas story-21, New York story-28 from Pennsylvania, Orlando story-25; Tampa hidden); "What it costs to come" (package and à-la-carte prices from `prices.json`, deposit from `site.json`, hotel "partner rate, 20% off", flights and rides "booked by you", no dollar figures for travel); a veneers results carousel (9 cases); six city-specific FAQs with doctor bylines; the shared photo CTA. Linked from the hub grid and from a new "Out of State" footer column (`nav.json`, the Footer grid gained one column); not in the main nav.

## Redirects (`scripts/redirects.txt`)
- Removed: `/porcelain-veneers-miami → /smile-design-miami` and `/es/carillas-de-porcelana-miami → /es/diseno-de-sonrisa-miami` (live routes again).
- Changed: `/porcelain-veneers` and `/lumineers` now 301 to `/porcelain-veneers-miami` (were → `/smile-design-miami`).
- Unchanged: `/smile-design-candidates → /smile-design-miami`, `/composite-veneers → /blog/composite-vs-porcelain-veneers-vs-lumineers`.

## Every `TODO(janse)`
1. **Hotel partner rate** (`src/content/out-of-state.json` → `todo`; OPEN_ITEMS.md): how patients access the Hilton/Marriott 20% rate (code, link, via coordinator) and the three hotel names are unconfirmed. Copy says "you book directly; we send the list with your estimate".
2. **Tampa story** (`src/content/cities/tampa.json` → `todo` and `story.todo`): no consented Tampa/St. Petersburg clip; the story section is hidden on `/veneers-tampa` and `/es/carillas-tampa`.
3. **Flight facts** (OPEN_ITEMS.md): carriers and nonstop times are general knowledge as of October 2026; confirm with the airlines' schedules. No fares anywhere.

Patient quotes already live on the site and reused as-is: story-24 ("…the best decision of my life") on the Houston page and story-25 ("Best of all, it feels natural") on the Orlando page contain the word "best" in the patients' own words; `npm run check` only notes soft words, and no clinic copy in this pass uses best/top/permanent.

## Post-deploy: request indexing in Search Console (in this order)
1. `https://xiluetsmiledesign.com/porcelain-veneers-miami`
2. `https://xiluetsmiledesign.com/zirconia-veneers`
3. `https://xiluetsmiledesign.com/out-of-state-patients`
4. `https://xiluetsmiledesign.com/veneers-atlanta`
5. `https://xiluetsmiledesign.com/veneers-houston`
6. `https://xiluetsmiledesign.com/veneers-dallas`
7. `https://xiluetsmiledesign.com/veneers-new-york`
8. `https://xiluetsmiledesign.com/veneers-orlando`
9. `https://xiluetsmiledesign.com/veneers-tampa`
10. `https://xiluetsmiledesign.com/smile-design-miami` (new cross-link) and `https://xiluetsmiledesign.com/custom-lab` (new links)
11. The Spanish twins: `/es/carillas-de-porcelana-miami`, `/es/carillas-de-zirconia`, `/es/pacientes-de-otros-estados`, `/es/carillas-atlanta`, `/es/carillas-houston`, `/es/carillas-dallas`, `/es/carillas-nueva-york`, `/es/carillas-orlando`, `/es/carillas-tampa`
12. Resubmit `https://xiluetsmiledesign.com/sitemap.xml`. Then check that `/porcelain-veneers/` and `/lumineers/` return 301 to the veneers page on the preview before merging.
