"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { slugify } from "@/lib/content-input";
import { createClient as createBrowserSupabaseClient } from "@/lib/supabase/client";

type Item = {
  id: number;
  title: string;
  slug: string;
  category: "research" | "writing";
  status: "draft" | "published";
  summary: string;
  body: string;
  venue: string | null;
  year: number | null;
  publicationDate: string | null;
  featured: boolean;
  externalUrl: string | null;
  documentKey: string | null;
  documentName: string | null;
  documentFormat: "standard" | "paginated-report";
  reportPageCount: number;
  reportPagesPrefix: string | null;
  displayStatusEn: string | null;
  displayStatusEs: string | null;
  tags: string[];
  updatedAt: string;
};

type FormState = Omit<Item, "id" | "updatedAt">;

const emptyForm: FormState = {
  title: "",
  slug: "",
  category: "research",
  status: "draft",
  summary: "",
  body: "",
  venue: "",
  year: new Date().getFullYear(),
  publicationDate: "",
  featured: false,
  externalUrl: "",
  documentKey: null,
  documentName: null,
  documentFormat: "standard",
  reportPageCount: 0,
  reportPagesPrefix: null,
  displayStatusEn: "",
  displayStatusEs: "",
  tags: [],
};

export function AdminClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processingPage, setProcessingPage] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newTag, setNewTag] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { void loadItems(); }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const availableTags = useMemo(
    () => [...new Set([...items.flatMap((item) => item.tags), ...form.tags])]
      .sort((a, b) => a.localeCompare(b)),
    [items, form.tags],
  );

  async function loadItems(select?: number) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const data = await response.json() as { items?: Item[]; error?: string };
      if (!response.ok) throw new Error(data.error || "Could not load content.");
      setItems(data.items ?? []);
      if (select) setSelectedId(select);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load content.");
    } finally {
      setLoading(false);
    }
  }

  function confirmDiscard() {
    return !dirty || window.confirm("Discard unsaved changes?");
  }

  function startNew(force = false) {
    if (!force && !confirmDiscard()) return;
    setSelectedId(null);
    setForm({ ...emptyForm, year: new Date().getFullYear() });
    setMessage("");
    setError("");
    setNewTag("");
    setSlugEdited(false);
    setDirty(false);
  }

  function selectItem(item: Item) {
    if (!confirmDiscard()) return;
    applyItem(item);
  }

  function applyItem(item: Item) {
    setSelectedId(item.id);
    setForm({
      title: item.title,
      slug: item.slug,
      category: item.category,
      status: item.status,
      summary: item.summary,
      body: item.body,
      venue: item.venue ?? "",
      year: item.year,
      publicationDate: item.publicationDate ?? "",
      featured: item.featured,
      externalUrl: item.externalUrl ?? "",
      documentKey: item.documentKey,
      documentName: item.documentName,
      documentFormat: item.documentFormat,
      reportPageCount: item.reportPageCount,
      reportPagesPrefix: item.reportPagesPrefix,
      displayStatusEn: item.displayStatusEn ?? "",
      displayStatusEs: item.displayStatusEs ?? "",
      tags: item.tags,
    });
    setMessage("");
    setError("");
    setNewTag("");
    setSlugEdited(true);
    setDirty(false);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (
      form.documentFormat === "paginated-report" &&
      (!form.reportPagesPrefix || form.reportPageCount < 1)
    ) {
      setError("Activa el formato antes de subir el PDF, o reemplaza el PDF para generar sus páginas.");
      return;
    }
    if (
      selectedItem?.status === "published" &&
      form.slug !== selectedItem.slug &&
      !window.confirm(
        `This entry is published at /${selectedItem.category}/${selectedItem.slug}. Changing the address breaks existing links and citations. Continue?`,
      )
    ) {
      return;
    }
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(
        selectedId ? `/api/admin/content/${selectedId}` : "/api/admin/content",
        {
          method: selectedId ? "PUT" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await response.json() as { item?: Item; error?: string };
      if (!response.ok || !data.item) throw new Error(data.error || "Could not save.");
      setMessage(data.item.status === "published" ? "Published successfully." : "Draft saved.");
      setDirty(false);
      await loadItems(data.item.id);
      applyItem(data.item);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Solo se admiten archivos PDF.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("El PDF no puede superar los 20 MB.");
      return;
    }
    setUploading(true);
    setMessage("");
    setError("");
    const supabase = createBrowserSupabaseClient();
    let uploadedKey: string | null = null;
    try {
      const key = `${crypto.randomUUID()}.pdf`;
      const { error: uploadError } = await supabase.storage.from("documents").upload(key, file, {
        contentType: "application/pdf",
        upsert: false,
      });
      if (uploadError) throw new Error(uploadError.message || "Could not upload the PDF.");
      uploadedKey = key;
      const report = form.documentFormat === "paginated-report"
        ? await processReportPdf(file, key, supabase)
        : null;
      setForm((current) => ({
        ...current,
        documentKey: key,
        documentName: file.name,
        reportPageCount: report?.pageCount ?? 0,
        reportPagesPrefix: report?.prefix ?? null,
        body: current.body || report?.transcript || "",
      }));
      setDirty(true);
      setMessage(report
        ? `PDF procesado: ${report.pageCount} páginas y texto SEO extraído. Guarda la entrada para publicarlo.`
        : "PDF uploaded. Save the entry to attach it.");
    } catch (caught) {
      if (uploadedKey) await removeUploadedAssets(supabase, uploadedKey);
      setError(caught instanceof Error ? caught.message : "Could not upload the PDF.");
    } finally {
      setUploading(false);
      setProcessingPage(null);
    }
  }

  async function removeUploadedAssets(
    supabase: ReturnType<typeof createBrowserSupabaseClient>,
    documentKey: string,
  ) {
    const prefix = documentKey.slice(0, -4);
    const { data: pages } = await supabase.storage.from("report-pages").list(prefix, { limit: 500 });
    if (pages?.length) {
      await supabase.storage.from("report-pages").remove(
        pages.map((page) => `${prefix}/${page.name}`),
      );
    }
    await supabase.storage.from("documents").remove([documentKey]);
  }

  async function processReportPdf(
    file: File,
    documentKey: string,
    supabase: ReturnType<typeof createBrowserSupabaseClient>,
  ) {
    const pdfjs = await import("pdfjs-dist");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pageCount = pdf.numPages;
    if (pageCount > 500) throw new Error("El informe no puede superar 500 páginas.");
    const transcript: string[] = [];

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      setProcessingPage(pageNumber);
      const page = await pdf.getPage(pageNumber);
      const initialViewport = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: Math.max(1.5, 1800 / initialViewport.width) });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("No se pudo preparar el renderizado del informe.");
      await page.render({ canvas, canvasContext: context, viewport }).promise;
      const image = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error("No se pudo renderizar una página.")),
          "image/jpeg",
          0.92,
        );
      });

      const prefix = documentKey.slice(0, -4);
      const pageKey = `${prefix}/page-${String(pageNumber).padStart(4, "0")}.jpg`;
      const { error: pageUploadError } = await supabase.storage.from("report-pages").upload(
        pageKey,
        image,
        {
          cacheControl: "31536000",
          contentType: "image/jpeg",
          upsert: true,
        },
      );
      if (pageUploadError) {
        throw new Error(pageUploadError.message || `No se pudo subir la página ${pageNumber}.`);
      }
      const text = await page.getTextContent();
      const pageText = text.items
        .map((item) => "str" in item ? item.str : "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (pageText) transcript.push(`[Page ${pageNumber}]\n${pageText}`);
      page.cleanup();
    }
    await pdf.destroy();
    return {
      prefix: documentKey.slice(0, -4),
      pageCount,
      transcript: transcript.join("\n\n"),
    };
  }

  async function remove() {
    if (!selectedItem || !window.confirm(`Delete “${selectedItem.title}”? This cannot be undone.`)) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/content/${selectedItem.id}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not delete the entry.");
      startNew(true);
      await loadItems();
      setMessage("Entry deleted.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not delete the entry.");
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  function setTitle(title: string) {
    setForm((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : slugify(title),
    }));
    setDirty(true);
  }

  function toggleTag(tag: string) {
    set("tags", form.tags.includes(tag)
      ? form.tags.filter((current) => current !== tag)
      : [...form.tags, tag]);
  }

  function addTag() {
    const tag = newTag.trim().replace(/\s+/g, " ").slice(0, 40);
    if (!tag) return;
    const existing = availableTags.find((current) => current.toLowerCase() === tag.toLowerCase());
    if (!form.tags.includes(existing ?? tag)) set("tags", [...form.tags, existing ?? tag]);
    setNewTag("");
  }

  return (
    <div className="editor-grid">
      <aside className="content-index" aria-label="Content entries">
        <button className="admin-button primary" type="button" onClick={() => startNew()}>+ New entry</button>
        <div className="content-index-list">
          {loading && <p className="admin-muted">Loading…</p>}
          {!loading && items.length === 0 && <p className="admin-muted">No entries yet. Create the first one.</p>}
          {items.map((item) => (
            <button
              className={item.id === selectedId ? "content-index-item is-selected" : "content-index-item"}
              key={item.id}
              onClick={() => selectItem(item)}
              type="button"
            >
              <span>{item.category}</span>
              <strong>{item.title}</strong>
              <small>{item.status === "published" ? "Published" : "Draft"}</small>
            </button>
          ))}
        </div>
      </aside>

      <form className="content-form" onSubmit={save}>
        <div className="editor-toolbar">
          <div>
            <p className="detail-label">{selectedId ? "Edit entry" : "New entry"}</p>
            <h2>{form.title || "Untitled"}</h2>
          </div>
          <div className="editor-actions">
            {selectedItem && (
              <a
                className="text-link"
                href={`/${selectedItem.category}/${selectedItem.slug}`}
                rel="noreferrer"
                target="_blank"
              >
                {selectedItem.status === "published" ? "View ↗" : "Preview draft ↗"}
              </a>
            )}
            {selectedId && <button className="admin-button danger" type="button" onClick={remove}>Delete</button>}
            <button className="admin-button primary" disabled={saving} type="submit">
              {saving ? "Saving…" : form.status === "published" ? "Save & publish" : "Save draft"}
            </button>
          </div>
        </div>

        {(message || error) && <p className={error ? "admin-notice is-error" : "admin-notice"}>{error || message}</p>}

        <div className="form-row two-columns">
          <label>Section
            <select value={form.category} onChange={(event) => set("category", event.target.value as FormState["category"])}>
              <option value="research">Research</option>
              <option value="writing">Writing / essay</option>
            </select>
          </label>
          <label>Status
            <select value={form.status} onChange={(event) => set("status", event.target.value as FormState["status"])}>
              <option value="draft">Draft — hidden</option>
              <option value="published">Published — visible</option>
            </select>
          </label>
        </div>

        <div className="taxonomy-panel">
          <div>
            <p className="detail-label">Categories / tags</p>
            <p>Choose existing labels or create a new one. An entry can have several.</p>
          </div>
          {availableTags.length > 0 && (
            <div className="tag-options" aria-label="Available categories and tags">
              {availableTags.map((tag) => (
                <button
                  className={form.tags.includes(tag) ? "tag-option is-selected" : "tag-option"}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          <div className="tag-create">
            <input
              aria-label="New category or tag"
              maxLength={40}
              onChange={(event) => setNewTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
              placeholder="e.g. Banking"
              value={newTag}
            />
            <button className="admin-button" onClick={addTag} type="button">Add tag</button>
          </div>
        </div>

        <label>Title
          <input required value={form.title} onChange={(event) => setTitle(event.target.value)} placeholder="Exact title of the paper or essay" />
        </label>
        <label>Page address
          <div className="slug-input"><span>/{form.category}/</span><input value={form.slug} onChange={(event) => { setSlugEdited(true); set("slug", event.target.value); }} placeholder="generated-from-title" /></div>
        </label>
        <label>Short summary
          <textarea rows={3} value={form.summary} onChange={(event) => set("summary", event.target.value)} placeholder="Two or three sentences for the listing and homepage." />
        </label>
        <label>Full text / abstract
          <textarea className="body-editor" rows={14} value={form.body} onChange={(event) => set("body", event.target.value)} placeholder="Paste the abstract or full essay here. Paragraph breaks are preserved." />
        </label>

        <div className="form-row two-columns">
          <label>Status line — English (optional)
            <input maxLength={80} value={form.displayStatusEn ?? ""} onChange={(event) => set("displayStatusEn", event.target.value)} placeholder="e.g. Submitted · Decision pending" />
          </label>
          <label>Status line — Spanish (optional)
            <input maxLength={80} value={form.displayStatusEs ?? ""} onChange={(event) => set("displayStatusEs", event.target.value)} placeholder="p. ej. Enviado · Decisión pendiente" />
          </label>
        </div>

        <div className="form-row three-columns">
          <label>Publication / venue
            <input value={form.venue ?? ""} onChange={(event) => set("venue", event.target.value)} placeholder="Working paper" />
          </label>
          <label>Year
            <input type="number" min="1900" max="2200" value={form.year ?? ""} onChange={(event) => set("year", event.target.value ? Number(event.target.value) : null)} />
          </label>
          <label>Exact date
            <input type="date" value={form.publicationDate ?? ""} onChange={(event) => set("publicationDate", event.target.value)} />
          </label>
        </div>

        <label>PDF presentation
          <select
            value={form.documentFormat}
            onChange={(event) => {
              const documentFormat = event.target.value as FormState["documentFormat"];
              setForm((current) => ({
                ...current,
                documentFormat,
                reportPageCount: documentFormat === "standard" ? 0 : current.reportPageCount,
                reportPagesPrefix: documentFormat === "standard" ? null : current.reportPagesPrefix,
              }));
              setDirty(true);
              if (documentFormat === "paginated-report" && form.documentKey) {
                setMessage("Formato informe activado. Reemplaza el PDF para generar las hojas.");
              }
            }}
          >
            <option value="standard">Standard document</option>
            <option value="paginated-report">Paginated report — pages + SEO text</option>
          </select>
        </label>

        <div className="document-panel">
          <div>
            <p className="detail-label">Document</p>
            <h3>{form.documentName || "No PDF attached"}</h3>
            <p>PDF only, up to 20 MB. It will open from the public entry.</p>
            {form.documentFormat === "paginated-report" && (
              <p>
                {processingPage
                  ? `Procesando página ${processingPage}…`
                  : form.reportPageCount > 0
                    ? `${form.reportPageCount} páginas preparadas.`
                    : "Al subirlo se generarán las hojas y el texto para SEO."}
              </p>
            )}
          </div>
          <label className="admin-button file-button">
            {uploading ? "Uploading…" : form.documentKey ? "Replace PDF" : "Upload PDF"}
            <input disabled={uploading} type="file" accept="application/pdf,.pdf" onChange={(event) => void upload(event.target.files?.[0])} />
          </label>
        </div>

        <label>External link (optional)
          <input type="url" value={form.externalUrl ?? ""} onChange={(event) => set("externalUrl", event.target.value)} placeholder="https://…" />
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={form.featured} onChange={(event) => set("featured", event.target.checked)} />
          Feature this entry on the homepage
        </label>
      </form>
    </div>
  );
}
