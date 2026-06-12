/* ============================================================
   Miyabi Tamura — Portfolio interactions
   ============================================================ */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeToggle = $('#themeToggle');
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);
  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ---------- Navbar scroll state + scroll progress ---------- */
  const nav = $('#nav');
  const progress = $('#scrollProgress');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = $('#navBurger');
  const navLinks = $('#navLinks');
  const closeMenu = () => { navLinks.classList.remove('is-open'); burger.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); };
  burger?.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#navLinks a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Reveal on scroll ---------- */
  $$('.reveal[data-delay]').forEach(el => el.style.setProperty('--d', el.dataset.delay));
  const revealIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // animate skill bars within / for the element
        $$('.bar__track i', entry.target).forEach(bar => { bar.style.width = bar.dataset.w + '%'; });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => revealIO.observe(el));

  // Skill bars may live outside a .reveal wrapper — observe their container too
  const barsWrap = $('.skills__bars');
  if (barsWrap) {
    const barIO = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          $$('.bar__track i', e.target).forEach(b => { b.style.width = b.dataset.w + '%'; });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    barIO.observe(barsWrap);
  }

  /* ---------- Animated counters ---------- */
  const animateCount = (el) => {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const val = Math.floor(ease(p) * target);
      el.textContent = val.toLocaleString() + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        if (reduceMotion) {
          e.target.textContent = (+e.target.dataset.target).toLocaleString() + (e.target.dataset.suffix || '');
        } else {
          animateCount(e.target);
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  $$('.counter').forEach(c => countIO.observe(c));

  /* ---------- Active nav link via sections ---------- */
  const sections = $$('main section[id]');
  const linkFor = id => $(`#navLinks a[href="#${id}"]`);
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('#navLinks a').forEach(a => a.classList.remove('is-active'));
        linkFor(e.target.id)?.classList.add('is-active');
      }
    });
  }, { threshold: 0.5, rootMargin: '-20% 0px -40% 0px' });
  sections.forEach(s => navIO.observe(s));

  /* ---------- Hero rotating word ---------- */
  const rotator = $('#rotator');
  if (rotator && !reduceMotion) {
    const words = ['SaaS platforms', 'AI-powered systems', 'eCommerce stores', 'booking systems', 'CRM platforms', 'automation tools'];
    let i = 0, char = 0, deleting = false;
    const type = () => {
      const word = words[i];
      char += deleting ? -1 : 1;
      rotator.textContent = word.slice(0, char);
      let delay = deleting ? 45 : 90;
      if (!deleting && char === word.length) { delay = 1600; deleting = true; }
      else if (deleting && char === 0) { deleting = false; i = (i + 1) % words.length; delay = 350; }
      setTimeout(type, delay);
    };
    setTimeout(type, 900);
  }

  /* ---------- Project filtering ---------- */
  const filters = $('#filters');
  const projects = $$('#projects .project');
  filters?.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    $$('.filter', filters).forEach(f => f.classList.remove('is-active'));
    btn.classList.add('is-active');
    const cat = btn.dataset.filter;
    projects.forEach(p => {
      const match = cat === 'all' || (p.dataset.cat || '').split(' ').includes(cat);
      p.classList.toggle('is-hidden', !match);
    });
  });

  /* ---------- Cursor glow ---------- */
  const glow = $('#cursorGlow');
  if (glow && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    const follow = () => {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx - 230}px, ${cy - 230}px)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ---------- Contact form (mailto, no backend) ---------- */
  const form = $('#contactForm');
  const note = $('#formNote');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name'), email = $('#email'), message = $('#message');
    let ok = true;
    [name, email, message].forEach(input => {
      const valid = input.value.trim() !== '' && (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value));
      input.parentElement.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      note.textContent = 'Please complete all fields with a valid email.';
      note.className = 'form-note err';
      return;
    }
    const subject = encodeURIComponent(`New project inquiry from ${name.value.trim()}`);
    const body = encodeURIComponent(`Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\n${message.value.trim()}`);
    window.location.href = `mailto:croudworks1212@gmail.com?subject=${subject}&body=${body}`;
    note.textContent = 'Opening your email client… Thank you! I will reply within 24 hours.';
    note.className = 'form-note ok';
    form.reset();
  });

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) {
    const m = document.lastModified && Date.parse(document.lastModified);
    yearEl.textContent = String(new Date(m || Date.now()).getFullYear());
  }
})();
