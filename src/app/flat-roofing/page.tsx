import { ServicePage, serviceMetadata } from "@/components/services/ServicePage";

export const metadata = serviceMetadata("flat-roofing");

export default function Page() {
  return <ServicePage slug="flat-roofing" />;
}
