/* Logika Halaman Galeri (Grup Bulan & Album Per Post) */
(() => {
  const container  = document.getElementById('galleryContainer');
  const search     = document.getElementById('gallerySearch');
  const loadBtn    = document.getElementById('loadMoreBtn');
  
  // Lightbox Elements
  const lb         = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbClose    = document.getElementById('lightboxClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');
  
  // Album Modal Elements
  const albumModal = document.getElementById('albumModal');
  const albumTitle = document.getElementById('albumTitle');
  const albumMeta  = document.getElementById('albumMeta');
  const albumGrid  = document.getElementById('albumGrid');
  const albumClose = document.getElementById('albumClose');

  let allPosts = []; 
  let searchQuery = '';
  let displayLimit = 6; 

  // State untuk navigasi Lightbox
  let currentImages = [];
  let currentImageIndex = 0;

  // Fungsi Ekstrak Semua Gambar dari HTML Blogger
  const extractImages = (html) => {
    if (!html) return [];
    const div = document.createElement('div');
    div.innerHTML = html;
    const imgs = Array.from(div.querySelectorAll('img'));
    return imgs.map(img => {
      let src = img.src || img.getAttribute('src');
      if (src && src.startsWith('//')) src = 'https:' + src;
      // Paksa resolusi asli (s1600)
      if (src) src = src.replace(/\/s\d+(-c)?\//, '/s1600/');
      return src;
    }).filter(src => src);
  };

  // --- RENDER GALERI UTAMA (KARTU POST) ---
  const render = () => {
    const filtered = allPosts.filter(p => p.title.toLowerCase().includes(searchQuery));

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty">Tidak ada kegiatan yang cocok dengan pencarian Anda.</div>`;
      loadBtn.style.display = 'none';
      return;
    }

    const visiblePosts = filtered.slice(0, displayLimit);

    const grouped = visiblePosts.reduce((acc, post) => {
      if (!acc[post.monthYear]) acc[post.monthYear] = [];
      acc[post.monthYear].push(post);
      return acc;
    }, {});

    let html = '';
    for (const [monthYear, posts] of Object.entries(grouped)) {
      html += `<div class="gallery-section reveal">`;
      html += `<h3 class="gallery-date-title">${monthYear}</h3>`;
      html += `<div class="gallery-grid">`;
      
      posts.forEach(p => {
        const coverImg = p.images[0];
        // Simpan data post ke dataset
        const postData = JSON.stringify({
          title: p.title,
          dateStr: p.dateStr,
          author: p.author,
          images: p.images
        }).replace(/"/g, '&quot;');
        
        html += `
          <div class="gallery-card gallery-card--post" data-post="${postData}">
            <img src="${coverImg}" alt="${p.title}" loading="lazy">
            <div class="gallery-card__overlay">
              <span class="gallery-card__title">${p.title}</span>
              <span class="gallery-card__count">${p.images.length} Foto</span>
            </div>
          </div>
        `;
      });

      html += `</div></div>`;
    }

    container.innerHTML = html;
    loadBtn.style.display = (filtered.length > displayLimit) ? 'inline-flex' : 'none';

    // Event Listener buka Album
    container.querySelectorAll('.gallery-card--post').forEach(card => {
      card.addEventListener('click', () => {
        const post = JSON.parse(card.dataset.post);
        openAlbum(post);
      });
    });

    setTimeout(() => {
      container.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
    }, 50);
  };

  // --- LOGIKA ALBUM MODAL (LEVEL 2) ---
  const openAlbum = (post) => {
    albumTitle.textContent = post.title;
    
    // Tampilkan Tanggal & Author
    let metaText = post.dateStr;
    if (post.author) metaText += ` • Oleh: Gerakan Resik Resik Masjid Kediri`;
    albumMeta.textContent = metaText;

    albumGrid.innerHTML = post.images.map((imgUrl, index) => `
      <img src="${imgUrl}" alt="Foto Kegiatan" loading="lazy" data-index="${index}">
    `).join('');

    // Simpan state gambar saat ini
    currentImages = post.images;

    // Klik foto -> Buka Fullscreen
    albumGrid.querySelectorAll('img').forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = parseInt(img.dataset.index);
        showLightboxImage();
        lb.classList.add('is-open');
      });
    });

    albumModal.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // Cegah scroll body
  };

  // --- LOGIKA LIGHTBOX (LEVEL 3) ---
  const showLightboxImage = () => {
    if (currentImages.length > 0 && currentImages[currentImageIndex]) {
      lbImg.src = currentImages[currentImageIndex];
    }
  };

  const nextImage = () => {
    if (currentImages.length > 0) {
      currentImageIndex = (currentImageIndex + 1) % currentImages.length;
      showLightboxImage();
    }
  };

  const prevImage = () => {
    if (currentImages.length > 0) {
      currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
      showLightboxImage();
    }
  };

  // --- LOAD DATA DARI BLOGGER ---
  const loadData = async () => {
    try {
      const res = await BloggerAPI.posts({ labels: 'galeri', maxResults: 100, fetchBodies: true });
      const posts = res.items || [];
      
      if (posts.length === 0) throw new Error("Kosong");

      allPosts = posts.map(p => {
        const d = new Date(p.published);
        const monthYear = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        return {
          id: p.id,
          title: p.title,
          monthYear: monthYear,
          dateStr: dateStr,
          author: p.author?.displayName || 'Admin GRRM',
          images: extractImages(p.content)
        };
      }).filter(p => p.images.length > 0);

    } catch (err) {
      console.warn("Menggunakan data dummy galeri.");
      const now = new Date();
      const monthYear = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      
      allPosts = [
        {
          id: 'dummy1',
          title: 'Kegiatan Masjid Al-Hikmah Sukorejo',
          monthYear: monthYear,
          dateStr: dateStr,
          author: 'Admin GRRM',
          images: ['assets/img/slide-1.webp', 'assets/img/slide-2.webp', 'assets/img/slide-3.webp']
        }
      ];
    }
    render();
  };

  // --- EVENT LISTENERS ---
  search?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    displayLimit = 6; 
    render();
  });

  loadBtn?.addEventListener('click', () => {
    displayLimit += 6;
    render();
  });

  // Tutup Lightbox
  const closeLb = () => lb?.classList.remove('is-open');
  lbClose?.addEventListener('click', closeLb);
  lb?.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });

  // Navigasi Lightbox (Klik)
  lbPrev?.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
  lbNext?.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });

  // Tutup Album Modal
  const closeAlbum = () => {
    albumModal.classList.remove('is-open');
    document.body.style.overflow = ''; 
  };
  albumClose?.addEventListener('click', closeAlbum);
  albumModal?.addEventListener('click', (e) => { if (e.target === albumModal) closeAlbum(); });

  // Navigasi Keyboard (Escape, Kiri, Kanan)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lb.classList.contains('is-open')) closeLb();
      else if (albumModal.classList.contains('is-open')) closeAlbum();
    }
    if (lb.classList.contains('is-open')) {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    }
  });

  loadData();
})();