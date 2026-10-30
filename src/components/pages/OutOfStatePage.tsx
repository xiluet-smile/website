// Out-of-state hub: the whole trip in order (from home, the week, hotels and rides,
// what to pack, companions) and the grid of "Veneers <city>" pages.
// Content: src/content/out-of-state.json (+ es). Numbers come from site.json via fillFacts.
import Link from "next/link";
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
import Inline from "@/components/blog/Inline";
import { getContent, tpl, ui } from "@/lib/content-i18n";
import { localizeHref, localizePath, type Locale } from "@/lib/i18n";
import { imageInfo } from "@/lib/images";
import { faqPage, pageGraph } from "@/lib/schema";

const PATH = "/out-of-state-patients" as const;

const POSTER = "out-of-state-poster.jpg";
const mediaClass = "block aspect-[4/3] h-auto w-full object-cover";
const h2 = "m-0 font-serif text-[34px] leading-[1.2] font-normal lg:text-5xl lg:leading-[1.1]";
const para = "m-0 text-[17px] leading-[1.6] text-pretty text-body lg:text-lg";

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

      {/* Why the week works, and which treatments it applies to. */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="mx-auto flex max-w-[760px] flex-col gap-5">
          {content.intro.map((p, i) => (
            <p key={i} className={para}>
              <Inline text={fillFacts(p)} locale={locale} />
            </p>
          ))}
        </div>
      </section>

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

      {/* What happens from home first: six numbered steps, links to the evaluation, price list and financing. */}
      <section className="wrap pt-16 lg:pt-28">
        <ClinicSectionHead title={content.fromHome.title} aside={content.fromHome.aside} />
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {content.fromHome.items.map((f) => (
            <li key={f.t} className="glass-card flex flex-col gap-2.5 rounded-2xl p-5 lg:min-h-[150px] lg:rounded-[18px] lg:p-6">
              {f.icon && <FeatureIcon name={f.icon} className="mb-1" />}
              <h3 className="m-0 font-serif text-xl leading-[1.2] font-normal text-teal lg:text-[22px]">{f.t}</h3>
              <p className="m-0 text-[15px] leading-[1.5] text-body">
                <Inline text={fillFacts(f.d)} locale={locale} />
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <ClinicSectionHead title={t.outOfStatePage.handleTitle} />
        <ClinicFeatureGrid items={content.perks} />
      </section>

      {/* Airport, rides and hotel, plainly: what the clinic does and does not arrange. */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className={`${h2} lg:sticky lg:top-8`}>{content.travel.title}</h2>
          <div className="flex flex-col gap-5">
            {content.travel.body.map((p, i) => (
              <p key={i} className={para}>
                <Inline text={fillFacts(p)} locale={locale} />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* What to pack, and who can come with you. */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="glass-card flex flex-col gap-4 rounded-2xl p-6 lg:rounded-[20px] lg:p-8">
            <h2 className="m-0 font-serif text-[28px] leading-[1.2] font-normal text-teal lg:text-[34px]">{content.pack.title}</h2>
            <p className="m-0 text-[16px] leading-[1.55] text-body">{content.pack.intro}</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {content.pack.items.map((item) => (
                <li key={item} className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-3 text-[15.5px] leading-[1.5] text-body">
                  <svg viewBox="0 0 18 18" width="18" height="18" className="mt-0.5" aria-hidden="true">
                    <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="#CDB180" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="dark-panel flex flex-col gap-4 rounded-2xl p-6 shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] lg:rounded-[20px] lg:p-8">
            <h2 className="m-0 font-serif text-[28px] leading-[1.2] font-normal lg:text-[34px]">{content.companions.title}</h2>
            <p className="m-0 text-[16px] leading-[1.6] text-pretty text-on-dark-muted lg:text-[17px]">{content.companions.body}</p>
          </div>
        </div>
      </section>

      {/* Patients come from: the city pages. */}
      <section className="wrap pt-16 lg:pt-28">
        <ClinicSectionHead title={content.cities.title} aside={content.cities.intro} />
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {content.cities.items.map((c) => (
            <li key={c.href}>
              <Link
                href={localizeHref(c.href, locale)}
                className="glass-card flex h-full flex-col gap-2 rounded-2xl p-5 text-ink no-underline transition-colors hover:border-gold lg:rounded-[18px] lg:p-6"
              >
                <span className="font-serif text-[24px] leading-[1.15] text-teal lg:text-[26px]">{c.name}</span>
                <span className="text-[15px] leading-[1.5] text-body">{c.d}</span>
                <span className="mt-auto pt-2 text-[14px] font-semibold text-gold-text">{t.learnMore}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className={`${h2} lg:sticky lg:top-8`}>{t.outOfStatePage.faqTitle}</h2>
          <FaqAccordion faqs={faqs} name="travel-faq" className="flex flex-col gap-3" locale={locale} />
        </div>
      </section>

      <section className="wrap py-16 lg:py-28">
        <ClinicPhotoCta locale={locale} />
      </section>
    </main>
  );
}
