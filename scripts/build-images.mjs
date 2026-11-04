// Builds responsive AVIF/WebP variants of src/assets into public/images and a
// manifest (src/lib/images.gen.json) with intrinsic sizes for width/height attrs.
//
// Every output name carries a short content hash of its source, so an output that
// exists is by definition up to date: no mtime checks (a git checkout resets mtimes,
// which made Cloudflare regenerate all ~1,600 files on every deploy, ~15 minutes).
// Generated files are kept in CACHE (.next/cache, which Cloudflare Pages "Build cache"
// restores between builds) and copied into public/images; set IMAGE_CACHE_DIR to move it.
import { mkdir, readdir, readFile, copyFile, writeFile, access, rm } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const SRC = "src/assets";
const OUT = "public/images";
const OG = "public/og";
const CACHE = process.env.IMAGE_CACHE_DIR || ".next/cache/xiluet-images";
const MANIFEST = "src/lib/images.gen.json";
const WIDTHS = [400, 800, 1200, 1920];

const hashOf = async (src) => createHash("sha1").update(await readFile(src)).digest("hex").slice(0, 8);
const exists = (p) => access(p).then(() => true, () => false);

await Promise.all([mkdir(OUT, { recursive: true }), mkdir(OG, { recursive: true }), mkdir(path.join(CACHE, "og"), { recursive: true })]);
const manifest = {};
const wanted = new Set(); // cache entries used by this build; anything else is pruned
let generated = 0, reused = 0;

// Produce `rel` (a path relative to the cache root) with `make()` unless it is cached, then copy it to `dest`.
async function ensure(rel, dest, make) {
  const cached = path.join(CACHE, rel);
  wanted.add(rel);
  if (!(await exists(cached))) { await make(cached); generated++; } else reused++;
  if (!(await exists(dest))) await copyFile(cached, dest);
}

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
      const out = `${name}.${hash}-${w}.${fmt}`;
      await ensure(out, path.join(OUT, out), (to) => sharp(src).resize({ width: w })[fmt](opts).toFile(to));
    }
  }
  manifest[file] = { width, height, widths, hash };
}

// Open Graph images (1200×630 JPEG) for every image referenced in pages.json, plus the schema logo.
const pages = JSON.parse(await readFile("src/content/pages.json", "utf8"));
for (const file of new Set(Object.values(pages).map((p) => p.ogImage))) {
  const src = path.join(SRC, file);
  const out = `${path.parse(file).name}.${await hashOf(src)}.jpg`;
  await ensure(path.join("og", out), path.join(OG, out), (to) =>
    sharp(src).resize(1200, 630, { fit: "cover", position: "attention" }).jpeg({ quality: 80, mozjpeg: true }).toFile(to),
  );
}
await copyFile(path.join(SRC, "xiluet-logo-transparent.png"), path.join(OG, "xiluet-logo.png"));

// Prune cache entries whose source changed or disappeared, so the cache does not grow forever.
for (const dir of ["", "og"]) {
  for (const f of await readdir(path.join(CACHE, dir))) {
    const rel = path.join(dir, f);
    if (rel === "og") continue;
    if (!wanted.has(rel) && f.includes(".")) await rm(path.join(CACHE, rel), { force: true });
  }
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`images: ${Object.keys(manifest).length} sources → ${OUT} (${generated} generated, ${reused} from cache)`);
