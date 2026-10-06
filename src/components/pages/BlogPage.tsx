import CostHero from "@/components/CostHero";
import CostPhotoCta from "@/components/CostPhotoCta";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import { getContent, ui } from "@/lib/content-i18n";
import type { Locale } from "@/lib/i18n";
import { pageGraph } from "@/lib/schema";

const PATH = "/blog" as const;

export default function BlogPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages, blog } = getContent(locale);
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, locale)} />
      <CostHero locale={locale} crumbs={[t.breadcrumb.blog]} title={pages[PATH].h1} lead={t.blogPage.lead} />

      <section className="wrap pt-12 lg:pt-20">
        <h2 className="sr-only">{t.blogPage.articles}</h2>
        {/* TODO(clinic): the six articles are drafts with no article pages yet, so the cards are not links. Link each card once its page exists. */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blog.map((p) => (
            <article key={p.title} className="glass-card flex flex-col overflow-hidden rounded-2xl text-ink lg:rounded-[18px]">
              <Img
                src={p.image}
                alt=""
                sizes="(min-width: 1440px) 384px, (min-width: 1024px) 28vw, (min-width: 768px) 46vw, 92vw"
                className="block aspect-[16/10] h-auto w-full object-cover"
              />
              <div className="flex flex-col gap-2.5 p-5 lg:p-6">
                <span className="eyebrow text-gold-text">{p.category}</span>
                <h3 className="m-0 font-serif text-[22px] leading-[1.2] font-normal text-teal lg:text-2xl">{p.title}</h3>
                <p className="m-0 text-[15px] leading-[1.5] text-body">{p.excerpt}</p>
                <p className="m-0 mt-1.5 text-[13px] text-muted">{p.meta}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 mb-0 text-sm text-muted">{t.blogPage.drafts}</p>
      </section>

      <CostPhotoCta locale={locale} />
    </main>
  );
}
