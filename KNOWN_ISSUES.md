# Known Issues

- Hash routes do not provide separate Open Graph/SEO metadata for each Insight article.
- `admin.js` is a static browser asset; security relies on Supabase Auth and RLS, not on hiding the file.
- The Supabase anon key is public by design. Never place a service-role key in frontend files.
- `CONFIG.email` remains empty until the owner chooses the receiving contact address.
- Native Supabase/PGlite behavior must be verified in the temporary Phase 6 harness before deployment. No real database migration or SQL was run; one initial unmocked B2 login request reached the configured Auth endpoint and returned HTTP 400 before authentication, and all subsequent browser tests were routed to localhost.
- The Phase 6b mock console sweep is clean for 0/1/3 Insights and `/admin` at 390px/1440px. An intentional HTTP 500 produces Chromium's native `Failed to load resource` console error at both widths, although there is no `pageerror` or application `console.error`; decide whether this expected network diagnostic is excluded from the V13 clean-console gate.
