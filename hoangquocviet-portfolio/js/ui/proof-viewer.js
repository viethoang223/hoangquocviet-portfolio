import { state, t } from '../state.js';
import { esc } from '../utils.js';

export function proofTitle(item) {
  return state.currentLang === 'en'
    ? item.titleEn || item.titleVi || item.title
    : item.titleVi || item.titleEn || item.title;
}

export function proofVerb(type) {
  return t(`proof.${type}`);
}

export function validProof(item) {
  return !!(
    item &&
    (item.url ||
      item.file ||
      (Array.isArray(item.files) && item.files.length))
  );
}

export function renderViewer(item, elements) {
  const files =
    Array.isArray(item.files) && item.files.length
      ? item.files
      : [item.file || item.url];
  const first = files[0];

  elements.viewerHead.innerHTML =
    `<strong>${esc(proofTitle(item) || t('modal.evidence'))}</strong>` +
    `<div class="viewer-actions">` +
    `<a class="viewer-btn" href="${esc(first)}" target="_blank" rel="noopener">${esc(t('modal.openTab'))} ↗</a>` +
    `<a class="viewer-btn" href="${esc(first)}" download>${esc(t('modal.download'))} ↓</a>` +
    `<button class="viewer-btn" type="button" data-close="viewer">${esc(t('modal.close'))}</button>` +
    `</div>`;

  elements.viewerBody.innerHTML =
    item.type === 'pdf'
      ? `<iframe src="${esc(first)}#view=FitH" title="${esc(proofTitle(item) || 'PDF')}"></iframe>`
      : `<div class="gallery">${files
          .map(src => `<img src="${esc(src.url || src)}" alt="${esc(proofTitle(item) || 'Proof')}">`)
          .join('')}</div>`;
}
