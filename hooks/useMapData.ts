import { useEffect, useState } from 'react';

type Marker = {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  type?: 'politician' | 'news' | 'indicator';
  breaking?: boolean;
  breakingArticles?: any[];
};

// Skeleton hook that returns a small sample of geo-tagged points.
export default function useMapData() {
  const [data, setData] = useState<Marker[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const Meili = await import('@/lib/meilisearch').then((m) => m.default);
        const points = await Meili.searchGeoMarkers(200);

        // fetch breaking political news and match to nearby politicians by name
        const News = await import('@/services/newsapi').then((m) => m.default);
        const breaking = await import('@/services/newsapi').then((m) => m.fetchBreakingPoliticalNews(3));

        // annotate points with breaking articles if name appears in article title/description
        const annotated = (points || []).map((p: any) => ({ ...p, breaking: false, breakingArticles: [] }));
        if (Array.isArray(breaking) && breaking.length > 0) {
          for (const a of breaking) {
            const title = (a.title || '').toLowerCase();
            const desc = (a.description || '').toLowerCase();
            for (const p of annotated) {
              const name = (p.title || '').toLowerCase();
              if (!name) continue;
              if (title.includes(name) || desc.includes(name)) {
                p.breaking = true;
                p.breakingArticles = p.breakingArticles || [];
                p.breakingArticles.push(a);
              }
            }
          }
        }

        if (mounted && Array.isArray(annotated) && annotated.length > 0) {
          setData(annotated as any);
          setLoading(false);
          return;
        }
      } catch (err) {
        // fall back to sample data below
      }

      // fallback sample markers
      const sample: Marker[] = [
        { id: 'gh-1', latitude: 5.6037, longitude: -0.1870, title: "President — Ghana", type: 'politician' },
        { id: 'us-1', latitude: 38.9072, longitude: -77.0369, title: 'US President / Congress', type: 'politician' },
        { id: 'uk-1', latitude: 51.5074, longitude: -0.1278, title: 'UK Prime Minister', type: 'politician' },
        { id: 'fr-1', latitude: 48.8566, longitude: 2.3522, title: 'France — Economy update', type: 'news' },
        { id: 'jp-1', latitude: 35.6895, longitude: 139.6917, title: 'Japan — Policy', type: 'news' },
      ];

      if (mounted) {
        setData(sample);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading, refetch: () => {} };
}
