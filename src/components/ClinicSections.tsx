// Shared building blocks for the Clinic, Out of State and 404 pages.
import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

const facts: Record<string, string> = {
  replyHours: String(site.replyHours),
  depositUsd: String(site.depositUsd),
  warrantyYears: String(site.warrantyYears),
};

/** Fills {replyHours}, {depositUsd} and {warrantyYears} in content JSON strings from site.json. */
export const fillFacts = (s: string) => s.replace(/\{(\w+)\}/g, (m, k: string) => facts[k] ?? m);

export type Crumb = { label: string; href?: string };

export function ClinicBreadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="m-0 flex list-none flex-wrap gap-2 p-0 text-[13px] text-on-dark-muted">
        {trail.map((c, i) => (
          <li key={c.label} className="flex gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.href ? (
              <Link href={c.href} className="text-on-dark-muted no-underline hover:text-gold">
                {c.label}
              </Link>
            ) : i === trail.length - 1 ? (
              <span aria-current="page" className="text-gold">
                {c.label}
              </span>
            ) : (
              <span>{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Hero body: breadcrumb, H1 and lead on the left, framed 4:3 media on the right. */
export function ClinicHero({
  trail,
  title,
  lead,
  media,
  children,
}: {
  trail: Crumb[];
  title: string;
  lead: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      className={`wrap relative z-[2] grid items-center gap-8 pt-8 pb-12 lg:gap-14 lg:pt-14 lg:pb-20 ${
        media ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]" : ""
      }`}
    >
      <div className="flex flex-col gap-5 lg:gap-[26px]">
        <ClinicBreadcrumb trail={trail} />
        <h1 className="m-0 font-serif text-[38px] leading-[1.1] font-normal tracking-[-.01em] text-pretty lg:text-[60px] lg:leading-[1.04]">
          {title}
        </h1>
        <p className="m-0 max-w-[58ch] text-[17px] leading-[1.5] text-pretty text-on-dark-muted lg:text-xl">{lead}</p>
        {children}
      </div>
      {media && (
        <div className="relative overflow-hidden rounded-2xl border border-[rgba(247,244,238,.14)] shadow-[0_30px_80px_rgba(0,0,0,.35)] lg:rounded-3xl">
          {media}
        </div>
      )}
    </div>
  );
}

export function ClinicSectionHead({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-3 lg:mb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal lg:max-w-[18ch] lg:text-5xl lg:leading-[1.1]">
        {title}
      </h2>
      {aside && (
        <p className="m-0 text-[17px] leading-[1.5] text-pretty text-body lg:mb-2 lg:max-w-[420px] lg:text-right">
          {aside}
        </p>
      )}
    </div>
  );
}

/** Three-column grid of glass cards (title + description). */
export function ClinicFeatureGrid({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 lg:grid-cols-3 lg:gap-4">
      {items.map((f) => (
        <li key={f.t} className="glass-card flex flex-col gap-2.5 rounded-2xl p-5 lg:min-h-[150px] lg:rounded-[18px] lg:p-6">
          <h3 className="m-0 font-serif text-xl leading-[1.2] font-normal text-teal lg:text-[22px]">{f.t}</h3>
          <p className="m-0 text-[15px] leading-[1.5] text-body">{f.d}</p>
        </li>
      ))}
    </ul>
  );
}

export const clinicDarkPanel =
  "dark-panel rounded-2xl shadow-[0_1px_0_rgba(247,244,238,.18)_inset,0_30px_80px_rgba(4,40,46,.32)] lg:rounded-[20px]";

/** Closing call to action: free photo evaluation. */
export function ClinicPhotoCta() {
  return (
    <div className={`${clinicDarkPanel} grid items-center gap-8 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-16 lg:p-16`}>
      <div className="flex flex-col gap-4 lg:gap-5">
        <h2 className="m-0 font-serif text-[34px] leading-[1.2] font-normal text-pretty lg:text-[52px] lg:leading-[1.08]">
          Start with photos. A doctor replies within {site.replyHours} hours.
        </h2>
        <p className="m-0 text-[17px] text-on-dark-muted lg:text-[19px]">
          Free, no visit needed. Written estimate included.
        </p>
      </div>
      <div className="flex flex-col gap-3 rounded-[14px] border border-[rgba(255,255,255,.8)] bg-[rgba(247,244,238,.9)] p-5 text-ink lg:rounded-2xl lg:p-8">
        <h3 className="m-0 font-serif text-[22px] leading-[1.55] font-normal lg:text-2xl">Free photo evaluation</h3>
        <p className="m-0 text-[15px] text-body">Photos of your smile, from your phone. Takes 2 minutes.</p>
        <Link href="/free-photo-evaluation" className="btn btn-teal h-[52px] w-full px-[26px] text-[17px] lg:w-auto lg:self-start">
          Start my evaluation
        </Link>
      </div>
    </div>
  );
}
