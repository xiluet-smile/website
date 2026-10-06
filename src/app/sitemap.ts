import type { MetadataRoute } from "next";
import { cases } from "@/lib/content";
import { localizePath } from "@/lib/i18n";
import { imageInfo } from "@/lib/images";
import { abs, pages, site, type PagePath } from "@/lib/site";

export const dynamic = "force-static";

const TREATMENTS = ["/porcelain-veneers-miami", "/smile-design-miami", "/complete-restoration-miami", "/full-mouth-reconstruction-miami", "/all-on-x-dental-implants-miami", "/smile-makeover-miami"];
const priority = (p: string) => (p === "/" ? 1 : TREATMENTS.includes(p) ? 0.9 : p === "/contact" ? 0.6 : 0.7);

/** sitemap.xml: every route in pages.json in both languages (with hreflang alternates), plus image entries for the before/after gallery. */
export default function sitemap(): MetadataRoute.Sitemap {
  const caseImages = cases.map((c) => {
    const info = imageInfo(c.image);
    return site.url + info.src;
  });
  return (Object.keys(pages) as PagePath[]).flatMap((path) => {
    const en = abs(path);
    const es = abs(localizePath(path, "es"));
    const languages = { "en-US": en, "es-US": es, "x-default": en };
    return [en, es].map((url) => ({
      url,
      changeFrequency: "monthly" as const,
      priority: priority(path),
      alternates: { languages },
      ...(path === "/before-and-after" ? { images: caseImages } : {}),
    }));
  });
}
