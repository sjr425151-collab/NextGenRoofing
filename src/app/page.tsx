import { CinematicHero } from "@/components/home/CinematicHero";
import { CredibilityStrip, EstimatorSection, FeaturedProjects, FinalCta, Intro, ReviewsTrust, ServicesShowcase, Story, WhyNextGen } from "@/components/home/Sections";
import { pageMeta } from "@/lib/seo";

export const metadata = {
  ...pageMeta({
    title: "Roofing in Toledo, OH — Residential & Commercial",
    description:
      "NextGen Roofing & Construction: second-generation residential and commercial roofing in Toledo, Ohio. Roof replacement, repair, and flat roofing systems. Free inspections and estimates.",
    path: "/",
  }),
  title: { absolute: "NextGen Roofing & Construction | Roofing in Toledo, OH" },
};

export default function Home() {
  const concept = process.env.NEXT_PUBLIC_HERO_CONCEPT === "stills" ? "stills" : "video";
  return (
    <>
      <CinematicHero concept={concept} />
      <CredibilityStrip />
      <Intro />
      <ServicesShowcase />
      <EstimatorSection />
      <FeaturedProjects />
      <Story />
      <WhyNextGen />
      <ReviewsTrust />
      <FinalCta />
    </>
  );
}
