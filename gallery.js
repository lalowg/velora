/* VÉLORA — the look track (pinned horizontal film strip or native swipe) + lightbox. */
import { LOOKS, renderLook } from './looks.js';

export function initGallery(app) {
  const { $, $$ } = app;
  const root = document.documentElement;
  const trackEl = $('[data-track]');
  const row = $('.looks__row');
  const N = LOOKS.length;

  trackEl.innerHTML = LOOKS.map((L, i) => `
    <li class="look">
      <button class="look__btn" type="button" data-look="${i}" aria-haspopup="dialog" aria-label="Look ${L.n}, ${L.name}: ${L.piece}. Open details">
        <span class="look__frame">${renderLook(L, { uid: 't' + i })}<span class="look__sweep" aria-hidden="true"></span></span>
        <span class="look__cap"><span class="look__n" aria-hidden="true">${L.n}</span><span class="look__name">${L.name}</span><span class="look__mat">${L.material}</span></span>
      </button>
    </li>`).join('');
  const cards = $$('.look', trackEl);
  const countEl = $('[data-look-count]');
  const barEl = $('.looks__bar span');

  const looks = { mode: 'native', st: null, idx: 0 };
  app.looks = looks;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const scroller = () => {
    const ox = getComputedStyle(row).overflowX;
    return ox === 'auto' || ox === 'scroll' ? row : trackEl;
  };
  const setCount = (p) => {
    looks.idx = Math.round(clamp(p, 0, 1) * (N - 1));
    countEl.textContent = String(looks.idx + 1).padStart(2, '0');
    barEl.style.transform = `scaleX(${clamp(p, 0, 1)})`;
  };
  looks.setCount = setCount;

  const onNative = () => {
    if (looks.mode !== 'native') return;
    const sc = scroller();
    const max = sc.scrollWidth - sc.clientWidth;
    setCount(max > 0 ? sc.scrollLeft / max : 0);
  };
  row.addEventListener('scroll', onNative, { passive: true });
  trackEl.addEventListener('scroll', onNative, { passive: true });

  function goLook(i, instant) {
    i = clamp(i, 0, N - 1);
    const card = cards[i];
    const cr = card.getBoundingClientRect();
    if (looks.mode === 'cine' && looks.st) {
      const rr = row.getBoundingClientRect();
      const dist = row.scrollWidth - innerWidth;
      const x = (cr.left - rr.left) + cr.width / 2 - innerWidth / 2;
      const st = looks.st;
      app.scrollToY(st.start + (st.end - st.start) * clamp(x / Math.max(1, dist), 0, 1), instant);
    } else {
      const sc = scroller();
      const sr = sc.getBoundingClientRect();
      sc.scrollTo({ left: sc.scrollLeft + (cr.left - sr.left) - (sc.clientWidth - cr.width) / 2, behavior: instant || app.reduced ? 'auto' : 'smooth' });
    }
    looks.idx = i;
  }
  $('[data-track-prev]').addEventListener('click', () => goLook(looks.idx - 1));
  $('[data-track-next]').addEventListener('click', () => goLook(looks.idx + 1));
  trackEl.addEventListener('focusin', (e) => {
    const b = e.target.closest('[data-look]');
    if (b && b.matches(':focus-visible')) goLook(+b.dataset.look, true);
  });

  /* ---------- lightbox ---------- */
  const dlg = $('#lightbox');
  const art = $('[data-lbx-art]');
  let cur = 0, opener = null;
  const set = (sel, v) => { $(sel, dlg).textContent = v; };
  function fill(i, dir) {
    cur = (i + N) % N;
    const L = LOOKS[cur];
    art.innerHTML = renderLook(L, { uid: 'lb', label: `Illustrative render of look ${L.n}, ${L.name}: ${L.piece}` });
    set('[data-lbx-n]', `Look ${L.n}`);
    set('[data-lbx-i]', `${String(cur + 1).padStart(2, '0')} / ${N}`);
    set('[data-lbx-name]', L.name);
    set('[data-lbx-piece]', L.piece);
    set('[data-lbx-mat]', L.material);
    set('[data-lbx-col]', L.colour);
    set('[data-lbx-note]', L.note);
    art.classList.remove('is-open', 'is-next', 'is-prev');
    void art.offsetWidth;
    art.classList.add(dir > 0 ? 'is-next' : dir < 0 ? 'is-prev' : 'is-open');
  }
  function open(i, btn) {
    opener = btn;
    fill(i, 0);
    root.classList.add('is-locked');
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    $('[data-lbx-close]', dlg).focus();
  }
  function close() { if (typeof dlg.close === 'function') dlg.close(); else { dlg.removeAttribute('open'); onClose(); } }
  function onClose() { root.classList.remove('is-locked'); opener && opener.focus({ preventScroll: true }); }
  dlg.addEventListener('close', onClose);
  trackEl.addEventListener('click', (e) => { const b = e.target.closest('[data-look]'); if (b) open(+b.dataset.look, b); });
  $('[data-lbx-close]', dlg).addEventListener('click', close);
  $('[data-lbx-prev]', dlg).addEventListener('click', () => fill(cur - 1, -1));
  $('[data-lbx-next]', dlg).addEventListener('click', () => fill(cur + 1, 1));
  $('[data-lbx-request]', dlg).addEventListener('click', () => { const i = cur; opener = null; close(); app.requestLook(i); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); fill(cur + 1, 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); fill(cur - 1, -1); }
  });
  let sx = null, sy = 0;
  art.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; });
  art.addEventListener('pointerup', (e) => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) fill(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  art.addEventListener('pointercancel', () => { sx = null; });

  setCount(0);
  return looks;
}
