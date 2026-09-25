import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { sbHeaders, sbFetch, sbReady } from './supabase.js';

export async function adminLogin(email, password) {
  if (!sbReady()) throw new Error('supabase_not_configured');

  const response = await fetch(
    CONFIG.supabase.url.replace(/\/$/, '') + '/auth/v1/token?grant_type=password',
    {
      method: 'POST',
      headers: sbHeaders(),
      body: JSON.stringify({ email, password })
    }
  );

  if (!response.ok) {
    const error = new Error('login_failed');
    try {
      error.detail = await response.text();
    } catch (_) {}
    throw error;
  }

  const session = await response.json();

  if (
    CONFIG.supabase.adminEmails.length &&
    !CONFIG.supabase.adminEmails.includes(session.user?.email)
  ) {
    throw new Error('not_admin');
  }

  state.adminSession = session;
  sessionStorage.setItem('hqv-admin-session', JSON.stringify(session));
  return session;
}

export async function restoreSession() {
  if (!sbReady()) return;

  try {
    const raw = sessionStorage.getItem('hqv-admin-session');
    if (!raw) return;

    state.adminSession = JSON.parse(raw);
    const response = await sbFetch('/auth/v1/user', { method: 'GET' });
    const user = await response.json();

    if (!user?.id) throw new Error('invalid');

    state.adminSession.user = user;
    sessionStorage.setItem('hqv-admin-session', JSON.stringify(state.adminSession));
  } catch (_) {
    state.adminSession = null;
    sessionStorage.removeItem('hqv-admin-session');
  }
}

export function logout() {
  state.adminSession = null;
  sessionStorage.removeItem('hqv-admin-session');
}
