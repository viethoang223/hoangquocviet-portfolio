create table if not exists public.hqv_contact_rate_limits (
  ip_hash text primary key check (ip_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null default pg_catalog.now(),
  window_message_count integer not null default 0 check (window_message_count >= 0),
  recent_message_times timestamptz[] not null default '{}'::timestamptz[],
  spam_incidents integer not null default 0 check (spam_incidents between 0 and 10),
  blocked_until timestamptz,
  permanently_blocked boolean not null default false,
  updated_at timestamptz not null default pg_catalog.now()
);

alter table public.hqv_contact_rate_limits
  add column if not exists recent_message_times timestamptz[] not null default '{}'::timestamptz[];

alter table public.hqv_contact_rate_limits enable row level security;
revoke all on public.hqv_contact_rate_limits from public, anon, authenticated;
grant select, insert, update on public.hqv_contact_rate_limits to service_role;

create or replace function public.hqv_contact_rate_limit(p_ip_hash text)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_now timestamptz := pg_catalog.now();
  v_window_started_at timestamptz;
  v_recent_message_times timestamptz[];
  v_spam_incidents integer;
  v_blocked_until timestamptz;
  v_permanently_blocked boolean;
  v_next_count integer;
  v_next_incident integer;
  v_block_seconds integer;
begin
  if p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid contact rate-limit key' using errcode = '22023';
  end if;

  insert into public.hqv_contact_rate_limits (ip_hash)
  values (p_ip_hash)
  on conflict (ip_hash) do nothing;

  select window_started_at, recent_message_times, spam_incidents, blocked_until, permanently_blocked
    into v_window_started_at, v_recent_message_times, v_spam_incidents, v_blocked_until, v_permanently_blocked
    from public.hqv_contact_rate_limits
   where ip_hash = p_ip_hash
   for update;

  if v_permanently_blocked then
    return pg_catalog.jsonb_build_object('allowed', false, 'permanent', true, 'incidents', v_spam_incidents, 'retry_after_seconds', null);
  end if;

  if v_blocked_until is not null and v_blocked_until > v_now then
    return pg_catalog.jsonb_build_object('allowed', false, 'permanent', false, 'incidents', v_spam_incidents, 'retry_after_seconds', pg_catalog.ceil(pg_catalog.date_part('epoch', v_blocked_until - v_now))::integer);
  end if;

  select coalesce(pg_catalog.array_agg(message_at order by message_at), '{}'::timestamptz[])
    into v_recent_message_times
    from pg_catalog.unnest(v_recent_message_times) as messages(message_at)
   where message_at > v_now - interval '2 minutes';
  v_recent_message_times := pg_catalog.array_append(v_recent_message_times, v_now);
  v_next_count := pg_catalog.cardinality(v_recent_message_times);
  if v_next_count < 3 then
    update public.hqv_contact_rate_limits
      set window_started_at = v_recent_message_times[1],
           window_message_count = v_next_count,
           recent_message_times = v_recent_message_times,
           updated_at = v_now
     where ip_hash = p_ip_hash;
    return pg_catalog.jsonb_build_object('allowed', true, 'permanent', false, 'incidents', v_spam_incidents, 'retry_after_seconds', 0);
  end if;

  v_next_incident := v_spam_incidents + 1;
  if v_next_incident >= 10 then
    update public.hqv_contact_rate_limits
      set spam_incidents = 10, window_message_count = v_next_count, recent_message_times = v_recent_message_times, permanently_blocked = true, blocked_until = null, updated_at = v_now
     where ip_hash = p_ip_hash;
    return pg_catalog.jsonb_build_object('allowed', false, 'permanent', true, 'incidents', 10, 'retry_after_seconds', null);
  end if;

  v_block_seconds := case v_next_incident
    when 1 then 300
    when 2 then 3600
    when 3 then 86400
    when 4 then 604800
    when 5 then 2592000
    when 6 then 7776000
    when 7 then 15552000
    when 8 then 31536000
    else 63072000
  end;

  v_blocked_until := v_now + pg_catalog.make_interval(secs => v_block_seconds);
  update public.hqv_contact_rate_limits
    set spam_incidents = v_next_incident, window_message_count = v_next_count, recent_message_times = v_recent_message_times, blocked_until = v_blocked_until, updated_at = v_now
   where ip_hash = p_ip_hash;

  return pg_catalog.jsonb_build_object('allowed', false, 'permanent', false, 'incidents', v_next_incident, 'retry_after_seconds', v_block_seconds);
end;
$function$;

revoke all on function public.hqv_contact_rate_limit(text) from public, anon, authenticated;
grant execute on function public.hqv_contact_rate_limit(text) to service_role;

notify pgrst, 'reload schema';