/* Logika Halaman Galeri (Grid & Grup Tanggal) */
(() => {
  const container  = document.getElementById('galleryContainer');
  const search     = document.getElementById('gallerySearch');
  const loadBtn    = document.getElementById('loadMoreBtn');
  const lb         = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbClose    = document.getElementById('lightboxClose');

  let allPhotos = [];
  let searchQuery = '';
  let displayLimit = 12; // Batas awal foto yang ditampilkan

  // --- DATA DUMMY (Diperbanyak untuk tes "Muat Lebih Banyak") ---
  const now = new Date();
  const dummyPhotos = Array.from({ length: 18 }).map((_, i) => {
    // Buat variasi tanggal (3 hari terakhir)
    const d = new Date(now.getTime() - (Math.floor(i / 6) * 86400000)); 
    return {
      title: `Kegiatan Masjid ke-${i + 1}`,
      dateStr: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      img: `assets/img/slide-${(i % 3) + 1}.webp`
    };
  });

  // --- RENDER GRID BERDASARKAN TANGGAL ---
  const render = () => {
    // 1. Filter berdasarkan pencarian
    const filtered = allPhotos.filter(p => 
      p.title.toLowerCase().includes(searchQuery)
    );

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty">Tidak ada foto yang cocok dengan pencarian Anda.</div>`;
      loadBtn.style.display = 'none';
      return;
    }

    // 2. Batasi jumlah yang tampil
    const visiblePhotos = filtered.slice(0, displayLimit);

    // 3. Kelompokkan berdasarkan Tanggal
    const grouped = visiblePhotos.reduce((acc, photo) => {
      if (!acc[photo.dateStr]) acc[photo.dateStr] = [];
      acc[photo.dateStr].push(photo);
      return acc;
    }, {});

    // 4. Susun HTML
    let html = '';
    for (const [date, photos] of Object.entries(grouped)) {
      html += `<div class="gallery-section reveal">`;
      html += `<h3 class="gallery-date-title">${date}</h3>`;
      html += `<div class="gallery-grid">`;
      
      photos.forEach(p => {
        html += `
          <div class="gallery-card" data-src="${p.img}">
            <img src="${p.img}" alt="${p.title}" loading="lazy">
            <div class="gallery-card__overlay">
              <span class="gallery-card__title">${p.title}</span>
            </div>
          </div>
        `;
      });

      html += `</div></div>`; // Tutup grid & section
    }

    container.innerHTML = html;

    // 5. Tampilkan/Sembunyikan Tombol Load More
    loadBtn.style.display = (filtered.length > displayLimit) ? 'inline-flex' : 'none';

    // 6. Pasang Event Lightbox
    container.querySelectorAll('.gallery-card').forEach(card => {
      card.addEventListener('click', () => {
        lbImg.src = card.dataset.src;
        lb.classList.add('is-open');
      });
    });

    // 7. Trigger Animasi
    setTimeout(() => {
      container.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
    }, 50);
  };

  // --- LOAD DATA ---
  const loadData = async () => {
    try {
      const res = await BloggerAPI.posts({ labels: 'galeri', maxResults: 60, fetchBodies: true });
      const posts = res.items || [];
      if (posts.length === 0) throw new Error("Kosong");

      allPhotos = posts.map(p => {
        const d = new Date(p.published);
        return {
          title: p.title,
          dateStr: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          img: BloggerAPI.firstImage(p)
        };
      });
    } catch (err) {
      console.warn("Menggunakan data dummy galeri.");
      allPhotos = dummyPhotos;
    }
    render();
  };

  // --- EVENT LISTENERS ---

  // Pencarian
  search?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    displayLimit = 12; // Reset limit saat mencari
    render();
  });

  // Muat Lebih Banyak
  loadBtn?.addEventListener('click', () => {
    displayLimit += 12;
    render();
  });

  // Tutup Lightbox
  const closeLb = () => lb?.classList.remove('is-open');
  lbClose?.addEventListener('click', closeLb);
  lb?.addEventListener('click', (e) => {
    if (e.target === lb) closeLb(); // Hanya tutup jika klik background
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLb();
  });

  // Jalankan
  loadData();
})();