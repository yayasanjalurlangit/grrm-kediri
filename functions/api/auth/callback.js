/* =========================================================
   GRRM - OAuth Callback
   GET /api/auth/callback?code=...&state=...
   Tukar code dari Google dengan access_token & refresh_token
   Set cookie sesi (berisi refresh_token terenkripsi sederhana)
   ========================================================= */

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  /* Google kirim error? */
  if (error) {
    return new Response('Login ditolak Google: ' + error, { status: 400 });
  }

  if (!code) {
    return new Response('Parameter "code" tidak ada.', { status: 400 });
  }

  /* Verifikasi state dari cookie */
  const cookieHeader = request.headers.get('Cookie') || '';
  const stateCookie = parseCookie(cookieHeader, 'oauth_state');

  if (!stateCookie || stateCookie !== state) {
    return new Response('State tidak valid (CSRF). Silakan login ulang.', { status: 403 });
  }

  /* Tukar code dengan token */
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code: code,
      client_id: env.BLOGGER_CLIENT_ID,
      client_secret: env.BLOGGER_CLIENT_SECRET,
      redirect_uri: env.BLOGGER_REDIRECT_URI,
      grant_type: 'authorization_code'
    })
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    return new Response('Gagal tukar token: ' + errText, { status: 500 });
  }

  const tokens = await tokenRes.json();
  /* tokens: { access_token, refresh_token, expires_in, scope, token_type, id_token } */

  /* Simpan refresh_token di cookie (HttpOnly, Secure di prod) */
  /* Catatan: untuk produksi, sebaiknya dienkripsi. Untuk sekarang disimpan plaintext di HttpOnly cookie. */
  const cookieValue = encodeURIComponent(JSON.stringify({
    rt: tokens.refresh_token || '',
    saved: Date.now()
  }));

  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  const secureFlag = isLocal ? '' : '; Secure';

  /* Hapus cookie oauth_state & set cookie session */
  const headers = new Headers();
  headers.append('Set-Cookie', 'oauth_state=; HttpOnly; Path=/; Max-Age=0' + secureFlag + '; SameSite=Lax');
  headers.append(
    'Set-Cookie',
    'grrm_session=' + cookieValue + '; HttpOnly; Path=/; Max-Age=2592000' + secureFlag + '; SameSite=Lax'
  ); /* 30 hari */

  /* Redirect ke admin panel */
  headers.set('Location', '/admin/');

  return new Response(null, { status: 302, headers: headers });
}

/* ---------- Helper ---------- */
function parseCookie(header, name) {
  const parts = header.split(';');
  for (const p of parts) {
    const [k, ...rest] = p.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}