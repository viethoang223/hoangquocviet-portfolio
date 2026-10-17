-- Read-only discovery for certificate and experience owners.
-- Result set 1: all relevant owner/type groups and asset counts.
select
  owner_type,
  owner_id,
  asset_type,
  count(*) as asset_count
from public.portfolio_proofs
where owner_type in ('certificate', 'experience')
   or owner_id like 'cert-%'
   or owner_id like 'exp-%'
   or owner_id in ('experience-communications', 'communications')
group by owner_type, owner_id, asset_type
order by owner_type, owner_id, asset_type;

-- Result set 2: IDs that are not already stable and do not match one unique mapping.
with owner_map(old_pattern, new_owner_id) as (
  values
    ('exp-vice-head-comms', 'exp-vice-head-comms'),
    ('experience-communications', 'exp-vice-head-comms'),
    ('communications', 'exp-vice-head-comms'),
    ('cert-experience-communications-pho-chu-nhiem-truyen-thong', 'exp-vice-head-comms'),
    ('anthropic-claude-101', 'anthropic-claude-101'),
    ('cert-anthropic-claude-101', 'anthropic-claude-101'),
    ('anthropic-claude-code-101', 'anthropic-claude-code-101'),
    ('cert-anthropic-claude-code-101', 'anthropic-claude-code-101'),
    ('anthropic-claude-code-in-action', 'anthropic-claude-code-in-action'),
    ('cert-anthropic-claude-code-in-action', 'anthropic-claude-code-in-action'),
    ('anthropic-mcp-intro', 'anthropic-mcp-intro'),
    ('cert-anthropic-introduction-to-model-context-protocol', 'anthropic-mcp-intro'),
    ('anthropic-mcp-advanced', 'anthropic-mcp-advanced'),
    ('cert-anthropic-model-context-protocol-advanced-topics', 'anthropic-mcp-advanced'),
    ('google-ga4', 'google-ga4'),
    ('cert-marketing-google-analytics-ga4-certification', 'google-ga4'),
    ('cert-marketing-google-analytics-%', 'google-ga4'),
    ('cert-marketing-ga4-%', 'google-ga4'),
    ('hubspot-inbound', 'hubspot-inbound'),
    ('cert-marketing-hubspot-inbound-certification', 'hubspot-inbound'),
    ('cert-marketing-hubspot-%', 'hubspot-inbound'),
    ('toeic-sw-260', 'toeic-sw-260'),
    ('cert-english-toeic-speaking-writing-260-%', 'toeic-sw-260')
), relevant as (
  select p.owner_id, p.owner_type, count(*) as asset_count,
         count(distinct m.new_owner_id) as distinct_targets
  from public.portfolio_proofs p
  left join owner_map m
    on p.owner_id = m.old_pattern or p.owner_id like m.old_pattern
  where p.owner_type in ('certificate', 'experience')
     or p.owner_id like 'cert-%'
     or p.owner_id like 'exp-%'
     or p.owner_id in ('experience-communications', 'communications')
  group by p.owner_id, p.owner_type
)
select owner_type, owner_id, asset_count, distinct_targets
from relevant
where distinct_targets <> 1
order by owner_type, owner_id;
