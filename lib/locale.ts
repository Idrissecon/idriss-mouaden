import "server-only";
import { cookies, headers } from "next/headers";
import { isLocale, localeCookie, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(localeCookie)?.value;
  // A saved language choice takes precedence over the visitor's location.
  if (isLocale(value)) return value;

  const country = (await headers()).get("x-vercel-ip-country");
  return country === "ES" ? "es" : "en";
}
