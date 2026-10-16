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
    if (options.body && typeof options.body === 'object') {
      options.headers = Object.assign({}, options.headers, {
        'Content-Type': 'application/json'
      });
      options.body = JSON.stringify(options.body);
    }
    const res = await fetch(path, options);
    const data = await res.json().catch(function () { return null; });
    if (!res.ok) {
      const msg = (data && data.error) || ('HTTP ' + res.status);
      throw new Error(msg);
    }
    return data;
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