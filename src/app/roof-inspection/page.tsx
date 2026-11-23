import { ServicePage, serviceMetadata } from "@/components/services/ServicePage";

export const metadata = serviceMetadata("roof-inspection");

export default function Page() {
  return <ServicePage slug="roof-inspection" />;
}
