import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";

/** Renders a string with [text](href) links and **bold** spans; nothing else is interpreted. */
export default function Inline({ text, locale }: { text: string; locale: Locale }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const href = link[2];
          return /^https?:/.test(href) ? (
            <a key={i} href={href} rel="noopener">
              {link[1]}
            </a>
          ) : (
            <Link key={i} href={localizeHref(href, locale)}>
              {link[1]}
            </Link>
          );
        }
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
