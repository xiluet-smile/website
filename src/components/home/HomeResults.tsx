"use client";

import { useRef, useState } from "react";
import CaseCard from "@/components/CaseCard";
import { caseTypeLabel, tpl, ui, type Case } from "@/lib/ui-i18n";
import type { Locale } from "@/lib/i18n";

const ALL = "All";

/**
 * Home results carousel. All cases are always in the HTML; the filter only
 * hides non-matching cards, and without JS the row is a plain swipeable list.
 */
export default function HomeResults({ cases, types, locale = "en" }: { cases: Case[]; types: string[]; locale?: Locale }) {
  // Filters only make sense when there is more than one type to switch between (doctor pages pass their own subset).
  const showFilters = types.length > 1;
  const t = ui(locale);
  const [type, setType] = useState(ALL);
  const row = useRef<HTMLDivElement>(null);
  const shown = cases.filter((c) => type === ALL || c.type === type).length;
  const scroll = (dir: number) => {
    const el = row.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <>
      {showFilters && (
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:mb-6 lg:flex-wrap" role="group" aria-label={t.results.caseFilterAria}>
        {[ALL, ...types].map((x) => {
          const on = x === type;
          return (
            <button
              key={x}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setType(x);
                row.current?.scrollTo({ left: 0 });
              }}
              className={`h-11 flex-none cursor-pointer rounded-full border-[1.5px] px-4 text-[15px] font-medium lg:px-[18px] ${
                on ? "border-teal bg-teal text-on-dark" : "border-sand bg-transparent text-ink"
              }`}
            >
              {x === ALL ? t.all : caseTypeLabel(locale, x)}
            </button>
          );
        })}
      </div>
      )}
      <div
        ref={row}
        className="-mx-5 flex snap-x scroll-px-5 snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:-mx-2 lg:gap-6 lg:px-2"
      >
        {cases.map((c) => (
          <CaseCard
            key={c.id}
            c={c}
            locale={locale}
            sizes="(min-width: 1024px) 380px, 78vw"
            className={`flex-[0_0_78%] snap-start lg:flex-[0_0_calc((100%-48px)/3)] ${
              type === ALL || c.type === type ? "" : "hidden"
            }`}
          />
        ))}
      </div>
      <div className="mt-5 hidden items-center justify-between lg:flex">
        <span className="text-sm text-muted" aria-live="polite">
          {tpl(t.results.casesCaption, { shown })}
        </span>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={t.results.previousCases}
            className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border-[1.5px] border-teal bg-transparent text-xl text-teal hover:bg-teal hover:text-on-dark"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={t.results.nextCases}
            className="grid h-12 w-12 cursor-pointer place-items-center rounded-full border-[1.5px] border-teal bg-teal text-xl text-on-dark hover:bg-[#0A3A40]"
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
