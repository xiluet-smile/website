import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/schema";
import { pages } from "@/lib/site";

export const metadata = pageMetadata("/");

// Placeholder body until step 4 (Home); exercises layout, header, footer and head.
export default function Home() {
  return (
    <main id="main">
      <JsonLd data={pageGraph("/")} />
      <PageHero>
        <div className="wrap relative z-[2] py-section-sm lg:py-section">
          <h1 className="font-serif text-[38px] leading-[1.1] lg:text-[60px] lg:leading-[1.05]">{pages["/"].h1}</h1>
        </div>
      </PageHero>
      <div className="h-[400px]" />
    </main>
  );
}
