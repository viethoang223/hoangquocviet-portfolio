import { CONFIG } from '../config.js';
import { state } from '../state.js';

export function sbReady() {
  return !!(CONFIG.supabase.url && CONFIG.supabase.anonKey);
}

export function sbHeaders(token) {
  return {
    apikey: CONFIG.supabase.anonKey,
    Authorization: `Bearer ${token || CONFIG.supabase.anonKey}`,
    'Content-Type': 'application/json'
  };
}

export async function sbFetch(path, options = {}, tokenOverride) {
  if (!sbReady()) throw new Error('supabase_not_configured');
  const token = tokenOverride === undefined ? state.adminSession?.access_token : tokenOverride;
  const headers = { ...sbHeaders(token), ...(options.headers || {}) };
  let response;

  try {
    response = await fetch(CONFIG.supabase.url.replace(/\/$/, '') + path, {
      ...options,
      headers
    });
  } catch (cause) {
    const error = new Error('supabase_network_error');
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch (_) {}

    const error = new Error(`supabase_${response.status}`);
    error.status = response.status;
    error.detail = detail;

    try {
      const parsed = JSON.parse(detail);
      error.code = parsed?.code || '';
      error.messageText = parsed?.message || '';
      error.hint = parsed?.hint || '';
      error.details = parsed?.details || '';
    } catch (_) {}

    throw error;
  }

  return response;
}

export function classifySupabaseError(error) {
  if (!sbReady()) return 'not_configured';
  if (
    error?.message === 'supabase_network_error' ||
    (error?.name === 'TypeError' && !error?.status)
  ) {
    return 'network';
  }

  const status =
    Number(error?.status) ||
    Number(String(error?.message || '').match(/supabase_(\d+)/)?.[1] || 0);

  if (status === 401) return 'auth';
  if (status === 403) return 'permission';

  const text = String([
    error?.code,
    error?.detail,
    error?.messageText,
    error?.details,
    error?.hint,
    error?.message
  ].filter(Boolean).join(' ')).toLowerCase();

  const schemaCode = /\b(?:pgrst204|pgrst205)\b/i.test(text);
  const schemaText =
    /(?:column|relation|table) .* (?:does not exist|not found)|could not find the (?:table|relation)|schema cache/i.test(text);

  if ((status === 400 || status === 404) && (schemaCode || schemaText)) {
    return 'schema_missing';
  }

  return 'error';
}

export function publicUrl(path) {
  const base = CONFIG.supabase.url.replace(/\/$/, '');
  return `${base}/storage/v1/object/public/${CONFIG.supabase.bucket}/${path
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
}

export function safeFileName(name) {
  return name
    .normalize('NFKD')
    .replace(/[^\w.\- ]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100) || 'file';
}

export async function uploadStorage(file, path) {
  const response = await fetch(
    CONFIG.supabase.url.replace(/\/$/, '') +
      `/storage/v1/object/${encodeURIComponent(CONFIG.supabase.bucket)}/${path
        .split('/')
        .map(encodeURIComponent)
        .join('/')}`,
    {
      method: 'POST',
      headers: {
        apikey: CONFIG.supabase.anonKey,
        Authorization: `Bearer ${state.adminSession.access_token}`,
        'Content-Type': file.type,
        'x-upsert': 'false'
      },
      body: file
    }
  );

  if (!response.ok) {
    const error = new Error('storage_upload_failed');
    try {
      error.detail = await response.text();
    } catch (_) {}
    throw error;
  }

  return path;
}

export async function deleteStorage(paths) {
  if (!paths.length) return;

  const response = await fetch(
    CONFIG.supabase.url.replace(/\/$/, '') +
      `/storage/v1/object/${encodeURIComponent(CONFIG.supabase.bucket)}/remove`,
    {
      method: 'POST',
      headers: {
        apikey: CONFIG.supabase.anonKey,
        Authorization: `Bearer ${state.adminSession.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prefixes: paths })
    }
  );

  if (!response.ok) throw new Error('storage_delete_failed');
}
