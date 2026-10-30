import { ClinicHero } from "@/components/ClinicSections";
import CostPhotoCta from "@/components/CostPhotoCta";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import { LabFacts, LabPanel, LabPerson, LabProcess } from "@/components/LabSections";
import LazyVideo from "@/components/LazyVideo";
import PageHero from "@/components/PageHero";
import { getContent, ui } from "@/lib/content-i18n";
import { localizePath, type Locale } from "@/lib/i18n";
import { imageInfo } from "@/lib/images";
import { pageGraph } from "@/lib/schema";

const PATH = "/custom-lab" as const;

export default function CustomLabPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages, site, lab } = getContent(locale);
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, locale)} />
      <PageHero locale={locale}>
        <ClinicHero
          trail={[{ label: t.home, href: localizePath("/", locale) }, { label: t.breadcrumb.clinic, href: localizePath("/clinic", locale) }, { label: pages[PATH].breadcrumb }]}
          title={pages[PATH].h1}
          lead={lab.lead}
          media={
            site.videos.lab ? (
              <LazyVideo src={site.videos.lab} poster={imageInfo("lab-poster.jpg").src} label={pages[PATH].breadcrumb} className="block aspect-[4/3] h-auto w-full object-cover" />
            ) : (
              <Img src="lab-poster.jpg" alt={pages[PATH].breadcrumb} sizes="(min-width: 1024px) 560px, 100vw" className="block aspect-[4/3] h-auto w-full object-cover" />
            )
          }
        />
      </PageHero>

      <section className="wrap pt-16 lg:pt-28">
        <LabPanel panel={lab.panel} focus={lab.focus} />
        <LabFacts facts={lab.facts} links={lab.links} locale={locale} />
      </section>

      <LabProcess process={lab.process} />
      <LabPerson edgar={lab.edgar} locale={locale} />
      <CostPhotoCta locale={locale} />
    </main>
  );
}
