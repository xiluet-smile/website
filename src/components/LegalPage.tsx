import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import legal from "@/content/legal.json";
import { pageGraph } from "@/lib/schema";
import { pages, type PagePath } from "@/lib/site";

type Slug = keyof typeof legal;

/** Legal documents, copied verbatim from the previous website. */
export default function LegalPage({ slug }: { slug: Slug }) {
  const path = `/${slug}` as PagePath;
  const doc = legal[slug];
  return (
    <main id="main">
      <JsonLd data={pageGraph(path)} />
      <PageHero>
        <div className="wrap relative z-[2] pt-6 pb-12 lg:pt-10 lg:pb-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-[13px] text-on-dark-muted">
            <ol className="m-0 flex list-none gap-2 p-0">
              <li>
                <Link href="/" className="text-on-dark-muted no-underline hover:text-gold">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{pages[path].breadcrumb}</li>
            </ol>
          </nav>
          <h1 className="m-0 max-w-[16ch] font-serif text-[38px] leading-[1.1] font-normal text-pretty lg:text-[52px] lg:leading-[1.06]">{pages[path].h1}</h1>
          {doc.effective && <p className="mt-4 mb-0 text-[15px] text-on-dark-muted">Effective date: {doc.effective}</p>}
        </div>
      </PageHero>
      <section className="wrap pt-12 pb-16 lg:pt-20 lg:pb-28">
        {/* Content comes from the clinic's own published policy pages, not from this build. */}
        <article className="legal-prose max-w-[72ch]" dangerouslySetInnerHTML={{ __html: doc.html }} />
      </section>
    </main>
  );
}
