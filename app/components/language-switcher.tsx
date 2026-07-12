"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ label, locale }: { label: string; locale: Locale }) {
  const [selected, setSelected] = useState(locale);
  const [isPending, setIsPending] = useState(false);

  async function changeLanguage(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    setSelected(nextLocale);
    setIsPending(true);
    try {
      const response = await fetch("/api/locale", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale: nextLocale }),
      });
      if (!response.ok) throw new Error("Unable to save locale");
      window.location.reload();
    } catch {
      setSelected(locale);
      setIsPending(false);
    }
  }

  return (
    <label className="language-switcher">
      <span className="visually-hidden">{label}</span>
      <select
        disabled={isPending}
        onChange={changeLanguage}
        value={selected}
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </label>
  );
}
