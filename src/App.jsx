import { useEffect, useRef, useState } from "react";
import { App as CapApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { handleBackInStack } from "./hooks/useBackClose";
import FirstRun from "./components/t/FirstRun";
import { loadZones, getDeliverTo, zoneOf } from "./utils/zone";
import { useAppInfo } from "./config/appInfo";
import CSS from "./styles/global";
import t from "./utils/i18n";
import Icon from "./components/Icon";
import { AppProvider, useApp } from "./context/AppContext";
import { SplashScr } from "./screens/auth";
import ShareSheet from "./components/ShareSheet";
import PushBanner, { triggerPush } from "./components/PushBanner";
import OfflineBanner from "./components/OfflineBanner";
import GuestPrompt from "./components/GuestPrompt";
import { NoNetwork, ServerError } from "./components/ErrorStates";
import ErrorBoundary from "./components/ErrorBoundary";
import { registerGlobalErrors } from "./utils/errorHandler";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import LoginSheet from "./components/t/LoginSheet";
import UpdatePrompt from "./components/t/UpdatePrompt";
import NavIcon from "./components/t/NavIcon";

import BuyerScreens from "./modes/BuyerScreens";
import VendorScreens from "./modes/VendorScreens";
import DriverScreens from "./modes/DriverScreens";

function AppInner() {
  useAppInfo(); // informations du panneau (coordonnées, règles, FAQ) : l'app se redessine quand elles arrivent
  // Register global error handlers (network, offline, uncaught)
  if (typeof window !== "undefined") registerGlobalErrors();

  const {
    authStep, setAuthStep, socialProvider, setSocialProvider, isNewUser, setIsNewUser, pendingPhone, setPendingPhone,
    mode, tab, setTab, vTab, setVTab, dTab, setDTab,
    screen, setScreen, setHistory, go, pop,
    cart, cartCount, hasVendor, hasDriver,
    login, completeProfile, toast, darkMode, setUserName, lang,
    isGuest, continueAsGuest, guestPromptReason, closeGuestPrompt, exitGuestToLogin,
  } = useApp();

  /* ── Étapes : splash=0, ready=5, loading=-1 (la connexion se fait dans LoginSheet, sans quitter l'écran) ── */
  const auth = authStep === 'splash' ? 0
    : authStep === 'ready' ? 5 : authStep === 'loading' ? -1 : 0;

  const showNav = !screen && auth === 5;

  // Premier lancement comme Toters : introduction → notifications → localisation → choisir un lieu.
  // Plus tard : si aucun lieu desservi n'est choisi (invité), on redemande le lieu.
  const [firstRun, setFirstRun] = useState(null); // null (inconnu) | "intro" | "select" | false
  useEffect(() => {
    if (auth !== 5 || mode !== "buyer" || firstRun !== null) return;
    Promise.resolve(loadZones()).finally(() => {
      let seen = false; try { seen = localStorage.getItem("lk-onb-done") === "1"; } catch {}
      const dt = getDeliverTo();
      const valid = dt?.lat != null && zoneOf(Number(dt.lat), Number(dt.lng));
      setFirstRun(!seen ? "intro" : !valid && isGuest ? "select" : false);
    });
  }, [auth, mode, isGuest, firstRun]);

  // Bouton retour Android (comme Toters) : ferme la feuille ouverte, sinon écran précédent, sinon onglet Accueil, sinon quitte
  const nav = useRef({});
  nav.current = { screen, mode, tab, vTab, dTab, pop, setTab, setVTab, setDTab };
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const resume = CapApp.addListener("resume", () => { loadZones(true); });
    const sub = CapApp.addListener("backButton", () => {
      const n = nav.current;
      if (handleBackInStack()) return;
      if (n.screen) { n.pop(); return; }
      if (n.mode === "buyer" && n.tab !== 0) { n.setTab(0); return; }
      if (n.mode === "vendor" && n.vTab !== 0) { n.setVTab(0); return; }
      if (n.mode === "driver" && n.dTab !== 0) { n.setDTab(0); return; }
      CapApp.exitApp();
    });
    return () => { sub.then((s) => s.remove()); resume.then((s) => s.remove()); };
  }, []);
  // Comme Toters : Accueil · Recherche · Coursier · Commandes · Compte (le panier est une barre flottante)
  const buyerTabs = [{ icon: "home", label: "Accueil" }, { icon: "search", label: "Recherche" }, { icon: "bowtie", label: "Coursier" }, { icon: "orders", label: "Commandes" }, { icon: "account", label: "Compte" }];
  const vendorTabs = [{ icon: "home", label: "Accueil" }, { icon: "orders", label: "Commandes" }, { icon: "package", label: "Catalogue" }, { icon: "chat", label: "Messages" }, { icon: "store", label: "Commerce" }];
  const driverTabs = [{ icon: "home", label: "Accueil" }, { icon: "orders", label: "Livraisons" }, { icon: "wallet", label: "Gains" }, { icon: "bell", label: "Notifications" }, { icon: "account", label: "Profil" }];
  const tabs = mode === "buyer" ? buyerTabs : mode === "vendor" ? vendorTabs : driverTabs;
  const activeTab = mode === "buyer" ? tab : mode === "vendor" ? vTab : dTab;

  const renderScreen = () => {
    if (mode === "driver") return <DriverScreens />;
    if (mode === "vendor") return <VendorScreens />;
    return <BuyerScreens />;
  };

  return (
    <div className="app-root" style={{ background: darkMode ? "#000" : "linear-gradient(160deg,#e0ddd8 0%,#c9c5bf 100%)" }}>
      <style>{CSS}</style>

      <div className="phone-frame" style={{ position: "relative", borderRadius: 51 }}>
        <div className="phone-frame-bg" style={{ position: "absolute", inset: -2, borderRadius: 51, background: "linear-gradient(180deg,#8a8985 0%,#6b6966 20%,#4a4845 50%,#6b6966 80%,#8a8985 100%)", boxShadow: "0 50px 100px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.08) inset", zIndex: -1 }} />
        <div className="phone-frame-btn" style={{ position: "absolute", left: -3, top: 130, width: 4, height: 28, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
        <div className="phone-frame-btn" style={{ position: "absolute", left: -3, top: 178, width: 4, height: 38, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
        <div className="phone-frame-btn" style={{ position: "absolute", left: -3, top: 226, width: 4, height: 38, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,.3)" }} />
        <div className="phone-frame-btn" style={{ position: "absolute", right: -3, top: 195, width: 4, height: 72, background: "linear-gradient(180deg,#7a7874,#5a5855,#7a7874)", borderRadius: "0 3px 3px 0", boxShadow: "1px 0 2px rgba(0,0,0,.3)" }} />

        <div className={`phone${darkMode?" dark":""}${mode === "buyer" && auth === 5 && (screen?.type === "vendor" || (screen?.type === "detail" && (screen.data?.establishmentId || screen.data?.establishment_id))) ? " bleed" : ""}`}>
          {/* Banners and overlays — INSIDE phone, position absolute relative to .phone */}
          <OfflineBanner/>
          {/* Barre d'état simulée (maquette sur ordinateur uniquement — masquée sur un vrai téléphone) */}
          <div className="mock-statusbar" style={{ position: "relative", padding: "10px 22px 4px", flexShrink: 0, background: "transparent", zIndex: 20 }}>
            <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 124, height: 36, background: "#000", borderRadius: 20, zIndex: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 3px rgba(0,0,0,.15) inset" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#1c1c3a,#0a0a14)", border: "1.5px solid #1a1a2e", marginLeft: 36 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -.3, width: 54, fontVariantNumeric: "tabular-nums", color: darkMode ? "#fff" : "#191815" }}>9:41</span>
              <div style={{ width: 124 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 72, justifyContent: "flex-end" }}>
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="1" fill={darkMode?"#fff":"#191815"}/><rect x="4.5" y="5.5" width="3" height="6.5" rx="1" fill={darkMode?"#fff":"#191815"}/><rect x="9" y="3" width="3" height="9" rx="1" fill={darkMode?"#fff":"#191815"}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={darkMode?"#fff":"#191815"}/></svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5c-2.7 0-5.15 1.1-6.93 2.87l1.42 1.42A7.65 7.65 0 018 4.5c2.12 0 4.05.86 5.51 2.29l1.42-1.42A9.69 9.69 0 008 2.5z" fill={darkMode?"#fff":"#191815"} opacity=".95"/><path d="M8 6c-1.66 0-3.17.67-4.24 1.76l1.41 1.41A3.98 3.98 0 018 8c1.1 0 2.1.45 2.83 1.17l1.41-1.41A5.97 5.97 0 008 6z" fill={darkMode?"#fff":"#191815"} opacity=".95"/><circle cx="8" cy="11" r="1.2" fill={darkMode?"#fff":"#191815"}/></svg>
                <svg width="28" height="13" viewBox="0 0 28 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke={darkMode?"#fff":"#191815"} strokeWidth="1" opacity=".35"/><rect x="2" y="2" width="19.5" height="9" rx="2.5" fill={darkMode?"#fff":"#191815"}/><path d="M25 4.5c.8.4 1.3 1.1 1.3 2s-.5 1.6-1.3 2V4.5z" fill={darkMode?"#fff":"#191815"} opacity=".4"/></svg>
              </div>
            </div>
          </div>

          {/* Screen Content */}
          {auth === -1 ? <LoadingSpinner />
            : auth === 0 ? <SplashScr onDone={() => { continueAsGuest(); setAuthStep('ready'); }} />
            : <>
              {renderScreen()}

              {showNav && <nav className="t-nav">{tabs.map((t, i) => (
                <button key={i} className={activeTab === i ? "on" : ""} onClick={() => { mode === "driver" ? setDTab(i) : mode === "vendor" ? setVTab(i) : setTab(i); setScreen(null); setHistory([]); }}>
                  {["home", "search", "bowtie", "orders", "account"].includes(t.icon) ? <NavIcon name={t.icon} active={activeTab === i} /> : <Icon name={t.icon} size={24} strokeWidth={1.8} color={activeTab === i ? "var(--acc)" : "var(--t-sub)"} />}
                  {t.label}
                </button>
              ))}</nav>}
            </>}

          {auth === 5 && mode === "buyer" && firstRun && <FirstRun skipIntro={firstRun === "select"} onDone={() => setFirstRun(false)} />}

          {/* Toast */}
          <LoginSheet/>
          {auth === 5 && !firstRun && <UpdatePrompt/>}
          <PushBanner/>
          <ShareSheet/>
          {toast && <div style={{ position: "absolute", bottom: 80, left: 16, right: 16, padding: "14px 18px", borderRadius: 16, background: toast.type === 'error' ? '#EF4444' : toast.type === 'info' ? '#F97316' : '#10B981', color: "#fff", fontSize: 13, fontWeight: 600, textAlign: "center", zIndex: 999, boxShadow: "0 8px 30px rgba(0,0,0,.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, animation: "toastIn .35s cubic-bezier(.4,0,.2,1)" }}><Icon name={toast.type === 'error' ? 'x_circle' : toast.type === 'info' ? 'info' : 'check_circle'} size={18} color="#fff"/>{toast.message}</div>}

          {/* Indicateur d'accueil simulé (maquette sur ordinateur uniquement) */}
          <div className="mock-homebar" style={{ flexShrink: 0, display: "flex", justifyContent: "center", paddingBottom: 4, paddingTop: 2, background: "transparent" }}>
            <div style={{ width: 134, height: 5, borderRadius: 100, background: darkMode ? "#fff" : "#191815", opacity: .2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <AppInner />
      </ErrorBoundary>
    </AppProvider>
  );
}
