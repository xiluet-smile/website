import Link from "next/link";
import FaqAccordion from "./FaqAccordion";
import FinancingCta from "./FinancingCta";
import FinancingSteps from "./FinancingSteps";
import Img from "./Img";
import PageHero from "./PageHero";
import { lenders, type Faq, type Lender } from "@/lib/content";

export type LenderContent = {
  slug: string;
  intro: string;
  site: { url: string; label: string; note: string };
  facts: { big: string; sub: string }[];
  steps: { n: string; t: string }[];
  faq: Faq[];
  disclaimer: string;
};

/** Shared template for /financing/{partner}. `h1` comes from pages.json. */
export default function LenderPage({ lender, content, h1 }: { lender: Lender; content: LenderContent; h1: string }) {
  const others = lenders.filter((l) => l.slug !== lender.slug);
  return (
    <>
      <PageHero>
        <div className="wrap relative z-[2] grid items-center gap-8 pt-8 pb-12 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-14 lg:pt-14 lg:pb-20">
          <div className="flex flex-col gap-5 lg:gap-[26px]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-[13px] text-on-dark-muted">
              <Link href="/" className="text-on-dark-muted no-underline hover:text-gold">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/financing" className="text-on-dark-muted no-underline hover:text-gold">
                Financing
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-gold">
                {lender.name}
              </span>
            </nav>
            <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] text-pretty lg:text-[60px] lg:leading-[1.04]">
              {h1}
            </h1>
            <p className="m-0 max-w-[58ch] text-[17px] leading-normal text-pretty text-on-dark-muted lg:text-xl lg:leading-normal">
              {content.intro}
            </p>
          </div>
          <div className="glass-card flex flex-col gap-5 rounded-2xl p-6 text-ink lg:gap-[22px] lg:rounded-[18px] lg:p-10">
            {/* Official partner mark: rendered as supplied, only scaled to fit. */}
            <Img
              src={lender.logo}
              alt={lender.name}
              sizes="220px"
              className="block h-auto max-h-14 w-auto max-w-[220px] object-contain"
            />
            <p className="m-0 text-[17px] leading-normal text-body">{lender.note}</p>
            <a
              href={content.site.url}
              rel="noopener"
              className="btn btn-teal min-h-[52px] w-full px-[22px] py-2 text-center text-base whitespace-normal lg:min-h-12 lg:w-auto lg:self-start lg:py-0 lg:whitespace-nowrap"
            >
              {content.site.label}
            </a>
            <p className="m-0 text-[13px] text-muted">{content.site.note}</p>
          </div>
        </div>
      </PageHero>

      <section className="wrap pt-16 lg:pt-28">
        <dl className="dark-panel m-0 grid grid-cols-2 gap-x-4 gap-y-6 rounded-2xl p-6 shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] lg:grid-cols-4 lg:gap-6 lg:rounded-[20px] lg:p-16">
          {content.facts.map((f) => (
            <div
              key={f.big}
              className="flex flex-col gap-2 border-[rgba(247,244,238,.14)] lg:border-r lg:pr-6"
            >
              <dt className="font-serif text-[26px] leading-[1.1] lg:text-[40px] lg:leading-none">{f.big}</dt>
              <dd className="m-0 text-sm leading-[1.4] text-on-dark-muted lg:text-[15px]">{f.sub}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <h2 className="m-0 mb-6 font-serif text-[34px] leading-[1.2] font-normal lg:mb-10 lg:max-w-[18ch] lg:text-5xl lg:leading-[1.1]">
          How it works with {lender.name}
        </h2>
        <FinancingSteps steps={content.steps} />
        <nav aria-label="Other financing partners" className="mt-8 flex flex-wrap items-center gap-2.5 lg:mt-10">
          <span className="mr-1.5 w-full text-[13px] font-semibold tracking-widest text-muted uppercase lg:w-auto">
            Other partners
          </span>
          {others.map((o) => (
            <Link
              key={o.slug}
              href={o.href}
              className="inline-flex min-h-11 items-center rounded-full border border-sand bg-[rgba(255,253,248,.7)] px-3.5 text-sm font-semibold text-teal no-underline lg:min-h-0 lg:py-2"
            >
              {o.name}
            </Link>
          ))}
        </nav>
        <p className="mt-5 mb-0 text-[13px] text-muted">{content.disclaimer}</p>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:sticky lg:top-8 lg:text-5xl lg:leading-[1.1]">
            {lender.name} questions
          </h2>
          <FaqAccordion faqs={content.faq} className="flex flex-col gap-3" />
        </div>
      </section>

      <FinancingCta />
    </>
  );
}
