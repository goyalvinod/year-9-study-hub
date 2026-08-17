/* ==========================================================
   sync.js — cross-device progress sync via Cloudflare Worker.

   Reads runtime config from window.SYNC_CONFIG:
     { url: "https://…workers.dev", token: "…", user: "ishaan" }

   Public API on window.Sync:
     .configured             boolean
     .status                 'idle' | 'pulling' | 'pushing' | 'error' | 'ok'
     .lastUpdatedAt          ISO string of last known server timestamp
     .pull()                 Promise<changed:boolean>   fetch server → replace local if newer
     .push()                 Promise<void>              PUT current state (debounced via onSave)
     .onSave()               fire-and-forget debounced push (called by Core.save())

   Events on document: 'sync:changed'  when a pull replaced local state.
   ========================================================== */
(function () {
  'use strict';

  const cfg = window.SYNC_CONFIG || null;
  const configured = !!(cfg && cfg.url && cfg.token);

  const state = {
    configured,
    status: 'idle',
    lastUpdatedAt: null,
    _pushTimer: null,
    _lastPushSerialised: null,
    _lastPulledAt: 0,
    _inflightPull: null,
    _lastLocalSaveAt: 0,
  };
  // A pull that lands during/right after a local save could clobber the new
  // state with the older server copy before the push completes. Skip pulls
  // for this many ms after a save (long enough to cover debounce + PUT).
  const PULL_SUPPRESS_MS = 2500;

  function setStatus(s) {
    if (state.status === s) return;
    state.status = s;
    document.dispatchEvent(new CustomEvent('sync:status', { detail: s }));
  }

  function url(path) {
    const base = cfg.url.replace(/\/+$/, '');
    const u = new URL(base + path);
    u.searchParams.set('u', cfg.user || 'ishaan');
    return u.toString();
  }

  function headers(extra) {
    return Object.assign({ Authorization: 'Bearer ' + cfg.token }, extra || {});
  }

  async function pull() {
    if (!configured) return false;
    if (state._inflightPull) return state._inflightPull;
    if (Date.now() - state._lastLocalSaveAt < PULL_SUPPRESS_MS) return false;
    state._inflightPull = (async () => {
      setStatus('pulling');
      try {
        const r = await fetch(url('/state'), { headers: headers(), cache: 'no-store' });
        if (!r.ok) throw new Error('http ' + r.status);
        const body = await r.json();
        state._lastPulledAt = Date.now();
        if (!body || !body.state) { setStatus('ok'); return false; }

        const remoteUpdated = body.updated_at || null;
        const local = window.Core && window.Core.state;
        if (!local) { setStatus('ok'); return false; }

        const remote = body.state;
        // If nothing changed since our last successful pull/push, skip the merge.
        const remoteSer = JSON.stringify(remote);
        if (remoteSer === state._lastPushSerialised) {
          state.lastUpdatedAt = remoteUpdated;
          setStatus('ok');
          return false;
        }

        // Replace local state in place (Core holds a reference).
        for (const k of Object.keys(local)) delete local[k];
        Object.assign(local, remote);

        // Persist so a next reload picks it up before pull returns.
        try { localStorage.setItem('study_hub_v2', remoteSer); } catch (_) {}

        state.lastUpdatedAt = remoteUpdated;
        state._lastPushSerialised = remoteSer;
        setStatus('ok');
        document.dispatchEvent(new CustomEvent('sync:changed', { detail: { updated_at: remoteUpdated } }));
        return true;
      } catch (e) {
        setStatus('error');
        return false;
      } finally {
        state._inflightPull = null;
      }
    })();
    return state._inflightPull;
  }

  async function push() {
    if (!configured || !window.Core || !window.Core.state) return;
    const body = JSON.stringify(window.Core.state);
    if (body === state._lastPushSerialised) return;
    setStatus('pushing');
    try {
      const r = await fetch(url('/state'), {
        method: 'PUT',
        headers: headers({ 'Content-Type': 'application/json' }),
        body,
      });
      if (!r.ok) throw new Error('http ' + r.status);
      const j = await r.json().catch(() => ({}));
      state._lastPushSerialised = body;
      state.lastUpdatedAt = j.updated_at || new Date().toISOString();
      setStatus('ok');
    } catch (e) {
      setStatus('error');
    }
  }

  function onSave() {
    if (!configured) return;
    state._lastLocalSaveAt = Date.now();
    if (state._pushTimer) clearTimeout(state._pushTimer);
    state._pushTimer = setTimeout(() => { state._pushTimer = null; push(); }, 600);
  }

  window.Sync = {
    get configured() { return state.configured; },
    get status() { return state.status; },
    get lastUpdatedAt() { return state.lastUpdatedAt; },
    pull, push, onSave,
  };

  // Kick off an initial pull as soon as Core is present.
  function boot() {
    if (!configured) return;
    if (!window.Core) { setTimeout(boot, 30); return; }
    pull();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
