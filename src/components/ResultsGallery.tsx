"use client";

import { useState } from "react";
import CaseCard from "./CaseCard";
import PatientStories, { type Story } from "./home/PatientStories";
import { casesFor, tpl, ui } from "@/lib/ui-i18n";
import type { Locale } from "@/lib/i18n";

const PHOTOS = "photos";
const VIDEOS = "videos";

/**
 * Results page: two tabs, before/after photos and patient videos. Every case is
 * always in the HTML; the tab only toggles the `hidden` class, so without JS the
 * photos are visible and the videos sit below them.
 */
export default function ResultsGallery({ locale = "en", stories = [] }: { locale?: Locale; stories?: Story[] }) {
  const t = ui(locale);
  const { cases } = casesFor(locale);
  const tabs = [PHOTOS, ...(stories.length ? [VIDEOS] : [])];
  const [tab, setTab] = useState(PHOTOS);
  const videos = tab === VIDEOS;
  const shown = videos ? stories.length : cases.length;

  return (
    <div data-tab={tab}>
      {tabs.length > 1 && (
        <div role="group" aria-label={t.results.filterAria} className="mb-6 flex flex-wrap gap-2 lg:mb-8">
          {tabs.map((f) => {
            const on = f === tab;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => setTab(f)}
                className={`h-11 cursor-pointer rounded-full border px-5 font-sans text-sm font-semibold transition-colors lg:h-10 ${
                  on ? "border-teal bg-teal text-on-dark" : "border-sand bg-transparent text-ink hover:border-teal"
                }`}
              >
                {f === VIDEOS ? t.results.videos : t.results.photos}
              </button>
            );
          })}
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {tpl(t.results.showing, { shown, total: shown })}
      </p>
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${videos ? "hidden" : ""}`}>
        {cases.map((c, i) => (
          <CaseCard
            key={c.id}
            c={c}
            locale={locale}
            priority={i === 0}
            sizes="(min-width: 1440px) 384px, (min-width: 1024px) 28vw, (min-width: 640px) 46vw, 92vw"
            data-type={c.type}
          />
        ))}
      </div>
      {stories.length > 0 && (
        <div className={videos ? "" : "hidden"}>
          <p className="mt-0 mb-5 text-base text-muted lg:text-lg">{t.results.videosLead}</p>
          <PatientStories stories={stories} locale={locale} layout="grid" />
        </div>
      )}
    </div>
  );
}
