import manifest from "./images.gen.json";

type Entry = { width?: number; height?: number; widths?: number[]; svg?: boolean };
const entries = manifest as Record<string, Entry>;

export function imageInfo(file: string) {
  const entry = entries[file];
  if (!entry) throw new Error(`Unknown image "${file}". Add it to src/assets and run npm run images.`);
  const name = file.replace(/\.[^.]+$/, "");
  if (entry.svg) return { svg: true as const, src: `/images/${file}` };
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

export const ogImagePath = (file: string) => `/og/${file.replace(/\.[^.]+$/, "")}.jpg`;
