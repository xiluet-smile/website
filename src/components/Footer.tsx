import Link from "next/link";
import Img from "./Img";
import { FacebookIcon, InstagramIcon, PhoneIcon, TikTokIcon, WhatsAppIcon, YouTubeIcon } from "./Icons";
import { getContent, tpl, ui } from "@/lib/content-i18n";
import { localizeHref, type Locale } from "@/lib/i18n";
import { isExternal, resolveHref } from "@/lib/site";

const linkCls = "text-on-dark no-underline hover:text-gold";
// Footer column links get a little vertical padding on mobile for a comfortable tap target.
const navLinkCls = `${linkCls} max-lg:py-0.5`;

export default function Footer({ locale = "en" }: { locale?: Locale }) {
  const t = ui(locale);
  const { site, nav } = getContent(locale);
  const socials = [
    { label: "Instagram", href: site.social.instagram, Icon: InstagramIcon },
    { label: "TikTok", href: site.social.tiktok, Icon: TikTokIcon },
    { label: "Facebook", href: site.social.facebook, Icon: FacebookIcon },
    { label: "YouTube", href: site.social.youtube, Icon: YouTubeIcon },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-[rgba(247,244,238,.14)] bg-teal text-[15px] leading-normal text-on-dark">
      <Img
        src="footer-skyline-flat.jpg"
        alt=""
        sizes="100vw"
        className="absolute inset-x-0 bottom-0 h-[40%] w-full object-cover object-[50%_100%] opacity-50 lg:h-[62%] lg:opacity-55"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,#04282E_0%,rgba(4,40,46,.96)_55%,rgba(4,40,46,.7)_80%,rgba(4,30,36,.92)_100%)] lg:bg-[linear-gradient(180deg,#04282E_0%,rgba(4,40,46,.96)_38%,rgba(4,40,46,.72)_62%,rgba(4,40,46,.55)_85%,rgba(4,30,36,.9)_100%)]"
      />
      <div className="wrap relative flex flex-col gap-7 pt-10 pb-10 lg:gap-12 lg:pt-16">
        {/* CTA band */}
        <div className="flex flex-col gap-3 border-b border-[rgba(247,244,238,.12)] pb-6 lg:grid lg:grid-cols-[1.4fr_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pb-10">
          <div className="flex flex-col gap-3">
            <span className="font-serif text-[26px] leading-[1.15] text-pretty lg:text-[34px]">
              {tpl(t.footer.heading, { hours: site.replyHours })}
            </span>
            <span className="hidden text-base text-on-dark-muted lg:block">
              {t.footer.body}
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5 lg:justify-end lg:gap-3">
            <a
              href={site.whatsapp}
              rel="noopener"
              className="inline-flex h-[46px] items-center gap-2 rounded-full bg-gold pr-[18px] pl-4 text-[15px] font-semibold text-teal no-underline hover:text-teal lg:h-[50px] lg:gap-[9px] lg:pr-[22px] lg:pl-[18px] lg:text-base"
            >
              <WhatsAppIcon size={18} />
              {t.bookConsultation}
            </a>
            <a
              href={site.phone.href}
              className="inline-flex h-[46px] items-center gap-2 rounded-full border-[1.5px] border-[rgba(247,244,238,.4)] pr-[18px] pl-4 text-[15px] font-semibold whitespace-nowrap text-on-dark no-underline hover:text-gold lg:h-[50px] lg:gap-[9px] lg:pr-[22px] lg:pl-[18px] lg:text-base"
            >
              <PhoneIcon size={17} />
              {site.phone.display}
            </a>
          </div>
        </div>

        {/* Brand + link columns */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:gap-10">
          <div className="order-last col-span-2 flex flex-col gap-3.5 border-t border-[rgba(247,244,238,.12)] pt-6 lg:order-none lg:col-span-1 lg:gap-[18px] lg:border-0 lg:pt-0">
            <Img
              src={site.logo}
              alt="Xiluet Smiles"
              sizes="170px"
              className="block h-[67px] w-[150px] object-contain lg:h-[76px] lg:w-[170px]"
            />
            <address className="flex flex-col gap-0.5 text-sm text-on-dark-muted not-italic lg:text-[15px]">
              <span>{site.address.street}</span>
              <span>
                {site.address.locality}, {site.address.region} {site.address.postalCode}
              </span>
              <a href={site.phone.href} className={`mt-1.5 py-1 lg:py-0 ${linkCls}`}>
                {site.phone.display}
              </a>
              <a href={`mailto:${site.email}`} className={`py-1 lg:py-0 ${linkCls}`}>
                {site.email}
              </a>
              <span>{site.hours.display}</span>
              <span>{site.languages.display}</span>
            </address>
            <div className="flex gap-2.5">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  rel="noopener"
                  className="grid h-11 w-11 place-items-center rounded-full border border-[rgba(247,244,238,.25)] text-on-dark no-underline hover:border-gold hover:text-gold lg:h-9 lg:w-9"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          <nav id="footer-nav" aria-label={t.footer.nav} className="contents">
            {nav.footer.map((col) => (
              <div key={col.title} className="flex flex-col gap-2">
                <div className="mb-1 text-xs font-semibold tracking-[.12em] text-gold uppercase lg:mb-2">{col.title}</div>
                {col.links.map((l) => {
                  const href = resolveHref(l.href);
                  return isExternal(href) ? (
                    <a key={l.label} href={href} rel="noopener" className={navLinkCls}>
                      {l.label}
                    </a>
                  ) : (
                    <Link key={l.label} href={localizeHref(href, locale)} className={navLinkCls}>
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Legal */}
        <div className="flex flex-col-reverse gap-2 text-xs text-on-dark-muted lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-4 lg:border-t lg:border-[rgba(247,244,238,.12)] lg:pt-[22px] lg:text-[13px]">
          <span>
            © {site.copyrightYear} {site.name} · Miami, FL · {t.footer.legal}
          </span>
                    <div className="flex flex-wrap gap-3.5 lg:gap-[18px]">
            {nav.legal.map((l) => (
              <Link key={l.label} href={localizeHref(l.href, locale)} className="text-on-dark-muted no-underline hover:text-gold max-lg:py-1">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
