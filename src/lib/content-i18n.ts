// Locale-aware content registry. Every English JSON in src/content has a Spanish
// twin in src/content/es with the same name and shape (see I18N spec); the
// Spanish files are cast to the English types so components stay typed once.
// `ui()` holds the small UI strings that live in TSX rather than in JSON.
import type { Locale } from "./i18n";
import type { Treatment } from "@/components/TreatmentPage";
import type { DoctorProfileData } from "@/components/DoctorProfile";
import type { LenderContent } from "@/components/LenderPage";

// ---------- English ----------
import site from "@/content/site.json";
import nav from "@/content/nav.json";
import pages from "@/content/pages.json";
import home from "@/content/home.json";
import cases from "@/content/cases.json";
import prices from "@/content/prices.json";
import doctors from "@/content/doctors.json";
import doctorsIndex from "@/content/doctors-index.json";
import lenders from "@/content/lenders.json";
import financing from "@/content/financing.json";
import clinic from "@/content/clinic.json";
import outOfState from "@/content/out-of-state.json";
import contact from "@/content/contact.json";
import leadForm from "@/content/lead-form.json";
import referrals from "@/content/referrals.json";
import blog from "@/content/blog.json";
import reviews from "@/content/reviews.json";
import legal from "@/content/legal.json";
import faqHome from "@/content/faq/home.json";
import faqContact from "@/content/faq/contact.json";
import faqCost from "@/content/faq/cost.json";
import faqDoctors from "@/content/faq/doctors.json";
import faqFinancing from "@/content/faq/financing.json";
import faqOutOfState from "@/content/faq/out-of-state.json";
import trVeneers from "@/content/treatments/porcelain-veneers.json";
import trSmileDesign from "@/content/treatments/smile-design.json";
import trFullMouth from "@/content/treatments/full-mouth-reconstruction.json";
import trCompleteRestoration from "@/content/treatments/complete-restoration.json";
import trAllOnX from "@/content/treatments/all-on-x.json";
import trMakeover from "@/content/treatments/smile-makeover.json";
import docRamos from "@/content/doctors/dr-roger-ramos-navarro.json";
import docPuentes from "@/content/doctors/dr-marta-puentes-marrero.json";
import docAlonso from "@/content/doctors/dr-gretell-alonso-fiel.json";
import lnCherry from "@/content/lenders/cherry.json";
import lnSunbit from "@/content/lenders/sunbit.json";
import lnCarecredit from "@/content/lenders/carecredit.json";
import lnLendingclub from "@/content/lenders/lendingclub.json";
import lnAffirm from "@/content/lenders/affirm.json";

// ---------- Spanish ----------
import esSite from "@/content/es/site.json";
import esNav from "@/content/es/nav.json";
import esPages from "@/content/es/pages.json";
import esHome from "@/content/es/home.json";
import esCases from "@/content/es/cases.json";
import esPrices from "@/content/es/prices.json";
import esDoctors from "@/content/es/doctors.json";
import esDoctorsIndex from "@/content/es/doctors-index.json";
import esLenders from "@/content/es/lenders.json";
import esFinancing from "@/content/es/financing.json";
import esClinic from "@/content/es/clinic.json";
import esOutOfState from "@/content/es/out-of-state.json";
import esContact from "@/content/es/contact.json";
import esLeadForm from "@/content/es/lead-form.json";
import esReferrals from "@/content/es/referrals.json";
import esBlog from "@/content/es/blog.json";
import esLegalNotice from "@/content/es/legal-notice.json";
import esFaqHome from "@/content/es/faq/home.json";
import esFaqContact from "@/content/es/faq/contact.json";
import esFaqCost from "@/content/es/faq/cost.json";
import esFaqDoctors from "@/content/es/faq/doctors.json";
import esFaqFinancing from "@/content/es/faq/financing.json";
import esFaqOutOfState from "@/content/es/faq/out-of-state.json";
import esTrVeneers from "@/content/es/treatments/porcelain-veneers.json";
import esTrSmileDesign from "@/content/es/treatments/smile-design.json";
import esTrFullMouth from "@/content/es/treatments/full-mouth-reconstruction.json";
import esTrCompleteRestoration from "@/content/es/treatments/complete-restoration.json";
import esTrAllOnX from "@/content/es/treatments/all-on-x.json";
import esTrMakeover from "@/content/es/treatments/smile-makeover.json";
import esDocRamos from "@/content/es/doctors/dr-roger-ramos-navarro.json";
import esDocPuentes from "@/content/es/doctors/dr-marta-puentes-marrero.json";
import esDocAlonso from "@/content/es/doctors/dr-gretell-alonso-fiel.json";
import esLnCherry from "@/content/es/lenders/cherry.json";
import esLnSunbit from "@/content/es/lenders/sunbit.json";
import esLnCarecredit from "@/content/es/lenders/carecredit.json";
import esLnLendingclub from "@/content/es/lenders/lendingclub.json";
import esLnAffirm from "@/content/es/lenders/affirm.json";

export type Faq = { q: string; a: string; doc?: string };
/** Spanish display labels for values that must stay English for server lookups (same order as the values). */
type Labels = string[] | Record<string, string>;

type Site = typeof site;
type Nav = typeof nav;
type Pages = typeof pages;
type Home = typeof home;
type Cases = typeof cases & { typeLabels?: Record<string, string> };
type Prices = typeof prices;
type Doctors = typeof doctors;
type DoctorsIndex = typeof doctorsIndex;
type Lenders = typeof lenders;
type Financing = typeof financing;
type Clinic = typeof clinic;
type OutOfState = typeof outOfState;
type Contact = typeof contact & { topicsLabels?: Labels; replyViaLabels?: Labels };
type LeadForm = typeof leadForm & { concernsLabels?: Labels };
type Referrals = typeof referrals;
type Blog = typeof blog;
/** Short Spanish note shown above the (English) legal documents on /es, plus the Spanish document names. */
export type LegalNotice = { notice: string; names: Record<string, string> };

export type TreatmentKey = "porcelain-veneers" | "smile-design" | "complete-restoration" | "full-mouth-reconstruction" | "all-on-x" | "smile-makeover";

const content = (l: {
  site: Site;
  nav: Nav;
  pages: Pages;
  home: Home;
  cases: Cases;
  prices: Prices;
  doctors: Doctors;
  doctorsIndex: DoctorsIndex;
  lenders: Lenders;
  financing: Financing;
  clinic: Clinic;
  outOfState: OutOfState;
  contact: Contact;
  leadForm: LeadForm;
  referrals: Referrals;
  blog: Blog;
  legalNotice: LegalNotice | null;
  faq: { home: Faq[]; contact: Faq[]; cost: Faq[]; doctors: Faq[]; financing: Faq[]; outOfState: Faq[] };
  treatments: Record<TreatmentKey, Treatment>;
  doctorProfiles: DoctorProfileData[];
  lenderContent: Record<string, LenderContent>;
}) => ({
  ...l,
  /** Not translated: real reviews stay as written. */
  reviews,
  /** Not translated: legal documents stay in English until a lawyer-reviewed translation exists. */
  legal,
});

const en = content({
  site,
  nav,
  pages,
  home,
  cases,
  prices,
  doctors,
  doctorsIndex,
  lenders,
  financing,
  clinic,
  outOfState,
  contact,
  leadForm,
  referrals,
  blog,
  legalNotice: null,
  faq: { home: faqHome, contact: faqContact, cost: faqCost, doctors: faqDoctors, financing: faqFinancing, outOfState: faqOutOfState },
  treatments: {
    "porcelain-veneers": trVeneers as Treatment,
    "smile-design": trSmileDesign as Treatment,
    "complete-restoration": trCompleteRestoration as Treatment,
    "full-mouth-reconstruction": trFullMouth as Treatment,
    "all-on-x": trAllOnX as Treatment,
    "smile-makeover": trMakeover as Treatment,
  },
  doctorProfiles: [docRamos, docPuentes, docAlonso],
  lenderContent: { cherry: lnCherry, sunbit: lnSunbit, carecredit: lnCarecredit, lendingclub: lnLendingclub, affirm: lnAffirm },
});

const es = content({
  site: esSite as Site,
  nav: esNav as Nav,
  pages: esPages as Pages,
  home: esHome as Home,
  cases: esCases as Cases,
  prices: esPrices as Prices,
  doctors: esDoctors as Doctors,
  doctorsIndex: esDoctorsIndex as DoctorsIndex,
  lenders: esLenders as Lenders,
  financing: esFinancing as Financing,
  clinic: esClinic as Clinic,
  outOfState: esOutOfState as OutOfState,
  contact: esContact as Contact,
  leadForm: esLeadForm as LeadForm,
  referrals: esReferrals as Referrals,
  blog: esBlog as Blog,
  legalNotice: esLegalNotice as LegalNotice,
  faq: {
    home: esFaqHome as Faq[],
    contact: esFaqContact as Faq[],
    cost: esFaqCost as Faq[],
    doctors: esFaqDoctors as Faq[],
    financing: esFaqFinancing as Faq[],
    outOfState: esFaqOutOfState as Faq[],
  },
  treatments: {
    "porcelain-veneers": esTrVeneers as Treatment,
    "smile-design": esTrSmileDesign as Treatment,
    "complete-restoration": esTrCompleteRestoration as Treatment,
    "full-mouth-reconstruction": esTrFullMouth as Treatment,
    "all-on-x": esTrAllOnX as Treatment,
    "smile-makeover": esTrMakeover as Treatment,
  },
  doctorProfiles: [esDocRamos as DoctorProfileData, esDocPuentes as DoctorProfileData, esDocAlonso as DoctorProfileData],
  lenderContent: {
    cherry: esLnCherry as LenderContent,
    sunbit: esLnSunbit as LenderContent,
    carecredit: esLnCarecredit as LenderContent,
    lendingclub: esLnLendingclub as LenderContent,
    affirm: esLnAffirm as LenderContent,
  },
});

export type Content = typeof en;

/** All content for a locale, typed like the English files. */
export const getContent = (locale: Locale): Content => (locale === "es" ? es : en);

export type Case = Content["cases"]["cases"][number];
export type Doctor = Content["doctors"][number];
export type Lender = Content["lenders"][number];

export const caseById = (locale: Locale, id: string): Case => {
  const c = getContent(locale).cases.cases.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown case ${id}`);
  return c;
};
export const packageById = (locale: Locale, id: string) => {
  const p = getContent(locale).prices.packages.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown package ${id}`);
  return p;
};
/** Doctor by full name (FAQ `doc` values are the English names in both locales). */
export const doctorByName = (locale: Locale, name: string) => {
  const i = doctors.findIndex((d) => d.name === name);
  return i >= 0 ? getContent(locale).doctors[i] : undefined;
};
/** Display label for a case type ("Veneers" → "Carillas" on /es). */

/** Display label for a value that stays English for server lookups (`concerns`, `topics`, `replyVia`, case `type`). */

// Small UI dictionary and helpers live in ui-i18n.ts so client components do not bundle the content above.
export { ui, tpl, labelOf, caseTypeLabel, caseDisclaimer, casesFor, formContent, type UiStrings } from "./ui-i18n";
