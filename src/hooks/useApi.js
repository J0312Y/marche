/**
 * useApi — Hook universel pour les appels API
 *
 * Usage:
 *   const { data, loading, error, refresh } = useApi(() => articlesApi.getPopular());
 *   const { execute, loading } = useAction((data) => cartApi.add(data));
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour GET (chargement automatique)
 * @param {Function} apiFn - Fonction qui retourne une Promise
 * @param {Array} deps - Dépendances pour re-fetch
 * @param {boolean} immediate - Lancer immédiatement (default: true)
 */
export function useApi(apiFn, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn();
      setData(res.data ?? res);
      return res;
    } catch (err) {
      setError(err.message || 'Erreur');
      return null;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return { data, loading, error, refresh: execute, setData };
}

/**
 * Hook pour POST/PUT/DELETE (exécution manuelle)
 * @param {Function} apiFn - Fonction qui accepte des args et retourne une Promise
 */
export function useAction(apiFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      return res;
    } catch (err) {
      setError(err.message || 'Erreur');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { execute, loading, error };
}

/**
 * Hook pour la pagination
 */
export function usePaginated(apiFn, initialFilters = {}) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);

  const load = useCallback(async (p = 1, reset = false) => {
    setLoading(true);
    try {
      const res = await apiFn({ ...filters, page: p });
      const newItems = res.data?.articles || res.data?.orders || res.data?.items || res.data || [];
      const pagination = res.data?.pagination;

      if (reset || p === 1) {
        setItems(newItems);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }

      setPage(p);
      setHasMore(pagination ? pagination.has_more : newItems.length >= 20);
    } catch {} finally {
      setLoading(false);
    }
  }, [apiFn, filters]);

  useEffect(() => { load(1, true); }, [load]);

  const loadMore = () => { if (hasMore && !loading) load(page + 1); };
  const refresh = () => load(1, true);
  const updateFilters = (f) => { setFilters(prev => ({ ...prev, ...f })); };

  return { items, loading, hasMore, loadMore, refresh, filters, setFilters: updateFilters };
}

export default useApi;
