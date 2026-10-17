/* =========================================================
   GRRM - Admin Dashboard (Tabbed Version - Fixed)
   ========================================================= */
(function (global) {
  'use strict';

  let allPosts = [];
  const $ = (id) => document.getElementById(id);

  function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');
    const btnCreate = document.getElementById('btnCreateNew');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panes.forEach(p => p.classList.add('hidden'));

        tab.classList.add('active');
        const targetId = 'tab-' + tab.dataset.tab;
        if ($(targetId)) $(targetId).classList.remove('hidden');

        if (btnCreate) {
          const type = tab.dataset.tab;
          btnCreate.href = `editor.html?type=${type}`;
          btnCreate.textContent = `+ Buat ${type.charAt(0).toUpperCase() + type.slice(1)} Baru`;
        }
      });
    });
  }

  function buildRow(post) {
    const labels = (post.labels || []).map(l => `<span class="post-label">${l}</span>`).join(' ');
    const img = extractFirstImage(post.content);
    const thumbHtml = img ? `<img src="${img}" alt="" loading="lazy">` : `<span class="post-thumb-placeholder">No Image</span>`;
    const dateStr = formatDate(post.published || post.updated);

    const row = document.createElement('article');
    row.className = 'post-row';
    row.innerHTML = `
      <div class="post-thumb">${thumbHtml}</div>
      <div class="post-info">
        <h3 class="post-title">${post.title || '(Tanpa judul)'}</h3>
        <div class="post-meta">
          <span class="post-date">${dateStr}</span>
          <span class="post-labels">${labels}</span>
        </div>
      </div>
      <div class="post-actions">
        <a href="editor.html?id=${post.id}" class="btn btn-outline btn-sm">Edit</a>
        <button type="button" class="btn btn-danger btn-sm" data-id="${post.id}">Hapus</button>
      </div>
    `;

    row.querySelector('.btn-danger').addEventListener('click', (e) => onDelete(post, e.target));
    return row;
  }

  function renderPostsToTabs() {
    const containers = {
      berita: $('beritaContainer'),
      galeri: $('galeriContainer'),
      pengumuman: $('pengumumanContainer')
    };

    Object.values(containers).forEach(c => { if (c) c.innerHTML = ''; });

    if (allPosts.length === 0) {
      Object.values(containers).forEach(c => {
        if (c) c.innerHTML = '<div class="admin-empty"><p>Belum ada konten.</p></div>';
      });
      return;
    }

    let counts = { berita: 0, galeri: 0, pengumuman: 0 };

    allPosts.forEach(post => {
      const labels = (post.labels || []).map(l => l.toLowerCase());
      
      if (labels.includes('galeri') && containers.galeri) {
        containers.galeri.appendChild(buildRow(post));
        counts.galeri++;
      } else if (labels.includes('pengumuman') && containers.pengumuman) {
        containers.pengumuman.appendChild(buildRow(post));
        counts.pengumuman++;
      } else if (containers.berita) {
        containers.berita.appendChild(buildRow(post));
        counts.berita++;
      }
    });

    Object.keys(containers).forEach(key => {
      if (counts[key] === 0 && containers[key]) {
        containers[key].innerHTML = `<div class="admin-empty"><p>Belum ada ${key}.</p></div>`;
      }
    });
  }

  async function loadData() {
    try {
      const data = await global.GRRM_ADMIN.api('/api/blogger/posts?maxResults=100');
      
      if (!data || !data.items) {
        throw new Error('Data postingan tidak ditemukan (Format API salah).');
      }

      allPosts = data.items.sort((a, b) => new Date(b.published || 0) - new Date(a.published || 0));
      renderPostsToTabs();
    } catch (e) {
      console.error(e);
      const errHtml = `<div class="admin-empty"><p>Gagal memuat data: ${e.message}</p><button type="button" class="btn btn-outline" onclick="location.reload()" style="margin-top:10px">Coba Lagi</button></div>`;
      if ($('beritaContainer')) $('beritaContainer').innerHTML = errHtml;
      if ($('galeriContainer')) $('galeriContainer').innerHTML = errHtml;
      if ($('pengumumanContainer')) $('pengumumanContainer').innerHTML = errHtml;
    }
  }

  async function onDelete(post, btnEl) {
    if (!confirm(`Hapus konten "${post.title}"?\nTindakan ini tidak bisa dibatalkan.`)) return;

    const row = btnEl.closest('.post-row');
    const parent = row.parentElement; 
    
    row.style.opacity = '0.5';
    row.style.pointerEvents = 'none';

    try {
      await global.GRRM_ADMIN.api(`/api/blogger/posts?id=${post.id}`, { method: 'DELETE' });
      
      row.remove(); 
      global.GRRM_DASHBOARD.showToast('Konten berhasil dihapus', 'success');
      
      if (parent && parent.children.length === 0) {
        parent.innerHTML = '<div class="admin-empty"><p>Belum ada konten.</p></div>';
      }
    } catch (e) {
      row.style.opacity = '1';
      row.style.pointerEvents = 'auto';
      global.GRRM_DASHBOARD.showToast('Gagal menghapus: ' + e.message, 'error');
    }
  }

  function extractFirstImage(html) {
    if (!html) return '';
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1].replace(/\/s\d+(-c)?\//, '/s400/') : '';
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const bln = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return `${d.getDate()} ${bln[d.getMonth()]} ${d.getFullYear()}`;
  }

  function showToast(msg, type) {
    let t = document.getElementById('adminToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'adminToast';
      document.body.appendChild(t);
    }
    t.className = `admin-toast ${type}`;
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('is-visible'), 3000);
  }

  function initDashboard() {
    initTabs();
    loadData();
  }

  document.addEventListener('admin:ready', initDashboard);

  global.GRRM_DASHBOARD = {
    loadPosts: loadData,
    showToast: showToast
  };
})(window);