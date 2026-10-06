import CostHero from "@/components/CostHero";
import CostPhotoCta from "@/components/CostPhotoCta";
import JsonLd from "@/components/JsonLd";
import ResultsGallery from "@/components/ResultsGallery";
import { getContent, ui } from "@/lib/content-i18n";
import type { Locale } from "@/lib/i18n";
import { imageInfo } from "@/lib/images";
import { imageGallery, pageGraph } from "@/lib/schema";

const PATH = "/before-and-after" as const;

export default function ResultsPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages, cases } = getContent(locale);
  const images = cases.cases.map((c) => ({ url: imageInfo(c.image).src, caption: c.alt }));
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, locale, imageGallery(PATH, t.results.galleryName, images, locale))} />
      <CostHero
        locale={locale}
        crumbs={[t.breadcrumb.results]}
        title={pages[PATH].h1}
        lead={t.results.pageLead}
      />
      <section className="wrap pt-12 lg:pt-20" aria-label={t.results.photosAria}>
        <ResultsGallery locale={locale} />
      </section>
      <CostPhotoCta locale={locale} />
    </main>
  );
}
