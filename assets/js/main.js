/* =========================================================
   GRRM - Gerakan Resik Resik Masjid
   Main Interaction Script (Smooth Animations)
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     KONFIGURASI & UTILITY
     ========================================================= */
  const CONFIG = window.GRRM_CONFIG || {
    slider: { autoPlay: true, interval: 6000, pauseOnHover: true },
    nav: { stickyHeader: true, scrollThreshold: 40 },
    animation: { enableScrollReveal: true, revealOffset: 80 }
  };

  const motionQuery = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null;

  let PREFERS_REDUCED_MOTION = motionQuery ? motionQuery.matches : false;

  if (motionQuery && motionQuery.addEventListener) {
    motionQuery.addEventListener('change', function (e) {
      PREFERS_REDUCED_MOTION = e.matches;
    });
  }

  function debounce(fn, wait) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  /* =========================================================
     1. BRAND LOGO — auto-inject ke semua halaman
     ========================================================= */
  function initBrandLogo() {
    const brand = document.querySelector('.brand');
    if (!brand) return;
    if (brand.querySelector('.brand-logo')) return;

    const logo = document.createElement('img');
    logo.src = 'assets/images/logo-grrm.png';
    logo.alt = 'Logo GRRM';
    logo.className = 'brand-logo';
    logo.onerror = function () { logo.style.display = 'none'; };

    brand.insertBefore(logo, brand.firstChild);
  }

  /* =========================================================
     2. HEADER — shadow saat scroll
     ========================================================= */
  function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    const threshold = CONFIG.nav && CONFIG.nav.scrollThreshold != null
      ? CONFIG.nav.scrollThreshold
      : 40;
    let ticking = false;

    function update() {
      header.classList.toggle('scrolled', window.scrollY > threshold);
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* =========================================================
     3. NAVIGASI MOBILE
     ========================================================= */
  function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;

    function openNav() {
      toggle.classList.add('active');
      nav.classList.add('open');
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Tutup menu navigasi');
    }

    function closeNav() {
      toggle.classList.remove('active');
      nav.classList.remove('open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Buka menu navigasi');
    }

    function isOpen() {
      return nav.classList.contains('open');
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isOpen()) closeNav();
      else openNav();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (isOpen()) closeNav();
      });
    });

    document.addEventListener('click', function (e) {
      if (!isOpen()) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        closeNav();
        toggle.focus();
      }
    });

    window.addEventListener(
      'resize',
      debounce(function () {
        if (window.innerWidth > 1100 && isOpen()) closeNav();
      }, 150)
    );
  }

  /* =========================================================
     4. HERO SLIDER
     ========================================================= */
  function initHeroSlider() {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const slides = hero.querySelectorAll('.hero-slide');
    const dots = hero.querySelectorAll('.hero-dots .dot');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoTimer = null;
    let isTransitioning = false;

    const interval = CONFIG.slider && CONFIG.slider.interval != null
      ? CONFIG.slider.interval
      : 6000;
    const autoPlay = CONFIG.slider ? CONFIG.slider.autoPlay !== false : true;
    const pauseOnHover = CONFIG.slider ? CONFIG.slider.pauseOnHover !== false : true;

    const TRANSITION_MS = 800;

    function goToSlide(index) {
      if (isTransitioning && slides.length > 1) return;

      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      if (index === currentIndex && slides.length > 1) return;

      isTransitioning = true;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        const isActive = i === index;
        dot.classList.toggle('active', isActive);
        if (isActive) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });

      currentIndex = index;

      const duration = PREFERS_REDUCED_MOTION ? 0 : TRANSITION_MS;
      setTimeout(function () {
        isTransitioning = false;
      }, duration);
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    function startAutoPlay() {
      if (!autoPlay || slides.length < 2) return;
      stopAutoPlay();
      autoTimer = setInterval(nextSlide, interval);
    }
    function stopAutoPlay() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoPlay();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoPlay();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const index = parseInt(dot.dataset.index, 10);
        if (!isNaN(index)) {
          goToSlide(index);
          startAutoPlay();
        }
      });
    });

    if (pauseOnHover) {
      hero.addEventListener('mouseenter', stopAutoPlay);
      hero.addEventListener('mouseleave', startAutoPlay);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopAutoPlay();
      else startAutoPlay();
    });

    document.addEventListener('keydown', function (e) {
      const tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') { nextSlide(); startAutoPlay(); }
      if (e.key === 'ArrowLeft')  { prevSlide(); startAutoPlay(); }
    });

    let touchStartX = 0;
    let touchStartY = 0;

    hero.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    hero.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].screenX - touchStartX;
      const dy = e.changedTouches[0].screenY - touchStartY;

      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) nextSlide();
        else prevSlide();
        startAutoPlay();
      }
    }, { passive: true });

    goToSlide(0);
    startAutoPlay();
  }

  /* =========================================================
     5. FOOTER — tahun otomatis
     ========================================================= */
  function initFooterYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* =========================================================
     6. SCROLL REVEAL
     ========================================================= */
  function initScrollReveal() {
    if (!CONFIG.animation || CONFIG.animation.enableScrollReveal === false) return;
    if (!('IntersectionObserver' in window)) return;
    if (PREFERS_REDUCED_MOTION) return;

    const targets = document.querySelectorAll(
      '.section-profil, .section-tentang, .section-sejarah, .section-visi-misi'
    );
    if (targets.length === 0) return;

    targets.forEach(function (el) { el.classList.add('reveal'); });

    const offset = CONFIG.animation.revealOffset != null
      ? CONFIG.animation.revealOffset
      : 80;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -' + offset + 'px 0px'
      }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* =========================================================
     7. SMOOTH SCROLL — anchor internal
     ========================================================= */
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    if (links.length === 0) return;

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
          behavior: PREFERS_REDUCED_MOTION ? 'auto' : 'smooth',
          block: 'start'
        });
      });
    });
  }

  /* =========================================================
     8. PAGE TRANSITION — animasi halus saat pindah halaman
     ========================================================= */
  function initPageTransition() {
    if (PREFERS_REDUCED_MOTION) return;

    const links = document.querySelectorAll('a[href$=".html"]');
    if (links.length === 0) return;

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    links.forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = link.getAttribute('href');
        if (!href) return;

        if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
          return;
        }

        const targetPage = href.split('#')[0];
        if (targetPage === currentPage) return;

        e.preventDefault();
        document.body.classList.add('page-exiting');

        setTimeout(function () {
          window.location.href = href;
        }, 220);
      });
    });
  }

  /* =========================================================
     INIT ALL
     ========================================================= */
  function init() {
    initBrandLogo();
    initHeaderScroll();
    initMobileNav();
    initHeroSlider();
    initFooterYear();
    initScrollReveal();
    initSmoothScroll();
    initPageTransition();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();