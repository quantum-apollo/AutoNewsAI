export async function POST(request: Request) {
  const RAPID_KEY = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST_CLASSIFIER || 'ai-powered-news-category-classifier-api.p.rapidapi.com';
  if (!RAPID_KEY) return new Response(JSON.stringify({ error: 'RAPIDAPI_KEY not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  const body = await request.json().catch(() => ({ text: '' }));
  const r = await fetch(`https://${host}/predict`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': host }, body: JSON.stringify(body) });
  const json = await r.json().catch(() => ({}));
  return new Response(JSON.stringify(json), { status: r.status, headers: { 'Content-Type': 'application/json' } });
}
