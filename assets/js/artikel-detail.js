/* Logika Halaman Detail Artikel Gaya Biz.kompas */
(async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  const loadingEl = document.getElementById('loadingSkeleton');
  const contentEl = document.getElementById('pageContent');
  const errorEl   = document.getElementById('errorMessage');

  if (!postId) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
    return;
  }

  try {
    // --- 1. LOAD ARTIKEL UTAMA ---
    const post = await BloggerAPI.postById(postId);

    const dateObj = new Date(post.published);
    const dateStr = dateObj.toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    const label = (post.labels && post.labels.length > 0) ? post.labels[0] : 'Berita';

    // Isi Data Header
    document.title = `${post.title} — GRRM Kediri`;
    document.getElementById('articleCategory').textContent = label;
    document.getElementById('articleTitle').textContent = post.title;
    document.getElementById('articleDate').textContent = dateStr;

    // --- 2. HANDLE GAMBAR UTAMA (HERO IMAGE) ---
    const imgUrl = BloggerAPI.firstImage(post);
    let hasHeroImage = false;

    if (imgUrl && imgUrl !== 'assets/img/logo-grrm.webp') {
      hasHeroImage = true;
      const imgWrapper = document.getElementById('articleImageWrapper');
      const imgEl = document.getElementById('articleImage');
      const captionEl = document.getElementById('articleCaption');
      
      imgEl.src = imgUrl;
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = post.content;
      const imgInContent = tempDiv.querySelector('img');
      
      if (imgInContent && imgInContent.alt) {
        captionEl.textContent = `Foto: ${imgInContent.alt}`;
      } else {
        captionEl.textContent = `Dokumentasi GRRM Kediri`;
      }
      imgWrapper.style.display = 'block';
    }

    // --- 3. ISI KONTEN & HAPUS GAMBAR DOUBLE ---
    // Kita buat elemen virtual untuk memanipulasi HTML dari Blogger
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = post.content;
    
    // Cari gambar pertama di dalam konten
    const firstImgInContent = contentDiv.querySelector('img');
    
    // Jika kita punya Hero Image, hapus gambar pertama di dalam teks agar tidak dobel
    if (hasHeroImage && firstImgInContent) {
      firstImgInContent.remove();
    }
    
    // Bersihkan tag style bawaan Blogger
    let cleanContent = contentDiv.innerHTML.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    document.getElementById('articleBody').innerHTML = cleanContent;

    // --- 4. TOMBOL SHARE ---
    const currentUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`Baca artikel menarik ini: ${post.title}`);
    
    document.getElementById('shareWA').href = `https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`;
    document.getElementById('shareFB').href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    
    document.getElementById('shareCopy').addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = document.getElementById('shareCopy');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        btn.style.background = '#10B981';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '#64748b';
        }, 2000);
      });
    });

    // Tampilkan
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';

    // --- 5. LOAD ARTIKEL TERKAIT ---
    loadRelatedPosts(postId);

  } catch (err) {
    console.error("Gagal memuat artikel:", err);
    loadingEl.style.display = 'none';
    errorEl.style.display = 'block';
  }
})();

/* Fungsi untuk mengambil dan merender artikel terkait */
async function loadRelatedPosts(currentId) {
  const widget = document.getElementById('relatedWidget');
  const list   = document.getElementById('relatedList');

  try {
    const res = await BloggerAPI.posts({ maxResults: 4, fetchBodies: false });
    let posts = res.items || [];

    // Saring agar artikel yang sedang dibuka tidak muncul
    posts = posts.filter(p => p.id !== currentId).slice(0, 3);

    if (posts.length === 0) return;

    list.innerHTML = posts.map(p => {
      const imgUrl = BloggerAPI.firstImage(p);
      const label = (p.labels && p.labels.length > 0) ? p.labels[0] : 'Berita';
      
      return `
        <a href="artikel-detail.html?id=${p.id}" class="related-item">
          <img src="${imgUrl}" alt="${p.title}" class="related-img" loading="lazy">
          <div class="related-info">
            <div class="related-meta">${label}</div>
            <div class="related-title">${p.title}</div>
          </div>
        </a>
      `;
    }).join('');

    widget.style.display = 'block';

  } catch (err) {
    console.warn("Gagal memuat artikel terkait", err);
  }
}