# Official NAP (name, address, phone) — locked 2026-10-10

One version of the practice's contact details, used everywhere: website, schema, Google Business Profile, directories, SMS/A2P registration, ad accounts. Verified against the Google Business Profile listing on 2026-10-10.

| Field | Official value |
| --- | --- |
| Name | Xiluet Smiles |
| Street | 8396 SW 8th St |
| Secondary line | 2nd Floor (GBP shows "Located in: Westchester Point Plaza"; the floor line is optional on citations, the street line is not) |
| City, state, ZIP | Miami, FL 33144 |
| Country | US |
| Phone (display) | (305) 615-5500 |
| Phone (tel link) | +13056155500 |
| Phone (schema) | +1-305-615-5500 |
| WhatsApp | same number, https://wa.me/13056155500 |
| Email | hello@xiluetsmiledesign.com |
| Website | https://xiluetsmiledesign.com |
| Hours | Monday–Friday, 9:00 AM–5:00 PM ET |
| Google rating | 5.0 · 251 reviews (GBP, 2026-10-10) |
| Legal entity (legal pages) | Xiluet Smile LLC — unchanged in the Terms, Privacy Policy and Notice of Privacy Practices; confirm with counsel if the registered name differs |

## Retired values (do not use anywhere)

- `xiluetsmiles.com` — the domain no longer resolves (NXDOMAIN, 2026-10-10). Any `@xiluetsmiles.com` mailbox is dead.
- `info@xiluetsmiles.com`, `info@xiluetaestheticsurgery.com` — replaced by hello@xiluetsmiledesign.com on every legal page (2026-10-10).
- `305-615-4200` — old customer-service number in the Terms SMS section; replaced by (305) 615-5500.
- `8396 SW 8th St 1st floor` / `8396 SW 8 ST, No. FL2` — old address lines in the legal pages; replaced by "8396 SW 8th St, 2nd Floor".

## Where it lives in the code

- `src/content/site.json` and `src/content/es/site.json` — the single source for the footer, contact page, schema (`Dentist` node), Open Graph and the Spanish legal notice. Change the NAP here and nowhere else.
- `src/content/legal.json` — the four legal documents carry the NAP as literal HTML. They were aligned on 2026-10-10 and must be re-checked whenever `site.json` changes (`grep -n "615-\|@xiluet\|8396" src/content/legal.json`).
- `public/llms.txt` — repeats the address and phone for AI crawlers.

## Consistency checklist for the A2P / 10DLC reviewer

The reviewer compares the brand registration, the opt-in language and the Terms page. All three must show the same brand name, phone and email:

- [x] Terms page (`/terms`, section "Customer Support Information") shows (305) 615-5500 and hello@xiluetsmiledesign.com.
- [x] Privacy Policy, Notice of Privacy Practices and Refund policy show the same phone, email and address.
- [x] Website footer, contact page and JSON-LD use (305) 615-5500 / hello@xiluetsmiledesign.com / 8396 SW 8th St, 2nd Floor.
- [x] Google Business Profile: name, street address, phone and website match (checked 2026-10-10).
- [ ] A2P brand registration (GoHighLevel → Settings → Phone Numbers → Trust Center): brand phone, support email and website URL match this table.
- [ ] GoHighLevel SMS templates and the opt-in form footer: "Reply HELP for help, STOP to cancel" with (305) 615-5500 and hello@xiluetsmiledesign.com.
- [ ] Directory citations still carrying the old email, number or floor: Healthgrades, RealSelf, Yelp, Facebook page "About", Instagram bio link, Apple Maps, Bing Places, Zocdoc. Audit and correct each to this table.
- [x] Cloudflare → Security → Settings → "Email Address Obfuscation": switched **off** on 2026-10-11; the footer now serves a plain `mailto:` link and the re-crawl (916 URLs) found zero non-200 responses. Until then it rewrote the footer email into a `/cdn-cgi/l/email-protection` link that 404ed for crawlers.
