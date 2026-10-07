"use client";

import { useState } from "react";
import CaseCard from "./CaseCard";
import PatientStories, { type Story } from "./home/PatientStories";
import { caseTypeLabel, casesFor, tpl, ui } from "@/lib/ui-i18n";
import type { Locale } from "@/lib/i18n";

const ALL = "All";
const VIDEOS = "Videos";

/**
 * Before/after gallery. All cases are always in the HTML; the filter only
 * toggles the `hidden` class, so without JS every case is visible.
 */
export default function ResultsGallery({ locale = "en", stories = [] }: { locale?: Locale; stories?: Story[] }) {
  const t = ui(locale);
  const { cases, types } = casesFor(locale);
  // Patient videos are the last tab, after the photo types.
  const filters = [ALL, ...types, ...(stories.length ? [VIDEOS] : [])];
  const [filter, setFilter] = useState(ALL);
  const videos = filter === VIDEOS;
  const shown = videos ? stories.length : cases.filter((c) => filter === ALL || c.type === filter).length;

  return (
    <div data-filter={filter}>
      <div role="group" aria-label={t.results.filterAria} className="mb-6 flex flex-wrap gap-2 lg:mb-8">
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
              {f === ALL ? t.all : f === VIDEOS ? t.results.videos : caseTypeLabel(locale, f)}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        {tpl(t.results.showing, { shown, total: videos ? stories.length : cases.length })}
      </p>
      {videos && (
        <div>
          <p className="mt-0 mb-5 text-base text-muted lg:text-lg">{t.results.videosLead}</p>
          <PatientStories stories={stories} locale={locale} layout="grid" />
        </div>
      )}
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${videos ? "hidden" : ""}`}>
        {cases.map((c, i) => (
          <CaseCard
            key={c.id}
            c={c}
            locale={locale}
            priority={i === 0}
            sizes="(min-width: 1440px) 384px, (min-width: 1024px) 28vw, (min-width: 640px) 46vw, 92vw"
            data-type={c.type}
            className={filter === ALL || c.type === filter ? "" : "hidden"}
          />
        ))}
      </div>
    </div>
  );
}
