import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import FinancingCta from "@/components/FinancingCta";
import FinancingSteps from "@/components/FinancingSteps";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { getContent, tpl, ui } from "@/lib/content-i18n";
import { localizeHref, localizePath, type Locale } from "@/lib/i18n";
import { pageGraph, faqPage } from "@/lib/schema";

const PATH = "/financing" as const;

export default function FinancingPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages, lenders, financing, faq } = getContent(locale);
  const faqs = faq.financing;
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, locale, faqPage(faqs))} />
      <PageHero locale={locale}>
        <div className="wrap relative z-[2] pt-8 pb-12 lg:pt-14 lg:pb-20">
          <div className="flex max-w-[880px] flex-col gap-5 lg:gap-[26px]">
            <nav aria-label="Breadcrumb" className="flex gap-2 text-[13px] text-on-dark-muted">
              <Link href={localizePath("/", locale)} className="text-on-dark-muted no-underline hover:text-gold">
                {t.home}
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-gold">
                {t.breadcrumb.financing}
              </span>
            </nav>
            <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] text-pretty lg:text-[60px] lg:leading-[1.04]">
              {pages[PATH].h1}
            </h1>
            <p className="m-0 max-w-[58ch] text-[17px] leading-normal text-pretty text-on-dark-muted lg:text-xl lg:leading-normal">
              {t.financingPage.lead}
            </p>
          </div>
        </div>
      </PageHero>

      <section className="wrap pt-16 lg:pt-28" aria-labelledby="partners-heading">
        <h2 id="partners-heading" className="sr-only">
          {t.financingPage.partners}
        </h2>
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
          {lenders.map((l) => (
            <Link
              key={l.slug}
              href={localizeHref(l.href, locale)}
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
              <span className="mt-auto text-sm font-semibold text-gold-text">{tpl(t.financingPage.learnAbout, { name: l.name })}</span>
            </Link>
          ))}
          <div className="dark-panel flex flex-col justify-center gap-3 rounded-2xl p-6 shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] lg:rounded-[18px] lg:p-7">
            <h3 className="m-0 font-serif text-[22px] leading-[1.2] font-normal lg:text-2xl">{t.financingPage.notSure}</h3>
            <p className="m-0 text-[15px] leading-normal text-on-dark-muted">
              {t.financingPage.notSureBody}
            </p>
            <Link
              href={localizePath("/free-photo-evaluation", locale)}
              className="btn btn-gold h-[52px] w-full px-[26px] text-[17px] lg:w-auto lg:self-start"
            >
              {t.freePhotoEvaluation}
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="mb-6 flex flex-col gap-3 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:max-w-[18ch] lg:text-5xl lg:leading-[1.1]">
            {t.financingPage.guidanceTitle}
          </h2>
          <p className="m-0 text-[17px] leading-normal text-pretty text-body lg:mb-2 lg:max-w-[420px] lg:text-right">
            {t.financingPage.guidanceAside}
          </p>
        </div>
        <FinancingSteps steps={financing.steps} />
        <p className="mt-5 mb-0 text-[13px] text-muted">{financing.disclaimer}</p>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:sticky lg:top-8 lg:text-5xl lg:leading-[1.1]">
            {t.financingPage.faqTitle}
          </h2>
          <FaqAccordion faqs={faqs} className="flex flex-col gap-3" locale={locale} />
        </div>
      </section>

      <FinancingCta locale={locale} />
    </main>
  );
}
