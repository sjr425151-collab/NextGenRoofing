import { ServicePage, serviceMetadata } from "@/components/services/ServicePage";

export const metadata = serviceMetadata("roof-repair");

export default function Page() {
  return <ServicePage slug="roof-repair" />;
}
