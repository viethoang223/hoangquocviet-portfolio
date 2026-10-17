import { state, t } from '../state.js';
import { $, esc } from '../utils.js';
import { adminLogin, logout, restoreSession } from '../services/auth.js';
import { loadAssets } from '../services/assets.js';
import { sbReady } from '../services/supabase.js';
import {
  setAdminStatus,
  populateAdminProjects,
  refreshAdminList,
  initAssetManager
} from './asset-manager.js';

let onPublicRender = () => {};

function errorMessage(error) {
  if (error.message === 'not_admin') {
    return state.currentLang === 'en'
      ? 'This account is not allowed to administer the portfolio.'
      : 'Tài khoản này không có quyền quản trị portfolio.';
  }

  if (error.message === 'supabase_not_configured') {
    return t('admin.notConfigured');
  }

  return t('admin.loginFailed');
}

export function renderAdmin() {
  populateAdminProjects();

  const configured = sbReady();

  const noteKey = !configured
    ? 'admin.configMissing'
    : state.assetLoadState === 'schema_missing'
      ? 'admin.schemaMissing'
      : state.assetLoadState === 'auth'
        ? 'admin.authError'
        : state.assetLoadState === 'permission'
          ? 'admin.permissionError'
          : state.assetLoadState === 'network'
            ? 'admin.networkError'
            : state.assetLoadState === 'error'
              ? 'admin.loadError'
              : state.assetLoadState === 'unknown'
                ? 'admin.schemaChecking'
                : 'admin.configReady';

  $('#adminConfigNote').className = 'admin-config';
  $('#adminConfigNote').textContent = t(noteKey);
  $('#adminLoginPanel').hidden = !!state.adminSession;
  $('#adminPanel').hidden = !state.adminSession;

  if (state.adminSession) refreshAdminList();
}

async function handleLogin(event) {
  event.preventDefault();

  const button = event.currentTarget.querySelector('button');
  button.disabled = true;

  try {
    await adminLogin(
      $('#adminEmail').value.trim(),
      $('#adminPassword').value
    );

    setAdminStatus('#adminLoginStatus', 'ok', t('admin.loggedIn'));
    renderAdmin();
    await loadAssets();
    onPublicRender();
    renderAdmin();
  } catch (error) {
    setAdminStatus('#adminLoginStatus', 'err', errorMessage(error));
  } finally {
    button.disabled = false;
  }
}

export function initAdmin({ onPublicUpdate = () => {} } = {}) {
  onPublicRender = onPublicUpdate;

  initAssetManager({ onChange: onPublicUpdate });

  $('#adminLoginForm').addEventListener('submit', handleLogin);

  $('#adminLogout').addEventListener('click', () => {
    logout();
    renderAdmin();
  });

  restoreSession().then(async () => {
    if (state.adminSession) {
      await loadAssets().catch(() => {});
      onPublicRender();
    }
    if (document.querySelector('#adminDialog')?.open) renderAdmin();
  });
}
