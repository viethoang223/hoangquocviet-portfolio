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
