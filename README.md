# Hoàng Quốc Việt Portfolio

Single-developer, static portfolio for Hoàng Quốc Việt — Marketing Operations, MarTech, AI-enabled Marketing, Research, Data and Workflow Automation.

## Structure

- `index.html` — public semantic HTML structure.
- `css/style.css` — extracted visual system and responsive styles.
- `js/main.js` — application entry point and public rendering coordination.
- `js/projects.js` — project, skill and certification data.
- `js/i18n.js` — Vietnamese / English translation data.
- `js/config.js` — public configuration; no secrets.
- `js/state.js` — shared application state.
- `js/utils.js` — small shared helpers.
- `js/ui/` — navigation, animation, project and proof viewer behavior.
- `js/services/` — Supabase REST, authentication and asset services.
- `js/admin/` — hidden admin UI and asset management.
- `assets/` — repository-managed static assets only.
- `legacy/index.single-file.html` — original single-file source snapshot.

## How it runs

This is a framework-free static site using native ES modules. Deploy the repository directly to Vercel or another static host.

For local development, use any static HTTP server because native ES modules should be served over HTTP rather than opened with `file://`.

## Project data

Project, skill and certification content lives in `js/projects.js`.

Translations live in `js/i18n.js`.

## Static assets vs Supabase assets

Repository assets belong in `assets/`.

Dynamic portfolio content — avatar, project covers, proofs and galleries — remains in Supabase Storage with metadata in `portfolio_proofs`.

## Supabase

Configure `js/config.js` with the Supabase project URL and anon key only.

Required external setup:

1. Supabase Auth user for the admin.
2. `portfolio-proofs` Storage bucket.
3. `portfolio_proofs` asset schema with `asset_type`, `owner_type` and `owner_id`.
4. RLS and Storage policies that enforce admin write/delete permissions.
5. Public/read access appropriate for the portfolio proof URLs.

Never place a Supabase service-role key in frontend code.

## Deployment

GitHub → Vercel → `hoangquocviet.id.vn`.

Use relative paths such as `./css/style.css` and `./js/main.js`.
