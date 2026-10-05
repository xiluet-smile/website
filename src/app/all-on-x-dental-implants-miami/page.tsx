import TreatmentPage, { type Treatment } from "@/components/TreatmentPage";
import data from "@/content/treatments/all-on-x.json";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/all-on-x-dental-implants-miami");

export default function Page() {
  return <TreatmentPage data={data as Treatment} />;
}
