import type { Metadata } from "next";
import PageBody from "@/components/pages/PageBody";
import { doctors } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import type { PagePath } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return doctors.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/doctors/${slug}` as PagePath);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PageBody path={`/doctors/${slug}` as PagePath} locale="en" />;
}
