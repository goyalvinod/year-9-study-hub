/* ==========================================================
   Inline SVG library. Everything self-contained (no external
   fonts or images) so it works offline / on GitHub Pages.
   Exposes window.SVG.
   ========================================================== */
(function () {
  'use strict';

  const SVG = {};

  // ---------- Subject hero icons ----------
  SVG.mathsHero = () => `
    <svg viewBox="0 0 200 120" class="subject-hero" aria-hidden="true">
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#6aa3ff"/>
          <stop offset="1" stop-color="#c084fc"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill="url(#mg)" rx="14"/>
      <text x="20" y="42" fill="white" font-size="30" font-family="Cambria Math, serif" opacity="0.9">π</text>
      <text x="55" y="42" fill="white" font-size="30" font-family="Cambria Math, serif" opacity="0.7">∫</text>
      <text x="92" y="42" fill="white" font-size="24" font-family="Cambria Math, serif" opacity="0.8">Σ</text>
      <text x="130" y="42" fill="white" font-size="26" font-family="Cambria Math, serif" opacity="0.6">√</text>
      <text x="165" y="42" fill="white" font-size="26" font-family="Cambria Math, serif" opacity="0.85">∞</text>
      <text x="30" y="95" fill="white" font-size="32" font-family="Cambria Math, serif" font-style="italic" font-weight="700">a²+b²=c²</text>
    </svg>`;

  SVG.physicsHero = () => `
    <svg viewBox="0 0 200 120" class="subject-hero" aria-hidden="true">
      <defs>
        <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f97316"/>
          <stop offset="1" stop-color="#eab308"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill="url(#pg)" rx="14"/>
      <!-- Atom -->
      <ellipse cx="100" cy="60" rx="55" ry="18" stroke="white" stroke-width="2" fill="none" opacity="0.9"/>
      <ellipse cx="100" cy="60" rx="55" ry="18" stroke="white" stroke-width="2" fill="none" opacity="0.6" transform="rotate(60 100 60)"/>
      <ellipse cx="100" cy="60" rx="55" ry="18" stroke="white" stroke-width="2" fill="none" opacity="0.6" transform="rotate(-60 100 60)"/>
      <circle cx="100" cy="60" r="6" fill="white"/>
      <circle cx="152" cy="55" r="3" fill="white"/>
      <circle cx="55" cy="70" r="3" fill="white"/>
      <text x="12" y="20" fill="white" font-size="12" font-family="ui-monospace" opacity="0.85">F=ma</text>
      <text x="152" y="112" fill="white" font-size="12" font-family="ui-monospace" opacity="0.85">E=mc²</text>
    </svg>`;

  SVG.chemistryHero = () => `
    <svg viewBox="0 0 200 120" class="subject-hero" aria-hidden="true">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#22c55e"/>
          <stop offset="1" stop-color="#14b8a6"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill="url(#cg)" rx="14"/>
      <!-- Flask -->
      <path d="M78 20 L78 55 L58 95 Q56 105 68 105 L132 105 Q144 105 142 95 L122 55 L122 20 Z"
            fill="white" fill-opacity="0.15" stroke="white" stroke-width="2.5"/>
      <path d="M60 90 L140 90 L134 100 Q133 105 128 105 L72 105 Q67 105 66 100 Z"
            fill="white" fill-opacity="0.75"/>
      <circle cx="80" cy="98" r="3" fill="white"/>
      <circle cx="110" cy="95" r="2" fill="white"/>
      <circle cx="95" cy="82" r="2.5" fill="white"/>
      <line x1="70" y1="18" x2="130" y2="18" stroke="white" stroke-width="3" stroke-linecap="round"/>
      <text x="12" y="115" fill="white" font-size="11" font-family="ui-monospace" opacity="0.9">H₂O · NaCl · CO₂</text>
    </svg>`;

  SVG.computingHero = () => `
    <svg viewBox="0 0 200 120" class="subject-hero" aria-hidden="true">
      <defs>
        <linearGradient id="cog" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0ea5e9"/>
          <stop offset="1" stop-color="#6366f1"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill="url(#cog)" rx="14"/>
      <!-- Terminal frame -->
      <rect x="24" y="22" width="152" height="80" rx="6" fill="rgba(0,0,0,0.35)" stroke="white" stroke-width="1.5"/>
      <circle cx="34" cy="32" r="2.5" fill="#ff6b6b"/>
      <circle cx="42" cy="32" r="2.5" fill="#ffd93d"/>
      <circle cx="50" cy="32" r="2.5" fill="#6bcb77"/>
      <text x="32" y="55" fill="#a5f3fc" font-size="10" font-family="ui-monospace">&gt; def hi():</text>
      <text x="32" y="70" fill="#f0abfc" font-size="10" font-family="ui-monospace">    print("hi")</text>
      <text x="32" y="88" fill="#86efac" font-size="10" font-family="ui-monospace">101010 · 42</text>
    </svg>`;

  SVG.historyHero = () => `
    <svg viewBox="0 0 200 120" class="subject-hero" aria-hidden="true">
      <defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#b45309"/>
          <stop offset="1" stop-color="#78350f"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill="url(#hg)" rx="14"/>
      <!-- Column and scroll -->
      <path d="M40 30 L60 30 L60 95 L40 95 Z" fill="rgba(255,255,255,0.9)"/>
      <path d="M38 30 L62 30 L62 34 L38 34 Z M38 91 L62 91 L62 95 L38 95 Z" fill="white"/>
      <path d="M120 40 Q140 30 160 40 L160 90 Q140 100 120 90 Z" fill="rgba(253,224,71,0.9)" stroke="white" stroke-width="1.5"/>
      <line x1="128" y1="55" x2="152" y2="55" stroke="#78350f" stroke-width="1.5"/>
      <line x1="128" y1="65" x2="152" y2="65" stroke="#78350f" stroke-width="1.5"/>
      <line x1="128" y1="75" x2="150" y2="75" stroke="#78350f" stroke-width="1.5"/>
      <text x="12" y="115" fill="white" font-size="11" font-family="Georgia" opacity="0.9" font-style="italic">1066 · 1914 · 1945</text>
    </svg>`;

  SVG.geographyHero = () => `
    <svg viewBox="0 0 200 120" class="subject-hero" aria-hidden="true">
      <defs>
        <linearGradient id="gg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#059669"/>
          <stop offset="1" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill="url(#gg)" rx="14"/>
      <!-- Globe -->
      <circle cx="100" cy="60" r="42" fill="rgba(255,255,255,0.95)"/>
      <path d="M65 55 Q75 45 90 50 Q100 45 115 55 L120 65 Q110 75 100 70 Q85 78 75 68 Q68 62 65 55Z"
            fill="#0284c7"/>
      <path d="M105 78 Q120 82 132 75 L130 88 Q118 92 108 88Z" fill="#0284c7"/>
      <circle cx="100" cy="60" r="42" fill="none" stroke="white" stroke-width="2"/>
      <path d="M100 18 Q75 60 100 102 M100 18 Q125 60 100 102 M58 60 L142 60" stroke="white" stroke-width="1" fill="none" opacity="0.6"/>
    </svg>`;

  // ---------- Small subject icons for cards ----------
  SVG.subjectIcon = (subject) => {
    const map = {
      maths:     '<svg viewBox="0 0 32 32" width="28" height="28"><text x="4" y="24" font-size="22" fill="currentColor" font-family="Cambria Math, serif">∫</text></svg>',
      physics:   '<svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="16" rx="12" ry="4" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="16" cy="16" rx="12" ry="4" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(60 16 16)"/><ellipse cx="16" cy="16" rx="12" ry="4" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(-60 16 16)"/><circle cx="16" cy="16" r="2" fill="currentColor"/></svg>',
      chemistry: '<svg viewBox="0 0 32 32" width="28" height="28"><path d="M12 4 L12 13 L6 24 Q5 28 10 28 L22 28 Q27 28 26 24 L20 13 L20 4 Z" fill="none" stroke="currentColor" stroke-width="2"/><line x1="10" y1="4" x2="22" y2="4" stroke="currentColor" stroke-width="2.5"/></svg>',
      computing: '<svg viewBox="0 0 32 32" width="28" height="28"><polyline points="4,10 10,16 4,22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><line x1="14" y1="24" x2="26" y2="24" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
      history:   '<svg viewBox="0 0 32 32" width="28" height="28"><path d="M6 6 L26 6 L26 10 L6 10 Z M6 22 L26 22 L26 26 L6 26 Z" fill="currentColor"/><path d="M8 10 L24 10 L24 22 L8 22 Z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
      geography: '<svg viewBox="0 0 32 32" width="28" height="28"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 4 Q10 16 16 28 M16 4 Q22 16 16 28 M4 16 L28 16" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>'
    };
    return map[subject] || map.maths;
  };

  // ---------- Diagrams for maths topics ----------
  SVG.rightTriangle = (aLabel, bLabel, cLabel) => `
    <svg viewBox="0 0 200 130" class="topic-diagram">
      <polygon points="30,110 170,110 30,20" fill="rgba(106,163,255,0.15)" stroke="var(--accent)" stroke-width="2"/>
      <path d="M30 100 L40 100 L40 110" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
      <text x="95" y="125" text-anchor="middle" fill="currentColor" font-size="14">${aLabel || 'a'}</text>
      <text x="12" y="65" text-anchor="middle" fill="currentColor" font-size="14">${bLabel || 'b'}</text>
      <text x="110" y="60" text-anchor="middle" fill="currentColor" font-size="14" transform="rotate(-33 110 60)">${cLabel || 'c'}</text>
    </svg>`;

  SVG.circleTheoremDiagram = () => `
    <svg viewBox="0 0 220 160" class="topic-diagram">
      <circle cx="110" cy="80" r="60" fill="rgba(192,132,252,0.12)" stroke="var(--olympiad)" stroke-width="2"/>
      <circle cx="110" cy="80" r="2.5" fill="var(--olympiad)"/>
      <text x="118" y="80" font-size="10" fill="currentColor">O</text>
      <polygon points="110,80 60,110 170,110" fill="rgba(106,163,255,0.15)" stroke="var(--accent)" stroke-width="1.5"/>
      <polygon points="60,110 110,25 170,110" fill="none" stroke="var(--good)" stroke-width="1.5" stroke-dasharray="3 3"/>
      <text x="98" y="95" font-size="12" fill="currentColor">2θ</text>
      <text x="107" y="45" font-size="12" fill="currentColor">θ</text>
    </svg>`;

  SVG.vectorDiagram = () => `
    <svg viewBox="0 0 220 130" class="topic-diagram">
      <defs>
        <marker id="ah" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="var(--accent)"/>
        </marker>
        <marker id="bh" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="var(--good)"/>
        </marker>
        <marker id="rh" markerWidth="10" markerHeight="10" refX="7" refY="3.5" orient="auto">
          <polygon points="0 0, 8 3.5, 0 7" fill="var(--olympiad)"/>
        </marker>
      </defs>
      <line x1="30" y1="100" x2="120" y2="60" stroke="var(--accent)" stroke-width="2.5" marker-end="url(#ah)"/>
      <text x="70" y="72" fill="var(--accent)" font-size="14" font-weight="600">a</text>
      <line x1="120" y1="60" x2="200" y2="45" stroke="var(--good)" stroke-width="2.5" marker-end="url(#bh)"/>
      <text x="150" y="45" fill="var(--good)" font-size="14" font-weight="600">b</text>
      <line x1="30" y1="100" x2="200" y2="45" stroke="var(--olympiad)" stroke-width="2.5" stroke-dasharray="4 4" marker-end="url(#rh)"/>
      <text x="105" y="118" fill="var(--olympiad)" font-size="14" font-weight="600">a + b</text>
    </svg>`;

  SVG.similarShapesDiagram = () => `
    <svg viewBox="0 0 240 130" class="topic-diagram">
      <polygon points="20,110 70,110 45,50" fill="rgba(106,163,255,0.15)" stroke="var(--accent)" stroke-width="2"/>
      <text x="45" y="128" text-anchor="middle" font-size="11" fill="currentColor">small (SF ×1)</text>
      <polygon points="120,110 220,110 170,10" fill="rgba(74,222,128,0.15)" stroke="var(--good)" stroke-width="2"/>
      <text x="170" y="128" text-anchor="middle" font-size="11" fill="currentColor">large (SF ×2)</text>
    </svg>`;

  SVG.coneAndSphere = () => `
    <svg viewBox="0 0 260 130" class="topic-diagram">
      <polygon points="50,110 130,110 90,20" fill="rgba(251,191,36,0.2)" stroke="var(--weak)" stroke-width="2"/>
      <ellipse cx="90" cy="110" rx="40" ry="7" fill="rgba(251,191,36,0.4)" stroke="var(--weak)" stroke-width="2"/>
      <text x="90" y="125" text-anchor="middle" font-size="11" fill="currentColor">V = ⅓πr²h</text>
      <circle cx="200" cy="70" r="45" fill="rgba(106,163,255,0.15)" stroke="var(--accent)" stroke-width="2"/>
      <ellipse cx="200" cy="70" rx="45" ry="12" fill="none" stroke="var(--accent)" stroke-width="1" stroke-dasharray="3 3"/>
      <text x="200" y="128" text-anchor="middle" font-size="11" fill="currentColor">V = ⁴⁄₃πr³</text>
    </svg>`;

  SVG.coordAxes = () => `
    <svg viewBox="0 0 200 130" class="topic-diagram">
      <line x1="20" y1="65" x2="180" y2="65" stroke="currentColor" stroke-width="1"/>
      <line x1="100" y1="15" x2="100" y2="115" stroke="currentColor" stroke-width="1"/>
      <text x="185" y="70" font-size="11" fill="currentColor">x</text>
      <text x="105" y="18" font-size="11" fill="currentColor">y</text>
      <line x1="50" y1="95" x2="150" y2="35" stroke="var(--accent)" stroke-width="2.5"/>
      <circle cx="70" cy="83" r="3" fill="var(--accent)"/>
      <circle cx="130" cy="47" r="3" fill="var(--accent)"/>
      <text x="46" y="105" font-size="10" fill="currentColor">A</text>
      <text x="135" y="42" font-size="10" fill="currentColor">B</text>
    </svg>`;

  SVG.pieAtom = () => `
    <svg viewBox="0 0 130 130" class="topic-diagram">
      <circle cx="65" cy="65" r="55" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="1 6"/>
      <circle cx="65" cy="65" r="38" fill="none" stroke="var(--olympiad)" stroke-width="2" stroke-dasharray="1 6"/>
      <circle cx="65" cy="65" r="8" fill="var(--weak)"/>
      <text x="65" y="69" text-anchor="middle" font-size="10" font-weight="700" fill="#111">+</text>
      <circle cx="120" cy="65" r="4" fill="var(--accent)"/>
      <circle cx="10" cy="65" r="4" fill="var(--accent)"/>
      <circle cx="65" cy="10" r="4" fill="var(--olympiad)"/>
      <circle cx="65" cy="120" r="4" fill="var(--olympiad)"/>
    </svg>`;

  // ---------- Home page mascot ----------
  SVG.mascot = () => `
    <svg viewBox="0 0 160 160" class="mascot" aria-hidden="true">
      <circle cx="80" cy="80" r="70" fill="var(--accent)"/>
      <circle cx="80" cy="80" r="70" fill="url(#mascotGlow)"/>
      <defs>
        <radialGradient id="mascotGlow" cx="0.35" cy="0.35">
          <stop offset="0" stop-color="rgba(255,255,255,0.35)"/>
          <stop offset="1" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <circle cx="58" cy="72" r="8" fill="white"/>
      <circle cx="102" cy="72" r="8" fill="white"/>
      <circle cx="60" cy="74" r="4" fill="#1a1f29"/>
      <circle cx="104" cy="74" r="4" fill="#1a1f29"/>
      <path d="M55 100 Q80 122 105 100" fill="none" stroke="#1a1f29" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 45 L52 55 M120 45 L108 55" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.85"/>
    </svg>`;

  // ---------- Small trophy for badges section ----------
  SVG.trophy = (color) => `
    <svg viewBox="0 0 32 32" width="20" height="20">
      <path d="M9 5 L23 5 L23 9 Q23 15 16 17 Q9 15 9 9 Z" fill="${color || 'var(--weak)'}"/>
      <rect x="14" y="17" width="4" height="6" fill="${color || 'var(--weak)'}"/>
      <rect x="10" y="23" width="12" height="3" fill="${color || 'var(--weak)'}"/>
      <path d="M9 6 L4 6 L4 9 Q4 13 9 13" fill="none" stroke="${color || 'var(--weak)'}" stroke-width="1.5"/>
      <path d="M23 6 L28 6 L28 9 Q28 13 23 13" fill="none" stroke="${color || 'var(--weak)'}" stroke-width="1.5"/>
    </svg>`;

  window.SVG = SVG;
})();
