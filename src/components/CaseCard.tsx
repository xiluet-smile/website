import Img from "./Img";
import { caseDisclaimer, type Case } from "@/lib/content";

/** Before/after photo with labels and the required patient disclaimer. */
export default function CaseCard({
  c,
  sizes = "(min-width: 1024px) 33vw, 85vw",
  className = "",
  ...rest
}: { c: Case; sizes?: string; className?: string } & React.HTMLAttributes<HTMLElement>) {
  return (
    <figure className={`m-0 flex flex-col gap-2.5 ${className}`} {...rest}>
      <div className="relative aspect-[13/16] overflow-hidden rounded-xl bg-teal">
        <Img src={c.image} alt={c.alt} sizes={sizes} className="block h-full w-full object-cover" />
        <div className="pointer-events-none absolute top-3.5 right-3.5 left-3.5 flex justify-between text-[11px] font-semibold tracking-[.12em] text-on-dark uppercase [text-shadow:0_1px_6px_rgba(0,0,0,.6)]">
          <span>Before</span>
          <span>After</span>
        </div>
      </div>
      <figcaption className="flex justify-between gap-3 text-sm text-muted">
        <span>{c.type}</span>
        <span className="text-right">{caseDisclaimer}</span>
      </figcaption>
    </figure>
  );
}
