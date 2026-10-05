import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import LenderPage, { type LenderContent } from "@/components/LenderPage";
import affirm from "@/content/lenders/affirm.json";
import carecredit from "@/content/lenders/carecredit.json";
import cherry from "@/content/lenders/cherry.json";
import lendingclub from "@/content/lenders/lendingclub.json";
import sunbit from "@/content/lenders/sunbit.json";
import { lenders } from "@/lib/content";
import { pageGraph, faqPage } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { pages, type PagePath } from "@/lib/site";

const content: Record<string, LenderContent> = { cherry, sunbit, carecredit, lendingclub, affirm };

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return lenders.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/financing/${slug}` as PagePath);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const lender = lenders.find((l) => l.slug === slug);
  const data = content[slug];
  if (!lender || !data) notFound();
  const path = `/financing/${slug}` as PagePath;

  return (
    <main id="main">
      <JsonLd data={pageGraph(path, faqPage(data.faq))} />
      <LenderPage lender={lender} content={data} h1={pages[path].h1} />
    </main>
  );
}
