import type { MetadataRoute } from "next";
import blogPosts from "@/content/blog-posts.json";
import { cases } from "@/lib/content";
import { localizePath } from "@/lib/i18n";
import { imageInfo } from "@/lib/images";
import { abs, isLegalPath, pages, site, type PagePath } from "@/lib/site";

export const dynamic = "force-static";

const TREATMENTS = ["/porcelain-veneers-miami", "/smile-design-miami", "/full-mouth-reconstruction-miami", "/all-on-x-dental-implants-miami", "/smile-makeover-miami"];
const lastModified = Object.fromEntries(blogPosts.map((p) => [`/blog/${p.slug}`, new Date(p.dateModified)]));
const priority = (p: string) => (p === "/" ? 1 : TREATMENTS.includes(p) ? 0.9 : p === "/contact" ? 0.6 : 0.7);

/** sitemap.xml: every route in pages.json in both languages (with hreflang alternates), plus image entries for the before/after gallery. */
export default function sitemap(): MetadataRoute.Sitemap {
  const caseImages = cases.map((c) => {
    const info = imageInfo(c.image);
    return site.url + info.src;
  });
  return (Object.keys(pages) as PagePath[]).flatMap((path): MetadataRoute.Sitemap => {
    const en = abs(path);
    const es = abs(localizePath(path, "es"));
    const languages = { "en-US": en, "es-US": es, "x-default": en };
    // English-only legal documents: list the English page only, without alternates.
    if (isLegalPath(path)) return [{ url: en, changeFrequency: "yearly" as const, priority: 0.3 }];
    return [en, es].map((url) => ({
      url,
      changeFrequency: "monthly" as const,
      priority: priority(path),
      ...(lastModified[path] ? { lastModified: lastModified[path] } : {}),
      alternates: { languages },
      ...(path === "/before-and-after" ? { images: caseImages } : {}),
    }));
  });
}
