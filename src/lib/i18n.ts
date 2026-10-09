// Locale plumbing. English lives at the root; Spanish mirrors every route under
// /es with translated slugs. Content for each locale is resolved by lib/content-i18n.ts.
import blogPosts from "@/content/blog-posts.json";
import type { PagePath } from "./site";

export type Locale = "en" | "es";
export const locales: Locale[] = ["en", "es"];
export const defaultLocale: Locale = "en";

/** English route → Spanish route (full path, including the /es prefix). */
export const esPaths: Record<PagePath, string> = {
  // Blog articles are generated from src/content/blog by scripts/sync-blog.mjs.
  ...(Object.fromEntries(blogPosts.map((p) => [`/blog/${p.slug}`, `/es/blog/${p.esSlug}`])) as Record<PagePath, string>),
  "/": "/es",
  "/porcelain-veneers-miami": "/es/carillas-de-porcelana-miami",
  "/smile-design-miami": "/es/diseno-de-sonrisa-miami",
  "/full-mouth-reconstruction-miami": "/es/reconstruccion-bucal-completa-miami",
  "/all-on-x-dental-implants-miami": "/es/implantes-dentales-all-on-x-miami",
  "/smile-makeover-miami": "/es/transformacion-de-sonrisa-miami",
  "/doctors": "/es/doctores",
  "/doctors/dr-roger-ramos-navarro": "/es/doctores/dr-roger-ramos-navarro",
  "/doctors/dr-marta-puentes-marrero": "/es/doctores/dr-marta-puentes-marrero",
  "/doctors/dr-gretell-alonso-fiel": "/es/doctores/dr-gretell-alonso-fiel",
  "/clinic": "/es/clinica",
  "/financing": "/es/financiamiento",
  "/financing/cherry": "/es/financiamiento/cherry",
  "/financing/sunbit": "/es/financiamiento/sunbit",
  "/financing/carecredit": "/es/financiamiento/carecredit",
  "/financing/lendingclub": "/es/financiamiento/lendingclub",
  "/financing/alphaeon": "/es/financiamiento/alphaeon",
  "/before-and-after": "/es/antes-y-despues",
  "/out-of-state-patients": "/es/pacientes-de-otros-estados",
  "/veneers-cost-miami": "/es/precio-carillas-miami",
  "/blog": "/es/blog",
  "/free-photo-evaluation": "/es/evaluacion-gratuita-por-fotos",
  "/contact": "/es/contacto",
  "/referrals": "/es/referidos",
  "/partnerships": "/es/alianzas",
  "/privacy-policy": "/es/politica-de-privacidad",
  "/terms": "/es/terminos",
  "/notice-of-privacy-practices": "/es/aviso-de-practicas-de-privacidad",
  "/refund-and-cancellation": "/es/reembolsos-y-cancelaciones",
};

const enFromEs = Object.fromEntries(Object.entries(esPaths).map(([en, es]) => [es, en])) as Record<string, PagePath>;

/** The URL of an English route in the given locale. */
export const localizePath = (path: PagePath, locale: Locale) => (locale === "es" ? esPaths[path] : path);

/**
 * Localizes an href stored in content JSON: internal routes are mapped like
 * localizePath (a trailing `#fragment` is kept), anything else (external URLs,
 * `maps:` keys, `#anchors`, unknown paths) is returned unchanged.
 */
export const localizeHref = (href: string, locale: Locale) => {
  if (locale === "en") return href;
  const [path, hash] = href.split("#", 2);
  const es = (esPaths as Record<string, string>)[path];
  return es ? (hash === undefined ? es : `${es}#${hash}`) : href;
};

/** English route for any URL on the site ("/es/clinica" → "/clinic", "/clinic" → "/clinic"). */
export const toEnPath = (path: string): PagePath | undefined => {
  const clean = path.replace(/\/+$/, "") || "/";
  if (clean === "/es" || clean.startsWith("/es/")) return enFromEs[clean];
  return clean as PagePath;
};

export const localeOfPath = (path: string): Locale => (path === "/es" || path.startsWith("/es/") ? "es" : "en");

/** Spanish slug segments (after /es/) for generateStaticParams. */
export const esSlugs = Object.values(esPaths).map((p) => p.replace(/^\/es\/?/, "")).filter(Boolean);

export const langTag = (locale: Locale) => (locale === "es" ? "es-US" : "en-US");
