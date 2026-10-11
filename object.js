/* VÉLORA — Coat No. 7 study: colourways, construction hotspots and a detail loupe. */
import { LOOKS, renderLook, coatHotspots } from './looks.js';

const DETAILS = [
  { t: 'Stand collar', d: 'Hand-padded so it stands on its own and frames the jaw, then softens with wear.' },
  { t: 'Roped shoulder', d: 'A raised sleeve head holds one clean, architectural line from collar to cuff.' },
  { t: 'Horn buttons', d: 'Six buttons on hand-wound shanks, set so the double front lies flat when closed.' },
  { t: 'Pressed waist', d: 'Shaped with steam and an internal stay rather than darts alone, so the waist stays put.' },
  { t: 'Weighted hem', d: 'A deep, weighted turn-up gives the flared skirt its slow, heavy swing.' },
];
const COLOURWAY_NAMES = { noir: 'Noir melton', oxblood: 'Oxblood melton', bone: 'Bone melton' };
const Z = 2.6, RAD = 66;

export function initObject({ reduced = () => false } = {}) {
  const stage = document.querySelector('.obj__stage');
  if (!stage) return;
  const { defs, body } = renderLook(LOOKS[4], { uid: 'obj', vars: true, detail: true, parts: true });
  stage.insertAdjacentHTML('afterbegin',
    `<svg class="obj__svg" viewBox="0 0 400 760" aria-hidden="true" focusable="false"><defs>${defs}<clipPath id="obj-lens-clip"><circle class="lens-clip" cx="200" cy="300" r="${RAD}"/></clipPath></defs>` +
    `<g id="obj-art">${body}</g><g class="lens" clip-path="url(#obj-lens-clip)"><use href="#obj-art" class="lens-use"/></g>` +
    `<circle class="lens-ring" cx="200" cy="300" r="${RAD}"/><circle class="lens-ring lens-ring--in" cx="200" cy="300" r="${RAD - 5}"/></svg>`);
  const svg = stage.querySelector('.obj__svg');
  const clip = svg.querySelector('.lens-clip');
  const rings = svg.querySelectorAll('.lens-ring');
  const use = svg.querySelector('.lens-use');

  // hotspots over the render
  const pts = coatHotspots();
  pts.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hot';
    b.tabIndex = -1;
    b.setAttribute('aria-hidden', 'true');
    b.style.left = (p.x / 400 * 100) + '%';
    b.style.top = (p.y / 760 * 100) + '%';
    b.textContent = String(i + 1);
    b.addEventListener('click', (e) => { e.stopPropagation(); select(i); });
    stage.appendChild(b);
  });
  const hots = [...stage.querySelectorAll('.hot')];
  const list = [...document.querySelectorAll('[data-detail]')];
  const note = document.querySelector('[data-detail-note]');
  const loupeBtn = document.querySelector('[data-loupe]');

  let loupeOn = true, shown = false;
  const cur = { x: 200, y: 300 }, tgt = { x: 200, y: 300 };
  let raf = 0;

  const apply = () => {
    clip.setAttribute('cx', cur.x.toFixed(1)); clip.setAttribute('cy', cur.y.toFixed(1));
    rings.forEach((r) => { r.setAttribute('cx', cur.x.toFixed(1)); r.setAttribute('cy', cur.y.toFixed(1)); });
    use.setAttribute('transform', `translate(${cur.x.toFixed(1)} ${cur.y.toFixed(1)}) scale(${Z}) translate(${(-cur.x).toFixed(1)} ${(-cur.y).toFixed(1)})`);
  };
  const tick = () => {
    raf = 0;
    const k = reduced() ? 1 : 0.22;
    cur.x += (tgt.x - cur.x) * k; cur.y += (tgt.y - cur.y) * k;
    apply();
    if (Math.abs(tgt.x - cur.x) > 0.2 || Math.abs(tgt.y - cur.y) > 0.2) raf = requestAnimationFrame(tick);
  };
  const moveTo = (x, y, jump) => {
    tgt.x = Math.min(400 - 20, Math.max(20, x)); tgt.y = Math.min(740, Math.max(20, y));
    if (jump) { cur.x = tgt.x; cur.y = tgt.y; apply(); return; }
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const show = (v) => { shown = v && loupeOn; stage.classList.toggle('is-loupe', shown); };
  const toSvg = (e) => {
    const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const m = svg.getScreenCTM(); if (!m) return null;
    return pt.matrixTransform(m.inverse());
  };

  stage.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { const p = toSvg(e); if (p) moveTo(p.x, p.y, !shown); show(true); } });
  stage.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse' && shown) { const p = toSvg(e); if (p) moveTo(p.x, p.y); } });
  stage.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') show(false); });
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' || e.target.closest('.hot')) return;
    const p = toSvg(e); if (!p) return;
    moveTo(p.x, p.y, !shown); show(true);
  });
  stage.addEventListener('focus', () => { show(true); });
  stage.addEventListener('blur', () => show(false));
  stage.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 36 : 12;
    const map = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (map[e.key]) { e.preventDefault(); if (!shown) show(true); moveTo(tgt.x + map[e.key][0], tgt.y + map[e.key][1]); }
    if (e.key === 'Escape') show(false);
  });

  function select(i) {
    list.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    hots.forEach((h, k) => h.classList.toggle('is-on', k === i));
    if (note) note.innerHTML = `<b>${String(i + 1).padStart(2, '0')} — ${DETAILS[i].t}.</b> ${DETAILS[i].d}`;
    moveTo(pts[i].x, pts[i].y + (i === 4 ? -6 : 0), !shown);
    show(true);
  }
  list.forEach((b, i) => b.addEventListener('click', () => select(i)));

  loupeBtn && loupeBtn.addEventListener('click', () => {
    loupeOn = !loupeOn;
    loupeBtn.setAttribute('aria-pressed', String(loupeOn));
    loupeBtn.textContent = loupeOn ? 'Loupe on' : 'Loupe off';
    show(loupeOn);
  });

  // colourways
  const nameEl = document.querySelector('[data-swatch-name]');
  document.querySelectorAll('input[name="colourway"]').forEach((r) => r.addEventListener('change', () => {
    if (!r.checked) return;
    stage.dataset.colour = r.value;
    if (nameEl) nameEl.textContent = COLOURWAY_NAMES[r.value];
  }));
  apply();
}
