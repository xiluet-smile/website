"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { ChevronDown } from "./Icons";

type Item = { t: string; d: string; href: string };
type Menu = { key: string; label: string; href: string; items?: Item[] };

/**
 * Desktop nav. Panels are always in the HTML and open with CSS on hover or
 * focus-within, so the menu works without JS; the script adds aria-expanded,
 * Esc to close and arrow-key movement.
 */
export function DesktopNav({ menus }: { menus: Menu[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<string | null>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, key: string) => {
    const root = e.currentTarget;
    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>("a"));
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape") {
      setDismissed(key);
      links[0]?.focus();
    } else if (e.key === "ArrowDown" && links.length > 1) {
      e.preventDefault();
      setDismissed(null);
      links[Math.min(i + 1, links.length - 1)].focus();
    } else if (e.key === "ArrowUp" && i > 0) {
      e.preventDefault();
      links[i - 1].focus();
    }
  };

  return (
    <nav aria-label="Main" className="flex h-[88px] items-center justify-center gap-1 px-6 text-[15px] font-medium whitespace-nowrap">
      {menus.map((m) => {
        const isOpen = open === m.key && dismissed !== m.key;
        return (
          <div
            key={m.key}
            className="nav-item relative flex h-[88px] items-center"
            data-dismissed={dismissed === m.key || undefined}
            onMouseEnter={() => setOpen(m.key)}
            onMouseLeave={() => {
              setOpen((o) => (o === m.key ? null : o));
              setDismissed(null);
            }}
            onFocus={() => setOpen(m.key)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setOpen((o) => (o === m.key ? null : o));
                setDismissed(null);
              }
            }}
            onKeyDown={(e) => onKeyDown(e, m.key)}
          >
            <Link
              href={m.href}
              className="nav-trigger inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-on-dark no-underline transition-colors duration-150 hover:text-gold"
              {...(m.items ? { "aria-haspopup": true, "aria-expanded": isOpen } : {})}
            >
              {m.label}
              {m.items && <ChevronDown className="mt-px" />}
            </Link>
            {m.items && (
              <div className="nav-panel absolute top-[72px] left-0 z-20 flex min-w-[320px] flex-col gap-0.5 rounded-[18px] border border-[rgba(247,244,238,.16)] bg-[rgba(6,40,46,.9)] p-2.5 shadow-[inset_0_1px_0_rgba(247,244,238,.12),0_30px_60px_rgba(4,40,46,.45)] backdrop-blur-[24px] backdrop-saturate-[1.3]">
                {m.items.map((it) => (
                  <Link
                    key={it.href + it.t}
                    href={it.href}
                    className="flex flex-col gap-0.5 rounded-xl px-3.5 py-3 text-on-dark no-underline transition-colors duration-150 hover:bg-[rgba(247,244,238,.1)] hover:text-on-dark focus-visible:bg-[rgba(247,244,238,.1)]"
                  >
                    <span className="text-[15px] font-semibold">{it.t}</span>
                    <span className="text-[13px] font-normal whitespace-normal text-on-dark-muted">{it.d}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/**
 * Mobile menu. Without JS the button is a plain link to the footer navigation;
 * with JS it opens a modal <dialog> (native focus trap and Esc).
 */
export function MobileMenu({ menus, children }: { menus: Menu[]; children?: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  // False during SSR and hydration, true once scripts run.
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const close = () => ref.current?.close();

  return (
    <>
      <a
        href="#footer-nav"
        role={ready ? "button" : undefined}
        aria-label="Menu"
        aria-haspopup={ready ? "dialog" : undefined}
        onClick={(e) => {
          e.preventDefault();
          ref.current?.showModal();
        }}
        className="grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-[rgba(247,244,238,.5)] bg-[rgba(247,244,238,.12)] backdrop-blur-[10px]"
      >
        <span className="block h-0.5 w-[18px] bg-on-dark shadow-[0_-6px_0_#F7F4EE,0_6px_0_#F7F4EE]" />
      </a>
      <dialog
        ref={ref}
        aria-label="Menu"
        onClick={(e) => {
          // Close after following a link, or when the backdrop is tapped.
          if ((e.target as HTMLElement).closest("a") || e.target === ref.current) close();
        }}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-[rgba(4,40,46,.97)] p-0 text-on-dark backdrop:bg-transparent"
      >
        <div className="flex h-16 items-center justify-between px-4">
          <span className="font-serif text-[22px]">Menu</span>
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border-[1.5px] border-[rgba(247,244,238,.5)] bg-[rgba(247,244,238,.12)] text-[22px] leading-none"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-6 px-5 pt-2 pb-10">
          {menus.map((m) => (
            <div key={m.key} className="flex flex-col gap-1">
              <Link href={m.href} className="eyebrow py-2 text-gold no-underline hover:text-gold">
                {m.label}
              </Link>
              {m.items?.map((it) => (
                <Link key={it.href + it.t} href={it.href} className="flex min-h-11 items-center text-[17px] text-on-dark no-underline hover:text-gold">
                  {it.t}
                </Link>
              ))}
            </div>
          ))}
          {children}
        </div>
      </dialog>
    </>
  );
}
