"use client";

import Script from "next/script";
import { useEffect } from "react";
import { GA_ID, track } from "@/lib/analytics";

/**
 * Loads GA4 once (only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set) and records phone-call clicks.
 * Page views on client-side navigation are captured by GA4 enhanced measurement (history events).
 * Lead and estimate events are sent where they happen, so each conversion is reported once.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="tel:"]');
      if (!a) return;
      const area = a.closest("header") ? "header" : a.closest("footer") ? "footer" : a.closest("[data-estimator]") ? "estimator" : "page";
      track("click_to_call", { link_location: area, page_path: window.location.pathname });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
