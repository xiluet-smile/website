# Open items

Things the design files leave unresolved. Each is marked `TODO(clinic)` in the code or content where it applies. Nothing here was invented to fill a gap; placeholders were left out instead.

## Facts that contradict each other in the designs (pick one)
- **Google rating and review count:** resolved — 5.0 · 248 (`site.json` → `rating`). Update the count when it changes, or connect the live reviews.
- **Reply-time promise:** resolved — 6 hours everywhere.
- **Airport distance:** resolved — 15 minutes from MIA everywhere.
- **Days in Miami.** Home copy mixes "4 business days", "3 visits", "one week" and package cards say "Delivery in 5 business days".
- **Cost financing band:** "From about $149 a month for 20 veneers" with the example "$5,999 over 48 months at 9% APR" (the arithmetic matches: $149.31). The 9% APR is illustrative; replace with a real partner rate if the clinic prefers.
- **Reviews footnote.** "Reviews from Google, Healthgrades and RealSelf." vs the hero's "Reviews as published on Google".
- **Schema `priceRange`.** Design JSON-LD says `$$`, SEO.md says `$$$`. Using `$$`.
- **Sunbit.** "30 sec" decision time in the facts vs "under a minute" in the H1.
- **CareCredit.** "over $200" (card note) vs "$200 or more" (intro). The shared hero note "Soft credit check. Does not affect your score." also appears on CareCredit, a credit card whose full application is normally a hard inquiry.
- **Old `/contact-us/` URL** redirects to `/free-photo-evaluation` (per `redirects.txt`), not to the new `/contact` page.

## Placeholders in the designs (not rendered)
- **Patient video stories** ("In their own words" on Home and on each doctor profile): built and wired (`src/components/home/PatientStories.tsx`), hidden while `src/content/stories.json` is empty. Four clips from the clinic's Instagram reels are live (sources in `stories.json`) with "Xiluet patient" instead of names, quotes transcribed from the patients' own words (story-1 has no speech, so it shows a clinic caption), and treatments taken from the video/caption. Pending from the clinic: patient names, exact treatments, and website-release confirmation for each. Story-4 was sent as Dr. Ramos but the patient names Dr. Alonso on camera and the video is captioned "Dr. Alonso", so it is attributed to Dr. Alonso; confirm. Format in `src/content/stories.README.md`.
- **Home review cards** are placeholders; Home shows the first four reviews from the Reviews page instead.
- **Reviews page, sixth card** is a placeholder; omitted. The five named reviews (Maria G., Daniel R., Sofia M., Carlos V., Andrea L.) must be verified against Google, and the design intends a Google Business Profile feed. No `Review`/`AggregateRating` schema is emitted until then.
- **Home FAQ "How does the 5-year warranty work?"** has `[covered items]` in its answer; omitted. Warranty terms needed. The Home links "How the 5-year warranty works" and "All answers" have no target page and are omitted.
- **Home doctor cards** show `[Credential line]`; using each doctor's focus line from the Doctors page.
- **Home in-house lab photo** is an empty slot in the design; using the supplied AI editorial image `gen-ceramist-hands.jpg`. Replace with a real lab photo.
- **Dr. Marta Puentes Marrero's education**: "Degree in Dentistry" lists the institution as just "Spain".
- **Blog**: six draft titles with no articles. Cards are shown without links; no `Article` schema.
- **Legal pages**: Privacy Policy, Terms, Notice of Privacy Practices, Refund and Cancellation have no designs or copy; footer links point to `#` (`src/content/nav.json` → `legal`).
- **Spanish**: the EN | ES switch is in the design but /es/ is phase 2; the ES link points to `#`.

## Forms (copy and behaviour not in the designs)
- **Photo limit.** The design says "Up to 10 photos"; STACK.md says 8 (10 MB each). The site and the function use 8 (`src/content/lead-form.json` → `limits`).
- **Photos are optional** (README), so the design's disabled "Add at least one photo to send" button state is not used.
- **Error messages** for both forms are not in the designs; the strings under `errors` in `lead-form.json` and `contact.json` were written for the build and need sign-off.
- **"Notes (optional)"** field label: STACK.md lists a `notes` field but the design has no such input.
- **`origin` field**: STACK.md does not define it; implemented as a hidden lead-source field (the page the visitor came from). Change if it was meant to be the patient's city or state.
- **Consent text** links to the Privacy Policy, which does not exist yet.
- **Autoresponder email** uses only the design's confirmation wording: subject "Sent. A doctor is reviewing your smile."; body "You will hear from us by text first, then email, within 6 hours during office hours (Mon–Fri 9am–5pm ET)." The "by text first" promise needs an SMS provider or a person texting.
- **Bot protection vs no-JavaScript.** Turnstile cannot run without JavaScript. Submissions without a token are accepted only from the no-JS form path, with an empty honeypot and a stricter rate limit. Set `REQUIRE_TURNSTILE=1` to refuse them (the no-JS form then stops working).
- **Contact page JSON-LD** keeps the site-wide Dentist/WebPage/WebSite nodes; the design's contact block used a slightly different Dentist node (`$$$`, extra `contactPoint`/`hasMap`) that contradicts the other 23 pages.

## Added after launch review (need clinic input)
- **Referrals and Partnerships pages** (`/referrals`, `/partnerships`): no design or copy existed. The text in `src/content/referrals.json` is a neutral placeholder built only from facts already on the site; the $500 bonus per completed treatment is confirmed; how it is paid (credit toward treatment, check, other) is not stated. Partner types to list still need confirming.
- **Live Google reviews** need a Places API key and the practice Place ID (`GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`, and `google.placeId` in `site.json`). Until set, Home shows the stored reviews and the "Leave a review" button opens the Google Maps listing.
- **Google Tag Manager** is switched off until launch (`site.json` → `gtmId` is empty; set it to `GTM-PSP4L6TC` in both `site.json` and `es/site.json` to re-enable; the loader and CSP are already in place). The LeadConnector chat widget stays on. The container loads GA4, Google Ads and the Facebook pixel, which cost 1.5–2 s of main-thread time on a throttled phone.

## Spanish site (/es)
- **Native review:** done by the clinic (October 2026). Interface strings live in `src/lib/ui-i18n.ts`, content in `src/content/es/`.
- **Legal documents stay in English** on `/es/politica-de-privacidad`, `/es/terminos`, `/es/aviso-de-practicas-de-privacidad` and `/es/reembolsos-y-cancelaciones`, with a Spanish note above them. A lawyer-reviewed Spanish version can replace the English text later.
- **Google reviews** are shown as written (English) on both sites.
- **404 page** is served in English for both sites (Cloudflare serves one static 404).
- **Doctor names** keep "Dr." in Spanish structured fields (nav, headings, bylines); "Dra." would be the natural form for Dr. Puentes and Dr. Alonso. Change `name`/`shortName` in `src/content/es/doctors.json` and the FAQ `doc` fields together if wanted.

## Blog (/blog, /es/blog)
- **Articles need doctor review before launch.** Each JSON in `src/content/blog/` (EN) and `src/content/es/blog/` (ES) names an `author` and a `reviewedBy` doctor; both appear on the page and in the Article schema, so the named doctors should read and approve their articles. Clinical statements come from published sources that are linked inline (PMC systematic review, Wiley/JERD enamel study, BDA survey, Cleveland Clinic, CareCredit/Synchrony study).
- **Market prices are dated October 2026.** Competitor ranges ("$900–$2,500 per tooth", "$8,000–$14,000 per set", "$5,300–$6,800 abroad") were read from Miami practice websites and dental-tourism sites in October 2026 and are described as such. Re-check them when `dateModified` is bumped. No competitor is named.
- **Specific statements for the doctors to confirm or cut** (flagged by the writers): enamel on the front of a tooth "roughly 1 to 2 mm thick" (do-veneers-ruin-your-teeth, uncited); crown prep "60 to 70% of the tooth" and prep depths "0.5–0.7 mm traditional / 0.3–0.5 mm minimal-prep" (cited to practice blogs, not peer-reviewed); "91% at 20 years" (secondary source for Layton & Walton); the PMC7961608 failure breakdown (fracture 154 / debonding 85 / caries 8 / endo 16; most failures within ~2 years) taken from a summary, not the full text; shade rule "no whiter than the whites of your eyes"; "the ceramist remakes a chipped veneer with the original design and shade on file" (how-long-do-porcelain-veneers-last — inferred from the in-house lab, not a stated clinic fact); generic aftercare advice (six-month checkups, do not superglue a debonded veneer, thin custom night guard, choose shade in daylight).
- **Adding an article:** drop `<slug>.json` in both folders and run `npm run blog` (also runs in `npm run dev` / `npm run build`); routes, hreflang, sitemap, page metadata and the treatment-page "Guides from the doctors" block pick it up from `treatments[]`.

- **Credential logos**: ADA, Florida Dental Association and AGD show their official logos on the doctor pages. The **AACD member logo** is only available to members (aacd.com → member portal → Marketing tools); download it and drop it in `src/assets/logo-aacd.png`, then add it to `certLogos` in `src/components/DoctorProfile.tsx`. Same for the AAE (Dr. Ramos) if wanted.

## Migration
- **Old service pages without an equivalent** (gum lightening, orthodontics, dentures, crowns, root canals, oral surgery, etc.) 301 to the closest new page (`public/_redirects`). Search Console shows real demand for **gum depigmentation / gum lightening in Miami**; a dedicated page (with the clinic's price and copy) would keep that traffic instead of redirecting it to Smile Makeover.
- **Dr. Adriana Hernandez** is no longer with the practice (clinic, October 2026); her old profile URL redirects to /doctors.
- **Frenectomy**: the old `/frenectomy/` page ranks #2 for "frenectomy miami" (472 impressions); it currently redirects to /contact. A dedicated page (price and copy from the clinic) would keep that ranking.
- **Live reviews**: the Place ID is set in `site.json`; the Pages project still needs `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` for the live feed.

## Lender claims to confirm against merchant agreements (rendered verbatim)
- **Cherry**: $200 to $30,000; 3 to 60 months; 0% APR options for qualified patients; "approving around 75 percent of applicants"; no early-payoff penalty; no hard pull.
- **Sunbit**: "approves about 9 in 10 applicants" / "~90%"; decision in 30 sec / under a minute; no late, origination or prepayment fees; terms up to 72 months.
- **CareCredit**: accepted at over 200,000 locations; promotional financing from $200; 6 to 24 month no-interest periods if paid in full; deferred-interest wording.
- **LendingClub**: loans up to $65,000; fixed rate; 24 to 84 months; no prepayment penalty; origination fee deducted from the loan; hard inquiry only on acceptance.
- **Affirm**: 0 to 36 percent APR; 3 to 36 months; no late or hidden fees.
- **Financing index**: "All five partners pre-qualify with a soft check"; "Most patients qualify with at least one partner".
- **All-on-X**: price per arch ($10,000, $9,000 cash) and whether surgery is in-house (README open item).

## Assets and services not supplied
- **Hero video** loads from the designer's CloudFront URL (`site.json` → `videos.hero`). Upload to Cloudflare Stream and replace; update `media-src` in `public/_headers`.
- **Out-of-state video** (`miami-arrival.mp4`) is not in the repo per STACK.md; the poster image shows until a URL is set in `site.json` → `videos.miamiArrival`.
- **CRM endpoint** for leads (`CRM_WEBHOOK_URL`) is not specified.
- **SMS autoresponder**: no provider specified; only the email autoresponder is implemented.
- **Hero poster image**: the hero video has no poster, so the Home hero shows the dark teal background until the video starts (about 2 seconds after load, longer on slow connections). This is what keeps Home at 88–89 on Lighthouse mobile performance (Speed Index); every other page is 90+. Supply a still of the video's first frame (1920×1080) and it can be shown immediately.
- **Case captions**: the Full Mouth Reconstruction page captions case BA13 "Full mouth reconstruction", while the Results page files BA13 (and BA9) under other types. Confirm the treatment for each case.

## Build decisions worth knowing
- Schema `logo`/`image` URLs point to `/og/…` (real files in the build) rather than the design's `/assets/…` paths, which do not exist in production.
- The Cost page emits an `OfferCatalog` with all four priced packages (SEO.md says three; the design shows four).
- Results cards on every page use one 13:16 crop with the full disclaimer "Actual Xiluet patient. Individual results vary."
- Web fonts use `font-display: swap` with metric-matched fallback fonts. On a slow first visit text can still re-wrap slightly when the fonts arrive; switching the body font to `font-display: optional` in `src/app/globals.css` would remove that entirely at the cost of some first visits seeing the fallback font.
- FAQ accordions use the native `<details>` element (one open at a time, all answers in the HTML, no JavaScript).
- The Home financing section is a grid (as drawn in the design), not a carousel.

- **Before/after photos BA16–BA19 (added 2026-10-07)** come from the clinic's public Instagram posts (Dd_8l3fxVGC, Dd9oCr8xTO8, DeHpu28nGXJ slide 2, Dd2LW_VRsiN). Confirm each patient's written photo release covers the website, and tell us if any case should be reassigned to another doctor or treatment type (currently: Alonso → BA16, BA19 Veneers; Ramos → BA17 All-on-X; Puentes → BA18 Restorations).
