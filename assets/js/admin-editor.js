/* =========================================================
   GRRM - Admin Editor Logic (With Auto Image Compress)
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

  /* ---------- SISTEM UPLOAD & KOMPRESI GAMBAR ---------- */
  function initImageUpload() {
    const btn = $('insertImageBtn');
    const fileInput = $('imageUploadInput');
    const btnText = $('imageBtnText');

    // Klik tombol -> Buka file picker
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      fileInput.click();
    });

    // Saat file dipilih
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        return showToast('File harus berupa gambar.', 'error');
      }

      // Ubah teks tombol jadi loading
      btnText.textContent = 'Memproses...';
      btn.disabled = true;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          // Proses kompresi
          compressAndInsert(img, () => {
            btnText.textContent = 'Upload Gambar';
            btn.disabled = false;
            fileInput.value = ''; // reset input
          });
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function compressAndInsert(img, callback) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    let width = img.width;
    let height = img.height;
    const MAX_SIZE = 1200; // Maksimal lebar/tinggi 1200px

    // Hitung rasio aspek
    if (width > MAX_SIZE || height > MAX_SIZE) {
      if (width > height) {
        height = Math.round((height * MAX_SIZE) / width);
        width = MAX_SIZE;
      } else {
        width = Math.round((width * MAX_SIZE) / height);
        height = MAX_SIZE;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    // Konversi ke WebP (kualitas 80%)
    // Fallback ke JPEG jika browser tidak support WebP
    let mimeType = 'image/webp';
    try {
      if (canvas.toDataURL(mimeType).indexOf('data:image/webp') === -1) {
        mimeType = 'image/jpeg';
      }
    } catch(err) {
      mimeType = 'image/jpeg';
    }

    const base64Image = canvas.toDataURL(mimeType, 0.8);

    // Sisipkan ke editor
    document.execCommand('insertHTML', false,
      `<img src="${base64Image}" alt="Gambar" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;box-shadow:0 2px 8px rgba(0,0,0,0.1);">`);
    
    showToast('Gambar berhasil dikompres & disisipkan!', 'success');
    callback();
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
        
        if (res && res.id) {
          setTimeout(() => {
            window.location.href = `editor.html?id=${encodeURIComponent(res.id)}`;
          }, 1000);
        }
      }
    } catch (err) {
      showToast('Gagal menyimpan: ' + err.message, 'error');
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  }

  /* ---------- Init ---------- */
  function initEditor() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const type = params.get('type');

    initToolbar();
    initImageUpload();
    $('postForm').addEventListener('submit', onSubmit);

    if (id) {
      loadPostForEdit(id);
    } else {
      document.title = 'Buat Konten Baru - Admin GRRM';
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