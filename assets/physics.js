/* Physics — Year 9 topics: forces, motion, energy, electricity,
   waves, density/pressure, magnetism, space. Registers on
   window.Questions and window.Content.PHYSICS. */
(function () {
  'use strict';
  const { rand, pick } = window.Core;
  const G = window.Questions.generators;
  const T = window.Questions.topics;
  window.Content.PHYSICS = window.Content.PHYSICS || {};
  const C = window.Content.PHYSICS;

  // ============================================================
  // GENERATORS
  // ============================================================

  G.pForces = [
    function weight() {
      const m = pick([2, 5, 10, 12, 25, 40, 60, 75]);
      const g = 10;
      const W = m * g;
      return {
        topic: 'pForces',
        prompt: `Find the weight (in newtons) of an object with mass <strong>${m} kg</strong> on Earth. Use g = 10 N/kg.`,
        hint: `W = m × g.`,
        answer: String(W), numeric: W,
        solution: [`W = ${m} × 10 = <strong>${W} N</strong>.`]
      };
    },
    function resultantForce() {
      const f1 = pick([10, 15, 20, 25, 30, 40]);
      const f2 = pick([5, 8, 12, 18, 22]);
      const dir = pick(['same', 'opposite']);
      const R = dir === 'same' ? f1 + f2 : Math.abs(f1 - f2);
      return {
        topic: 'pForces',
        prompt: `Two forces act on an object: <strong>${f1} N</strong> to the right and <strong>${f2} N</strong> to the ${dir === 'same' ? 'right' : 'left'}. Find the resultant force (N).`,
        hint: `Same direction → add. Opposite → subtract.`,
        answer: String(R), numeric: R,
        solution: [`Resultant = ${f1} ${dir === 'same' ? '+' : '−'} ${f2} = <strong>${R} N</strong>.`]
      };
    },
    function newton2() {
      const m = pick([2, 4, 5, 8, 10, 12, 20]);
      const a = pick([1, 2, 3, 4, 5, 6]);
      const F = m * a;
      return {
        topic: 'pForces',
        prompt: `A mass of <strong>${m} kg</strong> accelerates at <strong>${a} m/s²</strong>. Find the resultant force (N).`,
        hint: `F = m × a.`,
        answer: String(F), numeric: F,
        solution: [`F = ${m} × ${a} = <strong>${F} N</strong>.`]
      };
    }
  ];

  G.pMotion = [
    function suvatV() {
      const u = pick([0, 2, 5, 8, 10, 15]);
      const a = pick([1, 2, 3, 5]);
      const t = pick([2, 3, 4, 5, 8, 10]);
      const v = u + a * t;
      return {
        topic: 'pMotion',
        prompt: `An object starts at <strong>${u} m/s</strong> and accelerates at <strong>${a} m/s²</strong> for <strong>${t} s</strong>. Find its final velocity (m/s).`,
        hint: `v = u + at.`,
        answer: String(v), numeric: v,
        solution: [`v = ${u} + ${a} × ${t} = <strong>${v} m/s</strong>.`]
      };
    },
    function distanceFromSpeed() {
      const v = pick([12, 15, 20, 25, 30, 40]);
      const t = pick([2, 4, 5, 6, 8, 10]);
      const d = v * t;
      return {
        topic: 'pMotion',
        prompt: `A car travels at a steady <strong>${v} m/s</strong> for <strong>${t} s</strong>. How far does it travel (m)?`,
        hint: `distance = speed × time.`,
        answer: String(d), numeric: d,
        solution: [`d = ${v} × ${t} = <strong>${d} m</strong>.`]
      };
    },
    function accelFromChange() {
      const u = pick([0, 5, 10, 12]);
      const v = pick([20, 25, 30, 40]);
      const t = pick([2, 4, 5]);
      const a = +((v - u) / t).toFixed(2);
      return {
        topic: 'pMotion',
        prompt: `Speed changes from <strong>${u} m/s</strong> to <strong>${v} m/s</strong> in <strong>${t} s</strong>. Find the acceleration (m/s², to 2 dp).`,
        hint: `a = (v − u) / t.`,
        answer: a.toFixed(2), numeric: a, tol: 0.02,
        solution: [`a = (${v} − ${u}) / ${t} = <strong>${a} m/s²</strong>.`]
      };
    }
  ];

  G.pEnergy = [
    function kineticEnergy() {
      const m = pick([2, 4, 5, 10, 20, 50, 80]);
      const v = pick([2, 3, 5, 6, 8, 10]);
      const KE = 0.5 * m * v * v;
      return {
        topic: 'pEnergy',
        prompt: `A <strong>${m} kg</strong> object moves at <strong>${v} m/s</strong>. Find its kinetic energy (J).`,
        hint: `KE = ½ m v².`,
        answer: String(KE), numeric: KE,
        solution: [`KE = ½ × ${m} × ${v}² = ½ × ${m} × ${v*v} = <strong>${KE} J</strong>.`]
      };
    },
    function gpe() {
      const m = pick([2, 5, 10, 20, 50]);
      const h = pick([2, 3, 5, 8, 10, 15]);
      const g = 10;
      const GPE = m * g * h;
      return {
        topic: 'pEnergy',
        prompt: `A <strong>${m} kg</strong> mass is lifted <strong>${h} m</strong>. Find the gain in gravitational potential energy (J). g = 10 N/kg.`,
        hint: `GPE = m g h.`,
        answer: String(GPE), numeric: GPE,
        solution: [`GPE = ${m} × 10 × ${h} = <strong>${GPE} J</strong>.`]
      };
    },
    function efficiency() {
      const useful = pick([40, 60, 80, 120, 150, 200]);
      const total = useful + pick([20, 30, 40, 60, 80]);
      const eff = +((useful / total) * 100).toFixed(1);
      return {
        topic: 'pEnergy',
        prompt: `A device outputs <strong>${useful} J</strong> of useful energy for every <strong>${total} J</strong> supplied. Find the efficiency (%) to 1 dp.`,
        hint: `Efficiency = useful ÷ total × 100.`,
        answer: eff.toFixed(1), numeric: eff, tol: 0.2,
        solution: [`Efficiency = ${useful} / ${total} × 100 = <strong>${eff}%</strong>.`]
      };
    }
  ];

  G.pElectric = [
    function ohm() {
      const V = pick([6, 9, 12, 24]);
      const R = pick([2, 3, 4, 6, 8, 12]);
      const I = +(V / R).toFixed(2);
      return {
        topic: 'pElectric',
        prompt: `A resistor of <strong>${R} Ω</strong> is connected across <strong>${V} V</strong>. Find the current through it (A, 2 dp).`,
        hint: `V = IR, so I = V / R.`,
        answer: I.toFixed(2), numeric: I, tol: 0.02,
        solution: [`I = ${V} / ${R} = <strong>${I} A</strong>.`]
      };
    },
    function power() {
      const V = pick([120, 230, 12, 24]);
      const I = pick([0.5, 1, 2, 5, 10]);
      const P = V * I;
      return {
        topic: 'pElectric',
        prompt: `Voltage = <strong>${V} V</strong>, current = <strong>${I} A</strong>. Find the power (W).`,
        hint: `P = V × I.`,
        answer: String(P), numeric: P,
        solution: [`P = ${V} × ${I} = <strong>${P} W</strong>.`]
      };
    }
  ];

  G.pWaves = [
    function waveEqn() {
      const f = pick([20, 50, 100, 200, 500, 1000]);
      const lam = +(pick([0.1, 0.2, 0.5, 1, 2, 5])).toFixed(2);
      const v = +(f * lam).toFixed(2);
      return {
        topic: 'pWaves',
        prompt: `A wave has frequency <strong>${f} Hz</strong> and wavelength <strong>${lam} m</strong>. Find its speed (m/s).`,
        hint: `v = f × λ.`,
        answer: String(v), numeric: v, tol: 0.05,
        solution: [`v = ${f} × ${lam} = <strong>${v} m/s</strong>.`]
      };
    },
    function waveType() {
      const t = pick(['transverse', 'longitudinal']);
      const desc = {
        transverse:  'Vibrations are at 90° to the direction the wave travels. Examples: light, water ripples, waves on a string.',
        longitudinal:'Vibrations are along the direction of travel — compressions and rarefactions. Example: sound in air.'
      }[t];
      return {
        topic: 'pWaves',
        prompt: `Which type of wave is described? "${desc}" (Type <code>transverse</code> or <code>longitudinal</code>.)`,
        hint: `Sound = longitudinal. Light = transverse.`,
        answer: t,
        solution: [`Answer: <strong>${t}</strong>.`]
      };
    }
  ];

  G.pDensity = [
    function density() {
      const m = pick([100, 250, 500, 1000, 2000]);
      const V = pick([50, 100, 200, 250, 500]);
      const d = +(m / V).toFixed(2);
      return {
        topic: 'pDensity',
        prompt: `An object has mass <strong>${m} g</strong> and volume <strong>${V} cm³</strong>. Find its density (g/cm³, 2 dp).`,
        hint: `ρ = m / V.`,
        answer: d.toFixed(2), numeric: d, tol: 0.02,
        solution: [`ρ = ${m} / ${V} = <strong>${d} g/cm³</strong>.`]
      };
    },
    function pressure() {
      const F = pick([50, 100, 200, 500, 1000]);
      const A = pick([2, 4, 5, 10, 20]);
      const P = F / A;
      return {
        topic: 'pDensity',
        prompt: `A force of <strong>${F} N</strong> acts over an area of <strong>${A} m²</strong>. Find the pressure (Pa).`,
        hint: `P = F / A.`,
        answer: String(P), numeric: P,
        solution: [`P = ${F} / ${A} = <strong>${P} Pa</strong>.`]
      };
    }
  ];

  G.pMagnetism = [
    function magPole() {
      const pair = pick([
        { q: 'Two north poles are brought close together. Do they attract or repel?', a: 'repel' },
        { q: 'A north and south pole are brought close together. Do they attract or repel?', a: 'attract' },
        { q: 'Two south poles are brought close together. Do they attract or repel?', a: 'repel' }
      ]);
      return {
        topic: 'pMagnetism',
        prompt: pair.q + ' (Type <code>attract</code> or <code>repel</code>.)',
        hint: 'Like poles repel, unlike poles attract.',
        answer: pair.a,
        solution: [`Rule: like poles repel; unlike poles attract. Answer: <strong>${pair.a}</strong>.`]
      };
    }
  ];

  G.pSpace = [
    function orbitTime() {
      const stmt = pick([
        { q: 'How many days does the Earth take to complete one orbit of the Sun?', a: '365', numeric: 365 },
        { q: 'Roughly how many hours does the Earth take to spin once on its axis?', a: '24', numeric: 24 },
        { q: 'How many planets are there in the Solar System?', a: '8', numeric: 8 },
        { q: 'Which is the largest planet in the Solar System? (Type its name.)', a: 'jupiter' }
      ]);
      return {
        topic: 'pSpace',
        prompt: stmt.q,
        hint: '',
        answer: stmt.a,
        numeric: stmt.numeric,
        solution: [`Answer: <strong>${stmt.a}</strong>.`]
      };
    }
  ];

  // ============================================================
  // TOPIC REGISTRY
  // ============================================================
  const topics = [
    { key: 'pForces',    subject: 'physics', label: 'Forces & Newton\'s laws', section: 'Forces & Motion' },
    { key: 'pMotion',    subject: 'physics', label: 'Motion (SUVAT)',         section: 'Forces & Motion' },
    { key: 'pEnergy',    subject: 'physics', label: 'Energy (KE, GPE, efficiency)', section: 'Energy' },
    { key: 'pElectric',  subject: 'physics', label: 'Electricity (V=IR, power)', section: 'Electricity' },
    { key: 'pWaves',     subject: 'physics', label: 'Waves',                   section: 'Waves' },
    { key: 'pDensity',   subject: 'physics', label: 'Density & pressure',      section: 'Matter' },
    { key: 'pMagnetism', subject: 'physics', label: 'Magnetism',               section: 'Electricity' },
    { key: 'pSpace',     subject: 'physics', label: 'Space',                   section: 'Space' }
  ];
  topics.forEach(t => T.push(t));

  // ============================================================
  // CONTENT
  // ============================================================
  Object.assign(C, {
    pForces: {
      blurb: `<p>A <strong>force</strong> is a push or a pull, measured in <strong>newtons (N)</strong>.
        On Earth, gravity pulls every kilogram of mass with about 10 N — that's the object's
        <strong>weight</strong>. <strong>Newton's second law</strong> connects force, mass, and
        acceleration: heavier things are harder to speed up.</p>`,
      formulas: [
        { name: 'Weight',            expr: 'W = m × g  (g ≈ 10 N/kg on Earth)' },
        { name: 'Newton\'s 2nd law', expr: 'F = m × a' },
        { name: 'Resultant force',   expr: 'add forces in the same direction, subtract opposite' }
      ],
      examples: [
        { q: 'A 60 kg pupil steps onto a scale. What weight does the scale read (N)?',
          steps: ['W = 60 × 10 = <strong>600 N</strong>.'] },
        { q: 'A 4 kg trolley is pushed with a resultant force of 12 N. Find the acceleration.',
          steps: ['a = F / m = 12 / 4 = <strong>3 m/s²</strong>.'] }
      ],
      pitfalls: [
        'Confusing mass (kg, does not change) with weight (N, depends on gravity).',
        'Forgetting to use the <em>resultant</em> force — friction usually opposes motion.'
      ],
      videos: [
        { title: 'BBC Bitesize — Forces', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zsxxsbk', badge: 'Course' },
        { title: 'PhysicsOnline — Newton\'s Laws', source: 'YouTube', url: 'https://www.youtube.com/@physicsonlinelessons', badge: 'Channel' }
      ]
    },
    pMotion: {
      blurb: `<p>Motion problems use the <strong>SUVAT equations</strong>, but at Year 9 the two you
        need most are the speed one and the acceleration one. Draw a diagram and label u, v, a, t —
        it saves half the errors.</p>`,
      formulas: [
        { name: 'Speed',        expr: 'speed = distance / time' },
        { name: 'Acceleration', expr: 'a = (v − u) / t' },
        { name: 'Final speed',  expr: 'v = u + a t' }
      ],
      examples: [
        { q: 'A ball dropped from rest accelerates at 10 m/s² for 3 s. Find its speed after 3 s.',
          steps: ['v = 0 + 10 × 3 = <strong>30 m/s</strong>.'] }
      ],
      pitfalls: [
        'Using distance where speed was needed.',
        'Forgetting to include the units in the final answer.'
      ],
      videos: [
        { title: 'BBC Bitesize — Motion', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zwbn7ty', badge: 'Course' }
      ]
    },
    pEnergy: {
      blurb: `<p>Energy is <em>conserved</em> — it just moves between stores. A dropped ball's
        gravitational potential energy turns into kinetic energy (and a bit of heat and sound at the
        end). Efficiency measures how much of the energy in becomes useful energy out.</p>`,
      formulas: [
        { name: 'Kinetic energy', expr: 'KE = ½ m v²' },
        { name: 'Grav. PE',       expr: 'GPE = m g h' },
        { name: 'Efficiency',     expr: '(useful out / total in) × 100%' }
      ],
      examples: [
        { q: 'A 2 kg ball is lifted 5 m. Find its GPE. g = 10.',
          steps: ['GPE = 2 × 10 × 5 = <strong>100 J</strong>.'] }
      ],
      pitfalls: [
        'Forgetting to square v in the KE formula.',
        'Assuming 100% efficiency — always &lt; 100% for real devices.'
      ],
      videos: [
        { title: 'BBC Bitesize — Energy', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zdrrd2p', badge: 'Course' }
      ]
    },
    pElectric: {
      blurb: `<p>In a circuit, current (I, in amps) is the rate of flow of charge. Voltage (V, in
        volts) is the "push" from the battery. Resistance (R, in ohms) slows it down.
        <strong>Ohm's law</strong> ties them together.</p>`,
      formulas: [
        { name: 'Ohm\'s law', expr: 'V = I × R' },
        { name: 'Power',      expr: 'P = V × I' },
        { name: 'Energy',     expr: 'E = P × t' }
      ],
      examples: [
        { q: 'A bulb needs 3 A at 6 V. Find its resistance.',
          steps: ['R = V / I = 6 / 3 = <strong>2 Ω</strong>.'] }
      ],
      pitfalls: [
        'In series: same current everywhere. In parallel: same voltage across branches.',
        'Confusing amps and volts.'
      ],
      videos: [
        { title: 'BBC Bitesize — Electricity', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/z9phvcw', badge: 'Course' }
      ]
    },
    pWaves: {
      blurb: `<p>A wave transfers energy without transferring matter. <strong>Transverse</strong>
        waves oscillate at 90° to travel direction (light); <strong>longitudinal</strong> ones
        along it (sound). Every wave obeys v = fλ.</p>`,
      formulas: [
        { name: 'Wave equation', expr: 'v = f × λ' },
        { name: 'Period',        expr: 'T = 1 / f' }
      ],
      examples: [
        { q: 'A sound wave has frequency 500 Hz and wavelength 0.68 m. Find its speed.',
          steps: ['v = 500 × 0.68 = <strong>340 m/s</strong> (roughly the speed of sound).'] }
      ],
      pitfalls: [
        'Assuming light is longitudinal — it\'s transverse.',
        'Using wrong units — Hz for frequency, m for wavelength.'
      ],
      videos: [
        { title: 'BBC Bitesize — Waves', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zwqycdm', badge: 'Course' }
      ]
    },
    pDensity: {
      blurb: `<p>Density is mass per unit volume — the "heaviness" of a substance regardless of size.
        Pressure is force spread over area — a sharp knife has small area, so high pressure.</p>`,
      formulas: [
        { name: 'Density',  expr: 'ρ = m / V' },
        { name: 'Pressure', expr: 'P = F / A' }
      ],
      examples: [
        { q: 'A block has mass 200 g and volume 50 cm³. Find its density.',
          steps: ['ρ = 200 / 50 = <strong>4 g/cm³</strong>.'] }
      ],
      pitfalls: [
        'Wrong units — kg/m³ or g/cm³, not both.',
        'Confusing pressure with force.'
      ],
      videos: [
        { title: 'BBC Bitesize — Density & pressure', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/guides/zqbxwmn', badge: 'Course' }
      ]
    },
    pMagnetism: {
      blurb: `<p>Every magnet has a north and a south pole. <strong>Like poles repel; unlike poles
        attract.</strong> A current-carrying wire produces a magnetic field (Ørsted's discovery) —
        the basis of every motor.</p>`,
      formulas: [
        { name: 'Rule of poles', expr: 'like → repel, unlike → attract' },
        { name: 'Right-hand rule', expr: 'thumb = current, fingers = field direction' }
      ],
      examples: [
        { q: 'Two south poles are placed together. What happens?',
          steps: ['Like poles → <strong>repel</strong>.'] }
      ],
      pitfalls: [
        'Assuming a wire needs a battery to be "electromagnetic" — even a bar magnet has a field.'
      ],
      videos: [
        { title: 'BBC Bitesize — Magnetism', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zj77xfr', badge: 'Course' }
      ]
    },
    pSpace: {
      blurb: `<p>Our Solar System has one star (the Sun), 8 planets, dwarf planets and moons. The
        Earth orbits the Sun once a year, and spins on its own axis once a day (giving day and
        night). Gravity holds the whole thing together.</p>`,
      formulas: [
        { name: 'Earth day', expr: '≈ 24 hours' },
        { name: 'Earth year', expr: '≈ 365.25 days' },
        { name: 'Planets, in order', expr: 'Mercury · Venus · Earth · Mars · Jupiter · Saturn · Uranus · Neptune' }
      ],
      examples: [
        { q: 'Why do we have seasons?',
          steps: ['Earth\'s axis is tilted at ≈ 23.5°. As Earth orbits the Sun, different hemispheres tilt towards it, giving longer/hotter days.'] }
      ],
      pitfalls: [
        'Confusing "orbit" (round the Sun) with "rotate" (spin on axis).',
        'Thinking seasons are because Earth is closer to the Sun — it\'s the tilt, not the distance.'
      ],
      videos: [
        { title: 'BBC Bitesize — Earth & Space', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zdrrd2p', badge: 'Course' },
        { title: 'NASA — Solar System', source: 'nasa.gov', url: 'https://solarsystem.nasa.gov/', badge: 'Reference' }
      ]
    }
  });
})();
