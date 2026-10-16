/* =========================================================
   GRRM - Gerakan Resik Resik Kediri
   Konfigurasi Global
   ========================================================= */

const GRRM_CONFIG = {
  /* ----- Identitas Website ----- */
  site: {
    name: "GRRM",
    fullName: "Gerakan Resik Resik Kediri",
    tagline: "Bersama Membangun Lingkungan yang Bersih dan Berkelanjutan",
    email: "info@grrm.id",
    location: "Kediri, Jawa Timur",
    year: new Date().getFullYear()
  },

  /* ----- Blogger API ----- */
  blogger: {
    blogId: "1618883660646220516",              // isi nanti dengan Blog ID Blogger
    apiKey: "AIzaSyD2sOUEiC_zDRLvbZiz7b_ZpowoAjGrrnY",              // isi nanti dengan API Key Google
    baseUrl: "https://www.googleapis.com/blogger/v3/blogs",
    maxResults: 10,          // default jumlah berita per halaman
    fetchImages: true
  },

  /* ----- Slider Hero ----- */
  slider: {
    autoPlay: true,
    interval: 6000,          // 6 detik antar slide
    pauseOnHover: true,
    transitionDuration: 900  // FIX: harus sama dengan CSS .hero-slide (0.9s)
  },

  /* ----- Navigasi ----- */
  nav: {
    stickyHeader: true,
    scrollThreshold: 40      // px scroll untuk efek header
  },

  /* ----- Animasi ----- */
  animation: {
    enableScrollReveal: true,
    revealOffset: 80         // px sebelum elemen muncul
  }
};

// Ekspos ke global (opsional)
window.GRRM_CONFIG = GRRM_CONFIG;