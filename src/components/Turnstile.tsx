"use client";

import { useEffect, useRef } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_FIELD = "cf-turnstile-response";
const LOAD_EVENT = "turnstile:load";

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | undefined;
function loadScript(): Promise<void> {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = undefined;
      s.remove();
      reject(new Error("Turnstile failed to load"));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Cloudflare Turnstile widget (managed, shown only if interaction is needed).
 * Must be rendered inside a <form>: the script is loaded the first time that
 * form scrolls into view or receives focus, and the token is added to the form
 * as a hidden `cf-turnstile-response` field. Renders nothing when
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset (local development).
 */
export default function Turnstile() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !SITE_KEY) return;
    const form = el.closest("form");
    let widgetId: string | undefined;
    let loading = false;
    let cancelled = false;

    const start = () => {
      if (loading || widgetId) return;
      loading = true;
      io.disconnect();
      form?.removeEventListener("focusin", start);
      loadScript()
        .then(() => {
          if (cancelled || !window.turnstile) return;
          widgetId = window.turnstile.render(el, { sitekey: SITE_KEY, appearance: "interaction-only", size: "flexible" });
          el.dataset.widgetId = widgetId;
        })
        .catch(() => {
          // Leave the form usable; the next submit asks again via LOAD_EVENT.
        })
        .finally(() => {
          loading = false;
        });
    };

    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && start(), {
      rootMargin: "200px",
    });
    io.observe(form ?? el);
    form?.addEventListener("focusin", start);
    form?.addEventListener(LOAD_EVENT, start);

    return () => {
      cancelled = true;
      io.disconnect();
      form?.removeEventListener("focusin", start);
      form?.removeEventListener(LOAD_EVENT, start);
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, []);

  if (!SITE_KEY) return null;
  return <div ref={ref} />;
}

/**
 * Resolves once the form holds a Turnstile token, or after `timeoutMs` (the
 * server then decides). Resolves immediately when Turnstile is not configured.
 */
export async function waitForTurnstile(form: HTMLFormElement, timeoutMs = 8000): Promise<void> {
  if (!SITE_KEY) return;
  const token = () => form.querySelector<HTMLInputElement>(`[name="${TOKEN_FIELD}"]`)?.value;
  if (token()) return;
  form.dispatchEvent(new Event(LOAD_EVENT));
  const deadline = Date.now() + timeoutMs;
  while (!token() && Date.now() < deadline) await new Promise((r) => setTimeout(r, 150));
}

/** Tokens are single-use: get a fresh one after a failed submission. */
export function resetTurnstile(form: HTMLFormElement) {
  const id = form.querySelector<HTMLElement>("[data-widget-id]")?.dataset.widgetId;
  if (id) window.turnstile?.reset(id);
}
