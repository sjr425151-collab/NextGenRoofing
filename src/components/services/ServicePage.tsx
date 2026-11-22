import Image from "next/image";
import Link from "next/link";
import { RoofEstimator } from "@/components/estimator/RoofEstimator";
import { FinalCta } from "@/components/home/Sections";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, Phone } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/Section";
import { SITE_URL, business } from "@/content/business";
import { projects } from "@/content/projects";
import { getService, services, type ServiceSlug } from "@/content/services";
import { pageMeta } from "@/lib/seo";

export function serviceMetadata(slug: ServiceSlug) {
  const s = getService(slug);
  return pageMeta({ title: s.metaTitle, description: s.metaDescription, path: `/${slug}`, image: s.image });
}

export function ServicePage({ slug }: { slug: ServiceSlug }) {
  const s = getService(slug);
  const others = services.filter((x) => x.slug !== slug);
  const related = projects.slice(0, 2);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: s.title,
              serviceType: s.title,
              description: s.metaDescription,
              provider: { "@id": `${SITE_URL}/#business` },
              areaServed: { "@type": "City", name: `${business.address.city}, ${business.address.region}` },
              url: `${SITE_URL}/${slug}`,
            },
            {
              "@type": "FAQPage",
              mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: s.title, item: `${SITE_URL}/${slug}` },
              ],
            },
          ],
        }}
      />
      <PageHero eyebrow={s.eyebrow} title={s.headline} lede={s.lede} image={s.image} imageAlt={s.imageAlt} crumbs={[{ href: `/${slug}`, label: s.title }]}>
        <div className="flex flex-col gap-3 xs:flex-row">
          <Link href="#estimate" className="btn">Get a preliminary estimate <ArrowRight className="btn-arrow h-4 w-4" /></Link>
          <a href={`tel:${business.phone.e164}`} className="btn btn-ghost text-white"><Phone /> {business.phone.display}</a>
        </div>
      </PageHero>

      {/* Offerings */}
      <section aria-labelledby="offer-h" className="bg-paper py-24 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={s.title} title={<span id="offer-h">What we do</span>} />
          </div>
          <ul className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-8">
            {s.offerings.map((o, i) => (
              <li key={o.title} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 2) * 80}ms` }} className="bg-paper p-6 sm:p-8">
                <span className="font-display text-sm font-bold text-red-deep">0{i + 1}</span>
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight">{o.title}</h3>
                <p className="mt-3 leading-relaxed text-steel-2">{o.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Systems */}
      {s.systems ? (
        <section aria-labelledby="sys-h" className="on-dark bg-ink py-24 text-white sm:py-28">
          <div className="container-x">
            <SectionHeading tone="dark" eyebrow="Roof systems" title={<span id="sys-h">Choosing the right system</span>} lede="Each low-slope system has a job it does best. Here’s how they compare." />
            <ul className="mt-14 grid gap-px bg-line-dark md:grid-cols-2 lg:grid-cols-3">
              {s.systems.map((sys, i) => (
                <li key={sys.name} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }} className="group bg-ink p-7 transition-colors hover:bg-ink-2 sm:p-9">
                  <h3 className="font-display text-2xl font-bold tracking-tight">{sys.name}</h3>
                  <p className="mt-4 leading-relaxed text-mist">{sys.summary}</p>
                  <p className="mt-6 border-t border-line-dark pt-4 text-sm"><span className="font-semibold text-white">Best for: </span><span className="text-mist">{sys.bestFor}</span></p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Process */}
      <section aria-labelledby="proc-h" className="bg-white py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="How it works" title={<span id="proc-h">From first look to final walkthrough</span>} />
          <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute left-0 right-0 top-[1.1rem] hidden h-px bg-line md:block" />
            {s.process.map((p, i) => (
              <li key={p.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }} className="relative">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-ink bg-white font-display text-sm font-bold">{i + 1}</span>
                <h3 className="mt-6 font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-steel-2">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Estimator */}
      <section id="estimate" aria-labelledby="est-h" className="scroll-mt-20 border-t border-line bg-paper py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="Roof estimator" title={<span id="est-h">Start with a preliminary range</span>} lede="No contact details needed to see your range." />
          <div className="mt-12"><RoofEstimator preset={s.estimatorPreset} /></div>
        </div>
      </section>

      {/* Work + FAQ */}
      <section aria-labelledby="faq-h" className="bg-white py-24 sm:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Questions" title={<span id="faq-h">Good to know</span>} />
            <div className="mt-10 space-y-6">
              {related.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}`} className="group flex items-center gap-5">
                  <span className="zoom-media relative block aspect-[4/3] w-32 shrink-0"><Image src={p.cover.src} alt="" fill sizes="128px" className="object-cover" /></span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">Project</span>
                    <span className="mt-1 block font-semibold group-hover:underline">{p.title}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <ul className="border-t border-line">
              {s.faqs.map((f) => (
                <li key={f.q} className="border-b border-line">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span aria-hidden className="relative mt-2 h-3 w-3 shrink-0">
                        <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
                        <span className="absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
                      </span>
                    </summary>
                    <p className="-mt-2 pb-6 pr-8 leading-relaxed text-steel-2">{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Other services */}
      <nav aria-label="Other services" className="border-t border-line bg-paper">
        <ul className="container-x grid sm:grid-cols-3">
          {others.map((o, i) => (
            <li key={o.slug} className={`${i > 0 ? "border-t sm:border-l sm:border-t-0" : ""} border-line`}>
              <Link href={`/${o.slug}`} className="group flex items-center justify-between gap-4 py-8 sm:px-8 sm:first:pl-0">
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">{o.eyebrow}</span>
                  <span className="mt-1 block font-display text-xl font-bold">{o.title}</span>
                </span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <FinalCta />
    </>
  );
}
