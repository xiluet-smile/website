import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/terms");

export default function Page() {
  return <LegalPage slug="terms" />;
}
