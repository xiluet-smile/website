"use client";

import { usePathname } from "next/navigation";
import { FlagES, FlagUS } from "./Icons";
import { esPaths, toEnPath, type Locale } from "@/lib/i18n";

/**
 * EN | ES switch linking to the same page in the other language. The current
 * locale is text, the other a link. Computed from the pathname, which is the
 * same on the server (static export) and the client, so the HTML matches.
 */
export default function LangSwitch({ locale, variant }: { locale: Locale; variant: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const en = toEnPath(pathname ?? "/");
  const known = en !== undefined && en in esPaths;
  const enHref = known ? en : "/";
  const esHref = known ? esPaths[en] : "/es";
  const desktop = variant === "desktop";
  const flag = desktop ? undefined : "h-[11px] w-4";

  const current = (code: string, Flag: typeof FlagUS) =>
    desktop ? (
      <span className="inline-flex items-center gap-1.5 px-1.5 py-1 text-gold" aria-current="true">
        <Flag />
        {code}
      </span>
    ) : (
      <>
        <Flag className={flag} />
        <span className="text-gold">{code}</span>
      </>
    );
  const link = (code: string, Flag: typeof FlagUS, href: string, lang: Locale, label: string) => (
    <a
      href={href}
      lang={lang}
      hrefLang={lang === "es" ? "es-US" : "en-US"}
      aria-label={label}
      className={desktop ? "inline-flex items-center gap-1.5 px-1.5 py-1 text-on-dark no-underline hover:text-gold" : "inline-flex h-11 items-center gap-1.5 text-on-dark no-underline"}
    >
      <Flag className={flag} />
      {code}
    </a>
  );
  const sep = (
    <span className={desktop ? "text-[#8F9A97]" : "px-0.5 text-[#8F9A97]"} aria-hidden="true">
      |
    </span>
  );

  return (
    <div
      className={
        desktop
          ? "flex gap-1 border-l border-[rgba(247,244,238,.18)] pl-4 text-sm font-semibold"
          : "flex h-11 items-center gap-1.5 px-2 text-[15px] font-semibold text-on-dark"
      }
    >
      {locale === "en" ? current("EN", FlagUS) : link("EN", FlagUS, enHref, "en", "English")}
      {sep}
      {locale === "es" ? current("ES", FlagES) : link("ES", FlagES, esHref, "es", "Español")}
    </div>
  );
}
