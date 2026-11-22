import { LegalPage } from "@/components/ui/LegalPage";
import { business } from "@/content/business";
import { pageMeta } from "@/lib/seo";
import pricing from "../../../config/pricing.json";

export const metadata = pageMeta({ title: "Terms & Website Disclaimers", description: `Terms of use and disclaimers for the ${business.legalName} website and roof estimator.`, path: "/terms" });

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Website Disclaimers" updated="November 22, 2026">
      <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Roof estimator</h2>
      <p>{pricing.disclaimer}</p>
      <p>Estimator results are generated automatically from the information you enter and general assumptions. They are not an offer, contract, or guarantee of price, and they do not account for conditions that can only be identified during an inspection, such as damaged decking, ventilation requirements, or code requirements.</p>
      <h2>Website content</h2>
      <p>Information on this website is provided for general informational purposes. Descriptions of roofing systems and practices are general in nature and may not apply to your specific property. Ratings and credentials are shown as of the date indicated and may change; please verify them with the issuing organization.</p>
      <h2>Project media</h2>
      <p>Project photographs and video on this site depict work by {business.legalName}. Job photos are shown as supplied; stills taken from drone footage may be color corrected for clarity. No images have been altered to misrepresent workmanship.</p>
      <h2>No contract formed</h2>
      <p>Submitting a request through this website does not create a contract. Any roofing work is subject to a separate written agreement.</p>
      <h2>Third-party links</h2>
      <p>Links to third-party sites (such as review platforms or social media) are provided for convenience. We are not responsible for their content or practices.</p>
      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, {business.legalName} is not liable for any damages arising from your use of this website or reliance on its content, including estimator results.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of Ohio.</p>
      <h2>Contact</h2>
      <p>Questions about these terms: <a className="underline" href={`tel:${business.phone.e164}`}>{business.phone.display}</a>.</p>
    </LegalPage>
  );
}
