import Link from "next/link";
import Img from "./Img";
import { DesktopNav, MobileMenu } from "./NavMenu";
import { CameraIcon, FlagES, FlagUS, PhoneIcon } from "./Icons";
import { nav, site } from "@/lib/site";

/** Site header. Transparent; always rendered on top of a page's dark hero. */
export default function Header() {
  const logo = (
    <Link href="/" className="block" aria-label="Xiluet Smiles, home">
      <Img
        src={site.logo}
        alt="Xiluet Smiles"
        sizes="170px"
        priority
        className="block h-12 w-[108px] object-contain xl:h-[52px] xl:w-[116px]"
      />
    </Link>
  );

  return (
    <header className="relative z-[5]">
      {/* Desktop */}
      <div className="header-gutter mx-auto hidden h-[88px] max-w-[1440px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-8 xl:grid">
        {logo}
        <DesktopNav menus={nav.menus} />
        <div className="flex items-center gap-5 whitespace-nowrap">
          <div className="flex gap-1 border-l border-[rgba(247,244,238,.18)] pl-5 text-sm font-semibold">
            <span className="inline-flex items-center gap-1.5 px-1.5 py-1 text-gold" aria-current="true">
              <FlagUS />
              EN
            </span>
            <span className="text-[#8F9A97]" aria-hidden="true">
              |
            </span>
            {/* TODO(clinic): Spanish site is phase 2; link target pending. */}
            <a href="#" lang="es" aria-label="Español" className="inline-flex items-center gap-1.5 px-1.5 py-1 text-on-dark no-underline hover:text-gold">
              <FlagES />
              ES
            </a>
          </div>
          <a href={site.phone.href} className="inline-flex items-center gap-[7px] text-[15px] font-medium text-on-dark no-underline hover:text-gold">
            <PhoneIcon />
            {site.phone.display}
          </a>
          <Link
            href="/free-photo-evaluation"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[rgba(247,244,238,.35)] bg-[rgba(247,244,238,.14)] pr-[18px] pl-4 text-[15px] font-semibold text-on-dark no-underline backdrop-blur-[12px] hover:bg-[rgba(247,244,238,.24)] hover:text-on-dark"
          >
            <CameraIcon />
            Free photo evaluation
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-16 items-center justify-between px-4 xl:hidden">
        {logo}
        <div className="flex items-center gap-2">
          <div className="flex h-11 items-center gap-1.5 px-2 text-[15px] font-semibold text-on-dark">
            <FlagUS className="h-[11px] w-4" />
            <span className="text-gold">EN</span>
            <span className="px-0.5 text-[#8F9A97]" aria-hidden="true">
              |
            </span>
            <a href="#" lang="es" aria-label="Español" className="inline-flex h-11 items-center gap-1.5 text-on-dark no-underline">
              <FlagES className="h-[11px] w-4" />
              ES
            </a>
          </div>
          <MobileMenu menus={nav.menus}>
            <div className="flex flex-col gap-3 border-t border-[rgba(247,244,238,.14)] pt-6">
              <Link
                href="/free-photo-evaluation"
                className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-gold text-[17px] font-semibold text-teal no-underline hover:text-teal"
              >
                <CameraIcon size={18} />
                Free photo evaluation
              </Link>
              <a
                href={site.phone.href}
                className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full border-[1.5px] border-[rgba(247,244,238,.5)] text-[17px] font-semibold text-on-dark no-underline"
              >
                <PhoneIcon size={17} />
                {site.phone.display}
              </a>
            </div>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
}
