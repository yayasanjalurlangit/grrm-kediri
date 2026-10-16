/* =========================================================
   GRRM - Admin Editor
   Create / Edit post via Blogger proxy
   ========================================================= */

(function (global) {
  'use strict';

  const $ = function (id) { return document.getElementById(id); };

  let mode = 'create'; /* 'create' | 'edit' */
  let editingId = null;

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

  /* ---------- Status message bawah form ---------- */
  function setStatus(msg, type) {
    const el = $('statusMsg');
    if (!el) return;
    if (!msg) { el.classList.add('hidden'); return; }
    el.className = 'status-msg ' + (type || '');
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  /* ---------- Toolbar: formatting commands ---------- */
  function initToolbar() {
    document.querySelectorAll('.tool-btn[data-cmd]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        const value = btn.dataset.value || null;
        document.execCommand(cmd, false, value);
        $('postContent').focus();
      });
    });

    /* Placeholder behavior untuk contenteditable */
    const area = $('postContent');
    if (area) {
      area.addEventListener('input', function () {
        area.classList.toggle('is-empty', !area.textContent.trim());
      });
      area.classList.add('is-empty');
    }
  }

  /* ---------- Tombol sisipkan gambar (placeholder — 4D.4) ---------- */
  function initImageInsert() {
    const btn = $('insertImageBtn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      /* Nanti di 4D.4: upload ke R2 & sisipkan <img> */
      const url = window.prompt('Masukkan URL gambar (sementara):');
      if (!url) return;
      document.execCommand('insertHTML', false,
        '<img src="' + url + '" alt="" style="max-width:100%;border-radius:8px;margin:8px 0;">');
    });
  }

  /* ---------- Load post untuk mode edit ---------- */
  async function loadPostForEdit(id) {
    mode = 'edit';
    editingId = id;

    $('editorTitle').textContent = 'Edit Post';
    $('editorSubtitle').textContent = 'Perbarui judul, label, atau konten.';
    $('saveBtn').textContent = 'Perbarui Post';

    setStatus('Memuat post…', '');

    try {
      const post = await global.GRRM_ADMIN.api(
        '/api/blogger/posts?id=' + encodeURIComponent(id)
      );

      $('postTitle').value = post.title || '';
      $('postLabels').value = (post.labels || []).join(', ');
      $('postContent').innerHTML = post.content || '';
      $('postContent').classList.toggle('is-empty', !post.content);
      $('postId').value = post.id;

      document.title = 'Edit: ' + (post.title || '') + ' - Admin GRRM';
      setStatus('');
    } catch (e) {
      console.error('[Editor] Load gagal', e);
      setStatus('Gagal memuat post: ' + e.message, 'error');
    }
  }

  /* ---------- Submit: create atau update ---------- */
  async function onSubmit(e) {
    e.preventDefault();

    const title = $('postTitle').value.trim();
    const content = $('postContent').innerHTML.trim();
    const labelsRaw = $('postLabels').value.trim();

    /* Validasi */
    if (!title) {
      showToast('Judul wajib diisi.', 'error');
      $('postTitle').focus();
      return;
    }
    if (!content || content === '<br>') {
      showToast('Konten wajib diisi.', 'error');
      $('postContent').focus();
      return;
    }

    const labels = labelsRaw
      ? labelsRaw.split(',').map(function (l) { return l.trim(); }).filter(Boolean)
      : [];

    const payload = {
      title: title,
      content: content,
      labels: labels
    };

    /* Disable tombol simpan */
    const saveBtn = $('saveBtn');
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Menyimpan…';
    setStatus('Mengirim ke Blogger…', '');

    try {
      let result;
      if (mode === 'edit' && editingId) {
        result = await global.GRRM_ADMIN.api(
          '/api/blogger/posts?id=' + encodeURIComponent(editingId),
          { method: 'PUT', body: payload }
        );
        showToast('Post berhasil diperbarui!', 'success');
      } else {
        result = await global.GRRM_ADMIN.api('/api/blogger/posts', {
          method: 'POST',
          body: payload
        });
        showToast('Post berhasil dibuat!', 'success');

        /* Setelah create sukses, redirect ke mode edit */
        if (result && result.id) {
          setTimeout(function () {
            window.location.href = 'editor.html?id=' + encodeURIComponent(result.id);
          }, 800);
        }
      }

      setStatus('Post tersimpan. Mengalihkan…', 'success');
    } catch (err) {
      console.error('[Editor] Simpan gagal', err);
      showToast('Gagal menyimpan: ' + err.message, 'error');
      setStatus('Gagal menyimpan: ' + err.message, 'error');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  }

  /* ---------- Init ---------- */
  function initEditor() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    initToolbar();
    initImageInsert();

    $('postForm').addEventListener('submit', onSubmit);

    const logoutBtn = $('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', global.GRRM_ADMIN.logout);

    if (id) {
      loadPostForEdit(id);
    } else {
      document.title = 'Buat Post Baru - Admin GRRM';
    }
  }

  /* Tunggu admin:ready (artinya user sudah login) */
  document.addEventListener('admin:ready', initEditor);
})(window);