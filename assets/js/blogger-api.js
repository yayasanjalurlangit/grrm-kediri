/* =========================================================
   GRRM - Blogger API v3 Wrapper
   Fetch posts, post by ID, extract images, strip HTML
   ========================================================= */

(function (global) {
  'use strict';

  const CFG = global.GRRM_CONFIG || {};
  const B = CFG.blogger || {};

  const BASE_URL = B.baseUrl || 'https://www.googleapis.com/blogger/v3/blogs';
  const BLOG_ID  = B.blogId  || '';
  const API_KEY  = B.apiKey  || '';
  const MAX      = B.maxResults || 10;

  /* ---------- Internal helper ---------- */
  function buildUrl(path, params) {
    const url = new URL(BASE_URL + '/' + BLOG_ID + path);
    url.searchParams.set('key', API_KEY);
    if (params) {
      Object.keys(params).forEach(function (k) {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          url.searchParams.set(k, params[k]);
        }
      });
    }
    return url.toString();
  }

  function handleResponse(res) {
    if (!res.ok) {
      return res.text().then(function (txt) {
        throw new Error('Blogger API error ' + res.status + ': ' + txt);
      });
    }
    return res.json();
  }

  /* ---------- Public API ---------- */

  /**
   * Ambil daftar post
   * @param {Object} opts
   * @param {string} [opts.labels]      - filter label, mis. "Kegiatan"
   * @param {number} [opts.maxResults]  - default 10
   * @param {string} [opts.pageToken]   - untuk pagination
   * @param {string} [opts.orderBy]     - "published" | "updated"
   * @param {boolean} [opts.fetchImages]- sertakan URL gambar di response
   */
  function fetchPosts(opts) {
    opts = opts || {};
    const params = {
      maxResults: opts.maxResults || MAX,
      pageToken: opts.pageToken || '',
      fetchImages: opts.fetchImages !== false ? 'true' : 'false',
      orderBy: opts.orderBy || 'published'
    };
    if (opts.labels) params.labels = opts.labels;

    return fetch(buildUrl('/posts', params))
      .then(handleResponse)
      .then(function (data) {
        return {
          items: data.items || [],
          nextPageToken: data.nextPageToken || null,
          totalItems: data.totalItems || 0
        };
      });
  }

  /**
   * Ambil 1 post by ID
   * @param {string} postId
   */
  function fetchPostById(postId) {
    if (!postId) return Promise.reject(new Error('postId wajib diisi'));
    return fetch(buildUrl('/posts/' + encodeURIComponent(postId), {
      fetchImages: 'true'
    }))
      .then(handleResponse);
  }

  /**
   * Ambil info blog (untuk cek koneksi)
   */
  function fetchBlogInfo() {
    return fetch(buildUrl('', {}))
      .then(handleResponse);
  }

  /* ---------- Utilities ---------- */

  /**
   * Ambil URL gambar pertama dari HTML konten
   */
  function extractFirstImage(html) {
    if (!html) return '';
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    return m ? m[1] : '';
  }

  /**
   * Ambil semua URL gambar dari HTML
   */
  function extractAllImages(html) {
    if (!html) return [];
    const out = [];
    const re = /<img[^>]+src=["']([^"']+)["']/gi;
    let m;
    while ((m = re.exec(html)) !== null) out.push(m[1]);
    return out;
  }

  /**
   * Buang tag HTML, return plain text
   */
  function stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Bikin excerpt dari HTML
   */
  function makeExcerpt(html, maxLen) {
    maxLen = maxLen || 140;
    const txt = stripHtml(html);
    if (txt.length <= maxLen) return txt;
    return txt.slice(0, maxLen).trim() + '…';
  }

  /**
   * Format tanggal ke Indonesia, mis. "12 Okt 2026"
   */
  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
  }

    /**
   * Blogger menyimpan gambar dengan suffix ukuran (mis. /s320/, /s72-c/).
   * Fungsi ini mengganti ke ukuran besar (s1600).
   */
  function upgradeImageUrl(url) {
    if (!url) return url;
    return url.replace(/\/s\d+(-c)?\//, '/s1600/');
  }

  /* ---------- Expose ---------- */
  global.GRRM_BLOGGER = {
    fetchPosts: fetchPosts,
    fetchPostById: fetchPostById,
    fetchBlogInfo: fetchBlogInfo,
    extractFirstImage: extractFirstImage,
    extractAllImages: extractAllImages,
    stripHtml: stripHtml,
    makeExcerpt: makeExcerpt,
    formatDate: formatDate,
    upgradeImageUrl: upgradeImageUrl
  };
})(window);