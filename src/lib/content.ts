// Typed access to shared content. Page-specific content lives next to it in
// src/content/{treatments,doctors,lenders,faq}/ and is imported by the page.
import prices from "@/content/prices.json";
import casesData from "@/content/cases.json";
import doctors from "@/content/doctors.json";
import lenders from "@/content/lenders.json";
import reviews from "@/content/reviews.json";

export { prices, doctors, lenders, reviews };
export const cases = casesData.cases;
export const caseTypes = casesData.types;
export const caseDisclaimer = casesData.disclaimer;

export type Faq = { q: string; a: string; doc?: string };
export type Case = (typeof cases)[number];
export type Doctor = (typeof doctors)[number];
export type Lender = (typeof lenders)[number];
export type Package = (typeof prices.packages)[number];

export const caseById = (id: string) => {
  const c = cases.find((x) => x.id === id);
  if (!c) throw new Error(`Unknown case ${id}`);
  return c;
};
export const doctorByName = (name: string) => doctors.find((d) => d.name === name);
export const packageById = (id: string) => {
  const p = prices.packages.find((x) => x.id === id);
  if (!p) throw new Error(`Unknown package ${id}`);
  return p;
};
