import type { Metadata } from "next";
import PageBody from "@/components/pages/PageBody";
import { lenders } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { PagePath } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return lenders.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/financing/${slug}` as PagePath);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PageBody path={`/financing/${slug}` as PagePath} locale="en" />;
}
