import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/refund-and-cancellation");

export default function Page() {
  return <LegalPage slug="refund-and-cancellation" />;
}
