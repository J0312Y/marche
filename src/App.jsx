import { useState, lazy, Suspense } from "react";
import CSS from "./styles/global";
import { P } from "./data";
import { SplashScr, OnboardingScr, LoginScr, OTPScr, ProfileCompletionScr } from "./screens/auth";
import LoadingSpinner from "./components/ui/LoadingSpinner";

/* ═══ LAZY LOADED MODE CHUNKS ═══ */
const BuyerScreens = lazy(() => import("./modes/BuyerScreens"));
const VendorScreens = lazy(() => import("./modes/VendorScreens"));
const DriverScreens = lazy(() => import("./modes/DriverScreens"));

export default function App() {
  /* ── Auth State ── */
  const [auth, setAuth] = useState(0);
  const [socialProvider, setSocialProvider] = useState(null);

  /* ── Mode & Navigation ── */
  const [mode, setMode] = useState("buyer");
  const [tab, setTab] = useState(0);
  const [vTab, setVTab] = useState(0);
  const [dTab, setDTab] = useState(0);
  const [screen, setScreen] = useState(null);
  const [history, setHistory] = useState([]);

  /* ── Cart & Favorites ── */
  const [cart, setCart] = useState([{ product: P[0], qty: 1 }, { product: P[2], qty: 3 }]);
  const [favs, setFavs] = useState([]);
  const toggleFav = (pid) => setFavs(f => f.includes(pid) ? f.filter(x => x !== pid) : [...f, pid]);
  const isFav = (pid) => favs.includes(pid);

  /* ── Role System ── */
  const [userRole, setUserRole] = useState("client");
  const [vendorPlan, setVendorPlan] = useState("enterprise");
  const [vendorStatus, setVendorStatus] = useState("none");
  const [driverStatus, setDriverStatus] = useState("none");

  /* ── Navigation Helpers ── */
  const push = (type, data) => { setHistory(h => [...h, screen]); setScreen({ type, data }); };
  const pop = () => { const h = [...history]; const prev = h.pop(); setHistory(h); setScreen(prev); };
  const go = (type, data) => push(type, data);
  const goHome = () => { setScreen(null); setTab(0); setVTab(0); setDTab(0); setHistory([]); };
  const addCart = (p, qty) => {
    const ex = cart.findIndex(c => c.product.id === p.id);
    if (ex >= 0) { const n = [...cart]; n[ex].qty += qty; setCart(n); }
    else setCart([...cart, { product: p, qty }]);
    setScreen(null); setHistory([]); setTab(2);
  };
  const switchTo = (m) => { setMode(m); setScreen(null); setHistory([]); setTab(0); setVTab(0); setDTab(0); };
  const onLogout = () => { setAuth(2); setSocialProvider(null); setMode("buyer"); setTab(0); setScreen(null); setHistory([]); setVTab(0); setDTab(0); setUserRole("client"); setVendorStatus("none"); setDriverStatus("none"); setVendorPlan("starter"); };
  const onRoleApproved = (role, plan) => {
    if (role === "vendor") { setUserRole(r => r === "driver" ? "both" : "vendor"); setVendorPlan(plan || "starter"); setVendorStatus("approved"); }
    if (role === "driver") { setUserRole(r => r === "vendor" ? "both" : "driver"); setDriverStatus("approved"); }
  };
  const hasVendor = (userRole === "vendor" || userRole === "both") && vendorStatus === "approved";
  const hasDriver = (userRole === "driver" || userRole === "both") && driverStatus === "approved";

  /* ── Tabs Config ── */
  const showNav = !screen && auth === 5;
  const buyerTabs = [{ icon: "🏠", label: "Accueil" }, { icon: "🔍", label: "Recherche" }, { icon: "🛍️", label: "Panier" }, { icon: "📦", label: "Commandes" }, { icon: "👤", label: "Profil" }];
  const vendorTabs = [{ icon: "📊", label: "Dashboard" }, { icon: "📦", label: "Commandes" }, { icon: "➕", label: "Ajouter" }, { icon: "💬", label: "Messages" }, { icon: "🏪", label: "Commerce" }];
  const driverTabs = [{ icon: "🏠", label: "Accueil" }, { icon: "📦", label: "Livraisons" }, { icon: "💰", label: "Gains" }, { icon: "🔔", label: "Notifs" }, { icon: "👤", label: "Profil" }];
  const tabs = mode === "buyer" ? buyerTabs : mode === "vendor" ? vendorTabs : driverTabs;
  const activeTab = mode === "buyer" ? tab : mode === "vendor" ? vTab : dTab;
  const modeBadge = mode === "vendor" ? { bg: "#6366F1", label: "MODE VENDEUR" } : mode === "driver" ? { bg: "#10B981", label: "MODE LIVREUR" } : null;

  /* ── Render Active Mode ── */
  const renderScreen = () => {
    const sharedProps = { screen, go, pop, goHome, switchTo, setScreen, setHistory };

    if (mode === "driver") return (
      <DriverScreens {...sharedProps} dTab={dTab} setDTab={setDTab} onLogout={onLogout} />
    );

    if (mode === "vendor") return (
      <VendorScreens {...sharedProps} vTab={vTab} setVTab={setVTab}
        vendorPlan={vendorPlan} setVendorPlan={setVendorPlan} onLogout={onLogout} />
    );

    return (
      <BuyerScreens {...sharedProps}
        tab={tab} setTab={setTab} cart={cart} setCart={setCart} addCart={addCart}
        favs={favs} toggleFav={toggleFav} isFav={isFav}
        userRole={userRole} vendorPlan={vendorPlan} vendorStatus={vendorStatus}
        driverStatus={driverStatus} onLogout={onLogout} onRoleApproved={onRoleApproved}
        hasVendor={hasVendor} hasDriver={hasDriver} />
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(160deg,#e0ddd8 0%,#c9c5bf 100%)", padding: 24 }}>
      <style>{CSS}</style>

      {/* iPhone 16 Pro outer wrapper */}
      <div style={{ position: "relative", borderRadius: 61 }}>
        {/* Titanium outer frame */}
        <div style={{ position: "absolute", inset: -2, borderRadius: 61, background: "linear-gradient(180deg,#8a8985 0%,#6b6966 20%,#4a4845 50%,#6b6966 80%,#8a8985 100%)", boxShadow: "0 50px 100px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.08) inset", zIndex: -1 }} />

        {/* Side buttons */}
        <div style={{ position: "absolute", left: -3, top: 130, width: 4, height: 28, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", left: -3, top: 178, width: 4, height: 38, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", left: -3, top: 226, width: 4, height: 38, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", right: -3, top: 195, width: 4, height: 72, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "0 3px 3px 0", boxShadow: "1px 0 2px rgba(0,0,0,.3)" }} />

        <div className="phone">
          {/* ── iPhone 16 Pro Status Bar + Dynamic Island ── */}
          <div style={{ position: "relative", padding: "14px 28px 8px", flexShrink: 0, background: "transparent", zIndex: 20 }}>
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 124, height: 36, background: "#000", borderRadius: 20, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,.15) inset" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#1c1c3a,#0a0a14)", border: "1.5px solid #1a1a2e", marginLeft: 36 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -.3, width: 54, fontVariantNumeric: "tabular-nums" }}>9:41</span>
              <div style={{ width: 124 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 72, justifyContent: "flex-end" }}>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="1" fill="#191815" /><rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill="#191815" /><rect x="9" y="3" width="3" height="9" rx="1" fill="#191815" /><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#191815" /></svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5c-2.7 0-5.15 1.1-6.93 2.87l1.42 1.42A7.65 7.65 0 018 4.5c2.12 0 4.05.86 5.51 2.29l1.42-1.42A9.69 9.69 0 008 2.5z" fill="#191815" opacity=".95" /><path d="M8 6c-1.66 0-3.17.67-4.24 1.76l1.41 1.41A3.98 3.98 0 018 8c1.1 0 2.1.45 2.83 1.17l1.41-1.41A5.97 5.97 0 008 6z" fill="#191815" opacity=".95" /><circle cx="8" cy="11" r="1.2" fill="#191815" /></svg>
                <svg width="28" height="13" viewBox="0 0 28 13" fill="none"><rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#191815" strokeWidth="1" opacity=".35" /><rect x="2" y="2" width="19.5" height="9" rx="2.5" fill="#191815" /><path d="M25 4.5c.8.4 1.3 1.1 1.3 2s-.5 1.6-1.3 2V4.5z" fill="#191815" opacity=".4" /></svg>
              </div>
            </div>
            {auth === 5 && modeBadge && <div style={{ textAlign: "center", marginTop: 4 }}><span style={{ padding: "2px 10px", borderRadius: 8, background: modeBadge.bg, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: .5 }}>{modeBadge.label}</span></div>}
          </div>

          {/* ── Screen Content ── */}
          {auth === 0 ? <SplashScr onDone={() => setAuth(1)} />
            : auth === 1 ? <OnboardingScr onDone={() => setAuth(2)} />
              : auth === 2 ? <LoginScr onDone={() => setAuth(3)} onSocial={(p) => { setSocialProvider(p); setAuth(4); }} />
                : auth === 3 ? <OTPScr onDone={() => setAuth(4)} />
                  : auth === 4 ? <ProfileCompletionScr provider={socialProvider} onDone={() => setAuth(5)} />
                    : <>
                      <Suspense fallback={<LoadingSpinner />}>
                        {renderScreen()}
                      </Suspense>

                      {/* ── Bottom Navigation ── */}
                      {showNav && <div className="bnav">{tabs.map((t, i) => {
                        const isCart = mode === "buyer" && i === 2;
                        const isActive = activeTab === i;
                        if (isCart) return (
                          <button key={i} onClick={() => { setTab(i); setScreen(null); setHistory([]); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", marginTop: -28, position: "relative", zIndex: 10 }}>
                            <div style={{ width: 56, height: 56, borderRadius: 28, background: isActive ? "linear-gradient(135deg,#6366F1,#4F46E5)" : "linear-gradient(135deg,#6366F1,#818CF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: isActive ? "0 6px 20px rgba(99,102,241,.45)" : "0 4px 14px rgba(99,102,241,.3)", border: "4px solid #fff", transition: "all .2s" }}>🛍️</div>
                            <span style={{ fontSize: 9, fontWeight: 600, color: isActive ? "#6366F1" : "#908C82", marginTop: 1 }}>{isActive && t.label}</span>
                          </button>
                        );
                        return (
                          <button key={i} className={`bni ${isActive ? "on" : ""}`} onClick={() => { mode === "buyer" ? setTab(i) : mode === "vendor" ? setVTab(i) : setDTab(i); setScreen(null); setHistory([]); }}>
                            <span className="bico">{t.icon}</span>{isActive && t.label}
                          </button>
                        );
                      })}</div>}
                    </>}

          {/* Home Indicator */}
          <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", paddingBottom: 8, paddingTop: 4, background: "transparent" }}>
            <div style={{ width: 134, height: 5, borderRadius: 100, background: "#191815", opacity: .2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
