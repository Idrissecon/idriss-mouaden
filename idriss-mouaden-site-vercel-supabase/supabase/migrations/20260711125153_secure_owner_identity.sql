create schema if not exists private;
revoke all on schema private from public;

create table if not exists private.site_owners (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table private.site_owners enable row level security;
revoke all on table private.site_owners from public, anon, authenticated;

create or replace function private.is_site_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.site_owners
    where user_id = (select auth.uid())
  )
$$;

revoke all on function private.is_site_owner() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_site_owner() to anon, authenticated;

drop policy if exists "Published content is publicly readable" on public.content_items;
create policy "Published content is publicly readable"
on public.content_items for select to anon, authenticated
using (status = 'published' or private.is_site_owner());

drop policy if exists "Owner can create content" on public.content_items;
create policy "Owner can create content"
on public.content_items for insert to authenticated
with check (private.is_site_owner());

drop policy if exists "Owner can update content" on public.content_items;
create policy "Owner can update content"
on public.content_items for update to authenticated
using (private.is_site_owner()) with check (private.is_site_owner());

drop policy if exists "Owner can delete content" on public.content_items;
create policy "Owner can delete content"
on public.content_items for delete to authenticated
using (private.is_site_owner());

drop policy if exists "Published PDFs are readable" on storage.objects;
create policy "Published PDFs are readable"
on storage.objects for select to anon, authenticated
using (
  bucket_id = 'documents'
  and (
    private.is_site_owner()
    or exists (
      select 1 from public.content_items
      where content_items.document_key = storage.objects.name
        and content_items.status = 'published'
    )
  )
);

drop policy if exists "Owner can upload PDFs" on storage.objects;
create policy "Owner can upload PDFs"
on storage.objects for insert to authenticated
with check (bucket_id = 'documents' and private.is_site_owner());

drop policy if exists "Owner can replace PDFs" on storage.objects;
create policy "Owner can replace PDFs"
on storage.objects for update to authenticated
using (bucket_id = 'documents' and private.is_site_owner())
with check (bucket_id = 'documents' and private.is_site_owner());

drop policy if exists "Owner can delete PDFs" on storage.objects;
create policy "Owner can delete PDFs"
on storage.objects for delete to authenticated
using (bucket_id = 'documents' and private.is_site_owner());

drop function if exists public.is_site_owner();
