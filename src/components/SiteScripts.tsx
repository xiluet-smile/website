"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

const GTM_SRC = `https://www.googletagmanager.com/gtm.js?id=${site.gtmId}`;

/**
 * GTM container and the LeadConnector chat widget, shared by both root layouts.
 * They are injected on the first user interaction, or a few seconds after load,
 * so analytics tags and the chat never compete with the page's own rendering.
 */
export default function SiteScripts() {
  useEffect(() => {
    if ((window as Window & { __xiluetScripts?: boolean }).__xiluetScripts) return;
    const w = window as Window & { dataLayer?: unknown[]; __xiluetScripts?: boolean };
    const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
    let timer: number | undefined;

    const load = () => {
      if (w.__xiluetScripts) return;
      w.__xiluetScripts = true;
      events.forEach((e) => removeEventListener(e, load));
      clearTimeout(timer);
      // Google Tag Manager (pixels are managed inside the container).
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const gtm = document.createElement("script");
      gtm.async = true;
      gtm.src = GTM_SRC;
      document.head.appendChild(gtm);
      // LeadConnector (GoHighLevel) chat widget.
      const chat = document.createElement("script");
      chat.src = "https://widgets.leadconnectorhq.com/loader.js";
      chat.setAttribute("data-resources-url", "https://widgets.leadconnectorhq.com/chat-widget/loader.js");
      chat.setAttribute("data-widget-id", site.ghlChatWidgetId);
      chat.setAttribute("data-source", "WEB_USER");
      document.body.appendChild(chat);
    };

    events.forEach((e) => addEventListener(e, load, { passive: true, once: true }));
    const arm = () => {
      timer = window.setTimeout(load, 6000);
    };
    if (document.readyState === "complete") arm();
    else addEventListener("load", arm, { once: true });
    return () => {
      events.forEach((e) => removeEventListener(e, load));
      clearTimeout(timer);
    };
  }, []);

  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${site.gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
    </noscript>
  );
}
