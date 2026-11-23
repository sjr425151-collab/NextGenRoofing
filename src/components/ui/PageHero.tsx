import Image from "@/components/ui/Img";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  imageAlt,
  imagePosition,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="on-dark relative isolate flex min-h-[78svh] items-end overflow-hidden bg-ink pb-16 pt-36 text-white sm:min-h-[72vh] sm:pb-20">
      <Image src={image} alt={imageAlt} fill priority fetchPriority="high" loading="eager" sizes="100vw" className="cine-kenburns -z-20 object-cover" style={imagePosition ? { objectPosition: imagePosition } : undefined} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(17_18_20/0.55)_0%,rgb(17_18_20/0.25)_35%,rgb(17_18_20/0.9)_100%)]" aria-hidden />
      <div className="arch-lines-dark absolute inset-0 -z-10" aria-hidden />
      <div className="container-x">
        {crumbs ? <JsonLd data={breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, path: c.href })))} /> : null}
        {crumbs ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/70">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {i === crumbs.length - 1 ? <span aria-current="page" className="text-white">{c.label}</span> : <Link href={c.href} className="hover:text-white">{c.label}</Link>}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {/* The eyebrow is part of the H1 (descriptive, keyword-bearing) but keeps its visual style. */}
        <h1 className="max-w-4xl">
          <span className="eyebrow cine-in text-white/80">{eyebrow}</span>
          {" "}
          <span className="display-lg cine-rise mt-5 block" style={{ ["--d" as string]: "100ms" }}>{title}</span>
        </h1>
        {lede ? <p className="lede cine-in mt-6 max-w-2xl text-white/85" style={{ ["--d" as string]: "200ms" }}>{lede}</p> : null}
        {children ? <div className="cine-in mt-9" style={{ ["--d" as string]: "300ms" }}>{children}</div> : null}
      </div>
    </section>
  );
}
