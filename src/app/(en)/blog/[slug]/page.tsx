import type { Metadata } from "next";
import blogPosts from "@/content/blog-posts.json";
import PageBody from "@/components/pages/PageBody";
import { pageMetadata } from "@/lib/seo";
import type { PagePath } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/blog/${slug}` as PagePath);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <PageBody path={`/blog/${slug}` as PagePath} locale="en" />;
}
