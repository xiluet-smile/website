import type { Metadata, Viewport } from "next";
import RootShell from "@/components/RootShell";
import { site } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
};

export const viewport: Viewport = { themeColor: "#04282E" };

/** English root layout (routes at the site root). The Spanish mirror has its own root layout in app/es. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
