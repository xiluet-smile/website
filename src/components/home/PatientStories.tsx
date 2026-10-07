"use client";

import { useRef, useState } from "react";
import Img from "@/components/Img";
import { imageInfo } from "@/lib/images";
import { ui } from "@/lib/ui-i18n";
import type { Locale } from "@/lib/i18n";

export type Story = {
  id: string;
  video: string;
  poster: string;
  quote: string;
  /** Clinic caption shown when the patient has not given a quote yet. */
  title?: string;
  name: string;
  treatment: string;
  duration: string;
  doctor?: string;
  source?: string;
};

/**
 * "In their own words": vertical patient clips in a scroll-snap strip. Each card shows the poster,
 * the quote and the caption; tapping play swaps in the <video> with sound. Only one plays at a time.
 */
export default function PatientStories({
  stories,
  locale = "en",
  title,
  lead,
}: {
  stories: Story[];
  locale?: Locale;
  title: string;
  lead: string;
}) {
  const t = ui(locale);
  const row = useRef<HTMLUListElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const videos = useRef<Record<string, HTMLVideoElement | null>>({});
  const play = (id: string) => {
    for (const [k, v] of Object.entries(videos.current))
      if (k !== id && v && !v.paused) v.pause();
    const v = videos.current[id];
    if (!v) return;
    setPlaying(id);
    v.muted = false;
    v.play().catch(() => {
      // Autoplay with sound refused (some mobile browsers): start muted, the controls let the user unmute.
      v.muted = true;
      v.play().catch(() => setPlaying(null));
    });
  };
  const scroll = (dir: number) =>
    row.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  const btn =
    "grid h-11 w-11 cursor-pointer place-items-center rounded-full border-[1.5px] text-lg";

  return (
    <section className="defer-render overflow-hidden pt-16 lg:pt-28">
      <div className="wrap mb-6 flex flex-col gap-3 lg:mb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div>
          <h2 className="m-0 mb-2 font-serif text-[34px] leading-[1.2] font-normal lg:text-[48px] lg:leading-[1.1]">
            {title}
          </h2>
          <p className="m-0 text-base text-muted lg:text-lg">{lead}</p>
        </div>
        <div className="hidden gap-2 lg:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label={t.previous}
            className={`${btn} border-sand bg-transparent text-teal hover:border-teal`}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label={t.next}
            className={`${btn} border-teal bg-transparent text-teal hover:bg-teal hover:text-on-dark`}
          >
            →
          </button>
        </div>
      </div>

      <div className="wrap">
        <ul
          ref={row}
          className="-mx-5 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:-mx-2 lg:scroll-px-2 lg:gap-5 lg:px-2"
        >
          {stories.map((s, i) => {
            const active = playing === s.id;
            return (
              <li
                key={s.id}
                className="relative aspect-[9/16] w-[260px] flex-none snap-start overflow-hidden rounded-[20px] border border-[rgba(255,255,255,.35)] bg-teal shadow-[0_16px_40px_rgba(26,26,26,.12)] lg:w-[280px]"
              >
                <video
                  ref={(el) => {
                    videos.current[s.id] = el;
                  }}
                  src={s.video}
                  poster={imageInfo(s.poster).src}
                  preload="none"
                  playsInline
                  controls={active}
                  onEnded={() => setPlaying(null)}
                  onPause={(e) => {
                    if (
                      e.currentTarget.ended ||
                      e.currentTarget.currentTime === 0
                    )
                      setPlaying(null);
                  }}
                  className={`absolute inset-0 h-full w-full object-cover ${active ? "" : "pointer-events-none opacity-0"}`}
                />
                {!active && (
                  <>
                    <Img
                      src={s.poster}
                      alt=""
                      sizes="280px"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,30,36,.35)_0%,rgba(4,30,36,0)_30%,rgba(4,30,36,0)_55%,rgba(4,30,36,.85)_100%)]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute top-3 right-3 left-3 flex gap-1"
                    >
                      {stories.map((_, j) => (
                        <span
                          key={j}
                          className={`h-0.5 flex-1 rounded-full ${j === i ? "bg-on-dark" : "bg-[rgba(247,244,238,.35)]"}`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-6 left-3.5 flex items-center gap-2 text-sm font-semibold text-on-dark">
                      <Img
                        src="xiluet-logo-gold-on-teal.jpg"
                        alt=""
                        sizes="28px"
                        className="h-7 w-7 rounded-full border border-gold object-cover"
                      />
                      xiluetsmiles
                    </div>
                    <button
                      type="button"
                      onClick={() => play(s.id)}
                      aria-label={`${t.play}: ${s.name}`}
                      className="absolute top-1/2 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-[rgba(247,244,238,.5)] bg-[rgba(247,244,238,.22)] text-on-dark backdrop-blur-md transition hover:bg-[rgba(247,244,238,.35)]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        aria-hidden="true"
                      >
                        <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                      </svg>
                    </button>
                    <figcaption className="absolute right-4 bottom-4 left-4 flex flex-col gap-1 text-on-dark">
                      <span className="font-serif text-[20px] leading-[1.25] text-pretty">
                        {s.quote ? `“${s.quote}”` : s.title}
                      </span>
                      <span className="text-[13px] text-on-dark-muted">
                        {s.name} · {s.treatment} · {s.duration}
                      </span>
                    </figcaption>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <p className="wrap mt-5 mb-0 text-[13px] text-muted">
        {t.storiesDisclaimer}
      </p>
    </section>
  );
}
