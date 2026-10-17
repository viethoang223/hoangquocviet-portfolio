-- Preserve the pre-map rows outside PostgREST access before changing any owner IDs.
create table if not exists public.portfolio_proofs_backup_20261016 as
select * from public.portfolio_proofs;

alter table public.portfolio_proofs_backup_20261016 enable row level security;
revoke all on table public.portfolio_proofs_backup_20261016 from anon, authenticated;

create temporary table if not exists cert_owner_map_phase2 (
  old_pattern text primary key,
  new_owner_id text not null,
  new_owner_type text not null check (new_owner_type in ('certificate', 'experience'))
) on commit drop;

truncate table pg_temp.cert_owner_map_phase2;

insert into pg_temp.cert_owner_map_phase2(old_pattern, new_owner_id, new_owner_type) values
  ('exp-vice-head-comms', 'exp-vice-head-comms', 'experience'),
  ('experience-communications', 'exp-vice-head-comms', 'experience'),
  ('communications', 'exp-vice-head-comms', 'experience'),
  ('cert-experience-communications-pho-chu-nhiem-truyen-thong', 'exp-vice-head-comms', 'experience'),
  ('anthropic-claude-101', 'anthropic-claude-101', 'certificate'),
  ('cert-anthropic-claude-101', 'anthropic-claude-101', 'certificate'),
  ('anthropic-claude-code-101', 'anthropic-claude-code-101', 'certificate'),
  ('cert-anthropic-claude-code-101', 'anthropic-claude-code-101', 'certificate'),
  ('anthropic-claude-code-in-action', 'anthropic-claude-code-in-action', 'certificate'),
  ('cert-anthropic-claude-code-in-action', 'anthropic-claude-code-in-action', 'certificate'),
  ('anthropic-mcp-intro', 'anthropic-mcp-intro', 'certificate'),
  ('cert-anthropic-introduction-to-model-context-protocol', 'anthropic-mcp-intro', 'certificate'),
  ('anthropic-mcp-advanced', 'anthropic-mcp-advanced', 'certificate'),
  ('cert-anthropic-model-context-protocol-advanced-topics', 'anthropic-mcp-advanced', 'certificate'),
  ('google-ga4', 'google-ga4', 'certificate'),
  ('cert-marketing-google-analytics-ga4-certification', 'google-ga4', 'certificate'),
  ('cert-marketing-google-analytics-%', 'google-ga4', 'certificate'),
  ('cert-marketing-ga4-%', 'google-ga4', 'certificate'),
  ('hubspot-inbound', 'hubspot-inbound', 'certificate'),
  ('cert-marketing-hubspot-inbound-certification', 'hubspot-inbound', 'certificate'),
  ('cert-marketing-hubspot-%', 'hubspot-inbound', 'certificate'),
  ('toeic-sw-260', 'toeic-sw-260', 'certificate'),
  ('cert-english-toeic-speaking-writing-260-%', 'toeic-sw-260', 'certificate');

with candidates as (
  select
    p.id,
    count(distinct m.new_owner_id) as target_count,
    min(m.new_owner_id) as new_owner_id,
    min(m.new_owner_type) as new_owner_type
  from public.portfolio_proofs p
  join pg_temp.cert_owner_map_phase2 m
    on p.owner_id = m.old_pattern or p.owner_id like m.old_pattern
  where p.owner_type in ('certificate', 'experience')
     or p.owner_id like 'cert-%'
     or p.owner_id like 'exp-%'
     or p.owner_id in ('experience-communications', 'communications')
  group by p.id
), unique_matches as (
  select id, new_owner_id, new_owner_type
  from candidates
  where target_count = 1
)
update public.portfolio_proofs p
set owner_id = m.new_owner_id,
    owner_type = m.new_owner_type
from unique_matches m
where p.id = m.id
  and (p.owner_id is distinct from m.new_owner_id or p.owner_type is distinct from m.new_owner_type);

do $$
declare
  unmatched record;
begin
  for unmatched in
    with relevant as (
      select
        p.owner_type,
        p.owner_id,
        count(*) as asset_count,
        count(distinct m.new_owner_id) as target_count
      from public.portfolio_proofs p
      left join pg_temp.cert_owner_map_phase2 m
        on p.owner_id = m.old_pattern or p.owner_id like m.old_pattern
      where p.owner_type in ('certificate', 'experience')
         or p.owner_id like 'cert-%'
         or p.owner_id like 'exp-%'
         or p.owner_id in ('experience-communications', 'communications')
      group by p.owner_type, p.owner_id
    )
    select owner_type, owner_id, asset_count, target_count
    from relevant
    where target_count <> 1
    order by owner_type, owner_id
  loop
    raise notice 'Unmapped certificate/experience owner: owner_type=%, owner_id=%, assets=%, matching_targets=%',
      unmatched.owner_type, unmatched.owner_id, unmatched.asset_count, unmatched.target_count;
  end loop;
end $$;
