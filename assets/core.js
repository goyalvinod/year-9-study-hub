/* ==========================================================
   Core utilities: RNG helpers, answer normalisation & check,
   localStorage-backed progress store, event log for dashboard.
   Exposed on window.Core.
   ========================================================== */
(function () {
  'use strict';

  // ---------- Random helpers ----------
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const pickN = (arr, n) => {
    const c = arr.slice();
    const out = [];
    while (out.length < n && c.length) {
      out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]);
    }
    return out;
  };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const fmtFrac = (num, den) => {
    if (den === 0) return '?';
    const g = gcd(num, den);
    num /= g; den /= g;
    if (den < 0) { num = -num; den = -den; }
    if (den === 1) return String(num);
    return `${num}/${den}`;
  };

  // ---------- Answer normalisation ----------
  function sortMonomial(s) {
    const parts = s.split(/(?=[+\-])/);
    return parts.map(p => {
      const m = p.match(/^([+\-]?\d*(?:\.\d+)?(?:\/\d+)?)/);
      let head = m ? m[0] : '';
      let rest = p.slice(head.length);
      const vars = [];
      while (rest.length) {
        const vm = rest.match(/^([a-z]+)(\^\(?[+\-]?[\d/.]+\)?)?/);
        if (!vm) break;
        vars.push({ name: vm[1], exp: vm[2] || '' });
        rest = rest.slice(vm[0].length);
      }
      vars.sort((a, b) => a.name.localeCompare(b.name));
      return head + vars.map(v => v.name + v.exp).join('') + rest;
    }).join('');
  }

  function normalize(s) {
    if (s === null || s === undefined) return '';
    s = String(s).trim().toLowerCase();
    s = s.replace(/π/g, 'pi');
    s = s.replace(/√/g, 'sqrt');
    s = s.replace(/\broot\s*/g, 'sqrt');
    s = s.replace(/\s+/g, '');
    s = s.replace(/×/g, '*').replace(/·/g, '*');
    s = s.replace(/\*\*/g, '^');
    s = s.replace(/\*/g, '');
    s = s.replace(/°/g, '');
    s = s.replace(/sqrt(\d+)/g, 'sqrt($1)');
    s = s.replace(/([a-z])(\d)/g, '$1^$2');
    s = s.replace(/\^1(?!\d)/g, '');
    s = sortMonomial(s);
    return s;
  }

  function numericMatch(input, expected, tol) {
    tol = tol == null ? 0.01 : tol;
    const f = (s) => {
      if (typeof s === 'number') return s;
      s = String(s).replace(/\s+/g, '');
      if (/^-?\d+\/-?\d+$/.test(s)) {
        const [a, b] = s.split('/').map(Number);
        return b === 0 ? NaN : a / b;
      }
      const n = Number(s);
      return isNaN(n) ? NaN : n;
    };
    const a = f(input);
    const b = f(expected);
    if (isNaN(a) || isNaN(b)) return false;
    if (b === 0) return Math.abs(a) < tol;
    return Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  }

  function check(userAnswer, q) {
    const u = normalize(userAnswer);
    if (!u) return false;
    const candidates = [q.answer].concat(q.accepts || []);
    for (const c of candidates) {
      if (c != null && normalize(c) === u) return true;
    }
    if (q.numeric !== undefined && q.numeric !== null) {
      if (numericMatch(userAnswer, q.numeric, q.tol || 0.01)) return true;
    }
    return false;
  }

  // ---------- Storage ----------
  const KEY = 'study_hub_v2';

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function emptyState() {
    return {
      version: 2,
      created: new Date().toISOString(),
      // Per-topic stats: { correct, total, streak, best, lastSeen (ISO), history: [ISO timestamps of correct] }
      topics: {},
      // Per-day counts for heatmap: { 'YYYY-MM-DD': { attempted, correct } }
      daily: {},
      // Global counters
      global: { attempted: 0, correct: 0, streak: 0, best: 0, lastSeen: null },
      // Subject aggregates for the home page — computed on the fly, but store attempted/correct here too.
      subjects: {}
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return emptyState();
      const s = JSON.parse(raw);
      if (!s || s.version !== 2) return emptyState();
      // Fill missing fields defensively
      s.topics = s.topics || {};
      s.daily = s.daily || {};
      s.global = s.global || { attempted: 0, correct: 0, streak: 0, best: 0, lastSeen: null };
      s.subjects = s.subjects || {};
      return s;
    } catch (_) {
      return emptyState();
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }

  const state = load();

  function ensureTopic(topicId) {
    if (!state.topics[topicId]) {
      state.topics[topicId] = {
        correct: 0, total: 0, streak: 0, best: 0,
        lastSeen: null, history: []
      };
    }
    return state.topics[topicId];
  }

  function ensureSubject(subjectId) {
    if (!state.subjects[subjectId]) {
      state.subjects[subjectId] = { attempted: 0, correct: 0, lastSeen: null };
    }
    return state.subjects[subjectId];
  }

  function recordAttempt(subjectId, topicKey, correct) {
    const topicId = `${subjectId}.${topicKey}`;
    const t = ensureTopic(topicId);
    const s = ensureSubject(subjectId);
    const dk = todayKey();
    state.daily[dk] = state.daily[dk] || { attempted: 0, correct: 0 };

    t.total += 1;
    s.attempted += 1;
    state.global.attempted += 1;
    state.daily[dk].attempted += 1;
    t.lastSeen = new Date().toISOString();
    s.lastSeen = t.lastSeen;
    state.global.lastSeen = t.lastSeen;

    if (correct) {
      t.correct += 1;
      s.correct += 1;
      state.global.correct += 1;
      state.daily[dk].correct += 1;
      t.streak += 1;
      state.global.streak += 1;
      if (t.streak > t.best) t.best = t.streak;
      if (state.global.streak > state.global.best) state.global.best = state.global.streak;
      // Keep last 30 correct timestamps for the recent history graph
      t.history.push(t.lastSeen);
      if (t.history.length > 30) t.history.shift();
    } else {
      t.streak = 0;
      state.global.streak = 0;
    }
    save();
  }

  function topicStats(subjectId, topicKey) {
    const id = `${subjectId}.${topicKey}`;
    return state.topics[id] || { correct: 0, total: 0, streak: 0, best: 0, lastSeen: null, history: [] };
  }

  function subjectStats(subjectId) {
    return state.subjects[subjectId] || { attempted: 0, correct: 0, lastSeen: null };
  }

  function resetAll() {
    for (const k of Object.keys(state)) delete state[k];
    Object.assign(state, emptyState());
    save();
  }

  function exportJSON() {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object') throw new Error('Not a valid backup file.');
    if (parsed.version !== 2) throw new Error('Backup file is a different version.');
    for (const k of Object.keys(state)) delete state[k];
    Object.assign(state, parsed);
    save();
  }

  // ---------- Public API ----------
  window.Core = {
    rand, pick, pickN, gcd, fmtFrac,
    normalize, numericMatch, check,
    state, save,
    ensureTopic, ensureSubject, recordAttempt,
    topicStats, subjectStats,
    resetAll, exportJSON, importJSON,
    todayKey
  };
})();
