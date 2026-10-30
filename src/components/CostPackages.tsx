import Link from "next/link";
import { getContent, tpl, ui } from "@/lib/content-i18n";
import { localizeHref, type Locale } from "@/lib/i18n";

/** The four package cards, rendered from prices.json. */
export default function CostPackages({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale).cost;
  const { prices } = getContent(locale);
  return (
    <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
      {prices.packages.map((p) => (
        <article
          key={p.id}
          id={p.id}
          className={`glass-card flex flex-col gap-5 rounded-2xl p-6 lg:rounded-[18px] lg:p-7 ${
            p.featured ? "border-[rgba(205,177,128,.55)]" : ""
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5">
              <p className="eyebrow m-0 text-gold-text">{p.kicker}</p>
              <h2 className="m-0 font-serif text-[22px] leading-[1.15] font-normal lg:text-2xl">{p.name}</h2>
            </div>
            {p.badge && (
              <span className="rounded-full bg-[#E3F3E8] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-[#1F6B45]">
                {p.badge}
              </span>
            )}
          </div>
          <p className="m-0 flex flex-col gap-1">
            <span className="font-serif text-[44px] leading-none tracking-[-.02em]">{p.price}</span>
            <span className="text-sm text-muted">{p.sub}</span>
          </p>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px] leading-[1.4]">
            {p.features.map((f) => (
              <li key={f} className="grid grid-cols-[18px_minmax(0,1fr)] items-start gap-2.5">
                <svg viewBox="0 0 18 18" width="18" height="18" className="mt-0.5" aria-hidden="true">
                  <path
                    d="M3.5 9.5l3.5 3.5 7.5-8"
                    fill="none"
                    stroke="#CDB180"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-auto border-t border-sand pt-2 text-[13px] leading-[1.45] text-muted">{p.note}</p>
          <Link
            href={localizeHref(p.href, locale)}
            aria-label={tpl(t.aboutTreatmentAria, { name: p.name })}
            className="flex min-h-11 items-center text-sm font-semibold text-gold-text no-underline hover:underline lg:min-h-0"
          >
            {t.aboutTreatment}
          </Link>
        </article>
      ))}
    </div>
  );
}
