export default async function handler(req, res) {
  const RAPID_KEY = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST_POLITICS || 'politics-api.p.rapidapi.com';
  if (!RAPID_KEY) return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' });

  const eventId = req.query.eventId || req.body.eventId || '';
  const url = `https://${host}/markets/${encodeURIComponent(eventId)}/{eventId}`;
  const r = await fetch(url, { headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': host } });
  const json = await r.json();
  res.status(r.status).json(json);
}
