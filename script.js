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
  if (f.get('llamada')) lines.push('Llamame en el horario de: ' + f.get('llamada'));
  if (f.get('detalle')) lines.push('Detalle: ' + f.get('detalle'));
  window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
});
