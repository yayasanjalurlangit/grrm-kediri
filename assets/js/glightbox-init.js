/* =========================================================
   GRRM - GLightbox Initializer
   Inisialisasi lightbox setelah galeri di-render
   ========================================================= */

(function (global) {
  'use strict';

  let lightboxInstance = null;

  function initGalleryLightbox() {
    if (typeof GLightbox === 'undefined') {
      console.warn('[GLightbox] Library belum dimuat.');
      return;
    }

    /* Destroy instance lama kalau ada (untuk re-init) */
    if (lightboxInstance) {
      try { lightboxInstance.destroy(); } catch (e) { /* noop */ }
      lightboxInstance = null;
    }

    lightboxInstance = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      zoomable: true,
      draggable: true,
      openEffect: 'zoom',
      closeEffect: 'fade',
      slideEffect: 'slide',
      moreLength: 0
    });

    return lightboxInstance;
  }

  global.GRRM_GLIGHTBOX = {
    init: initGalleryLightbox,
    destroy: function () {
      if (lightboxInstance) {
        try { lightboxInstance.destroy(); } catch (e) { /* noop */ }
        lightboxInstance = null;
      }
    }
  };
})(window);