import * as Rapid from '@/services/rapidapi';
import * as NewsAPI from '@/services/newsapi';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';
  const page = Number(url.searchParams.get('page') || '1');

  // allow forcing the NewsAPI fallback for testing
  if (url.searchParams.get('force_fallback') === '1') {
    // broadened fallback: general search first, then source-restricted if empty
    let fallback = await NewsAPI.searchNewsAPI(q, undefined, page, 20);
    if ((!fallback.articles || fallback.articles.length === 0) && q) {
      fallback = await NewsAPI.searchNewsAPI(q, ['cnn', 'reuters', 'associated-press'], page, 20);
    }
    return new Response(JSON.stringify({ articles: fallback.articles || [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const res = await Rapid.cnnSearch(q, page);
    const articles = (res && res.articles) || [];
    // always return 200 and never expose RapidAPI errors; fail silently to NewsAPI
    return new Response(JSON.stringify({ articles }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    // On unexpected error, silently return empty list
    return new Response(JSON.stringify({ articles: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}


