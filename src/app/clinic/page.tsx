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
import clinic from "@/content/clinic.json";
import { pageGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { pages, site } from "@/lib/site";

const PATH = "/clinic" as const;
export const metadata = pageMetadata(PATH);

export default function Page() {
  const { address } = site;
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH)} />
      <PageHero>
        <ClinicHero
          trail={[{ label: "Home", href: "/" }, { label: "About Us" }, { label: "Clinic" }]}
          title={pages[PATH].h1}
          lead={
            <>
              {address.street}, {address.locality}. Fifteen minutes from Miami International Airport. The ceramist who
              makes your veneers works down the hall from your doctor.
            </>
          }
          media={
            <Img
              src="gen-clinic-room.jpg"
              alt="Xiluet treatment room"
              sizes="(min-width: 1024px) 480px, calc(100vw - 40px)"
              className="block aspect-[4/3] h-auto w-full object-cover"
              priority
            />
          }
        />
      </PageHero>

      <section className="wrap pt-16 lg:pt-28">
        <ClinicSectionHead
          title="What you will find here"
          aside="Everything your treatment needs, under one roof."
        />
        <ClinicFeatureGrid items={clinic.features} />
      </section>

      <section className="wrap pt-16 lg:pt-28">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          <div className={`${clinicDarkPanel} flex flex-col gap-[18px] px-5 py-8 lg:p-12`}>
            <h2 className="eyebrow m-0 text-gold">Visit us</h2>
            <address className="font-serif text-2xl leading-[1.25] not-italic lg:text-[30px]">
              {address.street}
              <br />
              {address.locality}, {address.region} {address.postalCode}
            </address>
            <p className="m-0 text-[17px] text-on-dark-muted">
              {site.hours.display} · Closed weekends
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
              Get directions →
            </a>
          </div>
          <div className="glass-card flex flex-col gap-[18px] rounded-2xl px-5 py-8 lg:rounded-[18px] lg:p-12">
            <h2 className="eyebrow m-0 text-gold-text">Getting here</h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[17px] leading-[1.5] text-ink">
              {clinic.travel.map((t) => (
                <li key={t} className="grid grid-cols-[18px_minmax(0,1fr)] gap-3">
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
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wrap py-16 lg:py-28">
        <ClinicPhotoCta />
      </section>
    </main>
  );
}
