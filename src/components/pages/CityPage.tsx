// "Veneers <city>" pages for the cities out-of-state patients come from most.
// Content: src/content/cities/<city>.json (EN) and src/content/es/cities/ (ES).
// Every number comes from prices.json / site.json through {placeholders}; no fares or hotel prices are shown.
import Link from "next/link";
import { ClinicFeatureGrid, ClinicHero, ClinicPhotoCta, ClinicSectionHead, clinicDarkPanel } from "@/components/ClinicSections";
import FaqAccordion from "@/components/FaqAccordion";
import FeatureIcon from "@/components/FeatureIcons";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import ScrollRow from "@/components/ScrollRow";
import CaseCard from "@/components/CaseCard";
import PatientStories from "@/components/home/PatientStories";
import Inline from "@/components/blog/Inline";
import { prices as pricesEn } from "@/lib/content";
import { getContent, packageById, tpl, ui, type Faq } from "@/lib/content-i18n";
import { localizeHref, localizePath, type Locale } from "@/lib/i18n";
import { faqPage, pageGraph } from "@/lib/schema";
import { site, type PagePath } from "@/lib/site";

/** Shape of src/content/cities/*.json. Strings may use [text](href) links and {price}/{veneerPrice}/{depositUsd}/{replyHours}/{warrantyYears}. */
export type CityContent = {
  path: string;
  city: string;
  breadcrumb: string;
  /** Missing real data, listed in the PR; never rendered. */
  todo?: string;
  hero: { lead: string; image: string; alt: string; caption: string };
  intro: string[];
  gettingHere: { title: string; aside?: string; items: { t: string; d: string; icon?: string }[] };
  itinerary: { title: string; intro: string; days: { k: string; t: string; d: string; time: string }[]; note?: string };
  /** A consented clip from stories.json for a patient from this city; the section is hidden without a storyId. */
  story: { title: string; body: string; storyId?: string; todo?: string };
  cost: { title: string; body: string; lines: { label: string; value: string; note?: string }[]; footnote: string; links: { label: string; href: string }[] };
  results: { title: string; label: string };
  faq: { title: string; items: Faq[] };
};

/** Cases in the results carousel; the rest are on /before-and-after. */
const MAX_CASES = 9;
const dayIcons = ["plane", "prep", "sun", "delivery"];
const h2 = "m-0 font-serif text-[34px] leading-[1.2] font-normal text-pretty lg:text-[48px] lg:leading-[1.1]";

export default function CityPage({ data, locale = "en" }: { data: CityContent; locale?: Locale }) {
  const t = ui(locale);
  const { pages, cases, stories } = getContent(locale);
  const path = data.path as PagePath;
  const pkg = packageById(locale, "signature-veneers");
  // One veneer à la carte (English price list; the number is the same in both languages).
  const veneerItem = pricesEn.groups.flatMap((g) => g.items).find((i) => i.name === "Veneer");
  const facts: Record<string, string | number> = {
    price: pkg.price,
    veneerPrice: veneerItem?.price ?? "",
    warrantyYears: site.warrantyYears,
    replyHours: site.replyHours,
    depositUsd: site.depositUsd,
  };
  const fill = (s: string) => tpl(s, facts);
  // Filled answers feed both the accordion and the FAQPage schema, so they always match.
  const faqs = data.faq.items.map((f) => ({ ...f, a: fill(f.a) }));
  const story = data.story.storyId ? stories.find((s) => s.id === data.story.storyId) : undefined;
  const shownCases = cases.cases.filter((c) => c.type === "Veneers").slice(0, MAX_CASES);
  const evaluation = localizePath("/free-photo-evaluation", locale);
  const hub = localizePath("/out-of-state-patients", locale);

  return (
    <main id="main">
      <JsonLd data={pageGraph(path, locale, faqPage(faqs))} />
      <PageHero locale={locale}>
        <ClinicHero
          trail={[
            { label: t.home, href: localizePath("/", locale) },
            { label: t.breadcrumb.outOfState, href: hub },
            { label: pages[path].breadcrumb ?? data.breadcrumb },
          ]}
          title={pages[path].h1}
          lead={fill(data.hero.lead)}
          media={
            <>
              <Img src={data.hero.image} alt={data.hero.alt} sizes="(min-width: 1024px) 480px, calc(100vw - 40px)" className="block aspect-[4/3] h-auto w-full object-cover" priority />
              <div className="absolute bottom-3.5 left-4 text-xs text-[rgba(247,244,238,.85)] [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">{data.hero.caption}</div>
            </>
          }
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3.5">
            <Link href={evaluation} className="btn btn-gold h-[52px] px-6 text-[17px]">
              {t.freePhotoEvaluation}
            </Link>
            <a href="#itinerary" className="btn h-[52px] border-[1.5px] border-[rgba(247,244,238,.4)] px-[22px] text-base text-on-dark hover:bg-[rgba(247,244,238,.1)] hover:text-on-dark">
              {data.itinerary.title}
            </a>
          </div>
        </ClinicHero>
      </PageHero>

      {/* Why patients from this city come, with links to the treatment pages. */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="mx-auto flex max-w-[760px] flex-col gap-5">
          {data.intro.map((para, i) => (
            <p key={i} className="m-0 text-[17px] leading-[1.6] text-pretty text-body lg:text-lg">
              <Inline text={fill(para)} locale={locale} />
            </p>
          ))}
        </div>
      </section>

      {/* Flights, drive, airport. */}
      <section className="wrap pt-16 lg:pt-28">
        <ClinicSectionHead title={data.gettingHere.title} aside={data.gettingHere.aside} />
        <ClinicFeatureGrid items={data.gettingHere.items.map((i) => ({ ...i, d: fill(i.d) }))} />
      </section>

      {/* Sample Monday-to-Thursday, in the visit-card style of the hub. */}
      <section id="itinerary" className="wrap scroll-mt-6 pt-16 lg:pt-28">
        <ClinicSectionHead title={data.itinerary.title} aside={data.itinerary.intro} />
        <ol className="m-0 grid list-none gap-3 p-0 lg:grid-cols-4 lg:gap-4">
          {data.itinerary.days.map((d, i) => {
            const light = i === 2;
            return (
              <li
                key={d.k}
                className={`flex flex-col gap-4 rounded-2xl border border-[rgba(255,255,255,.7)] px-5 py-6 shadow-[0_1px_0_rgba(255,255,255,.6)_inset,0_12px_32px_rgba(26,26,26,.06)] lg:min-h-[260px] lg:rounded-[18px] lg:px-6 lg:py-[26px] ${
                  light ? "bg-[rgba(255,253,248,.55)] text-ink" : "bg-[linear-gradient(150deg,rgba(10,62,68,.94)_0%,rgba(4,40,46,.92)_100%)] text-on-dark"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`grid h-10 w-10 flex-none place-items-center rounded-full ${light ? "bg-teal text-gold" : "bg-[rgba(205,177,128,.18)] text-gold"}`}>
                    <FeatureIcon name={dayIcons[Math.min(i, dayIcons.length - 1)]} plain />
                  </span>
                  <span className={`eyebrow font-sans ${light ? "text-gold-text" : "text-gold"}`}>{d.k}</span>
                </div>
                <h3 className="m-0 font-serif text-[22px] leading-[1.15] font-normal lg:text-[24px]">{d.t}</h3>
                <p className={`m-0 text-[15px] leading-[1.5] ${light ? "text-body" : "text-on-dark-muted"}`}>{fill(d.d)}</p>
                <p className={`m-0 mt-auto text-[13px] leading-[1.45] ${light ? "text-body" : "text-on-dark-muted"}`}>{d.time}</p>
              </li>
            );
          })}
        </ol>
        {data.itinerary.note && <p className="m-0 mt-5 max-w-[760px] text-[15px] leading-[1.5] text-muted">{fill(data.itinerary.note)}</p>}
        <p className="m-0 mt-4">
          <Link href={hub} className="inline-flex min-h-11 items-center font-semibold lg:min-h-0">
            {t.cityPage.hubLink}
          </Link>
        </p>
      </section>

      {/* A patient from this city, in their own words. Hidden until a consented clip exists (see the JSON's todo). */}
      {story && (
        <section className="wrap pt-16 lg:pt-28">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
            <div className="flex flex-col gap-4">
              <span className="eyebrow text-gold-text">{t.storiesTitle}</span>
              <h2 className={h2}>{data.story.title}</h2>
              <p className="m-0 text-[17px] leading-[1.55] text-pretty text-body lg:text-lg">{data.story.body}</p>
              {story.doctor && (
                <p className="m-0 text-[15px] text-muted">
                  {story.name} · {story.treatment} · {story.doctor}
                </p>
              )}
            </div>
            <div className="mx-auto w-full max-w-[320px]">
              <PatientStories stories={[story]} locale={locale} layout="grid" />
            </div>
          </div>
        </section>
      )}

      {/* What it costs to come: treatment from prices.json, travel booked by the patient, no fares. */}
      <section className="wrap pt-16 lg:pt-28">
        <div className={`${clinicDarkPanel} grid items-start gap-8 p-6 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-14`}>
          <div className="flex flex-col gap-4">
            <span className="eyebrow text-gold">{t.cityPage.costEyebrow}</span>
            <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-normal text-pretty lg:text-[44px] lg:leading-[1.06]">{data.cost.title}</h2>
            <p className="m-0 text-[17px] leading-[1.55] text-pretty text-on-dark-muted [&_a]:text-gold">
              <Inline text={fill(data.cost.body)} locale={locale} />
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {data.cost.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={localizeHref(l.href, locale)}
                    className="inline-flex min-h-10 items-center rounded-full border border-[rgba(247,244,238,.35)] px-4 text-[14px] font-semibold text-on-dark no-underline hover:border-gold hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col rounded-2xl border border-[rgba(255,255,255,.8)] bg-[rgba(247,244,238,.92)] px-5 py-2 text-ink lg:px-7">
            {data.cost.lines.map((l) => (
              <div key={l.label} className="flex flex-col gap-1 border-b border-ink/10 py-4 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[16px] font-semibold text-ink">{l.label}</span>
                  {l.note && <span className="text-[13.5px] leading-[1.45] text-muted">{fill(l.note)}</span>}
                </div>
                <span className="font-serif text-[24px] leading-[1.1] text-teal sm:max-w-[45%] sm:text-right lg:text-[28px]">{fill(l.value)}</span>
              </div>
            ))}
            <p className="m-0 border-t border-ink/10 py-4 text-[13.5px] leading-[1.5] text-muted">{fill(data.cost.footnote)}</p>
          </div>
        </div>
      </section>

      {/* Results: real veneer cases, the same consented photos as every treatment page. */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className={h2}>{data.results.title}</h2>
          <Link href={localizePath("/before-and-after", locale)} className="inline-flex min-h-11 items-center font-semibold lg:min-h-0">
            {t.allCases}
          </Link>
        </div>
        <ScrollRow locale={locale} ariaLabel={data.results.title} caption={tpl(t.results.casesCaption, { shown: shownCases.length })}>
          {shownCases.map((c) => (
            <li key={c.id} className="flex-[0_0_78%] snap-start lg:flex-[0_0_calc((100%-40px)/3)]">
              <CaseCard c={c} locale={locale} sizes="(min-width: 1024px) 380px, 78vw" />
            </li>
          ))}
        </ScrollRow>
      </section>

      {/* FAQ: city-specific questions, shared with the FAQPage schema above. */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className={`${h2} lg:sticky lg:top-8`}>{data.faq.title}</h2>
          <FaqAccordion faqs={faqs} name="city-faq" className="flex flex-col gap-3" locale={locale} />
        </div>
      </section>

      <section className="wrap py-16 lg:py-28">
        <ClinicPhotoCta locale={locale} />
      </section>
    </main>
  );
}
