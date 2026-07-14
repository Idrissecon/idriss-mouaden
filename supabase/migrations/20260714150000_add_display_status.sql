alter table public.content_items
  add column display_status_en text,
  add column display_status_es text;

-- Backfill the statuses previously hardcoded in the application.
update public.content_items set
  display_status_en = 'Shortlisted · Full text forthcoming',
  display_status_es = 'Preseleccionado · Texto completo próximamente'
where slug = 'cashlessness-and-monetary-discretion';

update public.content_items set
  display_status_en = 'Submitted · Decision pending',
  display_status_es = 'Enviado · Decisión pendiente'
where slug = 'the-end-of-exit';
