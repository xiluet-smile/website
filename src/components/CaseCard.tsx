"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Img from "./Img";
import { imageInfo } from "@/lib/images";
import { caseTypeLabel, casesFor, ui, type Case } from "@/lib/ui-i18n";
import type { Locale } from "@/lib/i18n";

const LABEL =
  "pointer-events-none absolute text-[11px] font-semibold tracking-[.12em] text-on-dark uppercase [text-shadow:0_1px_6px_rgba(0,0,0,.6)]";

/** "Before" / "After" labels in the corners of a composite, matching its layout. */
function Labels({ c, before, after }: { c: Case; before: string; after: string }) {
  return (
    <>
      {/* Soft shade behind the labels so they read on white studio backgrounds too. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(0,0,0,.38),rgba(0,0,0,0))]" />
      {c.layout === "stacked" && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,rgba(0,0,0,.38),rgba(0,0,0,0))]" />
      )}
      {c.layout === "stacked" ? (
        <>
          <span className={`${LABEL} top-3.5 left-3.5`}>{before}</span>
          <span className={`${LABEL} bottom-3.5 left-3.5`}>{after}</span>
        </>
      ) : (
        <div className={`${LABEL} top-3.5 right-3.5 left-3.5 flex justify-between`}>
          <span>{before}</span>
          <span>{after}</span>
        </div>
      )}
    </>
  );
}

/**
 * Before/after photo with labels and the required patient disclaimer.
 * The photo is a link to the full-size file; with JS it opens a modal <dialog>
 * (native focus trap and Esc) showing the large image instead.
 */
export default function CaseCard({
  c,
  sizes = "(min-width: 1024px) 33vw, 85vw",
  className = "",
  priority,
  locale = "en",
  ...rest
}: { c: Case; sizes?: string; className?: string; priority?: boolean; locale?: Locale } & React.HTMLAttributes<HTMLElement>) {
  const t = ui(locale);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  // False during SSR and hydration, true once scripts run.
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // The large image is only rendered while open, so a 70-card gallery does not carry 70 hidden pictures.
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = prev;
    };
  }, [open]);

  return (
    <figure className={`m-0 flex flex-col gap-2.5 ${className}`} {...rest}>
      <a
        href={imageInfo(c.image).src}
        target={ready ? undefined : "_blank"}
        rel={ready ? undefined : "noopener"}
        role={ready ? "button" : undefined}
        title={t.viewLarger}
        aria-haspopup={ready ? "dialog" : undefined}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="group relative block aspect-[13/16] cursor-zoom-in overflow-hidden rounded-xl bg-teal"
      >
        <Img src={c.image} alt={c.alt} sizes={sizes} priority={priority} className="block h-full w-full object-cover" />
        <Labels c={c} before={t.before} after={t.after} />
        {/* Zoom cue: always visible on touch screens, on hover with a pointer. */}
        <span
          aria-hidden="true"
          className="absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full bg-[rgba(4,40,46,.55)] text-on-dark backdrop-blur-[6px] transition-opacity lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.5 2h4.5v4.5M14 2l-5 5M6.5 14H2V9.5M2 14l5-5" />
          </svg>
        </span>
      </a>
      <figcaption className="flex justify-between gap-3 text-sm text-muted">
        <span>{caseTypeLabel(locale, c.type)}</span>
        <span className="text-right">{casesFor(locale).disclaimer}</span>
      </figcaption>
      {open && (
        <dialog
          ref={dialog}
          aria-label={c.alt}
          onClose={() => setOpen(false)}
          onClick={(e) => {
            // Tapping the backdrop (or the dark area around the photo) closes.
            if (!(e.target as HTMLElement).closest("[data-photo]")) dialog.current?.close();
          }}
          className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-[rgba(4,40,46,.94)]"
        >
          <div className="grid h-full w-full place-items-center p-3 sm:p-6">
            <div data-photo="" className="relative inline-block overflow-hidden rounded-xl bg-teal">
              <Img
                src={c.image}
                alt={c.alt}
                sizes="100vw"
                priority
                className="block h-auto max-h-[calc(100dvh-1.5rem)] w-auto max-w-[calc(100vw-1.5rem)] sm:max-h-[calc(100dvh-3rem)] sm:max-w-[calc(100vw-3rem)]"
              />
              <Labels c={c} before={t.before} after={t.after} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label={t.close}
            className="absolute top-3 right-3 grid h-11 w-11 cursor-pointer place-items-center rounded-full border-[1.5px] border-[rgba(247,244,238,.5)] bg-[rgba(247,244,238,.12)] text-[22px] leading-none text-on-dark backdrop-blur-[10px] sm:top-5 sm:right-5"
          >
            ×
          </button>
        </dialog>
      )}
    </figure>
  );
}
