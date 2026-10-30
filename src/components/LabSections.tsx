import Link from "next/link";
import Img from "@/components/Img";
import LineIcon, { type LineIconName } from "@/components/LineIcon";
import { localizeHref, type Locale } from "@/lib/i18n";

/** Shape of src/content/lab.json: the in-house lab page, in both languages. */
export type LabContent = {
  lead: string;
  panel: { eyebrow: string; title: string; body: string; image: string; alt: string };
  focus: { n: string; t: string; d: string }[];
  facts: { big: string; sub: string }[];
  process: { eyebrow?: string; title: string; intro?: string; steps: { k?: string; t: string; d: string; place?: string; icon?: string }[]; note?: string };
  edgar: { eyebrow: string; title: string; role: string; body: string; cta: string; href: string; image: string };
  /** Pills under the facts: the material and treatment pages the lab feeds (zirconia veneers, porcelain veneers). */
  links?: { label: string; href: string }[];
};

const panelShadow = "shadow-[inset_0_1px_0_rgba(247,244,238,.18),0_30px_80px_rgba(4,40,46,.32)]";
const h2 = "m-0 font-serif font-normal text-[34px] leading-[1.2] lg:leading-[1.1]";

/** Dark panel: a photo beside the lab story and the numbered focus list. */
export function LabPanel({ panel, focus }: { panel: LabContent["panel"]; focus: LabContent["focus"] }) {
  return (
    <div className={`dark-panel ${panelShadow} grid items-center gap-8 rounded-2xl p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 lg:rounded-[20px] lg:p-14`}>
      <div className="overflow-hidden rounded-2xl border border-[rgba(247,244,238,.18)]">
        <Img src={panel.image} alt={panel.alt} sizes="(min-width: 1024px) 560px, 100vw" className="block aspect-[4/3] h-auto w-full object-cover lg:aspect-[5/4]" />
      </div>
      <div className="flex flex-col gap-5">
        <span className="eyebrow text-gold">{panel.eyebrow}</span>
        <h2 className="m-0 font-serif text-[32px] leading-[1.15] font-normal text-pretty lg:text-[44px] lg:leading-[1.08]">{panel.title}</h2>
        <p className="m-0 text-[17px] leading-[1.55] text-pretty text-on-dark-muted">{panel.body}</p>
        <ol className="m-0 flex list-none flex-col gap-3.5 p-0">
          {focus.map((f) => (
            <li key={f.n} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-[rgba(247,244,238,.14)] pt-3.5">
              <span aria-hidden="true" className="pt-1 text-xs font-semibold tracking-[.14em] text-gold">{f.n}</span>
              <div>
                <h3 className="m-0 font-serif text-[20px] leading-[1.2] font-normal lg:text-[22px]">{f.t}</h3>
                <p className="m-0 mt-1 text-[15px] leading-[1.5] text-on-dark-muted">{f.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** The numbers the lab makes possible, plus links to the pages that explain the material. */
export function LabFacts({ facts, links, locale = "en" }: { facts: LabContent["facts"]; links?: LabContent["links"]; locale?: Locale }) {
  return (
    <>
      <ul className="m-0 mt-5 grid list-none grid-cols-2 gap-3 p-0 lg:mt-6 lg:grid-cols-4 lg:gap-4">
        {facts.map((g) => (
          <li key={g.sub} className="flex flex-col gap-3 rounded-2xl border border-sand bg-card p-4 lg:min-h-[150px] lg:p-5">
            <span className="mt-auto font-serif text-[28px] leading-none tracking-[-.02em] text-teal lg:text-[36px]">{g.big}</span>
            <span className="text-[13px] leading-[1.45] text-muted lg:text-sm">{g.sub}</span>
          </li>
        ))}
      </ul>
      {links && links.length > 0 && (
        <ul className="m-0 mt-5 flex list-none flex-wrap gap-2 p-0">
          {links.map((l) => (
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
    </>
  );
}

type Step = LabContent["process"]["steps"][number];

/**
 * How a veneer is made here. Consecutive steps that share a label form a lane
 * (chair → lab → chair), so the row reads as the trip the case makes through the
 * building. Lab steps sit on dark teal, chair steps on glass; one card per step,
 * equal heights on desktop, stacked under each lane label on mobile.
 */
export function LabProcess({ process }: { process: LabContent["process"] }) {
  const lanes: { k?: string; place: "chair" | "lab"; steps: { step: Step; n: number }[] }[] = [];
  process.steps.forEach((step, i) => {
    const place: "chair" | "lab" = step.place === "lab" ? "lab" : "chair";
    const prev = lanes[lanes.length - 1];
    if (prev && prev.k === step.k && prev.place === place) prev.steps.push({ step, n: i + 1 });
    else lanes.push({ k: step.k, place, steps: [{ step, n: i + 1 }] });
  });

  return (
    <section className="wrap pt-16 lg:pt-28">
      <div className="mb-8 flex flex-col gap-3 lg:mb-12 lg:max-w-[720px]">
        {process.eyebrow && <span className="eyebrow text-gold-text">{process.eyebrow}</span>}
        <h2 className={`${h2} lg:text-[44px]`}>{process.title}</h2>
        {process.intro && <p className="m-0 text-[17px] leading-[1.55] text-pretty text-body lg:text-lg">{process.intro}</p>}
      </div>
      <ol className="m-0 flex list-none flex-col gap-8 p-0 lg:grid lg:grid-cols-5 lg:gap-x-4 lg:gap-y-5 xl:gap-x-5">
        {lanes.map((lane) => {
          const lab = lane.place === "lab";
          return (
            <li key={`${lane.k}-${lane.steps[0].n}`} className="flex flex-col gap-3 lg:contents">
              {lane.k && (
                <div className="flex items-center gap-3 lg:row-start-1" style={{ gridColumn: `span ${lane.steps.length}` }}>
                  <span className={`eyebrow whitespace-nowrap ${lab ? "text-teal" : "text-gold-text"}`}>{lane.k}</span>
                  <span aria-hidden="true" className={`h-px flex-1 ${lab ? "bg-teal/30" : "bg-sand"}`} />
                </div>
              )}
              <ol className="m-0 flex list-none flex-col gap-3 p-0 lg:contents">
                {lane.steps.map(({ step, n }) => (
                  <li
                    key={step.t}
                    className={`flex flex-col gap-3 rounded-2xl p-5 lg:row-start-2 lg:h-full lg:rounded-[18px] xl:p-6 ${
                      lab
                        ? "border border-[rgba(247,244,238,.14)] bg-[linear-gradient(150deg,#0a3e44,#04282e)] text-on-dark shadow-[inset_0_1px_0_rgba(247,244,238,.18),0_16px_40px_rgba(4,40,46,.22)]"
                        : "glass-card text-ink"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span
                        aria-hidden="true"
                        className={`grid h-9 w-9 place-items-center rounded-full font-serif text-[17px] leading-none ${lab ? "bg-gold text-teal" : "bg-teal text-on-dark"}`}
                      >
                        {n}
                      </span>
                      {step.icon && (
                        <span className="h-10 w-10">
                          <LineIcon name={step.icon as LineIconName} tone={lab ? "gold" : "teal"} />
                        </span>
                      )}
                    </div>
                    <h3 className={`m-0 mt-1 font-serif text-[22px] leading-[1.2] font-normal text-pretty lg:text-[20px] xl:text-[22px] ${lab ? "text-on-dark" : "text-teal"}`}>{step.t}</h3>
                    <p className={`m-0 text-[15px] leading-[1.55] text-pretty lg:text-[14px] xl:text-[15px] ${lab ? "text-on-dark-muted" : "text-body"}`}>{step.d}</p>
                  </li>
                ))}
              </ol>
            </li>
          );
        })}
      </ol>
      {process.note && (
        <p className="m-0 mt-8 max-w-[62ch] border-l-2 border-gold pl-5 font-serif text-[20px] leading-[1.4] text-pretty text-teal lg:mt-12 lg:text-[24px]">{process.note}</p>
      )}
    </section>
  );
}

/** Who runs the lab: Edgar's portrait and a link to his profile. */
export function LabPerson({ edgar, locale }: { edgar: LabContent["edgar"]; locale: Locale }) {
  return (
    <section className="wrap pt-16 lg:pt-28">
      <Link
        href={localizeHref(edgar.href, locale)}
        className="card-hover glass-card grid items-center gap-6 overflow-hidden rounded-2xl p-5 text-ink no-underline hover:text-ink lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 lg:rounded-[20px] lg:p-8"
      >
        <Img src={edgar.image} alt={edgar.title} sizes="200px" className="block aspect-[4/5] w-full max-w-[200px] rounded-xl object-cover object-[50%_20%]" />
        <div className="flex flex-col gap-2.5">
          <span className="eyebrow text-gold-text">{edgar.eyebrow}</span>
          <h2 className="m-0 font-serif text-[28px] leading-[1.15] font-normal text-teal lg:text-[36px]">{edgar.title}</h2>
          <span className="text-[13px] font-semibold tracking-[.1em] text-gold-text uppercase">{edgar.role}</span>
          <p className="m-0 mt-1 max-w-[62ch] text-base leading-[1.55] text-body lg:text-[17px]">{edgar.body}</p>
          <span className="mt-2 font-semibold text-gold-text">{edgar.cta} →</span>
        </div>
      </Link>
    </section>
  );
}

/** Teaser on Edgar's profile that points to the Custom Lab page. */
export function LabTeaser({ teaser, locale }: { teaser: { eyebrow: string; title: string; body: string; cta: string; href: string }; locale: Locale }) {
  return (
    <section className="wrap pt-16 lg:pt-28">
      <div className={`dark-panel ${panelShadow} grid items-center gap-6 rounded-2xl p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12 lg:rounded-[20px] lg:p-12`}>
        <div className="overflow-hidden rounded-2xl border border-[rgba(247,244,238,.18)]">
          <Img src="lab-poster.jpg" alt={teaser.title} sizes="(min-width: 1024px) 520px, 100vw" className="block aspect-[4/3] h-auto w-full object-cover" />
        </div>
        <div className="flex flex-col gap-4">
          <span className="eyebrow text-gold">{teaser.eyebrow}</span>
          <h2 className="m-0 font-serif text-[30px] leading-[1.15] font-normal text-pretty lg:text-[40px] lg:leading-[1.08]">{teaser.title}</h2>
          <p className="m-0 text-[17px] leading-[1.55] text-pretty text-on-dark-muted">{teaser.body}</p>
          <Link href={localizeHref(teaser.href, locale)} className="btn btn-gold mt-2 h-[52px] self-start px-[26px] text-[17px]">
            {teaser.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
