(function (global) {
  'use strict';

  function showScreen(screen) {
    ['loadingScreen', 'loginScreen', 'dashboardScreen'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(screen + 'Screen');
    if (target) target.classList.remove('hidden');
  }

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'same-origin' });
      const data = await res.json();
      return data.loggedIn === true;
    } catch (e) { return false; }
  }

  async function logout() {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }); } catch (e) {}
    window.location.reload();
  }

  async function api(path, options) {
    options = options || {};
    options.credentials = 'same-origin';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    options.signal = controller.signal;

    if (options.body && typeof options.body === 'object') {
      options.headers = Object.assign({}, options.headers, { 'Content-Type': 'application/json' });
      options.body = JSON.stringify(options.body);
    }
    
    try {
      const res = await fetch(path, options);
      clearTimeout(timeoutId);
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { throw new Error('Respons server tidak valid.'); }

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
      if (err.name === 'AbortError') throw new Error('Waktu habis (Timeout). Koneksi lambat.');
      throw err;
    }
  }

  async function init() {
    showScreen('loading');
    if (!(await checkAuth())) { showScreen('login'); return; }
    
    const el = document.getElementById('userInfo');
    if (el) el.textContent = 'Masuk sebagai Admin';
    showScreen('dashboard');

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    document.dispatchEvent(new CustomEvent('admin:ready'));
  }

  global.GRRM_ADMIN = { api, logout, showScreen, checkAuth };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window);