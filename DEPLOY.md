# Triển khai Phase 6

## 1. Chuẩn bị

1. Backup metadata trước khi chạy SQL: `portfolio_proofs`, `portfolio_content`, `portfolio_projects` và `portfolio_project_sections`.
2. Deploy code cùng cache version hiện tại `20261017`.
3. Không điền email, domain hoặc nội dung Insight thay cho chủ sở hữu.

## 2. Thứ tự SQL

Chạy trong Supabase SQL Editor, theo thứ tự timestamp:

1. `20261014180000_portfolio_admins_and_rls.sql` - tạo admin gate và policy phụ thuộc `public.is_portfolio_admin()`.
2. `20261014180100_portfolio_proofs_constraints.sql` - owner/asset constraints và admin write policy.
3. `20261016220000_cert_owner_id_map.sql` - chạy cùng lúc với code Phase 4/5/6.
4. `20261017000000_portfolio_insights_phase5.sql` - bảng, seed, trigger và RLS Insights.
5. `20261017010000_phase6_rls_storage_hardening.sql` - draft-content RLS và Storage prefix policies, gồm `insights/`.
6. `20261014171942_harden_portfolio_proofs_bucket.sql` - bucket limits; chạy sau khi bucket đã tồn tại.

Migrations `20261014180200_certificate_owner_ids.sql` và `20261014180300_portfolio_insights.sql` là lịch sử Phase 4/đầu Phase 5 trong workspace; không chạy lại nếu chúng đã được áp dụng. Kiểm tra bằng `supabase/scripts/cert_owner_ids.sql`, `supabase/scripts/insights_check.sql` và `supabase/scripts/rls_check.sql` sau các bước tương ứng.

## 3. Admin và hosting

1. Tạo user trong Supabase Auth.
2. Thêm user đó vào `public.portfolio_admins` bằng UUID Auth thật.
3. Rewrite `/admin` tới `/admin.html` trên Vercel/Netlify; GitHub Pages mở trực tiếp `/admin.html`.
4. Giữ `.vercelignore` loại `legacy/` và `supabase/` khỏi artifact public.
5. Khi deploy bản JS mới, tăng cùng giá trị `?v=` trong `index.html` và `admin.html`.

## 4. Quyết định của chủ sở hữu

- `CONFIG.email` đang rỗng: chọn email nhận form và xác nhận email lần đầu với FormSubmit.
- Quyết định bản dịch tiêu đề VI của Insight seed hiện giữ nguyên source title tiếng Anh theo J1.
- Chọn/chỉnh nội dung Insight đầu tiên trước khi publish.
- Cấu hình domain và rewrite hosting.

## 5. Smoke test

Kiểm tra VI/EN, Project, Insight card/article, proof/cover, lightbox + Escape, certificate detail/viewer, admin non-admin/admin/logout, tạo Insight có section/media rồi Save Draft, Preview, Publish, sửa draft khi live, Unpublish, Delete, certificate rename giữ proof và rollback khi mock lỗi.

## 6. Kiểm thử cục bộ và kiểm tay

- B1a đã kiểm trên PGlite in-memory: toàn bộ 8 migrations chạy hai lượt; seed có một bài/ba sections; sửa title thủ công rồi chạy lại seed vẫn giữ nguyên.
- B1c chưa được xác minh động: hai lượt harness dừng ở cú pháp stub `storage.foldername` trước khi chạy policy assertions; không có kết nối Supabase thật. Chạy `supabase/scripts/rls_check.sql` để kiểm tra trạng thái RLS/policy, rồi dùng anon client xác nhận chỉ `global.published.%` đọc được và ba nhóm draft (`project.draft.%`, `insight.draft.%`, `global.draft.%`) không đọc được. Dùng authenticated non-admin xác nhận draft vẫn bị chặn; dùng Auth admin xác nhận đọc/ghi CRUD được.
- B1b chưa kết luận: ma trận PGlite chạy được migrations nhưng synthetic identity cho kết quả trái kỳ vọng (non-admin ghi/xóa draft trong một số bảng, admin bị từ chối ở `portfolio_admins`). Không dùng kết quả này làm PASS/FAIL cho Supabase. Chạy `supabase/scripts/rls_check.sql`, sau đó kiểm đủ SELECT/INSERT/UPDATE/DELETE cho anon, authenticated non-admin và admin trên cả bảy bảng bằng local Supabase Auth/JWT thật.
- B1d kiểm một phần trên PGlite: `insight`/`insight_cover` được nhận, owner/asset type sai bị từ chối; Storage policy cho phép `insights` và `foldername('insights/<slug>/...')` trả `insights`. Admin upload authorization cho prefix hợp lệ/không hợp lệ chưa được xác minh bằng role thực; chỉ kiểm local trước production.
- B2 đã xác minh bằng mock localhost: `requestSubmit()` với `mock@example.com` ẩn form và mount CMS/grid; logout gỡ CMS/grid và hiện lại form. Đây không phải tài khoản Supabase thật.
- B4 chưa được xác minh đầy đủ: workspace và `phase6-progress.md` không chứa acceptance criteria K2-K11; chỉ có điều kiện K1 về `data-section-host`, đã thấy code dùng chung editor ở `admin.js`. Cần khôi phục danh sách K1-K11 của phiên trước rồi đối chiếu từng điều kiện, không suy ra từ nhãn K.
- B5 kiểm một phần trên mock localhost: tạo Insight text-only, Save Draft, Publish, Unpublish, Delete đều chạy; sau Delete không còn row, section hoặc draft. Chưa chạy Preview, upload cover/proof nhiều định dạng, chặn xóa asset có block reference, J6 hai chiều hoặc rename certificate giữ nguyên proof. Không dùng Supabase thật.
- B6b đã xác minh: 14 ảnh 390×844/1440×1000 đã lưu trong `%TEMP%\phase6b-screenshots` và được xem; toàn bộ phép đo `scrollWidth<=innerWidth` (mobile 360/390, desktop 1410/1440; admin 390/390 và 1440/1440). Home, Insights, Insight article, case fixture, certificate và admin đều có ảnh; article/case/certificate dialog mở đúng.
- B6e đã xác minh trên tab browser active: Enter mở card Insight, Escape đóng dialog và trả focus về anchor mới sau khi async Insights render thay node; aria-label lightbox và login language group đã kiểm tra VI/EN.

## 7. Rollback

Redeploy code bản trước và khôi phục metadata từ backup. Không tự rollback các migration schema đã áp dụng; đánh giá thủ công hậu quả của dữ liệu Insight, draft và Storage object đã tạo sau deploy.
