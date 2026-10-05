import TreatmentPage, { type Treatment } from "@/components/TreatmentPage";
import data from "@/content/treatments/porcelain-veneers.json";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/porcelain-veneers-miami");

export default function Page() {
  return <TreatmentPage data={data as Treatment} />;
}
