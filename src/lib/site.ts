import site from "@/content/site.json";
import nav from "@/content/nav.json";
import pages from "@/content/pages.json";

export { site, nav, pages };

export type PagePath = keyof typeof pages;

export const abs = (path: string) => (path === "/" ? `${site.url}/` : `${site.url}${path}`);

/** Resolves hrefs stored in content JSON ("maps:place" → site.maps.place). */
export const resolveHref = (href: string) =>
  href.startsWith("maps:") ? site.maps[href.slice(5) as keyof typeof site.maps] : href;

export const isExternal = (href: string) => /^https?:/.test(href);
