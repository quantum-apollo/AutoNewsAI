import * as Rapid from '@/services/rapidapi';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const urlParam = url.searchParams.get('url') || 'https://www.reuters.com/world/';

  try {
    const res = await Rapid.reutersCategory(urlParam);
    const articles = (res && res.articles) || [];
    return new Response(JSON.stringify({ articles }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch {
    // silent fallback → return empty array
    return new Response(JSON.stringify({ articles: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}

