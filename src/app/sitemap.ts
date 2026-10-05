import type { MetadataRoute } from "next";
import { cases } from "@/lib/content";
import { imageInfo } from "@/lib/images";
import { abs, pages, site, type PagePath } from "@/lib/site";

export const dynamic = "force-static";

const TREATMENTS = ["/porcelain-veneers-miami", "/smile-design-miami", "/full-mouth-reconstruction-miami", "/all-on-x-dental-implants-miami", "/smile-makeover-miami"];
const priority = (p: string) => (p === "/" ? 1 : TREATMENTS.includes(p) ? 0.9 : p === "/contact" ? 0.6 : 0.7);

/** sitemap.xml: every route in pages.json, with image entries for the before/after gallery. */
export default function sitemap(): MetadataRoute.Sitemap {
  const caseImages = cases.map((c) => {
    const info = imageInfo(c.image);
    return site.url + info.src;
  });
  return (Object.keys(pages) as PagePath[]).map((path) => ({
    url: abs(path),
    changeFrequency: "monthly",
    priority: priority(path),
    ...(path === "/before-and-after" ? { images: caseImages } : {}),
  }));
}
