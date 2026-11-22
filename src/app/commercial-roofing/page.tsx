import { ServicePage, serviceMetadata } from "@/components/services/ServicePage";

export const metadata = serviceMetadata("commercial-roofing");

export default function Page() {
  return <ServicePage slug="commercial-roofing" />;
}
