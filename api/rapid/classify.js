export default async function handler(req, res) {
  const RAPID_KEY = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST_CLASSIFIER || 'ai-powered-news-category-classifier-api.p.rapidapi.com';
  if (!RAPID_KEY) return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' });

  const body = req.body || { text: '' };
  const r = await fetch(`https://${host}/predict`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': host }, body: JSON.stringify(body) });
  const json = await r.json();
  res.status(r.status).json(json);
}
