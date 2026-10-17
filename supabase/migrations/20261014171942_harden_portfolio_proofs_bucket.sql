-- Original bucket configuration before this migration:
-- file_size_limit = NULL
-- allowed_mime_types = NULL
--
-- The three legacy storage policies below matched the placeholder admin email
-- YOUR_ADMIN_EMAIL@example.com and are intentionally removed by this migration.

update storage.buckets
set
  file_size_limit = 52428800,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'image/svg+xml',
    'application/pdf',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/aac',
    'audio/flac',
    'application/json',
    'text/csv',
    'text/plain',
    'application/zip',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
where id = 'portfolio-proofs';

-- Remove legacy policies that hard-code YOUR_ADMIN_EMAIL@example.com.
drop policy if exists "portfolio admin asset delete" on storage.objects;
drop policy if exists "portfolio admin asset insert" on storage.objects;
drop policy if exists "portfolio admin asset update" on storage.objects;

-- ROLLBACK (run manually only after confirming the migration is being reverted):
-- update storage.buckets
-- set file_size_limit = null, allowed_mime_types = null
-- where id = 'portfolio-proofs';
--
-- create policy "portfolio admin asset delete"
-- on storage.objects for delete
-- using (
--   bucket_id = 'portfolio-proofs'
--   and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com'
-- );
--
-- create policy "portfolio admin asset insert"
-- on storage.objects for insert
-- with check (
--   bucket_id = 'portfolio-proofs'
--   and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com'
-- );
--
-- create policy "portfolio admin asset update"
-- on storage.objects for update
-- using (
--   bucket_id = 'portfolio-proofs'
--   and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com'
-- )
-- with check (
--   bucket_id = 'portfolio-proofs'
--   and (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL@example.com'
-- );
