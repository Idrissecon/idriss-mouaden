"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

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
  tags: [],
};

export function AdminClient() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => { void loadItems(); }, []);

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

  function startNew() {
    setSelectedId(null);
    setForm({ ...emptyForm, year: new Date().getFullYear() });
    setMessage("");
    setError("");
    setNewTag("");
  }

  function selectItem(item: Item) {
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
      tags: item.tags,
    });
    setMessage("");
    setError("");
    setNewTag("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
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
      await loadItems(data.item.id);
      selectItem(data.item);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMessage("");
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const result = await response.json() as { key?: string; name?: string; error?: string };
      if (!response.ok || !result.key) throw new Error(result.error || "Could not upload the PDF.");
      setForm((current) => ({ ...current, documentKey: result.key!, documentName: result.name ?? file.name }));
      setMessage("PDF uploaded. Save the entry to attach it.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not upload the PDF.");
    } finally {
      setUploading(false);
    }
  }

  async function remove() {
    if (!selectedItem || !window.confirm(`Delete “${selectedItem.title}”? This cannot be undone.`)) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/content/${selectedItem.id}`, { method: "DELETE" });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "Could not delete the entry.");
      startNew();
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
        <button className="admin-button primary" type="button" onClick={startNew}>+ New entry</button>
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
          <input required value={form.title} onChange={(event) => set("title", event.target.value)} placeholder="Exact title of the paper or essay" />
        </label>
        <label>Page address
          <div className="slug-input"><span>/{form.category}/</span><input value={form.slug} onChange={(event) => set("slug", event.target.value)} placeholder="generated-from-title" /></div>
        </label>
        <label>Short summary
          <textarea rows={3} value={form.summary} onChange={(event) => set("summary", event.target.value)} placeholder="Two or three sentences for the listing and homepage." />
        </label>
        <label>Full text / abstract
          <textarea className="body-editor" rows={14} value={form.body} onChange={(event) => set("body", event.target.value)} placeholder="Paste the abstract or full essay here. Paragraph breaks are preserved." />
        </label>

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

        <div className="document-panel">
          <div>
            <p className="detail-label">Document</p>
            <h3>{form.documentName || "No PDF attached"}</h3>
            <p>PDF only, up to 20 MB. It will open from the public entry.</p>
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
