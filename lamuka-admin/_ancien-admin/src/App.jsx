import { useState, lazy, Suspense, useMemo, useRef, useEffect, useCallback } from "react";
import { useI18n } from "./i18n";
import { ALL_VENDORS, PENDING_VENDORS } from "./data";
import { ALL_ORDERS, ALL_DRIVERS } from "./dataExtended";
import { AdminProfileModal, Skeleton, useToast } from "./components/UI";
import LoginPage from "./pages/LoginPage";
import {
  LayoutDashboard, Store, Package, Bike, Wallet, FolderOpen, Image, BarChart3,
  Map, Users, Scale, Shield, ClipboardList, Settings, LogOut, Bell, Search,
  Globe, Menu, ChevronRight, Clock, Star, Truck
} from "lucide-react";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const VendorsPage = lazy(() => import("./pages/VendorsPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const FinancePage = lazy(() => import("./pages/FinancePage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const ModerationPage = lazy(() => import("./pages/ModerationPage"));
const UsersPage = lazy(() => import("./pages/UsersPage"));
const DriversPage = lazy(() => import("./pages/DriversPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ActivityLogPage = lazy(() => import("./pages/ActivityLogPage"));
const BannersPage = lazy(() => import("./pages/BannersPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const VendorDetailPage = lazy(() => import("./pages/VendorDetailPage"));
const DisputesPage = lazy(() => import("./pages/DisputesPage"));
const LiveMapPage = lazy(() => import("./pages/LiveMapPage"));

const NAV = [
  { section: "main", items: [
    { id: "dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "vendors", icon: <Store size={18} />, badge: 12 },
    { id: "orders", icon: <Package size={18} />, badge: 3 },
    { id: "drivers", icon: <Bike size={18} />, badge: 1 },
    { id: "finance", icon: <Wallet size={18} />, badge: 2 },
  ]},
  { section: "catalog", items: [
    { id: "categories", icon: <FolderOpen size={18} /> },
    { id: "banners", icon: <Image size={18} /> },
  ]},
  { section: "insights", items: [
    { id: "analytics", icon: <BarChart3 size={18} /> },
    { id: "liveMap", icon: <Map size={18} /> },
    { id: "users", icon: <Users size={18} /> },
  ]},
  { section: "manage", items: [
    { id: "disputes", icon: <Scale size={18} />, badge: 3 },
    { id: "moderation", icon: <Shield size={18} />, badge: 8 },
    { id: "activityLog", icon: <ClipboardList size={18} /> },
    { id: "settings", icon: <Settings size={18} /> },
  ]},
];

const SECTION_LABELS = {
  main: { fr: "PRINCIPAL", en: "MAIN" },
  catalog: { fr: "CATALOGUE", en: "CATALOG" },
  insights: { fr: "INSIGHTS", en: "INSIGHTS" },
  manage: { fr: "GESTION", en: "MANAGE" },
};

// Global search index: pages + entity data
const buildSearchIndex = (lang) => {
  const pages = [
    { type: "page", id: "vendors", kw: "commerçant vendeur inscription boutique vendor shop", label: lang === "fr" ? "Commerçants" : "Vendors", icon: <Store size={16} /> },
    { type: "page", id: "orders", kw: "commande livraison order delivery lmk", label: lang === "fr" ? "Commandes" : "Orders", icon: <Package size={16} /> },
    { type: "page", id: "drivers", kw: "livreur driver moto véhicule", label: lang === "fr" ? "Livreurs" : "Drivers", icon: <Bike size={16} /> },
    { type: "page", id: "finance", kw: "finance paiement retrait commission revenue", label: "Finance", icon: <Wallet size={16} /> },
    { type: "page", id: "analytics", kw: "analytics statistique kpi conversion", label: lang === "fr" ? "Analytique" : "Analytics", icon: <BarChart3 size={16} /> },
    { type: "page", id: "moderation", kw: "modération signalement ticket support review", label: lang === "fr" ? "Modération" : "Moderation", icon: <Shield size={16} /> },
    { type: "page", id: "users", kw: "utilisateur client user ban compte", label: lang === "fr" ? "Utilisateurs" : "Users", icon: <Users size={16} /> },
    { type: "page", id: "categories", kw: "catégorie category catalogue", label: lang === "fr" ? "Catégories" : "Categories", icon: <FolderOpen size={16} /> },
    { type: "page", id: "banners", kw: "bannière banner promo", label: lang === "fr" ? "Bannières" : "Banners", icon: <Image size={16} /> },
    { type: "page", id: "settings", kw: "paramètre setting zone plan notification", label: lang === "fr" ? "Paramètres" : "Settings", icon: <Settings size={16} /> },
    { type: "page", id: "activityLog", kw: "log activité history audit journal", label: lang === "fr" ? "Journal" : "Activity Log", icon: <ClipboardList size={16} /> },
    { type: "page", id: "disputes", kw: "litige dispute remboursement refund", label: lang === "fr" ? "Litiges" : "Disputes", icon: <Scale size={16} /> },
    { type: "page", id: "liveMap", kw: "carte map temps réel live tracking position gps livreur", label: lang === "fr" ? "Carte en direct" : "Live Map", icon: <Map size={16} /> },
  ];
  // Entities
  const vendors = ALL_VENDORS.map(v => ({ type: "vendor", id: v.id, page: "vendors", label: v.name, sub: v.type, icon: <Store size={16} />, kw: (v.name + " " + v.owner + " " + v.type).toLowerCase() }));
  const pending = PENDING_VENDORS.map(v => ({ type: "vendor", id: v.id, page: "vendors", label: v.name, sub: lang === "fr" ? "En attente" : "Pending", icon: <Clock size={16} />, kw: (v.name + " " + v.owner).toLowerCase() }));
  const orders = ALL_ORDERS.map(o => ({ type: "order", id: o.id, page: "orders", label: o.ref, sub: o.client, icon: <Package size={16} />, kw: (o.ref + " " + o.client + " " + o.vendor).toLowerCase() }));
  const drivers = ALL_DRIVERS.map(d => ({ type: "driver", id: d.id, page: "drivers", label: d.name, sub: d.vehicle, icon: <Bike size={16} />, kw: (d.name + " " + d.phone + " " + d.vehicle).toLowerCase() }));
  return [...pages, ...vendors, ...pending, ...orders, ...drivers];
};

const NOTIFS_INIT = [
  { id: 1, text: "Chez Mama Rose demande l'inscription", textEn: "Chez Mama Rose registration request", time: "5 min", read: false, page: "vendors" },
  { id: 2, text: "Retrait 250 000 F en attente", textEn: "Withdrawal 250,000 F pending", time: "32 min", read: false, page: "finance" },
  { id: 3, text: "Nouveau litige — commande #LMK-0889", textEn: "New dispute — order #LMK-0889", time: "1h", read: false, page: "disputes" },
  { id: 4, text: "iPhone 15 signalé — 5 rapports", textEn: "iPhone 15 reported — 5 reports", time: "2h", read: false, page: "moderation" },
  { id: 5, text: "Mama Ngudi demande upgrade Pro", textEn: "Mama Ngudi requests Pro upgrade", time: "4h", read: true, page: "vendors" },
  { id: 6, text: "Ticket support haute priorité", textEn: "High priority support ticket", time: "5h", read: true, page: "moderation" },
];

const ADMIN_DEFAULT = { name: "Joeldy Tsina", email: "joeldytsina94@gmail.com", phone: "+242 064663469", role: "Super Admin", avatar: null };
const BRANDING_DEFAULT = { appName: "Lamuka", appLogo: null, appSubtitle: "Super Admin" };

// localStorage helpers
const loadJSON = (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const saveJSON = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

export default function App() {
  const { t, lang, switchLang } = useI18n();
  const toast = useToast();

  // Auth state
  const [loggedIn, setLoggedIn] = useState(() => loadJSON("lamuka_admin_auth", false));
  const [adminProfile, setAdminProfile] = useState(() => loadJSON("lamuka_admin_profile", ADMIN_DEFAULT));
  const [branding, setBranding] = useState(() => loadJSON("lamuka_admin_branding", BRANDING_DEFAULT));
  const [showProfile, setShowProfile] = useState(false);

  // Navigation
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendorDetail, setVendorDetail] = useState(null); // for vendor detail page

  // Search
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS_INIT);
  const notifRef = useRef(null);

  const unreadCount = notifs.filter(n => !n.read).length;
  const searchIndex = useMemo(() => buildSearchIndex(lang), [lang]);

  // Outside click handlers
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchFocused(true);
      }
      if (e.key === "Escape") {
        setSearchFocused(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return searchIndex.filter(item => item.kw.includes(q) || item.label.toLowerCase().includes(q)).slice(0, 10);
  }, [search, searchIndex]);

  const navigateTo = useCallback((p) => {
    setPage(p);
    setVendorDetail(null);
    setSearch("");
    setSearchFocused(false);
    setSidebarOpen(false);
  }, []);

  const handleNotifClick = (n) => {
    setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x));
    navigateTo(n.page);
    setNotifOpen(false);
  };

  const handleSearchSelect = (item) => {
    if (item.type === "page") navigateTo(item.id);
    else navigateTo(item.page);
    setSearch("");
    setSearchFocused(false);
  };

  const handleProfileSave = (data) => {
    const updated = { name: data.name, email: data.email, phone: data.phone, role: data.role || "Super Admin", avatar: data.avatar || null };
    setAdminProfile(updated);
    saveJSON("lamuka_admin_profile", updated);
    toast.success(lang === "fr" ? "Profil mis à jour" : "Profile updated");
  };

  const handleBrandingChange = (newBranding) => {
    setBranding(newBranding);
    saveJSON("lamuka_admin_branding", newBranding);
    toast.success(lang === "fr" ? "Branding mis à jour" : "Branding updated");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    saveJSON("lamuka_admin_auth", false);
  };

  // Handle vendor detail navigation from VendorsPage
  const openVendorDetail = (vendor) => {
    setVendorDetail(vendor);
    setPage("vendorDetail");
  };

  // Login
  if (!loggedIn) {
    return <LoginPage lang={lang} branding={branding} onLogin={(profile) => { setAdminProfile(prev => { const p = { ...prev, ...profile }; saveJSON("lamuka_admin_profile", p); return p; }); setLoggedIn(true); saveJSON("lamuka_admin_auth", true); }} />;
  }

  const renderPage = () => {
    if (page === "vendorDetail" && vendorDetail) {
      return <VendorDetailPage vendor={vendorDetail} onBack={() => navigateTo("vendors")} onNavigate={navigateTo} />;
    }
    switch (page) {
      case "dashboard":   return <DashboardPage onNavigate={navigateTo} />;
      case "vendors":     return <VendorsPage onOpenDetail={openVendorDetail} />;
      case "orders":      return <OrdersPage />;
      case "drivers":     return <DriversPage />;
      case "finance":     return <FinancePage />;
      case "analytics":   return <AnalyticsPage />;
      case "moderation":  return <ModerationPage />;
      case "users":       return <UsersPage />;
      case "categories":  return <CategoriesPage />;
      case "banners":     return <BannersPage />;
      case "activityLog": return <ActivityLogPage />;
      case "disputes":    return <DisputesPage />;
      case "liveMap":     return <LiveMapPage />;
      case "settings":    return <SettingsPage branding={branding} onBrandingChange={handleBrandingChange} />;
      default:            return <DashboardPage onNavigate={navigateTo} />;
    }
  };

  const initials = adminProfile.name?.split(" ").map(n => n[0]).join("").substring(0, 2) || "AD";

  return (
    <div className="app-layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ═══ SIDEBAR ═══ */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          {branding.appLogo ? (
            <img src={branding.appLogo} alt="logo" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
          ) : (
            <div className="sidebar-brand-icon">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" fill="currentColor" opacity="0.15"/>
                <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <path d="M4 8l12 6 12-6M16 14v16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="16" cy="14" r="3" fill="currentColor"/>
              </svg>
            </div>
          )}
          <div><h1>{branding.appName || "Lamuka"}</h1><span>{branding.appSubtitle || "Super Admin"}</span></div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(section => (
            <div key={section.section} className="sidebar-section">
              <div className="sidebar-section-label">{SECTION_LABELS[section.section]?.[lang] || section.section}</div>
              {section.items.map(item => (
                <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => navigateTo(item.id)}>
                  <span className="nav-icon">{item.icon}</span>
                  {t(item.id)}
                  {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
          {/* Logout */}
          <div className="sidebar-section" style={{ marginTop: 8 }}>
            <button className="nav-item" style={{ color: "var(--danger)" }} onClick={handleLogout}>
              <span className="nav-icon"><LogOut size={18} /></span>
              {t("logout")}
            </button>
          </div>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-user" style={{ cursor: "pointer", width: "100%", background: "none", border: "none", padding: 0, fontFamily: "inherit", textAlign: "left" }} onClick={() => setShowProfile(true)}>
            {adminProfile.avatar ? (
              <img src={adminProfile.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} />
            ) : (
              <div className="sidebar-avatar">{initials}</div>
            )}
            <div className="sidebar-user-info">
              <h4>{adminProfile.name}</h4>
              <span>{adminProfile.role || "Super Admin"}</span>
            </div>
          </button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <div className="main-content">
        <header className="main-header">
          <button className="header-burger" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>

          {/* Global Search */}
          <div className="header-search" ref={searchRef}>
            <input ref={searchInputRef} type="text" placeholder={`${t("search")} (Ctrl+K)`} value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} />
            {searchFocused && search.length >= 2 && (
              <div className="search-dropdown">
                {searchResults.length === 0 ? (
                  <div className="search-empty">{lang === "fr" ? "Aucun résultat pour" : "No results for"} "{search}"</div>
                ) : (<>
                  {searchResults.map((r, i) => (
                    <button key={r.type + r.id + i} className="search-result" onClick={() => handleSearchSelect(r)}>
                      <span style={{ width: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{r.label}</div>
                        {r.sub && <div style={{ fontSize: 11, color: "var(--text-3)" }}>{r.sub}</div>}
                      </div>
                      <span className="badge badge-neutral" style={{ fontSize: 10 }}>{r.type}</span>
                    </button>
                  ))}
                </>)}
              </div>
            )}
          </div>

          <div className="header-actions">
            <button className="lang-switch" onClick={() => switchLang(lang === "fr" ? "en" : "fr")}>
              <Globe size={15} style={{ marginRight: 4 }} />{lang === "fr" ? "EN" : "FR"}
            </button>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button className="header-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={18} />{unreadCount > 0 && <span className="dot" />}
              </button>
              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications ({unreadCount})</span>
                    {unreadCount > 0 && <button className="btn btn-sm btn-ghost" onClick={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}>✓ {lang === "fr" ? "Tout lire" : "Read all"}</button>}
                  </div>
                  <div className="notif-list">
                    {notifs.map(n => (
                      <button key={n.id} className={`notif-item ${n.read ? "" : "unread"}`} onClick={() => handleNotifClick(n)}>
                        <div className="notif-text">{lang === "fr" ? n.text : n.textEn}</div>
                        <div className="notif-time">{n.time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin profile */}
            <button className="header-btn header-avatar" onClick={() => setShowProfile(true)} title={adminProfile.name}
              style={adminProfile.avatar ? { padding: 0, overflow: "hidden", border: "none" } : undefined}>
              {adminProfile.avatar ? (
                <img src={adminProfile.avatar} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 10 }} />
              ) : initials}
            </button>
          </div>
        </header>

        <div className="page-content">
          <Suspense fallback={<Skeleton rows={6} cols={4} />}>
            {renderPage()}
          </Suspense>
        </div>
      </div>

      {/* Admin Profile Modal */}
      <AdminProfileModal open={showProfile} onClose={() => setShowProfile(false)} profile={adminProfile} onSave={handleProfileSave} lang={lang} />
    </div>
  );
}
