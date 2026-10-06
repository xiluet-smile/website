import Header from "./Header";
import type { Locale } from "@/lib/i18n";

/** Dark teal hero used by every page except Home: gradient, gold glow, header, then content. */
export default function PageHero({ locale = "en", children }: { locale?: Locale; children: React.ReactNode }) {
  return (
    <section className="relative z-10 flex flex-col bg-[linear-gradient(160deg,#073238_0%,#04282E_55%,#031E24_100%)] text-on-dark shadow-[0_30px_80px_rgba(4,40,46,.28)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(700px_500px_at_85%_20%,rgba(205,177,128,.14),transparent_70%)]"
      />
      <Header locale={locale} />
      {children}
    </section>
  );
}
