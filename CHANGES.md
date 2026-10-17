# Changes

## Current implementation

- Removed the public DOM guard that deleted runtime nodes and broke language switching and preview routing.
- Added idempotent Supabase migrations for administrator membership, asset owner constraints, stable certificate owner IDs, and the Insights schema plus seed content.
- Added a stable owner-ID migration for the nine certificate/experience targets and a diagnostic query for rows that need manual review.
- Added `admin.html` as the private route entry point.

## Migration order

1. `20261014180000_portfolio_admins_and_rls.sql`
2. `20261014180100_portfolio_proofs_constraints.sql`
3. `20261014180200_certificate_owner_ids.sql`
4. `20261014180300_portfolio_insights.sql`
5. Existing bucket migration: `20261014171942_harden_portfolio_proofs_bucket.sql`

Run the files in Supabase SQL Editor in this order. Add the authenticated admin user's UUID to `public.portfolio_admins` after step 1. Do not put a service-role key in the frontend.

## Manual checks still required

- Run the diagnostic query in the certificate migration and review any unmapped legacy owner IDs.
- Confirm Storage policies use `public.is_portfolio_admin()` for insert, update, and delete.
- Configure the hosting rewrite so `/admin` serves `admin.html`.

## Phase 2 — Public/Admin Separation

- Moved the unused modular tree to `legacy/js-modular-old/` and kept the public site on classic scripts.
- Split the public read-only runtime into `shared.js`; the login and `portfolio_admins` membership gate lives in `admin.html`; the CMS is mounted from `admin.js` only after membership is confirmed.
- Public pages use the Supabase anon key only. RLS remains the security boundary for database and Storage writes.
- Important: `admin.js` is still a static, publicly retrievable file. Loading it only after login is a UX/code-loading choice, not a security control.

### `/admin` Hosting Rewrite

Netlify `_redirects`:

```text
/admin /admin.html 200
```

Vercel `vercel.json`:

```json
{"rewrites":[{"source":"/admin","destination":"/admin.html"}]}
```

GitHub Pages does not provide this rewrite by default; use `/admin.html` directly.

### Manual Supabase Setup

- If not already applied, run migrations `20261014180000_portfolio_admins_and_rls.sql` and `20261014180100_portfolio_proofs_constraints.sql` in the Supabase SQL Editor.
- Create the administrator user in Supabase Auth.
- Add the Auth user's UUID and email to the membership table:

```sql
insert into public.portfolio_admins(user_id, email)
values ('<auth-user-uuid>', 'you@example.com')
on conflict do nothing;
```

- Test that an account absent from `portfolio_admins` cannot write through RLS. Client-side membership checks are only for UX.
- `.vercelignore` excludes `legacy/` and `supabase/` from Vercel deployments. GitHub Pages root deployments need a separate build/deploy workflow to keep these folders out of the published artifact.

## Phase 3 — Stabilization and Layer Split

- Split the runtime into `shared.js` (data, pure helpers, Supabase REST and block engine), `site.js` (public DOM, rendering and routes), `admin.js` (CMS), and `admin.html` (login gate, auth provider and admin styles). `index.html` loads `shared.js` before `site.js`; the image lightbox remains inline.
- Loaders now update data state and emit `projects`, `assets`, and `global`; language changes use `HQVShared.setLang()` and emit `lang`. Public rendering is subscribed from `site.js`.
- Centralized admin session ownership in `HQVShared.auth`: proactive fresh-token checks, single-flight refresh, one retry after 401, remote best-effort logout, and an async fresh-token helper for Storage requests.
- Fixed B1–B2 by removing public DOM rendering from Global lifecycle writes and composing fallback, published, and draft content before editing.
- Fixed B3 by awaiting asset-reference guards and sending block messages to the owning status region; fixed B4 by removing the duplicate admin.js session and refresh provider.
- Fixed B5 by moving public rendering, routes, viewers, and listeners into `site.js`; the admin evidence preview now uses its own asset opener. Fixed B6 by assigning Global CMS/admin styles to `admin.html`.
- Fixed B7 by moving VI/EN controls into the mounted CMS and preserving editor text and select values; fixed B8 with best-effort remote sign-out and a silent return to login.
- Fixed B9 by rejecting reserved project slugs (`cert`, `insight`, `admin`) with localized errors.
- Deferred known issues: Insight links still read `p.content`; certificate badges still use the legacy `#cert/<id>` route; certificate metadata still does not round-trip through storage; certificate cover upload/remove controls still have no handler. These remain later-phase work.
- The brief identifies Phase 4 certificate work and Phase 5 Insights work. It does not define the other two phases in the five-phase remaining roadmap, so they are intentionally not inferred here.
