/* Computing — Year 9: Python, algorithms, data types, boolean
   logic, binary/hex, networks, hardware, cybersecurity. */
(function () {
  'use strict';
  const { rand, pick } = window.Core;
  const G = window.Questions.generators;
  const T = window.Questions.topics;
  window.Content.COMPUTING = window.Content.COMPUTING || {};
  const C = window.Content.COMPUTING;

  // ============================================================
  // GENERATORS
  // ============================================================

  G.coBinary = [
    function decToBin() {
      const n = rand(5, 200);
      const bin = n.toString(2);
      return {
        topic: 'coBinary',
        prompt: `Convert the decimal number <strong>${n}</strong> to <strong>binary</strong>.`,
        hint: `Use powers of 2: 128, 64, 32, 16, 8, 4, 2, 1.`,
        answer: bin,
        solution: [`${n} = ${bin.split('').map((b, i) => b === '1' ? Math.pow(2, bin.length - 1 - i) : 0).filter(x => x).join(' + ')} = <strong>${bin}</strong>.`]
      };
    },
    function binToDec() {
      const n = rand(5, 200);
      const bin = n.toString(2);
      return {
        topic: 'coBinary',
        prompt: `Convert the binary number <strong>${bin}</strong> to <strong>decimal</strong>.`,
        hint: `Multiply each bit by its place value (powers of 2) and sum.`,
        answer: String(n), numeric: n,
        solution: [
          `Place values: ${bin.split('').map((b, i) => `${b}×${Math.pow(2, bin.length - 1 - i)}`).join(' + ')}.`,
          `= <strong>${n}</strong>.`
        ]
      };
    },
    function decToHex() {
      const n = rand(10, 255);
      const hex = n.toString(16).toUpperCase();
      return {
        topic: 'coBinary',
        prompt: `Convert the decimal number <strong>${n}</strong> to <strong>hexadecimal</strong>. Use uppercase letters.`,
        hint: `Repeatedly divide by 16; A=10, B=11, …, F=15.`,
        answer: hex,
        accepts: [hex.toLowerCase(), '0x' + hex, '0x' + hex.toLowerCase()],
        solution: [`${n} in hex = <strong>${hex}</strong>.`]
      };
    }
  ];

  G.coBoolean = [
    function truthTable() {
      const a = pick([0, 1]);
      const b = pick([0, 1]);
      const op = pick(['AND', 'OR', 'NAND', 'NOR']);
      let ans;
      if (op === 'AND') ans = a && b ? 1 : 0;
      else if (op === 'OR') ans = a || b ? 1 : 0;
      else if (op === 'NAND') ans = !(a && b) ? 1 : 0;
      else ans = !(a || b) ? 1 : 0;
      return {
        topic: 'coBoolean',
        prompt: `Given A = <strong>${a}</strong> and B = <strong>${b}</strong>, what is A <strong>${op}</strong> B? (Type 0 or 1.)`,
        hint: `AND: both must be 1. OR: at least one 1. NAND/NOR: NOT of AND/OR.`,
        answer: String(ans),
        numeric: ans,
        solution: [`A ${op} B = <strong>${ans}</strong>.`]
      };
    },
    function notOp() {
      const a = pick([0, 1]);
      const ans = 1 - a;
      return {
        topic: 'coBoolean',
        prompt: `What is NOT ${a}? (Type 0 or 1.)`,
        hint: `NOT flips 0 ↔ 1.`,
        answer: String(ans),
        numeric: ans,
        solution: [`NOT ${a} = <strong>${ans}</strong>.`]
      };
    }
  ];

  G.coPython = [
    function outputSimple() {
      const a = rand(2, 20), b = rand(2, 20);
      const op = pick(['+', '-', '*', '//']);
      const compute = { '+': a+b, '-': a-b, '*': a*b, '//': Math.floor(a/b) };
      const ans = compute[op];
      return {
        topic: 'coPython',
        prompt: `What does this Python code print? <br><code>x = ${a}<br>y = ${b}<br>print(x ${op} y)</code>`,
        hint: `Operators: + add, - subtract, * multiply, // integer divide.`,
        answer: String(ans), numeric: ans,
        solution: [`x ${op} y = ${a} ${op} ${b} = <strong>${ans}</strong>.`]
      };
    },
    function outputString() {
      const n = rand(2, 6);
      const s = pick(['ha', 'hi', 'ok', 'yay']);
      return {
        topic: 'coPython',
        prompt: `What does this Python code print? <br><code>print("${s}" * ${n})</code>`,
        hint: `Multiplying a string by n means repeat it n times.`,
        answer: s.repeat(n),
        solution: [`"${s}" × ${n} means repeat ${n} times: <strong>${s.repeat(n)}</strong>.`]
      };
    },
    function ifElseOutput() {
      const x = rand(1, 20);
      const t = rand(5, 15);
      const ans = x > t ? 'big' : 'small';
      return {
        topic: 'coPython',
        prompt: `What does this print?<br><code>x = ${x}<br>if x &gt; ${t}:<br>&nbsp;&nbsp;print("big")<br>else:<br>&nbsp;&nbsp;print("small")</code>`,
        hint: `Is ${x} greater than ${t}?`,
        answer: ans,
        solution: [`${x} ${x > t ? '>' : '≤'} ${t}, so it prints "<strong>${ans}</strong>".`]
      };
    },
    function forLoopSum() {
      const n = rand(3, 8);
      const s = (n * (n - 1)) / 2; // 0+1+...+(n-1)
      return {
        topic: 'coPython',
        prompt: `What does this print?<br><code>total = 0<br>for i in range(${n}):<br>&nbsp;&nbsp;total += i<br>print(total)</code>`,
        hint: `range(${n}) gives 0, 1, 2, …, ${n-1}.`,
        answer: String(s), numeric: s,
        solution: [
          `Adds 0 + 1 + … + ${n-1} = ${s}.`,
          `Print: <strong>${s}</strong>.`
        ]
      };
    }
  ];

  G.coAlgorithms = [
    function typeOfAlgo() {
      const set = pick([
        { q: 'An algorithm that keeps halving the search range in a sorted list is called…', a: 'binary search' },
        { q: 'Which sorting algorithm repeatedly swaps adjacent items if they are out of order?', a: 'bubble sort' },
        { q: 'A step-by-step diagram of an algorithm using boxes and arrows is called a…', a: 'flowchart' },
        { q: 'What is the term for translating an algorithm into a programming language?', a: 'coding' }
      ]);
      return {
        topic: 'coAlgorithms',
        prompt: set.q,
        hint: '',
        answer: set.a,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.coHardware = [
    function whatIs() {
      const set = pick([
        { q: 'Which component of a computer performs calculations and executes instructions?', a: 'cpu' },
        { q: 'Which memory type is fast, volatile, and used for programs currently running?', a: 'ram' },
        { q: 'Which storage type keeps data when the computer is switched off?', a: 'hard drive' },
        { q: 'What does GPU stand for? (three words joined)', a: 'graphics processing unit' }
      ]);
      return {
        topic: 'coHardware',
        prompt: set.q,
        hint: '',
        answer: set.a,
        accepts: set.a === 'hard drive' ? ['ssd', 'rom', 'hdd'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    },
    function unitOrder() {
      // Order of size
      const set = pick([
        { q: 'How many bits in a byte?', a: '8', numeric: 8 },
        { q: 'How many bytes in a kilobyte (using decimal 1000-based)?', a: '1000', numeric: 1000 },
        { q: 'How many bytes in a kibibyte (KiB, using 1024-based)?', a: '1024', numeric: 1024 }
      ]);
      return {
        topic: 'coHardware',
        prompt: set.q,
        hint: '',
        answer: set.a,
        numeric: set.numeric,
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.coNetworks = [
    function protocolFor() {
      const set = pick([
        { q: 'Which protocol is used for browsing websites securely?', a: 'https' },
        { q: 'Which protocol is used to send email between servers?', a: 'smtp' },
        { q: 'What is the numeric address of a device on a network called? (three letters)', a: 'ip' },
        { q: 'What is the physical address of a network card, that never changes? (three letters)', a: 'mac' }
      ]);
      return {
        topic: 'coNetworks',
        prompt: set.q,
        hint: '',
        answer: set.a,
        accepts: set.a === 'ip' ? ['ip address'] : set.a === 'mac' ? ['mac address'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  G.coCyber = [
    function attackType() {
      const set = pick([
        { q: 'An email pretending to be from your bank asking for your password is an example of…', a: 'phishing' },
        { q: 'Software that secretly records your keystrokes is…', a: 'keylogger' },
        { q: 'Overwhelming a website with traffic so it goes down is a…', a: 'denial of service' },
        { q: 'A program that locks your files until you pay is called…', a: 'ransomware' }
      ]);
      return {
        topic: 'coCyber',
        prompt: set.q,
        hint: '',
        answer: set.a,
        accepts: set.a === 'denial of service' ? ['dos', 'ddos', 'dos attack'] : [],
        solution: [`Answer: <strong>${set.a}</strong>.`]
      };
    }
  ];

  // ============================================================
  // TOPIC REGISTRY
  // ============================================================
  const topics = [
    { key: 'coPython',     subject: 'computing', label: 'Python basics',       section: 'Programming' },
    { key: 'coAlgorithms', subject: 'computing', label: 'Algorithms',          section: 'Programming' },
    { key: 'coBoolean',    subject: 'computing', label: 'Boolean logic',       section: 'Logic & Data' },
    { key: 'coBinary',     subject: 'computing', label: 'Binary & hex',        section: 'Logic & Data' },
    { key: 'coHardware',   subject: 'computing', label: 'Hardware & storage',  section: 'Systems' },
    { key: 'coNetworks',   subject: 'computing', label: 'Networks & protocols',section: 'Systems' },
    { key: 'coCyber',      subject: 'computing', label: 'Cybersecurity',       section: 'Systems' }
  ];
  topics.forEach(t => T.push(t));

  // ============================================================
  // CONTENT
  // ============================================================
  Object.assign(C, {
    coPython: {
      blurb: `<p>Python is designed to be readable. A program is a list of instructions that run
        top-to-bottom, with three big ideas:</p>
        <ul>
          <li><strong>Variables</strong> hold data: <code>x = 5</code>.</li>
          <li><strong>Selection</strong> chooses what happens next: <code>if</code>/<code>elif</code>/<code>else</code>.</li>
          <li><strong>Iteration</strong> repeats: <code>for</code> and <code>while</code>.</li>
        </ul>`,
      formulas: [
        { name: 'Variable',       expr: 'name = value' },
        { name: 'If',             expr: 'if condition:  <span style="color:var(--muted)">indent 4 spaces</span>' },
        { name: 'For (n times)',  expr: 'for i in range(n):' },
        { name: 'Print',          expr: 'print("hello", name)' }
      ],
      examples: [
        { q: 'What does this print?<br><code>x = 3<br>x = x + 5<br>print(x * 2)</code>',
          steps: ['x = 3, then x becomes 8.', 'x * 2 = <strong>16</strong>.'] }
      ],
      pitfalls: [
        'Indentation matters — 4 spaces per level.',
        'range(n) gives 0..n−1, not 1..n.',
        'Confusing = (assignment) with == (comparison).'
      ],
      videos: [
        { title: 'Python.org tutorial', source: 'python.org', url: 'https://docs.python.org/3/tutorial/', badge: 'Reference' },
        { title: 'Craig\'n\'Dave — Python playlist', source: 'YouTube', url: 'https://www.youtube.com/@craigndave', badge: 'Channel' },
        { title: 'BBC Bitesize — Python programming', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/z34djxs', badge: 'Course' }
      ]
    },
    coAlgorithms: {
      blurb: `<p>An <strong>algorithm</strong> is a step-by-step recipe to solve a problem. Two
        classic groups you'll meet:</p>
        <ul>
          <li><strong>Searching</strong>: linear search (check each), binary search (halve the sorted list every step).</li>
          <li><strong>Sorting</strong>: bubble sort (swap adjacent), insertion sort (build sorted list one at a time), merge sort (divide & conquer).</li>
        </ul>
        <p>Algorithms can be described in <em>flowcharts</em>, <em>pseudocode</em>, or program code.</p>`,
      formulas: [
        { name: 'Linear search worst-case', expr: 'n steps for a list of n' },
        { name: 'Binary search',            expr: '≈ log₂(n) steps — must be sorted' },
        { name: 'Bubble sort worst-case',   expr: 'n² comparisons' }
      ],
      examples: [
        { q: 'A sorted list has 1000 items. Roughly how many steps does binary search need?',
          steps: ['log₂(1000) ≈ 10. Answer: <strong>~10 steps</strong>.'] }
      ],
      pitfalls: [
        'Using binary search on an unsorted list — it won\'t work.',
        'Forgetting the base case in a recursive algorithm.'
      ],
      videos: [
        { title: 'BBC Bitesize — Algorithms', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/z7d634j', badge: 'Course' },
        { title: 'Computerphile — algorithms', source: 'YouTube', url: 'https://www.youtube.com/@Computerphile', badge: 'Channel' }
      ]
    },
    coBoolean: {
      blurb: `<p>Boolean logic uses just two values — <strong>0</strong> (false) and <strong>1</strong>
        (true) — combined with three basic operators:</p>
        <ul>
          <li><strong>AND</strong>: 1 only when both inputs are 1.</li>
          <li><strong>OR</strong>: 1 when at least one input is 1.</li>
          <li><strong>NOT</strong>: flips 0 ↔ 1.</li>
        </ul>
        <p>Derived: <strong>NAND</strong> (not-and), <strong>NOR</strong> (not-or), <strong>XOR</strong>
        (exactly one is 1).</p>`,
      formulas: [
        { name: 'AND', expr: 'A · B  →  1 iff both 1' },
        { name: 'OR',  expr: 'A + B  →  1 iff at least one 1' },
        { name: 'NOT', expr: '¬A     →  flip' }
      ],
      examples: [
        { q: 'A = 1, B = 0. What is A AND B?',
          steps: ['Both must be 1 for AND. Since B = 0, result is <strong>0</strong>.'] }
      ],
      pitfalls: [
        'Confusing OR (inclusive) with XOR (exclusive).',
        'Reading NAND as "NAND is like OR" — it\'s the inverse of AND.'
      ],
      videos: [
        { title: 'BBC Bitesize — Logic', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/z34djxs', badge: 'Course' }
      ]
    },
    coBinary: {
      blurb: `<p>Computers store everything as <strong>bits</strong> — 0s and 1s. Numbers in binary
        use place values that are powers of 2: 128, 64, 32, 16, 8, 4, 2, 1.</p>
        <p>Hexadecimal (base 16) groups binary into chunks of 4 for readability. Digits go 0–9,
        then A(10), B(11), C(12), D(13), E(14), F(15).</p>`,
      formulas: [
        { name: 'Binary place values', expr: '…128, 64, 32, 16, 8, 4, 2, 1' },
        { name: 'Hex digits',          expr: '0-9, A(10), B(11), C(12), D(13), E(14), F(15)' },
        { name: '1 byte',              expr: '= 8 bits = 2 hex digits = 0 to 255' }
      ],
      examples: [
        { q: 'Convert 45 to binary.',
          steps: ['45 = 32 + 8 + 4 + 1 = 32 + 0 + 8 + 4 + 0 + 1.', 'Binary: <strong>101101</strong>.'] },
        { q: 'Convert AF (hex) to decimal.',
          steps: ['A = 10, F = 15. AF = 10×16 + 15 = 160 + 15 = <strong>175</strong>.'] }
      ],
      pitfalls: [
        'Reading binary left-to-right but forgetting the leftmost bit is the largest place value.',
        'Confusing 10 hex with 10 decimal.'
      ],
      videos: [
        { title: 'BBC Bitesize — Binary', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zdqxrwx', badge: 'Course' }
      ]
    },
    coHardware: {
      blurb: `<p>The main pieces of a computer are the <strong>CPU</strong> (does the work),
        <strong>RAM</strong> (fast, temporary), <strong>secondary storage</strong> (slower, keeps
        data when off — hard disk or SSD), and the <strong>I/O</strong> devices (keyboard, screen,
        network).</p>`,
      formulas: [
        { name: 'CPU cycle', expr: 'fetch → decode → execute' },
        { name: 'Volatile RAM', expr: 'contents lost when power off' },
        { name: 'Non-volatile storage', expr: 'HDD / SSD / ROM — persistent' }
      ],
      examples: [
        { q: 'Which is faster to access: RAM or hard disk?',
          steps: ['<strong>RAM</strong> — orders of magnitude faster (nanoseconds vs milliseconds).'] }
      ],
      pitfalls: [
        'Calling RAM "memory" and hard-disk "storage" while treating them as interchangeable — they aren\'t.'
      ],
      videos: [
        { title: 'BBC Bitesize — Hardware', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zvbkjty', badge: 'Course' }
      ]
    },
    coNetworks: {
      blurb: `<p>The Internet is a network of networks. Messages are broken into
        <strong>packets</strong> which each find their own route. Every device has an
        <strong>IP address</strong> (logical, may change) and a <strong>MAC address</strong>
        (physical, on the network card, fixed).</p>`,
      formulas: [
        { name: 'HTTP / HTTPS', expr: 'web protocol (HTTPS = encrypted)' },
        { name: 'SMTP',         expr: 'sending email' },
        { name: 'DNS',          expr: 'turns domain names → IP addresses' },
        { name: 'LAN / WAN',    expr: 'local vs wide area network' }
      ],
      examples: [
        { q: 'Why is HTTPS preferred over HTTP for banking?',
          steps: ['HTTPS encrypts data in transit, so eavesdroppers cannot read passwords or account details.'] }
      ],
      pitfalls: [
        'Confusing IP (logical) with MAC (physical).',
        'Assuming the Internet is one thing — it\'s many interconnected networks.'
      ],
      videos: [
        { title: 'BBC Bitesize — Networks', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zbn3wxs', badge: 'Course' }
      ]
    },
    coCyber: {
      blurb: `<p>Common threats to know:</p>
        <ul>
          <li><strong>Phishing</strong> — fake email pretending to be trustworthy.</li>
          <li><strong>Malware</strong> — malicious software (viruses, worms, trojans, ransomware, keyloggers).</li>
          <li><strong>Denial of Service (DoS/DDoS)</strong> — flooding a service with traffic.</li>
          <li><strong>Social engineering</strong> — tricking people rather than technology.</li>
        </ul>
        <p>Defences: strong passwords, 2FA, keeping software updated, thinking before clicking.</p>`,
      formulas: [
        { name: 'Strong password', expr: 'long + mix of characters + unique per site' },
        { name: '2FA', expr: 'something you know + something you have' }
      ],
      examples: [
        { q: 'Why is 2FA safer than just a password?',
          steps: ['Even if the password is stolen, the attacker still needs the second factor (e.g. phone).'] }
      ],
      pitfalls: [
        'Reusing passwords — one breach exposes many accounts.',
        'Assuming HTTPS = safe. It stops eavesdropping but not phishing.'
      ],
      videos: [
        { title: 'BBC Bitesize — Cybersecurity', source: 'bbc.co.uk', url: 'https://www.bbc.co.uk/bitesize/topics/zbcm2p3', badge: 'Course' }
      ]
    }
  });
})();
