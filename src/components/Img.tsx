import type { CSSProperties } from "react";
import { imageInfo } from "@/lib/images";

type Props = {
  /** File name in src/assets, e.g. "BA1.jpg". */
  src: string;
  alt: string;
  /** CSS sizes hint; defaults to full viewport width. */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  /** Above-the-fold image: eager load with high fetch priority. */
  priority?: boolean;
};

/** Responsive AVIF/WebP image with intrinsic width/height from the build manifest. */
export default function Img({ src, alt, sizes = "100vw", className, style, priority }: Props) {
  const info = imageInfo(src);
  const common = {
    className,
    style,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    decoding: "async" as const,
    fetchPriority: priority ? ("high" as const) : undefined,
  };
  if (info.svg) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={info.src} alt={alt} {...common} />;
  }
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={info.avif} sizes={sizes} />
      <source type="image/webp" srcSet={info.webp} sizes={sizes} />
      <img src={info.src} alt={alt} width={info.width} height={info.height} {...common} />
    </picture>
  );
}
