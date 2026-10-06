import Footer from "./Footer";
import MobileCtaBar from "./MobileCtaBar";
import SiteScripts from "./SiteScripts";
import { ui } from "@/lib/content-i18n";
import { langTag, type Locale } from "@/lib/i18n";

/** <html>…</html> for a locale: fonts, scripts, skip link, page, footer and mobile bar. Used by both root layouts. */
export default function RootShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={langTag(locale)}>
      <head>
        {/* Only the two faces used by above-the-fold text are preloaded. */}
        <link rel="preload" href="/fonts/playfair-display-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/source-sans-3-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <SiteScripts />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
        >
          {ui(locale).skipToContent}
        </a>
        <div className="page-bg">{children}</div>
        <Footer locale={locale} />
        <MobileCtaBar locale={locale} />
      </body>
    </html>
  );
}
