import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DoctorProfile, { type DoctorProfileData } from "@/components/DoctorProfile";
import JsonLd from "@/components/JsonLd";
import alonso from "@/content/doctors/dr-gretell-alonso-fiel.json";
import puentes from "@/content/doctors/dr-marta-puentes-marrero.json";
import ramos from "@/content/doctors/dr-roger-ramos-navarro.json";
import { doctors } from "@/lib/content";
import { pageGraph, physician } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import type { PagePath } from "@/lib/site";

const profiles: DoctorProfileData[] = [ramos, puentes, alonso];

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata(`/doctors/${slug}` as PagePath);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const doctor = doctors.find((d) => d.slug === slug);
  const profile = profiles.find((p) => p.slug === slug);
  if (!doctor || !profile) notFound();
  const path = doctor.href as PagePath;

  return (
    <main id="main">
      <JsonLd data={pageGraph(path, physician(path, { name: doctor.name, image: doctor.image }))} />
      <DoctorProfile doctor={doctor} profile={profile} />
    </main>
  );
}
