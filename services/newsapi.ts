import Constants from 'expo-constants';

const cfg = (Constants.expoConfig && (Constants.expoConfig.extra as any)?.newsapi) || { apiKey: process.env.NEWSAPI_KEY || '', breakingWindowHours: 3 };

const POLITICAL_QUERY = [
  'president',
  'prime minister',
  'parliament',
  'minister',
  'congress',
  'election',
  'government',
  'mp',
  'senator',
  'cabinet',
  'policy',
  'politics',
].join(' OR ');

export type NewsArticle = {
  sourceName?: string;
  author?: string | null;
  title: string;
  description?: string | null;
  url: string;
  imageUrl?: string | null;
  publishedAt: string;
};

export async function fetchBreakingPoliticalNews(hoursWindow = cfg.breakingWindowHours || 3): Promise<NewsArticle[]> {
  if (!cfg.apiKey) return [];
  const from = new Date(Date.now() - hoursWindow * 3600 * 1000).toISOString();
  const q = encodeURIComponent(`${POLITICAL_QUERY}`);
  const url = `https://newsapi.org/v2/everything?q=${q}&from=${from}&language=en&sortBy=publishedAt&pageSize=100&apiKey=${cfg.apiKey}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'NEWSAI/1.0' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`NewsAPI error: ${res.status} ${text}`);
  }
  const json = await res.json();
  const articles = (json.articles || []).map((a: any) => ({
    sourceName: a.source?.name,
    author: a.author || null,
    title: a.title,
    description: a.description || null,
    url: a.url,
    imageUrl: a.urlToImage || null,
    publishedAt: a.publishedAt,
  })) as NewsArticle[];
  return articles;
}

// New: generic search against NewsAPI (used as a RapidAPI fallback)
export async function searchNewsAPI(q: string, sources?: string[], page = 1, pageSize = 20) {
  if (!cfg.apiKey) return { articles: [] };
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (sources && sources.length) params.set('sources', sources.join(','));
  params.set('language', 'en');
  params.set('page', String(page));
  params.set('pageSize', String(pageSize));
  params.set('apiKey', cfg.apiKey);

  const url = `https://newsapi.org/v2/everything?${params.toString()}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'NEWSAI/1.0' } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`NewsAPI search error: ${res.status} ${text}`);
  }
  const json = await res.json();
  const articles = (json.articles || []).map((a: any) => ({
    source: a.source?.name || a.source,
    title: a.title,
    description: a.description || null,
    url: a.url,
    imageUrl: a.urlToImage || null,
    publishedAt: a.publishedAt,
  }));
  return { totalResults: json.totalResults || 0, articles };
}

export default { fetchBreakingPoliticalNews, searchNewsAPI };