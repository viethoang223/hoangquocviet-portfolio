# Hoàng Quốc Việt Portfolio

Single-developer, static portfolio for Hoàng Quốc Việt — Marketing Operations, MarTech, AI-enabled Marketing, Research, Data and Workflow Automation.

## Structure

- `index.html` — public portfolio markup and styles; loads the shared layer before the public site layer.
- `shared.js` — data, pure helpers, Supabase REST access, asset loaders, and block engine; safe to load without page markup.
- `site.js` — public DOM rendering, language repainting, modal/viewer UI, routes, and public event subscriptions.
- `admin.html` — noindex admin login and membership gate.
- `admin.js` — CMS loaded only after the gate confirms membership in `portfolio_admins`.
- `assets/` — repository-managed static assets only.
- `legacy/js-modular-old/` — archived, unused modular JavaScript tree.
- `legacy/index.single-file.html` — original single-file source snapshot.

## How it runs

This is a framework-free static site using classic scripts and Supabase REST; it does not use the Supabase SDK. `index.html` loads `shared.js` followed by `site.js`; `admin.html` loads only `shared.js` before its login gate. Deploy the repository to a static host.

For local development, use a static HTTP server rather than opening files with `file://`.

## Project data

Public project, skill, certification, and translation data currently lives in `shared.js`.

Admin translations are merged only when `admin.js` is loaded after successful membership verification.

## Static assets vs Supabase assets

Repository assets belong in `assets/`.

Dynamic portfolio content — avatar, project covers, proofs and galleries — remains in Supabase Storage with metadata in `portfolio_proofs`.

## Supabase

The browser bundle contains only the Supabase project URL and anon key. Admin writes are authorized by Supabase RLS, not by hiding the JavaScript file.

Required external setup:

1. Supabase Auth user for the admin.
2. `portfolio-proofs` Storage bucket.
3. `portfolio_proofs` asset schema with `asset_type`, `owner_type` and `owner_id`.
4. RLS and Storage policies that enforce admin write/delete permissions.
5. Public/read access appropriate for the portfolio proof URLs.

Never place a Supabase service-role key in frontend code.

## Deployment

GitHub → Vercel → `hoangquocviet.id.vn`.

Configure a host rewrite from `/admin` to `admin.html`; GitHub Pages users can open `/admin.html` directly. Host-specific examples and required Supabase setup are in [CHANGES.md](CHANGES.md).

Vercel deployments exclude `legacy/` and `supabase/` through `.vercelignore`. For GitHub Pages, publish from a generated artifact that omits those directories.
