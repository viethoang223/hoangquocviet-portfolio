create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.portfolio_admins enable row level security;

drop policy if exists "portfolio admins self read" on public.portfolio_admins;
create policy "portfolio admins self read" on public.portfolio_admins
for select to authenticated using (user_id = auth.uid());

create or replace function public.is_portfolio_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.portfolio_admins where user_id = auth.uid()); $$;

revoke execute on function public.is_portfolio_admin() from public;
revoke execute on function public.is_portfolio_admin() from anon;
grant execute on function public.is_portfolio_admin() to authenticated;

drop policy if exists "portfolio admins manage" on public.portfolio_admins;
create policy "portfolio admins manage" on public.portfolio_admins
for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Apply the same admin gate to the known CMS tables when they exist.
do $$
begin
  if to_regclass('public.portfolio_projects') is not null then
    drop policy if exists "portfolio projects admin write" on public.portfolio_projects;
    create policy "portfolio projects admin write" on public.portfolio_projects for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
  end if;
  if to_regclass('public.portfolio_project_sections') is not null then
    drop policy if exists "portfolio project sections admin write" on public.portfolio_project_sections;
    create policy "portfolio project sections admin write" on public.portfolio_project_sections for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
  end if;
  if to_regclass('public.portfolio_content') is not null then
    drop policy if exists "portfolio content admin write" on public.portfolio_content;
    create policy "portfolio content admin write" on public.portfolio_content for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
  end if;
end $$;

-- Run once after deployment, replacing the UUID with the Auth user UUID.
-- insert into public.portfolio_admins(user_id, email) values ('00000000-0000-0000-0000-000000000000', 'admin@example.com') on conflict do nothing;
