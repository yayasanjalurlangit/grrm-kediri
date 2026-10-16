/* =========================================================
   GRRM - Pengumuman Page Logic
   Filter smooth (fade + slide) dengan dukungan reduce-motion
   ========================================================= */

(function () {
  'use strict';

  const PREFERS_REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DURATION = PREFERS_REDUCED_MOTION ? 0 : 320;

  function initFilter() {
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.pengumuman-card');
    if (chips.length === 0 || cards.length === 0) return;

    cards.forEach(function (card) {
      card.style.transition = PREFERS_REDUCED_MOTION
        ? 'none'
        : 'opacity .32s ease, transform .32s ease';
    });

    let activeFilter = 'all';

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const newFilter = chip.dataset.filter;
        if (newFilter === activeFilter) return;

        activeFilter = newFilter;
        chips.forEach(function (c) {
          c.classList.toggle('active', c === chip);
        });

        applyFilter(newFilter, cards);
      });
    });
  }

  function matches(card, filter) {
    if (filter === 'all') return true;

    const locEl = card.querySelector('.loc');
    const loc = locEl ? locEl.textContent.toLowerCase() : '';

    if (filter === 'lokasi-kediri') return loc.includes('kediri');

    /* Filter waktu (bulan-ini / bulan-depan) — sementara selalu true
       sampai data dinamis siap */
    if (filter === 'bulan-ini' || filter === 'bulan-depan') return true;

    return true;
  }

  function applyFilter(filter, cards) {
    const toHide = [];
    const toShow = [];

    cards.forEach(function (card) {
      (matches(card, filter) ? toShow : toHide).push(card);
    });

    /* Immediate: kalau reduce motion */
    if (PREFERS_REDUCED_MOTION) {
      toHide.forEach(function (c) {
        c.style.display = 'none';
      });
      toShow.forEach(function (c) {
        c.style.display = '';
      });
      return;
    }

    /* Fase 1: fade-out */
    toHide.forEach(function (card) {
      if (card.style.display === 'none') return;
      card.style.opacity = '0';
      card.style.transform = 'translateX(12px)';
    });

    /* Fase 2: swap */
    setTimeout(function () {
      toHide.forEach(function (card) {
        card.style.display = 'none';
      });

      toShow.forEach(function (card) {
        const wasHidden = card.style.display === 'none';
        card.style.display = '';
        if (wasHidden) {
          card.style.opacity = '0';
          card.style.transform = 'translateX(-12px)';
        }
      });

      void document.body.offsetHeight;

      /* Fase 3: fade-in dengan stagger halus */
      toShow.forEach(function (card, i) {
        const wasHidden = card.style.opacity === '0';
        const delay = wasHidden ? Math.min(i * 40, 240) : 0;

        setTimeout(function () {
          card.style.opacity = '1';
          card.style.transform = 'translateX(0)';
        }, delay);
      });
    }, DURATION);
  }

  document.addEventListener('DOMContentLoaded', initFilter);
})();