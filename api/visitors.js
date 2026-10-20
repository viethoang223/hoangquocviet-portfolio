const { createHmac } = require('node:crypto');
const { isIP } = require('node:net');

function sendJson(response, status, body, cache = 'no-store') {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', cache);
  response.end(JSON.stringify(body));
}

function parseBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') return JSON.parse(request.body);
  return {};
}

function requestIp(request) {
  const direct = String(request.headers['x-real-ip'] || '').trim();
  const forwarded = String(request.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const candidate = direct || forwarded || String(request.socket?.remoteAddress || '').trim();
  return isIP(candidate) ? candidate : '';
}

function originAllowed(request) {
  const origin = request.headers.origin;
  const host = request.headers.host;
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch (_) {
    return false;
  }
}

function supabaseHeaders(serviceKey) {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json'
  };
}

async function supabaseRequest(url, serviceKey, path, options = {}) {
  const response = await fetch(`${url.replace(/\/$/, '')}${path}`, {
    ...options,
    headers: { ...supabaseHeaders(serviceKey), ...(options.headers || {}) }
  });
  if (!response.ok) throw new Error(`supabase_http_${response.status}`);
  return response;
}

async function isPortfolioAdmin(url, serviceKey, accessToken, ownerEmail) {
  const authHeaders = {
    apikey: serviceKey,
    Authorization: `Bearer ${accessToken}`
  };
  const userResponse = await fetch(`${url.replace(/\/$/, '')}/auth/v1/user`, { headers: authHeaders });
  if (!userResponse.ok) return false;
  const user = await userResponse.json();
  if (!/^[0-9a-f-]{36}$/i.test(String(user?.id || ''))) return false;
  if (String(user.email || '').trim().toLowerCase() !== ownerEmail.trim().toLowerCase()) return false;

  const adminResponse = await fetch(
    `${url.replace(/\/$/, '')}/rest/v1/portfolio_admins?select=user_id&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
    { headers: authHeaders }
  );
  if (!adminResponse.ok) {
    if (adminResponse.status === 401 || adminResponse.status === 403) return false;
    throw new Error(`admin_check_http_${adminResponse.status}`);
  }
  const admins = await adminResponse.json();
  return Array.isArray(admins) && admins.length > 0;
}

module.exports = async function visitors(request, response) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ipHashSecret = process.env.VISITOR_IP_HASH_SECRET;
  const ownerEmail = process.env.CONTACT_ADMIN_EMAIL;
  const missingConfig = Object.entries({
    SUPABASE_URL: supabaseUrl,
    SUPABASE_SERVICE_ROLE_KEY: serviceKey,
    VISITOR_IP_HASH_SECRET: ipHashSecret
  }).filter(([, value]) => !value).map(([name]) => name);

  if (missingConfig.length) {
    console.error('Visitor service configuration is incomplete. Missing:', missingConfig.join(', '));
    return sendJson(response, 503, { code: 'visitor_service_not_configured' });
  }
  if (Buffer.byteLength(ipHashSecret, 'utf8') < 32) {
    console.error('Visitor service configuration is invalid. VISITOR_IP_HASH_SECRET must be at least 32 bytes.');
    return sendJson(response, 503, { code: 'visitor_service_not_configured' });
  }

  if (request.method === 'GET') {
    try {
      const result = await supabaseRequest(supabaseUrl, serviceKey, '/rest/v1/rpc/hqv_visit_summary', {
        method: 'POST',
        body: '{}'
      });
      const total = Number(await result.json());
      if (!Number.isSafeInteger(total) || total < 0) throw new Error('invalid_visitor_summary');
      return sendJson(response, 200, { total }, 'public, max-age=2, s-maxage=2');
    } catch (error) {
      console.error('Visitor summary request failed', error?.message || 'unknown');
      return sendJson(response, 503, { code: 'visitor_summary_unavailable' });
    }
  }

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'GET, POST');
    return sendJson(response, 405, { code: 'method_not_allowed' });
  }
  if (!originAllowed(request)) return sendJson(response, 403, { code: 'origin_not_allowed' });

  let body;
  try { body = parseBody(request); }
  catch (_) { return sendJson(response, 400, { code: 'invalid_json' }); }

  if (body.action === 'admin-list') {
    if (!ownerEmail) {
      console.error('Visitor admin service configuration is incomplete. Missing: CONTACT_ADMIN_EMAIL');
      return sendJson(response, 503, { code: 'visitor_admin_not_configured' });
    }
    const accessToken = String(request.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!accessToken || accessToken.length > 4096) return sendJson(response, 401, { code: 'admin_auth_required' });
    try {
      if (!await isPortfolioAdmin(supabaseUrl, serviceKey, accessToken, ownerEmail)) {
        return sendJson(response, 403, { code: 'admin_not_authorized' });
      }
      const visitors = [];
      for (let offset = 0; ; offset += 1000) {
        const result = await supabaseRequest(
          supabaseUrl,
          serviceKey,
          `/rest/v1/hqv_visit_visitors?select=ip_address,visit_count,first_seen,last_seen&order=ip_hash.asc&limit=1000&offset=${offset}`
        );
        const batch = await result.json();
        if (!Array.isArray(batch)) throw new Error('invalid_visitor_admin_list');
        visitors.push(...batch);
        if (batch.length < 1000) break;
      }
      return sendJson(response, 200, { visitors });
    } catch (error) {
      console.error('Visitor admin list request failed', error?.message || 'unknown');
      return sendJson(response, 503, { code: 'visitor_admin_list_unavailable' });
    }
  }

  if (body.action !== 'record') return sendJson(response, 400, { code: 'invalid_action' });
  const ip = requestIp(request);
  if (!ip) return sendJson(response, 503, { code: 'client_ip_unavailable' });

  const ipHash = createHmac('sha256', ipHashSecret).update(ip).digest('hex');
  try {
    const result = await supabaseRequest(supabaseUrl, serviceKey, '/rest/v1/rpc/hqv_record_visit', {
      method: 'POST',
      body: JSON.stringify({ p_ip_hash: ipHash, p_ip_address: ip })
    });
    return sendJson(response, 200, await result.json());
  } catch (error) {
    console.error('Visitor record request failed', error?.message || 'unknown');
    return sendJson(response, 503, { code: 'visitor_record_unavailable' });
  }
};
