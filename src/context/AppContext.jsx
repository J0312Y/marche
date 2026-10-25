/**
 * AppContext — État global de l'application
 * Connecté aux services (mock/API selon VITE_USE_MOCK)
 */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { setToken, getToken, isAuthenticated, onAuthExpired } from '../api/client';
import { auth, cart as cartSvc, social as socialSvc } from '../services';
import { setToastListener } from '../utils/toast';
import { initPush, forgetPush } from '../utils/push';
import { triggerPush } from '../components/PushBanner';
import Icon from '../components/Icon';

const AppContext = createContext(null);

/** Destination d'une notification envoyée depuis le panneau (data : action_type + action_value) */
export function openBroadcast(d, { nav, buyer, toCourier }) {
  const t = d.action_type, v = d.action_value;
  if (t === 'url' && /^https:\/\//i.test(v || '')) { window.open(v, '_blank', 'noopener'); return; }
  if (!buyer) { nav('notif'); return; }
  if (t === 'store' && v) nav('vendor', { id: Number(v) });
  else if (t === 'screen' && v === 'coursier') toCourier();
  else if (t === 'screen' && ['loyalty', 'promos', 'vendorReg', 'driverReg'].includes(v)) nav(v);
  else nav('notif');
}

// ── Panier invité (localStorage) : mêmes champs que les lignes renvoyées par l'API ──
const GUEST_CART_KEY = 'lk-guest-cart';
function readGuestCart() {
  try { const v = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
}
function writeGuestCart(items) {
  try { localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items)); } catch {}
}
const countOf = (items) => (items || []).reduce((s, i) => s + (parseInt(i.quantity ?? i.qty ?? 1, 10) || 1), 0);

export function AppProvider({ children }) {

  // ── Auth ──
  const [user, setUser] = useState(null);
  const [authStep, setAuthStep] = useState(isAuthenticated() ? 'loading' : 'splash');
  const [socialProvider, setSocialProvider] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [pendingPhone, setPendingPhone] = useState('');

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
  // Comme Toters : on parcourt l'app sans compte ; la connexion est demandée au moment utile
  const [isGuest, setIsGuest] = useState(() => !isAuthenticated());

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
  }, []);

  // Feuille de connexion (numéro → code) : { reason, onDone } ; onDone est appelé une fois connecté
  const [loginSheet, setLoginSheet] = useState(null);
  const requireLogin = useCallback((reason, onDone) => {
    if (isAuthenticated()) { onDone?.(); return; }
    setLoginSheet({ reason: reason || 'login', onDone });
  }, []);
  const closeLoginSheet = useCallback(() => setLoginSheet(null), []);

  // Compatibilité : anciens appels « invité bloqué » → ouvrent la feuille de connexion
  const guestPromptReason = null;
  const triggerGuestPrompt = useCallback((reason) => { setLoginSheet({ reason: reason || 'login' }); }, []);
  const closeGuestPrompt = useCallback(() => setLoginSheet(null), []);
  const exitGuestToLogin = useCallback(() => { setLoginSheet({ reason: 'login' }); }, []);
  
  // Called after successful login — disable guest mode and merge local data
  const upgradeFromGuest = useCallback(() => {
    setIsGuest(false);
    // Local cart and favorites persist automatically via localStorage
    // They'll be visible in the now-authenticated session
  }, []);
  const [vendorStatus, setVendorStatus] = useState('none');
  const [driverStatus, setDriverStatus] = useState('none');

  // ── Notifications ──
  const [unreadCount, setUnreadCount] = useState(0);

  // ── Toast ──
  const [toast, setToast] = useState(null);
  // Articles consultés (10 derniers, gardés sur l'appareil) : suggestions de recherche « d'après vos visites »
  const [recentlyViewed, setRecentlyViewed] = useState(() => { try { return JSON.parse(localStorage.getItem('lk-viewed') || '[]'); } catch { return []; } });
  const addRecentlyViewed = useCallback((product) => {
    const light = { id: product.id, name: product.name, cat: product.cat || '', menu_section: product.menu_section || '', photo: product.photo || null, price: product.price, establishmentId: product.establishmentId };
    setRecentlyViewed(prev => {
      const next = [light, ...prev.filter(p => p.id !== product.id)].slice(0, 10);
      try { localStorage.setItem('lk-viewed', JSON.stringify(next)); } catch { /* stockage indisponible */ }
      return next;
    });
  }, []);
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
    if (!isAuthenticated()) {
      const g = readGuestCart();
      setCart(g); setCartCount(countOf(g));
      return;
    }

    (async () => {
      try {
        const userData = await auth.getMe();
        setUser(userData);
        setUserRole(userData.role || 'client');
        if (userData.vendor_status) setVendorStatus(userData.vendor_status);
        if (userData.vendor_plan) setVendorPlan(userData.vendor_plan);
        if (userData.driver_status) setDriverStatus(userData.driver_status);
        if (userData.role === 'vendor' || userData.role === 'both') setMode('buyer');
        setAuthStep('ready');

        const [cartData, favsData, notifData] = await Promise.allSettled([
          cartSvc.get(),
          socialSvc.getFavorites(),
          socialSvc.getUnreadCount(),
        ]);

        if (cartData.status === 'fulfilled' && cartData.value) {
          setCart(cartData.value.items || []);
          setCartCount(countOf(cartData.value.items || []));
        }
        if (favsData.status === 'fulfilled') {
          setFavs((favsData.value || []).map(a => Number(a.id)));
        }
        if (notifData.status === 'fulfilled') {
          setUnreadCount(notifData.value?.unread ?? notifData.value?.count ?? 0);
        }
      } catch {
        setToken(null);
        setIsGuest(true);
        setAuthStep('ready');
      }
    })();
  }, []);

  useEffect(() => {
    onAuthExpired(() => {
      setUser(null);
      setIsGuest(true);
      setCart([]); setCartCount(0);
      showToast('Session expirée, reconnectez-vous', 'error');
    });
  }, []);

  // ══════════════════════════════════
  //  AUTH ACTIONS
  // ══════════════════════════════════

  // opts.inPlace : connexion depuis la feuille de connexion (le nom est déjà demandé dedans) → on reste sur l'écran courant
  const login = useCallback(async (token, userData, isNew, opts = {}) => {
    setToken(token);
    setIsGuest(false);
    // Panier rempli en invité → envoyé au serveur
    const guestItems = readGuestCart();
    if (guestItems.length) {
      try {
        await cartSvc.merge(guestItems.map((g) => ({ article_id: g.article_id, quantity: g.quantity, options: (g.options || []).map((o) => ({ group: o.group, name: o.name })), note: g.note || '' })));
      } catch {}
      writeGuestCart([]);
    }
    setUser(userData);
    setUserRole(userData.role || 'client');
    if (userData.vendor_status) setVendorStatus(userData.vendor_status);
    if (userData.vendor_plan) setVendorPlan(userData.vendor_plan);
    if (userData.driver_status) setDriverStatus(userData.driver_status);
    if (opts.inPlace) {
      setAuthStep('ready');
    } else {
      setAuthStep('ready');
    }
    try {
      const [c, f] = await Promise.all([cartSvc.get(), socialSvc.getFavorites()]);
      setCart(c?.items || []); setCartCount(countOf(c?.items || []));
      setFavs((f || []).map(a => Number(a.id)));
    } catch {}
  }, []);

  const completeProfile = useCallback(async (data) => {
    const userData = await auth.completeProfile(data);
    setUser(userData);
    setAuthStep('ready');
  }, []);

  const logout = useCallback(async () => {
    await forgetPush();
    try { await auth.logout(); } catch {}
    setToken(null);
    setUser(null);
    setIsGuest(true);
    setAuthStep('ready');
    setMode('buyer'); setTab(0); setScreen(null); setHistory([]);
    setCart([]); setFavs([]); setCartCount(0);
    setUserRole('client'); setVendorStatus('none'); setDriverStatus('none');
  }, []);

  // ══════════════════════════════════
  //  NAVIGATION
  // ══════════════════════════════════

  // data.replace : l'écran courant est remplacé (le retour ne revient pas sur un formulaire déjà envoyé)
  const go = useCallback((type, data) => {
    if (!data?.replace) setHistory(h => [...h, screen]);
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
  //  NOTIFICATIONS (téléphone)
  // ══════════════════════════════════

  // Écran à ouvrir quand on touche une notification (selon l'espace affiché)
  const pushNav = useRef(null);
  pushNav.current = (d = {}) => {
    const nav = (type, data) => { setHistory([]); setScreen({ type, data }); };
    // Message envoyé depuis le panneau (« Notifications ») : ouvre la destination choisie, côté client
    if (d.type === 'broadcast') {
      openBroadcast(d, { nav, buyer: mode === 'buyer', toCourier: () => { setScreen(null); setTab(2); } });
      return;
    }
    if (d.type === 'new_delivery' || d.type === 'new_errand') {
      if (driverStatus === 'approved') { switchMode('driver'); if (d.type === 'new_errand') setDTab(1); }
      return;
    }
    if (mode === 'driver') { setScreen(null); setDTab(0); return; }
    if (mode === 'vendor') { if (d.order_id) nav('vOrderDetail', { id: Number(d.order_id) }); else if (d.type === 'message') { setScreen(null); setVTab(3); } return; }
    if (d.order_id) nav('tracking', { id: Number(d.order_id) });
    else if (d.errand_id) nav('errandDetail', { id: Number(d.errand_id) });
    else if (d.type === 'message') nav('chatList');
  };

  // Appareil enregistré une fois connecté ; compteur des notifications non lues tenu à jour
  useEffect(() => {
    if (!user?.id) return;
    initPush({
      onForeground: (n) => {
        setUnreadCount((c) => c + 1);
        triggerPush({ title: n.title, body: n.body, onTap: () => pushNav.current?.(n.data || {}) });
      },
      onTap: (d) => pushNav.current?.(d),
    });
    const t = setInterval(() => { socialSvc.getUnreadCount().then((r) => setUnreadCount(r?.unread ?? r?.count ?? 0)).catch(() => {}); }, 60000);
    return () => clearInterval(t);
  }, [user?.id]);

  // ══════════════════════════════════
  //  CART ACTIONS (via services)
  // ══════════════════════════════════

  /**
   * Ajout au panier. extras.options : [{group, name}] (validées par le serveur ; calculées localement en invité).
   * Retourne true si l'article a été ajouté.
   */
  const addToCart = useCallback(async (article, qty = 1, extras = {}) => {
    const options = extras.options || [];
    if (!isAuthenticated()) {
      const groups = article.optionGroups || article.option_groups || [];
      const full = options.map((o) => {
        const g = groups.find((x) => x.key === o.group);
        const opt = g?.options.find((x) => x.name === o.name);
        return { group: o.group, label: g?.label || o.group, name: o.name, price_delta: Number(opt?.price_delta || 0) };
      });
      const key = full.map((o) => o.group + '=' + o.name).sort().join('|');
      const items = readGuestCart();
      const same = items.find((g) => g.article_id === article.id && g.options_key === key);
      if (same) { same.quantity += qty; if (extras.note) same.note = extras.note; }
      else items.push({
        id: 'g' + Date.now(), article_id: article.id, quantity: qty, options: full, options_key: key, note: extras.note || '',
        name: article.name, price: Number(article.price), unit_price: Number(article.price) + full.reduce((t, o) => t + o.price_delta, 0),
        image: article.photo || article.image || article.thumbnail_url || null,
        size_label: article.size_label || null,
        establishment_id: article.establishmentId || article.establishment_id, establishment_name: article.vendor || article.establishment_name,
        establishment_logo: article.establishment_avatar || null,
      });
      writeGuestCart(items);
      setCart([...items]); setCartCount(countOf(items));
      return true;
    }
    try {
      await cartSvc.add(article.id, qty, extras.note || "", options);
      const data = await cartSvc.get();
      setCart(data?.items || []); setCartCount(countOf(data?.items || []));
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  }, []);

  const updateCartQty = useCallback(async (id, quantity) => {
    if (!isAuthenticated()) {
      let items = readGuestCart();
      items = quantity < 1 ? items.filter((g) => g.id !== id) : items.map((g) => g.id === id ? { ...g, quantity } : g);
      writeGuestCart(items);
      setCart(items); setCartCount(countOf(items));
      return;
    }
    try {
      if (quantity < 1) { await cartSvc.remove(id); }
      else { await cartSvc.updateQty(id, quantity); }
      const data = await cartSvc.get();
      setCart(data?.items || []); setCartCount(countOf(data?.items || []));
    } catch (err) {
      const msg = !navigator.onLine ? "Pas de connexion Internet" : "Impossible de mettre à jour le panier";
      showToast(msg, 'error');
    }
  }, []);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated()) writeGuestCart([]);
    else await cartSvc.clear();
    setCart([]); setCartCount(0); setAppliedCoupon(null);
  }, []);

  // Recharge le panier (après une erreur serveur, un changement de prix…)
  const reloadCart = useCallback(async () => {
    if (!isAuthenticated()) { const g = readGuestCart(); setCart(g); setCartCount(countOf(g)); return; }
    try { const data = await cartSvc.get(); setCart(data?.items || []); setCartCount(countOf(data?.items || [])); } catch {}
  }, []);

  // ══════════════════════════════════
  //  FAVORITES (via services)
  // ══════════════════════════════════

  const toggleFav = useCallback(async (articleId) => {
    // Gate favorites for guests
    if (isGuest) {
      setLoginSheet({ reason: "favorite" });
      return;
    }
    try {
      const result = await socialSvc.toggleFavorite(articleId);
      showToast(result.is_favorite ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
      const id = Number(articleId);
      setFavs(prev => result.is_favorite
        ? [...prev.filter(x => x !== id), id]
        : prev.filter(x => x !== id)
      );
    } catch (err) {
      const msg = !navigator.onLine ? "Pas de connexion Internet" : "Impossible d'ajouter aux favoris";
      showToast(msg, 'error');
    }
  }, [isGuest]);

  const isFav = useCallback((articleId) => favs.includes(Number(articleId)), [favs]);

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
    user, setUser, authStep, setAuthStep, socialProvider, setSocialProvider, isNewUser, setIsNewUser, pendingPhone, setPendingPhone,
    login, completeProfile, logout,
    mode, setMode: switchMode, tab, setTab, vTab, setVTab, dTab, setDTab,
    screen, setScreen, history, setHistory, go, pop, goHome, switchTo: switchMode,
    cart, setCart, cartCount, setCartCount, addToCart, updateCartQty, clearCart, reloadCart,
    loginSheet, requireLogin, closeLoginSheet,
    appliedCoupon, setAppliedCoupon,
    favs, toggleFav, isFav,
    userRole, setUserRole, vendorPlan, setVendorPlan, isGuest, setIsGuest, continueAsGuest, upgradeFromGuest, exitGuestToLogin, triggerGuestPrompt, guestPromptReason, closeGuestPrompt, vendorStatus, setVendorStatus, driverStatus, setDriverStatus,
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
      user:null,setUser:()=>{},authStep:'ready',setAuthStep:()=>{},socialProvider:null,setSocialProvider:()=>{},isNewUser:false,setIsNewUser:()=>{},pendingPhone:'',setPendingPhone:()=>{},
      login:()=>{},completeProfile:()=>{},logout:()=>{},
      mode:'buyer',setMode:()=>{},tab:0,setTab:()=>{},vTab:0,setVTab:()=>{},dTab:0,setDTab:()=>{},
      screen:null,setScreen:()=>{},history:[],setHistory:()=>{},go:()=>{},pop:()=>{},goHome:()=>{},switchTo:()=>{},
      cart:[],setCart:()=>{},cartCount:0,setCartCount:()=>{},addToCart:()=>{},updateCartQty:()=>{},clearCart:()=>{},reloadCart:()=>{},
      loginSheet:null,requireLogin:()=>{},closeLoginSheet:()=>{},
      appliedCoupon:null,setAppliedCoupon:()=>{},
      favs:[],toggleFav:()=>{},isFav:()=>false,
      userRole:'client',vendorPlan:'starter',setVendorPlan:()=>{},isGuest:false,setIsGuest:()=>{},continueAsGuest:()=>{},upgradeFromGuest:()=>{},exitGuestToLogin:()=>{},triggerGuestPrompt:()=>{},guestPromptReason:null,closeGuestPrompt:()=>{},vendorStatus:'none',setVendorStatus:()=>{},driverStatus:'none',setDriverStatus:()=>{},
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
