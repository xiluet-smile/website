"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ui } from "@/lib/content-i18n";
import { langTag, type Locale } from "@/lib/i18n";

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const parseIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

type Props = {
  /** ISO date or "" when nothing is picked. */
  value: string;
  /** Shown while nothing is picked. */
  defaultDate: Date;
  min: Date;
  onChange: (iso: string) => void;
  label: string;
  locale?: Locale;
};

/**
 * Brand-styled date picker: a button showing the chosen date and a popover
 * calendar (keyboard: arrows move, Enter/Space pick, Esc closes).
 */
export default function DatePicker({ value, defaultDate, min, onChange, label, locale = "en" }: Props) {
  const t = ui(locale).datePicker;
  const lang = langTag(locale);
  const [open, setOpen] = useState(false);
  const shown = value ? parseIso(value) : defaultDate;
  const [view, setView] = useState(() => new Date(shown.getFullYear(), shown.getMonth(), 1));
  const [focusDay, setFocusDay] = useState(shown);
  const root = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (open) gridRef.current?.querySelector<HTMLButtonElement>("[data-focus=true]")?.focus();
  }, [open, focusDay]);

  const openCal = () => {
    setView(new Date(shown.getFullYear(), shown.getMonth(), 1));
    setFocusDay(shown);
    setOpen(true);
  };
  const pick = (d: Date) => {
    onChange(iso(d));
    setOpen(false);
  };
  const move = (days: number) => {
    const d = new Date(focusDay);
    d.setDate(d.getDate() + days);
    if (d < min) return;
    setFocusDay(d);
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) setView(new Date(d.getFullYear(), d.getMonth(), 1));
  };
  const shiftMonth = (n: number) => {
    const v = new Date(view.getFullYear(), view.getMonth() + n, 1);
    const minMonth = new Date(min.getFullYear(), min.getMonth(), 1);
    if (v < minMonth) return;
    setView(v);
  };

  // Calendar cells: leading blanks, then the month's days.
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(first.getDay()).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))];
  const today = new Date();
  const canGoBack = new Date(view.getFullYear(), view.getMonth(), 1) > new Date(min.getFullYear(), min.getMonth(), 1);

  return (
    <div ref={root} className="relative inline-flex items-center">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => (open ? setOpen(false) : openCal())}
        className="inline-flex min-h-8 cursor-pointer items-center gap-2 border-0 border-b-[1.5px] border-gold bg-transparent py-0.5 font-semibold text-teal outline-none focus-visible:outline-2 focus-visible:outline-gold"
      >
        <span>{shown.toLocaleDateString(lang, { weekday: "short", month: "short", day: "numeric" })}</span>
        <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true" className="text-gold-text">
          <rect x="2.5" y="4" width="15" height="13" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M2.5 8h15M6.5 2.5v3M13.5 2.5v3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="sr-only">{label}</span>
      </button>

      {open && (
        <div
          id={id}
          role="dialog"
          aria-label={t.dialog}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              root.current?.querySelector("button")?.focus();
            }
          }}
          className="absolute top-[calc(100%+12px)] right-0 z-30 w-[304px] rounded-[18px] border border-[rgba(255,255,255,.8)] bg-[rgba(255,253,248,.96)] p-4 text-ink shadow-[0_1px_0_rgba(255,255,255,.7)_inset,0_24px_60px_rgba(26,26,26,.16)] backdrop-blur-[18px] backdrop-saturate-[1.2] max-lg:right-auto max-lg:left-0"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="font-serif text-[19px] text-teal" aria-live="polite">
              {t.months[view.getMonth()]} {view.getFullYear()}
            </div>
            <div className="flex gap-1.5">
              {[
                { n: -1, label: t.prevMonth, d: "M12.5 5l-5 5 5 5", ok: canGoBack },
                { n: 1, label: t.nextMonth, d: "M7.5 5l5 5-5 5", ok: true },
              ].map((b) => (
                <button
                  key={b.n}
                  type="button"
                  aria-label={b.label}
                  disabled={!b.ok}
                  onClick={() => shiftMonth(b.n)}
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-[1.5px] border-sand bg-transparent text-teal hover:border-teal disabled:cursor-default disabled:opacity-35"
                >
                  <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                    <path d={b.d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-1 grid grid-cols-7 text-center text-[11px] font-semibold tracking-[.1em] text-muted uppercase">
            {t.dow.map((d, i) => (
              <span key={i} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div
            ref={gridRef}
            className="grid grid-cols-7 gap-y-0.5"
            onKeyDown={(e) => {
              const k = e.key;
              if (k === "ArrowRight") move(1);
              else if (k === "ArrowLeft") move(-1);
              else if (k === "ArrowDown") move(7);
              else if (k === "ArrowUp") move(-7);
              else return;
              e.preventDefault();
            }}
          >
            {cells.map((d, i) =>
              d ? (
                <button
                  key={i}
                  type="button"
                  disabled={d < min}
                  tabIndex={sameDay(d, focusDay) ? 0 : -1}
                  data-focus={sameDay(d, focusDay) || undefined}
                  aria-pressed={sameDay(d, shown)}
                  aria-label={d.toLocaleDateString(lang, { weekday: "long", month: "long", day: "numeric" })}
                  onClick={() => pick(d)}
                  onFocus={() => setFocusDay(d)}
                  className={`mx-auto grid h-9 w-9 cursor-pointer place-items-center rounded-full border-[1.5px] text-sm font-medium transition-colors duration-150 disabled:cursor-default disabled:text-hint ${
                    sameDay(d, shown)
                      ? "border-teal bg-teal text-on-dark"
                      : sameDay(d, today)
                        ? "border-gold bg-transparent text-teal hover:bg-[rgba(205,177,128,.16)]"
                        : "border-transparent bg-transparent text-ink hover:bg-[rgba(205,177,128,.16)]"
                  } ${d.getDay() === 0 || d.getDay() === 6 ? "text-muted" : ""}`}
                >
                  {d.getDate()}
                </button>
              ) : (
                <span key={i} />
              ),
            )}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-sand pt-3 text-[13px] font-semibold">
            <button type="button" onClick={() => pick(today < min ? min : today)} className="cursor-pointer border-0 bg-transparent p-0 text-gold-text hover:text-teal">
              {t.today}
            </button>
            <span className="text-xs font-normal text-muted">{t.weekends}</span>
          </div>
        </div>
      )}
    </div>
  );
}
