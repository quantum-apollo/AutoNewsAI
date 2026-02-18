// Vercel serverless function to proxy CNN RapidAPI requests
// Deploy this directory to Vercel (or similar). Set RAPIDAPI_KEY in the deployment environment.

export default async function handler(req, res) {
  const RAPID_KEY = process.env.RAPIDAPI_KEY;
  const host = process.env.RAPIDAPI_HOST_CNN || 'cnn-api1.p.rapidapi.com';
  if (!RAPID_KEY) return res.status(500).json({ error: 'RAPIDAPI_KEY not configured' });

  const q = req.query.q || req.body.q || '';
  const page = req.query.page || req.body.page || 1;
  const url = `https://${host}/search?q=${encodeURIComponent(q)}&page=${encodeURIComponent(page)}`;

  const r = await fetch(url, { headers: { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': host } });
  const json = await r.json();
  res.status(r.status).json(json);
}
