import { PROJECTS } from '../projects.js';
import { state, t } from '../state.js';
import { esc, statsH } from '../utils.js';
import { loadProofsForProject } from '../services/assets.js';
import { proofTitle, proofVerb, validProof, renderViewer } from './proof-viewer.js';

let elements = null;
let renderAdminCallback = () => {};

function contentForProject(project) {
  return project.content[state.currentLang] || project.content.vi;
}

function caseHtml(project) {
  const content = contentForProject(project);
  const blocks = content.story
    .map(
      ([label, text]) =>
        `<section class="modal-block"><h4>${esc(label)}</h4><p>${esc(text)}</p></section>`
    )
    .join('');

  const proof = (project.proof || [])
    .map((item, index) => {
      if (!validProof(item)) return '';

      if (item.type === 'link' || item.type === 'download') {
        return `<a class="proof-btn" href="${esc(item.url || item.file)}" target="_blank" rel="noopener">${esc(proofTitle(item) || proofVerb(item.type))} ↗</a>`;
      }

      return `<a class="proof-btn" href="#/${project.id}/${index}">${esc(proofVerb(item.type))}${proofTitle(item) ? ` · ${esc(proofTitle(item))}` : ''} →</a>`;
    })
    .join('');

  return (
    `<button class="modal-close" type="button" data-close="case" aria-label="${esc(t('modal.close'))}">✕</button>` +
    `<div class="modal-kicker">${content.category.map(esc).join(' · ')}</div>` +
    `<h2 class="modal-title">${esc(content.title)}</h2>` +
    `<p class="modal-lead">${esc(content.intro)}</p>` +
    `${statsH(content.stats)}` +
    blocks +
    (proof
      ? `<div class="modal-proof"><div class="modal-kicker" style="margin-top:0">${esc(t('modal.evidence'))}</div><div class="proof-actions">${proof}</div></div>`
      : '')
  );
}

export function parseHash() {
  if (location.hash === '#admin') return { admin: true };

  const match = location.hash.match(/^#\/([a-z0-9-]+)(?:\/(\d+))?$/i);
  if (!match) return null;

  const project = PROJECTS.find(item => item.id === match[1]);
  return project
    ? {
        project,
        index: match[2] == null ? null : Number(match[2])
      }
    : null;
}

function closeNative(dialog) {
  try {
    if (dialog.open) dialog.close();
  } catch (_) {}
}

export async function route() {
  const routeState = parseHash();

  if (routeState?.admin) {
    closeNative(elements.caseDialog);
    closeNative(elements.viewerDialog);

    if (!elements.adminDialog.open) elements.adminDialog.showModal();

    renderAdminCallback();
    return;
  }

  closeNative(elements.adminDialog);

  if (!routeState) {
    state.activeProject = null;
    closeNative(elements.viewerDialog);
    closeNative(elements.caseDialog);
    return;
  }

  if (state.activeProject !== routeState.project) {
    state.activeProject = routeState.project;
    elements.caseContent.innerHTML = caseHtml(routeState.project);

    if (!elements.caseDialog.open) elements.caseDialog.showModal();
    elements.caseContent.scrollTop = 0;
  } else if (!elements.caseDialog.open) {
    elements.caseDialog.showModal();
  }

  const proof =
    routeState.index != null && Array.isArray(routeState.project.proof)
      ? routeState.project.proof[routeState.index]
      : null;

  if (
    proof &&
    validProof(proof) &&
    ['pdf', 'image', 'gallery'].includes(proof.type)
  ) {
    renderViewer(proof, elements);
    if (!elements.viewerDialog.open) elements.viewerDialog.showModal();
  } else if (routeState.index == null) {
    closeNative(elements.viewerDialog);
  } else {
    closeNative(elements.viewerDialog);
  }

  loadProofsForProject(routeState.project)
    .then(() => {
      if (state.activeProject !== routeState.project) return;

      const latest = parseHash();
      if (!latest || latest.project !== routeState.project) return;

      if (latest.index == null) {
        elements.caseContent.innerHTML = caseHtml(routeState.project);
        closeNative(elements.viewerDialog);
        return;
      }

      const latestProof = Array.isArray(routeState.project.proof)
        ? routeState.project.proof[latest.index]
        : null;

      if (
        latestProof &&
        validProof(latestProof) &&
        ['pdf', 'image', 'gallery'].includes(latestProof.type)
      ) {
        renderViewer(latestProof, elements);
        if (!elements.viewerDialog.open) elements.viewerDialog.showModal();
      } else {
        closeNative(elements.viewerDialog);
      }

      elements.caseContent.innerHTML = caseHtml(routeState.project);
    })
    .catch(() => {});
}

function navigateHash(hash) {
  history.pushState({ hqv: true }, '', hash);
  route();
}

function exitModal() {
  if (elements.viewerDialog.open) {
    history.state?.hqv
      ? history.back()
      : (history.replaceState(
          null,
          '',
          state.activeProject ? `#/${state.activeProject.id}` : '#projects'
        ),
        route());
    return;
  }

  if (elements.caseDialog.open) {
    history.state?.hqv
      ? history.back()
      : (history.replaceState(null, '', '#projects'), route());
    return;
  }

  if (elements.adminDialog.open) {
    history.state?.hqv
      ? history.back()
      : (history.replaceState(null, '', '#top'), route());
  }
}

export function initProjectViewer({ renderAdmin }) {
  renderAdminCallback = renderAdmin;

  elements = {
    caseDialog: document.querySelector('#caseDialog'),
    viewerDialog: document.querySelector('#viewerDialog'),
    caseContent: document.querySelector('#caseContent'),
    viewerHead: document.querySelector('#viewerHead'),
    viewerBody: document.querySelector('#viewerBody'),
    adminDialog: document.querySelector('#adminDialog')
  };

  window.addEventListener('popstate', route);

  document.addEventListener('click', event => {
    const hashLink = event.target.closest('a[href^="#/"]');
    if (hashLink) {
      event.preventDefault();
      navigateHash(hashLink.getAttribute('href'));
      return;
    }

    if (event.target.closest('a[href="#admin"]')) {
      event.preventDefault();
      navigateHash('#admin');
      return;
    }

    const close = event.target.closest('[data-close]');
    if (close) {
      exitModal();
      return;
    }

    if (event.target === elements.caseDialog) {
      const rect = elements.caseContent.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        exitModal();
      }
    }

    if (
      event.target === elements.viewerDialog ||
      event.target === elements.adminDialog
    ) {
      exitModal();
    }
  });

  [
    elements.caseDialog,
    elements.viewerDialog,
    elements.adminDialog
  ].forEach(dialog =>
    dialog.addEventListener('cancel', event => {
      event.preventDefault();
      exitModal();
    })
  );
}
