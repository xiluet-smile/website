import Link from "next/link";
import CostHero from "@/components/CostHero";
import CostPackages from "@/components/CostPackages";
import CostPhotoCta from "@/components/CostPhotoCta";
import CostPriceTables from "@/components/CostPriceTables";
import FaqAccordion from "@/components/FaqAccordion";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import faqs from "@/content/faq/cost.json";
import { lenders, prices } from "@/lib/content";
import { faqPage, offerCatalog, pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { pages } from "@/lib/site";

const PATH = "/veneers-cost-miami" as const;
export const metadata = pageMetadata(PATH);

const offers = prices.packages
  .filter((p) => typeof p.priceUsd === "number")
  .map((p) => ({ name: p.name, priceUsd: p.priceUsd, url: p.href }));

export default function Page() {
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, offerCatalog("Xiluet Smiles packages", offers), faqPage(faqs))} />
      <CostHero
        crumbs={["Cost"]}
        title={pages[PATH].h1}
        lead="Package prices and the full fee schedule, published. Send photos and a doctor confirms your exact number in writing within 6 hours."
      />

      <section className="wrap pt-16 lg:pt-28" aria-label="Packages">
        <CostPackages />
        <p className="mt-5 mb-0 max-w-[90ch] text-sm text-muted">
          All packages include a professional dental cleaning and X-rays. Deep cleaning and any other procedure are not
          included; if your exam finds something that needs treating first, it is quoted from the price list below, in
          writing, before anything starts. Final estimate may vary if additional corrections are required beyond the
          smile design.
        </p>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="mb-6 flex flex-col gap-3 lg:mb-9 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-3">
            <span className="eyebrow text-gold-text">Price list</span>
            <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:text-5xl lg:leading-[1.1]">
              Every individual fee, published
            </h2>
          </div>
          <p className="m-0 max-w-[460px] text-[17px] leading-[1.5] text-pretty text-body lg:mb-1.5 lg:text-right">
            The same list your doctor uses when something outside a package needs treating. No hidden line items.
          </p>
        </div>
        <CostPriceTables />
        <p className="mt-5 mb-0 text-sm text-muted">
          Fees per tooth unless stated. Included in your written estimate only when your exam shows they are needed.
        </p>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="dark-panel grid items-center gap-8 rounded-2xl p-6 shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] lg:grid-cols-2 lg:gap-16 lg:rounded-[20px] lg:p-16">
          <div className="flex flex-col gap-[18px]">
            <span className="eyebrow text-gold">Pay over time</span>
            <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:text-[44px] lg:leading-[1.1]">
              From about $149 a month for 20 veneers
            </h2>
            <p className="m-0 text-[17px] leading-[1.55] text-on-dark-muted">
              Example: $6,000 over 60 months with Cherry at 0% APR for qualified patients. Your coordinator shows you
              real offers from five partners before you decide.
            </p>
            <Link
              href="/financing"
              className="flex min-h-11 items-center font-semibold text-gold no-underline hover:text-gold hover:underline lg:min-h-0"
            >
              See all financing options →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {lenders.map((l) => (
              <Link
                key={l.slug}
                href={l.href}
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
            Cost questions
          </h2>
          <FaqAccordion faqs={faqs} className="flex flex-col gap-3" />
        </div>
      </section>

      <CostPhotoCta />
    </main>
  );
}
