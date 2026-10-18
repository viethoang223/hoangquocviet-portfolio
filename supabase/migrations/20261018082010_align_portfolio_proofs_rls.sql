alter table public.portfolio_proofs enable row level security;

drop policy if exists "Admin can delete portfolio assets" on public.portfolio_proofs;
drop policy if exists "Admin can insert portfolio assets" on public.portfolio_proofs;
drop policy if exists "Admin can update portfolio assets" on public.portfolio_proofs;
drop policy if exists "portfolio proofs admin write" on public.portfolio_proofs;
drop policy if exists "portfolio proofs admin insert" on public.portfolio_proofs;
drop policy if exists "portfolio proofs admin select" on public.portfolio_proofs;
drop policy if exists "portfolio proofs admin update" on public.portfolio_proofs;
drop policy if exists "portfolio proofs admin delete" on public.portfolio_proofs;
drop policy if exists "portfolio proofs public published read" on public.portfolio_proofs;
drop policy if exists "Public can read portfolio assets" on public.portfolio_proofs;

create policy "portfolio proofs admin insert" on public.portfolio_proofs
  for insert to authenticated with check (public.is_portfolio_admin());
create policy "portfolio proofs admin select" on public.portfolio_proofs
  for select to authenticated using (public.is_portfolio_admin());
create policy "portfolio proofs admin update" on public.portfolio_proofs
  for update to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "portfolio proofs admin delete" on public.portfolio_proofs
  for delete to authenticated using (public.is_portfolio_admin());
create policy "portfolio proofs public published read" on public.portfolio_proofs
  for select to anon, authenticated using (
    owner_type in ('profile','certificate','experience')
    or (owner_type = 'project' and exists (
      select 1 from public.portfolio_projects p
      where p.published = true
        and (p.slug = owner_id or p.id::text = owner_id or p.slug = project_id or p.id::text = project_id)
    ))
    or (owner_type = 'insight' and exists (
      select 1 from public.portfolio_insights i
      where i.published = true and i.slug = owner_id
    ))
    or (owner_type is null and exists (
      select 1 from public.portfolio_projects p
      where p.published = true and (p.slug = project_id or p.id::text = project_id)
    ))
  );