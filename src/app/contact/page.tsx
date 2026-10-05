import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import content from "@/content/contact.json";
import faqData from "@/content/faq/contact.json";
import type { Faq } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { contactPage, faqPage, pageGraph } from "@/lib/schema";
import { pages, site } from "@/lib/site";

const PATH = "/contact" as const;
export const metadata = pageMetadata(PATH);

const faqs: Faq[] = faqData.map((f) => ({ ...f, a: f.a.replace("{replyHours}", String(site.replyHours)) }));

const { street, locality, region, postalCode } = site.address;
const address = `${street}, ${locality}, ${region} ${postalCode}`;

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const };

function Row({ icon, size = 20, children }: { icon: React.ReactNode; size?: number; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[40px_minmax(0,1fr)] items-center gap-3.5">
      <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/50 bg-gold/[.12] text-gold-text">
        <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true">
          {icon}
        </svg>
      </span>
      {children}
    </li>
  );
}

const rowLink = "inline-flex min-h-11 items-center font-medium break-words text-ink no-underline hover:text-gold-text lg:min-h-0";

export default function Page() {
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, contactPage(PATH, content.schemaName), faqPage(faqs))} />
      <PageHero>
        <div className="wrap relative z-[2] pt-6 pb-24 lg:pt-9 lg:pb-40">
          <div className="flex max-w-[660px] flex-col gap-3.5">
            <nav aria-label="Breadcrumb" className="flex gap-2 text-[13px] text-on-dark-muted">
              <Link href="/" className="text-on-dark-muted no-underline hover:text-gold">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-gold">
                {pages[PATH].breadcrumb}
              </span>
            </nav>
            <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] text-pretty lg:text-[56px] lg:leading-[1.04]">
              Contact Us <span className="text-on-dark-muted">· Cosmetic Dentist in Miami, FL</span>
            </h1>
            <p className="m-0 max-w-[62ch] text-[17px] leading-[1.55] text-pretty text-on-dark-muted lg:text-lg">
              {site.name} is a cosmetic dentistry practice at {address}, open Monday to Friday 9 AM to 5 PM. Call or WhatsApp{" "}
              {site.phone.display}, email {site.email}, or use the form. We reply within a few hours in{" "}
              {site.languages.display.replace(" and ", " or ")}.
            </p>
          </div>
        </div>
      </PageHero>

      {/* contact card */}
      <section className="wrap relative z-20 -mt-16 pb-16 lg:-mt-[110px] lg:pb-28">
        <div className="grid items-start gap-12 rounded-[16px] border border-white/90 bg-card px-5 py-8 shadow-[0_1px_0_rgba(255,255,255,.8)_inset,0_30px_80px_rgba(4,40,46,.22)] lg:grid-cols-2 lg:gap-[72px] lg:rounded-[28px] lg:p-14">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-3">
              <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal text-ink lg:text-[40px] lg:leading-[1.1]">
                Contact information
              </h2>
              <p className="m-0 max-w-[46ch] text-[17px] leading-[1.55] text-body">
                Call, text, WhatsApp or email. {site.languages.display}. Outside office hours, leave a message and we reply the
                next business morning.
              </p>
            </div>
            <ul className="m-0 flex list-none flex-col gap-[18px] p-0 text-[17px] text-ink">
              <Row
                size={18}
                icon={
                  <path
                    d="M6.5 3.5l2 3-1.6 1.6a9 9 0 005 5l1.6-1.6 3 2-1 2.3a1.5 1.5 0 01-1.6.9C8.6 15.9 4.1 11.4 3.3 6.1a1.5 1.5 0 01.9-1.6l2.3-1z"
                    {...stroke}
                  />
                }
              >
                <a href={site.phone.href} className={rowLink}>
                  {site.phone.display}
                </a>
              </Row>
              <Row
                icon={
                  <>
                    <path d="M10 2.5a7.5 7.5 0 00-6.4 11.3L2.5 17.5l3.8-1A7.5 7.5 0 1010 2.5z" {...stroke} />
                    <path
                      d="M7.7 7.2c0 2.5 2.1 4.6 4.6 4.6l.8-1.2-1.5-.8-.8.8a3.8 3.8 0 01-1.9-1.9l.8-.8-.8-1.5-1.2.8z"
                      fill="currentColor"
                    />
                  </>
                }
              >
                <a href={site.whatsapp} rel="noopener" className={rowLink}>
                  WhatsApp +1 {site.phone.display}
                </a>
              </Row>
              <Row size={18} icon={<path d="M3 5.5h14v9H3zM3 5.5l7 5.5 7-5.5" {...stroke} />}>
                <a href={`mailto:${site.email}`} className={rowLink}>
                  {site.email}
                </a>
              </Row>
              <Row
                icon={
                  <>
                    <path d="M10 18s5.5-5.2 5.5-9.5a5.5 5.5 0 10-11 0C4.5 12.8 10 18 10 18z" {...stroke} />
                    <circle cx="10" cy="8.5" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  </>
                }
              >
                <address className="font-medium not-italic">
                  {address}
                  <span className="block text-sm font-normal text-muted">{content.addressNote}</span>
                </address>
              </Row>
              <Row
                icon={
                  <>
                    <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M10 6v4l2.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </>
                }
              >
                <span className="font-medium">{content.hours}</span>
              </Row>
            </ul>
            <a
              href={site.maps.place}
              rel="noopener"
              className="relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-sand bg-[#E9E3D6] no-underline"
            >
              <iframe
                title={`Map to ${site.name}`}
                src={site.maps.embed}
                loading="lazy"
                tabIndex={-1}
                referrerPolicy="no-referrer-when-downgrade"
                className="pointer-events-none absolute inset-0 h-full w-full border-0"
              />
              <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-sand bg-card/95 px-3 py-[7px] text-[13px] font-semibold whitespace-nowrap text-teal">
                View larger map →
              </span>
            </a>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* contact faq */}
      <section className="wrap pb-16 lg:pb-28">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] lg:gap-16">
          <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:text-[40px] lg:leading-[1.1]">Before you call</h2>
          <dl className="m-0 grid gap-4 sm:grid-cols-2">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="flex flex-col gap-2 rounded-[16px] border border-white/70 bg-card/55 px-6 py-[22px] shadow-[0_1px_0_rgba(255,255,255,.6)_inset,0_12px_32px_rgba(26,26,26,.06)]"
              >
                <dt className="font-serif text-[20px] leading-[1.25] text-teal lg:text-[21px]">{f.q}</dt>
                <dd className="m-0 text-[15px] leading-[1.5] text-body">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </main>
  );
}
