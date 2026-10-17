# Changes

## Current implementation

- Removed the public DOM guard that deleted runtime nodes and broke language switching and preview routing.
- Added idempotent Supabase migrations for administrator membership, asset owner constraints, stable certificate owner IDs, and the Insights schema plus seed content.
- Added a stable owner-ID migration for the nine certificate/experience targets and a diagnostic query for rows that need manual review.
- Added `admin.html` as the private route entry point.
- Audit follow-up: made the admin gate migration rerunnable without dropping its dependent function, made the Insights seed fill missing sections individually, restored a fallback article for an empty Insights table, and preserved focus when Insights refresh replaces the opened card.
- Localized lightbox and admin-login language accessible names in VI/EN.

## Migration order

1. `20261014180000_portfolio_admins_and_rls.sql`
2. `20261014180100_portfolio_proofs_constraints.sql`
3. `20261016220000_cert_owner_id_map.sql` (deploy with the matching certificate code)
4. `20261017000000_portfolio_insights_phase5.sql`
5. `20261017010000_phase6_rls_storage_hardening.sql`
6. `20261014171942_harden_portfolio_proofs_bucket.sql` (after the bucket exists)

Migrations `20261014180200_certificate_owner_ids.sql` and `20261014180300_portfolio_insights.sql` are historical Phase 4/early Phase 5 files; do not rerun them on an existing deployment. Use `DEPLOY.md` for backup, diagnostics, local verification, and owner decisions. Add the authenticated admin user's UUID to `public.portfolio_admins` after step 1. Do not put a service-role key in the frontend.

## Manual checks still required

- Run `supabase/scripts/cert_owner_ids.sql` and review unmapped legacy owner IDs.
- Run `supabase/scripts/insights_check.sql` and `supabase/scripts/rls_check.sql` after their migrations; verify draft and Storage write policies with the local/manual checks in `DEPLOY.md`.
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

## Phase 4 — Certificates & Achievements

- Certificate groups round-trip as one normalized JSON array in both `experience` value columns. Titles and descriptions retain `{vi,en}` pairs; fixed IDs, issuer, date, and verification URL remain scalars. Legacy `anthropic` / `marketing` / `english` objects still convert to the nine-item shape.
- The admin certificate panel has four groups and nine fixed, read-only IDs. IDs are stable across title edits: `exp-vice-head-comms`, `anthropic-claude-101`, `anthropic-claude-code-101`, `anthropic-claude-code-in-action`, `anthropic-mcp-intro`, `anthropic-mcp-advanced`, `google-ga4`, `hubspot-inbound`, and `toeic-sw-260`.
- Proof uploads for both `experience` and `certificate` are stored as separate assets (no automatic gallery). Evidence is ordered by `sort_order`; covers use `cert_cover` and are replaced only after a successful new upload.
- Public certificate badges open `#/cert/<id>`. The legacy `#cert/<id>` route is redirected to that canonical form. Open certificate details refresh when global content, projects, assets, or language changes.

| Legacy owner ID / database row | Stable ID | Owner type |
| --- | --- | --- |
| `01cb63f2-0582-4fb6-981e-76d187ebe9ef` (`cert-english-toeic-speaking-writing-260-speaking-110-writing-150`) | `toeic-sw-260` | `certificate` |
| `c1b83360-b3cd-4994-8ea4-9e0c620a581c` (`cert-marketing-google-analytics-ga4-certification-hubspot-inbound-certification`) | `google-ga4` | `certificate` |
| `experience-communications` | `exp-vice-head-comms` | `experience` |
| `cert-experience-communications-pho-chu-nhiem-truyen-thong` | `exp-vice-head-comms` | `experience` |
| `cert-anthropic-claude-101` | `anthropic-claude-101` | `certificate` |
| `cert-anthropic-claude-code-101` | `anthropic-claude-code-101` | `certificate` |
| `cert-anthropic-claude-code-in-action` | `anthropic-claude-code-in-action` | `certificate` |
| `cert-anthropic-introduction-to-model-context-protocol` | `anthropic-mcp-intro` | `certificate` |
| `cert-anthropic-model-context-protocol-advanced-topics` | `anthropic-mcp-advanced` | `certificate` |
| `cert-marketing-hubspot-inbound-certification` (logical ID; no separate HubSpot proof row exists) | `hubspot-inbound` | `certificate` |

The existing marketing proof row contains one image for both GA4 and HubSpot in its title. The migration assigns that row to `google-ga4` only; it does not duplicate the storage object. If that assignment is not correct, reassign the evidence in the certificate admin panel.

### Phase 4 Deployment Order

1. Export the affected `portfolio_proofs` metadata before deployment so a rollback can restore the original owner IDs and titles without changing `storage_path`.
2. Deploy the Phase 4 code and run `supabase/migrations/20261016220000_cert_owner_id_map.sql` immediately in the same release, before opening the new public/admin pages. The new code resolves evidence only by stable IDs.
3. Run `supabase/scripts/cert_owner_ids.sql` before and after the migration to review current and expected mappings. Check the migration's `NOTICE` output for any remaining owner IDs.

To roll back, restore the captured owner ID/type/title values for affected proof rows while preserving every `storage_path`, then redeploy the previous application version. Include any certificate assets uploaded or reassigned after deployment in that metadata restore. The migration intentionally does not create a backup table or move/delete Storage objects.

Phase 5 is Insights data plus public rendering. Phase 6 is the Insights CMS and deployment checklist; Phase 6 is the final phase.

### Phase 5 - Insights

- Added public Insights loading, the shared project/article renderer, Insight cards, canonical routes `#/insight/<slug>` and proof viewers, with VI/EN switching.
- Empty published data stays empty; fallback content is used only for load, network, or schema errors.
- Added `portfolio_insights` and `portfolio_insight_sections` with public-read/admin-write RLS and an idempotent seed in `supabase/migrations/20261017000000_portfolio_insights_phase5.sql`.
- Deploy SQL in this order: (1) admins + RLS, (2) proofs constraints, (3) certificate owner map together with the code, (4) Insights migration. Run `supabase/scripts/insights_check.sql` after step 4.
- Phase 5 does not add Insights CMS controls. Phase 6 adds the CMS and final QA/deploy checklist.

### Phase 6 - Final Insights CMS and hardening

- Added authenticated Insights CMS loading all published and draft records, draft Save/Preview/Publish/Unpublish/Delete actions, section editing, public owner selection, and Insight storage paths.
- Added draft RLS and Storage policies for `insights/`, corrected the Phase 5 seed to one minute and the source title, and made lightbox Escape deterministic.
- Added cache-busting `?v=20261017`, `supabase/scripts/rls_check.sql`, `DEPLOY.md`, and `KNOWN_ISSUES.md`. Increase the shared version in both HTML files for each deployment.
- Phase 6 manual deployment work and owner decisions are documented in `DEPLOY.md`.
