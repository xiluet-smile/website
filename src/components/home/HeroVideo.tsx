"use client";

import { useEffect, useRef } from "react";

/**
 * Background hero video: muted, plays once and holds its last frame.
 * The tag is written as raw HTML so `muted` is a real attribute (React omits
 * it from server HTML, which blocks autoplay before hydration).
 */
export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const video = ref.current?.querySelector("video");
    if (!video) return;
    video.muted = true;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) video.pause();
    else video.play().catch(() => {});
  }, []);
  const html = `<video autoplay muted playsinline preload="metadata" aria-hidden="true" tabindex="-1" class="absolute inset-0 h-full w-full bg-[#0A2624] object-cover object-[60%_30%] lg:object-[78%_40%]"><source src="${encodeURI(src)}" type="video/mp4"></video>`;
  return <div ref={ref} className="absolute inset-0" dangerouslySetInnerHTML={{ __html: html }} />;
}
