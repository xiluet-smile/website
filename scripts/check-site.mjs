// Post-build checks on the static HTML in out/ (no JavaScript executed, so this
// is what crawlers and no-JS visitors get): head tags, one <h1>, valid JSON-LD,
// FAQ answers and prices present, no leftover design placeholders.
// When the design handoff folder is present, JSON-LD is also diffed against it.
// The Spanish mirror (/es/…) is checked the same way against src/content/es/pages.json.
import { existsSync, readFileSync } from "node:fs";

const pages = JSON.parse(readFileSync("src/content/pages.json", "utf8"));
const esPages = JSON.parse(readFileSync("src/content/es/pages.json", "utf8"));
// English route → Spanish route, read from the source of truth in src/lib/i18n.ts.
const esPaths = Object.fromEntries(
  [...readFileSync("src/lib/i18n.ts", "utf8").matchAll(/^\s*"(\/[^"]*)": "(\/es[^"]*)",?$/gm)].map((m) => [m[1], m[2]]),
);
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
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] ?? "";
  if (canonical.replace(/\/$/, "") !== `https://xiluetsmiledesign.com${path}`) fail(path, `canonical is "${canonical}"`);
  for (const [lang, target] of [
    ["en-US", `https://xiluetsmiledesign.com${enPath}`],
    ["es-US", `https://xiluetsmiledesign.com${path}`],
    ["x-default", `https://xiluetsmiledesign.com${enPath}`],
  ]) {
    const re = new RegExp(`<link rel="alternate" hrefLang="${lang}" href="${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?"`);
    if (!re.test(html)) fail(path, `no hreflang ${lang} link to ${target}`);
  }
  if (!/property="og:image"/.test(html)) fail(path, "no og:image");

  const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/g)];
  if (h1s.length !== 1) fail(path, `${h1s.length} <h1> elements`);
  else if (strip(h1s[0][0]).trim() !== page.h1.replace(/\s+/g, " ").trim()) fail(path, `h1 is "${strip(h1s[0][0]).trim()}"`);
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
  if (webPage?.inLanguage !== "es-US") fail(path, `WebPage inLanguage is ${webPage?.inLanguage}`);
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

console.log(failures ? `\n${failures} failure(s)` : `\n✓ ${Object.keys(pages).length} English + ${esCount} Spanish routes passed`);
process.exit(failures ? 1 : 0);
