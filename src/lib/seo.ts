import type { Metadata } from "next";
import { abs, site, type PagePath } from "./site";
import { getContent } from "./content-i18n";
import { localizePath, type Locale } from "./i18n";
import { ogImagePath } from "./images";

/** Title, description, canonical, hreflang alternates and Open Graph for a route, from the locale's pages.json. */
export function pageMetadata(path: PagePath, locale: Locale = "en"): Metadata {
  const page = getContent(locale).pages[path];
  const enUrl = abs(path);
  const esUrl = abs(localizePath(path, "es"));
  const url = locale === "es" ? esUrl : enUrl;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url, languages: { "en-US": enUrl, "es-US": esUrl, "x-default": enUrl } },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: page.title,
      description: page.description,
      url,
      locale: locale === "es" ? "es_US" : "en_US",
      images: [{ url: ogImagePath(page.ogImage), width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}
