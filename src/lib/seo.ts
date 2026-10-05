import type { Metadata } from "next";
import { abs, pages, site, type PagePath } from "./site";
import { ogImagePath } from "./images";

/** Title, description, canonical and Open Graph for a route, from content/pages.json. */
export function pageMetadata(path: PagePath): Metadata {
  const page = pages[path];
  const url = abs(path);
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: page.title,
      description: page.description,
      url,
      images: [{ url: ogImagePath(page.ogImage), width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image" },
  };
}
