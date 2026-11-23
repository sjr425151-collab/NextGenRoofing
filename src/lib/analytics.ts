/**
 * GA4 event helper. A no-op unless NEXT_PUBLIC_GA_MEASUREMENT_ID is configured and gtag has
 * loaded. Never send personal data (names, phone numbers, emails, addresses) as parameters.
 */
type Params = Record<string, string | number | boolean | undefined>;
declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined" || !GA_ID || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
