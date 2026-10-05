import {
  ClinicFeatureGrid,
  ClinicHero,
  ClinicPhotoCta,
  ClinicSectionHead,
  fillFacts,
} from "@/components/ClinicSections";
import FaqAccordion from "@/components/FaqAccordion";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import faqData from "@/content/faq/out-of-state.json";
import content from "@/content/out-of-state.json";
import { imageInfo } from "@/lib/images";
import { faqPage, pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { pages, site } from "@/lib/site";

const PATH = "/out-of-state-patients" as const;
export const metadata = pageMetadata(PATH);

const faqs = faqData.map((f) => ({ q: f.q, a: fillFacts(f.a) }));
const visits = content.visits.map((v) => ({ ...v, d: fillFacts(v.d) }));

const POSTER = "gen-miami-aerial.jpg";
const mediaClass = "block aspect-[4/3] h-auto w-full object-cover";
// Typed as string | null so the page compiles whether or not a video URL is set in site.json.
const arrivalVideo: string | null = site.videos.miamiArrival;

const visitCard =
  "flex flex-col gap-4 rounded-2xl border border-[rgba(255,255,255,.7)] px-5 py-6 shadow-[0_1px_0_rgba(255,255,255,.6)_inset,0_12px_32px_rgba(26,26,26,.06)] lg:min-h-[240px] lg:rounded-[18px] lg:px-6 lg:py-[26px]";

export default function Page() {
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, faqPage(faqs))} />
      <PageHero>
        <ClinicHero
          trail={[{ label: "Home", href: "/" }, { label: "Out of State" }]}
          title={pages[PATH].h1}
          lead={
            <>
              Everything before the trip happens from home: photos, written estimate, payment plan and dates. Then one
              week in Miami, three visits, and a {site.warrantyYears}-year warranty in writing.
            </>
          }
          media={
            arrivalVideo ? (
              <video
                src={arrivalVideo}
                poster={imageInfo(POSTER).src}
                muted
                loop
                autoPlay
                playsInline
                preload="none"
                aria-label="Miami at golden hour"
                className={mediaClass}
              />
            ) : (
              <Img
                src={POSTER}
                alt="Miami at golden hour"
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
          title="Your week, day by day"
          aside="The same schedule for every veneer and smile design patient."
        />
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
                <h3 className="m-0 flex flex-col gap-4 font-normal">
                  <span className={`eyebrow font-sans ${light ? "text-gold-text" : "text-gold"}`}>{v.k}</span>
                  <span className="font-serif text-[22px] leading-[1.15] lg:text-[26px]">{v.t}</span>
                </h3>
                <p className={`m-0 text-[15px] leading-[1.5] ${light ? "text-body" : "text-on-dark-muted"}`}>{v.d}</p>
                <p className={`m-0 mt-auto text-[13px] ${light ? "text-body" : "text-on-dark-muted"}`}>{v.time}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <ClinicSectionHead title="What we handle for you" />
        <ClinicFeatureGrid items={content.perks} />
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:sticky lg:top-8 lg:text-5xl lg:leading-[1.1]">
            Travel questions
          </h2>
          <FaqAccordion faqs={faqs} name="travel-faq" className="flex flex-col gap-3" />
        </div>
      </section>

      <section className="wrap py-16 lg:py-28">
        <ClinicPhotoCta />
      </section>
    </main>
  );
}
