import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import FinancingCta from "@/components/FinancingCta";
import FinancingSteps from "@/components/FinancingSteps";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import faqs from "@/content/faq/financing.json";
import financing from "@/content/financing.json";
import { lenders } from "@/lib/content";
import { pageGraph, faqPage } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { pages } from "@/lib/site";

const PATH = "/financing" as const;
export const metadata = pageMetadata(PATH);

export default function Page() {
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, faqPage(faqs))} />
      <PageHero>
        <div className="wrap relative z-[2] pt-8 pb-12 lg:pt-14 lg:pb-20">
          <div className="flex max-w-[880px] flex-col gap-5 lg:gap-[26px]">
            <nav aria-label="Breadcrumb" className="flex gap-2 text-[13px] text-on-dark-muted">
              <Link href="/" className="text-on-dark-muted no-underline hover:text-gold">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-gold">
                Financing
              </span>
            </nav>
            <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] text-pretty lg:text-[60px] lg:leading-[1.04]">
              {pages[PATH].h1}
            </h1>
            <p className="m-0 max-w-[58ch] text-[17px] leading-normal text-pretty text-on-dark-muted lg:text-xl lg:leading-normal">
              Most patients qualify with at least one partner. Our coordinator helps you apply, compares the offers with
              you, and nothing is charged until you are approved and happy with the plan.
            </p>
          </div>
        </div>
      </PageHero>

      <section className="wrap pt-16 lg:pt-28" aria-labelledby="partners-heading">
        <h2 id="partners-heading" className="sr-only">
          Financing partners
        </h2>
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
          {lenders.map((l) => (
            <Link
              key={l.slug}
              href={l.href}
              className="glass-card card-hover flex flex-col gap-[18px] rounded-2xl p-6 text-ink no-underline hover:text-ink lg:rounded-[18px] lg:p-7"
            >
              <div className="flex h-11 items-center">
                {/* Official partner mark: rendered as supplied, only scaled to fit. */}
                <Img
                  src={l.logo}
                  alt={l.name}
                  sizes="160px"
                  className="block h-auto max-h-10 w-auto max-w-[160px] object-contain"
                />
              </div>
              <span className="self-start rounded-full bg-[rgba(205,177,128,.16)] px-[11px] py-[5px] text-xs font-semibold text-gold-text">
                {l.tag}
              </span>
              <p className="m-0 text-[15px] leading-normal text-body">{l.note}</p>
              <span className="mt-auto text-sm font-semibold text-gold-text">Learn about {l.name} →</span>
            </Link>
          ))}
          <div className="dark-panel flex flex-col justify-center gap-3 rounded-2xl p-6 shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] lg:rounded-[18px] lg:p-7">
            <h3 className="m-0 font-serif text-[22px] leading-[1.2] font-normal lg:text-2xl">Not sure which one?</h3>
            <p className="m-0 text-[15px] leading-normal text-on-dark-muted">
              Send your photos. Your estimate comes with a side-by-side of the plans you are likely to qualify for.
            </p>
            <Link
              href="/free-photo-evaluation"
              className="btn btn-gold h-[52px] w-full px-[26px] text-[17px] lg:w-auto lg:self-start"
            >
              Free photo evaluation
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="mb-6 flex flex-col gap-3 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:max-w-[18ch] lg:text-5xl lg:leading-[1.1]">
            How approval guidance works
          </h2>
          <p className="m-0 text-[17px] leading-normal text-pretty text-body lg:mb-2 lg:max-w-[420px] lg:text-right">
            Three steps, all before you book a flight.
          </p>
        </div>
        <FinancingSteps steps={financing.steps} />
        <p className="mt-5 mb-0 text-[13px] text-muted">{financing.disclaimer}</p>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:sticky lg:top-8 lg:text-5xl lg:leading-[1.1]">
            Financing questions
          </h2>
          <FaqAccordion faqs={faqs} className="flex flex-col gap-3" />
        </div>
      </section>

      <FinancingCta />
    </main>
  );
}
