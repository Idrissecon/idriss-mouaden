import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { messages } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { academicCvHref } from "@/lib/profile";
import { pageMetadata } from "@/lib/seo";

const english = messages("en").cv;
export const metadata: Metadata = pageMetadata("CV", english.description, "/cv");

export default async function CvPage() {
  redirect(academicCvHref(await getLocale()));
}
