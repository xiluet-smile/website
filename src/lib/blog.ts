// Blog articles: JSON in src/content/blog (EN) and src/content/es/blog (ES),
// registered by scripts/sync-blog.mjs into blog.gen.ts.
import type { Locale } from "./i18n";
import { postsEn, postsEs } from "./blog.gen";

export type Block =
  | { p: string }
  | { h3: string }
  | { list: string[] }
  | { steps: string[] }
  | { table: { head: string[]; rows: string[][] } }
  | { quote: string; by?: string };

export type BlogPost = {
  slug: string;
  esSlug: string;
  title: string;
  seoTitle?: string;
  description: string;
  breadcrumb?: string;
  category: string;
  author: string;
  reviewedBy?: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  imageAlt: string;
  readMinutes: number;
  /** Direct answer, 40–70 words, shown under the H1 and used by answer engines. */
  answer: string;
  sections: { h2: string; blocks: Block[] }[];
  faq?: { q: string; a: string }[];
  /** Internal links shown at the end, as English paths. */
  related?: string[];
  /** Treatment keys this article supports; treatment pages link back to it. */
  treatments?: string[];
};

export const posts = (locale: Locale): BlogPost[] =>
  [...(locale === "es" ? postsEs : postsEn)].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

export const postBySlug = (locale: Locale, slug: string) => posts(locale).find((p) => p.slug === slug);

export const postsForTreatment = (locale: Locale, key: string) => posts(locale).filter((p) => p.treatments?.includes(key));
