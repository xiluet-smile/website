import { PostCard } from "@/components/blog/BlogArticle";
import CostHero from "@/components/CostHero";
import CostPhotoCta from "@/components/CostPhotoCta";
import JsonLd from "@/components/JsonLd";
import { posts } from "@/lib/blog";
import { getContent, ui } from "@/lib/content-i18n";
import type { Locale } from "@/lib/i18n";
import { pageGraph } from "@/lib/schema";

const PATH = "/blog" as const;

export default function BlogPage({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { pages } = getContent(locale);
  return (
    <main id="main">
      <JsonLd data={pageGraph(PATH, locale)} />
      <CostHero locale={locale} crumbs={[t.breadcrumb.blog]} title={pages[PATH].h1} lead={t.blogPage.lead} />

      <section className="wrap pt-12 pb-4 lg:pt-20">
        <h2 className="sr-only">{t.blogPage.articles}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts(locale).map((p) => (
            <PostCard key={p.slug} post={p} locale={locale} />
          ))}
        </div>
      </section>

      <CostPhotoCta locale={locale} />
    </main>
  );
}
