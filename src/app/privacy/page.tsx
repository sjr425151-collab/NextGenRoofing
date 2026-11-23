import { LegalPage } from "@/components/ui/LegalPage";
import { business } from "@/content/business";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Privacy Policy", description: `How ${business.legalName} collects and uses information submitted through this website.`, path: "/privacy" });

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 22, 2026">
      <p>This policy explains what information {business.legalName} (“NextGen,” “we”) collects through this website and how it is used.</p>
      <h2>Information you give us</h2>
      <p>When you request an inspection, contact us, or submit the roof estimator, we collect the information you enter: your name, phone number, email address, property address, preferred contact method, notes, and your estimator selections (such as property type, roof size, material and ZIP code), along with the preliminary estimate shown to you.</p>
      <p>You can use the roof estimator to see a ballpark range without providing contact information. Those estimator selections are processed to calculate the range and are not stored unless you choose to submit a request.</p>
      <h2>How we use it</h2>
      <ul>
        <li>To respond to your request, schedule an inspection and prepare an estimate.</li>
        <li>To contact you by your preferred method about your project.</li>
        <li>To protect the website from spam and abuse.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use it for unrelated marketing without your permission.</p>
      <h2>Service providers</h2>
      <p>Submitted requests are delivered to us using service providers that host this website and transmit messages on our behalf. They may process your information only to provide those services. If spam protection is enabled, a verification service may process technical information about your browser to confirm the submission came from a person.</p>
      <h2>Cookies and analytics</h2>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
        <p>This website uses Google Analytics to understand how visitors use the site — for example, which pages are viewed and whether a request form was submitted. Google Analytics uses cookies and collects information such as your browser type, device, approximate location and pages visited. We do not send your name, phone number, email address or property address to Google Analytics. You can opt out using Google’s browser add-on at tools.google.com/dlpage/gaoptout. This website does not use advertising cookies.</p>
      ) : (
        <p>This website does not use advertising cookies or third-party analytics. If that changes, this policy will be updated before such tools are added.</p>
      )}
      <h2>Retention and security</h2>
      <p>We keep inquiry information only as long as needed to respond to you and manage any resulting project, and we take reasonable measures to protect it. No method of transmission over the internet is completely secure.</p>
      <h2>Your choices</h2>
      <p>You may ask us to access, correct, or delete the information you submitted by calling <a className="underline" href={`tel:${business.phone.e164}`}>{business.phone.display}</a>.</p>
      <h2>Children</h2>
      <p>This website is not directed to children under 13, and we do not knowingly collect their information.</p>
      <h2>Changes</h2>
      <p>We may update this policy from time to time. The date at the top shows when it was last revised.</p>
    </LegalPage>
  );
}
