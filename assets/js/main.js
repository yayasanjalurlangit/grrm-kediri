/* ============ UI GLOBAL & KOMPONEN ============ */
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. RENDER HEADER (Sesuai class di style.css)
  const headerHTML = `
    <header class="nav">
      <div class="nav__inner">
        <a href="index.html" class="nav__brand" aria-label="Beranda">
          <img src="assets/img/logo-grrm.webp" alt="Logo GRRM" class="nav__logo">
          <span class="nav__brand-text">GRRM KEDIRI<span>Gerakan Resik-resik Masjid Kediri</span></span>
        </a>
        <nav class="nav__links" aria-label="Navigasi utama">
          <a href="index.html">Beranda</a>
          <a href="profil.html">Profil</a>
          <a href="legalitas.html">Legalitas</a>
          <a href="galeri.html">Galeri</a>
          <a href="artikel.html">Artikel</a>
          <a href="kontak.html">Kontak</a>
        </nav>
        <button class="nav__toggle" aria-label="Buka menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  `;
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;

  // 2. RENDER FOOTER (Sesuai class di style.css)
  const footerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          
          <!-- Kolom 1: Brand Title -->
          <div class="footer__brand">
            <h2 class="footer__title">Gerakan<br>Resik Resik<br>Masjid Kediri</h2>
          </div>

          <!-- Kolom 2: Lokasi -->
          <div class="footer__col">
            <h4 class="footer__heading">LOKASI</h4>
            <ul class="footer__info-list">
              <li><a href="mailto:grrmkediri@gmail.com">grrmkediri@gmail.com</a></li>
              <li><a href="tel:+6282223213336">+628 222 321 3336</a></li>
              <li>Perumahan Sukorejo Permai B5, Katang, Sukorejo, Ngasem, Kabupaten Kediri</li>
            </ul>
            <a href="https://maps.app.goo.gl/QJsQsPn76ohSNddP6" target="_blank" rel="noopener" class="footer__link">LIHAT GOOGLE MAPS ↗</a>
          </div>

          <!-- Kolom 3: Navigasi -->
          <div class="footer__col">
            <h4 class="footer__heading">NAVIGASI</h4>
            <ul class="footer__nav-list">
              <li><a href="index.html">Beranda</a></li>
              <li><a href="profil.html">Profil</a></li>
              <li><a href="legalitas.html">Legalitas</a></li>
              <li><a href="galeri.html">Galeri</a></li>
              <li><a href="artikel.html">Artikel</a></li>
              <li><a href="kontak.html">Kontak</a></li>
            </ul>
          </div>

          <!-- Kolom 4: CTA & Social -->
          <div class="footer__col">
            <h4 class="footer__heading">MAU MASJID ANDA JUGA DIBERSIHKAN?</h4>
            <a href="https://wa.me/6282223213336" target="_blank" rel="noopener" class="footer__link" style="margin-bottom: 40px; display: inline-block;">HUBUNGI ADMIN KAMI ↗</a>
            
            <h4 class="footer__heading">FOLLOW US</h4>
            <div class="footer__social-icons">
              <a href="https://facebook.com/GrrmKediri" target="_blank" rel="noopener" aria-label="Facebook">
                <svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0022 12z"/></svg>
              </a>
              <a href="https://instagram.com/grrm_kediri" target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2 0 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c0-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2a6.6 6.6 0 100 13.2 6.6 6.6 0 000-13.2zm0 10.9a4.3 4.3 0 110-8.6 4.3 4.3 0 010 8.6zm6.8-11.2a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>
              </a>
              <a href="https://tiktok.com/@grrm.kediri" target="_blank" rel="noopener" aria-label="TikTok">
                <svg viewBox="0 0 24 24"><path d="M16.6 5.8a4.7 4.7 0 01-1.1-2.8h-3v12.5a2.7 2.7 0 11-2.7-2.7c.3 0 .5 0 .8.1V9.8a5.8 5.8 0 105 5.8V9.5a7.6 7.6 0 004.5 1.4V7.8a4.6 4.6 0 01-3.5-2z"/></svg>
              </a>
              <a href="https://youtube.com/@GRRMKediri" target="_blank" rel="noopener" aria-label="YouTube">
                <svg viewBox="0 0 24 24"><path d="M23 12s0-3.5-.5-5.2a2.8 2.8 0 00-2-2C18.7 4.3 12 4.3 12 4.3s-6.7 0-8.5.5a2.8 2.8 0 00-2 2C1 8.5 1 12 1 12s0 3.5.5 5.2a2.8 2.8 0 002 2c1.8.5 8.5.5 8.5.5s6.7 0 8.5-.5a2.8 2.8 0 002-2C23 15.5 23 12 23 12zM9.8 15.5v-7l6 3.5-6 3.5z"/></svg>
              </a>
            </div>
          </div>
          
        </div>
        <div class="footer__bottom">
          © <span data-year></span> <b>Yayasan Jalur Langit Kediri</b> — Gerakan Resik-resik Masjid Kediri. All rights reserved.
        </div>
      </div>
    </footer>
  `;
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

  // 3. LOGIKA UI
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  const nav = document.querySelector('.nav');
  const isHomePage = location.pathname.endsWith('/') || location.pathname.endsWith('index.html');
  
  if (!isHomePage) {
    nav?.classList.add('is-solid'); // Paksa navbar putih jika bukan di beranda
  } else {
    const onScroll = () => nav?.classList.toggle('is-solid', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const toggle = document.querySelector('.nav__toggle');
  const links  = document.querySelector('.nav__links');
  
  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    
    // Kunci scroll body saat menu terbuka
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Jika link diklik, tutup menu dan kembalikan scroll
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Kembalikan scroll
  }))

  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === 'index.html' && href === 'index.html')) a.classList.add('is-active');
  });

  // 4. ANIMASI REVEAL
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  
  document.querySelectorAll('.reveal').forEach((el, i) => {
    if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${(i % 6) * 90}ms`);
    io.observe(el);
  });

  // 5. HERO SLIDER
  const slides = [...document.querySelectorAll('.hero__slide')];
  const dotsBox = document.querySelector('.hero__dots');
  if (slides.length) {
    let idx = 0, timer;
    if (dotsBox) {
      dotsBox.innerHTML = slides.map((_, i) =>
        `<button aria-label="Slide ${i + 1}" class="${i === 0 ? 'is-active' : ''}"></button>`).join('');
    }
    const dots = [...dotsBox.querySelectorAll('button')];
    const go = n => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
    };
    const play = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 6000); };
    document.querySelector('.hero__nav--next')?.addEventListener('click', () => { go(idx + 1); play(); });
    document.querySelector('.hero__nav--prev')?.addEventListener('click', () => { go(idx - 1); play(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { go(i); play(); }));
    play();
  }
});