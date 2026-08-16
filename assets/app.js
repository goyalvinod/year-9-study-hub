/* ==========================================================
   SPA controller: routing, view rendering, gamification hooks.
   Routes:
     #/                              home
     #/<subject>                     subject hub
     #/<subject>/practice            mixed practice
     #/<subject>/topic/<key>         topic page
     #/badges                        badge gallery
   Depends on: Core, Questions, Content, Gamify, SVG.
   ========================================================== */
(function () {
  'use strict';

  const SUBJECTS = [
    { id: 'maths',     name: 'Mathematics', color: 'var(--c-maths)',     ready: true,
      note: 'Year 9 · GCSE Higher + Olympiad stretch', hero: () => window.SVG.mathsHero(), motto: 'Master the numbers, master the world.' },
    { id: 'physics',   name: 'Physics',     color: 'var(--c-physics)',   ready: true,
      note: 'Forces, energy, waves, electricity, space', hero: () => window.SVG.physicsHero(), motto: 'How the universe works — and why.' },
    { id: 'chemistry', name: 'Chemistry',   color: 'var(--c-chemistry)', ready: true,
      note: 'Atoms, bonds, reactions, moles', hero: () => window.SVG.chemistryHero(), motto: 'From atoms to everything.' },
    { id: 'computing', name: 'Computing',   color: 'var(--c-computing)', ready: true,
      note: 'Python, algorithms, binary, networks', hero: () => window.SVG.computingHero(), motto: 'Think like a computer, think like a scientist.' },
    { id: 'history',   name: 'History',     color: 'var(--c-history)',   ready: true,
      note: 'World wars, empire, cold war, revolutions', hero: () => window.SVG.historyHero(), motto: 'Every date, a story worth knowing.' },
    { id: 'geography', name: 'Geography',   color: 'var(--c-geography)', ready: true,
      note: 'Earth, weather, rivers, people', hero: () => window.SVG.geographyHero(), motto: 'The planet is your classroom.' }
  ];

  const app = () => document.getElementById('app');

  // ---------- helpers ----------
  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function pctString(correct, total) { if (!total) return '—'; return Math.round(correct / total * 100) + '%'; }
  function accuracyClass(correct, total) {
    if (!total) return '';
    const p = correct / total;
    if (p >= 0.8) return 'good';
    if (p >= 0.5) return '';
    return 'weak';
  }
  function crumbs(items) {
    const parts = items.map((it, i) => {
      if (i === items.length - 1) return `<span>${esc(it.label)}</span>`;
      return `<a href="${it.href}">${esc(it.label)}</a>`;
    });
    return `<div class="crumbs">${parts.join('<span class="sep">›</span>')}</div>`;
  }

  // ---------- practice widget ----------
  function mountPractice(mount, subjectId, sampler) {
    let current = null;
    mount.innerHTML = `
      <div class="q-topic-tag" id="pw-topic-tag">—</div>
      <div class="q-question" id="pw-question">Loading…</div>
      <div class="answer-row">
        <input type="text" id="pw-answer" placeholder="Your answer" autocomplete="off" autocapitalize="none" spellcheck="false">
        <button class="primary" id="pw-check">Check ✓</button>
      </div>
      <div class="hint" id="pw-hint"></div>
      <div id="pw-feedback"></div>
      <div id="pw-solution"></div>
      <div class="q-actions">
        <button class="ghost" id="pw-skip">Skip / show solution</button>
        <button class="ghost" id="pw-next" style="display:none">Next question →</button>
      </div>
    `;
    const $ = (id) => mount.querySelector('#' + id);

    function labelFor(topicKey) {
      const allTopics = (window.Questions.topics || []);
      const t = allTopics.find(t => t.key === topicKey);
      if (!t) return topicKey;
      let s = t.label;
      if (t.weak) s += ' <span style="color:var(--weak);">●</span>';
      if (t.olympiad) s += ' <span class="tag olympiad">olympiad</span>';
      return s;
    }

    function next() {
      current = sampler();
      if (!current) {
        $('pw-question').innerHTML = '<em style="color:var(--muted)">No questions available. Try enabling more topics.</em>';
        $('pw-topic-tag').textContent = '—';
        return;
      }
      current._answered = false;
      $('pw-topic-tag').innerHTML = labelFor(current.topic);
      $('pw-question').innerHTML = current.prompt;
      $('pw-hint').innerHTML = current.hint || '';
      $('pw-answer').value = '';
      $('pw-answer').className = '';
      $('pw-answer').disabled = false;
      $('pw-feedback').innerHTML = '';
      $('pw-solution').innerHTML = '';
      $('pw-check').style.display = '';
      $('pw-skip').style.display = '';
      $('pw-next').style.display = 'none';
      $('pw-answer').focus();
    }

    function showSolution() {
      const s = current.solution || [];
      $('pw-solution').innerHTML = `
        <div class="solution">
          <h3>Worked solution</h3>
          <ol>${s.map(line => `<li>${line}</li>`).join('')}</ol>
        </div>`;
    }

    function submit() {
      if (!current || current._answered) return;
      const val = $('pw-answer').value;
      if (!val.trim()) { $('pw-answer').focus(); return; }
      current._answered = true;
      const ok = window.Core.check(val, current);
      const xp = window.Core.recordAttempt(subjectId, current.topic, ok);
      updateTopBar();
      if (ok) {
        $('pw-answer').className = 'good';
        $('pw-feedback').innerHTML = `<div class="feedback good">
          <span class="xp-gain">+${xp} XP</span>
          ✓ Correct! Answer: <strong>${current.answer}</strong>
        </div>`;
      } else {
        $('pw-answer').className = 'bad';
        $('pw-feedback').innerHTML = `<div class="feedback bad">
          ${xp ? `<span class="xp-gain" style="background:var(--muted)">+${xp} XP</span>` : ''}
          ✗ Not quite. Correct answer: <strong>${current.answer}</strong>
        </div>`;
      }
      $('pw-answer').disabled = true;
      showSolution();
      $('pw-check').style.display = 'none';
      $('pw-skip').style.display = 'none';
      $('pw-next').style.display = '';
      $('pw-next').focus();
    }

    function skip() {
      if (!current) return;
      if (!current._answered) {
        current._answered = true;
        window.Core.recordAttempt(subjectId, current.topic, false);
        updateTopBar();
        $('pw-feedback').innerHTML = `<div class="feedback bad">Answer: <strong>${current.answer}</strong></div>`;
        $('pw-answer').className = 'bad';
        $('pw-answer').disabled = true;
      }
      showSolution();
      $('pw-check').style.display = 'none';
      $('pw-skip').style.display = 'none';
      $('pw-next').style.display = '';
      $('pw-next').focus();
    }

    $('pw-check').addEventListener('click', submit);
    $('pw-skip').addEventListener('click', skip);
    $('pw-next').addEventListener('click', next);
    $('pw-answer').addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });

    next();
  }

  // ---------- Top bar level/coin display ----------
  function updateTopBar() {
    const s = window.Core.state;
    const p = window.Gamify.progressToNext(s.xp || 0);
    const levelEl = document.getElementById('nav-level');
    const coinEl = document.getElementById('nav-coins');
    if (levelEl) levelEl.innerHTML = `${p.cur.icon} L${p.cur.level} · ${s.xp || 0} XP`;
    if (coinEl) coinEl.innerHTML = `🪙 ${s.coins || 0}`;
  }

  // ---------- HOME ----------
  function renderHome() {
    const s = window.Core.state;
    const g = s.global;
    const p = window.Gamify.progressToNext(s.xp || 0);
    const earned = window.Gamify.earnedBadges();

    const subjectCards = SUBJECTS.map(sub => {
      const st = window.Core.subjectStats(sub.id);
      const acc = pctString(st.correct, st.attempted);
      return `
        <a class="card subject ${sub.id}" href="#/${sub.id}">
          ${sub.hero()}
          <div class="card-body">
            <div class="card-title">${esc(sub.name)}</div>
            <div class="card-sub">${esc(sub.note)}</div>
            <div class="progress-row"><span>${st.attempted} attempted · ${acc}</span><span>${st.correct} correct</span></div>
            <div class="progress"><div class="bar ${accuracyClass(st.correct, st.attempted)}" style="width:${st.attempted ? (st.correct/st.attempted*100) : 0}%"></div></div>
          </div>
        </a>`;
    }).join('');

    const badgesStrip = earned.slice(-10).reverse().map(b => `
      <span class="badge-chip" title="${esc(b.desc)}"><span class="b-icon">${b.icon}</span>${esc(b.name)}</span>
    `).join('') || '<span class="badge-chip locked">No badges yet — answer a question!</span>';

    app().innerHTML = `
      <section class="hero">
        <div>
          <h1 class="hero-title">Year 9 Study Hub</h1>
          <p class="hero-sub">UK curriculum · GCSE Higher stretch · Olympiad prep. Learn every topic, then practise unlimited randomised questions. Earn XP, unlock badges, level up.</p>
        </div>
        <div>${window.SVG.mascot()}</div>
      </section>

      <div class="level-panel">
        <div class="lp-icon">${p.cur.icon}</div>
        <div class="lp-body">
          <div class="lp-name">Level ${p.cur.level} · ${esc(p.cur.name)}</div>
          <div class="lp-sub">${p.nxt ? `${p.need} XP until <strong>${esc(p.nxt.name)}</strong>` : `Top level reached!`}</div>
          <div class="progress" style="margin-top:8px"><div class="bar" style="width:${p.pct}%"></div></div>
        </div>
        <div class="lp-xp">${s.xp || 0} XP<br><span style="color:var(--weak);font-size:13px">🪙 ${s.coins || 0}</span></div>
      </div>

      <div class="dash-grid" style="grid-template-columns: repeat(auto-fit, minmax(120px, 1fr))">
        <div class="stat-big"><span class="n">${g.attempted}</span><span class="l">Attempted</span></div>
        <div class="stat-big"><span class="n">${pctString(g.correct, g.attempted)}</span><span class="l">Accuracy</span></div>
        <div class="stat-big"><span class="n">${g.streak}</span><span class="l">Current streak 🔥</span></div>
        <div class="stat-big"><span class="n">${g.best}</span><span class="l">Best streak</span></div>
        <div class="stat-big"><span class="n">${earned.length}</span><span class="l">Badges earned</span></div>
        <div class="stat-big"><span class="n">${window.Gamify.consecutiveDays()}</span><span class="l">Day streak 📅</span></div>
      </div>

      <div class="panel">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
          <strong style="font-size:15px">Recent badges</strong>
          <a href="#/badges" style="font-size:12px">View all →</a>
        </div>
        <div class="badges-strip">${badgesStrip}</div>
      </div>

      <h2>Pick a subject</h2>
      <div class="grid grid-2">${subjectCards}</div>

      <h2 style="margin-top:32px">How to use this site</h2>
      <div class="panel learn">
        <ul>
          <li><strong>Pick a subject → pick a topic</strong> to read the lesson (with diagrams, worked examples, and video links) then practise on the same page.</li>
          <li>Or use <strong>Mixed practice</strong> on any subject for a randomised mix — weak topics come up 2× as often.</li>
          <li>Every correct answer earns <strong>XP</strong>. Every 5 in a row, a bonus. Streaks unlock <strong>badges</strong>. Levels unlock new titles from 🌱 Curious Beginner all the way to 💎 Maths Olympian.</li>
          <li>Parents can review progress on the <a href="dashboard.html">dashboard</a>. Progress saves on this device automatically.</li>
        </ul>
      </div>
    `;
  }

  // ---------- SUBJECT HUB ----------
  function renderSubjectHub(subjectId) {
    const sub = SUBJECTS.find(s => s.id === subjectId);
    if (!sub) return render404();
    const topics = (window.Questions.topics || []).filter(t => t.subject === subjectId);
    if (!topics.length && subjectId !== 'maths') {
      app().innerHTML = `
        ${crumbs([{label:'Home', href:'#/'}, {label:sub.name}])}
        <h1>${sub.hero() ? sub.hero() : esc(sub.name)}</h1>
        <p class="lead">${esc(sub.name)} content is being added. Check back soon!</p>`;
      return;
    }
    // Maths has legacy topics without an explicit `subject` field — filter those in
    const mathsLegacyTopics = subjectId === 'maths'
      ? (window.Questions.topics || []).filter(t => !t.subject)
      : [];
    const allTopics = topics.concat(mathsLegacyTopics);

    const bySection = {};
    allTopics.forEach(t => {
      bySection[t.section] = bySection[t.section] || [];
      bySection[t.section].push(t);
    });
    const sectionOrder = sub.sectionOrder || ['Number', 'Algebra', 'Geometry', 'Data', 'Competition (IMC / Cayley)'];
    const sectionsToShow = sectionOrder.filter(s => bySection[s]).concat(Object.keys(bySection).filter(s => !sectionOrder.includes(s)));

    const sections = sectionsToShow.map(section => {
      const cards = bySection[section].map(t => {
        const st = window.Core.topicStats(subjectId, t.key);
        const pct = pctString(st.correct, st.total);
        const tags = [];
        if (t.weak) tags.push('<span class="tag weak">weak area</span>');
        if (t.olympiad) tags.push('<span class="tag olympiad">olympiad</span>');
        if (st.total >= 10 && st.correct / st.total >= 0.8) tags.push('<span class="tag mastered">mastered ✓</span>');
        return `
          <a class="card" href="#/${subjectId}/topic/${t.key}">
            <div class="card-title">${esc(t.label)}</div>
            <div style="margin: 4px 0 10px">${tags.join(' ')}</div>
            <div class="progress-row"><span>${st.total} attempts</span><span>${pct}</span></div>
            <div class="progress"><div class="bar ${accuracyClass(st.correct, st.total)}" style="width:${st.total ? (st.correct/st.total*100) : 0}%"></div></div>
          </a>`;
      }).join('');
      return `<div class="section-header">${esc(section)}</div><div class="grid grid-2">${cards}</div>`;
    }).join('');

    const st = window.Core.subjectStats(subjectId);
    app().innerHTML = `
      ${crumbs([{label:'Home', href:'#/'}, {label:sub.name}])}
      ${sub.hero ? `<div style="border-radius:14px; overflow:hidden; margin-bottom:14px">${sub.hero()}</div>` : ''}
      <h1>${esc(sub.name)}</h1>
      <p class="lead">${esc(sub.motto || sub.note)}</p>
      <div class="stats">
        <div class="stat"><strong>${st.attempted}</strong> attempted</div>
        <div class="stat"><strong>${pctString(st.correct, st.attempted)}</strong> accuracy</div>
        <a class="stat" href="#/${subjectId}/practice" style="color:var(--accent)">Mixed practice →</a>
      </div>
      ${sections}
    `;
  }

  // ---------- TOPIC PAGE ----------
  function renderTopicPage(subjectId, topicKey) {
    const topicMeta = (window.Questions.topics || []).find(t => t.key === topicKey);
    const subjectContent = window.Content[subjectId.toUpperCase()] || window.Content.MATHS;
    const content = subjectContent[topicKey];
    if (!topicMeta || !content) {
      app().innerHTML = `${crumbs([{label:'Home', href:'#/'}, {label:'Not found'}])}<h1>Topic not found</h1><p><a href="#/${subjectId}">Back to subject</a>.</p>`;
      return;
    }
    const sub = SUBJECTS.find(x => x.id === subjectId);
    const st = window.Core.topicStats(subjectId, topicKey);

    const diagram = content.diagram ? `<div>${content.diagram}</div>` : '';
    const formulas = (content.formulas || []).map(f =>
      `<div class="formula"><strong>${esc(f.name)}:</strong>&nbsp;&nbsp;<span class="math">${f.expr}</span></div>`
    ).join('');
    const examples = (content.examples || []).map((e, i) => `
      <div class="example">
        <h4>Example ${i + 1}</h4>
        <div><strong>Q.</strong> ${e.q}</div>
        <ol style="margin-top:6px">${e.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      </div>`).join('');
    const pitfalls = (content.pitfalls || []).map(p => `<div class="pitfall">${p}</div>`).join('');
    const videos = (content.videos || []).map(v => `
      <a class="video-card" href="${v.url}" target="_blank" rel="noopener">
        <div class="vt">${esc(v.title)}</div>
        <div class="vs">${v.badge ? `<span class="vp">${esc(v.badge)}</span>` : ''}${esc(v.source)}</div>
      </a>`).join('');
    const tags = [];
    if (topicMeta.weak) tags.push('<span class="tag weak">weak area — practise more</span>');
    if (topicMeta.olympiad) tags.push('<span class="tag olympiad">olympiad stretch</span>');

    app().innerHTML = `
      ${crumbs([{label:'Home', href:'#/'}, {label:sub.name, href:'#/'+subjectId}, {label:topicMeta.label}])}
      <h1>${esc(topicMeta.label)}</h1>
      <div style="margin-bottom:12px">${tags.join(' ')}</div>
      <div class="stats">
        <div class="stat"><strong>${st.total}</strong> attempts</div>
        <div class="stat"><strong>${pctString(st.correct, st.total)}</strong> accuracy</div>
        <div class="stat">streak <strong>${st.streak}</strong> 🔥</div>
      </div>

      ${diagram}
      <div class="panel learn">${content.blurb}</div>

      ${formulas ? `<h2>Key rules</h2>${formulas}` : ''}
      ${examples ? `<h2>Worked examples</h2>${examples}` : ''}
      ${pitfalls ? `<h2>Watch out for</h2>${pitfalls}` : ''}

      ${videos ? `<h2>Video walkthroughs & extra reading</h2><div class="videos">${videos}</div>` : ''}

      <div class="practice-block">
        <h2 style="margin-top:0">Practise: ${esc(topicMeta.label)}</h2>
        <p class="lead" style="margin-bottom:12px">Unlimited randomised questions. Every correct answer earns XP 🎯</p>
        <div id="practice-mount"></div>
      </div>
    `;
    mountPractice(document.getElementById('practice-mount'), subjectId, () => window.Questions.generate(topicKey));
  }

  // ---------- SUBJECT MIXED PRACTICE ----------
  function renderMixedPractice(subjectId) {
    const sub = SUBJECTS.find(s => s.id === subjectId);
    const topics = (window.Questions.topics || []).filter(t => t.subject === subjectId || (subjectId === 'maths' && !t.subject));
    const storageKey = `mixed_${subjectId}`;
    const savedRaw = localStorage.getItem(storageKey);
    let enabled;
    try { enabled = savedRaw ? new Set(JSON.parse(savedRaw)) : new Set(topics.filter(t => t.weak).map(t => t.key)); }
    catch { enabled = new Set(topics.filter(t => t.weak).map(t => t.key)); }
    if (!enabled.size) enabled = new Set(topics.map(t => t.key));

    const chips = topics.map(t => `
      <button class="chip ${enabled.has(t.key) ? 'on' : ''}" data-key="${t.key}">
        ${t.weak ? '<span class="dot"></span>' : ''}
        ${t.olympiad ? '<span class="oly">◆</span>' : ''}
        ${esc(t.label)}
      </button>
    `).join('');

    app().innerHTML = `
      ${crumbs([{label:'Home', href:'#/'}, {label:sub.name, href:'#/'+subjectId}, {label:'Mixed practice'}])}
      <h1>${esc(sub.name)} · Mixed practice</h1>
      <p class="lead">Pick which topics to be tested on. <span style="color:var(--weak)">●</span> = weak (2× frequency). <span style="color:var(--olympiad)">◆</span> = stretch.</p>

      <div class="panel">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
          <strong>Topics</strong>
          <div>
            <button class="ghost" id="btn-weak">Weak only</button>
            <button class="ghost" id="btn-all">All</button>
          </div>
        </div>
        <div class="topics" id="topics" style="display:flex; flex-wrap:wrap; gap:6px">${chips}</div>
      </div>

      <div class="practice-block">
        <h2 style="margin-top:0">Question</h2>
        <div id="practice-mount"></div>
      </div>
    `;

    function save() { localStorage.setItem(storageKey, JSON.stringify(Array.from(enabled))); }
    function refresh() { document.querySelectorAll('#topics .chip').forEach(c => c.classList.toggle('on', enabled.has(c.dataset.key))); }

    document.getElementById('topics').addEventListener('click', e => {
      const c = e.target.closest('.chip');
      if (!c) return;
      const k = c.dataset.key;
      if (enabled.has(k)) enabled.delete(k); else enabled.add(k);
      c.classList.toggle('on');
      save();
    });
    document.getElementById('btn-weak').addEventListener('click', () => {
      enabled = new Set(topics.filter(t => t.weak).map(t => t.key));
      if (!enabled.size) enabled = new Set(topics.map(t => t.key));
      refresh(); save();
    });
    document.getElementById('btn-all').addEventListener('click', () => {
      enabled = new Set(topics.map(t => t.key));
      refresh(); save();
    });

    mountPractice(
      document.getElementById('practice-mount'),
      subjectId,
      () => {
        if (!enabled.size) return null;
        // Reproduce weighting: weak topics 2×
        const pool = [];
        topics.forEach(t => {
          if (enabled.has(t.key)) {
            pool.push(t.key);
            if (t.weak) pool.push(t.key);
          }
        });
        if (!pool.length) return null;
        const k = pool[Math.floor(Math.random() * pool.length)];
        return window.Questions.generate(k);
      }
    );
  }

  // ---------- BADGE GALLERY ----------
  function renderBadges() {
    const s = window.Core.state;
    const tiles = window.Gamify.BADGES.map(b => {
      const earned = s.badges[b.id];
      return `
        <div class="badge-tile ${earned ? 'earned' : 'locked'}">
          <div class="b-icon">${b.icon}</div>
          <div class="b-name">${esc(b.name)}</div>
          <div class="b-desc">${esc(b.desc)}</div>
          ${earned ? `<div class="b-when">${new Date(earned).toLocaleDateString()}</div>` : ''}
        </div>`;
    }).join('');
    const p = window.Gamify.progressToNext(s.xp || 0);
    app().innerHTML = `
      ${crumbs([{label:'Home', href:'#/'}, {label:'Badges & levels'}])}
      <h1>Badges & levels</h1>
      <p class="lead">Level ${p.cur.level} — ${esc(p.cur.name)} ${p.cur.icon}. ${window.Gamify.earnedBadges().length} of ${window.Gamify.BADGES.length} badges unlocked.</p>

      <h2>Level ladder</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))">
        ${window.Gamify.LEVELS.map(lv => `
          <div class="stat-big ${(s.xp || 0) >= lv.minXP ? 'xp' : ''}">
            <div style="font-size:28px">${lv.icon}</div>
            <div style="font-weight:700; font-size:14px; margin-top:2px">${esc(lv.name)}</div>
            <div style="color:var(--muted); font-size:11px">L${lv.level} · ${lv.minXP} XP</div>
          </div>
        `).join('')}
      </div>

      <h2>Badges</h2>
      <div class="badge-grid">${tiles}</div>
    `;
  }

  // ---------- 404 ----------
  function render404() {
    app().innerHTML = `${crumbs([{label:'Home', href:'#/'}, {label:'404'}])}<h1>Page not found</h1><p><a href="#/">Back to home</a>.</p>`;
  }

  // ---------- Router ----------
  function route() {
    const hash = (location.hash || '#/').slice(1);
    const parts = hash.split('/').filter(Boolean);
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    const first = parts[0] || 'home';
    const active = document.querySelector(`.nav-link[data-route="${first}"]`);
    if (active) active.classList.add('active');
    window.scrollTo({top: 0, behavior: 'instant'});

    if (parts.length === 0) { renderHome(); updateTopBar(); return; }
    if (parts[0] === 'badges') { renderBadges(); updateTopBar(); return; }
    if (SUBJECTS.find(s => s.id === parts[0])) {
      if (parts.length === 1) { renderSubjectHub(parts[0]); updateTopBar(); return; }
      if (parts[1] === 'practice') { renderMixedPractice(parts[0]); updateTopBar(); return; }
      if (parts[1] === 'topic' && parts[2]) { renderTopicPage(parts[0], parts[2]); updateTopBar(); return; }
    }
    render404();
    updateTopBar();
  }

  window.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', () => { updateTopBar(); route(); });
})();
