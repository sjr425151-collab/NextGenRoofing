import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { Phone } from "@/components/ui/Icons";
import { asOfLabel, business, credentials } from "@/content/business";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact & Free Roof Inspection, Toledo OH",
  description: `Schedule a free roof inspection with NextGen Roofing & Construction in Toledo, Ohio. Call ${business.phone.display} or send a request online.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="bg-paper pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="container-x grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
          <h1>
            <span className="eyebrow text-red-deep">Contact NextGen Roofing</span>
            {" "}
            <span className="display-lg mt-5 block">Schedule your free inspection.</span>
          </h1>
          <p className="lede mt-6 text-steel-2">Tell us about your roof and how to reach you. For anything urgent, calling is fastest.</p>
          <a href={`tel:${business.phone.e164}`} className="mt-10 flex items-center gap-4 border-y border-line py-6 font-display text-3xl font-bold tracking-tight hover:text-red-deep sm:text-4xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white"><Phone className="h-5 w-5" /></span>
            {business.phone.display}
          </a>
          <dl className="mt-8 space-y-5">
            <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">Business</dt><dd className="mt-1 font-semibold">{business.legalName}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">Address</dt><dd className="mt-1">{business.address.street}<br />{business.address.city}, {business.address.region} {business.address.postalCode}</dd></div>
            {business.hours ? <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">Hours</dt><dd className="mt-1">{business.hours}</dd></div> : null}
            <div><dt className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">Credentials</dt>
              <dd className="mt-1 space-y-1">{credentials.map((c) => <p key={c.id}>{c.label}: <span className="font-semibold">{c.value}</span> <span className="text-sm text-steel-2">({c.detail.toLowerCase()}, as of {asOfLabel(c.asOf)})</span></p>)}</dd>
            </div>
          </dl>
        </div>
        <div className="lg:col-span-7">
          <div className="border border-line bg-white p-6 sm:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight">Request an inspection</h2>
            <p className="mt-2 text-steel-2">Free, with no obligation. Prefer a ballpark first? <Link href="/estimate" className="font-semibold text-ink underline">Try the roof estimator</Link>. Curious what we check? <Link href="/roof-inspection" className="font-semibold text-ink underline">What a free inspection covers</Link>.</p>
            <div className="mt-8"><ContactForm /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
