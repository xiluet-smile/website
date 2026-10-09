import manifest from "./images.gen.json";

type Entry = { width?: number; height?: number; widths?: number[]; svg?: boolean; hash?: string };
const entries = manifest as Record<string, Entry>;

export function imageInfo(file: string) {
  const entry = entries[file];
  if (!entry) throw new Error(`Unknown image "${file}". Add it to src/assets and run npm run images.`);
  // Output names carry a content hash (see scripts/build-images.mjs) so replaced images bust the cache.
  const name = `${file.replace(/\.[^.]+$/, "")}.${entry.hash}`;
  if (entry.svg) return { svg: true as const, src: `/images/${name}.svg` };
  const widths = entry.widths!;
  const srcSet = (fmt: "avif" | "webp") => widths.map((w) => `/images/${name}-${w}.${fmt} ${w}w`).join(", ");
  return {
    svg: false as const,
    width: entry.width!,
    height: entry.height!,
    src: `/images/${name}-${widths[widths.length - 1]}.webp`,
    avif: srcSet("avif"),
    webp: srcSet("webp"),
  };
}

export const ogImagePath = (file: string) => {
  const hash = entries[file]?.hash;
  return `/og/${file.replace(/\.[^.]+$/, "")}${hash ? `.${hash}` : ""}.jpg`;
};
