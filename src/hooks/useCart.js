/**
 * useCart — Hook pour le panier
 * Synchronise le state local avec l'API si connecté
 */
import { useState, useCallback, useEffect } from 'react';
import { tokenManager } from '../api/client';
import cartApi from '../api/cart';

export function useCart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price || i.product?.price || 0) * i.qty, 0);

  // Charger le panier depuis l'API si connecté
  const loadCart = useCallback(async () => {
    if (!tokenManager.isLoggedIn()) return;
    setLoading(true);
    try {
      const res = await cartApi.getAll();
      if (res.data?.items) {
        setItems(res.data.items.map(i => ({
          id: i.id,
          article_id: i.article_id,
          product: { id: i.article_id, name: i.name, price: i.price, old: i.old_price, img: i.image, vendor: i.establishment_name },
          qty: i.quantity,
          price: i.price,
          note: i.note,
        })));
      }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addToCart = useCallback(async (product, qty = 1) => {
    // Optimistic update
    setItems(prev => {
      const idx = prev.findIndex(i => (i.product?.id || i.article_id) === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { product, qty, price: product.price, article_id: product.id }];
    });

    // API sync
    if (tokenManager.isLoggedIn()) {
      try { await cartApi.add(product.id, qty); } catch {}
    }
  }, []);

  const updateQty = useCallback(async (itemId, qty) => {
    if (qty <= 0) return removeItem(itemId);
    setItems(prev => prev.map(i => (i.id || i.product?.id) === itemId ? { ...i, qty } : i));
    if (tokenManager.isLoggedIn()) {
      try { await cartApi.updateQty(itemId, qty); } catch {}
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    setItems(prev => prev.filter(i => (i.id || i.product?.id) !== itemId));
    if (tokenManager.isLoggedIn()) {
      try { await cartApi.remove(itemId); } catch {}
    }
  }, []);

  const clearCart = useCallback(async () => {
    setItems([]);
    if (tokenManager.isLoggedIn()) {
      try { await cartApi.clear(); } catch {}
    }
  }, []);

  return { items, count, subtotal, loading, addToCart, updateQty, removeItem, clearCart, refresh: loadCart };
}

export default useCart;
