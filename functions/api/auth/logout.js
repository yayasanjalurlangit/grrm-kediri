/* =========================================================
   GRRM - Logout
   POST /api/auth/logout
   Hapus cookie sesi
   ========================================================= */

export async function onRequestPost(context) {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'grrm_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
    }
  });
}