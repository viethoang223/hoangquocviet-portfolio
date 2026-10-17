create table if not exists public.portfolio_insights (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
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
  read_minutes integer not null default 5,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_insight_sections (
  id uuid primary key default gen_random_uuid(),
  insight_id uuid not null references public.portfolio_insights(id) on delete cascade,
  sort_order integer not null default 0,
  title_vi text,
  body_vi text,
  title_en text,
  body_en text,
  blocks jsonb not null default '{"version":1,"items":[]}'::jsonb
);

alter table public.portfolio_insights enable row level security;
alter table public.portfolio_insight_sections enable row level security;
drop policy if exists "published insights are public" on public.portfolio_insights;
create policy "published insights are public" on public.portfolio_insights for select to anon, authenticated using (published = true or public.is_portfolio_admin());
drop policy if exists "insights admin write" on public.portfolio_insights;
create policy "insights admin write" on public.portfolio_insights for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
drop policy if exists "published insight sections are public" on public.portfolio_insight_sections;
create policy "published insight sections are public" on public.portfolio_insight_sections for select to anon, authenticated using (exists (select 1 from public.portfolio_insights i where i.id = insight_id and (i.published = true or public.is_portfolio_admin())));
drop policy if exists "insight sections admin write" on public.portfolio_insight_sections;
create policy "insight sections admin write" on public.portfolio_insight_sections for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

insert into public.portfolio_insights (slug, sort_order, published, title_vi, title_en, excerpt_vi, excerpt_en, intro_vi, intro_en, categories, tone_a, tone_b, read_minutes, published_at)
values (
  'gemini-4-argon', 1, true,
  'Gemini 4 Argon: tín hiệu, hype và góc nhìn của người vận hành',
  'Gemini 4 Argon: signal, hype and the operator view',
  'Một bài phân tích cách tách năng lực thật khỏi hiệu ứng truyền thông AI và chọn công cụ theo workflow.',
  'An analysis of separating real AI capability from media hype and choosing tools by workflow fit.',
  'Deep-dive về cách một Marketing Operator đánh giá công nghệ trước khi đưa nó vào hệ thống.',
  'A deep dive into how a Marketing Operator should evaluate technology before putting it into a system.',
  '["AI","MarTech","Analysis"]'::jsonb, '#22d3ee', '#a78bfa', 7, now()
) on conflict (slug) do nothing;

insert into public.portfolio_insight_sections (insight_id, sort_order, title_vi, body_vi, title_en, body_en, blocks)
select id, 0,
  'Câu hỏi đúng', 'Không phải model nào được nhắc đến nhiều nhất, mà model nào giải quyết được một bước cụ thể trong workflow.',
  'The right question', 'The question is not which model gets the most attention, but which one solves a concrete step in a workflow.',
  '{"version":1,"items":[]}'::jsonb from public.portfolio_insights where slug = 'gemini-4-argon'
  and not exists (select 1 from public.portfolio_insight_sections s where s.insight_id = public.portfolio_insights.id);
