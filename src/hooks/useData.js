/**
 * useData — Hook global pour les données catalogue
 * 
 * Charge les catégories, articles, établissements via les services
 * et les rend disponibles de manière synchrone aux écrans.
 * 
 * Usage:
 *   import { useData } from '../hooks';
 *   const { P, VENDORS, CATS, loading, reload } = useData();
 */
import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { catalog, vendor, driver, social, user as userSvc, order as orderSvc } from '../services';
import { articlesAPI, establishmentsAPI } from '../api';

// Charge toutes les pages d'une liste paginée (l'API renvoie 20 éléments par défaut).
// Sans cela, les articles au-delà des 20 premiers étaient introuvables dans l'app.
async function fetchAllPages(fetchPage, key, maxPages = 20) {
  const all = [];
  for (let page = 1; page <= maxPages; page++) {
    const res = await fetchPage({ page, limit: 50 });
    const items = Array.isArray(res) ? res : (res?.[key] || []);
    all.push(...items);
    const p = res?.pagination;
    if (!p || !p.has_more || items.length === 0) break;
  }
  return all;
}

// ── Cache global partagé entre instances du hook ──
const cache = {
  cats: null,
  products: null,
  vendors: null,
  loaded: false,
  loading: false,
  listeners: new Set(),
};

function notifyListeners() {
  cache.listeners.forEach(fn => fn({}));
}

// Map API article fields to frontend format
function mapArticle(a) {
  if (!a || a.photo) return a; // already mapped or mock
  return {
    ...a,
    photo: a.image || a.thumbnail_url || null,
    photos: a.images ? a.images.map(i => i.url || i) : (a.image ? [a.image] : []),
    img: a.icon || '',
    cat: a.category_name || a.cat || '',
    vendor: a.establishment_name || a.vendor || '',
    va: a.establishment_type || '',
    type: a.commerce_type || a.type || '',
    rating: parseFloat(a.avg_rating || a.rating || 0),
    reviews: parseInt(a.total_reviews || a.reviews || 0, 10),
    price: parseFloat(a.price || 0),
    old: a.old_price ? parseFloat(a.old_price) : (a.compare_price ? parseFloat(a.compare_price) : (a.old ? parseFloat(a.old) : null)),
    tags: a.tags ? (typeof a.tags === 'string' ? a.tags.split(',').map(t => t.trim()) : a.tags) : [],
    optionGroups: Array.isArray(a.option_groups) ? a.option_groups : [],
    establishmentId: a.establishment_id ? Number(a.establishment_id) : null,
    stock: a.stock === null || a.stock === undefined ? null : Number(a.stock),
    sold: parseInt(a.total_sold || 0, 10),
  };
}

// Map API establishment fields to frontend format
function mapVendor(v) {
  if (!v || v.logo !== undefined) return v; // already mapped or mock
  return {
    ...v,
    logo: v.avatar || null,
    cover: v.cover_image || null,
    loc: v.address || v.city || '',
    rating: parseFloat(v.rating || 0),
    products: parseInt(v.total_orders || 0, 10),
    followers: parseInt(v.followers_count || 0, 10),
    verified: v.is_verified === '1' || v.is_verified === true,
    isOpen: v.is_open === '1' || v.is_open === true,
    eta: v.eta_min && v.eta_max ? `${v.eta_min} - ${v.eta_max} min` : null,
    // Ouvert maintenant d'après les horaires (calculé par le serveur) ; sinon interrupteur du vendeur
    isOpenNow: v.is_open_now !== undefined ? !!v.is_open_now : (v.is_open === '1' || v.is_open === true),
    opensAt: v.opens_at || null,
    punchCard: v.punch_card || null,
    offersCount: parseInt(v.offers_count || 0, 10),
    reviewsCount: parseInt(v.total_reviews || 0, 10),
    createdAt: v.created_at || null,
    minOrder: parseFloat(v.min_order || 0),
    deliveryFee: parseFloat(v.delivery_fee || 0),
    freeDelivery: v.free_delivery === '1' || v.free_delivery === 1 || v.free_delivery === true,
  };
}

// Map API category fields to frontend format
function mapCategory(c) {
  if (!c || c.photo !== undefined) return c;
  return {
    ...c,
    photo: c.image || null,
    count: parseInt(c.article_count || 0, 10),
  };
}

async function loadCatalog() {
  if (cache.loaded || cache.loading) return;
  cache.loading = true;
  notifyListeners();

  try {
    const [cats, rawProducts, rawVendors] = await Promise.all([
      catalog.getCategories(),
      fetchAllPages((f) => articlesAPI.search(f), 'articles'),
      fetchAllPages((f) => establishmentsAPI.getAll(f), 'establishments'),
    ]);
    const rawCats = cats || [];
    cache.cats = rawCats.map(mapCategory);
    cache.products = rawProducts.map(mapArticle);
    cache.vendors = rawVendors.map(mapVendor);
    // Plus forte réduction de chaque boutique (badge « −20 % » sur sa carte)
    const off = {};
    cache.products.forEach((p) => {
      if (p.old > p.price && p.establishmentId) {
        const pct = Math.round((1 - p.price / p.old) * 100);
        off[p.establishmentId] = Math.max(off[p.establishmentId] || 0, pct);
      }
    });
    cache.vendors.forEach((v) => { v.maxOff = off[Number(v.id)] || 0; });
    cache.loaded = true;
  } catch (err) {
    console.error('useData: failed to load catalog', err);
  } finally {
    cache.loading = false;
    notifyListeners();
  }
}

export function useData() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    cache.listeners.add(forceUpdate);
    if (!cache.loaded && !cache.loading) loadCatalog();
    return () => cache.listeners.delete(forceUpdate);
  }, []);

  const reload = useCallback(async () => {
    cache.loaded = false;
    cache.loading = false;
    await loadCatalog();
  }, []);

  return {
    CATS: cache.cats || [],
    P: cache.products || [],
    VENDORS: cache.vendors || [],
    loading: cache.loading,
    loaded: cache.loaded,
    reload,

    // Proxy vers services pour les appels ponctuels
    catalog,
    vendor,
    driver,
    social,
    userSvc,
    orderSvc,
  };
}

/**
 * useLoad — Hook pour charger une donnée spécifique au mount
 * 
 * Usage:
 *   const { data, loading, error, reload } = useLoad(() => vendor.getOrders('new'));
 */
export function useLoad(fetcher, deps = []) {
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
 * useAction — Hook pour actions manuelles (POST/PUT/DELETE)
 * 
 * Usage:
 *   const { run, loading } = useAction();
 *   await run(() => vendor.updateOrderStatus(id, 'preparing'));
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

export default useData;
