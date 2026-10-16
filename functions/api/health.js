/* =========================================================
   GRRM - Health Check Function
   Test endpoint: GET /api/health
   ========================================================= */

export async function onRequestGet(context) {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'GRRM Functions',
      timestamp: new Date().toISOString(),
      env: {
        hasBloggerId: !!context.env.BLOGGER_BLOG_ID,
        hasBloggerSecret: !!context.env.BLOGGER_CLIENT_SECRET
      }
    }, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    }
  );
}