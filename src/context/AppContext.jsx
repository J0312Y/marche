/**
 * AppContext — État global de l'application
 * Connecté aux services (mock/API selon VITE_USE_MOCK)
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { setToken, getToken, isAuthenticated, onAuthExpired } from '../api/client';
import { auth, cart as cartSvc, social as socialSvc } from '../services';
import { setToastListener } from '../utils/toast';

const AppContext = createContext(null);

export function AppProvider({ children }) {

  // ── Auth ──
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState(isAuthenticated() ? 'loading' : 'splash');
  const [socialProvider, setSocialProvider] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  // ── Navigation ──
  const [mode, setMode] = useState('buyer');
  const [tab, setTab] = useState(0);
  const [vTab, setVTab] = useState(0);
  const [dTab, setDTab] = useState(0);
  const [screen, setScreen] = useState(null);
  const [history, setHistory] = useState([]);

  // ── Cart ──
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // ── Favorites ──
  const [favs, setFavs] = useState([]);

  // ── Roles ──
  const [userRole, setUserRole] = useState('client');
  const [userName, setUserName] = useState('');
  const [vendorPlan, setVendorPlan] = useState('starter');
  const [vendorStatus, setVendorStatus] = useState('none');
  const [driverStatus, setDriverStatus] = useState('none');

  // ── Notifications ──
  const [unreadCount, setUnreadCount] = useState(0);

  // ── Toast ──
  const [toast, setToast] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const addRecentlyViewed = useCallback((product) => { setRecentlyViewed(prev => { const filtered = prev.filter(p => p.id !== product.id); return [product, ...filtered].slice(0, 10); }); }, []);
  const [seenStories, setSeenStories] = useState([]);
  const markStorySeen = useCallback((vendorId) => { setSeenStories(prev => prev.includes(vendorId) ? prev : [...prev, vendorId]); }, []);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('lamuka_dark') === '1');
  const toggleDark = useCallback(() => { setDarkMode(d => { const n = !d; localStorage.setItem('lamuka_dark', n ? '1' : '0'); return n; }); }, []);
  const [lang, setLangState] = useState(() => {
    const l = localStorage.getItem('lk-lang') || 'fr';
    import('../utils/i18n').then(m => m.setLanguage(l));
    return l;
  });
  const setLang = useCallback((l) => { setLangState(l); localStorage.setItem('lk-lang', l); import('../utils/i18n').then(m => m.setLanguage(l)); }, []);
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  // Wire global toast utility
  useEffect(() => { setToastListener(showToast); }, [showToast]);

  // ══════════════════════════════════
  //  BOOT — Restaurer session
  // ══════════════════════════════════

  useEffect(() => {
    if (!isAuthenticated()) return;

    (async () => {
      try {
        const userData = await auth.getMe();
        setUser(userData);
        setUserRole(userData.role || 'client');
        setAuthStep('ready');

        const [cartData, favsData, notifData] = await Promise.allSettled([
          cartSvc.get(),
          socialSvc.getFavorites(),
          socialSvc.getUnreadCount(),
        ]);

        if (cartData.status === 'fulfilled' && cartData.value) {
          setCart(cartData.value.items || []);
          setCartCount((cartData.value.items || []).reduce((s, i) => s + (i.qty || 1), 0));
        }
        if (favsData.status === 'fulfilled') {
          setFavs((favsData.value || []).map(a => a.id));
        }
        if (notifData.status === 'fulfilled') {
          setUnreadCount(notifData.value?.count || 0);
        }
      } catch {
        setToken(null);
        setAuthStep('login');
      }
    })();
  }, []);

  useEffect(() => {
    onAuthExpired(() => {
      setUser(null);
      setAuthStep('login');
      showToast('Session expirée, reconnectez-vous', 'error');
    });
  }, []);

  // ══════════════════════════════════
  //  AUTH ACTIONS
  // ══════════════════════════════════

  const login = useCallback(async (token, userData, isNew) => {
    setToken(token);
    setUser(userData);
    setUserRole(userData.role || 'client');
    if (isNew || !userData.first_name) {
      setAuthStep('profile');
    } else {
      setAuthStep('ready');
      try {
        const [c, f] = await Promise.all([cartSvc.get(), socialSvc.getFavorites()]);
        setCart(c?.items || []); setCartCount((c?.items || []).reduce((s, i) => s + (i.qty || 1), 0));
        setFavs((f || []).map(a => a.id));
      } catch {}
    }
  }, []);

  const completeProfile = useCallback(async (data) => {
    const userData = await auth.completeProfile(data);
    setUser(userData);
    setAuthStep('ready');
  }, []);

  const logout = useCallback(async () => {
    try { await auth.logout(); } catch {}
    setToken(null);
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
  //  CART ACTIONS (via services)
  // ══════════════════════════════════

  const addToCart = useCallback(async (article, qty = 1, extras = {}) => {
    try {
      await cartSvc.add(article.id, qty, extras.note || "", extras.sides || []);
      const data = await cartSvc.get();
      setCart(data?.items || []); setCartCount((data?.items || []).reduce((s, i) => s + (i.qty || 1), 0));
      showToast('Ajouté au panier 🛍️');
      setScreen(null); setHistory([]); setTab(2);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }, []);

  const updateCartQty = useCallback(async (id, quantity) => {
    try {
      if (quantity < 1) { await cartSvc.remove(id); }
      else { await cartSvc.updateQty(id, quantity); }
      const data = await cartSvc.get();
      setCart(data?.items || []); setCartCount((data?.items || []).reduce((s, i) => s + (i.qty || 1), 0));
    } catch {}
  }, []);

  const clearCart = useCallback(async () => {
    await cartSvc.clear();
    setCart([]); setCartCount(0); setAppliedCoupon(null);
  }, []);

  // ══════════════════════════════════
  //  FAVORITES (via services)
  // ══════════════════════════════════

  const toggleFav = useCallback(async (articleId) => {
    try {
      const result = await socialSvc.toggleFavorite(articleId);
      showToast(result.is_favorite ? 'Ajouté aux favoris ❤️' : 'Retiré des favoris');
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
    user, authStep, setAuthStep, socialProvider, setSocialProvider, isNewUser, setIsNewUser,
    login, completeProfile, logout,
    mode, setMode: switchMode, tab, setTab, vTab, setVTab, dTab, setDTab,
    screen, setScreen, history, setHistory, go, pop, goHome, switchTo: switchMode,
    cart, setCart, cartCount, addToCart, updateCartQty, clearCart,
    appliedCoupon, setAppliedCoupon,
    favs, toggleFav, isFav,
    userRole, vendorPlan, setVendorPlan, vendorStatus, setVendorStatus, driverStatus, setDriverStatus,
    onRoleApproved, hasVendor, hasDriver,
    unreadCount, setUnreadCount,
    toast, showToast,
    darkMode, toggleDark, lang, setLang,
    userName, setUserName,
    recentlyViewed, addRecentlyViewed,
    seenStories, markStorySeen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    console.warn('useApp: context not available (hot reload?)');
    return {
      user:null,authStep:'ready',setAuthStep:()=>{},socialProvider:null,setSocialProvider:()=>{},isNewUser:false,setIsNewUser:()=>{},
      login:()=>{},completeProfile:()=>{},logout:()=>{},
      mode:'buyer',setMode:()=>{},tab:0,setTab:()=>{},vTab:0,setVTab:()=>{},dTab:0,setDTab:()=>{},
      screen:null,setScreen:()=>{},history:[],setHistory:()=>{},go:()=>{},pop:()=>{},goHome:()=>{},switchTo:()=>{},
      cart:[],setCart:()=>{},cartCount:0,addToCart:()=>{},updateCartQty:()=>{},clearCart:()=>{},
      appliedCoupon:null,setAppliedCoupon:()=>{},
      favs:[],toggleFav:()=>{},isFav:()=>false,
      userRole:'client',vendorPlan:'starter',setVendorPlan:()=>{},vendorStatus:'none',setVendorStatus:()=>{},driverStatus:'none',setDriverStatus:()=>{},
      onRoleApproved:()=>{},hasVendor:false,hasDriver:false,
      unreadCount:0,setUnreadCount:()=>{},
      toast:null,showToast:()=>{},
      darkMode:false,toggleDark:()=>{},lang:'fr',setLang:()=>{},
      userName:'',setUserName:()=>{},
      recentlyViewed:[],addRecentlyViewed:()=>{},
      seenStories:[],markStorySeen:()=>{},
    };
  }
  return ctx;
}

export default AppContext;
