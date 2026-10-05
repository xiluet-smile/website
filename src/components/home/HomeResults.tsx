"use client";

import { useRef, useState } from "react";
import CaseCard from "@/components/CaseCard";
import type { Case } from "@/lib/content";

/**
 * Home results carousel. All cases are always in the HTML; the filter only
 * hides non-matching cards, and without JS the row is a plain swipeable list.
 */
export default function HomeResults({ cases, types }: { cases: Case[]; types: string[] }) {
  const [type, setType] = useState("All");
  const row = useRef<HTMLDivElement>(null);
  const shown = cases.filter((c) => type === "All" || c.type === type).length;
  const scroll = (dir: number) => {
    const el = row.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:mb-6 lg:flex-wrap" role="group" aria-label="Filter by case type">
        {["All", ...types].map((t) => {
          const on = t === type;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setType(t);
                row.current?.scrollTo({ left: 0 });
              }}
              className={`h-11 flex-none cursor-pointer rounded-full border-[1.5px] px-4 text-[15px] font-medium lg:px-[18px] ${
                on ? "border-teal bg-teal text-on-dark" : "border-sand bg-transparent text-ink"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div
        ref={row}
        className="-mx-5 flex snap-x scroll-px-5 snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:-mx-2 lg:gap-6 lg:px-2"
      >
        {cases.map((c) => (
          <CaseCard
            key={c.id}
            c={c}
            sizes="(min-width: 1024px) 380px, 78vw"
            className={`flex-[0_0_78%] snap-start lg:flex-[0_0_calc((100%-48px)/3)] ${
              type === "All" || c.type === type ? "" : "hidden"
            }`}
          />
        ))}
      </div>
      <div className="mt-5 hidden items-center justify-between lg:flex">
        <span className="text-sm text-muted" aria-live="polite">
          {shown} cases · swipe or use the arrows
        </span>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous cases"
            className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border-[1.5px] border-teal bg-transparent text-xl text-teal hover:bg-teal hover:text-on-dark"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next cases"
            className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border-[1.5px] border-teal bg-teal text-xl text-on-dark hover:bg-[#0A3A40]"
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
