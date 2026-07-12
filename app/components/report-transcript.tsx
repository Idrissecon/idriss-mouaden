import { messages, type Locale } from "@/lib/i18n";

export function ReportTranscript({ body, locale }: { body: string; locale: Locale }) {
  const m = messages(locale);
  return (
    <section className="report-transcript" aria-labelledby="report-transcript-heading">
      <details>
        <summary id="report-transcript-heading">{m.report.transcript}</summary>
        <p className="report-transcript-note">
          {m.report.transcriptNote}
        </p>
        <pre>{body}</pre>
      </details>
    </section>
  );
}
