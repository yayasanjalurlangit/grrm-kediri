/* =========================================================
   GRRM - Galeri Page Logic
   Fetch album dari Blogger (label: "galeri") + filter + lightbox
   ========================================================= */

(function () {
  'use strict';

  const PREFERS_REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DURATION = PREFERS_REDUCED_MOTION ? 0 : 340;
  const GALERI_LABEL = 'galeri';

  let allAlbums = [];
  let activeFilter = 'all';

  /* ---------- Render 1 album ---------- */
  function buildAlbum(post) {
    const B = window.GRRM_BLOGGER;

    /* Ambil semua gambar dari konten */
    const images = B.extractAllImages(post.content || '').map(B.upgradeImageUrl);
    if (images.length === 0) return null; /* skip album tanpa gambar */

    const year = String(new Date(post.published).getFullYear());

    const section = document.createElement('section');
    section.className = 'galeri-album';
    section.dataset.year = year;

    /* Grid foto */
    let gridHtml = '';
    images.forEach(function (src, i) {
      const label = (post.title || 'Foto') + ' — Foto ' + (i + 1);
      gridHtml +=
        '<a href="' + src + '" class="galeri-item glightbox" ' +
        '   data-gallery="album-' + post.id + '" ' +
        '   data-glightbox="title: ' + (post.title || '') + '; description: Foto ' + (i + 1) + ' dari ' + images.length + '" ' +
        '   aria-label="' + label + '">' +
        '  <img src="' + src + '" alt="' + label + '" loading="lazy">' +
        '</a>';
    });

    const albumDate = B.formatDate(post.published);
    const metaText = images.length + ' foto · ' + albumDate;

    section.innerHTML =
      '<div class="galeri-album-header">' +
        '<h3>' + (post.title || 'Album') + '</h3>' +
        '<span class="meta">' + metaText + '</span>' +
      '</div>' +
      '<div class="galeri-grid">' + gridHtml + '</div>';

    return section;
  }

  /* ---------- Filter ---------- */
  function matchesFilter(album, filter) {
    if (filter === 'all') return true;
    return album.dataset.year === filter;
  }

  function applyFilterImmediate(filter, albums) {
    albums.forEach(function (album) {
      album.style.display = matchesFilter(album, filter) ? '' : 'none';
    });
  }

  function applyFilterSmooth(filter, albums, emptyState) {
    const toHide = [];
    const toShow = [];

    albums.forEach(function (album) {
      (matchesFilter(album, filter) ? toShow : toHide).push(album);
    });

    toHide.forEach(function (album) {
      if (album.style.display === 'none') return;
      album.style.opacity = '0';
      album.style.transform = 'translateY(10px)';
    });

    setTimeout(function () {
      toHide.forEach(function (album) { album.style.display = 'none'; });

      toShow.forEach(function (album) {
        const wasHidden = album.style.display === 'none';
        album.style.display = '';
        if (wasHidden) {
          album.style.opacity = '0';
          album.style.transform = 'translateY(10px)';
        }
      });

      if (emptyState) emptyState.hidden = toShow.length > 0;

      void document.body.offsetHeight;

      toShow.forEach(function (album, i) {
        const wasHidden = album.style.opacity === '0';
        const delay = wasHidden ? Math.min(i * 60, 240) : 0;
        setTimeout(function () {
          album.style.opacity = '1';
          album.style.transform = 'translateY(0)';
        }, delay);
      });
    }, DURATION);
  }

  function initFilter(albums) {
    const chips = document.querySelectorAll('.filter-chip');
    const emptyState = document.getElementById('galeriEmpty');
    if (chips.length === 0) return;

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const newFilter = chip.dataset.filter;
        if (newFilter === activeFilter) return;
        activeFilter = newFilter;
        chips.forEach(function (c) { c.classList.toggle('active', c === chip); });

        if (PREFERS_REDUCED_MOTION) {
          applyFilterImmediate(newFilter, albums);
          if (emptyState) {
            const visible = albums.filter(function (a) {
              return matchesFilter(a, newFilter);
            }).length;
            emptyState.hidden = visible > 0;
          }
        } else {
          applyFilterSmooth(newFilter, albums, emptyState);
        }
      });
    });
  }

  /* ---------- Build filter chips dinamis dari tahun album ---------- */
  function buildYearChips(albums) {
    const filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;

    const years = {};
    albums.forEach(function (a) {
      const y = a.dataset.year;
      if (y) years[y] = (years[y] || 0) + 1;
    });

    const sortedYears = Object.keys(years).sort().reverse();

    /* Bersihkan chip lama (kecuali label & "Semua") */
    filterBar.querySelectorAll('.filter-chip').forEach(function (c) {
      if (c.dataset.filter !== 'all') c.remove();
    });

    /* Tambah chip tahun */
    sortedYears.forEach(function (y) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-chip';
      btn.dataset.filter = y;
      btn.textContent = y;
      filterBar.appendChild(btn);
    });
  }

  /* ---------- Render semua ---------- */
  function renderAll(posts) {
    const container = document.querySelector('main .container');
    const emptyState = document.getElementById('galeriEmpty');
    if (!container) return;

    /* Hapus album statis yang lama (kalau ada) */
    container.querySelectorAll('.galeri-album').forEach(function (el) { el.remove(); });

    /* Render album baru */
    const albums = [];
    posts.forEach(function (post) {
      const album = buildAlbum(post);
      if (!album) return;
      if (emptyState) container.insertBefore(album, emptyState);
      else container.appendChild(album);
      albums.push(album);
    });

    if (albums.length === 0) {
      if (emptyState) {
        emptyState.hidden = false;
        emptyState.querySelector('p').textContent = 'Belum ada album galeri.';
      }
      return;
    }

    if (emptyState) emptyState.hidden = true;

    buildYearChips(albums);
    initFilter(albums);

    /* Init lightbox setelah render */
    if (window.GRRM_GLIGHTBOX) window.GRRM_GLIGHTBOX.init();
  }

  function renderLoading() {
    const container = document.querySelector('main .container');
    const emptyState = document.getElementById('galeriEmpty');
    if (!container) return;
    if (emptyState) {
      emptyState.hidden = false;
      emptyState.querySelector('p').textContent = 'Memuat galeri…';
    }
  }

  function renderError(msg) {
    const emptyState = document.getElementById('galeriEmpty');
    if (!emptyState) return;
    emptyState.hidden = false;
    emptyState.querySelector('p').textContent = msg;
  }

  /* ---------- Boot ---------- */
  function init() {
    const container = document.querySelector('main .container');
    if (!container) return;

    renderLoading();

    window.GRRM_BLOGGER.fetchPosts({
      maxResults: 50,        /* ambil lebih banyak, filter di client */
      orderBy: 'published'
    })
      .then(function (res) {
        /* Filter client-side: label harus mengandung "galeri" (case-insensitive) */
        allAlbums = res.items.filter(function (post) {
          if (!post.labels || post.labels.length === 0) return false;
          return post.labels.some(function (l) {
            return String(l).trim().toLowerCase() === 'galeri';
          });
        });

        if (allAlbums.length === 0) {
          renderError('Belum ada album galeri. Buat post dengan label "galeri" di Blogger.');
          return;
        }
        renderAll(allAlbums);
      })
      .catch(function (err) {
        console.error('[Galeri]', err);
        renderError('Gagal memuat galeri. ' + err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();