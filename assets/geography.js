/* Geography — Year 9: tectonics, weather & climate, rivers,
   coasts, ecosystems, population, urbanisation, development. */
(function () {
  'use strict';
  const { rand, pick } = window.Core;
  const G = window.Questions.generators;
  const T = window.Questions.topics;
  window.Content.GEOGRAPHY = window.Content.GEOGRAPHY || {};
  const C = window.Content.GEOGRAPHY;

  // ============================================================
  // GENERATORS
  // ============================================================

  G.gTectonics = [
    function plateFacts() {
      const set = pick([
        { q: 'What is the term for a boundary where two tectonic plates slide past each other?', a: 'conservative' },
        { q: 'What is the term for a boundary where two plates move apart, creating new crust?', a: 'constructive' },
        { q: 'What is the term for a boundary where an oceanic plate sinks under a continental one?', a: 'destructive' },
        { q: 'The Richter scale measures the magnitude of what?', a: 'earthquake' },
        { q: 'What is molten rock inside the Earth called?', a: 'magma' },
        { q: 'What is molten rock once it reaches the surface called?', a: 'lava' }
      ]);
      return {
        topic: 'gTectonics',
        prompt: set.q, hint: '',
        answer: set.a,
        accepts: set.a === 'conservative' ? ['transform'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.gClimate = [
    function climateFacts() {
      const set = pick([
        { q: 'Which climate zone is around the equator: hot and wet all year?', a: 'tropical' },
        { q: 'What is the ongoing rise in Earth\'s average temperature called?', a: 'global warming' },
        { q: 'Which gas is the main driver of the enhanced greenhouse effect?', a: 'carbon dioxide' },
        { q: 'The UK\'s climate is described as which of: tropical, arid, temperate, polar?', a: 'temperate' },
        { q: 'Long-term average weather over 30+ years is called…', a: 'climate' }
      ]);
      return {
        topic: 'gClimate',
        prompt: set.q, hint: '', answer: set.a,
        accepts: set.a === 'carbon dioxide' ? ['co2', 'co₂'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.gRivers = [
    function riverFeatures() {
      const set = pick([
        { q: 'The start of a river is called its…', a: 'source' },
        { q: 'The end of a river, where it enters the sea, is called its…', a: 'mouth' },
        { q: 'The area of land drained by a river is called its…', a: 'drainage basin' },
        { q: 'The feature formed where a river drops over hard rock into a plunge pool is a…', a: 'waterfall' },
        { q: 'A U-shaped lake cut off from a river\'s meander is called an…', a: 'oxbow lake' },
        { q: 'The four types of river erosion are hydraulic action, abrasion, attrition, and…', a: 'solution' }
      ]);
      return {
        topic: 'gRivers',
        prompt: set.q, hint: '', answer: set.a,
        accepts: set.a === 'oxbow lake' ? ['oxbow'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.gCoasts = [
    function coastFeatures() {
      const set = pick([
        { q: 'A ridge of sand/pebbles running along a beach, formed by longshore drift, is a…', a: 'spit' },
        { q: 'A rock arch above the sea, formed by erosion, might eventually collapse to leave a…', a: 'stack' },
        { q: 'The zig-zag movement of material along a beach by waves at an angle is called…', a: 'longshore drift' },
        { q: 'Coastal defences that absorb wave energy by breaking waves offshore are called…', a: 'breakwaters' },
        { q: 'A "hard" coastal defence built vertically against the sea is a…', a: 'sea wall' }
      ]);
      return {
        topic: 'gCoasts',
        prompt: set.q, hint: '', answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.gEcosystems = [
    function biomeFacts() {
      const set = pick([
        { q: 'The largest tropical rainforest on Earth is the…', a: 'amazon' },
        { q: 'A hot, dry biome with less than 250 mm of rain per year is a…', a: 'desert' },
        { q: 'The cold, treeless biome inside the Arctic Circle is called…', a: 'tundra' },
        { q: 'The recycling of nutrients between soil, plants and litter is called the ___ cycle.', a: 'nutrient' },
        { q: 'An organism that makes its own food using sunlight is called a…', a: 'producer' }
      ]);
      return {
        topic: 'gEcosystems',
        prompt: set.q, hint: '', answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.gPopulation = [
    function popCalcs() {
      const total = pick([1500000, 3000000, 5000000, 10000000]);
      const area = pick([500, 1000, 2000, 5000, 10000]);
      const d = Math.round(total / area);
      return {
        topic: 'gPopulation',
        prompt: `A country has a population of <strong>${total.toLocaleString()}</strong> living in an area of <strong>${area.toLocaleString()} km²</strong>. Calculate its <strong>population density</strong> (people per km²).`,
        hint: 'Density = population ÷ area.',
        answer: String(d), numeric: d, tol: 0.5,
        solution: [`${total.toLocaleString()} ÷ ${area.toLocaleString()} = <strong>${d}</strong> people/km².`]
      };
    },
    function migrationTerms() {
      const set = pick([
        { q: 'Someone forced to leave their country due to war or persecution is called a…', a: 'refugee' },
        { q: 'The movement of people <em>into</em> a country is called…', a: 'immigration' },
        { q: 'The movement of people <em>out of</em> a country is called…', a: 'emigration' },
        { q: '"Push factors" push people away from where? Home country or destination? (Type <code>home</code> or <code>destination</code>.)', a: 'home' }
      ]);
      return {
        topic: 'gPopulation',
        prompt: set.q, hint: '', answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.gUrbanisation = [
    function urbanFacts() {
      const set = pick([
        { q: 'A city with a population over 10 million is called a…', a: 'megacity' },
        { q: 'The unplanned informal housing on the outskirts of many LIC cities is called a…', a: 'shanty town' },
        { q: 'The growth of the proportion of people living in cities is called…', a: 'urbanisation' },
        { q: 'In many rich countries, wealthy people moving back to city centres is called…', a: 'gentrification' }
      ]);
      return {
        topic: 'gUrbanisation',
        prompt: set.q, hint: '', answer: set.a,
        accepts: set.a === 'shanty town' ? ['favela', 'slum'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.gDevelopment = [
    function devTerms() {
      const set = pick([
        { q: 'What does GDP stand for? (three words joined)', a: 'gross domestic product' },
        { q: 'What does HDI stand for? (three words joined)', a: 'human development index' },
        { q: 'A country with a high level of industrial and economic development is called a "___-income country" (three letters).', a: 'hic' },
        { q: 'The three indicators that make up the HDI are life expectancy, income, and…', a: 'education' }
      ]);
      return {
        topic: 'gDevelopment',
        prompt: set.q, hint: '', answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  // ============================================================
  // TOPIC REGISTRY
  // ============================================================
  const topics = [
    { key: 'gTectonics',    subject: 'geography', label: 'Tectonics',            section: 'Physical Geography' },
    { key: 'gClimate',      subject: 'geography', label: 'Weather & climate',    section: 'Physical Geography' },
    { key: 'gRivers',       subject: 'geography', label: 'Rivers',               section: 'Physical Geography' },
    { key: 'gCoasts',       subject: 'geography', label: 'Coasts',               section: 'Physical Geography' },
    { key: 'gEcosystems',   subject: 'geography', label: 'Ecosystems & biomes',  section: 'Physical Geography' },
    { key: 'gPopulation',   subject: 'geography', label: 'Population & migration', section: 'Human Geography' },
    { key: 'gUrbanisation', subject: 'geography', label: 'Urbanisation',         section: 'Human Geography' },
    { key: 'gDevelopment',  subject: 'geography', label: 'Development',          section: 'Human Geography' }
  ];
  topics.forEach(t => T.push(t));

  // ============================================================
  // CONTENT
  // ============================================================
  Object.assign(C, {
    gTectonics: {
      blurb: `<p>Earth's crust is broken into large <strong>tectonic plates</strong> that slowly
        move on the mantle beneath. Their boundaries are where most earthquakes and volcanoes
        happen.</p>
        <ul>
          <li><strong>Constructive</strong> (divergent) — plates move apart, magma rises, new crust forms (mid-Atlantic ridge).</li>
          <li><strong>Destructive</strong> (convergent) — one plate slides under another (subduction), forming trenches and volcanic mountains (Andes, Pacific "Ring of Fire").</li>
          <li><strong>Conservative</strong> (transform) — plates slide past each other, causing earthquakes but no volcanoes (San Andreas Fault).</li>
        </ul>`,
      formulas: [
        { name: 'Earthquake magnitude', expr: 'Richter scale (open-ended, logarithmic)' },
        { name: 'Volcano types',        expr: 'shield (gentle, basaltic) · composite (steep, explosive)' }
      ],
      examples: [
        { q: 'Why are there lots of volcanoes around the Pacific?',
          steps: ['The "Ring of Fire" is a series of destructive plate boundaries encircling the Pacific.',
                 'At these boundaries, oceanic plates subduct, melting and erupting as volcanoes.'] }
      ],
      pitfalls: [
        'Confusing magnitude (scale of energy) with intensity (felt effect).',
        'Assuming all volcanoes are explosive — shield volcanoes are gentle.'
      ],
      videos: [
        { title: 'BBC Bitesize — Tectonic hazards', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zbnbrj6', badge: 'Course' },
        { title: 'GeographyKing / Geographer Online', source: 'YouTube', url: 'https://www.youtube.com/@geographerOnline', badge: 'Channel' }
      ]
    },
    gClimate: {
      blurb: `<p><strong>Weather</strong> is what happens over hours/days. <strong>Climate</strong>
        is the average pattern over 30+ years. Climate zones (tropical, arid, temperate, polar)
        depend mostly on latitude — how directly the Sun's energy hits.</p>
        <p><strong>Global warming</strong> is the rise in average temperatures over the last
        century, driven mainly by human emissions of greenhouse gases (CO₂ from fossil fuels,
        methane from farming).</p>`,
      formulas: [
        { name: 'Weather vs climate',   expr: 'weather = short-term. climate = long-term (30+ years).' },
        { name: 'Greenhouse gases',     expr: 'CO₂, CH₄, N₂O, water vapour' }
      ],
      examples: [
        { q: 'Why is the equator warmer than the poles?',
          steps: ['At the equator, sunlight strikes the surface almost vertically → energy concentrated in a small area.',
                 'At the poles, sunlight strikes at a shallow angle → same energy spread over a larger area, cooler.'] }
      ],
      pitfalls: [
        '"A cold winter proves global warming isn\'t happening" — weather ≠ climate; global average matters.',
        'Confusing the greenhouse effect (natural, keeps Earth habitable) with the enhanced greenhouse effect (human-caused warming).'
      ],
      videos: [
        { title: 'BBC Bitesize — Climate', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/z6ssgk7', badge: 'Course' },
        { title: 'NASA — Climate change', source: 'nasa.gov', url: 'https://climate.nasa.gov/', badge: 'Reference' }
      ]
    },
    gRivers: {
      blurb: `<p>A river flows from its <strong>source</strong> (usually a hillside or spring) to
        its <strong>mouth</strong> (the sea). Along the way it <strong>erodes</strong>,
        <strong>transports</strong> and <strong>deposits</strong> sediment.</p>
        <p>Upper course: steep, narrow valleys, waterfalls. Middle course: meanders. Lower course:
        wide, flat floodplain with oxbow lakes.</p>`,
      formulas: [
        { name: 'Long profile',   expr: 'V-shape → gentle gradient toward mouth' },
        { name: 'Erosion types',  expr: 'hydraulic action · abrasion · attrition · solution' },
        { name: 'Transport types', expr: 'traction · saltation · suspension · solution' }
      ],
      examples: [
        { q: 'How does a waterfall form?',
          steps: ['A band of hard rock over soft rock.',
                 'Water erodes the soft rock faster, undercutting the hard rock.',
                 'The overhang collapses, and the waterfall retreats upstream, leaving a gorge.'] }
      ],
      pitfalls: [
        'Confusing erosion (wearing away) with weathering (breakdown in place).',
        'Assuming the upper course has meanders — those are middle/lower course.'
      ],
      videos: [
        { title: 'BBC Bitesize — Rivers', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zt6jpv4', badge: 'Course' }
      ]
    },
    gCoasts: {
      blurb: `<p>Coasts are shaped by waves. <strong>Destructive waves</strong> (steep, strong
        backwash) erode. <strong>Constructive waves</strong> (long, strong swash) deposit.</p>
        <p>Erosion produces cliffs, wave-cut platforms, headlands, caves, arches, stacks and stumps.
        Deposition produces beaches, spits, bars and tombolos. Coastal defences can be
        <strong>hard</strong> (sea walls, groynes) or <strong>soft</strong> (beach nourishment).</p>`,
      formulas: [
        { name: 'Erosion sequence', expr: 'crack → cave → arch → stack → stump' },
        { name: 'Longshore drift',  expr: 'waves at angle move material along the beach' }
      ],
      examples: [
        { q: 'How does an arch become a stack?',
          steps: ['Waves erode a headland, creating a cave.',
                 'The cave breaks through, forming an arch.',
                 'The arch\'s roof collapses, leaving an isolated column: a stack.',
                 'The stack later erodes down to a stump.'] }
      ],
      pitfalls: [
        'Confusing spit (attached at one end) with bar (attached at both ends).',
        'Assuming sea walls are always the best defence — they\'re expensive and reflect wave energy.'
      ],
      videos: [
        { title: 'BBC Bitesize — Coasts', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zwx76sg', badge: 'Course' }
      ]
    },
    gEcosystems: {
      blurb: `<p>An <strong>ecosystem</strong> is a community of living things and their non-living
        environment. Global-scale ecosystems are called <strong>biomes</strong>: tropical
        rainforest, savanna, desert, temperate forest, tundra, coral reefs, etc.</p>
        <p>Producers (plants) → primary consumers (herbivores) → secondary consumers (carnivores)
        → decomposers. Every level loses about 90% of the energy as heat, which is why food
        chains rarely have more than 4–5 links.</p>`,
      formulas: [
        { name: 'Food chain', expr: 'producer → primary → secondary → tertiary' },
        { name: 'Nutrient cycle',   expr: 'biomass ↔ litter ↔ soil' }
      ],
      examples: [
        { q: 'Why is the Amazon rainforest so rich in species?',
          steps: ['Warm and wet all year → high productivity of plants.',
                 'Multiple layers of forest = many habitats.',
                 'Long-term climatic stability → time for many species to evolve.'] }
      ],
      pitfalls: [
        'Confusing weather (short-term) with climate (long-term) — biome zones depend on the latter.',
        'Forgetting decomposers — they close the loop.'
      ],
      videos: [
        { title: 'BBC Bitesize — Ecosystems', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/z849q6f', badge: 'Course' }
      ]
    },
    gPopulation: {
      blurb: `<p>The world\'s population is about 8 billion (2025) and growing — but slowly. Some
        countries have young, fast-growing populations; others are ageing.</p>
        <p><strong>Migration</strong> is people moving. It can be <em>voluntary</em> (job, family)
        or <em>forced</em> (war, disaster, persecution — refugees & asylum seekers).</p>`,
      formulas: [
        { name: 'Population density', expr: 'people ÷ area (per km²)' },
        { name: 'Push factors',       expr: 'reasons to leave home (war, poverty)' },
        { name: 'Pull factors',       expr: 'reasons to move to somewhere new (jobs, safety)' }
      ],
      examples: [
        { q: 'A country has 5 million people in 2000 km². What is its population density?',
          steps: ['5,000,000 ÷ 2,000 = <strong>2,500 people/km²</strong>.'] }
      ],
      pitfalls: [
        'Confusing refugees (forced, fleeing danger) with economic migrants (voluntary).',
        'Assuming all countries have the same population structure.'
      ],
      videos: [
        { title: 'BBC Bitesize — Population', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zg64jxs', badge: 'Course' }
      ]
    },
    gUrbanisation: {
      blurb: `<p>Around 55% of the world now lives in cities — up from 30% in 1950. The fastest
        growth is in Asia and Africa. Cities over 10 million are called <strong>megacities</strong>
        (Tokyo, Delhi, Shanghai, Mumbai, Lagos, …).</p>
        <p>Urbanisation brings jobs and services but also strain: informal settlements
        (<em>shanty towns</em>, <em>favelas</em>), traffic, pollution, and unequal access to housing.</p>`,
      formulas: [
        { name: 'Megacity',            expr: 'population > 10 million' },
        { name: 'Rural-to-urban migration', expr: 'main driver in LICs/NEEs' }
      ],
      examples: [
        { q: 'Why do people move to cities in low-income countries?',
          steps: ['Push: rural poverty, lack of jobs, drought.',
                 'Pull: hope of factory jobs, education, healthcare in cities.'] }
      ],
      pitfalls: [
        'Assuming urbanisation is always bad — cities also generate wealth and services.',
        'Confusing shanty towns (spontaneous, low-quality) with planned social housing.'
      ],
      videos: [
        { title: 'BBC Bitesize — Urbanisation', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zjvmn39', badge: 'Course' }
      ]
    },
    gDevelopment: {
      blurb: `<p>Countries develop economically over time. Traditional measures include
        <strong>GDP</strong> (gross domestic product — total wealth produced) and
        <strong>GDP per capita</strong> (per person). But wealth alone isn\'t enough.</p>
        <p>The <strong>Human Development Index (HDI)</strong> combines income with life
        expectancy and education (years of schooling) to give a fuller picture. HDI runs 0–1;
        HICs are close to 1, LICs closer to 0.5.</p>`,
      formulas: [
        { name: 'GDP',       expr: 'total value of goods and services produced in a country' },
        { name: 'HDI',       expr: 'combines life expectancy + education + GNI' },
        { name: 'HIC / MIC / LIC', expr: 'high / middle / low income country' }
      ],
      examples: [
        { q: 'Why is HDI often preferred over GDP per capita for measuring development?',
          steps: ['GDP per capita measures average wealth but ignores inequality, health, and education.',
                 'HDI captures a broader picture of quality of life.'] }
      ],
      pitfalls: [
        'Assuming HDI captures everything — it misses inequality (that\'s the Inequality-adjusted HDI).',
        'Confusing GDP and GNI (Gross National Income).'
      ],
      videos: [
        { title: 'BBC Bitesize — Development', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zpx7hyc', badge: 'Course' }
      ]
    }
  });
})();
