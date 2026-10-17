/* =========================================================
   GRRM - Admin Common
   Auth check, logout, fetch helper
   ========================================================= */

(function (global) {
  'use strict';

  /* ---------- Tampilkan layar sesuai state ---------- */
  function showScreen(screen) {
    const loading = document.getElementById('loadingScreen');
    const login = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboardScreen');

    [loading, login, dashboard].forEach(function (el) {
      if (el) el.classList.add('hidden');
    });

    if (screen === 'loading' && loading) loading.classList.remove('hidden');
    if (screen === 'login' && login) login.classList.remove('hidden');
    if (screen === 'dashboard' && dashboard) dashboard.classList.remove('hidden');
  }

  /* ---------- Cek login dari server ---------- */
  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      const data = await res.json();
      return data.loggedIn === true;
    } catch (e) {
      console.error('[Admin] cek login gagal', e);
      return false;
    }
  }

  /* ---------- Logout ---------- */
  async function logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin'
      });
    } catch (e) { /* noop */ }
    window.location.reload();
  }

  /* ---------- Fetch helper ke Blogger proxy ---------- */
  async function api(path, options) {
    options = options || {};
    options.credentials = 'same-origin';
    
    // Tambahkan timeout 30 detik agar tidak stuck selamanya
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    options.signal = controller.signal;

    if (options.body && typeof options.body === 'object') {
      options.headers = Object.assign({}, options.headers, {
        'Content-Type': 'application/json'
      });
      options.body = JSON.stringify(options.body);
    }
    
    try {
      const res = await fetch(path, options);
      clearTimeout(timeoutId);
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Respons server tidak valid (bukan JSON).');
      }

      if (!res.ok) {
        let msg = 'HTTP ' + res.status;
        if (data && data.error) {
          msg = typeof data.error === 'string' ? data.error : (data.error.message || JSON.stringify(data.error));
        }
        throw new Error(msg);
      }
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error('Waktu habis (Timeout). Koneksi ke server terlalu lambat.');
      }
      throw err;
    }
  }

  /* ---------- Ambil info user (placeholder) ---------- */
  function setUserInfo() {
    const el = document.getElementById('userInfo');
    if (el) el.textContent = 'Masuk sebagai Admin';
  }

  /* ---------- Init ---------- */
  async function init() {
    showScreen('loading');

    const loggedIn = await checkAuth();

    if (!loggedIn) {
      showScreen('login');
      return;
    }

    setUserInfo();
    showScreen('dashboard');

    /* Bind tombol logout */
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }

    /* Trigger event supaya halaman bisa load data */
    document.dispatchEvent(new CustomEvent('admin:ready'));
  }

  /* ---------- Expose ---------- */
  global.GRRM_ADMIN = {
    api: api,
    logout: logout,
    showScreen: showScreen,
    checkAuth: checkAuth
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window);