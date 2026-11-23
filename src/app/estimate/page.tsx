import { RoofEstimator } from "@/components/estimator/RoofEstimator";
import { Phone } from "@/components/ui/Icons";
import { business } from "@/content/business";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Roof Cost Estimator — Ballpark Pricing",
  description: "Estimate what a new roof costs in Toledo, OH. Get a ballpark price range for your home or commercial building in three steps, then call for exact rates.",
  path: "/estimate",
});

export default function EstimatePage() {
  return (
    <section className="bg-paper pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <JsonLd data={breadcrumbJsonLd([{ name: "Roof Estimate", path: "/estimate" }])} />
            <h1>
              <span className="eyebrow text-red-deep">Roof Cost Estimator</span>
              {" "}
              <span className="display-lg mt-5 block">What will my roof cost?</span>
            </h1>
            <p className="lede mt-6 max-w-2xl text-steel-2">Answer a few questions to see a ballpark price range — no contact details required. For exact rates, call or request a free inspection. Every answer has an “I’m not sure” option.</p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <a href={`tel:${business.phone.e164}`} className="inline-flex items-center gap-2 font-semibold"><Phone /> Or call {business.phone.display}</a>
          </div>
        </div>
        <div className="mt-12"><RoofEstimator stepHeadingLevel={2} /></div>
      </div>
    </section>
  );
}
