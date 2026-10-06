import Link from "next/link";
import Img from "./Img";
import LangSwitch from "./LangSwitch";
import { DesktopNav, MobileMenu } from "./NavMenu";
import { CameraIcon, PhoneIcon } from "./Icons";
import { getContent, ui } from "@/lib/content-i18n";
import { localizeHref, localizePath, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

/** Site header. Transparent; always rendered on top of a page's dark hero. */
export default function Header({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { nav } = getContent(locale);
  const menus = nav.menus.map((m) => ({
    ...m,
    href: localizeHref(m.href, locale),
    items: m.items?.map((it) => ({ ...it, href: localizeHref(it.href, locale) })),
  }));
  const evaluation = localizePath("/free-photo-evaluation", locale);
  const logo = (
    <Link href={localizePath("/", locale)} className="block" aria-label={t.header.homeAria}>
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
        <DesktopNav menus={menus} ariaLabel={t.header.mainNav} />
        <div className="flex items-center gap-5 whitespace-nowrap">
          <a href={site.phone.href} className="inline-flex items-center gap-[7px] text-[15px] font-medium text-on-dark no-underline hover:text-gold">
            <PhoneIcon />
            {site.phone.display}
          </a>
          <Link
            href={evaluation}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[rgba(247,244,238,.35)] bg-[rgba(247,244,238,.14)] pr-[18px] pl-4 text-[15px] font-semibold text-on-dark no-underline backdrop-blur-[12px] hover:bg-[rgba(247,244,238,.24)] hover:text-on-dark"
          >
            <CameraIcon />
            {t.freePhotoEvaluation}
          </Link>
          <LangSwitch locale={locale} variant="desktop" />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-16 items-center justify-between px-4 xl:hidden">
        {logo}
        <div className="flex items-center gap-2">
          <LangSwitch locale={locale} variant="mobile" />
          <MobileMenu menus={menus} labels={{ menu: t.header.menu, close: t.header.closeMenu }}>
            <div className="flex flex-col gap-3 border-t border-[rgba(247,244,238,.14)] pt-6">
              <Link
                href={evaluation}
                className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-gold text-[17px] font-semibold text-teal no-underline hover:text-teal"
              >
                <CameraIcon size={18} />
                {t.freePhotoEvaluation}
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
