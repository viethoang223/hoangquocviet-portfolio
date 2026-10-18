drop policy if exists "published insights are public" on public.portfolio_insights;
drop policy if exists "insights admin select" on public.portfolio_insights;
drop policy if exists "published insight sections are public" on public.portfolio_insight_sections;
drop policy if exists "insight sections admin select" on public.portfolio_insight_sections;

create policy "published insights are public" on public.portfolio_insights
  for select to anon, authenticated using (published = true);
create policy "insights admin select" on public.portfolio_insights
  for select to authenticated using (public.is_portfolio_admin());
create policy "published insight sections are public" on public.portfolio_insight_sections
  for select to anon, authenticated using (
    exists (
      select 1 from public.portfolio_insights i
      where i.id = insight_id and i.published = true
    )
  );
create policy "insight sections admin select" on public.portfolio_insight_sections
  for select to authenticated using (public.is_portfolio_admin());