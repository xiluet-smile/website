import {
  ClinicFeatureGrid,
  ClinicHero,
  ClinicPhotoCta,
  ClinicSectionHead,
  fillFacts,
} from "@/components/ClinicSections";
import FaqAccordion from "@/components/FaqAccordion";
import FeatureIcon from "@/components/FeatureIcons";
import Img from "@/components/Img";
import LazyVideo from "@/components/LazyVideo";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { getContent, tpl, ui } from "@/lib/content-i18n";
import { localizePath, type Locale } from "@/lib/i18n";
import { imageInfo } from "@/lib/images";
import { faqPage, pageGraph } from "@/lib/schema";

const PATH = "/out-of-state-patients" as const;

const POSTER = "out-of-state-poster.jpg";
const mediaClass = "block aspect-[4/3] h-auto w-full object-cover";

const visitCard =
  "flex flex-col gap-4 rounded-2xl border border-[rgba(255,255,255,.7)] px-5 py-6 shadow-[0_1px_0_rgba(255,255,255,.6)_inset,0_12px_32px_rgba(26,26,26,.06)] lg:min-h-[240px] lg:rounded-[18px] lg:px-6 lg:py-[26px]";

export default function OutOfStatePage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages, site, outOfState: content, faq } = getContent(locale);
  const faqs = faq.outOfState.map((f) => ({ q: f.q, a: fillFacts(f.a) }));
  const visits = content.visits.map((v) => ({ ...v, d: fillFacts(v.d) }));
  // Typed as string | null so the page compiles whether or not a video URL is set in site.json.
  const arrivalVideo: string | null = site.videos.miamiArrival;
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, locale, faqPage(faqs))} />
      <PageHero locale={locale}>
        <ClinicHero
          trail={[{ label: t.home, href: localizePath("/", locale) }, { label: t.breadcrumb.outOfState }]}
          title={pages[PATH].h1}
          lead={tpl(t.outOfStatePage.lead, { years: site.warrantyYears })}
          media={
            arrivalVideo ? (
              <LazyVideo src={arrivalVideo} poster={imageInfo(POSTER).src} label={t.outOfStatePage.mediaAlt} className={mediaClass} />
            ) : (
              <Img
                src={POSTER}
                alt={t.outOfStatePage.mediaAlt}
                sizes="(min-width: 1024px) 480px, calc(100vw - 40px)"
                className={mediaClass}
                priority
              />
            )
          }
        />
      </PageHero>

      <section className="wrap pt-16 lg:pt-28">
        <ClinicSectionHead
          title={t.outOfStatePage.weekTitle}
          aside={t.outOfStatePage.weekAside}
        />
        {/* Desktop timeline rail: icon disc, day label, connector to the next step. */}
        <div className="mb-4 hidden lg:grid lg:grid-cols-4 lg:gap-4" aria-hidden="true">
          {visits.map((v, i) => (
            <div key={v.k} className="flex items-center gap-3">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-teal text-gold shadow-[0_6px_16px_rgba(4,40,46,.18)]">
                <FeatureIcon name={v.icon} plain />
              </span>
              <span className="eyebrow font-sans whitespace-nowrap text-gold-text">{v.k}</span>
              {i < visits.length - 1 && <span className="h-px flex-1 bg-[rgba(10,62,68,.22)]" />}
            </div>
          ))}
        </div>
        <ol className="m-0 grid list-none gap-3 p-0 lg:grid-cols-4 lg:gap-4">
          {visits.map((v, i) => {
            const light = i === 0;
            return (
              <li
                key={v.k}
                className={`${visitCard} ${
                  light
                    ? "bg-[rgba(255,253,248,.55)] text-ink"
                    : "bg-[linear-gradient(150deg,rgba(10,62,68,.94)_0%,rgba(4,40,46,.92)_100%)] text-on-dark"
                }`}
              >
                <div className="flex items-center gap-3 lg:hidden">
                  <span className={`grid h-10 w-10 flex-none place-items-center rounded-full ${light ? "bg-teal text-gold" : "bg-[rgba(205,177,128,.18)] text-gold"}`}>
                    <FeatureIcon name={v.icon} plain />
                  </span>
                  <span className={`eyebrow font-sans ${light ? "text-gold-text" : "text-gold"}`}>{v.k}</span>
                </div>
                <h3 className="m-0 flex items-baseline gap-3 font-normal">
                  <span className={`font-serif text-[15px] tracking-[.08em] ${light ? "text-gold-text" : "text-gold"}`}>0{i + 1}</span>
                  <span className="font-serif text-[22px] leading-[1.15] lg:text-[26px]">{v.t}</span>
                </h3>
                <p className={`m-0 text-[15px] leading-[1.5] ${light ? "text-body" : "text-on-dark-muted"}`}>{v.d}</p>
                <p
                  className={`m-0 mt-auto inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-[13px] leading-none ${
                    light ? "border-[rgba(10,62,68,.2)] text-body" : "border-[rgba(247,244,238,.25)] text-on-dark-muted"
                  }`}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 7.5V12l3 2" />
                  </svg>
                  {v.time}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <ClinicSectionHead title={t.outOfStatePage.handleTitle} />
        <ClinicFeatureGrid items={content.perks} />
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:sticky lg:top-8 lg:text-5xl lg:leading-[1.1]">
            {t.outOfStatePage.faqTitle}
          </h2>
          <FaqAccordion faqs={faqs} name="travel-faq" className="flex flex-col gap-3" locale={locale} />
        </div>
      </section>

      <section className="wrap py-16 lg:py-28">
        <ClinicPhotoCta locale={locale} />
      </section>
    </main>
  );
}
