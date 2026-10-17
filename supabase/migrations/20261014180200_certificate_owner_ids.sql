-- Stable certificate and experience owner IDs.
-- The updates are intentionally pattern based so existing uploaded files keep their metadata rows.
do $$
begin
  if to_regclass('public.portfolio_proofs') is not null then
    update public.portfolio_proofs set owner_id = 'exp-vice-head-comms'
      where owner_type = 'experience' and (owner_id in ('experience-communications','communications') or lower(coalesce(title_en,'')) like '%vice head%');
    update public.portfolio_proofs set owner_id = 'anthropic-claude-101'
      where owner_type = 'certificate' and lower(coalesce(owner_id,'')) like '%claude-101%';
    update public.portfolio_proofs set owner_id = 'anthropic-claude-code-101'
      where owner_type = 'certificate' and lower(coalesce(owner_id,'')) like '%claude-code-101%';
    update public.portfolio_proofs set owner_id = 'anthropic-claude-code-in-action'
      where owner_type = 'certificate' and lower(coalesce(owner_id,'')) like '%claude-code-in-action%';
    update public.portfolio_proofs set owner_id = 'anthropic-mcp-intro'
      where owner_type = 'certificate' and (lower(coalesce(owner_id,'')) like '%introduction-to-model-context-protocol%' or lower(coalesce(title_en,'')) like '%introduction to model context%');
    update public.portfolio_proofs set owner_id = 'anthropic-mcp-advanced'
      where owner_type = 'certificate' and (lower(coalesce(owner_id,'')) like '%mcp-advanced%' or lower(coalesce(title_en,'')) like '%advanced topics%');
    update public.portfolio_proofs set owner_id = 'google-ga4'
      where owner_type = 'certificate' and (lower(coalesce(owner_id,'')) like '%google-analytics%' or lower(coalesce(title_en,'')) like '%google analytics%' or lower(coalesce(title_en,'')) like '%ga4%');
    update public.portfolio_proofs set owner_id = 'hubspot-inbound'
      where owner_type = 'certificate' and (lower(coalesce(owner_id,'')) like '%hubspot%' or lower(coalesce(title_en,'')) like '%hubspot%');
    update public.portfolio_proofs set owner_id = 'toeic-sw-260'
      where owner_type = 'certificate' and (lower(coalesce(owner_id,'')) like '%toeic%' or lower(coalesce(title_en,'')) like '%toeic%');
  end if;
end $$;

-- Diagnostic query for any rows that still need manual mapping:
-- select id, owner_type, owner_id, title_vi, title_en, original_name from public.portfolio_proofs where owner_type in ('certificate','experience') order by owner_type, owner_id;
