/* Logika Halaman Artikel */
(() => {
  const grid     = document.getElementById('artikelGrid');
  const search   = document.getElementById('artikelSearch');
  const filter   = document.getElementById('artikelFilter');
  const loadBtn  = document.getElementById('loadMore');

  let allPosts = [];
  let activeLabel = 'all';
  let searchQuery = '';
  let nextPageToken = null;

  // --- DATA DUMMY (Untuk testing sebelum API terhubung) ---
  const dummyPosts = [
    {
      title: "Pembersihan Masjid Al-Hikmah Sukorejo",
      content: "Alhamdulillah, kegiatan rutin GRRM Kediri telah dilaksanakan di Masjid Al-Hikmah Sukorejo. Kegiatan ini melibatkan 15 relawan...",
      published: new Date().toISOString(),
      labels: ["kegiatan", "berita"],
      images: { url: "assets/img/slide-1.webp" },
      url: "#"
    },
    {
      title: "Pemberitahuan Libur Kegiatan Bulan Ramadhan",
      content: "Berdasarkan rapat pengurus, kegiatan bersih masjid akan diliburkan sementara selama bulan Ramadhan dan akan dilanjutkan...",
      published: new Date(Date.now() - 86400000).toISOString(),
      labels: ["pengumuman"],
      images: { url: "assets/img/slide-2.webp" },
      url: "#"
    },
    {
      title: "Gotong Royong Masjid Baitul Muttaqin",
      content: "Sinergi antara warga sekitar dan relawan GRRM Kediri dalam membersihkan area halaman dan tempat wudhu masjid...",
      published: new Date(Date.now() - 172800000).toISOString(),
      labels: ["kegiatan"],
      images: { url: "assets/img/slide-3.webp" },
      url: "#"
    },
    {
      title: "Selamat Datang di Website Baru GRRM Kediri",
      content: "Website ini dibuat sebagai wadah informasi dan sarana transparansi kegiatan Yayasan Jalur Langit Kediri...",
      published: new Date(Date.now() - 259200000).toISOString(),
      labels: ["berita"],
      images: { url: "assets/img/slide-1.webp" },
      url: "#"
    }
  ];

  // --- FUNGSI RENDER KARTU ---
  const renderCard = (p, i) => {
    const imgUrl = p.images?.url || (p.content || '').match(/<img[^>]+src="([^"]+)"/i)?.[1] || 'assets/img/slide-1.webp';
    const firstLabel = (p.labels && p.labels.length > 0) ? p.labels[0] : 'berita';
    const dateStr = new Date(p.published).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // Batasi teks isi (excerpt)
    const div = document.createElement('div');
    div.innerHTML = p.content || '';
    let textContent = div.textContent || div.innerText || '';
    const excerpt = textContent.length > 120 ? textContent.substring(0, 120) + '...' : textContent;

    return `
      <article class="post reveal" style="--d:${(i % 6) * 80}ms">
        <div class="post__thumb">
          <img src="${imgUrl}" alt="${p.title}" loading="lazy">
        </div>
        <div class="post__body">
          <span class="badge ${firstLabel === 'pengumuman' ? 'badge--yellow' : ''}">${firstLabel}</span>
          <span class="post__date">${dateStr}</span>
          <h3 class="post__title">${p.title}</h3>
          <p class="post__excerpt">${excerpt}</p>
          <a class="post__link" href="artikel-detail.html?id=${p.id}">Baca selengkapnya →</a>
        </div>
      </article>
    `;
  };

  // --- FUNGSI FILTER & RENDER ---
  const render = () => {
    const filtered = allPosts.filter(p => {
      // Filter Label
      const matchLabel = activeLabel === 'all' || (p.labels && p.labels.includes(activeLabel));
      
      // Filter Pencarian (Cari di judul atau isi)
      const matchSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery) || 
        (p.content || '').toLowerCase().includes(searchQuery);

      return matchLabel && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="empty" style="grid-column: 1 / -1;">Tidak ada artikel yang cocok dengan pencarian Anda.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(renderCard).join('');

    // Trigger animasi reveal
    requestAnimationFrame(() => {
      grid.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
    });
  };

  // --- FUNGSI LOAD DATA ---
  const loadPosts = async (isLoadMore = false) => {
    if (!isLoadMore) {
      grid.innerHTML = `<div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div>`;
    }

    try {
      // Coba ambil dari API
      const res = await BloggerAPI.posts({ 
        maxResults: 12, 
        fetchBodies: true, 
        pageToken: nextPageToken || undefined 
      });
      
      let newPosts = res.items || [];
      newPosts = newPosts.filter(p => !(p.labels && p.labels.includes('struktur-organisasi')));
      nextPageToken = res.nextPageToken || null;
      
      // Jika API kosong (belum ada post), baru pakai dummy
      if (newPosts.length === 0 && !isLoadMore && allPosts.length === 0) {
        allPosts = dummyPosts;
      } else {
        allPosts = isLoadMore ? [...allPosts, ...newPosts] : newPosts;
      }

    } catch (err) {
      // Jika API Gagal (belum di setting), pakai dummy
      console.warn("API Belum siap, menggunakan data contoh.");
      allPosts = dummyPosts;
      nextPageToken = null; 
    }

    // Tampilkan tombol load more jika ada pageToken
    if (loadBtn) {
      loadBtn.style.display = nextPageToken ? 'inline-flex' : 'none';
    }

    render();
  };

  // --- EVENT LISTENERS ---
  
  // Pencarian
  search?.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    render();
  });

  // Filter Kategori
  filter?.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    
    filter.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
    btn.classList.add('is-active');
    
    activeLabel = btn.dataset.label;
    render();
  });

  // Tombol Load More
  loadBtn?.addEventListener('click', () => {
    loadPosts(true);
  });

  // Jalankan saat halaman dimuat
  loadPosts(false);

})();