/**
 * AppContext — État global de l'application
 * Remplace le prop drilling de App.jsx
 *
 * Usage dans un screen :
 *   import { useApp } from '../../context/AppContext';
 *   const { user, cart, go, pop } = useApp();
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { authAPI, usersAPI, cartAPI, favoritesAPI, notificationsAPI } from '../api';

const AppContext = createContext(null);

export function AppProvider({ children }) {

  // ── Auth ──
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState(api.isAuthenticated() ? 'loading' : 'splash');
  // splash → onboarding → login → otp → profile → ready
  const [socialProvider, setSocialProvider] = useState(null);

  // ── Navigation ──
  const [mode, setMode] = useState('buyer'); // buyer | vendor | driver
  const [tab, setTab] = useState(0);
  const [vTab, setVTab] = useState(0);
  const [dTab, setDTab] = useState(0);
  const [screen, setScreen] = useState(null);
  const [history, setHistory] = useState([]);

  // ── Cart ──
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  // ── Favorites ──
  const [favs, setFavs] = useState([]);

  // ── Roles ──
  const [userRole, setUserRole] = useState('client');
  const [vendorPlan, setVendorPlan] = useState('starter');
  const [vendorStatus, setVendorStatus] = useState('none');
  const [driverStatus, setDriverStatus] = useState('none');

  // ── Notifications ──
  const [unreadCount, setUnreadCount] = useState(0);

  // ── Toast ──
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  // ══════════════════════════════════
  //  BOOT — Restaurer session si token
  // ══════════════════════════════════

  useEffect(() => {
    if (!api.isAuthenticated()) return;

    (async () => {
      try {
        const userData = await usersAPI.me();
        setUser(userData);
        setUserRole(userData.role || 'client');
        setAuthStep('ready');

        // Charger panier + favs + notifs en parallèle
        const [cartData, favsData, notifData] = await Promise.allSettled([
          cartAPI.get(),
          favoritesAPI.getAll(),
          notificationsAPI.count(),
        ]);

        if (cartData.status === 'fulfilled' && cartData.value) {
          setCart(cartData.value.items || []);
          setCartCount(cartData.value.count || 0);
        }
        if (favsData.status === 'fulfilled') {
          setFavs((favsData.value || []).map(a => a.id));
        }
        if (notifData.status === 'fulfilled') {
          setUnreadCount(notifData.value?.unread || 0);
        }
      } catch {
        api.setToken(null);
        setAuthStep('login');
      }
    })();
  }, []);

  // Écouter l'expiration du token
  useEffect(() => {
    api.onAuthExpired(() => {
      setUser(null);
      setAuthStep('login');
      showToast('Session expirée, reconnectez-vous', 'error');
    });
  }, []);

  // ══════════════════════════════════
  //  AUTH ACTIONS
  // ══════════════════════════════════

  const login = useCallback(async (token, userData, isNew) => {
    api.setToken(token);
    setUser(userData);
    setUserRole(userData.role || 'client');
    if (isNew || !userData.first_name) {
      setAuthStep('profile');
    } else {
      setAuthStep('ready');
      // Load cart + favs
      try {
        const [c, f] = await Promise.all([cartAPI.get(), favoritesAPI.getAll()]);
        setCart(c?.items || []); setCartCount(c?.count || 0);
        setFavs((f || []).map(a => a.id));
      } catch {}
    }
  }, []);

  const completeProfile = useCallback(async (data) => {
    const userData = await authAPI.completeProfile(data);
    setUser(userData);
    setAuthStep('ready');
  }, []);

  const logout = useCallback(async () => {
    try { await authAPI.logout(); } catch {}
    api.setToken(null);
    setUser(null);
    setAuthStep('login');
    setMode('buyer'); setTab(0); setScreen(null); setHistory([]);
    setCart([]); setFavs([]); setCartCount(0);
    setUserRole('client'); setVendorStatus('none'); setDriverStatus('none');
  }, []);

  // ══════════════════════════════════
  //  NAVIGATION
  // ══════════════════════════════════

  const go = useCallback((type, data) => {
    setHistory(h => [...h, screen]);
    setScreen({ type, data });
  }, [screen]);

  const pop = useCallback(() => {
    setHistory(h => {
      const copy = [...h];
      const prev = copy.pop();
      setScreen(prev || null);
      return copy;
    });
  }, []);

  const goHome = useCallback(() => {
    setScreen(null); setTab(0); setVTab(0); setDTab(0); setHistory([]);
  }, []);

  const switchMode = useCallback((m) => {
    setMode(m); setScreen(null); setHistory([]);
    setTab(0); setVTab(0); setDTab(0);
  }, []);

  // ══════════════════════════════════
  //  CART ACTIONS
  // ══════════════════════════════════

  const addToCart = useCallback(async (article, qty = 1) => {
    try {
      await cartAPI.add(article.id, qty);
      // Recharger le panier
      const data = await cartAPI.get();
      setCart(data?.items || []); setCartCount(data?.count || 0);
      showToast('Ajouté au panier 🛍️');
      setScreen(null); setHistory([]); setTab(2);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, []);

  const updateCartQty = useCallback(async (id, quantity) => {
    try {
      if (quantity < 1) {
        await cartAPI.remove(id);
      } else {
        await cartAPI.updateQty(id, quantity);
      }
      const data = await cartAPI.get();
      setCart(data?.items || []); setCartCount(data?.count || 0);
    } catch {}
  }, []);

  const clearCart = useCallback(async () => {
    await cartAPI.clear();
    setCart([]); setCartCount(0);
  }, []);

  // ══════════════════════════════════
  //  FAVORITES
  // ══════════════════════════════════

  const toggleFav = useCallback(async (articleId) => {
    try {
      const result = await favoritesAPI.toggle(articleId);
      setFavs(prev => result.is_favorite
        ? [...prev, articleId]
        : prev.filter(id => id !== articleId)
      );
    } catch {}
  }, []);

  const isFav = useCallback((articleId) => favs.includes(articleId), [favs]);

  // ══════════════════════════════════
  //  ROLES
  // ══════════════════════════════════

  const onRoleApproved = useCallback((role, plan) => {
    if (role === 'vendor') {
      setUserRole(r => r === 'driver' ? 'both' : 'vendor');
      setVendorPlan(plan || 'starter');
      setVendorStatus('approved');
    }
    if (role === 'driver') {
      setUserRole(r => r === 'vendor' ? 'both' : 'driver');
      setDriverStatus('approved');
    }
  }, []);

  const hasVendor = (userRole === 'vendor' || userRole === 'both') && vendorStatus === 'approved';
  const hasDriver = (userRole === 'driver' || userRole === 'both') && driverStatus === 'approved';

  // ══════════════════════════════════
  //  CONTEXT VALUE
  // ══════════════════════════════════

  const value = {
    // Auth
    user, authStep, setAuthStep, socialProvider, setSocialProvider,
    login, completeProfile, logout,

    // Navigation
    mode, setMode: switchMode, tab, setTab, vTab, setVTab, dTab, setDTab,
    screen, setScreen, history, setHistory,
    go, pop, goHome, switchTo: switchMode,

    // Cart
    cart, setCart, cartCount, addToCart, updateCartQty, clearCart,

    // Favorites
    favs, toggleFav, isFav,

    // Roles
    userRole, vendorPlan, setVendorPlan, vendorStatus, driverStatus,
    onRoleApproved, hasVendor, hasDriver,

    // Notifications
    unreadCount, setUnreadCount,

    // Toast
    toast, showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
