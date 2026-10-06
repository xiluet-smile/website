import Link from "next/link";
import DoctorCta from "@/components/DoctorCta";
import FaqAccordion from "@/components/FaqAccordion";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { getContent, tpl, ui } from "@/lib/content-i18n";
import { localizeHref, localizePath, type Locale } from "@/lib/i18n";
import { faqPage, pageGraph } from "@/lib/schema";

const PATH = "/doctors" as const;

export default function DoctorsPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages, site, doctors, doctorsIndex, faq } = getContent(locale);
  const faqs = faq.doctors;
  /** Fills the {rating} / {count} tokens in doctors-index.json from site.rating. */
  const fill = (s: string) => s.replace("{rating}", site.rating.value).replace("{count}", String(site.rating.count));
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, locale, faqPage(faqs))} />
      <PageHero locale={locale}>
        <div className="wrap relative z-[2] pt-8 pb-14 lg:pt-14 lg:pb-20">
          <div className="flex max-w-[880px] flex-col gap-5 lg:gap-[26px]">
            <nav aria-label="Breadcrumb" className="flex gap-2 text-[13px] text-on-dark-muted">
              <Link href={localizePath("/", locale)} className="text-on-dark-muted no-underline hover:text-gold">
                {t.home}
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-gold">
                {t.breadcrumb.doctors}
              </span>
            </nav>
            <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] text-pretty lg:text-[60px] lg:leading-[1.04]">
              {pages[PATH].h1}
            </h1>
            <p className="m-0 max-w-[58ch] text-[17px] leading-[1.5] text-pretty text-on-dark-muted lg:text-xl lg:leading-[1.5]">
              {t.doctorsPage.lead}
            </p>
          </div>
        </div>
      </PageHero>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          {doctors.map((d) => (
            <Link
              key={d.slug}
              href={localizeHref(d.href, locale)}
              className="glass-card flex flex-col overflow-hidden rounded-2xl text-inherit no-underline hover:text-inherit lg:rounded-[18px]"
            >
              <Img
                src={d.image}
                alt={d.name}
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="block aspect-[4/5] h-auto w-full object-cover object-[50%_20%]"
              />
              <div className="flex flex-col gap-2.5 p-6">
                <h2 className="m-0 font-serif text-[22px] leading-[1.15] font-normal text-teal lg:text-[26px]">{d.name}</h2>
                <span className="text-[13px] leading-[1.4] font-semibold tracking-[.1em] text-gold-text uppercase">{d.role}</span>
                <p className="m-0 mt-1.5 text-base leading-[1.5] text-body">{d.bio}</p>
                <span className="mt-1 text-sm text-muted">{d.langs}</span>
                <span className="mt-2.5 text-sm font-semibold text-gold-text">{t.viewProfile}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <dl className="dark-panel m-0 grid grid-cols-2 gap-6 rounded-2xl p-6 shadow-[inset_0_1px_0_rgba(247,244,238,.18),0_30px_80px_rgba(4,40,46,.32)] lg:grid-cols-4 lg:rounded-[20px] lg:p-16">
          {doctorsIndex.facts.map((f) => (
            <div key={f.sub} className="flex flex-col gap-2 border-[rgba(247,244,238,.14)] lg:border-r lg:pr-6">
              <dt className="order-2 text-[15px] leading-[1.4] text-on-dark-muted">{fill(f.sub)}</dt>
              <dd className="m-0 font-serif text-[34px] leading-none lg:text-[44px]">{fill(f.big)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:sticky lg:top-8 lg:text-[48px] lg:leading-[1.1]">
            {t.doctorsPage.faqTitle}
          </h2>
          <FaqAccordion faqs={faqs} className="flex flex-col gap-3" locale={locale} />
        </div>
      </section>

      <DoctorCta
        locale={locale}
        heading={tpl(t.photoCta.heading, { hours: site.replyHours })}
        text={t.photoCta.body}
      />
    </main>
  );
}
