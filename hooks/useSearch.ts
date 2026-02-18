import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import Meili from '@/lib/meilisearch';

export default function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const doSearch = debounce(async (q: string) => {
    if (!q || q.trim() === '') {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await Meili.searchPoliticians(q, 20);
      setResults(res);
    } catch (err) {
      console.warn('search error', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    doSearch(query);
    return () => doSearch.cancel();
  }, [query]);

  return { query, setQuery, results, loading };
}
