import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight, Phone } from "@/components/ui/Icons";
import { business, credentials, asOfLabel } from "@/content/business";
import { flatSystems, services } from "@/content/services";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-white">
      <div className="arch-lines-dark pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-12 border-b border-line-dark py-16 md:grid-cols-12 lg:py-20">
          <div className="md:col-span-5">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm font-display text-2xl font-semibold leading-snug tracking-tight">
              {business.tagline}.
            </p>
            <p className="mt-3 max-w-sm text-mist">
              Second-generation residential and commercial roofing, based in {business.address.city}, {business.address.regionName}.
            </p>
            <a href={`tel:${business.phone.e164}`} className="mt-8 inline-flex items-center gap-3 font-display text-3xl font-semibold tracking-tight hover:text-mist">
              <Phone className="h-6 w-6 text-red" />
              {business.phone.display}
            </a>
          </div>

          <nav aria-label="Services" className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Services</h2>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.slug}><Link className="link-underline" href={`/${s.slug}`}>{s.title}</Link></li>
              ))}
              <li><Link className="link-underline" href="/estimate">Roof Estimate</Link></li>
            </ul>
            <h2 className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-mist">Flat roof systems</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist">{flatSystems.map((s) => s.name).join(" · ")}</p>
          </nav>

          <nav aria-label="Company" className="md:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Company</h2>
            <ul className="mt-5 space-y-3">
              <li><Link className="link-underline" href="/about">About NextGen</Link></li>
              <li><Link className="link-underline" href="/projects">Projects</Link></li>
              <li><Link className="link-underline" href="/contact">Contact</Link></li>
              <li>
                <a className="link-underline inline-flex items-center gap-1" href={business.links.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook <ArrowUpRight className="h-3.5 w-3.5" /><span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">Contact</h2>
            <address className="mt-5 space-y-3 not-italic">
              <p>{business.legalName}</p>
              <p className="text-mist">
                {business.address.street ? <>{business.address.street}<br /></> : null}
                {business.address.city}, {business.address.region} {business.address.postalCode}
              </p>
              {business.hours ? <p className="text-mist">{business.hours}</p> : null}
              <p><a className="link-underline" href={`tel:${business.phone.e164}`}>{business.phone.display}</a></p>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-8 text-sm text-mist lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {credentials.map((c) => (
              <li key={c.id}>
                {c.label}: {c.value} <span className="opacity-70">(as of {asOfLabel(c.asOf)})</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span>© {year} {business.legalName}</span>
            <Link className="link-underline" href="/privacy">Privacy Policy</Link>
            <Link className="link-underline" href="/terms">Terms &amp; Disclaimers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
