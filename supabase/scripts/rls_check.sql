select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in ('portfolio_admins','portfolio_proofs','portfolio_content','portfolio_projects','portfolio_project_sections','portfolio_insights','portfolio_insight_sections')
order by tablename;

select schemaname, tablename, policyname, roles, cmd, qual, with_check
from pg_policies
where (schemaname = 'public' and tablename in ('portfolio_admins','portfolio_proofs','portfolio_content','portfolio_projects','portfolio_project_sections','portfolio_insights','portfolio_insight_sections'))
   or (schemaname = 'storage' and tablename = 'objects')
order by schemaname, tablename, policyname;

select n.nspname as schema_name, p.proname as function_name, pg_get_function_identity_arguments(p.oid) as arguments
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'is_portfolio_admin';

select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'portfolio-proofs';
