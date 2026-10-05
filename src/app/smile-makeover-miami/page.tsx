import TreatmentPage, { type Treatment } from "@/components/TreatmentPage";
import data from "@/content/treatments/smile-makeover.json";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/smile-makeover-miami");

export default function Page() {
  return <TreatmentPage data={data as Treatment} />;
}
