// JSON-LD builders. Everything is derived from src/content so schema and
// visible copy cannot drift apart. Page-level nodes take the locale so /es
// pages get localized URLs, names and language tags.
import { abs, isLegalPath, site, type PagePath } from "./site";
import { getContent, ui } from "./content-i18n";
import { langTag, localizePath, type Locale } from "./i18n";
import { ogImagePath } from "./images";

type Node = Record<string, unknown>;
export type Faq = { q: string; a: string };

const DENTIST_ID = `${site.url}/#dentist`;
const WEBSITE_ID = `${site.url}/#website`;

/** Absolute URL of an English route in the given locale. */
const absL = (path: PagePath, locale: Locale) => abs(localizePath(path, locale));

// References carry @type, name and url next to the @id so validators that do not resolve @graph links (Semrush Site Audit) still see a complete object; Google merges them by @id.
const postalAddress = () => ({
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
});
// Semrush Site Audit requires `address` on every LocalBusiness object, references included, so the reference carries it too.
export const dentistRef = () => ({ "@type": "Dentist", "@id": DENTIST_ID, name: site.name, url: site.url, address: postalAddress() });
const webSiteRef = () => ({ "@type": "WebSite", "@id": WEBSITE_ID, name: site.name, url: site.url });

/** Google wants ISO 8601 date-times with a timezone on Article dates; content stores plain dates, published at 9 AM Miami time. */
const dateTime = (iso: string) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", timeZoneName: "longOffset" }).formatToParts(new Date(`${iso}T12:00:00Z`));
  const offset = (parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT-05:00").replace("GMT", "") || "-05:00";
  return `${iso}T09:00:00${offset}`;
};

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
    address: postalAddress(),
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
    knowsLanguage: site.languages.codes,
  };
}

export function webSite(): Node {
  return { "@type": "WebSite", "@id": WEBSITE_ID, url: site.url, name: site.name, publisher: dentistRef() };
}

export function webPage(path: PagePath, locale: Locale = "en"): Node {
  const page = getContent(locale).pages[path];
  const url = absL(path, locale);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    isPartOf: webSiteRef(),
    inLanguage: isLegalPath(path) ? langTag("en") : langTag(locale),
  };
}

/** Home → …parents → this page, using each page's breadcrumb label. */
export function breadcrumb(path: PagePath, locale: Locale = "en"): Node {
  const { pages } = getContent(locale);
  const t = ui(locale);
  const parts = path.split("/").filter(Boolean);
  const trail = parts.map((_, i) => `/${parts.slice(0, i + 1).join("/")}` as PagePath);
  // Parents use their short nav name (e.g. "Doctors"), the leaf uses its own label.
  const parentNames: Record<string, string> = { "/doctors": t.breadcrumb.doctors, "/financing": t.breadcrumb.financing, "/blog": t.breadcrumb.blog };
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.home, item: absL("/", locale) },
      ...trail.map((p, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: i < trail.length - 1 ? (parentNames[p] ?? pages[p].breadcrumb) : pages[p].breadcrumb,
        item: absL(p, locale),
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
  locale: Locale = "en",
): Node {
  return {
    "@type": "MedicalProcedure",
    "@id": `${absL(path, locale)}#procedure`,
    name: p.name,
    description: p.definition,
    procedureType: p.procedureType,
    bodyLocation: "Teeth",
    relevantSpecialty: "https://schema.org/Dentistry",
  };
}

/** The practice's offer for a procedure (price lives here, not on the MedicalProcedure, which has no offers property). */
export function procedureOffer(path: PagePath, p: { name: string; priceUsd?: number | null }, locale: Locale = "en"): Node[] {
  if (!p.priceUsd) return [];
  return [
    {
      "@type": "Offer",
      name: p.name,
      price: String(p.priceUsd),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: absL(path, locale),
      itemOffered: { "@type": "MedicalProcedure", "@id": `${absL(path, locale)}#procedure`, name: p.name },
      offeredBy: dentistRef(),
    },
  ];
}

export function physician(path: PagePath, d: { name: string; image: string }, locale: Locale = "en"): Node {
  return {
    "@type": "Person",
    "@id": `${absL(path, locale)}#person`,
    name: d.name,
    jobTitle: "Dentist",
    image: site.url + ogImagePath(d.image),
    worksFor: dentistRef(),
    knowsLanguage: site.languages.codes,
    url: absL(path, locale),
  };
}

export function offerCatalog(name: string, offers: { name: string; priceUsd: number; url: string }[], locale: Locale = "en"): Node {
  return {
    "@type": "OfferCatalog",
    name,
    itemListElement: offers.map((o) => ({
      "@type": "Offer",
      name: o.name,
      price: String(o.priceUsd),
      priceCurrency: "USD",
      url: absL(o.url as PagePath, locale),
      seller: dentistRef(),
    })),
  };
}

export function imageGallery(path: PagePath, name: string, images: { url: string; caption: string }[], locale: Locale = "en"): Node {
  return {
    "@type": "ImageGallery",
    name,
    url: absL(path, locale),
    image: images.map((i) => ({ "@type": "ImageObject", contentUrl: site.url + i.url, caption: i.caption })),
  };
}

export function contactPage(path: PagePath, locale: Locale = "en", name?: string): Node {
  return { "@type": "ContactPage", url: absL(path, locale), name: name ?? getContent(locale).pages[path].title };
}

/** Blog post: Article with the authoring doctor, the reviewing doctor and the practice as publisher. */
export function article(
  path: PagePath,
  a: { headline: string; description: string; image: string; datePublished: string; dateModified?: string; author: string; reviewedBy?: string; wordCount?: number },
  locale: Locale = "en",
): Node {
  const { doctors } = getContent(locale);
  const person = (name: string) => {
    const d = doctors.find((x) => x.name === name);
    return d
      ? { "@type": "Person", name, jobTitle: "Dentist", url: absL(`/doctors/${d.slug}` as PagePath, locale), worksFor: dentistRef() }
      : { "@type": "Organization", name, "@id": DENTIST_ID };
  };
  const url = absL(path, locale);
  return {
    "@type": ["Article", "MedicalWebPage"],
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage`, url },
    headline: a.headline,
    description: a.description,
    image: site.url + ogImagePath(a.image),
    datePublished: dateTime(a.datePublished),
    dateModified: dateTime(a.dateModified ?? a.datePublished),
    author: person(a.author),
    ...(a.reviewedBy ? { reviewedBy: person(a.reviewedBy) } : {}),
    publisher: dentistRef(),
    inLanguage: langTag(locale),
    ...(a.wordCount ? { wordCount: a.wordCount } : {}),
    about: { "@type": "MedicalSpecialty", name: "Dentistry" },
  };
}

/** Standard graph for a page: Dentist, WebPage, WebSite, BreadcrumbList (non-home) + extras. */
export function pageGraph(path: PagePath, locale: Locale, ...extra: Node[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [dentist(), webPage(path, locale), webSite(), ...(path === "/" ? [] : [breadcrumb(path, locale)]), ...extra],
  };
}
