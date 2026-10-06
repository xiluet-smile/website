// Spanish mirror: every English route, rendered at its translated slug under
// /es with locale="es". The slug list comes from esPaths in lib/i18n.ts.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageBody from "@/components/pages/PageBody";
import { esPaths, esSlugs, toEnPath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug?: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ slug: [] }, ...esSlugs.map((s) => ({ slug: s.split("/") }))];
}

/** English route for the requested Spanish slug, or undefined when it is not a known page. */
function enPathOf(slug?: string[]) {
  const en = toEnPath(`/es/${(slug ?? []).join("/")}`);
  return en !== undefined && en in esPaths ? en : undefined;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const en = enPathOf((await params).slug);
  return en ? pageMetadata(en, "es") : {};
}

export default async function Page({ params }: Props) {
  const en = enPathOf((await params).slug);
  if (!en) notFound();
  return <PageBody path={en} locale="es" />;
}
