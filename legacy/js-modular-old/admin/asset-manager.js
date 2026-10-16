import { PROJECTS } from '../projects.js';
import { state, t } from '../state.js';
import { $, esc } from '../utils.js';
import {
  loadAssets,
  uploadAssetBatch,
  replaceSingleAsset,
  removeAssetRow
} from '../services/assets.js';

let onAssetsChanged = () => {};

export function setAdminStatus(id, type, message) {
  const element = $(id);
  if (!element) return;
  element.className = `admin-status show ${type}`;
  element.textContent = message;
}

function ownerLabel(row) {
  if (row.asset_type === 'avatar') return 'Profile · HQV';

  const project = PROJECTS.find(
    item => item.id === row.owner_id || item.id === row.project_id
  );

  return (
    project?.content[state.currentLang]?.title ||
    row.owner_id ||
    row.project_id ||
    '—'
  );
}

function assetTypeLabel(type) {
  return (
    {
      avatar: 'Avatar',
      project_cover: 'Project cover',
      proof: 'Proof',
      gallery: 'Gallery'
    }[type] || type
  );
}

export function refreshAdminList() {
  const list = $('#adminProofList');
  if (!list) return;

  if (!state.adminSession) {
    list.innerHTML = `<div class="admin-empty">${esc(t('admin.loginRequired'))}</div>`;
    return;
  }

  if (state.assetSchemaReady === null) {
    list.innerHTML = `<div class="admin-empty">${esc(t('admin.schemaChecking'))}</div>`;
    return;
  }

  if (state.assetLoadState === 'not_configured') {
    list.innerHTML = `<div class="admin-empty">${esc(t('admin.notConfigured'))}</div>`;
    return;
  }

  if (state.assetLoadState === 'schema_missing') {
    list.innerHTML = `<div class="admin-empty">${esc(t('admin.schemaMissing'))}</div>`;
    return;
  }

  if (
    ['auth', 'permission', 'network', 'error'].includes(
      state.assetLoadState
    )
  ) {
    const key = {
      auth: 'admin.authError',
      permission: 'admin.permissionError',
      network: 'admin.networkError',
      error: 'admin.loadError'
    }[state.assetLoadState];

    list.innerHTML = `<div class="admin-empty">${esc(t(key))}</div>`;
    return;
  }

  const rows = [...state.adminAssets.values()].sort((a, b) =>
    String(b.created_at).localeCompare(String(a.created_at))
  );

  if (!rows.length) {
    list.innerHTML = `<div class="admin-empty">${esc(t('admin.noProof'))}</div>`;
    return;
  }

  list.innerHTML = rows
    .map(
      row =>
        `<div class="admin-proof"><div><strong>${esc(
          state.currentLang === 'en'
            ? row.title_en || row.title_vi || row.original_name
            : row.title_vi || row.title_en || row.original_name
        )}</strong><span>${esc(assetTypeLabel(row.asset_type || 'proof'))} · ${esc(
          ownerLabel(row)
        )} · ${esc(row.original_name || '')}</span></div><button class="admin-btn danger" type="button" data-delete-asset="${esc(
          row.id
        )}">${state.currentLang === 'en' ? 'Delete' : 'Xóa'}</button></div>`
    )
    .join('');
}

export function populateAdminProjects() {
  const options = PROJECTS.map(
    project =>
      `<option value="${esc(project.id)}">${esc(
        project.content[state.currentLang].title
      )}</option>`
  ).join('');

  $('#adminProject').innerHTML = options;
  $('#coverProject').innerHTML = options;
}

function assetErrorMessage(error) {
  if (error.message === 'asset_schema_missing') return t('admin.schemaMissing');
  if (error.message === 'supabase_not_configured') return t('admin.notConfigured');
  if (error.message === 'supabase_auth_error') return t('admin.authError');
  if (error.message === 'supabase_permission_error') return t('admin.permissionError');
  if (error.message === 'supabase_network_error') return t('admin.networkError');
  return t('admin.uploadFailed');
}

export async function doAvatarUpload(event) {
  event.preventDefault();

  const files = [...$('#avatarFile').files];
  const button = $('#avatarUploadBtn');

  if (!files.length) {
    setAdminStatus('#avatarUploadStatus', 'err', t('admin.assetRequired'));
    return;
  }

  if (!state.adminSession) {
    setAdminStatus('#avatarUploadStatus', 'err', t('admin.loginRequired'));
    return;
  }

  button.disabled = true;
  setAdminStatus('#avatarUploadStatus', 'ok', t('admin.uploading'));

  try {
    const rows = await uploadAssetBatch({
      assetType: 'avatar',
      ownerType: 'profile',
      ownerId: 'hqv',
      titleVi: 'Ảnh đại diện Hoàng Quốc Việt',
      titleEn: 'Hoàng Quốc Việt profile avatar',
      files
    });

    await replaceSingleAsset('avatar', 'profile', 'hqv', rows);
    await loadAssets();
    $('#avatarUploadForm').reset();
    onAssetsChanged();
    setAdminStatus(
      '#avatarUploadStatus',
      'ok',
      t('admin.avatarUploaded')
    );
  } catch (error) {
    setAdminStatus(
      '#avatarUploadStatus',
      'err',
      assetErrorMessage(error)
    );
  } finally {
    button.disabled = false;
  }
}

export async function doCoverUpload(event) {
  event.preventDefault();

  const files = [...$('#projectCoverFile').files];
  const projectId = $('#coverProject').value;
  const button = $('#coverUploadBtn');

  if (!files.length) {
    setAdminStatus('#coverUploadStatus', 'err', t('admin.assetRequired'));
    return;
  }

  if (!state.adminSession) {
    setAdminStatus('#coverUploadStatus', 'err', t('admin.loginRequired'));
    return;
  }

  const project = PROJECTS.find(item => item.id === projectId);

  if (!project) {
    setAdminStatus('#coverUploadStatus', 'err', t('admin.projectMissing'));
    return;
  }

  button.disabled = true;
  setAdminStatus('#coverUploadStatus', 'ok', t('admin.uploading'));

  try {
    const rows = await uploadAssetBatch({
      assetType: 'project_cover',
      ownerType: 'project',
      ownerId: projectId,
      projectId,
      titleVi: project.content.vi.title,
      titleEn: project.content.en.title,
      files
    });

    await replaceSingleAsset('project_cover', 'project', projectId, rows);
    await loadAssets();
    $('#coverUploadForm').reset();
    $('#coverProject').value = projectId;
    onAssetsChanged();
    setAdminStatus(
      '#coverUploadStatus',
      'ok',
      t('admin.coverUploaded')
    );
  } catch (error) {
    setAdminStatus(
      '#coverUploadStatus',
      'err',
      assetErrorMessage(error)
    );
  } finally {
    button.disabled = false;
  }
}

export async function doProofUpload(event) {
  event.preventDefault();

  const projectId = $('#adminProject').value;
  const titleVi = $('#proofTitleVi').value.trim();
  const titleEn = $('#proofTitleEn').value.trim();
  const files = [...$('#proofFiles').files];
  const button = $('#uploadBtn');

  if (!files.length) {
    setAdminStatus('#adminUploadStatus', 'err', t('admin.assetRequired'));
    return;
  }

  if (!state.adminSession) {
    setAdminStatus('#adminUploadStatus', 'err', t('admin.loginRequired'));
    return;
  }

  button.disabled = true;
  setAdminStatus('#adminUploadStatus', 'ok', t('admin.uploading'));

  try {
    await uploadAssetBatch({
      assetType: 'proof',
      ownerType: 'project',
      ownerId: projectId,
      projectId,
      titleVi,
      titleEn,
      files
    });

    $('#proofUploadForm').reset();
    await loadAssets();
    refreshAdminList();
    onAssetsChanged();
    setAdminStatus('#adminUploadStatus', 'ok', t('admin.uploaded'));
  } catch (error) {
    setAdminStatus(
      '#adminUploadStatus',
      'err',
      assetErrorMessage(error)
    );
  } finally {
    button.disabled = false;
  }
}

export async function deleteAsset(id) {
  if (!state.adminSession) {
    setAdminStatus('#adminUploadStatus', 'err', t('admin.loginRequired'));
    return;
  }

  const row = state.adminAssets.get(id);
  if (!row) return;

  setAdminStatus('#adminUploadStatus', 'ok', t('admin.uploading'));

  try {
    await removeAssetRow(row);
    state.adminAssets.delete(id);
    await loadAssets();
    refreshAdminList();
    onAssetsChanged();
    setAdminStatus('#adminUploadStatus', 'ok', t('admin.deleted'));
  } catch (_) {
    setAdminStatus('#adminUploadStatus', 'err', t('admin.deleteFailed'));
  }
}

export function initAssetManager({ onChange = () => {} } = {}) {
  onAssetsChanged = onChange;

  $('#proofUploadForm').addEventListener('submit', doProofUpload);
  $('#avatarUploadForm').addEventListener('submit', doAvatarUpload);
  $('#coverUploadForm').addEventListener('submit', doCoverUpload);

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-delete-asset]');
    if (button) deleteAsset(button.dataset.deleteAsset);
  });
}
