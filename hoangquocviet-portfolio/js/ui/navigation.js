import { state } from '../state.js';

export function setLang(next, onChange) {
  if (next !== 'vi' && next !== 'en') return;

  if (state.currentLang === next) {
    onChange();
    return;
  }

  state.currentLang = next;
  localStorage.setItem('hqv-lang', state.currentLang);
  onChange();
}

export function initNavigation({ onLanguageChange }) {
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.addEventListener('click', () => {
      setLang(button.dataset.lang, onLanguageChange);
    });
  });
}
