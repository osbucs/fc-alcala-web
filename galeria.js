/**
 * galeria.js — Lightbox and interactions for galeria.html
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Collect all lightbox-triggerable items ──────────────────────────
  const items = Array.from(document.querySelectorAll('[data-lightbox]'));
  const lb        = document.getElementById('gal-lightbox');
  const lbImg     = document.getElementById('gal-lb-img');
  const lbCaption = document.getElementById('gal-lb-caption');
  const lbClose   = document.getElementById('gal-lb-close');
  const lbPrev    = document.getElementById('gal-lb-prev');
  const lbNext    = document.getElementById('gal-lb-next');

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const item = items[index];
    lbImg.src = item.dataset.lightbox;
    lbImg.alt = item.dataset.caption || '';
    lbCaption.textContent = item.dataset.caption || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    openLightbox(currentIndex);
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % items.length;
    openLightbox(currentIndex);
  }

  // Attach click to each gallery item
  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', showPrev);
  lbNext.addEventListener('click', showNext);

  // Click outside image → close
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });

  // ── Touch/swipe support ─────────────────────────────────────────────
  let touchStartX = 0;
  lb.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? showNext() : showPrev();
    }
  });

});
