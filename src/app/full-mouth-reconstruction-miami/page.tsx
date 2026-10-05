import TreatmentPage, { type Treatment } from "@/components/TreatmentPage";
import data from "@/content/treatments/full-mouth-reconstruction.json";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/full-mouth-reconstruction-miami");

export default function Page() {
  return <TreatmentPage data={data as Treatment} />;
}
