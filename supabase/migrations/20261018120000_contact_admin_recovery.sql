alter table public.hqv_contact_rate_limits
  add column if not exists recovery_window_started_at timestamptz,
  add column if not exists recovery_attempts integer not null default 0 check (recovery_attempts >= 0),
  add column if not exists recovery_blocked_until timestamptz;

create or replace function public.hqv_contact_admin_recovery(p_ip_hash text, p_code_valid boolean)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $function$
declare
  v_now timestamptz := pg_catalog.now();
  v_window_started_at timestamptz;
  v_attempts integer;
  v_blocked_until timestamptz;
  v_next_attempts integer;
begin
  if p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'invalid contact recovery key' using errcode = '22023';
  end if;

  insert into public.hqv_contact_rate_limits (ip_hash)
  values (p_ip_hash)
  on conflict (ip_hash) do nothing;

  select recovery_window_started_at, recovery_attempts, recovery_blocked_until
    into v_window_started_at, v_attempts, v_blocked_until
    from public.hqv_contact_rate_limits
   where ip_hash = p_ip_hash
   for update;

  if v_blocked_until is not null and v_blocked_until > v_now then
    return pg_catalog.jsonb_build_object('cleared', false, 'locked', true, 'retry_after_seconds', pg_catalog.ceil(pg_catalog.date_part('epoch', v_blocked_until - v_now))::integer);
  end if;

  if v_window_started_at is null or v_window_started_at <= v_now - interval '15 minutes' then
    v_window_started_at := v_now;
    v_attempts := 0;
  end if;

  if not coalesce(p_code_valid, false) then
    v_next_attempts := v_attempts + 1;
    v_blocked_until := case when v_next_attempts >= 5 then v_now + interval '15 minutes' else null end;
    update public.hqv_contact_rate_limits
       set recovery_window_started_at = v_window_started_at,
           recovery_attempts = v_next_attempts,
           recovery_blocked_until = v_blocked_until,
           updated_at = v_now
     where ip_hash = p_ip_hash;
    return pg_catalog.jsonb_build_object('cleared', false, 'locked', v_next_attempts >= 5, 'retry_after_seconds', case when v_next_attempts >= 5 then 900 else 0 end);
  end if;

  update public.hqv_contact_rate_limits
     set window_started_at = v_now,
         window_message_count = 0,
         recent_message_times = '{}'::timestamptz[],
         spam_incidents = 0,
         blocked_until = null,
         permanently_blocked = false,
         recovery_window_started_at = null,
         recovery_attempts = 0,
         recovery_blocked_until = null,
         updated_at = v_now
   where ip_hash = p_ip_hash;

  return pg_catalog.jsonb_build_object('cleared', true, 'locked', false, 'retry_after_seconds', 0);
end;
$function$;

revoke all on function public.hqv_contact_admin_recovery(text, boolean) from public, anon, authenticated;
grant execute on function public.hqv_contact_admin_recovery(text, boolean) to service_role;

notify pgrst, 'reload schema';