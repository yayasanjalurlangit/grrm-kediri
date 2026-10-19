/* =========================================================
   GRRM - Layout Renderer (Header, Footer & Interactions)
   ========================================================= */
(function () {
  'use strict';

  // 1. Dapatkan nama halaman saat ini
  // Jika URL berakhir dengan '/', anggap sebagai 'index.html'
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // 2. Fungsi untuk menandai menu yang aktif
  function isActive(page) {
    return currentPath === page ? 'class="active" aria-current="page"' : '';
  }

  // 3. Template HTML Header
  // PERHATIAN: Menghapus garis miring (/) di awal path agar berjalan di localhost
  const headerHTML = `
    <header class="site-header" id="siteHeader">
      <div class="container header-inner">
        <a href="index.html" class="brand" aria-label="GRRM - Beranda">
          <img src="assets/images/logo-grrm.webp" alt="Logo GRRM" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-name">GRRM KEDIRI</span>
            <span class="brand-sub">Gerakan Resik-Resik Masjid Kediri</span>
          </div>
        </a>
        
        <button class="nav-toggle" id="navToggle" aria-label="Buka menu" aria-expanded="false" aria-controls="siteNav">
          <span></span><span></span><span></span>
        </button>

        <nav class="site-nav" id="siteNav" aria-label="Navigasi utama">
          <ul>
            <li><a href="index.html" ${isActive('index.html')}>Home</a></li>
            <li><a href="news.html" ${isActive('news.html')}>News</a></li>
            <li><a href="struktur-organisasi.html" ${isActive('struktur-organisasi.html')}>Struktur</a></li>
            <li><a href="galeri.html" ${isActive('galeri.html')}>Galeri</a></li>
            <li><a href="pengumuman.html" class="nav-pengumuman ${isActive('pengumuman.html')}">Pengumuman</a></li>
            <li><a href="lain-lain.html" ${isActive('lain-lain.html')}>Lain-lain</a></li>
            <li><a href="kontak.html" ${isActive('kontak.html')}>Kontak</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;

  // 4. Template HTML Footer
  const footerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        
        <!-- Baris 1: Brand, Slogan, Deskripsi, & Sosmed -->
        <div class="footer-block brand-col">
          <div class="footer-brand-header">
            <img src="assets/images/logo-grrm.webp" alt="Logo GRRM" class="footer-logo" />
            <div class="footer-brand-text">
              <h4 class="footer-brand-title">GRRM KEDIRI</h4>
              <span class="footer-brand-sub">Gerakan Resik-resik Masjid Kediri</span>
            </div>
          </div>
          <p class="footer-slogan">"Resik Atine, Resik Masjid'e, Istiqomah!"</p>
          <p class="footer-desc">Organisasi masyarakat yang bergerak di bidang kebersihan masjid, edukasi warga, dan aksi sosial di Kota Kediri.</p>
          
          <div class="social-links">
            <a href="#" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
            <a href="#" aria-label="WhatsApp"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></a>
          </div>
        </div>

        <!-- Baris 2 Kiri: Layanan -->
        <div class="footer-block">
          <h5 class="footer-heading">Layanan</h5>
          <ul class="footer-links">
            <li><a href="#">Aksi Bersih</a></li>
            <li><a href="#">Edukasi Warga</a></li>
            <li><a href="#">Bank Sampah</a></li>
            <li><a href="#">Penghijauan</a></li>
          </ul>
        </div>

        <!-- Baris 2 Kanan: Tautan -->
        <div class="footer-block">
          <h5 class="footer-heading">Tautan</h5>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="news.html">News</a></li>
            <li><a href="galeri.html">Galeri</a></li>
            <li><a href="pengumuman.html">Pengumuman</a></li>
            <li><a href="kontak.html">Kontak</a></li>
          </ul>
        </div>

        <!-- Baris 3: Hubungi Kami -->
        <div class="footer-block">
          <h5 class="footer-heading">Hubungi Kami</h5>
          <ul class="footer-contact-list">
            <li>Perumahan Sukorejo Permai Jl. Pamenang No.B5, Katang, Sukorejo, Ngasem, Kediri, Jawa Timur 64181</li>
            <li><a href="mailto:yayasanjalurlangit@gmail.com">yayasanjalurlangit@gmail.com</a></li>
            <li><a href="tel:+6281234567890">+62 812-3456-7890</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <div class="container footer-bottom-inner">
          <div class="footer-legal">
            <a href="privacy.html">Kebijakan Privasi</a>
            <span class="separator">|</span>
            <a href="tos.html">Syarat & Ketentuan</a>
          </div>
          <p class="footer-copy">&copy; <span id="year"></span> GRRM KEDIRI. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </div>
    </footer>
  `;

  // 5. Fungsi untuk menyuntikkan HTML ke halaman
  function renderLayout() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) headerPlaceholder.outerHTML = headerHTML;

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) footerPlaceholder.outerHTML = footerHTML;

    // Set Tahun Otomatis di Footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Jalankan interaksi setelah layout dirender
    initInteractions();
  }

  // 6. Fungsi untuk Logika Interaksi (Menu Mobile & Sticky Header)
  function initInteractions() {
    // --- Logika Hamburger Menu ---
    const navToggle = document.getElementById('navToggle');
    const siteNav = document.getElementById('siteNav');

    if (navToggle && siteNav) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        
        // Toggle atribut aksesibilitas
        navToggle.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle class untuk animasi CSS
        navToggle.classList.toggle('active');
        siteNav.classList.toggle('active');

        // Cegah body scroll saat menu terbuka di mobile
        document.body.style.overflow = isExpanded ? '' : 'hidden';
      });

      // Tutup menu otomatis saat link diklik
      const navLinks = siteNav.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.classList.remove('active');
          siteNav.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    // --- Logika Sticky Header (Efek Shadow saat di-scroll) ---
    const header = document.getElementById('siteHeader');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
  }

  // 7. Eksekusi
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderLayout);
  } else {
    renderLayout();
  }

})();