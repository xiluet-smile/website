"use client";

// Pieces shared by LeadForm and ContactForm.
import { useSyncExternalStore } from "react";
import Turnstile, { resetTurnstile, waitForTurnstile } from "./Turnstile";
import { nav, site } from "@/lib/site";

export const inputClass =
  "h-[50px] w-full rounded-[12px] border border-sand bg-card px-3.5 text-base font-normal text-ink placeholder:text-hint";
export const labelClass = "flex flex-col gap-1.5 text-sm font-semibold text-body";
/** Checkbox/radio rendered as a pill: put on the <span> that follows a `.peer.sr-only` input. */
export const chipClass =
  "inline-flex items-center rounded-full border border-sand px-3.5 text-sm font-semibold whitespace-nowrap text-ink transition-colors duration-150 peer-checked:border-teal peer-checked:bg-teal peer-checked:text-on-dark peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold";

export type Consent = { version: string; text: string; privacyLabel: string };

/** The sentence submitted as the consent value. Must match consentString() in functions/api/_shared.ts. */
export const consentValue = (c: Consent) => `${c.text} ${c.privacyLabel}.`;

/** Required consent checkbox. Its value is the wording itself, which the server logs for TCPA. */
export function ConsentField({ consent }: { consent: Consent }) {
  // TODO(clinic): Privacy Policy page does not exist yet; the link follows nav.json → legal.
  const privacyHref = nav.legal.find((l) => l.label === consent.privacyLabel)?.href ?? "#";
  return (
    <label className="grid grid-cols-[20px_minmax(0,1fr)] items-start gap-2.5 text-[13px] leading-[1.45] text-muted">
      <input type="checkbox" name="consent" value={consentValue(consent)} required className="mt-0.5 h-[18px] w-[18px]" />
      <span>
        {consent.text}{" "}
        <a href={privacyHref} className="text-gold-text">
          {consent.privacyLabel}
        </a>
        .
      </span>
    </label>
  );
}

/** Honeypot, the no-JS marker and the Turnstile widget. Place inside the <form>. */
export function FormGuards() {
  return (
    <>
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <noscript>
        <input type="hidden" name="nojs" value="1" />
      </noscript>
      <Turnstile />
    </>
  );
}

/**
 * Error block. Without JS the function redirects to `#form-error` and `:target`
 * reveals the generic message; with JS `message` holds the specific one.
 */
export function FormError({ generic, message }: { generic: string; message: string | null }) {
  return (
    <p
      id="form-error"
      role="alert"
      className={`m-0 scroll-mt-24 rounded-[12px] border border-[#C0392B]/40 bg-[#C0392B]/[.07] px-3.5 py-3 text-[15px] leading-[1.45] text-[#8C2A1F] target:block ${message ? "block" : "hidden"}`}
    >
      {message ?? generic}{" "}
      <a href={site.phone.href} className="font-semibold whitespace-nowrap text-[#8C2A1F]">
        {site.phone.display}
      </a>
    </p>
  );
}

const noopSubscribe = () => () => {};

/** True after the no-JS redirect lands on `?sent=1`. */
export function useSentParam(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => new URLSearchParams(window.location.search).get("sent") === "1",
    () => false,
  );
}

export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Posts the form with fetch and returns the function's JSON answer.
 * `encode` turns the form's fields into the request body: FormData is sent as
 * multipart, a plain object as JSON.
 */
export async function submitForm(
  form: HTMLFormElement,
  encode: (data: FormData) => FormData | Record<string, string>,
): Promise<SubmitResult> {
  try {
    await waitForTurnstile(form);
    const body = encode(new FormData(form));
    const json = !(body instanceof FormData);
    const res = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json", ...(json ? { "Content-Type": "application/json" } : {}) },
      body: json ? JSON.stringify(body) : body,
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (res.ok && data?.ok) return { ok: true };
    resetTurnstile(form);
    return { ok: false, error: data?.error ?? "server" };
  } catch {
    resetTurnstile(form);
    return { ok: false, error: "server" };
  }
}

/** Message for an error code, falling back to the generic one. */
export const errorMessage = (errors: Record<string, string>, code: string) => errors[code] ?? errors.generic;

export function CheckBadge({ size }: { size: number }) {
  return (
    <span
      className="grid flex-none place-items-center rounded-full bg-gold text-teal"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 18 18" width={size * 0.46} height={size * 0.46} aria-hidden="true">
        <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke="#04282E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
