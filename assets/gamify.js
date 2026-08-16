/* ==========================================================
   Gamification: XP, levels, badges, celebration animations.
   Extends Core with awardXP() and badge tracking, and exposes
   Gamify.showLevelUp(), Gamify.confetti(), Gamify.toast().
   ========================================================== */
(function () {
  'use strict';
  if (!window.Core) { console.error('gamify.js loaded before core.js'); return; }

  // ---------- Ensure gamification state on Core.state ----------
  const s = window.Core.state;
  if (!s.xp) s.xp = 0;
  if (!s.level) s.level = 1;
  if (!s.badges) s.badges = {}; // {badgeId: earnedISO}
  if (!s.coins) s.coins = 0;
  if (!s.dailyClaimed) s.dailyClaimed = null; // last ISO date the daily bonus was claimed
  window.Core.save();

  // ---------- Level table ----------
  const LEVELS = [
    { level: 1, name: 'Curious Beginner',  minXP: 0,     icon: '🌱' },
    { level: 2, name: 'Rising Star',       minXP: 100,   icon: '⭐' },
    { level: 3, name: 'Apprentice',        minXP: 250,   icon: '📘' },
    { level: 4, name: 'Scholar',           minXP: 500,   icon: '🎓' },
    { level: 5, name: 'Bright Spark',      minXP: 900,   icon: '✨' },
    { level: 6, name: 'Sage',              minXP: 1500,  icon: '🔮' },
    { level: 7, name: 'Master',            minXP: 2500,  icon: '🏆' },
    { level: 8, name: 'Grand Master',      minXP: 4000,  icon: '👑' },
    { level: 9, name: 'Legend',            minXP: 6500,  icon: '🌟' },
    { level: 10, name: 'Genius',           minXP: 10000, icon: '🧠' },
    { level: 11, name: 'Study Titan',      minXP: 15000, icon: '⚡' },
    { level: 12, name: 'Maths Olympian',   minXP: 25000, icon: '💎' }
  ];

  function levelFromXP(xp) {
    let l = LEVELS[0];
    for (const lv of LEVELS) { if (xp >= lv.minXP) l = lv; }
    return l;
  }

  function nextLevel(xp) {
    for (const lv of LEVELS) { if (xp < lv.minXP) return lv; }
    return null;
  }

  function progressToNext(xp) {
    const cur = levelFromXP(xp);
    const nxt = nextLevel(xp);
    if (!nxt) return { pct: 100, cur, nxt: null, need: 0 };
    const span = nxt.minXP - cur.minXP;
    const done = xp - cur.minXP;
    return { pct: Math.min(100, Math.round(done / span * 100)), cur, nxt, need: nxt.minXP - xp };
  }

  // ---------- Badge catalog ----------
  const BADGES = [
    // Milestones
    { id: 'first-step', name: 'First Step',      desc: 'Answer your first question',       icon: '👣', check: (s) => s.global.correct >= 1 },
    { id: 'ten-up',     name: 'Ten Up',          desc: 'Answer 10 questions correctly',    icon: '🔟', check: (s) => s.global.correct >= 10 },
    { id: 'half-ton',   name: 'Half Ton',        desc: '50 correct answers',               icon: '💪', check: (s) => s.global.correct >= 50 },
    { id: 'century',    name: 'Century!',        desc: '100 correct answers',              icon: '💯', check: (s) => s.global.correct >= 100 },
    { id: 'five-hundo', name: 'Five Hundred',    desc: '500 correct answers',              icon: '🚀', check: (s) => s.global.correct >= 500 },
    { id: 'thousand',   name: 'One in a Thousand', desc: '1000 correct answers',           icon: '👑', check: (s) => s.global.correct >= 1000 },

    // Streaks
    { id: 'streak-5',   name: 'Getting Warm',    desc: 'Answer 5 in a row correctly',      icon: '🔥', check: (s) => s.global.best >= 5 },
    { id: 'streak-10',  name: 'On Fire',         desc: '10-answer streak',                 icon: '🔥', check: (s) => s.global.best >= 10 },
    { id: 'streak-20',  name: 'Blazing',         desc: '20-answer streak',                 icon: '🌋', check: (s) => s.global.best >= 20 },
    { id: 'streak-50',  name: 'Unstoppable',     desc: '50-answer streak',                 icon: '⚡', check: (s) => s.global.best >= 50 },

    // Accuracy
    { id: 'sharp',      name: 'Sharpshooter',    desc: '90%+ accuracy after 20 answers',   icon: '🎯', check: (s) => s.global.attempted >= 20 && s.global.correct / s.global.attempted >= 0.9 },
    { id: 'perfect-10', name: 'Perfect Ten',     desc: '10 in a row on one topic',         icon: '🎯', check: (s) => Object.values(s.topics).some(t => t.best >= 10) },

    // Exploration
    { id: 'explorer',   name: 'Explorer',        desc: 'Try 5 different topics',           icon: '🧭', check: (s) => Object.values(s.topics).filter(t => t.total > 0).length >= 5 },
    { id: 'wanderer',   name: 'Wanderer',        desc: 'Try 15 different topics',          icon: '🗺️', check: (s) => Object.values(s.topics).filter(t => t.total > 0).length >= 15 },
    { id: 'polymath',   name: 'Polymath',        desc: 'Practise in 3 different subjects', icon: '🌐', check: (s) => Object.values(s.subjects).filter(x => x.attempted > 0).length >= 3 },
    { id: 'renaissance',name: 'Renaissance Kid', desc: 'Practise all 6 subjects',          icon: '🎨', check: (s) => Object.values(s.subjects).filter(x => x.attempted > 0).length >= 6 },

    // Habit
    { id: 'daily-3',    name: '3-Day Habit',     desc: 'Practise 3 days in a row',         icon: '📅', check: (s) => consecutiveDays(s) >= 3 },
    { id: 'daily-7',    name: 'Week Warrior',    desc: 'Practise 7 days in a row',         icon: '🗓️', check: (s) => consecutiveDays(s) >= 7 },
    { id: 'daily-30',   name: 'Iron Habit',      desc: 'Practise 30 days in a row',        icon: '🏔️', check: (s) => consecutiveDays(s) >= 30 },

    // Topic mastery
    { id: 'topic-master', name: 'Topic Master',  desc: '80% accuracy over 20 attempts in one topic', icon: '🥇',
      check: (s) => Object.values(s.topics).some(t => t.total >= 20 && t.correct / t.total >= 0.8) },
    { id: 'topic-legend', name: 'Topic Legend',  desc: '90% over 50 in one topic',          icon: '🏆',
      check: (s) => Object.values(s.topics).some(t => t.total >= 50 && t.correct / t.total >= 0.9) },
    { id: 'olympian',   name: 'Olympian',        desc: '10 competition questions correct', icon: '💎',
      check: (s) => (s.topics['maths.competition']?.correct || 0) + (s.topics['maths.numberTheory']?.correct || 0) + (s.topics['maths.counting']?.correct || 0) >= 10 },

    // Fun
    { id: 'night-owl',  name: 'Night Owl',       desc: 'Practise after 10pm',              icon: '🦉', check: () => { const h = new Date().getHours(); return h >= 22 || h < 5; }, onlyOnAttempt: true },
    { id: 'early-bird', name: 'Early Bird',      desc: 'Practise before 7am',              icon: '🐦', check: () => { const h = new Date().getHours(); return h >= 5 && h < 7; }, onlyOnAttempt: true },
    { id: 'weekender',  name: 'Weekend Warrior', desc: 'Practise on a weekend',            icon: '🎉', check: () => { const d = new Date().getDay(); return d === 0 || d === 6; }, onlyOnAttempt: true },
    { id: 'rich',       name: 'Coin Collector',  desc: 'Collect 500 coins',                icon: '🪙', check: (s) => s.coins >= 500 }
  ];

  function consecutiveDays(s) {
    // Count how many days ending today are in a row with activity
    let n = 0;
    const d = new Date();
    while (true) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      if (s.daily && s.daily[key] && s.daily[key].attempted > 0) { n++; d.setDate(d.getDate() - 1); }
      else break;
      if (n > 400) break; // safety
    }
    return n;
  }

  // ---------- XP + coin awarding ----------
  // Wrap the recordAttempt so gamification hooks fire automatically.
  const origRecord = window.Core.recordAttempt;
  window.Core.recordAttempt = function (subjectId, topicKey, correct) {
    // Track pre-state for daily / streak-milestone detection
    const preStreak = s.global.streak;
    const preXP = s.xp;
    const preLevel = levelFromXP(preXP);

    // The original does the counting + streak update
    origRecord.call(this, subjectId, topicKey, correct);

    // Award XP
    let xpGained = 0;
    if (correct) {
      xpGained += 10;
      // Streak bonus at every 5
      if (s.global.streak > 0 && s.global.streak % 5 === 0) xpGained += 5;
      if (s.global.streak > 0 && s.global.streak % 10 === 0) xpGained += 10;
      // First correct on a topic bonus
      const tk = `${subjectId}.${topicKey}`;
      if (s.topics[tk] && s.topics[tk].correct === 1) xpGained += 15;
    } else {
      xpGained += 2; // trying still earns a little
    }

    // Daily bonus (first practice of a new day)
    const today = window.Core.todayKey();
    if (s.dailyClaimed !== today) {
      s.dailyClaimed = today;
      xpGained += 25;
      s.coins += 10;
      setTimeout(() => toast('☀️ Daily bonus! +25 XP, +10 coins', 'good'), 200);
    }

    // Coins for correct
    if (correct) s.coins += 1;

    s.xp += xpGained;
    window.Core.save();

    // Level-up detection
    const postLevel = levelFromXP(s.xp);
    if (postLevel.level > preLevel.level) {
      s.level = postLevel.level;
      window.Core.save();
      setTimeout(() => showLevelUp(postLevel), 500);
    }

    // Badge checks
    checkBadges(correct);

    // Announce big streak milestones
    if (correct && (s.global.streak === 5 || s.global.streak === 10 || s.global.streak === 20 || s.global.streak === 50)) {
      setTimeout(() => toast(`🔥 Streak ${s.global.streak}!`, 'good'), 100);
    }

    // Confetti on correct
    if (correct) confetti();

    return xpGained;
  };

  function checkBadges(justAnsweredThisTurn) {
    for (const b of BADGES) {
      if (s.badges[b.id]) continue;
      if (b.onlyOnAttempt && !justAnsweredThisTurn) continue;
      try {
        if (b.check(s)) {
          s.badges[b.id] = new Date().toISOString();
          window.Core.save();
          setTimeout(() => showBadge(b), 300);
        }
      } catch (_) {}
    }
  }

  // ---------- Confetti (canvas-free, tiny CSS+DOM) ----------
  function confetti() {
    const N = 24;
    const host = document.body;
    const wrap = document.createElement('div');
    wrap.className = 'confetti-wrap';
    for (let i = 0; i < N; i++) {
      const d = document.createElement('div');
      d.className = 'confetti-piece';
      const hue = Math.floor(Math.random() * 360);
      d.style.background = `hsl(${hue}, 80%, 60%)`;
      d.style.left = (50 + (Math.random() - 0.5) * 40) + '%';
      d.style.animationDelay = (Math.random() * 0.15) + 's';
      d.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
      d.style.transform = `rotate(${Math.random() * 360}deg)`;
      wrap.appendChild(d);
    }
    host.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1800);
  }

  // ---------- Level-up modal ----------
  function showLevelUp(lv) {
    const m = document.createElement('div');
    m.className = 'level-up-modal';
    m.innerHTML = `
      <div class="level-up-card">
        <div class="level-up-burst"></div>
        <div class="level-up-icon">${lv.icon}</div>
        <div class="level-up-title">LEVEL UP!</div>
        <div class="level-up-name">${lv.name}</div>
        <div class="level-up-num">Level ${lv.level}</div>
        <button class="primary" onclick="this.closest('.level-up-modal').remove()">Nice!</button>
      </div>`;
    document.body.appendChild(m);
    // Also confetti
    for (let i = 0; i < 3; i++) setTimeout(confetti, i * 200);
    setTimeout(() => { if (m.parentNode) m.remove(); }, 6000);
  }

  // ---------- Badge toast ----------
  function showBadge(b) {
    const t = document.createElement('div');
    t.className = 'badge-toast';
    t.innerHTML = `
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-body">
        <div class="badge-title">Badge unlocked!</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>`;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('go'), 20);
    setTimeout(() => { t.classList.remove('go'); setTimeout(() => t.remove(), 400); }, 4200);
  }

  // ---------- Generic toast ----------
  function toast(msg, kind) {
    const t = document.createElement('div');
    t.className = `mini-toast ${kind || ''}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('go'), 20);
    setTimeout(() => { t.classList.remove('go'); setTimeout(() => t.remove(), 400); }, 3200);
  }

  // ---------- Reset gamification state (for dashboard) ----------
  const origReset = window.Core.resetAll;
  window.Core.resetAll = function () {
    origReset.call(this);
    const s2 = window.Core.state;
    s2.xp = 0; s2.level = 1; s2.badges = {}; s2.coins = 0; s2.dailyClaimed = null;
    window.Core.save();
  };

  // ---------- Public API ----------
  window.Gamify = {
    LEVELS, BADGES,
    levelFromXP, nextLevel, progressToNext,
    confetti, showLevelUp, showBadge, toast,
    earnedBadges: () => BADGES.filter(b => s.badges[b.id]),
    unearnedBadges: () => BADGES.filter(b => !s.badges[b.id]),
    consecutiveDays: () => consecutiveDays(s)
  };
})();
