/* =========================================================
   GRRM - Blogger Posts Proxy (Ultimate Fix)
   ========================================================= */

const BLOGGER_API = 'https://www.googleapis.com/blogger/v3';

/* ---------- Helper: ambil access_token ---------- */
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
    throw new Error('Gagal mendapatkan Access Token. Cek kembali Client ID/Secret/Refresh Token. Detail: ' + t);
  }
  const data = await res.json();
  return data.access_token;
}

/* ---------- Helper: session dari cookie ---------- */
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
   GET (List & Detail) - Tetap pakai API Key (Public)
   ========================================================= */
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (id) {
    const apiUrl = `${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts/${encodeURIComponent(id)}?key=${env.BLOGGER_API_KEY}`;
    const res = await fetch(apiUrl);
    return json(await res.json(), res.status);
  }

  const params = new URLSearchParams({
    key: env.BLOGGER_API_KEY,
    maxResults: url.searchParams.get('maxResults') || '10',
    fetchImages: 'true'
  });
  const labels = url.searchParams.get('labels');
  if (labels) params.set('labels', labels);

  const apiUrl = `${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts?${params.toString()}`;
  const res = await fetch(apiUrl);
  return json(await res.json(), res.status);
}

/* =========================================================
   POST (Create) - Butuh OAuth Token + API Key
   ========================================================= */
export async function onRequestPost(context) {
  const { request, env } = context;
  const session = getSession(request);
  const refreshToken = env.BLOGGER_REFRESH_TOKEN || (session && session.rt);
  
  if (!refreshToken) return json({ error: 'Sesi login tidak valid. Silakan logout dan login ulang.' }, 401);

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ error: 'Format data salah.' }, 400);
  }

  try {
    const accessToken = await getAccessToken({ ...env, BLOGGER_REFRESH_TOKEN: refreshToken });
    
    // Kembalikan ?key= untuk memastikan Google menerima permintaan
    const apiUrl = `${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts?key=${env.BLOGGER_API_KEY}`;

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
    
    const resData = await res.json();
    if (!res.ok) {
      // Jika Google menolak, kirimkan pesan aslinya ke frontend
      return json({ error: 'Google API Error: ' + (resData.error?.message || 'Unknown Error') }, res.status);
    }
    return json(resData, res.status);
    
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

/* =========================================================
   PUT (Update) - Butuh OAuth Token + API Key
   ========================================================= */
export async function onRequestPut(context) {
  const { request, env } = context;
  const session = getSession(request);
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Parameter ID tidak ditemukan.' }, 400);

  const refreshToken = env.BLOGGER_REFRESH_TOKEN || (session && session.rt);
  if (!refreshToken) return json({ error: 'Sesi login tidak valid. Silakan logout dan login ulang.' }, 401);

  let body;
  try { body = await request.json(); } catch (e) {
    return json({ error: 'Format data salah.' }, 400);
  }

  try {
    const accessToken = await getAccessToken({ ...env, BLOGGER_REFRESH_TOKEN: refreshToken });
    
    // Kembalikan ?key=
    const apiUrl = `${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts/${encodeURIComponent(id)}?key=${env.BLOGGER_API_KEY}`;

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
    
    const resData = await res.json();
    if (!res.ok) {
      return json({ error: 'Google API Error: ' + (resData.error?.message || 'Unknown Error') }, res.status);
    }
    return json(resData, res.status);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

/* =========================================================
   DELETE - Butuh OAuth Token + API Key
   ========================================================= */
export async function onRequestDelete(context) {
  const { request, env } = context;
  const session = getSession(request);
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'Parameter ID tidak ditemukan.' }, 400);

  const refreshToken = env.BLOGGER_REFRESH_TOKEN || (session && session.rt);
  if (!refreshToken) return json({ error: 'Sesi login tidak valid. Silakan logout dan login ulang.' }, 401);

  try {
    const accessToken = await getAccessToken({ ...env, BLOGGER_REFRESH_TOKEN: refreshToken });
    
    // Kembalikan ?key=
    const apiUrl = `${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts/${encodeURIComponent(id)}?key=${env.BLOGGER_API_KEY}`;

    const res = await fetch(apiUrl, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + accessToken }
    });

    if (res.status === 204) return json({ ok: true });
    
    const errText = await res.text();
    return json({ error: 'Google API Error: ' + errText }, res.status);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}