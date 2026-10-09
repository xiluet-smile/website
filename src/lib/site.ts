import site from "@/content/site.json";
import nav from "@/content/nav.json";
import pages from "@/content/pages.json";

export { site, nav, pages };

export type PagePath = keyof typeof pages;

/** Legal documents are published in English only; the /es copies carry a Spanish heading and notice over the English text.
 *  They are canonicalised to the English page and left out of hreflang and the sitemap until a reviewed translation exists. */
export const LEGAL_PATHS: PagePath[] = ["/terms", "/privacy-policy", "/notice-of-privacy-practices", "/refund-and-cancellation"];
export const isLegalPath = (path: string) => (LEGAL_PATHS as string[]).includes(path);

export const abs = (path: string) => (path === "/" ? `${site.url}/` : `${site.url}${path}`);

/** Resolves hrefs stored in content JSON ("maps:place" → site.maps.place). */
export const resolveHref = (href: string) =>
  href.startsWith("maps:") ? site.maps[href.slice(5) as keyof typeof site.maps] : href;

export const isExternal = (href: string) => /^https?:/.test(href);
