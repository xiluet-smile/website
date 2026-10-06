import type { Metadata } from "next";
import NotFoundPage from "@/components/pages/NotFoundPage";
import { ui } from "@/lib/content-i18n";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${ui("en").notFound.title} | ${site.name}` },
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundPage locale="en" />;
}
