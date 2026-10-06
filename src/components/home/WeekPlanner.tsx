"use client";

import { useState, useSyncExternalStore } from "react";
import LineIcon, { type LineIconName } from "@/components/LineIcon";
import DatePicker from "./DatePicker";

type Step = { icon: string; title: string; time: string };
type Bar = { icon: string; title: string; time?: string; visit?: number };

const add = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
const addBiz = (d: Date, n: number) => {
  let r = new Date(d);
  for (let i = 0; i < n; i++) {
    r = add(r, 1);
    while (isWeekend(r)) r = add(r, 1);
  }
  return r;
};
const fmt = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const parseIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

/** Visit 1 is the first Monday after the start date; Visit 2 the next business day; Visit 3 two business days later. */
function schedule(start: Date) {
  let v1 = add(start, 1);
  while (v1.getDay() !== 1) v1 = add(v1, 1);
  const v2 = addBiz(v1, 1);
  const v3 = addBiz(v1, 3);
  const days: Date[] = [];
  for (let d = new Date(start); d <= v3; d = add(d, 1)) if (!isWeekend(d)) days.push(new Date(d));
  const off = (d: Date) => Math.max(0, days.findIndex((x) => x.toDateString() === d.toDateString()));
  return { start, v1, v2, v3, days, off };
}

const subscribe = () => () => {};

/**
 * "How it works" planner. Server HTML (and no-JS) shows the six steps with
 * their generic timings; once hydrated it adds real dates, and on desktop the
 * day-by-day timeline, recomputed when the visitor picks a start date.
 */
export default function WeekPlanner({ steps, bars }: { steps: Step[]; bars: Bar[] }) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [picked, setPicked] = useState("");

  // Default start: Friday of the current week.
  const now = new Date();
  const fallback = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7) + 4);
  const sc = hydrated ? schedule(picked ? parseIso(picked) : fallback) : null;
  const n = sc?.days.length ?? 1;
  const pct = (x: number) => `${((x / n) * 100).toFixed(3)}%`;
  const cols = `repeat(${n}, minmax(0,1fr))`;
  const times = sc
    ? [fmt(sc.start), `same day, ${fmt(sc.start)}`, `same day, ${fmt(sc.start)}`, `same day, ${fmt(sc.start)}`, `Visit 1 ${fmt(sc.v1)} · Visit 2 ${fmt(sc.v2)}`, `Visit 3 ${fmt(sc.v3)}`]
    : steps.map((s) => s.time);
  const visitDates = sc ? [sc.v1, sc.v2, sc.v3] : [];
  const barDays = sc ? [sc.start, sc.start, sc.start, sc.start, sc.v1, sc.v2, sc.v3] : [];
  const barCols = barDays.map((d) => `${sc!.off(d) + 1} / ${sc!.off(d) + 2}`);
  const barEnd = barDays.map((d) => sc!.off(d) + 1);

  return (
    <div>
      <div className="relative mb-5 flex flex-wrap items-center gap-2.5 rounded-[14px] border border-[rgba(205,177,128,.45)] bg-[rgba(255,253,248,.6)] px-3.5 py-2.5 text-sm text-body lg:absolute lg:top-[42px] lg:right-0 lg:mb-0 lg:flex-nowrap lg:gap-3 lg:rounded-full lg:py-2.5 lg:pr-3.5 lg:pl-[18px] lg:whitespace-nowrap lg:shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_8px_20px_rgba(26,26,26,.05)]">
        <span>If I send my photos on</span>
        {hydrated ? (
          <DatePicker value={picked} defaultDate={fallback} min={now} onChange={setPicked} label="Choose the day you send your photos" />
        ) : (
          <input
            type="date"
            value={picked}
            onChange={(e) => setPicked(e.target.value)}
            className="min-h-8 border-0 border-b-[1.5px] border-gold bg-transparent py-0.5 font-semibold text-teal outline-none"
          />
        )}
        {picked && (
          <button type="button" onClick={() => setPicked("")} aria-label="Clear date" className="ml-auto cursor-pointer border-0 bg-transparent px-1 py-0.5 text-xs text-gold-text lg:ml-0">
            Reset
          </button>
        )}
      </div>

      {/* Step list: always on mobile; on desktop until the timeline is ready. */}
      <ol className={`m-0 list-none p-0 ${sc ? "lg:hidden" : "lg:grid lg:grid-cols-3 lg:gap-x-8"}`}>
        {steps.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 border-t border-sand py-3.5">
            <span className="font-serif text-xl text-gold-text">{i + 1}</span>
            <span>
              <span className="block text-[17px]">{s.title}</span>
              <span className="text-sm text-muted">{times[i]}</span>
            </span>
          </li>
        ))}
      </ol>

      {/* Desktop day-by-day timeline */}
      {sc && (
        <div className="hidden lg:block">
          <div className="relative mb-2 h-7 text-xs font-semibold tracking-[.1em] whitespace-nowrap text-gold-text uppercase">
            <span className="absolute top-0 flex items-center gap-2.5 pl-1" style={{ left: 0, width: pct(sc.off(sc.start) + 1) }}>
              <span className="h-2 w-2 rounded-full bg-gold" />
              From home · steps 1–4
            </span>
            <span className="absolute top-0 flex items-center gap-2.5 pl-1 text-teal" style={{ left: pct(sc.off(sc.v1)), width: pct(sc.off(sc.v3) - sc.off(sc.v1) + 1) }}>
              <span className="h-2 w-2 rounded-full border-[1.5px] border-teal" />
              In Miami · {fmt(sc.v1)} – {fmt(sc.v3)}
            </span>
          </div>
          <div className="relative overflow-hidden rounded-[20px] border border-[rgba(255,255,255,.7)] bg-[rgba(255,253,248,.45)] shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_12px_32px_rgba(26,26,26,.06)] backdrop-blur-[18px] backdrop-saturate-[1.2]">
            <div className="grid border-b border-sand" style={{ gridTemplateColumns: cols }}>
              {sc.days.map((d) => (
                <div key={d.toDateString()} className="border-l border-[rgba(222,213,194,.6)] px-1.5 pt-3.5 pb-3 text-center text-body">
                  <div className="text-[11px] tracking-[.08em] uppercase">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                  <div className="mt-0.5 text-sm font-semibold">{d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                </div>
              ))}
            </div>
            <div className="relative">
              <div aria-hidden="true" className="absolute inset-0 grid" style={{ gridTemplateColumns: cols }}>
                {sc.days.map((d) => (
                  <div key={d.toDateString()} className="border-l border-[rgba(222,213,194,.6)]" />
                ))}
              </div>
              <div aria-hidden="true" className="absolute top-0 bottom-0 z-0 w-[1.5px] -translate-x-1/2 bg-gold" style={{ left: pct(0.5) }} />
              <div className="absolute top-2.5 z-[3] ml-2 rounded-full bg-gold px-3 py-[5px] text-xs font-semibold whitespace-nowrap text-teal shadow-[0_6px_16px_rgba(205,177,128,.35)]" style={{ left: pct(0.5) }}>
                You send photos · {fmt(sc.start)}
              </div>
              <ol className="relative z-[1] m-0 grid list-none auto-rows-[68px] gap-y-3.5 px-0 pt-12 pb-7" style={{ gridTemplateColumns: cols }}>
                {bars.map((b, i) => (
                  <li
                    key={b.title}
                    className={`mx-1.5 flex min-w-[250px] items-center gap-3.5 rounded-[14px] border border-[rgba(255,255,255,.9)] bg-[rgba(255,253,248,.92)] py-0 pr-[18px] pl-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_10px_24px_rgba(26,26,26,.08)] ${
                      barEnd[i] >= n ? "justify-self-end" : "justify-self-start"
                    }`}
                    style={{ gridColumn: barCols[i], gridRow: i + 1 }}
                  >
                    <span className={`my-3 w-1 flex-none self-stretch rounded ${i >= 4 ? "bg-teal" : "bg-gold"}`} />
                    <span className="block h-8 w-8 flex-none">
                      <LineIcon name={b.icon as LineIconName} />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-[15px] leading-[1.25] font-semibold text-pretty text-teal">{b.title}</span>
                      <span className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-muted">
                        {b.visit ? `Visit ${b.visit} · ${fmt(visitDates[b.visit - 1])}` : b.time}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
      {sc && <p className="mt-5 mb-0 font-serif text-[22px] lg:mt-8 lg:text-center lg:text-[26px]">Your new smile by {fmt(sc.v3)}.</p>}
    </div>
  );
}
