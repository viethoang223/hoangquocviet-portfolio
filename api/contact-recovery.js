const { createHmac, timingSafeEqual } = require('node:crypto');

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

function requestIp(request) {
  const forwarded = String(request.headers['x-forwarded-for'] || '').split(',').map(value => value.trim()).filter(Boolean);
  return String(request.headers['x-real-ip'] || forwarded[0] || request.socket?.remoteAddress || '').trim();
}

function decodeBase32(secret) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const normalized = String(secret || '').toUpperCase().replace(/=+$/g, '').replace(/\s+/g, '');
  let bits = '';
  for (const char of normalized) {
    const value = alphabet.indexOf(char);
    if (value < 0) throw new Error('invalid_totp_secret');
    bits += value.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let offset = 0; offset + 8 <= bits.length; offset += 8) bytes.push(parseInt(bits.slice(offset, offset + 8), 2));
  return Buffer.from(bytes);
}

function verifyTotp(secret, token, now = Date.now()) {
  if (!/^\d{6}$/.test(String(token || ''))) return false;
  const key = decodeBase32(secret);
  if (key.length < 20) throw new Error('totp_secret_too_short');
  let matched = false;
  for (let offset = -1; offset <= 1; offset++) {
    const counter = BigInt(Math.floor(now / 30000) + offset);
    const message = Buffer.alloc(8);
    message.writeBigUInt64BE(counter);
    const digest = createHmac('sha1', key).update(message).digest();
    const index = digest[digest.length - 1] & 0x0f;
    const code = String((digest.readUInt32BE(index) & 0x7fffffff) % 1000000).padStart(6, '0');
    matched = timingSafeEqual(Buffer.from(code), Buffer.from(String(token))) || matched;
  }
  return matched;
}

function parseBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') return JSON.parse(request.body);
  return {};
}

module.exports = async function contactRecovery(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { code: 'method_not_allowed' });
  }

  let body;
  try { body = parseBody(request); }
  catch (_) { return sendJson(response, 400, { code: 'invalid_json' }); }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ipHashSecret = process.env.CONTACT_IP_HASH_SECRET;
  const adminEmail = process.env.CONTACT_ADMIN_EMAIL;
  const totpSecret = process.env.CONTACT_ADMIN_TOTP_SECRET;
  if (!supabaseUrl || !serviceKey || !ipHashSecret || !adminEmail || !totpSecret) {
    return sendJson(response, 503, { code: 'recovery_not_configured' });
  }

  const ip = requestIp(request);
  if (!ip) return sendJson(response, 503, { code: 'client_ip_unavailable' });
  let validCode = false;
  try {
    const email = String(body.email || '').trim().toLowerCase();
    validCode = email === adminEmail.trim().toLowerCase() && verifyTotp(totpSecret, body.code);
  } catch (_) {
    return sendJson(response, 503, { code: 'recovery_not_configured' });
  }

  const ipHash = createHmac('sha256', ipHashSecret).update(ip).digest('hex');
  try {
    const result = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/hqv_contact_admin_recovery`, {
      method: 'POST',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_ip_hash: ipHash, p_code_valid: validCode })
    });
    if (!result.ok) throw new Error(`recovery_http_${result.status}`);
    const outcome = await result.json();
    if (outcome?.locked) {
      response.setHeader('Retry-After', String(outcome.retry_after_seconds || 900));
      return sendJson(response, 429, { code: 'recovery_temporarily_locked' });
    }
    if (!outcome?.cleared) return sendJson(response, 400, { code: 'recovery_invalid_credentials' });
    return sendJson(response, 200, { ok: true });
  } catch (error) {
    console.error('Contact recovery service failed', error?.message || 'unknown');
    return sendJson(response, 503, { code: 'recovery_unavailable' });
  }
};