import { CONFIG } from '../config.js';
import { PROJECTS } from '../projects.js';
import { state } from '../state.js';
import {
  sbReady,
  sbFetch,
  classifySupabaseError,
  publicUrl,
  safeFileName,
  uploadStorage,
  deleteStorage
} from './supabase.js';

export function assetRowsForProof(rows, project) {
  return rows.filter(row => {
    const belongs = row.owner_id === project.id || row.project_id === project.id;
    const kind = row.asset_type || 'proof';
    return belongs && (kind === 'proof' || kind === 'gallery');
  });
}

export function buildProofs(rows) {
  const groups = new Map();

  rows.forEach(row => {
    const key = row.gallery_id || `single:${row.id}`;
    let group = groups.get(key);

    if (!group) {
      group = {
        id: row.gallery_id || row.id,
        type: row.gallery_id ? 'gallery' : row.type,
        titleVi: row.title_vi || row.title_en || row.original_name,
        titleEn: row.title_en || row.title_vi || row.original_name,
        created_at: row.created_at,
        files: []
      };
      groups.set(key, group);
    }

    group.files.push(publicUrl(row.storage_path));
    if (row.created_at > group.created_at) group.created_at = row.created_at;
  });

  return [...groups.values()]
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .map(group =>
      group.type === 'gallery'
        ? {
            type: 'gallery',
            titleVi: group.titleVi,
            titleEn: group.titleEn,
            files: group.files,
            url: group.files[0]
          }
        : {
            type: group.type,
            titleVi: group.titleVi,
            titleEn: group.titleEn,
            file: group.files[0],
            url: group.files[0],
            files: group.type === 'image' ? [group.files[0]] : undefined
          }
    );
}

export async function loadLegacyProofsForProject(project) {
  const query =
    `/rest/v1/portfolio_proofs?select=id,project_id,type,title_vi,title_en,storage_path,original_name,mime_type,file_size,gallery_id,created_at` +
    `&project_id=eq.${encodeURIComponent(project.id)}&order=created_at.desc`;

  const response = await sbFetch(query, { method: 'GET' }, null);
  const rows = await response.json();
  project.proof = buildProofs(rows);
  return project.proof;
}

export async function loadAssets() {
  if (!sbReady()) {
    state.assetLoadState = 'not_configured';
    state.assetSchemaReady = null;
    return;
  }

  if (state.assetLoadPromise) return state.assetLoadPromise;

  state.assetLoadPromise = (async () => {
    try {
      const table = encodeURIComponent(CONFIG.supabase.assetTable);
      const query =
        `/rest/v1/${table}?select=id,project_id,asset_type,owner_type,owner_id,type,title_vi,title_en,storage_path,original_name,mime_type,file_size,gallery_id,created_at` +
        '&order=created_at.desc';

      const response = await sbFetch(query, { method: 'GET' }, null);
      const rows = await response.json();

      state.assetSchemaReady = true;
      state.assetLoadState = 'ready';

      state.adminAssets.clear();
      rows.forEach(row => state.adminAssets.set(row.id, row));

      const avatarRow = rows.find(
        row =>
          row.asset_type === 'avatar' &&
          row.owner_type === 'profile' &&
          row.owner_id === 'hqv'
      );

      state.profileAvatar = avatarRow
        ? { ...avatarRow, url: publicUrl(avatarRow.storage_path) }
        : null;

      state.projectCovers.clear();

      for (const project of PROJECTS) {
        const cover = rows.find(
          row =>
            row.asset_type === 'project_cover' &&
            row.owner_type === 'project' &&
            row.owner_id === project.id
        );

        if (cover) {
          state.projectCovers.set(project.id, {
            ...cover,
            url: publicUrl(cover.storage_path)
          });
        }

        const proofRows = assetRowsForProof(rows, project);
        project.proof = buildProofs(proofRows);
      }
    } catch (error) {
      const kind = classifySupabaseError(error);
      state.assetLoadState = kind;
      state.assetSchemaReady = kind === 'schema_missing' ? false : null;

      if (kind === 'schema_missing') {
        await Promise.all(
          PROJECTS.map(project =>
            loadLegacyProofsForProject(project).catch(() => [])
          )
        );
      }
    } finally {
      state.assetLoadPromise = null;
    }

    return state;
  })();

  return state.assetLoadPromise;
}

export async function loadProofsForProject(project) {
  if (!sbReady()) return project.proof || [];
  if (state.assetLoadState === 'schema_missing') {
    return loadLegacyProofsForProject(project);
  }

  await loadAssets();

  if (state.assetLoadState === 'schema_missing') {
    return loadLegacyProofsForProject(project);
  }

  return project.proof || [];
}

export async function loadAllProofs() {
  if (!sbReady()) return;
  return loadAssets();
}

export async function insertAssetRows(rows) {
  const response = await sbFetch(
    `/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}`,
    {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(rows)
    }
  );

  const body = await response.json();
  return Array.isArray(body) ? body : [];
}

export async function deleteMetadataRow(row) {
  const response = await sbFetch(
    `/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=eq.${encodeURIComponent(row.id)}`,
    {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' }
    }
  );

  const removed = await response.json();

  if (!Array.isArray(removed) || removed.length !== 1) {
    throw new Error('metadata_delete_failed');
  }

  return removed[0];
}

export async function deleteMetadataRows(rows) {
  const unique = [
    ...new Map(rows.filter(Boolean).map(row => [row.id, row])).values()
  ];
  if (!unique.length) return;

  const ids = unique.map(row => encodeURIComponent(row.id)).join(',');
  const response = await sbFetch(
    `/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?id=in.(${ids})`,
    {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' }
    }
  );

  const removed = await response.json();
  const removedIds = new Set(
    Array.isArray(removed) ? removed.map(row => row.id) : []
  );
  const missing = unique.filter(row => !removedIds.has(row.id));

  if (missing.length) throw new Error('metadata_rollback_failed');
}

export async function restoreMetadataRow(row) {
  await insertAssetRows([row]);
}

export async function findMetadataRowsByStoragePaths(paths) {
  const found = [];

  for (const path of [...new Set(paths)]) {
    try {
      const response = await sbFetch(
        `/rest/v1/${encodeURIComponent(CONFIG.supabase.assetTable)}?select=id,project_id,asset_type,owner_type,owner_id,type,title_vi,title_en,storage_path,original_name,mime_type,file_size,gallery_id,created_at&storage_path=eq.${encodeURIComponent(path)}`,
        { method: 'GET' }
      );

      const rows = await response.json();
      if (Array.isArray(rows)) found.push(...rows);
    } catch (_) {}
  }

  return [...new Map(found.map(row => [row.id, row])).values()];
}

export async function snapshotStorageRow(row) {
  const url =
    CONFIG.supabase.url.replace(/\/$/, '') +
    `/storage/v1/object/${encodeURIComponent(CONFIG.supabase.bucket)}/${row.storage_path
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: CONFIG.supabase.anonKey,
      Authorization: `Bearer ${state.adminSession.access_token}`
    }
  });

  if (!response.ok) throw new Error('storage_snapshot_failed');

  const blob = await response.blob();
  return { row, blob };
}

export async function restoreStorageSnapshot(snapshot) {
  const { row, blob } = snapshot;
  const url =
    CONFIG.supabase.url.replace(/\/$/, '') +
    `/storage/v1/object/${encodeURIComponent(CONFIG.supabase.bucket)}/${row.storage_path
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      apikey: CONFIG.supabase.anonKey,
      Authorization: `Bearer ${state.adminSession.access_token}`,
      'Content-Type': row.mime_type || blob.type || 'application/octet-stream',
      'x-upsert': 'true'
    },
    body: blob
  });

  if (!response.ok) throw new Error('storage_restore_failed');
}

export async function removeAssetRow(row) {
  const snapshot = await snapshotStorageRow(row);
  await deleteStorage([row.storage_path]);

  try {
    await deleteMetadataRow(row);
  } catch (error) {
    try {
      await restoreStorageSnapshot(snapshot);
    } catch (_) {}
    throw error;
  }
}

export async function rollbackUploadedAssets(paths, insertedRows) {
  const known = [...(insertedRows || [])];
  const discovered = await findMetadataRowsByStoragePaths(paths);
  const all = [
    ...new Map([...known, ...discovered].map(row => [row.id, row])).values()
  ];

  let rollbackError = null;

  try {
    await deleteMetadataRows(all);
  } catch (error) {
    rollbackError = error;
  }

  try {
    await deleteStorage(paths);
  } catch (error) {
    rollbackError = rollbackError || error;
  }

  return { ok: !rollbackError, error: rollbackError };
}

export function assertAssetSchema() {
  if (!sbReady()) throw new Error('supabase_not_configured');
  if (state.assetLoadState === 'schema_missing') {
    throw new Error('asset_schema_missing');
  }
  if (state.assetLoadState === 'auth') {
    throw new Error('supabase_auth_error');
  }
  if (state.assetLoadState === 'permission') {
    throw new Error('supabase_permission_error');
  }
  if (state.assetLoadState === 'network') {
    throw new Error('supabase_network_error');
  }
  if (state.assetLoadState !== 'ready') {
    throw new Error('asset_schema_unavailable');
  }
}

export function makeStoragePath(assetType, ownerId, file) {
  const id = crypto.randomUUID();
  const name = safeFileName(file.name);

  if (assetType === 'avatar') return `profile/avatar-${id}-${name}`;
  if (assetType === 'project_cover') {
    return `projects/${ownerId}/cover-${id}-${name}`;
  }

  return `projects/${ownerId}/proof/${Date.now()}-${id}-${name}`;
}

export async function uploadAssetBatch({
  assetType,
  ownerType,
  ownerId,
  projectId,
  titleVi,
  titleEn,
  files
}) {
  assertAssetSchema();

  const galleryId =
    assetType === 'proof' &&
    files.length > 1 &&
    files.every(file => file.type.startsWith('image/'))
      ? crypto.randomUUID()
      : null;

  if (assetType === 'avatar' && files.length !== 1) {
    throw new Error('asset_required');
  }

  if (
    assetType === 'project_cover' &&
    (files.length !== 1 || !files[0].type.startsWith('image/'))
  ) {
    throw new Error('asset_required');
  }

  for (const file of files) {
    if (
      assetType === 'proof' &&
      file.type !== 'application/pdf' &&
      !file.type.startsWith('image/')
    ) {
      throw new Error('asset_required');
    }

    if (
      (assetType === 'avatar' || assetType === 'project_cover') &&
      !file.type.startsWith('image/')
    ) {
      throw new Error('asset_required');
    }
  }

  const rows = [];
  const uploadedPaths = [];
  let insertedRows = [];

  try {
    for (const file of files) {
      const path = makeStoragePath(assetType, ownerId, file);
      await uploadStorage(file, path);
      uploadedPaths.push(path);

      rows.push({
        project_id: projectId || null,
        asset_type: galleryId ? 'gallery' : assetType,
        owner_type: ownerType,
        owner_id: ownerId,
        type:
          galleryId
            ? 'gallery'
            : file.type === 'application/pdf'
              ? 'pdf'
              : 'image',
        title_vi: titleVi || file.name,
        title_en: titleEn || file.name,
        storage_path: path,
        original_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        gallery_id: galleryId
      });
    }

    insertedRows = await insertAssetRows(rows);

    if (insertedRows.length !== rows.length) {
      throw new Error('metadata_failed');
    }

    return insertedRows;
  } catch (error) {
    const rollback = await rollbackUploadedAssets(uploadedPaths, insertedRows);
    if (!rollback.ok) error.rollbackError = rollback.error;
    throw error;
  }
}

export async function replaceSingleAsset(assetType, ownerType, ownerId, newRows) {
  if (!Array.isArray(newRows) || !newRows.length) {
    throw new Error('metadata_not_persisted');
  }

  const oldRows = [...state.adminAssets.values()].filter(
    row =>
      row.asset_type === assetType &&
      row.owner_type === ownerType &&
      row.owner_id === ownerId &&
      row.id &&
      !newRows.some(newRow => newRow.id === row.id)
  );

  if (!oldRows.length) return;

  const snapshots = [];
  const deletedRows = [];

  try {
    for (const row of oldRows) {
      snapshots.push(await snapshotStorageRow(row));
    }

    for (const row of oldRows) {
      await removeAssetRow(row);
      deletedRows.push(row);
    }
  } catch (error) {
    for (const row of deletedRows) {
      const snapshot = snapshots.find(item => item.row.id === row.id);
      if (!snapshot) continue;

      try {
        await restoreStorageSnapshot(snapshot);
      } catch (_) {}

      try {
        await restoreMetadataRow(row);
      } catch (_) {}
    }

    const rollback = await rollbackUploadedAssets(
      newRows.map(row => row.storage_path),
      newRows
    );

    if (!rollback.ok) error.rollbackError = rollback.error;
    throw error;
  }
}
