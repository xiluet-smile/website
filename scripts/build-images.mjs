// Builds responsive AVIF/WebP variants of src/assets into public/images and a
// manifest (src/lib/images.gen.json) with intrinsic sizes for width/height attrs.
import { mkdir, readdir, stat, copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "src/assets";
const OUT = "public/images";
const MANIFEST = "src/lib/images.gen.json";
const WIDTHS = [400, 800, 1200, 1920];

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
  if (ext === ".svg") {
    await copyFile(src, path.join(OUT, file));
    manifest[file] = { svg: true };
    continue;
  }
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

  const { width, height } = await sharp(src).metadata();
  const widths = WIDTHS.filter((w) => w < width).concat(Math.min(width, 2400));
  for (const w of widths) {
    for (const [fmt, opts] of [["avif", { quality: 55, effort: 3 }], ["webp", { quality: 78 }]]) {
      const out = path.join(OUT, `${name}-${w}.${fmt}`);
      if (await isFresh(out, src)) continue;
      await sharp(src).resize({ width: w })[fmt](opts).toFile(out);
    }
  }
  manifest[file] = { width, height, widths };
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${Object.keys(manifest).length} sources → ${OUT}`);
