/* =========================================================
   GRRM - Admin Editor Logic (Manual Image URL Version)
   ========================================================= */

(function (global) {
  'use strict';

  const $ = function (id) { return document.getElementById(id); };
  let mode = 'create'; 
  let editingId = null;

  /* ---------- Toast ---------- */
  function showToast(msg, type) {
    let t = $('adminToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'adminToast';
      t.className = 'admin-toast';
      document.body.appendChild(t);
    }
    t.className = 'admin-toast ' + (type || '');
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('is-visible'), 3000);
  }

  /* ---------- Toolbar Formatting ---------- */
  function initToolbar() {
    document.querySelectorAll('.tool-btn[data-cmd]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        document.execCommand(btn.dataset.cmd, false, btn.dataset.value || null);
        $('postContent').focus();
      });
    });

    const area = $('postContent');
    if (area) {
      area.addEventListener('input', () => {
        area.classList.toggle('is-empty', !area.textContent.trim());
      });
      area.classList.add('is-empty');
    }
  }

  /* ---------- Sisipkan Gambar via URL (Anti Error 403) ---------- */
  function initImageInsert() {
    const btn = $('insertImageBtn');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      
      const pesan = "Tempel (Paste) URL Gambar dari Blogger di sini.\n\nContoh: https://blogger.googleusercontent.com/img/.../s1600/foto.jpg";
      const url = window.prompt(pesan);
      
      if (!url) return;
      
      // Bersihkan jika user mem-paste tag <img> lengkap dari kode HTML Blogger
      const cleanUrl = url.replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/i, '$1');
      
      // Sisipkan ke editor dengan styling responsif
      document.execCommand('insertHTML', false,
        `<img src="${cleanUrl}" alt="Gambar Kegiatan" style="max-width:100%;height:auto;border-radius:12px;margin:16px 0;box-shadow:0 4px 12px rgba(0,0,0,0.1);display:block;">`);
      
      // Fokus kembali ke editor
      $('postContent').focus();
    });
  }

  /* ---------- Load Data untuk Edit ---------- */
  async function loadPostForEdit(id) {
    mode = 'edit';
    editingId = id;

    $('editorTitle').textContent = 'Edit Konten';
    $('editorSubtitle').textContent = 'Perbarui judul, kategori, atau isi konten.';
    $('saveBtn').textContent = 'Perbarui Konten';

    try {
      const post = await global.GRRM_ADMIN.api(`/api/blogger/posts?id=${encodeURIComponent(id)}`);

      $('postTitle').value = post.title || '';
      $('postContent').innerHTML = post.content || '';
      $('postContent').classList.toggle('is-empty', !post.content);
      $('postId').value = post.id;

      const labels = post.labels || [];
      const standardCats = ['Kegiatan', 'Berita', 'Edukasi', 'Galeri', 'Pengumuman'];
      
      let primaryCat = 'Kegiatan';
      let extraLabels = [];

      labels.forEach(lbl => {
        const match = standardCats.find(c => c.toLowerCase() === lbl.toLowerCase());
        if (match) primaryCat = match;
        else extraLabels.push(lbl);
      });

      $('postCategory').value = primaryCat;
      $('postExtraLabels').value = extraLabels.join(', ');

      document.title = 'Edit: ' + (post.title || '') + ' - Admin GRRM';
    } catch (e) {
      showToast('Gagal memuat konten: ' + e.message, 'error');
    }
  }

  /* ---------- Submit Form ---------- */
  async function onSubmit(e) {
    e.preventDefault();

    const title = $('postTitle').value.trim();
    const content = $('postContent').innerHTML.trim();
    const primaryCat = $('postCategory').value;
    const extraLabelsRaw = $('postExtraLabels').value.trim();

    if (!title) return showToast('Judul wajib diisi.', 'error');
    if (!content || content === '<br>') return showToast('Konten wajib diisi.', 'error');

    // Gabungkan Kategori Utama + Label Tambahan
    let finalLabels = [primaryCat];
    if (extraLabelsRaw) {
      const extras = extraLabelsRaw.split(',').map(s => s.trim()).filter(Boolean);
      extras.forEach(ex => {
        if (!finalLabels.some(fl => fl.toLowerCase() === ex.toLowerCase())) {
          finalLabels.push(ex);
        }
      });
    }

    const payload = { title, content, labels: finalLabels };

    const saveBtn = $('saveBtn');
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = 'Menyimpan...';

    try {
      let res;
      if (mode === 'edit' && editingId) {
        res = await global.GRRM_ADMIN.api(`/api/blogger/posts?id=${editingId}`, {
          method: 'PUT', body: payload
        });
        showToast('Konten berhasil diperbarui!', 'success');
      } else {
        res = await global.GRRM_ADMIN.api('/api/blogger/posts', {
          method: 'POST', body: payload
        });
        showToast('Konten berhasil dibuat!', 'success');
        
        // Jika create baru, redirect ke mode edit setelah 1 detik
        if (res && res.id) {
          setTimeout(() => {
            window.location.href = `editor.html?id=${encodeURIComponent(res.id)}`;
          }, 1000);
        }
      }
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error');
    } finally {
      // Selalu kembalikan tombol ke keadaan semula, apapun hasilnya
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  }

  /* ---------- Init Editor ---------- */
  function initEditor() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const type = params.get('type');

    initToolbar();
    initImageInsert();
    $('postForm').addEventListener('submit', onSubmit);

    if (id) {
      loadPostForEdit(id);
    } else {
      document.title = 'Buat Konten Baru - Admin GRRM';
      // Jika dibuka dari tab tertentu (misal ?type=galeri), set dropdown otomatis
      if (type) {
        const select = $('postCategory');
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value.toLowerCase() === type.toLowerCase()) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  document.addEventListener('admin:ready', initEditor);
})(window);