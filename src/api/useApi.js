/**
 * useApi Hook — Generic async data fetching
 *
 * Usage:
 *   const { data, loading, error, reload } = useApi(() => articlesAPI.getPopular());
 *   const { run, loading } = useAction();
 */
import { useState, useEffect, useCallback } from 'react';

/**
 * Auto-fetch on mount (GET requests)
 */
export function useApi(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load, setData };
}

/**
 * Manual trigger (POST/PUT/DELETE)
 */
export function useAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(async (action) => {
    setLoading(true);
    setError(null);
    try {
      const result = await action();
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message || 'Erreur');
      setLoading(false);
      throw err;
    }
  }, []);

  return { run, loading, error };
}

/**
 * Toast notification helper
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const show = useCallback((message, type = 'success', duration = 2500) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  }, []);

  return { toast, show };
}

export default useApi;
