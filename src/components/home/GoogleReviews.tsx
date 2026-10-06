"use client";

import { useEffect, useState } from "react";
import { Stars } from "@/components/Icons";
import { tpl, ui } from "@/lib/content-i18n";
import type { Locale } from "@/lib/i18n";

export type Review = { name: string; text: string; rating?: number; when?: string; treatment?: string };
type Live = { ok: boolean; rating: number | null; count: number | null; url: string | null; writeReviewUrl: string; reviews: Review[] };

type Props = {
  /** Server-rendered fallback (from content) shown until live data arrives. */
  initial: { rating: string; count: number; reviews: Review[] };
  mapsUrl: string;
  writeReviewUrl: string;
  source: string;
  locale?: Locale;
};

/**
 * "What patients say on Google": renders the stored reviews in the HTML, then
 * swaps in the live rating, count and latest reviews from /api/reviews.
 */
export default function GoogleReviews({ initial, mapsUrl, writeReviewUrl, source, locale = "en" }: Props) {
  const t = ui(locale).reviews;
  const [live, setLive] = useState<Live | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/reviews", { signal: ctrl.signal, headers: { accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: Live | null) => {
        if (d?.ok && d.reviews.length) setLive(d);
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  const rating = live?.rating != null ? live.rating.toFixed(1) : initial.rating;
  const count = live?.count ?? initial.count;
  const reviews = (live?.reviews ?? initial.reviews).slice(0, 4);
  const allUrl = live?.url ?? mapsUrl;
  const writeUrl = live?.writeReviewUrl ?? writeReviewUrl;

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div>
          <h2 className="m-0 mb-1.5 font-serif text-[34px] leading-[1.2] font-normal lg:mb-2 lg:text-[48px] lg:leading-[1.1]">{t.title}</h2>
          <div className="flex items-baseline gap-2 lg:gap-2.5">
            <span className="font-serif text-2xl lg:text-[28px]">{rating}</span>
            <span className="text-sm text-gold-text lg:text-base" role="img" aria-label={tpl(t.starsAria, { rating })}>
              <Stars />
            </span>
            <span className="text-[15px] text-body lg:text-lg">
              {tpl(t.count, { count })}{live ? "" : ""}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          <a href={writeUrl} target="_blank" rel="noopener" className="btn btn-teal h-11 px-5 text-[15px]">
            {t.leave}
          </a>
          <a href={allUrl} target="_blank" rel="noopener" className="link-strong">
            {t.readAll}
          </a>
        </div>
      </div>
      <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:px-0 lg:pb-0" aria-live="polite">
        {reviews.map((r, i) => (
          <article key={`${r.name}-${i}`} className="glass-card flex w-[280px] flex-none flex-col gap-3 rounded-2xl p-[22px] lg:min-h-[240px] lg:w-auto lg:gap-3.5 lg:p-7">
            <div className="text-sm text-gold-text lg:text-[15px]" role="img" aria-label={tpl(t.starsAria, { rating: r.rating ?? 5 })}>
              <Stars />
            </div>
            <p className="m-0 line-clamp-[9] text-base leading-normal text-pretty lg:text-[17px]">{r.text}</p>
            <div className="mt-auto text-[13px] text-muted lg:text-sm">
              <strong className="font-semibold text-ink">{r.name}</strong>
              {r.treatment ? ` · ${r.treatment}` : ""}
              {r.when ? ` · ${r.when}` : ""} · {source}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
