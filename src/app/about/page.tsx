import Image from "@/components/ui/Img";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { CredibilityStrip, FinalCta } from "@/components/home/Sections";
import { ArrowRight } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/Section";
import { business } from "@/content/business";
import { services } from "@/content/services";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About NextGen — A Second-Generation Roofing Company",
  description: `NextGen Roofing & Construction is a second-generation roofing company in Toledo, Ohio. The founder learned the trade from his father, ${business.family.fatherName}, of ${business.family.fatherCompany}.`,
  path: "/about",
  image: "/media/stills/farmhouse-street.jpg",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About NextGen"
        title="The next generation of a family trade."
        lede="A new company with deep roots — built to bring a family’s standard of craftsmanship to every roof we touch."
        image="/media/stills/farmhouse-street.jpg"
        imageAlt="A white farmhouse with a new gray roof and a NextGen Roofing & Construction yard sign out front"
        crumbs={[{ href: "/about", label: "About" }]}
      />

      <section aria-labelledby="roots-h" className="bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Where it started" title={<span id="roots-h">Learned on the roof, from family.</span>} />
          </div>
          <div className="space-y-6 text-[1.0625rem] leading-relaxed text-steel-2 lg:col-span-6 lg:col-start-7">
            <p data-reveal>
              NextGen’s founder learned roofing from his father, <strong className="text-ink">{business.family.fatherName}</strong>, who has operated <strong className="text-ink">{business.family.fatherCompany}</strong> for {business.family.fatherYears}. Years of working alongside him meant learning the trade the way it should be learned: on real jobs, with someone who cared how they turned out.
            </p>
            <p data-reveal>
              NextGen Roofing &amp; Construction LLC is a separate, newer company — and its name is deliberate. It stands for the next generation of that family tradition: the same craftsmanship, work ethic and customer service, brought to homeowners and commercial property owners in the Toledo area.
            </p>
            <p data-reveal>Our tagline says what we’re working toward on every job: <em className="font-semibold not-italic text-ink">Raising the Standard.</em></p>
          </div>
        </div>
      </section>

      <section aria-labelledby="lineage-h" className="on-dark relative overflow-hidden bg-ink py-24 text-white sm:py-32">
        <div className="arch-lines-dark pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <h2 id="lineage-h" className="sr-only">Two generations</h2>
          {business.familyPhoto ? (
            <figure data-reveal className="relative mb-16 aspect-[16/9] overflow-hidden">
              <Image src={business.familyPhoto.src} alt={business.familyPhoto.alt} fill sizes="100vw" className="object-cover" />
            </figure>
          ) : null}
          <ol className="grid gap-px bg-line-dark md:grid-cols-2">
            <li data-reveal className="bg-ink p-8 sm:p-12">
              <p className="eyebrow text-mist">First generation</p>
              <p className="mt-8 font-display text-[clamp(4rem,10vw,7rem)] font-bold leading-none tracking-[-0.05em]">30+</p>
              <p className="mt-3 text-mist">years in roofing</p>
              <p className="mt-8 font-display text-2xl font-bold">{business.family.fatherCompany}</p>
              <p className="mt-1 text-mist">Operated by {business.family.fatherName}</p>
            </li>
            <li data-reveal style={{ ["--reveal-delay" as string]: "120ms" }} className="bg-ink-2 p-8 sm:p-12">
              <p className="eyebrow text-red-bright">Next generation</p>
              <LogoMark className="mt-8 h-[clamp(4rem,10vw,7rem)] w-auto text-white" />
              <p className="mt-3 text-mist">{business.tagline}</p>
              <p className="mt-8 font-display text-2xl font-bold">{business.legalName}</p>
              <p className="mt-1 text-mist">Residential &amp; commercial roofing · {business.address.city}, {business.address.regionName}</p>
            </li>
          </ol>
        </div>
      </section>

      <CredibilityStrip />

      <section aria-labelledby="what-h" className="bg-white py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="What we do" title={<span id="what-h">Residential and commercial roofing</span>} />
          <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <li key={s.slug} className="bg-white">
                <Link href={`/${s.slug}`} className="group flex h-full flex-col p-7">
                  <span className="font-display text-xl font-bold">{s.title}</span>
                  <span className="mt-3 text-sm leading-relaxed text-steel-2">{s.lede}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">Learn more <ArrowRight className="transition-transform group-hover:translate-x-1" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
