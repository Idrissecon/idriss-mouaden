import "server-only";
import { cookies } from "next/headers";
import { isLocale, localeCookie, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(localeCookie)?.value;
  return isLocale(value) ? value : "en";
}
