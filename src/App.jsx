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
    <>
      <style>{CSS}</style>

      <div className="phone">
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
      </div>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
