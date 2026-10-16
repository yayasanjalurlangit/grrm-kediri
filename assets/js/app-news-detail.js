/* =========================================================
   GRRM - News Detail Page Logic
   Baca ?id=POST_ID dari URL, fetch dari Blogger API
   ========================================================= */

(function () {
  'use strict';

  function getPostId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function renderError(msg) {
    const wrap = document.querySelector('.article');
    if (!wrap) return;
    wrap.innerHTML = '<div class="empty-state"><p>' + msg + '</p>' +
      '<p><a href="news.html" class="btn btn-primary" style="margin-top:12px;">Kembali ke News</a></p></div>';
  }

  function renderPost(post) {
    const B = window.GRRM_BLOGGER;

    /* Judul */
    const titleEl = document.querySelector('.article-title');
    if (titleEl) titleEl.textContent = post.title || '(Tanpa judul)';

    /* Meta: kategori + tanggal + author */
    const metaEl = document.querySelector('.article-header .news-meta');
    if (metaEl) {
      const labels = (post.labels || []).map(function (l) {
        return '<span class="cat">' + l + '</span>';
      }).join(' ');
      metaEl.innerHTML =
        (labels || '<span class="cat">Berita</span>') +
        '<span class="meta-item">' + B.formatDate(post.published) + '</span>' +
        '<span class="meta-item">' + (post.author ? post.author.displayName : 'Admin') + '</span>';
    }

    /* Thumbnail: pakai gambar pertama dari konten */
    const thumbEl = document.querySelector('.article-thumb');
    if (thumbEl) {
      const firstImg = B.extractFirstImage(post.content || '');
      if (firstImg) {
        thumbEl.innerHTML = '<img src="' + firstImg + '" alt="' + (post.title || '') + '" loading="lazy">';
      } else {
        thumbEl.textContent = 'Foto Utama';
      }
    }

    /* Konten */
    const contentEl = document.querySelector('.article-content');
    if (contentEl) contentEl.innerHTML = post.content || '<p>(Konten kosong)</p>';

    /* Update <title> */
    document.title = (post.title || 'Berita') + ' - GRRM';
  }

  function init() {
    const postId = getPostId();
    if (!postId) {
      renderError('Parameter "id" tidak ditemukan di URL.');
      return;
    }

    window.GRRM_BLOGGER.fetchPostById(postId)
      .then(renderPost)
      .catch(function (err) {
        console.error('[News Detail]', err);
        renderError('Gagal memuat berita. ' + err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();