export async function GET(request: Request) {
  const RAPID_KEY = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST_POLITICS || 'politics-api.p.rapidapi.com';
  if (!RAPID_KEY) return new Response(JSON.stringify({ error: 'RAPIDAPI_KEY not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  const url = new URL(request.url);
  const eventId = url.searchParams.get('eventId') || '';
  const fetchUrl = `https://${host}/markets/${encodeURIComponent(eventId)}/{eventId}`;

  const r = await fetch(fetchUrl, { headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': host } });
  const json = await r.json().catch(() => ({}));
  return new Response(JSON.stringify(json), { status: r.status, headers: { 'Content-Type': 'application/json' } });
}
