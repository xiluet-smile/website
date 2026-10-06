import Script from "next/script";
import { site } from "@/lib/site";

/** GTM container and the LeadConnector chat widget, shared by both root layouts. */
export default function SiteScripts() {
  return (
    <>
      {/* Google Tag Manager (container copied from the previous site). Pixels are managed inside GTM. */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${site.gtmId}');`}
      </Script>
      <noscript>
        <iframe src={`https://www.googletagmanager.com/ns.html?id=${site.gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
      </noscript>
      {/* LeadConnector (GoHighLevel) chat widget, same widget as the previous site. */}
      <Script
        id="ghl-chat"
        src="https://widgets.leadconnectorhq.com/loader.js"
        data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
        data-widget-id={site.ghlChatWidgetId}
        data-source="WEB_USER"
        strategy="lazyOnload"
      />
    </>
  );
}
