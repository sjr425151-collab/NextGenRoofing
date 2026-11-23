import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, business } from "@/content/business";
import { Analytics } from "@/components/seo/Analytics";
import { TITLE_SUFFIX, siteJsonLd } from "@/lib/seo";
import { asset } from "@/lib/paths";

const manrope = localFont({ src: "../fonts/manrope.woff2", variable: "--font-manrope", weight: "200 800", display: "swap", preload: true });
const inter = localFont({ src: "../fonts/inter.woff2", variable: "--font-inter", weight: "100 900", display: "swap", preload: false, adjustFontFallback: "Arial" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `Toledo Roofing Contractor | ${business.shortName}`, template: `%s | ${TITLE_SUFFIX}` },
  description:
    "Second-generation roofing contractor in Toledo, OH. Roof replacement, repair and flat roofing for homes and businesses. Free inspections — call (440) 228-5933.",
  applicationName: business.shortName,
  formatDetection: { telephone: true },
  icons: { icon: [{ url: asset("/favicon-48.png"), sizes: "48x48", type: "image/png" }, { url: asset("/icon.png"), sizes: "512x512", type: "image/png" }], apple: asset("/apple-icon.png") },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "true" ? { index: false, follow: false } : undefined,
  // Google Search Console HTML-tag verification (optional — DNS verification needs no code).
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  themeColor: [{ color: "#111214" }],
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${manrope.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables progressive reveal styles only when JS is running */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <JsonLd data={siteJsonLd()} />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
