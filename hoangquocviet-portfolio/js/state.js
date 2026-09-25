import { I18N } from './i18n.js';

export const state = {
  currentLang: localStorage.getItem('hqv-lang') === 'en' ? 'en' : 'vi',
  adminSession: null,
  activeProject: null,
  assetSchemaReady: null,
  assetLoadState: 'unknown',
  profileAvatar: null,
  projectCovers: new Map(),
  adminAssets: new Map(),
  assetLoadPromise: null
};

export function t(key) {
  return I18N[state.currentLang][key] ?? I18N.vi[key] ?? key;
}
