export default async function handler(req, res) {
  const RAPID_KEY = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST_REUTERS || 'reuters-api.p.rapidapi.com';
  if (!RAPID_KEY) return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' });

  const urlParam = req.query.url || req.body.url || 'https://www.reuters.com/world/africa/';
  const url = `https://${host}/category?url=${encodeURIComponent(urlParam)}`;

  const r = await fetch(url, { headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': host } });
  const json = await r.json();
  res.status(r.status).json(json);
}
