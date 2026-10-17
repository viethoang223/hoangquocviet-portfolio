-- Phase 6 hardening. Requires admins/RLS and the portfolio-proofs bucket.
do $$
declare
  policy_row record;
begin
  if to_regclass('public.portfolio_content') is not null then
    for policy_row in select policyname from pg_policies where schemaname = 'public' and tablename = 'portfolio_content' loop
      execute format('drop policy if exists %I on public.portfolio_content', policy_row.policyname);
    end loop;
    alter table public.portfolio_content enable row level security;
    create policy "portfolio content public published read" on public.portfolio_content
      for select to anon, authenticated
      using (content_key like 'global.published.%' or public.is_portfolio_admin());
    create policy "portfolio content admin write" on public.portfolio_content
      for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
    grant select on public.portfolio_content to anon, authenticated;
    grant insert, update, delete on public.portfolio_content to authenticated;
  end if;

  if to_regclass('storage.objects') is not null then
    alter table storage.objects enable row level security;
    drop policy if exists "portfolio proofs public read" on storage.objects;
    drop policy if exists "portfolio proofs admin insert" on storage.objects;
    drop policy if exists "portfolio proofs admin update" on storage.objects;
    drop policy if exists "portfolio proofs admin delete" on storage.objects;
    create policy "portfolio proofs public read" on storage.objects
      for select to anon, authenticated
      using (bucket_id = 'portfolio-proofs');
    create policy "portfolio proofs admin insert" on storage.objects
      for insert to authenticated
      with check (bucket_id = 'portfolio-proofs' and public.is_portfolio_admin() and (storage.foldername(name))[1] in ('profile','projects','certificates','insights'));
    create policy "portfolio proofs admin update" on storage.objects
      for update to authenticated
      using (bucket_id = 'portfolio-proofs' and public.is_portfolio_admin())
      with check (bucket_id = 'portfolio-proofs' and public.is_portfolio_admin() and (storage.foldername(name))[1] in ('profile','projects','certificates','insights'));
    create policy "portfolio proofs admin delete" on storage.objects
      for delete to authenticated
      using (bucket_id = 'portfolio-proofs' and public.is_portfolio_admin());
  end if;
end $$;

do $$
begin
  if to_regclass('public.portfolio_projects') is not null then
    alter table public.portfolio_projects enable row level security;
    drop policy if exists "portfolio projects public published read" on public.portfolio_projects;
    create policy "portfolio projects public published read" on public.portfolio_projects for select to anon, authenticated using (published = true or public.is_portfolio_admin());
  end if;
  if to_regclass('public.portfolio_project_sections') is not null then
    alter table public.portfolio_project_sections enable row level security;
    drop policy if exists "portfolio project sections public published read" on public.portfolio_project_sections;
    create policy "portfolio project sections public published read" on public.portfolio_project_sections for select to anon, authenticated using (public.is_portfolio_admin() or exists (select 1 from public.portfolio_projects p where p.id = project_id and p.published = true));
  end if;
  if to_regclass('public.portfolio_proofs') is not null then
    alter table public.portfolio_proofs enable row level security;
    drop policy if exists "portfolio proofs public published read" on public.portfolio_proofs;
    create policy "portfolio proofs public published read" on public.portfolio_proofs for select to anon, authenticated using (
      public.is_portfolio_admin()
      or owner_type in ('profile','certificate','experience')
      or (owner_type = 'project' and exists (select 1 from public.portfolio_projects p where p.published = true and (p.slug = owner_id or p.id::text = owner_id or p.slug = project_id::text or p.id::text = project_id::text)))
      or (owner_type = 'insight' and exists (select 1 from public.portfolio_insights i where i.published = true and i.slug = owner_id))
      or (owner_type is null and exists (select 1 from public.portfolio_projects p where p.published = true and (p.slug = project_id::text or p.id::text = project_id::text)))
    );
  end if;
end $$;

grant select on public.portfolio_admins, public.portfolio_proofs, public.portfolio_projects, public.portfolio_project_sections to anon, authenticated;
grant insert, update, delete on public.portfolio_admins, public.portfolio_proofs, public.portfolio_projects, public.portfolio_project_sections to authenticated;
