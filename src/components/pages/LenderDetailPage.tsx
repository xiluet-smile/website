import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import LenderPage from "@/components/LenderPage";
import { getContent } from "@/lib/content-i18n";
import type { Locale } from "@/lib/i18n";
import { pageGraph, faqPage } from "@/lib/schema";
import type { PagePath } from "@/lib/site";

/** /financing/{slug}: partner page from lenders.json + lenders/{slug}.json. */
export default function LenderDetailPage({ slug, locale = "en" }: { slug: string; locale?: Locale }) {
  const { lenders, lenderContent, pages } = getContent(locale);
  const lender = lenders.find((l) => l.slug === slug);
  const data = lenderContent[slug];
  if (!lender || !data) notFound();
  const path = `/financing/${slug}` as PagePath;

  return (
    <main id="main">
      <JsonLd data={pageGraph(path, locale, faqPage(data.faq))} />
      <LenderPage lender={lender} content={data} h1={pages[path].h1} locale={locale} />
    </main>
  );
}
