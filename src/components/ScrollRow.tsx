"use client";

import { useRef } from "react";

/**
 * Horizontal scroll-snap row with previous/next arrows. The row itself is
 * plain HTML (works without JS); only the arrows need the script.
 */
export default function ScrollRow({
  children,
  className = "",
  ariaLabel,
  caption,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  caption?: string;
}) {
  const row = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => {
    const el = row.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const btn = "grid h-12 w-12 cursor-pointer place-items-center rounded-full border-[1.5px] border-teal text-xl";
  return (
    <>
      <ul ref={row} aria-label={ariaLabel} className={`m-0 -mx-5 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:-mx-2 lg:scroll-px-2 lg:gap-5 lg:px-2 ${className}`}>
        {children}
      </ul>
      <div className="mt-5 hidden items-center justify-between lg:flex">
        <span className="text-sm text-muted">{caption}</span>
        <div className="flex gap-2.5">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous" className={`${btn} bg-transparent text-teal hover:bg-teal hover:text-on-dark`}>
            ←
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next" className={`${btn} bg-teal text-on-dark hover:bg-[#0A3A40]`}>
            →
          </button>
        </div>
      </div>
    </>
  );
}
