"use client";

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
  useSentParam, trackFormSubmit } from "./FormParts";
import { formContent, labelOf, ui } from "@/lib/ui-i18n";
import type { Locale } from "@/lib/i18n";

const ICONS = {
  person: (
    <>
      <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 17a6 6 0 0112 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  mail: <path d="M3 5.5h14v9H3zM3 5.5l7 5.5 7-5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  phone: (
    <path
      d="M6.5 3.5l2 3-1.6 1.6a9 9 0 005 5l1.6-1.6 3 2-1 2.3a1.5 1.5 0 01-1.6.9C8.6 15.9 4.1 11.4 3.3 6.1a1.5 1.5 0 01.9-1.6l2.3-1z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  tag: (
    <>
      <path d="M3 4.5h6.5L17 12l-5 5-7.5-7.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="6.5" cy="8" r="1.2" fill="currentColor" />
    </>
  ),
};

/** Label + input with the design's leading icon. */
function Field({ label, icon, children }: { label: string; icon: keyof typeof ICONS; children: React.ReactNode }) {
  return (
    <label className={labelClass}>
      {label}
      <span className="relative block">
        <span className="pointer-events-none absolute top-1/2 left-3.5 flex -translate-y-1/2 text-hint">
          <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
            {ICONS[icon]}
          </svg>
        </span>
        {children}
      </span>
    </label>
  );
}

const withIcon = `${inputClass} pl-[42px]`;

/**
 * Contact form. Server-rendered as a plain form that posts to /api/contact;
 * with JS it is sent as JSON and the confirmation replaces the form.
 */
type Props = {
  /** Fixed subject (hides the subject select), e.g. "Referral". Always the English value from contact.json topics. */
  topic?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  heading?: string;
  intro?: string;
  locale?: Locale;
};

export default function ContactForm({ topic, messageLabel, messagePlaceholder, heading, intro, locale = "en" }: Props = {}) {
  const t = ui(locale).contactForm;
  const { contact: content, site } = formContent(locale);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [via, setVia] = useState("");
  const sentRef = useRef<HTMLDivElement>(null);
  const sent = useSentParam() || status === "sent";

  useEffect(() => {
    if (status === "sent") sentRef.current?.focus();
  }, [status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;
    const form = e.currentTarget;
    setStatus("sending");
    setError(null);
    let replyVia = "";
    const result = await submitForm(form, (data) => {
      const body: Record<string, string> = {};
      data.forEach((v, k) => {
        if (typeof v === "string") body[k] = v;
      });
      replyVia = body.replyVia ?? "";
      return body;
    });
    if (result.ok) {
      // The submitted value stays English (the server matches it); the confirmation shows the locale's label.
      setVia(labelOf(content.replyVia, content.replyViaLabels, replyVia));
      trackFormSubmit("contact", { reply_via: replyVia });
      setStatus("sent");
    } else {
      setError(errorMessage(content.errors, result.error));
      setStatus("idle");
    }
  }

  const c = content.confirmation;
  return (
    <div className="group">
      <form
        method="post"
        action="/api/contact"
        encType="multipart/form-data"
        onSubmit={onSubmit}
        aria-busy={status === "sending"}
        className={`relative flex flex-col gap-4 group-has-[#sent:target]:hidden ${sent ? "hidden" : ""}`}
      >
        <div className="mb-1 flex flex-col gap-3">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal text-ink lg:text-[40px] lg:leading-[1.1]">{heading ?? t.heading}</h2>
          <p className="m-0 text-[17px] leading-[1.55] text-body">{intro ?? t.intro}</p>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label={t.firstName} icon="person">
            <input
              type="text"
              name="first"
              required
              autoComplete="given-name"
              placeholder={t.enterFirst}
              maxLength={120}
              className={withIcon}
            />
          </Field>
          <Field label={t.lastName} icon="person">
            <input
              type="text"
              name="last"
              required
              autoComplete="family-name"
              placeholder={t.enterLast}
              maxLength={120}
              className={withIcon}
            />
          </Field>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label={t.email} icon="mail">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder={t.enterEmail}
              maxLength={254}
              className={withIcon}
            />
          </Field>
          <Field label={t.phone} icon="phone">
            <input
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              placeholder={t.enterPhone}
              maxLength={40}
              className={withIcon}
            />
          </Field>
        </div>
        {topic ? (
          <input type="hidden" name="topic" value={topic} />
        ) : (
          <Field label={t.subject} icon="tag">
            <select name="topic" autoComplete="off" className={`${withIcon} appearance-none`}>
              {content.topics.map((value) =>
                content.topicsLabels ? (
                  <option key={value} value={value}>
                    {labelOf(content.topics, content.topicsLabels, value)}
                  </option>
                ) : (
                  <option key={value}>{value}</option>
                ),
              )}
            </select>
          </Field>
        )}
        <label className={labelClass}>
          {messageLabel ?? t.message}
          <textarea
            name="message"
            rows={5}
            required
            placeholder={messagePlaceholder ?? t.typeHere}
            maxLength={5000}
            autoComplete="off"
            className="w-full resize-y rounded-[12px] border border-sand bg-card px-3.5 py-3 text-base font-normal text-ink placeholder:text-hint"
          />
        </label>
        <fieldset className="m-0 flex min-w-0 flex-col border-0 p-0">
          <legend className="mb-2 p-0 text-sm font-semibold text-body">{content.replyViaLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {content.replyVia.map((value, i) => (
              <label key={value} className="relative inline-flex cursor-pointer">
                <input type="radio" name="replyVia" value={value} defaultChecked={i === 0} className="peer sr-only" />
                <span className={`${chipClass} h-11 lg:h-9`}>{labelOf(content.replyVia, content.replyViaLabels, value)}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <ConsentField consent={content.consent} locale={locale} />
        <FormGuards locale={locale} />
        <FormError generic={content.errors.generic} message={error} />
        <button
          type="submit"
          disabled={status !== "idle"}
          className="h-[54px] w-full cursor-pointer rounded-[14px] border-0 bg-teal px-[30px] text-[17px] font-semibold text-on-dark shadow-[0_10px_24px_rgba(4,40,46,.25)] hover:bg-[#0a3a40] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto lg:self-start"
        >
          {status === "sent" ? content.submit.sent : content.submit.idle}
        </button>
      </form>

      <div
        id="sent"
        ref={sentRef}
        tabIndex={-1}
        role="status"
        className={`scroll-mt-24 flex-col gap-3.5 text-ink outline-none target:flex ${sent ? "flex" : "hidden"}`}
      >
        <CheckBadge size={48} />
        <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:text-[40px] lg:leading-[1.1]">{c.heading}</h2>
        <p className="m-0 text-[17px] leading-[1.55] text-body">
          {c.body}
          {via && c.by.replace("{via}", via.toLowerCase())}. {c.urgent}{" "}
          <a href={site.phone.href} className="font-semibold text-gold-text">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
