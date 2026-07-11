alter table public.content_items
  add column tags text[] not null default '{}'::text[];

create index content_items_tags_idx
  on public.content_items using gin (tags);
