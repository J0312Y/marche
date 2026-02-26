/**
 * useNotifications — Hook pour les notifications
 */
import { useState, useCallback, useEffect } from 'react';
import { tokenManager } from '../api/client';
import notificationsApi from '../api/notifications';

export function useNotifications() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!tokenManager.isLoggedIn()) return;
    setLoading(true);
    try {
      const [listRes, countRes] = await Promise.all([
        notificationsApi.getAll(),
        notificationsApi.count(),
      ]);
      setItems(listRes.data || []);
      setUnread(countRes.data?.unread || 0);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = useCallback(async (id) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    setUnread(prev => Math.max(0, prev - 1));
    try { await notificationsApi.read(id); } catch {}
  }, []);

  const markAllRead = useCallback(async () => {
    setItems(prev => prev.map(n => ({ ...n, is_read: 1 })));
    setUnread(0);
    try { await notificationsApi.readAll(); } catch {}
  }, []);

  return { items, unread, loading, refresh: load, markRead, markAllRead };
}

export default useNotifications;
