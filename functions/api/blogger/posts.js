/* =========================================================
   GRRM - Blogger Posts Proxy
   ========================================================= */
const BLOGGER_API = 'https://www.googleapis.com/blogger/v3';

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
  if (!res.ok) throw new Error('Refresh token gagal: ' + await res.text());
  return (await res.json()).access_token;
}

function getSession(request) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const sessionCookie = parseCookie(cookieHeader, 'grrm_session');
  if (!sessionCookie) return null;
  try { return JSON.parse(decodeURIComponent(sessionCookie)); } catch (e) { return null; }
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
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (id) {
    const apiUrl = `${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts/${encodeURIComponent(id)}?key=${env.BLOGGER_API_KEY}`;
    const res = await fetch(apiUrl);
    return json(await res.json(), res.status);
  }

  const params = new URLSearchParams({ key: env.BLOGGER_API_KEY, maxResults: url.searchParams.get('maxResults') || '10', fetchImages: 'true' });
  if (url.searchParams.get('labels')) params.set('labels', url.searchParams.get('labels'));

  const res = await fetch(`${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts?${params.toString()}`);
  return json(await res.json(), res.status);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const session = getSession(request);
  const refreshToken = env.BLOGGER_REFRESH_TOKEN || (session && session.rt);
  if (!refreshToken) return json({ error: 'Belum login.' }, 401);

  try {
    const body = await request.json();
    const accessToken = await getAccessToken({ ...env, BLOGGER_REFRESH_TOKEN: refreshToken });
    const apiUrl = `${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts?key=${env.BLOGGER_API_KEY}`;

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: 'blogger#post', title: body.title, content: body.content, labels: body.labels || [] })
    });
    return json(await res.json(), res.status);
  } catch (err) { return json({ error: err.message }, 500); }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'ID wajib.' }, 400);

  const session = getSession(request);
  const refreshToken = env.BLOGGER_REFRESH_TOKEN || (session && session.rt);
  if (!refreshToken) return json({ error: 'Belum login.' }, 401);

  try {
    const body = await request.json();
    const accessToken = await getAccessToken({ ...env, BLOGGER_REFRESH_TOKEN: refreshToken });
    const apiUrl = `${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts/${encodeURIComponent(id)}?key=${env.BLOGGER_API_KEY}`;

    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + accessToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, kind: 'blogger#post', title: body.title, content: body.content, labels: body.labels || [] })
    });
    return json(await res.json(), res.status);
  } catch (err) { return json({ error: err.message }, 500); }
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'ID wajib.' }, 400);

  const session = getSession(request);
  const refreshToken = env.BLOGGER_REFRESH_TOKEN || (session && session.rt);
  if (!refreshToken) return json({ error: 'Belum login.' }, 401);

  try {
    const accessToken = await getAccessToken({ ...env, BLOGGER_REFRESH_TOKEN: refreshToken });
    const apiUrl = `${BLOGGER_API}/blogs/${env.BLOGGER_BLOG_ID}/posts/${encodeURIComponent(id)}?key=${env.BLOGGER_API_KEY}`;

    const res = await fetch(apiUrl, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + accessToken } });
    if (res.status === 204) return json({ ok: true });
    return json({ error: await res.text() }, res.status);
  } catch (err) { return json({ error: err.message }, 500); }
}