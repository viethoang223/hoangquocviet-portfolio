import { CONFIG } from './config.js';
import { PROJECTS, SKILLS, CERTS } from './projects.js';
import { I18N } from './i18n.js';
import { state, t } from './state.js';
import { $, $$, esc, tag, statsH } from './utils.js';
import { initNavigation } from './ui/navigation.js';
import { initAnimations } from './ui/animations.js';
import { initProjectViewer, route, parseHash } from './ui/project-viewer.js';
import { initAdmin, renderAdmin } from './admin/admin.js';
import { loadAllProofs } from './services/assets.js';

function contentFor(project) {
  return project.content[state.currentLang] || project.content.vi;
}

function visualH(project) {
  const cover = state.projectCovers.get(project.id);

  const shell = inner =>
    `<div class="mock-window"><div class="mock-top"><div class="window-dots"><span class="window-dot"></span><span class="window-dot"></span><span class="window-dot"></span></div><span class="window-label">HQV / ${esc(project.id)}</span></div><div class="mock-body">${inner}</div></div>`;

  if (cover) {
    return shell(
      `<div class="mock-cover"><img src="${esc(cover.url)}" alt="${esc(
        contentFor(project).title
      )} project cover" loading="lazy"><div class="mock-cover-label"><b>PROJECT COVER</b><span>${esc(
        project.id
      )}</span></div></div>`
    );
  }

  if (project.visual === 'workflow') {
    return shell(
      `<div class="workflow"><div class="node hot">Data Source</div><div class="arrow">→</div><div class="node">Extraction</div><div class="arrow">→</div><div class="node cold">AI Processing</div><div class="arrow">→</div><div class="node hot">Intent</div><div class="arrow">→</div><div class="node">JSON</div><div class="arrow">→</div><div class="node cold">Telegram</div></div>`
    );
  }

  if (project.visual === 'research') {
    return shell(
      `<div class="data-panel"><div class="metric-box"><div class="metric"><strong>193</strong><span>responses</span></div><div class="metric"><strong>0.849</strong><span>KMO</span></div><div class="metric"><strong>68.7%</strong><span>variance</span></div><div class="metric"><strong>0.694</strong><span>R²</span></div></div><div class="bars"><div class="bar"><span>Factor 01</span><i style="--w:82%"></i><b>82%</b></div><div class="bar"><span>Factor 02</span><i style="--w:70%"></i><b>70%</b></div><div class="bar"><span>Factor 03</span><i style="--w:61%"></i><b>61%</b></div><div class="bar"><span>Factor 04</span><i style="--w:54%"></i><b>54%</b></div></div></div>`
    );
  }

  if (project.visual === 'research2') {
    return shell(
      `<div class="arch"><div class="primary">Artificial Intelligence</div><div>Education</div><div class="blue">Student Productivity</div><div>Applied Research</div></div>`
    );
  }

  if (project.visual === 'design') {
    return shell(
      `<div class="arch"><div class="primary">UTT Design</div><div class="blue">LoRA</div><div>ControlNet</div><div class="blue">Canny Edge</div><div>SDXL</div><div class="blue">Preset</div><div>~80% structure</div></div>`
    );
  }

  if (project.visual === 'journey') {
    return shell(
      `<div class="journey"><div class="journey-step"><div class="journey-no">01</div><div class="journey-text">Market Context</div></div><div class="journey-step"><div class="journey-no">02</div><div class="journey-text">Customer Profile</div></div><div class="journey-step"><div class="journey-no">03</div><div class="journey-text">Consumer Insight</div></div><div class="journey-step"><div class="journey-no">04</div><div class="journey-text">Creative Idea</div></div><div class="journey-step"><div class="journey-no">05</div><div class="journey-text">Channels + Media Direction</div></div></div>`
    );
  }

  return shell(
    `<div class="arch"><div class="primary">Marketing Problem</div><div>Claude Code</div><div class="blue">MCP</div><div>API</div><div>Git / GitHub</div><div class="blue">Prototype</div><div>Structured Output</div></div>`
  );
}

function renderProjects() {
  $('#projectList').innerHTML = PROJECTS.map(project => {
    const content = contentFor(project);

    return `<article class="project-card reveal visible" style="--card-a:${project.tone[0]};--card-b:${project.tone[1]}"><div class="project-copy"><span class="project-index">CASE ${esc(project.index)}</span><div class="project-tags">${content.category.map(tag).join('')}</div><h3 class="project-title">${esc(content.title)}</h3><p class="project-hook">${esc(content.hook)}</p>${statsH(content.stats)}<div class="project-foot"><a class="case-btn" href="#/${project.id}">${esc(t('project.open'))} <span>↗</span></a><span class="muted" style="font-size:10px">Marketing × Technology</span></div></div><div class="project-visual">${visualH(project)}</div></article>`;
  }).join('');
}

function renderSkills() {
  $('#skillsGrid').innerHTML = SKILLS.map(skill => {
    const content = skill.content[state.currentLang];

    return `<article class="skill-card reveal visible" style="--skill-accent:${skill.accent}"><div class="skill-num">${skill.num}</div><div class="skill-orbit"></div><h3 class="skill-title">${esc(content.title)}</h3><p class="skill-copy">${esc(content.copy)}</p><div class="skill-items">${content.items.map(item => `<span class="skill-item"><strong>•</strong> ${esc(item)}</span>`).join('')}</div></article>`;
  }).join('');
}

function renderCerts() {
  const label = state.currentLang === 'en'
    ? 'documented profile'
    : 'hồ sơ đã ghi nhận';

  const render = array =>
    array
      .map(item => `<div class="cert-badge"><strong>${esc(item)}</strong><span>${esc(label)}</span></div>`)
      .join('');

  $('#anthropicCerts').innerHTML = render(CERTS.anthropic);
  $('#marketingCerts').innerHTML = render(CERTS.marketing);
  $('#englishCerts').innerHTML = render(CERTS.english);
}

function renderAvatar() {
  const image = $('#avatarImage');
  const initials = $('#avatarInitials');
  if (!image || !initials) return;

  if (state.profileAvatar) {
    image.src = state.profileAvatar.url;
    image.hidden = false;
    initials.hidden = true;
    image.alt =
      state.currentLang === 'en'
        ? 'Hoàng Quốc Việt profile avatar'
        : 'Ảnh đại diện Hoàng Quốc Việt';
  } else {
    image.removeAttribute('src');
    image.hidden = true;
    initials.hidden = false;
  }
}

function applyStatic() {
  document.documentElement.lang = state.currentLang;

  $('.nav').setAttribute(
    'aria-label',
    state.currentLang === 'en' ? 'Main navigation' : 'Điều hướng chính'
  );
  $('.lang-switch').setAttribute(
    'aria-label',
    state.currentLang === 'en' ? 'Language switcher' : 'Chuyển ngôn ngữ'
  );
  $('.avatar-shell').setAttribute(
    'aria-label',
    state.currentLang === 'en'
      ? 'Hoàng Quốc Việt avatar frame'
      : 'Khung avatar Hoàng Quốc Việt'
  );
  $('#caseDialog').setAttribute(
    'aria-label',
    state.currentLang === 'en' ? 'Project case study' : 'Chi tiết case study'
  );
  $('#viewerDialog').setAttribute(
    'aria-label',
    state.currentLang === 'en' ? 'Proof viewer' : 'Xem bằng chứng'
  );
  $('#adminDialog').setAttribute(
    'aria-label',
    state.currentLang === 'en'
      ? 'Admin proof manager'
      : 'Quản trị proof'
  );

  document.title =
    'Hoàng Quốc Việt | Marketing Operations · MarTech · AI-enabled Marketing';

  $$('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    if (I18N[state.currentLang][key]) {
      element.textContent = I18N[state.currentLang][key];
    }
  });

  $$('[data-lang]').forEach(button =>
    button.classList.toggle(
      'active',
      button.dataset.lang === state.currentLang
    )
  );

  $('#statusText').textContent = t('status');
  $('#heroSub').textContent =
    state.currentLang === 'en'
      ? 'I optimize Marketing funnels and operations through data thinking, AI, workflow automation and hands-on execution.'
      : 'Tối ưu hóa phễu và vận hành Marketing bằng tư duy dữ liệu, AI, Workflow Automation và năng lực thực thi thực tế.';

  $('#contactIntro').textContent = t('contact.intro');
  $('textarea[name="message"]').placeholder = t('form.messagePlaceholder');
  $('input[name="name"]').placeholder = t('form.namePlaceholder');
  $('#contactSubject').value = t('form.subject');

  renderAvatar();
  renderProjects();
  renderSkills();
  renderCerts();

  if ($('#adminDialog').open) renderAdmin();
}

function initContactForm() {
  $('#contactForm').addEventListener('submit', async event => {
    event.preventDefault();

    const form = event.currentTarget;
    const button = form.querySelector('.submit');
    const formState = $('#formState');

    if (!CONFIG.email) {
      formState.className = 'form-state err';
      formState.textContent =
        state.currentLang === 'en'
          ? 'Form is waiting for configuration. Add the receiving email in CONFIG.email.'
          : 'Form đang ở chế độ chờ cấu hình. Hãy điền email nhận tin trong CONFIG.email.';
      formState.style.display = 'block';
      return;
    }

    button.disabled = true;
    formState.className = 'form-state';
    formState.textContent =
      state.currentLang === 'en' ? 'Sending…' : 'Đang gửi…';
    formState.style.display = 'block';

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(CONFIG.email)}`,
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        }
      );

      if (!response.ok) throw new Error('submit_failed');

      formState.className = 'form-state ok';
      formState.textContent =
        state.currentLang === 'en'
          ? '✓ Sent. Thank you — I will reply soon.'
          : '✓ Đã gửi. Cảm ơn bạn — tôi sẽ phản hồi sớm.';
      form.reset();
    } catch (_) {
      formState.className = 'form-state err';
      formState.textContent =
        state.currentLang === 'en'
          ? '✗ Could not send. Please try again or use a direct contact channel.'
          : '✗ Chưa gửi được. Vui lòng thử lại hoặc dùng kênh liên hệ trực tiếp.';
    } finally {
      button.disabled = false;
    }
  });
}

function handleLanguageChange() {
  applyStatic();
  route();
}

function init() {
  initNavigation({ onLanguageChange: handleLanguageChange });
  initAnimations();
  initProjectViewer({ renderAdmin });
  initAdmin({
    onPublicUpdate: () => {
      renderAvatar();
      renderProjects();
    }
  });
  initContactForm();

  applyStatic();
  loadAllProofs()
    .then(() => {
      renderAvatar();
      renderProjects();
    })
    .catch(() => {});

  route();
}

init();
