import ReferralPage from "@/components/ReferralPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/partnerships");

export default function Page() {
  return <ReferralPage kind="partnerships" />;
}
