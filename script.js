const btn = document.querySelector('.menu-btn');
const links = document.querySelector('.nav-links');

if (btn) {
  btn.addEventListener('click', () => links.classList.toggle('open'));
}

links.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => links.classList.remove('open'));
});

// Loader personal — typing
const typedEl = document.getElementById('typed');
const msg = 'Hola, soy Joaco.';
let ti = 0;

const typeStep = () => {
  if (!typedEl) return;
  if (ti <= msg.length) {
    typedEl.textContent = msg.slice(0, ti);
    ti++;
    setTimeout(typeStep, 95);
  }
};
typeStep();

window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader')?.classList.add('done'), 2100);
});
setTimeout(() => document.getElementById('loader')?.classList.add('done'), 4000);

// Contadores
const counters = document.querySelectorAll('.count');

const animateCount = (el) => {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const dur = 1400;
  const start = performance.now();

  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      animateCount(en.target);
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach((c) => io.observe(c));

// Entrada — reveal genérico
const revealEls = document.querySelectorAll('.section, .work-item, .serv, .quote');

revealEls.forEach((el) => {
  if (!el.classList.contains('reveal')) el.classList.add('reveal');
});

const rio = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('visible');
      rio.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => rio.observe(el));

// Cotización → WhatsApp
const WHATSAPP_NUMBER = '5493514089711';

document.getElementById('quote-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const lines = [
    'Hola Joaco, soy ' + (f.get('nombre') || '') + '.',
    'Necesito: ' + (f.get('tipo') || ''),
    'Presupuesto: ' + (f.get('presupuesto') || ''),
  ];
  if (f.get('llamada')) lines.push('Llámame en el horario de: ' + f.get('llamada'));
  if (f.get('detalle')) lines.push('Detalle: ' + f.get('detalle'));
  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
});

// Galería — La Sala (entrada Scroll 3D)
(() => {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  const scroller = gallery.querySelector('[data-gallery-scroll]');
  const track = gallery.querySelector('.gallery-track');
  const stage = gallery.querySelector('[data-gallery-stage]');
  const grid = gallery.querySelector('[data-gallery-grid]');
  const cards = Array.from(gallery.querySelectorAll('[data-g-card]'));
  const triggers = Array.from(document.querySelectorAll('[data-gallery-open]'));
  const closeEls = Array.from(gallery.querySelectorAll('[data-gallery-close]'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  let isOpen = false;
  let rafId = 0;
  let resizeId = 0;
  let lastFocus = null;
  let scrollbarPad = '';

  const setQ = (q) => stage.style.setProperty('--q', q.toFixed(4));

  const progress = () => {
    const max = track.offsetHeight - stage.offsetHeight;
    if (max <= 0) return 1;
    return Math.min(1, Math.max(0, scroller.scrollTop / max));
  };

  const ease = (t) => 1 - Math.pow(1 - t, 3);

  const applyProgress = () => {
    rafId = 0;
    if (!isOpen) return;
    const q = reduce.matches ? 0 : 1 - ease(progress());
    setQ(q);
    gallery.classList.toggle('is-entered', q < 0.08);
  };

  const requestUpdate = () => {
    if (!rafId) rafId = requestAnimationFrame(applyProgress);
  };

  const measure = () => {
    if (!isOpen) return;
    setQ(0);
    void stage.offsetHeight;
    const sr = grid.getBoundingClientRect();
    const cx = sr.left + sr.width / 2;
    const cy = sr.top + sr.height / 2;

    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const dx = cx - (r.left + r.width / 2);
      const dy = cy - (r.top + r.height / 2);
      card.style.setProperty('--dx', dx.toFixed(1) + 'px');
      card.style.setProperty('--dy', dy.toFixed(1) + 'px');
      card.style.setProperty('--dz', (-40 - i * 60) + 'px');
      card.style.setProperty('--rx', (4 - i * 1.5) + 'deg');
      card.style.setProperty('--ry', (-8 + i * 3) + 'deg');
      card.style.setProperty('--rz', (-4 + i * 2) + 'deg');
      card.style.setProperty('--sc', (0.15 + i * 0.02).toFixed(3));
    });

    applyProgress();
  };

  const openGallery = (ev) => {
    if (isOpen) return;
    isOpen = true;
    lastFocus = document.activeElement;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    const trigger = ev && ev.currentTarget;
    if (trigger && trigger.getBoundingClientRect) {
      const r = trigger.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    gallery.style.setProperty('--ox', x + 'px');
    gallery.style.setProperty('--oy', y + 'px');

    scrollbarPad = window.innerWidth - document.documentElement.clientWidth > 0
      ? (window.innerWidth - document.documentElement.clientWidth) + 'px'
      : '';
    document.body.style.paddingRight = scrollbarPad;

    scroller.scrollTop = 0;
    gallery.inert = false;
    gallery.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gallery-open');
    gallery.classList.remove('is-closing');
    gallery.classList.add('is-open');

    measure();

    window.setTimeout(() => {
      gallery.querySelector('[data-gallery-close]')?.focus({ preventScroll: true });
    }, 500);

    history.replaceState(null, '', '#galeria');
  };

  const closeGallery = () => {
    if (!isOpen) return;
    isOpen = false;

    gallery.classList.remove('is-open', 'is-entered');
    gallery.classList.add('is-closing');
    gallery.setAttribute('aria-hidden', 'true');
    gallery.inert = true;
    document.body.classList.remove('gallery-open');
    document.body.style.paddingRight = '';

    window.setTimeout(() => {
      gallery.classList.remove('is-closing');
      scroller.scrollTop = 0;
      setQ(1);
    }, 720);

    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    if (location.hash === '#galeria') {
      history.replaceState(null, '', location.pathname + location.search);
    }
  };

  triggers.forEach((el) => {
    el.addEventListener('click', (ev) => {
      ev.preventDefault();
      openGallery(ev);
    });
  });

  closeEls.forEach((el) => {
    el.addEventListener('click', (ev) => {
      ev.preventDefault();
      const href = el.getAttribute('href');
      closeGallery();
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 60);
      }
    });
  });

  scroller.addEventListener('scroll', requestUpdate, { passive: true });

  window.addEventListener('resize', () => {
    if (!isOpen || resizeId) return;
    resizeId = requestAnimationFrame(() => {
      resizeId = 0;
      measure();
    });
  });

  document.addEventListener('keydown', (ev) => {
    if (!isOpen) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      closeGallery();
      return;
    }

    if (ev.key !== 'Tab') return;
    const focusables = Array.from(gallery.querySelectorAll('a[href], button:not([disabled])'));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  });

  const syncMotion = () => {
    gallery.classList.toggle('is-static', reduce.matches);
    if (!isOpen) return;
    if (reduce.matches) setQ(0);
    else measure();
  };

  if (reduce.addEventListener) reduce.addEventListener('change', syncMotion);
  syncMotion();

  if (location.hash === '#galeria') {
    window.setTimeout(() => openGallery(null), 2600);
  }
})();
