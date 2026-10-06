import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/privacy-policy");

export default function Page() {
  return <LegalPage slug="privacy-policy" />;
}
