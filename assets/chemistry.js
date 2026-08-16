/* Chemistry — Year 9: atomic structure, periodic table, bonding,
   reactions, acids & bases, rates, moles, separation. */
(function () {
  'use strict';
  const { rand, pick } = window.Core;
  const G = window.Questions.generators;
  const T = window.Questions.topics;
  window.Content.CHEMISTRY = window.Content.CHEMISTRY || {};
  const C = window.Content.CHEMISTRY;

  // ============================================================
  // GENERATORS
  // ============================================================

  const ELEMENTS = [
    { name: 'hydrogen',  sym: 'H',  Z: 1, mass: 1 },
    { name: 'helium',    sym: 'He', Z: 2, mass: 4 },
    { name: 'lithium',   sym: 'Li', Z: 3, mass: 7 },
    { name: 'carbon',    sym: 'C',  Z: 6, mass: 12 },
    { name: 'nitrogen',  sym: 'N',  Z: 7, mass: 14 },
    { name: 'oxygen',    sym: 'O',  Z: 8, mass: 16 },
    { name: 'sodium',    sym: 'Na', Z: 11, mass: 23 },
    { name: 'magnesium', sym: 'Mg', Z: 12, mass: 24 },
    { name: 'aluminium', sym: 'Al', Z: 13, mass: 27 },
    { name: 'silicon',   sym: 'Si', Z: 14, mass: 28 },
    { name: 'phosphorus',sym: 'P',  Z: 15, mass: 31 },
    { name: 'sulfur',    sym: 'S',  Z: 16, mass: 32 },
    { name: 'chlorine',  sym: 'Cl', Z: 17, mass: 35.5 },
    { name: 'potassium', sym: 'K',  Z: 19, mass: 39 },
    { name: 'calcium',   sym: 'Ca', Z: 20, mass: 40 },
    { name: 'iron',      sym: 'Fe', Z: 26, mass: 56 },
    { name: 'copper',    sym: 'Cu', Z: 29, mass: 63.5 },
    { name: 'zinc',      sym: 'Zn', Z: 30, mass: 65 }
  ];

  G.cAtomic = [
    function protonsNeutrons() {
      const e = pick(ELEMENTS.filter(x => x.mass === Math.round(x.mass)));
      const A = Math.round(e.mass);
      const ask = pick(['protons', 'neutrons', 'electrons']);
      const ans = ask === 'neutrons' ? A - e.Z : e.Z;
      return {
        topic: 'cAtomic',
        prompt: `<strong>${e.sym}</strong> (${e.name}) has atomic number <strong>${e.Z}</strong> and mass number <strong>${A}</strong>. How many <strong>${ask}</strong> does a neutral atom have?`,
        hint: 'Protons = atomic number. Neutrons = mass − atomic number. Electrons = protons (neutral atom).',
        answer: String(ans), numeric: ans,
        solution: [
          `Atomic number = protons = ${e.Z}.`,
          `Mass number = protons + neutrons = ${A}, so neutrons = ${A - e.Z}.`,
          `Neutral atom → electrons = protons.`,
          `${ask.charAt(0).toUpperCase() + ask.slice(1)}: <strong>${ans}</strong>.`
        ]
      };
    },
    function isotopeQ() {
      const stmt = pick([
        { q: 'Two atoms of the same element with different numbers of neutrons are called…', a: 'isotopes' },
        { q: 'A negatively charged subatomic particle in the shells is called a(n)…', a: 'electron' },
        { q: 'The subatomic particle with a mass of 1 and NO charge is a(n)…', a: 'neutron' }
      ]);
      return {
        topic: 'cAtomic',
        prompt: stmt.q,
        hint: '',
        answer: stmt.a,
        solution: [`Answer: <strong>${stmt.a}</strong>.`]
      };
    }
  ];

  G.cPeriodic = [
    function groupOf() {
      const e = pick(ELEMENTS.filter(x => [1,3,11,17,19,20,26,29].includes(x.Z)));
      const g = { 1:1, 3:1, 11:1, 17:7, 19:1, 20:2, 26:'transition', 29:'transition' }[e.Z];
      return {
        topic: 'cPeriodic',
        prompt: `Which group of the periodic table does <strong>${e.name}</strong> belong to? (Number, or type <code>transition</code>.)`,
        hint: `Group 1 = alkali metals. Group 7 = halogens. Group 0/8 = noble gases.`,
        answer: String(g),
        solution: [`Answer: <strong>${g}</strong>.`]
      };
    },
    function electronConfig() {
      const [z, config] = pick([[3,'2,1'],[6,'2,4'],[8,'2,6'],[11,'2,8,1'],[12,'2,8,2'],[13,'2,8,3'],[17,'2,8,7'],[20,'2,8,8,2']]);
      const el = ELEMENTS.find(e => e.Z === z);
      return {
        topic: 'cPeriodic',
        prompt: `Write the electron configuration of <strong>${el.name}</strong> (atomic number ${z}). Type as e.g. <code>2,8,1</code>.`,
        hint: `Shells fill 2, then 8, then 8.`,
        answer: config,
        solution: [`${el.name} has ${z} electrons. Filling order 2, 8, 8 gives: <strong>${config}</strong>.`]
      };
    }
  ];

  G.cBonding = [
    function bondType() {
      const pair = pick([
        { q: 'Sodium (Na) reacts with chlorine (Cl) to form NaCl. What type of bond?', a: 'ionic' },
        { q: 'Two chlorine atoms share a pair of electrons to form Cl₂. What type of bond?', a: 'covalent' },
        { q: 'Copper atoms in a lump of copper metal are held together by…', a: 'metallic' },
        { q: 'Water (H₂O) is made of what type of bonds?', a: 'covalent' }
      ]);
      return {
        topic: 'cBonding',
        prompt: pair.q + ' (Type <code>ionic</code>, <code>covalent</code>, or <code>metallic</code>.)',
        hint: 'Metal + non-metal → ionic. Non-metal + non-metal → covalent. Metal + metal → metallic.',
        answer: pair.a,
        solution: [`Answer: <strong>${pair.a}</strong>.`]
      };
    }
  ];

  G.cReactions = [
    function balanceEqn() {
      // Very common: 2H2 + O2 -> 2H2O ; CH4 + 2O2 -> CO2 + 2H2O
      const set = pick([
        { q: 'Balance: __ H₂ + O₂ → 2 H₂O. What number goes in the blank?', a: '2' },
        { q: 'Balance: 2 Mg + __ O₂ → 2 MgO. What number goes in the blank?', a: '1' },
        { q: 'Balance: N₂ + __ H₂ → 2 NH₃. What number goes in the blank?', a: '3' },
        { q: 'Balance: CH₄ + __ O₂ → CO₂ + 2 H₂O. What number goes in the blank?', a: '2' }
      ]);
      return {
        topic: 'cReactions',
        prompt: set.q,
        hint: 'Count each type of atom on both sides. Atoms must balance.',
        answer: set.a,
        numeric: +set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    },
    function reactionType() {
      const set = pick([
        { q: '2 Mg + O₂ → 2 MgO. What type of reaction is this?', a: 'combustion' },
        { q: 'CaCO₃ → CaO + CO₂ (heated strongly). What type of reaction?', a: 'thermal decomposition' },
        { q: 'Zn + CuSO₄ → ZnSO₄ + Cu. What type of reaction?', a: 'displacement' }
      ]);
      return {
        topic: 'cReactions',
        prompt: set.q,
        hint: '',
        answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.cAcids = [
    function pHOf() {
      const set = pick([
        { q: 'A solution has a pH of 1. Is it acidic, neutral, or alkaline?', a: 'acidic' },
        { q: 'A solution has a pH of 14. Is it acidic, neutral, or alkaline?', a: 'alkaline' },
        { q: 'Pure water has a pH of 7. Is it acidic, neutral, or alkaline?', a: 'neutral' },
        { q: 'Which colour does universal indicator turn in a strong acid?', a: 'red' },
        { q: 'Which colour does universal indicator turn in a strong alkali?', a: 'purple' }
      ]);
      return {
        topic: 'cAcids',
        prompt: set.q,
        hint: 'pH scale runs 0–14. Below 7 = acid, 7 = neutral, above 7 = alkali.',
        answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    },
    function saltName() {
      const set = pick([
        { q: 'HCl + NaOH → water + salt. Name the salt.', a: 'sodium chloride' },
        { q: 'H₂SO₄ + 2 NaOH → water + salt. Name the salt.', a: 'sodium sulfate' },
        { q: 'HNO₃ + KOH → water + salt. Name the salt.', a: 'potassium nitrate' }
      ]);
      return {
        topic: 'cAcids',
        prompt: set.q,
        hint: 'Acid + alkali → salt + water. Salt gets the metal name + the acid ending (chloride/sulfate/nitrate).',
        answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.cRates = [
    function ratesFactor() {
      const set = pick([
        { q: 'Increasing temperature has what effect on reaction rate?', a: 'increases' },
        { q: 'Adding a catalyst has what effect on reaction rate?', a: 'increases' },
        { q: 'Grinding a solid reactant into smaller pieces has what effect on rate?', a: 'increases' },
        { q: 'A catalyst is used up during the reaction — true or false?', a: 'false' }
      ]);
      return {
        topic: 'cRates',
        prompt: set.q + (set.a === 'true' || set.a === 'false' ? ' (<code>true</code> or <code>false</code>)' : ' (<code>increases</code>, <code>decreases</code>, or <code>no effect</code>)'),
        hint: 'More collisions or more energetic collisions → faster.',
        answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.cMoles = [
    function relFormulaMass() {
      const cpd = pick([
        { name: 'H₂O',    parts: [['H',2],['O',1]], mr: 18 },
        { name: 'CO₂',    parts: [['C',1],['O',2]], mr: 44 },
        { name: 'NaCl',   parts: [['Na',1],['Cl',1]], mr: 58.5 },
        { name: 'CaCO₃',  parts: [['Ca',1],['C',1],['O',3]], mr: 100 },
        { name: 'H₂SO₄',  parts: [['H',2],['S',1],['O',4]], mr: 98 },
        { name: 'MgO',    parts: [['Mg',1],['O',1]], mr: 40 }
      ]);
      return {
        topic: 'cMoles',
        prompt: `Find the relative formula mass (Mr) of <strong>${cpd.name}</strong>. Use these Ar: H=1, C=12, N=14, O=16, Na=23, Mg=24, S=32, Cl=35.5, Ca=40.`,
        hint: 'Multiply each atomic mass by its subscript, then add.',
        answer: String(cpd.mr),
        numeric: cpd.mr,
        tol: 0.05,
        solution: [
          `Add: ${cpd.parts.map(([s,n]) => `${n} × Ar(${s})`).join(' + ')}.`,
          `= <strong>${cpd.mr}</strong>.`
        ]
      };
    }
  ];

  G.cSeparation = [
    function techniqueFor() {
      const set = pick([
        { q: 'Separate sand from water: best technique?', a: 'filtration' },
        { q: 'Separate salt from salt-water solution: best technique?', a: 'evaporation' },
        { q: 'Separate a mixture of coloured inks: best technique?', a: 'chromatography' },
        { q: 'Separate ethanol from a water/ethanol mixture: best technique?', a: 'distillation' }
      ]);
      return {
        topic: 'cSeparation',
        prompt: set.q,
        hint: '',
        answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  // ============================================================
  // TOPIC REGISTRY
  // ============================================================
  const topics = [
    { key: 'cAtomic',     subject: 'chemistry', label: 'Atomic structure',   section: 'Atoms & Elements' },
    { key: 'cPeriodic',   subject: 'chemistry', label: 'Periodic table',     section: 'Atoms & Elements' },
    { key: 'cBonding',    subject: 'chemistry', label: 'Bonding',            section: 'Bonding & Structure' },
    { key: 'cReactions',  subject: 'chemistry', label: 'Chemical reactions', section: 'Chemical Reactions' },
    { key: 'cAcids',      subject: 'chemistry', label: 'Acids, bases & pH',  section: 'Chemical Reactions' },
    { key: 'cRates',      subject: 'chemistry', label: 'Rates of reaction',  section: 'Chemical Reactions' },
    { key: 'cMoles',      subject: 'chemistry', label: 'Moles & Mr',         section: 'Quantitative Chemistry' },
    { key: 'cSeparation', subject: 'chemistry', label: 'Separation techniques', section: 'Practical Chemistry' }
  ];
  topics.forEach(t => T.push(t));

  // ============================================================
  // CONTENT
  // ============================================================
  Object.assign(C, {
    cAtomic: {
      blurb: `<p>Everything is made of <strong>atoms</strong>. An atom has a tiny <strong>nucleus</strong>
        (protons + neutrons) with <strong>electrons</strong> in shells around it. The
        <strong>atomic number</strong> counts protons; the <strong>mass number</strong> counts
        protons + neutrons.</p>
        <p><strong>Isotopes</strong> are atoms of the same element with different numbers of neutrons.</p>`,
      formulas: [
        { name: 'Protons',   expr: '= atomic number (Z)' },
        { name: 'Neutrons',  expr: '= mass number − atomic number' },
        { name: 'Electrons', expr: '= protons (in a neutral atom)' }
      ],
      examples: [
        { q: '¹²₆C — how many protons, neutrons, electrons?',
          steps: ['Z = 6 → protons = 6. Mass = 12 → neutrons = 12 − 6 = 6.', 'Electrons = protons = 6.'] }
      ],
      pitfalls: [
        'Confusing mass number (whole number A) with relative atomic mass (average Ar, e.g. Cl = 35.5).',
        'Forgetting an ion is charged — electron count ≠ proton count.'
      ],
      videos: [
        { title: 'BBC Bitesize — Atomic structure', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zvxvfrd', badge: 'Course' },
        { title: 'FuseSchool — Atoms', source: 'YouTube', url: 'https://www.youtube.com/@fuseschool', badge: 'Channel' }
      ]
    },
    cPeriodic: {
      blurb: `<p>The <strong>periodic table</strong> arranges elements in order of atomic number.
        Elements in the same <strong>group</strong> (column) have the same number of electrons in
        the outer shell — and so behave similarly. <strong>Periods</strong> (rows) show one more
        electron shell.</p>
        <ul>
          <li>Group 1 — Alkali metals (Li, Na, K, …) — soft, very reactive.</li>
          <li>Group 7 — Halogens (F, Cl, Br, I) — very reactive non-metals.</li>
          <li>Group 0 (or 8) — Noble gases — inert.</li>
        </ul>`,
      formulas: [
        { name: 'Group', expr: 'same number of outer electrons' },
        { name: 'Period', expr: 'same number of shells' },
        { name: 'Shell filling', expr: '2, then 8, then 8 (Y9 level)' }
      ],
      examples: [
        { q: 'Sodium: atomic number 11. Electron configuration?',
          steps: ['Fill 2, then 8, then 1 more: <strong>2,8,1</strong>.'] }
      ],
      pitfalls: [
        'Confusing "period" and "group".',
        'Group 0 gases don\'t react much — they already have a full outer shell.'
      ],
      videos: [
        { title: 'BBC Bitesize — Periodic table', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zpq7hyc', badge: 'Course' }
      ]
    },
    cBonding: {
      blurb: `<p>Three main types of bond:</p>
        <ul>
          <li><strong>Ionic</strong> — metal transfers electrons to non-metal. Forms charged ions.
          High melting point, conducts when molten/dissolved (NaCl, MgO).</li>
          <li><strong>Covalent</strong> — non-metals share electrons. Simple molecules (H₂O, CO₂)
          have low melting points; giant covalent (diamond, silicon dioxide) is very hard.</li>
          <li><strong>Metallic</strong> — metal atoms give up outer electrons, forming a "sea" of
          delocalised electrons. Conducts, malleable.</li>
        </ul>`,
      formulas: [
        { name: 'Metal + non-metal',     expr: 'ionic bond' },
        { name: 'Non-metal + non-metal', expr: 'covalent bond' },
        { name: 'Metal + metal',         expr: 'metallic bond' }
      ],
      examples: [
        { q: 'NaCl: metal (Na) + non-metal (Cl). Bond type?',
          steps: ['Metal + non-metal → <strong>ionic</strong>.'] }
      ],
      pitfalls: [
        'Assuming all high-melting-point solids are metals — diamond is covalent.',
        'Missing that ionic solids don\'t conduct as solids, only molten/dissolved.'
      ],
      videos: [
        { title: 'BBC Bitesize — Bonding', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zh4my4j', badge: 'Course' }
      ]
    },
    cReactions: {
      blurb: `<p>A chemical reaction rearranges atoms — nothing is created or destroyed
        (<strong>conservation of mass</strong>). That means balanced equations have the same number
        of each atom on both sides.</p>`,
      formulas: [
        { name: 'Combustion',            expr: 'fuel + O₂ → CO₂ + H₂O (for hydrocarbons)' },
        { name: 'Thermal decomposition', expr: 'compound → simpler products, driven by heat' },
        { name: 'Displacement',          expr: 'more reactive metal kicks out less reactive from a compound' }
      ],
      examples: [
        { q: 'Balance H₂ + O₂ → H₂O.',
          steps: ['2 H on the right needs 1 H₂ on the left, but O₂ has 2 oxygens.',
                 'Try 2 H₂O on right: needs 2 H₂ on left. 2H₂ + O₂ → <strong>2H₂O</strong>.'] }
      ],
      pitfalls: [
        'Changing subscripts to balance an equation — you can only change coefficients.',
        'Forgetting to check every element after balancing.'
      ],
      videos: [
        { title: 'BBC Bitesize — Chemical equations', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zsc4jxs', badge: 'Course' }
      ]
    },
    cAcids: {
      blurb: `<p>The <strong>pH scale</strong> runs 0 to 14. Below 7 is <strong>acidic</strong>,
        above 7 is <strong>alkaline</strong>, 7 is <strong>neutral</strong>. Universal indicator
        colours: red (strong acid) → orange/yellow → green (neutral) → blue → purple (strong alkali).</p>
        <p><strong>Neutralisation</strong>: acid + alkali → salt + water. The salt name depends on
        the acid: HCl → chloride, H₂SO₄ → sulfate, HNO₃ → nitrate.</p>`,
      formulas: [
        { name: 'Neutralisation', expr: 'acid + base → salt + water' },
        { name: 'Acid + metal',   expr: 'acid + metal → salt + hydrogen' },
        { name: 'Acid + carbonate', expr: 'acid + carbonate → salt + water + CO₂' }
      ],
      examples: [
        { q: 'HCl + NaOH → ?',
          steps: ['acid + alkali → salt + water. Salt: <strong>NaCl (sodium chloride)</strong> and water.'] }
      ],
      pitfalls: [
        'Mixing up "acid" and "base" — bases are the metal-oxide/hydroxide side.',
        'Naming a salt with the wrong ending.'
      ],
      videos: [
        { title: 'BBC Bitesize — Acids, bases and salts', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zypsgk7', badge: 'Course' }
      ]
    },
    cRates: {
      blurb: `<p>Reactions go faster when particles collide more often <em>and</em> with more
        energy. Four factors: <strong>temperature</strong>, <strong>concentration</strong> (or
        pressure of gases), <strong>surface area</strong>, <strong>catalyst</strong>. All of these
        increase the rate.</p>`,
      formulas: [
        { name: 'Rate',     expr: 'amount of product / time (or amount of reactant used)' },
        { name: 'Catalyst', expr: 'speeds up a reaction; not used up' }
      ],
      examples: [
        { q: 'Why does grinding chalk make it react faster with dilute acid?',
          steps: ['Smaller pieces = larger surface area. More particles exposed → more collisions/second → faster rate.'] }
      ],
      pitfalls: [
        'Saying "concentration increases the amount of product" — it doesn\'t, it just gets there faster.',
        'Assuming catalysts get consumed — they don\'t.'
      ],
      videos: [
        { title: 'BBC Bitesize — Rate of reaction', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zc42xnb', badge: 'Course' }
      ]
    },
    cMoles: {
      blurb: `<p>Chemical amounts are measured in <strong>moles</strong>. Y9 focuses on
        <strong>Relative Formula Mass (Mr)</strong> — add up the atomic masses of every atom in the
        formula.</p>`,
      formulas: [
        { name: 'Relative formula mass', expr: 'Mr = Σ (Ar × subscript)' },
        { name: 'Common Ar',  expr: 'H=1, C=12, N=14, O=16, Na=23, Mg=24, S=32, Cl=35.5, Ca=40' }
      ],
      examples: [
        { q: 'Mr of H₂SO₄?',
          steps: ['2·H + S + 4·O = 2(1) + 32 + 4(16) = 2 + 32 + 64 = <strong>98</strong>.'] }
      ],
      pitfalls: [
        'Missing the subscripts — H₂ means 2 hydrogens.',
        'Forgetting parentheses — Ca(OH)₂ has 2 (O + H).'
      ],
      videos: [
        { title: 'BBC Bitesize — Chemical calculations', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zvnkr82', badge: 'Course' }
      ]
    },
    cSeparation: {
      blurb: `<p>Match technique to mixture:</p>
        <ul>
          <li><strong>Filtration</strong> — insoluble solid from liquid (sand + water).</li>
          <li><strong>Evaporation / crystallisation</strong> — dissolved solid from solution (salt from sea water).</li>
          <li><strong>Distillation</strong> — separates liquids by boiling point (ethanol from wine).</li>
          <li><strong>Chromatography</strong> — separates dissolved substances by how far they travel (inks, food dyes).</li>
        </ul>`,
      formulas: [
        { name: 'Chromatography',   expr: 'Rf = distance moved by substance / distance moved by solvent' }
      ],
      examples: [
        { q: 'Best technique to recover pure water from sea water?',
          steps: ['You want the water, not the salt → <strong>distillation</strong>.'] }
      ],
      pitfalls: [
        'Confusing evaporation (recovers the solid) with distillation (recovers the liquid).',
        'Rf > 1 is impossible — the substance can\'t move further than the solvent front.'
      ],
      videos: [
        { title: 'BBC Bitesize — Separating mixtures', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zsc4jxs', badge: 'Course' }
      ]
    }
  });
})();
