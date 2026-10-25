import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../components/Icon";
import Img from "../../components/Img";
import StoreCard, { StoreCardSmall } from "../../components/t/StoreCard";
import ProductCard from "../../components/t/ProductCard";
import { useData } from "../../hooks";
import { useApp } from "../../context/AppContext";
import useFollowed from "../../hooks/useFollowed";
import HeaderCart from "../../components/t/HeaderCart";
import Sheet from "../../components/t/Sheet";
import { art3d, catArt } from "../../config/art3d";
import DeliverTo from "../../components/t/DeliverTo";
import { getDeliverTo, setDeliverTo, loadZones, zoneOf } from "../../utils/zone";
import VERTICALS, { FILTERS, applyFilter, sortStores } from "../../config/verticals";
import { buyer as buyerSvc, order as orderSvc, user as userSvc } from "../../services";
import { fmt } from "../../utils/helpers";
import api from "../../api/client";

const ACTIVE = ["pending", "confirmed", "preparing", "ready", "assigned", "picked_up", "delivering"];

/**
 * Accueil « Toters » : adresse, recherche, univers, fidélité, promos, catégories, nouveautés, tendances, boutiques.
 */
// Loupe violette de l'état « aucun résultat » (comme Toters)
const NoMatchArt = () => (
  <svg width="150" height="130" viewBox="0 0 150 130" fill="none">
    <ellipse cx="62" cy="96" rx="44" ry="16" fill="#EDE7FB" /><circle cx="118" cy="24" r="4" fill="#8B6CF0" /><circle cx="32" cy="22" r="3" fill="#8B6CF0" />
    <circle cx="66" cy="56" r="34" fill="#7C5CE6" /><circle cx="66" cy="56" r="22" fill="#F4F1FD" />
    <path d="M90 82l24 24" stroke="#7C5CE6" strokeWidth="14" strokeLinecap="round" /><path d="M104 96l12 12" stroke="#F5A524" strokeWidth="14" strokeLinecap="round" />
  </svg>
);

function HomeScr({ go }) {
  const { VENDORS, P, CATS, loading } = useData();
  const { user, isGuest, requireLogin, setTab, cart, cartCount, unreadCount, vendorStatus } = useApp();
  const { isFollowed, toggle } = useFollowed();
  const [vert, setVert] = useState("all");
  const [filter, setFilter] = useState(null);
  const [sub, setSub] = useState(null);
  const [addrSheet, setAddrSheet] = useState(false);
  const [deliverTo, setDeliverToState] = useState(getDeliverTo);
  const [zonesTick, setZonesTick] = useState(0);
  useEffect(() => {
    loadZones();
    const f = () => setDeliverToState(getDeliverTo());
    const z = () => setZonesTick((n) => n + 1);
    window.addEventListener("lk-deliver-to", f); window.addEventListener("lk-zones", z);
    return () => { window.removeEventListener("lk-deliver-to", f); window.removeEventListener("lk-zones", z); };
  }, []);
  // Comme Toters : un lieu hors des zones livrées n'est jamais affiché ; l'accueil reste normal avec la ville par défaut
  const shownPlace = zonesTick >= 0 && deliverTo?.lat != null && zoneOf(Number(deliverTo.lat), Number(deliverTo.lng)) ? deliverTo.quarter : null;
 // sous-catégorie (cercles sous les univers)
  // En-tête comme Toters, sans tremblement :
  //  • l'adresse défile avec la page et la recherche s'accroche en haut (position: sticky, géré par le téléphone) ;
  //  • en remontant, l'adresse redescend par glissement (transform), sans recalcul de mise en page ;
  //  • noms des univers, filtres et « Retour en haut » apparaissent en fondu (classes CSS).
  const rootRef = useRef(null), hdRef = useRef(null), mvRef = useRef(null), locRef = useRef(null), srchRef = useRef(null), labRef = useRef(null), labScrRef = useRef(null), chipLayRef = useRef(null), totopRef = useRef(null), vertsScrRef = useRef(null);
  const [spacer, setSpacer] = useState(117);
  const reveal = useRef(0);
  const lastHide = useRef(0);   // 0 = adresse cachée, L = adresse visible au-dessus de la recherche
  const raf = useRef(0);
  const topTimer = useRef(null);
  const lastY = useRef(0);
  const chipsRef = useRef(null);
  const [hint, setHint] = useState(0);
  const [points, setPoints] = useState(null);
  const [active, setActive] = useState([]);
  const [lastStore, setLastStore] = useState(null);
  const [addr, setAddr] = useState("Brazzaville");
  const [slide, setSlide] = useState(0);
  // Contenu de l'accueil géré dans le panneau ; dernière version gardée sur le téléphone (hors connexion)
  const [remoteBanners, setRemoteBanners] = useState(() => { try { return JSON.parse(localStorage.getItem("lk-banners") || "null"); } catch { return null; } });
  useEffect(() => { api.get("/banners").then((r) => { if (Array.isArray(r)) { setRemoteBanners(r); try { localStorage.setItem("lk-banners", JSON.stringify(r)); } catch {} } }).catch(() => {}); }, []);
  const scrRef = useRef(null);
  const vertRef = useRef(null);

  const stores = useMemo(() => VENDORS.filter((v) => v.status === undefined || v.status === "active"), [VENDORS]);
  const hints = useMemo(() => {
    const names = [...new Set(P.slice().sort((a, b) => (b.sold || 0) - (a.sold || 0)).map((p) => p.name.split(" ").slice(0, 2).join(" ")))].slice(0, 6);
    return names.length ? names : ["Poulet", "Pain", "Pizza"];
  }, [P]);

  useEffect(() => { const t = setInterval(() => setHint((h) => h + 1), 2500); return () => clearInterval(t); }, []);
  // Carrousel des bannières : défile seul vers la gauche (comme Toters), pause pendant que le doigt est dessus
  const bannerRef = useRef(null);
  const holdRef = useRef(0);
  const idxRef = useRef(0); // bannière affichée
  // Après un glissement du doigt : on se recale sur la bannière visible
  const syncBanner = () => {
    const el = bannerRef.current; if (!el) return;
    const cards = [...el.children]; if (!cards.length) return;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    idxRef.current = atEnd ? cards.length - 1 : cards.reduce((b, c, k) => (Math.abs(c.offsetLeft - cards[0].offsetLeft - el.scrollLeft) < Math.abs(cards[b].offsetLeft - cards[0].offsetLeft - el.scrollLeft) ? k : b), 0);
  };
  useEffect(() => {
    const t = setInterval(() => {
      const el = bannerRef.current;
      if (!el || Date.now() - holdRef.current < 5000 || !el.offsetParent) return;
      const cards = [...el.children];
      if (cards.length < 2) return;
      const next = (idxRef.current + 1) % cards.length;
      idxRef.current = next;
      el.scrollTo({ left: next === cards.length - 1 ? el.scrollWidth : cards[next].offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
      setSlide(next);
    }, 4000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!user) { setPoints(null); setActive([]); setLastStore(null); setAddr("Brazzaville"); return; }
    buyerSvc.getLoyalty().then((r) => setPoints(r?.points ?? 0)).catch(() => {});
    orderSvc.getAll().then((r) => {
      const list = Array.isArray(r) ? r : r?.orders || [];
      setActive(list.filter((o) => ACTIVE.includes(o.status)));
      const last = list.find((o) => o.status === "delivered");
      if (last) setLastStore(Number(last.establishment_id));
    }).catch(() => {});
    userSvc.getAddresses().then((r) => {
      const list = Array.isArray(r) ? r : r?.addresses || [];
      const d = list.find((a) => a.is_default === "1" || a.is_default === 1 || a.is_default === true) || list[0];
      if (d && d.latitude && zoneOf(Number(d.latitude), Number(d.longitude))) { setAddr(d.quarter || d.label || "Brazzaville"); if (!getDeliverTo()) setDeliverTo({ lat: Number(d.latitude), lng: Number(d.longitude), quarter: d.quarter, label: d.label, addressId: d.id }); }
    }).catch(() => {});
  }, [user]);

  // Mesures de l'en-tête (adresse L, recherche S) → place réservée dans la page
  useEffect(() => {
    const L = locRef.current?.offsetHeight || 61, S = srchRef.current?.offsetHeight || 56;
    setSpacer(L + S);
  }, []);
  // En-tête « collapsing » comme Toters, piloté par la position de défilement (transformations seulement) :
  //  1. les images des univers passent sous la recherche, leurs noms restent accrochés ;
  //  2. la bande des noms glisse à son tour sous la recherche ;
  //  3. le texte de la recherche défile vers « Boutique ou article… » ;
  //  4. l'adresse remonte et la recherche prend sa place ; en remontant, l'adresse redescend.
  const paint = () => {
    raf.current = 0;
    const sc = scrRef.current, hd = hdRef.current, root = rootRef.current, lab = labRef.current, chip = chipLayRef.current;
    if (!sc || !hd || !root || !lab || !chip) return;
    const y = Math.max(0, sc.scrollTop), dy = y - lastY.current; lastY.current = y;
    const L = locRef.current.offsetHeight, S = srchRef.current.offsetHeight, H = L + S;
    const vEl = vertRef.current;
    const V = vEl ? vEl.offsetHeight : 120, Lb = 34;
    const vTop = vEl ? vEl.offsetTop : H;
    const Y1 = vTop + V - Lb - H;            // les noms des univers atteignent le bas de la recherche
    const Y2 = Y1 + Lb;                      // la bande des noms a fini de glisser sous la recherche
    const P4 = Y2 + 24;                      // l'adresse commence à remonter
    // 4. adresse
    let hide;
    if (y <= P4) { hide = 0; reveal.current = 0; }
    else if (y <= P4 + L && lastHide.current < L) hide = Math.min(L, y - P4);
    else { reveal.current = Math.max(0, Math.min(L, reveal.current - dy)); hide = L - reveal.current; }
    if (y > P4 + L && dy > 0 && reveal.current === 0) hide = L;
    lastHide.current = hide;
    // l'adresse et la cloche restent en place : la recherche monte et les recouvre
    mvRef.current.style.transform = `translate3d(0,${-hide}px,0)`;
    // 1-2. bande des noms : accrochée sous la recherche puis glissée dessous
    if (y >= Y1 && y < Y2 + 1 && hide === 0) {
      lab.style.visibility = "visible";
      lab.style.transform = `translate3d(0,${-(y - Y1)}px,0)`;
      if (labScrRef.current && vertsScrRef.current) labScrRef.current.scrollLeft = vertsScrRef.current.scrollLeft;
    } else lab.style.visibility = "hidden";
    // 3. texte de la recherche
    root.classList.toggle("hd-far", y > Y2);
    root.classList.toggle("hd-sh", y > 2);
    root.classList.toggle("hd-stuck", hide >= L - 1);
    // filtres : relayés pile à l'endroit où ils arrivent (aucun fondu, aucun saut)
    const cr = chipsRef.current;
    const bottom = H - hide;
    chip.style.visibility = cr && y >= cr.offsetTop - bottom ? "visible" : "hidden";
    // « Retour en haut » en remontant
    const tp = totopRef.current;
    if (tp) {
      tp.style.transform = `translate3d(-50%,${bottom + (chip.style.visibility === "visible" ? 56 : 0) + 10}px,0)`;
      if (dy < -4 && y > 600) {
        tp.classList.add("on"); clearTimeout(topTimer.current);
        topTimer.current = setTimeout(() => tp.classList.remove("on"), 2500);
      } else if (y < 350 || dy > 8) tp.classList.remove("on");
    }
  };
  const onScroll = () => { if (!raf.current) raf.current = requestAnimationFrame(paint); };
  const toTop = () => { scrRef.current?.scrollTo({ top: 0, behavior: "smooth" }); totopRef.current?.classList.remove("on"); };


  const openStore = (v) => go("vendor", v);
  const openProduct = (p) => go("detail", p);
  const cartQty = (id) => cart.filter((c) => Number(c.article_id) === Number(id)).reduce((s, c) => s + (parseInt(c.quantity, 10) || 1), 0);
  const pickVert = (id) => {
    if (id === "coursier") { setTab(2); return; }
    setVert(id); setFilter(null); setSub(null);
    scrRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inVert = vert === "all" ? stores : stores.filter((v) => v.type === vert);
  // Sous-catégories de l'univers : catégories d'articles vendues par ses boutiques
  const subcats = useMemo(() => {
    if (vert === "all") return [];
    const ids = new Set(inVert.map((v) => Number(v.id)));
    const used = new Set(P.filter((p) => ids.has(Number(p.establishmentId))).map((p) => Number(p.category_id)));
    return CATS.filter((c) => used.has(Number(c.id)));
  }, [vert, inVert, P, CATS]); // eslint-disable-line react-hooks/exhaustive-deps
  // Sur « Tout », un cercle de catégorie filtre les boutiques (comme Toters : Burgers, Pizza…)
  // Catégories qui ont au moins un article (comme Toters, pas de cercle vide)
  const usedCats = useMemo(() => {
    const u = new Set(P.map((p) => Number(p.category_id)));
    // Comme Toters : les cuisines d'abord (Burgers, Pizza…), puis le reste, les plus fournies en premier
    const n = (c) => P.filter((p) => Number(p.category_id) === Number(c.id)).length;
    const rank = (c) => (c.commerce_type === "restaurant" ? 0 : c.commerce_type === "patisserie" ? 1 : 2);
    return CATS.filter((c) => u.has(Number(c.id)) && c.name !== "Restaurants").sort((a, b) => rank(a) - rank(b) || n(b) - n(a));
  }, [P, CATS]);
  const subRow = vert === "all" ? (sub ? usedCats : []) : subcats;
  const bySub = sub ? inVert.filter((v) => P.some((p) => Number(p.establishmentId) === Number(v.id) && Number(p.category_id) === Number(sub))) : inVert;
  const list = sortStores(applyFilter(bySub, filter));
  const showSections = vert === "all" && !filter && !sub;
  const narrowed = !!(filter || sub);
  const resetAll = () => { setFilter(null); setSub(null); };
  const fresh = [...stores].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))).slice(0, 6);
  const trending = P.filter((p) => p.photo).sort((a, b) => (b.sold || 0) - (a.sold || 0) || (b.rating || 0) - (a.rating || 0)).slice(0, 12);
  const openIds = new Set(stores.map((v) => Number(v.id)));
  const live = P.filter((p) => p.photo && openIds.has(Number(p.establishmentId)) && !(p.stock !== null && p.stock !== undefined && p.stock >= 0 && p.stock <= 0));
  const offPct = (p) => (p.old > p.price ? Math.round((1 - p.price / p.old) * 100) : 0);
  const deals = live.filter((p) => offPct(p) > 0).sort((a, b) => offPct(b) - offPct(a)).slice(0, 12);
  const grocery = live.filter((p) => offPct(p) > 0 && ["supermarche", "pharmacie"].includes(p.type || stores.find((v) => Number(v.id) === Number(p.establishmentId))?.type)).slice(0, 12);
  const maxDeal = deals.length ? offPct(deals[0]) : 0;
  const rails = [
    deals.length > 2 && { key: "deals", title: `Jusqu'à −${maxDeal} %`, subtitle: "Les plus belles réductions du moment.", list: deals },
    grocery.length > 2 && { key: "grocery", title: "Courses à petit prix", subtitle: "Épicerie et pharmacie en promo.", list: grocery },
    trending.length > 2 && { key: "trending", title: "Tendances du moment", subtitle: "Les articles les plus commandés en ce moment.", list: trending },
  ].filter(Boolean);
  const catImg = (type) => CATS.find((c) => c.commerce_type === type && c.photo)?.photo;

  // Annonces gérées dans le panneau d'administration (API /banners) ; celles-ci ne servent que hors connexion
  const bannerAction = (type, value) => () => {
    if (type === "filter") setFilter(value);
    else if (type === "store") openStore(stores.find((x) => Number(x.id) === Number(value)) || { id: Number(value) }); // l'écran du commerce se charge seul
    else if (type === "category") { setSub(Number(value)); setFilter(null); scrRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }
    else if (type === "vertical") pickVert(value);
    else if (type === "url") window.open(value, "_blank", "noopener");
    else if (type === "screen") {
      if (value === "coursier") setTab(2);
      else if (value === "promos") go("promos");
      else if (value === "loyalty") isGuest ? requireLogin("login") : go("loyalty");
      else if (value === "vendorReg" || value === "driverReg") requireLogin("login", () => go(value));
      else if (value === "reorder") { const v = lastStore && stores.find((x) => Number(x.id) === lastStore); if (v) openStore(v); else if (isGuest) requireLogin("orders"); else setTab(3); }
    }
  };
  const visibleTo = (aud) => aud === "guests" ? isGuest : aud === "users" ? !isGuest : aud === "non_vendors" ? vendorStatus !== "approved" : true;
  const remote = (place) => remoteBanners && remoteBanners.filter((b) => (b.placement || "carousel") === place);
  // Tuiles (gérées dans le panneau, « Contenu de l'app »)
  const tiles = (remote("tile") || []).filter((b) => visibleTo(b.audience)).map((b) => ({
    k: b.id, t1: b.title, t2: b.subtitle, bg: b.color_from, hl: b.color_to, badge: b.tag,
    img: b.image?.startsWith("art:") ? art3d(b.image.slice(4)) : b.image,
    on: () => { if (/^\d+$/.test(String(b.id))) api.post(`/banners/${b.id}/click`).catch(() => {}); bannerAction(b.action_type, b.action_value)(); },
  }));
  const banners = (remote("carousel") || []).filter((b) => visibleTo(b.audience)).map((b) => ({
    k: b.id, style: b.style, c1: b.color_from, bg: `linear-gradient(120deg,${b.color_from},${b.color_to})`, t: b.title, s: b.subtitle, tag: b.tag,
    img: b.image?.startsWith("art:") ? art3d(b.image.slice(4)) : b.image,
    on: () => { if (/^\d+$/.test(String(b.id))) api.post(`/banners/${b.id}/click`).catch(() => {}); bannerAction(b.action_type, b.action_value)(); },
  }));

  const Search = () => (
    <div className="t-search" onClick={() => go("search")} role="button">
      <Icon name="search" size={18} color="var(--t-text)" strokeWidth={2.2} />
      <span className="ph"><i className="a">Rechercher « {hints[hint % hints.length]} »</i><i className="b">Boutique ou article…</i></span>
    </div>
  );
  const Chips = () => (
    <div className="t-chips">
      {FILTERS.map((f) => (
        <button key={f.id} className={"t-chip" + (filter === f.id ? " on" : "")} onClick={() => { setFilter(filter === f.id ? null : f.id); scrRef.current?.scrollTo({ top: (vertRef.current?.offsetTop || 0) + (vertRef.current?.offsetHeight || 0), behavior: "smooth" }); }}>
          {f.icon && <Icon name={f.icon} size={16} color={filter === f.id ? "var(--acc-d)" : "var(--acc)"} />}{f.label}
        </button>
      ))}
    </div>
  );

  const CartBtn = HeaderCart;

  const LocRow = () => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 16px 12px" }}>
        <button className="t-addr" onClick={() => setAddrSheet(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24"><path fill="var(--acc)" d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.3 6.2 11.5 6.8 12a1 1 0 0 0 1.4 0c.6-.5 6.8-6.7 6.8-12A7.5 7.5 0 0 0 12 2zm0 10.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z"/></svg>
          <b>{shownPlace || addr}</b>
          <Icon name="caret_down" size={16} />
        </button>
        <div style={{ flex: 1 }} />
        <button className="t-round-btn" style={{ background: "none", position: "relative" }} onClick={() => requireLogin("login", () => go("notif"))} aria-label="Notifications">
          <Icon name="bell" size={24} strokeWidth={1.8} />
          {unreadCount > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 10, height: 10, borderRadius: 5, background: "var(--acc)", border: "2px solid var(--card)" }} />}
        </button>
        <CartBtn />
      </div>
  );

  return (
    <div ref={rootRef} className="hd-root" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, position: "relative", overflow: "hidden" }}>
      {/* Adresse qui redescend en remontant (glissement seulement) */}
      <div className="hd2" ref={hdRef}>
        <div ref={locRef} className="hd2-loc"><LocRow /></div>
        <div className="hd2-mv" ref={mvRef}>
        <div ref={srchRef} className="t-pad hd2-srch"><div style={{ flex: 1, minWidth: 0 }}><Search /></div><span className="cartslot"><CartBtn /></span></div>
        <div className="hd2-lay" ref={labRef}><div className="t-verts hd2-labels" ref={labScrRef}>{VERTICALS.map((v) => (
          <button key={v.id} className={"t-vert" + (vert === v.id ? " on" : "")} onClick={() => pickVert(v.id)}><span>{v.label}</span></button>
        ))}</div></div>
        <div className="hd2-lay" ref={chipLayRef}><Chips /></div>
        </div>
      </div>
      <button className="t-totop" ref={totopRef} onClick={toTop}><Icon name="arrow_up" size={16} color="#fff" strokeWidth={2.4} />Retour en haut</button>
    <div className="t-scr" ref={scrRef} onScroll={onScroll}>
      {/* place de l'en-tête (adresse + recherche), dessiné au-dessus */}
      <div style={{ height: spacer, flexShrink: 0 }} />

      {/* Univers */}
      <div ref={vertRef} style={{ paddingTop: 3, borderBottom: "1px solid var(--t-line)" }}>
        <div className="t-verts" ref={vertsScrRef}>
          {VERTICALS.map((v) => (
            <button key={v.id} className={"t-vert" + (vert === v.id ? " on" : "")} onClick={() => pickVert(v.id)}>
              <div className="tile">{art3d(v.id) ? <img src={art3d(v.id)} alt="" /> : <Img src={catImg(v.id) || v.img} alt="" style={{ width: "100%", height: "100%" }} />}</div>
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {subRow.length > 1 && <div className="t-subcats">
        {subRow.map((c) => (
          <button key={c.id} className={Number(sub) === Number(c.id) ? "on" : ""} onClick={() => setSub(Number(sub) === Number(c.id) ? null : c.id)}>
            <div className="ring">{catArt(c) ? <img src={catArt(c)} alt="" /> : null}</div>
            <span>{c.name}</span>
          </button>
        ))}
      </div>}

      {!showSections && <div ref={chipsRef}><Chips /></div>}

      {showSections && <>
        {/* Commandes en cours */}
        {active.length > 0 && <div onClick={() => setTab(3)} role="button" style={{ margin: "16px 16px 0", padding: "14px 16px", borderRadius: 16, background: "var(--acc)", color: "#fff", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <Icon name="bike" size={26} color="#fff" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{active.length > 1 ? `${active.length} commandes en cours` : "Commande en cours"}</div>
            <div style={{ fontSize: 13, opacity: 0.9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{active[0].establishment_name || ""} · {fmt(active[0].total)}</div>
          </div>
          <Icon name="arrow_right" size={20} color="#fff" />
        </div>}

        {/* Fidélité */}
        <div className="t-dash">
          <Icon name="gift" size={30} color="var(--acc)" />
          <div className="txt">
            {isGuest || points === null ? <>Gagnez des <b style={{ color: "var(--acc)" }}>points</b> !</>
              : <>Vous avez <b style={{ color: "var(--acc)" }}>{points} points</b></>}
          </div>
          {isGuest ? <button className="t-pill-btn" onClick={() => requireLogin("login")}>Connexion</button>
            : <button className="t-pill-btn" onClick={() => go("loyalty")}>Voir</button>}
        </div>

        {/* Tuiles dessinées (fond coloré, titre en gras, illustration) — gérées dans le panneau */}
        {tiles.length > 0 && <div className="t-hscroll" style={{ marginTop: 16 }}>
          {tiles.map((x) => (
            <div key={x.k} className={"t-promo3" + (/\S{9,}/.test(`${x.t1} ${x.t2 || ""}`) ? " long" : "")} style={{ background: x.bg }} onClick={x.on} role="button" aria-label={[x.t1, x.t2].filter(Boolean).join(" ")}>
              <b>{x.t1}{x.t2 && <><br /><span style={{ background: `linear-gradient(transparent 55%, ${x.hl} 55%)` }}>{x.t2}</span></>}</b>
              {x.img && <img className="art" src={x.img} alt="" />}
              {x.badge && <span className="pct">{x.badge}</span>}
            </div>
          ))}
        </div>}

        {/* Carrousel */}
        <div style={{ marginTop: banners.length ? 18 : 0 }}>
          <div className="t-hscroll" ref={bannerRef} onTouchStart={() => { holdRef.current = Date.now(); }} onTouchEnd={() => { holdRef.current = Date.now(); setTimeout(syncBanner, 600); }} onMouseDown={() => { holdRef.current = Date.now(); }}>
            {banners.map((b) => b.style === "photo"
              ? <div key={b.k} className="t-banner3 photo" onClick={b.on} role="button" aria-label={b.t || "Annonce"}>
                  {b.img && <img className="full" src={b.img} alt="" />}
                </div>
              : <div key={b.k} className="t-banner3" style={{ background: b.bg }} onClick={b.on} role="button">
                  <div className="brand"><i>lamuka</i></div>
                  {b.t && <b>{b.t}</b>}
                  {b.s && <span>{b.s}</span>}
                  {b.tag && <em style={{ color: b.c1 }}>{b.tag}</em>}
                  {b.img && <img src={b.img} alt="" />}
                </div>)}
          </div>
        </div>

        {/* Catégories rondes */}
        {usedCats.length > 0 && <div style={{ marginTop: 20 }}>
          <div className="t-cats">
            {usedCats.map((c) => (
              <button key={c.id} className="t-cat" onClick={() => { setSub(c.id); setFilter(null); scrRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <div className="ring">{catArt(c) ? <img src={catArt(c)} alt="" /> : <Icon name="bag" size={28} color="var(--t-mut)" />}</div>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>}

        {/* Filtres (comme Toters : juste sous les cuisines) */}
        <div ref={chipsRef} style={{ marginTop: 12 }}><Chips /></div>

        {/* Nouveau sur Lamuka (Toters : « Now on Toters 💥 ») */}
        {fresh.length > 0 && <div style={{ background: "var(--acc-l)", marginTop: 18, paddingBottom: 18 }}>
          <div className="t-sec-head">
            <div className="t-h2">Nouveau sur Lamuka</div>
            <button className="t-round-btn white" onClick={() => go("collection", { title: "Nouveau sur Lamuka", subtitle: "Nos derniers partenaires, choisis pour vous.", filter: "new" })} aria-label="Tout voir"><Icon name="arrow_right" size={20} /></button>
          </div>
          <div className="t-hscroll" style={{ display: "grid", gridTemplateRows: fresh.length > 3 ? "auto auto" : "auto", gridAutoFlow: "column", gap: 12 }}>
            {fresh.map((v) => <StoreCardSmall key={v.id} v={v} onOpen={openStore} />)}
          </div>
        </div>}

        {/* Rails de produits (Toters : « Up to 65% Off! », « Fresh for Less »…) */}
        {rails.map((r) => <div key={r.title}>
          <div className="t-sec-head">
            <div className="t-h2">{r.title}</div>
            <button className="t-round-btn" onClick={() => go("collection", { title: r.title, subtitle: r.subtitle, items: r.key })} aria-label="Tout voir"><Icon name="arrow_right" size={20} /></button>
          </div>
          <div className="t-hscroll">
            {r.list.map((p) => <ProductCard key={p.id} p={p} onOpen={openProduct} onQuickAdd={openProduct} inCart={cartQty(p.id)} />)}
          </div>
        </div>)}
      </>}

      {/* Toutes les boutiques (comme Toters : titre seulement sur « Tout », sinon nombre de résultats + Réinitialiser) */}
      {narrowed ? <div className="t-results"><span>{list.length} résultat{list.length > 1 ? "s" : ""}</span><button onClick={resetAll}>Réinitialiser</button></div>
        : vert === "all" ? <div className="t-sec-head" style={{ paddingTop: 8 }}><div className="t-h2">Toutes les boutiques</div></div>
        : <div style={{ height: 14 }} />}
      {loading && !stores.length && [0, 1].map((i) => <div key={i} className="t-store" style={{ cursor: "default" }}><div className="cover t-skel" /><div className="body"><div className="t-skel" style={{ height: 18, width: "60%", borderRadius: 6 }} /><div className="t-skel" style={{ height: 14, width: "40%", borderRadius: 6, marginTop: 8 }} /></div></div>)}
      {!loading && list.length === 0 && (narrowed
        ? <div className="t-nomatch"><NoMatchArt /><b>Aucun résultat</b><p>Retirez des filtres pour voir plus de boutiques.</p><button onClick={resetAll}>Réinitialiser les filtres</button></div>
        : <div className="t-empty"><div className="ic"><Icon name="store" size={36} /></div><b>Aucune boutique ici pour le moment</b><p>Essayez un autre univers.</p></div>)}
      {list.map((v) => <StoreCard key={v.id} v={v} onOpen={openStore} fav={isFollowed(v.id)} onFav={toggle} />)}
      <div style={{ height: 96 }} />

      {addrSheet && <DeliverTo onClose={() => setAddrSheet(false)} />}
    </div>
    </div>
  );
}

export default HomeScr;
