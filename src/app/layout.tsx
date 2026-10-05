import type { Metadata, Viewport } from "next";
import Footer from "@/components/Footer";
import MobileCtaBar from "@/components/MobileCtaBar";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.name,
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = { themeColor: "#04282E" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <head>
        {/* Only the two faces used by above-the-fold text are preloaded. */}
        <link rel="preload" href="/fonts/playfair-display-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/source-sans-3-latin-400-normal.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-card focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <div className="page-bg">{children}</div>
        <Footer />
        <MobileCtaBar />
      </body>
    </html>
  );
}
