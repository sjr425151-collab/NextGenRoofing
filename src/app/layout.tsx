import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, business } from "@/content/business";
import { organizationJsonLd } from "@/lib/seo";

const manrope = localFont({ src: "../fonts/manrope.woff2", variable: "--font-manrope", weight: "200 800", display: "swap", preload: true });
const inter = localFont({ src: "../fonts/inter.woff2", variable: "--font-inter", weight: "100 900", display: "swap", preload: true });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${business.shortName} | Roofing in Toledo, OH`, template: `%s | ${business.shortName}` },
  description:
    "Second-generation residential and commercial roofing in Toledo, Ohio. Roof replacement, repair, and flat roofing systems — EPDM, TPO, torch-down, spray foam and coatings. Free inspections.",
  applicationName: business.shortName,
  formatDetection: { telephone: true },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/apple-icon.png" },
  robots: process.env.NEXT_PUBLIC_NOINDEX === "true" ? { index: false, follow: false } : undefined,
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
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <RevealObserver />
      </body>
    </html>
  );
}
