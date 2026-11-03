import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import FeatureIcon from "@/components/FeatureIcons";
import { CameraIcon } from "@/components/Icons";
import Img from "@/components/Img";
import LineIcon, { type LineIconName } from "@/components/LineIcon";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import ScrollRow from "@/components/ScrollRow";
import {
  caseById,
  getContent,
  packageById,
  tpl,
  ui,
  type Faq,
} from "@/lib/content-i18n";
import { localizeHref, localizePath, type Locale } from "@/lib/i18n";
import { postsForTreatment } from "@/lib/blog";
import { PostCard } from "@/components/blog/BlogArticle";
import Inline from "@/components/blog/Inline";
import { prices as pricesEn } from "@/lib/content";
import { faqPage, medicalProcedure, pageGraph, procedureOffer } from "@/lib/schema";
import { site, type PagePath } from "@/lib/site";

/** Shape of src/content/treatments/*.json. */
export type Treatment = {
  path: string;
  /** Package in prices.json that supplies the dollar amount (card, hero stat, JSON-LD offer). */
  packageId: string;
  breadcrumb: string;
  schema: { name: string; procedureType: string };
  hero: {
    definition: string;
    lead: string;
    secondaryCta: string;
    /** kind "price" renders the package price, "rating" the Google rating from site.json. */
    stats: { kind: string; value?: string; label: string }[];
    /** Either a patient case (caseId) or an editorial image (src + alt). */
    image: { caseId?: string; src?: string; alt?: string; caption: string };
  };
  candidates: {
    title: string;
    intro: string;
    items: { t: string; d: string }[];
  };
  /** Optional link under the candidates grid to the sibling page (Smile Design ↔ veneers à la carte). */
  crossLink?: { label: string; href: string };
  /**
   * Optional page-specific guide: prose sections rendered after "why". Strings may use [text](href) links,
   * **bold**, and the placeholders {price} (package), {veneerPrice} (one veneer à la carte), {warrantyYears},
   * {replyHours} and {depositUsd}, filled from prices.json and site.json so numbers never live in the copy.
   */
  sections?: { id?: string; eyebrow?: string; title: string; body: string[]; bullets?: { t: string; d: string }[]; links?: { label: string; href: string }[] }[];
  why: {
    eyebrow: string;
    title: string;
    body: string;
    image: { src: string; alt: string } | null;
    facts: { label: string; big: string; sub: string; icon?: string }[];
  };
  /** Opt-in "The material" section (shared copy from content/material.json) with a page-specific lead sentence. */
  material?: { intro: string };
  week: {
    title: string;
    intro: string;
    linkLabel: string;
    visits: { k: string; t: string; d: string; time: string }[];
  };
  results: {
    title: string;
    linkLabel: string;
    /** Patient cases from cases.json, captioned with `label`. */
    label?: string;
    /** Curated cases shown first, in this order. */
    caseIds?: string[];
    /** Case types (cases.json → types) that fill the carousel after the curated ones, up to MAX_RESULT_CASES. */
    caseTypes?: string[];
    /** Editorial (non-patient) images, used when there are no cases to show. */
    editorial?: { src: string; label: string; cap: string; alt: string }[];
  };
  price: {
    eyebrow: string;
    title: string;
    body: string;
    lendersLabel: string;
    compareLabel: string;
    card: {
      title: string;
      sub: string;
      badge: string;
      pricePrefix: string | null;
      priceSuffix: string | null;
      included: string[];
      cta: string;
    };
    footnote: string;
  };
  faq: { title: string; linkLabel: string; items: Faq[] };
  cta: {
    title: string;
    body: string;
    cardTitle: string;
    cardBody: string;
    button: string;
  };
};

const h2 =
  "m-0 font-serif text-[34px] leading-[1.2] font-normal text-pretty lg:text-[48px] lg:leading-[1.1]";
const sectionHead =
  "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8";
/** Cases per treatment results carousel; the rest are on /before-and-after. */
const MAX_RESULT_CASES = 12;
const photoLabel =
  "absolute text-[11px] font-semibold tracking-[.14em] text-on-dark uppercase [text-shadow:0_1px_8px_rgba(0,0,0,.5)]";
const panelShadow =
  "shadow-[inset_0_1px_0_rgba(247,244,238,.18),0_30px_80px_rgba(4,40,46,.32)]";

// One icon per step of the week: from home, exam, preparation, then delivery for any later visit.
const visitIcons = ["photo", "exam", "prep", "delivery"];

export default function TreatmentPage({
  data,
  locale = "en",
}: {
  data: Treatment;
  locale?: Locale;
}) {
  const t = ui(locale);
  const { pages, lenders, cases } = getContent(locale);
  const path = data.path as PagePath;
  const pkg = packageById(locale, data.packageId);
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
  const { hero, candidates, why, week, results, cta } = data;
  const sections = (data.sections ?? []).map((sec) => ({
    ...sec,
    body: sec.body.map(fill),
    bullets: sec.bullets?.map((b) => ({ t: fill(b.t), d: fill(b.d) })),
  }));
  const price = {
    ...data.price,
    title: fill(data.price.title),
    body: fill(data.price.body),
    card: { ...data.price.card, sub: fill(data.price.card.sub), included: data.price.card.included.map(fill) },
    footnote: fill(data.price.footnote),
  };
  // Filled answers feed both the accordion and the FAQPage schema, so they always match.
  const faq = { ...data.faq, items: data.faq.items.map((f) => ({ ...f, a: fill(f.a) })) };
  // Results carousel: the curated cases first, then every other case of the treatment's types.
  const curated = (results.caseIds ?? []).map((id) => caseById(locale, id));
  const filler = cases.cases.filter((c) => (results.caseTypes ?? []).includes(c.type) && !curated.some((x) => x.id === c.id));
  const shownCases = [...curated, ...filler].slice(0, MAX_RESULT_CASES);
  const { material, glossary } = getContent(locale);
  const heroCase = hero.image.caseId
    ? caseById(locale, hero.image.caseId)
    : null;
  const evaluation = localizePath("/free-photo-evaluation", locale);
  // Articles tag treatments by route slug without the "-miami" suffix (e.g. "smile-design").
  const guides = postsForTreatment(
    locale,
    data.path.replace(/^\//, "").replace(/-miami$/, ""),
  ).slice(0, 3);

  return (
    <main id="main">
      <JsonLd
        data={pageGraph(
          path,
          locale,
          medicalProcedure(
            path,
            {
              name: data.schema.name,
              definition: hero.definition,
              procedureType: data.schema.procedureType,
              priceUsd: pkg.priceUsd,
            },
            locale,
          ),
          ...procedureOffer(path, { name: data.schema.name, priceUsd: pkg.priceUsd }, locale),
          faqPage(faq.items),
        )}
      />

      <PageHero locale={locale}>
        <div className="wrap relative z-[2] grid gap-10 pt-8 pb-12 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center lg:gap-14 lg:pt-14 lg:pb-20">
          <div className="flex flex-col gap-5 lg:gap-[26px]">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap gap-2 text-[13px] text-on-dark-muted"
            >
              <Link
                href={localizePath("/", locale)}
                className="text-on-dark-muted no-underline hover:text-gold"
              >
                {t.home}
              </Link>
              <span aria-hidden="true">/</span>
              <span>{t.breadcrumb.treatments}</span>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-gold">
                {data.breadcrumb}
              </span>
            </nav>
            <h1 className="m-0 max-w-[16ch] font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] text-balance lg:text-[60px] lg:leading-[1.04]">
              {pages[path].h1}
            </h1>
            {/* hero.definition feeds the MedicalProcedure schema only; the visible box was removed at the clinic's request. */}
            <p className="m-0 max-w-[54ch] text-[17px] leading-[1.5] text-pretty text-on-dark-muted lg:text-xl">
              {hero.lead}
            </p>
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3.5">
              <Link
                href={evaluation}
                className="btn btn-gold h-[52px] pr-6 pl-5 text-[17px]"
              >
                <CameraIcon />
                {t.freePhotoEvaluation}
              </Link>
              <a
                href="#week"
                className="btn h-[52px] border-[1.5px] border-[rgba(247,244,238,.4)] px-[22px] text-base text-on-dark hover:bg-[rgba(247,244,238,.1)] hover:text-on-dark"
              >
                {hero.secondaryCta}
              </a>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-[18px] border-t border-[rgba(247,244,238,.16)] pt-[22px] lg:grid-cols-4 lg:gap-x-0">
              {hero.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-0.5 lg:border-l lg:border-[rgba(247,244,238,.16)] lg:px-5 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
                >
                  <span className="font-serif text-2xl leading-none whitespace-nowrap lg:text-[28px]">
                    {s.kind === "price" ? (
                      pkg.price
                    ) : s.kind === "veneerPrice" ? (
                      facts.veneerPrice
                    ) : s.kind === "rating" ? (
                      <>
                        {site.rating.value}{" "}
                        <span className="font-sans text-base text-on-dark-muted">
                          · {site.rating.count}
                        </span>
                      </>
                    ) : (
                      s.value
                    )}
                  </span>
                  <span className="text-sm text-on-dark-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[24px] border border-[rgba(247,244,238,.14)] shadow-[0_30px_80px_rgba(0,0,0,.35)]">
            {heroCase ? (
              <>
                <Img
                  src={heroCase.image}
                  alt={heroCase.alt}
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="block h-auto w-full"
                  priority
                />
                <div className={`${photoLabel} top-4 left-4`}>{t.before}</div>
                <div className={`${photoLabel} top-4 right-4`}>{t.after}</div>
              </>
            ) : (
              <Img
                src={hero.image.src!}
                alt={hero.image.alt ?? ""}
                sizes="(min-width: 1024px) 480px, 100vw"
                className="block aspect-[4/5] w-full object-cover object-[50%_30%] lg:aspect-[5/6]"
                priority
              />
            )}
            <div className="absolute bottom-3.5 left-4 text-xs text-[rgba(247,244,238,.85)] [text-shadow:0_1px_8px_rgba(0,0,0,.6)]">
              {hero.image.caption}
            </div>
          </div>
        </div>
      </PageHero>

      {/* Is this for you */}
      <section className="wrap pt-16 lg:pt-28">
        <div className={`${sectionHead} mb-7 lg:mb-10`}>
          <h2 className={h2}>{candidates.title}</h2>
          <p className="m-0 text-[17px] leading-[1.5] text-pretty text-body lg:mb-2 lg:max-w-[400px] lg:text-right">
            {candidates.intro}
          </p>
        </div>
        <ol className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {candidates.items.map((c, i) => (
            <li
              key={c.t}
              className="glass-card grid grid-cols-[36px_minmax(0,1fr)] gap-x-3.5 gap-y-1.5 rounded-2xl p-4 lg:flex lg:flex-col lg:gap-3 lg:rounded-[18px] lg:p-5"
            >
              <span
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full bg-teal font-serif text-[16px] leading-none text-on-dark"
              >
                {i + 1}
              </span>
              <h3 className="m-0 self-center font-serif text-[20px] leading-[1.2] font-normal text-pretty text-teal lg:mt-1 lg:text-[21px]">
                {c.t}
              </h3>
              <p className="col-start-2 m-0 text-[15px] leading-[1.5] text-pretty text-body lg:col-auto lg:text-[14.5px]">
                {c.d}
              </p>
            </li>
          ))}
        </ol>
        {data.crossLink && (
          <p className="m-0 mt-6 text-[16px] lg:text-right">
            <Link href={localizeHref(data.crossLink.href, locale)} className="inline-flex min-h-11 items-center font-semibold lg:min-h-0">
              {data.crossLink.label}
            </Link>
          </p>
        )}
      </section>

      {/* The terms, explained: one illustrated card per restoration type, shared by every treatment page. */}
      <section className="wrap pt-16 lg:pt-28" aria-labelledby="glossary-title">
        <div className="mb-7 flex flex-col gap-3 lg:mb-10 lg:max-w-[720px]">
          <span className="eyebrow text-gold-text">{glossary.eyebrow}</span>
          <h2 id="glossary-title" className={h2}>
            {glossary.title}
          </h2>
          <p className="m-0 text-[17px] leading-[1.5] text-pretty text-body lg:text-lg">{glossary.intro}</p>
        </div>
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {glossary.items.map((g) => (
            <li key={g.id} className="glass-card grid grid-cols-[112px_minmax(0,1fr)] items-center gap-4 overflow-hidden rounded-2xl lg:grid-cols-[136px_minmax(0,1fr)] lg:rounded-[18px]">
              <div className="self-stretch bg-[#F7F4EE]">
                <Img src={g.image} alt={g.alt} sizes="136px" className="block h-full w-full object-contain" />
              </div>
              <div className="flex flex-col gap-1 py-4 pr-4 lg:py-5 lg:pr-5">
                <h3 className="m-0 font-serif text-[19px] leading-[1.2] font-normal text-teal lg:text-[21px]">{g.t}</h3>
                <p className="m-0 text-[13.5px] leading-[1.45] text-pretty text-body lg:text-[14px]">{g.d}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Why here: the claim and its proof. Headline and lead on top, then the lab photo beside four fact cards. */}
      <section className="wrap pt-16 lg:pt-28">
        <div className={`dark-panel ${panelShadow} flex flex-col gap-7 rounded-2xl p-6 lg:gap-10 lg:rounded-[20px] lg:p-14`}>
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:items-end lg:gap-14">
            <div className="flex flex-col gap-4">
              <span className="eyebrow text-gold">{why.eyebrow}</span>
              <h2 className="m-0 max-w-[16ch] font-serif text-[34px] leading-[1.15] font-normal text-pretty lg:text-[52px] lg:leading-[1.04]">
                {why.title}
              </h2>
            </div>
            <p className="m-0 max-w-[48ch] text-[17px] leading-[1.55] text-pretty text-on-dark-muted lg:pb-1.5 lg:text-lg">
              {why.body}
            </p>
          </div>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] lg:gap-6">
            {why.image && (
              <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-[rgba(247,244,238,.18)] lg:aspect-auto">
                <Img
                  src={why.image.src}
                  alt={why.image.alt}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  className="block h-full w-full object-cover"
                />
              </div>
            )}
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:gap-4">
              {why.facts.map((w) => (
                <li
                  key={w.label}
                  className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-[rgba(255,255,255,.28)] bg-[linear-gradient(160deg,rgba(255,253,248,.22)_0%,rgba(255,253,248,.1)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_16px_40px_rgba(0,0,0,.25)] backdrop-blur-[22px] backdrop-saturate-[1.4] lg:min-h-[200px] lg:gap-5 lg:rounded-[20px] lg:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 left-0 h-0.5 bg-[linear-gradient(90deg,rgba(205,177,128,0)_0%,#CDB180_40%,rgba(247,244,238,.9)_70%,rgba(247,244,238,0)_100%)]"
                  />
                  <span className="flex items-center gap-3">
                    {w.icon && (
                      <span className="grid h-9 w-9 flex-none place-items-center rounded-full border border-[rgba(205,177,128,.45)] bg-[rgba(205,177,128,.14)]">
                        <span className="block h-[18px] w-[18px]">
                          <LineIcon name={w.icon as LineIconName} tone="gold" />
                        </span>
                      </span>
                    )}
                    <span className="text-[12px] leading-tight font-semibold tracking-[.08em] text-on-dark-muted uppercase">{w.label}</span>
                  </span>
                  <span className="mt-auto flex flex-col gap-1.5">
                    <span className="font-serif text-[24px] leading-none tracking-[-.02em] text-on-dark lg:text-[34px]">{w.big}</span>
                    <span className="text-[13px] leading-[1.45] text-on-dark-muted lg:text-sm">{w.sub}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Page-specific guide: prose sections with optional bullet cards and links. */}
      {sections.length > 0 && (
        <section className="wrap pt-16 lg:pt-28">
          <div className="flex flex-col gap-14 lg:gap-20">
            {sections.map((sec) => (
              <article key={sec.title} id={sec.id} className="grid gap-6 scroll-mt-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
                <div className="flex flex-col gap-3 lg:sticky lg:top-8">
                  {sec.eyebrow && <span className="eyebrow text-gold-text">{sec.eyebrow}</span>}
                  <h2 className={h2}>{sec.title}</h2>
                </div>
                <div className="flex flex-col gap-5">
                  {sec.body.map((para, i) => (
                    <p key={i} className="m-0 text-[17px] leading-[1.6] text-pretty text-body lg:text-lg">
                      <Inline text={para} locale={locale} />
                    </p>
                  ))}
                  {sec.bullets && (
                    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
                      {sec.bullets.map((b) => (
                        <li key={b.t} className="glass-card flex flex-col gap-1.5 rounded-2xl p-4 lg:p-5">
                          <h3 className="m-0 font-serif text-[20px] leading-[1.2] font-normal text-teal">{b.t}</h3>
                          <p className="m-0 text-[15px] leading-[1.5] text-body">
                            <Inline text={b.d} locale={locale} />
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {sec.links && (
                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                      {sec.links.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={localizeHref(l.href, locale)}
                            className="inline-flex min-h-10 items-center rounded-full border border-teal/30 bg-white/60 px-4 text-[14px] font-semibold text-teal no-underline hover:bg-teal hover:text-on-dark"
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* The material */}
      {data.material && (
        <section id="material" className="wrap scroll-mt-6 pt-16 lg:pt-28">
          <div className="mb-8 flex max-w-[760px] flex-col gap-3 lg:mb-10">
            <span className="eyebrow text-gold-text">{material.eyebrow}</span>
            <h2 className={h2}>{material.title}</h2>
            <p className="m-0 text-[17px] leading-[1.55] text-pretty text-body lg:text-lg">
              {data.material.intro} {material.body}
            </p>
          </div>

          {/* One idea per row: photo on one side, the point on the other, one point per card. */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {material.features.map((f, i) => (
              <article
                key={f.img}
                className="glass-card grid overflow-hidden rounded-2xl lg:grid-cols-2 lg:items-stretch lg:rounded-[20px]"
              >
                <Img
                  src={f.img}
                  alt={f.alt}
                  sizes="(min-width: 1024px) 600px, 100vw"
                  className={`block aspect-[4/3] h-full w-full object-cover ${i % 2 ? "lg:order-2" : ""}`}
                />
                <div className="flex flex-col justify-center gap-3 p-6 lg:gap-4 lg:p-10">
                  <span className="eyebrow text-gold-text">{f.kicker}</span>
                  <h3 className="m-0 font-serif text-[26px] leading-[1.15] font-normal text-teal lg:text-[32px]">{f.title}</h3>
                  <p className="m-0 text-[16px] leading-[1.55] text-body lg:text-[17px]">{f.text}</p>
                </div>
              </article>
            ))}
          </div>

          {/* The numbers, in the same card style as the "why" facts. */}
          <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-3 p-0 lg:mt-6 lg:grid-cols-4 lg:gap-4">
            {material.glance.map((g) => (
              <li key={g.label} className="flex flex-col gap-3 rounded-2xl border border-sand bg-card p-4 lg:min-h-[170px] lg:p-5">
                <span className="text-sm text-muted">{g.label}</span>
                <span className="mt-auto flex flex-col gap-1.5">
                  <span className="font-serif text-[28px] leading-none tracking-[-.02em] text-teal lg:text-[36px]">{g.big}</span>
                  <span className="text-[13px] leading-[1.45] text-muted lg:text-sm">{g.sub}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* Full table on demand. */}
          <details className="group mt-6">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-teal [&::-webkit-details-marker]:hidden">
              {material.detailsLabel}
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="transition-transform duration-200 group-open:rotate-180">
                <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="glass-card mt-4 rounded-2xl p-5 lg:p-7">
              <h3 className="m-0 mb-4 font-serif text-[22px] leading-[1.15] font-normal text-teal lg:text-[26px]">{material.compareTitle}</h3>
              <div className="-mx-1 overflow-x-auto px-1">
                <table className="w-full min-w-[520px] border-collapse text-[15px] leading-[1.45] lg:text-base">
                  <thead>
                    <tr>
                      {material.table.head.map((cell, i) => (
                        <th key={i} className="border-b-2 border-gold/60 py-2.5 pr-4 text-left font-semibold text-teal">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {material.table.rows.map((row, r) => (
                      <tr key={r} className="border-b border-ink/10 align-top">
                        {row.map((cell, c) => (
                          <td key={c} className={`py-2.5 pr-4 text-body ${c === 0 ? "font-semibold whitespace-nowrap text-ink" : ""}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="m-0 mt-4 text-[13px] leading-[1.45] text-muted">{material.footnote}</p>
            </div>
          </details>
        </section>
      )}

      {/* The week */}
      <section id="week" className="wrap scroll-mt-6 pt-16 lg:pt-28">
        <div className={`${sectionHead} mb-7 lg:mb-10`}>
          <div>
            <h2 className={`${h2} mb-3`}>{week.title}</h2>
            <p className="m-0 max-w-[52ch] text-[17px] text-body lg:text-lg">
              {week.intro}
            </p>
          </div>
          <Link
            href={localizePath("/out-of-state-patients", locale)}
            className="inline-flex min-h-11 items-center font-semibold lg:min-h-0 lg:whitespace-nowrap"
          >
            {week.linkLabel}
          </Link>
        </div>
        <ol className="m-0 grid list-none gap-4 p-0 lg:grid-cols-4">
          {week.visits.map((v, i) => {
            const dark = i > 0;
            return (
              <li
                key={v.k}
                className={`flex flex-col gap-4 rounded-2xl p-5 lg:min-h-[240px] lg:rounded-[18px] lg:px-6 lg:py-[26px] ${
                  dark
                    ? "border border-[rgba(255,255,255,.7)] bg-[linear-gradient(150deg,rgba(10,62,68,.94)_0%,rgba(4,40,46,.92)_100%)] text-on-dark shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_12px_32px_rgba(26,26,26,.06)]"
                    : "glass-card text-ink"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`eyebrow ${dark ? "text-gold" : "text-gold-text"}`}
                  >
                    {v.k}
                  </span>
                  <span
                    className={`grid h-10 w-10 flex-none place-items-center rounded-full ${dark ? "bg-[rgba(205,177,128,.16)] text-gold" : "bg-[rgba(205,177,128,.18)] text-teal"}`}
                  >
                    <FeatureIcon
                      name={visitIcons[Math.min(i, visitIcons.length - 1)]}
                      plain
                    />
                  </span>
                </div>
                <h3 className="m-0 font-serif text-[22px] leading-[1.15] font-normal lg:text-[26px]">
                  {v.t}
                </h3>
                <p
                  className={`m-0 text-[15px] leading-[1.5] ${dark ? "text-on-dark-muted" : "text-body"}`}
                >
                  {v.d}
                </p>
                <span
                  className={`mt-auto text-[13px] ${dark ? "text-on-dark-muted" : "text-body"}`}
                >
                  {v.time}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Results */}
      <section className="wrap pt-16 lg:pt-28">
        <div className={`${sectionHead} mb-7`}>
          <h2 className={h2}>{results.title}</h2>
          <Link
            href={localizePath("/before-and-after", locale)}
            className="inline-flex min-h-11 items-center font-semibold lg:min-h-0"
          >
            {results.linkLabel}
          </Link>
        </div>
        {/* Carousel: scroll-snap row (works without JS) with arrows on desktop; three cards per view. */}
        <ScrollRow locale={locale} ariaLabel={results.title} caption={tpl(t.results.casesCaption, { shown: shownCases.length + (results.editorial ?? []).length })}>
          {shownCases.map((c) => (
            <li key={c.id} className="flex-[0_0_78%] snap-start lg:flex-[0_0_calc((100%-40px)/3)]">
              <figure className="m-0 flex flex-col gap-2.5">
                <div className="relative aspect-[13/16] overflow-hidden rounded-2xl bg-teal shadow-[0_12px_32px_rgba(26,26,26,.1)]">
                  <Img
                    src={c.image}
                    alt={c.alt}
                    sizes="(min-width: 1024px) 380px, 78vw"
                    className="block h-full w-full object-cover"
                  />
                  {c.layout === "stacked" ? (
                    <>
                      <span className={`${photoLabel} top-3 left-3.5`}>{t.before}</span>
                      <span className={`${photoLabel} bottom-3 left-3.5`}>{t.after}</span>
                    </>
                  ) : (
                    <>
                      <span className={`${photoLabel} top-3 left-3.5`}>{t.before}</span>
                      <span className={`${photoLabel} top-3 right-3.5`}>{t.after}</span>
                    </>
                  )}
                </div>
                <figcaption className="flex justify-between gap-3 text-sm text-muted">
                  <span>{results.label}</span>
                  <span className="text-right">{cases.disclaimer}</span>
                </figcaption>
              </figure>
            </li>
          ))}
          {(results.editorial ?? []).map((e) => (
            <li key={e.src} className="flex-[0_0_78%] snap-start lg:flex-[0_0_calc((100%-40px)/3)]">
              <figure className="m-0 flex flex-col gap-2.5">
                <div className="relative aspect-[13/16] overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(26,26,26,.1)]">
                  <Img
                    src={e.src}
                    alt={e.alt}
                    sizes="(min-width: 1024px) 380px, 78vw"
                    className="block h-full w-full object-cover object-[50%_30%]"
                  />
                </div>
                <figcaption className="flex justify-between gap-3 text-sm text-muted">
                  <span>{e.label}</span>
                  <span className="text-right">{e.cap}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ScrollRow>
      </section>

      {/* Price */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-16">
          <div className="flex flex-col gap-5">
            <span className="eyebrow text-gold-text">{price.eyebrow}</span>
            <h2 className={h2}>{price.title}</h2>
            <p className="m-0 text-[17px] leading-[1.55] text-pretty text-body lg:text-lg">
              {price.body}
            </p>
            <div className="mt-1.5 flex flex-col gap-2.5">
              <Link
                href={localizePath("/financing", locale)}
                className="self-start text-[13px] font-semibold tracking-[.1em] text-muted uppercase no-underline hover:text-gold-text"
              >
                {price.lendersLabel}
              </Link>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {lenders.map((l) => (
                  <li key={l.slug}>
                    <Link
                      href={localizeHref(l.href, locale)}
                      className="inline-flex min-h-11 items-center rounded-full border border-sand bg-[rgba(255,253,248,.7)] px-3.5 text-sm font-semibold text-teal no-underline hover:border-gold lg:min-h-0 lg:py-2"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href={localizePath("/veneers-cost-miami", locale)}
              className="inline-flex min-h-11 items-center self-start font-semibold lg:min-h-0"
            >
              {price.compareLabel}
            </Link>
          </div>

          <div className="glass-card relative flex flex-col gap-6 rounded-[24px] border-[rgba(205,177,128,.5)] px-5 pt-6 pb-3 lg:px-7 lg:pt-7 lg:pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h3 className="m-0 font-serif text-2xl leading-[1.15] font-normal lg:text-[28px]">
                  {price.card.title}
                </h3>
                <span className="text-[15px] text-muted">{price.card.sub}</span>
              </div>
              <span className="rounded-full bg-[#E3F3E8] px-3.5 py-[7px] text-[13px] font-semibold whitespace-nowrap text-[#1F6B45]">
                {price.card.badge}
              </span>
            </div>
            <p className="m-0 flex flex-wrap items-baseline gap-2">
              {price.card.pricePrefix && (
                <span className="text-[15px] text-muted">
                  {price.card.pricePrefix}
                </span>
              )}
              <span className="font-serif text-[54px] leading-none tracking-[-.02em]">
                {pkg.price}
              </span>
              {price.card.priceSuffix && (
                <span className="ml-2 text-[15px] text-muted">
                  {price.card.priceSuffix}
                </span>
              )}
            </p>
            <div className="-mx-3 flex flex-col gap-[22px] rounded-[20px] border border-[rgba(255,255,255,.9)] bg-[rgba(255,253,248,.92)] px-5 pt-6 pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_8px_24px_rgba(26,26,26,.05)] lg:px-6 lg:pt-[26px]">
              <ul className="m-0 flex list-none flex-col gap-3.5 p-0 text-base leading-[1.4]">
                {price.card.included.map((f) => (
                  <li
                    key={f}
                    className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-3"
                  >
                    <svg
                      viewBox="0 0 18 18"
                      width="18"
                      height="18"
                      className="mt-0.5"
                      aria-hidden="true"
                    >
                      <path
                        d="M3.5 9.5l3.5 3.5 7.5-8"
                        fill="none"
                        stroke="#CDB180"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={evaluation}
                className="btn btn-teal h-[52px] text-base"
              >
                {price.card.cta}
              </Link>
            </div>
          </div>
        </div>
        <p className="m-0 mt-5 text-sm text-muted">{price.footnote}</p>
      </section>

      {/* Guides from the doctors (blog articles tagged with this treatment) */}
      {guides.length > 0 && (
        <section className="wrap pt-16 lg:pt-28">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 lg:mb-8">
            <h2 className={h2}>{t.blogPage.treatmentArticles}</h2>
            <Link
              href={localizePath("/blog", locale)}
              className="inline-flex min-h-11 items-center font-semibold lg:min-h-0"
            >
              {t.blogPage.treatmentArticlesLink}
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((p) => (
              <PostCard key={p.slug} post={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <div className="flex flex-col gap-3 lg:sticky lg:top-8 lg:gap-4">
            <h2 className={h2}>{faq.title}</h2>
          </div>
          <FaqAccordion
            faqs={faq.items}
            className="flex flex-col gap-3"
            locale={locale}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="wrap pt-16 pb-16 lg:pt-28 lg:pb-28">
        <div
          className={`dark-panel ${panelShadow} grid items-center gap-8 rounded-2xl p-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:rounded-[20px] lg:p-16`}
        >
          <div className="flex flex-col gap-5">
            <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal text-pretty lg:text-[52px] lg:leading-[1.08]">
              {cta.title}
            </h2>
            <p className="m-0 text-[17px] text-on-dark-muted lg:text-[19px]">
              {cta.body}
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(255,255,255,.8)] bg-[rgba(247,244,238,.9)] p-6 text-ink lg:p-8">
            <h3 className="m-0 font-serif text-2xl font-normal">
              {cta.cardTitle}
            </h3>
            <p className="m-0 text-[15px] text-body">{cta.cardBody}</p>
            <Link
              href={evaluation}
              className="btn btn-teal mt-2 h-[52px] text-[17px]"
            >
              {cta.button}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
