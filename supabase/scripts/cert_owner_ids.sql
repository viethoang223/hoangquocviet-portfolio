-- Read-only certificate owner ID audit. Run before and after the Phase 4 migration.
with expected(proof_id, legacy_owner_id, new_owner_id, new_owner_type) as (
  values
    ('01cb63f2-0582-4fb6-981e-76d187ebe9ef'::uuid, 'cert-english-toeic-speaking-writing-260-speaking-110-writing-150', 'toeic-sw-260', 'certificate'),
    ('c1b83360-b3cd-4994-8ea4-9e0c620a581c'::uuid, 'cert-marketing-google-analytics-ga4-certification-hubspot-inbound-certification', 'google-ga4', 'certificate'),
    (null::uuid, 'experience-communications', 'exp-vice-head-comms', 'experience'),
    (null::uuid, 'cert-experience-communications-pho-chu-nhiem-truyen-thong', 'exp-vice-head-comms', 'experience'),
    (null::uuid, 'cert-anthropic-claude-101', 'anthropic-claude-101', 'certificate'),
    (null::uuid, 'cert-anthropic-claude-code-101', 'anthropic-claude-code-101', 'certificate'),
    (null::uuid, 'cert-anthropic-claude-code-in-action', 'anthropic-claude-code-in-action', 'certificate'),
    (null::uuid, 'cert-anthropic-introduction-to-model-context-protocol', 'anthropic-mcp-intro', 'certificate'),
    (null::uuid, 'cert-anthropic-model-context-protocol-advanced-topics', 'anthropic-mcp-advanced', 'certificate')
)
select
  p.id,
  p.owner_type as current_owner_type,
  p.owner_id as current_owner_id,
  e.new_owner_type as expected_owner_type,
  e.new_owner_id as expected_owner_id,
  p.asset_type,
  p.title_vi,
  p.title_en,
  p.storage_path
from public.portfolio_proofs p
left join expected e
  on p.id = e.proof_id
  or (e.proof_id is null and p.owner_id = e.legacy_owner_id)
where p.owner_type in ('certificate', 'experience')
   or p.id in (
     '01cb63f2-0582-4fb6-981e-76d187ebe9ef'::uuid,
     'c1b83360-b3cd-4994-8ea4-9e0c620a581c'::uuid
   )
order by p.owner_type, p.owner_id, p.id;
