import Link from "next/link";
import { CinematicHero } from "@/components/home/CinematicHero";
import { CredibilityStrip, Intro } from "@/components/home/Sections";

export const metadata = { title: "Hero concepts (review)", robots: { index: false, follow: false } };

/** Internal review route: compare Concept A (video) and Concept B (stills). */
export default async function HeroConcepts({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  const c = (await searchParams).c === "stills" ? "stills" : "video";
  return (
    <>
      <div className="fixed bottom-20 left-1/2 z-[60] flex -translate-x-1/2 gap-1 border border-white/20 bg-ink/90 p-1 text-sm text-white backdrop-blur md:bottom-6">
        <Link href="/hero-concepts?c=video" className={`px-4 py-2 font-semibold ${c === "video" ? "bg-white text-ink" : ""}`} aria-current={c === "video" ? "page" : undefined}>A · Enhanced footage</Link>
        <Link href="/hero-concepts?c=stills" className={`px-4 py-2 font-semibold ${c === "stills" ? "bg-white text-ink" : ""}`} aria-current={c === "stills" ? "page" : undefined}>B · Still composition</Link>
      </div>
      <CinematicHero key={c} concept={c} />
      <CredibilityStrip />
      <Intro />
    </>
  );
}
