create table if not exists public.hqv_visit_visitors (
  ip_hash text primary key check (ip_hash ~ '^[0-9a-f]{64}$'),
  ip_address inet not null,
  visit_count integer not null default 1 check (visit_count > 0),
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  last_counted_at timestamptz not null default now()
);

create table if not exists public.hqv_visit_rate_limits (
  ip_hash text primary key check (ip_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0)
);

create index if not exists hqv_visit_visitors_rank_idx
  on public.hqv_visit_visitors (visit_count desc, last_seen desc);

alter table public.hqv_visit_visitors enable row level security;
alter table public.hqv_visit_rate_limits enable row level security;
revoke all on public.hqv_visit_visitors, public.hqv_visit_rate_limits from public, anon, authenticated;
grant select, insert, update on public.hqv_visit_visitors, public.hqv_visit_rate_limits to service_role;

create or replace function public.hqv_visit_summary()
returns bigint
language sql
security definer
set search_path = ''
as $function$
  select coalesce(sum(visit_count), 0)::bigint from public.hqv_visit_visitors;
$function$;

create or replace function public.hqv_record_visit(p_ip_hash text, p_ip_address inet)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_now timestamptz := pg_catalog.now();
  v_window_started_at timestamptz;
  v_request_count integer;
  v_visit_count integer;
  v_counted boolean := false;
  v_total bigint;
begin
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' or p_ip_address is null then
    raise exception 'invalid visitor identity' using errcode = '22023';
  end if;

  insert into public.hqv_visit_rate_limits (ip_hash)
  values (p_ip_hash)
  on conflict (ip_hash) do nothing;

  select window_started_at, request_count
    into v_window_started_at, v_request_count
    from public.hqv_visit_rate_limits
   where ip_hash = p_ip_hash
   for update;

  if v_window_started_at <= v_now - interval '1 hour' then
    update public.hqv_visit_rate_limits
       set window_started_at = v_now, request_count = 1
     where ip_hash = p_ip_hash;
  elsif v_request_count >= 120 then
    select coalesce(sum(visit_count), 0)::bigint into v_total from public.hqv_visit_visitors;
    return pg_catalog.jsonb_build_object('counted', false, 'total', v_total, 'rate_limited', true);
  else
    update public.hqv_visit_rate_limits
       set request_count = request_count + 1
     where ip_hash = p_ip_hash;
  end if;

  insert into public.hqv_visit_visitors (ip_hash, ip_address, visit_count, first_seen, last_seen, last_counted_at)
  values (p_ip_hash, p_ip_address, 1, v_now, v_now, v_now)
  on conflict (ip_hash) do update
    set ip_address = excluded.ip_address,
        visit_count = public.hqv_visit_visitors.visit_count + 1,
        last_seen = v_now,
        last_counted_at = v_now
    where public.hqv_visit_visitors.last_counted_at <= v_now - interval '30 minutes'
  returning visit_count into v_visit_count;

  v_counted := found;
  if not v_counted then
    select visit_count into v_visit_count
      from public.hqv_visit_visitors
     where ip_hash = p_ip_hash;
  end if;

  select coalesce(sum(visit_count), 0)::bigint into v_total from public.hqv_visit_visitors;
  return pg_catalog.jsonb_build_object('counted', v_counted, 'total', v_total, 'visitor_count', v_visit_count, 'rate_limited', false);
end;
$function$;

revoke all on function public.hqv_visit_summary() from public, anon, authenticated;
revoke all on function public.hqv_record_visit(text, inet) from public, anon, authenticated;
grant execute on function public.hqv_visit_summary() to service_role;
grant execute on function public.hqv_record_visit(text, inet) to service_role;

notify pgrst, 'reload schema';
