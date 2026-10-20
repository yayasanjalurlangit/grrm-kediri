/* ============ HELPER BLOGGER API v3 ============ */
const BloggerAPI = (() => {
  const BASE = 'https://www.googleapis.com/blogger/v3/blogs';
  const cache = new Map();
  const TTL = 5 * 60 * 1000;

  async function request(path, params = {}) {
    const url = new URL(`${BASE}/${SITE.BLOG_ID}${path}`);
    url.searchParams.set('key', SITE.API_KEY);
    Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
    const key = url.toString();
    if (cache.has(key) && Date.now() - cache.get(key).t < TTL) return cache.get(key).d;

    const res = await fetch(key);
    if (!res.ok) throw new Error(`Blogger API ${res.status}`);
    const data = await res.json();
    cache.set(key, { t: Date.now(), d: data });
    return data;
  }

  const posts = (opts = {}) => request('/posts', {
    maxResults: 12, fetchImages: true, fetchBodies: false, ...opts
  });

  const postById = id => request(`/posts/${id}`, { fetchImages: true, fetchBodies: true });

  /* util */
  const strip = html => {
    const d = document.createElement('div');
    d.innerHTML = html || '';
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  };

  const excerpt = (html, n = 140) => {
    const t = strip(html);
    return t.length > n ? t.slice(0, n).trimEnd() + '…' : t;
  };

  const firstImage = post => {
    let url = post.images?.url;
    if (!url) {
      const m = (post.content || '').match(/<img[^>]+src="([^"]+)"/i);
      url = m ? m[1] : 'assets/img/logo-grrm.webp'; // Fallback ke logo GRRM
    }
    // Perbaiki URL protokol-relatif dari Google
    if (url.startsWith('//')) return `https:${url}`;
    return url;
  };

  const fmtDate = iso => new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return { posts, postById, strip, excerpt, firstImage, fmtDate };
})();