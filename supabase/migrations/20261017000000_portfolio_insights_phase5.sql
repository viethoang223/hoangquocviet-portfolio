-- Phase 5 Insights. Requires portfolio_admins/RLS, proofs constraints, and public.is_portfolio_admin().
do $$
begin
  if to_regprocedure('public.is_portfolio_admin()') is null then
    raise exception 'Phase 5 Insights requires public.is_portfolio_admin(); run admins+RLS migration first';
  end if;
end $$;

create table if not exists public.portfolio_insights (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  published boolean not null default false,
  title_vi text not null,
  title_en text not null,
  excerpt_vi text,
  excerpt_en text,
  intro_vi text,
  intro_en text,
  categories jsonb not null default '[]'::jsonb,
  tone_a text,
  tone_b text,
  read_minutes integer check (read_minutes is null or read_minutes > 0),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_portfolio_insights_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_insights_updated_at on public.portfolio_insights;
create trigger portfolio_insights_updated_at before update on public.portfolio_insights for each row execute function public.set_portfolio_insights_updated_at();

create table if not exists public.portfolio_insight_sections (
  id uuid primary key default gen_random_uuid(),
  insight_id uuid not null references public.portfolio_insights(id) on delete cascade,
  sort_order integer not null default 0,
  title_vi text,
  body_vi text,
  title_en text,
  body_en text,
  blocks jsonb not null default '{"version":1,"items":[]}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_insight_sections add column if not exists updated_at timestamptz not null default now();

create index if not exists portfolio_insight_sections_insight_sort_idx on public.portfolio_insight_sections(insight_id, sort_order);

drop trigger if exists portfolio_insight_sections_updated_at on public.portfolio_insight_sections;
create trigger portfolio_insight_sections_updated_at before update on public.portfolio_insight_sections for each row execute function public.set_portfolio_insights_updated_at();

alter table public.portfolio_insights enable row level security;
alter table public.portfolio_insight_sections enable row level security;
drop policy if exists "published insights are public" on public.portfolio_insights;
drop policy if exists "insights admin write" on public.portfolio_insights;
drop policy if exists "insights admin select" on public.portfolio_insights;
drop policy if exists "insights admin insert" on public.portfolio_insights;
drop policy if exists "insights admin update" on public.portfolio_insights;
drop policy if exists "insights admin delete" on public.portfolio_insights;
drop policy if exists "published insight sections are public" on public.portfolio_insight_sections;
drop policy if exists "insight sections admin write" on public.portfolio_insight_sections;
drop policy if exists "insight sections admin select" on public.portfolio_insight_sections;
drop policy if exists "insight sections admin insert" on public.portfolio_insight_sections;
drop policy if exists "insight sections admin update" on public.portfolio_insight_sections;
drop policy if exists "insight sections admin delete" on public.portfolio_insight_sections;
create policy "published insights are public" on public.portfolio_insights for select to anon, authenticated using (published = true or public.is_portfolio_admin());
create policy "insights admin insert" on public.portfolio_insights for insert to authenticated with check (public.is_portfolio_admin());
create policy "insights admin update" on public.portfolio_insights for update to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "insights admin delete" on public.portfolio_insights for delete to authenticated using (public.is_portfolio_admin());
create policy "published insight sections are public" on public.portfolio_insight_sections for select to anon, authenticated using (public.is_portfolio_admin() or exists (select 1 from public.portfolio_insights i where i.id = insight_id and i.published = true));
create policy "insight sections admin insert" on public.portfolio_insight_sections for insert to authenticated with check (public.is_portfolio_admin());
create policy "insight sections admin update" on public.portfolio_insight_sections for update to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "insight sections admin delete" on public.portfolio_insight_sections for delete to authenticated using (public.is_portfolio_admin());
grant select on public.portfolio_insights, public.portfolio_insight_sections to anon, authenticated;
grant insert, update, delete on public.portfolio_insights, public.portfolio_insight_sections to authenticated;

insert into public.portfolio_insights (slug, sort_order, published, title_vi, title_en, excerpt_vi, excerpt_en, intro_vi, intro_en, categories, tone_a, tone_b, read_minutes, published_at)
values (
  'gemini-4-argon', 1, true,
  'Gemini 4 Argon: signal, hype and the operator view',
  'Gemini 4 Argon: signal, hype and the operator view',
  'Một bài phân tích về cách đọc một làn sóng AI mới: tách năng lực thật khỏi hiệu ứng truyền thông, rồi chọn công cụ dựa trên workflow và bài toán vận hành.',
  'An analysis of how to read a new AI wave: separate real capability from media hype, then choose tools by workflow and operating problem.',
  'Deep-dive editorial về AI, MarTech và cách một Marketing Operator nên đánh giá công nghệ trước khi đưa nó vào hệ thống.',
  'An editorial deep dive into AI, MarTech and how a Marketing Operator should evaluate technology before putting it into a system.',
  '["AI","MarTech","Analysis"]'::jsonb, '#22d3ee', '#a78bfa', 1, now()
) on conflict (slug) do nothing;

insert into public.portfolio_insight_sections (insight_id, sort_order, title_vi, body_vi, title_en, body_en, blocks)
select i.id, section.sort_order, section.title_vi, section.body_vi, section.title_en, section.body_en,
  jsonb_build_object('version', 1, 'items', jsonb_build_array(jsonb_build_object('id', section.block_id, 'type', 'paragraph', 'content', jsonb_build_object('text_vi', section.body_vi, 'text_en', section.body_en), 'settings', '{}'::jsonb)))
from public.portfolio_insights i
cross join (values
  (0, 'The question', 'Không phải model nào đang được nhắc đến nhiều nhất, mà model nào giải quyết được một bước cụ thể trong workflow.', 'The question', 'It is not which model gets the most attention, but which model solves a concrete step in a workflow.', 'gemini-4-argon-1-paragraph'),
  (1, 'Operator lens', 'Đánh giá theo context, reliability, structured output, integration cost và khả năng đo lường sau triển khai.', 'The operator lens', 'Evaluate context, reliability, structured output, integration cost and the ability to measure after deployment.', 'gemini-4-argon-2-paragraph'),
  (2, 'Takeaway', 'Claude Code và MCP vẫn có giá trị khi mục tiêu là xây context-aware systems thay vì chỉ chạy theo benchmark.', 'Takeaway', 'Claude Code and MCP remain valuable when the goal is to build context-aware systems instead of simply chasing benchmarks.', 'gemini-4-argon-3-paragraph')
) as section(sort_order, title_vi, body_vi, title_en, body_en, block_id)
where i.slug = 'gemini-4-argon'
  and not exists (
    select 1 from public.portfolio_insight_sections s
    where s.insight_id = i.id and s.sort_order = section.sort_order
  );
