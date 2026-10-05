import Link from "next/link";
import Img from "./Img";
import { doctorByName, type Faq } from "@/lib/content";

/**
 * FAQ accordion. Native <details name> gives one-open-at-a-time with no JS and
 * keeps every answer in the HTML for crawlers. The same `faqs` array must be
 * passed to faqPage() for the page's JSON-LD.
 */
export default function FaqAccordion({
  faqs,
  name = "faq",
  className = "grid items-start gap-3 lg:grid-cols-2",
  variant = "page",
}: {
  faqs: Faq[];
  name?: string;
  className?: string;
  /** "home": 21px questions with doctor avatar (Home design). "page": 22px questions with a gold byline (all other pages). */
  variant?: "home" | "page";
}) {
  const page = variant === "page";
  return (
    <div className={className}>
      {faqs.map((f, i) => {
        const doc = f.doc ? doctorByName(f.doc) : undefined;
        return (
          <details key={f.q} name={name} open={i === 0} className="faq-item glass-card rounded-2xl">
            <summary
              className={`flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-[18px] [&::-webkit-details-marker]:hidden ${page ? "lg:px-[26px] lg:py-[22px]" : "lg:px-6 lg:py-5"}`}
            >
              <h3 className={`m-0 font-serif text-[19px] leading-[1.25] font-normal ${page ? "lg:text-[22px]" : "lg:text-[21px]"}`}>{f.q}</h3>
              <span
                aria-hidden="true"
                className={`faq-plus grid flex-none place-items-center rounded-full border-[1.5px] border-teal text-lg text-teal ${page ? "h-8 w-8" : "h-[30px] w-[30px]"}`}
              >
                +
              </span>
            </summary>
            <div className={`flex flex-col px-5 pb-[18px] ${page ? "gap-2 lg:px-[26px] lg:pb-[22px]" : "gap-3 lg:px-6 lg:pb-5"}`}>
              <p className={`m-0 text-base leading-[1.55] text-body ${page ? "lg:text-[17px]" : ""}`}>{f.a}</p>
              {f.doc && (
                <p className={`m-0 flex items-center gap-2.5 ${page ? "text-[13px] font-semibold text-gold-text" : "text-sm text-muted"}`}>
                  {doc && !page && (
                    <Img src={doc.image} alt="" sizes="28px" className="h-7 w-7 rounded-full object-cover object-[50%_20%]" />
                  )}
                  {doc ? (
                    <Link href={doc.href} className={`no-underline ${page ? "text-gold-text hover:text-teal" : "text-muted hover:text-gold-text"}`}>
                      {f.doc}
                    </Link>
                  ) : (
                    f.doc
                  )}
                </p>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
