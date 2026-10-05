import type { Metadata } from "next";
import Link from "next/link";
import { ClinicHero } from "@/components/ClinicSections";
import { PhoneIcon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Page not found | ${site.name}` },
  robots: { index: false },
};

const links = [
  { label: "Home", href: "/" },
  { label: "Porcelain Veneers", href: "/porcelain-veneers-miami" },
  { label: "Before and after", href: "/before-and-after" },
  { label: "Free photo evaluation", href: "/free-photo-evaluation" },
  { label: "Contact", href: "/contact" },
];

export default function NotFound() {
  return (
    <main id="main">
      <PageHero>
        <ClinicHero
          trail={[{ label: "Home", href: "/" }, { label: "Page not found" }]}
          title="Page not found"
          lead="This address does not match a page on our site."
        >
          <nav aria-label="Helpful links">
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
