# Rank tracking baseline — 2026-10-10

The starting point for measuring the new site (live since 2026-10-06 on xiluetsmiledesign.com). Positions come from the Semrush US organic index (desktop, national) pulled on 2026-10-10; the raw export is in `semrush-organic-us-2026-10-10.csv`. Volumes and keyword difficulty (KD) are from the October 2026 search study (`xiluet-blog-oct10/reports/`). A keyword listed as ">100" is not in the Semrush top 100 for the domain, which is the baseline value to beat.

## How to re-run

- **Semrush position tracking** (project 31548069 "xiluetsmiledesign.com", campaign `31548069_5622989`: Google, Miami FL, phone, English, 36 keywords): https://www.semrush.com/position-tracking/?project_id=31548069. The API call for this campaign was refused on 2026-10-10 with "unable to charge units", so the campaign is read in the Semrush UI until the subscription's API units for Position Tracking are enabled. Add the Spanish set below to the campaign (same location, phone, language Spanish) so both sets are tracked daily.
- **Semrush organic index**: `organic_research → resource_organic`, target `xiluetsmiledesign.com`, database `us`, sorted by position (990 API units per pull).
- **Google Search Console**: sitemap submitted and indexing requested on 2026-10-09 (clinic). Claude cannot sign in from this machine, so export Performance → Search results → last 28 days → Queries and save it in `seo/` to compare average position per query against the tables below.

## English keyword set (target page in parentheses)

Note 2026-10-11: the Porcelain Veneers page was merged into Smile Design, so every veneers keyword now targets /smile-design-miami (title "Smile Design Miami | 20 Porcelain Veneers $6,999, 0.3 mm, 1 Week"); /porcelain-veneers-miami 301s there.

| Keyword | Volume | KD | Target page | Position 2026-10-10 |
| --- | --- | --- | --- | --- |
| veneers near me | 49,500 | 5 | /smile-design-miami + GBP | >100 |
| porcelain veneers near me | 33,100 | 5 | /smile-design-miami + GBP | >100 |
| veneers miami | 1,300 | 16 | /smile-design-miami | >100 |
| smile design miami | 1,300 | 18 | /smile-design-miami | >100 |
| best veneers near me | 1,000 | 13 | /smile-design-miami | >100 |
| porcelain veneers miami | 590 | 34 | /smile-design-miami | >100 |
| miami veneers | 590 | 32 | /smile-design-miami | >100 |
| cheap veneers near me | 590 | 1 | /veneers-cost-miami | >100 |
| veneers cost miami | 210 | 0 | /veneers-cost-miami | >100 |
| smile makeover miami | 170 | 4 | /smile-makeover-miami | >100 |
| smile makeover cost | 720 | 9 | /veneers-cost-miami | >100 |
| digital smile design | 1,900 | 28 | /blog/what-is-digital-smile-design | >100 |
| hollywood smile | 2,900 | 24 | /blog/what-is-digital-smile-design | >100 |
| smile design dentistry | 6,600 | 42 | /smile-design-miami | >100 |
| design of smile | 12,100 | 21 | /smile-design-miami | >100 |
| are veneers permanent | 3,600 | 1 | /blog/who-is-a-candidate-for-veneers | >100 |
| veneers vs implants | 1,600 | 5 | /blog/who-is-a-candidate-for-veneers | >100 |
| are veneers worth it | 1,000 | 5 | /blog/who-is-a-candidate-for-veneers | >100 |
| can you get veneers with missing teeth | 1,000 | 0 | /blog/who-is-a-candidate-for-veneers | >100 |
| veneers for small teeth | 390 | 2 | /blog/who-is-a-candidate-for-veneers | >100 |
| veneers for crooked teeth | 260 | 0 | /blog/who-is-a-candidate-for-veneers | >100 |
| how to care for porcelain veneers | 2,400 | 9 | /blog/how-to-take-care-of-porcelain-veneers | >100 |
| temporary veneers | 1,300 | 0 | /blog/how-to-take-care-of-porcelain-veneers | >100 |
| can you whiten veneers | 590 | 9 | /blog/how-to-take-care-of-porcelain-veneers | >100 |
| do veneers stain | 480 | 5 | /blog/how-to-take-care-of-porcelain-veneers | >100 |
| how much do veneers cost | 14,800 | 15 | /blog/porcelain-veneers-cost-miami | >100 |
| how long do veneers last | 5,400 | 24 | /blog/how-long-do-porcelain-veneers-last | >100 |
| do veneers hurt | 720 | 2 | /blog/do-veneers-hurt | >100 |
| are veneers bad for your teeth | 880 | 13 | /blog/do-veneers-ruin-your-teeth | >100 |
| does insurance cover veneers | 1,000 | 28 | /blog/how-to-pay-for-veneers | >100 |
| all on 4 dental implants miami | — | — | /all-on-x-dental-implants-miami | >100 |
| full mouth reconstruction miami | — | — | /full-mouth-reconstruction-miami | >100 |
| frenectomy miami | — | — | no page (declined 2026-10-11); /frenectomy 301s to /contact | GSC: #2, 472 impressions (Sept 2026) |
| gum bleaching miami | 40 | 1 | no page (declined 2026-10-11); /gum-lightening 301s to /smile-makeover-miami | 10 (old URL) |

## Spanish keyword set

| Keyword | Volume (US) | KD | Target page | Position 2026-10-10 |
| --- | --- | --- | --- | --- |
| carillas de porcelana miami | 110 | 0 | /es/diseno-de-sonrisa-miami | >100 |
| diseño de sonrisa miami | 50 | 0 | /es/diseno-de-sonrisa-miami | >100 |
| diseño de sonrisa digital miami | — | — | /es/blog/que-es-el-diseno-de-sonrisa-digital | >100 |
| cuanto cuesta un diseño de sonrisa en miami | — | — | /es/blog/que-es-el-diseno-de-sonrisa-digital | >100 |
| sonrisa de hollywood miami | — | — | /es/blog/que-es-el-diseno-de-sonrisa-digital | >100 |
| carillas miami | — | — | /es/diseno-de-sonrisa-miami | >100 |
| precio carillas miami | — | — | /es/precio-carillas-miami | >100 |
| carillas de porcelana precio | — | — | /es/blog/precio-carillas-de-porcelana-miami | >100 |
| dientes separados solucion miami | — | — | /es/blog/quien-es-candidato-para-carillas | >100 |
| dientes chuecos sin brackets miami | — | — | /es/blog/quien-es-candidato-para-carillas | >100 |
| carillas o brackets | — | — | /es/blog/quien-es-candidato-para-carillas | >100 |
| carillas o coronas | — | — | /es/blog/carillas-vs-coronas-vs-invisalign | >100 |
| como cuidar las carillas | — | — | /es/blog/como-cuidar-las-carillas-de-porcelana | >100 |
| las carillas se manchan | — | — | /es/blog/como-cuidar-las-carillas-de-porcelana | >100 |
| se pueden blanquear las carillas | — | — | /es/blog/como-cuidar-las-carillas-de-porcelana | >100 |
| carillas provisionales | — | — | /es/blog/como-cuidar-las-carillas-de-porcelana | >100 |
| carillas de porcelana cuanto duran | — | — | /es/blog/cuanto-duran-las-carillas-de-porcelana | >100 |
| duelen las carillas | — | — | /es/blog/duelen-las-carillas | >100 |
| implantes all on 4 miami | — | — | /es/implantes-dentales-all-on-x-miami | >100 |
| dentista en miami que hable español | — | — | / | >100 |

Volumes marked "—" were not in the October study; pull them from Semrush Keyword Overview (database `us`) when the Spanish set is added to the tracking campaign.

## What the domain ranks for today (Semrush US index, top 100)

Branded queries hold the only page-one positions: "xiluet smiles" (#1, 260/mo), "xiluet smiles miami" (#1), "xiluet smile" (#1), "xiluet smiles reviews" (#3), "xiluet" (#6). The rest of the 100 rows are legacy WordPress URLs that now 301 to the new site (gum lightening, sinus lift, fillings, dentures, braces, root canal, nightguards), all between #10 and #99 with near-zero traffic. None of the target keywords above appears in the top 100 yet; the new URLs were first crawlable on 2026-10-06, so this is the expected zero point.

Note: "gum bleaching miami" #10, "gum depigmentation near me" #51, "gum lightening" #53 and the old frenectomy ranking (#2 in Search Console) all land on redirected legacy URLs. Decided 2026-10-11: no gum-lightening or frenectomy pages; both are off-positioning for a cosmetic smile-design practice, so expect these rows to drop out of the index and ignore them in later comparisons.
