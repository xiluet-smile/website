// JSON-LD builders. Everything is derived from src/content so schema and
// visible copy cannot drift apart.
import { abs, pages, site, type PagePath } from "./site";
import { ogImagePath } from "./images";

type Node = Record<string, unknown>;
export type Faq = { q: string; a: string };

const DENTIST_ID = `${site.url}/#dentist`;
const WEBSITE_ID = `${site.url}/#website`;

export const dentistRef = () => ({ "@id": DENTIST_ID });

export function dentist(): Node {
  return {
    "@type": "Dentist",
    "@id": DENTIST_ID,
    name: site.name,
    url: site.url,
    logo: `${site.url}/og/xiluet-logo.png`,
    image: site.url + ogImagePath(site.defaultOgImage),
    telephone: site.phone.schema,
    priceRange: site.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    sameAs: [site.social.instagram, site.social.facebook, site.social.tiktok, site.social.youtube],
    areaServed: site.areaServed,
    availableLanguage: site.languages.codes,
  };
}

export function webSite(): Node {
  return { "@type": "WebSite", "@id": WEBSITE_ID, url: site.url, name: site.name, publisher: dentistRef() };
}

export function webPage(path: PagePath): Node {
  const page = pages[path];
  return {
    "@type": "WebPage",
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name: page.title,
    description: page.description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-US",
  };
}

/** Home → …parents → this page, using each page's breadcrumb label. */
export function breadcrumb(path: PagePath): Node {
  const parts = path.split("/").filter(Boolean);
  const trail = parts.map((_, i) => `/${parts.slice(0, i + 1).join("/")}` as PagePath);
  // Parents use their short nav name (e.g. "Doctors"), the leaf uses its own label.
  const parentNames: Record<string, string> = { "/doctors": "Doctors", "/financing": "Financing" };
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
      ...trail.map((p, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: i < trail.length - 1 ? (parentNames[p] ?? pages[p].breadcrumb) : pages[p].breadcrumb,
        item: abs(p),
      })),
    ],
  };
}

export function faqPage(faqs: Faq[]): Node {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function medicalProcedure(
  path: PagePath,
  p: { name: string; definition: string; procedureType: string; priceUsd?: number | null },
): Node {
  return {
    "@type": "MedicalProcedure",
    name: p.name,
    description: p.definition,
    procedureType: p.procedureType,
    bodyLocation: "Teeth",
    provider: dentistRef(),
    ...(p.priceUsd
      ? {
          offers: {
            "@type": "Offer",
            price: String(p.priceUsd),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: abs(path),
          },
        }
      : {}),
  };
}

export function physician(path: PagePath, d: { name: string; image: string }): Node {
  return {
    "@type": "Physician",
    name: d.name,
    jobTitle: "Dentist",
    medicalSpecialty: "Dentistry",
    image: site.url + ogImagePath(d.image),
    worksFor: dentistRef(),
    knowsLanguage: site.languages.codes,
    url: abs(path),
  };
}

export function offerCatalog(name: string, offers: { name: string; priceUsd: number; url: string }[]): Node {
  return {
    "@type": "OfferCatalog",
    name,
    itemListElement: offers.map((o) => ({
      "@type": "Offer",
      name: o.name,
      price: String(o.priceUsd),
      priceCurrency: "USD",
      url: abs(o.url),
      seller: dentistRef(),
    })),
  };
}

export function imageGallery(path: PagePath, name: string, images: { url: string; caption: string }[]): Node {
  return {
    "@type": "ImageGallery",
    name,
    url: abs(path),
    image: images.map((i) => ({ "@type": "ImageObject", contentUrl: site.url + i.url, caption: i.caption })),
  };
}

export function contactPage(path: PagePath, name?: string): Node {
  return { "@type": "ContactPage", url: abs(path), name: name ?? pages[path].title };
}

/** Standard graph for a page: Dentist, WebPage, WebSite, BreadcrumbList (non-home) + extras. */
export function pageGraph(path: PagePath, ...extra: Node[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [dentist(), webPage(path), webSite(), ...(path === "/" ? [] : [breadcrumb(path)]), ...extra],
  };
}
