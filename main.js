/* VÉLORA — orchestration. */
import { LOOKS, renderLook } from './looks.js';
import { Silk, SCENE_KEYS } from './silk.js';
import { initObject } from './object.js';
import { initGallery } from './gallery.js';
import { initForm } from './form.js';
import { initMotion } from './motion.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
const app = {
  reduced: mqReduce.matches,
  $, $$,
  scrollToY(y, instant) { window.scrollTo({ top: Math.max(0, y), behavior: instant || app.reduced ? 'auto' : 'smooth' }); },
};
mqReduce.addEventListener('change', (e) => { app.reduced = e.matches; app.silk && app.silk.setReduced(e.matches); });

/* ---------- build: sliced type, word splits, renders ---------- */
$$('[data-slice]').forEach((el) => {
  const t = el.textContent;
  el.innerHTML = `<span class="sl-ghost">${t}</span>` + [0, 1, 2].map((i) => `<span class="sl sl-${i}">${t}</span>`).join('');
});
$$('[data-words]').forEach((el) => {
  const walk = (node) => [...node.childNodes].forEach((n) => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
        else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s); }
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1) walk(n);
  });
  walk(el);
});
$$('[data-look-panel]').forEach((fig, k) => {
  fig.insertAdjacentHTML('afterbegin', renderLook(LOOKS[+fig.dataset.lookPanel], { uid: 'p' + k, par: 'xMidYMid slice' }));
});
$$('.menu__list a').forEach((a, i) => a.style.setProperty('--i', i));

/* ---------- the silk ---------- */
const filmEl = $('#film');
const stage = $('.film__stage');
const canvas = $('.silk__canvas');
const mobile = matchMedia('(max-width: 899px), (pointer: coarse)').matches;
const silk = new Silk(canvas, { reduced: app.reduced, mobile });
app.silk = silk;
const fallbackRing = (x, y) => {
  const r = stage.getBoundingClientRect();
  const el = document.createElement('span');
  el.className = 'ripple-ring';
  el.style.left = (x - r.left) + 'px'; el.style.top = (y - r.top) + 'px';
  $('.silk').appendChild(el);
  el.addEventListener('animationend', () => el.remove());
  setTimeout(() => el.remove(), 2000);
};
if (!silk.ok) filmEl.classList.add('no-webgl');
silk.onlost = () => filmEl.classList.add('no-webgl');
new IntersectionObserver(([e]) => silk.setVisible(e.isIntersecting), { threshold: 0 }).observe(filmEl);

const cursor = $('.film__cursor');
let lastRing = 0;
stage.addEventListener('pointermove', (e) => {
  if (silk.ok) silk.pointer(e.clientX, e.clientY);
  else if (e.pointerType === 'mouse' && performance.now() - lastRing > 260) { lastRing = performance.now(); fallbackRing(e.clientX, e.clientY); }
  if (e.pointerType === 'mouse') {
    const r = stage.getBoundingClientRect();
    cursor.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
    filmEl.classList.add('is-hover');
  }
});
stage.addEventListener('pointerleave', () => { silk.pointerLeave(); filmEl.classList.remove('is-hover', 'is-press'); });
stage.addEventListener('pointerdown', (e) => {
  if (e.target.closest('a, button')) return;
  filmEl.classList.add('is-press');
  if (silk.ok) silk.rippleAt(e.clientX, e.clientY, 0.34); else fallbackRing(e.clientX, e.clientY);
});
addEventListener('pointerup', () => filmEl.classList.remove('is-press'));
$('[data-ripple]').addEventListener('click', () => {
  const r = stage.getBoundingClientRect();
  const x = r.left + r.width * (0.3 + Math.random() * 0.4), y = r.top + r.height * (0.35 + Math.random() * 0.3);
  if (silk.ok) silk.rippleAt(x, y, 0.42); else fallbackRing(x, y);
});

/* ---------- film controller (scroll-scrubbed "cine" or click-through "static") ---------- */
const SCENES = [
  { name: 'Wear the Unseen', num: 'I', theme: 'dark' },
  { name: 'Fabric remembers', num: 'II', theme: 'dark' },
  { name: 'Cut from shadow', num: 'III', theme: 'light' },
  { name: 'Penumbra', num: 'IV', theme: 'dark' },
];
const sceneEls = $$('.scene');
const sceneBtns = $$('[data-go]');
const track = $('.lb__track span');
const film = {
  mode: 'static', idx: -1, st: null,
  setIndex(i) {
    if (i === this.idx) return;
    this.idx = i;
    filmEl.dataset.scene = i;
    $('[data-scene-num]').textContent = SCENES[i].num;
    $('[data-scene-name]').textContent = SCENES[i].name;
    sceneBtns.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    updateChrome();
  },
  fromProgress(p) {
    track.style.transform = `scaleX(${p})`;
    this.setIndex(p < 0.24 ? 0 : p < 0.5125 ? 1 : p < 0.7875 ? 2 : 3);
  },
  go(i) {
    if (this.mode === 'cine' && this.st) {
      const st = this.st;
      app.scrollToY(st.start + (st.end - st.start) * SCENE_KEYS[i]);
    } else this.show(i);
  },
  show(i) {
    sceneEls.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.toggleAttribute('inert', k !== i); });
    track.style.transform = `scaleX(${SCENE_KEYS[i]})`;
    silk.tweenTo(SCENE_KEYS[i]);
    this.setIndex(i);
  },
  setMode(cine) {
    this.mode = cine ? 'cine' : 'static';
    root.classList.toggle('is-cine', cine);
    if (cine) sceneEls.forEach((s) => { s.classList.remove('is-active'); s.removeAttribute('inert'); });
    else { this.st = null; this.show(Math.max(0, this.idx)); }
  },
};
app.film = film;
sceneBtns.forEach((b) => b.addEventListener('click', () => film.go(+b.dataset.go)));

/* ---------- chrome: timecode, progress, header theme, active nav ---------- */
const tcEl = $('[data-tc]');
const progEl = $('.hdr__progress span');
const themed = $$('[data-theme]');
const navLinks = $$('.hdr__nav a');
const FILM_SECONDS = 252;
let chromeQueued = false;
function updateChrome() {
  chromeQueued = false;
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const p = Math.min(1, Math.max(0, scrollY / max));
  progEl.style.transform = `scaleX(${p})`;
  const total = p * FILM_SECONDS;
  const fr = Math.floor((total % 1) * 24);
  const pad = (n) => String(Math.floor(n)).padStart(2, '0');
  tcEl.textContent = `00:${pad(total / 60)}:${pad(total % 60)}:${pad(fr)}`;
  let theme = 'dark', current = 'film';
  const fr0 = filmEl.getBoundingClientRect();
  if (fr0.top <= 40 && fr0.bottom > 40) theme = SCENES[Math.max(0, film.idx)].theme;
  else themed.forEach((s) => { const r = s.getBoundingClientRect(); if (r.top <= 40 && r.bottom > 40) { theme = s.dataset.theme; current = s.id; } });
  root.dataset.hdr = theme;
  navLinks.forEach((a) => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + current)));
}
addEventListener('scroll', () => { if (!chromeQueued) { chromeQueued = true; requestAnimationFrame(updateChrome); } }, { passive: true });
addEventListener('resize', () => requestAnimationFrame(updateChrome));

/* ---------- menu ---------- */
const menuBtn = $('.hdr__menu');
const menu = $('#menu');
function setMenu(open) {
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.querySelector('.hdr__menu-l').textContent = open ? 'Close' : 'Menu';
  root.classList.toggle('menu-open', open);
  ['main', 'footer'].forEach((s) => $(s).toggleAttribute('inert', open));
  if (open) $('.menu__list a').focus();
}
menuBtn.addEventListener('click', () => setMenu(menu.hidden));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

/* ---------- in-page navigation (smooth, focus-managed, hash kept) ---------- */
function targetY(el) { return el.id === 'film' || el.id === 'top' ? 0 : el.getBoundingClientRect().top + scrollY; }
function goHash(hash, push, instant) {
  const el = hash && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
  if (!el) return false;
  app.scrollToY(targetY(el), instant);
  if (push) history.pushState(null, '', hash);
  const focusEl = el.id === 'top' ? $('#film') : el;
  if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
  focusEl.focus({ preventScroll: true });
  return true;
}
app.goHash = goHash;
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
  const hash = a.getAttribute('href');
  if (!document.getElementById(hash.slice(1))) return;
  e.preventDefault();
  if (!menu.hidden) setMenu(false);
  goHash(hash, true);
});
addEventListener('popstate', () => { if (location.hash) goHash(location.hash, false, true); });

/* ---------- atelier steps ---------- */
const board = $('[data-board]');
const steps = $$('.step');
const CAPS = ['Stage 01 · Croquis', 'Stage 02 · Pattern', 'Stage 03 · Toile & cut', 'Stage 04 · Drape'];
const stepIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const n = +en.target.dataset.step;
    steps.forEach((s) => s.classList.toggle('is-on', s === en.target));
    for (let k = 1; k <= 4; k++) board.classList.toggle('s' + k, k <= n);
    $('[data-step-cap]').textContent = CAPS[n - 1];
  });
}, { rootMargin: '-45% 0px -45% 0px' });
steps.forEach((s) => stepIO.observe(s));

/* ---------- archive index ---------- */
const preview = $('.archive__preview');
const thumbCache = {};
const thumb = (i) => thumbCache[i] || (thumbCache[i] = renderLook(LOOKS[i], { uid: 'a' + i }));
$$('.arow').forEach((row) => {
  const btn = row.querySelector('.arow__btn');
  const panel = row.querySelector('.arow__panel');
  const i = +row.dataset.thumb;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) {
      const t = panel.querySelector('.arow__thumb');
      if (!t.firstChild) t.innerHTML = renderLook(LOOKS[i], { uid: 'ap' + i });
    }
  });
  btn.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'mouse') return; preview.innerHTML = thumb(i); preview.classList.add('is-on'); });
  btn.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
  btn.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const x = Math.min(innerWidth - 210, e.clientX + 28), y = Math.min(innerHeight - 380, Math.max(10, e.clientY - 180));
    preview.style.transform = `translate(${x}px, ${y}px)`;
  });
});

/* ---------- modules ---------- */
initObject({ reduced: () => app.reduced });
const form = initForm(app);
app.requestLook = (i) => { form.preselect(i); goHash('#appointment', true); setTimeout(() => $('#f-name').focus({ preventScroll: true }), app.reduced ? 0 : 900); };
$$('[data-request]').forEach((b) => b.addEventListener('click', () => app.requestLook(+b.dataset.request)));
initGallery(app);

/* ---------- start: static first, then the film if GSAP + motion allowed ---------- */
film.setMode(false);
if (!app.reduced && scrollY < 40 && !location.hash) {
  root.classList.add('is-intro');
  setTimeout(() => root.classList.remove('is-intro'), 2600);
}
const start = () => {
  initMotion(app);
  const restore = () => { if (location.hash) goHash(location.hash, false, true); updateChrome(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { window.ScrollTrigger && window.ScrollTrigger.refresh(); restore(); });
  else restore();
};
if (window.gsap && window.ScrollTrigger) start();
else addEventListener('load', start, { once: true });
updateChrome();
