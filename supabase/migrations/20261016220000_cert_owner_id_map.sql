-- Stable certificate and experience IDs. Only known rows and exact legacy IDs are mapped.
update public.portfolio_proofs
set owner_id = 'toeic-sw-260', owner_type = 'certificate'
where id = '01cb63f2-0582-4fb6-981e-76d187ebe9ef'
  and owner_id <> 'toeic-sw-260';

update public.portfolio_proofs
set owner_id = 'google-ga4',
    owner_type = 'certificate',
    title_vi = 'Google Analytics / GA4 Certification',
    title_en = 'Google Analytics / GA4 Certification'
where id = 'c1b83360-b3cd-4994-8ea4-9e0c620a581c'
  and owner_id <> 'google-ga4';

update public.portfolio_proofs p
set owner_id = legacy.new_owner_id,
    owner_type = legacy.new_owner_type
from (values
  ('experience-communications', 'exp-vice-head-comms', 'experience'),
  ('cert-experience-communications-pho-chu-nhiem-truyen-thong', 'exp-vice-head-comms', 'experience'),
  ('cert-anthropic-claude-101', 'anthropic-claude-101', 'certificate'),
  ('cert-anthropic-claude-code-101', 'anthropic-claude-code-101', 'certificate'),
  ('cert-anthropic-claude-code-in-action', 'anthropic-claude-code-in-action', 'certificate'),
  ('cert-anthropic-introduction-to-model-context-protocol', 'anthropic-mcp-intro', 'certificate'),
  ('cert-anthropic-model-context-protocol-advanced-topics', 'anthropic-mcp-advanced', 'certificate')
) as legacy(old_owner_id, new_owner_id, new_owner_type)
where p.owner_id = legacy.old_owner_id
  and p.owner_type in ('certificate', 'experience')
  and (p.owner_id is distinct from legacy.new_owner_id or p.owner_type is distinct from legacy.new_owner_type);

do $$
declare
  unmatched record;
begin
  for unmatched in
    select id, owner_type, owner_id
    from public.portfolio_proofs
    where owner_type in ('certificate', 'experience')
      and owner_id not in (
        'exp-vice-head-comms',
        'anthropic-claude-101',
        'anthropic-claude-code-101',
        'anthropic-claude-code-in-action',
        'anthropic-mcp-intro',
        'anthropic-mcp-advanced',
        'google-ga4',
        'hubspot-inbound',
        'toeic-sw-260'
      )
    order by owner_type, owner_id, id
  loop
    raise notice 'Unmapped certificate/experience proof: id=%, owner_type=%, owner_id=%',
      unmatched.id, unmatched.owner_type, unmatched.owner_id;
  end loop;
end $$;
