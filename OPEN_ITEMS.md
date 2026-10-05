# Open items

Things the design files leave unresolved. Each is marked `TODO(clinic)` in the code or content where it applies.

## Needs clinic confirmation
- **Google rating and review count.** Site uses the design's 5.0 · 236 (`src/content/site.json` → `rating`); the live site says 4.9 · 500+. Pick one.
- **Reply-time promise.** The footer, Free Photo Evaluation page and SEO copy say "within 6 hours"; the Home how-it-works step and final CTA say "within 12 hours". Kept verbatim from the designs; pick one.
- **Schema `priceRange`.** Design JSON-LD says `$$`, SEO.md says `$$$`. Using the design's `$$`.
- **Legal pages.** Privacy Policy, Terms, Notice of Privacy Practices, Refund and Cancellation have no designs or copy; footer links point to `#` (`src/content/nav.json` → `legal`).
- **Spanish.** The EN | ES switch is in the design but /es/ is phase 2; the ES link points to `#`.

## Assets not supplied
- **Hero video** is loaded from the designer's CloudFront URL (`site.json` → `videos.hero`). Upload to Cloudflare Stream and replace.
- **Out-of-state video** (`miami-arrival.mp4`) is not in the repo per STACK.md; the poster image shows until a Stream URL is set in `site.json` → `videos.miamiArrival`.
