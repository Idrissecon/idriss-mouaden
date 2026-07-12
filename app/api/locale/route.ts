import { NextResponse } from "next/server";
import { isLocale, localeCookie } from "@/lib/i18n";

export async function POST(request: Request) {
  const { locale } = await request.json().catch(() => ({ locale: null }));
  if (!isLocale(locale)) {
    return NextResponse.json({ error: "Invalid locale." }, { status: 400 });
  }

  const response = NextResponse.json({ locale });
  response.cookies.set(localeCookie, locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return response;
}
