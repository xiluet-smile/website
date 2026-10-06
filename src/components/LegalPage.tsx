import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { getContent, tpl, ui } from "@/lib/content-i18n";
import { localizePath, type Locale } from "@/lib/i18n";
import { pageGraph } from "@/lib/schema";
import type { PagePath } from "@/lib/site";

type Slug = "privacy-policy" | "terms" | "notice-of-privacy-practices" | "refund-and-cancellation";

/**
 * Legal documents, copied verbatim from the previous website. They are not
 * translated: /es shows the English document under a short Spanish note.
 */
export default function LegalPage({ slug, locale = "en" }: { slug: Slug; locale?: Locale }) {
  const t = ui(locale);
  const { pages, legal, legalNotice } = getContent(locale);
  const path = `/${slug}` as PagePath;
  const doc = legal[slug];
  return (
    <main id="main">
      <JsonLd data={pageGraph(path, locale)} />
      <PageHero locale={locale}>
        <div className="wrap relative z-[2] pt-6 pb-12 lg:pt-10 lg:pb-16">
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
          <h1 className="m-0 max-w-[16ch] font-serif text-[38px] leading-[1.1] font-normal text-pretty lg:text-[52px] lg:leading-[1.06]">{pages[path].h1}</h1>
          {doc.effective && <p className="mt-4 mb-0 text-[15px] text-on-dark-muted">{tpl(t.legal.effective, { date: doc.effective })}</p>}
        </div>
      </PageHero>
      <section className="wrap pt-12 pb-16 lg:pt-20 lg:pb-28">
        {legalNotice && (
          <p lang="es-US" className="glass-card m-0 mb-8 max-w-[72ch] rounded-2xl px-5 py-4 text-[15px] leading-[1.5] text-body">
            {legalNotice.notice}
          </p>
        )}
        {/* Content comes from the clinic's own published policy pages, not from this build. */}
        <article lang={locale === "es" ? "en-US" : undefined} className="legal-prose max-w-[72ch]" dangerouslySetInnerHTML={{ __html: doc.html }} />
      </section>
    </main>
  );
}
