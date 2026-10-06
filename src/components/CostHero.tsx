import Link from "next/link";
import PageHero from "./PageHero";
import { ui } from "@/lib/content-i18n";
import { localizePath, type Locale } from "@/lib/i18n";

/** Text-only hero (breadcrumb, h1, lead) used by the Cost, Results, Reviews and Blog pages. */
export default function CostHero({
  crumbs,
  title,
  lead,
  locale = "en",
  children,
}: {
  /** Breadcrumb labels after "Home"; the last one is the current page. */
  crumbs: string[];
  title: string;
  lead: string;
  locale?: Locale;
  children?: React.ReactNode;
}) {
  return (
    <PageHero locale={locale}>
      <div className="wrap relative z-[2] pt-8 pb-12 lg:pt-14 lg:pb-20">
        <div className="flex max-w-[880px] flex-col gap-5 lg:gap-[26px]">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-[13px] text-on-dark-muted">
            <Link href={localizePath("/", locale)} className="text-on-dark-muted no-underline hover:text-gold">
              {ui(locale).home}
            </Link>
            {crumbs.map((c, i) => (
              <span key={c} className="contents">
                <span aria-hidden="true">/</span>
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-gold">
                    {c}
                  </span>
                ) : (
                  <span>{c}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] text-pretty lg:text-[60px] lg:leading-[1.04]">
            {title}
          </h1>
          <p className="m-0 max-w-[58ch] text-[17px] leading-[1.5] text-pretty text-on-dark-muted lg:text-xl">{lead}</p>
          {children}
        </div>
      </div>
    </PageHero>
  );
}
