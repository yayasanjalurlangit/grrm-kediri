/* Render struktur organisasi secara dinamis */
(async () => {
  const chart = document.getElementById('orgGrid');
  if (!chart) return;

  // 1. Siapkan Data Dummy sebagai cadangan
  const dummyData = [
    { role: 'Ketua', name: 'H. Ahmad Fauzi' },
    { role: 'Wakil Ketua', name: 'M. Ridwan, S.Pd' },
    { role: 'Sekretaris', name: 'Abdul Rohman' },
    { role: 'Bendahara', name: 'Imam Nawawi' },
    { role: 'Anggota', name: 'Bambang S.' },
    { role: 'Anggota', name: 'Hasan Basri' }
  ];

  let data = [];

  try {
    // 2. Coba ambil data dari Blogger
    const res = await BloggerAPI.posts({ labels: 'struktur-organisasi', maxResults: 1, fetchBodies: true });
    const post = res.items?.[0];
    
    if (post) {
      data = JSON.parse(BloggerAPI.strip(post.content));
    } else {
      data = dummyData; // Jika API berhasil tapi post kosong, pakai dummy
    }
  } catch (err) {
    // 3. Jika API Gagal (misal karena API Key belum diisi), pakai dummy
    console.warn("Blogger API belum siap, menggunakan data contoh.");
    data = dummyData;
  }

  try {
    // 4. Kelompokkan berdasarkan jabatan
    const ketua = data.filter(p => p.role.toLowerCase().includes('ketua') && !p.role.toLowerCase().includes('wakil'));
    const wakil = data.filter(p => p.role.toLowerCase().includes('wakil'));
    const inti = data.filter(p => {
      const r = p.role.toLowerCase();
      return r.includes('sekretaris') || r.includes('bendahara');
    });
    const anggota = data.filter(p => {
      const r = p.role.toLowerCase();
      return !r.includes('ketua') && !r.includes('wakil') && !r.includes('sekretaris') && !r.includes('bendahara');
    });

    // 5. Render ke HTML
    const renderCard = (p, extraClass = '') => {
      // Cek apakah ada foto, jika tidak ada pakai inisial
      let avatarContent;
      if (p.img && p.img.trim() !== '') {
        avatarContent = `<img src="assets/img/${p.img.trim()}" alt="${p.name}">`;
      } else {
        const initials = p.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        avatarContent = initials;
      }

      return `
        <div class="org-card ${extraClass} reveal">
          <div class="org-card__avatar">${avatarContent}</div>
          <div class="org-card__role">${p.role}</div>
          <div class="org-card__name">${p.name}</div>
        </div>
      `;
    };
    let html = '';
    if (ketua.length) html += `<div class="org-level">${ketua.map(p => renderCard(p, 'org-card--leader')).join('')}</div>`;
    if (wakil.length) html += `<div class="org-level">${wakil.map(p => renderCard(p, 'org-card--leader')).join('')}</div>`;
    if (inti.length) html += `<div class="org-level">${inti.map(p => renderCard(p, 'org-card--core')).join('')}</div>`;
    if (anggota.length) html += `<div class="org-level">${anggota.map(p => renderCard(p)).join('')}</div>`;

    chart.innerHTML = html;

    // 6. Trigger animasi
    setTimeout(() => {
      chart.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
    }, 50);

  } catch (err) {
    console.error(err);
    chart.innerHTML = `<div class="empty">Data struktur tidak valid.</div>`;
  }
})();