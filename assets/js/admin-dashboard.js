/* =========================================================
   GRRM - Admin Dashboard
   List posts + delete + tombol edit
   ========================================================= */

(function (global) {
  'use strict';

  const container = () => document.getElementById('postsContainer');

  /* ---------- Render 1 baris post ---------- */
  function buildRow(post) {
    const labels = (post.labels || []).map(function (l) {
      return '<span class="post-label">' + escapeHtml(l) + '</span>';
    }).join(' ');

    const firstImg = extractFirstImage(post.content || '');
    const thumbHtml = firstImg
      ? '<img src="' + firstImg + '" alt="" loading="lazy">'
      : '<span class="post-thumb-placeholder">No image</span>';

    const dateStr = formatDate(post.published || post.updated);

    const row = document.createElement('article');
    row.className = 'post-row';
    row.dataset.id = post.id;

    row.innerHTML =
      '<div class="post-thumb">' + thumbHtml + '</div>' +
      '<div class="post-info">' +
        '<h3 class="post-title">' + escapeHtml(post.title || '(Tanpa judul)') + '</h3>' +
        '<div class="post-meta">' +
          '<span class="post-date">' + dateStr + '</span>' +
          (labels ? '<span class="post-labels">' + labels + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="post-actions">' +
        '<a href="editor.html?id=' + encodeURIComponent(post.id) + '" class="btn btn-outline btn-sm">Edit</a>' +
        '<button type="button" class="btn btn-danger btn-sm" data-action="delete">Hapus</button>' +
      '</div>';

    /* Bind tombol hapus */
    row.querySelector('[data-action="delete"]').addEventListener('click', function () {
      onDelete(post);
    });

    return row;
  }

  /* ---------- Hapus post ---------- */
  async function onDelete(post) {
    const title = post.title || '(Tanpa judul)';
    const ok = window.confirm(
      'Hapus post berikut?\n\n"' + title + '"\n\nTindakan ini tidak bisa dibatalkan.'
    );
    if (!ok) return;

    const row = document.querySelector('.post-row[data-id="' + post.id + '"]');
    if (row) row.classList.add('is-deleting');

    try {
      await global.GRRM_ADMIN.api(
        '/api/blogger/posts?id=' + encodeURIComponent(post.id),
        { method: 'DELETE' }
      );
      /* Sukses → hapus dari DOM dengan animasi */
      if (row) {
        row.style.transition = 'opacity .3s, transform .3s';
        row.style.opacity = '0';
        row.style.transform = 'translateX(20px)';
        setTimeout(function () { row.remove(); checkEmpty(); }, 320);
      }
      showToast('Post berhasil dihapus.', 'success');
    } catch (e) {
      console.error('[Dashboard] Hapus gagal', e);
      if (row) row.classList.remove('is-deleting');
      showToast('Gagal menghapus: ' + e.message, 'error');
    }
  }

  /* ---------- Cek apakah list kosong + update counter ---------- */
  function checkEmpty() {
    const c = container();
    if (!c) return;
    const remaining = c.querySelectorAll('.post-row').length;

    /* Update badge counter */
    const counterEl = c.querySelector('.posts-count');
    if (counterEl) {
      counterEl.textContent = remaining + ' post';
    }

    /* Kalau kosong total, tampilkan empty state */
    if (remaining === 0) {
      c.innerHTML =
        '<div class="admin-empty">' +
          '<p>Belum ada post. Klik "+ Buat Post Baru" untuk memulai.</p>' +
        '</div>';
    }
  }

  /* ---------- Load & render semua post ---------- */
  async function loadPosts() {
    const c = container();
    if (!c) return;

    c.innerHTML = '<div class="admin-loading">Memuat daftar post…</div>';

    try {
      const data = await global.GRRM_ADMIN.api('/api/blogger/posts?maxResults=50');

      if (!data.items || data.items.length === 0) {
        c.innerHTML =
          '<div class="admin-empty">' +
            '<p>Belum ada post.</p>' +
          '</div>';
        return;
      }

      /* Sort: terbaru dulu */
      const posts = data.items.slice().sort(function (a, b) {
        return new Date(b.published || 0) - new Date(a.published || 0);
      });

      c.innerHTML =
        '<div class="posts-header">' +
          '<h2>Daftar Post</h2>' +
          '<span class="posts-count">' + posts.length + ' post</span>' +
        '</div>' +
        '<div class="posts-list"></div>';

      const list = c.querySelector('.posts-list');
      posts.forEach(function (p) { list.appendChild(buildRow(p)); });
    } catch (e) {
      console.error('[Dashboard] Load gagal', e);
      c.innerHTML =
        '<div class="admin-empty">' +
          '<p>Gagal memuat: ' + escapeHtml(e.message) + '</p>' +
          '<button type="button" class="btn btn-outline" id="retryBtn">Coba lagi</button>' +
        '</div>';
      const retry = document.getElementById('retryBtn');
      if (retry) retry.addEventListener('click', loadPosts);
    }
  }

  /* ---------- Toast ---------- */
  function showToast(msg, type) {
    let t = document.getElementById('adminToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'adminToast';
      document.body.appendChild(t);
    }
    t.className = 'admin-toast ' + (type || '');
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () {
      t.classList.remove('is-visible');
    }, 3500);
  }

  /* ---------- Helpers ---------- */
  function extractFirstImage(html) {
    if (!html) return '';
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (!m) return '';
    /* Upgrade ke ukuran lebih besar */
    return m[1].replace(/\/s\d+(-c)?\//, '/s400/');
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ---------- Init: tunggu admin ready ---------- */
  document.addEventListener('admin:ready', loadPosts);

  /* ---------- Expose untuk dipakai editor ---------- */
  global.GRRM_DASHBOARD = {
    loadPosts: loadPosts,
    showToast: showToast
  };
})(window);