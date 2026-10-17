let globalPreviewContent=null;

let isGlobalPreview=location.hash==='#global-preview';
let draftPreviewRuntime=null;
let isDraftPreview=location.hash==='#draft-preview';

function applyGlobalContentToDOM(content,lang=currentLang){
  const get=p=>getLocalizedContent(getPath(content,p),lang);const home=content.home,approach=content.approach,projects=content.projects,skills=content.skills,experience=content.experience,contact=content.contact,footer=content.footer;
  $('#hero-title').textContent=get('home.name');
  const role=String(get('home.role')||'');$('.hero-role').innerHTML=role.split('·').map((x,i)=>`<span class="${i===0?'warm':i===1?'cyan':''}">${esc(x.trim())}</span>`).join(' · ');
  $('#heroSub').textContent=get('home.description');$('#statusText').textContent=get('home.status');$('.navlinks a[href="#projects"]').textContent=get('home.nav.projects');$('.navlinks a[href="#skills"]').textContent=get('home.nav.skills');$('.navlinks a[href="#experience"]').textContent=get('home.nav.experience');$('.navlinks a[href="#contact"]').textContent=get('home.nav.contact');$('.nav-cta [data-i18n="nav.cta"]').textContent=get('home.nav.cta');const heroProjects=$('.hero-actions a[href="#projects"]');const heroContact=$('.hero-actions a[href="#contact"]');if(heroProjects){heroProjects.href=safeLinkHref(get('home.ctaProjectsTarget'))||'#projects';heroProjects.querySelector('[data-i18n="hero.projects"]').textContent=get('home.ctaProjects')}if(heroContact){heroContact.href=safeLinkHref(get('home.ctaContactTarget'))||'#contact';heroContact.querySelector('[data-i18n="hero.contact"]').textContent=get('home.ctaContact')}
  const ap=$('#approach');if(ap){ap.querySelector('[data-i18n="approach.eyebrow"]').textContent=get('approach.eyebrow');ap.querySelector('[data-i18n="approach.resultTitle"]').textContent=get('approach.resultTitle');$('#approachLead').textContent=get('approach.lead');const fr=ap.querySelectorAll('.formula-row');approach.formula.forEach((f,i)=>{if(!fr[i])return;fr[i].querySelector('.label').textContent=get(`approach.formula.${i}.label`);fr[i].querySelector('.micro').textContent=get(`approach.formula.${i}.micro`)});ap.querySelector('[data-i18n="formula.result"]').textContent=get('approach.result');ap.querySelector('[data-i18n="process.kicker"]').textContent=get('approach.processKicker');ap.querySelectorAll('.process-item span').forEach((el,i)=>{el.textContent=get(`approach.process.${i}`)})}
  $('#projects .eyebrow').textContent=get('projects.eyebrow');$('#projects-title [data-i18n="projects.heading"]').textContent=get('projects.heading');$('#projects-title [data-i18n="projects.headingAccent"]').textContent=get('projects.headingAccent');$('#projects .lead').textContent=get('projects.lead');
  $('#skills .eyebrow').textContent=get('skills.eyebrow');$('#skills-title [data-i18n="skills.heading"]').textContent=get('skills.heading');$('#skills-title [data-i18n="skills.headingAccent"]').textContent=get('skills.headingAccent');$('#skills .lead').textContent=get('skills.lead');renderSkillsFromGlobal(content,lang);
  $('#experience .eyebrow').textContent=get('experience.eyebrow');$('#experience-title [data-i18n="experience.heading"]').textContent=get('experience.heading');$('#experience-title [data-i18n="experience.headingAccent"]').textContent=get('experience.headingAccent');$('#experienceLead').textContent=get('experience.lead');const exp=document.querySelector('.exp-panel');if(exp){exp.querySelector('.exp-code').textContent=get('experience.title');exp.querySelector('.exp-title').textContent=get('experience.role');exp.querySelector('p[data-i18n="experience.copy"]').textContent=get('experience.description');exp.querySelector('.exp-tags').innerHTML=(experience.tags?.[lang]||[]).map(x=>`<span class="exp-tag">${esc(x)}</span>`).join('')}
  const extra=document.querySelector('.extra-row');if(extra){extra.querySelector('.mini-panel:nth-child(1) h4').textContent=get('experience.creative.label');extra.querySelector('.mini-panel:nth-child(1) p').textContent=get('experience.creative.text');extra.querySelector('.mini-panel:nth-child(2) h4').textContent=get('experience.direction.label');extra.querySelector('.mini-panel:nth-child(2) p').textContent=get('experience.direction.text')}
  $('#contact .eyebrow').textContent=get('contact.eyebrow');$('#contact-title [data-i18n="contact.heading"]').textContent=get('contact.heading');$('#contact-title [data-i18n="contact.headingAccent"]').textContent=get('contact.headingAccent');$('#contactIntro').textContent=get('contact.intro');document.querySelector('.contact-point[data-i18n="contact.flow"]').textContent=get('contact.flow');document.querySelector('[data-i18n="form.name"]').textContent=get('contact.nameLabel');document.querySelector('[data-i18n="form.email"]').textContent=get('contact.emailLabel');document.querySelector('[data-i18n="form.message"]').textContent=get('contact.messageLabel');document.querySelector('[data-i18n="form.submit"]').textContent=get('contact.submit');$('input[name="name"]').placeholder=get('contact.namePlaceholder');$('textarea[name="message"]').placeholder=get('contact.messagePlaceholder');$('#contactSubject').value=get('contact.subject');
  const footerEl=document.querySelector('footer span');if(footerEl)footerEl.innerHTML=`${esc(get('footer.copyright'))} · ${esc(get('footer.supporting'))}`;
  if($('#globalPreviewBanner'))$('#globalPreviewBanner').hidden=!isGlobalPreview;
  renderCerts(experience.certGroups,lang);
}

function renderSkillsFromGlobal(content,lang){const cards=content.skills.cards||[];$('#skillsGrid').innerHTML=cards.map(s=>`<article class="skill-card reveal visible" style="--skill-accent:${esc(s.accent||'#22d3ee')}"><div class="skill-num">${esc(s.num||'')}</div><div class="skill-orbit"></div><h3 class="skill-title">${esc(getLocalizedContent(s.title,lang))}</h3><p class="skill-copy">${esc(getLocalizedContent(s.copy,lang))}</p><div class="skill-items">${String(getLocalizedContent(s.items,lang)||'').split(/\n+/).map(x=>x.trim()).filter(Boolean).map(x=>`<span class="skill-item"><strong>•</strong> ${esc(x)}</span>`).join('')}</div></article>`).join('')}

function renderGlobalContent(lang=currentLang){applyGlobalContentToDOM(globalPreviewContent||getGlobalContent(lang),lang)}

function renderCerts(groups){
  const normalized=normalizeCertGroups(groups||getGlobalContent().experience.certGroups);
  const hosts={'communications':'#experienceProofs','anthropic':'#anthropicCerts','marketing-analytics':'#marketingCerts','english':'#englishCerts'};
  normalized.forEach(group=>{const host=$(hosts[group.id]);if(!host)return;const heading=host.closest('.cert-group')?.querySelector('h3');if(heading)heading.textContent=getLocalizedContent(group.title,currentLang);host.innerHTML=group.items.map(item=>certBadgeHtml(item,currentLang)).join('')});
}

function openCertViewer(id,idx=0){
  if(!certificateItemById(id))return;
  const rows=certAssetList(id);if(!rows.length)return;idx=Math.max(0,Math.min(idx,rows.length-1));const row=rows[idx],url=getAssetUrl(row);let viewerItem;
  if(row.asset_type==='gallery'&&row.gallery_id){const files=rows.filter(asset=>asset.asset_type==='gallery'&&asset.gallery_id===row.gallery_id);viewerItem={type:'gallery',files:files.map(asset=>getAssetUrl(asset)),url:getAssetUrl(files[0]||row),original_name:row.title_vi||row.original_name,titleVi:row.title_vi||row.original_name,titleEn:row.title_en||row.title_vi||row.original_name}}
  else viewerItem={type:assetKindOf(row),url,file:url,files:[url],original_name:row.original_name,titleVi:row.title_vi||row.original_name,titleEn:row.title_en||row.title_vi||row.original_name,mime_type:row.mime_type,file_size:row.file_size};
  viewerHtml(viewerItem);
  if(rows.length>1)viewerHead.insertAdjacentHTML('beforeend',`<div class="viewer-actions" style="width:100%">${rows.map((asset,index)=>`<button type="button" class="viewer-btn" data-cert-view="${esc(id)}|${index}"${index===idx?' style="border-color:var(--cyan)"':''}>${index+1}. ${esc(asset.original_name||mediaTypeLabel(asset))}</button>`).join('')}</div>`);
  if(!viewerDialog.open)openModalDialog(viewerDialog);
}

function viewerExtraBody(it){
  const f=Array.isArray(it.files)&&it.files.length?it.files[0]:(it.file||it.url),url=(f&&f.url)||f||'';
  const name=it.original_name||proofTitle(it)||'file',dl=proofDownloadUrl(url,String(name).replace(/[\\/:*?"<>|]+/g,'_'));
  const meta=`${esc(mediaTypeLabel(it))}${it.file_size?' · '+esc(formatMediaBytes(it.file_size)):''}`;
  if(it.type==='video')return `<video src="${esc(url)}" controls playsinline preload="metadata"></video>`;
  if(it.type==='audio')return `<div class="viewer-file-card"><strong>${esc(name)}</strong><span>${meta}</span><audio src="${esc(url)}" controls preload="metadata"></audio></div>`;
  if(it.type==='file')return `<div class="viewer-file-card"><strong>${esc(name)}</strong><span>${meta}</span><a class="viewer-btn" href="${esc(dl)}" download="${esc(name)}" data-proof-download="${esc(url)}" data-proof-download-name="${esc(name)}">${esc(t('modal.download'))} ↓</a></div>`;
  return null;
}

function renderProjects(){
  const visible=PROJECTS.filter(p=>p.published!==false);
  $('#projectList').innerHTML=visible.map(p=>{const c=contentFor(p);return `<article class="project-card reveal visible" style="--card-a:${esc(safeCssColor(p.tone[0]))};--card-b:${esc(safeCssColor(p.tone[1],'#5b7cfa'))}"><div class="project-copy"><span class="project-index">CASE ${esc(p.index)}</span><div class="project-tags">${c.category.map(tag).join('')}</div><h3 class="project-title">${esc(c.title)}</h3><p class="project-hook">${esc(c.hook)}</p>${statsH(c.stats)}<div class="project-foot"><a class="case-btn" href="#/${p.id}">${esc(t('project.open'))} <span>↗</span></a><span class="muted" style="font-size:10px">Marketing × Technology</span></div></div><div class="project-visual">${visualH(p)}</div></div></article>`}).join('');
}

function renderInsights(){
  const host=$('#insightsList');if(!host)return;
  const visible=INSIGHTS.filter(item=>item.published!==false);
  if(insightDbState==='empty'&&!visible.length){host.innerHTML=`<div class="insights-empty" role="status">${esc(t('insights.empty'))}</div>`;return}
  host.innerHTML=visible.map((item,index)=>{const c=contentFor(item),minutes=Math.max(1,Number(item.readMinutes)||1);return `<article class="project-card reveal visible" style="--card-a:${esc(safeCssColor(item.tone[0]))};--card-b:${esc(safeCssColor(item.tone[1],'#a78bfa'))}"><div class="project-copy"><span class="project-index">INSIGHT ${String(index+1).padStart(2,'0')}</span><div class="project-tags">${(c.category||[]).map(tag).join('')}</div><h3 class="project-title">${esc(c.title)}</h3><p class="project-hook">${esc(c.hook)}</p><div class="project-foot"><a class="case-btn" href="#/insight/${esc(item.id)}">${esc(t('insights.read'))} <span>↗</span></a><span class="muted" style="font-size:10px">${esc(t('insights.readMinutes').replace('{n}',String(minutes)))}</span></div></div><div class="project-visual">${visualH(item)}</div></article>`}).join('');
}

function renderSkills(){
  $('#skillsGrid').innerHTML=SKILLS.map(s=>{const c=s.content[currentLang];return `<article class="skill-card reveal visible" style="--skill-accent:${s.accent}"><div class="skill-num">${s.num}</div><div class="skill-orbit"></div><h3 class="skill-title">${esc(c.title)}</h3><p class="skill-copy">${esc(c.copy)}</p><div class="skill-items">${c.items.map(x=>`<span class="skill-item"><strong>•</strong> ${esc(x)}</span>`).join('')}</div></article>`}).join('');
}

function setLang(next){HQVShared.setLang(next)}

function applyStatic(){
  document.documentElement.lang=currentLang;
  $('.nav').setAttribute('aria-label',currentLang==='en'?'Main navigation':'Điều hướng chính');
  $('.lang-switch').setAttribute('aria-label',currentLang==='en'?'Language switcher':'Chuyển ngôn ngữ');
  $('.avatar-shell').setAttribute('aria-label',currentLang==='en'?'Hoàng Quốc Việt avatar frame':'Khung avatar Hoàng Quốc Việt');
  caseDialog.setAttribute('aria-label',activeProject?.kind==='insight'?(currentLang==='en'?'Insight article':'Bài viết Insight'):activeCertificateId?(currentLang==='en'?'Certificate details':'Chi tiết chứng chỉ'):(currentLang==='en'?'Project case study':'Chi tiết case study'));
  viewerDialog.setAttribute('aria-label',currentLang==='en'?'Proof viewer':'Xem bằng chứng');
  document.title=currentLang==='en'?'Hoàng Quốc Việt | Marketing Operations · MarTech · AI-enabled Marketing':'Hoàng Quốc Việt | Marketing Operations · MarTech · AI-enabled Marketing';
  $$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(I18N[currentLang][key])el.textContent=I18N[currentLang][key]});
  $$('[data-lang]').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===currentLang));
  $('#statusText').textContent=t('status');
  renderAvatar();
  $('textarea[name="message"]').placeholder=t('form.messagePlaceholder');$('input[name="name"]').placeholder=t('form.namePlaceholder');$('#contactSubject').value=t('form.subject');
  renderProjects();renderInsights();renderGlobalContent(currentLang);
  const state=parseHash();
  if(state?.project){activeProject=state.project;caseContent.innerHTML=caseHtml(state.project);if(state.index!=null){const proof=state.project.proof[state.index];if(proof)viewerHtml(proof)}}
}

const caseDialog=$('#caseDialog');

const viewerDialog=$('#viewerDialog');

const caseContent=$('#caseContent');

const viewerHead=$('#viewerHead');

const viewerBody=$('#viewerBody');

let activeProject=null;

let activeCertificateId=null;

let activeInsightCardHref=null;

async function downloadProofUrl(url,name){
  const safe=safeLinkHref(proofDownloadUrl(url,name));
  if(!safe)throw new Error('unsafe_url');
  const response=await fetch(safe,{method:'GET',credentials:'omit'});
  if(!response.ok)throw new Error(`download_http_${response.status}`);
  const blob=await response.blob();
  const objectUrl=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=objectUrl;a.download=name||'proof';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);
}

function viewerHtml(it){viewerBody.querySelectorAll('video,audio').forEach(m=>{try{m.pause()}catch(_){}});const __r=viewerHtml0(it);const __x=viewerExtraBody(it);if(__x!==null)viewerBody.innerHTML=__x;return __r}

function viewerHtml0(it){
  const files=Array.isArray(it.files)&&it.files.length?it.files:[it.file||it.url];const first=files[0];
  const firstUrl=first?.url||first||'';
  const downloadName=(it.original_name||proofTitle(it)||'proof').replace(/[\\/:*?"<>|]+/g,'_');
  const downloadUrl=proofDownloadUrl(firstUrl,downloadName);
  viewerHead.innerHTML=`<strong>${esc(proofTitle(it)||t('modal.evidence'))}</strong><div class="viewer-actions"><a class="viewer-btn" href="${esc(downloadUrl)}" download="${esc(downloadName)}" data-proof-download="${esc(firstUrl)}" data-proof-download-name="${esc(downloadName)}">${esc(t('modal.download'))} ↓</a><a class="viewer-btn proof-download-fallback" href="${esc(downloadUrl)}" target="_blank" rel="noopener">${esc(currentLang==='en'?'Open file':'Mở file')} ↗</a><button class="viewer-btn" type="button" data-close="viewer">${esc(t('modal.close'))}</button></div>`;
  viewerBody.innerHTML=it.type==='pdf'?`<iframe src="${esc(firstUrl)}#view=FitH" title="${esc(proofTitle(it)||'PDF')}"></iframe>`:it.type==='json'?`<iframe src="${esc(firstUrl)}" title="${esc(proofTitle(it)||'JSON')}"></iframe>`:`<div class="gallery">${files.map(src=>`<img src="${esc(src.url||src)}" alt="${esc(proofTitle(it)||'Proof')}" loading="lazy">`).join('')}</div>`;
}

function parseHash(){const route=location.hash.slice(1);const certificate=route.match(/^\/?cert\/([a-z0-9-]+)$/i);if(certificate)return {certificateId:certificate[1]};const insightMatch=route.match(/^\/?insight\/([a-z0-9-]+)(?:\/(\d+))?$/i);if(insightMatch){const insight=INSIGHTS.find(item=>item.id===insightMatch[1]&&item.published!==false);return insight?{project:insight,index:insightMatch[2]==null?null:Number(insightMatch[2]),insight:true}:null}const match=route.match(/^\/([a-z0-9-]+)(?:\/(\d+))?$/i);if(!match)return null;const project=PROJECTS.find(item=>item.id===match[1]);return project&&project.published!==false?{project,index:match[2]==null?null:Number(match[2])}:null}

function renderCertificateDetail(item){caseContent.innerHTML=certDetailHtml(item,currentLang);caseContent.querySelector('.case-hero-meta')?.insertAdjacentHTML('afterend',`<div class="cert-detail-lang" role="group" aria-label="${currentLang==='en'?'Language':'Ngôn ngữ'}"><button type="button" data-cert-lang="vi" aria-pressed="${currentLang==='vi'}" class="${currentLang==='vi'?'active':''}">VI</button><button type="button" data-cert-lang="en" aria-pressed="${currentLang==='en'}" class="${currentLang==='en'?'active':''}">EN</button></div>`)}

function refreshActiveCertificate(){if(!activeCertificateId||!caseDialog.open)return;const item=certificateItemById(activeCertificateId);if(!item){activeCertificateId=null;closeNative(viewerDialog);closeNative(caseDialog);return}renderCertificateDetail(item)}

function closeNative(d){try{closeModalDialog(d)}catch(_){}}

async function route(){if(location.hash.startsWith('#cert/'))history.replaceState(history.state,'',`#/${location.hash.slice(1)}`);if(location.hash.startsWith('#insight/'))history.replaceState(history.state,'',`#/${location.hash.slice(1)}`);const state=parseHash();if(state?.certificateId){const item=certificateItemById(state.certificateId);activeProject=null;closeNative(viewerDialog);if(!item){activeCertificateId=null;closeNative(caseDialog);return}activeCertificateId=item.id;caseDialog.setAttribute('aria-label',currentLang==='en'?'Certificate details':'Chi tiết chứng chỉ');renderCertificateDetail(item);if(!caseDialog.open)openModalDialog(caseDialog);return}activeCertificateId=null;if(!state){activeProject=null;closeNative(viewerDialog);closeNative(caseDialog);return}if(activeProject!==state.project){activeProject=state.project;caseDialog.setAttribute('aria-label',state.project.kind==='insight'?(currentLang==='en'?'Insight article':'Bài viết Insight'):(currentLang==='en'?'Project case study':'Chi tiết case study'));caseContent.innerHTML=caseHtml(state.project);openModalDialog(caseDialog);caseContent.scrollTop=0}else if(!caseDialog.open)openModalDialog(caseDialog);const proof=state.index!=null?state.project.proof[state.index]:null;if(proof&&validProof(proof)&&['pdf','image','gallery','video','audio','file','json'].includes(proof.type)){viewerHtml(proof);if(!viewerDialog.open)openModalDialog(viewerDialog)}else closeNative(viewerDialog);loadProofsForProject(state.project).then(()=>{if(activeProject===state.project&&parseHash()?.index==null)caseContent.innerHTML=caseHtml(state.project)}).catch(()=>{})}

function navigateHash(h){history.pushState({hqv:true},'',h);route()}

function restoreInsightCardFocus(){
  const href=activeInsightCardHref;
  activeInsightCardHref=null;
  if(!href)return;
  requestAnimationFrame(()=>{
    const opener=[...document.querySelectorAll('#insightsList a.case-btn')].find(link=>link.getAttribute('href')===href);
    opener?.focus({preventScroll:true});
  });
}

function exitModal(){if(viewerDialog.open&&parseHash()?.index==null){closeNative(viewerDialog);return}if(viewerDialog.open){history.state?.hqv?history.back():(history.replaceState(null,'',activeProject?(activeProject.kind==='insight'?`#/insight/${activeProject.id}`:`#/${activeProject.id}`):'#projects'),route());return}if(caseDialog.open){history.state?.hqv?history.back():(history.replaceState(null,'',activeCertificateId?'#experience':activeProject?.kind==='insight'?'#insights':'#projects'),route())}}

function renderAvatar(){
  const image=$('#avatarImage'),initials=$('#avatarInitials');if(!image||!initials)return;
  if(profileAvatar){image.src=profileAvatar.url;image.hidden=false;initials.hidden=true;image.alt=currentLang==='en'?'Hoàng Quốc Việt profile avatar':'Ảnh đại diện Hoàng Quốc Việt'}else{image.removeAttribute('src');image.hidden=true;initials.hidden=false}
}

function observeMotion(){if(!('IntersectionObserver' in window))return;const io=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('motion-off',!e.isIntersecting)),{threshold:.03});$$('.section,.hero').forEach(el=>io.observe(el));$$('.reveal').forEach(el=>el.classList.add('visible'))}

$$('[data-lang]').forEach(button => button.addEventListener('click', () => setLang(button.dataset.lang)));
window.addEventListener('popstate', route);
document.addEventListener('click', event => {
  const download = event.target.closest('[data-proof-download]');
  if (download) {
    event.preventDefault();
    const url = download.getAttribute('data-proof-download') || '';
    const name = download.getAttribute('data-proof-download-name') || 'proof';
    download.disabled = true;
    downloadProofUrl(url, name).catch(() => {
      const safe = safeLinkHref(url);
      if (safe) window.open(safe, '_blank', 'noopener');
    }).finally(() => { download.disabled = false; });
    return;
  }
  const openAsset = event.target.closest('[data-open-asset]');
  if (openAsset) {
    const asset = assetRegistry.get(openAsset.dataset.openAsset);
    if (asset) window.open(publicUrl(asset.storage_path), '_blank', 'noopener');
    return;
  }
  const hashLink = event.target.closest('a[href^="#/"]');
  if (hashLink) { const href=hashLink.getAttribute('href');event.preventDefault();activeInsightCardHref=href.startsWith('#/insight/')?href:null;navigateHash(href);return; }
  const close = event.target.closest('[data-close]');
  if (close) { exitModal(); return; }
  if (event.target === caseDialog) {
    const rect = caseContent.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) exitModal();
  }
  if (event.target === viewerDialog) exitModal();
});
caseDialog.addEventListener('close',restoreInsightCardFocus);
[caseDialog, viewerDialog].forEach(dialog => dialog.addEventListener('cancel', event => { event.preventDefault(); exitModal(); }));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || (!caseDialog.open && !viewerDialog.open)) return;
  if (document.getElementById('hqvLightbox')?.open) return;
  event.preventDefault();
  exitModal();
});
document.addEventListener('click', event => {
  const language=event.target.closest('[data-cert-lang]');
  if(language){setLang(language.dataset.certLang);return}
  const open = event.target.closest('[data-cert-open]');
  if (open) { event.preventDefault();activeInsightCardHref=null;navigateHash(`#/cert/${encodeURIComponent(open.dataset.certOpen)}`);return; }
  const view = event.target.closest('[data-cert-view]');
  if (view) { const [id, index] = view.dataset.certView.split('|'); openCertViewer(id, Number(index) || 0); }
});
$('#closeGlobalPreview').addEventListener('click', () => {
  if (isGlobalPreview||isDraftPreview) window.close();
  else { $('#globalPreviewBanner').hidden = true; globalPreviewContent = null; isGlobalPreview = false; renderGlobalContent(currentLang); }
});
document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  image.classList.add('media-broken');
  image.removeAttribute('src');
  if (!image.alt) image.alt = currentLang === 'en' ? 'Image unavailable' : 'Hình ảnh không khả dụng';
}, true);
$('#contactForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget, button = form.querySelector('.submit'), state = $('#formState');
  if (!CONFIG.email) {
    state.className = 'form-state err';
    state.textContent = currentLang === 'en' ? 'Form is waiting for configuration. Add the receiving email in CONFIG.email.' : 'Form đang ở chế độ chờ cấu hình. Hãy điền email nhận tin trong CONFIG.email.';
    state.style.display = 'block';
    return;
  }
  button.disabled = true;
  state.className = 'form-state';
  state.textContent = currentLang === 'en' ? 'Sending…' : 'Đang gửi…';
  state.style.display = 'block';
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.email)}`, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
    if (!response.ok) throw new Error('submit_failed');
    state.className = 'form-state ok';
    state.textContent = currentLang === 'en' ? '✓ Sent. Thank you — I will reply soon.' : '✓ Đã gửi. Cảm ơn bạn — tôi sẽ phản hồi sớm.';
    form.reset();
  } catch (_) {
    state.className = 'form-state err';
    state.textContent = currentLang === 'en' ? '✗ Could not send. Please try again or use a direct contact channel.' : '✗ Chưa gửi được. Vui lòng thử lại hoặc dùng kênh liên hệ trực tiếp.';
  }
  button.disabled = false;
});

observeMotion();
document.addEventListener('visibilitychange', () => document.body.classList.toggle('page-hidden', document.hidden));
HQVShared.on('assets', () => {
  renderAvatar(); renderProjects(); renderInsights(); renderGlobalContent(currentLang);
  if (activeProject) {
    const state = parseHash();
    if (state?.project === activeProject) {
      caseContent.innerHTML = caseHtml(activeProject);
      if (state.index != null) { const proof = activeProject.proof[state.index]; if (proof) viewerHtml(proof); }
    }
  }
  refreshActiveCertificate();
});
HQVShared.on('global', () => {renderGlobalContent(currentLang);refreshActiveCertificate();const state=parseHash();if(activeProject&&caseDialog.open&&state?.project===activeProject)caseContent.innerHTML=caseHtml(activeProject)});
HQVShared.on('insights',()=>{renderInsights();const state=parseHash();if(activeProject?.kind==='insight'&&state?.project===activeProject){caseContent.innerHTML=caseHtml(activeProject);if(state.index!=null){const proof=activeProject.proof[state.index];if(proof)viewerHtml(proof)}}});
HQVShared.on('lang',()=>{applyStatic();renderProjects();renderInsights();renderGlobalContent(currentLang);renderAvatar();refreshActiveCertificate()});
window.addEventListener('message', event => {
  if (event.origin !== location.origin || event.source !== window.opener) return;
  if(event.data?.type==='hqv-draft-preview'){
    draftPreviewRuntime=deepClone(event.data.runtime||{});isDraftPreview=true;caseContent.innerHTML=caseHtml(draftPreviewRuntime);if(!caseDialog.open)openModalDialog(caseDialog);$('#globalPreviewBanner').hidden=false;return;
  }
  if (event.data?.type !== 'hqv-global-preview') return;
  globalPreviewContent = deepClone(event.data.content || {});
  isGlobalPreview = true;
  renderGlobalContent(currentLang);
  $('#globalPreviewBanner').hidden = false;
});

HQVShared.on('projects',()=>{renderProjects();refreshActiveCertificate();if(!activeProject||activeProject.kind==='insight')return;const fresh=PROJECTS.find(project=>project.id===activeProject.id);if(!fresh){activeProject=null;activeCertificateId=null;if(viewerDialog.open)closeNative(viewerDialog);if(caseDialog.open)closeNative(caseDialog);return}activeProject=fresh;if(caseDialog.open)caseContent.innerHTML=caseHtml(fresh)});
applyStatic();
if (isGlobalPreview||isDraftPreview) { try { window.opener?.postMessage({ type: isDraftPreview?'hqv-draft-preview-ready':'hqv-global-preview-ready' }, location.origin); } catch (_) {} }
else HQVShared.loadGlobalPublished().catch(() => {});
loadProjects().then(loadAllProofs).catch(() => {});
loadInsights().catch(() => {});
route();
