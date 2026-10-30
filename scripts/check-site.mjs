// Post-build checks on the static HTML in out/ (no JavaScript executed, so this
// is what crawlers and no-JS visitors get): head tags, one <h1>, valid JSON-LD,
// FAQ answers and prices present, no leftover design placeholders.
// When the design handoff folder is present, JSON-LD is also diffed against it.
// The Spanish mirror (/es/…) is checked the same way against src/content/es/pages.json.
import { existsSync, readFileSync } from "node:fs";

const pages = JSON.parse(readFileSync("src/content/pages.json", "utf8"));
const esPages = JSON.parse(readFileSync("src/content/es/pages.json", "utf8"));
// English-only legal documents: the /es copy canonicalises to the English page, no hreflang on either side (see src/lib/site.ts).
const LEGAL = ["/terms", "/privacy-policy", "/notice-of-privacy-practices", "/refund-and-cancellation"];
// English route → Spanish route, read from the source of truth in src/lib/i18n.ts.
const esPaths = Object.fromEntries([
  ...[...readFileSync("src/lib/i18n.ts", "utf8").matchAll(/^\s*"(\/[^"]*)": "(\/es[^"]*)",?$/gm)].map((m) => [m[1], m[2]]),
  // Blog articles are registered by scripts/sync-blog.mjs.
  ...JSON.parse(readFileSync("src/content/blog-posts.json", "utf8")).map((p) => [`/blog/${p.slug}`, `/es/blog/${p.esSlug}`]),
]);
const DESIGN = "design_handoff_xiluet_website/design/";
const designFiles = existsSync(DESIGN)
  ? Object.fromEntries(
      (await import("node:fs")).readdirSync(DESIGN).filter((f) => f.endsWith(".dc.html")).map((f) => {
        const s = readFileSync(DESIGN + f, "utf8");
        const seo = s.split("<!-- seo -->")[1];
        const path = seo.match(/rel="canonical" href="https:\/\/xiluetsmiledesign\.com([^"]*)"/)[1] || "/";
        return [path, JSON.parse(seo.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])];
      }),
    )
  : {};

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const strip = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
// Ignore fields that intentionally differ from the prototype (asset URLs).
const norm = (n) => JSON.stringify(n, (k, v) => (["logo", "image"].includes(k) ? undefined : v));

let failures = 0;
const fail = (path, msg) => {
  failures++;
  console.log(`✗ ${path}: ${msg}`);
};

// ---------- SEO pass checks (2026-10-30), shared by both languages ----------
// Every old URL in public/_redirects: no live page may link to one (the link would 301).
const redirected = new Set(
  readFileSync("public/_redirects", "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map((l) => l.split(/\s+/)[0]),
);
// Florida dental advertising: never in claims. "warranty" is allowed; best/top/permanent are only reported (they have neutral uses).
const BANNED = /\b(guaranteed|painless|pain-free|all-inclusive|stain-proof|garantizad[oa]s?|indolor[oa]s?|a prueba de manchas|todo incluido)\b|\bsin dolor\b|#1\b/i;
const SOFT = /\b(best|top|permanent(ly)?|mejor(es)?|permanente?s?)\b/gi;
let softHits = 0;
function seoChecks(path, html, text, title, desc, lang, enPath) {
  if (title.length > 60) fail(path, `title is ${title.length} chars (max 60)`);
  if (desc.length < 110 || desc.length > 160) fail(path, `meta description is ${desc.length} chars (110–160)`);
  const main = strip((html.match(/<main[\s>][\s\S]*?<\/main>/) || ["", ""])[0]);
  const banned = main.match(BANNED);
  if (banned) fail(path, `banned advertising word in <main>: "${banned[0]}"`);
  softHits += (main.match(SOFT) || []).length;
  if (/7,999/.test(text)) fail(path, "$7,999 is not a current price");
  // The package name (capitalised) right before the Makeover price; lower-case "smile design" in a sentence about crowns is fine.
  if (/Smile Design[^.$;]{0,40}\$6,999|Diseño de Sonrisa[^.$;]{0,40}\$6,999/.test(text)) fail(path, "Smile Design shown next to $6,999 (package is $5,999)");
  for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) if (redirected.has(m[1])) fail(path, `links to a redirected URL: ${m[1]}`);
  if (lang === "en" && !LEGAL.includes(path)) {
    const es = esPaths[path];
    for (const [l, target] of [["en-US", `https://xiluetsmiledesign.com${path}`], ["es-US", `https://xiluetsmiledesign.com${es}`], ["x-default", `https://xiluetsmiledesign.com${path}`]]) {
      const re = new RegExp(`<link rel="alternate" hrefLang="${l}" href="${target.replace(/\/$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?"`);
      if (!re.test(html)) fail(path, `no hreflang ${l} link to ${target}`);
    }
    if (!html.includes(`property="og:locale:alternate" content="es_US"`)) fail(path, "no og:locale:alternate es_US");
  }
  if (lang === "es" && !LEGAL.includes(enPath) && !html.includes(`property="og:locale:alternate" content="en_US"`)) fail(path, "no og:locale:alternate en_US");
}
const titles = new Set();

for (const [path, page] of Object.entries(pages)) {
  const file = path === "/" ? "out/index.html" : `out${path}.html`;
  if (!existsSync(file)) {
    fail(path, `missing ${file}`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const text = strip(html);

  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? "");
  if (title !== page.title) fail(path, `title is "${title}"`);
  if (titles.has(title)) fail(path, "duplicate title");
  titles.add(title);
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? "");
  if (desc !== page.description) fail(path, "meta description mismatch");
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] ?? "";
  if (canonical.replace(/\/$/, "") !== `https://xiluetsmiledesign.com${path}`.replace(/\/$/, "")) fail(path, `canonical is "${canonical}"`);
  if (!/property="og:image"/.test(html)) fail(path, "no og:image");
  seoChecks(path, html, text, title, desc, "en", path);

  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) fail(path, `${h1s.length} <h1> elements`);
  if (/\[(Patient name|Credential line|Review text|Name as published|covered items|Mon YYYY|Treatment|placeholder|Confirm with clinic|Video:)/i.test(text)) fail(path, "design placeholder text in page");
  for (const img of html.match(/<img\b[^>]*>/g) || []) if (!/\balt=/.test(img)) fail(path, `img without alt: ${img.slice(0, 80)}`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length !== 1) {
    fail(path, `${blocks.length} JSON-LD blocks`);
    continue;
  }
  let graph;
  try {
    graph = JSON.parse(blocks[0])["@graph"];
  } catch (e) {
    fail(path, `JSON-LD does not parse: ${e.message}`);
    continue;
  }
  const types = graph.map((n) => n["@type"]);
  if (!types.includes("Dentist")) fail(path, "no Dentist node");
  if (path !== "/" && !types.includes("BreadcrumbList")) fail(path, "no BreadcrumbList");

  // FAQ answers and offer prices in schema must be visible in the no-JS HTML.
  for (const q of graph.find((n) => n["@type"] === "FAQPage")?.mainEntity ?? []) {
    if (!text.includes(q.name)) fail(path, `FAQ question not in HTML: ${q.name}`);
    if (!text.includes(q.acceptedAnswer.text)) fail(path, `FAQ answer not in HTML: ${q.name}`);
  }
  const offers = graph.flatMap((n) => (n.offers ? [n.offers] : n["@type"] === "OfferCatalog" ? n.itemListElement : []));
  for (const o of offers) {
    const shown = `$${Number(o.price).toLocaleString("en-US")}`;
    if (!text.includes(shown)) fail(path, `offer price ${shown} not in HTML`);
  }

  const design = designFiles[path]?.["@graph"];
  if (design) {
    for (const d of design) {
      const match = graph.filter((n) => n["@type"] === d["@type"]);
      if (!match.length) console.log(`  note ${path}: design has ${d["@type"]}, build does not`);
      else if (!match.some((n) => norm(n) === norm(d))) console.log(`  note ${path}: ${d["@type"]} differs from design`);
    }
    for (const t of types) if (!design.some((d) => d["@type"] === t)) console.log(`  note ${path}: build adds ${t}`);
  }
}

// ---------- Spanish mirror ----------
const esTitles = new Set();
let esCount = 0;
for (const [enPath, page] of Object.entries(esPages)) {
  const path = esPaths[enPath];
  if (!path) {
    fail(enPath, "no Spanish route in src/lib/i18n.ts");
    continue;
  }
  esCount++;
  const file = `out${path}.html`;
  if (!existsSync(file)) {
    fail(path, `missing ${file}`);
    continue;
  }
  const html = readFileSync(file, "utf8");
  const text = strip(html);

  if (!/<html[^>]*\blang="es-US"/.test(html)) fail(path, "<html> is not lang=es-US");
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] ?? "");
  if (title !== page.title) fail(path, `title is "${title}"`);
  if (esTitles.has(title) || titles.has(title)) fail(path, "duplicate title");
  esTitles.add(title);
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ?? "");
  if (desc !== page.description) fail(path, "meta description mismatch");
  const legal = LEGAL.includes(enPath);
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] ?? "";
  if (canonical.replace(/\/$/, "") !== `https://xiluetsmiledesign.com${legal ? enPath : path}`) fail(path, `canonical is "${canonical}"`);
  if (legal && /<link rel="alternate" hrefLang=/.test(html)) fail(path, "legal page must not declare hreflang");
  for (const [lang, target] of legal ? [] : [
    ["en-US", `https://xiluetsmiledesign.com${enPath}`],
    ["es-US", `https://xiluetsmiledesign.com${path}`],
    ["x-default", `https://xiluetsmiledesign.com${enPath}`],
  ]) {
    const re = new RegExp(`<link rel="alternate" hrefLang="${lang}" href="${target.replace(/\/$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?"`);
    if (!re.test(html)) fail(path, `no hreflang ${lang} link to ${target}`);
  }
  if (!/property="og:image"/.test(html)) fail(path, "no og:image");
  seoChecks(path, html, text, title, desc, "es", enPath);

  // Inline spans (e.g. the sr-only ", " before "DMD") add whitespace before punctuation; ignore it.
  // The home H1 renders "Keyword: tagline" as two lines without the colon.
  const h1Text = (s) => strip(s).replace(/\s+([,.·])/g, "$1").replace(/:\s/g, " ").trim();
  const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)];
  if (h1s.length !== 1) fail(path, `${h1s.length} <h1> elements`);
  else if (h1Text(h1s[0][0]) !== h1Text(page.h1)) fail(path, `h1 is "${h1Text(h1s[0][0])}"`);
  if (/\[(Patient name|Credential line|Review text|Name as published|covered items|Mon YYYY|Treatment|placeholder|Confirm with clinic|Video:)/i.test(text)) fail(path, "design placeholder text in page");
  for (const img of html.match(/<img\b[^>]*>/g) || []) if (!/\balt=/.test(img)) fail(path, `img without alt: ${img.slice(0, 80)}`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length !== 1) {
    fail(path, `${blocks.length} JSON-LD blocks`);
    continue;
  }
  let graph;
  try {
    graph = JSON.parse(blocks[0])["@graph"];
  } catch (e) {
    fail(path, `JSON-LD does not parse: ${e.message}`);
    continue;
  }
  const types = graph.map((n) => n["@type"]);
  if (!types.includes("Dentist")) fail(path, "no Dentist node");
  if (enPath !== "/" && !types.includes("BreadcrumbList")) fail(path, "no BreadcrumbList");
  const webPage = graph.find((n) => n["@type"] === "WebPage");
  if (webPage?.inLanguage !== (legal ? "en-US" : "es-US")) fail(path, `WebPage inLanguage is ${webPage?.inLanguage}`);
  if (webPage?.url !== `https://xiluetsmiledesign.com${path}`) fail(path, `WebPage url is ${webPage?.url}`);
  for (const q of graph.find((n) => n["@type"] === "FAQPage")?.mainEntity ?? []) {
    if (!text.includes(q.name)) fail(path, `FAQ question not in HTML: ${q.name}`);
    if (!text.includes(q.acceptedAnswer.text)) fail(path, `FAQ answer not in HTML: ${q.name}`);
  }
  const offers = graph.flatMap((n) => (n.offers ? [n.offers] : n["@type"] === "OfferCatalog" ? n.itemListElement : []));
  for (const o of offers) {
    const shown = `$${Number(o.price).toLocaleString("en-US")}`;
    if (!text.includes(shown)) fail(path, `offer price ${shown} not in HTML`);
  }
}

if (softHits) console.log(`  note: ${softHits} use(s) of best/top/permanent (or mejor/permanente) in page bodies; fine in neutral wording, never in a claim about results.`);
console.log(failures ? `\n${failures} failure(s)` : `\n✓ ${Object.keys(pages).length} English + ${esCount} Spanish routes passed`);
process.exit(failures ? 1 : 0);
