// ── Scroll header ──────────────────────────────────────────────
const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile nav ─────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger.addEventListener('click', () => {
  mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
});

// ── Animated counters ──────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start) + (el.dataset.suffix || '');
    if (start < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ── Intersection Observer ──────────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Counters
      if (entry.target.classList.contains('stat-number')) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        io.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));
document.querySelectorAll('.stat-number').forEach(el => io.observe(el));

// ── Lightbox ───────────────────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbClose = document.getElementById('lb-close');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
let currentIdx = 0;

function openLightbox(idx) {
  currentIdx = idx;
  lbImg.src = galleryItems[idx].dataset.src;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}
function navigate(dir) {
  currentIdx = (currentIdx + dir + galleryItems.length) % galleryItems.length;
  lbImg.style.opacity = 0;
  setTimeout(() => {
    lbImg.src = galleryItems[currentIdx].dataset.src;
    lbImg.style.opacity = 1;
  }, 150);
}

lbImg.style.transition = 'opacity .15s';
galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => navigate(-1));
lbNext.addEventListener('click', () => navigate(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

// ── FAQ Accordions ─────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item').forEach(f => {
      f.classList.remove('open');
      f.querySelector('.faq-answer').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
    }
  });
});

// ── Hero parallax ──────────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
  }
});

// ── Swiper Team Gallery ────────────────────────────────────────
(function initSwiperGallery() {
  const tituloDinamico = document.getElementById('titulo-dinamico');
  if (!tituloDinamico) return;

  const swiper = new Swiper('.swiper-equipo', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 120,
      modifier: 1.5,
      slideShadows: false,
    },
    navigation: {
      nextEl: '.swiper-equipo .swiper-button-next',
      prevEl: '.swiper-equipo .swiper-button-prev',
    },
    pagination: {
      el: '.swiper-equipo .swiper-pagination',
      clickable: true,
    },
    on: {
      slideChangeTransitionStart() {
        const activeSlide = this.slides[this.activeIndex];
        const nuevoTitulo = activeSlide?.getAttribute('data-titulo');
        if (!nuevoTitulo || !tituloDinamico) return;
        tituloDinamico.style.opacity = '0';
        setTimeout(() => {
          tituloDinamico.textContent = nuevoTitulo;
          tituloDinamico.style.opacity = '1';
        }, 150);
      },
    },
  });

  // Team Lightbox
  const miLightbox  = document.getElementById('mi-lightbox');
  const imgAmpliada = document.getElementById('img-ampliada');
  const textoLb     = document.getElementById('lightbox-texto');
  const btnCerrar   = document.getElementById('btn-cerrar-lb');

  document.querySelectorAll('.swiper-equipo .swiper-slide').forEach(slide => {
    slide.addEventListener('click', function () {
      if (!this.classList.contains('swiper-slide-active')) return;
      imgAmpliada.src = this.querySelector('img').src;
      textoLb.textContent = this.getAttribute('data-titulo') || '';
      miLightbox.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });

  function cerrarLightboxEquipo() {
    miLightbox.style.display = 'none';
    document.body.style.overflow = '';
  }

  btnCerrar.addEventListener('click', cerrarLightboxEquipo);
  miLightbox.addEventListener('click', e => {
    if (e.target !== imgAmpliada) cerrarLightboxEquipo();
  });
  document.addEventListener('keydown', e => {
    if (miLightbox.style.display === 'block' && e.key === 'Escape') cerrarLightboxEquipo();
  });
})();
