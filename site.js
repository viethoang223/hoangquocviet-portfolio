let globalPreviewContent=null;

let isGlobalPreview=location.hash==='#global-preview';
let draftPreviewRuntime=null;
let isDraftPreview=location.hash==='#draft-preview';

function applyGlobalContentToDOM(content,lang=currentLang){
  const requiredLabels={'home.status':'status','home.ctaProjects':'hero.projects','home.ctaContact':'hero.contact','home.nav.projects':'nav.projects','home.nav.skills':'nav.skills','home.nav.experience':'nav.experience','home.nav.contact':'nav.contact','home.nav.cta':'nav.cta'};const get=p=>{const value=getLocalizedContent(getPath(content,p),lang);return String(value??'').trim()?value:HQVShared.I18N[lang]?.[requiredLabels[p]]||''};const home=content.home,approach=content.approach,projects=content.projects,skills=content.skills,experience=content.experience,contact=content.contact,footer=content.footer;
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

function renderGlobalContent(lang=currentLang){const content=globalPreviewContent||getGlobalContent(lang);applyGlobalContentToDOM(content,lang);renderExperienceEntries(content.experience,lang)}

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

function proofOpenUrl(it,url,name){
  if(proofPreviewKind(it)!=='office')return url;
  const safe=safeLinkHref(url);
  return safe?`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(safe)}`:url;
}

function isTextProof(it){const mime=String(it?.mime_type||'').toLowerCase(),name=String(it?.original_name||it?.file_name||'').toLowerCase(),extension=name.match(/\.([a-z0-9]+)$/)?.[1]||'';return mime.startsWith('text/')||['application/json','application/xml','application/rtf'].includes(mime)||['txt','csv','tsv','json','xml','md','log','rtf'].includes(extension)}

function loadProofTextPreview(){
  const host=viewerBody.querySelector('[data-proof-text-preview]');if(!host)return;
  const url=safeLinkHref(host.dataset.proofTextPreview);if(!url){host.textContent=currentLang==='en'?'Text preview is unavailable.':'Không thể xem trước văn bản.';return}
  const limit=2*1024*1024;if(Number(host.dataset.proofTextSize)>limit){host.textContent=currentLang==='en'?'This file is too large to preview. Download it to view the full file.':'Tệp quá lớn để xem trước. Hãy tải tệp để xem đầy đủ.';return}
  fetch(url,{credentials:'omit'}).then(response=>{if(!response.ok)throw new Error(`text_preview_http_${response.status}`);return response.text()}).then(text=>{if(!host.isConnected)return;host.textContent=text.length>limit?`${text.slice(0,limit)}\n\n${currentLang==='en'?'[Preview truncated]':'[Đã rút gọn bản xem trước]'}`:text}).catch(()=>{if(host.isConnected)host.textContent=currentLang==='en'?'Text preview is unavailable. Download the file to view it.':'Không thể xem trước văn bản. Hãy tải tệp để xem.'});
}

function viewerExtraBody(it){
  const f=Array.isArray(it.files)&&it.files.length?it.files[0]:(it.file||it.url),url=(f&&f.url)||f||'';
  const name=it.original_name||proofTitle(it)||'file',dl=proofDownloadUrl(url,String(name).replace(/[\\/:*?"<>|]+/g,'_'));
  const meta=`${esc(mediaTypeLabel(it))}${it.file_size?' · '+esc(formatMediaBytes(it.file_size)):''}`;
  if(it.type==='video')return `<video src="${esc(url)}" controls playsinline preload="metadata"></video>`;
  if(it.type==='audio')return `<div class="viewer-file-card"><strong>${esc(name)}</strong><span>${meta}</span><audio src="${esc(url)}" controls preload="metadata"></audio></div>`;
  if(it.type==='file'){
    const kind=proofPreviewKind(it),previewUrl=proofOpenUrl(it,url,name);
    if(kind==='pdf')return `<iframe src="${esc(url)}#view=FitH" title="${esc(name)}"></iframe>`;
    if(kind==='office')return `<iframe src="${esc(previewUrl)}" title="${esc(name)}" loading="lazy" referrerpolicy="no-referrer"></iframe>`;
    if(isTextProof(it))return `<pre class="viewer-text-preview" data-proof-text-preview="${esc(url)}" data-proof-text-size="${Number(it.file_size)||0}" aria-label="${esc(name)}">${esc(currentLang==='en'?'Loading preview…':'Đang tải bản xem trước…')}</pre>`;
    return `<div class="viewer-file-card"><strong>${esc(name)}</strong><span>${meta}</span><a class="viewer-btn" href="${esc(dl)}" download="${esc(name)}" data-proof-download="${esc(url)}" data-proof-download-name="${esc(name)}">${esc(t('modal.download'))} ↓</a></div>`;
  }
  return null;
}

function renderProjects(){
  const visible=PROJECTS.filter(p=>p.published!==false);
  $('#projectList').innerHTML=visible.map(p=>{const c=contentFor(p),videoCover=p.kind==='insight'?null:projectVideoCover(p),imageCover=projectCovers.get(p.id),copyCover=imageCover?.url||videoCover?.poster;return `<article class="project-card reveal visible${videoCover?' project-card--video-cover':''}" style="--card-a:${esc(safeCssColor(p.tone[0]))};--card-b:${esc(safeCssColor(p.tone[1],'#5b7cfa'))}"><div class="project-copy"><span class="project-index">CASE ${esc(p.index)}</span><div class="project-tags">${c.category.map(tag).join('')}</div><h3 class="project-title">${esc(c.title)}</h3><p class="project-hook">${esc(c.hook)}</p>${videoCover&&copyCover?`<img class="project-copy-cover" src="${esc(copyCover)}" alt="${esc(c.title)} cover" loading="lazy">`:''}${statsH(c.stats)}<div class="project-foot"><a class="case-btn" href="#/${p.id}">${esc(t('project.open'))} <span>↗</span></a><span class="muted" style="font-size:10px">Marketing × Technology</span></div></div><div class="project-visual">${visualH(p)}</div></div></article>`}).join('');
  observeProjectCoverVideos();
}

let projectCoverVideoObservers=[];
function observeProjectCoverVideos(){
  projectCoverVideoObservers.forEach(observer=>observer.disconnect());
  projectCoverVideoObservers=[];
  const videos=[...document.querySelectorAll('[data-visibility-video]')];
  if(!videos.length)return;
  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
  const updateSoundToggle=video=>{
    const button=video.parentElement?.querySelector('[data-video-sound-toggle]');
    if(!button)return;
    const label=video.muted?button.dataset.enableLabel:button.dataset.muteLabel;
    button.textContent=label;
    button.setAttribute('aria-label',label);
    button.setAttribute('aria-pressed',String(!video.muted));
  };
  const activate=video=>{
    if(video.hasAttribute('data-project-cover-video')&&!isProjectCoverPlaybackAllowed()){stopProjectCoverVideo(video);return}
    if(video.parentElement?.dataset.coverRatio==='auto'&&!video.dataset.ratioDetection){
      video.dataset.ratioDetection='pending';
      video.addEventListener('loadedmetadata',()=>{
        const aspect=video.videoWidth/Math.max(1,video.videoHeight);
        const ratio=aspect<0.85?'portrait':aspect>1.2?'landscape':'square';
        video.parentElement.classList.remove('project-video-stage--portrait','project-video-stage--square');
        video.parentElement.classList.add(`project-video-stage--${ratio}`);
      },{once:true});
    }
    if(!video.src){video.src=video.dataset.src;video.load()}
    if(reduceMotion)return;
    video.muted=false;
    video.play().then(()=>{
      if(video.hasAttribute('data-project-cover-video')&&(!isProjectCoverPlaybackAllowed()||video.dataset.visibilityState!=='visible')){stopProjectCoverVideo(video);return}
      if(video.dataset.visibilityState==='visible')updateSoundToggle(video);
      else video.pause();
    }).catch(()=>{
      if(video.hasAttribute('data-project-cover-video')&&(!isProjectCoverPlaybackAllowed()||video.dataset.visibilityState!=='visible')){stopProjectCoverVideo(video);return}
      if(video.dataset.visibilityState!=='visible')return;
      video.muted=true;
      updateSoundToggle(video);
      video.play().catch(()=>{});
    });
  };
  if(!('IntersectionObserver'in window))return;
  const groups=new Map();
  videos.forEach(video=>{
    const root=video.closest('#caseContent')||null;
    if(!groups.has(root))groups.set(root,[]);
    groups.get(root).push(video);
  });
  groups.forEach((group,root)=>{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting&&entry.intersectionRatio>=0.25){entry.target.dataset.visibilityState='visible';activate(entry.target)}
      else{entry.target.dataset.visibilityState='hidden';entry.target.pause()}
    }),{root,threshold:0.25});
    group.forEach(video=>observer.observe(video));
    projectCoverVideoObservers.push(observer);
  });
}

function stopProjectCoverVideo(video){video.dataset.visibilityState='covered';video.muted=true;video.pause();if(video.hasAttribute('src')){video.removeAttribute('src');video.load();delete video.dataset.ratioDetection}const button=video.parentElement?.querySelector('[data-video-sound-toggle]');if(button){const label=button.dataset.enableLabel;button.textContent=label;button.setAttribute('aria-label',label);button.setAttribute('aria-pressed','false')}}

function pauseProjectCoverVideos(){document.querySelectorAll('[data-project-cover-video]').forEach(stopProjectCoverVideo)}

function isProjectCoverPlaybackAllowed(){const route=parseHash();return !caseDialog.open&&!viewerDialog.open&&!route?.project&&!route?.certificateId&&!isGlobalPreview&&!isDraftPreview}

document.addEventListener('click',event=>{
  const button=event.target.closest('[data-video-sound-toggle]');
  if(!button)return;
  const video=button.parentElement?.querySelector('video[data-visibility-video]');
  if(!video)return;
  if(!isProjectCoverPlaybackAllowed()||video.dataset.visibilityState!=='visible'){stopProjectCoverVideo(video);return}
  video.muted=!video.muted;
  const playback=video.play();
  if(playback)playback.then(()=>{
    const label=video.muted?button.dataset.enableLabel:button.dataset.muteLabel;
    button.textContent=label;button.setAttribute('aria-label',label);button.setAttribute('aria-pressed',String(!video.muted));
  }).catch(()=>{
    video.muted=true;video.pause();
    const label=button.dataset.enableLabel;button.textContent=label;button.setAttribute('aria-label',label);button.setAttribute('aria-pressed','false');
  });
});

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

function renderExperienceEntries(experience,lang){
  const panel=document.querySelector('.exp-panel');if(!panel)return;
  const managed=experience.entriesManaged?.[lang]===true;
  const entries=managed?(Array.isArray(experience.entries)?experience.entries:[]):[{id:'legacy-experience',title:experience.title,role:experience.role,description:experience.description,tags:experience.tags}];
  panel.hidden=!entries.length;
  panel.parentElement?.classList.toggle('is-no-experience',!entries.length);
  panel.innerHTML=entries.map(entry=>`<article class="exp-entry"><div class="exp-code">${esc(String(getLocalizedContent(entry.title,lang)||''))}</div><h3 class="exp-title">${esc(String(getLocalizedContent(entry.role,lang)||''))}</h3><p>${esc(String(getLocalizedContent(entry.description,lang)||''))}</p><div class="exp-tags">${(entry.tags?.[lang]||[]).map(tag=>`<span class="exp-tag">${esc(tag)}</span>`).join('')}</div></article>`).join('');
}

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

caseDialog.addEventListener('close',()=>observeProjectCoverVideos());

const viewerDialog=$('#viewerDialog');

const projectCoverDialogObserver=new MutationObserver(records=>{if(records.some(record=>record.target.open))pauseProjectCoverVideos()});
[caseDialog,viewerDialog].forEach(dialog=>projectCoverDialogObserver.observe(dialog,{attributes:true,attributeFilter:['open']}));

const caseContent=$('#caseContent');

const caseVideoMutationObserver=new MutationObserver(()=>observeProjectCoverVideos());
caseVideoMutationObserver.observe(caseContent,{childList:true,subtree:true});

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

function viewerHtml(it){viewerBody.querySelectorAll('video,audio').forEach(m=>{try{m.pause()}catch(_){}});const __r=viewerHtml0(it);const __x=viewerExtraBody(it);if(__x!==null)viewerBody.innerHTML=__x;loadProofTextPreview();return __r}

function viewerHtml0(it){
  const files=Array.isArray(it.files)&&it.files.length?it.files:[it.file||it.url];const first=files[0];
  const firstUrl=first?.url||first||'';
  const downloadName=(it.original_name||proofTitle(it)||'proof').replace(/[\\/:*?"<>|]+/g,'_');
  const downloadUrl=proofDownloadUrl(firstUrl,downloadName),openUrl=proofOpenUrl(it,firstUrl,downloadName);
  viewerHead.innerHTML=`<strong>${esc(proofTitle(it)||t('modal.evidence'))}</strong><div class="viewer-actions"><a class="viewer-btn" href="${esc(downloadUrl)}" download="${esc(downloadName)}" data-proof-download="${esc(firstUrl)}" data-proof-download-name="${esc(downloadName)}">${esc(t('modal.download'))} ↓</a><a class="viewer-btn proof-download-fallback" href="${esc(openUrl)}" target="_blank" rel="noopener">${esc(currentLang==='en'?'Open file':'Mở file')} ↗</a><button class="viewer-btn" type="button" data-close="viewer">${esc(t('modal.close'))}</button></div>`;
  viewerBody.innerHTML=it.type==='pdf'?`<iframe src="${esc(firstUrl)}#view=FitH" title="${esc(proofTitle(it)||'PDF')}"></iframe>`:it.type==='json'?`<pre class="viewer-text-preview" data-proof-text-preview="${esc(firstUrl)}" data-proof-text-size="${Number(it.file_size)||0}" aria-label="${esc(proofTitle(it)||'JSON')}">${esc(currentLang==='en'?'Loading preview…':'Đang tải bản xem trước…')}</pre>`:`<div class="gallery">${files.map(src=>`<img src="${esc(src.url||src)}" alt="${esc(proofTitle(it)||'Proof')}" loading="lazy">`).join('')}</div>`;
}

function parseHash(){const route=location.hash.slice(1);const certificate=route.match(/^\/?cert\/([a-z0-9-]+)$/i);if(certificate)return {certificateId:certificate[1]};const insightMatch=route.match(/^\/?insight\/([a-z0-9-]+)(?:\/(\d+))?$/i);if(insightMatch){const insight=INSIGHTS.find(item=>item.id===insightMatch[1]&&item.published!==false);return insight?{project:insight,index:insightMatch[2]==null?null:Number(insightMatch[2]),insight:true}:null}const match=route.match(/^\/([a-z0-9-]+)(?:\/(\d+))?$/i);if(!match)return null;const project=PROJECTS.find(item=>item.id===match[1]);return project&&project.published!==false?{project,index:match[2]==null?null:Number(match[2])}:null}

function renderCertificateDetail(item){caseContent.innerHTML=certDetailHtml(item,currentLang);caseContent.querySelector('.case-hero-meta')?.insertAdjacentHTML('afterend',`<div class="cert-detail-lang" role="group" aria-label="${currentLang==='en'?'Language':'Ngôn ngữ'}"><button type="button" data-cert-lang="vi" aria-pressed="${currentLang==='vi'}" class="${currentLang==='vi'?'active':''}">VI</button><button type="button" data-cert-lang="en" aria-pressed="${currentLang==='en'}" class="${currentLang==='en'?'active':''}">EN</button></div>`)}

function refreshActiveCertificate(){if(!activeCertificateId||!caseDialog.open)return;const item=certificateItemById(activeCertificateId);if(!item){activeCertificateId=null;closeNative(viewerDialog);closeNative(caseDialog);return}renderCertificateDetail(item)}

function closeNative(d){try{closeModalDialog(d)}catch(_){}}

async function route(){if(location.hash.startsWith('#cert/'))history.replaceState(history.state,'',`#/${location.hash.slice(1)}`);if(location.hash.startsWith('#insight/'))history.replaceState(history.state,'',`#/${location.hash.slice(1)}`);const state=parseHash();if(state?.certificateId){const item=certificateItemById(state.certificateId);activeProject=null;closeNative(viewerDialog);if(!item){activeCertificateId=null;closeNative(caseDialog);return}activeCertificateId=item.id;caseDialog.setAttribute('aria-label',currentLang==='en'?'Certificate details':'Chi tiết chứng chỉ');renderCertificateDetail(item);if(!caseDialog.open){pauseProjectCoverVideos();openModalDialog(caseDialog)}return}activeCertificateId=null;if(!state){activeProject=null;closeNative(viewerDialog);closeNative(caseDialog);return}if(activeProject!==state.project){activeProject=state.project;caseDialog.setAttribute('aria-label',state.project.kind==='insight'?(currentLang==='en'?'Insight article':'Bài viết Insight'):(currentLang==='en'?'Project case study':'Chi tiết case study'));caseContent.innerHTML=caseHtml(state.project);pauseProjectCoverVideos();openModalDialog(caseDialog);caseContent.scrollTop=0}else if(!caseDialog.open){pauseProjectCoverVideos();openModalDialog(caseDialog)}const proof=state.index!=null?state.project.proof[state.index]:null;if(proof&&validProof(proof)&&['pdf','image','gallery','video','audio','file','json'].includes(proof.type)){viewerHtml(proof);if(!viewerDialog.open)openModalDialog(viewerDialog)}else closeNative(viewerDialog);loadProofsForProject(state.project).then(()=>{if(activeProject===state.project&&parseHash()?.index==null)caseContent.innerHTML=caseHtml(state.project)}).catch(()=>{})}

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
function showContactCelebration(language) {
  const dialog = $('#contactSuccessDialog');
  const english = language === 'en';
  $('#contactSuccessTitle').textContent = english ? 'Your message is on its way!' : 'Tin nhắn đã cất cánh!';
  $('#contactSuccessCopy').textContent = english ? 'Thank you for reaching out. I will get back to you as soon as I can.' : 'Cảm ơn bạn đã liên hệ. Tôi sẽ phản hồi sớm nhất có thể.';
  dialog.querySelector('[data-contact-success-close]').textContent = english ? 'Close' : 'Đóng';
  if (!dialog.open) dialog.showModal();

  const canvas = dialog.querySelector('.contact-fireworks'), context = canvas.getContext('2d');
  if (!context || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let frame = 0, rockets = [], sparks = [], lastLaunch = 0, launched = 0;
  const resize = () => {
    const bounds = dialog.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(bounds.width * ratio); canvas.height = Math.round(bounds.height * ratio);
    canvas.style.width = `${bounds.width}px`; canvas.style.height = `${bounds.height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };
  const burst = (x, y) => {
    const hue = [42, 12, 184, 320, 156][Math.floor(Math.random() * 5)];
    for (let index = 0; index < 96; index++) {
      const angle = Math.random() * Math.PI * 2, speed = 1.5 + Math.random() * 5.3;
      sparks.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 82 + Math.random() * 58, hue, size: 1.6 + Math.random() * 2.6 });
    }
  };
  const tick = time => {
    if (!dialog.open) return;
    const width = canvas.clientWidth, height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);
    if (time - lastLaunch > 310 && launched < 24) {
      rockets.push({ x: width * (.12 + Math.random() * .76), y: height + 4, target: height * (.16 + Math.random() * .48), vy: -(7 + Math.random() * 3), hue: [42, 12, 184, 320, 156][launched % 5] });
      lastLaunch = time; launched++;
    }
    rockets = rockets.filter(rocket => {
      rocket.y += rocket.vy; rocket.vy += .08;
      context.beginPath(); context.arc(rocket.x, rocket.y, 2.4, 0, Math.PI * 2); context.fillStyle = `hsl(${rocket.hue} 100% 70%)`; context.fill();
      if (rocket.y <= rocket.target || rocket.vy >= 0) { burst(rocket.x, rocket.y); return false; }
      return true;
    });
    sparks = sparks.filter(spark => {
      const previousX = spark.x, previousY = spark.y;
      spark.x += spark.vx; spark.y += spark.vy; spark.vy += .035; spark.vx *= .992; spark.life--;
      context.globalAlpha = Math.min(1, Math.max(0, spark.life / 115)); context.beginPath(); context.moveTo(previousX, previousY); context.lineTo(spark.x, spark.y);
      context.strokeStyle = `hsl(${spark.hue} 100% 70%)`; context.lineWidth = spark.size; context.shadowBlur = 18; context.shadowColor = context.strokeStyle; context.stroke();
      context.beginPath(); context.arc(spark.x, spark.y, spark.size * .7, 0, Math.PI * 2); context.fillStyle = context.strokeStyle; context.fill();
      return spark.life > 0;
    });
    context.globalAlpha = 1; context.shadowBlur = 0;
    if (launched < 16 || rockets.length || sparks.length) frame = requestAnimationFrame(tick);
  };
  resize();
  frame = requestAnimationFrame(tick);
  dialog.addEventListener('close', () => { cancelAnimationFrame(frame); rockets = []; sparks = []; }, { once: true });
  window.addEventListener('resize', resize, { once: true });
}

const contactSuccessDialog = $('#contactSuccessDialog');
contactSuccessDialog.querySelector('[data-contact-success-close]').addEventListener('click', () => contactSuccessDialog.close());
contactSuccessDialog.addEventListener('click', event => { if (!event.target.closest('.contact-success-panel')) contactSuccessDialog.close(); });

$('#contactRecoveryForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget, button = $('#contactRecoverySubmit'), state = $('#formState');
  button.disabled = true;
  try {
    const response = await fetch('/api/contact-recovery', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email: form.elements.email.value.trim(), code: form.elements.code.value.trim() }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.code || 'recovery_failed');
    form.reset(); form.hidden = true;
    state.className = 'form-state ok';
    state.textContent = currentLang === 'en' ? 'Admin recovery verified. Sending is re-enabled for this IP.' : 'Đã xác minh quản trị viên. Quyền gửi tin từ IP này đã được mở lại.';
  } catch (error) {
    state.className = 'form-state err';
    state.textContent = error.message === 'recovery_temporarily_locked'
      ? (currentLang === 'en' ? 'Recovery is temporarily locked after too many attempts. Try again in 15 minutes.' : 'Tạm khóa xác minh sau nhiều lần thử sai. Vui lòng thử lại sau 15 phút.')
      : (currentLang === 'en' ? 'Admin verification failed. Check the email and current authenticator code.' : 'Xác minh không thành công. Hãy kiểm tra email và mã Authenticator hiện tại.');
  } finally {
    button.disabled = false;
  }
});

$('#contactForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget, button = form.querySelector('.submit'), state = $('#formState');
  const fields = {
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim(),
    message: form.elements.message.value.trim(),
    honeypot: form.elements._honey.value,
    language: currentLang
  };
  const length = value => [...value].length;
  if (length(fields.name) < 2 || length(fields.name) > 80 || length(fields.email) < 6 || length(fields.email) > 254 || length(fields.message) < 20 || length(fields.message) > 4000 || !form.elements.email.validity.valid) {
    state.className = 'form-state err';
    state.textContent = currentLang === 'en'
      ? 'Check your name (2–80 characters), email (6–254 characters), and message (20–4000 characters).'
      : 'Vui lòng kiểm tra tên (2–80 ký tự), email (6–254 ký tự) và nội dung (20–4000 ký tự).';
    state.style.display = 'block';
    return;
  }
  button.disabled = true;
  state.className = 'form-state';
  state.textContent = currentLang === 'en' ? 'Sending…' : 'Đang gửi…';
  state.style.display = 'block';
  try {
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(fields) });
    const result = await response.json().catch(() => ({}));
    if (response.status === 429) {
      state.className = 'form-state err';
      state.textContent = fields.language === 'en' ? result.message_en : result.message_vi;
      state.style.display = 'block';
      const recovery = $('#contactRecoveryForm');
      recovery.hidden = false;
      $('#contactRecoveryCopy').textContent = fields.language === 'en' ? 'If you are the administrator, verify with Google Authenticator to clear the current IP block.' : 'Nếu bạn là quản trị viên, xác minh bằng Google Authenticator để gỡ chặn địa chỉ IP hiện tại.';
      $('#contactRecoveryEmailLabel').textContent = fields.language === 'en' ? 'Administrator email' : 'Email quản trị';
      $('#contactRecoveryCodeLabel').textContent = fields.language === 'en' ? 'Google Authenticator code' : 'Mã Google Authenticator';
      $('#contactRecoverySubmit').textContent = fields.language === 'en' ? 'Verify and unblock' : 'Xác minh và gỡ chặn';
      return;
    }
    if (!response.ok) throw new Error(result.code || 'submit_failed');
    state.className = 'form-state ok';
    state.textContent = currentLang === 'en' ? '✓ Sent. Thank you — I will reply soon.' : '✓ Đã gửi. Cảm ơn bạn — tôi sẽ phản hồi sớm.';
    form.reset();
    $('#contactRecoveryForm').hidden = true;
    showContactCelebration(fields.language);
  } catch (error) {
    const errorMessages = {
      contact_service_not_configured: currentLang === 'en'
        ? 'The contact service is not configured on the server yet. Please email viet.hq.work@gmail.com for now.'
        : 'Dịch vụ gửi tin trên máy chủ chưa được cấu hình đầy đủ. Tạm thời vui lòng gửi email đến viet.hq.work@gmail.com.',
      contact_rate_limit_unavailable: currentLang === 'en'
        ? 'The anti-spam service is temporarily unavailable. Please try again later.'
        : 'Dịch vụ chống spam đang tạm thời không khả dụng. Vui lòng thử lại sau.',
      client_ip_unavailable: currentLang === 'en'
        ? 'The server could not identify this connection. Please try again later.'
        : 'Máy chủ chưa xác định được kết nối này. Vui lòng thử lại sau.',
      email_delivery_failed: currentLang === 'en'
        ? 'The email provider could not accept the message. Please try again later or use direct email.'
        : 'Dịch vụ email chưa nhận được tin nhắn. Vui lòng thử lại sau hoặc liên hệ trực tiếp.',
      origin_not_allowed: currentLang === 'en'
        ? 'This page is not allowed to submit the contact form.'
        : 'Tên miền hiện tại chưa được cho phép gửi biểu mẫu liên hệ.'
    };
    console.error('Contact form request failed:', error.message || 'unknown_error');
    state.className = 'form-state err';
    state.dataset.errorCode = error.message || 'unknown_error';
    state.textContent = error.message === 'validation_failed'
      ? (currentLang === 'en' ? 'Please check the highlighted field limits.' : 'Vui lòng kiểm tra giới hạn ký tự của các trường.')
      : errorMessages[error.message] || (currentLang === 'en' ? '✗ Could not send. Please try again or use a direct contact channel.' : '✗ Chưa gửi được. Vui lòng thử lại hoặc dùng kênh liên hệ trực tiếp.');
    state.style.display = 'block';
  } finally {
    button.disabled = false;
  }
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
    draftPreviewRuntime=deepClone(event.data.runtime||{});isDraftPreview=true;pauseProjectCoverVideos();caseContent.innerHTML=caseHtml(draftPreviewRuntime);if(!caseDialog.open)openModalDialog(caseDialog);$('#globalPreviewBanner').hidden=false;return;
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
