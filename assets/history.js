/* History — Year 9 typical UK topics: Industrial Revolution,
   Empire, WW1, Interwar, WW2, Holocaust, Cold War, Suffrage. */
(function () {
  'use strict';
  const { rand, pick } = window.Core;
  const G = window.Questions.generators;
  const T = window.Questions.topics;
  window.Content.HISTORY = window.Content.HISTORY || {};
  const C = window.Content.HISTORY;

  // Helper: multi-choice-ish generator returning one right & several distractors
  const trueFalseLike = (subject, prompt, ans) => ({
    topic: subject,
    prompt,
    answer: ans,
    solution: [`Answer: <strong>${ans}</strong>.`]
  });

  // ============================================================
  // GENERATORS
  // ============================================================

  G.hIndustrial = [
    function whoInvented() {
      const set = pick([
        { q: 'Who improved the steam engine in the 1760s–70s, making the Industrial Revolution possible?', a: 'james watt' },
        { q: 'Which "spinning" machine, invented by James Hargreaves in 1764, could spin multiple threads at once?', a: 'spinning jenny' },
        { q: 'Which invention of Richard Arkwright used water power to spin cotton?', a: 'water frame' },
        { q: 'In which year did the Stockton and Darlington Railway open — the first public steam railway?', a: '1825', numeric: 1825 }
      ]);
      return {
        topic: 'hIndustrial',
        prompt: set.q,
        hint: '',
        answer: set.a,
        numeric: set.numeric,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    },
    function conditionEra() {
      const set = pick([
        { q: 'Overcrowded industrial cities with poor sanitation led to outbreaks of which water-borne disease?', a: 'cholera' },
        { q: 'Which 1833 law limited the working hours of children under 9 in textile factories?', a: 'factory act' },
        { q: 'Which social class grew rapidly during the Industrial Revolution, made up of factory owners and merchants?', a: 'middle class' }
      ]);
      return {
        topic: 'hIndustrial',
        prompt: set.q, hint: '', answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.hEmpire = [
    function empireFacts() {
      const set = pick([
        { q: 'By 1900, roughly what fraction of the world was controlled by the British Empire? (Answer as a fraction like <code>1/4</code>.)', a: '1/4' },
        { q: 'Which subcontinent was called "the jewel in the crown" of the British Empire?', a: 'india' },
        { q: 'In which year did India gain independence from Britain?', a: '1947', numeric: 1947 },
        { q: 'The British Empire benefited most economically from what type of trade in the 1600s–1800s?', a: 'slave trade' }
      ]);
      return {
        topic: 'hEmpire',
        prompt: set.q, hint: '', answer: set.a, numeric: set.numeric,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.hWW1 = [
    function ww1Facts() {
      const set = pick([
        { q: 'In which year did WW1 begin?', a: '1914', numeric: 1914 },
        { q: 'In which year did WW1 end?', a: '1918', numeric: 1918 },
        { q: 'Whose assassination in Sarajevo triggered WW1?', a: 'franz ferdinand' },
        { q: 'The system of pre-war military agreements between countries was called…', a: 'alliances' },
        { q: 'What is the term for the muddy defensive lines of WW1 where soldiers lived and fought?', a: 'trenches' },
        { q: 'Which battle in 1916 killed roughly 1 million soldiers over 5 months?', a: 'battle of the somme' },
        { q: 'The 1919 peace treaty that punished Germany after WW1 was the Treaty of…', a: 'versailles' }
      ]);
      return {
        topic: 'hWW1',
        prompt: set.q, hint: '', answer: set.a, numeric: set.numeric,
        accepts: set.a === 'battle of the somme' ? ['somme'] : set.a === 'franz ferdinand' ? ['archduke franz ferdinand'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    },
    function causeMAIN() {
      const map = { M: 'militarism', A: 'alliances', I: 'imperialism', N: 'nationalism' };
      const letter = pick(['M', 'A', 'I', 'N']);
      return {
        topic: 'hWW1',
        prompt: `The four long-term causes of WW1 are often remembered as M-A-I-N. What does the letter <strong>${letter}</strong> stand for?`,
        hint: 'M = militarism, A = alliances, I = imperialism, N = nationalism.',
        answer: map[letter],
        solution: [`${letter} = <strong>${map[letter]}</strong>.`]
      };
    }
  ];

  G.hInterwar = [
    function interwarFacts() {
      const set = pick([
        { q: 'The 1929 collapse of the US stock market is called the Wall Street…', a: 'crash' },
        { q: 'In which country did Hitler come to power in 1933?', a: 'germany' },
        { q: 'What was the name of Hitler\'s political party?', a: 'nazi party' },
        { q: 'The economic depression of the 1930s is often called the Great…', a: 'depression' },
        { q: 'The weak German government of 1919–1933 was called the ___ Republic.', a: 'weimar' }
      ]);
      return {
        topic: 'hInterwar',
        prompt: set.q, hint: '', answer: set.a,
        accepts: set.a === 'nazi party' ? ['nazi', 'nsdap', 'national socialist'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.hWW2 = [
    function ww2Facts() {
      const set = pick([
        { q: 'In which year did WW2 begin?', a: '1939', numeric: 1939 },
        { q: 'In which year did WW2 end?', a: '1945', numeric: 1945 },
        { q: 'Germany invaded which country on 1 September 1939, starting WW2?', a: 'poland' },
        { q: 'Who was British Prime Minister for most of WW2?', a: 'winston churchill' },
        { q: 'The Allied landings in Normandy on 6 June 1944 are called D…', a: 'd-day' },
        { q: 'The 1940 air battle for control of British skies was called the Battle of…', a: 'britain' },
        { q: 'The atomic bomb was dropped on which Japanese cities in August 1945? (Answer the first one.)', a: 'hiroshima' }
      ]);
      return {
        topic: 'hWW2',
        prompt: set.q, hint: '', answer: set.a, numeric: set.numeric,
        accepts: set.a === 'winston churchill' ? ['churchill'] : set.a === 'britain' ? ['battle of britain'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.hHolocaust = [
    function holocaustFacts() {
      const set = pick([
        { q: 'Roughly how many Jewish people were murdered in the Holocaust? (Answer in millions.)', a: '6', numeric: 6 },
        { q: 'What was the name of the largest Nazi extermination camp, in occupied Poland?', a: 'auschwitz' },
        { q: 'The Nazi laws of 1935 that stripped Jews of citizenship were the Nuremberg…', a: 'laws' },
        { q: 'The systematic Nazi plan to murder all Jews in Europe was called the "Final…"', a: 'solution' }
      ]);
      return {
        topic: 'hHolocaust',
        prompt: set.q, hint: '', answer: set.a, numeric: set.numeric,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.hColdWar = [
    function coldWarFacts() {
      const set = pick([
        { q: 'The two superpowers of the Cold War were the USA and the…', a: 'soviet union' },
        { q: 'In which year was the Berlin Wall built?', a: '1961', numeric: 1961 },
        { q: 'In which year did the Berlin Wall fall?', a: '1989', numeric: 1989 },
        { q: 'The 1962 crisis when the USSR placed nuclear missiles 90 miles from the US was the ___ Missile Crisis.', a: 'cuban' },
        { q: 'Churchill\'s 1946 phrase describing the ideological divide across Europe was the "___ Curtain".', a: 'iron' }
      ]);
      return {
        topic: 'hColdWar',
        prompt: set.q, hint: '', answer: set.a, numeric: set.numeric,
        accepts: set.a === 'soviet union' ? ['ussr', 'russia'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.hSuffrage = [
    function suffrageFacts() {
      const set = pick([
        { q: 'The militant women\'s suffrage group led by Emmeline Pankhurst was called the WSPU. What year was it founded?', a: '1903', numeric: 1903 },
        { q: 'In which year did women over 30 first gain the vote in the UK?', a: '1918', numeric: 1918 },
        { q: 'In which year did women in the UK gain equal voting rights with men (over 21)?', a: '1928', numeric: 1928 },
        { q: 'The 1913 suffragette who died after running in front of the King\'s horse at the Derby was Emily…', a: 'davison' }
      ]);
      return {
        topic: 'hSuffrage',
        prompt: set.q, hint: '', answer: set.a, numeric: set.numeric,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  // ============================================================
  // TOPIC REGISTRY
  // ============================================================
  const topics = [
    { key: 'hIndustrial', subject: 'history', label: 'Industrial Revolution', section: '1750–1900' },
    { key: 'hEmpire',     subject: 'history', label: 'The British Empire',    section: '1750–1900' },
    { key: 'hSuffrage',   subject: 'history', label: 'Votes for women',       section: '1900–1930' },
    { key: 'hWW1',        subject: 'history', label: 'First World War',       section: '1900–1930' },
    { key: 'hInterwar',   subject: 'history', label: 'Interwar & Weimar Germany', section: '1900–1930' },
    { key: 'hWW2',        subject: 'history', label: 'Second World War',      section: '1930–1950' },
    { key: 'hHolocaust',  subject: 'history', label: 'The Holocaust',         section: '1930–1950' },
    { key: 'hColdWar',    subject: 'history', label: 'The Cold War',          section: '1945–1991' }
  ];
  topics.forEach(t => T.push(t));

  // ============================================================
  // CONTENT
  // ============================================================
  Object.assign(C, {
    hIndustrial: {
      blurb: `<p>Between 1760 and 1840, Britain moved from an agricultural society to an industrial
        one. New machines, powered by steam, replaced hand tools; canals and railways transformed
        transport; and millions moved from the countryside to grim, fast-growing cities like
        Manchester and Birmingham.</p>`,
      formulas: [
        { name: 'Steam engine',   expr: 'James Watt, from 1769' },
        { name: 'Spinning jenny', expr: 'James Hargreaves, 1764' },
        { name: 'Water frame',    expr: 'Richard Arkwright, 1769' },
        { name: 'First public railway', expr: 'Stockton & Darlington, 1825' }
      ],
      examples: [
        { q: 'Why did cities grow so quickly during the Industrial Revolution?',
          steps: ['Workers moved from farms to factories in search of paid work.',
                 'Cities near coal, iron and canals — Manchester, Birmingham, Leeds — grew fastest.'] }
      ],
      pitfalls: [
        'Assuming everyone got richer — many factory workers lived in slums with terrible conditions.',
        'Confusing invention dates — Watt improved the steam engine, he didn\'t invent it.'
      ],
      videos: [
        { title: 'BBC Bitesize — Industrial Revolution', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/z7wr4wx', badge: 'Course' },
        { title: 'CrashCourse History — Industrial Revolution', source: 'YouTube', url: 'https://www.youtube.com/@crashcourse', badge: 'Channel' }
      ]
    },
    hEmpire: {
      blurb: `<p>By 1900 the British Empire covered around a quarter of the world's land and
        governed about a quarter of its people. It included India ("the jewel in the crown"),
        Australia, Canada, large parts of Africa, and Caribbean colonies. Empire brought Britain
        wealth and raw materials but also devastated the peoples it ruled — especially through
        the Atlantic slave trade (abolished in 1807 / 1833) and violent conquest.</p>
        <p>Most colonies became independent between 1947 (India / Pakistan) and the 1960s–70s.</p>`,
      formulas: [
        { name: 'Peak size',      expr: '≈ ¼ of world land & people, c. 1900' },
        { name: 'Slave trade abolished (Britain)', expr: '1807 (trade), 1833 (slavery)' },
        { name: 'Indian independence', expr: '1947' }
      ],
      examples: [
        { q: 'Why is 1947 an important year in Indian history?',
          steps: ['India and Pakistan gained independence from Britain.',
                 'This was the beginning of the end for the Empire — many colonies followed.'] }
      ],
      pitfalls: [
        'Presenting Empire only in terms of benefits — colonies suffered violence, famines, and loss of self-rule.',
        'Confusing dates of trade abolition (1807) and slavery abolition (1833).'
      ],
      videos: [
        { title: 'BBC Bitesize — British Empire', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/z6jyvcw', badge: 'Course' }
      ]
    },
    hSuffrage: {
      blurb: `<p>By 1900 women in the UK still could not vote. Two rival movements campaigned:
        the peaceful <strong>Suffragists</strong> (NUWSS, led by Millicent Fawcett) and the militant
        <strong>Suffragettes</strong> (WSPU, led by Emmeline Pankhurst, from 1903), who broke
        windows, went on hunger strike, and used arson.</p>
        <p>Women over 30 got the vote in <strong>1918</strong>; equal voting rights (with men, at 21)
        came in <strong>1928</strong>.</p>`,
      formulas: [
        { name: 'Suffragists (NUWSS)', expr: 'peaceful, 1897' },
        { name: 'Suffragettes (WSPU)', expr: 'militant, 1903, "Deeds not words"' },
        { name: 'Vote for women 30+',  expr: '1918' },
        { name: 'Equal voting rights', expr: '1928' }
      ],
      examples: [
        { q: 'Why is Emily Davison\'s death in 1913 famous?',
          steps: ['She ran in front of the King\'s horse at the Epsom Derby.',
                 'Widely reported — became a symbol of the Suffragette movement, though her exact intent is still debated.'] }
      ],
      pitfalls: [
        'Confusing Suffragists (peaceful) with Suffragettes (militant).',
        'Assuming all women got the vote in 1918 — it was only those over 30 with property.'
      ],
      videos: [
        { title: 'BBC Bitesize — Women\'s suffrage', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zx4vkty', badge: 'Course' }
      ]
    },
    hWW1: {
      blurb: `<p>The First World War (1914–1918) killed about 20 million people, including 900,000
        from the British Empire. Its causes are often summed up as <strong>MAIN</strong>:
        Militarism, Alliances, Imperialism, Nationalism — with the assassination of
        <strong>Archduke Franz Ferdinand</strong> in Sarajevo (28 June 1914) as the trigger.</p>
        <p>The Western Front turned into <strong>trench warfare</strong>: mud, barbed wire, machine
        guns, and near-stalemate. Key battles: <strong>Somme</strong> (1916, ~1 million casualties)
        and <strong>Passchendaele</strong> (1917). The war ended on 11 November 1918. The
        <strong>Treaty of Versailles</strong> (1919) punished Germany with reparations and
        territory loss — setting the stage for WW2.</p>`,
      formulas: [
        { name: 'Causes',         expr: 'MAIN — Militarism, Alliances, Imperialism, Nationalism' },
        { name: 'Trigger',        expr: 'Assassination of Franz Ferdinand, 28 June 1914' },
        { name: 'Armistice',      expr: '11 November 1918, 11 am' },
        { name: 'Peace treaty',   expr: 'Treaty of Versailles, 1919' }
      ],
      examples: [
        { q: 'How did the alliance system make a small conflict spread across Europe?',
          steps: ['Countries were locked into pacts to defend each other.',
                 'Serbia → Austria → Russia → Germany → France → Britain, all pulled in within a month.'] }
      ],
      pitfalls: [
        'Blaming WW1 on the assassination alone — long-term MAIN causes matter more.',
        'Confusing the Treaty of Versailles (Germany, 1919) with the League of Nations formation.'
      ],
      videos: [
        { title: 'BBC Bitesize — World War One', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zqhyb9q', badge: 'Course' },
        { title: 'Oversimplified — WWI', source: 'YouTube', url: 'https://www.youtube.com/@Oversimplified', badge: 'Channel' }
      ]
    },
    hInterwar: {
      blurb: `<p>After WW1, Germany was a shaky republic based in <strong>Weimar</strong>. It
        suffered hyperinflation (1923), then the <strong>Wall Street Crash of 1929</strong>
        collapsed the world economy. The Great Depression that followed brought mass unemployment
        — and pushed people towards political extremes.</p>
        <p>Hitler and the <strong>Nazi Party</strong> came to power in Germany in 1933, promising
        to rebuild the economy and reverse Versailles. He soon suspended democracy and rearmed.</p>`,
      formulas: [
        { name: 'Weimar Republic',     expr: '1919–1933' },
        { name: 'Wall Street Crash',   expr: '1929' },
        { name: 'Hitler in power',     expr: '30 January 1933' },
        { name: 'Reichstag Fire Decree', expr: 'Feb 1933 — suspended civil liberties' }
      ],
      examples: [
        { q: 'Why did unemployment help the Nazis?',
          steps: ['With 6 million unemployed by 1932, mainstream parties looked helpless.',
                 'Hitler offered simple answers: jobs, national pride, blame for enemies.'] }
      ],
      pitfalls: [
        'Assuming Hitler seized power in a coup — he was appointed Chancellor legally, and used the emergency Reichstag Fire Decree to grab dictatorial powers.'
      ],
      videos: [
        { title: 'BBC Bitesize — Weimar & Nazi Germany', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zshxpv4', badge: 'Course' }
      ]
    },
    hWW2: {
      blurb: `<p>The Second World War (1939–1945) killed around 60 million people worldwide — the
        deadliest conflict in history. Germany invaded <strong>Poland</strong> on 1 September 1939;
        Britain and France declared war two days later.</p>
        <p>Key moments: <strong>Dunkirk evacuation</strong> (1940), <strong>Battle of Britain</strong>
        (1940), <strong>Blitz</strong>, <strong>Pearl Harbor</strong> (Dec 1941, brought USA in),
        <strong>Stalingrad</strong> (1942–43, Soviet turning point), <strong>D-Day</strong>
        (6 June 1944, Allied landings in Normandy), <strong>VE Day</strong> (8 May 1945), atomic
        bombs on <strong>Hiroshima and Nagasaki</strong> (August 1945) leading to Japan\'s surrender.</p>`,
      formulas: [
        { name: 'War in Europe',    expr: 'Sept 1939 – May 1945' },
        { name: 'PM',               expr: 'Neville Chamberlain → Winston Churchill (May 1940)' },
        { name: 'D-Day',            expr: '6 June 1944' },
        { name: 'Atomic bombs',     expr: 'Hiroshima 6 Aug 1945, Nagasaki 9 Aug 1945' }
      ],
      examples: [
        { q: 'Why is D-Day considered a turning point in WW2?',
          steps: ['Allied troops opened a second front in Western Europe.',
                 'Germany was now squeezed from both sides (USSR from the east).',
                 'Within 11 months, Germany surrendered.'] }
      ],
      pitfalls: [
        'Confusing VE Day (Europe, May 1945) with VJ Day (Japan, September 1945).',
        'Assuming Britain fought alone — the Commonwealth, Free French, Polish forces, USSR and USA all played huge roles.'
      ],
      videos: [
        { title: 'BBC Bitesize — World War Two', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zxr8gk7', badge: 'Course' }
      ]
    },
    hHolocaust: {
      blurb: `<p>The Holocaust was the systematic, state-sponsored murder by Nazi Germany of
        approximately six million Jewish people, alongside millions of others: Roma, Poles, Soviet
        prisoners, disabled people, and political and religious dissidents.</p>
        <p>Persecution began with the <strong>Nuremberg Laws</strong> (1935) stripping Jews of
        citizenship, escalated through <strong>Kristallnacht</strong> (November 1938), and culminated
        in the "<strong>Final Solution</strong>" — mass shootings and industrial-scale killing in
        extermination camps like <strong>Auschwitz</strong>, <strong>Treblinka</strong> and
        <strong>Sobibór</strong>.</p>`,
      formulas: [
        { name: 'Nuremberg Laws',   expr: '1935 — stripped Jews of citizenship' },
        { name: 'Kristallnacht',    expr: 'Nov 1938 — coordinated anti-Jewish violence' },
        { name: 'Wannsee Conference', expr: 'Jan 1942 — planned the "Final Solution"' },
        { name: 'Auschwitz liberated', expr: '27 January 1945' }
      ],
      examples: [
        { q: 'Why do many countries observe 27 January as Holocaust Memorial Day?',
          steps: ['It is the anniversary of the liberation of Auschwitz-Birkenau in 1945.',
                 'It memorialises those murdered and commits to remembering to prevent future genocides.'] }
      ],
      pitfalls: [
        'Confusing concentration camps (imprisonment/forced labour) with extermination camps (designed for mass murder).',
        'Assuming the Holocaust only targeted Jewish people — many other groups were also targeted.'
      ],
      videos: [
        { title: 'BBC Bitesize — The Holocaust', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zvfmmfr', badge: 'Course' },
        { title: 'IWM — The Holocaust', source: 'iwm.org.uk', url: 'https://www.iwm.org.uk/history/the-holocaust', badge: 'Reference' }
      ]
    },
    hColdWar: {
      blurb: `<p>After WW2, the USA and the USSR — briefly allies — became rivals in a decades-long
        stand-off called the <strong>Cold War</strong> (1947–1991). It was "cold" because they
        never fought each other directly, but their proxy wars (Korea, Vietnam, Afghanistan)
        killed millions.</p>
        <p>Key events: <strong>Iron Curtain</strong> speech (1946), <strong>Berlin Airlift</strong>
        (1948–49), <strong>Berlin Wall</strong> built (1961), <strong>Cuban Missile Crisis</strong>
        (1962, closest to nuclear war), fall of the <strong>Berlin Wall</strong> (1989),
        <strong>collapse of USSR</strong> (1991).</p>`,
      formulas: [
        { name: 'Iron Curtain speech',   expr: 'Churchill, 1946' },
        { name: 'Berlin Wall built',     expr: '13 August 1961' },
        { name: 'Cuban Missile Crisis',  expr: 'October 1962' },
        { name: 'Berlin Wall falls',     expr: '9 November 1989' },
        { name: 'USSR dissolves',        expr: '25 December 1991' }
      ],
      examples: [
        { q: 'Why was the Cuban Missile Crisis so dangerous?',
          steps: ['The USSR placed nuclear missiles 90 miles from the US mainland.',
                 'For 13 days in October 1962 the two superpowers were on the brink of nuclear war.',
                 'Kennedy and Khrushchev negotiated a withdrawal — one of the closest calls in history.'] }
      ],
      pitfalls: [
        'Thinking of the Cold War as one long crisis — there were periods of "détente" (relaxation) too.',
        'Confusing NATO (Western alliance) with the Warsaw Pact (Soviet-led).'
      ],
      videos: [
        { title: 'BBC Bitesize — Cold War', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zc46y4j', badge: 'Course' }
      ]
    }
  });
})();
