select count(*) as insight_count from public.portfolio_insights;
select count(*) as section_count from public.portfolio_insight_sections;
select id, slug, published, sort_order, read_minutes from public.portfolio_insights order by sort_order, id;
select i.slug, count(s.id) as section_count
from public.portfolio_insights i
left join public.portfolio_insight_sections s on s.insight_id = i.id
group by i.id, i.slug
order by i.sort_order, i.id;
select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where tablename in ('portfolio_insights', 'portfolio_insight_sections')
order by tablename, policyname;
