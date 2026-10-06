"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping video that only downloads when it is about to scroll into view.
 * Renders the poster immediately (via <picture> sources from the image pipeline is
 * not possible on <video>, so a plain poster URL is used), then attaches the source
 * and plays once the element is within 300 px of the viewport. Reduced-motion and
 * data-saver users keep the poster; without JavaScript the <noscript> image shows.
 */
export default function LazyVideo({ src, poster, className, label }: { src: string; poster: string; className?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        video.src = src;
        video.play().catch(() => {});
      },
      { rootMargin: "300px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <>
      <video ref={ref} poster={poster} muted loop playsInline preload="none" aria-label={label} aria-hidden={label ? undefined : true} className={className} />
      <noscript>
        <img src={poster} alt={label ?? ""} className={className} />
      </noscript>
    </>
  );
}
