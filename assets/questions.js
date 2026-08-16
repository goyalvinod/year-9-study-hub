/* ==========================================================
   Question generators for every maths topic.
   Each generator returns an object with:
     topic, prompt (HTML), hint, answer, [accepts], [numeric],
     [tol], solution: [strings].
   Marking uses Core.check() which handles all the notation variants.
   Exposed on window.Questions.
   ========================================================== */
(function () {
  'use strict';
  const { rand, pick, pickN, gcd, fmtFrac } = window.Core;

  const G = {}; // topic key -> array of generator fns

  // ============================================================
  // NUMBER
  // ============================================================

  // ---- indices ----
  G.indices = [
    function powerOfProduct() {
      const c = pick([2, 3, 4, 5, 6]);
      const a = rand(2, 4);
      const b = rand(2, 4);
      const v = pick(['n', 'p', 'x', 'y', 'a']);
      const ans = `${c**b}${v}^${a*b}`;
      return {
        topic: 'indices',
        prompt: `Simplify <strong>(${c}${v}<sup>${a}</sup>)<sup>${b}</sup></strong>`,
        hint: `Type as e.g. <code>125n^6</code>`,
        answer: ans,
        accepts: [`${c**b}*${v}^${a*b}`],
        solution: [
          `Apply the outer power to <em>each</em> factor inside the bracket.`,
          `(${c}${v}<sup>${a}</sup>)<sup>${b}</sup> = ${c}<sup>${b}</sup> × ${v}<sup>${a}×${b}</sup>`,
          `= ${c**b}${v}<sup>${a*b}</sup>`,
          `<em>Common slip: forgetting to raise the coefficient too — ${c}<sup>${b}</sup>, not just ${c}.</em>`
        ]
      };
    },
    function multiplyIndices() {
      const c1 = rand(2, 6), c2 = rand(2, 6);
      const a = rand(2, 5), b = rand(2, 5);
      const v = pick(['x', 'y', 'a', 'm']);
      return {
        topic: 'indices',
        prompt: `Simplify <strong>${c1}${v}<sup>${a}</sup> × ${c2}${v}<sup>${b}</sup></strong>`,
        hint: `Multiply coefficients, add the exponents.`,
        answer: `${c1*c2}${v}^${a+b}`,
        solution: [
          `Multiply numbers: ${c1} × ${c2} = ${c1*c2}.`,
          `Add powers of ${v}: <sup>${a}</sup> × <sup>${b}</sup> → ${v}<sup>${a+b}</sup>.`,
          `Result: ${c1*c2}${v}<sup>${a+b}</sup>.`
        ]
      };
    },
    function divideIndices() {
      const c2 = rand(2, 5);
      const c1 = c2 * rand(2, 6);
      const b = rand(1, 3);
      const a = b + rand(2, 4);
      const v = pick(['x', 'y', 'a', 'p']);
      const cR = c1 / c2;
      const eR = a - b;
      return {
        topic: 'indices',
        prompt: `Simplify <strong>(${c1}${v}<sup>${a}</sup>) ÷ (${c2}${v}<sup>${b}</sup>)</strong>`,
        hint: `Divide coefficients, subtract the exponents.`,
        answer: eR === 1 ? `${cR}${v}` : `${cR}${v}^${eR}`,
        solution: [
          `Divide coefficients: ${c1} ÷ ${c2} = ${cR}.`,
          `Subtract powers of ${v}: ${a} − ${b} = ${eR}.`,
          `Result: ${cR}${v}<sup>${eR}</sup>.`
        ]
      };
    },
    function fractionalIndex() {
      const base = pick([4, 8, 9, 16, 25, 27, 32, 64]);
      const map = {
        4:  [['1/2', 2], ['-1/2', '1/2']],
        8:  [['1/3', 2], ['2/3', 4]],
        9:  [['1/2', 3], ['-1/2', '1/3']],
        16: [['1/2', 4], ['1/4', 2], ['-1/2', '1/4']],
        25: [['1/2', 5], ['-1/2', '1/5']],
        27: [['1/3', 3], ['2/3', 9]],
        32: [['1/5', 2], ['2/5', 4]],
        64: [['1/2', 8], ['1/3', 4], ['1/6', 2], ['2/3', 16]]
      };
      const [exp, val] = pick(map[base]);
      const numeric = typeof val === 'string' && val.includes('/') ?
        (() => { const [n, d] = val.split('/').map(Number); return n / d; })() :
        Number(val);
      return {
        topic: 'indices',
        prompt: `Work out <strong>${base}<sup>${exp}</sup></strong>`,
        hint: `Negative power = reciprocal. Fractional power = root. (e.g. <code>1/3</code> means cube root.)`,
        answer: String(val),
        numeric,
        solution: [
          `${base}<sup>${exp}</sup> means: ` + (String(exp).includes('/') ? `the ${exp.split('/')[1]}-th root of ${base}` : `${base} multiplied by itself ${exp} times`) +
            (String(exp).startsWith('-') ? `, then take the reciprocal.` : `.`),
          `Answer: ${val}.`
        ]
      };
    }
  ];

  // ---- surds ----
  G.surds = [
    function simplifySingle() {
      const m = pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15]);
      const k = rand(2, 6);
      const n = k * k * m;
      return {
        topic: 'surds',
        prompt: `Write <strong>√${n}</strong> in the form a√b where b is as small as possible.`,
        hint: `Type as e.g. <code>3sqrt(2)</code> or <code>3√2</code>.`,
        answer: `${k}sqrt(${m})`,
        accepts: [`${k}*sqrt(${m})`, `${k}root${m}`, `${k}√${m}`],
        solution: [
          `Find the largest square factor of ${n}: ${n} = ${k*k} × ${m}.`,
          `√${n} = √${k*k} × √${m} = ${k}√${m}.`
        ]
      };
    },
    function combineSurds() {
      let m, ks, ns, sign, sumK;
      for (let tries = 0; tries < 30; tries++) {
        m = pick([2, 3, 5, 7]);
        ks = pickN([2, 3, 4, 5, 6, 7, 8], 3);
        ns = ks.map(k => k * k * m);
        sign = pick([-1, 1]);
        sumK = ks[0] + ks[1] + sign * ks[2];
        if (sumK > 0) break;
      }
      if (sumK <= 0) sumK = ks[0] + ks[1] + ks[2];
      return {
        topic: 'surds',
        prompt: `<strong>√${ns[0]} + √${ns[1]} ${sign === 1 ? '+' : '−'} √${ns[2]}</strong> can be written as n√${m}. Find n.`,
        hint: `Simplify each surd first, then collect.`,
        answer: String(sumK),
        numeric: sumK,
        solution: [
          `Simplify each: √${ns[0]} = ${ks[0]}√${m}, √${ns[1]} = ${ks[1]}√${m}, √${ns[2]} = ${ks[2]}√${m}.`,
          `${ks[0]}√${m} + ${ks[1]}√${m} ${sign === 1 ? '+' : '−'} ${ks[2]}√${m} = (${ks[0]} + ${ks[1]} ${sign === 1 ? '+' : '−'} ${ks[2]})√${m}.`,
          `n = ${sumK}.`
        ]
      };
    },
    function rationalise() {
      const a = rand(2, 9);
      const b = pick([2, 3, 5, 6, 7]);
      // Numerator a / √b -> a√b / b
      const num = a * 1; // coefficient of √b in numerator
      // Simplify a/b if gcd
      const g = gcd(a, b);
      const nc = a / g;
      const dc = b / g;
      const ans = dc === 1 ? `${nc}sqrt(${b})` : `${nc}sqrt(${b})/${dc}`;
      return {
        topic: 'surds',
        prompt: `Rationalise the denominator: <strong>${a}/√${b}</strong>. Give the answer in simplest form (type as e.g. <code>3sqrt(2)</code> or <code>3sqrt(2)/2</code>).`,
        hint: `Multiply top and bottom by √${b}.`,
        answer: ans,
        accepts: [`${nc}*sqrt(${b})${dc === 1 ? '' : '/' + dc}`, `${nc}√${b}${dc === 1 ? '' : '/' + dc}`],
        solution: [
          `Multiply top and bottom by √${b}: ${a}/√${b} × √${b}/√${b} = ${a}√${b}/${b}.`,
          `Simplify ${a}/${b}: ${g > 1 ? `divide by ${g} → ${nc}${dc === 1 ? '' : '/' + dc}` : `already in lowest terms`}.`,
          `Answer: <strong>${nc}√${b}${dc === 1 ? '' : '/' + dc}</strong>.`
        ]
      };
    }
  ];

  // ---- percentages ----
  G.percentages = [
    function reverseSale() {
      const original = rand(80, 300);
      const off = pick([10, 12, 15, 20, 25, 30]);
      const sale = +(original * (1 - off/100)).toFixed(2);
      return {
        topic: 'percentages',
        prompt: `A coat is on sale at <strong>£${sale.toFixed(2)}</strong> after a <strong>${off}% discount</strong>. What was the original price (in £)?`,
        hint: `Sale price = original × (100 − ${off})%. So original = sale ÷ ${(1-off/100).toFixed(2)}.`,
        answer: String(original),
        numeric: original,
        tol: 0.02,
        solution: [
          `${off}% off means sale price = original × ${(1-off/100).toFixed(2)}.`,
          `Original = ${sale.toFixed(2)} ÷ ${(1-off/100).toFixed(2)} = £${original}.`
        ]
      };
    },
    function successiveChange() {
      const start = rand(50, 200);
      const a = pick([5, 10, 15, 20]);
      const b = pick([10, 15, 20, 25]);
      const m1 = 1 + a/100;
      const m2 = 1 - b/100;
      const final = +(start * m1 * m2).toFixed(2);
      return {
        topic: 'percentages',
        prompt: `A price of <strong>£${start}</strong> is increased by <strong>${a}%</strong>, then decreased by <strong>${b}%</strong>. What is the final price (in £, to 2dp)?`,
        hint: `Multiply by ${m1.toFixed(2)} then by ${m2.toFixed(2)}.`,
        answer: final.toFixed(2),
        numeric: final,
        tol: 0.02,
        solution: [
          `After +${a}%: ${start} × ${m1.toFixed(2)} = ${(start*m1).toFixed(2)}.`,
          `After −${b}%: ${(start*m1).toFixed(2)} × ${m2.toFixed(2)} = £${final.toFixed(2)}.`,
          `<em>Note: a +${a}% then −${b}% is NOT the same as a single ${a-b}% change.</em>`
        ]
      };
    },
    function compoundInterest() {
      const p = rand(1000, 5000);
      const r = pick([2, 2.5, 3, 4, 5]);
      const t = rand(2, 5);
      const final = +(p * Math.pow(1 + r/100, t)).toFixed(2);
      return {
        topic: 'percentages',
        prompt: `£${p} is invested at <strong>${r}% compound interest per year</strong>. Find the total value after <strong>${t} years</strong> (to 2dp).`,
        hint: `Multiply by ${(1 + r/100).toFixed(3)} for each year — that's raising to the power of ${t}.`,
        answer: final.toFixed(2),
        numeric: final,
        tol: 0.02,
        solution: [
          `Multiplier per year: 1 + ${r}/100 = ${(1 + r/100).toFixed(3)}.`,
          `After ${t} years: ${p} × ${(1 + r/100).toFixed(3)}<sup>${t}</sup> = £${final.toFixed(2)}.`
        ]
      };
    },
    function meanVsOther() {
      const dropPct = pick([20, 25, 30, 40]);
      const dropFrac = (100 - dropPct) / 100;
      const otherFrac = 2 * dropFrac - 1;
      if (otherFrac <= 0) return G.percentages[0]();
      const ratio = (dropFrac - otherFrac) / otherFrac;
      const ans = +(ratio * 100).toFixed(2);
      return {
        topic: 'percentages',
        prompt: `The mean of two positive numbers is <strong>${dropPct}% less</strong> than one of the numbers. By what percentage is the mean <strong>greater</strong> than the other number?`,
        hint: `Let the bigger number be X. mean = ${dropFrac}X. other = 2·mean − X.`,
        answer: ans.toFixed(2),
        numeric: ans,
        tol: 0.5,
        solution: [
          `Let bigger number be X. mean = ${dropFrac}X.`,
          `other = 2·mean − X = ${2*dropFrac}X − X = ${otherFrac}X.`,
          `mean − other = ${dropFrac}X − ${otherFrac}X = ${(dropFrac - otherFrac).toFixed(2)}X.`,
          `As % of other: ${(dropFrac - otherFrac).toFixed(2)} ÷ ${otherFrac} × 100 = <strong>${ans}%</strong>.`
        ]
      };
    }
  ];

  // ---- standard form (new) ----
  G.standardForm = [
    function toStandard() {
      const mant = +(rand(10, 99) / 10).toFixed(1);
      const scale = pick([100, 1000, 10000, 100000, 1000000]);
      const val = mant * scale;
      const exp = Math.log10(scale) + Math.floor(Math.log10(mant));
      const a = +(val / Math.pow(10, exp)).toFixed(2);
      return {
        topic: 'standardForm',
        prompt: `Write <strong>${val}</strong> in standard form.`,
        hint: `a × 10<sup>n</sup> with 1 ≤ a &lt; 10. Type e.g. <code>3.7*10^5</code>.`,
        answer: `${a}*10^${exp}`,
        accepts: [`${a}×10^${exp}`, `${a}x10^${exp}`, `${a}e${exp}`],
        solution: [
          `Move the decimal to leave a number between 1 and 10: ${a}.`,
          `Count the moves: ${exp} places → × 10<sup>${exp}</sup>.`,
          `Answer: ${a} × 10<sup>${exp}</sup>.`
        ]
      };
    },
    function multiplyStandard() {
      const a1 = +(rand(15, 40) / 10).toFixed(1);
      const a2 = +(rand(20, 40) / 10).toFixed(1);
      const e1 = pick([3, 4, 5, 6]);
      const e2 = pick([-2, -1, 2, 3]);
      let a = +(a1 * a2).toFixed(2);
      let e = e1 + e2;
      // Renormalise
      while (a >= 10) { a = +(a / 10).toFixed(3); e += 1; }
      while (a < 1)   { a = +(a * 10).toFixed(3); e -= 1; }
      return {
        topic: 'standardForm',
        prompt: `Work out <strong>(${a1} × 10<sup>${e1}</sup>) × (${a2} × 10<sup>${e2}</sup>)</strong>. Give the answer in standard form.`,
        hint: `Multiply the fronts, add the powers, renormalise.`,
        answer: `${a}*10^${e}`,
        accepts: [`${a}×10^${e}`, `${a}e${e}`],
        solution: [
          `Multiply the fronts: ${a1} × ${a2} = ${+(a1*a2).toFixed(2)}.`,
          `Add the powers: 10<sup>${e1}</sup> × 10<sup>${e2}</sup> = 10<sup>${e1+e2}</sup>.`,
          `Combine and renormalise: ${a} × 10<sup>${e}</sup>.`
        ]
      };
    }
  ];

  // ============================================================
  // ALGEBRA
  // ============================================================

  // ---- sequences ----
  G.sequences = [
    function linearNthSubstitute() {
      const a = rand(2, 9);
      const b = rand(-10, 10);
      const n = rand(2, 10);
      const v = a*n + b;
      return {
        topic: 'sequences',
        prompt: `The nth term of a sequence is <strong>${a}n${b >= 0 ? '+' : ''}${b}</strong>. Find the <strong>${n}<sup>th</sup></strong> term.`,
        hint: `Substitute n = ${n}.`,
        answer: String(v),
        numeric: v,
        solution: [`${a}(${n})${b >= 0 ? '+' : ''}${b} = ${a*n}${b >= 0 ? '+' : ''}${b} = ${v}.`]
      };
    },
    function quadraticNthSubstitute() {
      const a = rand(1, 4);
      const b = rand(-5, 5);
      const c = rand(-5, 10);
      const n = rand(1, 6);
      const v = a*n*n + b*n + c;
      const sign1 = b >= 0 ? '+' : '';
      const sign2 = c >= 0 ? '+' : '';
      return {
        topic: 'sequences',
        prompt: `The nth term of a sequence is <strong>${a}n<sup>2</sup>${sign1}${b}n${sign2}${c}</strong>. Find the <strong>${n}<sup>th</sup></strong> term.`,
        hint: `Square first, then multiply, then add.`,
        answer: String(v),
        numeric: v,
        solution: [
          `n = ${n}, so n<sup>2</sup> = ${n*n}.`,
          `${a}(${n*n})${sign1}${b}(${n})${sign2}${c} = ${a*n*n}${sign1}${b*n}${sign2}${c} = ${v}.`
        ]
      };
    },
    function findLinearNthTerm() {
      const a = rand(2, 9);
      const start = rand(-5, 10);
      const seq = [0,1,2,3].map(i => start + a*i);
      const b = start - a;
      return {
        topic: 'sequences',
        prompt: `Find the nth term of the sequence: <strong>${seq.join(', ')}, …</strong>`,
        hint: `Type as e.g. <code>3n+2</code>.`,
        answer: `${a}n${b>=0?'+':''}${b}`,
        accepts: [b === 0 ? `${a}n` : null].filter(Boolean),
        solution: [
          `Common difference: ${a}, so nth term starts with <strong>${a}n</strong>.`,
          `When n = 1, ${a}n = ${a}. We need ${seq[0]}, so add ${b}.`,
          `nth term = ${a}n${b>=0?'+':''}${b}.`
        ]
      };
    },
    function bracketNthSubstitute() {
      const a = rand(2, 6);
      const k = rand(1, 5);
      const n = rand(1, 6);
      const v = a*(n - k);
      return {
        topic: 'sequences',
        prompt: `The nth term is <strong>${a}(n − ${k})</strong>. Find the ${n === 1 ? 'first term' : `${n}<sup>th</sup> term`}.`,
        hint: `Work out the bracket first, <em>then</em> multiply by ${a}. (Common slip: doing ${a}n − ${k} instead.)`,
        answer: String(v),
        numeric: v,
        solution: [
          `n = ${n}, so n − ${k} = ${n-k}.`,
          `${a} × (${n-k}) = ${v}.`,
          `<em>The whole bracket is multiplied by ${a}, not just n.</em>`
        ]
      };
    }
  ];

  // ---- equations ----
  G.equations = [
    function linearWithBrackets() {
      const a = rand(2, 6);
      const x = rand(-4, 8);
      const k = rand(1, 7);
      const b = rand(-5, 8);
      const lhsVal = a*(x - k) + b;
      const c = rand(2, 5);
      const cc = c === a ? c + 1 : c;
      const rhsConst = lhsVal - cc*x;
      return {
        topic: 'equations',
        prompt: `Solve for x: <strong>${a}(x − ${k}) + ${b} = ${cc}x ${rhsConst >= 0 ? '+' : '−'} ${Math.abs(rhsConst)}</strong>`,
        hint: `Expand brackets, get all x's on one side.`,
        answer: String(x),
        numeric: x,
        solution: [
          `Expand: ${a}x − ${a*k} + ${b} = ${cc}x ${rhsConst >= 0 ? '+' : '−'} ${Math.abs(rhsConst)}.`,
          `Simplify LHS: ${a}x ${(b - a*k) >= 0 ? '+' : '−'} ${Math.abs(b - a*k)} = ${cc}x ${rhsConst >= 0 ? '+' : '−'} ${Math.abs(rhsConst)}.`,
          `Subtract ${cc}x from both sides: ${a-cc}x ${(b - a*k) >= 0 ? '+' : '−'} ${Math.abs(b - a*k)} = ${rhsConst >= 0 ? '' : '−'}${Math.abs(rhsConst)}.`,
          `Solve: x = ${x}.`
        ]
      };
    },
    function rationalEqn() {
      let a = 2, b = 0, c = 1, d = 3, x = 1;
      for (let tries = 0; tries < 50; tries++) {
        a = rand(2, 6);
        d = rand(2, 5);
        c = rand(-5, 6);
        x = rand(-4, 6);
        if (a === d) continue;
        if (x + c === 0) continue;
        b = (d - a) * x + d * c;
        break;
      }
      return {
        topic: 'equations',
        prompt: `Solve for x: <strong>(${a}x ${b>=0?'+':'−'} ${Math.abs(b)}) / (x ${c>=0?'+':'−'} ${Math.abs(c)}) = ${d}</strong>`,
        hint: `Multiply both sides by (x ${c>=0?'+':'−'} ${Math.abs(c)}).`,
        answer: String(x),
        numeric: x,
        solution: [
          `Multiply both sides by (x ${c>=0?'+':'−'} ${Math.abs(c)}): &nbsp;${a}x ${b>=0?'+':'−'} ${Math.abs(b)} = ${d}(x ${c>=0?'+':'−'} ${Math.abs(c)}).`,
          `Expand RHS: ${a}x ${b>=0?'+':'−'} ${Math.abs(b)} = ${d}x ${d*c>=0?'+':'−'} ${Math.abs(d*c)}.`,
          `Get x's together: ${a-d}x = ${d*c - b}.`,
          `x = ${d*c - b} / ${a - d} = <strong>${x}</strong>.`
        ]
      };
    },
    function simpleQuadratic() {
      let r1, r2;
      do { r1 = rand(-6, 6); r2 = rand(-6, 6); } while (r1 === r2);
      const b = -(r1 + r2);
      const c = r1 * r2;
      const sorted = [r1, r2].sort((a,b)=>a-b);
      return {
        topic: 'equations',
        prompt: `Solve <strong>x<sup>2</sup> ${b>=0?'+':'−'} ${Math.abs(b)}x ${c>=0?'+':'−'} ${Math.abs(c)} = 0</strong>. (Type both roots, e.g. <code>-2,5</code>)`,
        hint: `Factorise: find two numbers that multiply to ${c} and add to ${b}.`,
        answer: `${sorted[0]},${sorted[1]}`,
        accepts: [`${sorted[1]},${sorted[0]}`, `x=${sorted[0]},x=${sorted[1]}`, `x=${sorted[1]},x=${sorted[0]}`],
        solution: [
          `Find two numbers multiplying to ${c}, adding to ${b}: ${-r1} and ${-r2} (so factors are (x ${-r1>=0?'+':'−'} ${Math.abs(-r1)})(x ${-r2>=0?'+':'−'} ${Math.abs(-r2)})).`,
          `Set each to 0: x = ${r1} or x = ${r2}.`
        ]
      };
    }
  ];

  // ---- expand / factorise ----
  G.expand = [
    function expandTwoBrackets() {
      let a, b;
      do { a = rand(-8, 8); b = rand(-8, 8); } while (a === 0 || b === 0);
      const sum = a + b, prod = a * b;
      const xTerm = sum === 0 ? '' : sum === 1 ? '+x' : sum === -1 ? '-x' : (sum > 0 ? '+' + sum + 'x' : sum + 'x');
      const cTerm = prod === 0 ? '' : (prod > 0 ? '+' + prod : String(prod));
      const ans = 'x^2' + xTerm + cTerm;
      return {
        topic: 'expand',
        prompt: `Expand and simplify: <strong>(x ${a>=0?'+':'−'} ${Math.abs(a)})(x ${b>=0?'+':'−'} ${Math.abs(b)})</strong>`,
        hint: `Type as e.g. <code>x^2+5x+6</code>.`,
        answer: ans,
        solution: [
          `FOIL: x·x + x·(${b}) + (${a})·x + (${a})·(${b}).`,
          `= x² ${a>=0?'+':'−'} ${Math.abs(a)}x ${b>=0?'+':'−'} ${Math.abs(b)}x ${prod>=0?'+':'−'} ${Math.abs(prod)}.`,
          `= x² ${sum>=0?'+':'−'} ${Math.abs(sum)}x ${prod>=0?'+':'−'} ${Math.abs(prod)}.`
        ]
      };
    },
    function singleBracketExpand() {
      const c = rand(2, 7);
      let a, b;
      do { a = rand(-6, 6); b = rand(-9, 9); } while (a === 0 || b === 0);
      const v = pick(['x','y','n']);
      const ca = c * a, cb = c * b;
      const x2Coef = ca === 1 ? '' : ca === -1 ? '-' : String(ca);
      const xTerm = cb === 0 ? '' : (cb === 1 ? `+${v}` : cb === -1 ? `-${v}` : (cb > 0 ? '+' + cb + v : cb + v));
      const ans = `${x2Coef}${v}^2${xTerm}`;
      return {
        topic: 'expand',
        prompt: `Expand: <strong>${c}${v}(${a===1?'':a===-1?'−':a}${v} ${b>=0?'+':'−'} ${Math.abs(b)})</strong>`,
        hint: `Multiply ${c}${v} by each term inside.`,
        answer: ans,
        solution: [
          `${c}${v} × ${a===1?'':a===-1?'−':a}${v} = ${ca}${v}².`,
          `${c}${v} × (${b>=0?'+':'−'}${Math.abs(b)}) = ${cb>=0?'+':'−'}${Math.abs(cb)}${v}.`,
          `Result: ${ca}${v}² ${cb>=0?'+':'−'} ${Math.abs(cb)}${v}.`
        ]
      };
    },
    function factoriseCommon() {
      const c = rand(2, 9);
      const a = rand(2, 6);
      const b = rand(1, 9);
      return {
        topic: 'expand',
        prompt: `Fully factorise: <strong>${c*a}n − ${c*b}</strong>`,
        hint: `Pull out the highest common factor.`,
        answer: `${c}(${a}n-${b})`,
        accepts: [`${c}(${a}n−${b})`],
        solution: [
          `HCF of ${c*a} and ${c*b} is ${c}.`,
          `${c*a}n − ${c*b} = ${c}(${a}n − ${b}).`
        ]
      };
    },
    function factoriseQuadratic() {
      let r1, r2;
      do { r1 = rand(-8, 8); r2 = rand(-8, 8); } while (r1 === r2 || r1 === 0 || r2 === 0);
      const b = -(r1 + r2), c = r1 * r2;
      const s1 = Math.min(-r1, -r2), s2 = Math.max(-r1, -r2);
      return {
        topic: 'expand',
        prompt: `Factorise: <strong>x<sup>2</sup> ${b>=0?'+':'−'} ${Math.abs(b)}x ${c>=0?'+':'−'} ${Math.abs(c)}</strong>`,
        hint: `Type as e.g. <code>(x-2)(x+5)</code>.`,
        answer: `(x${s1>=0?'+':'−'}${Math.abs(s1)})(x${s2>=0?'+':'−'}${Math.abs(s2)})`,
        accepts: [`(x${s2>=0?'+':'−'}${Math.abs(s2)})(x${s1>=0?'+':'−'}${Math.abs(s1)})`],
        solution: [
          `Find two numbers that multiply to ${c} and add to ${b}: ${-r1} and ${-r2}.`,
          `Factors: (x ${s1>=0?'+':'−'} ${Math.abs(s1)})(x ${s2>=0?'+':'−'} ${Math.abs(s2)}).`
        ]
      };
    }
  ];

  // ---- inequalities (new) ----
  G.inequalities = [
    function linearInequality() {
      const a = rand(2, 6);
      const b = rand(-8, 8);
      const c = rand(-10, 10);
      const op = pick(['<', '≤', '>', '≥']);
      const opInv = { '<': '>', '≤': '≥', '>': '<', '≥': '≤' }[op];
      // ax + b OP c  ->  x OP' (c-b)/a  if a>0 same op, else flip. a>0 so keep.
      const rhs = (c - b) / a;
      const rhsInt = Math.round(rhs);
      // Ensure integer answer
      const bAdj = c - a * rhsInt;
      return {
        topic: 'inequalities',
        prompt: `Solve for x: <strong>${a}x ${bAdj>=0?'+':'−'} ${Math.abs(bAdj)} ${op} ${c}</strong>`,
        hint: `Rearrange as if it were an equation. Only <em>flip</em> the inequality if you multiply/divide by a negative.`,
        answer: `x${op}${rhsInt}`,
        accepts: [`x ${op} ${rhsInt}`, `${op}${rhsInt}`, String(rhsInt)],
        solution: [
          `Subtract ${bAdj} from both sides: ${a}x ${op} ${c - bAdj}.`,
          `Divide by ${a}: x ${op} ${rhsInt}.`
        ]
      };
    },
    function negativeCoeff() {
      const a = rand(2, 5);
      const b = rand(-6, 6);
      const rhs = rand(-6, 6);
      // -ax + b > c  =>  -ax > c - b => x < (b-c)/a
      const c = a * (-rhs) + b;
      return {
        topic: 'inequalities',
        prompt: `Solve for x: <strong>${b} − ${a}x > ${c}</strong>`,
        hint: `Careful — when you divide by a negative number, flip the inequality.`,
        answer: `x<${rhs}`,
        accepts: [`x < ${rhs}`, `<${rhs}`, String(rhs)],
        solution: [
          `Subtract ${b}: −${a}x > ${c - b}.`,
          `Divide by −${a} (flip!): x &lt; ${(b - c) / a}.`,
          `Answer: x &lt; ${rhs}.`
        ]
      };
    }
  ];

  // ---- simultaneous (new) ----
  G.simultaneous = [
    function elimination() {
      let x, y, a, b, c, d;
      for (let t = 0; t < 30; t++) {
        x = rand(-5, 5); y = rand(-5, 5);
        a = rand(1, 5); b = rand(1, 5);
        c = rand(1, 5); d = rand(1, 5);
        if (a * d - b * c !== 0) break;
      }
      const e = a * x + b * y;
      const f = c * x + d * y;
      return {
        topic: 'simultaneous',
        prompt: `Solve: <strong>${a}x + ${b}y = ${e}</strong> &nbsp;and&nbsp; <strong>${c}x + ${d}y = ${f}</strong>. Give as <code>x,y</code>.`,
        hint: `Multiply one (or both) equations so the coefficient of one variable matches, then subtract.`,
        answer: `${x},${y}`,
        accepts: [`x=${x},y=${y}`, `(${x},${y})`],
        solution: [
          `Multiply the first equation by ${c} and the second by ${a} to match x-coefficients: ${a*c}x + ${b*c}y = ${e*c}; ${a*c}x + ${a*d}y = ${a*f}.`,
          `Subtract: ${b*c - a*d}y = ${e*c - a*f} → y = ${y}.`,
          `Back-substitute into the first equation: ${a}x + ${b}(${y}) = ${e} → x = ${x}.`
        ]
      };
    }
  ];

  // ---- substitution ----
  G.substitution = [
    function fancySubstitute() {
      const xRoot = rand(2, 5);
      const c = rand(0, 25);
      const x = xRoot * xRoot - c;
      const a = rand(5, 25);
      const b = rand(2, 6);
      const y = (a + b * x * x) / xRoot;
      return {
        topic: 'substitution',
        prompt: `Given <strong>y = (${a} + ${b}x²) / √(x + ${c})</strong>, find y when x = ${x}.`,
        hint: `Work out top and bottom separately, then divide.`,
        answer: String(y),
        numeric: y,
        tol: 0.02,
        solution: [
          `Top: ${a} + ${b}(${x})² = ${a} + ${b*x*x} = ${a + b*x*x}.`,
          `Bottom: √(${x} + ${c}) = √${x+c} = ${xRoot}.`,
          `y = ${a + b*x*x} / ${xRoot} = <strong>${y}</strong>.`
        ]
      };
    }
  ];

  // ============================================================
  // GEOMETRY
  // ============================================================

  // ---- pythagoras ----
  G.pythagoras = [
    function findHyp() {
      const a = rand(3, 12), b = rand(3, 12);
      const c = +Math.sqrt(a*a + b*b).toFixed(2);
      return {
        topic: 'pythagoras',
        prompt: `A right-angled triangle has the two shorter sides of length <strong>${a} cm</strong> and <strong>${b} cm</strong>. Find the length of the hypotenuse to 2 dp.`,
        hint: `c² = a² + b².`,
        answer: c.toFixed(2),
        numeric: c,
        tol: 0.02,
        solution: [
          `c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a + b*b}.`,
          `c = √${a*a + b*b} ≈ <strong>${c} cm</strong>.`
        ]
      };
    },
    function findLeg() {
      const c = pick([13, 17, 25, 29, 10, 15, 20]);
      const a = rand(3, c-3);
      const bSq = c*c - a*a;
      const b = +Math.sqrt(bSq).toFixed(2);
      return {
        topic: 'pythagoras',
        prompt: `A right-angled triangle has the hypotenuse <strong>${c} cm</strong> and one shorter side <strong>${a} cm</strong>. Find the other shorter side to 2 dp.`,
        hint: `Rearrange: shorter² = hyp² − other².`,
        answer: b.toFixed(2),
        numeric: b,
        tol: 0.02,
        solution: [
          `b² = ${c}² − ${a}² = ${c*c} − ${a*a} = ${bSq}.`,
          `b = √${bSq} ≈ <strong>${b} cm</strong>.`
        ]
      };
    }
  ];

  // ---- angles ----
  G.angles = [
    function exteriorAngle() {
      const n = pick([5, 6, 8, 9, 10, 12, 15, 18]);
      const ext = 360 / n;
      return {
        topic: 'angles',
        prompt: `Work out the size of each <strong>exterior angle</strong> of a regular polygon with <strong>${n} sides</strong>. (Answer in degrees.)`,
        hint: `Exterior angles always add up to 360°.`,
        answer: String(ext),
        numeric: ext,
        tol: 0.1,
        solution: [`360 ÷ ${n} = <strong>${ext}°</strong>.`]
      };
    },
    function interiorAngle() {
      const n = pick([5, 6, 8, 9, 10, 12]);
      const sum = (n - 2) * 180;
      const each = sum / n;
      return {
        topic: 'angles',
        prompt: `Work out the size of each <strong>interior angle</strong> of a regular polygon with <strong>${n} sides</strong>. (Answer in degrees.)`,
        hint: `Sum of interior = (n−2) × 180.`,
        answer: String(each),
        numeric: each,
        tol: 0.1,
        solution: [
          `Sum of interior angles: (${n} − 2) × 180 = ${sum}°.`,
          `Each angle: ${sum} ÷ ${n} = <strong>${each}°</strong>.`
        ]
      };
    },
    function findSides() {
      const n = pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24]);
      const ext = 360 / n;
      return {
        topic: 'angles',
        prompt: `A regular polygon has each <strong>exterior angle equal to ${ext}°</strong>. How many sides does it have?`,
        hint: `Number of sides = 360 ÷ exterior.`,
        answer: String(n),
        numeric: n,
        solution: [`n = 360 ÷ ${ext} = <strong>${n}</strong>.`]
      };
    }
  ];

  // ---- trig (new) ----
  G.trig = [
    function findOppUsingSin() {
      const angle = pick([30, 45, 60, 25, 35, 40, 50, 55, 65]);
      const hyp = rand(5, 20);
      const opp = +(hyp * Math.sin(angle * Math.PI / 180)).toFixed(2);
      return {
        topic: 'trig',
        prompt: `In a right-angled triangle the hypotenuse is <strong>${hyp} cm</strong> and one angle is <strong>${angle}°</strong>. Find the side opposite that angle (cm, to 2dp).`,
        hint: `sin(θ) = opposite / hypotenuse.`,
        answer: opp.toFixed(2),
        numeric: opp,
        tol: 0.05,
        solution: [
          `Use sin: sin(${angle}°) = opp / ${hyp}.`,
          `opp = ${hyp} × sin(${angle}°) = ${hyp} × ${Math.sin(angle*Math.PI/180).toFixed(4)} ≈ <strong>${opp} cm</strong>.`
        ]
      };
    },
    function findAdjUsingCos() {
      const angle = pick([25, 30, 35, 40, 45, 50, 55, 60]);
      const hyp = rand(6, 20);
      const adj = +(hyp * Math.cos(angle * Math.PI / 180)).toFixed(2);
      return {
        topic: 'trig',
        prompt: `In a right-angled triangle the hypotenuse is <strong>${hyp} cm</strong> and one angle is <strong>${angle}°</strong>. Find the side adjacent to that angle (cm, to 2dp).`,
        hint: `cos(θ) = adjacent / hypotenuse.`,
        answer: adj.toFixed(2),
        numeric: adj,
        tol: 0.05,
        solution: [
          `Use cos: cos(${angle}°) = adj / ${hyp}.`,
          `adj = ${hyp} × cos(${angle}°) ≈ <strong>${adj} cm</strong>.`
        ]
      };
    },
    function findAngleUsingTan() {
      const opp = rand(3, 12);
      const adj = rand(3, 12);
      const angle = +(Math.atan(opp / adj) * 180 / Math.PI).toFixed(2);
      return {
        topic: 'trig',
        prompt: `A right-angled triangle has the opposite side <strong>${opp} cm</strong> and the adjacent side <strong>${adj} cm</strong>. Find the angle (in degrees, to 2dp).`,
        hint: `tan(θ) = opp / adj, then arctan.`,
        answer: angle.toFixed(2),
        numeric: angle,
        tol: 0.05,
        solution: [
          `tan(θ) = ${opp}/${adj} = ${(opp/adj).toFixed(4)}.`,
          `θ = arctan(${(opp/adj).toFixed(4)}) ≈ <strong>${angle}°</strong>.`
        ]
      };
    }
  ];

  // ---- coordinate geometry (new) ----
  G.coordinateGeom = [
    function gradient() {
      const x1 = rand(-6, 6), y1 = rand(-6, 6);
      let x2, y2;
      do { x2 = rand(-6, 6); y2 = rand(-6, 6); } while (x2 === x1);
      const g = (y2 - y1) / (x2 - x1);
      const gr = Math.round(g * 100) / 100;
      return {
        topic: 'coordinateGeom',
        prompt: `Find the gradient of the line joining <strong>(${x1}, ${y1})</strong> and <strong>(${x2}, ${y2})</strong>.`,
        hint: `Gradient = (y₂ − y₁) / (x₂ − x₁).`,
        answer: String(gr),
        numeric: gr,
        tol: 0.01,
        solution: [
          `Δy = ${y2} − ${y1} = ${y2 - y1}.`,
          `Δx = ${x2} − ${x1} = ${x2 - x1}.`,
          `Gradient = ${y2 - y1} / ${x2 - x1} = <strong>${gr}</strong>.`
        ]
      };
    },
    function midpoint() {
      const x1 = rand(-8, 8), y1 = rand(-8, 8);
      const x2 = rand(-8, 8), y2 = rand(-8, 8);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      return {
        topic: 'coordinateGeom',
        prompt: `Find the midpoint of the segment from <strong>(${x1}, ${y1})</strong> to <strong>(${x2}, ${y2})</strong>. Give as <code>x,y</code>.`,
        hint: `Average the x's, average the y's.`,
        answer: `${mx},${my}`,
        accepts: [`(${mx},${my})`, `(${mx}, ${my})`],
        solution: [
          `x-mid = (${x1} + ${x2}) / 2 = ${mx}.`,
          `y-mid = (${y1} + ${y2}) / 2 = ${my}.`,
          `Midpoint: (${mx}, ${my}).`
        ]
      };
    },
    function distance() {
      const x1 = rand(-6, 6), y1 = rand(-6, 6);
      const x2 = rand(-6, 6), y2 = rand(-6, 6);
      const d = +Math.sqrt((x2-x1)**2 + (y2-y1)**2).toFixed(2);
      return {
        topic: 'coordinateGeom',
        prompt: `Find the distance between <strong>(${x1}, ${y1})</strong> and <strong>(${x2}, ${y2})</strong> (to 2dp).`,
        hint: `Pythagoras: √((Δx)² + (Δy)²).`,
        answer: d.toFixed(2),
        numeric: d,
        tol: 0.02,
        solution: [
          `Δx = ${x2 - x1}, Δy = ${y2 - y1}.`,
          `d = √(${(x2-x1)**2} + ${(y2-y1)**2}) = √${(x2-x1)**2 + (y2-y1)**2} ≈ <strong>${d}</strong>.`
        ]
      };
    },
    function perpendicularGradient() {
      let num, den;
      do { num = rand(-6, 6); den = rand(1, 6); } while (num === 0);
      const g = Math.round((num / den) * 100) / 100;
      const perp = Math.round((-den / num) * 100) / 100;
      return {
        topic: 'coordinateGeom',
        prompt: `A line has gradient <strong>${g}</strong>. Find the gradient of a line <strong>perpendicular</strong> to it (to 2dp).`,
        hint: `Perpendicular gradients multiply to −1.`,
        answer: String(perp),
        numeric: perp,
        tol: 0.02,
        solution: [
          `Perpendicular gradient = −1 / (${g}) = <strong>${perp}</strong>.`
        ]
      };
    }
  ];

  // ---- volume ----
  G.volume = [
    function cuboidMinusCylinder() {
      let a, b, c, r;
      do {
        a = pick([10, 12, 15, 20]);
        b = pick([8, 10, 12]);
        c = pick([5, 8, 10]);
        r = pick([2, 3, 4]);
      } while (2*r > Math.min(a, b));
      const cuboidV = a*b*c;
      const cylV = Math.PI * r * r * c;
      const ans = +(cuboidV - cylV).toFixed(1);
      return {
        topic: 'volume',
        prompt: `A solid cuboid measuring <strong>${a} cm × ${b} cm × ${c} cm</strong> has a cylindrical hole of radius <strong>${r} cm</strong> drilled all the way through one of the ${a}×${b} faces. Find the volume of the remaining solid (cm³, to 1 dp).`,
        hint: `Volume = cuboid − cylinder. Use π ≈ 3.14159.`,
        answer: ans.toFixed(1),
        numeric: ans,
        tol: 0.5,
        solution: [
          `Cuboid volume: ${a} × ${b} × ${c} = ${cuboidV} cm³.`,
          `Cylinder volume: π × ${r}² × ${c} = π × ${r*r*c} ≈ ${cylV.toFixed(2)} cm³.`,
          `Remaining: ${cuboidV} − ${cylV.toFixed(2)} ≈ <strong>${ans} cm³</strong>.`,
          `<em>Don't forget to put the answer in the box!</em>`
        ]
      };
    },
    function cuboidMinusCuboid() {
      const A = pick([10, 12, 15, 20]);
      const B = pick([8, 10, 12]);
      const C = pick([6, 8, 10]);
      const a = rand(2, A-2), b = rand(2, B-2), c = rand(2, C-1);
      const ans = A*B*C - a*b*c;
      return {
        topic: 'volume',
        prompt: `A cuboid <strong>${A}×${B}×${C} cm</strong> has a smaller cuboid <strong>${a}×${b}×${c} cm</strong> removed from one corner. Find the volume of the remaining solid (cm³).`,
        hint: `Subtract small from big.`,
        answer: String(ans),
        numeric: ans,
        solution: [
          `Big: ${A}×${B}×${C} = ${A*B*C} cm³.`,
          `Small: ${a}×${b}×${c} = ${a*b*c} cm³.`,
          `Answer: ${A*B*C} − ${a*b*c} = <strong>${ans} cm³</strong>.`
        ]
      };
    },
    function cylinderVolume() {
      const r = rand(2, 8), h = rand(4, 15);
      const v = +(Math.PI * r * r * h).toFixed(2);
      return {
        topic: 'volume',
        prompt: `A cylinder has radius <strong>${r} cm</strong> and height <strong>${h} cm</strong>. Find its volume (cm³, to 2dp).`,
        hint: `V = πr²h.`,
        answer: v.toFixed(2),
        numeric: v,
        tol: 0.05,
        solution: [
          `V = π × ${r}² × ${h} = π × ${r*r*h} ≈ <strong>${v} cm³</strong>.`
        ]
      };
    }
  ];

  // ============================================================
  // DATA / PROBABILITY
  // ============================================================

  G.probability = [
    function complementaryProb() {
      const num = rand(1, 9);
      const den = pick([10, 20]);
      const p = num / den;
      return {
        topic: 'probability',
        prompt: `The probability that it rains tomorrow is <strong>${p}</strong>. What is the probability that it does <strong>not</strong> rain tomorrow?`,
        hint: `1 − P(rain).`,
        answer: String(+(1 - p).toFixed(4)),
        numeric: 1 - p,
        tol: 0.001,
        accepts: [`${den-num}/${den}`, fmtFrac(den-num, den)],
        solution: [`P(not rain) = 1 − ${p} = <strong>${1 - p}</strong>.`]
      };
    },
    function ticketProb() {
      const total = pick([20, 25, 50, 80, 81, 100]);
      const t = rand(1, total - 1);
      return {
        topic: 'probability',
        prompt: `Tickets numbered <strong>1 to ${total}</strong> are placed in a hat. One winning ticket is taken at random. What is the probability that it is <strong>greater than ${t}</strong>? Give your answer as a fraction in simplest form.`,
        hint: `Count tickets greater than ${t}: ${total - t}. Total: ${total}.`,
        answer: fmtFrac(total - t, total),
        accepts: [`${total - t}/${total}`, String(((total-t)/total).toFixed(4))],
        numeric: (total - t) / total,
        tol: 0.001,
        solution: [
          `Tickets > ${t}: ${total - t} out of ${total}.`,
          `${total - t}/${total} = <strong>${fmtFrac(total - t, total)}</strong>.`
        ]
      };
    },
    function twoIndependent() {
      const a = pick([1,2,3,4]), b = pick([1,2,3,4]);
      const da = pick([5,6,10]), db = pick([5,6,10]);
      const p1 = a / da, p2 = b / db;
      const p = +(p1 * p2).toFixed(4);
      return {
        topic: 'probability',
        prompt: `P(A) = <strong>${a}/${da}</strong>, P(B) = <strong>${b}/${db}</strong>, and A and B are independent. Find P(A and B) as a decimal (to 4dp).`,
        hint: `Independent events → multiply the probabilities.`,
        answer: p.toFixed(4),
        numeric: p,
        tol: 0.001,
        solution: [
          `P(A ∩ B) = P(A) × P(B) = (${a}/${da}) × (${b}/${db}) = ${a*b}/${da*db}.`,
          `As a decimal: <strong>${p}</strong>.`
        ]
      };
    }
  ];

  // ============================================================
  // OLYMPIAD STRETCH
  // ============================================================

  // ---- number theory (new) ----
  G.numberTheory = [
    function modArith() {
      const a = rand(20, 200);
      const m = pick([3, 4, 5, 6, 7, 9, 11]);
      const r = a % m;
      return {
        topic: 'numberTheory',
        prompt: `What is <strong>${a} mod ${m}</strong>? (i.e. the remainder when ${a} is divided by ${m}.)`,
        hint: `Find the largest multiple of ${m} not exceeding ${a}, then subtract.`,
        answer: String(r),
        numeric: r,
        solution: [
          `Largest multiple of ${m} up to ${a}: ${m} × ${Math.floor(a/m)} = ${m * Math.floor(a/m)}.`,
          `Remainder: ${a} − ${m * Math.floor(a/m)} = <strong>${r}</strong>.`
        ]
      };
    },
    function lastDigit() {
      const base = pick([2, 3, 4, 6, 7, 8, 9]);
      const power = rand(10, 100);
      // Last-digit cycles
      const cycles = { 2:[2,4,8,6], 3:[3,9,7,1], 4:[4,6], 6:[6], 7:[7,9,3,1], 8:[8,4,2,6], 9:[9,1] };
      const cyc = cycles[base];
      const last = cyc[(power - 1) % cyc.length];
      return {
        topic: 'numberTheory',
        prompt: `What is the <strong>last digit</strong> of <strong>${base}<sup>${power}</sup></strong>?`,
        hint: `The last digit of ${base}<sup>n</sup> repeats in a cycle of length ${cyc.length}: ${cyc.join(', ')}, …`,
        answer: String(last),
        numeric: last,
        solution: [
          `Last digits of ${base}<sup>n</sup> cycle as ${cyc.join(', ')} (length ${cyc.length}).`,
          `${power} mod ${cyc.length} = ${((power - 1) % cyc.length) + 1}, so last digit is <strong>${last}</strong>.`
        ]
      };
    },
    function hcfLcm() {
      const a = rand(6, 40), b = rand(6, 40);
      const g = gcd(a, b);
      const l = (a * b) / g;
      const asking = pick(['hcf', 'lcm']);
      return {
        topic: 'numberTheory',
        prompt: `Find the <strong>${asking === 'hcf' ? 'HCF' : 'LCM'}</strong> of <strong>${a}</strong> and <strong>${b}</strong>.`,
        hint: `HCF × LCM = ${a} × ${b} = ${a*b}.`,
        answer: asking === 'hcf' ? String(g) : String(l),
        numeric: asking === 'hcf' ? g : l,
        solution: [
          `Prime factorise both, then take min (HCF) or max (LCM) of each prime's power.`,
          `Answer: <strong>${asking === 'hcf' ? g : l}</strong>.`
        ]
      };
    },
    function divisibilityBy9() {
      // Number with unknown digit
      let a = rand(1000, 9000);
      const digit = rand(0, 9);
      // Insert missing digit at random position of a 5-digit block
      const rest = String(a);
      const sumRest = rest.split('').reduce((s, c) => s + +c, 0);
      // The missing digit is such that (sumRest + d) ≡ 0 (mod 9)
      const need = (9 - (sumRest % 9)) % 9;
      const shown = rest.slice(0, 2) + '?' + rest.slice(2);
      return {
        topic: 'numberTheory',
        prompt: `A 4-digit number <strong>${shown}</strong> is divisible by 9. What digit is in place of the ?`,
        hint: `A number is divisible by 9 iff its digit-sum is divisible by 9.`,
        answer: String(need),
        numeric: need,
        solution: [
          `Digit sum (without ?): ${sumRest}.`,
          `We need (${sumRest} + ?) divisible by 9, so ? = ${need}.`
        ]
      };
    }
  ];

  // ---- counting / combinatorics (new) ----
  G.counting = [
    function factorialArrangements() {
      const n = pick([4, 5, 6, 7]);
      const f = (function fact(x) { return x <= 1 ? 1 : x * fact(x-1); })(n);
      return {
        topic: 'counting',
        prompt: `In how many different orders can <strong>${n} distinct books</strong> be arranged on a shelf?`,
        hint: `${n} choices for first slot, ${n-1} for second, …`,
        answer: String(f),
        numeric: f,
        solution: [`${n}! = ${n} × ${n-1} × … × 1 = <strong>${f}</strong>.`]
      };
    },
    function chooseCommittee() {
      // "n C k" — pick simple ones
      const [n, k] = pick([[5,2],[6,2],[6,3],[7,3],[8,2],[8,3],[10,2],[10,3]]);
      const fact = x => x <= 1 ? 1 : x * fact(x-1);
      const c = fact(n) / (fact(k) * fact(n - k));
      return {
        topic: 'counting',
        prompt: `How many ways can a committee of <strong>${k}</strong> be chosen from <strong>${n}</strong> people? (Order doesn't matter.)`,
        hint: `<sup>${n}</sup>C<sub>${k}</sub> = ${n}! / (${k}! × ${n-k}!).`,
        answer: String(c),
        numeric: c,
        solution: [
          `${n}C${k} = ${n}! / (${k}! × ${n-k}!) = <strong>${c}</strong>.`
        ]
      };
    },
    function pigeonhole() {
      const holes = pick([7, 12, 26, 31, 52]);
      const context = {
        7:  { intro: `In any group of people`,               unit: 'people',   noun: 'weekday',    prep: 'have their birthday on the same' },
        12: { intro: `In any group of people`,               unit: 'people',   noun: 'month',      prep: 'were born in the same' },
        26: { intro: `A bag contains letters of the alphabet`, unit: 'letters',  noun: 'letter',     prep: 'be guaranteed to have two of the same' },
        31: { intro: `In any month of at most 31 days,`,     unit: 'people',   noun: 'day',        prep: 'share a birthday-day-of-month' },
        52: { intro: `From a deck of cards`,                 unit: 'cards',    noun: 'card',       prep: 'be guaranteed a repeat' }
      }[holes];
      const need = holes + 1;
      return {
        topic: 'counting',
        prompt: `${context.intro}, what is the <strong>smallest number of ${context.unit}</strong> needed to guarantee that at least two ${context.prep} ${context.noun}?`,
        hint: `Pigeonhole: with ${holes} categories, you need ${holes} + 1 items to guarantee a repeat.`,
        answer: String(need),
        numeric: need,
        solution: [
          `There are ${holes} possible ${context.noun}s (pigeonholes).`,
          `By the pigeonhole principle, with ${holes} items you could have one in each. So ${holes + 1} items guarantees a repeat.`
        ]
      };
    }
  ];

  // ============================================================
  // Topic registry
  // ============================================================
  const TOPICS = [
    // Number
    { key: 'indices',        label: 'Indices',              section: 'Number',   weak: true  },
    { key: 'surds',          label: 'Surds',                section: 'Number',   weak: true  },
    { key: 'percentages',    label: 'Percentages',          section: 'Number',   weak: true  },
    { key: 'standardForm',   label: 'Standard form',        section: 'Number',   weak: false },
    // Algebra
    { key: 'sequences',      label: 'Sequences',            section: 'Algebra',  weak: true  },
    { key: 'equations',      label: 'Equations',            section: 'Algebra',  weak: true  },
    { key: 'expand',         label: 'Expand & factorise',   section: 'Algebra',  weak: false },
    { key: 'inequalities',   label: 'Inequalities',         section: 'Algebra',  weak: false },
    { key: 'simultaneous',   label: 'Simultaneous eqns',    section: 'Algebra',  weak: false },
    { key: 'substitution',   label: 'Substitution',         section: 'Algebra',  weak: false },
    // Geometry
    { key: 'pythagoras',     label: 'Pythagoras',           section: 'Geometry', weak: false },
    { key: 'trig',           label: 'Trigonometry (SOHCAHTOA)', section: 'Geometry', weak: false },
    { key: 'angles',         label: 'Polygon angles',       section: 'Geometry', weak: false },
    { key: 'coordinateGeom', label: 'Coordinate geometry',  section: 'Geometry', weak: false },
    { key: 'volume',         label: 'Composite volume',     section: 'Geometry', weak: true  },
    // Data
    { key: 'probability',    label: 'Probability',          section: 'Data',     weak: false },
    // Olympiad stretch
    { key: 'numberTheory',   label: 'Number theory',        section: 'Olympiad stretch', weak: false, olympiad: true },
    { key: 'counting',       label: 'Counting & pigeonhole',section: 'Olympiad stretch', weak: false, olympiad: true }
  ];

  window.Questions = {
    generators: G,
    topics: TOPICS,
    generate(topicKey) {
      const gens = G[topicKey];
      if (!gens || !gens.length) return null;
      return gens[Math.floor(Math.random() * gens.length)]();
    },
    generateFromEnabled(enabledKeys) {
      const pool = [];
      TOPICS.forEach(t => {
        if (!enabledKeys || enabledKeys.has(t.key)) {
          pool.push(t.key);
          if (t.weak) pool.push(t.key); // weak topics 2×
        }
      });
      if (!pool.length) return null;
      const k = pool[Math.floor(Math.random() * pool.length)];
      return this.generate(k);
    }
  };
})();
