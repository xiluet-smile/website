import PageBody from "@/components/pages/PageBody";
import { pageMetadata } from "@/lib/seo";

const PATH = "/refund-and-cancellation" as const;
export const metadata = pageMetadata(PATH);

export default function Page() {
  return <PageBody path={PATH} locale="en" />;
}
