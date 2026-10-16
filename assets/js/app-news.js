/* =========================================================
   GRRM - News Page Logic
   Fetch dari Blogger API + filter label (smooth animation)
   ========================================================= */

(function () {
  'use strict';

  const PREFERS_REDUCED_MOTION =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DURATION = PREFERS_REDUCED_MOTION ? 0 : 320;

  let allPosts = [];
  let activeFilter = 'all';

  /* ---------- Render kartu ---------- */
  function buildCard(post) {
    const B = window.GRRM_BLOGGER;
    const labels = post.labels || [];
    const cat = labels[0] || 'Berita';
    const img = B.extractFirstImage(post.content || '');
    const excerpt = B.makeExcerpt(post.content || '', 130);

    const article = document.createElement('article');
    article.className = 'news-card';
    article.dataset.labels = labels.join(',').toLowerCase();

    const thumbHtml = img
      ? '<img src="' + img + '" alt="' + (post.title || '') + '" loading="lazy">'
      : 'Foto';

    article.innerHTML =
      '<a href="news-detail.html?id=' + encodeURIComponent(post.id) + '" class="news-thumb" aria-hidden="true">' +
        thumbHtml +
      '</a>' +
      '<div class="news-body">' +
        '<div class="news-meta">' +
          '<span class="cat">' + cat + '</span>' +
          '<span class="meta-item">' + B.formatDate(post.published) + '</span>' +
        '</div>' +
        '<h3><a href="news-detail.html?id=' + encodeURIComponent(post.id) + '">' +
          (post.title || '(Tanpa judul)') +
        '</a></h3>' +
        '<p class="excerpt">' + excerpt + '</p>' +
        '<a href="news-detail.html?id=' + encodeURIComponent(post.id) + '" class="btn btn-outline btn-block">Baca</a>' +
      '</div>';

    return article;
  }

  /* ---------- Filter ---------- */
  function matchesFilter(card, filter) {
    if (filter === 'all') return true;
    const labels = (card.dataset.labels || '').split(',');
    return labels.indexOf(filter.toLowerCase()) !== -1;
  }

  function applyFilterImmediate(filter, cards) {
    cards.forEach(function (card) {
      card.style.display = matchesFilter(card, filter) ? '' : 'none';
    });
  }

  function applyFilterSmooth(filter, cards) {
    const toHide = [];
    const toShow = [];

    cards.forEach(function (card) {
      (matchesFilter(card, filter) ? toShow : toHide).push(card);
    });

    toHide.forEach(function (card) {
      if (card.style.display === 'none') return;
      card.style.opacity = '0';
      card.style.transform = 'scale(0.96)';
    });

    setTimeout(function () {
      toHide.forEach(function (card) { card.style.display = 'none'; });

      toShow.forEach(function (card) {
        const wasHidden = card.style.display === 'none';
        card.style.display = '';
        if (wasHidden) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
        }
      });

      void document.body.offsetHeight;

      toShow.forEach(function (card, i) {
        const needsFadeIn = card.style.opacity === '0';
        const delay = needsFadeIn ? Math.min(i * 30, 240) : 0;
        setTimeout(function () {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, delay);
      });
    }, DURATION);
  }

  /* ---------- Init filter chips ---------- */
  function initFilter(cards) {
    const chips = document.querySelectorAll('.filter-chip');
    if (chips.length === 0) return;

    cards.forEach(function (card) {
      card.style.transition = PREFERS_REDUCED_MOTION
        ? 'none'
        : 'opacity .32s ease, transform .32s ease';
    });

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        const newFilter = chip.dataset.filter;
        if (newFilter === activeFilter) return;
        activeFilter = newFilter;
        chips.forEach(function (c) {
          c.classList.toggle('active', c === chip);
        });
        if (PREFERS_REDUCED_MOTION) applyFilterImmediate(newFilter, cards);
        else applyFilterSmooth(newFilter, cards);
      });
    });
  }

  /* ---------- Render semua ---------- */
  function renderAll(posts) {
    const grid = document.querySelector('.news-grid');
    if (!grid) return;
    grid.innerHTML = '';
    posts.forEach(function (p) { grid.appendChild(buildCard(p)); });
    initFilter(grid.querySelectorAll('.news-card'));
  }

  function renderError(msg) {
    const grid = document.querySelector('.news-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>' + msg + '</p></div>';
  }

  /* ---------- Boot ---------- */
  function init() {
    const grid = document.querySelector('.news-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1;"><p>Memuat berita…</p></div>';

    window.GRRM_BLOGGER.fetchPosts({ maxResults: 12, orderBy: 'published' })
      .then(function (res) {
        allPosts = res.items;
        if (allPosts.length === 0) {
          renderError('Belum ada berita dipublikasikan.');
          return;
        }
        renderAll(allPosts);
      })
      .catch(function (err) {
        console.error('[News]', err);
        renderError('Gagal memuat berita. ' + err.message);
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();