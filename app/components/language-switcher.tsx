"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher({ label, locale }: { label: string; locale: Locale }) {
  const router = useRouter();
  const [selected, setSelected] = useState(locale);
  const [isPending, startTransition] = useTransition();

  function changeLanguage(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    setSelected(nextLocale);
    startTransition(async () => {
      try {
        const response = await fetch("/api/locale", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ locale: nextLocale }),
        });
        if (!response.ok) throw new Error("Unable to save locale");
        router.refresh();
      } catch {
        setSelected(locale);
      }
    });
  }

  return (
    <label className="language-switcher">
      <span className="visually-hidden">{label}</span>
      <select
        disabled={isPending}
        onChange={changeLanguage}
        value={selected}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </label>
  );
}
