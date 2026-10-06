import Link from "next/link";
import { ui } from "@/lib/content-i18n";
import { localizePath, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

const outline = "flex h-[52px] items-center justify-center rounded-full border-[1.5px] border-gold text-[15px] font-semibold text-on-dark no-underline hover:text-on-dark";

/** Sticky Call / WhatsApp / Free evaluation bar shown on mobile only. */
export default function MobileCtaBar({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale).mobileBar;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_1fr_1.6fr] gap-2 border-t border-[rgba(247,244,238,.14)] bg-[rgba(4,40,46,.82)] px-3 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(26,26,26,.15)] backdrop-blur-[20px] backdrop-saturate-[1.3] lg:hidden">
      <a href={site.phone.href} className={outline}>
        {t.call}
      </a>
      <a href={site.whatsapp} rel="noopener" className={outline}>
        {t.whatsapp}
      </a>
      <Link
        href={localizePath("/free-photo-evaluation", locale)}
        className="flex h-[52px] items-center justify-center rounded-full bg-gold text-[15px] font-semibold text-teal no-underline hover:text-teal"
      >
        {t.evaluation}
      </Link>
    </div>
  );
}
