import Img from "./Img";
import { caseTypeLabel, casesFor, ui, type Case } from "@/lib/ui-i18n";
import type { Locale } from "@/lib/i18n";

/** Before/after photo with labels and the required patient disclaimer. */
export default function CaseCard({
  c,
  sizes = "(min-width: 1024px) 33vw, 85vw",
  className = "",
  priority,
  locale = "en",
  ...rest
}: { c: Case; sizes?: string; className?: string; priority?: boolean; locale?: Locale } & React.HTMLAttributes<HTMLElement>) {
  const t = ui(locale);
  return (
    <figure className={`m-0 flex flex-col gap-2.5 ${className}`} {...rest}>
      <div className="relative aspect-[13/16] overflow-hidden rounded-xl bg-teal">
        <Img src={c.image} alt={c.alt} sizes={sizes} priority={priority} className="block h-full w-full object-cover" />
        <div className="pointer-events-none absolute top-3.5 right-3.5 left-3.5 flex justify-between text-[11px] font-semibold tracking-[.12em] text-on-dark uppercase [text-shadow:0_1px_6px_rgba(0,0,0,.6)]">
          <span>{t.before}</span>
          <span>{t.after}</span>
        </div>
      </div>
      <figcaption className="flex justify-between gap-3 text-sm text-muted">
        <span>{caseTypeLabel(locale, c.type)}</span>
        <span className="text-right">{casesFor(locale).disclaimer}</span>
      </figcaption>
    </figure>
  );
}
