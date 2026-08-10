alter table public.content_items
  add column document_format text not null default 'standard'
    check (document_format in ('standard', 'paginated-report')),
  add column report_page_count integer not null default 0
    check (report_page_count between 0 and 500),
  add column report_pages_prefix text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('report-pages', 'report-pages', false, 8388608, array['image/jpeg'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy "Published paginated report pages are readable"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'report-pages'
  and (
    private.is_site_owner()
    or exists (
      select 1
      from public.content_items
      where content_items.status = 'published'
        and content_items.document_format = 'paginated-report'
        and content_items.report_pages_prefix is not null
        and storage.objects.name like content_items.report_pages_prefix || '/%'
    )
  )
);

create policy "Owner can upload paginated report pages"
on storage.objects for insert to authenticated
with check (bucket_id = 'report-pages' and private.is_site_owner());

create policy "Owner can replace paginated report pages"
on storage.objects for update to authenticated
using (bucket_id = 'report-pages' and private.is_site_owner())
with check (bucket_id = 'report-pages' and private.is_site_owner());

create policy "Owner can delete paginated report pages"
on storage.objects for delete to authenticated
using (bucket_id = 'report-pages' and private.is_site_owner());
