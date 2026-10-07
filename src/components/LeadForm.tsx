"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  CheckBadge,
  ConsentField,
  FormError,
  FormGuards,
  chipClass,
  errorMessage,
  inputClass,
  labelClass,
  submitForm,
  useHydrated,
  useSentParam, trackFormSubmit } from "./FormParts";
import { formContent, labelOf, tpl, ui } from "@/lib/ui-i18n";
import { localizePath, type Locale } from "@/lib/i18n";

type Photo = { file: File; url: string };

const isImage = (f: File) => (f.type ? f.type.startsWith("image/") && !f.type.includes("svg") : /\.(heic|heif)$/i.test(f.name));

/**
 * Free Photo Evaluation form. Server-rendered as a plain multipart form that
 * posts to /api/lead; with JS it is sent with fetch, photos are previewed and
 * the confirmation replaces the form.
 */
export default function LeadForm({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale).leadForm;
  const { leadForm: content, site } = formContent(locale);
  const page = localizePath("/free-photo-evaluation", locale);
  const { maxPhotos, maxPhotoMb } = content.limits;
  const vars = { max: String(maxPhotos), mb: String(maxPhotoMb) };
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const originRef = useRef<HTMLInputElement>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const hydrated = useHydrated();
  const sent = useSentParam() || status === "sent";
  const count = photos.length;

  // Lead source: the page of this site the visitor came from, when there is one.
  useEffect(() => {
    try {
      const ref = new URL(document.referrer);
      if (originRef.current && ref.origin === window.location.origin && ref.pathname !== page) {
        originRef.current.value = ref.pathname;
      }
    } catch {
      // no referrer
    }
  }, [page]);

  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
  }, [status]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // the files now live in state; the same photo can be re-picked after removal
    let problem: string | null = null;
    const ok: Photo[] = [];
    for (const file of picked) {
      if (!isImage(file)) problem = content.errors.not_image;
      else if (file.size > maxPhotoMb * 1024 * 1024) problem = tpl(content.errors.too_big, vars);
      else if (count + ok.length >= maxPhotos) problem = tpl(content.errors.too_many, vars);
      else ok.push({ file, url: URL.createObjectURL(file) });
    }
    setPhotoError(problem);
    if (ok.length) setPhotos((cur) => [...cur, ...ok]);
  }

  function remove(i: number) {
    URL.revokeObjectURL(photos[i].url);
    setPhotos((cur) => cur.filter((_, j) => j !== i));
    setPhotoError(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;
    const form = e.currentTarget;
    setStatus("sending");
    setError(null);
    let concerns: string[] = [];
    const result = await submitForm(form, (data) => {
      data.delete("photos");
      for (const p of photos) data.append("photos", p.file, p.file.name);
      // Submitted values stay English (the server matches them); the summary shows the locale's labels.
      concerns = data.getAll("concerns").map((v) => labelOf(content.concerns, content.concernsLabels, String(v)));
      return data;
    });
    if (result.ok) {
      const c = content.confirmation;
      setSummary(
        count
          ? tpl(count === 1 ? c.receivedOne : c.receivedMany, { count: String(count) }) +
              (concerns.length ? tpl(c.noted, { concerns: concerns.join(", ").toLowerCase() }) : ".")
          : "",
      );
      trackFormSubmit("photo_evaluation", { photo_count: count, concerns: concerns.join(", ") });
      setStatus("sent");
    } else {
      setError(tpl(errorMessage(content.errors, result.error), vars));
      setStatus("idle");
    }
  }

  const c = content.confirmation;
  return (
    <div className="group">
      <form
        method="post"
        action="/api/lead"
        encType="multipart/form-data"
        onSubmit={onSubmit}
        aria-busy={status === "sending"}
        className={`glass-card relative grid items-start gap-8 rounded-[16px] p-5 group-has-[#sent:target]:hidden lg:grid-cols-2 lg:gap-10 lg:rounded-[18px] lg:p-10 ${sent ? "hidden" : ""}`}
      >
        <div className="flex flex-col gap-3.5">
          <h2 className="m-0 font-serif text-[24px] leading-[1.15] font-normal text-teal lg:text-[28px]">{t.addPhotos}</h2>
          <label
            className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-[16px] border-[1.5px] border-dashed p-7 text-center transition-colors duration-200 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-gold ${count ? "border-gold bg-gold/10" : "border-teal/35 bg-card"}`}
          >
            <span className="grid h-[52px] w-[52px] place-items-center rounded-full bg-teal text-on-dark">
              <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true">
                <path
                  d="M8 11V3m0 0L5 6m3-3l3 3M3 10v2.5A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5V10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[17px] font-semibold text-teal" aria-live="polite">
              {count === 0 ? content.drop.empty : tpl(count === 1 ? content.drop.one : content.drop.many, { count: String(count) })}
            </span>
            <span className="text-sm text-muted">{count === 0 ? content.drop.emptyHint : tpl(content.drop.limitHint, vars)}</span>
            {/* Visible until hydration so, without JS, the browser's own file list shows what was picked. */}
            <input
              type="file"
              name="photos"
              accept="image/*"
              multiple
              onChange={onPick}
              className={`max-w-full text-sm text-body file:mr-3 file:h-9 file:cursor-pointer file:rounded-full file:border file:border-solid file:border-sand file:bg-transparent file:px-3.5 file:text-sm file:font-semibold file:text-teal ${hydrated ? "sr-only" : ""}`}
            />
          </label>
          {photoError && (
            <p role="alert" className="m-0 text-sm text-[#8C2A1F]">
              {photoError}
            </p>
          )}
          {count > 0 && (
            <ul className="m-0 grid list-none grid-cols-4 gap-2 p-0 lg:grid-cols-5">
              {photos.map((p, i) => (
                <li key={p.url} className="relative aspect-square overflow-hidden rounded-[10px] border-2 border-gold bg-card">
                  {/* File name shows through when the browser cannot preview the format (HEIC). */}
                  <span className="absolute inset-0 grid place-items-center p-1 text-center text-[10px] leading-tight break-all text-muted">
                    {p.file.name}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt=""
                    className="relative block h-full w-full object-cover"
                    onError={(ev) => (ev.currentTarget.style.display = "none")}
                  />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    aria-label={tpl(t.removePhoto, { name: p.file.name })}
                    className="absolute top-0 right-0 grid h-11 w-11 cursor-pointer place-items-start justify-items-end border-0 bg-transparent p-1"
                  >
                    <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-teal/85 text-[13px] leading-none text-on-dark">×</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="m-0 flex items-center gap-2 text-[13px] text-muted">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="flex-none">
              <path d="M4 7V5.5a4 4 0 018 0V7m-9 0h10v7H3V7z" fill="none" stroke="#8A6A33" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            {content.privacyNote}
          </p>
        </div>

        <div className="flex flex-col gap-3.5">
          <h2 className="m-0 font-serif text-[24px] leading-[1.15] font-normal text-teal lg:text-[28px]">
            {t.whereReply}
          </h2>
          {/* Both inputs post as `name`; /api/lead joins them. */}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>
              {t.firstName}
              <input type="text" name="name" required autoComplete="given-name" maxLength={60} className={inputClass} />
            </label>
            <label className={labelClass}>
              {t.lastName}
              <input type="text" name="name" required autoComplete="family-name" maxLength={60} className={inputClass} />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>
              {t.mobile}
              <input
                type="tel"
                name="phone"
                required
                autoComplete="tel"
                placeholder="(305) 555-0100"
                maxLength={40}
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              {t.email}
              <input type="email" name="email" required autoComplete="email" maxLength={254} className={inputClass} />
            </label>
          </div>
          <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
            <legend className="mb-2 p-0 text-sm font-semibold text-body">{content.concernsLabel}</legend>
            <div className="flex flex-wrap gap-2">
              {content.concerns.map((value) => (
                <label key={value} className="relative inline-flex cursor-pointer">
                  <input type="checkbox" name="concerns" value={value} className="peer sr-only" />
                  <span className={`${chipClass} h-11 lg:h-[38px]`}>{labelOf(content.concerns, content.concernsLabels, value)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {/* TODO(clinic): the design has no notes field; STACK.md lists `notes`. Label wording needs sign-off. */}
          <label className={labelClass}>
            {t.notes}
            <textarea
              name="notes"
              rows={3}
              maxLength={5000}
              autoComplete="off"
              className="w-full resize-y rounded-[12px] border border-sand bg-card px-3.5 py-3 text-base font-normal text-ink"
            />
          </label>
          <input ref={originRef} type="hidden" name="origin" defaultValue={page} />
          <ConsentField consent={content.consent} locale={locale} />
          <FormGuards locale={locale} />
          <FormError generic={content.errors.generic} message={error} />
          <button
            type="submit"
            disabled={status !== "idle"}
            className="mt-1 h-[54px] w-full cursor-pointer rounded-full border-0 bg-gold text-[17px] font-semibold text-teal transition-colors duration-200 hover:bg-[#d4b471] disabled:cursor-not-allowed disabled:bg-sand disabled:text-muted"
          >
            {status === "sent" ? content.submit.sent : content.submit.idle}
          </button>
        </div>
      </form>

      <div
        id="sent"
        ref={sentRef}
        tabIndex={-1}
        role="status"
        className={`dark-panel scroll-mt-24 items-center gap-8 rounded-[16px] p-6 shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] outline-none target:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 lg:rounded-[20px] lg:px-16 lg:py-14 ${sent ? "grid" : "hidden"}`}
      >
        <div className="flex flex-col gap-4">
          <CheckBadge size={52} />
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:text-[44px] lg:leading-[1.08]">{c.heading}</h2>
          <p className="m-0 text-[17px] leading-[1.55] text-on-dark-muted">
            {summary && `${summary} `}
            {tpl(c.body, { replyHours: String(site.replyHours), officeHours: site.hours.display })}
          </p>
          <Link href={localizePath("/before-and-after", locale)} className="font-semibold text-gold no-underline hover:text-gold">
            {c.link}
          </Link>
        </div>
        {count > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.url}
                src={p.url}
                alt=""
                className="aspect-square w-full rounded-[10px] border border-on-dark/20 object-cover"
                onError={(ev) => (ev.currentTarget.style.display = "none")}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
