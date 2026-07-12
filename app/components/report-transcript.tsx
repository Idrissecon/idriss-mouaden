export function ReportTranscript({ body }: { body: string }) {
  return (
    <section className="report-transcript" aria-labelledby="report-transcript-heading">
      <details>
        <summary id="report-transcript-heading">Accessible text transcript</summary>
        <p className="report-transcript-note">
          The transcript preserves the wording and numerical content. Use the report pages above for the original table and chart layout.
        </p>
        <pre>{body}</pre>
      </details>
    </section>
  );
}
