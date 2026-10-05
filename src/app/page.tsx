import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import Header from "@/components/Header";
import { CameraIcon, PhoneIcon, Stars, WhatsAppIcon } from "@/components/Icons";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import LineIcon, { type LineIconName } from "@/components/LineIcon";
import HeroVideo from "@/components/home/HeroVideo";
import HomeResults from "@/components/home/HomeResults";
import WeekPlanner from "@/components/home/WeekPlanner";
import home from "@/content/home.json";
import faqs from "@/content/faq/home.json";
import { caseById, caseTypes, doctors, lenders, prices, reviews } from "@/lib/content";
import { faqPage, pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { pages, site } from "@/lib/site";

export const metadata = pageMetadata("/");

const h2 = "m-0 font-serif text-[34px] leading-[1.2] font-normal lg:text-[48px] lg:leading-[1.1]";
const headRow = "mb-4 flex flex-col gap-3 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8";
const calloutPos = { tl: "top-4 left-4", tr: "top-4 right-4", br: "right-4 bottom-4" } as const;

const packageIcons: Record<string, LineIconName> = {
  "signature-veneers": "veneer",
  "complete-restoration": "crown",
  "full-mouth-reconstruction": "fullArch",
  "all-on-x-fixed-arch": "fullArch",
};

export default function Home() {
  const homeCases = home.caseIds.map(caseById);
  const { rating } = site;

  return (
    <main id="main">
      <JsonLd data={pageGraph("/", faqPage(faqs))} />

      {/* Header + hero (video) */}
      <section className="relative z-10 flex min-h-[720px] flex-col bg-teal text-on-dark shadow-[0_30px_80px_rgba(4,40,46,.28)] lg:min-h-[820px]">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <HeroVideo src={site.videos.hero} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,30,36,.55)_0%,rgba(4,30,36,.15)_30%,rgba(4,30,36,.55)_55%,rgba(4,30,36,.92)_100%)] lg:bg-[linear-gradient(90deg,rgba(4,30,36,.94)_0%,rgba(4,30,36,.86)_42%,rgba(4,30,36,.35)_68%,rgba(4,30,36,.05)_100%)]" />
          <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(4,30,36,.55)_0%,rgba(4,30,36,0)_30%,rgba(4,30,36,0)_70%,rgba(4,30,36,.6)_100%)] lg:block" />
        </div>
        <Header />
        <div className="wrap relative z-[2] flex flex-1 flex-col justify-end gap-4 pt-[220px] pb-6 lg:grid lg:grid-cols-[minmax(0,1fr)_600px] lg:items-center lg:gap-14 lg:pt-14 lg:pb-16">
          <div className="flex flex-col gap-4 lg:max-w-[560px] lg:gap-5">
            <div className="text-[13px] font-semibold tracking-[.12em] text-gold uppercase lg:text-sm">{home.hero.eyebrow}</div>
            <h1 className="-mt-1.5 mb-0 font-serif text-[38px] leading-[1.1] font-normal text-pretty lg:-mt-2 lg:text-[60px] lg:leading-[1.05] lg:tracking-[-.01em]">
              {pages["/"].h1}
            </h1>
            <p className="m-0 text-[17px] leading-normal text-pretty text-[#E3DDD0] lg:max-w-[56ch] lg:text-xl">{home.hero.lead}</p>
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:gap-3">
              <Link href="/free-photo-evaluation" className="btn btn-gold h-[52px] text-[17px] shadow-[0_8px_24px_rgba(0,0,0,.25)] lg:h-12 lg:px-6 lg:text-base">
                <CameraIcon size={18} />
                Get your free photo evaluation
              </Link>
              <a href={site.whatsapp} rel="noopener" className="btn btn-ghost h-[52px] text-[17px] lg:h-12 lg:px-5 lg:text-base">
                <WhatsAppIcon />
                Chat on WhatsApp
              </a>
            </div>
            <div className="flex flex-col gap-2.5 lg:mt-1 lg:gap-2">
              <div className="flex flex-wrap items-center gap-2.5 text-[15px] font-semibold lg:gap-3">
                <span className="inline-flex flex-none items-center">
                  {[1, 2, 3].map((n) => (
                    <Img
                      key={n}
                      src={`patient-avatar-${n}.png`}
                      alt=""
                      sizes="36px"
                      className={`relative block h-8 w-8 rounded-full border-2 border-[rgba(247,244,238,.9)] object-cover shadow-[0_2px_8px_rgba(0,0,0,.25)] lg:h-9 lg:w-9 ${n > 1 ? "-ml-2.5 lg:-ml-[11px]" : ""}`}
                      style={{ zIndex: 4 - n }}
                    />
                  ))}
                </span>
                <Stars className="text-sm text-gold" />
                <span>{rating.count} five-star Google reviews</span>
              </div>
              <div className="flex items-baseline gap-2.5 text-[17px] leading-[1.35] font-semibold lg:text-sm lg:font-medium lg:text-[#E3DDD0]">
                <span className="relative -top-px inline-block h-2 w-2 flex-none rotate-45 border-[1.5px] border-gold lg:h-[7px] lg:w-[7px]" />
                <span>{home.hero.promise}</span>
              </div>
            </div>
          </div>
          <div className="relative hidden h-full min-h-[420px] lg:block">
            <div className="absolute bottom-0 left-0 flex items-center gap-2.5 rounded-full border border-[rgba(247,244,238,.2)] bg-[rgba(4,30,36,.55)] py-2 pr-3.5 pl-2.5 text-[13px] font-semibold backdrop-blur-[12px]">
              <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_0_4px_rgba(205,177,128,.25)]" />
              Smile design preview
            </div>
            <ul className="pointer-events-none absolute inset-0 m-0 list-none p-0">
              {home.hero.callouts.map((c) => (
                <li
                  key={c.text}
                  className={`hero-callout absolute flex items-center gap-2.5 rounded-xl border border-[rgba(247,244,238,.28)] bg-[rgba(247,244,238,.14)] px-4 py-2.5 font-serif text-[17px] tracking-[.005em] whitespace-nowrap shadow-[inset_0_1px_0_rgba(247,244,238,.2),0_10px_30px_rgba(0,0,0,.25)] backdrop-blur-[16px] backdrop-saturate-[1.2] ${calloutPos[c.pos as keyof typeof calloutPos]}`}
                  style={{ animationDelay: `${c.delay}s` }}
                >
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                  {c.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative z-[2] lg:border-t lg:border-[rgba(247,244,238,.18)] lg:bg-[rgba(4,30,36,.35)] lg:backdrop-blur-[10px]">
          <dl className="wrap m-0 grid grid-cols-2 gap-x-5 gap-y-3 pb-6 text-[15px] text-on-dark-muted max-lg:[&>div:nth-child(-n+2)]:border-t max-lg:[&>div:nth-child(-n+2)]:border-[rgba(247,244,238,.18)] max-lg:[&>div:nth-child(-n+2)]:pt-4 lg:grid-cols-4 lg:gap-0 lg:pt-6 lg:pb-7 lg:text-lg">
            {[
              { big: rating.value, small: "stars", label: `${rating.value} out of 5 stars`, gold: true },
              { big: String(rating.count), small: "Google reviews" },
              { big: `${site.warrantyYears}-year`, small: "warranty" },
              { big: String(doctors.length), small: "doctors, DMD" },
            ].map((s, i) => (
              <div key={s.small} className={`flex items-baseline gap-1.5 lg:gap-2.5 ${i ? "lg:border-l lg:border-[rgba(247,244,238,.18)] lg:px-6" : "lg:pr-6"}`}>
                <dt className="order-2 m-0">
                  {s.gold ? (
                    <span className="text-sm text-gold lg:text-lg" role="img" aria-label={s.label}>
                      <Stars />
                    </span>
                  ) : (
                    s.small
                  )}
                </dt>
                <dd className="m-0 font-serif text-2xl leading-none text-on-dark lg:text-[30px]">{s.big}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Sound familiar */}
      <section className="defer-render wrap pt-16 lg:pt-28">
        <div className={headRow}>
          <h2 className={`${h2} lg:leading-[1.55]`}>Sound familiar?</h2>
          <p className="m-0 max-w-[420px] text-[17px] leading-normal text-pretty text-body lg:mb-2 lg:text-right">
            Six things we hear on almost every first call. Tap a card to see our answer.
          </p>
        </div>
        <ul className="m-0 grid list-none gap-4 p-0 lg:grid-cols-3 lg:gap-5">
          {home.problems.map((p, i) => {
            const n = String(i + 1).padStart(2, "0");
            return (
              <li key={p.q}>
                <label className="group relative block cursor-pointer rounded-[18px] max-lg:glass-card max-lg:p-4 lg:min-h-[320px] lg:rounded-[20px] lg:[perspective:1600px] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-gold">
                  <input type="checkbox" className="sr-only" aria-label={`Show our answer to: ${p.q}`} />
                  <div className="lg:relative lg:h-full lg:min-h-[320px] lg:transition-transform lg:duration-[640ms] lg:ease-[cubic-bezier(.4,0,.2,1)] lg:[transform-style:preserve-3d] lg:group-has-[:checked]:[transform:rotateY(180deg)]">
                    <div className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-3.5 lg:absolute lg:inset-0 lg:flex lg:flex-col lg:items-stretch lg:gap-6 lg:rounded-[20px] lg:px-7 lg:pt-7 lg:pb-[26px] lg:glass-card lg:[backface-visibility:hidden] lg:hover:shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_24px_48px_rgba(26,26,26,.12)]">
                      <div className="lg:flex lg:items-start lg:justify-between">
                        <div className="grid h-14 w-14 place-items-center rounded-[14px] bg-[rgba(205,177,128,.1)] lg:h-16 lg:w-16 lg:rounded-2xl">
                          <div className="h-[34px] w-[34px] lg:h-10 lg:w-10">
                            <LineIcon name={p.icon as LineIconName} />
                          </div>
                        </div>
                        <span className="hidden text-xs font-semibold tracking-[.14em] text-muted lg:block" aria-hidden="true">
                          {n}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 lg:contents">
                        <p className="m-0 font-serif text-[19px] leading-[1.3] text-pretty lg:text-[26px] lg:leading-[1.25]">“{p.q}”</p>
                        <span className="text-[13px] font-semibold text-gold-text lg:mt-auto lg:flex lg:items-center lg:gap-2 lg:text-[15px]">
                          Our answer <span aria-hidden="true" className="lg:hidden">↓</span>
                          <span aria-hidden="true" className="hidden lg:inline">↻</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-3.5 hidden flex-col gap-2.5 rounded-xl bg-[rgba(4,40,46,.94)] p-4 text-on-dark group-has-[:checked]:flex lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:gap-5 lg:rounded-[20px] lg:border lg:border-[rgba(255,255,255,.12)] lg:bg-[linear-gradient(150deg,rgba(10,62,68,.96)_0%,rgba(4,40,46,.94)_100%)] lg:px-7 lg:pt-7 lg:pb-[26px] lg:shadow-[0_12px_32px_rgba(26,26,26,.14)] lg:[transform:rotateY(180deg)] lg:[backface-visibility:hidden]">
                      <div className="hidden items-center justify-between lg:flex">
                        <span className="eyebrow text-gold">Our answer</span>
                        <span className="text-xs font-semibold tracking-[.14em] text-[rgba(247,244,238,.55)]" aria-hidden="true">
                          {n}
                        </span>
                      </div>
                      <p className="m-0 text-[15px] leading-normal text-pretty lg:text-[17px] lg:leading-[1.55]">{p.a}</p>
                      <Link href={p.href} className="flex min-h-11 items-center gap-2 text-sm font-semibold text-gold no-underline hover:text-gold lg:mt-auto lg:min-h-0 lg:text-[15px]">
                        {p.link} <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </label>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Real results */}
      <section className="defer-render wrap overflow-hidden pt-16 lg:pt-28">
        <div className="mb-4 flex items-end justify-between gap-8 lg:mb-6">
          <h2 className={h2}>Real results</h2>
          <Link href="/before-and-after" className="link-strong hidden lg:inline">
            All cases →
          </Link>
        </div>
        <HomeResults cases={homeCases} types={caseTypes} />
        <Link href="/before-and-after" className="link-strong mt-4 inline-block lg:hidden">
          All cases →
        </Link>
      </section>

      {/* TODO(clinic): "In their own words" patient video stories are placeholders in the design
          ([Patient name], no video files). Section is omitted until real videos are supplied. */}

      {/* Doctors */}
      <section className="defer-render wrap pt-16 lg:pt-28">
        <div className={headRow}>
          <h2 className={h2}>The doctors who design your smile</h2>
          <Link href="/doctors" className="link-strong">
            Meet the team →
          </Link>
        </div>
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {doctors.map((d) => (
            <Link
              key={d.slug}
              href={d.href}
              className="card-hover glass-card flex w-[200px] flex-none flex-col gap-3 rounded-[18px] px-2.5 pt-2.5 pb-[18px] text-ink no-underline hover:text-ink lg:grid lg:w-auto lg:grid-cols-[120px_minmax(0,1fr)] lg:items-center lg:gap-5 lg:rounded-[20px] lg:p-4"
            >
              <Img
                src={d.image}
                alt={d.name}
                sizes="(min-width: 1024px) 120px, 180px"
                className="block aspect-[4/5] h-auto w-full rounded-lg object-cover object-[50%_20%] lg:h-[150px] lg:w-[120px] lg:rounded-xl lg:object-[50%_15%]"
              />
              <div className="px-2 lg:px-0">
                <h3 className="m-0 font-serif text-[19px] leading-[1.25] font-normal text-pretty lg:text-[21px]">{d.name}</h3>
                {/* Design shows "[Credential line]"; using each doctor's focus line from the Doctors page. */}
                <div className="mt-1 text-sm text-body lg:mt-1.5 lg:text-[15px]">{d.role}</div>
                <div className="mt-3.5 hidden text-[15px] font-semibold text-gold-text lg:block">Profile →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="defer-render wrap pt-16 lg:pt-28">
        <div className="relative">
          <div className="mb-4 lg:mb-14 lg:min-h-[110px]">
            <h2 className={`${h2} lg:mb-3`}>How it works</h2>
            <p className="m-0 hidden max-w-[48ch] text-lg text-body lg:block">
              Six steps from your phone to your follow-up. Most of it happens before you ever visit.
            </p>
          </div>
          <Link href="/out-of-state-patients" className="link-strong absolute top-0 right-0 hidden whitespace-nowrap lg:inline">
            See the full process →
          </Link>
          <WeekPlanner steps={home.steps} bars={home.timelineBars} />
        </div>
        <Link href="/out-of-state-patients" className="link-strong mt-4 inline-block lg:hidden">
          See the full process →
        </Link>
      </section>

      {/* What it costs */}
      <section className="defer-render wrap pt-16 lg:pt-28">
        <div className="mb-5 flex flex-col gap-3 lg:mb-7 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex flex-col gap-2">
            <h2 className={h2}>What it costs</h2>
            <p className="m-0 text-[17px] text-body">One written price before you book. Every package includes a professional cleaning and X-rays.</p>
          </div>
          <Link href="/veneers-cost-miami" className="link-strong whitespace-nowrap">
            Full price list →
          </Link>
        </div>
        <div className="grid items-stretch gap-3 md:grid-cols-2 lg:gap-3.5 xl:grid-cols-4">
          {prices.packages.map((p) => (
            <Link
              key={p.id}
              href={p.href}
              className={`relative flex flex-col gap-3.5 rounded-[18px] border px-[22px] pt-[22px] pb-5 text-ink no-underline shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_12px_32px_rgba(26,26,26,.06)] backdrop-blur-[18px] backdrop-saturate-[1.2] transition-[transform,box-shadow] duration-[240ms] ease-card hover:-translate-y-1 hover:text-ink hover:shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_22px_44px_rgba(26,26,26,.12)] ${
                p.featured
                  ? "border-[rgba(205,177,128,.55)] bg-[linear-gradient(160deg,rgba(255,253,248,.82),rgba(255,253,248,.6))]"
                  : "border-[rgba(255,255,255,.7)] bg-[rgba(255,253,248,.55)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(205,177,128,.35)] bg-[rgba(255,253,248,.9)]">
                  <div className="h-[22px] w-[22px]">
                    <LineIcon name={packageIcons[p.id]} />
                  </div>
                </div>
                {p.featured && (
                  <span className="rounded-full bg-[rgba(205,177,128,.16)] px-2.5 py-[5px] text-[11px] font-semibold tracking-[.04em] text-gold-text">{p.badge}</span>
                )}
              </div>
              <div className="flex flex-col gap-[3px]">
                <span className="text-xs font-semibold tracking-[.12em] text-gold-text uppercase">{p.kicker}</span>
                <h3 className="m-0 font-serif text-[21px] leading-[1.15] font-normal text-teal">{p.name}</h3>
              </div>
              <div className="flex items-baseline gap-2 border-y border-[rgba(222,213,194,.7)] py-2.5">
                <span className="font-serif text-[34px] leading-none tracking-[-.02em] text-ink">{p.price}</span>
                <span className="text-[13px] text-muted">{p.home.sub}</span>
              </div>
              <ul className="m-0 flex list-none flex-col gap-[7px] p-0 text-sm leading-[1.4] text-body">
                {p.home.features.map((f) => (
                  <li key={f} className="grid grid-cols-[14px_minmax(0,1fr)] items-start gap-[9px]">
                    <svg viewBox="0 0 18 18" width="14" height="14" className="mt-[3px]" aria-hidden="true">
                      <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="#CDB180" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <span className="mt-auto pt-1.5 text-sm font-semibold text-gold-text">{p.featured ? "Get your free estimate" : "About this package"} →</span>
            </Link>
          ))}
        </div>
        <p className="mt-4 mb-0 text-[13px] text-muted">
          Deep cleaning and other procedures are quoted separately, in writing, before anything starts. Final estimate may vary if additional corrections are
          required beyond the smile design.
        </p>
      </section>

      {/* Financing */}
      <section className="defer-render wrap pt-16 lg:pt-24">
        <div className="mb-5 flex flex-col gap-3 lg:mb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="flex max-w-[640px] flex-col gap-2">
            <span className="eyebrow text-gold-text">Financing</span>
            <h2 className="m-0 font-serif text-[34px] leading-[1.15] font-normal lg:text-[40px] lg:leading-[1.1]">Five ways to pay over time</h2>
            <p className="m-0 text-base leading-normal text-body">Our coordinator helps you apply and compares offers with you before you commit.</p>
          </div>
          <Link href="/financing" className="link-strong lg:whitespace-nowrap">
            How approval guidance works →
          </Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {lenders.map((l) => (
            <Link
              key={l.slug}
              href={l.href}
              className="glass-card flex flex-col gap-2.5 rounded-2xl p-[18px] text-ink no-underline transition-[transform,box-shadow] duration-[240ms] ease-card hover:-translate-y-[3px] hover:text-ink hover:shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_18px_36px_rgba(26,26,26,.1)] lg:gap-3 lg:p-5"
            >
              <div className="flex items-center justify-between gap-3 xl:block">
                <div className="flex h-[34px] flex-none items-center">
                  <Img src={l.logo} alt={l.name} sizes="128px" className="block h-[26px] w-auto max-w-[128px] object-contain object-left" />
                </div>
                <span className="rounded-full bg-[rgba(205,177,128,.16)] px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-gold-text xl:mt-3 xl:inline-block xl:px-[9px] xl:text-[11px]">
                  {l.tag}
                </span>
              </div>
              <p className="m-0 text-sm leading-normal text-body xl:text-[13px] xl:leading-[1.45]">{l.note}</p>
              <span className="mt-auto text-[13px] font-semibold text-gold-text">Learn more →</span>
            </Link>
          ))}
        </div>
        <p className="mt-3.5 mb-0 text-[13px] text-muted">Financing is provided by third-party lenders, subject to credit approval. Terms vary by partner.</p>
      </section>

      {/* Why trust */}
      <section className="defer-render wrap pt-16 lg:pt-24">
        <div className="dark-panel flex flex-col gap-5 rounded-[20px] px-6 py-8 lg:grid lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10 lg:px-11 lg:py-10">
          <div className="flex max-w-[460px] flex-col gap-3.5">
            <span className="eyebrow text-gold">Why patients trust us</span>
            <h2 className="m-0 font-serif text-[32px] leading-[1.15] font-normal text-pretty lg:text-[38px] lg:leading-[1.08]">Results you can check before you commit</h2>
            <p className="m-0 text-base leading-normal text-pretty text-on-dark-muted">
              You see your design before any tooth is touched, the planning happens in-house, and the warranty runs five times longer than the usual one year.
            </p>
          </div>
          <ul className="m-0 grid list-none grid-cols-2 gap-2.5 p-0 xl:grid-cols-4">
            {[
              { icon: "shield", label: "Warranty", big: String(site.warrantyYears), unit: "years", gold: `${site.warrantyYears}× the usual one year` },
              { icon: "approve", label: "Google rating", big: rating.value, gold: `${rating.count} reviews`, stars: true },
              { icon: "design", label: "Doctors", big: "10+", unit: "years", sub: "Experience and international degrees" },
              { icon: "lab", label: "In-house planning", big: "One building", small: true, sub: "Doctor and ceramist side by side" },
            ].map((t) => (
              <li
                key={t.label}
                className="relative flex flex-col gap-3.5 overflow-hidden rounded-2xl border border-[rgba(255,255,255,.28)] bg-[linear-gradient(160deg,rgba(255,253,248,.22)_0%,rgba(255,253,248,.1)_100%)] px-4 pt-4 pb-[18px] shadow-[inset_0_1px_0_rgba(255,255,255,.35),inset_0_-1px_0_rgba(255,255,255,.08),0_16px_40px_rgba(0,0,0,.25)] backdrop-blur-[22px] backdrop-saturate-[1.4]"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,rgba(205,177,128,0)_0%,#CDB180_40%,rgba(247,244,238,.9)_70%,rgba(247,244,238,0)_100%)]" />
                <span className="flex items-center gap-2.5 text-[13px] text-on-dark-muted">
                  <span className="block h-[18px] w-[18px]">
                    <LineIcon name={t.icon as LineIconName} tone="gold" />
                  </span>
                  {t.label}
                </span>
                <span className="mt-auto flex min-w-0 flex-col gap-1.5">
                  <span className={`flex items-baseline gap-2 font-serif text-on-dark ${t.small ? "text-[22px] leading-[1.1]" : "text-[30px] leading-none tracking-[-.02em]"}`}>
                    {t.big}
                    {t.unit && <span className="font-sans text-sm tracking-normal text-on-dark-muted">{t.unit}</span>}
                  </span>
                  {t.gold && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-gold">
                      <span className="inline-block h-[3px] w-2.5 flex-none rounded-sm bg-gold" />
                      {t.gold}
                    </span>
                  )}
                  {t.stars && (
                    <Stars className="text-[11px] text-gold" />
                  )}
                  {t.sub && <span className="text-xs text-on-dark-muted">{t.sub}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* In-house lab */}
      <section className="defer-render wrap pt-16 lg:pt-28">
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Design has an empty image slot here; using the supplied editorial lab image. */}
          <Img
            src={home.lab.image}
            alt="Ceramist shaping a porcelain veneer by hand under a magnifying lamp"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="block aspect-[4/3] h-auto w-full rounded-lg object-cover lg:aspect-[5/4] lg:rounded-xl"
          />
          <div className="flex flex-col gap-4 lg:gap-5">
            <div className="text-[13px] font-semibold tracking-[.12em] text-gold-text uppercase lg:text-sm">Our in-house lab</div>
            <h2 className="-mt-2 mb-0 font-serif text-[32px] leading-[1.15] font-normal text-pretty lg:mt-0 lg:text-[48px] lg:leading-[1.1]">Made in our lab, designed for your face.</h2>
            <p className="m-0 text-base text-pretty text-body lg:text-lg">
              Your veneers are not ordered from a catalog. Our master ceramists work in the same building as your doctor and design each smile to your face: lip
              line, proportions, skin tone, and the way you speak and smile.
            </p>
            <ul className="m-0 grid list-none gap-2.5 p-0 text-base lg:gap-3 lg:text-[17px]">
              {home.lab.bullets.map((b) => (
                <li key={b} className="flex items-baseline gap-2.5 lg:gap-3">
                  <span className="h-[7px] w-[7px] flex-none rounded-full bg-gold lg:h-2 lg:w-2" />
                  {b}
                </li>
              ))}
            </ul>
            <Link href="/smile-design-miami" className="link-strong">
              How a smile design works →
            </Link>
          </div>
        </div>
      </section>

      {/* Out of state */}
      <section className="defer-render wrap pt-16 lg:pt-28">
        <div className="relative overflow-hidden rounded-[18px] bg-teal text-on-dark lg:grid lg:min-h-[520px] lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:rounded-[20px] lg:shadow-[0_30px_80px_rgba(4,40,46,.28)]">
          {site.videos.miamiArrival ? (
            <video autoPlay muted loop playsInline preload="none" aria-hidden="true" poster="/og/gen-clinic-room.jpg" className="absolute inset-0 h-full w-full object-cover object-[60%_50%] lg:object-[70%_50%]">
              <source src={site.videos.miamiArrival} type="video/mp4" />
            </video>
          ) : (
            <Img src="gen-miami-aerial.jpg" alt="" sizes="(min-width: 1024px) 1200px, 100vw" className="absolute inset-0 h-full w-full object-cover object-[60%_50%] lg:object-[70%_50%]" />
          )}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,30,36,.2)_0%,rgba(4,30,36,.9)_45%,rgba(4,30,36,.96)_100%)] lg:bg-[linear-gradient(90deg,rgba(4,30,36,.92)_0%,rgba(4,30,36,.78)_40%,rgba(4,30,36,.15)_75%,rgba(4,30,36,0)_100%)]"
          />
          <div className="relative z-[2] flex flex-col gap-3.5 px-[22px] pt-40 pb-[26px] lg:justify-center lg:gap-6 lg:p-16">
            <div className="text-xs font-semibold tracking-[.12em] text-gold uppercase lg:text-sm">Out-of-state patients</div>
            <h2 className="-mt-1 mb-0 font-serif text-[30px] leading-[1.15] font-normal text-pretty lg:-mt-2 lg:text-[48px] lg:leading-[1.1]">Flying in from Atlanta, Houston or New York?</h2>
            <p className="m-0 max-w-[40ch] text-base text-[#E3DDD0] lg:text-[19px]">Estimate first, flight second. Four business days in Miami, 20 minutes from MIA.</p>
            <ol className="mt-1.5 mb-0 grid list-none grid-cols-4 gap-2 p-0 lg:mt-2 lg:flex lg:items-start lg:gap-0">
              {home.itinerary.map((d) => (
                <li key={d.short} className="flex flex-col gap-1.5 lg:flex-1 lg:gap-2.5">
                  <div className="flex items-center">
                    <span className="h-2.5 w-2.5 flex-none rounded-full bg-gold lg:h-3 lg:w-3 lg:shadow-[0_0_0_4px_rgba(205,177,128,.25)]" />
                    <span className="hidden h-px flex-1 bg-[rgba(247,244,238,.25)] lg:block" />
                  </div>
                  <div className="text-[11px] font-semibold tracking-[.08em] text-gold uppercase lg:text-xs lg:tracking-[.1em]">{d.short}</div>
                  <div className="font-serif text-[15px] leading-[1.25] lg:pr-3 lg:text-[19px]">{d.title}</div>
                </li>
              ))}
            </ol>
            <Link href="/out-of-state-patients" className="text-base font-semibold text-gold hover:text-gold lg:text-[17px]">
              Plan your visit, day by day →
            </Link>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="defer-render wrap pt-16 lg:pt-28">
        <div className={headRow}>
          <h2 className={h2}>Questions patients ask first</h2>
        </div>
        {/* TODO(clinic): the design's sixth question ("How does the 5-year warranty work?") has a
            "[covered items]" placeholder in its answer and is omitted until the terms are supplied. */}
        <FaqAccordion faqs={faqs} variant="home" />
      </section>

      {/* Reviews */}
      <section className="defer-render wrap pt-16 lg:pt-28">
        <div className={headRow}>
          <div>
            <h2 className={`${h2} mb-1.5 lg:mb-2`}>What patients say on Google</h2>
            <div className="flex items-baseline gap-2 lg:gap-2.5">
              <span className="font-serif text-2xl lg:text-[28px]">{rating.value}</span>
              <span className="text-sm text-gold-text lg:text-base" role="img" aria-label={`${rating.value} out of 5 stars`}>
                <Stars />
              </span>
              <span className="text-[15px] text-body lg:text-lg">{rating.count} reviews</span>
            </div>
          </div>
          <Link href="/reviews" className="link-strong">
            All reviews →
          </Link>
        </div>
        {/* TODO(clinic): Home review cards in the design are placeholders; showing the reviews from the
            Reviews page until the Google Business Profile feed is connected. */}
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {reviews.reviews.slice(0, 4).map((r) => (
            <article key={r.name} className="glass-card flex w-[280px] flex-none flex-col gap-3 rounded-2xl p-[22px] lg:min-h-[240px] lg:w-auto lg:gap-3.5 lg:p-7">
              <div className="text-sm text-gold-text lg:text-[15px]">
                <Stars />
              </div>
              <p className="m-0 text-base leading-normal text-pretty lg:text-[17px]">{r.text}</p>
              <div className="mt-auto text-[13px] text-muted lg:text-sm">
                <strong className="font-semibold text-ink">{r.name}</strong> · {r.treatment} · {reviews.source}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Our office */}
      <section className="defer-render wrap pt-16 lg:pt-28">
        <div className={headRow}>
          <div>
            <h2 className={`${h2} mb-1.5 lg:mb-2`}>Our office</h2>
            <p className="m-0 text-[15px] text-muted lg:text-lg">Calle Ocho, West Miami. 20 minutes from MIA, on-site lab upstairs.</p>
          </div>
          <a href={site.maps.directions} target="_blank" rel="noopener" className="link-strong hidden lg:inline">
            Open in Google Maps →
          </a>
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr] lg:items-stretch lg:gap-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-[rgba(255,255,255,.7)] bg-[#E9E2D3] shadow-[0_12px_32px_rgba(26,26,26,.06)] lg:aspect-auto lg:min-h-[480px] lg:rounded-2xl">
            <iframe
              title="Map to Xiluet Smiles"
              src={site.maps.embed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0 saturate-[.85]"
            />
            <div className="absolute bottom-5 left-5 hidden items-center gap-3.5 rounded-[14px] border border-[rgba(255,255,255,.8)] bg-[rgba(255,253,248,.82)] px-[18px] py-3.5 shadow-[0_8px_24px_rgba(26,26,26,.1)] backdrop-blur-[18px] backdrop-saturate-[1.2] lg:flex">
              <Img src="xiluet-logo-gold-on-teal.jpg" alt="" sizes="44px" className="h-11 w-11 rounded-lg object-cover" />
              <address className="text-[15px] leading-[1.4] not-italic">
                <strong className="block text-base text-teal">{site.name}</strong>
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </address>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:gap-4">
            <address className="glass-card flex items-center gap-3 rounded-[14px] px-4 py-3.5 text-[15px] leading-[1.45] not-italic lg:hidden">
              <Img src="xiluet-logo-gold-on-teal.jpg" alt="" sizes="40px" className="h-10 w-10 rounded-lg object-cover" />
              <span>
                <strong className="block text-teal">{site.name}</strong>
                {site.address.street}, {site.address.locality}, {site.address.region} {site.address.postalCode}
              </span>
            </address>
            {home.directions.map((d) => (
              <div key={d.title} className="glass-card grid grid-cols-[40px_minmax(0,1fr)] items-start gap-3 rounded-[14px] px-4 py-3.5 lg:grid-cols-[44px_minmax(0,1fr)] lg:gap-4 lg:rounded-2xl lg:p-5">
                <span className="block h-10 w-10 lg:h-11 lg:w-11">
                  <LineIcon name={d.icon as LineIconName} />
                </span>
                <div>
                  <h3 className="m-0 mb-0.5 text-[15px] font-semibold text-teal lg:mb-1 lg:text-[17px]">{d.title}</h3>
                  <p className="m-0 text-sm leading-normal text-pretty text-body lg:text-[15px] lg:leading-[1.55]">{d.body}</p>
                </div>
              </div>
            ))}
            <div className="mt-1 hidden flex-wrap gap-3 lg:flex">
              <a href={site.phone.href} className="btn btn-glass h-12 gap-2 pr-5 pl-4 text-[15px]">
                <PhoneIcon />
                {site.phone.display}
              </a>
              <a href={site.whatsapp} rel="noopener" className="btn btn-glass h-12 gap-2 pr-5 pl-4 text-[15px]">
                <WhatsAppIcon size={17} />
                WhatsApp us
              </a>
            </div>
            <a href={site.maps.directions} target="_blank" rel="noopener" className="btn btn-glass mt-1 h-12 text-[15px] lg:hidden">
              Get directions →
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="wrap py-16 lg:py-28">
        <div className="dark-panel flex flex-col gap-4 rounded-[20px] px-6 py-8 lg:grid lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-16 lg:px-16 lg:py-[72px]">
          <div className="flex flex-col gap-4 lg:gap-5">
            {/* TODO(clinic): design says 12 hours here and 6 hours in the footer; kept verbatim. */}
            <h2 className="m-0 font-serif text-[32px] leading-[1.12] font-normal text-pretty lg:text-[52px] lg:leading-[1.08]">Start with photos. A doctor replies within 12 hours.</h2>
            <p className="m-0 text-base text-on-dark-muted lg:text-[19px]">
              Free, no visit needed. You get a doctor&apos;s plan and a written estimate. Your dates are only reserved once you decide, with a ${site.depositUsd} deposit applied to
              treatment.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-on-dark-muted lg:text-base">
              <a href={site.phone.href} className="font-semibold text-on-dark hover:text-gold">
                {site.phone.display}
              </a>
              <a href={site.whatsapp} rel="noopener" className="font-semibold text-on-dark hover:text-gold">
                WhatsApp
              </a>
              <span>
                {site.hours.display} · {site.languages.display}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-[rgba(255,255,255,.8)] bg-[rgba(247,244,238,.9)] p-6 text-ink shadow-[0_24px_60px_rgba(0,0,0,.25)] backdrop-blur-[20px] lg:p-8">
            <div className="font-serif text-2xl leading-[1.25]">Free photo evaluation</div>
            <p className="m-0 text-base text-body">5 short questions and 2 photos of your teeth. About 2 minutes.</p>
            <Link href="/free-photo-evaluation" className="btn btn-teal h-14 text-lg">
              Start my evaluation
            </Link>
            <p className="m-0 text-sm text-muted">Only our doctors see your photos.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
