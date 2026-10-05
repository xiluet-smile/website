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

## 4. DNS cutover
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
