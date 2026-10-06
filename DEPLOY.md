# Deploying Xiluet Smiles

Static Next.js export served by Cloudflare Pages, with two Pages Functions for the forms. Source: `github.com/xiluet-smile/website`, production branch `main`.

## 1. Connect GitHub to Cloudflare Pages
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize the Cloudflare GitHub app for the `xiluet-smile` account and select the `website` repository.
3. Build settings:
   | Setting | Value |
   |---|---|
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | `npm run build` |
   | Build output directory | `out` |
   | Root directory | (empty) |
4. Environment variables (Production **and** Preview) → add `NODE_VERSION` = `22`.
5. **Save and Deploy.** Every push to `main` deploys production; every pull request gets a preview URL.

`npm run build` first runs `scripts/build-images.mjs` (AVIF/WebP variants and Open Graph images into `public/images` and `public/og`), then `next build`, which writes the site to `out/`. `functions/` is picked up automatically, and `public/_headers`, `public/_redirects` and `public/robots.txt` are copied into the output.

## 2. Environment variables and bindings
Set under **Pages project → Settings**. Add each to Production and Preview. A template is in `.dev.vars.example`.

### Build-time variable (Settings → Environment variables)
| Name | Value |
|---|---|
| `NODE_VERSION` | `22` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key (public). If unset the forms render without the widget. |

### Function secrets (Settings → Environment variables → Encrypt)
| Name | Purpose |
|---|---|
| `TURNSTILE_SECRET` | Turnstile secret key; verifies form tokens. |
| `RESEND_API_KEY` | Sends clinic notifications and the patient autoresponder. |
| `NOTIFY_EMAIL` | Clinic inbox that receives leads and contact messages. |
| `FROM_EMAIL` | Sender, e.g. `Xiluet Smiles <hello@xiluetsmiledesign.com>`. The domain must be verified in Resend. |
| `LINK_SIGNING_SECRET` | Long random string; signs the 7-day photo links in clinic emails. |
| `CRM_WEBHOOK_URL` | Optional. Leads and contact messages are POSTed here as JSON. |
| `REQUIRE_TURNSTILE` | Optional. Set to `1` to reject submissions without a Turnstile token (this disables the no-JavaScript form path). |
| `GOOGLE_PLACES_API_KEY` | Google Cloud API key with Places API (New) enabled; powers the live reviews on Home (`/api/reviews`). |
| `GOOGLE_PLACE_ID` | The practice's Google Business Profile Place ID. Also set `google.placeId` in `src/content/site.json` for the "Leave a review" link. |
| `SITE_URL` | Optional. Defaults to `https://xiluetsmiledesign.com`; set to the preview URL when testing photo links on a preview. |

### Bindings (Settings → Functions → Bindings)
| Type | Variable name | Value |
|---|---|---|
| R2 bucket | `R2_PHOTOS` | Create a private bucket (e.g. `xiluet-lead-photos`). Stores `leads/{yyyy}/{id}/…` photos and the lead record with the TCPA consent log. No public access. |
| KV namespace | `RATE_LIMIT` | Optional. Per-IP rate limiting for the form functions. |

### Related setup
- **Turnstile**: dashboard → Turnstile → add a widget for `xiluetsmiledesign.com` and the `*.pages.dev` hostname, mode *Managed* or *Invisible*.
- **Resend**: verify `xiluetsmiledesign.com` (SPF/DKIM records go in Cloudflare DNS).
- **Rate limiting**: in addition to the KV binding, add a WAF rate-limiting rule for `/api/*` (for example 10 requests per minute per IP).
- **R2 retention**: decide how long lead photos are kept and add a lifecycle rule on the bucket.
- **Analytics**: enable Cloudflare Web Analytics on the Pages project (no cookie banner needed). The CSP in `public/_headers` already allows it.

## 3. Check the preview before touching DNS
On the `*.pages.dev` URL:
- [ ] All 24 routes load; `/sitemap.xml` and `/robots.txt` respond.
- [ ] Submit the Free Photo Evaluation form with photos and the Contact form: clinic email arrives, photo links open, autoresponder arrives, lead JSON and photos are in R2, CRM receives the webhook.
- [ ] Submit both forms once with JavaScript disabled.
- [ ] Every rule in `public/_redirects` returns 301 (`curl -I https://<preview>/porcelain-veneers/`).
- [ ] Lighthouse mobile: Performance ≥ 90, SEO 100, Accessibility ≥ 95.
- [ ] Google Rich Results Test passes on one page per template (home, treatment, doctor, cost, results, financing partner, contact).
- [ ] Resolve or accept the items in `OPEN_ITEMS.md`.

## 4. DNS cutover (DNS currently at SiteGround; email on Microsoft 365)
State on 2026-10-06: the Pages project `website` auto-deploys `main` to https://website-f53.pages.dev. The Cloudflare account has **no zone** for xiluetsmiledesign.com yet. Nameservers are SiteGround's; mail (MX, SPF, DKIM, autodiscover) is Microsoft 365 and must keep working through the switch. Every current record is captured in `dns/xiluetsmiledesign.com.zone`.

1. **Create the zone** — Cloudflare dashboard → Add a domain → `xiluetsmiledesign.com` → Free plan. Skip the quick scan or accept it, then DNS → Records → *Import and Export* → import `dns/xiluetsmiledesign.com.zone`. Check that the apex and `www` A records (34.174.235.166) are there with the orange cloud **off** (DNS only) for now, and that the MX, SPF, both `selector*._domainkey` CNAMEs, `autodiscover` and `_dmarc` are present.
2. **Switch nameservers at SiteGround** (Site Tools → Domain → DNS Zone Editor is not it; it is the registrar panel: Services → Domains → Manage → Nameservers) to the two names Cloudflare shows on the zone Overview. Propagation: minutes to 24 h. The old site keeps serving from the imported A records meanwhile; mail is unaffected.
3. **When the zone shows "Active"**: Pages project `website` → Custom domains → add `xiluetsmiledesign.com`, then `www.xiluetsmiledesign.com`. Cloudflare replaces the two A records with Pages CNAMEs and issues the certificate (a few minutes). `public/_redirects` sends `www` to the apex, so the Google Business Profile link (`www…/?utm_source=google…`) lands on the new home page.
4. **Same day, after the domain resolves to Pages**: set `gtmId` to `GTM-PSP4L6TC` in `src/content/site.json` and `src/content/es/site.json` and push (re-enables GA4, Google Ads and the Facebook pixel). Enable Cloudflare Web Analytics on the Pages project.
5. **Search Console**: the `google-site-verification` TXT is in the zone file, so the existing property stays verified. Add a *Domain* property for `xiluetsmiledesign.com` as well (DNS TXT, Cloudflare offers one-click), submit `https://xiluetsmiledesign.com/sitemap.xml`, and request indexing for the home page and the six treatment pages. Then Google Business Profile → edit → Website → `https://xiluetsmiledesign.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
6. **Rollback**: point the apex/`www` records back at 34.174.235.166 (SiteGround keeps serving until the hosting is cancelled).

### Already configured on the Pages project (via API, 2026-10-06)
`NODE_VERSION=22`, `NOTIFY_EMAIL`, `FROM_EMAIL`, `GOOGLE_PLACE_ID`, `LINK_SIGNING_SECRET` (random, encrypted) and the `RATE_LIMIT` KV binding (`xiluet-website-rate-limit`), on Production and Preview.

### Still needed from the clinic (external accounts)
| Item | Where | Why |
|---|---|---|
| Enable R2 on the account, then create bucket `xiluet-lead-photos` and bind it as `R2_PHOTOS` | Cloudflare → R2 | Photo-evaluation uploads have nowhere to go until this exists; the form falls back to email-only. |
| Turnstile widget for `xiluetsmiledesign.com` + `*.pages.dev` → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (plain) and `TURNSTILE_SECRET` (encrypted) | Cloudflare → Turnstile | Bot protection on the forms. |
| Resend account, verify `xiluetsmiledesign.com` (adds DKIM/SPF records to the zone), create API key → `RESEND_API_KEY` | resend.com | Lead and contact emails. Until set, functions store the lead and return success without sending. |
| Google Cloud API key with Places API (New) → `GOOGLE_PLACES_API_KEY` | console.cloud.google.com | Live Google reviews on Home. |
| `CRM_WEBHOOK_URL` (GoHighLevel inbound webhook) | GHL → Automations → Inbound Webhook | Leads land in the CRM. |

### Previous checklist

Keep the WordPress site live until section 3 passes.
1. Pages project → **Custom domains** → add `xiluetsmiledesign.com` and `www.xiluetsmiledesign.com`. With DNS already on Cloudflare the records are created for you; remove the old A/CNAME records that point to the WordPress host.
2. Add a redirect rule from `www` to the apex (Rules → Redirect Rules) so there is one canonical host.
3. SSL/TLS mode **Full (strict)**; enable **HTTP/3**, **Brotli** and **Early Hints** (Speed → Optimization).
4. Confirm `https://xiluetsmiledesign.com/` serves the new site and old WordPress URLs return 301.
5. Google Search Console: submit `https://xiluetsmiledesign.com/sitemap.xml`, then request indexing for the six money pages: `/`, `/porcelain-veneers-miami`, `/smile-design-miami`, `/veneers-cost-miami`, `/before-and-after`, `/out-of-state-patients`.
6. Watch Search Console coverage and the Pages Functions logs for a week before decommissioning WordPress.

## Local development
```bash
npm install
npm run dev
```
To exercise the forms locally, copy `.dev.vars.example` to `.dev.vars`, then:
```bash
npm run build
npm run preview
```
