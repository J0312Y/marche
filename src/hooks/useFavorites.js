/**
 * useFavorites — Hook pour les favoris
 * Synchronise avec l'API si connecté
 */
import { useState, useCallback, useEffect } from 'react';
import { tokenManager } from '../api/client';
import favoritesApi from '../api/favorites';

export function useFavorites() {
  const [favIds, setFavIds] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les favoris depuis l'API
  const loadFavs = useCallback(async () => {
    if (!tokenManager.isLoggedIn()) return;
    setLoading(true);
    try {
      const res = await favoritesApi.getAll();
      const items = res.data || [];
      setFavItems(items);
      setFavIds(items.map(i => String(i.id)));
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { loadFavs(); }, [loadFavs]);

  const isFav = useCallback((articleId) => {
    return favIds.includes(String(articleId));
  }, [favIds]);

  const toggleFav = useCallback(async (articleId) => {
    const id = String(articleId);
    // Optimistic
    setFavIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

    if (tokenManager.isLoggedIn()) {
      try { await favoritesApi.toggle(articleId); }
      catch { setFavIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); }
    }
  }, []);

  return { favIds, favItems, isFav, toggleFav, loading, refresh: loadFavs };
}

export default useFavorites;
