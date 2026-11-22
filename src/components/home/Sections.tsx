import Image from "@/components/ui/Img";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { RoofEstimator } from "@/components/estimator/RoofEstimator";
import { ProjectFilm } from "@/components/projects/ProjectFilm";
import { ArrowRight, ArrowUpRight, Phone, Star } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/Section";
import { asOfLabel, business, credentials, reviews } from "@/content/business";
import { projects } from "@/content/projects";
import { flatSystems, services } from "@/content/services";

/* 02 — Credibility strip */
export function CredibilityStrip() {
  const bbb = credentials.find((c) => c.id === "bbb")!;
  const google = credentials.find((c) => c.id === "google")!;
  const items = [
    { k: bbb.value, label: "BBB Rating", detail: `Accredited Business · since Oct 2025`, href: bbb.href, asOf: bbb.asOf },
    { k: google.value, label: "Google Rating", detail: google.detail, href: google.href, asOf: google.asOf, stars: true },
    { k: "Free", label: "Inspections & Estimates", detail: "Residential and commercial" },
    { k: "2nd", label: "Generation Roofer", detail: `Family trade: ${business.family.fatherYears}` },
  ];
  return (
    <section aria-label="Credentials" className="relative border-b border-line bg-paper">
      <div className="container-x">
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const body = (
              <>
                <span className="flex items-baseline gap-3">
                  <span className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{it.k}</span>
                  {it.stars ? (
                    <span className="flex text-red" aria-hidden>{[0, 1, 2, 3, 4].map((n) => <Star key={n} className="h-3.5 w-3.5" />)}</span>
                  ) : null}
                </span>
                <span className="mt-3 block text-sm font-semibold">{it.label}</span>
                <span className="mt-1 block text-sm text-steel-2">{it.detail}</span>
                {it.asOf ? <span className="mt-2 block text-xs text-steel-2">As of {asOfLabel(it.asOf)}</span> : null}
              </>
            );
            return (
              <li key={it.label} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
                className={`border-line py-8 pr-4 sm:py-10 ${i % 2 === 1 ? "border-l pl-5 sm:pl-8" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-8" : ""}`}>
                {it.href ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer" className="group block">
                    {body}
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ink/70 group-hover:text-ink">Verify <ArrowUpRight className="h-3 w-3" /><span className="sr-only">(opens in a new tab)</span></span>
                  </a>
                ) : body}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* 03 — Introduction */
export function Intro() {
  return (
    <section aria-labelledby="intro-h" className="relative overflow-hidden bg-paper py-24 sm:py-32">
      <div className="arch-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pt-10">
          <p data-reveal className="eyebrow text-red-deep">NextGen Roofing &amp; Construction</p>
          <h2 id="intro-h" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }} className="display-lg mt-5">
            A modern roofing company, built on a family trade.
          </h2>
          <div data-reveal style={{ ["--reveal-delay" as string]: "160ms" }} className="mt-8 max-w-xl space-y-5 text-[1.0625rem] leading-relaxed text-steel-2">
            <p>
              The name is the story. Founder {business.founder.name} grew up in roofing, learning the trade from his father at {business.family.fatherCompany}.
              NextGen carries that work ethic into a new company — serving homeowners and commercial property owners in and around Toledo.
            </p>
            <p>From a single repair to a complete commercial membrane system, every roof gets the same attention to the details that keep water out.</p>
          </div>
          <div data-reveal style={{ ["--reveal-delay" as string]: "240ms" }} className="mt-10 flex flex-wrap gap-3">
            <Link href="/about" className="btn btn-dark">About NextGen <ArrowRight className="btn-arrow h-4 w-4" /></Link>
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <div data-reveal className="relative aspect-[4/5] w-[78%] overflow-hidden sm:w-[70%] lg:ml-auto">
            <Image src="/media/stills/farmhouse-orbit.jpg" alt="Two-story white farmhouse with a newly installed gray shingle roof, seen from a drone" fill sizes="(min-width:1024px) 34vw, 78vw" className="object-cover" />
          </div>
          <div data-reveal style={{ ["--reveal-delay" as string]: "180ms" }} className="absolute -bottom-10 right-0 aspect-[4/3] w-[58%] overflow-hidden border-[6px] border-paper shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)] sm:w-[50%] lg:-left-6 lg:right-auto lg:w-[52%]">
            <Image src="/media/stills/farmhouse-ridge-detail.jpg" alt="Close view of ridge cap shingles on a new roof" fill sizes="(min-width:1024px) 26vw, 58vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* 04 — Services */
export function ServicesShowcase() {
  return (
    <section aria-labelledby="services-h" className="on-dark relative bg-ink py-24 text-white sm:py-32">
      <div className="arch-lines-dark pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading tone="dark" eyebrow="Services" title={<span id="services-h">Homes. Commercial buildings. Every roof in between.</span>} />
          <p data-reveal className="max-w-sm text-mist">Steep-slope shingle roofs and low-slope commercial systems, installed, replaced and repaired.</p>
        </div>
        <ul className="mt-14 grid gap-px bg-line-dark sm:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 2) * 90}ms` }} className="bg-ink">
              <Link href={`/${s.slug}`} className="group relative block overflow-hidden">
                <div className="zoom-media relative aspect-[16/10]">
                  <Image src={s.image} alt={s.imageAlt} fill sizes="(min-width:640px) 50vw, 100vw" className="object-cover opacity-85 transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" aria-hidden />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">0{i + 1} · {s.eyebrow}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">{s.title}</h3>
                    <p className="mt-2 max-h-0 max-w-md overflow-hidden text-sm leading-relaxed text-white/80 opacity-0 transition-all duration-700 ease-[var(--ease-out-expo)] group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100 max-sm:max-h-24 max-sm:opacity-100">
                      {s.lede}
                    </p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 transition-all duration-500 group-hover:border-red group-hover:bg-red">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div data-reveal className="mt-14 flex flex-col gap-6 border-t border-line-dark pt-8 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-mist">Flat &amp; low-slope systems</p>
          <ul className="flex flex-wrap gap-2">
            {flatSystems.map((f) => (
              <li key={f.name}><Link href="/flat-roofing" className="inline-flex min-h-10 items-center border border-line-dark px-4 text-sm transition-colors hover:border-white">{f.name}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 05 — Estimator */
export function EstimatorSection() {
  return (
    <section id="estimator" aria-labelledby="estimator-h" className="relative scroll-mt-20 bg-paper py-24 sm:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHeading eyebrow="Roof estimator" title={<span id="estimator-h">Get a ballpark price in minutes.</span>}
              lede="Three short steps, no contact details needed. Then call or request a free inspection for exact rates." />
            <ul data-reveal className="mt-8 space-y-3 text-sm text-steel-2">
              <li className="flex gap-3"><span className="font-semibold text-ink">01</span> Project type and material</li>
              <li className="flex gap-3"><span className="font-semibold text-ink">02</span> Size, pitch and complexity — “I’m not sure” is always an option</li>
              <li className="flex gap-3"><span className="font-semibold text-ink">03</span> Your range, with the assumptions behind it</li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-8">
          <RoofEstimator />
        </div>
      </div>
    </section>
  );
}

/* 06 — Featured projects */
export function FeaturedProjects() {
  const [feature, ...rest] = projects;
  return (
    <section aria-labelledby="projects-h" className="relative border-t border-line bg-white py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Featured work" title={<span id="projects-h">Our work, from the air.</span>} lede="Drone footage of real NextGen projects — tear-off to final ridge cap." />
          <Link data-reveal href="/projects" className="btn btn-ghost shrink-0">All projects <ArrowRight className="btn-arrow h-4 w-4" /></Link>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-8">
            <ProjectFilm base={feature.video.base} poster={feature.video.poster} title={feature.title} duration={feature.video.duration} />
          </div>
          <div data-reveal style={{ ["--reveal-delay" as string]: "120ms" }} className="flex flex-col lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-deep">{feature.category}</p>
            <h3 className="mt-3 font-display text-3xl font-bold tracking-tight">{feature.title}</h3>
            <p className="mt-4 leading-relaxed text-steel-2">{feature.summary}</p>
            {feature.stages ? (
              <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Project stages">
                {feature.stages.map((st, i) => (
                  <li key={st.label}>
                    <div className="relative aspect-square overflow-hidden"><Image src={st.src} alt={st.alt} fill sizes="120px" className="object-cover" /></div>
                    <p className="mt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-steel-2">0{i + 1}<span className="block text-ink normal-case tracking-normal">{st.label}</span></p>
                  </li>
                ))}
              </ol>
            ) : null}
            <Link href={`/projects/${feature.slug}`} className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold link-underline w-fit">View project <ArrowRight /></Link>
          </div>
        </div>

        <ul className="mt-16 grid gap-8 md:grid-cols-2">
          {rest.map((p, i) => (
            <li key={p.slug} data-reveal style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className="zoom-media relative aspect-[16/10]">
                  <Image src={p.cover.src} alt={p.cover.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-deep">{p.category}</p>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-2 max-w-md text-steel-2">{p.summary}</p>
                  </div>
                  <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white"><ArrowRight /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 07 — Our story */
export function Story() {
  return (
    <section aria-labelledby="story-h" className="on-dark relative overflow-hidden bg-ink-2 py-24 text-white sm:py-32">
      <div className="arch-lines-dark pointer-events-none absolute inset-0" aria-hidden />
      <div className="container-x relative grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow text-mist">Our story</p>
          <h2 id="story-h" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }} className="display-lg mt-5">A legacy built to last.</h2>
          <div data-reveal style={{ ["--reveal-delay" as string]: "160ms" }} className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-mist">
            <p>
              Before there was NextGen, there was {business.family.fatherName}. He has run {business.family.fatherCompany} for {business.family.fatherYears}, and it’s where {business.founder.name} learned the trade — on real roofs, the right way.
            </p>
            <p>NextGen Roofing &amp; Construction is the next generation of that work: a new company carrying forward the same craftsmanship, work ethic and respect for the customer.</p>
          </div>
          <Link data-reveal href="/about" className="btn btn-ghost mt-10 text-white">Read our story <ArrowRight className="btn-arrow h-4 w-4" /></Link>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <figure data-reveal className="relative border border-line-dark p-8 sm:p-12">
            <LogoMark className="absolute right-8 top-8 h-8 w-auto text-white/15" />
            <p className="font-display text-[clamp(5rem,14vw,10rem)] font-bold leading-[0.85] tracking-[-0.05em]">30<span className="text-red">+</span></p>
            <figcaption className="mt-6 max-w-sm text-mist">
              years {business.family.fatherName} has run {business.family.fatherCompany} — the family business where NextGen’s roots are.
            </figcaption>
            <div className="mt-10 grid grid-cols-2 gap-px bg-line-dark">
              <div className="bg-ink-2 py-5 pr-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist">First generation</p>
                <p className="mt-2 font-semibold">{business.family.fatherCompany}</p>
              </div>
              <div className="bg-ink-2 py-5 pl-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-bright">Next generation</p>
                <p className="mt-2 font-semibold">{business.shortName}</p>
              </div>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* 08 — Why NextGen */
const reasons = [
  { t: "Trained in the trade", b: `Roofing learned hands-on in a family business with ${business.family.fatherYears} behind it — not picked up as a side line.` },
  { t: "Homes and commercial buildings", b: "Shingle roofs and six flat-roof systems, so the recommendation fits the building instead of the other way around." },
  { t: "Honest recommendations", b: "If a repair will do, we’ll say so. If a coating won’t hold on your roof, we’ll say that too." },
  { t: "Free inspections & estimates", b: "See the condition of your roof and the options, at no cost and with no obligation." },
];
export function WhyNextGen() {
  return (
    <section aria-labelledby="why-h" className="bg-paper py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Why NextGen" title={<span id="why-h">The standard, raised.</span>} />
        <ol className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r, i) => (
            <li key={r.t} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} className={`border-b border-line py-8 sm:pr-8 lg:border-b-0 ${i > 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 === 1 ? "sm:border-l sm:pl-8 lg:pl-8" : ""}`}>
              <span className="font-display text-sm font-bold text-red-deep">0{i + 1}</span>
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{r.t}</h3>
              <p className="mt-3 leading-relaxed text-steel-2">{r.b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 09 — Reviews & trust */
export function ReviewsTrust() {
  const google = credentials.find((c) => c.id === "google")!;
  const bbb = credentials.find((c) => c.id === "bbb")!;
  return (
    <section aria-labelledby="reviews-h" className="border-t border-line bg-white py-24 sm:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Reviews & trust" title={<span id="reviews-h">Rated by the people who hired us.</span>} />
          <p data-reveal className="mt-5 max-w-md text-steel-2">Ratings below are shown as they appeared on each platform on the date listed. Read every review at the source.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {[{ c: google, name: "Google", sub: google.detail, stars: true }, { c: bbb, name: "Better Business Bureau", sub: "Accredited Business since Oct 8, 2025", stars: false }].map(({ c, name, sub, stars }) => (
            <a key={c.id} data-reveal href={c.href} target="_blank" rel="noopener noreferrer" className="group flex flex-col border border-line p-8 transition-colors hover:border-ink">
              <p className="text-sm font-semibold">{name}</p>
              <p className="mt-6 flex items-baseline gap-3">
                <span className="font-display text-6xl font-bold tracking-tight">{c.value}</span>
                <span className="text-sm text-steel-2">{stars ? "out of 5" : "rating"}</span>
              </p>
              {stars ? <span className="mt-3 flex text-red" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((n) => <Star key={n} />)}</span> : null}
              <p className="mt-4 text-steel-2">{sub}</p>
              <p className="mt-auto flex items-center justify-between gap-3 pt-8 text-xs text-steel-2">
                <span>As of {asOfLabel(c.asOf)}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-ink">Read on {stars ? "Google" : "BBB"} <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /><span className="sr-only">(opens in a new tab)</span></span>
              </p>
            </a>
          ))}
          {reviews.length > 0 ? (
            <ul className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
              {reviews.map((r) => (
                <li key={r.author + r.date} className="border border-line p-8">
                  <span className="flex text-red" aria-label={`${r.rating} out of 5 stars`}>{Array.from({ length: r.rating }, (_, n) => <Star key={n} />)}</span>
                  <blockquote className="mt-4 leading-relaxed">“{r.text}”</blockquote>
                  <p className="mt-4 text-sm font-semibold">{r.author} <span className="font-normal text-steel-2">· {r.source}</span></p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/* 10 — Final CTA */
export function FinalCta({ title = "Your roof deserves a higher standard." }: { title?: string }) {
  return (
    <section aria-labelledby="cta-h" className="on-dark relative isolate overflow-hidden bg-ink py-28 text-white sm:py-36">
      <Image src="/media/stills/hip-roof-ridge-lines.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/20" aria-hidden />
      <div className="container-x">
        <p data-reveal className="eyebrow text-mist">Free inspection</p>
        <h2 id="cta-h" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }} className="display-lg mt-5 max-w-4xl">{title}</h2>
        <div data-reveal style={{ ["--reveal-delay" as string]: "160ms" }} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn">Schedule Your Free Inspection <ArrowRight className="btn-arrow h-4 w-4" /></Link>
          <a href={`tel:${business.phone.e164}`} className="btn btn-ghost text-white"><Phone /> {business.phone.display}</a>
        </div>
      </div>
    </section>
  );
}
