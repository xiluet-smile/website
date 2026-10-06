import { notFound } from "next/navigation";
import DoctorProfile from "@/components/DoctorProfile";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/lib/content-i18n";
import type { Locale } from "@/lib/i18n";
import { pageGraph, physician } from "@/lib/schema";
import type { PagePath } from "@/lib/site";

/** /doctors/{slug}: profile from doctors.json + doctors/{slug}.json. */
export default function DoctorPage({ slug, locale = "en" }: { slug: string; locale?: Locale }) {
  const { doctors, doctorProfiles } = getContent(locale);
  const doctor = doctors.find((d) => d.slug === slug);
  const profile = doctorProfiles.find((p) => p.slug === slug);
  if (!doctor || !profile) notFound();
  const path = doctor.href as PagePath;

  return (
    <main id="main">
      <JsonLd data={pageGraph(path, locale, physician(path, { name: doctor.name, image: doctor.image }, locale))} />
      <DoctorProfile doctor={doctor} profile={profile} locale={locale} />
    </main>
  );
}
