import Link from "next/link";
import CostHero from "@/components/CostHero";
import CostPackages from "@/components/CostPackages";
import CostPhotoCta from "@/components/CostPhotoCta";
import CostPriceTables from "@/components/CostPriceTables";
import FaqAccordion from "@/components/FaqAccordion";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import { getContent, ui } from "@/lib/content-i18n";
import { localizeHref, localizePath, type Locale } from "@/lib/i18n";
import { faqPage, offerCatalog, pageGraph } from "@/lib/schema";

const PATH = "/veneers-cost-miami" as const;

export default function CostPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages, lenders, prices, faq } = getContent(locale);
  const faqs = faq.cost;
  const offers = prices.packages
    .filter((p) => typeof p.priceUsd === "number")
    .map((p) => ({ name: p.name, priceUsd: p.priceUsd, url: p.href }));
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, locale, offerCatalog(t.cost.catalogName, offers, locale), faqPage(faqs))} />
      <CostHero
        locale={locale}
        crumbs={[t.breadcrumb.cost]}
        title={pages[PATH].h1}
        lead={t.cost.lead}
      />

      <section className="wrap pt-16 lg:pt-28" aria-label={t.cost.packagesAria}>
        <CostPackages locale={locale} />
        <p className="mt-5 mb-0 max-w-[90ch] text-sm text-muted">
          {t.cost.packagesNote}
        </p>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="mb-6 flex flex-col gap-3 lg:mb-9 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-3">
            <span className="eyebrow text-gold-text">{t.cost.listEyebrow}</span>
            <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:text-5xl lg:leading-[1.1]">
              {t.cost.listTitle}
            </h2>
          </div>
          <p className="m-0 max-w-[460px] text-[17px] leading-[1.5] text-pretty text-body lg:mb-1.5 lg:text-right">
            {t.cost.listAside}
          </p>
        </div>
        <CostPriceTables locale={locale} />
        <p className="mt-5 mb-0 text-sm text-muted">
          {t.cost.listNote}
        </p>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="dark-panel grid items-center gap-8 rounded-2xl p-6 shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] lg:grid-cols-2 lg:gap-16 lg:rounded-[20px] lg:p-16">
          <div className="flex flex-col gap-[18px]">
            <span className="eyebrow text-gold">{t.cost.payEyebrow}</span>
            <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:text-[44px] lg:leading-[1.1]">
              {t.cost.payTitle}
            </h2>
            <p className="m-0 text-[17px] leading-[1.55] text-on-dark-muted">
              {t.cost.payBody}
            </p>
            <Link
              href={localizePath("/financing", locale)}
              className="flex min-h-11 items-center font-semibold text-gold no-underline hover:text-gold hover:underline lg:min-h-0"
            >
              {t.cost.allFinancing}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {lenders.map((l) => (
              <Link
                key={l.slug}
                href={localizeHref(l.href, locale)}
                className="flex h-[72px] items-center justify-center rounded-[14px] bg-[rgba(247,244,238,.92)] px-3 no-underline"
              >
                <Img
                  src={l.logo}
                  alt={l.name}
                  sizes="130px"
                  className="h-auto max-h-[34px] w-auto max-w-[min(130px,100%)] object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:sticky lg:top-8 lg:text-5xl lg:leading-[1.1]">
            {t.cost.faqTitle}
          </h2>
          <FaqAccordion faqs={faqs} className="flex flex-col gap-3" locale={locale} />
        </div>
      </section>

      <CostPhotoCta locale={locale} />
    </main>
  );
}
