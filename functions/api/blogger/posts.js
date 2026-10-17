/* =========================================================
   GRRM - Blogger Posts Proxy
   Semua CRUD diproksikan supaya:
   - Access token di-refresh otomatis dari refresh_token
   - Client secret tetap di server
   ========================================================= */

const BLOGGER_API = 'https://www.googleapis.com/blogger/v3';

/* ---------- Helper: ambil access_token dari refresh_token ---------- */
async function getAccessToken(env) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.BLOGGER_CLIENT_ID,
      client_secret: env.BLOGGER_CLIENT_SECRET,
      refresh_token: env.BLOGGER_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    })
  });
  
  if (!res.ok) {
    const t = await res.text();
    throw new Error('Refresh token gagal: ' + t);
  }
  const data = await res.json();
  return data.access_token;
}

/* ---------- Helper: ambil session dari cookie ---------- */
function getSession(request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const sessionCookie = parseCookie(cookieHeader, 'grrm_session');
  if (!sessionCookie) return null;
  try {
    return JSON.parse(decodeURIComponent(sessionCookie));
  } catch (e) { return null; }
}

function parseCookie(header, name) {
  const parts = header.split(';');
  for (const p of parts) {
    const [k, ...rest] = p.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}

/* =========================================================
   GET  /api/blogger/posts             → list posts (public, pakai API key)
   GET  /api/blogger/posts?id=xxx      → 1 post (public)
   POST /api/blogger/posts             → create post (butuh login)
   PUT  /api/blogger/posts?id=xxx      → update post (butuh login)
   DELETE /api/blogger/posts?id=xxx    → delete post (butuh login)
   ========================================================= */

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  /* Detail 1 post */
  if (id) {
    const apiUrl = BLOGGER_API + '/blogs/' + env.BLOGGER_BLOG_ID + '/posts/' + encodeURIComponent(id) + '?key=' + env.BLOGGER_API_KEY;
    const res = await fetch(apiUrl);
    const data = await res.json();
    return json(data, res.status);
  }

  /* List posts */
  const params = new URLSearchParams({
    key: env.BLOGGER_API_KEY,
    maxResults: url.searchParams.get('maxResults') || '10',
    fetchImages: 'true'
  });
  const labels = url.searchParams.get('labels');
  if (labels) params.set('labels', labels);

  const apiUrl = BLOGGER_API + '/blogs/' + env.BLOGGER_BLOG_ID + '/posts?' + params.toString();
  const res = await fetch(apiUrl);
  const data = await res.json();
  return json(data, res.status);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const session = getSession(request);

  const refreshToken = env.BLOGGER_REFRESH_TOKEN || (session && session.rt);
  if (!refreshToken) return json({ error: 'Belum login.' }, 401);

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ error: 'Body harus JSON.' }, 400);
  }

  try {
    const accessToken = await getAccessToken({ ...env, BLOGGER_REFRESH_TOKEN: refreshToken });
    
    // PERBAIKAN: Menghapus garis miring sebelum '?key=' agar sesuai dengan dokumentasi Google
    const apiUrl = BLOGGER_API + '/blogs/' + env.BLOGGER_BLOG_ID + '/posts?key=' + env.BLOGGER_API_KEY;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        kind: 'blogger#post',
        title: body.title,
        content: body.content,
        labels: body.labels || []
      })
    });
    const data = await res.json();
    return json(data, res.status);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const session = getSession(request);
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Parameter id wajib.' }, 400);

  const refreshToken = env.BLOGGER_REFRESH_TOKEN || (session && session.rt);
  if (!refreshToken) return json({ error: 'Belum login.' }, 401);

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ error: 'Body harus JSON.' }, 400);
  }

  try {
    const accessToken = await getAccessToken({ ...env, BLOGGER_REFRESH_TOKEN: refreshToken });
    
    // PERBAIKAN: Menambahkan ?key=API_KEY yang sebelumnya hilang
    const apiUrl = BLOGGER_API + '/blogs/' + env.BLOGGER_BLOG_ID + '/posts/' + encodeURIComponent(id) + '?key=' + env.BLOGGER_API_KEY;

    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        kind: 'blogger#post',
        title: body.title,
        content: body.content,
        labels: body.labels || []
      })
    });
    const data = await res.json();
    return json(data, res.status);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const session = getSession(request);
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Parameter id wajib.' }, 400);

  const refreshToken = env.BLOGGER_REFRESH_TOKEN || (session && session.rt);
  if (!refreshToken) return json({ error: 'Belum login.' }, 401);

  try {
    const accessToken = await getAccessToken({ ...env, BLOGGER_REFRESH_TOKEN: refreshToken });
    
    // PERBAIKAN: Menambahkan ?key=API_KEY yang sebelumnya hilang
    const apiUrl = BLOGGER_API + '/blogs/' + env.BLOGGER_BLOG_ID + '/posts/' + encodeURIComponent(id) + '?key=' + env.BLOGGER_API_KEY;

    const res = await fetch(apiUrl, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    if (res.status === 204) return json({ ok: true });
    const data = await res.text();
    return json({ error: data }, res.status);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}