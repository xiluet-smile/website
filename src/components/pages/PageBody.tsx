// One component per route, keyed by the English path. The English page files
// and the Spanish catch-all route both render through here, so every page has
// exactly one body that takes a locale.
import LegalPage from "@/components/LegalPage";
import ReferralPage from "@/components/ReferralPage";
import TreatmentPage from "@/components/TreatmentPage";
import BlogArticle from "@/components/blog/BlogArticle";
import BlogPage from "./BlogPage";
import ClinicPage from "./ClinicPage";
import ContactPage from "./ContactPage";
import CostPage from "./CostPage";
import DoctorPage from "./DoctorPage";
import DoctorsPage from "./DoctorsPage";
import EvaluationPage from "./EvaluationPage";
import FinancingPage from "./FinancingPage";
import HomePage from "./HomePage";
import LenderDetailPage from "./LenderDetailPage";
import OutOfStatePage from "./OutOfStatePage";
import ResultsPage from "./ResultsPage";
import { getContent, type TreatmentKey } from "@/lib/content-i18n";
import type { Locale } from "@/lib/i18n";
import type { PagePath } from "@/lib/site";

const TREATMENTS: Partial<Record<PagePath, TreatmentKey>> = {
  "/porcelain-veneers-miami": "porcelain-veneers",
  "/smile-design-miami": "smile-design",
  "/full-mouth-reconstruction-miami": "full-mouth-reconstruction",
  "/all-on-x-dental-implants-miami": "all-on-x",
  "/smile-makeover-miami": "complete-restoration",
};

export default function PageBody({ path, locale }: { path: PagePath; locale: Locale }) {
  const treatment = TREATMENTS[path];
  if (treatment) return <TreatmentPage data={getContent(locale).treatments[treatment]} locale={locale} />;
  if (path.startsWith("/blog/")) return <BlogArticle slug={path.slice("/blog/".length)} locale={locale} />;
  if (path.startsWith("/doctors/")) return <DoctorPage slug={path.slice("/doctors/".length)} locale={locale} />;
  if (path.startsWith("/financing/")) return <LenderDetailPage slug={path.slice("/financing/".length)} locale={locale} />;
  switch (path) {
    case "/":
      return <HomePage locale={locale} />;
    case "/doctors":
      return <DoctorsPage locale={locale} />;
    case "/clinic":
      return <ClinicPage locale={locale} />;
    case "/financing":
      return <FinancingPage locale={locale} />;
    case "/before-and-after":
      return <ResultsPage locale={locale} />;
    case "/out-of-state-patients":
      return <OutOfStatePage locale={locale} />;
    case "/veneers-cost-miami":
      return <CostPage locale={locale} />;
    case "/blog":
      return <BlogPage locale={locale} />;
    case "/free-photo-evaluation":
      return <EvaluationPage locale={locale} />;
    case "/contact":
      return <ContactPage locale={locale} />;
    case "/referrals":
      return <ReferralPage kind="referrals" locale={locale} />;
    case "/partnerships":
      return <ReferralPage kind="partnerships" locale={locale} />;
    case "/privacy-policy":
    case "/terms":
    case "/notice-of-privacy-practices":
    case "/refund-and-cancellation":
      return <LegalPage slug={path.slice(1) as "terms"} locale={locale} />;
  }
}
