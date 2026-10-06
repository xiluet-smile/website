// 404 for any URL that matches no route (out/404.html). The site has two root
// layouts (English at the root, Spanish under /es), so this file renders the
// full document itself; the language switch links to /es.
import type { Metadata } from "next";
import NotFoundPage from "@/components/pages/NotFoundPage";
import RootShell from "@/components/RootShell";
import { ui } from "@/lib/content-i18n";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { absolute: `${ui("en").notFound.title} | ${site.name}` },
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <RootShell locale="en">
      <NotFoundPage locale="en" />
    </RootShell>
  );
}
