import ReferralPage from "@/components/ReferralPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/referrals");

export default function Page() {
  return <ReferralPage kind="referrals" />;
}
