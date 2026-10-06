# Open items

Things the design files leave unresolved. Each is marked `TODO(clinic)` in the code or content where it applies. Nothing here was invented to fill a gap; placeholders were left out instead.

## Facts that contradict each other in the designs (pick one)
- **Google rating and review count.** Site uses the design's 5.0 · 236 (`src/content/site.json` → `rating`); the live site says 4.9 · 500+.
- **Reply-time promise.** Footer, Free Photo Evaluation, Financing, Cost and SEO copy say "within 6 hours" (`site.json` → `replyHours`); the Home how-it-works step and Home final CTA say "within 12 hours". Kept verbatim.
- **Airport distance.** Home says "20 minutes from MIA"; Clinic and the SEO description say "15 minutes".
- **Days in Miami.** Home copy mixes "4 business days", "3 visits", "one week" and package cards say "Delivery in 5 business days".
- **Cost financing band.** Heading "From about $149 a month for 20 veneers" vs the example beneath it "$6,000 over 60 months … at 0% APR" (= $100 a month).
- **Reviews footnote.** "Reviews from Google, Healthgrades and RealSelf." vs the hero's "Reviews as published on Google".
- **Schema `priceRange`.** Design JSON-LD says `$$`, SEO.md says `$$$`. Using `$$`.
- **Sunbit.** "30 sec" decision time in the facts vs "under a minute" in the H1.
- **CareCredit.** "over $200" (card note) vs "$200 or more" (intro). The shared hero note "Soft credit check. Does not affect your score." also appears on CareCredit, a credit card whose full application is normally a hard inquiry.
- **Old `/contact-us/` URL** redirects to `/free-photo-evaluation` (per `redirects.txt`), not to the new `/contact` page.

## Placeholders in the designs (not rendered)
- **Patient video stories** ("In their own words" on Home and on each doctor profile): `[Patient name]`, no video files. Sections omitted.
- **Home review cards** are placeholders; Home shows the first four reviews from the Reviews page instead.
- **Reviews page, sixth card** is a placeholder; omitted. The five named reviews (Maria G., Daniel R., Sofia M., Carlos V., Andrea L.) must be verified against Google, and the design intends a Google Business Profile feed. No `Review`/`AggregateRating` schema is emitted until then.
- **Home FAQ "How does the 5-year warranty work?"** has `[covered items]` in its answer; omitted. Warranty terms needed. The Home links "How the 5-year warranty works" and "All answers" have no target page and are omitted.
- **Home doctor cards** show `[Credential line]`; using each doctor's focus line from the Doctors page.
- **Home in-house lab photo** is an empty slot in the design; using the supplied AI editorial image `gen-ceramist-hands.jpg`. Replace with a real lab photo.
- **Dr. Marta Puentes Marrero's education**: "Degree in Dentistry" lists the institution as just "Spain".
- **Dr. Adriana Hernandez**: no photo or bio supplied; not on the site.
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
- **Third-party scripts** (GTM `GTM-PSP4L6TC` and the LeadConnector chat widget) were copied from the previous site at the clinic's request; they lower Lighthouse performance scores somewhat and the CSP was widened to allow GTM-managed tags.

## Spanish site (/es)
- **Native review.** All Spanish copy (content in `src/content/es/` and interface strings in `src/lib/content-i18n.ts`) was translated for this build and should be read by a Spanish-speaking member of the team before launch, especially medical and financing wording.
- **Legal documents stay in English** on `/es/politica-de-privacidad`, `/es/terminos`, `/es/aviso-de-practicas-de-privacidad` and `/es/reembolsos-y-cancelaciones`, with a Spanish note above them. A lawyer-reviewed Spanish version can replace the English text later.
- **Google reviews** are shown as written (English) on both sites.
- **404 page** is served in English for both sites (Cloudflare serves one static 404).
- **Doctor names** keep "Dr." in Spanish structured fields (nav, headings, bylines); "Dra." would be the natural form for Dr. Puentes and Dr. Alonso. Change `name`/`shortName` in `src/content/es/doctors.json` and the FAQ `doc` fields together if wanted.

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
