/* =========================================================
   GRRM - Check Current User
   GET /api/auth/me
   Response: { loggedIn: true/false }
   ========================================================= */

export async function onRequestGet(context) {
  const { request } = context;
  const cookieHeader = request.headers.get('Cookie') || '';
  const sessionCookie = parseCookie(cookieHeader, 'grrm_session');

  if (!sessionCookie) {
    return json({ loggedIn: false });
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie));
    if (!session.rt) return json({ loggedIn: false });
    return json({ loggedIn: true, savedAt: session.saved });
  } catch (e) {
    return json({ loggedIn: false });
  }
}

function parseCookie(header, name) {
  const parts = header.split(';');
  for (const p of parts) {
    const [k, ...rest] = p.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return null;
}

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}