import {
  ClinicFeatureGrid,
  ClinicHero,
  ClinicPhotoCta,
  ClinicSectionHead,
  clinicDarkPanel,
} from "@/components/ClinicSections";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { getContent, tpl, ui } from "@/lib/content-i18n";
import { localizePath, type Locale } from "@/lib/i18n";
import { pageGraph } from "@/lib/schema";

const PATH = "/clinic" as const;

export default function ClinicPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages, site, clinic } = getContent(locale);
  const { address } = site;
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, locale)} />
      <PageHero locale={locale}>
        <ClinicHero
          trail={[{ label: t.home, href: localizePath("/", locale) }, { label: t.breadcrumb.aboutUs }, { label: t.breadcrumb.clinic }]}
          title={pages[PATH].h1}
          lead={tpl(t.clinicPage.lead, { street: address.street, locality: address.locality })}
          media={
            <Img
              src="gen-clinic-room.jpg"
              alt={t.clinicPage.roomAlt}
              sizes="(min-width: 1024px) 480px, calc(100vw - 40px)"
              className="block aspect-[4/3] h-auto w-full object-cover"
              priority
            />
          }
        />
      </PageHero>

      <section className="wrap pt-16 lg:pt-28">
        <ClinicSectionHead
          title={t.clinicPage.findTitle}
          aside={t.clinicPage.findAside}
        />
        <ClinicFeatureGrid items={clinic.features} />
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <div className={`${clinicDarkPanel} flex flex-col gap-[18px] px-5 py-8 lg:p-12`}>
            <h2 className="eyebrow m-0 text-gold">{t.clinicPage.visitUs}</h2>
            <address className="font-serif text-2xl leading-[1.25] not-italic lg:text-[30px]">
              {address.street}
              <br />
              {address.locality}, {address.region} {address.postalCode}
            </address>
            <p className="m-0 text-[17px] text-on-dark-muted">
              {site.hours.display} · {t.clinicPage.closedWeekends}
              <br />
              <a href={site.phone.href} className="inline-flex min-h-11 items-center text-on-dark hover:text-gold lg:min-h-0">
                {site.phone.display}
              </a>
            </p>
            <a
              href={site.maps.directions}
              rel="noopener"
              className="mt-2 inline-flex min-h-11 items-center self-start font-semibold text-gold no-underline hover:text-on-dark lg:min-h-0"
            >
              {t.getDirections}
            </a>
          </div>
          <div className="glass-card flex flex-col gap-[18px] rounded-2xl px-5 py-8 lg:rounded-[18px] lg:p-12">
            <h2 className="eyebrow m-0 text-gold-text">{t.clinicPage.gettingHere}</h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[17px] leading-[1.5] text-ink">
              {clinic.travel.map((x) => (
                <li key={x} className="grid grid-cols-[18px_minmax(0,1fr)] gap-3">
                  <svg viewBox="0 0 18 18" width="18" height="18" className="mt-1" aria-hidden="true">
                    <path
                      d="M3.5 9.5l3.5 3.5 7.5-8"
                      fill="none"
                      stroke="#CDB180"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap py-16 lg:py-28">
        <ClinicPhotoCta locale={locale} />
      </section>
    </main>
  );
}
