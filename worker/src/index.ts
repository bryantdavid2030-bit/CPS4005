/**
 * Humn Sprt — Enquiry Worker
 *
 * Public endpoint that accepts JSON enquiries from the mobile app and
 * forwards them to hello@humnsprt.com via Resend. The Resend API key
 * is stored as a Worker secret and never reaches the client bundle.
 *
 * Routes:
 *   POST /enquiries   Accept and forward an enquiry
 *   GET  /health      Liveness probe (returns "ok")
 *
 * Deploy: see worker/README.md
 */

export interface Env {
  /** Resend API key — set via `wrangler secret put RESEND_API_KEY` */
  RESEND_API_KEY: string;
  /** Verified sender, e.g. "Humn Sprt <enquiries@humnsprt.com>" */
  RESEND_FROM: string;
  /** Destination inbox, e.g. "hello@humnsprt.com" */
  RESEND_TO: string;
  /** Comma-separated list of allowed origins, or "*" */
  ALLOWED_ORIGINS: string;
}

interface EnquiryPayload {
  coachId?: string;
  clientName: string;
  email: string;
  phone?: string;
  organisation?: string;
  type: 'individual' | 'concierge' | 'corporate';
  message: string;
  startDate?: string;
  /** Hidden honeypot — should always be empty for a real client */
  website?: string;
}

const MAX_BODY_BYTES = 16 * 1024;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') ?? '';
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ ok: true }, 200, cors);
    }

    if (request.method !== 'POST' || url.pathname !== '/enquiries') {
      return json({ error: 'Not found' }, 404, cors);
    }

    // Reject oversize bodies cheaply (Resend max email is ~40 MB but we
    // never need anything close).
    const contentLength = Number(request.headers.get('Content-Length') ?? '0');
    if (contentLength > MAX_BODY_BYTES) {
      return json({ error: 'Payload too large' }, 413, cors);
    }

    let payload: EnquiryPayload;
    try {
      payload = (await request.json()) as EnquiryPayload;
    } catch {
      return json({ error: 'Invalid JSON' }, 400, cors);
    }

    // Honeypot — silently succeed so bots get no signal.
    if (payload.website && payload.website.trim().length > 0) {
      return json({ ok: true }, 200, cors);
    }

    const validation = validate(payload);
    if (validation) {
      return json({ error: validation }, 400, cors);
    }

    const subject = subjectLine(payload);
    const text = renderText(payload, request);
    const html = renderHtml(payload, request);

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.RESEND_FROM,
          to: [env.RESEND_TO],
          reply_to: payload.email,
          subject,
          text,
          html,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error('resend error', res.status, detail);
        return json({ error: 'Upstream email error' }, 502, cors);
      }

      return json({ ok: true }, 200, cors);
    } catch (err) {
      console.error('worker error', err);
      return json({ error: 'Unexpected error' }, 500, cors);
    }
  },
};

// ————————————————————————————————————————————————————————————————

function validate(p: EnquiryPayload): string | null {
  if (!p || typeof p !== 'object') return 'Body must be an object';
  if (!isNonEmptyString(p.clientName, 1, 120)) return 'clientName required';
  if (!isEmail(p.email)) return 'email invalid';
  if (!isNonEmptyString(p.message, 10, 4000)) {
    return 'message must be 10–4000 chars';
  }
  if (!['individual', 'concierge', 'corporate'].includes(p.type)) {
    return 'type must be individual | concierge | corporate';
  }
  if (p.coachId !== undefined && !isNonEmptyString(p.coachId, 1, 64)) {
    return 'coachId invalid';
  }
  if (p.phone !== undefined && !isNonEmptyString(p.phone, 1, 40)) {
    return 'phone invalid';
  }
  if (p.organisation !== undefined && !isNonEmptyString(p.organisation, 1, 200)) {
    return 'organisation invalid';
  }
  if (p.startDate !== undefined && !isNonEmptyString(p.startDate, 1, 40)) {
    return 'startDate invalid';
  }
  return null;
}

function isNonEmptyString(v: unknown, min: number, max: number): v is string {
  return typeof v === 'string' && v.trim().length >= min && v.length <= max;
}

function isEmail(v: unknown): v is string {
  if (typeof v !== 'string') return false;
  // Permissive but bounded.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 200;
}

function subjectLine(p: EnquiryPayload): string {
  const flavour =
    p.type === 'concierge'
      ? 'Concierge'
      : p.type === 'corporate'
        ? 'Corporate'
        : 'Individual';
  const target = p.coachId ? ` · ${p.coachId}` : '';
  return `[Humn Sprt] ${flavour} enquiry from ${p.clientName}${target}`;
}

function renderText(p: EnquiryPayload, req: Request): string {
  const ip = req.headers.get('CF-Connecting-IP') ?? 'unknown';
  const ua = req.headers.get('User-Agent') ?? 'unknown';
  const country = req.headers.get('CF-IPCountry') ?? 'unknown';
  const lines = [
    `New enquiry from the Humn Sprt app`,
    ``,
    `Type:         ${p.type}`,
    `Name:         ${p.clientName}`,
    `Email:        ${p.email}`,
    p.phone ? `Phone:        ${p.phone}` : null,
    p.organisation ? `Organisation: ${p.organisation}` : null,
    p.coachId ? `Coach:        ${p.coachId}` : null,
    p.startDate ? `Start:        ${p.startDate}` : null,
    ``,
    `Message:`,
    p.message,
    ``,
    `— meta —`,
    `IP:      ${ip}`,
    `Country: ${country}`,
    `UA:      ${ua}`,
  ];
  return lines.filter((l) => l !== null).join('\n');
}

function renderHtml(p: EnquiryPayload, req: Request): string {
  const ip = escape(req.headers.get('CF-Connecting-IP') ?? 'unknown');
  const country = escape(req.headers.get('CF-IPCountry') ?? 'unknown');
  const row = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:6px 12px 6px 0;color:#55565A;font-size:13px;">${label}</td><td style="padding:6px 0;color:#0B0B0C;font-size:14px;">${escape(value)}</td></tr>`
      : '';
  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FAF8F3;padding:24px;color:#0B0B0C;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #EFEAE0;border-radius:12px;padding:32px;">
    <div style="font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#C8A96A;">Humn Sprt</div>
    <h1 style="font-size:22px;margin:8px 0 24px;font-weight:500;">New enquiry</h1>
    <table style="width:100%;border-collapse:collapse;">
      ${row('Type', p.type)}
      ${row('Name', p.clientName)}
      ${row('Email', p.email)}
      ${row('Phone', p.phone)}
      ${row('Organisation', p.organisation)}
      ${row('Coach', p.coachId)}
      ${row('Start', p.startDate)}
    </table>
    <hr style="border:none;border-top:1px solid #EFEAE0;margin:24px 0;" />
    <div style="font-size:13px;color:#55565A;margin-bottom:6px;">MESSAGE</div>
    <div style="white-space:pre-wrap;font-size:15px;line-height:1.55;">${escape(p.message)}</div>
    <hr style="border:none;border-top:1px solid #EFEAE0;margin:24px 0;" />
    <div style="font-size:11px;color:#A7A8AC;">IP ${ip} · ${country}</div>
  </div>
</body></html>`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function corsHeaders(origin: string, allowed: string): HeadersInit {
  const list = (allowed ?? '*')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const allow =
    list.includes('*') || list.includes(origin) ? origin || '*' : list[0] ?? '*';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, extra: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  });
}
