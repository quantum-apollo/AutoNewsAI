const POLITICS_RE = /\b(president|prime minister|parliament|minister|congress|election|government|policy|politics|senator|mp|cabinet)\b/i;
const ECONOMICS_RE = /\b(economy|economic|business|market|finance|trade|inflation|gdp|stock|invest|unemployment)\b/i;
const GLOBAL_RE = /\b(global|world|international|foreign|diplomacy|geopolitic)\b/i;

function classifyText(text: string | undefined) {
  const t = (text || '').toLowerCase();
  const cats: string[] = [];
  if (POLITICS_RE.test(t)) cats.push('politics');
  if (ECONOMICS_RE.test(t)) cats.push('economics');
  if (GLOBAL_RE.test(t)) cats.push('global');
  return cats.length ? cats : ['other'];
}

export async function GET() {
  const NEWS_KEY = process.env.NEWS_API_KEY || '';
  if (!NEWS_KEY) return new Response(JSON.stringify({ error: 'NEWS_API_KEY not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  // Sources: Associated Press (associated-press), Reuters (reuters), CNN (cnn)
  const sources = ['associated-press', 'reuters', 'cnn'].join(',');

  // Query covers politics, economics/business and global/world topics.
  const q = encodeURIComponent("(politics OR election OR government OR president OR parliament) OR (economy OR business OR market OR finance OR trade) OR (global OR world OR international)");
  const url = `https://newsapi.org/v2/everything?sources=${sources}&q=${q}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${NEWS_KEY}`;

  const res = await fetch(url, { headers: { 'User-Agent': 'NEWSAI/1.0' } });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    return new Response(JSON.stringify({ error: `NewsAPI error: ${res.status} ${txt}` }), { status: 502, headers: { 'Content-Type': 'application/json' } });
  }

  const json = await res.json().catch(() => ({}));
  const raw = Array.isArray(json.articles) ? json.articles : [];

  const mapped = raw.map((a: any) => {
    const text = `${a.title || ''} ${a.description || ''}`;
    const categories = classifyText(text);
    return {
      source: a.source?.name || a.source || 'unknown',
      title: a.title,
      description: a.description || null,
      url: a.url,
      imageUrl: a.urlToImage || null,
      publishedAt: a.publishedAt,
      categories,
    };
  }).filter((r: any) => r.categories && r.categories[0] !== 'other');

  // Group by category (an article may appear in multiple buckets)
  const byCategory: Record<string, any[]> = { politics: [], economics: [], global: [] };
  mapped.forEach((m: any) => {
    m.categories.forEach((c: string) => {
      if (byCategory[c]) byCategory[c].push(m);
    });
  });

  return new Response(JSON.stringify({ count: mapped.length, byCategory, fetchedAt: new Date().toISOString() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
