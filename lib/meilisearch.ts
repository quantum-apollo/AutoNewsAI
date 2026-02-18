// Local in-memory data provider (replaces Meilisearch for local/dev usage)
// Exports the same API surface used across the app so other code doesn't need changes.

const SAMPLE_POLITICIANS = [
  {
    id: 'ghana-president',
    name: 'Nana Akufo-Addo',
    country: 'Ghana',
    party: 'New Patriotic Party',
    office: "President",
    latitude: 5.6037,
    longitude: -0.1870,
    photoUrl: '',
    bio: 'President of Ghana. Sample bio for demo.',
  },
  {
    id: 'us-president',
    name: 'Joe Biden',
    country: 'United States',
    party: 'Democratic',
    office: 'President',
    latitude: 38.9072,
    longitude: -77.0369,
    photoUrl: '',
    bio: 'President of the United States. Sample bio for demo.',
  },
  {
    id: 'uk-prime-minister',
    name: 'Rishi Sunak',
    country: 'United Kingdom',
    party: 'Conservative',
    office: 'Prime Minister',
    latitude: 51.5074,
    longitude: -0.1278,
    photoUrl: '',
    bio: 'Prime Minister of the United Kingdom. Sample bio for demo.',
  },
  {
    id: 'fr-president',
    name: 'Emmanuel Macron',
    country: 'France',
    party: 'Renaissance',
    office: 'President',
    latitude: 48.8566,
    longitude: 2.3522,
    photoUrl: '',
    bio: 'President of France. Sample bio for demo.',
  },
  {
    id: 'jp-prime-minister',
    name: 'Fumio Kishida',
    country: 'Japan',
    party: 'Liberal Democratic',
    office: 'Prime Minister',
    latitude: 35.6895,
    longitude: 139.6917,
    photoUrl: '',
    bio: 'Prime Minister of Japan. Sample bio for demo.',
  },
];

export async function searchPoliticians(q: string, limit = 12) {
  if (!q || q.trim() === '') return SAMPLE_POLITICIANS.slice(0, limit).map(mapPolitician);
  const qq = q.toLowerCase();
  const results = SAMPLE_POLITICIANS.filter((p) => p.name.toLowerCase().includes(qq) || (p.country || '').toLowerCase().includes(qq) || (p.party || '').toLowerCase().includes(qq));
  return results.slice(0, limit).map(mapPolitician);
}

export async function getPoliticianById(id: string) {
  return SAMPLE_POLITICIANS.find((p) => p.id === id) || null;
}

export async function searchNewsByPoliticianId(politicianId: string, limit = 8) {
  // Demo: return a small mocked list referencing the politician
  const p = SAMPLE_POLITICIANS.find((x) => x.id === politicianId);
  if (!p) return [];
  return [
    { id: `${politicianId}-n1`, title: `${p.name} speaks on policy`, url: 'https://example.com/article/1', publishedAt: new Date().toISOString(), sourceName: 'DemoNews', imageUrl: null },
  ].slice(0, limit);
}

export async function searchGeoMarkers(limit = 100) {
  return SAMPLE_POLITICIANS.slice(0, limit).map((p) => ({ id: p.id, title: p.name, latitude: p.latitude, longitude: p.longitude, country: p.country, party: p.party, type: 'politician' }));
}

function mapPolitician(p: any) {
  return {
    id: p.id,
    name: p.name,
    title: p.name,
    latitude: p.latitude,
    longitude: p.longitude,
    country: p.country,
    party: p.party,
    photoUrl: p.photoUrl || null,
    bio: p.bio || null,
  };
}

export default { searchPoliticians, getPoliticianById, searchNewsByPoliticianId, searchGeoMarkers };