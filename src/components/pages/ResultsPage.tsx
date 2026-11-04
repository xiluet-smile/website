import Link from "next/link";
import CostHero from "@/components/CostHero";
import CostPhotoCta from "@/components/CostPhotoCta";
import JsonLd from "@/components/JsonLd";
import ResultsGallery from "@/components/ResultsGallery";
import { getContent, ui } from "@/lib/content-i18n";
import { localizeHref, type Locale } from "@/lib/i18n";
import { imageInfo } from "@/lib/images";
import { imageGallery, pageGraph } from "@/lib/schema";

const PATH = "/before-and-after" as const;

export default function ResultsPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages, cases, stories } = getContent(locale);
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
      {/* Intro: what the gallery holds, how to read a case, and the two pages a visitor goes to next. */}
      <section className="wrap pt-10 lg:pt-16">
        <div className="flex max-w-[760px] flex-col gap-4">
          {t.results.intro.map((p) => (
            <p key={p} className="m-0 text-[17px] leading-[1.6] text-body">
              {p}
            </p>
          ))}
          <p className="m-0 text-[17px] leading-[1.6] text-body">
            {t.results.costPrefix}
            <Link href={localizeHref("/veneers-cost-miami", locale)} className="font-semibold text-ink underline underline-offset-4">
              {t.results.costAnchor}
            </Link>
            {". "}
            {t.results.veneersPrefix}
            <Link href={localizeHref("/porcelain-veneers-miami", locale)} className="font-semibold text-ink underline underline-offset-4">
              {t.results.veneersAnchor}
            </Link>
            .
          </p>
        </div>
      </section>
      <section className="wrap pt-10 lg:pt-14" aria-label={t.results.photosAria}>
        <ResultsGallery locale={locale} stories={stories} />
      </section>
      <CostPhotoCta locale={locale} />
    </main>
  );
}
