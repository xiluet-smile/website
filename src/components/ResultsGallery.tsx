"use client";

import { useState } from "react";
import CaseCard from "./CaseCard";
import { cases, caseTypes } from "@/lib/content";

const filters = ["All", ...caseTypes];

/**
 * Before/after gallery. All cases are always in the HTML; the filter only
 * toggles the `hidden` class, so without JS every case is visible.
 */
export default function ResultsGallery() {
  const [filter, setFilter] = useState("All");
  const shown = cases.filter((c) => filter === "All" || c.type === filter).length;

  return (
    <div data-filter={filter}>
      <div role="group" aria-label="Filter by treatment" className="mb-6 flex flex-wrap gap-2 lg:mb-8">
        {filters.map((f) => {
          const on = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f)}
              className={`h-11 cursor-pointer rounded-full border px-[18px] font-sans text-sm font-semibold transition-colors lg:h-10 ${
                on ? "border-teal bg-teal text-on-dark" : "border-sand bg-transparent text-ink hover:border-teal"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        Showing {shown} of {cases.length}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <CaseCard
            key={c.id}
            c={c}
            sizes="(min-width: 1440px) 384px, (min-width: 1024px) 28vw, (min-width: 640px) 46vw, 92vw"
            data-type={c.type}
            className={filter === "All" || c.type === filter ? "" : "hidden"}
          />
        ))}
      </div>
    </div>
  );
}
