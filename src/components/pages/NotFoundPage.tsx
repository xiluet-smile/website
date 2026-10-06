import Link from "next/link";
import { ClinicHero } from "@/components/ClinicSections";
import { PhoneIcon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { ui } from "@/lib/content-i18n";
import { localizePath, type Locale } from "@/lib/i18n";
import { site, type PagePath } from "@/lib/site";

const LINKS: PagePath[] = ["/", "/porcelain-veneers-miami", "/before-and-after", "/free-photo-evaluation", "/contact"];

export default function NotFoundPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const links = LINKS.map((href, i) => ({ label: t.notFound.links[i], href: localizePath(href, locale) }));
  return (
    <main id="main">
      <PageHero locale={locale}>
        <ClinicHero
          trail={[{ label: t.home, href: localizePath("/", locale) }, { label: t.notFound.title }]}
          title={t.notFound.title}
          lead={t.notFound.lead}
        >
          <nav aria-label={t.notFound.linksAria}>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 lg:flex-row lg:flex-wrap">
              {links.map((l, i) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`btn ${i === 0 ? "btn-gold" : "btn-ghost"} h-[52px] w-full px-6 text-[17px] lg:h-12 lg:w-auto lg:text-base`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="m-0 text-[17px] text-on-dark-muted">
            <a
              href={site.phone.href}
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-on-dark no-underline hover:text-gold"
            >
              <PhoneIcon />
              {site.phone.display}
            </a>
          </p>
        </ClinicHero>
      </PageHero>
    </main>
  );
}
