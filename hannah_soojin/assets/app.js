(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  // One shared 4h 56m deadline per visit; both placements stay in sync.
  const countdowns = $$('[data-countdown]');
  if (countdowns.length) {
    let deadline = Date.now() + (4 * 60 + 56) * 60 * 1000;
    const updateCountdown = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      const time = [Math.floor(left / 3600), Math.floor(left / 60) % 60, left % 60].map(n => String(n).padStart(2, '0')).join(':');
      countdowns.forEach(el => { el.textContent = time; });
      return left;
    };
    updateCountdown();
    const countdownTimer = setInterval(() => { if (!updateCountdown()) clearInterval(countdownTimer); }, 1000);
    addEventListener('pageshow', event => {
      if (event.persisted) { deadline = Date.now() + (4 * 60 + 56) * 60 * 1000; updateCountdown(); }
    });
  }

  // stagger children of [data-stagger]
  $$('[data-stagger]').forEach(g => [...g.children].forEach((c, i) => { c.classList.add('reveal'); c.style.setProperty('--d', i * 110 + 'ms'); }));

  // reveal + one-shot triggers
  const targets = $$('.reveal, [data-cascade], [data-timeline], [data-grid]');
  const show = el => {
    el.classList.add('is-visible');
    $$('[data-count]', el).forEach(count);
    if (el.matches('[data-count]')) count(el);
  };
  if (reduce || !('IntersectionObserver' in window)) targets.forEach(show);
  else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(t => io.observe(t));
  }

  // counters
  function count(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const end = +el.dataset.count; if (reduce) { el.textContent = end; return; }
    const t0 = performance.now(), dur = 1300;
    const tick = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
    el.textContent = 0; requestAnimationFrame(tick);
  }

  // header shrink, progress bar, mobile CTA
  const nav = $('.nav'), bar = $('.progress i'), mbar = $('#mbar'), hero = $('#hero'), plans = $('#plans');
  let ticking = false;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('scrolled', y > 20);
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    const past = y > hero.offsetTop + hero.offsetHeight - 120;
    const pr = plans.getBoundingClientRect();
    const atPlans = pr.top < innerHeight * .6 && pr.bottom > 0;
    mbar.classList.toggle('show', past && !atPlans);
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  // hero parallax + 3D tilt
  const stack = $('[data-parallax]');
  if (stack && fine && !reduce) {
    const layers = $$('[data-depth]', stack);
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      stack.style.setProperty('--mx', x.toFixed(3)); stack.style.setProperty('--my', y.toFixed(3));
      layers.forEach(l => { const d = +l.dataset.depth; l.style.translate = `${(x * d).toFixed(1)}px ${(y * d).toFixed(1)}px`; });
    });
    hero.addEventListener('pointerleave', () => { stack.style.setProperty('--mx', 0); stack.style.setProperty('--my', 0); layers.forEach(l => l.style.translate = ''); });
  }
  if (fine && !reduce) $$('.tilt').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.setProperty('--ry', (x * 34).toFixed(1) + 'deg'); el.style.setProperty('--rx', (-y * 22).toFixed(1) + 'deg'); });
    el.addEventListener('pointerleave', () => { el.style.removeProperty('--ry'); el.style.removeProperty('--rx'); });
  });

  // app screens
  const screens = $$('[data-screens] img'), tabs = $$('.tabs button');
  let cur = 0, timer;
  const go = i => { cur = i; screens.forEach((s, k) => s.classList.toggle('on', k === i)); tabs.forEach((t, k) => { t.classList.toggle('on', k === i); t.setAttribute('aria-selected', k === i); }); };
  const auto = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => go((cur + 1) % screens.length), 3200); };
  tabs.forEach((t, i) => t.addEventListener('click', () => { go(i); auto(); }));
  if (screens.length) auto();

  // FAQ accordion (height animated via grid-template-rows)
  $$('.qa button').forEach(b => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') === 'true';
    $$('.qa button[aria-expanded=true]').forEach(o => o.setAttribute('aria-expanded', 'false'));
    b.setAttribute('aria-expanded', String(!open));
  }));

  // upgrade popup
  const dialog = $('#upgrade'), trigger = $('#get-basic');
  if (dialog && trigger && typeof dialog.showModal === 'function') {
    trigger.addEventListener('click', e => { e.preventDefault(); dialog.showModal(); $('.btn', dialog).focus({ preventScroll: true }); });
    $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); });
    dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }));
    dialog.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const items = $$('button,a[href]', dialog), first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();

// v2: arrastar carrosseis (receitas e bonus) com o mouse. Toque ja rola nativamente.
(() => {
  document.querySelectorAll('.rcards, .bgrid').forEach(el => {
    let down = false, moved = false, startX = 0, startLeft = 0;
    el.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) { moved = true; el.classList.add('is-dragging'); }
      if (moved) el.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (!down) return;
      down = false;
      if (moved) {
        const snap = el.scrollLeft;
        el.classList.remove('is-dragging');
        el.scrollTo({ left: snap, behavior: 'smooth' });
      }
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    el.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    el.addEventListener('dragstart', e => e.preventDefault());
  });
})();
