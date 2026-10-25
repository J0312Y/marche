import { lazy, Suspense, useEffect, useState } from "react";
import { LayoutDashboard, ShoppingBag, Store, Bike, Users, Truck, Package, Map as MapIcon, Wallet, FolderTree, Ticket, Settings, LogOut, Menu, Loader2, Megaphone, Images, ShieldCheck, MapPinned, FileText } from "lucide-react";
import api, { getToken, setToken, setOnExpired } from "./api";
import { ToastProvider, useLoad } from "./ui";
import Login from "./pages/Login";

const PAGES = {
  dashboard: lazy(() => import("./pages/Dashboard")),
  orders: lazy(() => import("./pages/Orders")),
  stores: lazy(() => import("./pages/Stores")),
  drivers: lazy(() => import("./pages/Drivers")),
  users: lazy(() => import("./pages/Users")),
  deliveries: lazy(() => import("./pages/Deliveries")),
  errands: lazy(() => import("./pages/Errands")),
  map: lazy(() => import("./pages/LiveMap")),
  finance: lazy(() => import("./pages/Finance")),
  categories: lazy(() => import("./pages/Categories")),
  coupons: lazy(() => import("./pages/Coupons")),
  banners: lazy(() => import("./pages/Banners")),
  moderation: lazy(() => import("./pages/Moderation")),
  broadcasts: lazy(() => import("./pages/Broadcasts")),
  settings: lazy(() => import("./pages/Settings")),
  zones: lazy(() => import("./pages/Zones")),
  info: lazy(() => import("./pages/Info")),
  account: lazy(() => import("./pages/Account")),
};

const MENU = [
  ["Pilotage", [["dashboard", "Tableau de bord", LayoutDashboard], ["map", "Carte en direct", MapIcon]]],
  ["Activité", [["orders", "Commandes", ShoppingBag], ["deliveries", "Livraisons", Truck], ["errands", "Coursier", Package]]],
  ["Partenaires", [["stores", "Commerces", Store, "stores"], ["drivers", "Livreurs", Bike, "drivers"], ["users", "Utilisateurs", Users]]],
  ["Contenu", [["banners", "Contenu de l'app", Images], ["broadcasts", "Notifications", Megaphone], ["moderation", "Modération", ShieldCheck], ["categories", "Catégories", FolderTree], ["coupons", "Codes promo", Ticket]]],
  ["Gestion", [["finance", "Finances", Wallet], ["zones", "Zones de livraison", MapPinned], ["info", "Informations", FileText], ["settings", "Paramètres", Settings]]],
];

const readHash = () => { const p = window.location.hash.replace(/^#\/?/, "").split("?")[0]; return PAGES[p] ? p : "dashboard"; };

function Shell({ me, onLogout }) {
  const [page, setPage] = useState(readHash);
  const [menu, setMenu] = useState(false);
  useEffect(() => { const f = () => { setPage(readHash()); setMenu(false); }; window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
  // Pastilles : inscriptions à valider (rafraîchies chaque minute)
  const dash = useLoad(() => api.get("/admin/dashboard"), []);
  useEffect(() => { const t = setInterval(dash.reload, 60000); return () => clearInterval(t); }, [dash.reload]);
  const badges = { stores: dash.data?.establishments?.pending_approval, drivers: dash.data?.drivers?.pending_approval };
  const Page = PAGES[page];
  const go = (p) => { window.location.hash = "/" + p; };
  return (
    <div className={"shell" + (menu ? " menu-open" : "")}>
      <aside className="side">
        <a className="brand" href="#/dashboard"><img src="/favicon.png" alt="" /><span>lamuka<small>Administration</small></span></a>
        <nav>
          {MENU.map(([group, items]) => (
            <div key={group} className="nav-g">
              <p>{group}</p>
              {items.map(([k, l, Ic, b]) => (
                <a key={k} href={`#/${k}`} className={page === k ? "on" : ""}><Ic size={18} /><span>{l}</span>{b && badges[b] > 0 && <em>{badges[b]}</em>}</a>
              ))}
            </div>
          ))}
        </nav>
        <div className="side-foot">
          <span className="av">{(me.first_name || "A")[0]}</span>
          <a href="#/account" className="me-link" title="Mon compte"><b>{[me.first_name, me.last_name].filter(Boolean).join(" ") || "Administrateur"}</b><small>{me.email}</small></a>
          <button className="icon-btn" onClick={onLogout} title="Se déconnecter" aria-label="Se déconnecter"><LogOut size={18} /></button>
        </div>
      </aside>
      <div className="scrim" onClick={() => setMenu(false)} />
      <main className="main">
        <div className="topbar"><button className="icon-btn" onClick={() => setMenu(true)} aria-label="Menu"><Menu size={22} /></button><b>lamuka</b></div>
        <Suspense fallback={<div className="loading-page"><Loader2 className="spin" size={22} /></div>}>
          <Page go={go} onChanged={dash.reload} />
        </Suspense>
      </main>
    </div>
  );
}

export default function App() {
  const [me, setMe] = useState(null);
  const [ready, setReady] = useState(false);
  const logout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    setToken(null); setMe(null);
  };
  useEffect(() => {
    setOnExpired(() => { setToken(null); setMe(null); });
    if (!getToken()) { setReady(true); return; }
    api.get("/admin/account").then((u) => { if (u?.role === "admin") setMe(u); else setToken(null); }).catch(() => setToken(null)).finally(() => setReady(true));
  }, []);
  if (!ready) return <div className="loading-page"><Loader2 className="spin" size={22} /></div>;
  return <ToastProvider>{me ? <Shell me={me} onLogout={logout} /> : <Login onDone={setMe} />}</ToastProvider>;
}
