import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FinalCta } from "@/components/home/Sections";
import { Gallery } from "@/components/projects/Gallery";
import { ProjectFilm } from "@/components/projects/ProjectFilm";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { SITE_URL } from "@/content/business";
import { getProject, projects } from "@/content/projects";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) return {};
  return pageMeta({ title: p.title, description: p.summary, path: `/projects/${p.slug}`, image: p.cover.src });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const i = projects.findIndex((x) => x.slug === slug);
  const next = projects[(i + 1) % projects.length];

  const facts: [string, string | null][] = [
    ["Category", p.category],
    ["Location", p.location],
    ["Materials", p.materials],
    ["Media", `Drone film (${p.video.duration}) and stills`],
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: p.title,
          description: p.summary,
          creator: { "@id": `${SITE_URL}/#business` },
          image: `${SITE_URL}${p.cover.src}`,
          video: { "@type": "VideoObject", name: `${p.title} — drone film`, description: p.summary, thumbnailUrl: `${SITE_URL}${p.video.poster}`, contentUrl: `${SITE_URL}${p.video.base}.mp4`, uploadDate: "2026-11-22" },
        }}
      />
      <PageHero eyebrow={p.category} title={p.title} lede={p.summary} image={p.cover.src} imageAlt={p.cover.alt}
        crumbs={[{ href: "/projects", label: "Projects" }, { href: `/projects/${p.slug}`, label: p.title }]} />

      <section aria-labelledby="film-h" className="bg-paper py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 id="film-h" className="sr-only">Drone film</h2>
            <ProjectFilm base={p.video.base} poster={p.video.poster} title={p.title} duration={p.video.duration} />
          </div>
          <div className="lg:col-span-4">
            <dl className="border-t border-line">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 border-b border-line py-4">
                  <dt className="text-sm text-steel-2">{k}</dt>
                  <dd className={`text-right text-sm font-semibold ${v ? "" : "font-normal italic text-steel-2"}`}>{v ?? "Pending confirmation"}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 space-y-4 leading-relaxed text-steel-2">
              {p.description.map((d) => <p key={d}>{d}</p>)}
            </div>
          </div>
        </div>
      </section>

      {p.stages ? (
        <section aria-labelledby="stages-h" className="on-dark bg-ink py-20 text-white sm:py-28">
          <div className="container-x">
            <h2 id="stages-h" className="display-md">Start to finish</h2>
            <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {p.stages.map((s, n) => (
                <li key={s.label} data-reveal style={{ ["--reveal-delay" as string]: `${n * 90}ms` }}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={s.src} alt={s.alt} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-mist">Stage 0{n + 1}</p>
                  <p className="mt-1 font-display text-xl font-bold">{s.label}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="gallery-h" className="bg-white py-20 sm:py-28">
        <div className="container-x">
          <h2 id="gallery-h" className="display-md">Gallery</h2>
          <p className="mt-3 text-steel-2">Stills taken from the project’s drone footage.</p>
          <div className="mt-10"><Gallery items={p.gallery} /></div>
        </div>
      </section>

      <nav aria-label="More projects" className="border-t border-line bg-paper">
        <div className="container-x flex flex-col justify-between gap-6 py-10 sm:flex-row sm:items-center">
          <Link href="/projects" className="inline-flex items-center gap-2 font-semibold"><ArrowLeft /> All projects</Link>
          <Link href={`/projects/${next.slug}`} className="group inline-flex items-center gap-3 text-right">
            <span><span className="block text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">Next project</span><span className="mt-1 block font-display text-xl font-bold">{next.title}</span></span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </nav>
      <FinalCta title="Your roof deserves a higher standard." />
    </>
  );
}
