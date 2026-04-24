/* patrocinio.js — Animated counters + reveal for patrocinio page */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll effect (reuse from main) ── */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* ── Hamburger (reuse) ── */
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const nav = document.getElementById('mobile-nav');
      if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  /* ── Reveal on scroll ── */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));

  /* ── Animated counters ── */
  const counters = document.querySelectorAll('[data-target]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target, 10);
      const prefix = el.dataset.prefix || '';
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(ease * target);
        el.textContent = prefix + value.toLocaleString('es-ES');
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + target.toLocaleString('es-ES');
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));
});
