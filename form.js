/* VÉLORA — private viewing request. Validated in the browser; nothing is ever sent. */
import { LOOKS } from './looks.js';

export function initForm(app) {
  const { $, $$ } = app;
  const form = $('.form');
  const done = $('.form__done');
  const summary = $('.form__summary', form);
  const chips = $('[data-chips]', form);
  chips.innerHTML = LOOKS.map((L, i) => `<label class="chip"><input type="checkbox" name="looks" value="${i}"><span><b>${L.n}</b>${L.name}</span></label>`).join('');

  const date = $('#f-date');
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const yearOut = new Date(today); yearOut.setFullYear(today.getFullYear() + 1);
  date.min = iso(tomorrow); date.max = iso(yearOut);

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const rules = {
    name: () => { const v = $('#f-name').value.trim(); return v.length < 2 ? 'Please tell us your name.' : ''; },
    email: () => {
      const v = $('#f-email').value.trim();
      if (!v) return 'We need an email address to reply to.';
      return EMAIL.test(v) ? '' : 'That email looks incomplete — check for a missing @ or domain.';
    },
    salon: () => (form.querySelector('input[name="salon"]:checked') ? '' : 'Choose the salon you would like to visit.'),
    date: () => {
      const v = date.value;
      if (!v) return 'Pick a preferred date.';
      const d = new Date(v + 'T00:00:00');
      if (isNaN(d)) return 'Use the date picker to choose a valid date.';
      if (d < tomorrow) return 'Choose a date from tomorrow onwards.';
      if (d > yearOut) return 'We schedule up to a year ahead — choose an earlier date.';
      return '';
    },
    consent: () => ($('#f-consent').checked ? '' : 'Please confirm we may contact you about this viewing.'),
  };
  const targets = { name: '#f-name', email: '#f-email', salon: '#f-salon input', date: '#f-date', consent: '#f-consent' };
  const labels = { name: 'Full name', email: 'Email', salon: 'Salon', date: 'Preferred date', consent: 'Consent' };
  let tried = false;

  function show(key, msg) {
    const err = $('#err-' + key);
    const inputs = key === 'salon' ? $$('#f-salon input') : [$(targets[key])];
    err.textContent = msg;
    err.hidden = !msg;
    inputs.forEach((el) => {
      if (msg) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', 'err-' + key); }
      else { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); }
    });
    if (key === 'salon') $('#f-salon').classList.toggle('is-invalid', !!msg);
  }
  const check = (key) => { const m = rules[key](); show(key, m); return m; };

  Object.keys(rules).forEach((key) => {
    const els = key === 'salon' ? $$('#f-salon input') : [$(targets[key])];
    els.forEach((el) => {
      el.addEventListener(el.type === 'checkbox' || el.type === 'radio' ? 'change' : 'blur', () => { if (tried) check(key); });
      el.addEventListener('input', () => { if (tried && el.getAttribute('aria-invalid')) check(key); });
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    tried = true;
    const errors = Object.keys(rules).map((k) => [k, check(k)]).filter(([, m]) => m);
    if (errors.length) {
      summary.hidden = false;
      summary.setAttribute('role', 'alert');
      summary.innerHTML = `<p>${errors.length === 1 ? 'One detail needs attention' : `${errors.length} details need attention`}.</p><ul>${errors.map(([k, m]) => `<li><a href="#err-${k}" data-fix="${k}">${labels[k]}: ${m}</a></li>`).join('')}</ul>`;
      summary.focus();
      return;
    }
    summary.hidden = true;
    const salon = form.querySelector('input[name="salon"]:checked').value;
    const d = new Date(date.value + 'T00:00:00');
    const when = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const picked = $$('input[name="looks"]:checked', form).map((c) => LOOKS[+c.value].name);
    const first = $('#f-name').value.trim().split(/\s+/)[0];
    $('[data-done-text]').textContent = `Thank you, ${first}. You asked for the ${salon} salon on ${when}${picked.length ? `, with ${picked.join(', ')} on the rail` : ''}. This is a portfolio demonstration: nothing was sent, no data left your browser and no appointment has been booked.`;
    form.hidden = true;
    done.hidden = false;
    done.focus();
  });
  summary.addEventListener('click', (e) => {
    const a = e.target.closest('[data-fix]');
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    const el = $(targets[a.dataset.fix]);
    el.focus();
  });
  $('[data-reset]').addEventListener('click', () => {
    form.reset();
    tried = false;
    Object.keys(rules).forEach((k) => show(k, ''));
    summary.hidden = true;
    done.hidden = true;
    form.hidden = false;
    $('#f-name').focus();
  });

  return {
    preselect(i) {
      if (form.hidden) { done.hidden = true; form.hidden = false; }
      const box = form.querySelector(`input[name="looks"][value="${i}"]`);
      if (box) box.checked = true;
    },
  };
}
