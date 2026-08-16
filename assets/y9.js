/* ==========================================================
   Year 9 extension pack.
   Runs AFTER questions.js and content.js, adding new topics
   and deepening existing ones to match:
     - UK KS3 Year 9 programme of study
     - GCSE Higher tier content typically taught in Year 9 at
       top academic independent schools
     - UKMT competition topic areas for Year 9 (IMC, Grey
       Kangaroo, Cayley — JMO is Y8-only)
   All new generators self-check.
   ========================================================== */
(function () {
  'use strict';
  if (!window.Questions || !window.Content) {
    console.error('y9.js loaded before questions.js/content.js');
    return;
  }
  const { rand, pick, gcd } = window.Core;
  const G = window.Questions.generators;
  const T = window.Questions.topics;
  const C = window.Content.MATHS;

  // Small factorial + nCr helpers (already used inside generators)
  const fact = x => x <= 1 ? 1 : x * fact(x - 1);

  // ============================================================
  // EXTENSIONS to existing topics (added onto their arrays)
  // ============================================================

  // ---- Equations: quadratic formula + completing the square ----
  G.equations.push(
    function quadraticFormula() {
      // ax² + bx + c = 0 with irrational roots
      let a, b, c, disc;
      do {
        a = pick([1, 2, 3]);
        b = rand(-9, 9);
        c = rand(-6, 6);
        disc = b * b - 4 * a * c;
      } while (disc <= 0 || Math.sqrt(disc) === Math.floor(Math.sqrt(disc)) || c === 0);
      const r1 = +((-b - Math.sqrt(disc)) / (2 * a)).toFixed(2);
      const r2 = +((-b + Math.sqrt(disc)) / (2 * a)).toFixed(2);
      const [s1, s2] = [r1, r2].sort((x, y) => x - y);
      return {
        topic: 'equations',
        prompt: `Use the quadratic formula to solve <strong>${a}x<sup>2</sup> ${b>=0?'+':'−'} ${Math.abs(b)}x ${c>=0?'+':'−'} ${Math.abs(c)} = 0</strong>. Give the two roots to 2 dp, smallest first, as <code>a,b</code>.`,
        hint: `x = (−b ± √(b² − 4ac)) / (2a). Here a=${a}, b=${b}, c=${c}.`,
        answer: `${s1.toFixed(2)},${s2.toFixed(2)}`,
        accepts: [`${s2.toFixed(2)},${s1.toFixed(2)}`],
        solution: [
          `Discriminant: b² − 4ac = ${b*b} − ${4*a*c} = ${disc}.`,
          `√${disc} ≈ ${Math.sqrt(disc).toFixed(4)}.`,
          `x = (${-b} ± ${Math.sqrt(disc).toFixed(4)}) / ${2*a}.`,
          `Roots: <strong>${s1.toFixed(2)}</strong> and <strong>${s2.toFixed(2)}</strong>.`
        ]
      };
    },
    function completingSquare() {
      // x² + bx + c → (x + p)² + q, where p = b/2 (integer), q = c - p²
      const p = rand(-6, 6);
      const q = rand(-9, 9);
      const b = 2 * p;
      const c = p * p + q;
      return {
        topic: 'equations',
        prompt: `Write <strong>x<sup>2</sup> ${b>=0?'+':'−'} ${Math.abs(b)}x ${c>=0?'+':'−'} ${Math.abs(c)}</strong> in the form (x + p)² + q. Give as <code>p,q</code>.`,
        hint: `Half the coefficient of x is p. Then q is what's left over.`,
        answer: `${p},${q}`,
        solution: [
          `Half the x-coefficient: ${b}/2 = ${p}.`,
          `(x ${p>=0?'+':'−'} ${Math.abs(p)})² expands to x² ${b>=0?'+':'−'} ${Math.abs(b)}x + ${p*p}.`,
          `We need +${c}, so q = ${c} − ${p*p} = ${q}.`,
          `Answer: (x ${p>=0?'+':'−'} ${Math.abs(p)})² ${q>=0?'+':'−'} ${Math.abs(q)}, i.e. p=${p}, q=${q}.`
        ]
      };
    }
  );

  // ---- Expand: factorise with a ≠ 1 ----
  G.expand.push(
    function factoriseANot1() {
      // a·x² + b·x + c with a ≥ 2, factorable as (px + r)(qx + s) where p·q = a, r·s = c
      let p, q, r, s;
      let attempts = 0;
      while (attempts < 30) {
        attempts++;
        p = pick([2, 3]);
        q = pick([1, 2, 3]);
        r = rand(-5, 5);
        s = rand(-5, 5);
        if (r === 0 || s === 0) continue;
        break;
      }
      const a = p * q, b = p * s + q * r, c = r * s;
      const first  = `(${p===1?'':p}x${r>=0?'+':'−'}${Math.abs(r)})`;
      const second = `(${q===1?'':q}x${s>=0?'+':'−'}${Math.abs(s)})`;
      return {
        topic: 'expand',
        prompt: `Factorise: <strong>${a}x<sup>2</sup> ${b>=0?'+':'−'} ${Math.abs(b)}x ${c>=0?'+':'−'} ${Math.abs(c)}</strong>`,
        hint: `Type as e.g. <code>(2x-3)(x+4)</code>.`,
        answer: `${first}${second}`,
        accepts: [`${second}${first}`],
        solution: [
          `Multiply a·c = ${a*c}. We need two numbers multiplying to ${a*c} and adding to ${b}: ${p*s} and ${q*r}.`,
          `Split the middle term: ${a}x² ${p*s>=0?'+':'−'} ${Math.abs(p*s)}x ${q*r>=0?'+':'−'} ${Math.abs(q*r)}x ${c>=0?'+':'−'} ${Math.abs(c)}.`,
          `Group and factor: ${first}${second}.`
        ]
      };
    }
  );

  // ---- Sequences: find quadratic nth term ----
  G.sequences.push(
    function findQuadraticNthTerm() {
      const a = pick([1, 2]);
      const b = rand(-3, 3);
      const c = rand(-5, 5);
      const seq = [1,2,3,4].map(n => a*n*n + b*n + c);
      return {
        topic: 'sequences',
        prompt: `Find the nth term of the quadratic sequence: <strong>${seq.join(', ')}, …</strong>`,
        hint: `Second difference = 2a. Then find b and c using n=1 and n=2.`,
        answer: `${a}n^2${b>=0?'+':''}${b}n${c>=0?'+':''}${c}`,
        accepts: [
          `${a===1?'':a}n^2${b>=0?'+':''}${b===1?'n':(b===-1?'-n':b+'n')}${c>=0?'+':''}${c}`
        ].filter(Boolean),
        solution: [
          `First differences: ${seq[1]-seq[0]}, ${seq[2]-seq[1]}, ${seq[3]-seq[2]}.`,
          `Second difference: ${(seq[2]-seq[1])-(seq[1]-seq[0])} = 2a → a = ${a}.`,
          `Subtract ${a}n² from each term to get ${seq.map((v,i)=>v-a*(i+1)*(i+1)).join(', ')} → linear part ${b}n${c>=0?'+':''}${c}.`,
          `nth term = <strong>${a}n²${b>=0?'+':''}${b}n${c>=0?'+':''}${c}</strong>.`
        ]
      };
    }
  );

  // ---- Simultaneous: linear-quadratic ----
  G.simultaneous.push(
    function linearQuadratic() {
      // Line y = mx + c meets circle x² + y² = r² OR parabola y = x² + …
      // Pick integer intersection points.
      const x1 = rand(-4, -1), x2 = rand(1, 4);
      const m = rand(-3, 3);
      // y = mx + c meets y = x² at x1 and x2.  x² - mx - c = 0 with roots x1,x2 → sum = m, product = -c
      const mm = x1 + x2;
      const c = -(x1 * x2);
      const y1 = x1 * x1, y2 = x2 * x2;
      const sortedX = [x1, x2].sort((a,b)=>a-b);
      return {
        topic: 'simultaneous',
        prompt: `Solve simultaneously: <strong>y = x<sup>2</sup></strong> and <strong>y = ${mm===0?'':mm===1?'':mm===-1?'−':mm}x ${c>=0?'+':'−'} ${Math.abs(c)}</strong>. Give the two x-values as <code>a,b</code> (smallest first).`,
        hint: `Substitute one into the other: x² = ${mm}x ${c>=0?'+':'−'} ${Math.abs(c)}, then rearrange.`,
        answer: `${sortedX[0]},${sortedX[1]}`,
        accepts: [`${sortedX[1]},${sortedX[0]}`],
        solution: [
          `Set them equal: x² = ${mm}x ${c>=0?'+':'−'} ${Math.abs(c)}.`,
          `Rearrange: x² ${mm===0?'':(mm>0?`− ${mm}x`:`+ ${-mm}x`)} ${c>=0?'−':'+'} ${Math.abs(c)} = 0.`,
          `Factorise: (x − ${x1})(x − ${x2}) = 0 → x = ${x1} or x = ${x2}.`
        ]
      };
    }
  );

  // ---- Pythagoras: 3D ----
  G.pythagoras.push(
    function pyth3D() {
      const a = rand(3, 8), b = rand(3, 8), c = rand(3, 8);
      const d = +Math.sqrt(a*a + b*b + c*c).toFixed(2);
      return {
        topic: 'pythagoras',
        prompt: `A cuboid measures <strong>${a} cm × ${b} cm × ${c} cm</strong>. Find the length of the space diagonal (corner to opposite corner), to 2 dp.`,
        hint: `Space diagonal = √(l² + w² + h²).`,
        answer: d.toFixed(2),
        numeric: d,
        tol: 0.02,
        solution: [
          `d² = ${a}² + ${b}² + ${c}² = ${a*a + b*b + c*c}.`,
          `d = √${a*a + b*b + c*c} ≈ <strong>${d} cm</strong>.`
        ]
      };
    }
  );

  // ---- Trig: sine rule, cosine rule, area = ½ab sin C ----
  G.trig.push(
    function sineRule() {
      const A = pick([30, 45, 50, 60, 70]);
      const B = pick([40, 55, 65, 80]);
      const a = rand(5, 15);
      const b = +(a * Math.sin(B * Math.PI/180) / Math.sin(A * Math.PI/180)).toFixed(2);
      return {
        topic: 'trig',
        prompt: `In a triangle, angle A = <strong>${A}°</strong>, angle B = <strong>${B}°</strong>, side a (opposite A) = <strong>${a} cm</strong>. Find side b (opposite B) to 2 dp.`,
        hint: `Sine rule: a/sin A = b/sin B.`,
        answer: b.toFixed(2),
        numeric: b,
        tol: 0.05,
        solution: [
          `Sine rule: ${a}/sin ${A}° = b/sin ${B}°.`,
          `b = ${a} × sin ${B}° / sin ${A}° = ${a} × ${Math.sin(B*Math.PI/180).toFixed(4)} / ${Math.sin(A*Math.PI/180).toFixed(4)}.`,
          `b ≈ <strong>${b} cm</strong>.`
        ]
      };
    },
    function cosineRule() {
      const a = rand(5, 12), b = rand(5, 12);
      const C = pick([40, 55, 70, 100, 120]);
      const c2 = a*a + b*b - 2*a*b*Math.cos(C * Math.PI/180);
      const c = +Math.sqrt(c2).toFixed(2);
      return {
        topic: 'trig',
        prompt: `In a triangle, two sides are <strong>${a} cm</strong> and <strong>${b} cm</strong> with the included angle <strong>${C}°</strong>. Find the third side to 2 dp.`,
        hint: `Cosine rule: c² = a² + b² − 2ab cos C.`,
        answer: c.toFixed(2),
        numeric: c,
        tol: 0.05,
        solution: [
          `c² = ${a}² + ${b}² − 2 · ${a} · ${b} · cos ${C}°.`,
          `= ${a*a} + ${b*b} − ${2*a*b} · ${Math.cos(C*Math.PI/180).toFixed(4)} ≈ ${c2.toFixed(2)}.`,
          `c ≈ <strong>${c} cm</strong>.`
        ]
      };
    },
    function triangleArea() {
      const a = rand(5, 12), b = rand(5, 12);
      const C = pick([30, 45, 55, 70, 90, 120]);
      const A = +(0.5 * a * b * Math.sin(C * Math.PI/180)).toFixed(2);
      return {
        topic: 'trig',
        prompt: `Find the area of a triangle with two sides <strong>${a} cm</strong> and <strong>${b} cm</strong> and the included angle <strong>${C}°</strong>. Give to 2 dp (cm²).`,
        hint: `Area = ½ · a · b · sin C.`,
        answer: A.toFixed(2),
        numeric: A,
        tol: 0.05,
        solution: [
          `Area = ½ × ${a} × ${b} × sin ${C}° = ${0.5*a*b} × ${Math.sin(C*Math.PI/180).toFixed(4)}.`,
          `≈ <strong>${A} cm²</strong>.`
        ]
      };
    }
  );

  // ---- Probability: tree diagram + conditional ----
  G.probability.push(
    function treeDiagramTwoStep() {
      const pA = pick([[1,3],[2,5],[1,4],[3,7],[2,3]]);
      const pB = pick([[1,2],[2,5],[1,3],[3,4]]);
      const p = (pA[0]/pA[1]) * (pB[0]/pB[1]);
      const num = pA[0] * pB[0];
      const den = pA[1] * pB[1];
      const g = gcd(num, den);
      return {
        topic: 'probability',
        prompt: `A bag has red and blue balls; P(red) = <strong>${pA[0]}/${pA[1]}</strong>. A separate bag has green and yellow; P(green) = <strong>${pB[0]}/${pB[1]}</strong>. One ball is drawn from each bag. Find P(red AND green) as a fraction in simplest form.`,
        hint: `Independent draws → multiply, then simplify.`,
        answer: `${num/g}/${den/g}`,
        accepts: [`${num}/${den}`, String(+(num/den).toFixed(4))],
        numeric: num/den,
        tol: 0.001,
        solution: [
          `P(red ∩ green) = ${pA[0]}/${pA[1]} × ${pB[0]}/${pB[1]} = ${num}/${den}.`,
          `Simplify by ${g}: <strong>${num/g}/${den/g}</strong>.`
        ]
      };
    },
    function withoutReplacement() {
      const r = pick([3, 4, 5]);
      const b = pick([3, 4, 5, 6]);
      const total = r + b;
      // P(both red drawing 2 without replacement)
      const num = r * (r - 1);
      const den = total * (total - 1);
      const g = gcd(num, den);
      return {
        topic: 'probability',
        prompt: `A bag contains <strong>${r} red</strong> and <strong>${b} blue</strong> balls. Two balls are drawn without replacement. Find the probability that <strong>both are red</strong>. Fraction in simplest form.`,
        hint: `First: ${r}/${total}. Second: (${r}−1)/(${total}−1). Multiply.`,
        answer: `${num/g}/${den/g}`,
        accepts: [`${num}/${den}`],
        numeric: num/den,
        tol: 0.001,
        solution: [
          `P(1st red) = ${r}/${total}. After that: ${r-1} red left, ${total-1} balls total.`,
          `P(both red) = ${r}/${total} × ${r-1}/${total-1} = ${num}/${den} = <strong>${num/g}/${den/g}</strong>.`
        ]
      };
    }
  );

  // ---- Volume: cone, sphere, pyramid, similar shapes ----
  G.volume.push(
    function coneVolume() {
      const r = rand(3, 8), h = rand(6, 15);
      const V = +(1/3 * Math.PI * r * r * h).toFixed(2);
      return {
        topic: 'volume',
        prompt: `A cone has radius <strong>${r} cm</strong> and vertical height <strong>${h} cm</strong>. Find its volume (cm³, to 2 dp).`,
        hint: `V = ⅓ π r² h.`,
        answer: V.toFixed(2),
        numeric: V,
        tol: 0.05,
        solution: [
          `V = ⅓ × π × ${r}² × ${h} = ⅓ × π × ${r*r*h} ≈ <strong>${V} cm³</strong>.`
        ]
      };
    },
    function sphereVolume() {
      const r = rand(2, 8);
      const V = +(4/3 * Math.PI * r * r * r).toFixed(2);
      return {
        topic: 'volume',
        prompt: `Find the volume of a sphere of radius <strong>${r} cm</strong> (cm³, to 2 dp).`,
        hint: `V = ⁴⁄₃ π r³.`,
        answer: V.toFixed(2),
        numeric: V,
        tol: 0.05,
        solution: [
          `V = ⁴⁄₃ × π × ${r}³ = ⁴⁄₃ × π × ${r*r*r} ≈ <strong>${V} cm³</strong>.`
        ]
      };
    },
    function pyramidVolume() {
      const l = rand(4, 12), w = rand(4, 12), h = rand(5, 15);
      const V = +(1/3 * l * w * h).toFixed(2);
      return {
        topic: 'volume',
        prompt: `A rectangular-based pyramid has base <strong>${l} cm × ${w} cm</strong> and vertical height <strong>${h} cm</strong>. Find its volume (cm³, to 2 dp).`,
        hint: `V = ⅓ × base area × height.`,
        answer: V.toFixed(2),
        numeric: V,
        tol: 0.02,
        solution: [
          `Base area = ${l} × ${w} = ${l*w} cm².`,
          `V = ⅓ × ${l*w} × ${h} = <strong>${V} cm³</strong>.`
        ]
      };
    }
  );

  // ============================================================
  // NEW TOPICS
  // ============================================================

  // ---- similarity ----
  G.similarity = [
    function areaFromLinear() {
      const k = pick([2, 3, 4, 5]);
      const A1 = rand(10, 60);
      const A2 = A1 * k * k;
      return {
        topic: 'similarity',
        prompt: `Two similar shapes have linear scale factor <strong>${k}</strong>. The smaller has area <strong>${A1} cm²</strong>. Find the area of the larger (cm²).`,
        hint: `Area scale factor = (linear scale factor)² = ${k*k}.`,
        answer: String(A2),
        numeric: A2,
        solution: [
          `Area SF = ${k}² = ${k*k}.`,
          `Larger area = ${A1} × ${k*k} = <strong>${A2} cm²</strong>.`
        ]
      };
    },
    function volumeFromLinear() {
      const k = pick([2, 3, 4]);
      const V1 = rand(10, 50);
      const V2 = V1 * k * k * k;
      return {
        topic: 'similarity',
        prompt: `Two similar solids have linear scale factor <strong>${k}</strong>. The smaller has volume <strong>${V1} cm³</strong>. Find the volume of the larger (cm³).`,
        hint: `Volume scale factor = (linear scale factor)³ = ${k*k*k}.`,
        answer: String(V2),
        numeric: V2,
        solution: [
          `Volume SF = ${k}³ = ${k*k*k}.`,
          `Larger volume = ${V1} × ${k*k*k} = <strong>${V2} cm³</strong>.`
        ]
      };
    },
    function findLinearFromArea() {
      const k = pick([2, 3, 4, 5]);
      const A1 = rand(5, 30);
      const A2 = A1 * k * k;
      return {
        topic: 'similarity',
        prompt: `Two similar shapes have areas <strong>${A1} cm²</strong> and <strong>${A2} cm²</strong>. Find the linear scale factor from the smaller to the larger.`,
        hint: `Linear SF = √(area SF).`,
        answer: String(k),
        numeric: k,
        solution: [
          `Area SF = ${A2}/${A1} = ${k*k}.`,
          `Linear SF = √${k*k} = <strong>${k}</strong>.`
        ]
      };
    }
  ];

  // ---- circleTheorems ----
  G.circleTheorems = [
    function angleAtCentre() {
      const centre = pick([40, 60, 80, 100, 120, 140]);
      const circ = centre / 2;
      return {
        topic: 'circleTheorems',
        prompt: `An arc subtends an angle of <strong>${centre}°</strong> at the centre of a circle. What angle does the same arc subtend at the circumference?`,
        hint: `Angle at centre = 2 × angle at circumference (same arc).`,
        answer: String(circ),
        numeric: circ,
        tol: 0.5,
        solution: [`Angle at circumference = ${centre} ÷ 2 = <strong>${circ}°</strong>.`]
      };
    },
    function angleInSemicircle() {
      const other = pick([25, 35, 42, 55, 63, 71]);
      const answer = 90 - other;
      return {
        topic: 'circleTheorems',
        prompt: `A triangle is inscribed in a circle so that one side is a diameter. One of the other angles is <strong>${other}°</strong>. Find the third angle.`,
        hint: `Angle in a semicircle is 90°. The angles in a triangle sum to 180°.`,
        answer: String(answer),
        numeric: answer,
        tol: 0.5,
        solution: [
          `The angle opposite the diameter is 90° (angle in a semicircle).`,
          `Third angle = 180 − 90 − ${other} = <strong>${answer}°</strong>.`
        ]
      };
    },
    function cyclicQuad() {
      const opp = pick([50, 65, 78, 92, 110, 125]);
      const answer = 180 - opp;
      return {
        topic: 'circleTheorems',
        prompt: `In a cyclic quadrilateral, one angle is <strong>${opp}°</strong>. Find the angle opposite to it.`,
        hint: `Opposite angles of a cyclic quadrilateral sum to 180°.`,
        answer: String(answer),
        numeric: answer,
        tol: 0.5,
        solution: [`Opposite angle = 180 − ${opp} = <strong>${answer}°</strong>.`]
      };
    }
  ];

  // ---- vectors ----
  G.vectors = [
    function magnitude() {
      const x = pick([3, 5, 6, 7, 8, 9, 12]);
      const y = pick([4, 6, 8, 10, 12, 15]);
      const m = +Math.sqrt(x*x + y*y).toFixed(2);
      return {
        topic: 'vectors',
        prompt: `Find the magnitude of the vector <strong>(${x}, ${y})</strong>, to 2 dp.`,
        hint: `|v| = √(x² + y²).`,
        answer: m.toFixed(2),
        numeric: m,
        tol: 0.02,
        solution: [`|v| = √(${x}² + ${y}²) = √${x*x + y*y} ≈ <strong>${m}</strong>.`]
      };
    },
    function addScaled() {
      const ax = rand(-4, 4), ay = rand(-4, 4);
      const bx = rand(-4, 4), by = rand(-4, 4);
      const k = pick([2, 3, -1, -2]);
      const cx = ax + k * bx, cy = ay + k * by;
      return {
        topic: 'vectors',
        prompt: `<strong>a = (${ax}, ${ay})</strong>, <strong>b = (${bx}, ${by})</strong>. Find <strong>a + ${k===-1?'−':k===1?'':k}b</strong>. Give as <code>x,y</code>.`,
        hint: `Multiply b by ${k} component-wise, then add.`,
        answer: `${cx},${cy}`,
        accepts: [`(${cx},${cy})`, `(${cx}, ${cy})`],
        solution: [
          `${k}b = (${k*bx}, ${k*by}).`,
          `a + ${k}b = (${ax} + ${k*bx}, ${ay} + ${k*by}) = <strong>(${cx}, ${cy})</strong>.`
        ]
      };
    }
  ];

  // ---- algebraic fractions ----
  G.algebraicFractions = [
    function simplifyFactorable() {
      // (x² - a²) / ((x-a)(x+b))  simplifies to (x+a)/(x+b)
      let a, b;
      do { a = rand(2, 6); b = rand(2, 6); } while (a === b);
      return {
        topic: 'algebraicFractions',
        prompt: `Simplify: <strong>(x<sup>2</sup> − ${a*a}) / ((x − ${a})(x + ${b}))</strong>. Type as e.g. <code>(x+3)/(x+5)</code>.`,
        hint: `Factorise the top as a difference of two squares.`,
        answer: `(x+${a})/(x+${b})`,
        solution: [
          `Numerator: x² − ${a*a} = (x − ${a})(x + ${a}).`,
          `Cancel (x − ${a}) with the denominator: <strong>(x + ${a}) / (x + ${b})</strong>.`
        ]
      };
    },
    function addSimple() {
      const a = rand(2, 6), b = rand(2, 6);
      // 1/(x + a) + 1/(x + b) = (2x + a + b) / ((x+a)(x+b))
      return {
        topic: 'algebraicFractions',
        prompt: `Write as a single fraction: <strong>1/(x + ${a}) + 1/(x + ${b})</strong>. Give the numerator only (a linear expression in x).`,
        hint: `Common denominator (x + ${a})(x + ${b}). Cross-multiply.`,
        answer: `2x+${a+b}`,
        accepts: [`${a+b}+2x`],
        solution: [
          `Common denominator: (x + ${a})(x + ${b}).`,
          `Combine: (x + ${b}) + (x + ${a}) = <strong>2x + ${a+b}</strong>.`,
          `Full answer: (2x + ${a+b}) / ((x + ${a})(x + ${b})).`
        ]
      };
    }
  ];

  // ---- functions ----
  G.functions = [
    function evalF() {
      const a = rand(2, 5), b = rand(-6, 6);
      const x = rand(-5, 5);
      const y = a*x + b;
      return {
        topic: 'functions',
        prompt: `f(x) = <strong>${a}x ${b>=0?'+':'−'} ${Math.abs(b)}</strong>. Find <strong>f(${x})</strong>.`,
        hint: `Substitute x = ${x}.`,
        answer: String(y),
        numeric: y,
        solution: [`f(${x}) = ${a}(${x}) ${b>=0?'+':'−'} ${Math.abs(b)} = ${a*x} ${b>=0?'+':'−'} ${Math.abs(b)} = <strong>${y}</strong>.`]
      };
    },
    function composite() {
      const a = rand(2, 4), b = rand(-4, 4);
      const c = rand(2, 4), d = rand(-4, 4);
      const x = rand(-3, 3);
      const gx = c * x + d;
      const fgx = a * gx + b;
      return {
        topic: 'functions',
        prompt: `f(x) = <strong>${a}x ${b>=0?'+':'−'} ${Math.abs(b)}</strong> and g(x) = <strong>${c}x ${d>=0?'+':'−'} ${Math.abs(d)}</strong>. Find <strong>fg(${x})</strong>.`,
        hint: `fg(x) means f(g(x)) — do g first, then f.`,
        answer: String(fgx),
        numeric: fgx,
        solution: [
          `g(${x}) = ${c}(${x}) ${d>=0?'+':'−'} ${Math.abs(d)} = ${gx}.`,
          `f(${gx}) = ${a}(${gx}) ${b>=0?'+':'−'} ${Math.abs(b)} = <strong>${fgx}</strong>.`
        ]
      };
    },
    function inverseLinear() {
      const a = rand(2, 5), b = rand(-6, 6);
      // f(x) = ax + b; inverse is (x - b)/a. Ask them to find f^-1(5).
      const y = rand(-10, 20);
      const xVal = (y - b) / a;
      // Make sure integer
      const yy = a * rand(-3, 5) + b;
      const xx = (yy - b) / a;
      return {
        topic: 'functions',
        prompt: `f(x) = <strong>${a}x ${b>=0?'+':'−'} ${Math.abs(b)}</strong>. Find <strong>f<sup>−1</sup>(${yy})</strong>.`,
        hint: `Solve f(x) = ${yy} for x, i.e. ${a}x ${b>=0?'+':'−'} ${Math.abs(b)} = ${yy}.`,
        answer: String(xx),
        numeric: xx,
        tol: 0.01,
        solution: [
          `Let y = ${a}x ${b>=0?'+':'−'} ${Math.abs(b)}.`,
          `Rearrange: x = (y ${b>=0?'−':'+'} ${Math.abs(b)}) / ${a}.`,
          `f⁻¹(${yy}) = (${yy} ${b>=0?'−':'+'} ${Math.abs(b)}) / ${a} = <strong>${xx}</strong>.`
        ]
      };
    }
  ];

  // ---- proportion ----
  G.proportion = [
    function directProp() {
      const k = pick([2, 3, 4, 5, 6]);
      const x0 = rand(2, 6);
      const y0 = k * x0;
      const x1 = rand(2, 10);
      const y1 = k * x1;
      return {
        topic: 'proportion',
        prompt: `y is directly proportional to x. When x = <strong>${x0}</strong>, y = <strong>${y0}</strong>. Find y when x = <strong>${x1}</strong>.`,
        hint: `y = kx. Find k first.`,
        answer: String(y1),
        numeric: y1,
        solution: [
          `k = y/x = ${y0}/${x0} = ${k}.`,
          `y = ${k} × ${x1} = <strong>${y1}</strong>.`
        ]
      };
    },
    function inverseSquareProp() {
      const k = pick([12, 16, 24, 36, 48]);
      const x0 = pick([2, 3, 4]);
      const y0 = k / (x0 * x0);
      const x1 = pick([1, 2, 3, 4, 6]);
      const y1 = k / (x1 * x1);
      // Only nice numbers
      if (!Number.isFinite(y0) || !Number.isFinite(y1) || y0 !== Math.round(y0) || y1 !== Math.round(y1)) {
        return G.proportion[0]();
      }
      return {
        topic: 'proportion',
        prompt: `y is inversely proportional to x². When x = <strong>${x0}</strong>, y = <strong>${y0}</strong>. Find y when x = <strong>${x1}</strong>.`,
        hint: `y = k / x². Find k first.`,
        answer: String(y1),
        numeric: y1,
        tol: 0.01,
        solution: [
          `k = y × x² = ${y0} × ${x0*x0} = ${k}.`,
          `y = ${k} / ${x1}² = ${k} / ${x1*x1} = <strong>${y1}</strong>.`
        ]
      };
    }
  ];

  // ---- bounds ----
  G.bounds = [
    function areaBounds() {
      // Length rounded to nearest cm.
      const L = rand(6, 15);
      const W = rand(4, 12);
      const uL = L + 0.5, lL = L - 0.5;
      const uW = W + 0.5, lW = W - 0.5;
      const ub = +(uL * uW).toFixed(2);
      const lb = +(lL * lW).toFixed(2);
      const ask = pick(['upper', 'lower']);
      return {
        topic: 'bounds',
        prompt: `A rectangle has length <strong>${L} cm</strong> and width <strong>${W} cm</strong>, each measured to the nearest cm. Find the <strong>${ask} bound</strong> for its area (cm², to 2 dp).`,
        hint: `Upper bound = (L + 0.5) × (W + 0.5). Lower bound = (L − 0.5) × (W − 0.5).`,
        answer: (ask === 'upper' ? ub : lb).toFixed(2),
        numeric: ask === 'upper' ? ub : lb,
        tol: 0.05,
        solution: [
          `Upper bounds of sides: ${uL} and ${uW}. Lower bounds: ${lL} and ${lW}.`,
          `${ask === 'upper' ? 'Upper' : 'Lower'} bound of area = ${ask === 'upper' ? uL : lL} × ${ask === 'upper' ? uW : lW} = <strong>${(ask === 'upper' ? ub : lb).toFixed(2)} cm²</strong>.`
        ]
      };
    }
  ];

  // ---- recurring decimals ----
  G.recurringDecimals = [
    function singleDigit() {
      // 0.dddd... = d/9
      const d = pick([1, 2, 4, 5, 7, 8]);
      return {
        topic: 'recurringDecimals',
        prompt: `Write <strong>0.${d}̇</strong> (recurring) as a fraction in simplest form.`,
        hint: `Let x = 0.${d}${d}${d}…, then 10x = ${d}.${d}${d}${d}…; subtract.`,
        answer: `${d}/9`,
        accepts: [String(+(d/9).toFixed(6))],
        solution: [
          `Let x = 0.${d}${d}${d}…`,
          `Then 10x = ${d}.${d}${d}${d}…`,
          `Subtract: 9x = ${d}, so x = <strong>${d}/9</strong>.`
        ]
      };
    },
    function twoDigit() {
      // 0.abab... = ab/99
      const a = rand(1, 8), b = rand(1, 8);
      const num = 10*a + b;
      const den = 99;
      const g = gcd(num, den);
      const fn = num / g, fd = den / g;
      return {
        topic: 'recurringDecimals',
        prompt: `Write <strong>0.${a}${b}̇</strong> (with ${a}${b} recurring) as a fraction in simplest form. Type as e.g. <code>7/33</code>.`,
        hint: `Let x = 0.${a}${b}${a}${b}…, then 100x = ${a}${b}.${a}${b}${a}${b}…; subtract.`,
        answer: `${fn}/${fd}`,
        accepts: [`${num}/${den}`],
        solution: [
          `Let x = 0.${a}${b}${a}${b}…`,
          `100x = ${a}${b}.${a}${b}${a}${b}…`,
          `Subtract: 99x = ${num}, so x = ${num}/99 = <strong>${fn}/${fd}</strong>.`
        ]
      };
    }
  ];

  // ---- Venn ----
  G.venn = [
    function unionTwoSets() {
      const nA = rand(5, 15);
      const nB = rand(5, 15);
      const both = rand(1, Math.min(nA, nB) - 1);
      const union = nA + nB - both;
      return {
        topic: 'venn',
        prompt: `n(A) = <strong>${nA}</strong>, n(B) = <strong>${nB}</strong>, n(A ∩ B) = <strong>${both}</strong>. Find <strong>n(A ∪ B)</strong>.`,
        hint: `n(A ∪ B) = n(A) + n(B) − n(A ∩ B).`,
        answer: String(union),
        numeric: union,
        solution: [
          `n(A ∪ B) = ${nA} + ${nB} − ${both} = <strong>${union}</strong>.`
        ]
      };
    },
    function neitherEvent() {
      const total = pick([30, 40, 50, 60]);
      const nA = rand(10, total - 10);
      const nB = rand(10, total - 10);
      const both = rand(1, Math.min(nA, nB) - 2);
      const eitherAorB = nA + nB - both;
      const neither = total - eitherAorB;
      if (neither < 0) return G.venn[0]();
      return {
        topic: 'venn',
        prompt: `In a class of <strong>${total}</strong> pupils, ${nA} study French, ${nB} study Spanish, and ${both} study both. How many study <strong>neither</strong>?`,
        hint: `Find n(F ∪ S), then subtract from total.`,
        answer: String(neither),
        numeric: neither,
        solution: [
          `n(F ∪ S) = ${nA} + ${nB} − ${both} = ${eitherAorB}.`,
          `Neither = ${total} − ${eitherAorB} = <strong>${neither}</strong>.`
        ]
      };
    }
  ];

  // ---- cumulative frequency ----
  G.cumulativeFrequency = [
    function medianFromCF() {
      // Toy example — quartiles at n/4, n/2, 3n/4
      const total = pick([40, 60, 80, 100]);
      const q = pick(['median', 'lower quartile', 'upper quartile']);
      const pos = q === 'median' ? total / 2 : q === 'lower quartile' ? total / 4 : 3 * total / 4;
      // Suppose a class boundary at pos gives a value we compute
      const val = rand(30, 80);
      return {
        topic: 'cumulativeFrequency',
        prompt: `A cumulative frequency curve for <strong>${total}</strong> data values reaches cumulative frequency <strong>${pos}</strong> at a value of <strong>${val}</strong>. Which statistic does this represent?`,
        hint: `Median: n/2. Lower quartile: n/4. Upper quartile: 3n/4.`,
        answer: q,
        accepts: [q.replace(' ', ''), 'median', 'q1', 'q2', 'q3', 'LQ', 'UQ'].filter(x => x.toLowerCase() === q.toLowerCase() || x.toLowerCase() === q.replace(' ', '').toLowerCase()),
        solution: [
          `${pos} out of ${total} means we're at the ${q === 'median' ? '½' : q === 'lower quartile' ? '¼' : '¾'} point.`,
          `That is the <strong>${q}</strong>.`
        ]
      };
    },
    function iqrCalc() {
      const q1 = rand(20, 40);
      const q3 = q1 + rand(10, 30);
      const iqr = q3 - q1;
      return {
        topic: 'cumulativeFrequency',
        prompt: `The lower quartile is <strong>${q1}</strong> and the upper quartile is <strong>${q3}</strong>. Find the interquartile range.`,
        hint: `IQR = UQ − LQ.`,
        answer: String(iqr),
        numeric: iqr,
        solution: [`IQR = ${q3} − ${q1} = <strong>${iqr}</strong>.`]
      };
    }
  ];

  // ---- histograms (frequency density) ----
  G.histograms = [
    function freqDensity() {
      const f = rand(10, 60);
      const w = pick([2, 4, 5, 10]);
      const d = f / w;
      return {
        topic: 'histograms',
        prompt: `A histogram class has frequency <strong>${f}</strong> and class width <strong>${w}</strong>. Find the frequency density.`,
        hint: `Frequency density = frequency / class width.`,
        answer: String(d),
        numeric: d,
        tol: 0.01,
        solution: [`Frequency density = ${f} / ${w} = <strong>${d}</strong>.`]
      };
    },
    function freqFromDensity() {
      const d = pick([1.5, 2, 2.5, 3, 3.5, 4, 5]);
      const w = pick([2, 4, 5, 10]);
      const f = d * w;
      return {
        topic: 'histograms',
        prompt: `A histogram class has frequency density <strong>${d}</strong> and class width <strong>${w}</strong>. Find the frequency.`,
        hint: `Frequency = density × width.`,
        answer: String(f),
        numeric: f,
        tol: 0.01,
        solution: [`Frequency = ${d} × ${w} = <strong>${f}</strong>.`]
      };
    }
  ];

  // ---- scatter graphs ----
  G.scatterGraphs = [
    function predictFromLine() {
      const m = pick([0.5, 1, 1.5, 2, 2.5, 3]);
      const c = rand(-3, 8);
      const x = rand(4, 15);
      const y = +(m * x + c).toFixed(2);
      return {
        topic: 'scatterGraphs',
        prompt: `A line of best fit has equation <strong>y = ${m}x ${c>=0?'+':'−'} ${Math.abs(c)}</strong>. Use it to estimate y when x = <strong>${x}</strong>.`,
        hint: `Substitute x = ${x}.`,
        answer: String(y),
        numeric: y,
        tol: 0.05,
        solution: [`y = ${m}(${x}) ${c>=0?'+':'−'} ${Math.abs(c)} = ${m*x} ${c>=0?'+':'−'} ${Math.abs(c)} = <strong>${y}</strong>.`]
      };
    },
    function correlationType() {
      const type = pick(['positive', 'negative', 'no']);
      const desc = {
        positive: 'As height increases, weight tends to increase.',
        negative: 'As price of a phone goes up, the number sold tends to decrease.',
        no:       'There seems to be no clear pattern between shoe size and exam mark.'
      }[type];
      return {
        topic: 'scatterGraphs',
        prompt: `A scatter graph shows: "${desc}" What type of correlation is this? (Type <code>positive</code>, <code>negative</code> or <code>no</code>.)`,
        hint: `Positive: both go up. Negative: one up one down. No: no pattern.`,
        answer: type,
        accepts: [type + ' correlation'],
        solution: [`This is <strong>${type} correlation</strong>.`]
      };
    }
  ];

  // ---- IMC / Cayley problem examples (competition stretch) ----
  G.competition = [
    function parity() {
      const n = pick([31, 47, 63, 99, 101, 999, 2025]);
      const isOdd = n % 2 !== 0;
      const question = pick([
        {q: `Is ${n}² odd or even?`, a: (n*n) % 2 !== 0 ? 'odd' : 'even'},
        {q: `Is ${n} × ${n+1} odd or even?`, a: 'even'},
        {q: `Is ${n}² + 1 odd or even?`, a: (n*n + 1) % 2 !== 0 ? 'odd' : 'even'}
      ]);
      return {
        topic: 'competition',
        prompt: `<strong>Parity:</strong> ${question.q} (Type <code>odd</code> or <code>even</code>.)`,
        hint: `An integer squared has the same parity as the integer. Odd × odd = odd. odd + 1 = even.`,
        answer: question.a,
        solution: [
          `${n} is ${isOdd ? 'odd' : 'even'}.`,
          `Answer: <strong>${question.a}</strong>.`
        ]
      };
    },
    function digitSum() {
      const n = rand(100, 999);
      const digits = String(n).split('').map(Number);
      const s = digits.reduce((a,b)=>a+b, 0);
      return {
        topic: 'competition',
        prompt: `<strong>Digit sum:</strong> What is the digit sum of <strong>${n}</strong>? (Add the individual digits.)`,
        hint: `${digits.join(' + ')}.`,
        answer: String(s),
        numeric: s,
        solution: [`${digits.join(' + ')} = <strong>${s}</strong>.`]
      };
    },
    function invariant() {
      // Classic: put numbers 1..n on board, repeatedly replace two with their sum. Final value = 1+2+...+n regardless of order.
      const n = pick([10, 15, 20, 25, 100]);
      const s = n * (n + 1) / 2;
      return {
        topic: 'competition',
        prompt: `<strong>Invariant:</strong> The numbers 1, 2, 3, …, ${n} are written on a board. In one move, you pick any two numbers, erase them, and write their sum. After ${n-1} moves only one number remains. What is it?`,
        hint: `Notice the total sum never changes as you combine — the "invariant" is the sum.`,
        answer: String(s),
        numeric: s,
        solution: [
          `Each move keeps the total sum the same (a + b becomes a+b).`,
          `The final number equals the original sum: 1 + 2 + … + ${n} = ${n}(${n}+1)/2 = <strong>${s}</strong>.`
        ]
      };
    }
  ];

  // ============================================================
  // Rename olympiad section, register all new topics
  // ============================================================

  // Retag existing olympiad topics
  T.forEach(t => {
    if (t.section === 'Olympiad stretch') t.section = 'Competition (IMC / Cayley)';
  });

  // Push new topics into the right sections
  const newTopics = [
    // Number
    { key: 'bounds',              label: 'Upper & lower bounds',    section: 'Number',   weak: false },
    { key: 'recurringDecimals',   label: 'Recurring decimals → fractions', section: 'Number', weak: false },
    // Algebra
    { key: 'algebraicFractions',  label: 'Algebraic fractions',     section: 'Algebra',  weak: false },
    { key: 'functions',           label: 'Function notation f(x), fg(x)', section: 'Algebra', weak: false },
    { key: 'proportion',          label: 'Direct & inverse proportion', section: 'Algebra', weak: false },
    // Geometry
    { key: 'similarity',          label: 'Similarity & scale factors', section: 'Geometry', weak: false },
    { key: 'circleTheorems',      label: 'Circle theorems',         section: 'Geometry', weak: false },
    { key: 'vectors',             label: 'Vectors',                 section: 'Geometry', weak: false },
    // Data
    { key: 'venn',                label: 'Venn diagrams & sets',    section: 'Data',     weak: false },
    { key: 'cumulativeFrequency', label: 'Cumulative frequency & IQR', section: 'Data',  weak: false },
    { key: 'histograms',          label: 'Histograms (freq density)', section: 'Data',   weak: false },
    { key: 'scatterGraphs',       label: 'Scatter graphs & correlation', section: 'Data', weak: false },
    // Competition
    { key: 'competition',         label: 'Parity, invariants & digit tricks', section: 'Competition (IMC / Cayley)', weak: false, olympiad: true }
  ];
  newTopics.forEach(t => T.push(t));

  // ============================================================
  // Learning content for new topics + supplements
  // ============================================================
  Object.assign(C, {
    bounds: {
      blurb: `<p>Every rounded measurement hides an interval. "6 cm to the nearest cm" means the real
        value is anywhere from 5.5 up to (but not including) 6.5. When you calculate with rounded
        values, the answer has its own <strong>upper</strong> and <strong>lower bound</strong>.</p>`,
      formulas: [
        { name: 'Upper bound of a value', expr: 'value + ½ × rounding unit' },
        { name: 'Lower bound of a value', expr: 'value − ½ × rounding unit' },
        { name: 'Combining (max × max, min × min)', expr: 'for products: use UB × UB for max, LB × LB for min' },
        { name: 'Combining (max ÷ min, min ÷ max)', expr: 'for quotients: divide by the OPPOSITE bound' }
      ],
      examples: [
        {
          q: 'A rectangle is 8 cm by 5 cm to the nearest cm. Find the maximum possible area.',
          steps: [
            'Upper bound of each side: 8.5 and 5.5.',
            'Maximum area = 8.5 × 5.5 = <strong>46.75 cm²</strong>.'
          ]
        }
      ],
      pitfalls: [
        'For a division, the maximum uses UB / LB (biggest ÷ smallest), not UB / UB.',
        'Being casual about "up to" vs "less than" — the upper bound is the value the measurement never reaches, only approaches.'
      ],
      videos: [
        { title: 'Corbettmaths — Bounds', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=bounds', badge: 'Video + practice' },
        { title: 'Khan Academy — Rounding & bounds', source: 'khanacademy.org', url: 'https://www.khanacademy.org/math/pre-algebra', badge: 'Video course' }
      ]
    },

    recurringDecimals: {
      blurb: `<p>Every recurring decimal is a fraction. The trick to converting is <em>algebraic</em>:
        set x = the decimal, multiply by a power of 10 that shifts the recurring block by one full cycle,
        then subtract. The recurring tail cancels and you're left with a linear equation.</p>`,
      formulas: [
        { name: '1-digit recurring', expr: '0.d̄ = d/9' },
        { name: '2-digit recurring', expr: '0.ab̄ = (10a+b)/99' },
        { name: '3-digit recurring', expr: '0.abc̄ = (100a+10b+c)/999' }
      ],
      examples: [
        {
          q: 'Write 0.4̄ as a fraction.',
          steps: [
            'x = 0.4444…',
            '10x = 4.4444…',
            'Subtract: 9x = 4 → x = <strong>4/9</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Multiplying by the wrong power of 10 — must match the length of the recurring block.',
        'Forgetting to simplify at the end.'
      ],
      videos: [
        { title: 'Corbettmaths — Recurring Decimals', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=recurring+decimal', badge: 'Video + practice' }
      ]
    },

    algebraicFractions: {
      blurb: `<p>These behave exactly like number fractions, but with expressions instead of integers.
        Simplify by <em>factorising</em> top and bottom, then cancelling. Add or subtract by finding
        a common denominator — usually the product of the individual denominators.</p>`,
      formulas: [
        { name: 'Simplify', expr: 'factorise numerator and denominator, cancel common factors' },
        { name: 'Add / subtract', expr: 'a/p ± b/q = (aq ± bp) / (pq)' },
        { name: 'Multiply', expr: '(a/p)(b/q) = ab / (pq)' },
        { name: 'Divide', expr: '(a/p) ÷ (b/q) = (a/p)(q/b) = aq / (pb)' }
      ],
      examples: [
        {
          q: 'Simplify (x² − 9) / (x² − x − 6).',
          steps: [
            'Top: x² − 9 = (x − 3)(x + 3) (difference of squares).',
            'Bottom: x² − x − 6 = (x − 3)(x + 2).',
            'Cancel (x − 3): <strong>(x + 3) / (x + 2)</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Cancelling terms instead of factors — you can only cancel a common <em>factor</em>, not a term in a sum.',
        'Forgetting values of x that make the denominator zero (excluded values).'
      ],
      videos: [
        { title: 'Corbettmaths — Algebraic Fractions', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=algebraic+fraction', badge: 'Video + practice' }
      ]
    },

    functions: {
      blurb: `<p><strong>Function notation</strong> gives a compact way to say "a rule that turns an
        input into an output". f(x) is not multiplication — f is a name, and (x) is the input.
        <strong>fg(x)</strong> means do g first, then f (right-to-left). <strong>f⁻¹(x)</strong>
        is the inverse — it undoes what f did.</p>`,
      formulas: [
        { name: 'Evaluate', expr: 'f(a) = replace x with a in the definition' },
        { name: 'Composite', expr: 'fg(x) = f(g(x))' },
        { name: 'Inverse (linear)', expr: 'if f(x) = ax + b, then f⁻¹(x) = (x − b) / a' }
      ],
      examples: [
        {
          q: 'f(x) = 2x + 3, g(x) = x − 1. Find fg(4).',
          steps: [
            'g(4) = 4 − 1 = 3.',
            'f(3) = 2(3) + 3 = <strong>9</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Doing fg(x) as gf(x) — the order matters.',
        'Treating f(x) as "f times x".'
      ],
      videos: [
        { title: 'Corbettmaths — Function notation', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=function+notation', badge: 'Video + practice' },
        { title: 'Khan Academy — Functions', source: 'khanacademy.org', url: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:functions', badge: 'Video course' }
      ]
    },

    proportion: {
      blurb: `<p><strong>Direct proportion</strong>: as one goes up, the other goes up by the same
        factor. Written y ∝ x, meaning y = kx.<br>
        <strong>Inverse proportion</strong>: as one goes up, the other goes down. Written y ∝ 1/x,
        meaning y = k/x. The trickier variants are y ∝ x² or y ∝ 1/x² — same idea, different powers.</p>`,
      formulas: [
        { name: 'Direct',       expr: 'y = kx' },
        { name: 'Direct sq',    expr: 'y = kx²' },
        { name: 'Inverse',      expr: 'y = k/x' },
        { name: 'Inverse sq',   expr: 'y = k/x²' }
      ],
      examples: [
        {
          q: 'y is inversely proportional to x². y = 8 when x = 3. Find y when x = 4.',
          steps: [
            'Model: y = k/x².',
            'Find k: 8 = k/9, so k = 72.',
            'When x = 4: y = 72/16 = <strong>4.5</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Forgetting to square (or square-root) when the relation involves x².',
        'Never finding k — always find k first, then use it.'
      ],
      videos: [
        { title: 'Corbettmaths — Direct & Inverse Proportion', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=proportion', badge: 'Video + practice' }
      ]
    },

    similarity: {
      blurb: `<p>Two shapes are <strong>similar</strong> if one is a scaled copy of the other. The
        ratio of any pair of matching sides is the <strong>linear scale factor</strong> k.
        Then <em>areas</em> scale by k², and <em>volumes</em> scale by k³.</p>`,
      formulas: [
        { name: 'Linear SF', expr: 'k = new length / old length' },
        { name: 'Area SF',   expr: 'k²' },
        { name: 'Volume SF', expr: 'k³' }
      ],
      examples: [
        {
          q: 'Two similar cones. The smaller has volume 40 cm³, linear scale factor to the bigger is 3.',
          steps: [
            'Volume scale factor = 3³ = 27.',
            'Bigger volume = 40 × 27 = <strong>1080 cm³</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Squaring or cubing the wrong thing — the linear SF is what you cube for volume, not the volume SF.',
        'Confusing "ratio of areas" (k²) with "linear ratio" (k).'
      ],
      videos: [
        { title: 'Corbettmaths — Similar Shapes', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=similar+shapes', badge: 'Video + practice' },
        { title: 'Khan Academy — Similarity', source: 'khanacademy.org', url: 'https://www.khanacademy.org/math/geometry/hs-geo-similarity', badge: 'Video course' }
      ]
    },

    circleTheorems: {
      blurb: `<p>Circle theorems are the classic Year 9 geometry topic. There are seven or so, all
        provable from the same starting point (angles at a point / isosceles triangles from radii).
        Learn them as pattern-matching tools — spot the configuration, apply the rule.</p>
        <ul>
          <li>The angle at the centre is <strong>twice</strong> the angle at the circumference (same arc).</li>
          <li>The angle in a semicircle is <strong>90°</strong>.</li>
          <li>Angles in the same segment are <strong>equal</strong>.</li>
          <li>Opposite angles of a cyclic quadrilateral sum to <strong>180°</strong>.</li>
          <li>The radius meets the tangent at <strong>90°</strong>.</li>
          <li>Two tangents from the same external point are <strong>equal in length</strong>.</li>
          <li>Alternate segment theorem: the angle between a tangent and a chord equals the angle in the alternate segment.</li>
        </ul>`,
      formulas: [
        { name: 'Central vs circumference', expr: 'centre = 2 × circumference (same arc)' },
        { name: 'Cyclic quadrilateral',     expr: 'opposite angles sum to 180°' },
        { name: 'Tangent + radius',         expr: 'meet at 90°' }
      ],
      examples: [
        {
          q: 'An arc subtends 130° at the centre. What angle does it subtend at the circumference?',
          steps: [
            '130° / 2 = <strong>65°</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Applying "angles in the same segment" to angles in different segments.',
        'Forgetting the "same arc" condition in the centre/circumference rule.'
      ],
      videos: [
        { title: 'Corbettmaths — Circle Theorems (playlist)', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=circle+theorem', badge: 'Videos' },
        { title: 'Khan Academy — Circles', source: 'khanacademy.org', url: 'https://www.khanacademy.org/math/geometry/hs-geo-circles', badge: 'Video course' }
      ]
    },

    vectors: {
      blurb: `<p>A vector has <strong>magnitude</strong> (size) and <strong>direction</strong>.
        Written as a column <span class="math">(x, y)</span>. You can add them (add components),
        multiply by a scalar (multiply each component), and find the magnitude with Pythagoras.</p>`,
      formulas: [
        { name: 'Addition',    expr: '(a, b) + (c, d) = (a+c, b+d)' },
        { name: 'Scalar mult', expr: 'k(a, b) = (ka, kb)' },
        { name: 'Magnitude',   expr: '|v| = √(x² + y²)' },
        { name: 'Parallel',    expr: 'a is parallel to b ⇔ a = kb for some k' }
      ],
      examples: [
        {
          q: 'a = (3, 4). Find |a|.',
          steps: ['|a| = √(3² + 4²) = √25 = <strong>5</strong>.']
        },
        {
          q: 'a = (2, −1), b = (1, 3). Find a + 2b.',
          steps: [
            '2b = (2, 6).',
            'a + 2b = (2+2, −1+6) = <strong>(4, 5)</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Sign errors in subtraction — a − b is NOT b − a.',
        'Adding a scalar to a vector or vice versa.'
      ],
      videos: [
        { title: 'Corbettmaths — Vectors', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=vectors', badge: 'Video + practice' },
        { title: '3Blue1Brown — Essence of Linear Algebra', source: 'YouTube', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab', badge: 'Playlist' }
      ]
    },

    venn: {
      blurb: `<p>A <strong>Venn diagram</strong> partitions a set of objects by which properties
        they have. Use set notation to talk about the regions: <span class="math">A ∪ B</span>
        (either), <span class="math">A ∩ B</span> (both), <span class="math">A'</span> (not A).</p>`,
      formulas: [
        { name: 'Union',                expr: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B)' },
        { name: 'Complement',           expr: "n(A') = total − n(A)" },
        { name: 'Neither',              expr: "total − n(A ∪ B) = n(A' ∩ B')" }
      ],
      examples: [
        {
          q: '50 pupils. 30 play football, 25 play cricket, 10 play both. How many play neither?',
          steps: [
            'n(F ∪ C) = 30 + 25 − 10 = 45.',
            'Neither = 50 − 45 = <strong>5</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Adding overlapping counts twice — subtract the intersection.',
        'Confusing "or" (∪) with "and" (∩).'
      ],
      videos: [
        { title: 'Corbettmaths — Venn Diagrams', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=venn', badge: 'Video + practice' }
      ]
    },

    cumulativeFrequency: {
      blurb: `<p>A <strong>cumulative frequency</strong> table is a running total of frequencies.
        The graph goes through the top-right of each class. From it you read off the
        <strong>median</strong> (at n/2), <strong>lower quartile</strong> (n/4) and <strong>upper quartile</strong>
        (3n/4). The <strong>IQR</strong> is UQ − LQ — a good measure of spread.</p>`,
      formulas: [
        { name: 'Median position', expr: 'n / 2' },
        { name: 'Lower quartile',  expr: 'n / 4' },
        { name: 'Upper quartile',  expr: '3n / 4' },
        { name: 'IQR',             expr: 'UQ − LQ' }
      ],
      examples: [
        {
          q: 'LQ = 32, UQ = 58. Find the IQR.',
          steps: ['IQR = 58 − 32 = <strong>26</strong>.']
        }
      ],
      pitfalls: [
        'Plotting cumulative frequency at the midpoint (should be the upper bound of each class).',
        'Reading the value at the wrong axis when finding quartiles.'
      ],
      videos: [
        { title: 'Corbettmaths — Cumulative Frequency', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=cumulative+frequency', badge: 'Video + practice' },
        { title: 'Corbettmaths — Box Plots', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=box+plot', badge: 'Video + practice' }
      ]
    },

    histograms: {
      blurb: `<p>When class widths differ, a bar chart is misleading — a wide low class can look
        bigger than a narrow tall one. Histograms use <strong>frequency density</strong> on the
        y-axis so the <em>area</em> of each bar equals the frequency.</p>`,
      formulas: [
        { name: 'Frequency density', expr: 'frequency ÷ class width' },
        { name: 'Frequency',         expr: 'density × class width  (= area of bar)' }
      ],
      examples: [
        {
          q: 'Class 20–30 has frequency 45. Find the frequency density.',
          steps: [
            'Class width = 30 − 20 = 10.',
            'Density = 45 / 10 = <strong>4.5</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Plotting frequency (not density) on the y-axis when widths differ.',
        'Assuming class width = the class name (e.g. "20–30" has width 10, not 20).'
      ],
      videos: [
        { title: 'Corbettmaths — Histograms', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=histogram', badge: 'Video + practice' }
      ]
    },

    scatterGraphs: {
      blurb: `<p>A scatter graph shows two variables at once. You look for a
        <strong>correlation</strong>: positive (both increase), negative (one decreases as the
        other increases), or no correlation. A <strong>line of best fit</strong> summarises the
        trend — use it to predict, but only inside the data range (<strong>interpolation</strong>),
        not far outside (<strong>extrapolation</strong>, unreliable).</p>`,
      formulas: [
        { name: 'Positive correlation', expr: 'both variables tend to increase together' },
        { name: 'Negative correlation', expr: 'one tends to increase as the other decreases' },
        { name: 'No correlation',       expr: 'no consistent trend' },
        { name: 'Interpolation vs extrapolation', expr: 'predicting inside vs outside the data range' }
      ],
      examples: [
        {
          q: 'Line of best fit: y = 2x + 3. Estimate y when x = 5.',
          steps: ['y = 2(5) + 3 = <strong>13</strong>.']
        }
      ],
      pitfalls: [
        'Extrapolating far beyond the data — the trend may not hold.',
        'Confusing correlation with causation.'
      ],
      videos: [
        { title: 'Corbettmaths — Scatter Graphs', source: 'corbettmaths.com', url: 'https://corbettmaths.com/?s=scatter+graph', badge: 'Video + practice' }
      ]
    },

    competition: {
      blurb: `<p>UKMT problems test <em>ideas</em> more than machinery. Three of the most rewarding
        ideas at IMC / Grey Kangaroo / Cayley level:</p>
        <ul>
          <li><strong>Parity.</strong> Odd/even reasoning cuts through problems that look horrible
          on paper. Odd × odd = odd; consecutive integers include one even; a sum of an odd number
          of odd numbers is odd.</li>
          <li><strong>Digit-sum arguments.</strong> A number is divisible by 3 (or 9) iff its digit
          sum is. Powerful for problems that ask about the units digit or divisibility.</li>
          <li><strong>Invariants.</strong> If a process preserves some quantity (sum, parity of a
          count, colour of a square), whatever the process ends with must have the same value of
          that quantity.</li>
        </ul>`,
      formulas: [
        { name: 'Parity of a product',     expr: 'odd × odd = odd, otherwise even' },
        { name: 'Divisibility by 9',       expr: 'digit sum divisible by 9' },
        { name: 'Invariant',               expr: 'a quantity unchanged by each allowed move' }
      ],
      examples: [
        {
          q: 'The numbers 1 to 100 are on a board. In one move, you erase two numbers and write their sum. After 99 moves, one number is left. What is it?',
          steps: [
            'The sum is unchanged by each move — an invariant.',
            'So the final number is 1 + 2 + … + 100 = 100 × 101 / 2 = <strong>5050</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Not spotting the invariant — always ask "what stays the same?"',
        'Casework without organisation — write out cases carefully.'
      ],
      videos: [
        { title: 'UKMT — past IMC papers', source: 'ukmt.org.uk', url: 'https://www.ukmt.org.uk/competitions/solo/intermediate-mathematical-challenge', badge: 'Past papers' },
        { title: 'UKMT — Cayley (IMO)', source: 'ukmt.org.uk', url: 'https://www.ukmt.org.uk/competitions/solo/intermediate-mathematical-olympiad-and-kangaroo', badge: 'Past papers' },
        { title: 'Numberphile — problem-solving playlist', source: 'YouTube', url: 'https://www.youtube.com/@numberphile', badge: 'Channel' },
        { title: 'AoPS — Junior competition resources', source: 'artofproblemsolving.com', url: 'https://artofproblemsolving.com/community', badge: 'Community' }
      ]
    }
  });

  // ---- Update existing content entries with the new depth ----
  // Add extra example / video to equations
  if (C.equations) {
    C.equations.examples.push({
      q: 'Solve 2x² + 5x − 3 = 0 using the quadratic formula.',
      steps: [
        'a = 2, b = 5, c = −3.',
        'Discriminant: b² − 4ac = 25 − 4(2)(−3) = 25 + 24 = 49.',
        'x = (−5 ± √49) / 4 = (−5 ± 7) / 4.',
        'x = ½ or x = −3.'
      ]
    });
    C.equations.videos.push({
      title: 'Corbettmaths — Completing the Square',
      source: 'corbettmaths.com',
      url: 'https://corbettmaths.com/?s=completing+the+square',
      badge: 'Video + practice'
    });
  }
  if (C.pythagoras) {
    C.pythagoras.examples.push({
      q: 'A cuboid measures 4 cm × 5 cm × 6 cm. Find the space diagonal.',
      steps: [
        'd² = 4² + 5² + 6² = 16 + 25 + 36 = 77.',
        'd = √77 ≈ <strong>8.77 cm</strong>.'
      ]
    });
    C.pythagoras.videos.push({
      title: 'Corbettmaths — 3D Pythagoras',
      source: 'corbettmaths.com',
      url: 'https://corbettmaths.com/?s=3d+pythagoras',
      badge: 'Video + practice'
    });
  }
  if (C.trig) {
    C.trig.examples.push({
      q: 'Sine rule: A = 40°, B = 65°, a = 8. Find b.',
      steps: [
        '8/sin 40° = b/sin 65°.',
        'b = 8 × sin 65° / sin 40° ≈ <strong>11.28</strong>.'
      ]
    });
    C.trig.videos.push({
      title: 'Corbettmaths — Sine Rule',
      source: 'corbettmaths.com',
      url: 'https://corbettmaths.com/?s=sine+rule',
      badge: 'Video + practice'
    });
    C.trig.videos.push({
      title: 'Corbettmaths — Cosine Rule',
      source: 'corbettmaths.com',
      url: 'https://corbettmaths.com/?s=cosine+rule',
      badge: 'Video + practice'
    });
  }
  if (C.volume) {
    C.volume.formulas.push({ name: 'Cone (surface)', expr: 'π r² + π r l  (l = slant)' });
    C.volume.videos.push({
      title: 'Corbettmaths — Volume of a Cone / Sphere / Pyramid',
      source: 'corbettmaths.com',
      url: 'https://corbettmaths.com/?s=volume+cone',
      badge: 'Video + practice'
    });
  }
  if (C.probability) {
    C.probability.examples.push({
      q: 'A bag has 5 red and 3 blue balls. Two are drawn without replacement. Find P(both red).',
      steps: [
        'P(1st red) = 5/8. After that: 4 red left of 7.',
        'P(both) = 5/8 × 4/7 = 20/56 = <strong>5/14</strong>.'
      ]
    });
    C.probability.videos.push({
      title: 'Corbettmaths — Conditional Probability',
      source: 'corbettmaths.com',
      url: 'https://corbettmaths.com/?s=conditional+probability',
      badge: 'Video + practice'
    });
  }
  if (C.sequences) {
    C.sequences.examples.push({
      q: 'Find the nth term of 3, 8, 15, 24, …',
      steps: [
        'First differences: 5, 7, 9. Second: 2. So 2a = 2 → a = 1.',
        'Subtract n²: 2, 4, 6, 8 → linear part 2n.',
        'nth term = <strong>n² + 2n</strong>.'
      ]
    });
  }
  if (C.simultaneous) {
    C.simultaneous.examples.push({
      q: 'Solve y = x² and y = 2x + 3.',
      steps: [
        'Set equal: x² = 2x + 3.',
        'Rearrange: x² − 2x − 3 = 0.',
        'Factorise: (x − 3)(x + 1) = 0 → x = 3 or x = −1.',
        'Corresponding y: 9 and 1.'
      ]
    });
  }
})();
