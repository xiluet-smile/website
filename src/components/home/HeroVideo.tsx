"use client";

import { useEffect, useRef } from "react";

/**
 * Background hero video: muted, plays once and holds its last frame.
 * It is attached only after the page has loaded and the browser is idle, so it
 * never competes with first paint; visitors who prefer reduced motion or use
 * data saver keep the poster frame. Without JS the <noscript> copy plays instead.
 */
export default function HeroVideo({ src, poster }: { src: string; poster?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;

    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.tabIndex = -1;
      video.setAttribute("aria-hidden", "true");
      // 1 px smaller than the poster on every side, so the poster stays the LCP element and the
      // video's late first frame (deferred ~2 s after load) does not become a larger LCP candidate.
      video.className = "absolute top-px left-px h-[calc(100%-2px)] w-[calc(100%-2px)] object-cover object-[62%_30%] opacity-0 transition-opacity duration-700 lg:object-[50%_40%] lg:origin-center lg:scale-150 lg:translate-x-[20%]";
      video.addEventListener(
        "playing",
        () => {
          video.classList.remove("opacity-0");
          // Starts the hero callout animations (see .hero-callout in globals.css).
          document.documentElement.dataset.heroPlaying = "1";
        },
        { once: true },
      );
      // When the clip ends (it holds its last frame) the callouts fade out.
      video.addEventListener("ended", () => (document.documentElement.dataset.heroEnded = "1"), { once: true });
      video.src = src;
      host.appendChild(video);
      video.play().catch(() => {});
    };
    // Give images and scripts a head start on slow connections before the 2.4 MB video.
    const whenIdle = () => setTimeout(() => ("requestIdleCallback" in window ? requestIdleCallback(start, { timeout: 2000 }) : start()), 2000);
    if (document.readyState === "complete") whenIdle();
    else window.addEventListener("load", whenIdle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", whenIdle);
    };
  }, [src]);

  const fallback = `<video autoplay muted playsinline aria-hidden="true" tabindex="-1" class="absolute top-px left-px h-[calc(100%-2px)] w-[calc(100%-2px)] object-cover object-[62%_30%] lg:object-[50%_40%] lg:origin-center lg:scale-150 lg:translate-x-[20%]"><source src="${encodeURI(src)}" type="video/mp4"></video><style>.hero-callout{animation-play-state:running}</style>`;
  return (
    <div ref={ref} className="absolute inset-0 bg-[#0A2624]">
      {/* Poster: the video's first frame, shown instantly; the video fades in over it. */}
      {poster}
      <noscript dangerouslySetInnerHTML={{ __html: fallback }} />
    </div>
  );
}
