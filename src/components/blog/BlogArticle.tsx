import Link from "next/link";
import Inline from "./Inline";
import FaqAccordion from "@/components/FaqAccordion";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { doctorByName, getContent, tpl, ui } from "@/lib/content-i18n";
import { localizeHref, localizePath, type Locale } from "@/lib/i18n";
import { postBySlug, posts, type Block, type BlogPost } from "@/lib/blog";
import { article, faqPage, pageGraph } from "@/lib/schema";
import type { PagePath } from "@/lib/site";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const wordCount = (p: BlogPost) => {
  const text: string[] = [p.answer];
  for (const s of p.sections) {
    text.push(s.h2);
    for (const b of s.blocks) {
      if ("p" in b) text.push(b.p);
      else if ("h3" in b) text.push(b.h3);
      else if ("list" in b) text.push(...b.list);
      else if ("steps" in b) text.push(...b.steps);
      else if ("quote" in b) text.push(b.quote);
      else if ("table" in b) text.push(...b.table.head, ...b.table.rows.flat());
    }
  }
  return text.join(" ").split(/\s+/).filter(Boolean).length;
};

const dateFmt = (iso: string, locale: Locale) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString(locale === "es" ? "es-US" : "en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

function BlockView({ block, locale }: { block: Block; locale: Locale }) {
  if ("p" in block)
    return (
      <p className="m-0 text-[17px] leading-[1.65] text-body lg:text-lg">
        <Inline text={block.p} locale={locale} />
      </p>
    );
  if ("h3" in block) return <h3 className="m-0 mt-2 font-serif text-[22px] leading-[1.25] font-normal text-teal lg:text-2xl">{block.h3}</h3>;
  if ("list" in block)
    return (
      <ul className="m-0 flex list-disc flex-col gap-2 pl-5 text-[17px] leading-[1.6] text-body marker:text-gold-text lg:text-lg">
        {block.list.map((item, i) => (
          <li key={i}>
            <Inline text={item} locale={locale} />
          </li>
        ))}
      </ul>
    );
  if ("steps" in block)
    return (
      <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-[17px] leading-[1.6] text-body marker:font-semibold marker:text-gold-text lg:text-lg">
        {block.steps.map((item, i) => (
          <li key={i}>
            <Inline text={item} locale={locale} />
          </li>
        ))}
      </ol>
    );
  if ("quote" in block)
    return (
      <blockquote className="m-0 border-l-2 border-gold pl-5 font-serif text-[21px] leading-[1.4] text-teal lg:text-[24px]">
        <p className="m-0">
          <Inline text={block.quote} locale={locale} />
        </p>
        {block.by && <footer className="mt-2 font-sans text-[13px] font-semibold tracking-[.06em] text-gold-text uppercase">{block.by}</footer>}
      </blockquote>
    );
  if ("img" in block) return <Img src={block.img} alt={block.alt} sizes="(min-width: 1024px) 720px, 92vw" className="block aspect-[3/2] h-auto w-full rounded-2xl object-cover" />;
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[520px] border-collapse text-[15px] leading-[1.45] lg:text-base">
        <thead>
          <tr>
            {block.table.head.map((h, i) => (
              <th key={i} className="border-b-2 border-gold/60 py-2.5 pr-4 text-left font-semibold text-teal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row, r) => (
            <tr key={r} className="border-b border-ink/10 align-top">
              {row.map((cell, c) => (
                <td key={c} className={`py-2.5 pr-4 text-body ${c === 0 ? "font-semibold text-ink" : ""}`}>
                  <Inline text={cell} locale={locale} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BlogArticle({ slug, locale = "en" }: { slug: string; locale?: Locale }) {
  const post = postBySlug(locale, slug);
  if (!post) return null;
  const t = ui(locale);
  const { pages, site } = getContent(locale);
  const path = `/blog/${slug}` as PagePath;
  const author = doctorByName(locale, post.author);
  const reviewer = post.reviewedBy ? doctorByName(locale, post.reviewedBy) : undefined;
  const others = posts(locale).filter((p) => p.slug !== slug);
  const related = (post.related ?? []).map((r) => ({ href: r as PagePath, label: pages[r as PagePath]?.breadcrumb ?? r })).filter((r) => r.label);
  // "Read next": the article's own list when it has one, otherwise the three most recent other posts.
  const chosen = (post.readNext ?? []).map((r) => others.find((p) => `/blog/${p.slug}` === r)).filter((p): p is BlogPost => !!p);
  const next = (chosen.length ? chosen : others).slice(0, 3);

  return (
    <main id="main">
      <JsonLd
        data={pageGraph(
          path,
          locale,
          article(
            path,
            {
              headline: post.title,
              description: post.description,
              image: post.image,
              datePublished: post.datePublished,
              dateModified: post.dateModified,
              author: post.author,
              reviewedBy: post.reviewedBy,
              wordCount: wordCount(post),
            },
            locale,
          ),
          ...(post.faq?.length ? [faqPage(post.faq)] : []),
        )}
      />

      <PageHero locale={locale}>
        <div className="wrap relative z-[2] pt-8 pb-12 lg:pt-14 lg:pb-16">
          <div className="flex max-w-[880px] flex-col gap-5 lg:gap-[26px]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-[13px] text-on-dark-muted">
              <Link href={localizePath("/", locale)} className="text-on-dark-muted no-underline hover:text-gold">
                {t.home}
              </Link>
              <span aria-hidden="true">/</span>
              <Link href={localizePath("/blog", locale)} className="text-on-dark-muted no-underline hover:text-gold">
                {t.breadcrumb.blog}
              </Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page" className="text-gold">
                {post.breadcrumb ?? post.category}
              </span>
            </nav>
            <span className="eyebrow text-gold">{post.category}</span>
            <h1 className="m-0 font-serif text-[36px] leading-[1.1] font-normal tracking-[-.01em] text-pretty lg:text-[56px] lg:leading-[1.06]">{post.title}</h1>
            <p className="m-0 max-w-[62ch] text-[17px] leading-[1.5] text-pretty text-on-dark-muted lg:text-xl">{post.description}</p>
            <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-on-dark-muted">
              {author && <Img src={author.image} alt="" sizes="36px" className="h-9 w-9 rounded-full object-cover object-[50%_20%]" />}
              <span>
                {t.blogPage.by}{" "}
                {author ? (
                  <Link href={localizeHref(author.href, locale)} className="font-semibold text-on-dark no-underline hover:text-gold">
                    {post.author}
                  </Link>
                ) : (
                  <span className="font-semibold text-on-dark">{post.author}</span>
                )}
              </span>
              {post.reviewedBy && (
                <span>
                  <span aria-hidden="true" className="hidden lg:inline">· </span>
                  {t.blogPage.reviewedBy}{" "}
                  {reviewer ? (
                    <Link href={localizeHref(reviewer.href, locale)} className="font-semibold text-on-dark no-underline hover:text-gold">
                      {post.reviewedBy}
                    </Link>
                  ) : (
                    post.reviewedBy
                  )}
                </span>
              )}
              <span>
                <span aria-hidden="true" className="hidden lg:inline">· </span>
                {post.dateModified && post.dateModified !== post.datePublished ? t.blogPage.updated : t.blogPage.published}{" "}
                <time dateTime={post.dateModified ?? post.datePublished}>{dateFmt(post.dateModified ?? post.datePublished, locale)}</time>
              </span>
              <span>
                <span aria-hidden="true" className="hidden lg:inline">· </span>
                {tpl(t.blogPage.readTime, { n: post.readMinutes })}
              </span>
            </p>
          </div>
        </div>
      </PageHero>

      <article className="wrap pt-10 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div className="flex min-w-0 max-w-[720px] flex-col gap-8 lg:gap-10">
            {/* Direct answer, first thing after the H1, for readers and answer engines. */}
            <div className="glass-card rounded-2xl border-l-4 border-l-gold p-5 lg:p-7">
              <p className="eyebrow m-0 mb-2 text-gold-text">{t.blogPage.answerLabel}</p>
              <p className="m-0 text-[18px] leading-[1.55] text-ink lg:text-[20px]">
                <Inline text={post.answer} locale={locale} />
              </p>
            </div>

            <Img src={post.image} alt={post.imageAlt} sizes="(min-width: 1024px) 720px, 92vw" className="block aspect-[16/9] h-auto w-full rounded-2xl object-cover" />

            {post.sections.map((s) => (
              <section key={s.h2} id={slugify(s.h2)} className="flex scroll-mt-28 flex-col gap-4">
                <h2 className="m-0 font-serif text-[28px] leading-[1.2] font-normal text-teal lg:text-[34px]">{s.h2}</h2>
                {s.blocks.map((b, i) => (
                  <BlockView key={i} block={b} locale={locale} />
                ))}
              </section>
            ))}

            {post.faq && post.faq.length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="m-0 font-serif text-[28px] leading-[1.2] font-normal text-teal lg:text-[34px]">{t.blogPage.faqTitle}</h2>
                <FaqAccordion faqs={post.faq} name="article-faq" className="flex flex-col gap-3" locale={locale} />
              </section>
            )}

            {related.length > 0 && (
              <section className="flex flex-col gap-3">
                <h2 className="eyebrow m-0 text-gold-text">{t.blogPage.relatedTreatments}</h2>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {related.map((r) => (
                    <li key={r.href}>
                      <Link href={localizePath(r.href, locale)} className="inline-flex min-h-10 items-center rounded-full border border-teal/30 bg-white/60 px-4 text-[14px] font-semibold text-teal no-underline hover:bg-teal hover:text-on-dark">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-8">
            <nav aria-label={t.blogPage.contents} className="glass-card rounded-2xl p-5">
              <p className="eyebrow m-0 mb-3 text-gold-text">{t.blogPage.contents}</p>
              <ol className="m-0 flex list-none flex-col gap-2 p-0 text-[15px] leading-[1.4]">
                {post.sections.map((s) => (
                  <li key={s.h2}>
                    <a href={`#${slugify(s.h2)}`} className="text-ink no-underline hover:text-teal hover:underline">
                      {s.h2}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="dark-panel flex flex-col gap-3 rounded-2xl p-5 lg:p-6">
              <h2 className="m-0 font-serif text-[22px] leading-[1.25] font-normal">{t.blogPage.ctaTitle}</h2>
              <p className="m-0 text-[15px] leading-[1.5] text-on-dark-muted">{tpl(t.blogPage.ctaBody, { hours: site.replyHours })}</p>
              <Link href={localizePath("/free-photo-evaluation", locale)} className="btn btn-gold mt-1 h-12 text-[15px]">
                {t.blogPage.ctaButton}
              </Link>
            </div>
          </aside>
        </div>

        {next.length > 0 && (
          <section className="mt-16 lg:mt-24">
            <h2 className="m-0 mb-6 font-serif text-[28px] leading-[1.2] font-normal text-teal lg:text-[34px]">{t.blogPage.related}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {next.map((p) => (
                <PostCard key={p.slug} post={p} locale={locale} />
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}

/** Card used by the blog index and the "Read next" grid. */
export function PostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const t = ui(locale);
  return (
    <article className="glass-card flex flex-col overflow-hidden rounded-2xl text-ink lg:rounded-[18px]">
      <Link href={localizePath(`/blog/${post.slug}` as PagePath, locale)} className="no-underline">
        <Img src={post.image} alt="" sizes="(min-width: 1440px) 384px, (min-width: 1024px) 28vw, (min-width: 768px) 46vw, 92vw" className="block aspect-[16/10] h-auto w-full object-cover" />
      </Link>
      <div className="flex flex-col gap-2.5 p-5 lg:p-6">
        <span className="eyebrow text-gold-text">{post.category}</span>
        <h3 className="m-0 font-serif text-[22px] leading-[1.2] font-normal text-teal lg:text-2xl">
          <Link href={localizePath(`/blog/${post.slug}` as PagePath, locale)} className="text-teal no-underline hover:underline">
            {post.title}
          </Link>
        </h3>
        <p className="m-0 text-[15px] leading-[1.5] text-body">{post.description}</p>
        <p className="m-0 mt-1.5 text-[13px] text-muted">
          {post.author} · {tpl(t.blogPage.readTime, { n: post.readMinutes })}
        </p>
      </div>
    </article>
  );
}
