/* VÉLORA — scroll choreography (GSAP + ScrollTrigger). Only runs when motion is allowed. */

export function initMotion(app) {
  const gsap = window.gsap, ST = window.ScrollTrigger;
  const root = document.documentElement;
  if (!gsap || !ST) { app.film.setMode(false); return; }
  gsap.registerPlugin(ST);
  ST.config({ ignoreMobileResize: true });
  const mm = gsap.matchMedia();

  mm.add({ motion: '(prefers-reduced-motion: no-preference)', wide: '(min-width: 900px)' }, (ctx) => {
    const { motion, wide } = ctx.conditions;
    if (!motion) { app.film.setMode(false); return; }
    app.film.setMode(true);
    film(gsap, app);
    if (wide) { root.classList.add('is-wide'); looksTrack(gsap, app); }
    reveals(gsap, app);
    return () => {
      root.classList.remove('is-wide');
      if (app.looks) { app.looks.mode = 'native'; app.looks.st = null; }
      app.film.setMode(false);
    };
  });
}

function film(gsap, app) {
  const stage = document.querySelector('.film__stage');
  const S = [...stage.querySelectorAll('.scene')];
  const q = (el, sel) => el.querySelectorAll(sel);
  gsap.set([S[1], S[2], S[3]], { autoAlpha: 0 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage, start: 'top top', end: () => '+=' + Math.round(innerHeight * 4.2),
      pin: true, scrub: 0.9, anticipatePin: 1, invalidateOnRefresh: true,
      onUpdate: (self) => { app.silk.setProgress(self.progress); app.film.fromProgress(self.progress); },
    },
  });
  app.film.st = tl.scrollTrigger;

  // I — Wear the Unseen: slow push, then the type slices apart
  const s1 = S[0];
  tl.to(q(s1, '.slice-wrap'), { scale: 1.05, duration: 0.7 }, 0)
    .to(q(s1, '.sl-0'), { xPercent: -16, duration: 0.5, ease: 'power2.in' }, 0.6)
    .to(q(s1, '.sl-1'), { xPercent: 9, duration: 0.5, ease: 'power2.in' }, 0.6)
    .to(q(s1, '.sl-2'), { xPercent: -5, duration: 0.5, ease: 'power2.in' }, 0.6)
    .to(q(s1, '.sl'), { opacity: 0, duration: 0.25 }, 0.85)
    .to(q(s1, '.kicker, .subtitle'), { opacity: 0, y: -16, duration: 0.3 }, 0.6)
    .to(s1, { autoAlpha: 0, duration: 0.05 }, 1.1);

  // II — Fabric remembers: a vertical slit opens on the look, lines rise from masks
  const s2 = S[1], p2 = s2.querySelector('.panel'), a2 = p2.querySelector('svg');
  tl.to(s2, { autoAlpha: 1, duration: 0.05 }, 0.85)
    .fromTo(p2, { clipPath: 'inset(0% 50% 0% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'power2.out' }, 0.88)
    .fromTo(a2, { scale: 1.3 }, { scale: 1, duration: 0.9, ease: 'power1.out' }, 0.88)
    .fromTo(q(s2, '.mask-line > span'), { yPercent: 110 }, { yPercent: 0, duration: 0.35, stagger: 0.08, ease: 'power3.out' }, 1.0)
    .fromTo(q(s2, '.kicker, .subtitle, figcaption'), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.05 }, 1.15)
    .to(p2, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.4, ease: 'power2.in' }, 1.85)
    .to(q(s2, '.mask-line > span'), { yPercent: -110, duration: 0.3, stagger: 0.05, ease: 'power2.in' }, 1.85)
    .to(q(s2, '.kicker, .subtitle, figcaption'), { opacity: 0, duration: 0.2 }, 1.85)
    .to(s2, { autoAlpha: 0, duration: 0.05 }, 2.25);

  // III — Cut from shadow: diagonal wipe on bone silk, slices converge then scatter
  const s3 = S[2], p3 = s3.querySelector('.panel'), a3 = p3.querySelector('svg');
  tl.to(s3, { autoAlpha: 1, duration: 0.05 }, 2.0)
    .fromTo(p3, { clipPath: 'polygon(0% 0%, 0% 0%, -30% 100%, -30% 100%)' }, { clipPath: 'polygon(0% 0%, 130% 0%, 100% 100%, -30% 100%)', duration: 0.45, ease: 'power2.inOut' }, 2.02)
    .fromTo(a3, { scale: 1.25, xPercent: -6 }, { scale: 1, xPercent: 0, duration: 0.9 }, 2.02)
    .fromTo(q(s3, '.sl-0'), { xPercent: 22 }, { xPercent: 0, duration: 0.45, ease: 'power3.out' }, 2.05)
    .fromTo(q(s3, '.sl-1'), { xPercent: -14 }, { xPercent: 0, duration: 0.45, ease: 'power3.out' }, 2.08)
    .fromTo(q(s3, '.sl-2'), { xPercent: 9 }, { xPercent: 0, duration: 0.45, ease: 'power3.out' }, 2.11)
    .fromTo(q(s3, '.sl'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 2.05)
    .fromTo(q(s3, '.kicker, .subtitle, figcaption'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 2.3)
    .to(q(s3, '.sl-0'), { xPercent: -20, duration: 0.4, ease: 'power2.in' }, 2.95)
    .to(q(s3, '.sl-1'), { xPercent: 12, duration: 0.4, ease: 'power2.in' }, 2.95)
    .to(q(s3, '.sl-2'), { xPercent: -7, duration: 0.4, ease: 'power2.in' }, 2.95)
    .to(q(s3, '.sl, .kicker, .subtitle, figcaption'), { opacity: 0, duration: 0.2 }, 3.15)
    .to(p3, { clipPath: 'polygon(100% 0%, 130% 0%, 100% 100%, 70% 100%)', duration: 0.4, ease: 'power2.in' }, 2.95)
    .to(s3, { autoAlpha: 0, duration: 0.05 }, 3.38);

  // IV — title card: the frame narrows to scope, the title opens like an iris
  const s4 = S[3];
  tl.to(s4, { autoAlpha: 1, duration: 0.05 }, 3.1)
    .fromTo('.matte', { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: 'power2.inOut' }, 3.0)
    .fromTo(s4.querySelector('.t-card'), { clipPath: 'inset(50% 0% 50% 0%)', letterSpacing: '0.4em' }, { clipPath: 'inset(-10% -5% -10% -5%)', letterSpacing: '0.02em', duration: 0.5, ease: 'power3.out' }, 3.15)
    .fromTo(q(s4, '.kicker, .card__sub, .btn, .subtitle'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.06 }, 3.4)
    .to({}, { duration: 0.15 }, 3.85);
}

function looksTrack(gsap, app) {
  const pin = document.querySelector('.looks__pin');
  const row = document.querySelector('.looks__row');
  const dist = () => Math.max(0, row.scrollWidth - innerWidth);
  const tween = gsap.to(row, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: {
      trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true,
      onUpdate: (self) => app.looks.setCount(self.progress),
    },
  });
  app.looks.mode = 'cine';
  app.looks.st = tween.scrollTrigger;
  row.querySelectorAll('.look').forEach((card) => {
    const frame = card.querySelector('.look__frame');
    const svg = frame.querySelector('svg');
    gsap.fromTo(frame, { clipPath: 'inset(6% 48% 6% 48%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 62%', scrub: true },
    });
    gsap.fromTo(svg, { xPercent: 6 }, {
      xPercent: -6, ease: 'none',
      scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
    });
  });
}

function reveals(gsap) {
  document.querySelectorAll('.wipe').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(-10% 100% -20% 0%)' }, {
      clipPath: 'inset(-10% 0% -20% 0%)', duration: 1.2, ease: 'expo.inOut',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
    });
  });
  gsap.fromTo('.obj__stage', { clipPath: 'inset(100% 0% 0% 0%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut',
    scrollTrigger: { trigger: '.obj__stage', start: 'top 82%' },
  });
  gsap.fromTo('.obj__num', { yPercent: 18 }, { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '#object', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.to('.manifesto .w', {
    opacity: 1, stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: '.manifesto__text', start: 'top 78%', end: 'bottom 45%', scrub: true },
  });
  gsap.fromTo('.arow', { '--line-s': 0 }, {
    '--line-s': 1, duration: 1.1, stagger: 0.08, ease: 'expo.inOut',
    scrollTrigger: { trigger: '.archive__list', start: 'top 85%' },
  });
  gsap.from('.arow__t', {
    yPercent: 60, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out', clearProps: 'transform,opacity',
    scrollTrigger: { trigger: '.archive__list', start: 'top 85%' },
  });
  gsap.from('.credits__roll', { y: '18vh', ease: 'none', scrollTrigger: { trigger: '.credits', start: 'top bottom', end: 'top 25%', scrub: true } });
}
