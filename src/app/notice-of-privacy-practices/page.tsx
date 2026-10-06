import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/notice-of-privacy-practices");

export default function Page() {
  return <LegalPage slug="notice-of-privacy-practices" />;
}
