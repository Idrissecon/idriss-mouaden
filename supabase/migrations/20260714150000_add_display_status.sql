alter table public.content_items
  add column display_status_en text,
  add column display_status_es text;

-- Backfill the statuses previously hardcoded in the application.
update public.content_items set
  display_status_en = 'High Commendation',
  display_status_es = 'High Commendation'
where slug = 'cashlessness-and-monetary-discretion';

update public.content_items set
  display_status_en = 'Published',
  display_status_es = 'Publicado'
where slug = 'the-end-of-exit';
