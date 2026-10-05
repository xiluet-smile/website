import TreatmentPage, { type Treatment } from "@/components/TreatmentPage";
import data from "@/content/treatments/smile-design.json";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/smile-design-miami");

export default function Page() {
  return <TreatmentPage data={data as Treatment} />;
}
