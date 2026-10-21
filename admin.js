(()=>{
'use strict';
let controller=null;
let unsubscribers=[];
let globalPreviewWindow=null;
let globalPreviewSnapshot=null;
const VISITOR_ADMIN_MARKUP=`<section class="admin-project-management visitor-admin" id="visitorAdmin">
  <div class="admin-project-head">
    <div><h3>Visitor analytics</h3><p class="admin-note">Danh sách xếp theo số lượt ghi nhận trên mỗi IP. Chỉ tài khoản admin đã xác minh mới xem được IP.</p></div>
    <button class="admin-btn" id="refreshVisitorsBtn" type="button">Làm mới</button>
  </div>
  <div class="visitor-admin-summary" id="visitorAdminSummary"></div>
  <div class="admin-status" id="visitorAdminStatus" role="status" aria-live="polite"></div>
  <div class="visitor-admin-list" id="visitorAdminList"></div>
</section>`;
const ADMIN_MARKUP="<dialog id=\"mediaLibraryDialog\" class=\"media-library-dialog\" aria-modal=\"true\" aria-label=\"Shared Media Library\">\r\n  <div class=\"media-library-shell\">\r\n    <div class=\"media-library-head\">\r\n      <div><div class=\"admin-kicker\">HQV · MEDIA</div><h3 data-media-title>Media Library</h3><p data-media-copy></p></div>\r\n      <button class=\"admin-close\" type=\"button\" data-media-close aria-label=\"Close\">✕</button>\r\n    </div>\r\n    <div class=\"media-library-toolbar\">\r\n      <input class=\"admin-input\" type=\"search\" data-media-query>\r\n      <select class=\"admin-select\" data-media-filter>\r\n        <option value=\"all\">All</option><option value=\"image\">Image</option><option value=\"video\">Video</option><option value=\"audio\">Audio</option><option value=\"pdf\">PDF</option><option value=\"file\">File / Other</option>\r\n      </select>\r\n      <select class=\"admin-select\" data-media-project><option value=\"\">All Projects</option></select>\r\n      <button class=\"admin-btn\" type=\"button\" data-media-upload>Upload media</button>\r\n    </div>\r\n    <div class=\"media-library-body\">\r\n      <div class=\"media-library-grid\" data-media-grid></div>\r\n      <aside class=\"media-library-detail\" data-media-detail></aside>\r\n    </div>\r\n    <div class=\"media-library-foot\">\r\n      <div class=\"admin-status\" data-media-status aria-live=\"polite\"></div>\r\n      <div class=\"media-library-actions\">\r\n        <button class=\"admin-btn\" type=\"button\" data-media-close>Cancel</button>\r\n        <button class=\"admin-btn primary\" type=\"button\" data-media-confirm>Insert</button>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</dialog>\n<dialog id=\"adminDialog\" class=\"admin-dialog\" aria-modal=\"true\" aria-label=\"Admin asset manager\">\r\n  <div class=\"admin-scroll\">\r\n    <div class=\"admin-head\"><div><div class=\"admin-kicker\">HQV · ADMIN</div><h2 class=\"admin-title\" data-i18n=\"admin.title\">Asset manager</h2><p class=\"admin-note\" data-i18n=\"admin.subtitle\">Quản lý Avatar, Project Cover và Proof bằng Supabase Storage + Database.</p></div><button class=\"admin-close\" type=\"button\" data-close=\"admin\" aria-label=\"Đóng\">✕</button></div>\n    <div id=\"adminPanel\">\r\n       <section class=\"admin-card global-cms\" id=\"globalContentManager\">\r\n         <div class=\"global-cms-head\">\r\n           <div>\r\n             <div class=\"admin-kicker\">HQV · GLOBAL CMS</div>\r\n             <h3 data-i18n=\"admin.globalContent\">GLOBAL CONTENT</h3>\r\n             <p class=\"admin-note\" data-i18n=\"admin.globalContentCopy\">Chỉnh sửa Home, Approach, Skills, Experience, Contact và Footer mà không thay đổi hệ thống layout.</p>\r\n           </div>\r\n           <span id=\"globalLifecycleBadge\" class=\"global-status-badge draft\">DRAFT</span>\r\n         </div>\r\n         <div class=\"global-tabs\" role=\"tablist\" aria-label=\"Global content sections\">\r\n           <button class=\"global-tab is-active\" role=\"tab\" aria-selected=\"true\" type=\"button\" data-global-tab=\"home\" data-i18n=\"admin.globalHome\">Home</button>\r\n           <button class=\"global-tab\" role=\"tab\" aria-selected=\"false\" type=\"button\" data-global-tab=\"approach\" data-i18n=\"admin.globalApproach\">Approach</button>\r\n           <button class=\"global-tab\" role=\"tab\" aria-selected=\"false\" type=\"button\" data-global-tab=\"skills\" data-i18n=\"admin.globalSkills\">Skills</button>\r\n           <button class=\"global-tab\" role=\"tab\" aria-selected=\"false\" type=\"button\" data-global-tab=\"experience\" data-i18n=\"admin.globalExperience\">Experience</button>\r\n           <button class=\"global-tab\" role=\"tab\" aria-selected=\"false\" type=\"button\" data-global-tab=\"contact\" data-i18n=\"admin.globalContact\">Contact</button>\r\n           <button class=\"global-tab\" role=\"tab\" aria-selected=\"false\" type=\"button\" data-global-tab=\"footer\" data-i18n=\"admin.globalFooter\">Footer</button>\r\n         </div>\r\n         <div id=\"globalContentEditor\" class=\"global-editor\"></div>\r\n         <div class=\"global-status-row\">\r\n           <div id=\"globalContentStatus\" class=\"admin-status\" aria-live=\"polite\"></div>\r\n           <div class=\"global-actions\">\r\n             <button class=\"admin-btn\" type=\"button\" id=\"globalSaveDraftBtn\" data-i18n=\"admin.saveDraft\">Save Draft</button>\r\n             <button class=\"admin-btn\" type=\"button\" id=\"globalPreviewBtn\" data-i18n=\"admin.previewDraft\">Preview Draft</button>\r\n             <button class=\"admin-btn primary\" type=\"button\" id=\"globalPublishBtn\" data-i18n=\"admin.publish\">Publish</button>\r\n             <button class=\"admin-btn danger\" type=\"button\" id=\"globalUnpublishBtn\" data-i18n=\"admin.unpublish\">Unpublish</button>\r\n           </div>\r\n         </div>\r\n       </section>\r\n\r\n      <section class=\"admin-project-management\">\r\n        <div class=\"admin-project-head\">\r\n          <div>\r\n            <h3 data-i18n=\"admin.projectManagement\">Project Management</h3>\r\n            <p class=\"admin-note\" data-i18n=\"admin.projectManagementCopy\">Quản lý Project và Case Study content. Project tách biệt hoàn toàn khỏi Proof.</p>\r\n          </div>\r\n          <button class=\"admin-btn primary\" type=\"button\" id=\"newProjectBtn\" data-i18n=\"admin.newProject\">+ New Project</button>\r\n        </div>\r\n        <div id=\"projectManagementList\" class=\"admin-project-list\"></div>\r\n        <div class=\"admin-actions\">\r\n          <button class=\"admin-btn\" type=\"button\" id=\"migrateProjectsBtn\" data-i18n=\"admin.migrateProjects\">Migrate existing Projects</button>\r\n        </div>\r\n        <p class=\"admin-note\" data-i18n=\"admin.migrateCopy\">Migrate idempotently từ hardcoded PROJECTS sang portfolio_projects và portfolio_project_sections.</p>\r\n        <div id=\"projectEditor\" class=\"admin-project-editor\" hidden>\r\n          <form class=\"admin-form\" id=\"projectForm\">\r\n            <input type=\"hidden\" id=\"projectDbId\">\r\n            <div class=\"admin-row\">\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.slug\">Slug</span><input class=\"admin-input\" id=\"projectSlug\" required pattern=\"[a-z0-9]+(?:-[a-z0-9]+)*\"></label>\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.sortOrder\">Sort order</span><input class=\"admin-input\" id=\"projectSortOrder\" type=\"number\" min=\"0\" step=\"1\" required></label>\r\n            </div>\r\n            <div class=\"admin-row\">\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.titleVi\">Tiêu đề VI</span><input class=\"admin-input\" id=\"projectTitleVi\" required></label>\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.titleEn\">Title EN</span><input class=\"admin-input\" id=\"projectTitleEn\" required></label>\r\n            </div>\r\n            <div class=\"admin-row\">\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.hookVi\">Hook VI</span><textarea class=\"admin-textarea\" id=\"projectHookVi\"></textarea></label>\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.hookEn\">Hook EN</span><textarea class=\"admin-textarea\" id=\"projectHookEn\"></textarea></label>\r\n            </div>\r\n            <div class=\"admin-row\">\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.introVi\">Intro VI</span><textarea class=\"admin-textarea\" id=\"projectIntroVi\"></textarea></label>\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.introEn\">Intro EN</span><textarea class=\"admin-textarea\" id=\"projectIntroEn\"></textarea></label>\r\n            </div>\r\n            <div class=\"admin-row\">\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.categories\">Categories</span><input class=\"admin-input\" id=\"projectCategories\" placeholder=\"Marketing, AI, Automation\"></label>\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.visualType\">Visual type</span><input class=\"admin-input\" id=\"projectVisualType\" value=\"web\"></label>\r\n            </div>\r\n            <div class=\"admin-row\">\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.toneA\">Tone A</span><input class=\"admin-input\" id=\"projectToneA\" placeholder=\"#22d3ee\"></label>\r\n              <label class=\"admin-label\"><span data-i18n=\"admin.toneB\">Tone B</span><input class=\"admin-input\" id=\"projectToneB\" placeholder=\"#5b7cfa\"></label>\r\n            </div>\r\n            <label class=\"admin-label\"><span data-i18n=\"admin.stats\">Stats JSON</span><textarea class=\"admin-textarea admin-project-json\" id=\"projectStats\" placeholder='[[\"193\",\"valid responses\"],[\"0.849\",\"KMO\"]]'></textarea></label>\r\n            <div class=\"project-editor-lifecycle\">\r\n  <span id=\"projectLifecycleBadge\" class=\"project-lifecycle-badge draft\">DRAFT</span>\r\n  <div class=\"project-lifecycle-actions\">\r\n    <button class=\"admin-btn\" type=\"button\" id=\"saveProjectDraftBtn\" data-i18n=\"admin.saveDraft\">Save Draft</button>\r\n    <button class=\"admin-btn\" type=\"button\" id=\"previewProjectDraftBtn\" data-i18n=\"admin.previewDraft\">Preview Draft</button>\r\n    <button class=\"admin-btn primary\" type=\"button\" id=\"publishProjectBtn\" data-i18n=\"admin.publish\">Publish</button>\r\n    <button class=\"admin-btn danger\" type=\"button\" id=\"unpublishProjectBtn\" data-i18n=\"admin.unpublish\">Unpublish</button>\r\n  </div>\r\n</div>\r\n            <div>\r\n              <div class=\"admin-project-head\"><div><strong data-i18n=\"admin.sections\">Case Study sections</strong><p class=\"admin-note\" data-i18n=\"admin.sectionsCopy\">Nội dung Case Study được lưu ở portfolio_project_sections, không lấy từ Proof metadata.</p></div><button class=\"admin-btn\" type=\"button\" id=\"addProjectSectionBtn\" data-i18n=\"admin.addSection\">+ Section</button></div>\r\n              <div id=\"projectSectionsEditor\" class=\"admin-section-editor\"></div>\r\n            </div>\r\n            <div class=\"admin-project-media\" id=\"projectMediaManager\">\r\n              <div class=\"admin-project-head\"><div><strong data-i18n=\"admin.projectMedia\">Project Media</strong><p class=\"admin-note\" data-i18n=\"admin.projectMediaCopy\">Cover và article media dùng lại asset registry hiện tại. Không tạo bảng hoặc schema mới.</p></div><button class=\"admin-btn\" type=\"button\" id=\"projectAddMediaBtn\" data-i18n=\"admin.addMedia\">+ Add media</button></div>\r\n              <div id=\"projectMediaList\" class=\"admin-media-list\"></div>\r\n            </div>\r\n            <div class=\"admin-actions\">\r\n              <button class=\"admin-btn\" type=\"button\" id=\"cancelProjectBtn\" data-i18n=\"admin.cancel\">Cancel</button>\r\n            </div>\r\n            <div id=\"projectStatus\" class=\"admin-status\" aria-live=\"polite\"></div>\r\n          </form>\r\n        </div>\r\n      </section>\r\n      <div class=\"admin-asset-sections\">\r\n        <section class=\"admin-asset-card\">\r\n          <h3 data-i18n=\"admin.avatarTitle\">Profile avatar</h3><p data-i18n=\"admin.avatarCopy\">Một avatar dùng chung cho toàn bộ homepage. Ảnh mới chỉ trở thành avatar active sau khi Storage và metadata đều thành công.</p>\r\n          <form class=\"admin-form\" id=\"avatarUploadForm\"><label class=\"admin-label\"><span data-i18n=\"admin.files\">File</span><input class=\"admin-input\" id=\"avatarFile\" type=\"file\" accept=\"image/*\" required></label><div class=\"admin-actions\"><button class=\"admin-btn primary\" type=\"submit\" id=\"avatarUploadBtn\" data-i18n=\"admin.uploadAvatar\">Upload avatar</button></div><div id=\"avatarUploadStatus\" class=\"admin-status\" aria-live=\"polite\"></div></form>\r\n          <div id=\"adminAvatarState\"></div>\r\n        </section>\r\n        <section class=\"admin-asset-card\">\r\n          <h3 data-i18n=\"admin.coverTitle\">Project cover</h3><p data-i18n=\"admin.coverCopy\">Ảnh cover tùy chọn cho từng project. Nếu chưa có asset, visual hiện tại vẫn được giữ nguyên.</p>\r\n          <form class=\"admin-form\" id=\"coverUploadForm\"><label class=\"admin-label\"><span data-i18n=\"admin.project\">Project</span><select class=\"admin-select\" id=\"coverProject\" required></select></label><label class=\"admin-label\"><span data-i18n=\"admin.files\">File</span><input class=\"admin-input\" id=\"projectCoverFile\" type=\"file\" accept=\"image/*\" required></label><div class=\"admin-actions\"><button class=\"admin-btn primary\" type=\"submit\" id=\"coverUploadBtn\" data-i18n=\"admin.uploadCover\">Upload cover</button></div><div id=\"coverUploadStatus\" class=\"admin-status\" aria-live=\"polite\"></div></form>\r\n        </section>\r\n      </div>\r\n      <div class=\"admin-grid\">\r\n        <section class=\"admin-card\"><h3 data-i18n=\"admin.uploadTitle\">Upload proof</h3><p class=\"admin-note\" data-i18n=\"admin.uploadCopy\">PDF, ảnh hoặc JSON. Chọn nhiều ảnh để tạo một gallery. Metadata chỉ được ghi sau khi Storage upload thành công.</p>\r\n          <form class=\"admin-form\" id=\"proofUploadForm\">\r\n            <label class=\"admin-label\"><span data-i18n=\"admin.project\">Project</span><select class=\"admin-select\" id=\"adminProject\" required></select></label>\r\n            <div class=\"admin-row\"><label class=\"admin-label\"><span data-i18n=\"admin.titleVi\">Tiêu đề VI</span><input class=\"admin-input\" id=\"proofTitleVi\" required></label><label class=\"admin-label\"><span data-i18n=\"admin.titleEn\">Title EN</span><input class=\"admin-input\" id=\"proofTitleEn\" required></label></div>\r\n            <label class=\"admin-label\"><span data-i18n=\"admin.files\">File</span><input class=\"admin-input\" id=\"proofFiles\" type=\"file\" accept=\"image/*,application/pdf,video/*,audio/*,application/json,text/csv,text/plain,application/zip,.docx,.xlsx,.pptx,.mov,.avif,.m4a,.flac,.json\" multiple required></label>\r\n            <div class=\"admin-actions\"><button class=\"admin-btn primary\" type=\"submit\" id=\"uploadBtn\" data-i18n=\"admin.upload\">Upload proof</button><button class=\"admin-btn danger\" type=\"button\" id=\"adminLogout\" data-i18n=\"admin.logout\">Đăng xuất</button></div>\r\n            <div id=\"adminUploadStatus\" class=\"admin-status\" aria-live=\"polite\"></div>\r\n          </form>\r\n        </section>\r\n        <section class=\"admin-card\"><h3 data-i18n=\"admin.existing\">Saved assets</h3><p class=\"admin-note\" data-i18n=\"admin.existingCopy\">Chỉ hiển thị proof và gallery đã lưu trong asset registry.</p><div id=\"adminProofList\" class=\"admin-proof-list\"></div></section>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</dialog>";
let globalDraftContent=null;
let globalContentLoadState='loading';

let globalAdminTab='home';

let projectDrafts=new Map();
let projectDraftLoadState='pending';
let projectDraftLoadError=null;
let INSIGHTS_ADMIN=[];
let insightAdminLoadState='pending';
let insightSchemaMissing=false;
let insightAdminLoadError=null;
let insightDrafts=new Map();
let insightDraftLoadState='pending';
let insightDraftLoadError=null;
let activeInsightAdminSlug='';

const INSIGHT_ADMIN_MARKUP=`<section class="admin-project-management insight-management" id="insightManagement">
  <div class="admin-project-head"><div><h3 data-i18n="admin.insightsManagement">Insights Management</h3><p class="admin-note" data-i18n="admin.insightsManagementCopy">Create, edit and publish public Insight articles.</p></div><button class="admin-btn primary" type="button" id="newInsightBtn" data-i18n="admin.newInsight">+ New Insight</button></div>
  <div id="insightManagementList" class="admin-project-list"></div>
  <div id="insightEditor" class="admin-project-editor" hidden>
    <form class="admin-form" id="insightForm">
      <input type="hidden" id="insightDbId"><div class="admin-row"><label class="admin-label"><span data-i18n="admin.slug">Slug</span><input class="admin-input" id="insightSlug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*"></label><label class="admin-label"><span data-i18n="admin.sortOrder">Sort order</span><input class="admin-input" id="insightSortOrder" type="number" min="0" step="1" required></label></div>
      <div class="admin-row"><label class="admin-label"><span data-i18n="admin.titleVi">Tiêu đề VI</span><input class="admin-input" id="insightTitleVi" required></label><label class="admin-label"><span data-i18n="admin.titleEn">Title EN</span><input class="admin-input" id="insightTitleEn" required></label></div>
      <div class="admin-row"><label class="admin-label"><span data-i18n="admin.insightExcerptVi">Excerpt VI</span><textarea class="admin-textarea" id="insightExcerptVi" required></textarea></label><label class="admin-label"><span data-i18n="admin.insightExcerptEn">Excerpt EN</span><textarea class="admin-textarea" id="insightExcerptEn" required></textarea></label></div>
      <div class="admin-row"><label class="admin-label"><span data-i18n="admin.insightIntroVi">Intro VI</span><textarea class="admin-textarea" id="insightIntroVi"></textarea></label><label class="admin-label"><span data-i18n="admin.insightIntroEn">Intro EN</span><textarea class="admin-textarea" id="insightIntroEn"></textarea></label></div>
      <div class="admin-row"><label class="admin-label"><span data-i18n="admin.insightCategories">Categories</span><input class="admin-input" id="insightCategories" placeholder="AI, MarTech, Analysis"></label><label class="admin-label"><span data-i18n="admin.insightReadMinutes">Read minutes</span><input class="admin-input" id="insightReadMinutes" type="number" min="1" step="1" required><button class="admin-btn" type="button" id="recalculateInsightMinutes" data-i18n="admin.recalculate">Recalculate</button></label></div>
      <div class="admin-row"><label class="admin-label"><span data-i18n="admin.toneA">Tone A</span><input class="admin-input" id="insightToneA" required></label><label class="admin-label"><span data-i18n="admin.toneB">Tone B</span><input class="admin-input" id="insightToneB" required></label></div>
      <div class="admin-label"><span data-i18n="admin.insightPublishedAt">Published at</span><input class="admin-input" id="insightPublishedAt" readonly></div>
      <div class="project-editor-lifecycle"><span id="insightLifecycleBadge" class="project-lifecycle-badge draft">DRAFT</span><div class="project-lifecycle-actions"><button class="admin-btn" type="button" id="saveInsightDraftBtn" data-i18n="admin.saveDraft">Save Draft</button><button class="admin-btn" type="button" id="previewInsightDraftBtn" data-i18n="admin.previewDraft">Preview Draft</button><button class="admin-btn primary" type="button" id="publishInsightBtn" data-i18n="admin.publish">Publish</button><button class="admin-btn danger" type="button" id="unpublishInsightBtn" data-i18n="admin.unpublish">Unpublish</button></div></div>
      <div class="admin-project-head"><strong data-i18n="admin.insightSections">Insight sections</strong><button class="admin-btn" type="button" id="addInsightSectionBtn" data-i18n="admin.addSection">+ Section</button></div><div id="insightSectionsEditor" class="admin-section-editor" data-section-host="insight" data-owner-id=""></div>
      <div class="admin-project-media"><div class="admin-project-head"><div><strong data-i18n="admin.insightMedia">Insight media</strong><p class="admin-note" data-i18n="admin.insightMediaCopy">Cover and proof assets scoped to this Insight.</p></div><div><button class="admin-btn" type="button" id="uploadInsightCoverBtn" data-i18n="admin.uploadCover">Upload cover</button><button class="admin-btn" type="button" id="uploadInsightProofBtn" data-i18n="admin.upload">Upload proof</button></div></div><div id="insightMediaList" class="admin-media-list"></div></div>
      <div class="admin-actions"><button class="admin-btn" type="button" id="cancelInsightBtn" data-i18n="admin.cancel">Cancel</button></div><div id="insightStatus" class="admin-status" aria-live="polite"></div>
    </form>
  </div>
</section>`;

function overlayGlobalRows(base,rows,prefix){
  const clone=deepClone(base),fallback=globalFallbackContent();(rows||[]).filter(r=>String(r.content_key||'').startsWith(prefix)).forEach(r=>{const key=String(r.content_key).slice(prefix.length);if(!GLOBAL_SECTION_KEYS.includes(key))return;const stored=globalCanonicalFromStored(parseContentJSON(r.value_vi,null),parseContentJSON(r.value_en,null),fallback[key]||{});clone[key]=HQVShared.composeGlobalContent(fallback[key]||{},stored)});return clone;
}

let globalAdminContent=deepClone(globalFallbackContent());

function setPath(obj,path,value){const parts=path.split('.');let cur=obj;for(let i=0;i<parts.length-1;i++){if(!cur[parts[i]]||typeof cur[parts[i]]!=='object')cur[parts[i]]={};cur=cur[parts[i]]}cur[parts[parts.length-1]]=value}

function globalField(path,label,vi,en,type='input',full=false){const textarea=type==='textarea',tag=textarea?'textarea':'input',fieldClass=`admin-${textarea?'textarea':'input'}`;const pair=lang=>{const value=getPath(globalAdminContent,path)?.[lang]||'',attrs=`class="${fieldClass}" data-global-field="${esc(path)}" data-global-lang="${lang}"`;return `<div class="global-field"><span>${esc(label)} · ${lang.toUpperCase()}</span>${textarea?`<textarea ${attrs}>${esc(value)}</textarea>`:`<input ${attrs} value="${esc(value)}">`}</div>`};return `<div class="global-field${full?' full':''}">${pair('vi')}${pair('en')}</div>`}

function globalItemsField(path,label,vi,en){return `<div class="global-field"><span>${esc(label)}</span><div class="global-lang"><div class="global-field"><span>VI · one item per line</span><textarea class="admin-textarea" data-global-array="${esc(path)}" data-global-lang="vi">${esc((getPath(globalAdminContent,path)?.vi||[]).join?.('\n')||'')}</textarea></div><div class="global-field"><span>EN · one item per line</span><textarea class="admin-textarea" data-global-array="${esc(path)}" data-global-lang="en">${esc((getPath(globalAdminContent,path)?.en||[]).join?.('\n')||'')}</textarea></div></div></div>`}

function highlightBlocksAdminHtml(path,blocks){
  const en=currentLang==='en',items=Array.isArray(blocks)?blocks:[];
  const textField=(blockPath,lang)=>`<label class="admin-label">${en?'Text':'Nội dung'} · ${lang.toUpperCase()}<textarea class="admin-textarea" data-highlight-path="${esc(`${blockPath}.content.text_${lang}`)}">${esc(getPath(globalAdminContent,`${blockPath}.content.text_${lang}`)||'')}</textarea></label>`;
  const captionField=(blockPath,lang)=>`<label class="admin-label">${en?'Caption':'Chú thích'} · ${lang.toUpperCase()}<input class="admin-input" data-highlight-path="${esc(`${blockPath}.content.caption_${lang}`)}" value="${esc(getPath(globalAdminContent,`${blockPath}.content.caption_${lang}`)||'')}"></label>`;
  return `<div class="profile-content-admin"><div class="admin-project-head"><strong>${en?'Visible content':'Nội dung hiển thị trực tiếp'}</strong><button class="admin-btn" type="button" data-highlight-add="${esc(path)}">${en?'+ Add block':'+ Thêm block'}</button></div><p class="admin-note">${en?'Paragraphs, images, videos and charts appear inline on the portfolio; they are separate from Proof.':'Đoạn văn, ảnh, video và biểu đồ sẽ hiện trực tiếp trên portfolio, không cần thêm vào Proof.'}</p>${items.map((block,index)=>{const blockPath=`${path}.${index}`,type=['paragraph','image','video','chart'].includes(block?.type)?block.type:'paragraph';return `<div class="profile-content-admin-block"><div class="admin-project-head"><select class="admin-select" data-highlight-path="${esc(`${blockPath}.type`)}" aria-label="${en?'Content type':'Loại nội dung'}"><option value="paragraph"${type==='paragraph'?' selected':''}>${en?'Paragraph':'Đoạn văn'}</option><option value="image"${type==='image'?' selected':''}>${en?'Image':'Ảnh'}</option><option value="video"${type==='video'?' selected':''}>Video</option><option value="chart"${type==='chart'?' selected':''}>${en?'Chart':'Biểu đồ'}</option></select><button class="admin-btn danger" type="button" data-highlight-remove="${esc(blockPath)}">${en?'Remove block':'Xóa block'}</button></div>${type==='paragraph'?`<div class="admin-row">${textField(blockPath,'vi')}${textField(blockPath,'en')}</div>`:type==='chart'?`<label class="admin-label">${en?'Chart style':'Loại biểu đồ'}<select class="admin-select" data-highlight-path="${esc(`${blockPath}.settings.chart_type`)}"><option value="bar"${getPath(globalAdminContent,`${blockPath}.settings.chart_type`)==='bar'?' selected':''}>${en?'Vertical bar':'Cột dọc'}</option><option value="horizontal"${getPath(globalAdminContent,`${blockPath}.settings.chart_type`)==='horizontal'?' selected':''}>${en?'Horizontal bar':'Thanh ngang'}</option><option value="line"${getPath(globalAdminContent,`${blockPath}.settings.chart_type`)==='line'?' selected':''}>${en?'Line':'Đường'}</option><option value="pie"${getPath(globalAdminContent,`${blockPath}.settings.chart_type`)==='pie'?' selected':''}>${en?'Pie':'Tròn'}</option><option value="mixed"${getPath(globalAdminContent,`${blockPath}.settings.chart_type`)==='mixed'?' selected':''}>${en?'Mixed':'Hỗn hợp'}</option></select></label><div class="admin-row">${['vi','en'].map(lang=>`<label class="admin-label">${en?'Chart data JSON':'Dữ liệu biểu đồ JSON'} · ${lang.toUpperCase()}<textarea class="admin-textarea" data-highlight-path="${esc(`${blockPath}.content.text_${lang}`)}" placeholder='{"labels":["20","30"],"series":[{"name":"Nam","type":"line","values":[0.4,0.8]},{"name":"Nữ","type":"line","values":[0.6,0.9]}]}'>${esc(getPath(globalAdminContent,`${blockPath}.content.text_${lang}`)||'')}</textarea></label>`).join('')}</div><small class="admin-note">${en?'For mixed charts, set each series type to "bar" or "line".':'Với biểu đồ hỗn hợp, đặt type của từng series là "bar" hoặc "line".'}</small><div class="admin-row">${captionField(blockPath,'vi')}${captionField(blockPath,'en')}</div>`:`<label class="admin-label">${type==='image'?(en?'Image URL (HTTPS)':'URL ảnh (HTTPS)'):(en?'Video embed URL (YouTube/Vimeo) or direct HTTPS video':'URL nhúng video (YouTube/Vimeo) hoặc link HTTPS trực tiếp')}<input class="admin-input" type="url" data-highlight-path="${esc(`${blockPath}.settings.url`)}" value="${esc(getPath(globalAdminContent,`${blockPath}.settings.url`)||'')}" placeholder="https://..."></label><div class="admin-row">${captionField(blockPath,'vi')}${captionField(blockPath,'en')}</div>`}</div>`}).join('')}</div>`;
}

const globalFieldBase=globalField;

function ensureExperienceEntries(){
  const experience=globalAdminContent.experience;
  if(experience.entriesManaged?.vi!==true&&experience.entriesManaged?.en!==true){
    experience.entries=[{id:'umc-communications',title:deepClone(experience.title),role:deepClone(experience.role),description:deepClone(experience.description),tags:deepClone(experience.tags),highlights:[]}];
    experience.entriesManaged={vi:true,en:true};
  }else if(!Array.isArray(experience.entries))experience.entries=[];
  experience.entries.forEach(entry=>{if(!Array.isArray(entry.highlights))entry.highlights=[]});
  return experience.entries;
}

function experienceEntriesAdminHtml(){
  const entries=ensureExperienceEntries(),vi=currentLang==='vi';
  return `<div class="global-group"><div class="admin-project-head"><div><h4>${vi?'Kinh nghiệm làm việc':'Experience records'}</h4><p class="admin-note">${vi?'Thêm hoặc xóa các mục kinh nghiệm. Nội dung hiện tại được giữ nguyên.':'Add or remove experience entries. Existing content is preserved.'}</p></div><button class="admin-btn primary" type="button" data-experience-add>${vi?'Thêm kinh nghiệm':'Add experience'}</button></div><div class="global-repeat">${entries.map((entry,index)=>`<div class="global-repeat-item"><div class="global-repeat-head"><strong>${esc(getLocalizedContent(entry.title,currentLang)||`${vi?'Kinh nghiệm':'Experience'} ${index+1}`)}</strong><button class="admin-btn danger" type="button" data-experience-remove="${esc(entry.id)}">${vi?'Xóa mục':'Remove entry'}</button></div>${globalField(`experience.entries.${index}.title`,vi?'Tổ chức / đơn vị':'Organization')}${globalField(`experience.entries.${index}.role`,vi?'Vai trò':'Role')}${globalField(`experience.entries.${index}.description`,vi?'Mô tả':'Description',null,null,'textarea')}${globalItemsField(`experience.entries.${index}.tags`,vi?'Kỹ năng / tags':'Skills / tags')}${highlightBlocksAdminHtml(`experience.entries.${index}.highlights`,entry.highlights)}</div>`).join('')}</div></div>`;
}

function decorateCertificateAdminControls(host){
  const groups=globalAdminContent.experience.certGroups||[];
  const list=host.querySelector('.cert-admin-list');if(!list)return;
  const addGroup=document.createElement('button');addGroup.type='button';addGroup.className='admin-btn primary';addGroup.dataset.certGroupAdd='true';addGroup.textContent=currentLang==='en'?'+ Add group':'+ Thêm nhóm';list.prepend(addGroup);
  host.querySelectorAll('.cert-admin-group').forEach((section,groupIndex)=>{
    const group=groups[groupIndex];if(!group)return;
    const heading=section.querySelector('h4');if(!heading)return;
    const groupHead=document.createElement('div');groupHead.className='admin-project-head cert-admin-group-head';
    const titleFields=document.createElement('div');titleFields.className='cert-admin-group-title';titleFields.innerHTML=globalFieldBase(`experience.certGroups.${groupIndex}.title`,currentLang==='en'?'Group name':'Tên nhóm',null,null,'input',true);
    const removeGroup=document.createElement('button');removeGroup.type='button';removeGroup.className='admin-btn danger';removeGroup.dataset.certGroupRemove=group.id;removeGroup.textContent=currentLang==='en'?'Remove group':'Xóa nhóm';
    groupHead.append(heading,titleFields,removeGroup);section.prepend(groupHead);
    const add=document.createElement('button');add.type='button';add.className='admin-btn primary';add.dataset.certItemAdd=group.id;add.textContent=currentLang==='en'?'+ Add certificate':'+ Thêm chứng chỉ';
    section.insertBefore(add,section.querySelector('.cert-admin-row'));
    section.querySelectorAll('.cert-admin-row[data-cert-id]').forEach((row,itemIndex)=>{
      const item=group.items[itemIndex],highlights=document.createElement('div');
      highlights.innerHTML=highlightBlocksAdminHtml(`experience.certGroups.${groupIndex}.items.${itemIndex}.highlights`,item?.highlights);
      row.querySelector('.admin-cert-fields')?.after(highlights);
      const remove=document.createElement('button');remove.type='button';remove.className='admin-btn danger';remove.dataset.certItemRemove=row.dataset.certId;remove.textContent=currentLang==='en'?'Remove':'Xóa';row.querySelector('.cert-admin-row-head')?.append(remove);
    });
  });
}

function renderGlobalEditor(){
  const host=$('#globalContentEditor');if(!host)return;const c=globalAdminContent;
  if(globalAdminTab==='experience')ensureExperienceEntries();
  let html='';
  if(globalAdminTab==='home')html=`<div class="global-pane">
    <div class="global-group"><h4>Home / Hero</h4>${globalField('home.name','Headline')}${globalField('home.role','Role')}${globalField('home.description','Description',null,null,'textarea')}${globalField('home.status','Status')}${globalField('home.ctaProjects','Projects CTA')}${globalField('home.ctaProjectsTarget','Projects CTA target')}${globalField('home.ctaContact','Contact CTA')}${globalField('home.ctaContactTarget','Contact CTA target')}</div>
    <div class="global-group"><h4>CV display</h4><label class="admin-label">English CV URL<input class="admin-input" type="text" data-global-config="home.cvUrl" value="${esc(c.home.cvUrl?.en||'./cv-one-page2-en.html')}" placeholder="./cv-one-page2-en.html"></label><label class="admin-check"><input type="checkbox" data-global-config="home.cvVisible"${c.home.cvVisible?.en!=='false'?' checked':''}><span>Show CV preview on the homepage</span></label><p class="admin-note">Use a site-relative file path or an HTTPS URL. The homepage preview remains in English; the detailed viewer also offers the Vietnamese CV.</p></div>
    <div class="global-group"><h4>Navigation</h4>${globalField('home.nav.projects','Projects label')}${globalField('home.nav.skills','Skills label')}${globalField('home.nav.experience','Experience label')}${globalField('home.nav.contact','Contact label')}${globalField('home.nav.cta','Navigation CTA')}</div>
    <div class="global-group"><h4>Projects intro</h4>${globalField('projects.eyebrow','Eyebrow')}${globalField('projects.heading','Heading')}${globalField('projects.headingAccent','Heading accent')}${globalField('projects.lead','Lead',null,null,'textarea')}</div>
  </div>`;
  if(globalAdminTab==='approach')html=`<div class="global-pane"><div class="global-group"><h4>Approach</h4>${globalField('approach.eyebrow','Eyebrow')}${globalField('approach.resultTitle','Result title')}${globalField('approach.lead','Lead',null,null,'textarea')}${c.approach.formula.map((_,i)=>globalField(`approach.formula.${i}.label`,`Formula ${i+1} label`)+globalField(`approach.formula.${i}.micro`,`Formula ${i+1} description`,null,null,'textarea')).join('')}${globalField('approach.result','Result text',null,null,'textarea')}${globalField('approach.processKicker','Process kicker')}${c.approach.process.map((_,i)=>globalField(`approach.process.${i}`,`Process ${i+1}`)).join('')}</div></div>`;
  if(globalAdminTab==='skills')html=`<div class="global-pane"><div class="global-group"><h4>Skills / Capabilities</h4>${globalField('skills.eyebrow','Eyebrow')}${globalField('skills.heading','Heading')}${globalField('skills.headingAccent','Heading accent')}${globalField('skills.lead','Lead',null,null,'textarea')}<div class="global-repeat">${c.skills.cards.map((card,i)=>`<div class="global-repeat-item"><div class="global-repeat-head"><strong>${esc(card.num)} · Capability ${i+1}</strong><span class="global-inline-tags">Content only · layout stays code-owned</span></div>${globalField(`skills.cards.${i}.title`,'Card title')}${globalField(`skills.cards.${i}.copy`,'Card description',null,null,'textarea')}${globalField(`skills.cards.${i}.items`,'Card items',null,null,'textarea')}</div>`).join('')}</div></div></div>`;
  if(globalAdminTab==='experience')html=`<div class="global-pane"><div class="global-group"><h4>Experience</h4>${globalField('experience.eyebrow','Eyebrow')}${globalField('experience.heading','Heading')}${globalField('experience.headingAccent','Heading accent')}${globalField('experience.lead','Lead',null,null,'textarea')}</div>${experienceEntriesAdminHtml()}<div class="global-group"><h4>Certificates &amp; achievements</h4>${certAdminPanelHtml()}</div><div class="global-group"><h4>Supporting profile</h4>${globalField('experience.creative.label','Creative label')}${globalField('experience.creative.text','Creative text',null,null,'textarea')}${globalField('experience.direction.label','Direction label')}${globalField('experience.direction.text','Direction text',null,null,'textarea')}</div></div>`;
  if(globalAdminTab==='contact')html=`<div class="global-pane"><div class="global-group"><h4>Contact</h4>${globalField('contact.eyebrow','Eyebrow')}${globalField('contact.heading','Heading')}${globalField('contact.headingAccent','Heading accent')}${globalField('contact.intro','Lead',null,null,'textarea')}${globalField('contact.flow','Flow text',null,null,'textarea')}${globalField('contact.submit','CTA')}${globalField('contact.nameLabel','Name label')}${globalField('contact.emailLabel','Email label')}${globalField('contact.messageLabel','Message label')}${globalField('contact.namePlaceholder','Name placeholder')}${globalField('contact.messagePlaceholder','Message placeholder',null,null,'textarea')}</div></div>`;
  if(globalAdminTab==='footer')html=`<div class="global-pane"><div class="global-group"><h4>Footer</h4>${globalField('footer.copyright','Copyright')}${globalField('footer.supporting','Supporting text')}</div></div>`;
  host.innerHTML=html;
  if(globalAdminTab==='experience')decorateCertificateAdminControls(host);
}

function mergeEditorInputs(){
  $$('#globalContentEditor [data-global-field]').forEach(el=>{if(!el.value.trim())return;const path=el.dataset.globalField,lang=el.dataset.globalLang;const node=getPath(globalAdminContent,path);const pair=node&&typeof node==='object'&&'vi' in node&&'en' in node?node:{vi:'',en:''};pair[lang]=el.value;setPath(globalAdminContent,path,pair)});
  $$('#globalContentEditor [data-global-config]').forEach(el=>{const path=el.dataset.globalConfig,value=el.type==='checkbox'?String(el.checked):el.value.trim();const pair=getPath(globalAdminContent,path)||{vi:'',en:''};pair.vi=value;pair.en=value;setPath(globalAdminContent,path,pair)});
  $$('#globalContentEditor [data-global-array]').forEach(el=>{const values=el.value.split(/\n+/).map(x=>x.trim()).filter(Boolean);if(!values.length)return;const path=el.dataset.globalArray,lang=el.dataset.globalLang,node=getPath(globalAdminContent,path)||{vi:[],en:[]};node[lang]=values;setPath(globalAdminContent,path,node)});
  $$('#globalContentEditor [data-cert-meta]').forEach(el=>{if(!el.value.trim())return;const [id,field]=el.dataset.certMeta.split('|'),item=findCertAdminItem(id);if(item)item[field]=el.value});
  $$('#globalContentEditor [data-highlight-path]').forEach(el=>setPath(globalAdminContent,el.dataset.highlightPath,el.value));
  return globalAdminContent;
}

function globalContentSnapshot(){const c=mergeEditorInputs();const valid=GLOBAL_SECTION_KEYS.every(k=>c[k]&&typeof c[k]==='object'&&!Array.isArray(c[k]));if(!valid)throw new Error('invalid_global_content');return deepClone(c)}

function validateGlobalContent(content){
  const problems=[];
  GLOBAL_SECTION_KEYS.forEach(key=>{if(!content?.[key]||typeof content[key]!=='object'||Array.isArray(content[key]))problems.push(`Global / ${key}: section content is missing.`);});
  const home=content?.home||{};for(const lang of ['vi','en']){const name=home?.name?.[lang],role=home?.role?.[lang];if(!String(name??'').trim())problems.push(`Global / Home / ${lang.toUpperCase()} / name: required.`);if(!String(role??'').trim())problems.push(`Global / Home / ${lang.toUpperCase()} / role: required.`);for(const field of ['projects','skills','experience','contact','cta'])if(!String(home?.nav?.[field]?.[lang]??'').trim())problems.push(`Global / Home / ${lang.toUpperCase()} / navigation ${field}: required.`);for(const field of ['ctaProjects','ctaContact'])if(!String(home?.[field]?.[lang]??'').trim())problems.push(`Global / Home / ${lang.toUpperCase()} / ${field}: required.`)}
  if(problems.length){const e=new Error('global_publish_validation_failed');e.validation=problems;throw e}
}

async function upsertContentRow(key,valueVi,valueEn){const body={content_key:key,value_vi:JSON.stringify(valueVi),value_en:JSON.stringify(valueEn),updated_at:new Date().toISOString()};await sbFetch('/rest/v1/portfolio_content?on_conflict=content_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});}

async function upsertProjectDraftRow(key,payload){const body={content_key:key,value_vi:JSON.stringify(payload),value_en:null,updated_at:new Date().toISOString()};await sbFetch('/rest/v1/portfolio_content?on_conflict=content_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});}

async function upsertRawContentRow(row){if(!row?.content_key)return;const body={content_key:row.content_key,value_vi:row.value_vi,value_en:row.value_en,updated_at:row.updated_at||new Date().toISOString()};await sbFetch('/rest/v1/portfolio_content?on_conflict=content_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(body)});}

async function deleteContentKey(key){await sbFetch(`/rest/v1/portfolio_content?content_key=eq.${encodeURIComponent(key)}`,{method:'DELETE',headers:{Prefer:'return=minimal'}})}

async function fetchGlobalPrefixRows(prefix){const r=await sbFetch(`/rest/v1/portfolio_content?select=content_key,value_vi,value_en,updated_at&content_key=like.${encodeURIComponent(prefix)}%25&order=content_key.asc`,{method:'GET'});const rows=await r.json();return Array.isArray(rows)?rows:[]}

async function captureGlobalLifecycleSnapshot(){const [published,draft]=await Promise.all([fetchGlobalPrefixRows('global.published.'),fetchGlobalPrefixRows('global.draft.')]);return {published,draft};}

async function restoreGlobalLifecycleSnapshot(snapshot){
  const restorePrefix=async(prefix,rows)=>{
    const keep=new Set((rows||[]).map(r=>r.content_key));
    for(const key of GLOBAL_SECTION_KEYS){const full=`${prefix}${key}`;if(!keep.has(full))await deleteContentKey(full)}
    for(const row of rows||[])await upsertRawContentRow(row);
  };
  await restorePrefix('global.published.',snapshot?.published||[]);
  await restorePrefix('global.draft.',snapshot?.draft||[]);
}

function refreshGlobalBadge(){const badge=$('#globalLifecycleBadge');if(!badge)return;if(globalContentLoadState!=='ready'){badge.className='global-status-badge draft';badge.textContent=globalContentLoadState==='failed'?'LIVE UNAVAILABLE':'LOADING LIVE';return}const published=globalDbState==='ready',draft=!!globalDraftContent;badge.className=`global-status-badge ${published&&!draft?'published':'draft'}`;badge.textContent=published?(draft?'DRAFT · LIVE VERSION PRESERVED':'PUBLISHED'):(draft?'DRAFT':'UNPUBLISHED')}
function refreshGlobalControls(){const ready=globalContentLoadState==='ready';['#globalSaveDraftBtn','#globalPublishBtn','#globalUnpublishBtn'].forEach(selector=>{const button=$(selector);if(button)button.disabled=!ready})}
function changeAdminLanguage(next){const keyFor=(select,index)=>select.id?`id:${select.id}`:select.name?`name:${select.name}`:`index:${index}`;const selected=new Map([...adminDialog.querySelectorAll('select')].map((select,index)=>[keyFor(select,index),select.value]));mergeEditorInputs();HQVShared.setLang(next);applyAdminStatic();renderGlobalEditor();refreshAdminProjectList();refreshAdminList();loadVisitorAdminList();[...adminDialog.querySelectorAll('select')].forEach((select,index)=>{const value=selected.get(keyFor(select,index));if(value!==undefined&&[...select.options].some(option=>option.value===value))select.value=value})}
async function saveGlobalDraft(){if(!HQVShared.auth?.isAuthed()){setAdminStatus('#globalContentStatus','err',t('admin.loginRequired'));return}if(globalContentLoadState!=='ready'){setAdminStatus('#globalContentStatus','err',globalContentLoadState==='failed'?(currentLang==='en'?'Live content could not be loaded. Writes are blocked to prevent overwriting it.':'Không tải được bản live, chặn ghi để tránh ghi đè.'):(currentLang==='en'?'Live content is still loading.':'Đang tải nội dung live.'));return}const btn=$('#globalSaveDraftBtn');btn.disabled=true;let before=null;try{const snapshot=globalContentSnapshot();before=await captureGlobalLifecycleSnapshot();for(const key of GLOBAL_SECTION_KEYS){const value=snapshot[key];await upsertContentRow(`global.draft.${key}`,globalContentForStorage(value,'vi',globalFallbackContent()[key]),globalContentForStorage(value,'en',globalFallbackContent()[key]))}globalDraftContent=deepClone(snapshot);globalAdminContent=HQVShared.composeGlobalContent(globalFallbackContent(),globalPublishedContent||{},globalDraftContent);setAdminStatus('#globalContentStatus','ok',t('admin.globalSaved'));refreshGlobalBadge()}catch(err){let rollbackOk=true;if(before){try{await restoreGlobalLifecycleSnapshot(before)}catch(_){rollbackOk=false}}setAdminStatus('#globalContentStatus','err',rollbackOk?projectErrorText(err):(currentLang==='en'?'Save Draft failed and rollback could not be verified.':'Lưu bản nháp thất bại và không thể xác minh rollback hoàn toàn.'))}finally{refreshGlobalControls()}}

async function publishGlobal(){if(!HQVShared.auth?.isAuthed()){setAdminStatus('#globalContentStatus','err',t('admin.loginRequired'));return}if(globalContentLoadState!=='ready'){setAdminStatus('#globalContentStatus','err',globalContentLoadState==='failed'?(currentLang==='en'?'Live content could not be loaded. Writes are blocked to prevent overwriting it.':'Không tải được bản live, chặn ghi để tránh ghi đè.'):(currentLang==='en'?'Live content is still loading.':'Đang tải nội dung live.'));return}const btn=$('#globalPublishBtn');btn.disabled=true;let before=null;try{const snapshot=globalContentSnapshot();validateGlobalContent(snapshot);before=await captureGlobalLifecycleSnapshot();for(const key of GLOBAL_SECTION_KEYS){const value=snapshot[key];await upsertContentRow(`global.published.${key}`,globalContentForStorage(value,'vi',globalFallbackContent()[key]),globalContentForStorage(value,'en',globalFallbackContent()[key]));await deleteContentKey(`global.draft.${key}`)}globalPublishedContent=deepClone(snapshot);globalDraftContent=null;globalAdminContent=HQVShared.composeGlobalContent(globalFallbackContent(),globalPublishedContent);globalDbState='ready';setAdminStatus('#globalContentStatus','ok',t('admin.globalPublished'));refreshGlobalBadge()}catch(err){let rollbackOk=true;if(before){try{await restoreGlobalLifecycleSnapshot(before)}catch(_){rollbackOk=false}}if(err.message==='global_publish_validation_failed'||err.message==='invalid_global_content')setAdminStatus('#globalContentStatus','err',(err.validation?.join(' · ')||t('admin.invalidGlobal')));else if(!rollbackOk)setAdminStatus('#globalContentStatus','err',currentLang==='en'?'Publish failed and rollback could not be fully verified.':'Publish thất bại và không thể xác minh rollback hoàn toàn.');else setAdminStatus('#globalContentStatus','err',currentLang==='en'?'Publish failed. No partial publish was reported as success.':'Publish thất bại. Không báo thành công khi publish một phần.')}finally{refreshGlobalControls()}}

async function unpublishGlobal(){if(!HQVShared.auth?.isAuthed()){setAdminStatus('#globalContentStatus','err',t('admin.loginRequired'));return}if(globalContentLoadState!=='ready'){setAdminStatus('#globalContentStatus','err',globalContentLoadState==='failed'?(currentLang==='en'?'Live content could not be loaded. Writes are blocked to prevent overwriting it.':'Không tải được bản live, chặn ghi để tránh ghi đè.'):(currentLang==='en'?'Live content is still loading.':'Đang tải nội dung live.'));return}const btn=$('#globalUnpublishBtn');if(btn)btn.disabled=true;let before=null;try{before=await captureGlobalLifecycleSnapshot();for(const key of GLOBAL_SECTION_KEYS)await deleteContentKey(`global.published.${key}`);globalPublishedContent=null;globalDbState='empty';globalAdminContent=HQVShared.composeGlobalContent(globalFallbackContent(),globalDraftContent||{});setAdminStatus('#globalContentStatus','ok',t('admin.globalUnpublished'));refreshGlobalBadge()}catch(err){let rollbackOk=true;if(before){try{await restoreGlobalLifecycleSnapshot(before)}catch(_){rollbackOk=false}}setAdminStatus('#globalContentStatus','err',rollbackOk?(currentLang==='en'?'Unpublish failed. Previous published content was restored.':'Unpublish thất bại. Nội dung published trước đó đã được khôi phục.'):(currentLang==='en'?'Unpublish failed and rollback could not be verified.':'Unpublish thất bại và không thể xác minh rollback hoàn toàn.'))}finally{refreshGlobalControls()}}

function openGlobalPreview(){try{globalPreviewSnapshot=globalContentSnapshot();globalPreviewWindow=window.open(new URL('index.html#global-preview',location.href).href,'_blank');if(!globalPreviewWindow){setAdminStatus('#globalContentStatus','err',currentLang==='en'?'Popup blocked.':'Trình duyệt đã chặn cửa sổ preview.');return}setAdminStatus('#globalContentStatus','ok',t('admin.globalPreviewOpened'))}catch(error){setAdminStatus('#globalContentStatus','err',error.message||t('admin.invalidGlobal'))}}

function projectFromDraftPayload(base,payload){
  const d=payload&&payload.project?payload.project:{};const sections=Array.isArray(payload?.sections)?payload.sections:[];const vi=base?.content?.vi||{},en=base?.content?.en||{};
  return {...(base||{}),id:d.slug||base?.id,dbId:d.id||base?.dbId||null,index:String(d.sort_order??Number(base?.index||1)).padStart(2,'0'),published:base?.published!==false,visual:d.visual_type||base?.visual||'web',tone:[d.tone_a||base?.tone?.[0]||'#22d3ee',d.tone_b||base?.tone?.[1]||'#5b7cfa'],__draftPayload:payload,content:{vi:{...vi,title:d.title_vi||vi.title,hook:d.hook_vi??vi.hook,intro:d.intro_vi??vi.intro,category:Array.isArray(d.categories)?d.categories:vi.category||[],stats:Array.isArray(d.stats)?d.stats:vi.stats||[],story:sections.map(s=>[s.title_vi||s.title_en||'',s.body_vi||s.body_en||''])},en:{...en,title:d.title_en||en.title,hook:d.hook_en??en.hook,intro:d.intro_en??en.intro,category:Array.isArray(d.categories)?d.categories:en.category||[],stats:Array.isArray(d.stats)?d.stats:en.stats||[],story:sections.map(s=>[s.title_en||s.title_vi||'',s.body_en||s.body_vi||''])}},sections};
}

async function loadProjectDrafts(){projectDrafts=new Map();projectDraftLoadState='pending';if(!HQVShared.auth?.isAuthed()||!sbReady()){projectDraftLoadState='ready';return}try{const r=await sbFetch('/rest/v1/portfolio_content?select=content_key,value_vi,updated_at&content_key=like.project.draft.%25&order=updated_at.desc',{method:'GET'});const rows=await r.json();(Array.isArray(rows)?rows:[]).forEach(r=>{const slug=String(r.content_key||'').slice('project.draft.'.length);const payload=parseContentJSON(r.value_vi,{});if(slug&&payload&&typeof payload==='object')projectDrafts.set(slug,payload)});projectDraftLoadState='ready'}catch(_){projectDraftLoadState='failed'}if(adminDialog?.open)refreshAdminProjectList()}

function projectAdminSource(project){if(!project)return null;const d=projectDrafts.get(project.id);return d?projectFromDraftPayload(project,d):project}

function projectForEditing(slug){
  const project=projectBySlug(slug),draft=projectDrafts.get(slug);
  if(project)return project;
  if(!draft)return null;
  const data=draft.project||{};
  return projectFromDraftPayload({id:slug,published:false,content:{vi:{title:data.title_vi||slug},en:{title:data.title_en||slug}}},draft);
}

function setProjectLifecycleUI(project){const live=!!project?.dbId&&project.published!==false;const hasDraft=!!projectDrafts.get(project?.id||'');const badge=$('#projectLifecycleBadge');if(badge){badge.className=`project-lifecycle-badge ${live&&!hasDraft?'published':'draft'}`;badge.textContent=live&&!hasDraft?'PUBLISHED':(live&&hasDraft?'DRAFT · LIVE VERSION PRESERVED':'DRAFT')}const unpublish=$('#unpublishProjectBtn');if(unpublish)unpublish.disabled=!live;const publish=$('#publishProjectBtn');if(publish)publish.disabled=false}

function safeStorageRemove(storage,key){try{storage?.removeItem(key)}catch(_){} }



async function uploadAsset(input){return uploadAssetBatch(input)}

const mediaLibraryState={query:'',filter:'all',projectId:'',ownerType:'project',mode:'single',accept:'image',selectedId:null,selectedIds:new Set(),title:'',onConfirm:null,browseOnly:false,allowEmptySelection:false};
let pendingMediaDeleteId=null;

const MAX_ASSET_FILE_BYTES=50*1024*1024;

const EXT_KIND={jpg:['image/jpeg','image'],jpeg:['image/jpeg','image'],png:['image/png','image'],webp:['image/webp','image'],gif:['image/gif','image'],avif:['image/avif','image'],svg:['image/svg+xml','image'],pdf:['application/pdf','pdf'],mp4:['video/mp4','video'],webm:['video/webm','video'],mov:['video/quicktime','video'],mp3:['audio/mpeg','audio'],wav:['audio/wav','audio'],ogg:['audio/ogg','audio'],m4a:['audio/mp4','audio'],aac:['audio/aac','audio'],flac:['audio/flac','audio'],json:['application/json','json'],csv:['text/csv','file'],txt:['text/plain','file'],bas:['text/plain','file'],html:['text/plain','file'],htm:['text/plain','file'],zip:['application/zip','file'],'7z':['application/x-7z-compressed','file'],rar:['application/vnd.rar','file'],docx:['application/vnd.openxmlformats-officedocument.wordprocessingml.document','file'],xlsx:['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','file'],pptx:['application/vnd.openxmlformats-officedocument.presentationml.presentation','file']};

const ACCEPTED_ASSET_INPUT=[...new Set(Object.values(EXT_KIND).map(x=>x[0]))].join(',')+','+Object.keys(EXT_KIND).map(e=>'.'+e).join(',')+','+Array.from({length:99},(_,index)=>`.z${String(index+1).padStart(2,'0')}`).join(',');

async function sniffMatches(file,ext){
  const sig={pdf:[[0,'%PDF']],png:[[1,'PNG']],gif:[[0,'GIF8']],jpg:[[0,'\xff\xd8\xff']],jpeg:[[0,'\xff\xd8\xff']],webp:[[0,'RIFF'],[8,'WEBP']],mp4:[[4,'ftyp']],m4a:[[4,'ftyp']],zip:[[0,'PK']],docx:[[0,'PK']],xlsx:[[0,'PK']],pptx:[[0,'PK']]}[ext];
  if(ext==='mov'){const h=new Uint8Array(await file.slice(0,12).arrayBuffer());return ['ftyp','moov','wide','mdat','free','skip','pnot'].includes(String.fromCharCode(...h.slice(4,8)))}
  if(!sig)return true;
  const head=new Uint8Array(await file.slice(0,16).arrayBuffer());const str=Array.from(head).map(b=>String.fromCharCode(b)).join('');
  return sig.every(([off,txt])=>str.substr(off,txt.length)===txt);
}

async function inspectUploadFile(file){
  const m=String(file?.name||'').toLowerCase().match(/\.([a-z0-9]+)$/),ext=m?m[1]:'',def=EXT_KIND[ext]||(/^z\d{2,}$/.test(ext)?['application/zip','file']:null);
  if(!def)throw new Error('asset_required');
  const raw=String(file.type||'').toLowerCase();
  if(raw&&raw!=='application/octet-stream'&&raw.split('/')[0]!==def[0].split('/')[0]&&!(def[1]==='file'||def[1]==='json'))throw new Error('asset_required');
  if(!(await sniffMatches(file,ext)))throw new Error('asset_required');
  if(ext==='svg'){const txt=await file.text();if(/<\s*script\b|javascript\s*:|data\s*:\s*text\/html|\bon[a-z]+\s*=|<\s*(?:iframe|foreignObject|embed|object)\b/i.test(txt))throw new Error('unsafe_svg')}
  return {ext,mime:def[0],kind:def[1]};
}

function certAdminPanelHtml(){
  const groups=normalizeCertGroups(globalAdminContent?.experience?.certGroups,globalAdminContent?.experience?.certGroupRemovedIds),en=currentLang==='en';
  globalAdminContent.experience.certGroups=groups;
  return `<div class="cert-admin-list">${groups.map((group,groupIndex)=>`<section class="cert-admin-group"><h4>${esc(getLocalizedContent(group.title,currentLang))}</h4>${group.items.map((item,itemIndex)=>{const id=item.id,cover=certCoverAsset(id),proofs=certAssetList(id),basePath=`experience.certGroups.${groupIndex}.items.${itemIndex}`;return `<article class="cert-admin-row" data-cert-id="${esc(id)}"><div class="cert-admin-row-head"><strong>${esc(getLocalizedContent(item.title,currentLang))}</strong><code>${esc(id)}</code></div><div class="admin-cert-fields">${globalFieldBase(`${basePath}.title`,en?'Title':'Tên',null,null,'input',true)}${globalFieldBase(`${basePath}.description`,en?'Description':'Mô tả',null,null,'textarea',true)}<label class="admin-label">${en?'Issuer':'Đơn vị cấp'}<input class="admin-input" data-cert-meta="${esc(id)}|issuer" value="${esc(item.issuer||'')}"></label><div class="admin-row"><label class="admin-label">${en?'Issue date':'Ngày cấp'}<input class="admin-input" data-cert-meta="${esc(id)}|date" value="${esc(item.date||'')}"></label><label class="admin-label">${en?'Credential URL':'Liên kết xác minh'}<input class="admin-input" type="url" data-cert-meta="${esc(id)}|credentialUrl" value="${esc(item.credentialUrl||'')}"></label></div></div><div class="admin-project-media"><div class="admin-project-head"><strong>${en?'Cover':'Ảnh bìa'}</strong><span>${cover?esc(cover.original_name||''):(en?'No cover':'Chưa có ảnh bìa')}</span></div>${cover?`<img class="admin-image-thumb cert-admin-cover-thumb" src="${esc(getAssetUrl(cover))}" alt="${esc(getLocalizedContent(item.title,currentLang))}">`:''}<div class="admin-actions"><button class="admin-btn" type="button" data-cert-cover-upload="${esc(id)}">${cover?(en?'Replace cover':'Thay ảnh bìa'):(en?'Upload cover':'Tải ảnh bìa')}</button>${cover?`<button class="admin-btn danger" type="button" data-cert-cover-remove="${esc(cover.id)}">${en?'Remove cover':'Xóa ảnh bìa'}</button>`:''}</div></div><div class="admin-project-media"><div class="admin-project-head"><strong>${en?'Evidence':'Minh chứng'}</strong><button class="admin-btn" type="button" data-cert-upload="${esc(id)}">${en?'Upload files':'Tải nhiều file'}</button></div><div class="cert-admin-files">${proofs.map((asset,index)=>`<div class="cert-admin-file"><span>${esc(asset.original_name||asset.id)} · ${esc(mediaTypeLabel(asset))}</span><button class="admin-btn" type="button" data-cert-move="${esc(id)}|${index}|up"${index===0?' disabled':''} aria-label="${en?'Move up':'Đưa lên'}">↑</button><button class="admin-btn" type="button" data-cert-move="${esc(id)}|${index}|down"${index===proofs.length-1?' disabled':''} aria-label="${en?'Move down':'Đưa xuống'}">↓</button><button class="admin-btn" type="button" data-cert-preview="${esc(id)}|${index}">${en?'View':'Xem'}</button><button class="admin-btn danger" type="button" data-cert-remove="${esc(asset.id)}">×</button></div>`).join('')||`<span>${en?'No evidence uploaded':'Chưa có minh chứng'}</span>`}</div><button class="admin-btn" type="button" data-cert-choose="${esc(id)}">${en?'Choose from Media Library':'Chọn từ Media Library'}</button></div></article>`}).join('')}</section>`).join('')}</div>`;
}

function findCertAdminItem(id){return globalAdminContent?.experience?.certGroups?.flatMap(group=>group.items||[]).find(item=>item.id===id)||null}

async function detachCertificateMedia(id){
  const rows=[...new Map([...certAssetList(id),certCoverAsset(id)].filter(Boolean).map(row=>[row.id,row])).values()];
  for(const row of rows)if(!await assertAssetUnused(row.id,'#globalContentStatus',false))return false;
  const changed=[];
  try{
    for(const row of rows){
      await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=eq.${encodeURIComponent(row.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({project_id:null,owner_type:null,owner_id:null,sort_order:0})});
      changed.push(row);
    }
    return true;
  }catch(error){
    for(const row of changed.reverse())try{await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=eq.${encodeURIComponent(row.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({project_id:row.project_id??null,owner_type:row.owner_type??null,owner_id:row.owner_id??null,sort_order:row.sort_order??0})})}catch(_){error.rollbackError=true}
    setAdminStatus('#globalContentStatus','err',formatAssetUploadError(error));
    return false;
  }
}

async function reorderCertificateAssets(id,index,direction){
  const list=certAssetList(id),next=index+(direction==='up'?-1:1);
  if(index<0||next<0||next>=list.length)return;
  [list[index],list[next]]=[list[next],list[index]];
  try{
    await Promise.all(list.map((row,sort_order)=>sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=eq.${encodeURIComponent(row.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({sort_order})})));
    await loadAssets();
    mergeEditorInputs();
    renderGlobalEditor();
    
  }catch(err){setAdminStatus('#globalContentStatus','err',formatAssetUploadError(err))}
}

function mediaAccepts(row,accept){
  const mime=String(row?.mime_type||'').toLowerCase(),type=String(row?.asset_type||row?.type||'').toLowerCase();
  if(accept==='video')return mime.startsWith('video/')||type==='video';
  if(accept==='image')return mime.startsWith('image/')||type==='gallery';
  return true;
}

function mediaFilterMatch(row,filter){
  const mime=String(row?.mime_type||'').toLowerCase();
  if(filter==='image')return mime.startsWith('image/');
  if(filter==='video')return mime.startsWith('video/');
  if(filter==='audio')return mime.startsWith('audio/');
  if(filter==='pdf')return mime==='application/pdf';
  if(filter==='file')return !mime.startsWith('image/')&&!mime.startsWith('video/')&&!mime.startsWith('audio/')&&mime!=='application/pdf';
  return true;
}

function mediaAssetProject(row){return row?.project_id||row?.owner_id||''}

function mediaProjectKeys(key){let k=String(key||''),forcedOwner='';if(k.startsWith('insight:')){k=k.slice(8);forcedOwner='insight'}if(!k)return null;const keys=new Set([k]);const p=!forcedOwner&&(PROJECTS.find(x=>x.id===k||String(x.dbId||'')===k)||PROJECT_FALLBACK.find(x=>x.id===k));const insight=INSIGHTS_ADMIN.find(x=>x.id===k||String(x.dbId||'')===k)||INSIGHTS.find(x=>x.id===k||String(x.dbId||'')===k);if(p){keys.add(String(p.id));if(p.dbId)keys.add(String(p.dbId));keys.ownerType='project'}else if(insight){keys.add(String(insight.id));if(insight.dbId)keys.add(String(insight.dbId));keys.ownerType='insight'}return keys}

function mediaAssetBelongsTo(row,keys){if(!keys)return true;const ownerType=keys.ownerType;if(ownerType==='insight'&&row?.owner_type!=='insight')return false;if(ownerType==='project'&&row?.owner_type&&row.owner_type!=='project')return false;return [row?.project_id,row?.owner_id].some(v=>v!=null&&v!==''&&keys.has(String(v)))}

function blockAssetReferences(sections,assetId,label){
  const refs=[];
  (Array.isArray(sections)?sections:[]).forEach(section=>{
    const doc=normalizeBlockDocument(section.blocks,section.body_vi,section.body_en);
    doc.items.forEach((block,index)=>{
      const settings=block.settings||{},sectionName=`${label} — Section ${Number(section.sort_order||0)+1}`;
      if(settings.asset_id===assetId)refs.push(`${sectionName} · ${block.type} #${index+1}`);
      if(settings.poster_asset_id===assetId)refs.push(`${sectionName} · video poster #${index+1}`);
      if(Array.isArray(settings.asset_ids))settings.asset_ids.forEach((id,fileIndex)=>{if(id===assetId)refs.push(`${sectionName} · Gallery #${index+1} · ${fileIndex+1}`)});
    });
  });
  return refs;
}

function mediaUsage(assetId){
  const refs=[],blockRefs=[];
  const missingSources=[];
  if(assetLoadState!=='ready')missingSources.push({name:'assets',state:assetLoadState});
  if(projectDraftLoadState!=='ready')missingSources.push({name:'project drafts',state:projectDraftLoadState,error:projectDraftLoadError});
  if(insightAdminLoadState!=='ready'&&!(insightAdminLoadState==='missing'&&insightSchemaMissing))missingSources.push({name:insightAdminLoadError?.referenceSource||'insights',state:insightAdminLoadState,error:insightAdminLoadError});
  if(insightDraftLoadState!=='ready')missingSources.push({name:'insight drafts',state:insightDraftLoadState,error:insightDraftLoadError});
  if(!PROJECTS.every(project=>Array.isArray(project.sections)))missingSources.push({name:'project sections',state:'not loaded'});
  const known=missingSources.length===0;
  if(!assetId)return {count:0,refs,blockRefs,known,missingSources};
  if(!known)return {count:0,refs,blockRefs,known:false,missingSources};
  for(const project of PROJECTS){
    const cover=projectCovers.get(project.id);
    if(cover?.id===assetId)refs.push(`${project.id} — Project cover`);
    blockRefs.push(...blockAssetReferences(project.sections,assetId,project.id));
  }
  for(const insight of INSIGHTS_ADMIN){const cover=HQVShared.insightCovers.get(insight.id);if(cover?.id===assetId)refs.push(`${insight.id} — Insight cover`);blockRefs.push(...blockAssetReferences(insight.sections,assetId,`${insight.id} — Insight`))}
  for(const [slug,draft] of insightDrafts)blockRefs.push(...blockAssetReferences(draft.sections,assetId,`${slug} — Insight Draft`));
  for(const [slug,draft] of projectDrafts)blockRefs.push(...blockAssetReferences(draft.sections,assetId,`${slug} — Draft`));
  refs.push(...blockRefs);
  const owner=assetRegistry.get(assetId);
  if(owner?.owner_type==='insight')refs.push(`Insight — ${owner.owner_id}`);
  if(owner?.owner_type==='certificate'||owner?.owner_type==='experience')refs.push(`Certificate — ${owner.title_vi||owner.owner_id}`);
  else if(owner?.owner_type==='profile')refs.push('Profile — HQV');
  else if(owner?.owner_type==='insight')refs.push(`Insight — ${owner.owner_id}`);
  return {count:refs.length,refs,blockRefs,known:true};
}

function isMissingInsightSchemaError(error){
  const status=Number(error?.status)||0,detail=String(error?.detail||error?.message||'');
  return (status===404||status===400&&/PGRST205/i.test(detail))&&/portfolio_insights|portfolio_insight_sections|PGRST205|does not exist|schema cache/i.test(detail);
}

function referenceSourceDetail(source){
  const error=source.error,status=Number(error?.status)||Number(String(error?.message||'').match(/(?:supabase_)?(\d{3})/)?.[1]||0);
  return `${source.name} (${status?`HTTP ${status}`:`${source.state||'request failed'}; HTTP status unavailable`})`;
}

function referenceGuardMessage(sources){
  const detail=sources.map(referenceSourceDetail).join(', ');
  return currentLang==='en'?`Cannot verify reference sources: ${detail}. Operation blocked.`:`Không xác minh được nguồn tham chiếu: ${detail}. Đã chặn thao tác.`;
}

async function insightAssetReferences(assetId){
  try{
    const response=await sbFetch('/rest/v1/portfolio_insight_sections?select=id,insight_id,sort_order,blocks',{method:'GET'});
    const rows=await response.json();
    return blockAssetReferences((Array.isArray(rows)?rows:[]).map(row=>({...row,sort_order:row.sort_order||0})),assetId,'Insight');
  }catch(error){
    if(isMissingInsightSchemaError(error))return [];
    throw error;
  }
}

function mediaSelectionIds(){return mediaLibraryState.mode==='single'?(mediaLibraryState.selectedId?[mediaLibraryState.selectedId]:[]):[...mediaLibraryState.selectedIds]}

function mediaDetailHtml(row){
  if(!row)return `<div class="media-library-detail-preview"><span>${esc(t('admin.mediaNoSelection'))}</span></div>`;
  const usage=mediaUsage(row.id),url=getAssetUrl(row),mime=String(row.mime_type||'').toLowerCase();
  const image=mime.startsWith('image/');
  return `${image?`<div class="media-library-detail-preview"><img src="${esc(url)}" alt="${esc(row.original_name||'')}" data-media-detail-image></div>`:`<div class="media-library-detail-preview"><div class="media-library-file-icon">${esc(mediaTypeLabel(row))}</div></div>`}
    <dl><dt>${esc(t('admin.mediaId'))}</dt><dd>${esc(row.id)}</dd><dt>Filename</dt><dd>${esc(row.original_name||row.file_name||'')}</dd><dt>Type</dt><dd>${esc(mediaTypeLabel(row))}</dd><dt>MIME</dt><dd>${esc(row.mime_type||'')}</dd><dt>Size</dt><dd>${esc(formatMediaBytes(row.file_size))}</dd><dt>${esc(t('admin.mediaCreated'))}</dt><dd>${esc(formatAssetDate(row.created_at))}</dd><dt>${esc(t('admin.mediaOwner'))}</dt><dd>${esc(mediaAssetProject(row)||row.owner_type||'—')}</dd><dt>${esc(t('admin.mediaDimensions'))}</dt><dd data-media-dimensions>—</dd><dt>${esc(t('admin.mediaUsage'))}</dt><dd>${usage.count}${usage.count?` · ${esc(t('admin.mediaUsed').replace('{n}',String(usage.count)))}`:''}</dd></dl>`;
}

function mediaLibraryRows(){
  let rows=searchAssets(mediaLibraryState.query);
  rows=rows.filter(row=>mediaFilterMatch(row,mediaLibraryState.filter));
  if(mediaLibraryState.projectId){const keys=mediaProjectKeys(mediaLibraryState.projectId);rows=rows.filter(row=>mediaAssetBelongsTo(row,keys))}
  rows=rows.filter(row=>mediaAccepts(row,mediaLibraryState.accept));
  return rows;
}

function renderMediaLibrary(){
  const grid=$('[data-media-grid]'),detail=$('[data-media-detail]');if(!grid||!detail)return;
  const rows=mediaLibraryRows(),selected=mediaLibraryState.mode==='single'?mediaLibraryState.selectedId:null;
  grid.innerHTML=rows.length?rows.map(row=>{
    const image=String(row.mime_type||'').startsWith('image/'),sel=mediaLibraryState.mode==='single'?selected===row.id:mediaLibraryState.selectedIds.has(row.id);
    return `<button type="button" class="media-library-card ${sel?'is-selected':''}" data-media-id="${esc(row.id)}" aria-pressed="${sel}">
      <div class="media-library-thumb">${image?`<img src="${esc(getAssetUrl(row))}" alt="${esc(row.original_name||'')}" loading="lazy">`:`<span class="media-library-file-icon">${esc(mediaTypeLabel(row))}</span>`}</div>
      <strong>${esc(row.original_name||row.file_name||row.id)}</strong><span>${esc(mediaTypeLabel(row))} · ${esc(formatMediaBytes(row.file_size))}</span>
      ${sel?'<span class="media-library-check">✓</span>':''}
    </button>`;
  }).join(''):`<div class="media-library-empty">${esc(t('admin.noImageAssets'))}</div>`;
  const current=getAsset(mediaLibraryState.selectedId)||getAsset([...mediaLibraryState.selectedIds][0]);
  detail.innerHTML=mediaDetailHtml(current);
  const detailImage=detail.querySelector('[data-media-detail-image]');
  const dimensions=detail.querySelector('[data-media-dimensions]');
  if(detailImage&&dimensions){
    const applyDimensions=()=>{
      if(detailImage.naturalWidth&&detailImage.naturalHeight)dimensions.textContent=`${detailImage.naturalWidth} × ${detailImage.naturalHeight} px`;
      else dimensions.textContent='—';
    };
    if(detailImage.complete)applyDimensions();
    else detailImage.addEventListener('load',applyDimensions,{once:true,signal:controller.signal});
  }
  const confirm=$('[data-media-confirm]');if(confirm){const ids=mediaSelectionIds();confirm.disabled=mediaLibraryState.browseOnly||!ids.length&&!mediaLibraryState.allowEmptySelection||mediaLibraryState.mode==='multi'&&ids.some(id=>!getAsset(id));confirm.textContent=mediaLibraryState.browseOnly?t('admin.mediaCancel'):mediaLibraryState.mode==='single'?t('admin.mediaSelect'):t('admin.mediaInsert')}
  const remove=$('[data-media-delete]');if(remove){remove.disabled=mediaLibraryState.browseOnly||!mediaLibraryState.selectedId||!getAsset(mediaLibraryState.selectedId);remove.textContent=currentLang==='en'?'Delete permanently':'Xóa vĩnh viễn'}
}

function openMediaLibrary({mode='single',accept='image',selectedId=null,selectedIds=[],projectId='',ownerType='project',title='',onConfirm,browseOnly=false,allowEmptySelection=false}={}){
  if(!HQVShared.auth?.isAuthed()){setAdminStatus('#projectStatus','err',t('admin.loginRequired'));return}
  const selection=new Set(selectedIds||[]);
  Object.assign(mediaLibraryState,{mode,accept,projectId,ownerType,title,selectedId:selectedId||[...selection][0]||null,selectedIds:selection,query:'',filter:'all',onConfirm,browseOnly,allowEmptySelection});
  const dlg=$('#mediaLibraryDialog');if(!dlg)return;
  $('[data-media-title]').textContent=title||t('admin.mediaLibrary');$('[data-media-copy]').textContent=t('admin.mediaLibraryCopy');
  $('[data-media-query]').value='';$('[data-media-filter]').value='all';
  const projectSelect=$('[data-media-project]');
  projectSelect.innerHTML=`<option value="">${esc(t('admin.mediaAnyProject'))}</option>`+PROJECTS.map(p=>`<option value="${esc(p.id)}">${esc(p.content?.vi?.title||p.id)}</option>`).join('')+INSIGHTS_ADMIN.map(p=>`<option value="insight:${esc(p.id)}">Insight · ${esc(p.content?.vi?.title||p.id)}</option>`).join('');
  projectSelect.value=projectId?(ownerType==='insight'?`insight:${projectId}`:projectId):'';
  renderMediaLibrary();openModalDialog(dlg);
}

function closeMediaLibrary(){const dlg=$('#mediaLibraryDialog');closeModalDialog(dlg);mediaLibraryState.onConfirm=null;}

async function confirmMediaLibrary(){
  const ids=mediaSelectionIds();if(!ids.length&&!mediaLibraryState.allowEmptySelection)return;
  const button=$('[data-media-confirm]'),cb=mediaLibraryState.onConfirm;if(button)button.disabled=true;
  try{const result=typeof cb==='function'?await cb(mediaLibraryState.mode==='single'?ids[0]:ids.slice()):true;if(result!==false)closeMediaLibrary()}
  catch(error){const status=$('[data-media-status]');if(status){status.className='admin-status show err';status.textContent=formatAssetUploadError(error)}}
  finally{if($('#mediaLibraryDialog')?.open)renderMediaLibrary()}
}

function setMediaLibraryStatus(type,message){const status=$('[data-media-status]');if(status){status.className=`admin-status show ${type}`;status.textContent=message}}

function openMediaDeleteConfirmation(){
  const row=getAsset(mediaLibraryState.selectedId);if(!row)return;
  const group=row.asset_type==='gallery'&&row.gallery_id?[...assetRegistry.values()].filter(item=>item.asset_type==='gallery'&&item.gallery_id===row.gallery_id):[row];
  const message=currentLang==='en'?`Permanently delete ${group.length===1?'this file':`these ${group.length} gallery files`}? This cannot be undone.`:`Xóa vĩnh viễn ${group.length===1?'file này':`${group.length} file trong gallery này`}? Thao tác này không thể hoàn tác.`;
  pendingMediaDeleteId=row.id;
  if(window.confirm(message))permanentlyDeleteMediaSelection();
  else pendingMediaDeleteId=null;
}

async function permanentlyDeleteMediaSelection(){
  const id=pendingMediaDeleteId,row=id&&assetRegistry.get(id);if(!row)return;
  try{
    if(!await assertAssetUnused(id,'[data-media-status]'))return;
    const rows=row.asset_type==='gallery'&&row.gallery_id?[...assetRegistry.values()].filter(item=>item.asset_type==='gallery'&&item.gallery_id===row.gallery_id):[row];
    const result=await removeAssetRows(rows);await loadAssets();refreshAdminList();
    rows.forEach(item=>mediaLibraryState.selectedIds.delete(item.id));
    mediaLibraryState.selectedId=mediaLibraryState.selectedIds.values().next().value||null;
    setMediaLibraryStatus(result?.storageCleanupFailed?'warn':'ok',currentLang==='en'?(result?.storageCleanupFailed?'Metadata deleted, but some storage files could not be removed.':'Media permanently deleted.'):(result?.storageCleanupFailed?'Đã xóa metadata nhưng chưa dọn được một số file Storage.':'Đã xóa media vĩnh viễn.'));
    renderMediaLibrary();
  }catch(error){setMediaLibraryStatus('err',formatAssetUploadError(error))}
  finally{pendingMediaDeleteId=null}
}

function galleryItemsHtml(ids){
  const items=(Array.isArray(ids)?ids:[]).map(getAsset).filter(Boolean);
  return items.length?`<div class="admin-gallery-items" data-gallery-items>${items.map((a,i)=>`<div class="admin-gallery-item" data-gallery-index="${i}"><img src="${esc(getAssetUrl(a))}" alt="${esc(a.original_name||'')}"><div><strong>${esc(a.original_name||a.id)}</strong><span>${esc(mediaTypeLabel(a))} · ${esc(formatMediaBytes(a.file_size))}</span></div><div class="admin-gallery-actions"><button class="admin-btn" type="button" aria-label="Move gallery image up" data-gallery-up ${i===0?'disabled':''}>↑</button><button class="admin-btn" type="button" aria-label="Move gallery image down" data-gallery-down ${i===items.length-1?'disabled':''}>↓</button><button class="admin-btn danger" type="button" aria-label="Remove gallery image" data-gallery-remove>×</button></div></div>`).join('')}</div>`:`<div class="admin-block-empty">${esc(t('admin.galleryEmpty'))}</div>`;
}

function imageBlockPickerHtml(block){
  const s=block.settings||{},selected=s.asset_id||'',current=selected?getAsset(selected):null;
  const meta=current?`<div class="admin-image-meta" data-image-meta><img class="admin-image-thumb" src="${esc(getAssetUrl(current))}" alt=""><div><strong>${esc(current.original_name||current.file_name||current.id)}</strong><small>${esc(mediaTypeLabel(current))} · ${esc(current.mime_type||'image/*')} · ${esc(formatMediaBytes(current.file_size))}</small><small>${esc(current.id)}</small></div></div>`:`<div class="admin-image-empty" data-image-meta>${esc(t('admin.noImageAssets'))}</div>`;
  return `<div class="admin-image-picker" data-image-picker>${meta}<div class="admin-image-picker-row"><button class="admin-btn" type="button" data-media-choose-image>${esc(t('admin.chooseMedia'))}</button><button class="admin-btn" type="button" data-image-replace ${current?'':'disabled'}>${esc(currentLang==='en'?'Replace':'Thay thế')}</button><button class="admin-btn danger admin-image-remove" type="button" data-image-remove ${current?'':'disabled'}>${esc(currentLang==='en'?'Remove':'Bỏ chọn')}</button></div></div>`;
}

let adminDialog=null;











function jwtExpiredResponse(status,detail){return status===401||status===400&&/jwt|token|expired|invalid.*session/i.test(detail||'')}

function storageBucketUrl(){return CONFIG.supabase.url.replace(/\/$/,'')+`/storage/v1/object/${encodeURIComponent(CONFIG.supabase.bucket)}`}

function storageObjectUrl(path){return `${storageBucketUrl()}/${String(path).split('/').map(encodeURIComponent).join('/')}`}

async function storageRequest(url,options,objectPath,attempt=0){const token=await HQVShared.authToken();const request={...options,headers:{...options.headers,apikey:CONFIG.supabase.anonKey,Authorization:`Bearer ${token}`}};let response;try{response=await fetch(url,request)}catch(cause){const error=new Error('supabase_network_error');error.cause=cause;throw error}if(!response.ok){const detail=await response.text();console.error('[HQV storage]',{status:response.status,body:detail,method:request.method||'GET',objectPath});if(!attempt&&jwtExpiredResponse(response.status,detail)){try{await HQVShared.auth.refresh();return storageRequest(url,options,objectPath,1)}catch(error){HQVShared.auth?.onExpired?.();throw error}}const error=new Error(`storage_${String(request.method||'GET').toLowerCase()}_failed`);error.status=response.status;error.detail=detail;if(jwtExpiredResponse(response.status,detail)){HQVShared.auth?.onExpired?.();error.message='session_expired'}throw error}return response}

function safeFileName(name){return name.normalize('NFKD').replace(/[^\w.\- ]+/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-').slice(0,100)||'file'}

const deletingAssetIds=new Set();

function ownerLabel(row){
  if(row.asset_type==='avatar')return currentLang==='en'?'Profile · HQV':'Profile · HQV';
  if(row.owner_type==='insight')return INSIGHTS_ADMIN.find(item=>item.id===row.owner_id)?.content?.[currentLang]?.title||`Insight · ${row.owner_id}`;
  const p=PROJECTS.find(x=>x.id===row.owner_id||x.id===row.project_id);return p?.content[currentLang]?.title||row.owner_id||row.project_id||'—';
}

function assetTypeLabel(type){return ({avatar:'Avatar',project_cover:currentLang==='en'?'Project cover':'Ảnh bìa dự án',insight_cover:currentLang==='en'?'Insight cover':'Ảnh bìa Insight',cert_cover:currentLang==='en'?'Certificate cover':'Ảnh bìa chứng chỉ',proof:'Proof',gallery:'Gallery'})[type]||type}

function assetFileTypeLabel(row){const mime=String(row.mime_type||'').toLowerCase(),name=String(row.original_name||row.file_name||'').toLowerCase();if(row.asset_type==='gallery')return 'Gallery';if(row.type==='json'||mime==='application/json'||name.endsWith('.json'))return 'JSON';if(row.type==='pdf'||mime==='application/pdf'||name.endsWith('.pdf'))return 'PDF';if(mime.startsWith('image/'))return currentLang==='en'?'Image':'Ảnh';return row.type||mime.split('/').pop()||'File'}

function formatAssetDate(value){if(!value)return '';const d=new Date(value);if(Number.isNaN(d.getTime()))return '';return new Intl.DateTimeFormat(currentLang==='en'?'en-GB':'vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'}).format(d)}

function adminAssetProject(row){if(row.owner_type==='profile')return 'Profile · HQV';if(row.owner_type==='certificate')return 'Cert · '+(row.title_vi||row.owner_id);const p=PROJECTS.find(x=>x.id===row.owner_id||x.id===row.project_id);return p?.content?.[currentLang]?.title||p?.content?.en?.title||p?.content?.vi?.title||row.owner_id||row.project_id||'—'}

function assetActionLabel(action){const labels=currentLang==='en'?{open:'Open',preview:'Preview',download:'Download',replace:'Replace',delete:'Delete',viewGallery:'View gallery'}:{open:'Mở',preview:'Xem trước',download:'Tải',replace:'Thay thế',delete:'Xóa',viewGallery:'Xem gallery'};return labels[action]||action}

function adminProofRowHtml(row){
  const type=row.asset_type||'proof';
  const galleryRows=type==='gallery'?[...assetRegistry.values()].filter(item=>item.asset_type==='gallery'&&item.gallery_id===row.gallery_id).sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)):[];
  const title=currentLang==='en'?(row.title_en||row.title_vi||row.original_name):(row.title_vi||row.title_en||row.original_name);
  const project=adminAssetProject(row);
  const fileName=row.original_name||row.file_name||'';
  const size=formatAssetSize(row.file_size);
  const date=formatAssetDate(row.created_at);
  const galleryCount=galleryRows.length;
  const galleryLabel=currentLang==='en'?`${galleryCount} image${galleryCount===1?'':'s'}`:`${galleryCount} ảnh`;
  const details=type==='gallery'
    ?[assetTypeLabel(type),project,galleryLabel,date].filter(Boolean).map(esc).join(' · ')
    :[assetTypeLabel(type),project,assetFileTypeLabel(row),fileName,size,date].filter(Boolean).map(esc).join(' · ');
  const url=publicUrl(row.storage_path);
  const image=String(row.mime_type||'').startsWith('image/')&&type!=='gallery';
  const primary=type==='gallery'?'viewGallery':(image?'preview':'open');
  return `<article class="admin-proof admin-proof-rich" data-asset-id="${esc(row.id)}">${image?`<a class="admin-proof-thumb" href="${esc(url)}" target="_blank" rel="noopener"><img src="${esc(url)}" alt="${esc(fileName)}" loading="lazy"></a>`:''}<div class="admin-proof-main"><strong>${esc(title)}</strong><span>${details}</span><div class="admin-proof-actions">${type==='gallery'?`<button class="admin-btn" type="button" data-open-asset="${esc(row.id)}" data-action="viewGallery">${assetActionLabel('viewGallery')}</button>`:`<button class="admin-btn" type="button" data-open-asset="${esc(row.id)}" data-action="${primary}">${assetActionLabel(primary)}</button><button class="admin-btn" type="button" data-download-asset="${esc(row.id)}">${assetActionLabel('download')}</button>`}<button class="admin-btn" type="button" data-replace-asset="${esc(row.id)}">${assetActionLabel('replace')}</button><button class="admin-btn danger" type="button" data-delete-asset="${esc(row.id)}">${assetActionLabel('delete')}</button></div></div></article>`;
}

async function refreshAdminList(){
  const list=$('#adminProofList');if(!HQVShared.auth?.isAuthed()){list.innerHTML=`<div class="admin-empty">${esc(t('admin.loginRequired'))}</div>`;return}if(assetSchemaReady===null){list.innerHTML=`<div class="admin-empty">${esc(t('admin.schemaChecking'))}</div>`;return}if(!sbReady()){list.innerHTML=`<div class="admin-empty">${esc(t('admin.notConfigured'))}</div>`;return}if(assetLoadState==='schema_missing'){list.innerHTML=`<div class="admin-empty">${esc(t('admin.schemaMissing'))}</div>`;return}if(['auth','permission','network','error'].includes(assetLoadState)){const key={auth:'admin.authError',permission:'admin.permissionError',network:'admin.networkError',error:'admin.loadError'}[assetLoadState];list.innerHTML=`<div class="admin-empty">${esc(t(key))}</div>`;return}
  try{
    const source=[...assetRegistry.values()].filter(row=>['proof','gallery','avatar','project_cover','insight_cover','cert_cover'].includes(row.asset_type));
    const gallerySeen=new Set();
    const rows=source.filter(row=>{if(row.asset_type!=='gallery')return true;if(!row.gallery_id)return true;if(gallerySeen.has(row.gallery_id))return false;gallerySeen.add(row.gallery_id);return true}).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
    const groups=[{key:'project',label:currentLang==='en'?'Projects':'Dự án'},{key:'insight',label:'Insights'},{key:'certificate',label:currentLang==='en'?'Certificates & achievements':'Chứng chỉ & thành tựu'},{key:'profile',label:currentLang==='en'?'Profile':'Hồ sơ'}];
    const category=row=>row.owner_type==='profile'?'profile':row.owner_type==='insight'?'insight':row.owner_type==='certificate'||row.owner_type==='experience'?'certificate':'project';
    list.innerHTML=groups.map(group=>{const items=rows.filter(row=>category(row)===group.key);return `<section class="admin-proof-group"><h4>${esc(group.label)}</h4>${items.length?items.map(adminProofRowHtml).join(''):`<div class="admin-empty">${esc(currentLang==='en'?'No assets in this group.':'Nhóm này chưa có asset.')}</div>`}</section>`}).join('');
  }catch(err){list.innerHTML=`<div class="admin-empty">${esc(t('admin.uploadFailed'))}`}
}

async function replaceProofAsset(id){
  if(!HQVShared.auth?.isAuthed()){setAdminStatus('#adminUploadStatus','err',t('admin.loginRequired'));return}
  const row=assetRegistry.get(id);if(!row)return;
  if(!await assertAssetUnused(id))return;
  const input=document.createElement('input');input.type='file';input.multiple=row.asset_type==='gallery';input.accept=['avatar','project_cover','insight_cover','cert_cover'].includes(row.asset_type)?'image/*':row.asset_type==='gallery'?'image/*':ACCEPTED_ASSET_INPUT;input.hidden=true;document.body.appendChild(input);
  input.addEventListener('change',async()=>{
    const files=[...input.files];input.remove();if(!files.length)return;
    const ownerId=row.owner_id||row.project_id,ownerType=row.owner_type||'project',assetType=row.asset_type==='gallery'?'proof':row.asset_type,replaceType=row.asset_type==='gallery'?'gallery':row.asset_type,projectId=ownerType==='project'?(row.project_id||ownerId):null;
    setAdminStatus('#adminUploadStatus','ok',t('admin.uploading'));
    try{const uploaded=await uploadAssetBatch({assetType,ownerType,ownerId,projectId,titleVi:row.title_vi||row.original_name,titleEn:row.title_en||row.original_name,files});const cleanup=await replaceSingleAsset(replaceType,ownerType,ownerId,uploaded,row.asset_type==='gallery'?row.gallery_id:null,row.asset_type==='proof'?row.id:null);await loadAssets();refreshAdminList();renderGlobalEditor();if(ownerType==='project')$('#adminProject').value=ownerId;setAdminStatus('#adminUploadStatus',cleanupStatusType(cleanup),cleanupSuccessMessage(cleanup,'admin.uploaded'))}catch(error){logAssetFailure(error,{operation:'asset.replace',assetId:id,assetType:row.asset_type,ownerType:row.owner_type,ownerId});setAdminStatus('#adminUploadStatus','err',formatAssetUploadError(error))}
  },{once:true,signal:controller.signal});input.click();
}

async function replaceProofAsset(id){
  if(!HQVShared.auth?.isAuthed()){setAdminStatus('#adminUploadStatus','err',t('admin.loginRequired'));return}
  const row=assetRegistry.get(id);if(!row)return;
  if(!await assertAssetUnused(id))return;
  const input=document.createElement('input');input.type='file';input.multiple=row.asset_type==='gallery';input.accept=['avatar','project_cover','cert_cover'].includes(row.asset_type)?'image/*':row.asset_type==='gallery'?'image/*':ACCEPTED_ASSET_INPUT;input.hidden=true;document.body.appendChild(input);
  input.addEventListener('change',async()=>{
    const files=[...input.files];input.remove();if(!files.length)return;
    const ownerId=row.owner_id||row.project_id,ownerType=row.owner_type||'project',assetType=row.asset_type==='gallery'?'proof':row.asset_type,replaceType=row.asset_type==='gallery'?'gallery':row.asset_type,projectId=ownerType==='project'?(row.project_id||ownerId):null;
    setAdminStatus('#adminUploadStatus','ok',t('admin.uploading'));
    try{
      const uploaded=await uploadAssetBatch({assetType,ownerType,ownerId,projectId,titleVi:row.title_vi||row.original_name,titleEn:row.title_en||row.original_name,files});
      const cleanup=await replaceSingleAsset(replaceType,ownerType,ownerId,uploaded,row.asset_type==='gallery'?row.gallery_id:null,row.asset_type==='proof'?row.id:null);
      await loadAssets();refreshAdminList();renderGlobalEditor();
      if(ownerType==='project')$('#adminProject').value=ownerId;
      setAdminStatus('#adminUploadStatus',cleanupStatusType(cleanup),cleanupSuccessMessage(cleanup,'admin.uploaded'));
    }catch(error){logAssetFailure(error,{operation:'asset.replace',assetId:id,assetType:row.asset_type,ownerType:row.owner_type,ownerId:ownerId,bucket:CONFIG.supabase.bucket});setAdminStatus('#adminUploadStatus','err',formatAssetUploadError(error))}
  },{once:true,signal:controller.signal});
  input.click();
}

async function downloadAdminAsset(id){
  const row=assetRegistry.get(id);if(!row)return;
  const url=publicUrl(row.storage_path),name=row.original_name||row.file_name||'download';
  try{
    const response=await fetch(url,{credentials:'omit'});
    if(!response.ok)throw new Error(`download_http_${response.status}`);
    const blob=await response.blob();
    const objectUrl=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=objectUrl;link.download=name;link.rel='noopener';link.style.display='none';
    document.body.appendChild(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);
  }catch(err){
    console.error('Proof download failed',err);
    window.open(url,'_blank','noopener');
  }
}

function openAdminAsset(id,action='open'){
  const row=assetRegistry.get(id);if(!row)return;
  if(action==='viewGallery'&&row.asset_type==='gallery'&&row.gallery_id){
    const rows=[...assetRegistry.values()].filter(item=>item.asset_type==='gallery'&&item.gallery_id===row.gallery_id).sort((a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0));
    openAdminGalleryPreview(rows,row);
    return;
  }
  openAdminAssetPreview(row);
}

let adminAssetPreviewDialog=null;
let adminAssetPreviewRequest=0;

function ensureAdminAssetPreview(){
  if(adminAssetPreviewDialog?.isConnected)return adminAssetPreviewDialog;
  adminAssetPreviewDialog=document.createElement('dialog');
  adminAssetPreviewDialog.id='adminAssetPreviewDialog';
  adminAssetPreviewDialog.className='admin-asset-preview-dialog';
  adminAssetPreviewDialog.setAttribute('aria-modal','true');
  adminAssetPreviewDialog.innerHTML='<div class="admin-asset-preview-shell"><header class="admin-asset-preview-head"><div class="admin-asset-preview-heading"><strong data-asset-preview-title></strong><span data-asset-preview-meta></span></div><div class="admin-asset-preview-actions"><button class="admin-btn" type="button" data-preview-zoom-out hidden aria-label="Zoom out">−</button><button class="admin-btn" type="button" data-preview-zoom-reset hidden aria-label="Reset zoom">100%</button><button class="admin-btn" type="button" data-preview-zoom-in hidden aria-label="Zoom in">+</button><a class="admin-btn" data-asset-preview-open target="_blank" rel="noopener noreferrer">Open file</a><a class="admin-btn" data-asset-preview-download download>Download</a><button class="admin-btn" type="button" data-asset-preview-close aria-label="Close">×</button></div></header><div class="admin-asset-preview-body" data-asset-preview-body></div></div>';
  document.body.append(adminAssetPreviewDialog);
  adminAssetPreviewDialog.querySelector('[data-asset-preview-close]').addEventListener('click',()=>closeModalDialog(adminAssetPreviewDialog));
  adminAssetPreviewDialog.addEventListener('cancel',event=>{event.preventDefault();closeModalDialog(adminAssetPreviewDialog)});
  return adminAssetPreviewDialog;
}

function assetPreviewExtension(row){return String(row?.original_name||row?.file_name||'').toLowerCase().match(/\.([a-z0-9]+)$/)?.[1]||''}

function safePreviewName(row){return String(row?.original_name||row?.file_name||'file').replace(/[\\/:*?"<>|]+/g,'_')}

function parseCsvPreview(text){
  const rows=[];let row=[],value='',quoted=false;
  for(let i=0;i<text.length;i++){
    const char=text[i];
    if(quoted){if(char==='"'&&text[i+1]==='"'){value+='"';i++}else if(char==='"')quoted=false;else value+=char}
    else if(char==='"')quoted=true;
    else if(char===','){row.push(value);value=''}
    else if(char==='\n'){row.push(value.replace(/\r$/,''));rows.push(row);row=[];value=''}
    else value+=char;
  }
  if(value.length||row.length){row.push(value.replace(/\r$/,''));rows.push(row)}
  return rows.slice(0,201).map(cells=>cells.slice(0,30));
}

function csvPreviewHtml(text){
  const rows=parseCsvPreview(text);
  return `<div class="admin-asset-preview-table-wrap"><table class="admin-asset-preview-table"><tbody>${rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function bindAdminImageZoom(stage,image){
  let scale=1,x=0,y=0,drag=null;
  const buttons=adminAssetPreviewDialog.querySelectorAll('[data-preview-zoom-in],[data-preview-zoom-out],[data-preview-zoom-reset]');
  buttons.forEach(button=>{button.hidden=false});
  const apply=()=>{image.style.transform=`translate(${x}px,${y}px) scale(${scale})`;stage.style.cursor=scale>1?'grab':'zoom-in';adminAssetPreviewDialog.querySelector('[data-preview-zoom-reset]').textContent=`${Math.round(scale*100)}%`};
  const zoom=next=>{scale=Math.max(1,Math.min(8,next));if(scale===1){x=0;y=0}apply()};
  adminAssetPreviewDialog.querySelector('[data-preview-zoom-in]').onclick=()=>zoom(scale*1.25);
  adminAssetPreviewDialog.querySelector('[data-preview-zoom-out]').onclick=()=>zoom(scale/1.25);
  adminAssetPreviewDialog.querySelector('[data-preview-zoom-reset]').onclick=()=>zoom(1);
  stage.addEventListener('wheel',event=>{event.preventDefault();zoom(scale*Math.exp(-event.deltaY*.0015))},{passive:false});
  stage.addEventListener('dblclick',()=>zoom(scale===1?2.5:1));
  stage.addEventListener('pointerdown',event=>{if(scale<=1)return;drag={x:event.clientX,y:event.clientY,tx:x,ty:y};stage.setPointerCapture(event.pointerId);stage.classList.add('is-dragging')});
  stage.addEventListener('pointermove',event=>{if(!drag)return;x=drag.tx+event.clientX-drag.x;y=drag.ty+event.clientY-drag.y;apply()});
  const finish=()=>{drag=null;stage.classList.remove('is-dragging')};
  stage.addEventListener('pointerup',finish);stage.addEventListener('pointercancel',finish);
  image.addEventListener('load',apply,{once:true});apply();
}

function openAdminGalleryPreview(rows,representative){
  const dialog=ensureAdminAssetPreview(),body=dialog.querySelector('[data-asset-preview-body]'),url=publicUrl(representative.storage_path),name=safePreviewName(representative);
  adminAssetPreviewRequest++;dialog.querySelector('[data-asset-preview-title]').textContent=currentLang==='en'?'Proof gallery':'Bộ ảnh minh chứng';
  dialog.querySelector('[data-asset-preview-meta]').textContent=`${rows.length} ${currentLang==='en'?'items':'mục'}`;
  dialog.querySelector('[data-asset-preview-open]').href=url;dialog.querySelector('[data-asset-preview-download]').href=url;dialog.querySelector('[data-asset-preview-download]').download=name;
  dialog.querySelectorAll('[data-preview-zoom-in],[data-preview-zoom-out],[data-preview-zoom-reset]').forEach(button=>button.hidden=true);
  const images=rows.filter(item=>String(item.mime_type||'').startsWith('image/'));
  body.innerHTML=images.length?`<div class="admin-gallery-items">${images.map(item=>`<button class="admin-gallery-item" type="button" data-gallery-preview-asset="${esc(item.id)}"><img src="${esc(getAssetUrl(item))}" alt="${esc(item.original_name||'')}" loading="lazy"><span>${esc(item.original_name||mediaTypeLabel(item))}</span></button>`).join('')}</div>`:`<div class="admin-asset-preview-empty">${esc(currentLang==='en'?'No image files in this gallery.':'Gallery không có file ảnh.')}</div>`;
  body.querySelectorAll('[data-gallery-preview-asset]').forEach(button=>button.addEventListener('click',()=>{const asset=getAsset(button.dataset.galleryPreviewAsset);if(asset)openAdminAssetPreview(asset)}));
  if(!dialog.open)openModalDialog(dialog);
}

async function openAdminAssetPreview(row){
  const dialog=ensureAdminAssetPreview(),body=dialog.querySelector('[data-asset-preview-body]'),url=publicUrl(row.storage_path),name=safePreviewName(row),mime=String(row.mime_type||'').toLowerCase(),ext=assetPreviewExtension(row),requestId=++adminAssetPreviewRequest;
  const open=dialog.querySelector('[data-asset-preview-open]'),download=dialog.querySelector('[data-asset-preview-download]');
  dialog.querySelector('[data-asset-preview-title]').textContent=row.original_name||row.file_name||row.title_vi||name;
  dialog.querySelector('[data-asset-preview-meta]').textContent=`${mediaTypeLabel(row)} · ${formatAssetSize(row.file_size)}`;
  open.href=url;download.href=url;download.download=name;
  dialog.querySelectorAll('[data-preview-zoom-in],[data-preview-zoom-out],[data-preview-zoom-reset]').forEach(button=>button.hidden=true);
  if(!dialog.open)openModalDialog(dialog);
  if(mime.startsWith('image/')){
    body.innerHTML=`<div class="admin-asset-preview-stage"><img src="${esc(url)}" alt="${esc(row.original_name||'')}" draggable="false"></div>`;
    bindAdminImageZoom(body.querySelector('.admin-asset-preview-stage'),body.querySelector('img'));return;
  }
  if(mime==='application/pdf'||ext==='pdf'){
    body.innerHTML=`<iframe title="${esc(row.original_name||'PDF preview')}" src="${esc(url)}#view=FitH"></iframe>`;return;
  }
  if(mime.startsWith('video/')){body.innerHTML=`<div class="admin-asset-preview-empty"><video src="${esc(url)}" controls playsinline preload="metadata" style="max-width:100%;max-height:100%"></video></div>`;return}
  if(mime.startsWith('audio/')){body.innerHTML=`<div class="admin-asset-preview-empty"><div><strong>${esc(row.original_name||name)}</strong><audio src="${esc(url)}" controls preload="metadata"></audio></div></div>`;return}
  if(['doc','docx','xls','xlsx','ppt','pptx'].includes(ext)){
    const officeUrl=`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    body.innerHTML=`<iframe title="${esc(row.original_name||'Office document preview')}" referrerpolicy="no-referrer" src="${esc(officeUrl)}"></iframe>`;return;
  }
  if(['json','txt','csv'].includes(ext)||mime.startsWith('text/')){
    body.innerHTML=`<div class="admin-asset-preview-empty">${esc(currentLang==='en'?'Loading file preview…':'Đang tải bản xem trước…')}</div>`;
    try{
      if(Number(row.file_size||0)>2*1024*1024)throw new Error('preview_too_large');
      const response=await fetch(url,{credentials:'omit'});if(!response.ok)throw new Error(`preview_http_${response.status}`);
      const text=await response.text();if(requestId!==adminAssetPreviewRequest)return;
      if(ext==='csv'||mime==='text/csv')body.innerHTML=csvPreviewHtml(text);
      else if(ext==='json'||mime==='application/json'){let formatted=text;try{formatted=JSON.stringify(JSON.parse(text),null,2)}catch(_){}body.innerHTML=`<pre class="admin-asset-preview-text">${esc(formatted)}</pre>`}
      else body.innerHTML=`<pre class="admin-asset-preview-text">${esc(text)}</pre>`;
    }catch(error){if(requestId!==adminAssetPreviewRequest)return;body.innerHTML=`<div class="admin-asset-preview-empty"><div><strong>${esc(currentLang==='en'?'Inline preview unavailable':'Không thể xem trước trực tiếp')}</strong><p>${esc(error.message==='preview_too_large'?(currentLang==='en'?'This file is larger than the 2 MB inline preview limit.':'File vượt quá giới hạn xem trước trực tiếp 2 MB.'):(currentLang==='en'?'Open the file in a new tab or download it.':'Hãy mở file ở tab mới hoặc tải xuống.'))}</p></div></div>`}
    return;
  }
  body.innerHTML=`<div class="admin-asset-preview-empty"><div><strong>${esc(currentLang==='en'?'Preview is not available for this file type':'Chưa có trình xem trước cho định dạng này')}</strong><p>${esc(row.original_name||name)}</p><p>${esc(mediaTypeLabel(row))} · ${esc(formatAssetSize(row.file_size))}</p></div></div>`;
}

function setProjectStatus(type,msg){setAdminStatus('#projectStatus',type,msg)}

function projectSectionsFromRuntime(p){
  const vi=p.content?.vi||{},en=p.content?.en||{};
  const viStory=Array.isArray(vi.story)?vi.story:[],enStory=Array.isArray(en.story)?en.story:[];
  const count=Math.max(viStory.length,enStory.length);
  return Array.from({length:count},(_,i)=>({
    sort_order:i,
    title_vi:viStory[i]?.[0]||enStory[i]?.[0]||'',
    body_vi:viStory[i]?.[1]||enStory[i]?.[1]||'',
    title_en:enStory[i]?.[0]||viStory[i]?.[0]||'',
    body_en:enStory[i]?.[1]||viStory[i]?.[1]||''
  }));
}

function validateProjectPayload(payload,{creating=false}={}){
  if(!payload.slug||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug))throw new Error('invalid_slug');
  if(['cert','insight','admin'].includes(payload.slug))throw new Error(currentLang==='en'?'Project slug "cert", "insight" and "admin" are reserved routes.':'Slug project "cert", "insight" và "admin" là các route dành riêng.');
  if(!payload.title_vi||!payload.title_en)throw new Error('project_title_required');
  if(!Number.isInteger(payload.sort_order)||payload.sort_order<0)throw new Error('invalid_sort_order');
  if(!Array.isArray(payload.categories))throw new Error('invalid_categories');
  if(!Array.isArray(payload.stats))throw new Error('invalid_stats');
  if(payload.tone_a&&!/^#[0-9a-fA-F]{3,8}$/.test(String(payload.tone_a).trim()))throw new Error('invalid_tone_a');
  if(payload.tone_b&&!/^#[0-9a-fA-F]{3,8}$/.test(String(payload.tone_b).trim()))throw new Error('invalid_tone_b');
  if(!creating&&payload.slug!==$('#projectSlug').dataset.originalSlug)throw new Error('slug_locked');
}

function projectFormPayload(){
  const originalSlug=$('#projectSlug').dataset.originalSlug||'';
  const existing=originalSlug?projectAdminSource(projectBySlug(originalSlug)):null;
  const vi=existing?.content?.vi||{},en=existing?.content?.en||{};
  const keepExisting=(value,previous)=>String(value??'').trim()?value:(previous??value);
  let stats=[];
  try{stats=JSON.parse($('#projectStats').value.trim()||JSON.stringify(vi.stats||[]))}catch(_){throw new Error('invalid_stats_json')}
  if(!Array.isArray(stats))throw new Error('invalid_stats_json');
  const categories=$('#projectCategories').value.split(',').map(x=>x.trim()).filter(Boolean);
  const tone=existing?.tone||[];
  return {
    id:$('#projectDbId').value.trim()||null,
    slug:$('#projectSlug').value.trim()||originalSlug,
    sort_order:Number($('#projectSortOrder').value||existing?.index||0),
    published:projectBySlug($('#projectSlug').dataset.originalSlug||$('#projectSlug').value)?.published!==false,
    title_vi:keepExisting($('#projectTitleVi').value,vi.title),
    title_en:keepExisting($('#projectTitleEn').value,en.title),
    hook_vi:keepExisting($('#projectHookVi').value,vi.hook),
    hook_en:keepExisting($('#projectHookEn').value,en.hook),
    intro_vi:keepExisting($('#projectIntroVi').value,vi.intro),
    intro_en:keepExisting($('#projectIntroEn').value,en.intro),
    categories:categories.length?categories:(vi.category||[]),
    stats,
    visual_type:$('#projectVisualType').value.trim()||existing?.visual||'web',
    tone_a:$('#projectToneA').value.trim()||tone[0]||null,
    tone_b:$('#projectToneB').value.trim()||tone[1]||null
  };
}

function newBlock(type='paragraph'){
  const id=newId();
  const content={};
  const settings={};
  if(type==='list'||type==='workflow'){content.items_vi=[];content.items_en=[]}
  if(type==='table'||type==='chart'){content.text_vi='';content.text_en='';content.caption_vi='';content.caption_en=''}
  if(type==='chart')settings.chart_type='bar';
  if(type==='image'){content.caption_vi='';content.caption_en='';content.alt_vi='';content.alt_en='';settings.asset_id=''}
  if(type==='gallery'){content.caption_vi='';content.caption_en='';settings.asset_ids=[]}
  if(type==='video'){content.caption_vi='';content.caption_en='';settings.url='';settings.poster_asset_id=''}
  if(type==='file'){content.caption_vi='';content.caption_en='';settings.asset_id=''}
  if(type==='proof'){settings.asset_id=''}
  if(type==='heading'||type==='paragraph'||type==='richtext'||type==='quote'||type==='cta'){content.text_vi='';content.text_en=''}
  return {id,type,content,settings};
}

function blockTypeLabel(type){
  const map={heading:t('admin.blockHeading'),paragraph:t('admin.blockParagraph'),richtext:t('admin.blockRichtext'),quote:t('admin.blockQuote'),table:currentLang==='en'?'Table':'Bảng',chart:currentLang==='en'?'Data chart':'Biểu đồ dữ liệu',list:t('admin.blockList'),image:t('admin.blockImage'),gallery:t('admin.blockGallery'),video:t('admin.blockVideo'),workflow:t('admin.blockWorkflow'),divider:t('admin.blockDivider'),proof:t('admin.blockProof'),file:t('admin.blockFile'),cta:t('admin.blockCta')};
  return map[type]||type;
}

function richTextEditorHtml(field,value,langLabel){
  const html=sanitizeRichText(value);
  const placeholder=currentLang==='en'?'Write formatted content…':'Nhập nội dung có định dạng…';
  const btns=[['bold','<strong>B</strong>'],['italic','<em>I</em>'],['underline','<u>U</u>'],['formatBlock:H2','H2'],['formatBlock:H3','H3'],['insertUnorderedList','• List'],['insertOrderedList','1. List'],['createLink','Link'],['formatBlock:BLOCKQUOTE','Quote'],['undo','↶'],['redo','↷']];
  return `<div class="admin-richtext-wrap" data-richtext-wrap data-richtext-field="${esc(field)}"><div class="admin-richtext-toolbar" role="toolbar" aria-label="${esc(`Rich text ${langLabel}`)}">${btns.map(([cmd,label])=>`<button type="button" data-richtext-command="${esc(cmd)}">${label}</button>`).join('')}</div><div class="admin-richtext-editor" contenteditable="true" spellcheck="true" data-richtext-editor="${esc(field)}" data-placeholder="${esc(placeholder)}">${html}</div></div>`;
}

function blockEditorFields(block,lang){
  const c=block.content||{},s=block.settings||{},L=String(lang).toUpperCase(),vi=currentLang!=='en';
  const field=(label,inner,cls='')=>`<label class="admin-block-field${cls?' '+cls:''}"><span>${esc(label)}</span>${inner}</label>`;
  const input=(key,val)=>`<input class="admin-block-input" data-block-content="${esc(key)}" value="${esc(val||'')}">`;
  const area=(attr,key,val,cls='',rows=3)=>`<textarea class="admin-block-textarea${cls}" rows="${rows}" ${attr}="${esc(key)}">${esc(val)}</textarea>`;
  const rowsFor=val=>Math.min(18,Math.max(3,Math.ceil(String(val||'').length/80)+(String(val||'').split('\n').length-1)));
  const cap=`${vi?'Chú thích':'Caption'} ${L}`;
  let inner='';
  if(block.type==='richtext'){
    inner=`<div class="admin-block-field full"><span>${L}</span>${richTextEditorHtml(`text_${lang}`,blockText(block,lang),L)}<small class="admin-note">${esc(vi?'Có thể dán trực tiếp bảng từ Word/Excel/Google Sheets; định dạng bảng sẽ được giữ lại.':'Paste a table directly from Word/Excel/Google Sheets; table structure will be preserved.')}</small></div>`;
  }else if(block.type==='heading'){
    inner=field(L,area('data-block-content',editorialTextKey(block,lang),editorialTextForLang(block,lang),' admin-block-textarea-heading',1),'full');
  }else if(block.type==='paragraph'||block.type==='quote'||block.type==='cta'){
    const v=blockText(block,lang);
    inner=field(L,area('data-block-content',`text_${lang}`,v,block.type==='paragraph'?' admin-block-textarea-para':'',rowsFor(v)),'full');
  }else if(block.type==='table'||block.type==='chart'){
    const value=blockText(block,lang),caption=c[`caption_${lang}`]||'';
    const hint=block.type==='table'
      ?(vi?'Dán bảng từ Excel/Sheets (các cột được phân tách bằng tab) hoặc dán bảng trực tiếp vào block Định dạng.':'Paste a table from Excel/Sheets (tab-separated columns), or paste a table directly into a Formatted block.')
      :(vi?'Dữ liệu JSON: {"labels":["20","30"],"series":[{"name":"Nam","type":"line","values":[0.4,0.8]},{"name":"Nữ","type":"line","values":[0.6,0.9]}]}. Có thể tiếp tục dùng dữ liệu cũ dạng mỗi dòng nhãn,tab,giá trị.':'JSON data: {"labels":["20","30"],"series":[{"name":"Nam","type":"line","values":[0.4,0.8]},{"name":"Nữ","type":"line","values":[0.6,0.9]}]}. Legacy label<TAB>value rows remain supported.');
    inner=(block.type==='chart'?field(vi?'Loại biểu đồ':'Chart type',`<select class="admin-block-input" data-block-setting="chart_type"><option value="bar"${(s.chart_type||'bar')==='bar'?' selected':''}>${vi?'Cột dọc':'Vertical bar'}</option><option value="horizontal"${s.chart_type==='horizontal'?' selected':''}>${vi?'Thanh ngang':'Horizontal bar'}</option><option value="line"${s.chart_type==='line'?' selected':''}>${vi?'Đường':'Line'}</option><option value="pie"${s.chart_type==='pie'?' selected':''}>${vi?'Tròn':'Pie'}</option><option value="mixed"${s.chart_type==='mixed'?' selected':''}>${vi?'Hỗn hợp':'Mixed'}</option></select>`,'full'):'')+field(`${L} · ${block.type==='table'?(vi?'dán dữ liệu dạng TSV':'paste TSV data'):(vi?'dữ liệu biểu đồ':'chart data')}`,`${area('data-block-content',`text_${lang}`,value,'',rowsFor(value))}<small class="admin-note">${esc(hint)}</small>`,'full')+field(`${vi?'Chú thích':'Caption'} ${L}`,input(`caption_${lang}`,caption),'full');
  }else if(block.type==='list'||block.type==='workflow'){
    const items=Array.isArray(c[`items_${lang}`])?c[`items_${lang}`]:[];
    inner=field(`${vi?'Mục':'Items'} ${L} · ${vi?'mỗi dòng một mục':'one item per line'}`,area('data-block-items',`items_${lang}`,items.join('\n'),'',Math.min(12,Math.max(3,items.length+1))),'full')+field(cap,input(`caption_${lang}`,c[`caption_${lang}`]),'full');
  }else if(block.type==='image'){
    inner=`<div class="admin-block-field full"><span>${esc(vi?'Asset hình ảnh / GIF':'Image / GIF asset')}</span>${imageBlockPickerHtml(block)}</div>`+field(cap,input(`caption_${lang}`,c[`caption_${lang}`]),'full')+field(`Alt ${L}`,input(`alt_${lang}`,c[`alt_${lang}`]),'full');
  }else if(block.type==='gallery'){
    inner=`<div class="admin-block-field full"><span>${esc(t('admin.manageGallery'))}</span><div class="admin-actions"><button class="admin-btn" type="button" data-gallery-manage>${esc(t('admin.manageGallery'))}</button></div>${galleryItemsHtml(s.asset_ids)}</div>`+field(cap,input(`caption_${lang}`,c[`caption_${lang}`]),'full');
  }else if(block.type==='video'){
    const a=s.asset_id?getAsset(s.asset_id):null,poster=s.poster_asset_id?getAsset(s.poster_asset_id):null;
    const meta=a?`<div class="admin-image-meta"><div><strong>${esc(a.original_name||a.id)}</strong><small>${esc(mediaTypeLabel(a))} · ${esc(a.mime_type||'')}</small><small>${esc(a.id)}</small></div></div>`:`<div class="admin-image-empty">${esc(t('admin.mediaNoSelection'))}</div>`;
    inner=field(t('admin.videoUrl'),`<input class="admin-block-input" data-block-setting="url" value="${esc(s.url||'')}" placeholder="https://..."><small class="admin-note">${esc(vi?'URL YouTube/Vimeo hoặc link HTTPS trực tiếp tới video MP4/WebM (ví dụ Cloudflare R2).':'YouTube/Vimeo URL or a direct HTTPS link to an MP4/WebM video (for example, Cloudflare R2).')}</small>`,'full')
      +field(vi?'Cover video trên index':'Index video cover',`<select class="admin-block-input" data-block-setting="cover_ratio"><option value=""${!s.cover_ratio?' selected':''}>${esc(vi?'Không dùng làm cover':'Do not use as cover')}</option><option value="auto"${s.cover_ratio==='auto'?' selected':''}>${esc(vi?'Tự động theo video':'Auto from video')}</option><option value="portrait"${s.cover_ratio==='portrait'?' selected':''}>${esc(vi?'Dọc · 9:16':'Portrait · 9:16')}</option><option value="square"${s.cover_ratio==='square'?' selected':''}>${esc(vi?'Vuông · 1:1':'Square · 1:1')}</option><option value="landscape"${s.cover_ratio==='landscape'?' selected':''}>${esc(vi?'Ngang · 16:9':'Landscape · 16:9')}</option></select><small class="admin-note">${esc(vi?'Tự động nhận dạng dọc/vuông/ngang; video nằm cạnh nội dung, không che text.':'Auto-detect portrait/square/landscape; video stays beside the text.')}</small>`,'full')
      +`<div class="admin-block-field full"><span>${esc(vi?'Hoặc chọn video có sẵn trong Media Library':'Or pick an existing video from the Media Library')}</span><div class="admin-image-picker" data-video-picker>${meta}<div class="admin-actions"><button class="admin-btn" type="button" data-video-choose>${esc(t('admin.chooseMedia'))}</button>${a?`<button class="admin-btn danger" type="button" data-video-remove>${esc(vi?'Bỏ chọn':'Remove')}</button>`:''}</div></div></div>`
      +`<div class="admin-block-field full"><span>${esc(vi?'Poster hình ảnh (tùy chọn)':'Image poster (optional)')}</span><div class="admin-image-picker" data-video-poster-picker>${poster?`<div class="admin-image-meta"><img class="admin-image-thumb" src="${esc(getAssetUrl(poster))}" alt=""><div><strong>${esc(poster.original_name||poster.id)}</strong><small>${esc(mediaTypeLabel(poster))} · ${esc(poster.id)}</small></div></div>`:`<div class="admin-image-empty">${esc(t('admin.noImageAssets'))}</div>`}<div class="admin-actions"><button class="admin-btn" type="button" data-video-poster-choose>${esc(t('admin.chooseMedia'))}</button>${poster?`<button class="admin-btn danger" type="button" data-video-poster-remove>${esc(vi?'Bỏ poster':'Remove poster')}</button>`:''}</div></div></div>`
      +field(cap,input(`caption_${lang}`,c[`caption_${lang}`]),'full');
  }else if(block.type==='file'){
    const a=s.asset_id?getAsset(s.asset_id):null;
    inner=`<div class="admin-block-field full"><span>${esc(vi?'Tài liệu tải xuống':'Downloadable file')}</span><div class="admin-image-picker" data-file-picker>${a?`<div class="admin-image-meta"><div><strong>${esc(a.original_name||a.id)}</strong><small>${esc(mediaTypeLabel(a))} · ${esc(a.id)}</small></div></div>`:`<div class="admin-image-empty">${esc(t('admin.mediaNoSelection'))}</div>`}<div class="admin-actions"><button class="admin-btn" type="button" data-file-choose>${esc(t('admin.chooseMedia'))}</button>${a?`<button class="admin-btn danger" type="button" data-file-remove>${esc(vi?'Bỏ chọn':'Remove')}</button>`:''}</div></div></div>`+field(cap,input(`caption_${lang}`,c[`caption_${lang}`]),'full');
  }else if(block.type==='proof'){
    const a=s.asset_id?getAsset(s.asset_id):null;
    inner=`<div class="admin-block-field full"><span>${esc(t('admin.proofChoose'))}</span><div class="admin-image-picker" data-proof-picker>${a?`<div class="admin-image-meta"><div><strong>${esc(a.original_name||a.id)}</strong><small>${esc(mediaTypeLabel(a))} · ${esc(a.mime_type||'')}</small><small>${esc(a.id)}</small></div></div>`:`<div class="admin-image-empty">${esc(t('admin.mediaNoSelection'))}</div>`}<div class="admin-actions"><button class="admin-btn" type="button" data-proof-choose>${esc(t('admin.chooseMedia'))}</button>${a?`<button class="admin-btn danger" type="button" data-proof-remove>${esc(vi?'Bỏ chọn':'Remove')}</button>`:''}</div></div></div>`;
  }else if(block.type==='divider'){
    inner=`<div class="admin-block-empty">${esc(vi?'Divider — dải phân cách, không có nội dung cần nhập.':'Divider — a visual separator, nothing to type.')}</div>`;
  }else{
    inner=`<div class="admin-block-empty">${esc(vi?'Block này không có trường cần chỉnh sửa.':'This block type has no editable fields.')}</div>`;
  }
  return `<div class="admin-block-grid">${inner}</div>`;
}

function renderBlockEditor(block,index,total,lang){
  return `<article class="admin-block" data-block-id="${esc(block.id)}" data-block-type="${esc(block.type)}">
    <div class="admin-block-head"><strong>${String(index+1).padStart(2,'0')} · ${esc(blockTypeLabel(block.type))}</strong><div class="admin-block-actions">
      <button class="admin-btn" type="button" data-block-up ${index===0?'disabled':''}>${esc(t('admin.moveUp'))}</button>
      <button class="admin-btn" type="button" data-block-down ${index===total-1?'disabled':''}>${esc(t('admin.moveDown'))}</button>
      <button class="admin-btn" type="button" data-block-duplicate>${esc(t('admin.duplicate'))}</button>
      <button class="admin-btn danger" type="button" data-block-delete>${esc(t('admin.blockDelete'))}</button>
    </div></div>
    <div class="admin-block-body">${blockEditorFields(block,lang)}<div class="admin-block-preview"><div class="admin-block-preview-label">${esc(t('admin.previewLabel'))} · ${String(lang).toUpperCase()}</div><div class="admin-block-preview-content" data-block-preview></div></div></div>
  </article>`;
}

function sectionBlocksFromRow(row){
  try{return validateBlockDocument(JSON.parse(row.dataset.blocks||'{"version":1,"items":[]}'))}
  catch(_){return {version:BLOCKS_VERSION,items:[]}}
}

function editorialTextBlockType(type){
  return ['heading','paragraph','richtext','quote','cta'].includes(type);
}

function editorialLangOf(row){return row&&row.dataset.editorialLang==='en'?'en':'vi'}

function editorialTextForLang(block,lang){
  const c=block.content||{};
  if(block.type==='heading'){
    const title=c[`title_${lang}`],text=c[`text_${lang}`];
    if(typeof title==='string'&&title!=='')return title;
    return String(text??title??c.text??'');
  }
  return String(c[`text_${lang}`]??c[`title_${lang}`]??c.text??'');
}

function editorialTextKey(block,lang){
  const c=block.content||{};
  if(block.type==='heading'){
    const nonEmpty=k=>typeof c[k]==='string'&&c[k]!=='';
    if(nonEmpty(`title_${lang}`))return `title_${lang}`;
    if(nonEmpty(`text_${lang}`))return `text_${lang}`;
    if(`title_${lang}` in c)return `title_${lang}`;
  }
  return `text_${lang}`;
}

function editorialAutosize(root){
  (root||document).querySelectorAll('textarea.admin-block-textarea-para,textarea.admin-block-textarea-heading').forEach(el=>{
    const h=el.scrollHeight;
    if(h>0)el.style.height=Math.max(h+2,el.classList.contains('admin-block-textarea-heading')?44:84)+'px';
  });
}

const EDITORIAL_ADD_MENU=[['paragraph','paragraph'],['heading','heading'],['image','image'],['video','video'],['gif','image'],['gallery','gallery'],['table','table'],['chart','chart'],['quote','quote'],['list','list'],['workflow','workflow'],['proof','proof'],['file','file'],['divider','divider'],['cta','cta'],['richtext','richtext']];

function editorialInserterHtml(at,total){
  const add=currentLang==='en'?'+ Add content':'+ Thêm nội dung';
  const items=EDITORIAL_ADD_MENU.map(([key,type])=>`<button class="admin-btn" type="button" data-ins-type="${type}">${esc(key==='gif'?'GIF':blockTypeLabel(type))}</button>`).join('');
  return `<div class="admin-ins${total===0?' is-empty':''}" data-ins-at="${at}"><button class="admin-ins-btn" type="button" data-ins-toggle aria-expanded="false">${esc(add)}</button><div class="admin-ins-menu" hidden>${items}</div></div>`;
}

function editorialSyncTabs(row){
  const lang=editorialLangOf(row);
  row.querySelectorAll('[data-editorial-lang-tab]').forEach(tab=>{
    const active=tab.dataset.editorialLangTab===lang;
    tab.classList.toggle('is-active',active);
    tab.setAttribute('aria-selected',active?'true':'false');
  });
}

function updateSectionBlockPreview(blockEl,block,lang){
  const host=blockEl.querySelector('[data-block-preview]');if(!host)return;
  try{host.innerHTML=renderBlock(block,lang==='en'?'en':'vi',{adminPreview:true})||`<div class="admin-block-empty">${esc(currentLang==='en'?'Nothing to preview yet.':'Chưa có nội dung để xem trước.')}</div>`}
  catch(_){host.innerHTML=`<div class="admin-block-empty">${esc(t('admin.invalidBlock'))}</div>`}
}

function refreshEditorialSectionRow(row){
  const doc=sectionBlocksFromRow(row);
  const seen=new Set();doc.items.forEach(b=>{if(seen.has(b.id))b.id=newId();seen.add(b.id)});
  row.dataset.blocks=JSON.stringify(doc);
  const lang=editorialLangOf(row);
  const host=row.querySelector('[data-editorial-section-body]');
  if(!host)return;
  const total=doc.items.length;
  host.innerHTML=`<div class="admin-block-stream-list" data-block-stream>${doc.items.map((b,i)=>`${editorialInserterHtml(i,total)}${renderBlockEditor(b,i,total,lang)}`).join('')}${editorialInserterHtml(total,total)}</div>`;
  const cards=[...host.querySelectorAll('article[data-block-id]')];
  cards.forEach((el,i)=>{if(doc.items[i])updateSectionBlockPreview(el,doc.items[i],lang)});
  editorialAutosize(host);
  editorialSyncTabs(row);
}

function syncBlockFromEditor(blockEl,block){
  block.content=block.content||{};block.settings=block.settings||{};
  blockEl.querySelectorAll('[data-richtext-editor]').forEach(el=>{
    const key=el.dataset.richtextEditor;
    block.content[key]=sanitizeRichText(el.innerHTML);
  });
  blockEl.querySelectorAll('[data-block-content]').forEach(el=>{block.content[el.dataset.blockContent]=el.value});
  blockEl.querySelectorAll('[data-block-setting]').forEach(el=>{block.settings[el.dataset.blockSetting]=el.value.trim()});
  blockEl.querySelectorAll('[data-block-items]').forEach(el=>{block.content[el.dataset.blockItems]=el.value.split(/\n+/).map(x=>x.trim()).filter(Boolean)});
  blockEl.querySelectorAll('[data-block-setting-list]').forEach(el=>{block.settings[el.dataset.blockSettingList]=el.value.split(/\n+/).map(x=>x.trim()).filter(Boolean)});
  return block;
}

function refreshSectionBlockEditor(row){
  refreshEditorialSectionRow(row);
}

function readSectionBlockEditors(row){
  const doc=sectionBlocksFromRow(row);
  [...row.querySelectorAll('article[data-block-id]')].forEach((el,i)=>{
    const block=doc.items[i];
    if(block&&block.id===el.dataset.blockId)syncBlockFromEditor(el,block);
  });
  validateBlockDocument(doc);
  row.dataset.blocks=JSON.stringify(doc);
  return doc;
}

function mutateEditorialRow(row,mutator,opts={}){
  if(!row||!row.isConnected)return null;
  const doc=readSectionBlockEditors(row);
  if(mutator(doc)===false)return doc;
  validateBlockDocument(doc);
  row.dataset.blocks=JSON.stringify(doc);
  refreshEditorialSectionRow(row);
  if(opts.focusId)editorialPlaceCaret(row,opts.focusId);
  return doc;
}

function editorialPlaceCaret(row,id){
  const card=[...row.querySelectorAll('article[data-block-id]')].find(x=>x.dataset.blockId===id);
  if(!card)return;
  try{
    const field=card.querySelector('textarea,input.admin-block-input,[contenteditable="true"]');
    if(field)field.focus({preventScroll:true});
    card.scrollIntoView({block:'nearest'});
  }catch(_){}
}

function editorialSetLang(row,lang){
  const next=lang==='en'?'en':'vi';
  if(editorialLangOf(row)===next){editorialSyncTabs(row);return}
  readSectionBlockEditors(row);            /* nothing typed in the old language may be lost */
  row.dataset.editorialLang=next;
  refreshEditorialSectionRow(row);         /* same blocks, same order — only the language fields change */
}

function editorialBlockContext(trigger){
  const blockEl=trigger.closest('article[data-block-id]'),row=trigger.closest('.admin-section-row');
  return blockEl&&row?{row,blockId:blockEl.dataset.blockId}:null;
}

function editorialMutateBlock(row,blockId,fn,opts){
  return mutateEditorialRow(row,doc=>{
    const b=doc.items.find(x=>x.id===blockId);
    if(!b)return false;
    return fn(b,doc);
  },opts);
}

function sectionEditorHost(row){return row?.closest('[data-section-host]')||$('#projectSectionsEditor')}
function sectionOwnerId(row){return sectionEditorHost(row)?.dataset.ownerId||''}
function editorialPickAsset(trigger,{mode,accept,title,clearUrl=false}){
  const ctx=editorialBlockContext(trigger);if(!ctx)return;
  const {row,blockId}=ctx;
  const key=mode==='single'?'asset_id':'asset_ids';
  const doc=readSectionBlockEditors(row);   /* sync before the editor is covered by the media dialog */
  const block=doc.items.find(x=>x.id===blockId);if(!block)return;
  openMediaLibrary({
    mode,accept,projectId:sectionOwnerId(row)||window.__blockEditorProjectId||'',ownerType:row.closest('[data-section-host]')?.dataset.sectionHost==='insight'?'insight':'project',title,
    selectedId:mode==='single'?(block.settings?.asset_id||null):null,
    selectedIds:mode==='multi'?(block.settings?.asset_ids||[]):[],
    onConfirm:value=>{editorialMutateBlock(row,blockId,b=>{b.settings[key]=value;if(clearUrl)b.settings.url=''},{focusId:blockId})}
  });
}

function editorialPickSettingAsset(trigger,setting,{accept,title}={}){
  const ctx=editorialBlockContext(trigger);if(!ctx)return;
  const {row,blockId}=ctx;
  const doc=readSectionBlockEditors(row),block=doc.items.find(x=>x.id===blockId);if(!block)return;
  openMediaLibrary({mode:'single',accept,projectId:sectionOwnerId(row)||window.__blockEditorProjectId||'',ownerType:row.closest('[data-section-host]')?.dataset.sectionHost==='insight'?'insight':'project',title,selectedId:block.settings?.[setting]||null,onConfirm:value=>editorialMutateBlock(row,blockId,b=>{b.settings[setting]=value},{focusId:blockId})});
}

function legacyBodyFromBlocks(doc,lang){
  return doc.items.filter(b=>b.type==='paragraph'||b.type==='richtext').map(b=>b.type==='richtext'?richTextToPlainText(b.content?.[`text_${lang}`]):String(b.content?.[`text_${lang}`]||'').trim()).filter(Boolean).join('\n\n');
}

function preserveBlankBlockText(blocks,original){
  const previous=new Map((original?.items||[]).map(block=>[block.id,block]));
  blocks.items.forEach(block=>{
    const old=previous.get(block.id);if(!old)return;
    block.content=block.content||{};
    Object.entries(block.content).forEach(([key,value])=>{
      const prior=old.content?.[key];
      if(typeof value==='string'&&!value.trim()&&typeof prior==='string'&&prior.trim())block.content[key]=prior;
      else if(Array.isArray(value)&&!value.length&&Array.isArray(prior)&&prior.length)block.content[key]=deepClone(prior);
    });
  });
  return blocks;
}

function projectSectionPayloads(host='#projectSectionsEditor'){
  const root=typeof host==='string'?$(host):host;
  return [...(root?.querySelectorAll('.admin-section-row')||[])].map((row,i)=>{
    const doc=readSectionBlockEditors(row),original=JSON.parse(row.dataset.originalBlocks||'{"version":1,"items":[]}');
    preserveBlankBlockText(doc,original);
    const titleVi=row.querySelector('[data-section-title-vi]').value,titleEn=row.querySelector('[data-section-title-en]').value;
    return {id:row.dataset.sectionId||null,sort_order:i,title_vi:titleVi.trim()?titleVi:row.dataset.originalTitleVi||'',title_en:titleEn.trim()?titleEn:row.dataset.originalTitleEn||'',body_vi:legacyBodyFromBlocks(doc,'vi'),body_en:legacyBodyFromBlocks(doc,'en'),blocks:doc};
  });
}

function renderProjectSectionEditor(sections=[],langs=null,hostArg='#projectSectionsEditor'){
  const host=typeof hostArg==='string'?$(hostArg):hostArg;
  if(host?.dataset.sectionHost==='project')window.__blockEditorProjectId=$('#projectSlug')?.dataset.originalSlug||$('#projectSlug')?.value||'';
  host.innerHTML=sections.map((s,i)=>{
    const doc=normalizeBlockDocument(s.blocks,s.body_vi,s.body_en);
    const lang=((langs&&langs[i])||(currentLang==='en'?'en':'vi'))==='en'?'en':'vi';
    return `<section class="admin-section-row admin-editorial-section" data-section-id="${esc(s.id||'')}" data-blocks="${esc(JSON.stringify(doc))}" data-original-blocks="${esc(JSON.stringify(doc))}" data-original-title-vi="${esc(s.title_vi||'')}" data-original-title-en="${esc(s.title_en||'')}" data-editorial-lang="${lang}">
      <div class="admin-editorial-section-head">
        <div><div class="admin-editorial-section-id">SECTION ${String(i+1).padStart(2,'0')}</div></div>
        <div class="admin-editorial-section-actions">
          <button class="admin-btn" type="button" data-section-up ${i===0?'disabled':''} aria-label="${esc(t('admin.sectionUp'))}">↑</button>
          <button class="admin-btn" type="button" data-section-down ${i===sections.length-1?'disabled':''} aria-label="${esc(t('admin.sectionDown'))}">↓</button>
          <button class="admin-btn" type="button" data-duplicate-section data-duplicate-project-section aria-label="${esc(t('admin.duplicateSection'))}">${esc(currentLang==='en'?'Duplicate':'Nhân bản')}</button>
          <button class="admin-btn danger" type="button" data-remove-section data-remove-project-section aria-label="${esc(t('admin.removeSection'))}">×</button>
        </div>
      </div>
      <div class="admin-editorial-title-grid">
        <label class="admin-label"><span>${esc(currentLang==='en'?'Title VI':'Tiêu đề VI')}</span><input class="admin-input" data-section-title-vi value="${esc(s.title_vi||'')}"></label>
        <label class="admin-label"><span>Title EN</span><input class="admin-input" data-section-title-en value="${esc(s.title_en||'')}"></label>
      </div>
      <div class="admin-editorial-language-tabs" role="tablist" aria-label="${esc(currentLang==='en'?'Section language':'Ngôn ngữ section')}">
        <button class="admin-editorial-language-tab${lang==='vi'?' is-active':''}" type="button" data-editorial-lang-tab="vi" role="tab" aria-selected="${lang==='vi'?'true':'false'}">VI</button>
        <button class="admin-editorial-language-tab${lang==='en'?' is-active':''}" type="button" data-editorial-lang-tab="en" role="tab" aria-selected="${lang==='en'?'true':'false'}">EN</button>
      </div>
      <div class="admin-editorial-wrap" data-editorial-section-body></div>
      <div class="admin-editorial-section-foot">
        <div class="admin-note">${esc(t('admin.blockEditorCopy'))}</div>
      </div>
    </section>`;
  }).join('');
  [...(host?.querySelectorAll('.admin-section-row')||[])].forEach(row=>refreshEditorialSectionRow(row));
}

function projectSectionLangs(host='#projectSectionsEditor'){const root=typeof host==='string'?$(host):host;return [...(root?.querySelectorAll('.admin-section-row')||[])].map(editorialLangOf)}

function renderProjectMediaManager(project){
  const host=$('#projectMediaList');if(!host)return;
  if(!project||!HQVShared.auth?.isAuthed()){host.innerHTML=`<div class="admin-empty">${esc(t('admin.loginRequired'))}</div>`;return;}
  const cover=projectCovers.get(project.id);
  const proofRows=[...assetRegistry.values()].filter(row=>(row.asset_type==='proof'||row.asset_type==='gallery')&&(row.owner_type==='project'||!row.owner_type)).filter(row=>(row.owner_id===project.id)||(row.project_id===project.id)).sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||'')));
  const rows=[];
  if(cover){rows.push(`<div class="admin-media-row"><div class="admin-media-main"><strong>${esc(currentLang==='en'?'Cover':'Cover')}</strong><span>${esc(cover.original_name||'')} · ${esc(formatAssetSize(cover.file_size))}</span></div><div class="admin-media-actions"><button class="admin-btn" type="button" data-project-cover-open="${esc(cover.id)}">${esc(assetActionLabel('open'))}</button><button class="admin-btn" type="button" data-project-cover-replace="${esc(project.id)}">${esc(assetActionLabel('replace'))}</button><button class="admin-btn danger" type="button" data-project-cover-delete="${esc(cover.id)}">${esc(assetActionLabel('delete'))}</button></div></div>`)}
  proofRows.forEach(row=>{
    const title=currentLang==='en'?(row.title_en||row.title_vi||row.original_name):(row.title_vi||row.title_en||row.original_name);
    rows.push(`<div class="admin-media-row"><div class="admin-media-main"><strong>${esc(title)}</strong><span>${esc(assetTypeLabel(row.asset_type))} · ${esc(assetFileTypeLabel(row))} · ${esc(row.original_name||'')}</span></div><div class="admin-media-actions"><button class="admin-btn" type="button" data-project-media-open="${esc(row.id)}">${esc(assetActionLabel(row.asset_type==='gallery'?'viewGallery':'open'))}</button><button class="admin-btn" type="button" data-project-media-replace="${esc(row.id)}">${esc(assetActionLabel('replace'))}</button><button class="admin-btn danger" type="button" data-project-media-delete="${esc(row.id)}">${esc(assetActionLabel('delete'))}</button></div></div>`);
  });
  host.innerHTML=rows.length?rows.join(''):`<div class="admin-empty">${esc(t('admin.noProjectMedia'))}</div>`;
}

function focusProjectMediaUpload(projectId){
  $('#adminProject').value=projectId;
  const proofInput=$('#proofFiles');if(proofInput)proofInput.click();
  $('#adminProject')?.scrollIntoView({behavior:'smooth',block:'center'});
}

function resetProjectEditor(){
  $('#projectForm').reset();$('#projectDbId').value='';$('#projectSlug').disabled=false;$('#projectSlug').dataset.originalSlug='';$('#projectSortOrder').value=PROJECTS.length+1;$('#projectVisualType').value='web';$('#projectStats').value='[]';renderProjectSectionEditor([]);$('#projectEditor').hidden=true;$('#projectStatus').className='admin-status';setProjectLifecycleUI({dbId:null,published:false,id:''});
}

function restoreProjectEditorBackup(backup){
  if(!HQVShared.auth?.isAuthed())throw new Error('login_required');
  if(!backup||!Array.isArray(backup.fields)||!Array.isArray(backup.sections))throw new Error('invalid_project_backup');
  const values=new Map(backup.fields.filter(field=>field?.id).map(field=>[field.id,field.value]));
  const slug=String(values.get('projectSlug')||'').trim();
  const titleVi=backup.fields.filter(field=>field?.dataset&&Object.prototype.hasOwnProperty.call(field.dataset,'sectionTitleVi'));
  const titleEn=backup.fields.filter(field=>field?.dataset&&Object.prototype.hasOwnProperty.call(field.dataset,'sectionTitleEn'));
  if(!slug||titleVi.length!==backup.sections.length||titleEn.length!==backup.sections.length)throw new Error('invalid_project_backup');
  const sections=backup.sections.map((section,index)=>{
    const blocks=JSON.parse(section.blocks);
    if(!blocks||!Array.isArray(blocks.items))throw new Error('invalid_project_backup');
    return {title_vi:titleVi[index].value||'',title_en:titleEn[index].value||'',blocks};
  });
  for(const id of ['projectDbId','projectSlug','projectSortOrder','projectTitleVi','projectTitleEn','projectHookVi','projectHookEn','projectIntroVi','projectIntroEn','projectCategories','projectVisualType','projectToneA','projectToneB','projectStats']){
    const field=$(`#${id}`);
    if(field&&values.has(id))field.value=values.get(id)??'';
  }
  const dbId=String(values.get('projectDbId')||'').trim();
  $('#projectSlug').dataset.originalSlug=slug;
  $('#projectSlug').disabled=!!dbId;
  $('#projectEditor').hidden=false;
  renderProjectSectionEditor(sections);
  setProjectLifecycleUI({id:slug,dbId:dbId||null,published:false});
  setProjectStatus('ok',currentLang==='en'?'Emergency backup restored into the editor. Save Draft to persist it.':'Đã khôi phục backup vào editor. Hãy bấm Lưu bản nháp để lưu lại.');
  return {slug,sections:sections.length};
}

async function saveProjectBackupAsNewDraft(backup){
  if(!HQVShared.auth?.isAuthed())throw new Error('login_required');
  if(!backup||!Array.isArray(backup.fields)||!Array.isArray(backup.sections))throw new Error('invalid_project_backup');
  const values=new Map(backup.fields.filter(field=>field?.id).map(field=>[field.id,field.value]));
  const value=id=>String(values.get(id)??'');
  const sourceSlug=value('projectSlug').trim();
  const titleViFields=backup.fields.filter(field=>field?.dataset&&Object.prototype.hasOwnProperty.call(field.dataset,'sectionTitleVi'));
  const titleEnFields=backup.fields.filter(field=>field?.dataset&&Object.prototype.hasOwnProperty.call(field.dataset,'sectionTitleEn'));
  if(!sourceSlug||titleViFields.length!==backup.sections.length||titleEnFields.length!==backup.sections.length)throw new Error('invalid_project_backup');
  let stats;
  try{stats=JSON.parse(value('projectStats')||'[]')}catch(_){throw new Error('invalid_stats_json')}
  if(!Array.isArray(stats))throw new Error('invalid_stats_json');
  const sections=backup.sections.map((section,index)=>{
    let blocks;
    try{blocks=JSON.parse(section.blocks)}catch(_){throw new Error('invalid_project_backup')}
    if(!blocks||!Array.isArray(blocks.items))throw new Error('invalid_project_backup');
    return {sort_order:index,title_vi:String(titleViFields[index].value||''),title_en:String(titleEnFields[index].value||''),blocks};
  });
  await loadProjectDrafts();
  const date=String(backup.savedAt||'').replace(/\D/g,'').slice(0,12)||String(Date.now());
  const stem=`${sourceSlug}-recovered-${date}`;
  let slug=stem,suffix=2;
  while(projectBySlug(slug)||projectDrafts.has(slug))slug=`${stem}-${suffix++}`;
  const project={id:null,slug,sort_order:Number(value('projectSortOrder'))||0,published:false,title_vi:value('projectTitleVi'),title_en:value('projectTitleEn'),hook_vi:value('projectHookVi'),hook_en:value('projectHookEn'),intro_vi:value('projectIntroVi'),intro_en:value('projectIntroEn'),categories:value('projectCategories').split(',').map(item=>item.trim()).filter(Boolean),stats,visual_type:value('projectVisualType')||'web',tone_a:value('projectToneA')||null,tone_b:value('projectToneB')||null};
  validateProjectPayload(project,{creating:true});
  const draft={version:1,project,sections};
  await upsertProjectDraftRow(`project.draft.${slug}`,draft);
  projectDrafts.set(slug,draft);
  refreshAdminProjectList();
  setProjectStatus('ok',currentLang==='en'?`Recovered draft saved as ${slug}.`:`Đã lưu bản nháp khôi phục với slug ${slug}.`);
  return {slug,sections:sections.length};
}

function editProject(project){
  const source=projectAdminSource(project);$('#projectEditor').hidden=false;$('#projectDbId').value=source.dbId||'';$('#projectSlug').value=source.id;$('#projectSlug').dataset.originalSlug=project.id||source.id;$('#projectSlug').disabled=!!source.dbId&&!source.__draftPayload;
  $('#projectSortOrder').value=Number(source.index)||1;const vi=source.content.vi,en=source.content.en;$('#projectTitleVi').value=vi.title||'';$('#projectTitleEn').value=en.title||'';$('#projectHookVi').value=vi.hook||'';$('#projectHookEn').value=en.hook||'';$('#projectIntroVi').value=vi.intro||'';$('#projectIntroEn').value=en.intro||'';$('#projectCategories').value=(vi.category||[]).join(', ');$('#projectVisualType').value=source.visual||'web';$('#projectToneA').value=source.tone?.[0]||'';$('#projectToneB').value=source.tone?.[1]||'';$('#projectStats').value=JSON.stringify(vi.stats||[],null,2);
  loadProjectSectionsIntoEditor(source).then(()=>setProjectLifecycleUI(source));renderProjectMediaManager(project);$('#projectTitleVi').focus();
}

async function loadProjectSectionsIntoEditor(project){
  if(project.__draftPayload&&Array.isArray(project.__draftPayload.sections)){renderProjectSectionEditor(project.__draftPayload.sections);return}
  if(!project.dbId){renderProjectSectionEditor(projectSectionsFromRuntime(project));return}
  try{const r=await sbFetch(`/rest/v1/portfolio_project_sections?select=id,project_id,sort_order,title_vi,body_vi,title_en,body_en,blocks&project_id=eq.${encodeURIComponent(project.dbId)}&order=sort_order.asc,id.asc`,{method:'GET'});const rows=await r.json();renderProjectSectionEditor(Array.isArray(rows)&&rows.length?rows:projectSectionsFromRuntime(project));}catch(_){renderProjectSectionEditor(projectSectionsFromRuntime(project))}
}

async function upsertProjectSections(projectId,sections){
  const existingR=await sbFetch(`/rest/v1/portfolio_project_sections?select=id&project_id=eq.${encodeURIComponent(projectId)}`,{method:'GET'});const existing=await existingR.json();const incoming=sections.filter(s=>s.title_vi||s.title_en||s.body_vi||s.body_en||(s.blocks&&Array.isArray(s.blocks.items)&&s.blocks.items.length));const keepIds=new Set(incoming.filter(s=>s.id).map(s=>s.id));const remove=(Array.isArray(existing)?existing:[]).filter(s=>!keepIds.has(s.id));
  if(remove.length){const ids=remove.map(s=>encodeURIComponent(s.id)).join(',');await sbFetch(`/rest/v1/portfolio_project_sections?id=in.(${ids})`,{method:'DELETE',headers:{Prefer:'return=minimal'}})}
  if(incoming.length){const rows=incoming.map((s,i)=>{const doc=sanitizeBlockDocument(s.blocks&&typeof s.blocks==='object'&&Array.isArray(s.blocks.items)?s.blocks:legacyParagraphDocument(s.body_vi,s.body_en));validateBlockDocument(doc);const bodyVi=legacyBodyFromBlocks(doc,'vi'),bodyEn=legacyBodyFromBlocks(doc,'en');return {...(s.id?{id:s.id}:{}),project_id:projectId,sort_order:i,title_vi:s.title_vi||null,body_vi:bodyVi||null,title_en:s.title_en||null,body_en:bodyEn||null,blocks:doc};});const existingRows=rows.filter(row=>row.id),newRows=rows.filter(row=>!row.id);for(const batch of [existingRows,newRows])if(batch.length)await sbFetch('/rest/v1/portfolio_project_sections',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(batch)})}
}

function projectDraftPayloadFromEditor(){return {version:1,project:projectFormPayload(),sections:projectSectionPayloads()}}

async function saveProjectDraft(){
  if(!HQVShared.auth?.isAuthed()){setProjectStatus('err',t('admin.loginRequired'));return}
  const btn=$('#saveProjectDraftBtn');btn.disabled=true;setProjectStatus('ok',t('admin.uploading'));
  try{
    const draft=projectDraftPayloadFromEditor();validateProjectPayload(draft.project,{creating:!draft.project.id});const oldSlug=$('#projectSlug').dataset.originalSlug||'';await upsertProjectDraftRow(`project.draft.${draft.project.slug}`,draft);if(oldSlug&&oldSlug!==draft.project.slug)await deleteContentKey(`project.draft.${oldSlug}`);projectDrafts.set(draft.project.slug,draft);$('#projectSlug').dataset.originalSlug=draft.project.slug;refreshAdminProjectList();setProjectLifecycleUI(projectBySlug(draft.project.slug)||projectFromDraftPayload({id:draft.project.slug,published:false},draft));setProjectStatus('ok',t('admin.projectDraftSaved'));
  }catch(err){setProjectStatus('err',projectErrorText(err))}finally{btn.disabled=false}
}

function validateProjectForPublish(payload,sections){
  validateProjectPayload(payload,{creating:!payload.id});
  const problems=[];if(!payload.title_vi||!payload.title_en)problems.push('Project titles VI and EN are required.');if(!Array.isArray(sections)||!sections.length)problems.push('At least one section is required.');
  const cover=projectCovers.get(payload.slug);if(cover&&!getAsset(cover.id))problems.push(`Project ${payload.slug} / Cover: asset is missing.`);
  (sections||[]).forEach((section,si)=>{let doc;try{doc=validateBlockDocument(section.blocks)}catch(err){problems.push(`Section ${String(si+1).padStart(2,'0')}: ${err.message}`);return}if(!doc.items.length)problems.push(`Section ${String(si+1).padStart(2,'0')} has no content blocks.`);doc.items.forEach((b,bi)=>{const prefix=`Section ${String(si+1).padStart(2,'0')} · Block ${String(bi+1).padStart(2,'0')}`;if(b.type==='image'){const a=getAsset(b.settings?.asset_id);if(!a)problems.push(`${prefix}: Image asset is missing.`);else if(a.asset_type!=='proof'&&a.asset_type!=='gallery')problems.push(`${prefix}: Selected asset is not a project media/proof asset.`);else if(!String(a.mime_type||'').startsWith('image/'))problems.push(`${prefix}: Selected asset is not an image.`)}if(b.type==='gallery'){const ids=Array.isArray(b.settings?.asset_ids)?b.settings.asset_ids:[];if(!ids.length)problems.push(`${prefix}: Gallery is empty.`);ids.forEach(id=>{const a=getAsset(id);if(!a)problems.push(`${prefix}: Gallery asset ${id} is missing.`);else if(a.asset_type!=='gallery'&&a.asset_type!=='proof')problems.push(`${prefix}: Gallery asset ${id} is not a project media asset.`);else if(!String(a.mime_type||'').startsWith('image/'))problems.push(`${prefix}: Gallery reference ${id} is not an image asset.`)})}if(b.type==='proof'&&b.settings?.asset_id){const a=getAsset(b.settings.asset_id);if(!a)problems.push(`${prefix}: Proof asset is missing.`);else if(!['proof','gallery','project_cover'].includes(a.asset_type))problems.push(`${prefix}: Selected asset is not a valid proof/media asset.`)}if(b.type==='video'&&b.settings?.url&&!safeEmbedUrl(b.settings.url))problems.push(`${prefix}: Unsupported video URL.`);if(b.type==='video'&&!b.settings?.url&&b.settings?.asset_id){const va=getAsset(b.settings.asset_id);if(!va)problems.push(`${prefix}: Video asset is missing.`);else if(!String(va.mime_type||'').toLowerCase().startsWith('video/'))problems.push(`${prefix}: Selected asset is not a video.`)}});});
  if(problems.length){const e=new Error('publish_validation_failed');e.validation=problems;throw e}
}

async function currentProjectSnapshot(projectId){const pr=await sbFetch(`/rest/v1/portfolio_projects?select=id,slug,sort_order,published,title_vi,title_en,hook_vi,hook_en,intro_vi,intro_en,categories,stats,visual_type,tone_a,tone_b&id=eq.${encodeURIComponent(projectId)}`,{method:'GET'});const rows=await pr.json();if(!Array.isArray(rows)||!rows[0])throw new Error('project_not_found');const sr=await sbFetch(`/rest/v1/portfolio_project_sections?select=id,project_id,sort_order,title_vi,body_vi,title_en,body_en,blocks&project_id=eq.${encodeURIComponent(projectId)}&order=sort_order.asc,id.asc`,{method:'GET'});const sections=await sr.json();return {row:rows[0],sections:Array.isArray(sections)?sections:[]}}

async function restoreProjectSnapshot(snapshot){if(!snapshot?.row)return;await sbFetch(`/rest/v1/portfolio_projects?id=eq.${encodeURIComponent(snapshot.row.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(snapshot.row)});const existing=await sbFetch(`/rest/v1/portfolio_project_sections?select=id&project_id=eq.${encodeURIComponent(snapshot.row.id)}`,{method:'GET'});const ids=await existing.json();if(Array.isArray(ids)&&ids.length){await sbFetch(`/rest/v1/portfolio_project_sections?id=in.(${ids.map(x=>encodeURIComponent(x.id)).join(',')})`,{method:'DELETE',headers:{Prefer:'return=minimal'}})}if(snapshot.sections.length)await sbFetch('/rest/v1/portfolio_project_sections',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(snapshot.sections)})}

function supabaseErrorDetail(error){
  const raw=String(error?.detail||'').trim();
  if(!raw)return error?.message||'Unknown Supabase error';
  try{const body=JSON.parse(raw);return [body.message,body.details,body.hint,body.code].filter(Boolean).join(' · ')||raw}catch(_){return raw}
}

async function publishProject(){
  if(!HQVShared.auth?.isAuthed()){setProjectStatus('err',t('admin.loginRequired'));return}
  const btn=$('#publishProjectBtn');btn.disabled=true;setProjectStatus('ok',t('admin.uploading'));let createdId=null,snapshot=null,recoveryDraft=null,recoveryDraftKey='',recoveryDraftDeleted=false,liveWriteApplied=false,stage='building project payload';
  try{
    const draft=projectDraftPayloadFromEditor();validateProjectPayload(draft.project,{creating:!draft.project.id});
    recoveryDraft=draft;recoveryDraftKey=`project.draft.${draft.project.slug}`;stage='saving recovery draft';await upsertProjectDraftRow(recoveryDraftKey,draft);projectDrafts.set(draft.project.slug,draft);
    validateProjectForPublish(draft.project,draft.sections);
    const body={slug:draft.project.slug,sort_order:draft.project.sort_order,published:true,title_vi:draft.project.title_vi,title_en:draft.project.title_en,hook_vi:draft.project.hook_vi||null,hook_en:draft.project.hook_en||null,intro_vi:draft.project.intro_vi||null,intro_en:draft.project.intro_en||null,categories:draft.project.categories,stats:draft.project.stats,visual_type:draft.project.visual_type,tone_a:draft.project.tone_a,tone_b:draft.project.tone_b};let projectId=draft.project.id;
    if(projectId){stage='reading live project snapshot';snapshot=await currentProjectSnapshot(projectId);stage='updating project row';await sbFetch(`/rest/v1/portfolio_projects?id=eq.${encodeURIComponent(projectId)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(body)});liveWriteApplied=true}
    else{stage='creating project row';const r=await sbFetch('/rest/v1/portfolio_projects',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});const rows=await r.json();if(!Array.isArray(rows)||rows.length!==1)throw new Error('project_insert_failed');projectId=rows[0].id;createdId=projectId;liveWriteApplied=true}
    stage='saving case-study sections';await upsertProjectSections(projectId,draft.sections);stage='removing recovery draft';await deleteContentKey(recoveryDraftKey);recoveryDraftDeleted=true;projectDrafts.delete(draft.project.slug);await loadAdminProjects();await loadProjectDrafts();await loadAssets();refreshAdminProjectList();const live=projectBySlug(draft.project.slug);if(live)editProject(live);setProjectStatus('ok',t('admin.projectPublished'));
  }catch(err){
    let rollbackOk=true;
    try{
      if(liveWriteApplied&&snapshot)await restoreProjectSnapshot(snapshot);
      else if(liveWriteApplied&&createdId){const sec=await sbFetch(`/rest/v1/portfolio_project_sections?select=id&project_id=eq.${encodeURIComponent(createdId)}`,{method:'GET'});const rows=await sec.json();if(Array.isArray(rows)&&rows.length)await sbFetch(`/rest/v1/portfolio_project_sections?id=in.(${rows.map(x=>encodeURIComponent(x.id)).join(',')})`,{method:'DELETE',headers:{Prefer:'return=minimal'}});await sbFetch(`/rest/v1/portfolio_projects?id=eq.${encodeURIComponent(createdId)}`,{method:'DELETE',headers:{Prefer:'return=minimal'}})}
    }catch(_){rollbackOk=false}
    if(recoveryDraftDeleted&&recoveryDraft){try{await upsertProjectDraftRow(recoveryDraftKey,recoveryDraft);projectDrafts.set(recoveryDraft.project.slug,recoveryDraft)}catch(_){rollbackOk=false}}
    if(err.message==='publish_validation_failed')setProjectStatus('err',`${t('admin.publishBlocked')}: ${err.validation.join(' · ')}`);
    else if(err.status===400)setProjectStatus('err',currentLang==='en'?`Publish failed at ${stage} (HTTP 400). Recovery draft was kept. ${supabaseErrorDetail(err)}`:`Publish thất bại ở bước ${stage} (HTTP 400). Bản nháp khôi phục đã được giữ. ${supabaseErrorDetail(err)}`);
    else if(!rollbackOk)setProjectStatus('err',currentLang==='en'?'Project publish failed and rollback could not be verified.':'Project publish thất bại và không thể xác minh rollback hoàn toàn.');
    else setProjectStatus('err',projectErrorText(err));
  } finally {btn.disabled=false}
}

async function unpublishProject(){
  const slug=$('#projectSlug').dataset.originalSlug||$('#projectSlug').value,p=projectBySlug(slug);if(!HQVShared.auth?.isAuthed()||!p?.dbId){setProjectStatus('err',t('admin.projectMissing'));return}const btn=$('#unpublishProjectBtn');btn.disabled=true;try{await sbFetch(`/rest/v1/portfolio_projects?id=eq.${encodeURIComponent(p.dbId)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({published:false})});await loadAdminProjects();await loadProjectDrafts();refreshAdminProjectList();const fresh=projectBySlug(slug);if(fresh)editProject(fresh);setProjectStatus('ok',t('admin.projectUnpublished'))}catch(err){setProjectStatus('err',projectErrorText(err))}finally{btn.disabled=false}
}

function projectErrorText(err){
  const kind=classifySupabaseError(err);
  if(err?.message==='session_expired')return currentLang==='en'?'Session expired, please log in again':'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
  if(kind==='permission'||kind==='auth'||err?.status===403||err?.status===401)return kind==='auth'?t('admin.authError'):t('admin.permissionError');
  if(err?.message==='invalid_slug')return currentLang==='en'?'Slug must use lowercase letters, numbers and hyphens.':'Slug chỉ dùng chữ thường, số và dấu gạch ngang.';
  if(err?.message==='project_title_required')return currentLang==='en'?'Both project titles are required.':'Cần nhập đủ tiêu đề Project VI và EN.';
  if(err?.message==='invalid_stats_json'||err?.message==='invalid_stats')return currentLang==='en'?'Stats must be a valid JSON array.':'Stats phải là một mảng JSON hợp lệ.';
  if(err?.message==='invalid_tone_a'||err?.message==='invalid_tone_b')return currentLang==='en'?'Tone colors must be valid hex colors.':'Tone A/B phải là mã màu hex hợp lệ.';
  if(err?.message==='slug_locked')return t('admin.projectSlugLocked');
  return err?.message||t('admin.uploadFailed');
}

function refreshAdminProjectList(){
  const host=$('#projectManagementList');if(!host)return;if(!HQVShared.auth?.isAuthed()){host.innerHTML=`<div class="admin-empty">${esc(t('admin.loginRequired'))}</div>`;return}
  const liveRows=PROJECTS.filter(p=>p.dbId).map(p=>({project:p,draft:projectDrafts.get(p.id)||null}));const draftOnly=[...projectDrafts.entries()].filter(([slug])=>!PROJECTS.some(p=>p.id===slug)).map(([slug,draft])=>({project:projectFromDraftPayload({id:slug,published:false,content:{vi:{title:draft.project?.title_vi||slug},en:{title:draft.project?.title_en||slug}}},draft),draft}));const rows=[...liveRows,...draftOnly];
  host.innerHTML=rows.length?rows.map(({project:p,draft})=>{const hasDraft=!!draft;const live=p.dbId&&p.published!==false;const status=live&&!hasDraft?t('admin.livePublished'):(live&&hasDraft?`${t('admin.draftAvailable')} · ${t('admin.livePublished')}`:t('admin.draftOnly'));return `<article class="admin-project-row"><div><strong>${esc(p.content?.[currentLang]?.title||p.id)}</strong><span class="admin-project-meta">${esc(p.id)} · ${p.dbId?'DB UUID':'draft only'} · ${esc(status)}</span></div><div class="admin-project-actions"><button class="admin-btn" type="button" data-edit-project="${esc(p.id)}">${esc(t('admin.edit'))}</button>${p.dbId?`<button class="admin-btn danger" type="button" data-delete-project="${esc(p.id)}">${esc(t('admin.delete'))}</button>`:''}</div></article>`}).join(''):`<div class="admin-empty">${esc(t('admin.noDraft'))}</div>`;
}

async function deleteProject(project){
  if(!HQVShared.auth?.isAuthed()||!project?.dbId)return;
  if(!confirm(t('admin.projectDeleteConfirm')))return;
  const btn=document.querySelector(`[data-delete-project="${CSS.escape(project.id)}"]`);if(btn)btn.disabled=true;
  setProjectStatus('ok',t('admin.uploading'));
  const projectId=project.dbId,slug=project.id;
  let projectRow=null,sections=[],assetRows=[],sectionsDeleted=false,projectDeleted=false,assetsDeleted=false,storageCleanupFailed=false;
  try{
    const projectR=await sbFetch(`/rest/v1/portfolio_projects?select=id,slug,sort_order,published,title_vi,title_en,hook_vi,hook_en,intro_vi,intro_en,categories,stats,visual_type,tone_a,tone_b&id=eq.${encodeURIComponent(projectId)}`.replace('?select=','?select='),{method:'GET'});
    const projectRows=await projectR.json();projectRow=Array.isArray(projectRows)?projectRows[0]:null;
    if(!projectRow)throw new Error('project_not_found');

    const sectionR=await sbFetch(`/rest/v1/portfolio_project_sections?select=id,project_id,sort_order,title_vi,body_vi,title_en,body_en,blocks&project_id=eq.${encodeURIComponent(projectId)}`,{method:'GET'});
    sections=await sectionR.json();
    const proofR=await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?select=id,project_id,asset_type,owner_type,owner_id,type,title_vi,title_en,storage_path,original_name,mime_type,file_size,gallery_id,created_at,description_vi,description_en,sort_order,updated_at&or=(project_id.eq.${encodeURIComponent(slug)},owner_id.eq.${encodeURIComponent(slug)})&asset_type=in.(project_cover,proof,gallery)`,{method:'GET'});
    assetRows=(await proofR.json()).filter(row=>(row.owner_type==='project'||!row.owner_type)&&(row.project_id===slug||row.owner_id===slug));
    if(!Array.isArray(assetRows))throw new Error('project_asset_lookup_failed');
    if(assetRows.length){
      const unsafe=assetRows.map(row=>({row,usage:mediaUsage(row.id)})).find(x=>{
        if(!x.usage.known)return true;
        const prefix=`${slug} — `;
        const externalRefs=x.usage.refs.filter(ref=>!String(ref).startsWith(prefix));
        return externalRefs.length>0;
      });
      if(unsafe){
        const usage=unsafe.usage;
        const externalRefs=usage.known?usage.refs.filter(ref=>!String(ref).startsWith(`${slug} — `)):[];
        const msg=usage.known
          ? (currentLang==='en'?`Project delete blocked because asset ${unsafe.row.id} is also referenced outside this Project: ${externalRefs.slice(0,6).join(' · ')}`:`Đã chặn xóa Project vì asset ${unsafe.row.id} còn được tham chiếu ngoài Project này: ${externalRefs.slice(0,6).join(' · ')}`)
          : (currentLang==='en'?'Project delete blocked because asset references could not be verified safely.':'Đã chặn xóa Project vì không thể xác minh reference của asset một cách an toàn.');
        throw new Error(msg);
      }
    }

    // Snapshot exact asset bytes before destructive operations.
    const snapshots=[];for(const row of assetRows)snapshots.push(await snapshotStorageRow(row));
    try{
      if(assetRows.length){await deleteMetadataRows(assetRows);assetsDeleted=true;try{await deleteStorage(assetRows.map(r=>r.storage_path))}catch(err){storageCleanupFailed=true;console.error('[HQV orphaned storage paths]',{paths:assetRows.map(r=>r.storage_path),error:err?.message,status:err?.status,detail:err?.detail})}}
      if(Array.isArray(sections)&&sections.length){
        const ids=sections.map(s=>encodeURIComponent(s.id)).join(',');
        await sbFetch(`/rest/v1/portfolio_project_sections?id=in.(${ids})`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
        sectionsDeleted=true;
      }
      await sbFetch(`/rest/v1/portfolio_projects?id=eq.${encodeURIComponent(projectId)}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});
      projectDeleted=true;
    }catch(err){
      // Compensating rollback: restore the exact assets and any deleted sections/project row.
      if(assetsDeleted){
        for(const snap of snapshots){try{await restoreStorageSnapshot(snap)}catch(_){}}
        for(const row of assetRows){try{await restoreMetadataRow(row)}catch(_){}}
      }
      if(sectionsDeleted&&sections.length){
        for(const section of sections){try{await sbFetch('/rest/v1/portfolio_project_sections',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(section)})}catch(_){}}
      }
      if(projectDeleted&&projectRow){
        try{await sbFetch('/rest/v1/portfolio_projects',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(projectRow)})}catch(_){}
      }
      throw err;
    }
    // DB deletion succeeded. A later client refresh failure must not be reported as a deletion failure.
    try{await loadAdminProjects();await loadAssets()}catch(_){}
    resetProjectEditor();refreshAdminProjectList();setProjectStatus(storageCleanupFailed?'warn':'ok',storageCleanupFailed?t('admin.cleanupWarning'):t('admin.projectDeleted'));
  }catch(err){
    setProjectStatus('err',projectErrorText(err));
  }finally{
    if(btn)btn.disabled=false;
  }
}

async function migrateExistingProjects(){
  if(!HQVShared.auth?.isAuthed()){setProjectStatus('err',t('admin.loginRequired'));return}
  const btn=$('#migrateProjectsBtn');btn.disabled=true;setProjectStatus('ok',t('admin.uploading'));
  try{
    for(const p of PROJECT_FALLBACK){
      const lookup=await sbFetch(`/rest/v1/portfolio_projects?select=id,slug&slug=eq.${encodeURIComponent(p.id)}`,{method:'GET'});
      const found=await lookup.json();
      let row=Array.isArray(found)&&found[0];
      if(!row){
        const c=p.content.vi,e=p.content.en;
        const body={slug:p.id,sort_order:Number(p.index)||1,published:true,title_vi:c.title,title_en:e.title,hook_vi:c.hook||null,hook_en:e.hook||null,intro_vi:c.intro||null,intro_en:e.intro||null,categories:c.category||[],stats:c.stats||[],visual_type:p.visual||'web',tone_a:p.tone?.[0]||null,tone_b:p.tone?.[1]||null};
        const ins=await sbFetch('/rest/v1/portfolio_projects',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
        const created=await ins.json();if(!Array.isArray(created)||created.length!==1)throw new Error('project_migration_insert_failed');row=created[0];
      }
      const secR=await sbFetch(`/rest/v1/portfolio_project_sections?select=id&project_id=eq.${encodeURIComponent(row.id)}`,{method:'GET'});
      const secs=await secR.json();
      if(!Array.isArray(secs)||secs.length===0){
        const story=projectSectionsFromRuntime(p);
        if(story.length)await upsertProjectSections(row.id,story);
      }
    }
    await loadAdminProjects();await loadAssets();refreshAdminProjectList();setProjectStatus('ok',t('admin.migrated'));
  }catch(err){setProjectStatus('err',projectErrorText(err))}
  finally{btn.disabled=false}
}

function setAdminStatus(id,type,msg){const el=$(id);if(!el)return;el.className=`admin-status show ${type}`;el.textContent=msg}
async function loadVisitorAdminList(){
  const list=$('#visitorAdminList'),summary=$('#visitorAdminSummary');
  if(!list||!summary)return;
  if(!HQVShared.auth?.isAuthed()){setAdminStatus('#visitorAdminStatus','err',currentLang==='en'?'Admin sign-in is required.':'Cần đăng nhập admin để xem dữ liệu.');return}
  setAdminStatus('#visitorAdminStatus','warn',currentLang==='en'?'Loading visitor analytics…':'Đang tải danh sách lượt ghé…');
  try{
    const token=await HQVShared.authToken();
    const response=await fetch('/api/visitors',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({action:'admin-list'})});
    const payload=await response.json();
    if(!response.ok)throw new Error(payload?.code||`visitor_admin_http_${response.status}`);
    if(!Array.isArray(payload?.visitors))throw new Error('visitor_admin_invalid_response');
    const visitors=payload.visitors.sort((a,b)=>(Number(b.visit_count)||0)-(Number(a.visit_count)||0)||Date.parse(b.last_seen)-Date.parse(a.last_seen)||String(a.ip_address).localeCompare(String(b.ip_address)));
    const totalViews=visitors.reduce((sum,row)=>sum+(Number(row.visit_count)||0),0);
    summary.innerHTML=`<span><strong>${visitors.length.toLocaleString(currentLang==='en'?'en':'vi')}</strong> ${currentLang==='en'?'unique IPs':'IP duy nhất'}</span><span><strong>${totalViews.toLocaleString(currentLang==='en'?'en':'vi')}</strong> ${currentLang==='en'?'filtered visits':'lượt ghé đã lọc'}</span>`;
    list.innerHTML=visitors.length?visitors.map((row,index)=>{
      const firstSeen=Number.isNaN(Date.parse(row.first_seen))?'—':new Date(row.first_seen).toLocaleString(currentLang==='en'?'en':'vi');
      const lastSeen=Number.isNaN(Date.parse(row.last_seen))?'—':new Date(row.last_seen).toLocaleString(currentLang==='en'?'en':'vi');
      return `<article class="visitor-admin-row"><span class="visitor-admin-rank">${index+1}</span><div class="visitor-admin-ip"><strong>${esc(String(row.ip_address||''))}</strong><span>${currentLang==='en'?'First':'Đầu tiên'}: ${esc(firstSeen)} · ${currentLang==='en'?'Last':'Gần nhất'}: ${esc(lastSeen)}</span></div><strong class="visitor-admin-count">${Number(row.visit_count)||0} ${currentLang==='en'?'visits':'lượt'}</strong></article>`;
    }).join(''):`<div class="admin-empty">${currentLang==='en'?'No qualified visits yet.':'Chưa có lượt ghé nào được ghi nhận.'}</div>`;
    setAdminStatus('#visitorAdminStatus','ok',currentLang==='en'?'Visitor analytics updated.':'Đã cập nhật danh sách lượt ghé.');
  }catch(error){
    list.innerHTML='';
    summary.textContent='';
    const message=error.message==='admin_not_authorized'
      ?(currentLang==='en'?'This account cannot view visitor IP data.':'Tài khoản này không có quyền xem IP người truy cập.')
      :currentLang==='en'?'Could not load visitor analytics. Check the API and migration deployment.':'Không tải được thống kê. Hãy kiểm tra API và migration đã được triển khai.';
    setAdminStatus('#visitorAdminStatus','err',message);
    console.error('Visitor admin list failed:',error?.message||'unknown_error');
  }
}

function setUploadProgress(percent){const value=Math.max(0,Math.min(100,Math.round(Number(percent)||0)));const label=currentLang==='en'?`Uploading… ${value}%`:`Đang upload… ${value}%`;setAdminStatus('#adminUploadStatus','ok',label);setAdminStatus('#globalContentStatus','ok',label)}

function populateAdminProjects(){
  const proofSelect=$('#adminProject'),coverSelect=$('#coverProject');
  const proofValue=proofSelect.value,coverValue=coverSelect.value;
  const projectOptions=PROJECTS.map(p=>`<option value="${esc(p.id)}">${esc(p.content[currentLang].title)}</option>`).join('');
  proofSelect.innerHTML=projectOptions+INSIGHTS_ADMIN.map(p=>`<option value="insight:${esc(p.id)}">Insights · ${esc(p.content[currentLang].title)}</option>`).join('');
  coverSelect.innerHTML=projectOptions;
  if([...proofSelect.options].some(option=>option.value===proofValue))proofSelect.value=proofValue;
  if([...coverSelect.options].some(option=>option.value===coverValue))coverSelect.value=coverValue;
  refreshAdminProjectList();refreshAdminInsightList()
}



async function uploadStorage(file,path,mime,attempt=0){const token=await HQVShared.authToken();const url=storageObjectUrl(path),contentType=mime||file.type||'application/octet-stream';try{await new Promise((resolve,reject)=>{const xhr=new XMLHttpRequest();xhr.open('POST',url,true);xhr.setRequestHeader('apikey',CONFIG.supabase.anonKey);xhr.setRequestHeader('Authorization',`Bearer ${token}`);xhr.setRequestHeader('Content-Type',contentType);xhr.setRequestHeader('cache-control','max-age=31536000');xhr.setRequestHeader('x-upsert','false');xhr.upload.onprogress=e=>{if(e.lengthComputable)setUploadProgress(e.loaded/e.total*100)};xhr.onload=()=>{if(xhr.status>=200&&xhr.status<300){setUploadProgress(100);resolve();return}const error=new Error(`storage_upload_failed (${xhr.status})`);error.status=xhr.status;error.detail=xhr.responseText;reject(error)};xhr.onerror=()=>{const error=new Error('supabase_network_error');error.status=0;reject(error)};xhr.ontimeout=()=>{const error=new Error('supabase_network_error');error.status=0;reject(error)};xhr.send(file)})}catch(error){const detail=error.detail||'';console.error('[HQV storage]',{status:error.status,body:detail,method:'POST',objectPath:path});if(!attempt&&jwtExpiredResponse(error.status,detail)){try{await HQVShared.auth.refresh();return uploadStorage(file,path,mime,1)}catch(refreshError){HQVShared.auth?.onExpired?.();throw refreshError}}if(error.status&&error.message!=='session_expired')error.message=`storage_upload_failed (${error.status})`;if(jwtExpiredResponse(error.status,detail)){HQVShared.auth?.onExpired?.();error.message='session_expired'}throw error}return path}

async function deleteStorage(paths){
  if(!paths.length)return;
  let response;
  try{response=await storageRequest(storageBucketUrl(),{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({prefixes:paths})},paths.join(', '))}catch(error){if(error.status&&error.message!=='session_expired')error.message=`storage_delete_failed (${error.status})`;throw error}
  const detail=await response.text();
  let removed;try{removed=JSON.parse(detail)}catch(_){removed=null}
  if(!Array.isArray(removed)||!removed.length){const error=new Error('storage_nothing_deleted');error.status=200;error.detail=detail;throw error}
  return removed;
}

async function insertAssetRows(rows){
  const r=await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}`,{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(rows)});
  const body=await r.json();return Array.isArray(body)?body:[];
}

async function deleteMetadataRow(row){
  const r=await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=eq.${encodeURIComponent(row.id)}`,{method:'DELETE',headers:{Prefer:'return=representation'}});
  const removed=await r.json();
  if(!Array.isArray(removed)||removed.length!==1)throw new Error('metadata_delete_failed');
  return removed[0];
}

async function deleteMetadataRows(rows){
  const unique=[...new Map(rows.filter(Boolean).map(row=>[row.id,row])).values()];
  if(!unique.length)return;
  const ids=unique.map(row=>encodeURIComponent(row.id)).join(',');
  const r=await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=in.(${ids})`,{method:'DELETE',headers:{Prefer:'return=representation'}});
  const removed=await r.json();
  const removedIds=new Set(Array.isArray(removed)?removed.map(row=>row.id):[]);
  const missing=unique.filter(row=>!removedIds.has(row.id));
  if(missing.length)throw new Error('metadata_rollback_failed');
}

async function restoreMetadataRow(row){await insertAssetRows([row])}

async function findMetadataRowsByStoragePaths(paths){
  const found=[];
  for(const path of [...new Set(paths)]){
    try{
      const r=await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?select=id,project_id,asset_type,owner_type,owner_id,type,title_vi,title_en,storage_path,original_name,mime_type,file_size,gallery_id,created_at&storage_path=eq.${encodeURIComponent(path)}`,{method:'GET'});
      const rows=await r.json();
      if(Array.isArray(rows))found.push(...rows);
    }catch(_){}
  }
  return [...new Map(found.map(row=>[row.id,row])).values()];
}

async function snapshotStorageRow(row){
  const response=await storageRequest(storageObjectUrl(row.storage_path),{method:'GET'},row.storage_path);
  const blob=await response.blob();
  return {row,blob};
}

async function restoreStorageSnapshot(snapshot){
  const {row,blob}=snapshot;
  await storageRequest(storageObjectUrl(row.storage_path),{method:'POST',headers:{'Content-Type':row.mime_type||blob.type||'application/octet-stream','x-upsert':'true'},body:blob},row.storage_path);
}

async function removeAssetRow(row){
  await deleteMetadataRow(row);
  try{await deleteStorage([row.storage_path])}catch(err){console.error('[HQV orphaned storage path]',{path:row.storage_path,error:err?.message,status:err?.status,detail:err?.detail})}
}

async function rollbackUploadedAssets(paths,insertedRows){
  const known=[...(insertedRows||[])];
  const discovered=await findMetadataRowsByStoragePaths(paths);
  const all=[...new Map([...known,...discovered].map(row=>[row.id,row])).values()];
  let rollbackError=null;
  try{await deleteMetadataRows(all)}catch(err){rollbackError=err}
  try{await deleteStorage(paths)}catch(err){rollbackError=rollbackError||err}
  return {ok:!rollbackError,error:rollbackError};
}

function assertAssetSchema(){
  if(!sbReady())throw new Error('supabase_not_configured');
  if(assetLoadState==='schema_missing')throw new Error('asset_schema_missing');
  if(assetLoadState==='auth')throw new Error('supabase_auth_error');
  if(assetLoadState==='permission')throw new Error('supabase_permission_error');
  if(assetLoadState==='network')throw new Error('supabase_network_error');
  if(assetLoadState!=='ready')throw new Error('asset_schema_unavailable');
}

function makeStoragePath(assetType,ownerId,file,ownerType='project'){const id=newId();const name=safeFileName(file.name);if(assetType==='avatar')return `profile/avatar-${id}-${name}`;if(assetType==='project_cover')return `projects/${ownerId}/cover-${id}-${name}`;if(assetType==='cert_cover')return `certificates/${ownerId}/cover-${id}-${name}`;if(assetType==='insight_cover')return `insights/${ownerId}/cover-${id}-${name}`;return `${ownerType==='insight'?'insights':'projects'}/${ownerId}/proof/${Date.now()}-${id}-${name}`}

async function uploadAssetBatch({assetType,ownerType,ownerId,projectId,titleVi,titleEn,sortOrderStart=0,files}){
  assertAssetSchema();
  if(assetType==='gallery'&&!['project','insight'].includes(ownerType))throw new Error('asset_required');
  const galleryId=assetType==='proof'&&!['certificate','experience'].includes(ownerType)&&files.length>1&&files.every(f=>f.type.startsWith('image/'))?newId():null;
  if(assetType==='avatar'&&files.length!==1)throw new Error('asset_required');
  if(assetType==='project_cover'&&(files.length!==1||!files[0].type.startsWith('image/')))throw new Error('asset_required');
  if(assetType==='cert_cover'&&(files.length!==1||!files[0].type.startsWith('image/')))throw new Error('asset_required');
  if(assetType==='insight_cover'&&(files.length!==1||!files[0].type.startsWith('image/')))throw new Error('asset_required');
  const infos=new Map();
  for(const file of files){
    if(file.size>MAX_ASSET_FILE_BYTES)throw new Error('asset_too_large');
    const info=await inspectUploadFile(file);infos.set(file,info);
    if((assetType==='avatar'||assetType==='project_cover'||assetType==='insight_cover'||assetType==='cert_cover')&&info.kind!=='image')throw new Error('asset_required');
  }
  const rows=[];const uploadedPaths=[];let insertedRows=[];
  try{
    for(const file of files){
      const path=makeStoragePath(assetType,ownerId,file,ownerType);
      await uploadStorage(file,path,infos.get(file).mime);
      uploadedPaths.push(path);
      rows.push({project_id:projectId||null,asset_type:galleryId?'gallery':assetType,owner_type:ownerType,owner_id:ownerId,type:galleryId?'gallery':infos.get(file).kind,title_vi:titleVi||file.name,title_en:titleEn||file.name,storage_path:path,original_name:file.name,mime_type:infos.get(file).mime,file_size:file.size,gallery_id:galleryId,sort_order:sortOrderStart+rows.length});
    }
    insertedRows=await insertAssetRows(rows);
    if(insertedRows.length!==rows.length)throw new Error('metadata_failed');
    return insertedRows;
  }catch(err){
    const rollback=await rollbackUploadedAssets(uploadedPaths,insertedRows);
    if(!rollback.ok)err.rollbackError=rollback.error;
    throw err;
  }
}

async function replaceSingleAsset(assetType,ownerType,ownerId,newRows,targetGalleryId=null,targetAssetId=null){
  if(!Array.isArray(newRows)||!newRows.length)throw new Error('metadata_not_persisted');
  let oldRows=[];
  if(assetType==='gallery'){
    if(!targetGalleryId)throw new Error('gallery_id_required');
    oldRows=[...assetRegistry.values()].filter(row=>row.asset_type==='gallery'&&row.gallery_id===targetGalleryId&&row.id&&!newRows.some(n=>n.id===row.id));
  }else if(assetType==='proof'){
    if(!targetAssetId)throw new Error('asset_id_required');
    const target=assetRegistry.get(targetAssetId);
    if(!target||target.asset_type!=='proof'||target.owner_type!==ownerType||target.owner_id!==ownerId)throw new Error('asset_not_found');
    oldRows=[target];
  }else{
    oldRows=[...assetRegistry.values()].filter(row=>row.asset_type===assetType&&row.owner_type===ownerType&&row.owner_id===ownerId&&row.id&&!newRows.some(n=>n.id===row.id));
  }
  if(!oldRows.length)return {storageCleanupFailed:false};
  await deleteMetadataRows(oldRows);
  try{await deleteStorage(oldRows.map(row=>row.storage_path));return {storageCleanupFailed:false}}catch(err){console.error('[HQV orphaned storage paths]',{paths:oldRows.map(row=>row.storage_path),error:err?.message,status:err?.status,detail:err?.detail});return {storageCleanupFailed:true}}
}

async function removeAssetRows(rows){
  const unique=[...new Map(rows.filter(Boolean).map(row=>[row.id,row])).values()];
  if(!unique.length)return {storageCleanupFailed:false};
  await deleteMetadataRows(unique);
  try{await deleteStorage(unique.map(row=>row.storage_path));return {storageCleanupFailed:false}}catch(err){console.error('[HQV orphaned storage paths]',{paths:unique.map(row=>row.storage_path),error:err?.message,status:err?.status,detail:err?.detail});return {storageCleanupFailed:true}}
}

function logAssetFailure(err,context={}){
  console.error('[HQV asset]',{...context,error:err?.message||String(err),status:err?.status,detail:err?.detail});
}

function formatAssetUploadError(err){
  if(err?.message==='unsafe_svg')return currentLang==='en'?'SVG blocked: it contains scripts or unsafe tags.':'Đã chặn SVG chứa script hoặc thẻ không an toàn.';
  if(err?.message==='asset_required')return currentLang==='en'?'Unsupported or mismatched file type.':'Định dạng file không được hỗ trợ hoặc nội dung không khớp đuôi file.';
  if(err?.message==='asset_too_large')return currentLang==='en'?'File exceeds the 50 MB limit. For larger files, use TUS or a higher Supabase plan.':'File vượt quá giới hạn 50 MB. Với file lớn hơn, hãy dùng TUS hoặc gói Supabase cao hơn.';
  if(err?.message==='session_expired')return currentLang==='en'?'Session expired, please log in again':'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại';
  if(err?.message==='storage_nothing_deleted')return currentLang==='en'?'Nothing was deleted from storage.':'Không có file nào được xóa khỏi storage.';
  if(err?.rollbackError)return currentLang==='en'?'Operation failed and rollback could not be fully verified.':'Thao tác thất bại và không thể xác minh rollback hoàn toàn.';
  const kind=classifySupabaseError(err);
  if(kind==='not_configured')return t('admin.notConfigured');
  if(kind==='auth')return t('admin.authError');
  if(kind==='permission')return t('admin.permissionError');
  if(kind==='network')return t('admin.networkError');
  if(kind==='schema_missing')return t('admin.schemaMissing');
  return err?.message||t('admin.uploadFailed');
}

function cleanupSuccessMessage(result,successKey){return result?.storageCleanupFailed?t('admin.cleanupWarning'):t(successKey)}

function cleanupStatusType(result){return result?.storageCleanupFailed?'warn':'ok'}

async function doAvatarUpload(e){
  e.preventDefault();const files=[...$('#avatarFile').files],btn=$('#avatarUploadBtn');if(!files.length){setAdminStatus('#avatarUploadStatus','err',t('admin.assetRequired'));return}if(!HQVShared.auth?.isAuthed()){setAdminStatus('#avatarUploadStatus','err',t('admin.loginRequired'));return}btn.disabled=true;setAdminStatus('#avatarUploadStatus','ok',t('admin.uploading'));
  try{const rows=await uploadAssetBatch({assetType:'avatar',ownerType:'profile',ownerId:'hqv',titleVi:'Ảnh đại diện Hoàng Quốc Việt',titleEn:'Hoàng Quốc Việt profile avatar',files});const cleanup=await replaceSingleAsset('avatar','profile','hqv',rows);await loadAssets();$('#avatarUploadForm').reset();setAdminStatus('#avatarUploadStatus',cleanupStatusType(cleanup),cleanupSuccessMessage(cleanup,'admin.avatarUploaded'))}catch(err){setAdminStatus('#avatarUploadStatus','err',formatAssetUploadError(err))}finally{btn.disabled=false}
}

async function doCoverUpload(e){
  e.preventDefault();const files=[...$('#projectCoverFile').files],projectId=$('#coverProject').value,btn=$('#coverUploadBtn');if(!files.length){setAdminStatus('#coverUploadStatus','err',t('admin.assetRequired'));return}if(!HQVShared.auth?.isAuthed()){setAdminStatus('#coverUploadStatus','err',t('admin.loginRequired'));return}const p=PROJECTS.find(x=>x.id===projectId);if(!p){setAdminStatus('#coverUploadStatus','err',t('admin.projectMissing'));return}btn.disabled=true;setAdminStatus('#coverUploadStatus','ok',t('admin.uploading'));
  try{const rows=await uploadAssetBatch({assetType:'project_cover',ownerType:'project',ownerId:projectId,projectId,titleVi:p.content.vi.title,titleEn:p.content.en.title,files});const cleanup=await replaceSingleAsset('project_cover','project',projectId,rows);await loadAssets();$('#coverUploadForm').reset();$('#coverProject').value=projectId;const editingSlug=$('#projectSlug')?.dataset.originalSlug;const editing=editingSlug?projectBySlug(editingSlug):null;if(editing)renderProjectMediaManager(editing);setAdminStatus('#coverUploadStatus',cleanupStatusType(cleanup),cleanupSuccessMessage(cleanup,'admin.coverUploaded'))}catch(err){setAdminStatus('#coverUploadStatus','err',formatAssetUploadError(err))}finally{btn.disabled=false}
}

async function doCertCoverUpload(id,file){
  const item=findCertAdminItem(id);if(!item||!file)return;
  const existing=certCoverAsset(id);if(existing&&!await assertAssetUnused(existing.id,'#globalContentStatus',false))return;
  setAdminStatus('#globalContentStatus','ok',t('admin.uploading'));
  let rows=[];
  try{
    const ownerType=certificateOwnerType(id);rows=await uploadAssetBatch({assetType:'cert_cover',ownerType,ownerId:id,projectId:null,titleVi:item.title.vi,titleEn:item.title.en,files:[file]});
    const cleanup=await replaceSingleAsset('cert_cover',ownerType,id,rows);
    await loadAssets();mergeEditorInputs();renderGlobalEditor();
    setAdminStatus('#globalContentStatus',cleanupStatusType(cleanup),cleanupSuccessMessage(cleanup,'admin.uploaded'));
  }catch(error){if(rows.length)try{await removeAssetRows(rows)}catch(cleanupError){error.rollbackError=cleanupError}setAdminStatus('#globalContentStatus','err',formatAssetUploadError(error))}
}

let mediaLibraryUploadActive=false;

async function uploadMediaLibraryFiles(files){
  const selectedOwner=mediaLibraryState.projectId||sectionOwnerId(document.querySelector('#insightSectionsEditor .admin-section-row'))||$('#projectSlug')?.dataset.originalSlug||$('#projectSlug')?.value||'';
  const ownerType=selectedOwner.startsWith('insight:')?'insight':mediaLibraryState.ownerType||'project',ownerId=selectedOwner.startsWith('insight:')?selectedOwner.slice(8):selectedOwner;
  if(!ownerId)throw new Error('project_missing');
  if(!files.length)throw new Error('asset_required');
  if(!HQVShared.auth?.isAuthed())throw new Error('supabase_auth_error');
  const rows=await uploadAssetBatch({assetType:'proof',ownerType,ownerId,projectId:ownerType==='project'?ownerId:null,titleVi:'',titleEn:'',files});
  await loadAssets();
  refreshAdminList();
  renderMediaLibrary();
  const first=rows[0]?.id||null;
  if(mediaLibraryState.mode==='single'&&first)mediaLibraryState.selectedId=first;
  if(mediaLibraryState.mode==='multi')rows.forEach(row=>mediaLibraryState.selectedIds.add(row.id));
  renderMediaLibrary();
}

async function doProofUpload(e){
  e.preventDefault();const projectId=$('#adminProject').value,titleVi=$('#proofTitleVi').value.trim(),titleEn=$('#proofTitleEn').value.trim(),files=[...$('#proofFiles').files],btn=$('#uploadBtn');if(!files.length){setAdminStatus('#adminUploadStatus','err',t('admin.assetRequired'));return}if(!projectId){setAdminStatus('#adminUploadStatus','err',t('admin.projectMissing'));return}if(!HQVShared.auth?.isAuthed()){setAdminStatus('#adminUploadStatus','err',t('admin.loginRequired'));return}btn.disabled=true;setAdminStatus('#adminUploadStatus','ok',t('admin.uploading'));
  try{const insightId=projectId.startsWith('insight:')?projectId.slice(8):'';await uploadAssetBatch({assetType:'proof',ownerType:insightId?'insight':'project',ownerId:insightId||projectId,projectId:insightId?null:projectId,titleVi,titleEn,files});$('#proofUploadForm').reset();await loadAssets();refreshAdminList();if($('#mediaLibraryDialog')?.open)renderMediaLibrary();const editingSlug=$('#projectSlug')?.dataset.originalSlug;const editing=editingSlug?projectBySlug(editingSlug):null;if(editing)renderProjectMediaManager(editing);setAdminStatus('#adminUploadStatus','ok',t('admin.uploaded'))}catch(err){setAdminStatus('#adminUploadStatus','err',formatAssetUploadError(err))}finally{btn.disabled=false}
}

async function assertAssetUnused(id,statusTarget='#adminUploadStatus',includeInsights=true){
  const usage=mediaUsage(id);
  if(!usage.known){setAdminStatus(statusTarget,'err',referenceGuardMessage(usage.missingSources?.length?usage.missingSources:[{name:'reference data',state:'unknown'}]));return false}
  const blockingRefs=[...usage.blockRefs];
  let source='project drafts';
  try{
    const response=await sbFetch('/rest/v1/portfolio_content?select=content_key,value_vi&content_key=like.project.draft.%25',{method:'GET'});
    const drafts=await response.json();
    (Array.isArray(drafts)?drafts:[]).forEach(row=>{const payload=parseContentJSON(row.value_vi,{});blockingRefs.push(...blockAssetReferences(payload.sections,id,`${String(row.content_key).slice('project.draft.'.length)} — Draft`))});
  }catch(error){
    setAdminStatus(statusTarget,'err',referenceGuardMessage([{name:source,error,state:'request failed'}]));
    return false;
  }
  if(includeInsights){
    source='insight sections';
    try{blockingRefs.push(...await insightAssetReferences(id))}
    catch(error){setAdminStatus(statusTarget,'err',referenceGuardMessage([{name:error.referenceSource||source,error,state:'request failed'}]));return false}
  }
  const uniqueRefs=[...new Set(blockingRefs)];
  if(uniqueRefs.length){
    const detail=uniqueRefs.slice(0,8).join(' · ');
    const msg=currentLang==='en'?`Cannot delete this asset because it is referenced by ${uniqueRefs.length} case-study/Insight block${uniqueRefs.length===1?'':'s'}. ${detail}`:`Không thể xóa asset vì đang được tham chiếu bởi ${uniqueRefs.length} block Case Study/Insight. ${detail}`;
    setAdminStatus(statusTarget,'err',msg);
    return false;
  }
  return true;
}

async function deleteAsset(id){
  if(!HQVShared.auth?.isAuthed()){setAdminStatus('#adminUploadStatus','err',t('admin.loginRequired'));return}
  if(deletingAssetIds.has(id))return;
  const row=assetRegistry.get(id);if(!row)return;
  if(!await assertAssetUnused(id))return;
  deletingAssetIds.add(id);
  const rows=row.asset_type==='gallery'&&row.gallery_id?[...assetRegistry.values()].filter(item=>item.asset_type==='gallery'&&item.gallery_id===row.gallery_id):[row];
  setAdminStatus('#adminUploadStatus','ok',t('admin.uploading'));
  try{
    const cleanup=await removeAssetRows(rows);
    await loadAssets();
    refreshAdminList();
    setAdminStatus('#adminUploadStatus',cleanupStatusType(cleanup),cleanupSuccessMessage(cleanup,'admin.deleted'));
  }catch(err){
    logAssetFailure(err,{operation:row.asset_type==='gallery'?'gallery.delete':'proof.delete',assetId:id,assetType:row.asset_type,ownerType:row.owner_type,ownerId:row.owner_id,bucket:CONFIG.supabase.bucket});
    setAdminStatus('#adminUploadStatus','err',formatAssetUploadError(err));
  }finally{
    deletingAssetIds.delete(id);
  }
}

function previewCurrentProject(){
  try{const base=projectBySlug($('#projectSlug')?.dataset.originalSlug||$('#projectSlug')?.value);if(!base)return;const payload=projectFormPayload(),sections=projectSectionPayloads();const draft={...base,published:false,content:{vi:{...base.content.vi,title:payload.title_vi,hook:payload.hook_vi,intro:payload.intro_vi,category:payload.categories,stats:payload.stats,story:sections.map(s=>[s.title_vi,s.body_vi])},en:{...base.content.en,title:payload.title_en,hook:payload.hook_en,intro:payload.intro_en,category:payload.categories,stats:payload.stats,story:sections.map(s=>[s.title_en,s.body_en])}},sections};const win=window.open('','_blank','noopener');if(!win){alert(currentLang==='en'?'Popup blocked. Allow popups to preview.':'Trình duyệt đã chặn cửa sổ preview.');return;}const html=caseHtml(draft);win.document.write(`<!doctype html><html lang="${currentLang==='en'?'en':'vi'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DRAFT PREVIEW · ${esc(currentLang==='en'?payload.title_en:payload.title_vi)}</title><style>body{margin:0;background:#0a0b10;color:#fff;font:15px/1.8 system-ui,sans-serif}.case-article{max-width:940px;margin:0 auto;padding:40px 20px}.case-article-body{max-width:760px;margin:0 auto}.case-hero-visual img,.article-media img{display:block;width:auto;height:auto;max-width:100%;object-fit:contain;margin:auto}.case-copy{color:rgba(255,255,255,.76);overflow-wrap:anywhere}.case-section{margin:40px 0}.case-section h2{font-size:28px}.case-flow{display:flex;gap:10px;overflow:auto}.case-flow-step{min-width:150px;padding:14px;border:1px solid rgba(34,211,238,.2)}.article-media{margin:28px 0}.article-media figcaption{color:#78808d;font-size:12px}.case-footer{margin-top:50px}.case-video{position:relative;aspect-ratio:16/9;background:#000}.case-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.article-media video{display:block;width:100%;height:auto}.draft-preview-banner{position:fixed;top:12px;left:50%;transform:translateX(-50%);z-index:100;padding:9px 12px;border:1px solid rgba(255,107,53,.45);border-radius:999px;background:#120b08;color:#ffd0bd;font:800 10px ui-monospace,monospace;letter-spacing:.08em} </style></head><body><div class="draft-preview-banner">DRAFT PREVIEW</div>${html}</body></html>`);win.document.close();}
  catch(err){console.error('Project preview failed',err);setProjectStatus('err',err.message||String(err));}
}

function editorialSyncFromEvent(e){
  const field=e.target&&e.target.closest?e.target.closest('[data-block-content],[data-block-setting],[data-block-items],[data-block-setting-list],[data-richtext-editor]'):null;
  if(!field)return;
  const row=field.closest('.admin-section-row');
  if(!row)return;
  const doc=readSectionBlockEditors(row);
  const card=field.closest('article[data-block-id]');
  if(!card)return;
  if(field.matches('textarea'))editorialAutosize(card);
  const block=doc.items.find(b=>b.id===card.dataset.blockId);
  if(block){clearTimeout(card.__pv);card.__pv=setTimeout(()=>{if(card.isConnected)updateSectionBlockPreview(card,block,editorialLangOf(row))},220)}
}
Object.assign(I18N.vi,{'admin.title':'Proof manager','admin.subtitle':'Đăng nhập Supabase để lưu proof thật vào Storage + Database.','admin.loginTitle':'Đăng nhập admin','admin.loginCopy':'Tài khoản phải tồn tại trong Supabase Auth. Quyền ghi/xóa phải được khóa bằng RLS ở Supabase.','admin.email':'Email admin','admin.password':'Mật khẩu','admin.login':'Đăng nhập','admin.uploadTitle':'Upload proof','admin.uploadCopy':'PDF, ảnh hoặc JSON. Chọn nhiều ảnh để tạo một gallery. Metadata sẽ được ghi vào database sau khi Storage upload thành công.','admin.project':'Project','admin.titleVi':'Tiêu đề VI','admin.titleEn':'Title EN','admin.files':'File','admin.upload':'Upload proof','admin.logout':'Đăng xuất','admin.existing':'Proof đã lưu','admin.existingCopy':'Chỉ hiển thị proof và gallery đã lưu trong asset registry.','admin.blockFile':'File tải xuống','admin.schemaChecking':'Đang kiểm tra schema asset trên Supabase…','admin.configMissing':'Chưa cấu hình Supabase. Hãy điền CONFIG.supabase.url và CONFIG.supabase.anonKey. Frontend chỉ dùng anon key; không đặt service-role key vào file này.','admin.configReady':'Supabase đã được cấu hình ở frontend. Hãy bảo đảm Auth, Storage và RLS đã được thiết lập trước khi dùng.','admin.noProof':'Chưa có asset nào.','admin.loginRequired':'Hãy đăng nhập trước.','admin.loggedIn':'Đã đăng nhập.','admin.uploading':'Đang upload và ghi metadata…','admin.uploaded':'Upload và lưu metadata thành công.','admin.uploadFailed':'Upload thất bại. Kiểm tra Storage policy, Database policy và bucket.','admin.loginFailed':'Đăng nhập thất bại. Kiểm tra email, mật khẩu và Supabase Auth.','admin.deleted':'Đã xóa asset khỏi metadata và Storage.','admin.deleteFailed':'Không thể xóa asset hoàn tất. Kiểm tra Storage và RLS.','admin.notConfigured':'Supabase chưa được cấu hình.','admin.schemaMissing':'Supabase đã có config nhưng thiếu schema asset mới. Chạy migration SQL để thêm asset_type, owner_type và owner_id vào portfolio_proofs.','admin.authError':'Supabase từ chối phiên hoặc token. Kiểm tra Auth/session.','admin.permissionError':'Supabase từ chối quyền truy cập. Kiểm tra RLS và Storage policy.','admin.networkError':'Không thể kết nối tới Supabase. Kiểm tra mạng và URL project.','admin.loadError':'Không thể đọc asset registry từ Supabase.','admin.avatarTitle':'Profile avatar','admin.avatarCopy':'Một avatar dùng chung cho toàn bộ homepage. Ảnh mới chỉ trở thành avatar active sau khi Storage và metadata đều thành công.','admin.coverTitle':'Project cover','admin.coverCopy':'Ảnh cover tùy chọn cho từng project. Nếu chưa có asset, visual hiện tại vẫn được giữ nguyên.','admin.uploadAvatar':'Upload avatar','admin.uploadCover':'Upload cover','admin.avatarUploaded':'Avatar đã được lưu vào Storage + Database.','admin.coverUploaded':'Project cover đã được lưu vào Storage + Database.','admin.assetRequired':'File không hợp lệ.','admin.assetTooLarge':'File vượt quá giới hạn 50 MB.','admin.noSession':'Phiên đăng nhập không còn hợp lệ.','admin.projectMissing':'Project không tồn tại.','admin.projectManagement':'PROJECT MANAGEMENT','admin.projectManagementCopy':'Quản lý Project và Case Study content. Project tách biệt hoàn toàn khỏi Proof.','admin.newProject':'+ New Project','admin.edit':'Edit','admin.delete':'Delete','admin.slug':'Slug','admin.sortOrder':'Sort order','admin.hookVi':'Hook VI','admin.hookEn':'Hook EN','admin.introVi':'Intro VI','admin.introEn':'Intro EN','admin.categories':'Categories','admin.visualType':'Visual type','admin.toneA':'Tone A','admin.toneB':'Tone B','admin.stats':'Stats JSON','admin.published':'Published','admin.sections':'Case Study sections','admin.sectionsCopy':'Nội dung Case Study được lưu ở portfolio_project_sections, không lấy từ Proof metadata.','admin.addSection':'+ Section','admin.removeSection':'Remove','admin.saveProject':'Save Project','admin.cancel':'Cancel','admin.migrateProjects':'Migrate existing Projects','admin.migrateCopy':'Migrate idempotently từ hardcoded PROJECTS sang portfolio_projects và portfolio_project_sections.','admin.migrated':'Migration thành công.','admin.migrationBlocked':'Migration bị Supabase/RLS từ chối. Kiểm tra policy Project và Section.','admin.projectSaved':'Project đã được lưu.','admin.projectDeleted':'Project đã được xóa cùng sections và assets liên quan.','admin.projectDeleteConfirm':'Xóa Project này? Sections, cover, proof và gallery thuộc đúng Project sẽ được xử lý.','admin.projectSlugLocked':'Slug của Project hiện có là read-only để không làm hỏng liên kết asset.','admin.projectCreate':'Tạo Project mới','admin.projectEdit':'Chỉnh sửa Project','admin.projectMedia':'Project Media','admin.projectMediaCopy':'Cover và article media dùng lại asset registry hiện tại. Không tạo bảng hoặc schema mới.','admin.addMedia':'Quản lý media','admin.noProjectMedia':'Project chưa có media. Dùng Manage media để xem asset hiện có hoặc upload asset mới cho Project.','admin.blockEditor':'Block Editor','admin.blockEditorCopy':'Biên tập nội dung Case Study bằng các block. Không chỉnh layout, typography hoặc responsive tại đây.','admin.addBlock':'+ Block','admin.preview':'Preview','admin.duplicate':'Duplicate','admin.moveUp':'Lên','admin.moveDown':'Xuống','admin.blockDelete':'Xóa block','admin.noBlocks':'Section này chưa có block.','admin.blockHeading':'Heading','admin.blockParagraph':'Paragraph','admin.blockRichtext':'Rich text','admin.blockQuote':'Quote','admin.blockList':'List','admin.blockImage':'Image','admin.blockGallery':'Gallery','admin.blockVideo':'Video','admin.blockWorkflow':'Workflow','admin.blockDivider':'Divider','admin.blockProof':'Proof','admin.blockCta':'CTA','admin.textVi':'Nội dung VI','admin.textEn':'Nội dung EN','admin.captionVi':'Caption VI','admin.captionEn':'Caption EN','admin.altVi':'Alt VI','admin.altEn':'Alt EN','admin.itemsVi':'Items VI · mỗi dòng một mục','admin.itemsEn':'Items EN · mỗi dòng một mục','admin.assetId':'Asset ID','admin.assetIds':'Asset IDs · mỗi dòng một ID','admin.videoUrl':'Video URL','admin.previewLabel':'Xem trước block','admin.invalidBlock':'Block không hợp lệ. Hãy kiểm tra nội dung.','admin.addSectionHint':'Mỗi Section có thể chứa nhiều block và thứ tự được lưu trực tiếp vào blocks JSONB.','admin.sectionUp':'Section lên','admin.sectionDown':'Section xuống','admin.duplicateSection':'Nhân bản Section','admin.previewCaseStudy':'Preview Case Study','admin.previewDraft':'Preview Draft','admin.mediaSearch':'Tìm media','admin.selectImage':'Chọn hình ảnh','admin.noImageAssets':'Chưa có image asset trong registry.','admin.previewUnsaved':'Preview nội dung hiện tại, chưa lưu','admin.mediaLibrary':'Media Library','admin.mediaLibraryCopy':'Chọn asset từ registry dùng chung.','admin.mediaAll':'Tất cả','admin.mediaImage':'Hình ảnh','admin.mediaVideo':'Video','admin.mediaFile':'File / Khác','admin.mediaProject':'Project','admin.mediaAnyProject':'Tất cả Project','admin.mediaSelect':'Chọn','admin.mediaInsert':'Insert','admin.mediaUpload':'Upload media','admin.mediaCancel':'Hủy','admin.mediaUsage':'Usage','admin.mediaDimensions':'Kích thước','admin.mediaCreated':'Tạo lúc','admin.mediaOwner':'Owner','admin.mediaId':'Asset ID','admin.mediaNoSelection':'Chọn một asset để xem chi tiết.','admin.mediaUsed':'Asset đang được sử dụng ở {n} vị trí.','admin.mediaCannotDelete':'Không thể xóa asset đang được sử dụng.','admin.chooseMedia':'Chọn media','admin.manageGallery':'Quản lý gallery','admin.galleryEmpty':'Chưa có ảnh trong gallery.','admin.proofChoose':'Chọn Proof','admin.mediaReference':'Reference-aware delete'});
Object.assign(I18N.en,{'admin.title':'Proof manager','admin.subtitle':'Sign in to Supabase to save real proof in Storage + Database.','admin.loginTitle':'Admin login','admin.loginCopy':'The account must exist in Supabase Auth. Write/delete access must be protected with Supabase RLS.','admin.email':'Admin email','admin.password':'Password','admin.login':'Sign in','admin.uploadTitle':'Upload proof','admin.uploadCopy':'PDF, image or JSON. Select multiple images to create a gallery. Metadata is written to the database after Storage upload succeeds.','admin.project':'Project','admin.titleVi':'Vietnamese title','admin.titleEn':'English title','admin.files':'File','admin.upload':'Upload proof','admin.logout':'Sign out','admin.existing':'Saved proof','admin.existingCopy':'Only saved proof and gallery assets are shown here.','admin.blockFile':'Downloadable file','admin.schemaChecking':'Checking the asset schema on Supabase…','admin.configMissing':'Supabase is not configured. Fill CONFIG.supabase.url and CONFIG.supabase.anonKey. The frontend uses only the anon key; never place a service-role key here.','admin.configReady':'Supabase frontend configuration is present. Make sure Auth, Storage and RLS are configured before using the admin flow.','admin.noProof':'No assets are stored yet.','admin.loginRequired':'Please sign in first.','admin.loggedIn':'Signed in.','admin.uploading':'Uploading and saving metadata…','admin.uploaded':'Upload and metadata save succeeded.','admin.uploadFailed':'Upload failed. Check Storage policy, Database policy and bucket.','admin.loginFailed':'Login failed. Check the email, password and Supabase Auth.','admin.deleted':'Asset metadata and Storage object deleted.','admin.deleteFailed':'Could not complete asset deletion. Check Storage and RLS.','admin.notConfigured':'Supabase is not configured.','admin.schemaMissing':'Supabase is configured, but the new asset schema is missing. Run the SQL migration to add asset_type, owner_type and owner_id to portfolio_proofs.','admin.authError':'Supabase rejected the session or token. Check Auth/session.','admin.permissionError':'Supabase denied access. Check RLS and Storage policies.','admin.networkError':'Could not reach Supabase. Check the network and project URL.','admin.loadError':'Could not read the asset registry from Supabase.','admin.avatarTitle':'Profile avatar','admin.avatarCopy':'One shared avatar for the homepage. A new image becomes active only after both Storage and metadata succeed.','admin.coverTitle':'Project cover','admin.coverCopy':'Optional cover image for each project. Without one, the existing visual remains unchanged.','admin.uploadAvatar':'Upload avatar','admin.uploadCover':'Upload cover','admin.avatarUploaded':'Avatar saved to Storage + Database.','admin.coverUploaded':'Project cover saved to Storage + Database.','admin.assetRequired':'Invalid file.','admin.assetTooLarge':'File exceeds the 50 MB limit.','admin.noSession':'The admin session is no longer valid.','admin.projectMissing':'Project not found.','admin.projectManagement':'PROJECT MANAGEMENT','admin.projectManagementCopy':'Manage Projects and Case Study content separately from Proof assets.','admin.newProject':'+ New Project','admin.edit':'Edit','admin.delete':'Delete','admin.slug':'Slug','admin.sortOrder':'Sort order','admin.hookVi':'Hook VI','admin.hookEn':'Hook EN','admin.introVi':'Intro VI','admin.introEn':'Intro EN','admin.categories':'Categories','admin.visualType':'Visual type','admin.toneA':'Tone A','admin.toneB':'Tone B','admin.stats':'Stats JSON','admin.published':'Published','admin.sections':'Case Study sections','admin.sectionsCopy':'Case Study content is stored in portfolio_project_sections, not Proof metadata.','admin.addSection':'+ Section','admin.removeSection':'Remove','admin.saveProject':'Save Project','admin.cancel':'Cancel','admin.migrateProjects':'Migrate existing Projects','admin.migrateCopy':'Idempotently migrate hardcoded PROJECTS into portfolio_projects and portfolio_project_sections.','admin.migrated':'Migration completed.','admin.migrationBlocked':'Migration was denied by Supabase/RLS. Check Project and Section policies.','admin.projectSaved':'Project saved.','admin.projectDeleted':'Project and its related sections/assets were deleted.','admin.projectDeleteConfirm':'Delete this Project? Its own sections, cover, proofs and galleries will be processed.','admin.projectSlugLocked':'Existing Project slugs are read-only so asset relationships are not broken.','admin.projectCreate':'Create new Project','admin.projectEdit':'Edit Project','admin.projectMedia':'Project Media','admin.projectMediaCopy':'Cover and article media reuse the existing asset registry. No new table or schema is created.','admin.addMedia':'Manage media','admin.noProjectMedia':'This Project has no media yet. Use Manage media to review existing assets or upload a new asset for this Project.','admin.blockEditor':'Block Editor','admin.blockEditorCopy':'Edit Case Study content with blocks. Layout, typography and responsive behavior remain code-owned.','admin.addBlock':'+ Block','admin.preview':'Preview','admin.duplicate':'Duplicate','admin.moveUp':'Up','admin.moveDown':'Down','admin.blockDelete':'Delete block','admin.noBlocks':'This section has no blocks yet.','admin.blockHeading':'Heading','admin.blockParagraph':'Paragraph','admin.blockRichtext':'Rich text','admin.blockQuote':'Quote','admin.blockList':'List','admin.blockImage':'Image','admin.blockGallery':'Gallery','admin.blockVideo':'Video','admin.blockWorkflow':'Workflow','admin.blockDivider':'Divider','admin.blockProof':'Proof','admin.blockCta':'CTA','admin.textVi':'Text VI','admin.textEn':'Text EN','admin.captionVi':'Caption VI','admin.captionEn':'Caption EN','admin.altVi':'Alt VI','admin.altEn':'Alt EN','admin.itemsVi':'Items VI · one item per line','admin.itemsEn':'Items EN · one item per line','admin.assetId':'Asset ID','admin.assetIds':'Asset IDs · one ID per line','admin.videoUrl':'Video URL','admin.previewLabel':'Block preview','admin.invalidBlock':'Invalid block. Check its content.','admin.addSectionHint':'Each Section can contain multiple blocks and their order is stored directly in the blocks JSONB document.','admin.sectionUp':'Section up','admin.sectionDown':'Section down','admin.duplicateSection':'Duplicate section','admin.previewCaseStudy':'Preview Case Study','admin.previewDraft':'Preview Draft','admin.mediaSearch':'Search media','admin.selectImage':'Select image','admin.noImageAssets':'No image assets are available in the registry.','admin.previewUnsaved':'Preview of current unsaved content'});
Object.assign(I18N.vi,{
  'admin.cleanupWarning':'Metadata đã được xử lý nhưng dọn file thất bại. Xem console.',
  'admin.globalContent':'GLOBAL CONTENT','admin.globalContentCopy':'Chỉnh sửa Home, Approach, Skills, Experience, Contact và Footer mà không thay đổi hệ thống layout.','admin.globalHome':'Home','admin.globalApproach':'Approach','admin.globalSkills':'Skills','admin.globalExperience':'Experience','admin.globalContact':'Contact','admin.globalFooter':'Footer','admin.saveDraft':'Lưu bản nháp','admin.previewDraft':'Xem trước bản nháp','admin.publish':'Publish','admin.unpublish':'Bỏ publish','admin.draftPreviewLabel':'DRAFT PREVIEW','admin.globalSaved':'Đã lưu bản nháp Global Content.','admin.globalPublished':'Global Content đã publish.','admin.globalUnpublished':'Global Content đã unpublish.','admin.globalPreviewOpened':'Đã mở Draft Preview.','admin.projectDraftSaved':'Đã lưu bản nháp Project.','admin.projectPublished':'Project đã publish.','admin.projectUnpublished':'Project đã unpublish.','admin.publishBlocked':'Publish bị chặn','admin.noDraft':'Chưa có bản nháp đã lưu.','admin.invalidGlobal':'Global Content không hợp lệ.','admin.draftAvailable':'Có bản nháp chưa publish','admin.livePublished':'PUBLISHED · đang live','admin.draftOnly':'DRAFT · chưa có bản live'
});
Object.assign(I18N.en,{
  'admin.cleanupWarning':'Metadata was processed, but file cleanup failed. See the console.',
  'admin.globalContent':'GLOBAL CONTENT','admin.globalContentCopy':'Edit Home, Approach, Skills, Experience, Contact and Footer without changing the layout system.','admin.globalHome':'Home','admin.globalApproach':'Approach','admin.globalSkills':'Skills','admin.globalExperience':'Experience','admin.globalContact':'Contact','admin.globalFooter':'Footer','admin.saveDraft':'Save Draft','admin.previewDraft':'Preview Draft','admin.publish':'Publish','admin.unpublish':'Unpublish','admin.draftPreviewLabel':'DRAFT PREVIEW','admin.globalSaved':'Global Content draft saved.','admin.globalPublished':'Global Content published.','admin.globalUnpublished':'Global Content unpublished.','admin.globalPreviewOpened':'Draft Preview opened.','admin.projectDraftSaved':'Project draft saved.','admin.projectPublished':'Project published.','admin.projectUnpublished':'Project unpublished.','admin.publishBlocked':'Publish blocked','admin.noDraft':'No saved draft exists.','admin.invalidGlobal':'Global Content is invalid.','admin.draftAvailable':'Saved draft exists','admin.livePublished':'PUBLISHED · live','admin.draftOnly':'DRAFT · not yet live'
});
Object.assign(I18N.vi,{'admin.insightsManagement':'Quản lý Insights','admin.insightsManagementCopy':'Tạo, sửa và publish bài Insight public.','admin.newInsight':'+ Insight mới','admin.insightExcerptVi':'Excerpt VI','admin.insightExcerptEn':'Excerpt EN','admin.insightIntroVi':'Intro VI','admin.insightIntroEn':'Intro EN','admin.insightCategories':'Danh mục','admin.insightReadMinutes':'Số phút đọc','admin.recalculate':'Tính lại','admin.insightPublishedAt':'Thời điểm publish','admin.insightSections':'Các section Insight','admin.insightMedia':'Media Insight','admin.insightMediaCopy':'Ảnh bìa và proof thuộc Insight này.','admin.uploadCover':'Tải ảnh bìa','admin.upload':'Tải proof','admin.cancel':'Hủy','admin.saveDraft':'Lưu bản nháp','admin.previewDraft':'Xem trước bản nháp','admin.publish':'Publish','admin.unpublish':'Bỏ publish'});
Object.assign(I18N.en,{'admin.insightsManagement':'Insights Management','admin.insightsManagementCopy':'Create, edit and publish public Insight articles.','admin.newInsight':'+ New Insight','admin.insightExcerptVi':'Excerpt VI','admin.insightExcerptEn':'Excerpt EN','admin.insightIntroVi':'Intro VI','admin.insightIntroEn':'Intro EN','admin.insightCategories':'Categories','admin.insightReadMinutes':'Read minutes','admin.recalculate':'Recalculate','admin.insightPublishedAt':'Published at','admin.insightSections':'Insight sections','admin.insightMedia':'Insight media','admin.insightMediaCopy':'Cover and proof assets scoped to this Insight.','admin.uploadCover':'Upload cover','admin.upload':'Upload proof','admin.cancel':'Cancel','admin.saveDraft':'Save Draft','admin.previewDraft':'Preview Draft','admin.publish':'Publish','admin.unpublish':'Unpublish'});
async function loadGlobalDrafts(){try{const rows=await fetchGlobalPrefixRows('global.draft.');globalDraftContent=rows.length?buildGlobalFromRows(rows,'global.draft.'):null;globalAdminContent=HQVShared.composeGlobalContent(globalFallbackContent(),globalPublishedContent||{},globalDraftContent||{});globalContentLoadState='ready';renderGlobalEditor();refreshGlobalBadge();refreshGlobalControls()}catch(error){globalContentLoadState='failed';refreshGlobalBadge();refreshGlobalControls();setAdminStatus('#globalContentStatus','err',currentLang==='en'?'Could not load live or draft content. Writes are blocked to prevent overwriting it.':'Không tải được nội dung live hoặc bản nháp, đã chặn ghi để tránh ghi đè.')}}
function insightSectionEditorRows(){return projectSectionPayloads('#insightSectionsEditor')}
function renderInsightSectionEditor(sections=[],langs=null){const host=$('#insightSectionsEditor');if(!host)return;const slug=$('#insightSlug')?.value||'';host.dataset.ownerId=slug;renderProjectSectionEditor(sections,langs,host)}
function insightFormPayload(){const slug=$('#insightSlug').value.trim()||activeInsightAdminSlug;const draft=insightDrafts.get(activeInsightAdminSlug||slug),existing=draft?.insight||INSIGHTS_ADMIN.find(item=>item.id===(activeInsightAdminSlug||slug))||null,vi=existing?.content?.vi||{},en=existing?.content?.en||{},keep=(value,previous)=>String(value??'').trim()?value:(previous??value);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||['cert','insight','admin'].includes(slug))throw new Error('invalid_slug');const title_vi=keep($('#insightTitleVi').value,existing?.title_vi||vi.title),title_en=keep($('#insightTitleEn').value,existing?.title_en||en.title),excerpt_vi=keep($('#insightExcerptVi').value,existing?.excerpt_vi||vi.hook),excerpt_en=keep($('#insightExcerptEn').value,existing?.excerpt_en||en.hook),sections=insightSectionEditorRows();if(!sections.length||sections.some(section=>!section.body_vi.trim()||!section.body_en.trim()))throw new Error('insight_sections_required');const tone_a=$('#insightToneA').value.trim()||existing?.tone_a||existing?.tone?.[0]||'#22d3ee',tone_b=$('#insightToneB').value.trim()||existing?.tone_b||existing?.tone?.[1]||'#a78bfa';if(!/^#[0-9a-fA-F]{3,8}$/.test(tone_a)||!/^#[0-9a-fA-F]{3,8}$/.test(tone_b))throw new Error('invalid_tone');const categories=$('#insightCategories').value.split(',').map(x=>x.trim()).filter(Boolean);return {version:1,insight:{id:$('#insightDbId').value.trim()||existing?.dbId||existing?.id||null,slug,sort_order:Number($('#insightSortOrder').value)||existing?.sort_order||0,published:false,title_vi,title_en,excerpt_vi,excerpt_en,intro_vi:keep($('#insightIntroVi').value,existing?.intro_vi||vi.intro),intro_en:keep($('#insightIntroEn').value,existing?.intro_en||en.intro),categories:categories.length?categories:(existing?.categories||vi.category||[]),tone_a,tone_b,read_minutes:Math.max(1,Number($('#insightReadMinutes').value)||existing?.read_minutes||existing?.readMinutes||1),published_at:$('#insightPublishedAt').value||existing?.published_at||existing?.publishedAt||null},sections}}
function validateInsightForPublish(payload){const slug=payload.insight.slug;if(Number(payload.insight.read_minutes)<=0)throw new Error('Insight read time must be greater than zero.');if(INSIGHTS_ADMIN.some(item=>item.id===slug&&item.dbId!==payload.insight.id))throw new Error('Insight slug already exists.');const owned=asset=>asset&&asset.owner_type==='insight'&&asset.owner_id===slug;payload.sections.forEach((section,sectionIndex)=>{const blocks=normalizeBlockDocument(section.blocks,section.body_vi,section.body_en).items;let contentFound=false;blocks.forEach((block,blockIndex)=>{const label=`Section ${sectionIndex+1}, Block ${blockIndex+1}`;const c=block.content||{},settings=block.settings||{},text=Object.values(c).flatMap(value=>Array.isArray(value)?value:[value]).some(value=>typeof value==='string'&&richTextToPlainText(value).trim());if(text)contentFound=true;if(block.type==='image'){const asset=assetRegistry.get(settings.asset_id);if(!asset||!owned(asset)||!String(asset.mime_type||'').startsWith('image/'))throw new Error(`${label}: image must reference an image asset owned by this Insight.`)}if(block.type==='gallery'){const assets=(settings.asset_ids||[]).map(id=>assetRegistry.get(id));if(!assets.length||assets.some(asset=>!owned(asset)||!String(asset.mime_type||'').startsWith('image/')))throw new Error(`${label}: gallery must reference Insight-owned image assets.`)}if(block.type==='proof'||block.type==='file'){const asset=assetRegistry.get(settings.asset_id);if(!asset||!owned(asset)||!['proof','gallery'].includes(asset.asset_type))throw new Error(`${label}: referenced proof/file must belong to this Insight.`)}if(block.type==='video'){const url=settings.url||c.url;if(url&&!safeEmbedUrl(url))throw new Error(`${label}: video URL is not allowed.`);if(!url&&settings.asset_id){const asset=assetRegistry.get(settings.asset_id);if(!asset||!owned(asset)||!String(asset.mime_type||'').startsWith('video/'))throw new Error(`${label}: video asset must belong to this Insight.`)}}});if(!contentFound)throw new Error(`Section ${sectionIndex+1}: add at least one content block.`)})}
function recalculateInsightMinutes(){const sections=insightSectionEditorRows(),count=lang=>sections.map(section=>richTextToPlainText(section[`body_${lang}`]||'')).join(' ').trim().split(/\s+/).filter(Boolean).length;$('#insightReadMinutes').value=Math.max(1,Math.ceil(Math.max(count('vi'),count('en'))/200))}
function setInsightStatus(type,message){setAdminStatus('#insightStatus',type,message)}
function insightErrorText(error){if(error.message==='invalid_slug')return currentLang==='en'?'Invalid or reserved Insight slug.':'Slug Insight không hợp lệ hoặc bị dành riêng.';if(error.message==='insight_required')return currentLang==='en'?'Title and excerpt are required in both languages.':'Cần đủ tiêu đề và excerpt ở cả hai ngôn ngữ.';if(error.message==='insight_sections_required')return currentLang==='en'?'Add at least one non-empty section in both languages.':'Cần ít nhất một section có nội dung ở cả hai ngôn ngữ.';if(error.message==='invalid_tone')return currentLang==='en'?'Tone colors must be valid hex colors.':'Tone A/B phải là mã màu hex.';return projectErrorText(error)}
function refreshAdminInsightList(){const host=$('#insightManagementList');if(!host)return;const rows=[...INSIGHTS_ADMIN.map(item=>({item,draft:insightDrafts.get(item.id)})),...[...insightDrafts.entries()].filter(([slug])=>!INSIGHTS_ADMIN.some(item=>item.id===slug)).map(([slug,draft])=>({item:{id:slug,dbId:null,published:false,content:{vi:{title:draft.insight.title_vi},en:{title:draft.insight.title_en}}},draft}))];host.innerHTML=rows.length?rows.map(({item,draft})=>{const live=item.dbId&&item.published!==false,status=live&&!draft?'PUBLISHED':live&&draft?'DRAFT · LIVE VERSION PRESERVED':'DRAFT';return `<article class="admin-project-row"><div><strong>${esc(item.content?.[currentLang]?.title||item.id)}</strong><span class="admin-project-meta">${esc(item.id)} · ${status}</span></div><div class="admin-project-actions"><button class="admin-btn" type="button" data-edit-insight="${esc(item.id)}">Edit</button>${item.dbId?`<button class="admin-btn danger" type="button" data-delete-insight="${esc(item.id)}">Delete</button>`:''}</div></article>`}).join(''):`<div class="admin-empty">${esc(currentLang==='en'?'No Insights yet.':'Chưa có Insight nào.')}</div>`}
async function loadAdminInsights(){insightSchemaMissing=false;insightAdminLoadError=null;if(!HQVShared.auth?.isAuthed()){insightAdminLoadState='failed';return}let source='insights';try{const response=await sbFetch('/rest/v1/portfolio_insights?select=id,slug,sort_order,published,title_vi,title_en,excerpt_vi,excerpt_en,intro_vi,intro_en,categories,tone_a,tone_b,read_minutes,published_at&order=sort_order.asc,id.asc',{method:'GET'});const rows=await response.json();source='insight sections';const sectionsResponse=await sbFetch('/rest/v1/portfolio_insight_sections?select=id,insight_id,sort_order,title_vi,body_vi,title_en,body_en,blocks&order=sort_order.asc,id.asc',{method:'GET'});const sections=await sectionsResponse.json();const grouped=new Map();(Array.isArray(sections)?sections:[]).forEach(row=>{if(!grouped.has(row.insight_id))grouped.set(row.insight_id,[]);grouped.get(row.insight_id).push(row)});INSIGHTS_ADMIN.splice(0,INSIGHTS_ADMIN.length,...(Array.isArray(rows)?rows:[]).map(row=>insightRuntimeFromDb(row,grouped.get(row.id)||[])));insightAdminLoadState='ready';refreshAdminInsightList();populateAdminProjects()}catch(error){error.referenceSource=source;insightAdminLoadError=error;if(isMissingInsightSchemaError(error)){insightSchemaMissing=true;insightAdminLoadState='missing';INSIGHTS_ADMIN.splice(0,INSIGHTS_ADMIN.length);refreshAdminInsightList();populateAdminProjects();return}insightAdminLoadState='failed';setInsightStatus('err',insightErrorText(error))}}
async function loadInsightDrafts(){insightDraftLoadError=null;if(!HQVShared.auth?.isAuthed()){insightDraftLoadState='failed';return}try{const response=await sbFetch('/rest/v1/portfolio_content?select=content_key,value_vi&content_key=like.insight.draft.%25&order=updated_at.desc',{method:'GET'});const rows=await response.json();insightDrafts=new Map();(Array.isArray(rows)?rows:[]).forEach(row=>{const payload=parseContentJSON(row.value_vi,{}),slug=String(row.content_key||'').slice('insight.draft.'.length);if(slug&&payload?.insight)insightDrafts.set(slug,payload)});insightDraftLoadState='ready';refreshAdminInsightList()}catch(error){insightDraftLoadState='failed';insightDraftLoadError=error}}
function previewCurrentInsight(){try{const payload=insightFormPayload(),runtime=insightRuntimeFromDb({...payload.insight,id:payload.insight.id||`draft-${payload.insight.slug}`,published:false},payload.sections),win=window.open(new URL('index.html#draft-preview',location.href).href,'_blank');if(!win){setInsightStatus('err',currentLang==='en'?'Popup blocked.':'Trình duyệt đã chặn popup.');return}win.opener=window;globalPreviewWindow=win;globalPreviewSnapshot=runtime;setInsightStatus('ok',currentLang==='en'?'Draft preview opened.':'Đã mở xem trước bản nháp.')}catch(error){setInsightStatus('err',insightErrorText(error))}}
function previewCurrentProject(){try{const base=projectBySlug($('#projectSlug')?.dataset.originalSlug||$('#projectSlug')?.value);if(!base)return;const payload=projectFormPayload(),runtime=projectFromDraftPayload(base,{project:payload,sections:projectSectionPayloads()}),win=window.open(new URL('index.html#draft-preview',location.href).href,'_blank');if(!win){setProjectStatus('err',currentLang==='en'?'Popup blocked.':'Trình duyệt đã chặn popup.');return}win.opener=window;globalPreviewWindow=win;globalPreviewSnapshot=runtime;setProjectStatus('ok',currentLang==='en'?'Draft preview opened.':'Đã mở xem trước bản nháp.')}catch(error){setProjectStatus('err',projectErrorText(error))}}
function resetInsightEditor(){activeInsightAdminSlug='';const editor=$('#insightEditor');if(editor)editor.hidden=true;$('#insightForm')?.reset();$('#insightSectionsEditor').innerHTML='';$('#insightMediaList').innerHTML=''}
function renderInsightMediaManager(slug){const host=$('#insightMediaList');if(!host)return;const rows=[...assetRegistry.values()].filter(row=>row.owner_type==='insight'&&row.owner_id===slug);const cover=rows.find(row=>row.asset_type==='insight_cover'),proofs=rows.filter(row=>row.asset_type==='proof'||row.asset_type==='gallery');host.innerHTML=[cover,...proofs].filter(Boolean).map(row=>`<div class="admin-media-row"><div class="admin-media-main"><strong>${esc(row.asset_type==='insight_cover'?(currentLang==='en'?'Cover':'Ảnh bìa'):row.title_vi||row.original_name||row.id)}</strong><span>${esc(assetTypeLabel(row.asset_type))} · ${esc(row.original_name||'')} · ${esc(formatAssetSize(row.file_size))}</span></div><div class="admin-media-actions"><button class="admin-btn" type="button" data-insight-media-open="${esc(row.id)}">${esc(assetActionLabel(row.asset_type==='gallery'?'viewGallery':'open'))}</button>${row.asset_type==='insight_cover'?`<button class="admin-btn" type="button" data-insight-cover-replace="${esc(slug)}">Replace</button>`:''}<button class="admin-btn danger" type="button" data-insight-media-delete="${esc(row.id)}">${esc(assetActionLabel('delete'))}</button></div></div>`).join('')||`<div class="admin-empty">${esc(currentLang==='en'?'No Insight media.':'Chưa có media Insight.')}</div>`}
function editInsight(item){const draft=insightDrafts.get(item.id),source=draft?.insight||item,dbId=source.dbId||item.dbId||(source.id&&source.id!==item.id?source.id:'');activeInsightAdminSlug=item.id;$('#insightEditor').hidden=false;$('#insightDbId').value=dbId;$('#insightSlug').value=source.slug||item.id;$('#insightSlug').disabled=!!dbId;$('#insightSortOrder').value=source.sort_order??0;$('#insightTitleVi').value=source.title_vi||item.content?.vi?.title||'';$('#insightTitleEn').value=source.title_en||item.content?.en?.title||'';$('#insightExcerptVi').value=source.excerpt_vi||item.content?.vi?.hook||'';$('#insightExcerptEn').value=source.excerpt_en||item.content?.en?.hook||'';$('#insightIntroVi').value=source.intro_vi||item.content?.vi?.intro||'';$('#insightIntroEn').value=source.intro_en||item.content?.en?.intro||'';$('#insightCategories').value=(source.categories||item.content?.vi?.category||[]).join(', ');$('#insightToneA').value=source.tone_a||item.tone?.[0]||'#22d3ee';$('#insightToneB').value=source.tone_b||item.tone?.[1]||'#a78bfa';$('#insightReadMinutes').value=source.read_minutes||item.readMinutes||1;$('#insightPublishedAt').value=source.published_at||item.publishedAt||'';renderInsightSectionEditor(draft?.sections||item.sections||[]);$('#insightSectionsEditor').dataset.ownerId=item.id;renderInsightMediaManager(item.id);$('#insightLifecycleBadge').textContent=item.dbId&&item.published!==false&&!draft?'PUBLISHED':item.dbId&&item.published!==false?'DRAFT · LIVE VERSION PRESERVED':'DRAFT';$('#insightTitleVi').focus()}
async function saveInsightDraft(){try{const payload=insightFormPayload();await upsertContentRow(`insight.draft.${payload.insight.slug}`,payload,'');insightDrafts.set(payload.insight.slug,payload);refreshAdminInsightList();setInsightStatus('ok',currentLang==='en'?'Insight draft saved.':'Đã lưu bản nháp Insight.')}catch(error){setInsightStatus('err',insightErrorText(error))}}
async function uploadInsightMedia(assetType,files){const slug=$('#insightSlug').value.trim();if(!slug||!files.length)throw new Error('asset_required');const rows=await uploadAssetBatch({assetType,ownerType:'insight',ownerId:slug,projectId:null,titleVi:$('#insightTitleVi').value.trim(),titleEn:$('#insightTitleEn').value.trim(),files});if(assetType==='insight_cover')await replaceSingleAsset('insight_cover','insight',slug,rows);await loadAssets();renderInsightMediaManager(slug)}
async function publishInsight(){
  let payload=null,oldRow=null,oldSections=[],draftRow=null,insightId=null,draftDeleted=false,rollbackFailure=false;
  try{
    payload=insightFormPayload();validateInsightForPublish(payload);
    const lookup=await sbFetch(`/rest/v1/portfolio_insights?select=*&slug=eq.${encodeURIComponent(payload.insight.slug)}`,{method:'GET'});oldRow=(await lookup.json())?.[0]||null;
    if(oldRow){const sectionResponse=await sbFetch(`/rest/v1/portfolio_insight_sections?select=*&insight_id=eq.${encodeURIComponent(oldRow.id)}&order=sort_order.asc,id.asc`,{method:'GET'});oldSections=await sectionResponse.json();insightId=oldRow.id}
    const draftResponse=await sbFetch(`/rest/v1/portfolio_content?select=*&content_key=eq.${encodeURIComponent(`insight.draft.${payload.insight.slug}`)}`,{method:'GET'});draftRow=(await draftResponse.json())?.[0]||null;
    const now=oldRow?.published_at||new Date().toISOString(),{id:ignoredId,...insightRow}=payload.insight,row={...insightRow,published:true,published_at:now};
    const response=await sbFetch('/rest/v1/portfolio_insights?on_conflict=slug',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(row)});const created=(await response.json())[0];if(!created?.id)throw new Error('insight_publish_failed');insightId=created.id;
    const keptIds=payload.sections.map(section=>section.id).filter(Boolean),sections=payload.sections.map(({id,...section})=>({...section,...(id?{id}:{}),insight_id:insightId}));
    await sbFetch('/rest/v1/portfolio_insight_sections?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(sections)});
    const staleIds=oldSections.map(section=>section.id).filter(id=>!keptIds.includes(id));
    if(staleIds.length)await sbFetch(`/rest/v1/portfolio_insight_sections?id=in.(${staleIds.map(encodeURIComponent).join(',')})`,{method:'DELETE'});
    if(draftRow){await deleteContentKey(`insight.draft.${payload.insight.slug}`);draftDeleted=true}insightDrafts.delete(payload.insight.slug);await loadAdminInsights();await HQVShared.loadInsights();const fresh=INSIGHTS_ADMIN.find(item=>item.id===payload.insight.slug);if(fresh)editInsight(fresh);setInsightStatus('ok',currentLang==='en'?'Insight published.':'Insight đã publish.');
  }catch(error){
    if(insightId){try{if(oldRow){const {id,...restoreRow}=oldRow;await sbFetch('/rest/v1/portfolio_insights?on_conflict=slug',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(restoreRow)});await sbFetch(`/rest/v1/portfolio_insight_sections?insight_id=eq.${encodeURIComponent(insightId)}`,{method:'DELETE'});if(oldSections.length)await sbFetch('/rest/v1/portfolio_insight_sections',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(oldSections)})}else await sbFetch(`/rest/v1/portfolio_insights?id=eq.${encodeURIComponent(insightId)}`,{method:'DELETE'});if(draftDeleted&&draftRow)await upsertRawContentRow(draftRow)}catch(_){rollbackFailure=true}}
    if(rollbackFailure)error.message=currentLang==='en'?'Publish failed and rollback could not be verified.':'Publish thất bại và không thể xác minh rollback.';
    setInsightStatus('err',insightErrorText(error));
  }
}
async function unpublishInsight(){const slug=$('#insightSlug').value.trim();const item=INSIGHTS_ADMIN.find(row=>row.id===slug);if(!item?.dbId){setInsightStatus('err',currentLang==='en'?'Insight is not published.':'Insight chưa được publish.');return}try{await sbFetch(`/rest/v1/portfolio_insights?id=eq.${encodeURIComponent(item.dbId)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({published:false})});await loadAdminInsights();await HQVShared.loadInsights();setInsightStatus('ok',currentLang==='en'?'Insight unpublished.':'Insight đã unpublish.')}catch(error){setInsightStatus('err',insightErrorText(error))}}
async function deleteInsight(item){
  if(!item?.dbId||!confirm(currentLang==='en'?'Delete this Insight?':'Xóa Insight này?'))return;
  let assets=[],snapshots=[],sections=[],row=null,draftRow=null,assetsDeleted=false,sectionsDeleted=false,rowDeleted=false,draftDeleted=false,cleanupWarn=false;
  try{
    const assetResponse=await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?select=*&owner_type=eq.insight&owner_id=eq.${encodeURIComponent(item.id)}`,{method:'GET'});assets=await assetResponse.json();
    for(const asset of assets){const usage=mediaUsage(asset.id),external=(usage.refs||[]).filter(ref=>ref!==`Insight — ${item.id}`&&!String(ref).startsWith(`${item.id} — Insight`));if(!usage.known||external.length)throw new Error(currentLang==='en'?`Delete blocked: ${asset.id} is referenced outside this Insight. ${external.join(' · ')}`:`Đã chặn xóa: ${asset.id} còn được tham chiếu ngoài Insight này. ${external.join(' · ')}`);snapshots.push(await snapshotStorageRow(asset))}
    const rowResponse=await sbFetch(`/rest/v1/portfolio_insights?select=*&id=eq.${encodeURIComponent(item.dbId)}`,{method:'GET'});row=(await rowResponse.json())?.[0];
    const sectionResponse=await sbFetch(`/rest/v1/portfolio_insight_sections?select=*&insight_id=eq.${encodeURIComponent(item.dbId)}`,{method:'GET'});sections=await sectionResponse.json();
    const draftResponse=await sbFetch(`/rest/v1/portfolio_content?select=*&content_key=eq.${encodeURIComponent(`insight.draft.${item.id}`)}`,{method:'GET'});draftRow=(await draftResponse.json())?.[0]||null;
    if(assets.length){await deleteMetadataRows(assets);assetsDeleted=true;try{await deleteStorage(assets.map(asset=>asset.storage_path))}catch(error){cleanupWarn=true;console.error('[HQV orphaned insight storage]',{paths:assets.map(asset=>asset.storage_path),error:error.message})}}
    if(sections.length){await sbFetch(`/rest/v1/portfolio_insight_sections?insight_id=eq.${encodeURIComponent(item.dbId)}`,{method:'DELETE'});sectionsDeleted=true}
    await sbFetch(`/rest/v1/portfolio_insights?id=eq.${encodeURIComponent(item.dbId)}`,{method:'DELETE'});rowDeleted=true;
    if(draftRow){await deleteContentKey(`insight.draft.${item.id}`);draftDeleted=true}
    insightDrafts.delete(item.id);await loadAssets();await loadAdminInsights();await loadInsightDrafts();await HQVShared.loadInsights();resetInsightEditor();setInsightStatus(cleanupWarn?'warn':'ok',cleanupWarn?(currentLang==='en'?'Insight deleted; some storage objects may need cleanup.':'Insight đã xóa; một số file Storage cần dọn thủ công.'):(currentLang==='en'?'Insight deleted.':'Đã xóa Insight.'));
  }catch(error){
    let rollbackFailed=false;
    try{if(rowDeleted&&row){const {id,...restore}=row;await sbFetch('/rest/v1/portfolio_insights?on_conflict=slug',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(restore)})}if(sectionsDeleted&&sections.length)await sbFetch('/rest/v1/portfolio_insight_sections',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(sections)});if(assetsDeleted){for(const snapshot of snapshots)await restoreStorageSnapshot(snapshot);await insertAssetRows(assets)}if(draftDeleted&&draftRow)await upsertRawContentRow(draftRow)}catch(_){rollbackFailed=true}
    if(rollbackFailed)error.message=currentLang==='en'?'Insight delete failed and rollback could not be verified.':'Xóa Insight thất bại và không thể xác minh rollback.';
    setInsightStatus('err',insightErrorText(error));
  }
}
async function loadAdminProjects(){const response=await sbFetch('/rest/v1/portfolio_projects?select=id,slug,sort_order,published,title_vi,title_en,hook_vi,hook_en,intro_vi,intro_en,categories,stats,visual_type,tone_a,tone_b&order=sort_order.asc,id.asc',{method:'GET'});const rows=await response.json();if(!Array.isArray(rows))throw new Error('project_rows_invalid');const sectionsResponse=await sbFetch('/rest/v1/portfolio_project_sections?select=id,project_id,sort_order,title_vi,body_vi,title_en,body_en,blocks&order=sort_order.asc,id.asc',{method:'GET'});const sections=await sectionsResponse.json();const grouped=new Map();(Array.isArray(sections)?sections:[]).forEach(row=>{if(!grouped.has(row.project_id))grouped.set(row.project_id,[]);grouped.get(row.project_id).push(row)});PROJECTS.splice(0,PROJECTS.length,...rows.map(row=>projectRuntimeFromDb(row,grouped.get(row.id)||[])));populateAdminProjects()}
function applyAdminStatic(){if(!adminDialog)return;document.documentElement.lang=currentLang;adminDialog.setAttribute('aria-label',currentLang==='en'?'Portfolio CMS':'Quản trị portfolio');adminDialog.querySelectorAll('[data-i18n]').forEach(element=>{const value=I18N[currentLang][element.dataset.i18n];if(value)element.textContent=value});adminDialog.querySelectorAll('[data-admin-lang]').forEach(button=>button.classList.toggle('active',button.dataset.adminLang===currentLang));const visitorAdmin=$('#visitorAdmin');if(visitorAdmin){visitorAdmin.querySelector('h3').textContent=currentLang==='en'?'Visitor analytics':'Thống kê lượt truy cập';visitorAdmin.querySelector('.admin-note').textContent=currentLang==='en'?'Ranked by filtered visits per IP. Only the designated owner account can view IP addresses.':'Danh sách xếp theo số lượt ghi nhận trên mỗi IP. Chỉ tài khoản chủ sở hữu được xem địa chỉ IP.';$('#refreshVisitorsBtn').textContent=currentLang==='en'?'Refresh':'Làm mới'}populateAdminProjects()}
function renderAdmin(){applyAdminStatic();renderGlobalEditor();renderAvatar();refreshAdminProjectList();refreshAdminList();loadGlobalDrafts();loadProjectDrafts()}
function bindAdminEvents(){
$('#refreshVisitorsBtn')?.addEventListener('click',loadVisitorAdminList,{signal:controller.signal});
const mediaToolbar=$('.media-library-toolbar');
if(mediaToolbar&&!mediaToolbar.querySelector('[data-media-delete]'))mediaToolbar.insertAdjacentHTML('beforeend','<button class="admin-btn danger" type="button" data-media-delete disabled>Delete permanently</button>');
const projectSectionHost=$('#projectSectionsEditor');if(projectSectionHost)projectSectionHost.dataset.sectionHost='project';
document.addEventListener('click',async e=>{
  const insightMediaOpen=e.target.closest('[data-insight-media-open]');if(insightMediaOpen){const row=assetRegistry.get(insightMediaOpen.dataset.insightMediaOpen);openAdminAsset(insightMediaOpen.dataset.insightMediaOpen,row?.asset_type==='gallery'?'viewGallery':'open');return}
  const insightCoverReplace=e.target.closest('[data-insight-cover-replace]');if(insightCoverReplace){$('#insightSlug').value=insightCoverReplace.dataset.insightCoverReplace;$('#uploadInsightCoverBtn').click();return}
  const insightMediaDelete=e.target.closest('[data-insight-media-delete]');if(insightMediaDelete){const row=assetRegistry.get(insightMediaDelete.dataset.insightMediaDelete);if(!row||!await assertAssetUnused(row.id,'#insightStatus'))return;try{await removeAssetRows([row]);await loadAssets();renderInsightMediaManager($('#insightSlug').value.trim());setInsightStatus('ok',t('admin.deleted'))}catch(error){setInsightStatus('err',formatAssetUploadError(error))}return}
  const deleteMedia=e.target.closest('[data-media-delete]');if(deleteMedia){openMediaDeleteConfirmation();return}
  const editInsightButton=e.target.closest('[data-edit-insight]');if(editInsightButton){const slug=editInsightButton.dataset.editInsight,draft=insightDrafts.get(slug),item=INSIGHTS_ADMIN.find(row=>row.id===slug)||(draft?insightRuntimeFromDb({...draft.insight,id:null,published:false},draft.sections):null)||INSIGHT_FALLBACK.find(row=>row.id===slug);if(item)editInsight(item);return}
  const deleteInsightButton=e.target.closest('[data-delete-insight]');if(deleteInsightButton){deleteInsight(INSIGHTS_ADMIN.find(row=>row.id===deleteInsightButton.dataset.deleteInsight));return}
  const move=e.target.closest('[data-cert-move]');
  if(move){const [id,index,direction]=move.dataset.certMove.split('|');await reorderCertificateAssets(id,Number(index),direction);return}
  const choose=e.target.closest('[data-cert-choose]');
  if(choose){
    const id=choose.dataset.certChoose;
    openMediaLibrary({mode:'multi',accept:'all',selectedIds:certAssetList(id).map(asset=>asset.id),allowEmptySelection:true,title:currentLang==='en'?'Choose certificate evidence':'Chọn minh chứng chứng chỉ',onConfirm:async assetIds=>{
      const item=findCertAdminItem(id);if(!item)return false;
      const selected=new Set(assetIds),current=certAssetList(id),updates=[];
      for(const assetId of selected){if(!assetRegistry.has(assetId)||!await assertAssetUnused(assetId,'[data-media-status]'))return false}
      current.filter(asset=>!selected.has(asset.id)).forEach(asset=>updates.push({asset,body:{project_id:null,owner_type:null,owner_id:null,asset_type:'proof',gallery_id:null,sort_order:0}}));
      [...selected].forEach((assetId,index)=>{const asset=assetRegistry.get(assetId);updates.push({asset,body:{project_id:null,owner_type:certificateOwnerType(id),owner_id:id,asset_type:'proof',type:assetKindOf(asset),gallery_id:null,title_vi:item.title.vi,title_en:item.title.en,sort_order:index}})});
      const changed=[];
      try{
        for(const update of updates){await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=eq.${encodeURIComponent(update.asset.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(update.body)});changed.push(update.asset)}
      }catch(error){for(const asset of changed.reverse()){try{await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=eq.${encodeURIComponent(asset.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({project_id:asset.project_id??null,owner_type:asset.owner_type??null,owner_id:asset.owner_id??null,asset_type:asset.asset_type,type:asset.type??null,title_vi:asset.title_vi??null,title_en:asset.title_en??null,gallery_id:asset.gallery_id??null,sort_order:asset.sort_order??0})})}catch(_){error.rollbackError=true}}throw error}
      await loadAssets();mergeEditorInputs();renderGlobalEditor();setAdminStatus('#globalContentStatus','ok',currentLang==='en'?'Certificate evidence updated.':'Đã cập nhật minh chứng chứng chỉ.');return true;
    }});
    return;
  }
  
  
  const pv=e.target.closest('[data-cert-preview]');if(pv){const [id,index]=pv.dataset.certPreview.split('|'),row=certAssetList(id)[Number(index)];if(row)window.open(publicUrl(row.storage_path),'_blank','noopener');return}
  const up=e.target.closest('[data-cert-upload]');
  if(up){const input=document.createElement('input');input.type='file';input.multiple=true;input.accept=ACCEPTED_ASSET_INPUT;input.hidden=true;document.body.appendChild(input);
    input.addEventListener('change',async()=>{const files=[...input.files],id=up.dataset.certUpload;input.remove();if(!files.length)return;
      try{mergeEditorInputs();const item=findCertAdminItem(id);setAdminStatus('#globalContentStatus','ok',t('admin.uploading'));await uploadAssetBatch({assetType:'proof',ownerType:certificateOwnerType(id),ownerId:id,projectId:null,titleVi:item?.title.vi||'',titleEn:item?.title.en||'',sortOrderStart:certAssetList(id).length,files});await loadAssets();mergeEditorInputs();renderGlobalEditor();setAdminStatus('#globalContentStatus','ok',t('admin.uploaded'))}
      catch(err){setAdminStatus('#globalContentStatus','err',formatAssetUploadError(err))}},{once:true,signal:controller.signal});input.click();return}
  const coverUp=e.target.closest('[data-cert-cover-upload]');
  if(coverUp){const id=coverUp.dataset.certCoverUpload,input=document.createElement('input');input.type='file';input.accept='image/*';input.hidden=true;document.body.appendChild(input);input.addEventListener('change',async()=>{const file=input.files?.[0];input.remove();if(!file)return;mergeEditorInputs();await doCertCoverUpload(id,file)},{once:true,signal:controller.signal});input.click();return}
  const coverRemove=e.target.closest('[data-cert-cover-remove]');
  if(coverRemove){const row=assetRegistry.get(coverRemove.dataset.certCoverRemove);if(!row||!await assertAssetUnused(row.id,'#globalContentStatus',false))return;try{await removeAssetRows([row]);await loadAssets();mergeEditorInputs();renderGlobalEditor();setAdminStatus('#globalContentStatus','ok',t('admin.deleted'))}catch(err){setAdminStatus('#globalContentStatus','err',formatAssetUploadError(err))}return}
  const rm=e.target.closest('[data-cert-remove]');
  if(rm){const row=assetRegistry.get(rm.dataset.certRemove);if(!row)return;try{await sbFetch(`/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=eq.${encodeURIComponent(row.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({project_id:null,owner_type:null,owner_id:null,sort_order:0})});await loadAssets();mergeEditorInputs();renderGlobalEditor();setAdminStatus('#globalContentStatus','ok',currentLang==='en'?'Evidence removed from this certificate; the file remains in Media Library.':'Đã bỏ minh chứng khỏi chứng chỉ; file vẫn còn trong Media Library.')}catch(err){setAdminStatus('#globalContentStatus','err',formatAssetUploadError(err))}}
},{signal:controller.signal});
$('#proofUploadForm').noValidate=true;
$('#projectForm').noValidate=true;
$('#insightForm').noValidate=true;
$('#proofUploadForm').addEventListener('submit',doProofUpload,{signal:controller.signal});
$('#avatarUploadForm').addEventListener('submit',doAvatarUpload,{signal:controller.signal});
$('#coverUploadForm').addEventListener('submit',doCoverUpload,{signal:controller.signal});
$('#projectForm').addEventListener('submit',e=>{e.preventDefault();saveProjectDraft()},{signal:controller.signal});
$('#saveProjectDraftBtn').addEventListener('click',saveProjectDraft,{signal:controller.signal});
$('#previewProjectDraftBtn').addEventListener('click',previewCurrentProject,{signal:controller.signal});
$('#publishProjectBtn').addEventListener('click',publishProject,{signal:controller.signal});
$('#unpublishProjectBtn').addEventListener('click',unpublishProject,{signal:controller.signal});
$('#newProjectBtn').addEventListener('click',()=>{resetProjectEditor();$('#projectEditor').hidden=false;setProjectLifecycleUI({dbId:null,published:false,id:''});$('#projectTitleVi').focus()},{signal:controller.signal});
$('#cancelProjectBtn').addEventListener('click',resetProjectEditor,{signal:controller.signal});
$('#addProjectSectionBtn').addEventListener('click',()=>{const current=projectSectionPayloads();current.push({sort_order:current.length,title_vi:'',body_vi:'',title_en:'',body_en:'',blocks:{version:BLOCKS_VERSION,items:[newBlock('paragraph')]}});const langs=projectSectionLangs();langs.push(currentLang==='en'?'en':'vi');renderProjectSectionEditor(current,langs)},{signal:controller.signal});
$('#migrateProjectsBtn').addEventListener('click',migrateExistingProjects,{signal:controller.signal});
$('#newInsightBtn').addEventListener('click',()=>{resetInsightEditor();$('#insightEditor').hidden=false;$('#insightSlug').disabled=false;$('#insightSortOrder').value=INSIGHTS_ADMIN.length+1;$('#insightReadMinutes').value=1;$('#insightToneA').value='#22d3ee';$('#insightToneB').value='#a78bfa';renderInsightSectionEditor([]);$('#insightTitleVi').focus()},{signal:controller.signal});
$('#cancelInsightBtn').addEventListener('click',resetInsightEditor,{signal:controller.signal});
$('#addInsightSectionBtn').addEventListener('click',()=>{const host=$('#insightSectionsEditor'),rows=projectSectionPayloads(host);rows.push({sort_order:rows.length,title_vi:'',body_vi:'',title_en:'',body_en:'',blocks:{version:BLOCKS_VERSION,items:[newBlock('paragraph')]}});renderInsightSectionEditor(rows,projectSectionLangs(host))},{signal:controller.signal});
$('#saveInsightDraftBtn').addEventListener('click',saveInsightDraft,{signal:controller.signal});
$('#previewInsightDraftBtn').addEventListener('click',previewCurrentInsight,{signal:controller.signal});
$('#publishInsightBtn').addEventListener('click',publishInsight,{signal:controller.signal});
$('#unpublishInsightBtn').addEventListener('click',unpublishInsight,{signal:controller.signal});
$('#recalculateInsightMinutes').addEventListener('click',recalculateInsightMinutes,{signal:controller.signal});
$('#uploadInsightCoverBtn').addEventListener('click',()=>{const input=document.createElement('input');input.type='file';input.accept='image/*';input.hidden=true;document.body.append(input);input.addEventListener('change',async()=>{const file=input.files?.[0];input.remove();if(!file)return;try{await uploadInsightMedia('insight_cover',[file]);setInsightStatus('ok',t('admin.uploaded'))}catch(error){setInsightStatus('err',formatAssetUploadError(error))}},{once:true,signal:controller.signal});input.click()},{signal:controller.signal});
$('#uploadInsightProofBtn').addEventListener('click',()=>{const input=document.createElement('input');input.type='file';input.multiple=true;input.accept=ACCEPTED_ASSET_INPUT;input.hidden=true;document.body.append(input);input.addEventListener('change',async()=>{const files=[...input.files];input.remove();if(!files.length)return;try{await uploadInsightMedia('proof',files);setInsightStatus('ok',t('admin.uploaded'))}catch(error){setInsightStatus('err',formatAssetUploadError(error))}},{once:true,signal:controller.signal});input.click()},{signal:controller.signal});
$('#globalSaveDraftBtn').addEventListener('click',saveGlobalDraft,{signal:controller.signal});
$('#globalPreviewBtn').addEventListener('click',openGlobalPreview,{signal:controller.signal});
$('#globalPublishBtn').addEventListener('click',publishGlobal,{signal:controller.signal});
$('#globalUnpublishBtn')?.addEventListener('click',unpublishGlobal,{signal:controller.signal});
$$('[data-global-tab]').forEach(btn=>btn.addEventListener('click',()=>{mergeEditorInputs();globalAdminTab=btn.dataset.globalTab;$$('[data-global-tab]').forEach(x=>{x.classList.toggle('is-active',x===btn);x.setAttribute('aria-selected',x===btn?'true':'false')});renderGlobalEditor()},{signal:controller.signal}));
document.addEventListener('input',e=>{const field=e.target.closest('[data-global-field],[data-global-array],[data-global-config],[data-highlight-path]');if(field)mergeEditorInputs()},{signal:controller.signal});
document.addEventListener('change',e=>{if(e.target.matches('[data-global-config]'))mergeEditorInputs();if(e.target.matches('[data-highlight-path$=".type"]')){mergeEditorInputs();renderGlobalEditor()}},{signal:controller.signal});
document.addEventListener('click',async e=>{
  const highlightAdd=e.target.closest('[data-highlight-add]');if(highlightAdd){mergeEditorInputs();const path=highlightAdd.dataset.highlightAdd,blocks=getPath(globalAdminContent,path),next=Array.isArray(blocks)?blocks:[];next.push({id:newId(),type:'paragraph',content:{text_vi:'',text_en:'',caption_vi:'',caption_en:''},settings:{url:''}});setPath(globalAdminContent,path,next);renderGlobalEditor();return}
  const highlightRemove=e.target.closest('[data-highlight-remove]');if(highlightRemove){mergeEditorInputs();const parts=highlightRemove.dataset.highlightRemove.split('.'),index=Number(parts.pop()),path=parts.join('.'),blocks=getPath(globalAdminContent,path);if(Array.isArray(blocks)){blocks.splice(index,1);setPath(globalAdminContent,path,blocks.length?blocks:null)}renderGlobalEditor();return}
  const experienceAdd=e.target.closest('[data-experience-add]');if(experienceAdd){mergeEditorInputs();const experience=globalAdminContent.experience;experience.entriesManaged={vi:true,en:true};experience.entries.push({id:newId(),title:{vi:'',en:''},role:{vi:'',en:''},description:{vi:'',en:''},tags:{vi:[],en:[]},highlights:[]});renderGlobalEditor();return}
  const experienceRemove=e.target.closest('[data-experience-remove]');if(experienceRemove){mergeEditorInputs();const experience=globalAdminContent.experience;if(!confirm(currentLang==='en'?'Remove this experience entry?':'Xóa mục kinh nghiệm này?'))return;experience.entries=experience.entries.filter(entry=>entry.id!==experienceRemove.dataset.experienceRemove);experience.entriesManaged={vi:true,en:true};renderGlobalEditor();return}
  const certGroupAdd=e.target.closest('[data-cert-group-add]');if(certGroupAdd){mergeEditorInputs();globalAdminContent.experience.certGroups.push({id:`group-${newId()}`,title:{vi:'Khác',en:'Other'},items:[],removedIds:[]});renderGlobalEditor();return}
  const certGroupRemove=e.target.closest('[data-cert-group-remove]');if(certGroupRemove){mergeEditorInputs();const experience=globalAdminContent.experience,group=experience.certGroups.find(item=>item.id===certGroupRemove.dataset.certGroupRemove);if(!group||!confirm(currentLang==='en'?'Remove this group and its certificate entries? Files will remain in Media Library.':'Xóa nhóm và các chứng chỉ bên trong? File vẫn được giữ trong Media Library.'))return;for(const item of group.items||[])if(!await detachCertificateMedia(item.id))return;if(CERT_GROUP_DEFAULTS.some(item=>item.id===group.id)){experience.certGroupRemovedIds=Array.isArray(experience.certGroupRemovedIds)?experience.certGroupRemovedIds:[];if(!experience.certGroupRemovedIds.includes(group.id))experience.certGroupRemovedIds.push(group.id)}experience.certGroups=experience.certGroups.filter(item=>item.id!==group.id);await loadAssets();renderGlobalEditor();setAdminStatus('#globalContentStatus','ok',currentLang==='en'?'Certificate group removed.':'Đã xóa nhóm chứng chỉ.');return}
  const certAdd=e.target.closest('[data-cert-item-add]');if(certAdd){mergeEditorInputs();const group=globalAdminContent.experience.certGroups.find(item=>item.id===certAdd.dataset.certItemAdd);if(!group)return;group.items.push({id:newId(),title:{vi:'',en:''},issuer:'',date:'',credentialUrl:'',description:{vi:'',en:''},highlights:[]});renderGlobalEditor();return}
  const certRemove=e.target.closest('[data-cert-item-remove]');if(certRemove){mergeEditorInputs();const id=certRemove.dataset.certItemRemove,group=globalAdminContent.experience.certGroups.find(item=>item.items.some(cert=>cert.id===id));if(!group||!confirm(currentLang==='en'?'Remove this certificate or achievement? Its files will remain in Media Library.':'Xóa chứng chỉ/thành tựu này? Các file sẽ được giữ trong Media Library.'))return;if(!await detachCertificateMedia(id))return;group.items=group.items.filter(cert=>cert.id!==id);group.removedIds=Array.isArray(group.removedIds)?group.removedIds:[];if(!group.removedIds.includes(id))group.removedIds.push(id);renderGlobalEditor();await loadAssets();renderGlobalEditor();setAdminStatus('#globalContentStatus','ok',currentLang==='en'?'Certificate or achievement removed.':'Đã xóa chứng chỉ/thành tựu.');return}
  const edit=e.target.closest('[data-edit-project]');if(edit){const p=projectForEditing(edit.dataset.editProject);if(p)editProject(p);return}
  const del=e.target.closest('[data-delete-project]');if(del){const p=projectBySlug(del.dataset.deleteProject);if(p)deleteProject(p);return}
  const remove=e.target.closest('[data-remove-section],[data-remove-project-section]');if(remove){remove.closest('.admin-section-row')?.remove();return}
  const sectionUp=e.target.closest('[data-section-up]');if(sectionUp){const row=sectionUp.closest('.admin-section-row'),host=sectionEditorHost(row);if(row?.previousElementSibling){row.parentElement.insertBefore(row,row.previousElementSibling);renderProjectSectionEditor(projectSectionPayloads(host),projectSectionLangs(host),host);}return}
  const sectionDown=e.target.closest('[data-section-down]');if(sectionDown){const row=sectionDown.closest('.admin-section-row'),host=sectionEditorHost(row);if(row?.nextElementSibling){row.parentElement.insertBefore(row.nextElementSibling,row);renderProjectSectionEditor(projectSectionPayloads(host),projectSectionLangs(host),host);}return}
  const duplicateSection=e.target.closest('[data-duplicate-section],[data-duplicate-project-section]');if(duplicateSection){const row=duplicateSection.closest('.admin-section-row'),host=sectionEditorHost(row);if(!row)return;const payload=projectSectionPayloads(host),rows=[...host.querySelectorAll('.admin-section-row')],index=rows.indexOf(row);const copy=JSON.parse(JSON.stringify(payload[index]||{}));copy.id=null;copy.title_vi=copy.title_vi?`${copy.title_vi} · Copy`:'';copy.title_en=copy.title_en?`${copy.title_en} · Copy`:'';copy.blocks=normalizeBlockDocument(copy.blocks);copy.blocks.items=copy.blocks.items.map(b=>({...b,id:newId()}));const langs=projectSectionLangs(host);langs.splice(index+1,0,langs[index]);payload.splice(index+1,0,copy);renderProjectSectionEditor(payload,langs,host);return}
  if(!e.target.closest('.admin-ins'))document.querySelectorAll('.admin-ins.is-open').forEach(x=>{x.classList.remove('is-open');const m=x.querySelector('.admin-ins-menu');if(m)m.hidden=true;x.querySelector('[data-ins-toggle]')?.setAttribute('aria-expanded','false')});
  const editorialLangTab=e.target.closest('[data-editorial-lang-tab]');if(editorialLangTab){
    const row=editorialLangTab.closest('.admin-section-row');if(!row)return;
    editorialSetLang(row,editorialLangTab.dataset.editorialLangTab);
    return;
  }
  const insToggle=e.target.closest('[data-ins-toggle]');if(insToggle){
    const ins=insToggle.closest('.admin-ins'),menu=ins&&ins.querySelector('.admin-ins-menu');if(!menu)return;
    const willOpen=menu.hidden;
    document.querySelectorAll('.admin-ins.is-open').forEach(x=>{x.classList.remove('is-open');const m=x.querySelector('.admin-ins-menu');if(m)m.hidden=true;x.querySelector('[data-ins-toggle]')?.setAttribute('aria-expanded','false')});
    menu.hidden=!willOpen;ins.classList.toggle('is-open',willOpen);insToggle.setAttribute('aria-expanded',willOpen?'true':'false');
    return;
  }
  const insType=e.target.closest('[data-ins-type]');if(insType){
    const ins=insType.closest('.admin-ins'),row=insType.closest('.admin-section-row');if(!ins||!row)return;
    const at=Number(ins.dataset.insAt),block=newBlock(insType.dataset.insType);
    mutateEditorialRow(row,doc=>{const pos=Number.isInteger(at)?Math.max(0,Math.min(at,doc.items.length)):doc.items.length;doc.items.splice(pos,0,block)},{focusId:block.id});
    return;
  }
  const blockMove=e.target.closest('[data-block-up],[data-block-down]');if(blockMove){
    const ctx=editorialBlockContext(blockMove);if(!ctx)return;
    const dir=blockMove.hasAttribute('data-block-up')?-1:1;
    editorialMutateBlock(ctx.row,ctx.blockId,(b,doc)=>{const i=doc.items.indexOf(b),k=i+dir;if(i<0||k<0||k>=doc.items.length)return false;[doc.items[i],doc.items[k]]=[doc.items[k],doc.items[i]]},{focusId:ctx.blockId});
    return;
  }
  const blockDup=e.target.closest('[data-block-duplicate]');if(blockDup){
    const ctx=editorialBlockContext(blockDup);if(!ctx)return;
    const copyId=newId();
    editorialMutateBlock(ctx.row,ctx.blockId,(b,doc)=>{const i=doc.items.indexOf(b);if(i<0)return false;doc.items.splice(i+1,0,{...JSON.parse(JSON.stringify(b)),id:copyId})},{focusId:copyId});
    return;
  }
  const blockDel=e.target.closest('[data-block-delete]');if(blockDel){
    const ctx=editorialBlockContext(blockDel);if(!ctx)return;
    editorialMutateBlock(ctx.row,ctx.blockId,(b,doc)=>{const i=doc.items.indexOf(b);if(i<0)return false;doc.items.splice(i,1)});
    return;
  }
  const imageRemove=e.target.closest('[data-image-remove]');if(imageRemove){
    const ctx=editorialBlockContext(imageRemove);if(!ctx)return;
    editorialMutateBlock(ctx.row,ctx.blockId,b=>{b.settings.asset_id=''});
    return;
  }
  const previewProject=e.target.closest('[data-preview-project]');if(previewProject){previewCurrentProject();return}
  const preview=e.target.closest('[data-preview-section]');if(preview){const row=preview.closest('.admin-section-row');if(!row)return;const doc=readSectionBlockEditors(row);const lang=currentLang==='en'?'en':'vi';const title=lang==='en'?(row.querySelector('[data-section-title-en]')?.value||'Preview'):(row.querySelector('[data-section-title-vi]')?.value||'Xem trước');const w=window.open('','_blank','noopener');if(!w){alert(currentLang==='en'?'Popup blocked. Allow popups to preview.':'Trình duyệt đã chặn cửa sổ preview. Hãy cho phép popup.');return}w.document.write(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>body{margin:0;background:#0a0b10;color:#fff;font:15px/1.8 system-ui,sans-serif}.wrap{max-width:760px;margin:0 auto;padding:48px 20px}.k{color:#22d3ee;font:10px ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase}h1{font-size:38px;line-height:1.05} .case-copy{color:rgba(255,255,255,.76);margin:18px 0}.case-pull-quote{border-left:2px solid #ff6b35;padding-left:16px;color:rgba(255,255,255,.82)}ul{padding-left:22px}.article-media{margin:28px 0}.article-media img{display:block;width:auto;height:auto;max-width:100%;margin:auto}.case-richtext table,.case-table{width:100%;border-collapse:collapse;margin:18px 0}.case-richtext th,.case-richtext td,.case-table th,.case-table td{padding:9px 11px;border:1px solid rgba(255,255,255,.16);text-align:left}.case-richtext th,.case-table th{background:rgba(34,211,238,.08)}.case-table-wrap{overflow:auto}.case-table-caption{color:#9aa3b2;font-size:11px}.case-chart{display:grid;gap:10px;margin:20px 0}.case-chart-row{display:grid;grid-template-columns:minmax(80px,1fr) minmax(80px,2fr) auto;align-items:center;gap:10px}.case-chart-label{font-size:11px}.case-chart-track{height:9px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}.case-chart-bar{display:block;width:var(--chart-value);height:100%;background:linear-gradient(90deg,#22d3ee,#a78bfa)}.case-flow{display:flex;overflow:auto}.case-flow-step{min-width:150px;padding:14px;border:1px solid rgba(34,211,238,.2)}.case-flow-step span{color:#22d3ee}.article-media-placeholder{padding:30px;border:1px dashed rgba(34,211,238,.2);color:#78808d}</style></head><body><main class="wrap"><div class="k">CASE STUDY · ${esc(title)}</div><h1>${esc(title)}</h1>${renderBlockDocument(doc,lang,{blocks:doc})}</main></body></html>`);w.document.close();return}
},{signal:controller.signal});
document.addEventListener('click',async e=>{
  const add=e.target.closest('#projectAddMediaBtn');if(add){const slug=$('#projectSlug')?.dataset.originalSlug||$('#projectSlug')?.value;const p=projectBySlug(slug);if(p)openMediaLibrary({mode:'single',accept:'proof',projectId:p.id,title:t('admin.mediaLibrary'),browseOnly:true});return;}
  const open=e.target.closest('[data-project-media-open]');if(open){const row=assetRegistry.get(open.dataset.projectMediaOpen);openAdminAsset(open.dataset.projectMediaOpen,row?.asset_type==='gallery'?'viewGallery':'open');return;}
  const rep=e.target.closest('[data-project-media-replace]');if(rep){replaceProofAsset(rep.dataset.projectMediaReplace);return;}
  const del=e.target.closest('[data-project-media-delete]');if(del){await deleteAsset(del.dataset.projectMediaDelete);const p=projectBySlug($('#projectSlug')?.dataset.originalSlug||$('#projectSlug')?.value);if(p)renderProjectMediaManager(p);return;}
  const coverOpen=e.target.closest('[data-project-cover-open]');if(coverOpen){const row=assetRegistry.get(coverOpen.dataset.projectCoverOpen);if(row)window.open(publicUrl(row.storage_path),'_blank','noopener');return;}
  const coverRep=e.target.closest('[data-project-cover-replace]');if(coverRep){$('#coverProject').value=coverRep.dataset.projectCoverReplace;$('#projectCoverFile').click();return;}
  const coverDel=e.target.closest('[data-project-cover-delete]');if(coverDel){const row=assetRegistry.get(coverDel.dataset.projectCoverDelete);if(row){if(!await assertAssetUnused(row.id,'#coverUploadStatus'))return;try{const cleanup=await removeAssetRows([row]);await loadAssets();const p=projectBySlug($('#projectSlug')?.dataset.originalSlug||$('#projectSlug')?.value);if(p)renderProjectMediaManager(p);setAdminStatus('#coverUploadStatus',cleanupStatusType(cleanup),cleanupSuccessMessage(cleanup,'admin.deleted'));}catch(err){setAdminStatus('#coverUploadStatus','err',formatAssetUploadError(err));}}return;}
},{signal:controller.signal});
document.addEventListener('click',async e=>{
  const close=e.target.closest('[data-media-close]');if(close){closeMediaLibrary();return}
  const card=e.target.closest('[data-media-id]');
  if(card){
    const id=card.dataset.mediaId,row=getAsset(id);if(!row)return;
    if(mediaLibraryState.mode==='single')mediaLibraryState.selectedId=id;
    else {if(mediaLibraryState.selectedIds.has(id))mediaLibraryState.selectedIds.delete(id);else mediaLibraryState.selectedIds.add(id);mediaLibraryState.selectedId=mediaLibraryState.selectedIds.has(id)?id:mediaLibraryState.selectedIds.values().next().value||null;}
    renderMediaLibrary();return;
  }
  if(e.target.closest('[data-media-confirm]')){confirmMediaLibrary();return}
  if(e.target.closest('[data-media-upload]')){
    const projectId=mediaLibraryState.projectId||$('#projectSlug')?.dataset.originalSlug||$('#projectSlug')?.value||'';
    if(!projectId){setAdminStatus('#projectStatus','err',t('admin.projectMissing'));return;}
    const input=$('#proofFiles');
    if(!input){setAdminStatus('#projectStatus','err',t('admin.assetRequired'));return;}
    mediaLibraryUploadActive=true;
    input.accept=ACCEPTED_ASSET_INPUT;
    input.multiple=true;
    input.value='';
    input.click();
    return;
  }
  const chooseImage=e.target.closest('[data-media-choose-image]');
  if(chooseImage){editorialPickAsset(chooseImage,{mode:'single',accept:'image',title:t('admin.chooseMedia')});return}
  const replaceImage=e.target.closest('[data-image-replace]');
  if(replaceImage){editorialPickAsset(replaceImage,{mode:'single',accept:'image',title:t('admin.chooseMedia')});return}
  const galleryManage=e.target.closest('[data-gallery-manage]');
  if(galleryManage){editorialPickAsset(galleryManage,{mode:'multi',accept:'image',title:t('admin.manageGallery')});return}
  const galleryMove=e.target.closest('[data-gallery-up],[data-gallery-down]');
  if(galleryMove){
    const ctx=editorialBlockContext(galleryMove);if(!ctx)return;
    const j=Number(galleryMove.closest('[data-gallery-index]')?.dataset.galleryIndex),dir=galleryMove.hasAttribute('data-gallery-up')?-1:1;
    editorialMutateBlock(ctx.row,ctx.blockId,b=>{const ids=[...(b.settings.asset_ids||[])],k=j+dir;if(!Number.isInteger(j)||j<0||j>=ids.length||k<0||k>=ids.length)return false;[ids[j],ids[k]]=[ids[k],ids[j]];b.settings.asset_ids=ids});
    return;
  }
  const galleryRemove=e.target.closest('[data-gallery-remove]');
  if(galleryRemove){
    const ctx=editorialBlockContext(galleryRemove);if(!ctx)return;
    const j=Number(galleryRemove.closest('[data-gallery-index]')?.dataset.galleryIndex);
    editorialMutateBlock(ctx.row,ctx.blockId,b=>{const ids=[...(b.settings.asset_ids||[])];if(!Number.isInteger(j)||j<0||j>=ids.length)return false;ids.splice(j,1);b.settings.asset_ids=ids});
    return;
  }
  const proofChoose=e.target.closest('[data-proof-choose]');
  if(proofChoose){editorialPickAsset(proofChoose,{mode:'single',accept:'proof',title:t('admin.proofChoose')});return}
  const videoChoose=e.target.closest('[data-video-choose]');
  if(videoChoose){editorialPickAsset(videoChoose,{mode:'single',accept:'video',title:t('admin.chooseMedia'),clearUrl:true});return}
  const videoPosterChoose=e.target.closest('[data-video-poster-choose]');
  if(videoPosterChoose){editorialPickSettingAsset(videoPosterChoose,'poster_asset_id',{accept:'image',title:currentLang==='en'?'Choose video poster':'Chọn poster video'});return}
  const videoPosterRemove=e.target.closest('[data-video-poster-remove]');
  if(videoPosterRemove){const ctx=editorialBlockContext(videoPosterRemove);if(!ctx)return;editorialMutateBlock(ctx.row,ctx.blockId,b=>{b.settings.poster_asset_id=''});return}
  const fileChoose=e.target.closest('[data-file-choose]');
  if(fileChoose){editorialPickSettingAsset(fileChoose,'asset_id',{accept:'all',title:currentLang==='en'?'Choose downloadable file':'Chọn file tải xuống'});return}
  const fileRemove=e.target.closest('[data-file-remove]');
  if(fileRemove){const ctx=editorialBlockContext(fileRemove);if(!ctx)return;editorialMutateBlock(ctx.row,ctx.blockId,b=>{b.settings.asset_id=''});return}
  const videoRemove=e.target.closest('[data-video-remove]');
  if(videoRemove){
    const ctx=editorialBlockContext(videoRemove);if(!ctx)return;
    editorialMutateBlock(ctx.row,ctx.blockId,b=>{b.settings.asset_id=''});
    return;
  }
  const proofRemove=e.target.closest('[data-proof-remove]');
  if(proofRemove){
    const ctx=editorialBlockContext(proofRemove);if(!ctx)return;
    editorialMutateBlock(ctx.row,ctx.blockId,b=>{b.settings.asset_id=''});
    return;
  }
},{signal:controller.signal});
document.addEventListener('mousedown',e=>{
  /* keep the text selection (and focus) inside the editor while a toolbar button is pressed */
  if(e.target.closest('[data-richtext-command]'))e.preventDefault();
},{signal:controller.signal});
document.addEventListener('click',e=>{
  const cmd=e.target.closest('[data-richtext-command]');
  if(!cmd)return;
  const wrap=cmd.closest('[data-richtext-wrap]');
  const editor=wrap?.querySelector('[data-richtext-editor]');
  if(!editor)return;
  const sel=window.getSelection();
  let saved=null;
  if(sel&&sel.rangeCount&&editor.contains(sel.anchorNode))saved=sel.getRangeAt(0).cloneRange();
  const restore=()=>{editor.focus();if(saved&&sel){sel.removeAllRanges();sel.addRange(saved)}};
  restore();
  const spec=cmd.dataset.richtextCommand;
  if(spec==='createLink'){
    const url=window.prompt(currentLang==='en'?'Enter a link URL (https/http/mailto only):':'Nhập URL liên kết (chỉ https/http/mailto):','https://');
    if(url===null)return;
    const safe=safeLinkHref(url);
    if(!safe){alert(currentLang==='en'?'Unsafe or invalid link protocol.':'URL không hợp lệ hoặc dùng protocol không an toàn.');return}
    restore();
    document.execCommand('createLink',false,safe);
  }else if(spec.startsWith('formatBlock:')){document.execCommand('formatBlock',false,spec.split(':')[1]);}
  else document.execCommand(spec,false,null);
  editor.dispatchEvent(new Event('input',{bubbles:true}));
},{signal:controller.signal});
document.addEventListener('input',e=>{
  if(e.target.matches('[data-media-query]')){mediaLibraryState.query=e.target.value;renderMediaLibrary();return}
},{signal:controller.signal});
document.addEventListener('change',async e=>{
  if(e.target.id==='proofFiles'&&mediaLibraryUploadActive){
    mediaLibraryUploadActive=false;
    const files=[...e.target.files];
    if(!files.length)return;
    try{
      setAdminStatus('#adminUploadStatus','ok',t('admin.uploading'));
      await uploadMediaLibraryFiles(files);
      e.target.value='';
      setAdminStatus('#adminUploadStatus','ok',t('admin.uploaded'));
    }catch(err){
      e.target.value='';
      setAdminStatus('#adminUploadStatus','err',err.message==='project_missing'?t('admin.projectMissing'):err.message==='asset_schema_missing'?t('admin.schemaMissing'):err.message==='supabase_not_configured'?t('admin.notConfigured'):err.message==='supabase_auth_error'?t('admin.authError'):err.message==='supabase_permission_error'?t('admin.permissionError'):err.message==='supabase_network_error'?t('admin.networkError'):err.message==='asset_required'?t('admin.assetRequired'):t('admin.uploadFailed'));
    }
    return;
  }
  if(e.target.matches('[data-media-filter]')){mediaLibraryState.filter=e.target.value;renderMediaLibrary();return}
  if(e.target.matches('[data-media-project]')){mediaLibraryState.projectId=e.target.value;mediaLibraryState.ownerType=e.target.value.startsWith('insight:')?'insight':'project';renderMediaLibrary();return}
},{signal:controller.signal});
document.addEventListener('paste',e=>{
  const editor=e.target.closest('[data-richtext-editor]');if(!editor)return;
  const html=e.clipboardData?.getData('text/html');
  if(!html)return;
  e.preventDefault();
  const clean=sanitizeRichText(html);
  const selection=window.getSelection();
  if(!selection||!selection.rangeCount)return;
  const range=selection.getRangeAt(0);range.deleteContents();
  const temp=document.createElement('div');temp.innerHTML=clean;
  const frag=document.createDocumentFragment();while(temp.firstChild)frag.appendChild(temp.firstChild);
  range.insertNode(frag);range.collapse(false);selection.removeAllRanges();selection.addRange(range);
  editor.dispatchEvent(new Event('input',{bubbles:true}));
},{signal:controller.signal});
document.addEventListener('input',e=>{if(e.isComposing)return;editorialSyncFromEvent(e)},{signal:controller.signal});
document.addEventListener('compositionend',editorialSyncFromEvent,{signal:controller.signal});
document.addEventListener('click',e=>{const previewClose=e.target.closest('[data-asset-preview-close]');if(previewClose){closeModalDialog(adminAssetPreviewDialog);return}const download=e.target.closest('[data-download-asset]');if(download){downloadAdminAsset(download.dataset.downloadAsset);return}const del=e.target.closest('[data-delete-asset]');if(del){deleteAsset(del.dataset.deleteAsset);return}const rep=e.target.closest('[data-replace-asset]');if(rep){replaceProofAsset(rep.dataset.replaceAsset);return}const open=e.target.closest('[data-open-asset]');if(open){e.preventDefault();openAdminAsset(open.dataset.openAsset,open.dataset.action||'open')}},{signal:controller.signal});
$('#adminLogout').addEventListener('click',()=>{closeModalDialog(adminAssetPreviewDialog);HQVShared.auth?.signOut?.()},{signal:controller.signal});
adminDialog.addEventListener('cancel',event=>event.preventDefault(),{signal:controller.signal});
adminDialog.querySelector('[data-close="admin"]')?.addEventListener('click',()=>location.assign('./index.html'),{signal:controller.signal});
$('[data-admin-lang="vi"]')?.addEventListener('click',()=>changeAdminLanguage('vi'),{signal:controller.signal});
$('[data-admin-lang="en"]')?.addEventListener('click',()=>changeAdminLanguage('en'),{signal:controller.signal});
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==globalPreviewWindow)return;if(event.data?.type==='hqv-draft-preview-ready'){globalPreviewWindow.postMessage({type:'hqv-draft-preview',runtime:deepClone(globalPreviewSnapshot||{})},location.origin);return}if(event.data?.type!=='hqv-global-preview-ready')return;globalPreviewWindow.postMessage({type:'hqv-global-preview',content:deepClone(globalPreviewSnapshot||{})},location.origin)},{signal:controller.signal});
}
window.HQVAdmin={mount(root){if(controller)return;controller=new AbortController();const template=document.createElement('template');template.innerHTML=ADMIN_MARKUP.replace('<div class="global-cms-head">','<div class="global-cms-head"><div class="login-langs" aria-label="Language"><button type="button" data-admin-lang="vi">VI</button><button type="button" data-admin-lang="en">EN</button></div>');root.append(template.content);adminDialog=$('#adminDialog');adminDialog.querySelector('#globalContentManager')?.insertAdjacentHTML('afterend',VISITOR_ADMIN_MARKUP);adminDialog.querySelector('.admin-project-management:not(.visitor-admin)')?.insertAdjacentHTML('afterend',INSIGHT_ADMIN_MARKUP);unsubscribers=[HQVShared.on('projects',refreshAdminProjectList),HQVShared.on('assets',()=>{refreshAdminList();const slug=$('#projectSlug')?.dataset.originalSlug;const project=slug&&projectBySlug(slug);if(project)renderProjectMediaManager(project)}),HQVShared.on('global',()=>{if(globalContentLoadState!=='loading')loadGlobalDrafts()}),HQVShared.on('insights',()=>{refreshAdminInsightList();populateAdminProjects()})];bindAdminEvents();applyAdminStatic();renderGlobalEditor();openModalDialog(adminDialog);globalContentLoadState='loading';refreshGlobalControls();HQVShared.loadGlobalPublished().then(loaded=>{if(loaded)loadGlobalDrafts();else{globalContentLoadState='failed';globalAdminContent=HQVShared.composeGlobalContent(globalFallbackContent());renderGlobalEditor();refreshGlobalBadge();refreshGlobalControls();setAdminStatus('#globalContentStatus','err',currentLang==='en'?'Live content could not be loaded. Writes are blocked to prevent overwriting it.':'Không tải được nội dung live, chặn ghi để tránh ghi đè.')}});loadVisitorAdminList();loadAssets();loadAdminProjects().catch(error=>setProjectStatus('err',projectErrorText(error)));loadProjectDrafts();loadAdminInsights();loadInsightDrafts();},restoreProjectBackup:restoreProjectEditorBackup,saveProjectBackupAsNewDraft,unmount(){controller?.abort();controller=null;unsubscribers.forEach(unsubscribe=>unsubscribe());unsubscribers=[];document.querySelectorAll('#adminDialog,#mediaLibraryDialog').forEach(node=>node.remove());globalDraftContent=null;projectDrafts.clear();insightDrafts.clear();INSIGHTS_ADMIN.splice(0);assetRegistry.clear();globalPreviewWindow=null;globalPreviewSnapshot=null;HQVShared.auth=null;}};
})();