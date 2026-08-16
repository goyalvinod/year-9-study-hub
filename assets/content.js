/* ==========================================================
   Learning content per topic. Each entry:
     { blurb: HTML intro, formulas: [{name, expr}], examples: [{q, steps}],
       pitfalls: [HTML], videos: [{title, source, url, badge?}], next?: [key,...] }
   Exposed on window.Content.MATHS[key].
   Video links point to stable topic pages (Corbettmaths, Khan Academy, etc.)
   so they don't rot the way single YouTube IDs do.
   ========================================================== */
(function () {
  'use strict';

  const cm = (name, num) => ({
    title: `Corbettmaths — ${name}`,
    source: 'corbettmaths.com',
    url: `https://corbettmaths.com/?s=${encodeURIComponent(name)}`,
    badge: 'Video + practice'
  });
  const ka = (path, title) => ({
    title: `Khan Academy — ${title}`,
    source: 'khanacademy.org',
    url: `https://www.khanacademy.org/math/${path}`,
    badge: 'Video course'
  });
  const yt = (channel, title) => ({
    title,
    source: 'YouTube',
    url: `https://www.youtube.com/@${channel}`,
    badge: 'Channel'
  });
  const yts = (query, title) => ({
    title,
    source: 'YouTube',
    url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    badge: 'Search'
  });

  const MATHS = {
    // ---------- NUMBER ----------
    indices: {
      blurb: `
        <p>An <strong>index</strong> (or exponent, or power) tells you how many times to multiply a
        number by itself. So <span class="math">3<sup>4</sup> = 3 × 3 × 3 × 3 = 81</span>.</p>
        <p>Year 9 rules go beyond simple whole-number powers — you'll meet negative, zero, and
        fractional indices, and the <em>laws of indices</em> that let you combine them.</p>`,
      formulas: [
        { name: 'Multiplying same base', expr: 'aᵐ × aⁿ = aᵐ⁺ⁿ' },
        { name: 'Dividing same base',    expr: 'aᵐ ÷ aⁿ = aᵐ⁻ⁿ' },
        { name: 'Power of a power',      expr: '(aᵐ)ⁿ = aᵐⁿ' },
        { name: 'Power of a product',    expr: '(ab)ⁿ = aⁿbⁿ' },
        { name: 'Zero index',            expr: 'a⁰ = 1  (a ≠ 0)' },
        { name: 'Negative index',        expr: 'a⁻ⁿ = 1 / aⁿ' },
        { name: 'Fractional index',      expr: 'a^(1/n) = ⁿ√a,   a^(m/n) = (ⁿ√a)ᵐ' }
      ],
      examples: [
        {
          q: 'Simplify (5np)³.',
          steps: [
            'Apply the outer power to <em>every</em> factor: 5³ · n³ · p³.',
            '5³ = 125, so answer = <strong>125n³p³</strong>.',
            '<em>Common slip: leaving the coefficient as 5 instead of 5³.</em>'
          ]
        },
        {
          q: 'Simplify 4x⁵ × 3x². ',
          steps: [
            'Multiply the coefficients: 4 × 3 = 12.',
            'Add the powers: x⁵⁺² = x⁷.',
            'Answer: <strong>12x⁷</strong>.'
          ]
        },
        {
          q: 'Work out 16^(3/4).',
          steps: [
            'Split m/n: take the n-th root first, then raise to the m-th power.',
            '⁴√16 = 2, then 2³ = <strong>8</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Forgetting to raise the coefficient: (5np)³ ≠ 5n³p³ — it\'s 125n³p³.',
        'Reading a fractional index as division: 8^(2/3) ≠ 8÷(2/3). It means (∛8)² = 4.',
        'Confusing (a+b)ⁿ with aⁿ+bⁿ — the laws only apply to products/quotients, not sums.'
      ],
      videos: [
        cm('Laws of Indices', 176),
        ka('cc-eighth-grade-math/cc-8th-numbers-operations/cc-8th-exponent-properties', 'Exponent properties'),
        yts('laws of indices GCSE Higher', 'Eddie Woo — Laws of Indices'),
        yts('fractional indices GCSE Higher', 'Fractional & negative indices walkthrough')
      ]
    },

    surds: {
      blurb: `
        <p>A <strong>surd</strong> is a root of a non-perfect-square number — it can't be written
        exactly as a fraction, so we leave it in root form to stay exact. √9 is not a surd (it's 3),
        but √2 is.</p>
        <p>Two key skills: <em>simplifying</em> a surd by pulling out perfect squares, and
        <em>rationalising</em> a denominator so no root sits underneath.</p>`,
      formulas: [
        { name: 'Product rule',     expr: '√a × √b = √(ab)' },
        { name: 'Quotient rule',    expr: '√a / √b = √(a/b)' },
        { name: 'Same root add',    expr: 'a√k + b√k = (a+b)√k' },
        { name: 'Rationalise',      expr: '1/√a = √a / a' }
      ],
      examples: [
        {
          q: 'Simplify √50.',
          steps: [
            'Largest square factor of 50: 25.',
            '√50 = √(25 · 2) = √25 · √2 = <strong>5√2</strong>.'
          ]
        },
        {
          q: 'Write √50 + √128 − √200 in the form n√2.',
          steps: [
            '√50 = 5√2, √128 = 8√2, √200 = 10√2.',
            '5√2 + 8√2 − 10√2 = <strong>3√2</strong>, so n = 3.'
          ]
        },
        {
          q: 'Rationalise 6/√3.',
          steps: [
            'Multiply top and bottom by √3: 6√3 / 3.',
            'Simplify: <strong>2√3</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Writing √a + √b as √(a+b) — this is <em>wrong</em>. You can only combine surds if they have the same root part.',
        'Reporting just the surd part when the question asks for a coefficient (e.g. giving 3√2 when asked "find n if the answer is n√2").',
        'Forgetting to simplify the fraction after rationalising.'
      ],
      videos: [
        cm('Surds', 305),
        ka('algebra/x2f8bb11595b61c86:rational-exponents-radicals', 'Rational exponents & radicals'),
        yts('surds simplify rationalise GCSE Higher', 'Surds walkthrough')
      ]
    },

    percentages: {
      blurb: `
        <p>Multi-step and reverse percentage questions are where marks slip most often. The trick
        is to think in <strong>multipliers</strong> (e.g. +20% = ×1.20, −15% = ×0.85), then chain
        them or reverse them.</p>
        <p>Compound interest, depreciation, and "reverse" percentage change all use the same
        multiplier idea.</p>`,
      formulas: [
        { name: 'Increase by p%',    expr: '× (1 + p/100)' },
        { name: 'Decrease by p%',    expr: '× (1 − p/100)' },
        { name: 'Reverse (undo)',    expr: 'divide by the multiplier' },
        { name: 'Compound interest', expr: 'A = P × (1 + r/100)ⁿ' }
      ],
      examples: [
        {
          q: 'A shirt costs £42 after a 30% discount. What was the original price?',
          steps: [
            'The £42 is 70% (i.e. 0.70) of the original.',
            'Original = 42 ÷ 0.70 = <strong>£60</strong>.'
          ]
        },
        {
          q: '£2,000 invested at 4% compound interest for 3 years. Final value?',
          steps: [
            'Multiplier per year: 1.04.',
            'A = 2000 × 1.04³ ≈ 2000 × 1.124864 ≈ <strong>£2,249.73</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Applying +10% then −10% and expecting to return to the start. You don\'t — the second % is of a different amount.',
        '"20% less than X" means × 0.80 of X, not X − 20.',
        'Forgetting that compound interest compounds the interest itself — simple interest would be smaller.'
      ],
      videos: [
        cm('Reverse Percentages', 240),
        cm('Compound Interest', 236),
        ka('cc-seventh-grade-math/cc-7th-fractions-decimals/cc-7th-percent-word-problems', 'Percent word problems')
      ]
    },

    standardForm: {
      blurb: `
        <p>Standard form (a.k.a. scientific notation) writes very big or very small numbers as
        <span class="math">a × 10ⁿ</span> where <strong>1 ≤ a &lt; 10</strong> and n is an integer.
        Great for keeping track of orders of magnitude.</p>`,
      formulas: [
        { name: 'Multiplying',   expr: '(a × 10ᵐ)(b × 10ⁿ) = (ab) × 10ᵐ⁺ⁿ' },
        { name: 'Dividing',      expr: '(a × 10ᵐ) / (b × 10ⁿ) = (a/b) × 10ᵐ⁻ⁿ' },
        { name: 'Renormalising', expr: 'if a ≥ 10 or a < 1, shift the decimal and adjust n' }
      ],
      examples: [
        {
          q: 'Write 34,700 in standard form.',
          steps: [
            'Move the decimal to leave 3.47 (a number between 1 and 10).',
            'Count moves: 4 places → × 10⁴.',
            'Answer: <strong>3.47 × 10⁴</strong>.'
          ]
        },
        {
          q: '(3 × 10⁵) × (4 × 10²) = ?',
          steps: [
            'Multiply fronts: 3 × 4 = 12.',
            'Add powers: 10⁵ × 10² = 10⁷ → intermediate 12 × 10⁷.',
            'Renormalise: 12 = 1.2 × 10¹ → <strong>1.2 × 10⁸</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Leaving the front number outside 1 ≤ a < 10 — that\'s not standard form.',
        'Adding powers when you should be subtracting (or vice versa).'
      ],
      videos: [
        cm('Standard Form', 300),
        ka('cc-eighth-grade-math/cc-8th-numbers-operations/cc-8th-scientific-notation-intro', 'Scientific notation')
      ]
    },

    // ---------- ALGEBRA ----------
    sequences: {
      blurb: `
        <p>A <strong>sequence</strong> is an ordered list of numbers made by a rule. You need to
        (a) generate terms from a rule, and (b) find the rule from the terms.</p>
        <p>For linear sequences the nth term is <span class="math">an + b</span> — a is the common
        difference. For quadratic sequences it looks like <span class="math">an² + bn + c</span>,
        which you find using second differences.</p>`,
      formulas: [
        { name: 'Linear nth term',       expr: 'nth = a·n + (T₁ − a)' },
        { name: 'Common difference',     expr: 'a = T₂ − T₁' },
        { name: 'Quadratic second diff', expr: 'second difference = 2a' }
      ],
      examples: [
        {
          q: 'The nth term is 5(n − 3). Find the first term.',
          steps: [
            'Substitute n = 1 <em>inside</em> the bracket first: 1 − 3 = −2.',
            'Then multiply by 5: 5 × (−2) = <strong>−10</strong>.',
            '<em>Common slip: doing 5n − 3 = 2 instead — the whole bracket must be multiplied by 5.</em>'
          ]
        },
        {
          q: 'Find the nth term of 4, 11, 18, 25, …',
          steps: [
            'Common difference is 7 → nth term begins with 7n.',
            'When n = 1, 7n = 7; we need 4, so subtract 3.',
            'nth term = <strong>7n − 3</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Distributing over a bracket wrongly: 5(n − 3) is NOT 5n − 3.',
        'Confusing common difference with first term.',
        'For quadratics, forgetting that the second difference equals 2a — not a.'
      ],
      videos: [
        cm('nth term', 288),
        cm('Quadratic nth Term', 379),
        yts('quadratic nth term GCSE', 'Quadratic sequences walkthrough')
      ]
    },

    equations: {
      blurb: `
        <p>Solving an equation means finding the value(s) of the unknown that make both sides equal.
        You'll meet <strong>linear</strong>, <strong>rational</strong>, and
        <strong>quadratic</strong> equations. Same skill, different shapes.</p>`,
      formulas: [
        { name: 'Linear',    expr: 'ax + b = c ⇒ x = (c − b)/a' },
        { name: 'Rational',  expr: 'multiply both sides by the denominator to clear the fraction' },
        { name: 'Quadratic (factorised)', expr: '(x − p)(x − q) = 0 ⇒ x = p or x = q' },
        { name: 'Quadratic formula', expr: 'x = (−b ± √(b² − 4ac)) / (2a)' }
      ],
      examples: [
        {
          q: 'Solve (2x − 7) / (x + 4) − 3 = 0.',
          steps: [
            'Rearrange: (2x − 7)/(x + 4) = 3.',
            'Multiply both sides by (x + 4): 2x − 7 = 3(x + 4).',
            'Expand: 2x − 7 = 3x + 12.',
            'Rearrange: −7 − 12 = 3x − 2x → x = <strong>−19</strong>.'
          ]
        },
        {
          q: 'Solve x² − 5x + 6 = 0.',
          steps: [
            'Factorise: (x − 2)(x − 3) = 0.',
            'x = <strong>2 or 3</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Rational equations: forgetting to multiply <em>every</em> term on both sides by the denominator.',
        'Sign errors when moving terms across the = sign — always check by substituting back.',
        'Quadratics: forgetting the second solution.'
      ],
      videos: [
        cm('Solving Equations', 110),
        cm('Quadratic Formula', 267),
        ka('algebra/x2f8bb11595b61c86:quadratic-functions-equations', 'Quadratic equations')
      ]
    },

    expand: {
      blurb: `
        <p>Expanding (multiplying out brackets) and factorising (spotting brackets) are opposites.
        Confident algebra depends on being fluent in both directions.</p>`,
      formulas: [
        { name: 'Single bracket',     expr: 'a(b + c) = ab + ac' },
        { name: 'Double bracket',     expr: '(x + a)(x + b) = x² + (a+b)x + ab' },
        { name: 'Difference of squares', expr: 'a² − b² = (a − b)(a + b)' },
        { name: 'Common factor',      expr: 'ab + ac = a(b + c)' }
      ],
      examples: [
        {
          q: 'Expand (x + 3)(x − 5).',
          steps: [
            'FOIL: x·x + x·(−5) + 3·x + 3·(−5).',
            '= x² − 5x + 3x − 15.',
            '= <strong>x² − 2x − 15</strong>.'
          ]
        },
        {
          q: 'Factorise x² − 9.',
          steps: [
            'Recognise difference of squares: x² − 3².',
            'Answer: <strong>(x − 3)(x + 3)</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Combining unlike terms (e.g. 3x + 2x² → 5x³ is nonsense).',
        'Sign errors on the middle term when expanding — a negative × negative = positive.'
      ],
      videos: [
        cm('Expanding Brackets', 13),
        cm('Factorising', 117)
      ]
    },

    inequalities: {
      blurb: `
        <p>An inequality behaves almost exactly like an equation — you can add, subtract, multiply
        or divide both sides. The one twist: when you <strong>multiply or divide by a negative
        number, flip the inequality sign</strong>.</p>`,
      formulas: [
        { name: 'Flip rule', expr: 'a < b  ⇒  −a > −b' },
        { name: 'Number line marker', expr: 'open circle for <  or  >; closed circle for ≤ or ≥' }
      ],
      examples: [
        {
          q: 'Solve 3x − 4 ≥ 11.',
          steps: [
            'Add 4: 3x ≥ 15.',
            'Divide by 3: <strong>x ≥ 5</strong>.'
          ]
        },
        {
          q: 'Solve 7 − 2x > 1.',
          steps: [
            'Subtract 7: −2x > −6.',
            'Divide by −2 <em>(flip!)</em>: <strong>x &lt; 3</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Forgetting to flip when dividing/multiplying by a negative.',
        'Confusing ≤ with < when drawing the answer on a number line.'
      ],
      videos: [
        cm('Solving Inequalities', 178),
        ka('algebra/one-variable-linear-inequalities', 'One-variable linear inequalities')
      ]
    },

    simultaneous: {
      blurb: `
        <p>Two unknowns need two equations. The two main methods are <strong>elimination</strong>
        (adding or subtracting the equations to remove a variable) and <strong>substitution</strong>
        (rearranging one and plugging into the other).</p>`,
      formulas: [
        { name: 'Elimination', expr: 'multiply so coefficients match, then add/subtract' },
        { name: 'Substitution', expr: 'rearrange one equation for a variable, substitute into the other' }
      ],
      examples: [
        {
          q: 'Solve 2x + 3y = 12 and 4x − y = 10.',
          steps: [
            'From the second: y = 4x − 10.',
            'Substitute: 2x + 3(4x − 10) = 12.',
            'Expand: 2x + 12x − 30 = 12 → 14x = 42 → x = 3.',
            'y = 4(3) − 10 = 2. Answer: <strong>x = 3, y = 2</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Losing a minus sign when multiplying an equation by a negative.',
        'Only doing half the answer — always give both x and y (and check by substituting into the other equation).'
      ],
      videos: [
        cm('Simultaneous Equations Elimination', 295),
        ka('algebra/systems-of-linear-equations', 'Systems of linear equations')
      ]
    },

    substitution: {
      blurb: `
        <p>Substitution just means "put a number in for a letter". The tricky ones layer several
        operations — powers, roots, fractions — and reward being methodical.</p>`,
      formulas: [
        { name: 'Order of operations', expr: 'BIDMAS / BODMAS' }
      ],
      examples: [
        {
          q: 'y = (a + bx²) / √(x + c). Find y when a = 5, b = 3, x = 4, c = 5.',
          steps: [
            'Top: 5 + 3(4²) = 5 + 48 = 53.',
            'Bottom: √(4 + 5) = √9 = 3.',
            'y = 53 / 3 ≈ <strong>17.67</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Squaring −3 as −9 instead of 9.',
        'Applying an outer power before evaluating the bracket.'
      ],
      videos: [
        cm('Substitution', 21),
        ka('cc-sixth-grade-math/cc-6th-expressions-and-variables/cc-6th-evaluating-expressions', 'Evaluating expressions')
      ]
    },

    // ---------- GEOMETRY ----------
    pythagoras: {
      blurb: `
        <p>Only works in right-angled triangles: the square on the hypotenuse (longest side, opposite
        the right angle) equals the sum of the squares on the other two sides.</p>`,
      formulas: [
        { name: "Pythagoras' theorem", expr: 'a² + b² = c²' },
        { name: 'Finding a shorter side', expr: 'shorter² = hyp² − other²' }
      ],
      examples: [
        {
          q: 'Legs 6 cm and 8 cm — find the hypotenuse.',
          steps: [
            'c² = 6² + 8² = 36 + 64 = 100.',
            'c = √100 = <strong>10 cm</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Trying to use it on a non-right-angled triangle.',
        'Getting hypotenuse and leg mixed up when finding a shorter side.'
      ],
      videos: [
        cm('Pythagoras', 257),
        ka('geometry/right-triangles-topic/pyth-theor', 'Pythagorean theorem')
      ]
    },

    trig: {
      blurb: `
        <p>SOHCAHTOA: given a right-angled triangle, sine, cosine and tangent link a chosen angle
        with pairs of sides.</p>
        <ul>
          <li><strong>SOH</strong>: sin θ = <em>opposite</em> ÷ <em>hypotenuse</em></li>
          <li><strong>CAH</strong>: cos θ = <em>adjacent</em> ÷ <em>hypotenuse</em></li>
          <li><strong>TOA</strong>: tan θ = <em>opposite</em> ÷ <em>adjacent</em></li>
        </ul>`,
      formulas: [
        { name: 'Find a side',  expr: 'side = trig(angle) × known side  (or ÷ if the known side is on top)' },
        { name: 'Find an angle', expr: 'angle = arcsin/arccos/arctan(known ratio)' }
      ],
      examples: [
        {
          q: 'Hypotenuse 12 cm, angle 35°. Find the opposite side.',
          steps: [
            'sin 35° = opposite / 12.',
            'opposite = 12 × sin 35° ≈ 12 × 0.5736 ≈ <strong>6.88 cm</strong>.'
          ]
        },
        {
          q: 'Opposite 5, adjacent 12. Find the angle.',
          steps: [
            'tan θ = 5 / 12 ≈ 0.4167.',
            'θ = arctan 0.4167 ≈ <strong>22.62°</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Calculator in the wrong mode — should be in DEGREES for these questions.',
        'Labelling sides from the wrong angle — "opposite" and "adjacent" swap depending on which angle you pick.'
      ],
      videos: [
        cm('SOHCAHTOA', 329),
        cm('Trigonometry finding sides and angles', 329),
        ka('geometry/right-triangles-topic/intro-to-the-trig-ratios-geo', 'Intro to trig ratios')
      ]
    },

    angles: {
      blurb: `
        <p>Regular polygons have neat angle rules: exterior angles always sum to 360°, and interior
        angles sum to (n − 2) × 180°.</p>`,
      formulas: [
        { name: 'Sum of exterior angles', expr: '360° (any polygon)' },
        { name: 'Each exterior (regular)', expr: '360° / n' },
        { name: 'Sum of interior angles', expr: '(n − 2) × 180°' },
        { name: 'Each interior (regular)', expr: '((n − 2) × 180°) / n' }
      ],
      examples: [
        {
          q: 'Each exterior angle of a regular polygon is 30°. Find the number of sides.',
          steps: [
            'n = 360 / 30 = <strong>12 sides</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Confusing interior and exterior — they always sum to 180° at each vertex.'
      ],
      videos: [
        cm('Interior and Exterior Angles', 32),
        ka('geometry/hs-geo-foundations/hs-geo-polygons/', 'Polygon angles')
      ]
    },

    coordinateGeom: {
      blurb: `
        <p>Everything on a straight line follows from three simple facts: gradient (steepness),
        midpoint (average of ends), and distance (Pythagoras in disguise).</p>`,
      formulas: [
        { name: 'Gradient',       expr: 'm = (y₂ − y₁) / (x₂ − x₁)' },
        { name: 'Midpoint',       expr: '((x₁+x₂)/2, (y₁+y₂)/2)' },
        { name: 'Distance',       expr: '√((x₂−x₁)² + (y₂−y₁)²)' },
        { name: 'Line equation',  expr: 'y = mx + c   (or y − y₁ = m(x − x₁))' },
        { name: 'Parallel',       expr: 'same gradient' },
        { name: 'Perpendicular',  expr: 'gradients multiply to −1' }
      ],
      examples: [
        {
          q: 'Line through A(1, 2) and B(5, 10). Find the gradient and midpoint.',
          steps: [
            'Gradient = (10 − 2) / (5 − 1) = 8/4 = <strong>2</strong>.',
            'Midpoint = ((1+5)/2, (2+10)/2) = <strong>(3, 6)</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Getting Δx and Δy the wrong way round in the gradient.',
        'Perpendicular gradient errors — flip the fraction AND change the sign.'
      ],
      videos: [
        cm('Gradient of a Line', 189),
        cm('Distance between two points', 190),
        cm('Equation of a Line', 194),
        ka('algebra/two-var-linear-equations', 'Two-variable linear equations')
      ]
    },

    volume: {
      blurb: `
        <p>For composite solids the trick is <em>subtraction</em>: work out the shape as if it were
        solid, then subtract whatever's been removed (a hole, a cutout).</p>`,
      formulas: [
        { name: 'Cuboid',   expr: 'V = length × width × height' },
        { name: 'Cylinder', expr: 'V = π r² h' },
        { name: 'Cone',     expr: 'V = ⅓ π r² h' },
        { name: 'Sphere',   expr: 'V = 4/3 π r³' },
        { name: 'Pyramid',  expr: 'V = ⅓ × base area × height' }
      ],
      examples: [
        {
          q: 'A 20×10×5 cm cuboid has a cylindrical hole of radius 2 cm drilled through the 20×10 face. Find the volume left.',
          steps: [
            'Cuboid: 20 × 10 × 5 = 1000 cm³.',
            'Cylinder: π × 2² × 5 = 20π ≈ 62.83 cm³.',
            'Remaining: 1000 − 62.83 ≈ <strong>937.17 cm³</strong>.',
            '<em>Common slip: doing all the working, then leaving the answer box empty.</em>'
          ]
        }
      ],
      pitfalls: [
        'Blank final answer despite correct working (put the answer in the box!).',
        'Using diameter instead of radius in πr².',
        'Mixing up units — check everything is in the same unit before you multiply.'
      ],
      videos: [
        cm('Volume of a Cylinder', 356),
        cm('Composite Solids Volume', 357),
        ka('geometry/basic-geometry-shapes/xff63fac4:volume-shapes', 'Volume of shapes')
      ]
    },

    // ---------- DATA ----------
    probability: {
      blurb: `
        <p>Probability is just "favourable ÷ total". Independence, mutually exclusive events, tree
        diagrams and Venn diagrams are all decorations on top.</p>`,
      formulas: [
        { name: 'Basic',       expr: 'P(event) = favourable / total' },
        { name: 'Complement',  expr: 'P(not A) = 1 − P(A)' },
        { name: 'Independent', expr: 'P(A and B) = P(A) × P(B)' },
        { name: 'Mutually exclusive', expr: 'P(A or B) = P(A) + P(B)' }
      ],
      examples: [
        {
          q: 'P(A) = 0.3, P(B) = 0.4, independent. Find P(A and B).',
          steps: [
            'Independent → multiply: 0.3 × 0.4 = <strong>0.12</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Adding probabilities that aren\'t mutually exclusive.',
        'Multiplying probabilities that aren\'t independent (e.g. drawing without replacement).'
      ],
      videos: [
        cm('Probability', 244),
        cm('Tree Diagrams', 252),
        ka('cc-seventh-grade-math/cc-7th-probability-statistics/cc-7th-basic-prob', 'Basic probability')
      ]
    },

    // ---------- OLYMPIAD STRETCH ----------
    numberTheory: {
      blurb: `
        <p>Number theory is where competition maths <em>lives</em>. At this level you'll meet
        <strong>divisibility rules</strong>, <strong>modular arithmetic</strong>, primes, and the
        HCF/LCM relationship.</p>
        <p>Modular arithmetic is a "clock" version of numbers — you only care about the remainder
        when you divide by a fixed number. 17 mod 5 = 2, because 17 = 3·5 + 2.</p>`,
      formulas: [
        { name: 'HCF × LCM',       expr: 'HCF(a,b) × LCM(a,b) = a × b' },
        { name: 'Divisibility by 3', expr: 'digit sum divisible by 3' },
        { name: 'Divisibility by 9', expr: 'digit sum divisible by 9' },
        { name: 'Divisibility by 11', expr: 'alternating digit sum divisible by 11' },
        { name: 'Modular add',      expr: '(a + b) mod n = ((a mod n) + (b mod n)) mod n' },
        { name: 'Last digit cycle', expr: 'last digit of aⁿ is periodic in n' }
      ],
      examples: [
        {
          q: 'Find the last digit of 3¹⁰⁰.',
          steps: [
            'Last digits of 3ⁿ cycle: 3, 9, 7, 1, 3, 9, 7, 1, … (length 4).',
            '100 mod 4 = 0, which corresponds to the 4th entry.',
            'Last digit = <strong>1</strong>.'
          ]
        },
        {
          q: 'What is the smallest positive integer that leaves remainder 2 when divided by 3, and remainder 3 when divided by 5?',
          steps: [
            'Candidates ≡ 2 (mod 3): 2, 5, 8, 11, 14, …',
            'Which of those are ≡ 3 (mod 5)? 8 → 8 mod 5 = 3 ✓',
            'Answer: <strong>8</strong>.'
          ]
        }
      ],
      pitfalls: [
        'Treating "digit sum divisible by 9" as sufficient without checking (it\'s an "iff").',
        'Forgetting the cycle length when raising to large powers.'
      ],
      videos: [
        yt('Numberphile', 'Numberphile — number-theory playlist'),
        yts('modular arithmetic olympiad JMO', 'Modular arithmetic — Junior Olympiad prep'),
        yts('divisibility rules olympiad', 'Divisibility rules & proofs'),
        { title: 'UKMT — Junior Mathematical Olympiad problems',
          source: 'ukmt.org.uk',
          url: 'https://www.ukmt.org.uk/competitions/solo/junior-mathematical-olympiad',
          badge: 'Past papers' }
      ]
    },

    counting: {
      blurb: `
        <p>Counting problems are about being systematic. Two big tools:</p>
        <ul>
          <li><strong>Factorials & combinations</strong> — n! is the number of orderings of n
          things; nCk counts subsets of size k.</li>
          <li><strong>Pigeonhole principle</strong> — if you put more items than boxes, some box
          holds at least two items. Deceptively simple, wins competitions.</li>
        </ul>`,
      formulas: [
        { name: 'Factorial',      expr: 'n! = n × (n−1) × … × 1' },
        { name: 'Permutations',   expr: 'ⁿPᵣ = n! / (n−r)!' },
        { name: 'Combinations',   expr: 'ⁿCᵣ = n! / (r! (n−r)!)' },
        { name: 'Pigeonhole',     expr: 'n items into k boxes ⇒ some box has ≥ ⌈n/k⌉ items' }
      ],
      examples: [
        {
          q: 'Committee of 3 from 8 people?',
          steps: [
            '⁸C₃ = 8! / (3! · 5!) = (8·7·6) / (3·2·1) = <strong>56</strong>.'
          ]
        },
        {
          q: 'In a class of 13, must two share a birth-month?',
          steps: [
            '12 months (pigeonholes), 13 people (pigeons).',
            'By pigeonhole, <strong>yes</strong> — at least two must share a month.'
          ]
        }
      ],
      pitfalls: [
        'Using nPr when order doesn\'t matter (should use nCr).',
        'Pigeonhole "guarantees" — must find the tight number, not just "some" number.'
      ],
      videos: [
        yt('Numberphile', 'Numberphile — combinatorics playlist'),
        yts('pigeonhole principle olympiad', 'Pigeonhole principle problems'),
        yts('combinations permutations GCSE', 'Combinations & permutations'),
        { title: 'Art of Problem Solving — Counting basics',
          source: 'artofproblemsolving.com',
          url: 'https://artofproblemsolving.com/wiki/index.php/Counting',
          badge: 'Reading' }
      ]
    }
  };

  window.Content = { MATHS };
})();
