// Builds responsive AVIF/WebP variants of src/assets into public/images and a
// manifest (src/lib/images.gen.json) with intrinsic sizes for width/height attrs.
import { mkdir, readdir, readFile, stat, copyFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const SRC = "src/assets";
const OUT = "public/images";
const MANIFEST = "src/lib/images.gen.json";
const WIDTHS = [400, 800, 1200, 1920];

// Short content hash in every output name: a replaced source gets a new URL, so the
// long-lived immutable cache (public/_headers) can never serve a stale image.
const hashOf = async (src) => createHash("sha1").update(await readFile(src)).digest("hex").slice(0, 8);

const isFresh = async (out, src) => {
  try {
    return (await stat(out)).mtimeMs >= (await stat(src)).mtimeMs;
  } catch {
    return false;
  }
};

await mkdir(OUT, { recursive: true });
const manifest = {};

for (const file of (await readdir(SRC)).sort()) {
  const src = path.join(SRC, file);
  const { name, ext } = path.parse(file);
  const hash = await hashOf(src);
  if (ext === ".svg") {
    await copyFile(src, path.join(OUT, `${name}.${hash}.svg`));
    manifest[file] = { svg: true, hash };
    continue;
  }
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

  const { width, height } = await sharp(src).metadata();
  const widths = WIDTHS.filter((w) => w < width).concat(Math.min(width, 2400));
  for (const w of widths) {
    for (const [fmt, opts] of [["avif", { quality: 55, effort: 3 }], ["webp", { quality: 78 }]]) {
      const out = path.join(OUT, `${name}.${hash}-${w}.${fmt}`);
      if (await isFresh(out, src)) continue;
      await sharp(src).resize({ width: w })[fmt](opts).toFile(out);
    }
  }
  manifest[file] = { width, height, widths, hash };
}

// Open Graph images (1200×630 JPEG) for every image referenced in pages.json, plus the schema logo.
const pages = JSON.parse(await readFile("src/content/pages.json", "utf8"));
await mkdir("public/og", { recursive: true });
for (const file of new Set(Object.values(pages).map((p) => p.ogImage))) {
  const src = path.join(SRC, file);
  const out = `public/og/${path.parse(file).name}.${await hashOf(src)}.jpg`;
  if (await isFresh(out, src)) continue;
  await sharp(src).resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 80, mozjpeg: true }).toFile(out);
}
await copyFile(path.join(SRC, "xiluet-logo-transparent.png"), "public/og/xiluet-logo.png");

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${Object.keys(manifest).length} sources → ${OUT}`);
