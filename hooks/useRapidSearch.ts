import { useEffect, useState } from 'react';
import Rapid from '@/services/rapidapi';

export default function useRapidSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function searchCNN(q: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await Rapid.cnnSearch(q, 1);
      // Rapid.cnnSearch normalizes responses to `{ articles, totalResults, source }` — use `articles` only.
      setResults(res?.articles || []);
    } catch (err: any) {
      setError(err.message || 'error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return { loading, results, error, searchCNN };
}
