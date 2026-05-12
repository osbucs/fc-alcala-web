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

// ── Lightbox (legacy — only runs if elements exist) ───────────
(function initLegacyLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbClose = document.getElementById('lb-close');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const galleryItems = document.querySelectorAll('.gallery-item[data-src]');
  if (!lightbox || !lbImg || !galleryItems.length) return;

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
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => navigate(-1));
  if (lbNext) lbNext.addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
})();

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
const heroSlideshow = document.querySelector('.hero-slideshow');
window.addEventListener('scroll', () => {
  if (heroSlideshow && window.scrollY < window.innerHeight) {
    heroSlideshow.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }
});

// ── Team Gallery — Swiper Loop Carousel ───────────────────────
(function initTeamGallery() {
  const swiperContainer = document.querySelector('.swiper-equipo');
  // Check if Swiper library has loaded properly
  if (!swiperContainer || typeof Swiper === 'undefined') return;

  const gap = window.innerWidth <= 768 ? 14 : 20;

  new Swiper('.swiper-equipo', {
    loop: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: gap,
    speed: 650,
    grabCursor: true,
    slideToClickedSlide: true, // Click on adjacent to snap it to center
    keyboard: {
      enabled: true,
    }
  });
})();

// ── Mobile Categories Carousel ─────────────────────────────────
function initMobileCategories() {
  const grid = document.querySelector('.categories-grid');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.cat-card'));
  if (!cards.length) return;

  const isMobile = () => window.innerWidth <= 768;

  function getActiveCard() {
    const gridRect = grid.getBoundingClientRect();
    const center = gridRect.left + gridRect.width / 2;
    let closest = null, minDist = Infinity;
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - center);
      if (dist < minDist) { minDist = dist; closest = card; }
    });
    return closest;
  }

  function updateActive() {
    if (!isMobile()) {
      cards.forEach(c => c.classList.remove('mobile-active'));
      return;
    }
    const active = getActiveCard();
    cards.forEach(c => c.classList.toggle('mobile-active', c === active));
  }

  function centerFirst() {
    if (!isMobile()) return;
    const card = cards[0];
    grid.scrollLeft = card.offsetLeft - (grid.offsetWidth - card.offsetWidth) / 2;
    cards[0].classList.add('mobile-active');
  }

  let scrollTimer;
  grid.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateActive, 60);
  }, { passive: true });

  centerFirst();
  updateActive();
}

initMobileCategories();
window.addEventListener('resize', initMobileCategories);
