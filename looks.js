/* VÉLORA — Penumbra look data + parametric SVG fashion-plate renderer.
   Every image on the site is drawn here: no photography, no external assets. */

const f = (n) => Math.round(n * 10) / 10;

export const COLOURS = {
  noir:    { lit: '#4b4642', mid: '#1d1b19', dark: '#060505', rim: '#a99f92', name: 'Noir' },
  oxblood: { lit: '#a64c51', mid: '#5A1A1F', dark: '#1b0507', rim: '#eaa99c', name: 'Oxblood' },
  bone:    { lit: '#fffbf3', mid: '#e3d9c9', dark: '#958977', rim: '#ffffff', name: 'Bone' },
  smoke:   { lit: '#c2bab0', mid: '#878076', dark: '#2e2a26', rim: '#f1eadf', name: 'Smoke' },
  velvet:  { lit: '#86343b', mid: '#3c0e13', dark: '#0a0203', rim: '#f4ab9f', name: 'Oxblood velvet' },
};

const BG = {
  noir:    { c1: '#2e2a27', c2: '#0A0908', floor: '#030303', beam: 0.07 },
  bone:    { c1: '#f8f3ea', c2: '#cbc1b1', floor: '#a99e8d', beam: 0.32 },
  oxblood: { c1: '#77282e', c2: '#22090c', floor: '#120405', beam: 0.09 },
  smoke:   { c1: '#aaa398', c2: '#4a453f', floor: '#2f2b27', beam: 0.14 },
};

const SKIN = { lit: '#dfcfbb', mid: '#b29c87', dark: '#5c4a3d' };

/* ------------------------------------------------------------------ */
/* The collection — twelve looks. Fictional garments, illustrative.   */
/* ------------------------------------------------------------------ */
export const LOOKS = [
  {
    n: 'I', name: 'Vesper', piece: 'Bias-cut slip gown with cowl neck and pooled train',
    material: 'Liquid silk charmeuse', colour: 'Oxblood', bg: 'noir', head: 'bun', legs: 'none', seed: 11,
    sleeve: { type: 'bare' },
    note: 'Cut on the bias from a single length of charmeuse, so the cloth follows the body without one dart. It pours rather than hangs, and the train settles a beat after you stop.',
    layers: [{ kind: 'dress', colour: 'oxblood', neck: 'cowl', sh: 44, waist: 29, hip: 45, flare: 'column', hemW: 66, hemY: 730, folds: 13, tex: 'satin', train: 70 }],
  },
  {
    n: 'II', name: 'Lantern Hour', piece: 'Sculpted cocoon coat with funnel collar',
    material: 'Double-faced cashmere', colour: 'Bone', bg: 'oxblood', head: 'crop', legs: 'hosiery', seed: 23,
    sleeve: { type: 'wide', colour: 'bone' },
    note: 'A cocoon that holds air the way a lantern holds light. Double-faced cashmere with no lining, every edge hand-turned so the coat is as finished inside as out.',
    layers: [{ kind: 'dress', colour: 'bone', neck: 'funnel', sh: 60, waist: 58, hip: 76, flare: 'cocoon', hemW: 52, hemY: 560, folds: 7, wave: 3 }],
  },
  {
    n: 'III', name: 'Mute', piece: 'Roped-shoulder jacket and floor-length wide trousers',
    material: 'Wool gabardine, chalk pinstripe', colour: 'Noir', bg: 'bone', head: 'crop', legs: 'none', seed: 5,
    sleeve: { type: 'slim', colour: 'noir' },
    note: 'Tailoring with the volume turned down: a roped shoulder, one button at the waist and trousers that fall straight to the floor without a break.',
    layers: [
      { kind: 'trousers', colour: 'noir', waist: 31, hip: 48, tw: 46, tex: 'pinstripe' },
      { kind: 'dress', colour: 'noir', neck: 'lapel', sh: 72, shLift: -6, waist: 34, hip: 52, flare: 'column', hemW: 57, hemY: 452, folds: 3, buttons: 'single', tex: 'pinstripe', wave: 1 },
    ],
  },
  {
    n: 'IV', name: 'Thread of Smoke', piece: 'Diagonal knife-pleat skirt and fine turtleneck',
    material: 'Wool pleats, merino knit', colour: 'Smoke and noir', bg: 'noir', head: 'bun', legs: 'bare', seed: 31,
    sleeve: { type: 'slim', colour: 'noir' },
    note: 'Knife pleats set on a diagonal hem, so the skirt is long on one side and gone on the other. Above it, the plainest knit we could make.',
    layers: [
      { kind: 'skirt', colour: 'smoke', waist: 30, hip: 50, flare: 'a', hemW: 98, hemY: 540, asym: 150, tex: 'pleats', folds: 0, wave: 2 },
      { kind: 'dress', colour: 'noir', neck: 'turtle', sh: 47, waist: 30, hip: 44, flare: 'column', hemW: 34, hemY: 318, folds: 2, wave: 1 },
    ],
  },
  {
    n: 'V', name: 'Eclipse', piece: 'Coat No. 7 — double-breasted, stand collar, flared skirt',
    material: 'Double-faced wool melton, silk lining', colour: 'Noir', bg: 'bone', head: 'bun', legs: 'hosiery', seed: 7,
    sleeve: { type: 'slim', colour: 'noir' },
    note: 'The house coat of the season: a stand collar, six horn buttons and a flared skirt that swings slowly behind you. Studied in detail further down the page.',
    layers: [{ kind: 'dress', colour: 'noir', neck: 'funnel', sh: 60, shLift: -3, waist: 31, hip: 58, flare: 'a', hemW: 100, hemY: 600, folds: 9, buttons: 'db', wave: 4 }],
  },
  {
    n: 'VI', name: 'Salt Veil', piece: 'Bell gown with bishop sleeves and a floor-length veil',
    material: 'Silk tulle, duchess satin', colour: 'Bone', bg: 'noir', head: 'veil', legs: 'none', seed: 41,
    sleeve: { type: 'bishop', colour: 'bone' },
    note: 'A bell skirt built on layers of tulle and finished with a veil long enough to blur the whole silhouette. Ceremonial, without the ceremony.',
    layers: [{ kind: 'dress', colour: 'bone', neck: 'round', sh: 47, waist: 28, hip: 60, flare: 'bell', hemW: 132, hemY: 732, folds: 11 }],
  },
  {
    n: 'VII', name: 'Night Lacquer', piece: 'Knee-length cape over a matte column dress',
    material: 'Lacquered cotton, matte crêpe', colour: 'Noir', bg: 'oxblood', head: 'crop', legs: 'hosiery', seed: 17,
    sleeve: { type: 'none' },
    note: 'A cotton cape lacquered by hand until it holds its own shape and throws light like wet stone. The dress beneath stays completely matte.',
    layers: [
      { kind: 'dress', colour: 'noir', neck: 'funnel', sh: 50, waist: 30, hip: 46, flare: 'column', hemW: 48, hemY: 566, folds: 4, wave: 2 },
      { kind: 'cape', colour: 'noir', sh: 52, capeY: 520, tex: 'lacquer' },
    ],
  },
  {
    n: 'VIII', name: 'Penumbra', piece: 'Mermaid gown with deep V and pooled train',
    material: 'Silk velvet', colour: 'Oxblood', bg: 'noir', head: 'bun', legs: 'none', seed: 29,
    sleeve: { type: 'slim', colour: 'velvet' },
    note: 'The collection’s namesake: oxblood velvet, a deep V and a mermaid line that releases into a pooled train. It drinks the light and gives back only the edges.',
    layers: [{ kind: 'dress', colour: 'velvet', neck: 'v', neckDepth: 74, sh: 46, waist: 28, hip: 47, flare: 'mermaid', hemW: 104, hemY: 732, folds: 10, tex: 'velvet', train: 66 }],
  },
  {
    n: 'IX', name: 'Quiet Armour', piece: 'Long quilted gilet over a black jersey column',
    material: 'Quilted wool, jersey', colour: 'Smoke and noir', bg: 'bone', head: 'crop', legs: 'none', seed: 13,
    sleeve: { type: 'slim', colour: 'noir' },
    note: 'A long gilet quilted in soft diamonds over a black column. Protective in shape, almost weightless to wear.',
    layers: [
      { kind: 'dress', colour: 'noir', neck: 'turtle', sh: 48, waist: 30, hip: 44, flare: 'column', hemW: 50, hemY: 728, folds: 5 },
      { kind: 'dress', colour: 'smoke', neck: 'v', neckDepth: 196, sh: 54, waist: 41, hip: 57, flare: 'column', hemW: 64, hemY: 664, tex: 'quilt', folds: 3, wave: 2 },
    ],
  },
  {
    n: 'X', name: 'Hollow', piece: 'Sheer belted trench over a satin slip',
    material: 'Silk organza, satin slip', colour: 'Bone', bg: 'smoke', head: 'bun', legs: 'bare', seed: 37,
    sleeve: { type: 'wide', colour: 'bone', opacity: 0.55 },
    note: 'A trench made almost entirely of air: sheer organza, belted, worn over a slip so the coat becomes a shadow of itself.',
    layers: [
      { kind: 'dress', colour: 'bone', neck: 'slip', sh: 46, waist: 30, hip: 44, flare: 'column', hemW: 44, hemY: 520, folds: 4, tex: 'satin', wave: 2 },
      { kind: 'dress', colour: 'bone', neck: 'lapel', sh: 58, waist: 44, hip: 62, flare: 'a', hemW: 96, hemY: 690, folds: 8, opacity: 0.48, belt: 'tie' },
    ],
  },
  {
    n: 'XI', name: 'Ash Garden', piece: 'Belted shirt dress and wide-brimmed felt hat',
    material: 'Cotton poplin, felt', colour: 'Smoke', bg: 'oxblood', head: 'brim', legs: 'bare', seed: 19,
    sleeve: { type: 'bishop', colour: 'smoke' },
    note: 'A smoke shirt dress with a full skirt and a black wide-brimmed hat. Made for long, pale afternoons and for leaving early.',
    layers: [{ kind: 'dress', colour: 'smoke', neck: 'v', neckDepth: 42, sh: 50, waist: 30, hip: 52, flare: 'a', hemW: 90, hemY: 556, folds: 9, belt: 'belt', buttons: 'placket' }],
  },
  {
    n: 'XII', name: 'The Unseen', piece: 'Floor-length hooded cloak',
    material: 'Cotton velvet', colour: 'Noir', bg: 'bone', head: 'hood', legs: 'none', seed: 3,
    sleeve: { type: 'none' },
    note: 'The finale. A floor-length hooded cloak in black velvet that hides everything except the way you move. The face stays in shadow.',
    layers: [{ kind: 'dress', colour: 'noir', neck: 'round', sh: 58, waist: 50, hip: 62, flare: 'column', hemW: 80, hemY: 734, folds: 12, tex: 'velvet' }],
  },
];

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */
function rng(seed) {
  let a = (seed * 9301 + 49297) | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Closed Catmull-Rom spline -> cubic Béziers. A third value of 1 marks a hard corner. */
export function smooth(pts) {
  const n = pts.length;
  const P = (i) => pts[(i + n) % n];
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const a = p1[2] ? [0, 0] : [(p2[0] - p0[0]) / 6, (p2[1] - p0[1]) / 6];
    const b = p2[2] ? [0, 0] : [(p3[0] - p1[0]) / 6, (p3[1] - p1[1]) / 6];
    d += `C${f(p1[0] + a[0])} ${f(p1[1] + a[1])} ${f(p2[0] - b[0])} ${f(p2[1] - b[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}

const mirror = (pts) => pts.slice().reverse().map(([x, y, c]) => [-x, y, c]);

function flarePts(L) {
  const { hip, hemW, hemY } = L;
  const span = hemY - 352;
  if (span < 170) return [[(hip + hemW) / 2 + 1, 352 + span * 0.5]];
  switch (L.flare) {
    case 'a': return [[hip + (hemW - hip) * 0.33, 352 + span * 0.33], [hip + (hemW - hip) * 0.7, 352 + span * 0.7]];
    case 'bell': return [[hip + (hemW - hip) * 0.55, 352 + span * 0.24], [hemW * 0.98, 352 + span * 0.7]];
    case 'mermaid': return [[hip - 3, 352 + span * 0.3], [hip - 7, 352 + span * 0.55], [hip + (hemW - hip) * 0.45, 352 + span * 0.83]];
    case 'cocoon': return [[hip + 5, 352 + span * 0.32], [(hip + hemW) / 2 + 9, 352 + span * 0.74]];
    default: return [[hip + (hemW - hip) * 0.3, 352 + span * 0.4], [hip + (hemW - hip) * 0.78, 352 + span * 0.8]];
  }
}

const hemOff = (L, x) => (L.asym || 0) * Math.min(1, Math.max(0, (L.hemW - x) / (2 * L.hemW)));

function outline(right, close, L, R) {
  const asym = L.asym || 0, hy = L.hemY, top = 352;
  const yl = (y) => y + asym * Math.min(1, Math.max(0, (y - top) / Math.max(1, hy - top)));
  const hem = [];
  const n = Math.max(4, Math.round(L.hemW / 13));
  for (let j = 1; j < n; j++) {
    const x = L.hemW - (2 * L.hemW * j) / n;
    const w = (L.wave ?? 5) * (j % 2 ? 1 : -0.45) * (0.7 + R() * 0.6);
    hem.push([x, hy + hemOff(L, x) + w]);
  }
  const left = right.slice().reverse().map(([x, y, c]) => [-x, yl(y), c]);
  return [...right, ...hem, ...left, ...close];
}

function dressPts(L, R) {
  const sh = L.sh, lift = L.shLift || 0, sy = 166 + lift;
  const pts = [], close = [];
  const nk = L.neck || 'round';
  if (nk === 'funnel') { pts.push([15, 121, 1], [15.5, 138], [18, 152]); close.push([0, 119]); }
  else if (nk === 'turtle') { pts.push([14, 125, 1], [14.5, 140], [17, 152]); close.push([0, 123]); }
  else if (nk === 'slip') { pts.push([sh * 0.62, 206, 1]); close.push([-sh * 0.3, 210], [0, 221, 1], [sh * 0.3, 210]); }
  else if (nk === 'cowl') { pts.push([sh * 0.86, 176, 1]); close.push([-sh * 0.45, 204], [0, 222], [sh * 0.45, 204]); }
  else if (nk === 'v') { pts.push([12, 151, 1]); close.push([0, 151 + (L.neckDepth || 60), 1]); }
  else if (nk === 'lapel') { pts.push([13, 151, 1]); close.push([0, 262, 1]); }
  else { pts.push([13, 151, 1]); close.push([0, 157]); }
  if (nk !== 'slip' && nk !== 'cowl') {
    const last = pts[pts.length - 1];
    pts.push([(last[0] + sh) / 2 + 2, 156 + lift * 0.5]);
    pts.push([sh, sy, lift < -3 ? 1 : 0]);
  }
  pts.push([sh * 0.8 + 2, 214]);
  if (L.hemY > 262) pts.push([Math.max(L.waist + 7, sh * 0.68), 252]);
  if (L.hemY > 310) pts.push([L.waist, 300]);
  if (L.hemY > 372) { pts.push([L.hip, 352]); flarePts(L).forEach((p) => pts.push(p)); }
  pts.push([L.hemW, L.hemY, 1]);
  return outline(pts, close, L, R);
}

function skirtPts(L, R) {
  const pts = [[L.waist, 296, 1], [L.hip, 352], ...flarePts(L), [L.hemW, L.hemY, 1]];
  return outline(pts, [], L, R);
}

function trouserPts(L) {
  const tw = L.tw || 44;
  return [[L.waist, 298, 1], [L.hip, 352], [L.hip + 5, 520], [tw, 730, 1], [9, 731, 1], [6, 560], [0, 398, 1],
    [-6, 560], [-9, 731, 1], [-tw, 730, 1], [-L.hip - 5, 520], [-L.hip, 352], [-L.waist, 298, 1]];
}

function capeHalf(L, R) {
  const sh = L.sh || 54, cy = L.capeY || 520;
  const right = [[14, 150, 1], [sh + 4, 168], [sh + 22, 240], [sh + 44, 380], [sh + 58, cy, 1]];
  const n = 5;
  for (let j = 1; j < n; j++) {
    const x = sh + 58 - ((sh + 44) * j) / n;
    right.push([x, cy + (j % 2 ? 5 : -2) * (0.7 + R() * 0.6)]);
  }
  right.push([14, cy - 8, 1], [16, 320], [15, 200]);
  return right;
}

function armPts(type, sh, sy) {
  const S = [sh - 5, sy + 4], E = [sh + 8, 292], W = [sh + 11, type === 'wide' ? 412 : 402];
  let o, i;
  if (type === 'bare') { o = [[S[0] + 7, S[1] - 2], [E[0] + 5.5, E[1]], [W[0] + 4.2, W[1], 1]]; i = [[W[0] - 4.2, W[1], 1], [E[0] - 5, E[1]], [sh * 0.78, 220]]; }
  else if (type === 'wide') { o = [[S[0] + 11, S[1] - 2], [E[0] + 13, E[1]], [W[0] + 27, W[1], 1]]; i = [[W[0] - 12, W[1], 1], [E[0] - 9, E[1]], [sh * 0.78, 222]]; }
  else if (type === 'bishop') { o = [[S[0] + 10, S[1] - 2], [E[0] + 9, E[1]], [W[0] + 19, 378], [W[0] + 7, W[1], 1]]; i = [[W[0] - 7, W[1], 1], [W[0] - 15, 378], [E[0] - 8, E[1]], [sh * 0.78, 222]]; }
  else { o = [[S[0] + 11, S[1] - 2], [E[0] + 8, E[1]], [W[0] + 6.5, W[1], 1]]; i = [[W[0] - 6.5, W[1], 1], [E[0] - 8, E[1]], [sh * 0.78, 222]]; }
  return { pts: [[S[0] - 6, S[1] - 6], ...o, ...i], wrist: W };
}

/* ------------------------------------------------------------------ */
/* Renderer                                                            */
/* ------------------------------------------------------------------ */
const stops = (arr) => arr.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('');
const vstops = (arr) => arr.map(([o, v, a = 1]) => `<stop offset="${o}" style="stop-color:var(${v})"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('');

/**
 * renderLook(look, { uid, label, par, vars, detail, parts })
 *  uid    unique id prefix (required when several renders share a page)
 *  label  accessible name; omitted => decorative (aria-hidden)
 *  par    preserveAspectRatio value
 *  vars   main garment + background read CSS custom properties (colourway switching)
 *  detail adds construction detail (seams, topstitching, weave) for close inspection
 *  parts  return { defs, body } instead of a full <svg>
 */
export function renderLook(look, o = {}) {
  const u = 'v' + (o.uid ?? look.n);
  const cx = 200;
  const R = rng(look.seed || 3);
  const A = (pts) => pts.map(([x, y, c]) => [cx + x, y, c]);
  const P = (pts) => smooth(A(pts));
  const mainKey = look.layers[0].colour;
  const isVar = (k) => !!o.vars && k === mainKey;
  const rimS = (k, op) => isVar(k) ? `style="stroke:var(--g-rim)" stroke-opacity="${op}"` : `stroke="${COLOURS[k].rim}" stroke-opacity="${op}"`;

  const keys = new Set();
  look.layers.forEach((l) => keys.add(l.colour));
  if (look.sleeve && look.sleeve.colour) keys.add(look.sleeve.colour);
  if (look.head === 'brim') keys.add('noir');

  const bg = BG[look.bg];
  let defs = '';
  keys.forEach((k) => {
    const c = COLOURS[k];
    const g = isVar(k)
      ? vstops([[0, '--g-dark'], [0.28, '--g-mid'], [0.62, '--g-lit'], [0.82, '--g-mid'], [1, '--g-dark']])
      : stops([[0, c.dark], [0.28, c.mid], [0.62, c.lit], [0.82, c.mid], [1, c.dark]]);
    const r = isVar(k)
      ? vstops([[0, '--g-rim', 0], [0.6, '--g-rim', 0], [1, '--g-rim', 0.85]])
      : stops([[0, c.rim, 0], [0.6, c.rim, 0], [1, c.rim, 0.85]]);
    defs += `<linearGradient id="${u}-g-${k}" x1="0" x2="1" y1="0" y2="0">${g}</linearGradient>`;
    defs += `<linearGradient id="${u}-r-${k}" x1="0" x2="1" y1="0" y2="0">${r}</linearGradient>`;
  });
  defs += `<radialGradient id="${u}-bg" cx=".62" cy=".3" r=".9">${o.vars ? vstops([[0, '--b1'], [1, '--b2']]) : stops([[0, bg.c1], [1, bg.c2]])}</radialGradient>`;
  defs += `<linearGradient id="${u}-beam" x1="0" y1="0" x2="0" y2="1">${stops([[0, '#fff', o.vars ? 0.18 : bg.beam], [1, '#fff', 0]])}</linearGradient>`;
  defs += `<radialGradient id="${u}-cast">${stops([[0, '#000', 0.55], [1, '#000', 0]])}</radialGradient>`;
  defs += `<radialGradient id="${u}-skin" cx=".66" cy=".32" r=".85">${stops([[0, SKIN.lit], [0.55, SKIN.mid], [1, SKIN.dark]])}</radialGradient>`;
  defs += `<linearGradient id="${u}-hair" x1="0" x2="1">${stops([[0, '#0b0908'], [0.7, '#2c2521'], [1, '#141110']])}</linearGradient>`;
  defs += `<linearGradient id="${u}-vs" x1="0" y1="0" x2="0" y2="1">${stops([[0, '#fff', 0.07], [0.32, '#000', 0], [1, '#000', 0.4]])}</linearGradient>`;
  defs += `<linearGradient id="${u}-hose" x1="0" x2="1">${stops([[0, '#0a0808'], [0.6, '#3b3431'], [1, '#141110']])}</linearGradient>`;
  defs += `<radialGradient id="${u}-btn" cx=".35" cy=".3" r=".8">${stops([[0, '#8a7462'], [0.5, '#3d3029'], [1, '#110d0b']])}</radialGradient>`;

  let s = '';
  // --- stage: background, light shaft, floor, cast shadow
  s += `<rect width="400" height="760" fill="url(#${u}-bg)"/>`;
  s += `<path d="M262 0H352L332 760H92Z" fill="url(#${u}-beam)"/>`;
  s += `<rect y="726" width="400" height="34" ${o.vars ? 'style="fill:var(--b3)"' : `fill="${bg.floor}"`} opacity=".42"/>`;
  s += `<ellipse cx="${cx - 26}" cy="738" rx="124" ry="9" fill="url(#${u}-cast)"/>`;

  // --- pooled trains (behind everything)
  look.layers.forEach((L) => {
    if (!L.train) return;
    const t = L.train, w = L.hemW;
    const d = P([[-w * 0.35, L.hemY - 90], [-w - t * 0.5, L.hemY - 14], [-w - t, 745, 1], [w * 0.4, 745, 1], [w * 0.55, L.hemY - 40]]);
    s += `<path d="${d}" fill="url(#${u}-g-${L.colour})"/><path d="${d}" fill="#000" opacity=".38"/>`;
    s += `<path d="M${f(cx - w - t * 0.8)} 741Q${f(cx - w * 0.6)} 728 ${f(cx + w * 0.2)} 741" fill="none" ${rimS(L.colour, 0.22)} stroke-width="1.2"/>`;
  });

  // --- legs
  if (look.legs === 'bare' || look.legs === 'hosiery') {
    const fill = look.legs === 'bare' ? `url(#${u}-skin)` : `url(#${u}-hose)`;
    const leg = [[25, 360], [25, 460], [21, 540], [22, 600], [12.5, 706], [11, 720], [29, 734, 1], [8, 734, 1], [5, 712], [7, 604], [6, 542], [3, 450], [0, 392, 1]];
    const legL = mirror(leg).map(([x, y, c]) => [x + 4, y, c]);
    s += `<path d="${P(leg)}" fill="${fill}"/><path d="${P(legL)}" fill="${fill}"/><path d="${P(legL)}" fill="#000" opacity=".18"/>`;
    const shoe = [[9, 712], [13.5, 711], [31, 734.5, 1], [8, 736, 1]];
    const shoeL = mirror(shoe).map(([x, y, c]) => [x + 4, y, c]);
    s += `<path d="${P(shoe)}" fill="#0d0b0a"/><path d="${P(shoeL)}" fill="#0d0b0a"/>`;
    s += `<path d="M${cx + 14} 713L${cx + 29} 733" stroke="#fff" stroke-opacity=".18" stroke-width=".8"/>`;
  }

  // --- body: torso + neck in skin (garments cover what they cover)
  const torso = [[10, 146, 1], [38, 163], [46, 175], [45, 212], [37, 250], [30, 300], [40, 352, 1], [-40, 352, 1], [-30, 300], [-37, 250], [-45, 212], [-46, 175], [-38, 163], [-10, 146, 1]];
  s += `<path d="${P(torso)}" fill="url(#${u}-skin)"/>`;
  s += `<path d="${P([[-9, 108, 1], [9, 108, 1], [10, 146], [12, 156, 1], [-12, 156, 1], [-10, 146]])}" fill="url(#${u}-skin)"/>`;
  s += `<path d="M${cx - 9} 152Q${cx - 22} 158 ${cx - 32} 165M${cx + 9} 152Q${cx + 22} 158 ${cx + 32} 165" stroke="#000" stroke-opacity=".16" stroke-width="1.4" fill="none"/>`;
  s += `<ellipse cx="${cx}" cy="128" rx="11" ry="4.5" fill="#000" opacity=".22"/>`;

  // --- garment layers
  const layerSVG = (L, i) => {
    const R2 = rng((look.seed || 3) * 7 + i);
    let pts;
    if (L.kind === 'trousers') pts = trouserPts(L);
    else if (L.kind === 'skirt') pts = skirtPts(L, R2);
    else pts = dressPts(L, R2);
    const d = P(pts);
    const id = `${u}-c${i}`;
    const top = L.kind === 'skirt' ? 300 : L.kind === 'trousers' ? 300 : (L.hemY > 420 ? 312 : 226);
    const hemY = L.kind === 'trousers' ? 730 : L.hemY;
    const hemW = L.kind === 'trousers' ? (L.tw || 44) : L.hemW;
    defs += `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
    defs += `<linearGradient id="${u}-f${i}" gradientUnits="userSpaceOnUse" x1="0" y1="${top}" x2="0" y2="${hemY}">${stops([[0, '#000', 0], [0.35, '#000', 0.32], [1, '#000', 0.62]])}</linearGradient>`;

    let g = `<g${L.opacity ? ` opacity="${L.opacity}"` : ''}>`;
    g += `<path d="${d}" fill="url(#${u}-g-${L.colour})"/><path d="${d}" fill="url(#${u}-vs)"/>`;
    let inner = '';

    // textures
    if (L.tex === 'pinstripe') {
      defs += `<pattern id="${u}-pin${i}" width="7" height="10" patternUnits="userSpaceOnUse"><path d="M3.5 0V10" stroke="${COLOURS[L.colour].rim}" stroke-opacity=".16" stroke-width=".6"/></pattern>`;
      inner += `<rect x="0" y="0" width="400" height="760" fill="url(#${u}-pin${i})"/>`;
    }
    if (L.tex === 'quilt') {
      defs += `<pattern id="${u}-q${i}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0H16M0 0V16" stroke="#000" stroke-opacity=".35" stroke-width="1"/><path d="M1 1H16M1 1V16" stroke="${COLOURS[L.colour].rim}" stroke-opacity=".22" stroke-width=".6"/></pattern>`;
      inner += `<rect x="0" y="0" width="400" height="760" fill="url(#${u}-q${i})"/>`;
    }
    if (L.tex === 'pleats') {
      const n = 26;
      for (let j = 0; j <= n; j++) {
        const t = j / n;
        const xs = (t * 2 - 1) * L.waist, xe = (t * 2 - 1) * L.hemW;
        const ye = L.hemY + hemOff(L, xe) + 4;
        inner += `<path d="M${f(cx + xs)} 298L${f(cx + xe)} ${f(ye)}" stroke="#000" stroke-opacity="${j % 2 ? 0.4 : 0.14}" stroke-width="${j % 2 ? 1.6 : 0.8}"/>`;
        inner += `<path d="M${f(cx + xs + 1.3)} 300L${f(cx + xe + 2.2)} ${f(ye)}" ${rimS(L.colour, j % 2 ? 0.05 : 0.2)} stroke-width=".7"/>`;
      }
    }
    if (L.tex === 'velvet') {
      defs += `<radialGradient id="${u}-vel${i}" cx=".5" cy=".5" r=".5">${stops([[0, COLOURS[L.colour].rim, 0.26], [1, COLOURS[L.colour].rim, 0]])}</radialGradient>`;
      inner += `<ellipse cx="${cx + 18}" cy="${f((top + hemY) / 2)}" rx="${f(hemW * 0.45)}" ry="${f((hemY - top) * 0.5)}" fill="url(#${u}-vel${i})"/>`;
      inner += `<ellipse cx="${cx + 10}" cy="236" rx="16" ry="40" fill="url(#${u}-vel${i})"/>`;
    }

    // drapery folds: shadow stroke + highlight ridge beside it
    const nf = L.folds || 0;
    for (let j = 0; j < nf; j++) {
      const t = (j + 0.5) / nf + (R2() - 0.5) * 0.06;
      const xs = (t * 2 - 1) * (L.waist || 30) * 0.75;
      const te = Math.min(1, Math.max(0, t + (R2() - 0.5) * 0.08));
      const xe = (te * 2 - 1) * hemW * 0.9;
      const ys = top + R2() * 70;
      const ye = hemY + (L.kind === 'trousers' ? 0 : hemOff(L, xe)) - 2;
      const qx = (xs + xe) / 2 + (R2() - 0.5) * 18, qy = (ys + ye) / 2 + (R2() - 0.5) * 40;
      const w = 2 + R2() * 4.5;
      inner += `<path d="M${f(cx + xs)} ${f(ys)}Q${f(cx + qx)} ${f(qy)} ${f(cx + xe)} ${f(ye)}" stroke="url(#${u}-f${i})" stroke-width="${f(w)}" fill="none" stroke-linecap="round"/>`;
      const off = w * 0.7 + 1.6;
      inner += `<path d="M${f(cx + xs + off)} ${f(ys + 12)}Q${f(cx + qx + off)} ${f(qy)} ${f(cx + xe + off)} ${f(ye)}" ${rimS(L.colour, 0.17)} stroke-width="${f(1 + R2() * 1.1)}" fill="none" stroke-linecap="round"/>`;
    }
    if (L.tex === 'satin') {
      inner += `<path d="M${cx + 14} ${top - 30}C${cx + 26} ${top + 120} ${cx + 4} ${hemY - 200} ${cx + hemW * 0.35} ${hemY}" ${rimS(L.colour, 0.14)} stroke-width="16" fill="none"/>`;
      inner += `<path d="M${cx + 16} ${top - 30}C${cx + 28} ${top + 120} ${cx + 6} ${hemY - 200} ${cx + hemW * 0.37} ${hemY}" ${rimS(L.colour, 0.42)} stroke-width="1.6" fill="none"/>`;
      inner += `<path d="M${cx - 20} ${top}C${cx - 12} ${top + 140} ${cx - 30} ${hemY - 160} ${cx - hemW * 0.4} ${hemY}" ${rimS(L.colour, 0.08)} stroke-width="10" fill="none"/>`;
    }
    if (L.kind === 'trousers') {
      inner += `<path d="M${cx + L.hip * 0.5} 360L${cx + (L.tw || 44) * 0.55} 728M${cx - L.hip * 0.5} 360L${cx - (L.tw || 44) * 0.55} 728" ${rimS(L.colour, 0.2)} stroke-width="1" fill="none"/>`;
    }
    if (o.detail) {
      defs += `<pattern id="${u}-weave" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 5L2.5 0M2.5 5L5 0" stroke="#fff" stroke-opacity=".07" stroke-width=".5"/><path d="M0 0L2.5 5M2.5 0L5 5" stroke="#000" stroke-opacity=".16" stroke-width=".5"/></pattern>`;
      inner += `<rect x="0" y="0" width="400" height="760" fill="url(#${u}-weave)"/>`;
      // princess seams, waist seam, front edge, hem topstitch
      inner += `<path d="M${cx + 34} 170Q${cx + 26} 250 ${cx + 22} 300Q${cx + 40} 450 ${cx + 52} ${hemY}M${cx - 34} 170Q${cx - 26} 250 ${cx - 22} 300Q${cx - 40} 450 ${cx - 52} ${hemY}" stroke="#000" stroke-opacity=".45" stroke-width="1.1" fill="none"/>`;
      inner += `<path d="M${cx - L.waist} 301Q${cx} 306 ${cx + L.waist} 301" stroke="#000" stroke-opacity=".5" stroke-width="1.2" fill="none"/>`;
      inner += `<path d="M${cx + 22} 150L${cx + 23} ${hemY}" stroke="#000" stroke-opacity=".55" stroke-width="1.3"/>`;
      inner += `<path d="M${cx + 25} 154L${cx + 26} ${hemY - 6}" ${rimS(L.colour, 0.35)} stroke-width=".6" stroke-dasharray="2.2 2.2"/>`;
      inner += `<path d="M${cx - hemW + 6} ${hemY - 13}Q${cx} ${hemY - 9} ${cx + hemW - 6} ${hemY - 13}" ${rimS(L.colour, 0.35)} stroke-width=".6" stroke-dasharray="2.2 2.2" fill="none"/>`;
      inner += `<path d="M${cx + 36} 370l18 -5M${cx - 54} 365l18 5" stroke="#000" stroke-opacity=".6" stroke-width="2.4"/>`;
      inner += `<path d="M${cx + 36} 368.6l18 -5M${cx - 54} 363.6l18 5" ${rimS(L.colour, 0.3)} stroke-width=".6"/>`;
    }
    g += `<g clip-path="url(#${id})">${inner}</g>`;
    g += `<path d="${d}" fill="none" stroke="url(#${u}-r-${L.colour})" stroke-width="1.5"/>`;

    // necklines
    if (L.neck === 'turtle') {
      for (let k = 0; k < 4; k++) g += `<path d="M${cx - 13} ${130 + k * 5}Q${cx} ${133 + k * 5} ${cx + 13} ${130 + k * 5}" stroke="#000" stroke-opacity=".35" stroke-width="1" fill="none"/>`;
    }
    if (L.neck === 'funnel') {
      g += `<path d="M${cx - 15} 133Q${cx} 139 ${cx + 15} 133" stroke="#000" stroke-opacity=".45" stroke-width="1.6" fill="none"/>`;
      g += `<path d="M${cx - 14} 131Q${cx} 136.6 ${cx + 14} 131" ${rimS(L.colour, 0.28)} stroke-width=".8" fill="none"/>`;
    }
    if (L.neck === 'cowl') {
      for (let k = 0; k < 3; k++) {
        const w = L.sh * (0.74 - k * 0.14), y = 182 + k * 3, dy = 222 + k * 13;
        g += `<path d="M${f(cx - w)} ${y}Q${cx} ${dy + 10} ${f(cx + w)} ${y}" stroke="#000" stroke-opacity=".38" stroke-width="3" fill="none"/>`;
        g += `<path d="M${f(cx - w + 2)} ${y + 3}Q${cx} ${dy + 14} ${f(cx + w - 2)} ${y + 3}" ${rimS(L.colour, 0.22)} stroke-width="1" fill="none"/>`;
      }
    }
    if (L.neck === 'slip') {
      g += `<path d="M${f(cx + L.sh * 0.6)} 206L${cx + 30} 164M${f(cx - L.sh * 0.6)} 206L${cx - 30} 164" ${rimS(L.colour, 0.7)} stroke-width="1.1"/>`;
    }
    if (L.neck === 'lapel') {
      const lap = [[13, 151, 1], [L.sh * 0.55, 166], [L.waist * 0.8, 222], [27, 228, 1], [4, 262, 1], [7, 205]];
      [lap, mirror(lap)].forEach((lp, k) => {
        const dd = P(lp);
        g += `<path d="${dd}" fill="url(#${u}-g-${L.colour})"/><path d="${dd}" fill="#000" opacity="${k ? 0.34 : 0.18}"/>`;
        g += `<path d="${dd}" fill="none" ${rimS(L.colour, 0.38)} stroke-width=".9"/>`;
      });
    }
    // belt
    if (L.belt) {
      g += `<rect x="${cx - L.waist - 3}" y="292" width="${2 * L.waist + 6}" height="${L.belt === 'tie' ? 10 : 13}" fill="url(#${u}-g-${L.colour})"/>`;
      g += `<rect x="${cx - L.waist - 3}" y="292" width="${2 * L.waist + 6}" height="${L.belt === 'tie' ? 10 : 13}" fill="#000" opacity=".28"/>`;
      if (L.belt === 'tie') {
        g += `<path d="M${cx + 8} 300C${cx + 18} 330 ${cx + 6} 370 ${cx + 16} 410M${cx + 4} 300C${cx + 2} 340 ${cx - 6} 372 ${cx + 2} 400" ${rimS(L.colour, 0.6)} stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
      } else {
        g += `<rect x="${cx - 6}" y="290" width="12" height="17" fill="none" stroke="#d8cdbb" stroke-width="1.6"/>`;
      }
    }
    // buttons
    const btn = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${u}-btn)"/>` +
      (o.detail ? `<circle cx="${x}" cy="${y}" r="${f(r * 0.66)}" fill="none" stroke="#000" stroke-opacity=".5" stroke-width=".4"/><circle cx="${x - 0.9}" cy="${y - 0.9}" r=".45" fill="#000"/><circle cx="${x + 0.9}" cy="${y - 0.9}" r=".45" fill="#000"/><circle cx="${x - 0.9}" cy="${y + 0.9}" r=".45" fill="#000"/><circle cx="${x + 0.9}" cy="${y + 0.9}" r=".45" fill="#000"/>` : '') +
      `<circle cx="${f(x + r * 0.3)}" cy="${f(y - r * 0.35)}" r="${f(r * 0.28)}" fill="#fff" opacity=".35"/>`;
    if (L.buttons === 'db') [236, 270, 324].forEach((y) => { g += btn(cx - 13, y, 4.6) + btn(cx + 13, y, 4.6); });
    if (L.buttons === 'single') g += btn(cx + 2, 274, 5);
    if (L.buttons === 'placket') {
      g += `<path d="M${cx} ${151 + (L.neckDepth || 40)}V${L.hemY - 6}" stroke="#000" stroke-opacity=".3" stroke-width="1"/>`;
      for (let y = 210; y < L.hemY - 20; y += 40) g += btn(cx + 2.5, y, 2.2);
    }
    return g + '</g>';
  };

  look.layers.forEach((L, i) => { if (L.kind !== 'cape') s += layerSVG(L, i); });

  // --- arms & hands
  const sl = look.sleeve || { type: 'none' };
  if (sl.type !== 'none') {
    const upper = [...look.layers].reverse().find((l) => l.kind === 'dress' && l.hemY > 300) || look.layers[0];
    const sh = upper.sh || 50, sy = 166 + (upper.shLift || 0);
    const arm = armPts(sl.type, sh, sy);
    const fill = sl.type === 'bare' ? `url(#${u}-skin)` : `url(#${u}-g-${sl.colour})`;
    const W = arm.wrist;
    const hand = [[W[0] - 4.5, W[1] - 3], [W[0] + 5, W[1] - 3], [W[0] + 6, W[1] + 18], [W[0] + 3, W[1] + 36, 1], [W[0] - 2.5, W[1] + 33], [W[0] - 5, W[1] + 16]];
    [[arm.pts, hand, 0], [mirror(arm.pts), mirror(hand), 1]].forEach(([ap, hp, left]) => {
      s += `<path d="${P(hp)}" fill="url(#${u}-skin)"/>${left ? `<path d="${P(hp)}" fill="#000" opacity=".22"/>` : ''}`;
      const ad = P(ap);
      s += `<g${sl.opacity ? ` opacity="${sl.opacity}"` : ''}><path d="${ad}" fill="${fill}"/>`;
      if (left) s += `<path d="${ad}" fill="#000" opacity=".24"/>`;
      if (sl.type !== 'bare') {
        s += `<path d="${ad}" fill="none" stroke="url(#${u}-r-${sl.colour})" stroke-width="1.2"/>`;
        const ex = left ? -(sh + 8) : sh + 8;
        s += `<path d="M${f(cx + ex - 6)} 286Q${f(cx + ex)} 292 ${f(cx + ex + 7)} 289" stroke="#000" stroke-opacity=".3" stroke-width="1.4" fill="none"/>`;
      }
      s += '</g>';
    });
  }

  // --- capes
  look.layers.forEach((L, i) => {
    if (L.kind !== 'cape') return;
    const R3 = rng((look.seed || 3) * 13 + i);
    const half = capeHalf(L, R3);
    [half, mirror(half)].forEach((hp, k) => {
      const d = P(hp);
      s += `<path d="${d}" fill="url(#${u}-g-${L.colour})"/><path d="${d}" fill="url(#${u}-vs)"/>`;
      if (k) s += `<path d="${d}" fill="#000" opacity=".22"/>`;
      const id = `${u}-cp${i}${k}`;
      defs += `<clipPath id="${id}"><path d="${d}"/></clipPath>`;
      let inner = '';
      const sgn = k ? -1 : 1;
      for (let j = 0; j < 6; j++) {
        const x0 = 20 + j * 7, x1 = 24 + j * 16 + R3() * 6;
        inner += `<path d="M${f(cx + sgn * x0)} 170Q${f(cx + sgn * (x0 + x1) / 2)} 360 ${f(cx + sgn * x1)} ${L.capeY + 6}" stroke="#000" stroke-opacity=".35" stroke-width="${f(2 + R3() * 3)}" fill="none"/>`;
      }
      if (L.tex === 'lacquer') {
        for (let j = 0; j < 4; j++) {
          const x = 30 + j * 15 + R3() * 6;
          inner += `<path d="M${f(cx + sgn * x)} ${190 + j * 14}Q${f(cx + sgn * (x + 10))} 360 ${f(cx + sgn * (x + 18))} ${L.capeY - 10}" ${rimS(L.colour, k ? 0.22 : 0.5)} stroke-width="${f(1 + R3() * 1.6)}" fill="none" stroke-linecap="round"/>`;
        }
      }
      s += `<g clip-path="url(#${id})">${inner}</g>`;
      s += `<path d="${d}" fill="none" stroke="url(#${u}-r-${L.colour})" stroke-width="1.4"/>`;
    });
  });

  // --- head, hair, headpieces
  const hc = 96;
  const capBun = [[-23, 104, 1], [-24, 84], [-17, 68], [-4, 63], [10, 64], [20, 71], [24, 86], [23, 104, 1], [17, 92], [6, 84], [-8, 84], [-18, 92]];
  const capCrop = [[-24, 112, 1], [-25, 86], [-17, 68], [-3, 62], [12, 64], [22, 72], [25.5, 88], [24, 108, 1], [20, 94], [8, 80], [-6, 82], [-17, 92]];
  if (look.head !== 'hood') {
    s += `<ellipse cx="${cx}" cy="${hc}" rx="22.5" ry="30" fill="url(#${u}-skin)"/>`;
    const cap = look.head === 'bun' || look.head === 'veil' ? capBun : capCrop;
    s += `<path d="${P(cap)}" fill="url(#${u}-hair)"/>`;
    s += `<path d="M${cx + 4} 66Q${cx + 18} 70 ${cx + 22} 84" stroke="#fff" stroke-opacity=".16" stroke-width="1.2" fill="none"/>`;
    if (look.head === 'bun' || look.head === 'veil') {
      s += `<circle cx="${cx + 1}" cy="58" r="12.5" fill="url(#${u}-hair)"/><path d="M${cx - 7} 52Q${cx + 2} 46 ${cx + 10} 53" stroke="#fff" stroke-opacity=".18" stroke-width="1" fill="none"/>`;
    }
  }
  if (look.head === 'brim') {
    s += `<ellipse cx="${cx}" cy="86" rx="22" ry="15" fill="#000" opacity=".32"/>`;
    s += `<path d="${P([[-25, 77, 1], [-23, 50], [-13, 40], [14, 40], [23, 50], [25, 77, 1]])}" fill="url(#${u}-g-noir)"/>`;
    s += `<path d="M${cx - 25} 72Q${cx} 76 ${cx + 25} 72" stroke="#5A1A1F" stroke-width="4" fill="none"/>`;
    s += `<g transform="rotate(-5 ${cx} 78)"><ellipse cx="${cx + 3}" cy="78" rx="78" ry="11.5" fill="url(#${u}-g-noir)"/><ellipse cx="${cx + 3}" cy="78" rx="78" ry="11.5" fill="none" stroke="url(#${u}-r-noir)" stroke-width="1"/></g>`;
  }
  if (look.head === 'veil') {
    const R4 = rng(99);
    const veil = [[0, 58, 1], [20, 64], [36, 110], [58, 250], [80, 420], [96, 580, 1]];
    for (let j = 1; j < 8; j++) veil.push([96 - (192 * j) / 8, 580 + (j % 2 ? 6 : -3) * (0.6 + R4())]);
    const vl = [...veil, ...mirror(veil.slice(0, 6))];
    const d = P(vl);
    defs += `<clipPath id="${u}-vc"><path d="${d}"/></clipPath>`;
    let lines = '';
    for (let j = 0; j < 9; j++) { const x = -70 + j * 17; lines += `<path d="M${cx + x * 0.2} 70Q${cx + x * 0.7} 300 ${cx + x * 1.15} 590" stroke="#fff" stroke-opacity=".16" stroke-width=".7" fill="none"/>`; }
    s += `<path d="${d}" fill="#f6f0e6" fill-opacity=".2"/><g clip-path="url(#${u}-vc)">${lines}</g><path d="${d}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".7"/>`;
  }
  if (look.head === 'hood') {
    const k = mainKey;
    const hood = [[-38, 180, 1], [-42, 128], [-36, 80], [-22, 56], [0, 47], [22, 56], [36, 80], [42, 128], [38, 180, 1], [20, 168], [0, 162], [-20, 168]];
    const d = P(hood);
    defs += `<radialGradient id="${u}-void" cx=".56" cy=".42" r=".62">${stops([[0, '#000'], [0.8, '#0a0807'], [1, '#221c19']])}</radialGradient>`;
    s += `<path d="${d}" fill="url(#${u}-g-${k})"/><path d="${d}" fill="url(#${u}-vs)"/><path d="${d}" fill="none" stroke="url(#${u}-r-${k})" stroke-width="1.4"/>`;
    s += `<ellipse cx="${cx + 1}" cy="99" rx="19.5" ry="28.5" fill="url(#${u}-void)"/>`;
    s += `<path d="M${cx + 13} 73Q${cx + 25} 99 ${cx + 14} 126" ${rimS(k, 0.45)} stroke-width="1.2" fill="none"/>`;
    s += `<path d="M${cx - 30} 140Q${cx} 120 ${cx + 30} 140" stroke="#000" stroke-opacity=".35" stroke-width="3" fill="none"/>`;
  }

  if (o.parts) return { defs, body: s };
  const a11y = o.label ? `role="img" aria-label="${o.label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="render" viewBox="0 0 400 760" preserveAspectRatio="${o.par || 'xMidYMid meet'}" xmlns="http://www.w3.org/2000/svg" ${a11y}><defs>${defs}</defs>${s}</svg>`;
}

/* Hotspot anchor points (viewBox units) for the Coat No. 7 study. */
export function coatHotspots() {
  const L = LOOKS[4].layers[0];
  return [
    { x: 200, y: 132 },
    { x: 200 + L.sh - 4, y: 168 + L.shLift },
    { x: 213, y: 270 },
    { x: 200 + L.waist + 1, y: 302 },
    { x: 200 + L.hemW * 0.62, y: L.hemY - 14 },
  ];
}
