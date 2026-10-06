import Link from "next/link";
import { tpl, ui } from "@/lib/content-i18n";
import { localizePath, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Closing "start with photos" panel shared by the financing index and partner pages. */
export default function FinancingCta({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  return (
    <section className="wrap py-16 lg:py-28">
      <div className="dark-panel grid items-center gap-8 rounded-2xl p-6 shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:rounded-[20px] lg:p-16">
        <div className="flex flex-col gap-4 lg:gap-5">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal text-pretty lg:text-[52px] lg:leading-[1.08]">
            {tpl(t.photoCta.heading, { hours: site.replyHours })}
          </h2>
          <p className="m-0 text-[17px] text-on-dark-muted lg:text-[19px]">
            {t.photoCta.body}
          </p>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-[rgba(255,255,255,.8)] bg-[rgba(247,244,238,.9)] p-6 text-ink lg:p-8">
          <h3 className="m-0 font-serif text-[22px] leading-[1.55] font-normal lg:text-2xl lg:leading-[1.55]">
            {t.photoCta.cardTitle}
          </h3>
          <p className="m-0 text-[15px] text-body">{t.photoCta.cardBody}</p>
          <Link href={localizePath("/free-photo-evaluation", locale)} className="btn btn-teal h-[52px] w-full px-[26px] text-[17px] lg:w-auto lg:self-start">
            {t.startMyEvaluation}
          </Link>
        </div>
      </div>
    </section>
  );
}
