import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { PhoneIcon } from "@/components/Icons";
import { getContent, ui } from "@/lib/content-i18n";
import { localizePath, type Locale } from "@/lib/i18n";
import { contactPage, pageGraph } from "@/lib/schema";
import type { PagePath } from "@/lib/site";

type Kind = "referrals" | "partnerships";

/** Shared template for the Referrals and Partnerships pages: hero, three points, contact form. */
export default function ReferralPage({ kind, locale = "en" }: { kind: Kind; locale?: Locale }) {
  const t = ui(locale);
  const { referrals: data, pages, site } = getContent(locale);
  const path = `/${kind}` as PagePath;
  const c = data[kind];
  return (
    <main id="main">
      <JsonLd data={pageGraph(path, locale, contactPage(path, locale))} />
      <PageHero locale={locale}>
        <div className="wrap relative z-[2] pt-6 pb-14 lg:pt-10 lg:pb-20">
          <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-on-dark-muted">
            <ol className="m-0 flex list-none gap-2 p-0">
              <li>
                <Link href={localizePath("/", locale)} className="text-on-dark-muted no-underline hover:text-gold">
                  {t.home}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{pages[path].breadcrumb}</li>
            </ol>
          </nav>
          <div className="max-w-[720px]">
            <span className="eyebrow mb-4 block text-gold">{c.eyebrow}</span>
            <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal text-pretty lg:text-[56px] lg:leading-[1.04]">{pages[path].h1}</h1>
            <p className="mt-5 mb-0 max-w-[62ch] text-[17px] leading-[1.55] text-pretty text-on-dark-muted lg:text-lg">{c.intro}</p>
            {"bonus" in c && (
              <div className="mt-7 inline-flex items-baseline gap-3 rounded-2xl border border-[rgba(205,177,128,.45)] bg-[rgba(205,177,128,.12)] px-5 py-3.5">
                <span className="font-serif text-[36px] leading-none text-gold lg:text-[44px]">{c.bonus.amount}</span>
                <span className="text-[15px] font-semibold tracking-[.04em] text-on-dark uppercase">{t.referral.bonusPer}</span>
              </div>
            )}
          </div>
        </div>
      </PageHero>

      <section className="wrap pt-16 pb-16 lg:pt-28 lg:pb-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="flex flex-col gap-4">
            {c.points.map((p, i) => (
              <div key={p.t} className="glass-card flex gap-4 rounded-2xl p-5 lg:p-6">
                <span className="font-serif text-xl text-gold-text" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="m-0 font-serif text-[21px] leading-[1.25] font-normal text-teal">{p.t}</h2>
                  <p className="m-0 mt-1.5 text-base leading-[1.55] text-body">{p.d}</p>
                </div>
              </div>
            ))}
            <div className="dark-panel mt-2 flex flex-col gap-3 rounded-2xl p-6">
              <span className="font-serif text-[22px]">{t.preferToTalk}</span>
              <a href={site.phone.href} className="inline-flex items-center gap-3 font-serif text-[26px] text-gold no-underline hover:text-gold">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full border-[1.5px] border-[rgba(205,177,128,.5)] bg-[rgba(205,177,128,.12)]">
                  <PhoneIcon size={20} />
                </span>
                {site.phone.display}
              </a>
              <span className="text-sm text-on-dark-muted">
                {site.hours.display} · {site.languages.display}
              </span>
            </div>
          </div>
          <div className="glass-card rounded-[20px] p-6 lg:p-10">
            <ContactForm
              locale={locale}
              topic={kind === "referrals" ? "Referral" : "Partnership"}
              heading={c.formTitle}
              intro={c.formIntro}
              messageLabel={c.messageLabel}
              messagePlaceholder={c.messagePlaceholder}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
