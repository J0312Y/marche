import { useState, lazy, Suspense } from "react";
import CSS from "./styles/global";
import { AppProvider, useApp } from "./context/AppContext";
import { SplashScr, OnboardingScr, LoginScr, OTPScr, ProfileCompletionScr } from "./screens/auth";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const BuyerScreens = lazy(() => import("./modes/BuyerScreens"));
const VendorScreens = lazy(() => import("./modes/VendorScreens"));
const DriverScreens = lazy(() => import("./modes/DriverScreens"));

function AppInner() {
  const {
    authStep, setAuthStep, socialProvider, setSocialProvider,
    mode, tab, setTab, vTab, setVTab, dTab, setDTab,
    screen, setScreen, setHistory, go,
    cart, cartCount, hasVendor, hasDriver,
    login, completeProfile, toast,
  } = useApp();

  /* ── Auth step mapping: splash=0, onboarding=1, login=2, otp=3, profile=4, ready=5 ── */
  const auth = authStep === 'splash' ? 0 : authStep === 'onboarding' ? 1 : authStep === 'login' ? 2
    : authStep === 'otp' ? 3 : authStep === 'profile' ? 4 : authStep === 'ready' ? 5 : authStep === 'loading' ? -1 : 0;

  const showNav = !screen && auth === 5;
  const buyerTabs = [{ icon: "🏠", label: "Accueil" }, { icon: "🔍", label: "Recherche" }, { icon: "🛍️", label: "Panier" }, { icon: "📦", label: "Commandes" }, { icon: "👤", label: "Profil" }];
  const vendorTabs = [{ icon: "📊", label: "Dashboard" }, { icon: "📦", label: "Commandes" }, { icon: "➕", label: "Ajouter" }, { icon: "💬", label: "Messages" }, { icon: "🏪", label: "Commerce" }];
  const driverTabs = [{ icon: "🏠", label: "Accueil" }, { icon: "📦", label: "Livraisons" }, { icon: "💰", label: "Gains" }, { icon: "🔔", label: "Notifs" }, { icon: "👤", label: "Profil" }];
  const tabs = mode === "buyer" ? buyerTabs : mode === "vendor" ? vendorTabs : driverTabs;
  const activeTab = mode === "buyer" ? tab : mode === "vendor" ? vTab : dTab;
  const modeBadge = mode === "vendor" ? { bg: "#6366F1", label: "MODE VENDEUR" } : mode === "driver" ? { bg: "#10B981", label: "MODE LIVREUR" } : null;

  const renderScreen = () => {
    if (mode === "driver") return <DriverScreens />;
    if (mode === "vendor") return <VendorScreens />;
    return <BuyerScreens />;
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "linear-gradient(160deg,#e0ddd8 0%,#c9c5bf 100%)", padding: 24 }}>
      <style>{CSS}</style>

      <div style={{ position: "relative", borderRadius: 61 }}>
        <div style={{ position: "absolute", inset: -2, borderRadius: 61, background: "linear-gradient(180deg,#8a8985 0%,#6b6966 20%,#4a4845 50%,#6b6966 80%,#8a8985 100%)", boxShadow: "0 50px 100px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.08) inset", zIndex: -1 }} />
        <div style={{ position: "absolute", left: -3, top: 130, width: 4, height: 28, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", left: -3, top: 178, width: 4, height: 38, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", left: -3, top: 226, width: 4, height: 38, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", right: -3, top: 195, width: 4, height: 72, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "0 3px 3px 0", boxShadow: "1px 0 2px rgba(0,0,0,.3)" }} />

        <div className="phone">
          {/* Status Bar + Dynamic Island */}
          <div style={{ position: "relative", padding: "14px 28px 8px", flexShrink: 0, background: "transparent", zIndex: 20 }}>
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 124, height: 36, background: "#000", borderRadius: 20, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,.15) inset" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#1c1c3a,#0a0a14)", border: "1.5px solid #1a1a2e", marginLeft: 36 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -.3, width: 54, fontVariantNumeric: "tabular-nums" }}>9:41</span>
              <div style={{ width: 124 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 72, justifyContent: "flex-end" }}>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="1" fill="#191815"/><rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill="#191815"/><rect x="9" y="3" width="3" height="9" rx="1" fill="#191815"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#191815"/></svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5c-2.7 0-5.15 1.1-6.93 2.87l1.42 1.42A7.65 7.65 0 018 4.5c2.12 0 4.05.86 5.51 2.29l1.42-1.42A9.69 9.69 0 008 2.5z" fill="#191815" opacity=".95"/><path d="M8 6c-1.66 0-3.17.67-4.24 1.76l1.41 1.41A3.98 3.98 0 018 8c1.1 0 2.1.45 2.83 1.17l1.41-1.41A5.97 5.97 0 008 6z" fill="#191815" opacity=".95"/><circle cx="8" cy="11" r="1.2" fill="#191815"/></svg>
                <svg width="28" height="13" viewBox="0 0 28 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="#191815" strokeWidth="1" opacity=".35"/><rect x="2" y="2" width="19.5" height="9" rx="2.5" fill="#191815"/><path d="M25 4.5c.8.4 1.3 1.1 1.3 2s-.5 1.6-1.3 2V4.5z" fill="#191815" opacity=".4"/></svg>
              </div>
            </div>
            {auth === 5 && modeBadge && <div style={{ textAlign: "center", marginTop: 4 }}><span style={{ padding: "2px 10px", borderRadius: 8, background: modeBadge.bg, color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: .5 }}>{modeBadge.label}</span></div>}
          </div>

          {/* Screen Content */}
          {auth === -1 ? <LoadingSpinner />
            : auth === 0 ? <SplashScr onDone={() => setAuthStep('onboarding')} />
            : auth === 1 ? <OnboardingScr onDone={() => setAuthStep('login')} />
            : auth === 2 ? <LoginScr onDone={() => setAuthStep('otp')} onSocial={(p) => { setSocialProvider(p); setAuthStep('otp'); }} />
            : auth === 3 ? <OTPScr onDone={() => setAuthStep('profile')} />
            : auth === 4 ? <ProfileCompletionScr provider={socialProvider} onDone={() => setAuthStep('ready')} />
            : <>
              <Suspense fallback={<LoadingSpinner />}>{renderScreen()}</Suspense>

              {showNav && <div className="bnav">{tabs.map((t, i) => {
                const isCart = mode === "buyer" && i === 2;
                const isActive = activeTab === i;
                if (isCart) return (
                  <button key={i} onClick={() => { setTab(i); setScreen(null); setHistory([]); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit", marginTop: -28, position: "relative", zIndex: 10 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 28, background: isActive ? "linear-gradient(135deg,#6366F1,#4F46E5)" : "linear-gradient(135deg,#6366F1,#818CF8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: isActive ? "0 6px 20px rgba(99,102,241,.45)" : "0 4px 14px rgba(99,102,241,.3)", border: "4px solid #fff", transition: "all .2s", position: "relative" }}>
                      🛍️
                      {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#EF4444", color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: 10, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>{cartCount}</span>}
                    </div>
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

          {/* Toast */}
          {toast && <div style={{ position: "absolute", bottom: 80, left: 20, right: 20, padding: "12px 16px", borderRadius: 12, background: toast.type === 'error' ? '#EF4444' : '#10B981', color: "#fff", fontSize: 13, fontWeight: 600, textAlign: "center", zIndex: 999, boxShadow: "0 4px 12px rgba(0,0,0,.15)", animation: "fadeIn .2s" }}>{toast.message}</div>}

          {/* Home Indicator */}
          <div style={{ flexShrink: 0, display: "flex", justifyContent: "center", paddingBottom: 8, paddingTop: 4, background: "transparent" }}>
            <div style={{ width: 134, height: 5, borderRadius: 100, background: "#191815", opacity: .2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
