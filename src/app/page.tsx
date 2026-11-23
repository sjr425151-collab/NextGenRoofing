import { CinematicHero } from "@/components/home/CinematicHero";
import { CredibilityStrip, EstimatorSection, FeaturedProjects, FinalCta, Intro, ReviewsTrust, ServicesShowcase, Story, WhyNextGen } from "@/components/home/Sections";
import { pageMeta } from "@/lib/seo";

export const metadata = {
  ...pageMeta({
    title: "Toledo Roofing Contractor",
    description:
      "Second-generation roofing contractor in Toledo, OH. Roof replacement, repair and flat roofing for homes and businesses. Free inspections — call (440) 228-5933.",
    path: "/",
  }),
  title: { absolute: "Toledo Roofing Contractor | NextGen Roofing & Construction" },
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
