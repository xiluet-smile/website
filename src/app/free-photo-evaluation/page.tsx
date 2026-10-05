import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Img from "@/components/Img";
import LeadForm from "@/components/LeadForm";
import content from "@/content/lead-form.json";
import { pageMetadata } from "@/lib/seo";
import { contactPage, pageGraph } from "@/lib/schema";
import { site } from "@/lib/site";

const PATH = "/free-photo-evaluation" as const;
export const metadata = pageMetadata(PATH);

const vars: Record<string, string> = { replyHours: String(site.replyHours), depositUsd: String(site.depositUsd) };
const fill = (s: string) => s.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);

export default function Page() {
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, contactPage(PATH))} />
      <PageHero>
        <div className="wrap relative z-[2] flex flex-col items-center gap-[22px] pt-8 pb-12 text-center lg:pt-12 lg:pb-16">
          <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] lg:text-[64px] lg:leading-[1.04]">
            Let&apos;s see your smile
          </h1>
          <p className="m-0 max-w-[62ch] text-[17px] leading-[1.5] text-pretty text-on-dark-muted lg:text-[19px]">
            Your photos go straight to the doctor who will design your case.{" "}
            <strong className="font-semibold text-on-dark">Don&apos;t worry about how your teeth look right now.</strong> That is
            exactly what we are here to change.
          </p>
          <p className="m-0 text-[15px] text-on-dark-muted lg:text-base">
            Photos 2 to 5 are what the dental team uses. Do your best with your phone and send what you can.
          </p>
        </div>
      </PageHero>

      {/* photo guide */}
      <section className="wrap pt-10 lg:pt-16" aria-label="Example photos">
        <div className="-mx-5 flex snap-x gap-3.5 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {content.guide.map((g) => (
            <figure
              key={g.n}
              className="glass-card m-0 flex w-[62%] flex-none snap-start flex-col overflow-hidden rounded-[16px] sm:w-[38%] lg:w-auto lg:rounded-[18px]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#EDE6D8]">
                <Img
                  src={g.img}
                  alt={`Example: ${g.title}`}
                  sizes="(min-width: 1024px) 230px, 62vw"
                  className={`absolute inset-0 h-full w-full object-cover ${g.zoom ? "scale-[1.15]" : ""}`}
                />
              </div>
              <figcaption className="flex flex-col gap-[3px] px-4 pt-3.5 pb-4">
                <span className="eyebrow text-gold-text">
                  {g.n}. {g.title}
                </span>
                <span className="text-sm leading-[1.4] text-body">{g.hint}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* upload + details */}
      <section className="wrap pt-8 lg:pt-10">
        <LeadForm />
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <h2 className="m-0 mb-6 max-w-[18ch] font-serif text-[34px] leading-[1.2] font-normal lg:mb-10 lg:text-[48px] lg:leading-[1.1]">
          What happens after you press send
        </h2>
        <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {content.after.map((st) => (
            <li key={st.n} className="glass-card flex flex-col gap-3.5 rounded-[16px] p-6 lg:min-h-[200px] lg:rounded-[18px] lg:p-7">
              <span className="text-xs font-semibold tracking-[.14em] text-muted">{st.n}</span>
              <h3 className="m-0 font-serif text-[21px] leading-[1.2] font-normal text-teal lg:text-[22px]">{fill(st.t)}</h3>
              <p className="m-0 text-[15px] leading-[1.5] text-body">{fill(st.d)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap py-16 lg:py-28">
        <div className="dark-panel flex flex-col gap-6 rounded-[16px] p-6 shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-8 lg:rounded-[20px] lg:px-16 lg:py-12">
          <div className="flex flex-col gap-2">
            <h2 className="m-0 font-serif text-[26px] leading-[1.15] font-normal lg:text-[30px]">Prefer to talk?</h2>
            <p className="m-0 text-base text-on-dark-muted">
              Call or text. {site.languages.display}. {site.hours.display} ET.
            </p>
          </div>
          <a href={site.phone.href} className="font-serif text-[30px] text-gold no-underline hover:text-gold lg:text-[36px]">
            {site.phone.display}
          </a>
        </div>
      </section>
    </main>
  );
}
