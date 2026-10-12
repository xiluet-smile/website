// Saves the ad parameters from the landing URL so a later form submit can send them to the CRM.
// CRM-only: nothing here talks to Meta or Google, and nothing is ever written back into URLs.
// Best effort by design: without storage (private mode, blocked) the form simply sends empty values.

const KEY = "xs_attr_v1";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_LEN = 300;

/** Query parameters captured from the landing URL. Keep in sync with ATTRIBUTION_KEYS in functions/api/_shared.ts. */
export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_campaign_id",
  "utm_adset_id",
  "utm_ad_id",
  "fbclid",
  "gclid",
  "wbraid",
  "gbraid",
  "msclkid",
  "ttclid",
] as const;
export type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number];

type Touch = Partial<Record<AttributionParam, string>> & { landing_url: string; referrer: string; ts: number };
type Store = { first?: Touch; last?: Touch; saved_at?: number };

/** Flat values sent with every form; empty strings when nothing is known. */
export type Attribution = Record<AttributionParam, string> & {
  /** Meta browser id from the `_fbc` cookie, or built from fbclid the way the pixel would. */
  fbc: string;
  /** Meta browser id from the `_fbp` cookie. */
  fbp: string;
  landing_url: string;
  referrer: string;
  first_utm_campaign: string;
  first_utm_ad_id: string;
  /** The page the form was submitted on. */
  event_source_url: string;
};

function load(): Store {
  try {
    const store = JSON.parse(localStorage.getItem(KEY) || "null") as Store | null;
    if (!store || !store.saved_at || Date.now() - store.saved_at > TTL_MS) return {};
    return store;
  } catch {
    return {};
  }
}

function save(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // private mode or storage blocked: attribution is best-effort
  }
}

function readCookie(name: string): string {
  try {
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : "";
  } catch {
    return "";
  }
}

const pageUrl = () => window.location.origin + window.location.pathname;

/**
 * Call on every page view. When the URL carries ad parameters they are stored as the
 * latest touch, and as the first touch if none is stored yet. Kept for 90 days.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  let qs: URLSearchParams;
  try {
    qs = new URLSearchParams(window.location.search);
  } catch {
    return;
  }
  const touch: Partial<Touch> = {};
  for (const p of ATTRIBUTION_PARAMS) {
    const v = qs.get(p);
    if (v) touch[p] = v.slice(0, MAX_LEN);
  }
  if (Object.keys(touch).length === 0) return; // no ad parameters on this visit

  const full: Touch = {
    ...touch,
    landing_url: pageUrl(),
    referrer: (document.referrer || "").slice(0, MAX_LEN),
    ts: Date.now(),
  };
  const store = load();
  if (!store.first) store.first = full;
  store.last = full;
  store.saved_at = Date.now();
  save(store);
}

/** Flat object to send with a form submit. Read at submit time: the Meta cookies can be set after page load. */
export function getAttribution(): Attribution {
  const store = typeof window === "undefined" ? {} : load();
  const t: Partial<Touch> = store.last ?? {};
  const f: Partial<Touch> = store.first ?? {};

  let fbc = readCookie("_fbc");
  if (!fbc && t.fbclid) fbc = `fb.1.${t.ts ?? Date.now()}.${t.fbclid}`; // same format the pixel writes

  const out = {} as Attribution;
  for (const p of ATTRIBUTION_PARAMS) out[p] = t[p] ?? "";
  out.fbc = fbc;
  out.fbp = readCookie("_fbp");
  out.landing_url = t.landing_url ?? "";
  out.referrer = t.referrer ?? "";
  out.first_utm_campaign = f.utm_campaign ?? "";
  out.first_utm_ad_id = f.utm_ad_id ?? "";
  out.event_source_url = typeof window === "undefined" ? "" : pageUrl();
  return out;
}
