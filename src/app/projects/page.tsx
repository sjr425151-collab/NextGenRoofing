import Image from "next/image";
import Link from "next/link";
import { FinalCta } from "@/components/home/Sections";
import { ArrowRight, Play } from "@/components/ui/Icons";
import { PageHero } from "@/components/ui/PageHero";
import { projects } from "@/content/projects";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Roofing Projects",
  description: "Drone footage and photography of NextGen Roofing & Construction projects — full roof replacements and shingle installations.",
  path: "/projects",
  image: "/media/stills/replacement-complete.jpg",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Work you can see from every angle."
        lede="Real NextGen roofs, filmed by drone. More projects are added as they’re completed."
        image="/media/stills/hip-roof-context.jpg"
        imageAlt="Aerial view of a completed brown shingle hip roof in a residential neighborhood"
        crumbs={[{ href: "/projects", label: "Projects" }]}
      />
      <section aria-label="Project list" className="bg-paper py-20 sm:py-28">
        <ul className="container-x grid gap-x-8 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <li key={p.slug} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 2) * 100}ms` }} className={i === 0 ? "md:col-span-2" : ""}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className={`zoom-media relative ${i === 0 ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/10]"}`}>
                  <Image src={p.cover.src} alt={p.cover.alt} fill sizes={i === 0 ? "100vw" : "(min-width:768px) 50vw, 100vw"} className="object-cover" priority={i === 0} />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-2 bg-ink/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                    <Play className="h-3 w-3" /> Drone film · {p.video.duration}
                  </span>
                </div>
                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-deep">{p.category}</p>
                    <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">{p.title}</h2>
                    <p className="mt-3 max-w-xl text-steel-2">{p.summary}</p>
                  </div>
                  <span className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-white"><ArrowRight /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <FinalCta title="Want results like these on your roof?" />
    </>
  );
}
