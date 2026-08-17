/*
 * study-hub-sync — tiny Cloudflare Worker that stores one JSON blob
 * per user in KV, protected by a shared bearer token.
 *
 * Endpoints:
 *   GET  /state?u=<user>   -> { state, updated_at }
 *   PUT  /state?u=<user>   body: <state JSON>
 *   OPTIONS *              -> CORS preflight
 *
 * KV key: state:<user>            (JSON: { state, updated_at })
 * Auth:   Authorization: Bearer <SYNC_TOKEN>
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
};

const USER_RE = /^[a-z0-9_-]{1,32}$/i;
const MAX_BODY = 512 * 1024;

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS, ...extra },
  });
}

function unauthorized() {
  return json({ error: 'unauthorized' }, 401);
}

function checkAuth(request, env) {
  const h = request.headers.get('Authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return false;
  const token = m[1].trim();
  if (!env.SYNC_TOKEN) return false;
  if (token.length !== env.SYNC_TOKEN.length) return false;
  let mismatch = 0;
  for (let i = 0; i < token.length; i++) mismatch |= token.charCodeAt(i) ^ env.SYNC_TOKEN.charCodeAt(i);
  return mismatch === 0;
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

    const url = new URL(request.url);
    if (url.pathname !== '/state') return json({ error: 'not_found' }, 404);

    if (!checkAuth(request, env)) return unauthorized();

    const user = (url.searchParams.get('u') || 'ishaan').toLowerCase();
    if (!USER_RE.test(user)) return json({ error: 'invalid_user' }, 400);
    const key = `state:${user}`;

    if (request.method === 'GET') {
      const raw = await env.STUDY_HUB.get(key);
      if (!raw) return json({ state: null, updated_at: null });
      try { return json(JSON.parse(raw)); }
      catch { return json({ state: null, updated_at: null }); }
    }

    if (request.method === 'PUT') {
      const len = Number(request.headers.get('Content-Length') || 0);
      if (len > MAX_BODY) return json({ error: 'too_large' }, 413);
      let state;
      try { state = await request.json(); }
      catch { return json({ error: 'invalid_json' }, 400); }
      if (!state || typeof state !== 'object' || Array.isArray(state)) {
        return json({ error: 'invalid_state' }, 400);
      }
      const record = { state, updated_at: new Date().toISOString() };
      await env.STUDY_HUB.put(key, JSON.stringify(record));
      return json({ ok: true, updated_at: record.updated_at });
    }

    return json({ error: 'method_not_allowed' }, 405);
  },
};
