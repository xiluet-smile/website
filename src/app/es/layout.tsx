import type { Metadata, Viewport } from "next";
import RootShell from "@/components/RootShell";
import { site } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
};

export const viewport: Viewport = { themeColor: "#04282E" };

/** Spanish root layout: every /es route renders inside <html lang="es-US"> with the Spanish header, footer and mobile bar. */
export default function EsLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="es">{children}</RootShell>;
}
