do $$
begin
  if to_regclass('public.portfolio_proofs') is not null then
    alter table public.portfolio_proofs drop constraint if exists portfolio_proofs_owner_type_check;
    alter table public.portfolio_proofs add constraint portfolio_proofs_owner_type_check check (owner_type in ('project','profile','certificate','experience','insight'));
    alter table public.portfolio_proofs drop constraint if exists portfolio_proofs_asset_type_check;
    alter table public.portfolio_proofs add constraint portfolio_proofs_asset_type_check check (asset_type in ('avatar','project_cover','cert_cover','insight_cover','proof','gallery'));
    drop policy if exists "portfolio proofs admin write" on public.portfolio_proofs;
    create policy "portfolio proofs admin write" on public.portfolio_proofs for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
  end if;
end $$;
