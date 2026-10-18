const { createHmac } = require('node:crypto');

const CONTACT_TO = 'viet.hq.work@gmail.com';
const LIMITS = { name: [2, 80], email: [6, 254], message: [20, 4000] };

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.end(JSON.stringify(body));
}

function charCount(value) {
  return [...String(value || '')].length;
}

function requestIp(request) {
  const direct = request.headers['x-real-ip'];
  if (direct) return String(direct).trim();
  const forwarded = String(request.headers['x-forwarded-for'] || '').split(',').map(value => value.trim()).filter(Boolean);
  return forwarded[0] || String(request.socket?.remoteAddress || '').trim();
}

function blockMessages(incident, retryAfter, permanent) {
  if (permanent) {
    return {
      message_vi: 'Yêu cầu gửi tin đã bị chặn vĩnh viễn do nhiều lần gửi bị xác định là spam. Nếu đây là nhầm lẫn, vui lòng liên hệ qua kênh khác.',
      message_en: 'Message sending has been permanently blocked after repeated spam incidents. If this is a mistake, please use another contact channel.'
    };
  }
  const minutes = Math.max(1, Math.ceil(retryAfter / 60));
  const waitVi = minutes < 60 ? `${minutes} phút` : minutes < 1440 ? `${Math.ceil(minutes / 60)} giờ` : `${Math.ceil(minutes / 1440)} ngày`;
  const waitEn = minutes < 60 ? `${minutes} minute(s)` : minutes < 1440 ? `${Math.ceil(minutes / 60)} hour(s)` : `${Math.ceil(minutes / 1440)} day(s)`;
  return {
    message_vi: `Hệ thống tạm chặn gửi tin vì phát hiện gửi liên tục hoặc có dấu hiệu spam (lần ${incident}). Bạn có thể thử lại sau ${waitVi}; nếu thao tác bị nhầm, quyền gửi sẽ tự mở lại.`,
    message_en: `Sending is temporarily blocked because repeated or spam-like activity was detected (incident ${incident}). Try again in ${waitEn}; access will reopen automatically.`
  };
}

function parseBody(request) {
  if (request.body && typeof request.body === 'object') return request.body;
  if (typeof request.body === 'string') return JSON.parse(request.body);
  return {};
}

module.exports = async function contact(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { code: 'method_not_allowed' });
  }

  const origin = request.headers.origin;
  const host = request.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return sendJson(response, 403, { code: 'origin_not_allowed' });
    } catch (_) {
      return sendJson(response, 403, { code: 'origin_not_allowed' });
    }
  }

  let body;
  try { body = parseBody(request); }
  catch (_) { return sendJson(response, 400, { code: 'invalid_json' }); }

  if (String(body.honeypot || '').trim()) return sendJson(response, 200, { ok: true });

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (charCount(name) < LIMITS.name[0] || charCount(name) > LIMITS.name[1]
    || charCount(email) < LIMITS.email[0] || charCount(email) > LIMITS.email[1] || !emailPattern.test(email)
    || charCount(message) < LIMITS.message[0] || charCount(message) > LIMITS.message[1]) {
    return sendJson(response, 400, { code: 'validation_failed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ipHashSecret = process.env.CONTACT_IP_HASH_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!supabaseUrl || !serviceKey || !ipHashSecret || !resendKey || !fromEmail) {
    return sendJson(response, 503, { code: 'contact_service_not_configured' });
  }

  const ip = requestIp(request);
  if (!ip) return sendJson(response, 503, { code: 'client_ip_unavailable' });
  const ipHash = createHmac('sha256', ipHashSecret).update(ip).digest('hex');

  let rateLimit;
  try {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/hqv_contact_rate_limit`, {
      method: 'POST',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_ip_hash: ipHash })
    });
    if (!response.ok) throw new Error(`rate_limit_http_${response.status}`);
    rateLimit = await response.json();
  } catch (error) {
    console.error('Contact rate-limit service failed', error?.message || 'unknown');
    return sendJson(response, 503, { code: 'contact_rate_limit_unavailable' });
  }

  if (!rateLimit?.allowed) {
    const retryAfter = Number(rateLimit.retry_after_seconds) || 0;
    const messages = blockMessages(Number(rateLimit.incidents) || 1, retryAfter, !!rateLimit.permanent);
    if (retryAfter > 0) response.setHeader('Retry-After', String(retryAfter));
    return sendJson(response, 429, { code: 'spam_blocked', ...messages });
  }

  const safeName = name.replace(/[\r\n]+/g, ' ').slice(0, LIMITS.name[1]);
  try {
    const mail = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromEmail,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Portfolio message from ${safeName}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      })
    });
    if (!mail.ok) {
      console.error('Contact email provider returned HTTP', mail.status);
      return sendJson(response, 502, { code: 'email_delivery_failed' });
    }
  } catch (error) {
    console.error('Contact email delivery failed', error?.message || 'unknown');
    return sendJson(response, 502, { code: 'email_delivery_failed' });
  }

  return sendJson(response, 200, { ok: true });
};