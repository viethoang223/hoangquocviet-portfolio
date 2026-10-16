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

Phase 3 (certificate-management changes) and Phase 4 (Insights migration) are not included in this phase.
