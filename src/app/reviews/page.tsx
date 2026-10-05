import CostHero from "@/components/CostHero";
import CostPhotoCta from "@/components/CostPhotoCta";
import JsonLd from "@/components/JsonLd";
import { reviews } from "@/lib/content";
import { pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { pages, site } from "@/lib/site";

const PATH = "/reviews" as const;
export const metadata = pageMetadata(PATH);

// No Review/AggregateRating JSON-LD on purpose: the review texts are not yet verified against Google.
export default function Page() {
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH)} />
      <CostHero
        crumbs={["About Us", "Reviews"]}
        title={pages[PATH].h1}
        lead="Reviews as published on Google. We do not edit them. Names appear as the patient wrote them."
      >
        <div className="flex items-center gap-3.5 border-t border-[rgba(247,244,238,.16)] pt-[22px]">
          <span className="font-serif text-[44px] leading-none">{site.rating.value}</span>
          <span className="flex flex-col gap-1">
            <span aria-hidden="true" className="text-base leading-[1.2] tracking-[2px] text-gold">
              ★★★★★
            </span>
            <span className="text-sm text-on-dark-muted">
              {site.rating.count} {reviews.source} reviews
            </span>
          </span>
        </div>
      </CostHero>

      <section className="wrap pt-16 lg:pt-28">
        <h2 className="sr-only">Patient reviews</h2>
        {/* TODO(clinic): the design intends a live Google Business Profile feed here; these five are static until it is connected and must be verified against Google. */}
        {/* TODO(clinic): sixth card in the design is a placeholder ("[Review text exactly as published on Google.]" / "[Name as published]" / "[Treatment]"); not rendered. */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {reviews.reviews.map((r) => (
            <figure key={r.name} className="glass-card m-0 flex flex-col gap-4 rounded-2xl p-6 lg:rounded-[18px] lg:p-7">
              <span aria-hidden="true" className="text-sm tracking-[2px] text-gold">
                ★★★★★
              </span>
              <blockquote className="m-0 text-[17px] leading-[1.55] text-ink">{r.text}</blockquote>
              <figcaption className="mt-auto flex justify-between gap-3 text-sm text-muted">
                <span className="font-semibold text-teal">{r.name}</span>
                <span className="text-right">{r.treatment}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-6 mb-0 text-sm text-muted">
          Reviews from Google, Healthgrades and RealSelf.{" "}
          <a href={site.maps.place} rel="noopener" className="inline-block py-2 font-semibold lg:py-0">
            Read all on Google →
          </a>
        </p>
      </section>

      <CostPhotoCta />
    </main>
  );
}
