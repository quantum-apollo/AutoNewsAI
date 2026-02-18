/* Lightweight RapidAPI wrappers for Reuters, CNN, classifier and politics endpoints.
   - Uses RAPIDAPI_KEY + host env vars from .env / Constants.expoConfig.extra when built.
   - These are example helpers — add error handling & caching as needed.
*/

import Constants from 'expo-constants';

const env = (Constants.expoConfig && (Constants.expoConfig.extra as any)) || process.env;
const RAPID_KEY = env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY || '';
// Default proxy behavior: prefer an explicit RAPID_PROXY_URL, otherwise use a same-origin
// proxy at `/api/rapid` for deployed EAS Hosting / web builds so the client never calls
// RapidAPI directly. Server routes will still read RAPIDAPI_KEY from process.env.
const PROXY_URL = env.RAPID_PROXY_URL || process.env.RAPID_PROXY_URL || (typeof window !== 'undefined' ? '/api/rapid' : '');

async function rapidFetch(host: string, path: string, opts: RequestInit = {}) {
  // If a proxy URL is configured (recommended), call the proxy instead of RapidAPI directly.
  if (PROXY_URL) {
    const proxyUrl = `${PROXY_URL.replace(/\/$/, '')}${path}`;
    const res = await fetch(proxyUrl, { ...opts, headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`Proxy request failed: ${res.status} ${txt}`);
    }
    return res.json();
  }

  if (!RAPID_KEY) throw new Error('RAPIDAPI_KEY not configured');
  const url = `https://${host}${path}`;
  const headers: Record<string, string> = { 'x-rapidapi-key': RAPID_KEY, 'x-rapidapi-host': host };
  if (opts.headers) Object.assign(headers, opts.headers as object);
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`RapidAPI ${host} ${path} failed: ${res.status} ${txt}`);
  }
  return res.json();
}

import NewsAPI from './newsapi';

export async function reutersCategory(urlParam: string) {
  const host = env.RAPIDAPI_HOST_REUTERS || process.env.RAPIDAPI_HOST_REUTERS || 'reuters-api.p.rapidapi.com';
  try {
    const rapidRes = await rapidFetch(host, `/category?url=${encodeURIComponent(urlParam)}`);
    const articles = rapidRes?.articles || rapidRes?.results || (Array.isArray(rapidRes) ? rapidRes : []);
    return { articles, totalResults: articles.length, source: 'rapid' };
  } catch (err: any) {
    // Prefer a broader NewsAPI search first, then fall back to source-restricted queries if empty.
    try {
      let fallback = await NewsAPI.searchNewsAPI('', undefined, 1, 10);
      if ((!fallback.articles || fallback.articles.length === 0)) {
        fallback = await NewsAPI.searchNewsAPI('', ['reuters'], 1, 10);
      }
      return { articles: fallback.articles || [], totalResults: fallback.totalResults || 0, source: 'newsapi' };
    } catch (err2: any) {
      return { articles: [], totalResults: 0, source: 'none' };
    }
  }
}

export async function cnnSearch(q: string, page = 1) {
  const host = env.RAPIDAPI_HOST_CNN || process.env.RAPIDAPI_HOST_CNN || 'cnn-api1.p.rapidapi.com';
  const pageSize = 20;
  try {
    const rapidRes = await rapidFetch(host, `/search?q=${encodeURIComponent(q)}&page=${page}`);
    // normalize rapid response to { articles, totalResults, source }
    const articles = rapidRes?.articles || rapidRes?.results || (Array.isArray(rapidRes) ? rapidRes : []);
    const totalResults = rapidRes?.totalResults || (Array.isArray(rapidRes) ? articles.length : articles.length);
    return { articles, totalResults, source: 'rapid' };
  } catch (err: any) {
    // RapidAPI failed: silently fallback to NewsAPI (no error returned to client)
    try {
      // Prefer a broader NewsAPI search first, then try targeted sources if empty
      const sources = ['cnn', 'reuters', 'associated-press'];
      let fallback = await NewsAPI.searchNewsAPI(q || '', undefined, page, pageSize);
      if ((!fallback.articles || fallback.articles.length === 0) && q) {
        // try source-restricted search as a secondary option
        fallback = await NewsAPI.searchNewsAPI(q || '', sources, page, pageSize);
      }
      return { articles: fallback.articles || [], totalResults: fallback.totalResults || 0, source: 'newsapi' };
    } catch (err2: any) {
      // If everything fails, return empty list silently
      return { articles: [], totalResults: 0, source: 'none' };
    }
  }
}

export async function classifyText(text: string) {
  const host = env.RAPIDAPI_HOST_CLASSIFIER || process.env.RAPIDAPI_HOST_CLASSIFIER || 'ai-powered-news-category-classifier-api.p.rapidapi.com';
  try {
    return await rapidFetch(host, `/predict`, { method: 'POST', body: JSON.stringify({ text }), headers: { 'Content-Type': 'application/json' } });
  } catch (err: any) {
    // If classifier is unavailable, return a crude fallback
    return { fallback: true, error: err.message || String(err), labels: [{ label: 'unknown', score: 1 }] };
  }
}

export async function politicsMarket(eventId: string) {
  const host = env.RAPIDAPI_HOST_POLITICS || process.env.RAPIDAPI_HOST_POLITICS || 'politics-api.p.rapidapi.com';
  try {
    return await rapidFetch(host, `/markets/${encodeURIComponent(eventId)}/{eventId}`);
  } catch (err: any) {
    return { fallback: true, error: err.message || String(err) };
  }
}

export default { reutersCategory, cnnSearch, classifyText, politicsMarket };
