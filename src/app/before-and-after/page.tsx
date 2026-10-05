import CostHero from "@/components/CostHero";
import CostPhotoCta from "@/components/CostPhotoCta";
import JsonLd from "@/components/JsonLd";
import ResultsGallery from "@/components/ResultsGallery";
import { cases } from "@/lib/content";
import { imageInfo } from "@/lib/images";
import { imageGallery, pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { pages } from "@/lib/site";

const PATH = "/before-and-after" as const;
export const metadata = pageMetadata(PATH);

const images = cases.map((c) => ({ url: imageInfo(c.image).src, caption: c.alt }));

export default function Page() {
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, imageGallery(PATH, "Before and after, Xiluet Smiles patients", images))} />
      <CostHero
        crumbs={["Results"]}
        title={pages[PATH].h1}
        lead="Every photo is a Xiluet patient, unretouched. Filter by treatment. Individual results vary."
      />
      <section className="wrap pt-12 lg:pt-20" aria-label="Before and after photos">
        <ResultsGallery />
      </section>
      <CostPhotoCta />
    </main>
  );
}
