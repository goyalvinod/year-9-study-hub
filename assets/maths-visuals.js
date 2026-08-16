/* Attach inline SVG diagrams to specific maths topics. Runs after
   content.js / y9.js / svg.js have populated their respective objects. */
(function () {
  'use strict';
  if (!window.Content || !window.Content.MATHS || !window.SVG) return;
  const C = window.Content.MATHS;
  const attach = (key, svg) => { if (C[key]) C[key].diagram = svg; };
  attach('pythagoras',     window.SVG.rightTriangle('a', 'b', 'c'));
  attach('trig',           window.SVG.rightTriangle('adj', 'opp', 'hyp'));
  attach('circleTheorems', window.SVG.circleTheoremDiagram());
  attach('vectors',        window.SVG.vectorDiagram());
  attach('similarity',     window.SVG.similarShapesDiagram());
  attach('volume',         window.SVG.coneAndSphere());
  attach('coordinateGeom', window.SVG.coordAxes());
  // A small atomic-model diagram for chemistry
  if (window.Content.CHEMISTRY && window.Content.CHEMISTRY.cAtomic) {
    window.Content.CHEMISTRY.cAtomic.diagram = window.SVG.pieAtom();
  }
})();
