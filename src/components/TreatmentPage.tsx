import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import { CameraIcon } from "@/components/Icons";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { caseById, getContent, packageById, ui, type Faq } from "@/lib/content-i18n";
import { localizeHref, localizePath, type Locale } from "@/lib/i18n";
import { postsForTreatment } from "@/lib/blog";
import { PostCard } from "@/components/blog/BlogArticle";
import { faqPage, medicalProcedure, pageGraph } from "@/lib/schema";
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
  candidates: { title: string; intro: string; items: { t: string; d: string }[] };
  why: {
    eyebrow: string;
    title: string;
    body: string;
    image: { src: string; alt: string } | null;
    facts: { label: string; big: string; sub: string }[];
  };
  week: { title: string; intro: string; linkLabel: string; visits: { k: string; t: string; d: string; time: string }[] };
  results: {
    title: string;
    linkLabel: string;
    /** Patient cases from cases.json, captioned with `label`. */
    label?: string;
    caseIds?: string[];
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
  cta: { title: string; body: string; cardTitle: string; cardBody: string; button: string };
};

const h2 = "m-0 font-serif text-[34px] leading-[1.2] font-normal text-pretty lg:text-[48px] lg:leading-[1.1]";
const sectionHead = "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8";
const photoLabel =
  "absolute text-[11px] font-semibold tracking-[.14em] text-on-dark uppercase [text-shadow:0_1px_8px_rgba(0,0,0,.5)]";
const panelShadow = "shadow-[inset_0_1px_0_rgba(247,244,238,.18),0_30px_80px_rgba(4,40,46,.32)]";

export default function TreatmentPage({ data, locale = "en" }: { data: Treatment; locale?: Locale }) {
  const t = ui(locale);
  const { pages, lenders, cases } = getContent(locale);
  const path = data.path as PagePath;
  const pkg = packageById(locale, data.packageId);
  const { hero, candidates, why, week, results, price, faq, cta } = data;
  const heroCase = hero.image.caseId ? caseById(locale, hero.image.caseId) : null;
  const evaluation = localizePath("/free-photo-evaluation", locale);
  // Articles tag treatments by route slug without the "-miami" suffix (e.g. "porcelain-veneers").
  const guides = postsForTreatment(locale, data.path.replace(/^\//, "").replace(/-miami$/, "")).slice(0, 3);

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
          faqPage(faq.items),
        )}
      />

      <PageHero locale={locale}>
        <div className="wrap relative z-[2] grid gap-10 pt-8 pb-12 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center lg:gap-14 lg:pt-14 lg:pb-20">
          <div className="flex flex-col gap-5 lg:gap-[26px]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-[13px] text-on-dark-muted">
              <Link href={localizePath("/", locale)} className="text-on-dark-muted no-underline hover:text-gold">
                {t.home}
              </Link>
              <span aria-hidden="true">/</span>
              <span>{t.breadcrumb.treatments}</span>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-gold">
                {data.breadcrumb}
              </span>
            </nav>
            <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] text-pretty lg:text-[64px] lg:leading-[1.04]">
              {pages[path].h1}
            </h1>
            {/* hero.definition feeds the MedicalProcedure schema only; the visible box was removed at the clinic's request. */}
            <p className="m-0 max-w-[54ch] text-[17px] leading-[1.5] text-pretty text-on-dark-muted lg:text-xl">
              {hero.lead}
            </p>
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3.5">
              <Link href={evaluation} className="btn btn-gold h-[52px] pr-6 pl-5 text-[17px]">
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
            <div className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-[18px] border-t border-[rgba(247,244,238,.16)] pt-[22px] lg:flex lg:flex-wrap lg:gap-x-0">
              {hero.stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col gap-0.5 lg:border-l lg:border-[rgba(247,244,238,.16)] lg:px-[22px] lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
                >
                  <span className="font-serif text-2xl leading-none whitespace-nowrap lg:text-[28px]">
                    {s.kind === "price" ? (
                      pkg.price
                    ) : s.kind === "rating" ? (
                      <>
                        {site.rating.value}{" "}
                        <span className="font-sans text-base text-on-dark-muted">· {site.rating.count}</span>
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
        <ul className="m-0 grid list-none gap-4 p-0 lg:grid-cols-5">
          {candidates.items.map((c, i) => (
            <li key={c.t} className="glass-card flex flex-col gap-3.5 rounded-2xl p-5 lg:min-h-[200px] lg:rounded-[18px] lg:px-[22px] lg:py-6">
              <span aria-hidden="true" className="text-xs font-semibold tracking-[.14em] text-hint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="m-0 font-serif text-[22px] leading-[1.2] font-normal text-teal">{c.t}</h3>
              <p className="m-0 mt-auto text-[15px] leading-[1.45] text-body">{c.d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Why here */}
      <section className="wrap pt-16 lg:pt-28">
        <div className={`dark-panel ${panelShadow} grid items-center gap-8 rounded-2xl p-6 lg:grid-cols-2 lg:gap-16 lg:rounded-[20px] lg:p-16`}>
          <div className="flex max-w-[520px] flex-col gap-[22px]">
            <span className="eyebrow text-gold">{why.eyebrow}</span>
            <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal text-pretty lg:text-[52px] lg:leading-[1.06]">
              {why.title}
            </h2>
            <p className="m-0 text-[17px] leading-[1.55] text-pretty text-on-dark-muted lg:text-lg">{why.body}</p>
            {why.image && (
              <Img
                src={why.image.src}
                alt={why.image.alt}
                sizes="(min-width: 1024px) 520px, 100vw"
                className="mt-2 block aspect-video w-full rounded-2xl border border-[rgba(247,244,238,.18)] object-cover"
              />
            )}
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 lg:gap-4">
            {why.facts.map((w) => (
              <li
                key={w.label}
                className="relative flex flex-col gap-[18px] overflow-hidden rounded-2xl border border-[rgba(255,255,255,.28)] bg-[linear-gradient(160deg,rgba(255,253,248,.22)_0%,rgba(255,253,248,.1)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_16px_40px_rgba(0,0,0,.25)] backdrop-blur-[22px] backdrop-saturate-[1.4] lg:min-h-[190px] lg:rounded-[20px] lg:px-6 lg:pt-[22px] lg:pb-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 left-0 h-0.5 bg-[linear-gradient(90deg,rgba(205,177,128,0)_0%,#CDB180_40%,rgba(247,244,238,.9)_70%,rgba(247,244,238,0)_100%)]"
                />
                <span className="text-sm text-on-dark-muted">{w.label}</span>
                <span className="mt-auto flex flex-col gap-1.5">
                  <span className="font-serif text-[22px] leading-[1.1] tracking-[-.02em] lg:text-[38px] lg:leading-none">
                    {w.big}
                  </span>
                  <span className="text-sm leading-[1.4] text-on-dark-muted">{w.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The week */}
      <section id="week" className="wrap scroll-mt-6 pt-16 lg:pt-28">
        <div className={`${sectionHead} mb-7 lg:mb-10`}>
          <div>
            <h2 className={`${h2} mb-3`}>{week.title}</h2>
            <p className="m-0 max-w-[52ch] text-[17px] text-body lg:text-lg">{week.intro}</p>
          </div>
          <Link href={localizePath("/out-of-state-patients", locale)} className="inline-flex min-h-11 items-center font-semibold lg:min-h-0 lg:whitespace-nowrap">
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
                <span className={`eyebrow ${dark ? "text-gold" : "text-gold-text"}`}>{v.k}</span>
                <h3 className="m-0 font-serif text-[22px] leading-[1.15] font-normal lg:text-[26px]">{v.t}</h3>
                <p className={`m-0 text-[15px] leading-[1.5] ${dark ? "text-on-dark-muted" : "text-body"}`}>{v.d}</p>
                <span className={`mt-auto text-[13px] ${dark ? "text-on-dark-muted" : "text-body"}`}>{v.time}</span>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Results */}
      <section className="wrap pt-16 lg:pt-28">
        <div className={`${sectionHead} mb-7`}>
          <h2 className={h2}>{results.title}</h2>
          <Link href={localizePath("/before-and-after", locale)} className="inline-flex min-h-11 items-center font-semibold lg:min-h-0">
            {results.linkLabel}
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {(results.caseIds ?? []).map((id) => caseById(locale, id)).map((c) => (
            <figure key={c.id} className="m-0 flex flex-col gap-2.5">
              <div className="relative overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(26,26,26,.1)]">
                <Img src={c.image} alt={c.alt} sizes="(min-width: 1024px) 33vw, 100vw" className="block h-auto w-full" />
                <span className={`${photoLabel} top-3 left-3.5`}>{t.before}</span>
                <span className={`${photoLabel} top-3 right-3.5`}>{t.after}</span>
              </div>
              <figcaption className="flex justify-between gap-3 text-sm text-muted">
                <span>{results.label}</span>
                <span className="text-right">{cases.disclaimer}</span>
              </figcaption>
            </figure>
          ))}
          {(results.editorial ?? []).map((e) => (
            <figure key={e.src} className="m-0 flex flex-col gap-2.5">
              <div className="relative overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(26,26,26,.1)]">
                <Img
                  src={e.src}
                  alt={e.alt}
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="block aspect-[4/5] w-full object-cover object-[50%_30%] lg:aspect-[5/6]"
                />
              </div>
              <figcaption className="flex justify-between gap-3 text-sm text-muted">
                <span>{e.label}</span>
                <span className="text-right">{e.cap}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Price */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-16">
          <div className="flex flex-col gap-5">
            <span className="eyebrow text-gold-text">{price.eyebrow}</span>
            <h2 className={h2}>{price.title}</h2>
            <p className="m-0 text-[17px] leading-[1.55] text-pretty text-body lg:text-lg">{price.body}</p>
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
            <Link href={localizePath("/veneers-cost-miami", locale)} className="inline-flex min-h-11 items-center self-start font-semibold lg:min-h-0">
              {price.compareLabel}
            </Link>
          </div>

          <div className="glass-card relative flex flex-col gap-6 rounded-[24px] border-[rgba(205,177,128,.5)] px-5 pt-6 pb-3 lg:px-7 lg:pt-7 lg:pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h3 className="m-0 font-serif text-2xl leading-[1.15] font-normal lg:text-[28px]">{price.card.title}</h3>
                <span className="text-[15px] text-muted">{price.card.sub}</span>
              </div>
              <span className="rounded-full bg-[#E3F3E8] px-3.5 py-[7px] text-[13px] font-semibold whitespace-nowrap text-[#1F6B45]">
                {price.card.badge}
              </span>
            </div>
            <p className="m-0 flex flex-wrap items-baseline gap-2">
              {price.card.pricePrefix && <span className="text-[15px] text-muted">{price.card.pricePrefix}</span>}
              <span className="font-serif text-[54px] leading-none tracking-[-.02em]">{pkg.price}</span>
              {price.card.priceSuffix && <span className="ml-2 text-[15px] text-muted">{price.card.priceSuffix}</span>}
            </p>
            <div className="-mx-3 flex flex-col gap-[22px] rounded-[20px] border border-[rgba(255,255,255,.9)] bg-[rgba(255,253,248,.92)] px-5 pt-6 pb-5 shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_8px_24px_rgba(26,26,26,.05)] lg:px-6 lg:pt-[26px]">
              <ul className="m-0 flex list-none flex-col gap-3.5 p-0 text-base leading-[1.4]">
                {price.card.included.map((f) => (
                  <li key={f} className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-3">
                    <svg viewBox="0 0 18 18" width="18" height="18" className="mt-0.5" aria-hidden="true">
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
              <Link href={evaluation} className="btn btn-teal h-[52px] text-base">
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
            <Link href={localizePath("/blog", locale)} className="inline-flex min-h-11 items-center font-semibold lg:min-h-0">
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
            <Link href={localizePath("/contact", locale)} className="inline-flex min-h-11 items-center self-start font-semibold lg:min-h-0">
              {faq.linkLabel}
            </Link>
          </div>
          <FaqAccordion faqs={faq.items} className="flex flex-col gap-3" locale={locale} />
        </div>
      </section>

      {/* CTA */}
      <section className="wrap pt-16 pb-16 lg:pt-28 lg:pb-28">
        <div className={`dark-panel ${panelShadow} grid items-center gap-8 rounded-2xl p-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:rounded-[20px] lg:p-16`}>
          <div className="flex flex-col gap-5">
            <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal text-pretty lg:text-[52px] lg:leading-[1.08]">
              {cta.title}
            </h2>
            <p className="m-0 text-[17px] text-on-dark-muted lg:text-[19px]">{cta.body}</p>
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(255,255,255,.8)] bg-[rgba(247,244,238,.9)] p-6 text-ink lg:p-8">
            <h3 className="m-0 font-serif text-2xl font-normal">{cta.cardTitle}</h3>
            <p className="m-0 text-[15px] text-body">{cta.cardBody}</p>
            <Link href={evaluation} className="btn btn-teal mt-2 h-[52px] text-[17px]">
              {cta.button}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
