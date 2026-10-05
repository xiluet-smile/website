import Link from "next/link";
import CaseCard from "@/components/CaseCard";
import DoctorCta from "@/components/DoctorCta";
import { PhoneIcon } from "@/components/Icons";
import Img from "@/components/Img";
import PageHero from "@/components/PageHero";
import { caseById, doctors, type Doctor } from "@/lib/content";
import { site } from "@/lib/site";

/** Shape of src/content/doctors/{slug}.json (profile-only data; the rest comes from doctors.json). */
export type DoctorProfileData = {
  slug: string;
  /** Short form used in headings and buttons, e.g. "Dr. Puentes". */
  display: string;
  quote: string;
  stats: { big: string; sub: string }[];
  focus: { n: string; t: string; d: string }[];
  /** `c` (country) may be empty. */
  education: { t: string; i: string; c: string }[];
  certs: string[];
  /** Ids from cases.json. */
  caseIds: string[];
};

const h2 = "m-0 font-serif font-normal text-[34px] leading-[1.2] lg:leading-[1.1]";
const sectionHead = "mb-7 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-8";
const panelShadow = "shadow-[inset_0_1px_0_rgba(247,244,238,.18),0_30px_80px_rgba(4,40,46,.32)]";

function Hero({ doctor, profile }: { doctor: Doctor; profile: DoctorProfileData }) {
  const stat = "flex flex-col gap-0.5";
  const statBig = "font-serif text-[26px] leading-none whitespace-nowrap lg:text-[28px]";
  const statSub = "text-sm text-on-dark-muted";
  return (
    <PageHero>
      <div className="wrap relative z-[2] grid items-center gap-10 pt-8 pb-14 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-[72px] lg:pt-12 lg:pb-[88px]">
        <div className="flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-[13px] text-on-dark-muted">
            <Link href="/" className="text-on-dark-muted no-underline hover:text-gold">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/doctors" className="text-on-dark-muted no-underline hover:text-gold">
              Doctors
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="text-gold">
              {profile.display}
            </span>
          </nav>
          <p className="eyebrow m-0 text-gold">{doctor.role}</p>
          <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] lg:text-[64px] lg:leading-[1.02]">
            {doctor.shortName}
            <span className="sr-only">, </span>
            <span className="mt-2.5 block text-[22px] tracking-[.08em] text-on-dark-muted lg:text-[26px]">DMD</span>
          </h1>
          <p className="m-0 max-w-[56ch] text-[17px] leading-[1.55] text-pretty text-on-dark-muted lg:text-[19px]">
            {doctor.bio}
          </p>
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3.5">
            <Link href="/free-photo-evaluation" className="btn btn-gold h-[52px] px-[26px] text-[17px]">
              Send photos to {profile.display}
            </Link>
            <a
              href={site.phone.href}
              className="btn h-[52px] gap-[9px] border-[1.5px] border-[rgba(247,244,238,.4)] pr-[22px] pl-[18px] text-base text-on-dark hover:bg-[rgba(247,244,238,.1)] hover:text-on-dark"
            >
              <PhoneIcon size={17} />
              {site.phone.display}
            </a>
          </div>
          <dl className="m-0 mt-1.5 grid grid-cols-2 gap-x-6 gap-y-[18px] border-t border-[rgba(247,244,238,.16)] pt-[22px] lg:flex lg:flex-wrap lg:gap-x-0">
            {profile.stats.map((st) => (
              <div key={st.sub} className={`${stat} border-[rgba(247,244,238,.16)] lg:mr-6 lg:border-r lg:pr-6`}>
                <dt className={`${statSub} order-2`}>{st.sub}</dt>
                <dd className={`${statBig} m-0`}>{st.big}</dd>
              </div>
            ))}
            <div className={stat}>
              <dt className={`${statSub} order-2`}>{doctor.langs}</dt>
              <dd className={`${statBig} m-0`}>{site.languages.codes.map((c) => c.toUpperCase()).join(" · ")}</dd>
            </div>
          </dl>
        </div>
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -top-3.5 -right-3.5 h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(205,177,128,.35),transparent_70%)] blur-[10px]"
          />
          <div className="relative overflow-hidden rounded-[20px] border border-[rgba(205,177,128,.45)] shadow-[0_40px_90px_rgba(0,0,0,.4)] lg:rounded-[28px]">
            <Img
              src={doctor.image}
              alt={doctor.name}
              sizes="(min-width: 1024px) 460px, 100vw"
              priority
              className="block aspect-[4/5] h-auto w-full object-cover object-[50%_15%]"
            />
          </div>
          <div className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 rounded-[14px] border border-[rgba(247,244,238,.18)] bg-[rgba(4,40,46,.72)] px-[18px] py-3.5 backdrop-blur-[16px] lg:right-6 lg:bottom-6 lg:left-6">
            <span className="text-sm text-on-dark-muted">
              {site.name} · {site.address.locality}
            </span>
            <span aria-hidden="true" className="text-[13px] tracking-[2px] text-gold">
              ★★★★★
            </span>
          </div>
        </div>
      </div>
    </PageHero>
  );
}

/** Full doctor profile: hero, focus, education, credentials, results, other doctors, CTA. */
export default function DoctorProfile({ doctor, profile }: { doctor: Doctor; profile: DoctorProfileData }) {
  const name = profile.display;
  const others = doctors.filter((d) => d.slug !== doctor.slug);
  const cases = profile.caseIds.map(caseById);

  return (
    <>
      <Hero doctor={doctor} profile={profile} />

      {/* Focus */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="mb-7 flex flex-col gap-3 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <h2 className={`${h2} lg:max-w-[18ch] lg:text-[48px]`}>What {name} does best</h2>
          <Link href="/before-and-after" className="font-semibold whitespace-nowrap">
            See results →
          </Link>
        </div>
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {profile.focus.map((f) => (
            <li key={f.n} className="glass-card flex flex-col gap-3.5 rounded-2xl p-6 lg:min-h-[210px] lg:rounded-[18px] lg:px-6 lg:py-[26px]">
              <span aria-hidden="true" className="text-xs font-semibold tracking-[.14em] text-hint">
                {f.n}
              </span>
              <h3 className="m-0 font-serif text-[21px] leading-[1.2] font-normal text-teal lg:text-[23px]">{f.t}</h3>
              <p className="m-0 text-[15px] leading-[1.5] text-body">{f.d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Education */}
      <section className="wrap pt-16 lg:pt-28">
        <div className={`dark-panel grid items-start gap-8 rounded-2xl p-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.3fr)] lg:gap-16 lg:rounded-[20px] lg:p-16 ${panelShadow}`}>
          <div className="flex flex-col gap-[18px] lg:sticky lg:top-8">
            <p className="eyebrow m-0 text-gold">Education and training</p>
            <h2 className={`${h2} text-pretty lg:text-[44px] lg:leading-[1.08]`}>International degrees. Florida licensed.</h2>
            <blockquote className="m-0 mt-3 border-l-2 border-gold pl-[18px] font-serif text-[19px] leading-[1.4] text-on-dark italic lg:text-[22px]">
              “{profile.quote}”
            </blockquote>
          </div>
          <ol className="m-0 flex list-none flex-col p-0">
            {profile.education.map((e) => (
              <li
                key={e.t}
                className="grid grid-cols-[28px_minmax(0,1fr)] items-start gap-x-[18px] gap-y-1.5 border-t border-[rgba(247,244,238,.14)] py-5 lg:grid-cols-[28px_minmax(0,1fr)_auto]"
              >
                <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_0_4px_rgba(205,177,128,.18)]" />
                <span className="flex flex-col gap-1">
                  <span className="text-lg leading-[1.3] font-semibold">{e.t}</span>
                  <span className="text-[15px] text-on-dark-muted">{e.i}</span>
                </span>
                {e.c && (
                  <span className="col-start-2 text-[13px] font-semibold tracking-[.08em] whitespace-nowrap text-gold uppercase lg:col-start-3 lg:mt-1">
                    {e.c}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Certifications */}
      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <div className="flex flex-col gap-3.5">
            <p className="eyebrow m-0 text-gold-text">Certifications and memberships</p>
            <h2 className={`${h2} lg:text-[40px]`}>Credentials you can verify</h2>
            <p className="m-0 text-base leading-[1.55] text-body">
              Licenses and certificates are available on request at your first visit.
            </p>
          </div>
          <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
            {profile.certs.map((c) => (
              <li key={c} className="glass-card inline-flex items-center gap-2.5 rounded-[18px] px-[18px] py-3 text-[15px] font-semibold text-teal">
                <svg viewBox="0 0 18 18" width="16" height="16" aria-hidden="true" className="flex-none">
                  <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="#CDB180" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TODO(clinic): "Patient stories" video strip ("{name}'s patients, in their own words") is not rendered:
          every story in the design is a placeholder ([Patient name], no video src). Needs real patient
          names, consented quotes and video files before it can be built. */}

      {/* Results */}
      <section className="wrap pt-16 lg:pt-28">
        <div className={sectionHead}>
          <h2 className={`${h2} lg:text-[48px]`}>{`${name}'s before and after`}</h2>
          <Link href="/before-and-after" className="font-semibold whitespace-nowrap">
            All cases →
          </Link>
        </div>
        <div className="-mx-5 flex snap-x scroll-px-5 snap-mandatory gap-4 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0">
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              c={c}
              sizes="(min-width: 1024px) 30vw, 80vw"
              className="w-[80%] flex-none snap-start scroll-ml-5 lg:w-auto"
            />
          ))}
        </div>
      </section>

      {/* Other doctors */}
      <section className="wrap pt-16 lg:pt-28">
        <div className={sectionHead}>
          <h2 className={`${h2} lg:text-[40px]`}>Also on the team</h2>
          <Link href="/doctors" className="font-semibold whitespace-nowrap">
            All doctors →
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
          {others.map((d) => (
            <Link
              key={d.slug}
              href={d.href}
              className="glass-card card-hover grid grid-cols-[100px_minmax(0,1fr)] items-center gap-4 rounded-2xl p-4 text-ink no-underline hover:text-ink lg:grid-cols-[140px_minmax(0,1fr)] lg:gap-[22px] lg:rounded-[18px] lg:p-[18px]"
            >
              <Img
                src={d.image}
                alt={d.shortName}
                sizes="140px"
                className="block h-[120px] w-[100px] rounded-xl object-cover object-[50%_15%] lg:h-[160px] lg:w-[140px]"
              />
              <div className="flex flex-col gap-1.5">
                <h3 className="m-0 font-serif text-[20px] leading-[1.15] font-normal text-teal lg:text-2xl lg:leading-[1.15]">{d.name}</h3>
                <span className="text-[13px] leading-[1.4] font-semibold tracking-[.1em] text-gold-text uppercase">{d.role}</span>
                <span className="mt-1.5 text-sm font-semibold text-gold-text">View profile →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <DoctorCta
        wideButton
        heading={`Want ${name} to look at your smile?`}
        text={`Send photos and ask for ${name} by name. Written estimate within ${site.replyHours} hours.`}
      />
    </>
  );
}
