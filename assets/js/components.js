// components.js - Render Header dan Footer secara dinamis

document.addEventListener("DOMContentLoaded", function () {
    renderHeader();
    renderFooter();
});

function renderHeader() {
    const headerHTML = `
    <header class="site-header">
        <div class="container nav-container">
            <a href="index.html" class="logo-brand">
                <img src="assets/img/logo-grrm.webp" alt="Logo GRRM">
                <span>GRRM Kediri</span>
            </a>
            <nav class="nav-menu" id="navMenu">
                <a href="index.html">Beranda</a>
                <a href="profil.html">Profil</a>
                <a href="galeri.html">Galeri</a>
                <a href="artikel.html">Artikel</a>
                <a href="kontak.html">Kontak</a>
            </nav>
            <div class="hamburger" id="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </header>
    `;

    // Sisipkan di elemen dengan id="header-placeholder" atau langsung di atas body
    const placeholder = document.getElementById("header-placeholder");
    if (placeholder) {
        placeholder.innerHTML = headerHTML;
    } else {
        document.body.insertAdjacentHTML("afterbegin", headerHTML);
    }
}

function renderFooter() {
    const currentYear = new Date().getFullYear();
    const footerHTML = `
    <footer class="site-footer">
        <div class="container footer-container">
            <div class="footer-info">
                <div class="footer-brand">
                    <img src="assets/img/logo-grrm.webp" alt="Logo Jalur Langit">
                    <span>GRRM Kediri</span>
                </div>
                <p>Gerakan Rakyat Relawan Mandiri Kediri - Wadah aspirasi dan aksi nyata untuk masyarakat.</p>
            </div>
            <div class="footer-links">
                <h4>Menu Utama</h4>
                <a href="index.html">Beranda</a>
                <a href="profil.html">Profil</a>
                <a href="galeri.html">Galeri</a>
                <a href="artikel.html">Artikel</a>
                <a href="kontak.html">Kontak</a>
            </div>
            <div class="footer-contact">
                <h4>Hubungi Kami</h4>
                <p>Kediri, Jawa Timur</p>
                <p>Email: info@grrmkediri.com</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${currentYear} GRRM Kediri. All rights reserved.</p>
        </div>
    </footer>
    `;

    // Sisipkan di elemen dengan id="footer-placeholder" atau di akhir body
    const placeholder = document.getElementById("footer-placeholder");
    if (placeholder) {
        placeholder.innerHTML = footerHTML;
    } else {
        document.body.insertAdjacentHTML("beforeend", footerHTML);
    }
}