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
        
        <!-- Tombol Aksi Kanan (Hotline & Hamburger) -->
        <div class="nav__actions">
          
          <!-- CTA Hotline WA -->
          <a href="https://wa.me/6282223213336" target="_blank" rel="noopener" class="nav__hotline" aria-label="Hotline WhatsApp">
            <svg class="nav__hotline-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span class="nav__hotline-text">HOTLINE</span>
          </a>

          <!-- Tombol Hamburger Menu -->
          <button class="nav__toggle" aria-label="Buka menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
          
        </div>
      </div>
    </header>
  `;
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;

  // 2. RENDER FOOTER
  const footerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer__grid">
          
          <!-- Kolom 1: Brand Title & Follow Us -->
          <div class="footer__brand">
            <h2 class="footer__title">Gerakan<br>Resik Resik<br>Masjid Kediri</h2>
            
            <!-- Follow Us Pindah ke Sini -->
            <div class="footer__social-wrap">
              <h4 class="footer__heading" style="margin-top: 40px;">FOLLOW US</h4>
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

          <!-- Kolom 4: CTA & Supported By -->
          <div class="footer__col">
            <h4 class="footer__heading">MAU MASJID ANDA JUGA DIBERSIHKAN?</h4>
            <a href="https://wa.me/6282223213336" target="_blank" rel="noopener" class="footer__link" style="margin-bottom: 40px; display: inline-block;">HUBUNGI ADMIN KAMI ↗</a>
            
            <!-- Supported By Pindah ke Sini -->
            <h4 class="footer__heading">SUPPORTED BY</h4>
            <div class="footer__sponsors">
              <!-- SILAKAN TAMBAHKAN 6 LOGO SPONSOR DI SINI -->
              <img src="assets/img/sponsor1.png" alt="Sponsor 1">
              <img src="assets/img/sponsor2.png" alt="Sponsor 2">
              <img src="assets/img/sponsor3.png" alt="Sponsor 3">
              <img src="assets/img/sponsor4.png" alt="Sponsor 4">
              <img src="assets/img/sponsor5.png" alt="Sponsor 5">
              <img src="assets/img/sponsor6.png" alt="Sponsor 6">
            </div>
          </div>
          
        </div>
      </div>
      
      <!-- Copyright dipisah dari container agar background bisa full width -->
      <div class="footer__bottom">
        <div class="container">
          © <span data-year></span> <b>Yayasan Jalur Langit Kediri</b> - Gerakan Resik-resik Masjid Kediri. All rights reserved.
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
    // 6. TOMBOL BACK TO TOP (Pojok Kiri Bawah)
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.setAttribute('aria-label', 'Kembali ke atas');
  backToTopBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  `;
  document.body.appendChild(backToTopBtn);

  // Logika muncul/hilang saat di-scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  // Logika klik untuk kembali ke atas
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});