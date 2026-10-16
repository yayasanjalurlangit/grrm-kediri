/* =========================================================
   GRRM - Login Redirect
   GET /api/auth/login
   Redirect user ke Google OAuth consent
   ========================================================= */

export async function onRequestGet(context) {
  const { env } = context;

  const clientId = env.BLOGGER_CLIENT_ID;
  const redirectUri = env.BLOGGER_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return new Response('OAuth config tidak lengkap.', { status: 500 });
  }

  /* Scope: hanya akses Blogger */
  const scope = 'https://www.googleapis.com/auth/blogger';

  /* State random untuk cegah CSRF */
  const state = crypto.randomUUID();

  /* Simpan state di cookie (HttpOnly, secure di production) */
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    access_type: 'offline',   /* supaya dapat refresh_token */
    prompt: 'consent',         /* paksa consent biar refresh_token selalu ada */
    state: state
  });

  const googleUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + params.toString();

  return new Response(null, {
    status: 302,
    headers: {
      'Location': googleUrl,
      'Set-Cookie': 'oauth_state=' + state + '; HttpOnly; Path=/; Max-Age=600; SameSite=Lax'
    }
  });
}