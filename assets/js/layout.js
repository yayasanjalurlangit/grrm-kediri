/* =========================================================
   GRRM - Layout Renderer (Header & Footer)
   ========================================================= */
(function () {
  'use strict';

  // Tentukan halaman aktif berdasarkan URL
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  function isActive(page) {
    return currentPath === page ? 'class="active" aria-current="page"' : '';
  }

  const headerHTML = `
    <header class="site-header" id="siteHeader">
      <div class="container header-inner">
        <a href="/index.html" class="brand" aria-label="GRRM - Beranda">
          <img src="/assets/images/logo-grrm.webp" alt="Logo GRRM" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-name">GRRM KEDIRI</span>
            <span class="brand-sub">Gerakan Resik-resik Masjid</span>
          </div>
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Buka menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="site-nav" id="siteNav" aria-label="Navigasi utama">
          <ul>
            <li><a href="/index.html" ${isActive('index.html')}>Home</a></li>
            <li><a href="/news.html" ${isActive('news.html')}>News</a></li>
            <li><a href="/struktur-organisasi.html" ${isActive('struktur-organisasi.html')}>Struktur</a></li>
            <li><a href="/galeri.html" ${isActive('galeri.html')}>Galeri</a></li>
            <li><a href="/pengumuman.html" ${isActive('pengumuman.html')}>Pengumuman</a></li>
            <li><a href="/lain-lain.html" ${isActive('lain-lain.html')}>Lain-lain</a></li>
            <li><a href="/kontak.html" ${isActive('kontak.html')}>Kontak</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;

  const footerHTML = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-col footer-logo-col">
          <img src="/assets/images/logo-grrm.webp" alt="Logo GRRM" class="footer-logo" />
        </div>
        <div class="footer-col">
          <h4>GRRM KEDIRI</h4>
          <p>Gerakan Resik Resik Masjid — bersama membangun lingkungan yang bersih.</p>
        </div>
        <div class="footer-col">
          <h4>Menu</h4>
          <ul>
            <li><a href="/index.html">Home</a></li>
            <li><a href="/news.html">News</a></li>
            <li><a href="/galeri.html">Galeri</a></li>
            <li><a href="/pengumuman.html">Pengumuman</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Kontak</h4>
          <p>Kediri, Jawa Timur</p>
          <p>info@grrm.id</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span id="year"></span> GRRM — Gerakan Resik Resik Masjid.</p>
      </div>
    </footer>
  `;

  // Injeksi ke HTML
  function renderLayout() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) headerPlaceholder.outerHTML = headerHTML;

    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) footerPlaceholder.outerHTML = footerHTML;

    // Set Tahun Otomatis
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderLayout);
  } else {
    renderLayout();
  }
})();