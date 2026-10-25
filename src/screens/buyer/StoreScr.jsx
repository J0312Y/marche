import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../components/Icon";
import Img from "../../components/Img";
import Sheet from "../../components/t/Sheet";
import ProductCard from "../../components/t/ProductCard";
import ProductSheet from "../../components/t/ProductSheet";
import { StoreCover, StoreLogo } from "../../components/t/StoreCard";
import { useData } from "../../hooks";
import { useApp } from "../../context/AppContext";
import useFollowed from "../../hooks/useFollowed";
import { establishmentsAPI, reviewsAPI } from "../../api";
import { fmt } from "../../utils/helpers";
import { cartSubtotal } from "../../utils/cartMath";
import { storeStatus, etaLabel } from "../../utils/storeStatus";
import { shareVendor } from "../../utils/share";
import { setBarsOnDark } from "../../utils/systemBars";
import useBackClose from "../../hooks/useBackClose";
import ClosedSheet, { shortWhen } from "../../components/t/ClosedSheet";
import { isFoodType } from "../../config/storeTypes";
import { order as orderSvc } from "../../services";
import { loyaltyRules } from "../../config/appInfo";

const DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const hm = (t) => String(t || "").slice(0, 5);

/**
 * Page boutique « Toters » : couverture, carte d'infos, fidélité, populaires,
 * onglets de catégories collants (synchronisés avec le défilement), menu avec « + ».
 * openProduct : article à ouvrir directement (lien depuis l'accueil, la recherche, les favoris…)
 */
// Tuile de rayon (Toters) : photo du premier article qui en a une
function Tile({ sec, onClick }) {
  const ph = sec.list.find((p) => p.photo)?.photo;
  return (
    <button className="tr-tile" onClick={onClick}>
      <span className="im">{ph ? <Img src={ph} alt="" style={{ width: "100%", height: "100%" }} /> : <Icon name="bag" size={30} color="var(--t-mut)" />}</span>
      <span>{sec.name}</span>
    </button>
  );
}

// Présentation des onglets du magasin (première visite)
const TOUR = [
  { icon: "cart", title: "Vos courses, simplement", text: "Tout ce qu'il vous faut, au même endroit" },
  { icon: "grid_plus", title: "Rayons", text: "Accédez vite à nos différentes catégories, de l'alimentaire au non-alimentaire" },
  { icon: "percent_badge", title: "Promos", text: "Découvrez nos dernières offres et économisez avec des prix imbattables" },
  { icon: "refresh", title: "Racheter", text: "Recommandez vos essentiels en quelques touches" },
];

export default function StoreScr({ vendor: v0, openProduct, onBack, go }) {
  const { P, VENDORS } = useData();
  const { cart, cartCount, addToCart, user } = useApp();
  const { isFollowed, toggle } = useFollowed();
  const eid = Number(v0?.id || v0?.establishmentId || v0?.establishment_id);
  const [detail, setDetail] = useState(null);
  const v = VENDORS.find((x) => Number(x.id) === eid) || { ...v0, id: eid, name: v0?.name || v0?.vendor || v0?.establishment_name || detail?.name || "Boutique" };
  const [hours, setHours] = useState([]);
  const [product, setProduct] = useState(null);
  // Article ouvert depuis l'extérieur (accueil, recherche…) : comme Toters, le bouton « boutique » fait glisser
  // la boutique par-dessus ; retour → l'article (choix conservés) ; retour encore → l'écran d'origine.
  const [outP] = useState(openProduct || null);
  const [entered, setEntered] = useState(!openProduct);
  const [pushing, setPushing] = useState(false);
  const enterStore = () => { setEntered(true); setPushing(true); setTimeout(() => setPushing(false), 340); };
  const leaveStore = () => setEntered(false);
  const back = outP && entered ? leaveStore : onBack;
  const [activeSec, setActiveSec] = useState(0);
  const [compact, setCompact] = useState(false);
  const [info, setInfo] = useState(false);
  const [perks, setPerks] = useState(false); // feuille « Dépensez plus, gagnez plus »
  const [reviews, setReviews] = useState(null);
  const [q, setQ] = useState(null); // recherche dans la boutique
  const [catsPage, setCatsPage] = useState(false); // page « Catégories » (☰)
  const [aisle, setAisle] = useState(null); // rayon ouvert en grille
  const [aisleQ, setAisleQ] = useState("");
  const [hoursOpen, setHoursOpen] = useState(false);
  const [closedSheet, setClosedSheet] = useState(null); // null = pas encore décidé
  const [stab, setStab] = useState("shop"); // onglets du magasin (détail) : shop | aisles | offers | again
  const [listOpen, setListOpen] = useState(false); // « Une liste de courses ? »
  const [listText, setListText] = useState("");
  const [infoSheet, setInfoSheet] = useState(null); // "points" | "punch"
  const [boughtIds, setBoughtIds] = useState(null);
  const scrRef = useRef(null);
  const tabsRef = useRef(null);
  const secRefs = useRef([]);
  const tabBtnRefs = useRef([]);
  const jumpRef = useRef(null); // onglet touché : reste actif pendant le défilement qu'il déclenche
  const jumpTimer = useRef(null);

  useEffect(() => {
    if (!eid) return;
    establishmentsAPI.getDetail(eid).then((r) => { setDetail(r?.establishment || null); setHours(r?.hours || []); }).catch(() => {});
  }, [eid, user]);

  const items = useMemo(() => P.filter((p) => Number(p.establishmentId) === eid), [P, eid]);
  const sections = useMemo(() => {
    const by = new Map();
    for (const p of items) { const k = p.menu_section || p.cat || "Autres"; if (!by.has(k)) by.set(k, []); by.get(k).push(p); }
    // Ordre du menu (comme Toters) : ordre choisi par la boutique (Mes rayons) ; à défaut, boissons et desserts en dernier
    const ordered = items.some((p) => Number(p.sort_order) >= 1000); // positions données par « Mes rayons »
    const late = (n) => (ordered ? 0 : /^boissons?$/i.test(n) ? 2 : /^desserts?$/i.test(n) ? 1 : 0);
    const first = (list) => Math.min(...list.map((p) => Number(p.sort_order) || 0));
    return [...by.entries()].map(([name, list]) => ({ name, list: [...list].sort((x, y) => (Number(x.sort_order) || 0) - (Number(y.sort_order) || 0)) }))
      .sort((x, y) => late(x.name) - late(y.name) || first(x.list) - first(y.list));
  }, [items]);
  const retail = !isFoodType(v.type || detail?.type);
  // Badges de confiance (comme Taobao) : ancienneté, clients fidèles, commandes livrées
  const trust = (() => {
    const t = detail?.trust; if (!t) return [];
    const out = [];
    if (t.since) {
      const m = Math.floor((Date.now() - new Date(t.since)) / (30.44 * 86400000));
      if (m >= 12) out.push(["award", `Sur Lamuka depuis ${Math.floor(m / 12)} an${m >= 24 ? "s" : ""}`]);
      else if (m >= 2) out.push(["award", `Sur Lamuka depuis ${m} mois`]);
    }
    if (t.returning_clients >= 3) out.push(["repeat", `${t.returning_clients} clients fidèles`]);
    if (t.delivered_orders >= 10) out.push(["delivered", `${t.delivered_orders >= 1000 ? Math.floor(t.delivered_orders / 1000) + " k" : t.delivered_orders} commandes livrées`]);
    if (String(detail.is_verified) === "1") out.push(["shield", "Commerce vérifié"]);
    return out;
  })();
  // « Dans le même rayon » sur la fiche article : mêmes rayon et boutique, photos d'abord
  const similarTo = (x) => {
    const k = x.menu_section || x.cat || "Autres";
    return items.filter((y) => y.id !== x.id && (y.menu_section || y.cat || "Autres") === k).sort((a, b) => !!b.photo - !!a.photo).slice(0, 10);
  };
  const popular = useMemo(() => [...items].filter((p) => p.photo).sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 8), [items]);
  // 3 articles les plus vendus : étiquette « Populaire » (comme Toters)
  const popularIds = useMemo(() => new Set([...items].filter((p) => p.sold > 0).sort((a, b) => b.sold - a.sold).slice(0, 3).map((p) => p.id)), [items]);
  const offerItems = items.filter((p) => p.old > p.price);
  const offerSections = sections.map((x) => ({ ...x, list: x.list.filter((p) => p.old > p.price) })).filter((x) => x.list.length);
  // Liste de courses : chaque ligne → articles correspondants
  const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const listLines = listText.split(/\n|,/).map((x) => x.trim()).filter((x) => x.length > 1);
  const shown = q ? items.filter((p) => (p.name + " " + (p.description || "")).toLowerCase().includes(q.toLowerCase())) : null;

  const st = storeStatus({ ...v, ...(detail ? { isOpenNow: detail.is_open_now, opensAt: detail.opens_at } : {}) });
  const card = detail?.punch_card || v.punchCard;
  const punches = card?.punches || 0;
  const reward = card?.rewards_available || 0;
  // Boutique fermée (Toters) : feuille à l'ouverture, une fois les horaires connus
  useEffect(() => { if (detail && closedSheet === null) setClosedSheet(!st.open && !openProduct); }, [detail]);
  useEffect(() => { if (entered && outP && detail && closedSheet === false && !st.open) setClosedSheet(true); }, [entered]); // eslint-disable-line react-hooks/exhaustive-deps // eslint-disable-line react-hooks/exhaustive-deps
  const storeCart = cart.filter((c) => Number(c.establishment_id) === eid);
  const qtyOf = (id) => storeCart.filter((c) => Number(c.article_id) === Number(id)).reduce((s, c) => s + (parseInt(c.quantity, 10) || 1), 0);

  // Comme Toters : icônes blanches sur l'en-tête photo assombri, foncées ailleurs
  useBackClose(!!outP && entered, leaveStore);
  useBackClose(q !== null, () => setQ(null));
  useBackClose(catsPage, () => setCatsPage(false));
  useBackClose(retail && stab !== "shop", () => setStab("shop"));
  // Présentation des onglets à la première visite d'un magasin (comme Toters), une seule fois
  const [tour, setTour] = useState(-1);
  const endTour = () => { setTour(-1); try { localStorage.setItem("lk-retail-tour", "1"); } catch { /* stockage indisponible */ } };
  useEffect(() => {
    if (!retail || !detail || !entered || closedSheet || tour >= 0) return;
    let seen = false; try { seen = !!localStorage.getItem("lk-retail-tour"); } catch { seen = true; }
    if (!seen) setTour(0);
  }, [retail, detail, entered, closedSheet]); // eslint-disable-line react-hooks/exhaustive-deps
  useBackClose(tour >= 0, endTour);
  useBackClose(listOpen, () => setListOpen(false));
  // Racheter : articles de cette boutique déjà commandés (commandes du client)
  useEffect(() => {
    if (!retail || stab !== "again" || boughtIds !== null) return;
    if (!user) { setBoughtIds([]); return; }
    orderSvc.getAll().then((r) => {
      const list = Array.isArray(r) ? r : r?.orders || [];
      const ids = [];
      list.filter((o) => Number(o.establishment_id) === eid).forEach((o) => (o.items || []).forEach((it) => { const id = Number(it.article_id); if (id && !ids.includes(id)) ids.push(id); }));
      setBoughtIds(ids);
    }).catch(() => setBoughtIds([]));
  }, [retail, stab, user, eid, boughtIds]);
  useBackClose(!!aisle, () => { setAisle(null); setAisleQ(""); });
  const darkHead = compact && q === null && !product && !catsPage && !aisle && !reviews;
  useEffect(() => { setBarsOnDark(darkHead); }, [darkHead]);
  useEffect(() => () => setBarsOnDark(false), []);

  const onScroll = (e) => {
    const top = e.currentTarget.scrollTop;
    setCompact(top > 170);
    const tabsH = (tabsRef.current?.offsetHeight || 54) + 64;
    let idx = 0;
    secRefs.current.forEach((el, i) => { if (el && el.offsetTop - tabsH <= top + 4) idx = i; });
    // Bas de page atteint : la dernière section devient active même si elle est courte (comme Toters)
    const sc = e.currentTarget;
    if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 8) idx = Math.max(0, sections.length - 1);
    if (jumpRef.current !== null) {
      idx = jumpRef.current;
      clearTimeout(jumpTimer.current);
      jumpTimer.current = setTimeout(() => { jumpRef.current = null; }, 180);
    }
    if (idx !== activeSec) {
      setActiveSec(idx);
      tabBtnRefs.current[idx]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };
  const jump = (i) => {
    const el = secRefs.current[i];
    if (!el) return;
    const tabsH = (tabsRef.current?.offsetHeight || 54) + 64;
    jumpRef.current = i;
    setActiveSec(i);
    tabBtnRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    clearTimeout(jumpTimer.current);
    jumpTimer.current = setTimeout(() => { jumpRef.current = null; }, 1200);
    scrRef.current?.scrollTo({ top: el.offsetTop - tabsH + 2, behavior: "smooth" });
  };

  // « + » : ajout direct si pas d'option à choisir et panier de la même boutique ; sinon fiche produit
  const quick = async (p) => {
    const otherStore = cart.some((c) => Number(c.establishment_id) !== eid);
    if ((p.optionGroups || []).length || otherStore) { setProduct(p); return; }
    await addToCart(p, 1, {});
  };

  const loadReviews = () => {
    setReviews([]);
    reviewsAPI.getByEstablishment(eid).then((r) => setReviews((r?.reviews || r || []).map((x) => ({
      name: [x.first_name, x.last_name].filter(Boolean).join(" ") || "Client",
      rating: parseInt(x.rating, 10) || 0, text: x.comment || "", reply: x.vendor_reply || "",
      date: x.created_at ? new Date(String(x.created_at).replace(" ", "T")).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "",
    })))).catch(() => setReviews([]));
  };

  const Row = ({ p }) => {
    const oos = p.stock !== null && p.stock !== undefined && p.stock >= 0 && p.stock <= 0;
    const n = qtyOf(p.id);
    return (
      <div className="t-item" onClick={() => setProduct(p)} role="button">
        <div className="info">
          <div className="nm">{p.name}</div>
          {p.calories != null && p.calories !== "" && <div className="cal">{p.calories} cal</div>}
          {p.description && <div className="ds">{p.description}</div>}
          <div className="pr">{fmt(p.price)}{p.old > p.price && <span style={{ fontSize: 13, color: "var(--t-mut)", textDecoration: "line-through", marginLeft: 8, fontWeight: 500 }}>{fmt(p.old)}</span>}{p.size_label && <span className="sz">{p.size_label}</span>}</div>
          {!oos && popularIds.has(p.id) && <div className="t-hot"><Icon name="flame" size={13} color="#F59E0B" />Populaire</div>}
        </div>
        <div className={"ph" + (oos ? " na" : "")}>
          {p.photo ? <Img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="bag" size={32} color="var(--t-mut)" /></div>}
          {oos && <span className="na-pill">Indisponible</span>}
          <button className="t-plus" disabled={oos} onClick={(e) => { e.stopPropagation(); if (!oos) quick(p); }} aria-label="Ajouter">
            {n > 0 ? <span className="n">{n}</span> : <Icon name="plus" size={20} color={oos ? "#C4C7CE" : "var(--acc)"} strokeWidth={2.6} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={pushing ? "t-pushin" : undefined} style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minHeight: 0 }}>
      {/* En-tête compact (après la couverture) */}
      {compact && !q && <div className="t-store-mini" style={{ backgroundImage: (v.cover || detail?.cover_image) ? `linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),url("${v.cover || detail?.cover_image}")` : undefined }}>
        <button className="t-round-btn dim" onClick={back} aria-label="Retour"><Icon name="arrow_left" size={22} /></button>
        <div style={{ flex: 1, fontSize: 19, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name}</div>
        <button className="t-round-btn dim" onClick={() => toggle(v)} aria-label="Favori"><Icon name={isFollowed(eid) ? "heart-fill" : "heart"} size={22} color={isFollowed(eid) ? "var(--acc)" : "currentColor"} /></button>
        <button className="t-round-btn dim" onClick={() => setQ("")} aria-label="Rechercher"><Icon name="search" size={22} /></button>
      </div>}

      {/* Recherche dans la boutique */}
      {q !== null && <div style={{ position: "absolute", inset: 0, zIndex: 45, background: "var(--card)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "calc(12px + env(safe-area-inset-top,0px)) 16px 12px" }}>
          <button className="t-back" onClick={() => setQ(null)} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
          <div className="t-search" style={{ flex: 1, height: 48, boxShadow: "none", background: "var(--t-bg2)", border: "none" }}>
            <Icon name="search" size={20} color="var(--t-mut)" />
            <input autoFocus placeholder={`Rechercher chez ${v.name}`} value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <div className="t-scr">
          {!q ? <div className="t-empty"><p>Tapez quelques lettres pour trouver un article.</p></div>
            : shown.length ? shown.map((p) => <Row key={p.id} p={p} />)
            : <div className="t-empty"><b>Aucun résultat</b><p>Aucun article ne correspond à « {q} ».</p></div>}
        </div>
      </div>}

      <div className="t-scr" ref={scrRef} onScroll={onScroll}>
        {/* Couverture */}
        <div className="t-store-hero">
          <StoreCover v={{ ...v, cover: v.cover || detail?.cover_image, logo: v.logo || detail?.avatar }} />
          <div className="t-store-top">
            <button className="t-round-btn glass" onClick={back} aria-label="Retour"><Icon name="arrow_left" size={22} /></button>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="t-round-btn glass" onClick={() => shareVendor(v)} aria-label="Partager"><Icon name="share" size={20} /></button>
              <button className="t-round-btn glass" onClick={() => toggle(v)} aria-label="Favori"><Icon name={isFollowed(eid) ? "heart-fill" : "heart"} size={20} color={isFollowed(eid) ? "var(--acc)" : "currentColor"} /></button>
              <button className="t-round-btn glass" onClick={() => setQ("")} aria-label="Rechercher"><Icon name="search" size={20} /></button>
            </div>
          </div>
        </div>

        {/* Carte d'infos (fermée : bandeau « Fermé, précommande pour … » comme Toters) */}
        {!st.open && <div className="t-closed-band"><Icon name="moon_closed" size={18} color="#fff" />{st.preorder ? `Fermé, précommande pour ${shortWhen(st.opens)}` : "Fermé pour le moment"}</div>}
        <div className={"t-store-card" + (!st.open ? " closed" : "")}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <StoreLogo v={{ ...v, logo: v.logo || detail?.avatar }} size={40} />
            <div style={{ flex: 1, minWidth: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name}</div>
            <button className="t-round-btn" style={{ background: "none" }} onClick={() => setInfo(true)} aria-label="Informations"><Icon name="info" size={24} color="var(--t-sub)" /></button>
          </div>
          <div className="t-stats">
            {st.open || !st.preorder ? <div><small>Délai de livraison</small><b>{st.open ? etaLabel(v) : "Fermé"}</b></div>
              : <div><small>Précommande</small><b>{st.opens.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long" })}</b></div>}
            <div style={{ cursor: "pointer" }} onClick={loadReviews} role="button"><small>Notes et avis</small><b>{v.rating > 0 ? <><Icon name="star_full" size={18} color="var(--acc)" />{Number(v.rating).toFixed(1)}<span style={{ color: "var(--t-mut)", fontWeight: 500, fontSize: 14 }}>({v.reviewsCount || 0})</span></> : <span style={{ color: "var(--acc)" }}>Nouveau</span>}</b></div>
          </div>
        </div>
        {trust.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "10px 16px 0" }}>
          {trust.map(([ic, t]) => <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--t-sub)", background: "var(--t-bg2)", borderRadius: 8, padding: "4px 8px" }}><Icon name={ic} size={14} color="var(--acc)" />{t}</span>)}
        </div>}


        {/* Fidélité */}
        <div className="t-loyal">
          {card && <div className="t-loyal-card" onClick={() => setInfoSheet("punch")} role="button" style={{ cursor: "pointer" }}>
            <div className="t-dots">
              {Array.from({ length: card.punches_required }).map((_, i) => <i key={i} className={i < punches ? "on" : ""}>{i < punches ? "✓" : ""}</i>)}
            </div>
            <div className="t-mut">{reward > 0 ? "Récompense disponible" : `Encore ${card.punches_required - punches} commande${card.punches_required - punches > 1 ? "s" : ""}`}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2, whiteSpace: "nowrap" }}>Gagnez {fmt(card.reward_amount).replace("FCFA", "F")}</div>
            <div style={{ borderTop: "1.5px dashed var(--t-line)", margin: "12px -14px 0", padding: "10px 14px 0", textAlign: "center", fontSize: 13, color: reward > 0 ? "var(--acc)" : "var(--t-sub)", fontWeight: reward > 0 ? 700 : 500 }}>{reward > 0 ? "Appliquée" : "Automatique"}</div>
          </div>}
          <div className="t-loyal-card" onClick={() => setInfoSheet("points")} role="button" style={{ background: "var(--acc-l)", borderColor: "transparent", cursor: "pointer" }}>
            <div style={{ width: 34, height: 34, borderRadius: 17, background: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><Icon name="plus" size={20} color="#fff" strokeWidth={3} /></div>
            <div className="t-mut">à chaque commande</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2, whiteSpace: "nowrap" }}>Points offerts</div>
            <div style={{ fontSize: 13, color: "var(--t-sub)", marginTop: 6 }}>{loyaltyRules().per ? `1 point par ${fmt(loyaltyRules().per)}` : "Points offerts"}</div>
          </div>
        </div>

        {/* Détail : recherche dans la boutique + catégories (comme Toters) */}
        {retail && items.length > 0 && <>
          <div className="tr-search" onClick={() => setQ("")} role="button"><Icon name="search" size={22} color="var(--t-text)" /><span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>Rechercher chez {v.name}</span></div>
          {sections.length > 1 && <>
            <div className="tr-head"><b>Catégories</b><button onClick={() => setCatsPage(true)} aria-label="Toutes les catégories"><Icon name="arrow_right" size={20} /></button></div>
            <div className={"tr-tiles" + (sections.length > 4 ? " two" : "")}>
              {sections.map((sec) => <Tile key={sec.name} sec={sec} onClick={() => setAisle(sec)} />)}
            </div>
          </>}
          <button className="tr-list" onClick={() => setListOpen(true)}>
            <span className="ill"><Icon name="list" size={26} color="var(--acc)" /></span>
            <span className="tx"><b>Une liste de courses ? <i>NOUVEAU</i></b><span>Cherchez tous vos articles d'un coup !</span></span>
            <span className="go"><Icon name="arrow_right" size={20} /></span>
          </button>
        </>}

        {/* Populaires */}
        {!retail && popular.length > 2 && <>
          <div className="t-h2" style={{ padding: "8px 16px 12px" }}>Populaires</div>
          <div className="t-hscroll" style={{ paddingBottom: 6 }}>
            {popular.map((p) => <ProductCard key={p.id} p={p} width={180} showShop={false} onOpen={setProduct} onQuickAdd={quick} inCart={qtyOf(p.id)} />)}
          </div>
        </>}

        {/* Onglets de catégories (collants) */}
        {sections.length > 1 && <div ref={tabsRef} style={{ position: "sticky", top: compact ? "calc(64px + env(safe-area-inset-top,0px))" : 0, zIndex: 30, marginTop: 16 }}>
          <div className="t-tabs" style={retail ? { paddingLeft: 0 } : undefined}>
            {retail && <button className="t-menu-btn" onClick={() => setCatsPage(true)} aria-label="Catégories"><Icon name="menu" size={24} /></button>}
            {sections.map((s, i) => <button key={s.name} ref={(el) => (tabBtnRefs.current[i] = el)} className={"t-tab" + (i === activeSec ? " on" : "")} onClick={() => jump(i)}>{s.name}</button>)}
          </div>
        </div>}

        {/* Menu */}
        {items.length === 0 && <div className="t-empty"><div className="ic"><Icon name="bag" size={34} /></div><b>Pas encore d'articles</b><p>Cette boutique n'a encore rien mis en ligne.</p></div>}
        {sections.map((s, i) => (
          <div key={s.name} ref={(el) => (secRefs.current[i] = el)}>
            {retail ? <>
              <div className="tr-head" style={{ paddingTop: 26 }}><b>{s.name}</b><button onClick={() => setAisle(s)} aria-label={"Tout voir : " + s.name}><Icon name="arrow_right" size={20} /></button></div>
              <div className="tr-rail">{s.list.map((p) => <ProductCard key={p.id} p={p} width={150} grid showShop={false} onOpen={setProduct} onQuickAdd={quick} inCart={qtyOf(p.id)} />)}</div>
            </> : <>
              <div className="t-menu-sec">{s.name}</div>
              {s.list.map((p) => <Row key={p.id} p={p} />)}
            </>}
          </div>
        ))}
        <div style={{ height: 140 }} />
      </div>

      {/* Détail : pastille panier flottante (comme Toters Fresh) */}
      {retail && storeCart.length > 0 && !catsPage && !aisle && <button className="tr-pill" onClick={() => go("cart", { eid: Number(v.id) })} style={{ bottom: `calc(${card ? 150 : 82}px + env(safe-area-inset-bottom,0px))` }}>
        <span className="th">{storeCart[0]?.image || storeCart[0]?.thumbnail_url ? <Img src={storeCart[0].image || storeCart[0].thumbnail_url} alt="" style={{ width: "100%", height: "100%" }} /> : <Icon name="bag" size={18} color="var(--acc)" />}</span>
        <span className="tx"><small>{storeCart.reduce((n, c) => n + (parseInt(c.quantity, 10) || 1), 0)} article{storeCart.reduce((n, c) => n + (parseInt(c.quantity, 10) || 1), 0) > 1 ? "s" : ""}</small><b>{fmt(cartSubtotal(storeCart)).replace("FCFA", "F")}</b></span>
        <span className="go"><Icon name="chevron_right" size={20} color="#fff" strokeWidth={2.6} /></span>
      </button>}

      {tour >= 0 && <>
        <div className="tr-tour-bg" onClick={endTour} />
        <div className="tr-tour" style={{ bottom: "calc(64px + env(safe-area-inset-bottom,0px))" }}>
          <span className="art"><Icon name={TOUR[tour].icon} size={120} color="rgba(255,255,255,.16)" strokeWidth={1.4} /></span>
          <button className="x" onClick={endTour} aria-label="Fermer"><Icon name="close" size={18} color="#fff" strokeWidth={2.4} /></button>
          <div key={tour} className="txt"><b>{TOUR[tour].title}</b><p>{TOUR[tour].text}</p></div>
          <div className="foot"><span>{tour + 1} sur {TOUR.length}</span>
            <button onClick={() => (tour < TOUR.length - 1 ? setTour(tour + 1) : endTour())}>{tour < TOUR.length - 1 ? "Suivant" : "Compris"}</button></div>
        </div>
      </>}

      {/* Bas d'écran : barre panier ou rappel carte à tampons */}
      {retail ? <div className="t-store-foot" style={{ flexShrink: 0 }}>
        {card && <div className="t-punchbar" onClick={() => setPerks(true)} role="button" aria-label="Voir les avantages" style={{ borderRadius: 0, boxShadow: "none", borderTop: "1px solid var(--t-line)" }}>
          <span className="chev" />
          <div className="row"><Icon name="award" size={22} color="var(--acc)" /><span style={{ flex: 1 }}>Dépensez {fmt(card.min_spend).replace("FCFA", "F")}, gagnez un tampon</span><Icon name="info" size={18} color="var(--t-sub)" /></div>
          <div className="track"><i style={{ width: Math.min(100, (cartSubtotal(storeCart) / (Number(card.min_spend) || 1)) * 100) + "%" }} /></div>
        </div>}
        <nav className={"tr-tabs" + (tour >= 0 ? " touring" : "")}>
          {[["shop", "store", "Magasin"], ["aisles", "grid_plus", "Rayons"], ["offers", "percent_badge", "Promos"], ["again", "refresh", "Racheter"]].map(([id, ic, label], k) => (
            <button key={id} className={(stab === id ? "on" : "") + (tour === k ? " tour" : "")} onClick={() => { setStab(id); if (id === "shop") scrRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}>
              <Icon name={ic} size={24} strokeWidth={1.8} color={tour === k ? "#fff" : stab === id && tour < 0 ? "var(--acc)" : "var(--t-sub)"} />{label}
            </button>
          ))}
        </nav>
      </div>
      // Comme Toters : progression vers l'avantage (carte à tampons) au-dessus du bouton « Voir le panier », dans le même pied d'écran
      : (card || (cartCount > 0 && storeCart.length > 0)) && <div className="t-punchbar t-storefoot">
        {card && <div onClick={() => setPerks(true)} role="button" aria-label="Voir les avantages">
          <span className="chev" />
          <div className="row"><Icon name="award" size={22} color="var(--acc)" /><span style={{ flex: 1 }}>{cartSubtotal(storeCart) >= (Number(card.min_spend) || 0) && storeCart.length > 0 ? "Cette commande vous rapporte un tampon" : `Dépensez ${fmt(card.min_spend).replace("FCFA", "F")}, gagnez un tampon`}</span><Icon name="info" size={18} color="var(--t-sub)" /></div>
          <div className="track"><i style={{ width: Math.min(100, (cartSubtotal(storeCart) / (Number(card.min_spend) || 1)) * 100) + "%" }} /></div>
        </div>}
        {cartCount > 0 && storeCart.length > 0 && <button className="t-cartbar inline" onClick={() => go("cart", { eid: Number(v.id) })}>
          <span className="n">{storeCart.reduce((s, c) => s + (parseInt(c.quantity, 10) || 1), 0)}</span>
          <span className="l">Voir le panier</span>
          <span className="p">{fmt(cartSubtotal(storeCart))}</span>
        </button>}
      </div>}

      {perks && <Sheet onClose={() => setPerks(false)}>
        <div style={{ padding: "8px 20px 24px" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Dépensez plus, gagnez plus !</div>
          <div className="t-sub" style={{ fontSize: 14, marginTop: 2, marginBottom: 18 }}>Des avantages à chaque étape de votre panier.</div>
          {[
            card && { icon: "award", title: "Carte de fidélité", desc: `Dépensez ${fmt(card.min_spend).replace("FCFA", "F")} et gagnez un tampon`, goal: Number(card.min_spend) || 0 },
            v.minOrder > 0 && { icon: "bag", title: "Commande minimum", desc: `Commandez au moins ${fmt(v.minOrder).replace("FCFA", "F")} dans cette boutique`, goal: Number(v.minOrder) },
          ].filter(Boolean).map((p) => {
            const sub = cartSubtotal(storeCart), left = Math.max(0, p.goal - sub);
            return <div key={p.title} className="t-perk">
              <div className="tile"><Icon name={p.icon} size={30} color="var(--acc)" /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b>{p.title}</b>
                <div className="d">{p.desc}</div>
                <div className="track"><i style={{ width: Math.min(100, (sub / (p.goal || 1)) * 100) + "%" }} /></div>
                <div className="left">{left > 0 ? `Encore ${fmt(left).replace("FCFA", "F")}` : "Atteint ✓"}</div>
              </div>
            </div>;
          })}
          {cartCount > 0 && storeCart.length > 0 && <button className="t-cartbar inline" style={{ marginTop: 4 }} onClick={() => { setPerks(false); go("cart", { eid: Number(v.id) }); }}>
            <span className="n">{storeCart.reduce((s, c) => s + (parseInt(c.quantity, 10) || 1), 0)}</span>
            <span className="l">Voir le panier</span>
            <span className="p">{fmt(cartSubtotal(storeCart))}</span>
          </button>}
        </div>
      </Sheet>}

      {retail && stab !== "shop" && <div className="tr-page" style={{ bottom: "calc(64px + env(safe-area-inset-bottom,0px))" }}>
        <div className="hd">
          <button className="t-back" onClick={() => setStab("shop")} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
          <div className="sb" style={{ flex: 1, margin: 0 }} onClick={() => { setStab("shop"); setQ(""); }} role="button"><Icon name="search" size={22} color="var(--t-text)" /><span style={{ color: "var(--t-sub)", fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stab === "aisles" ? "Que cherchez-vous ?" : `Rechercher chez ${v.name}`}</span></div>
        </div>
        <div className="t-scr">
          {stab === "aisles" && <>
            <div className="tr-sec" style={{ paddingTop: 14 }}>Pour vous</div>
            <div className="tr-cats">
              <button className="tr-tile" onClick={() => setStab("offers")}><span className="im" style={{ background: "#FDECEC" }}><Icon name="percent" size={38} color="#E5484D" strokeWidth={2.4} /></span><span>Promos</span></button>
              <button className="tr-tile" onClick={() => setStab("again")}><span className="im" style={{ background: "#EEE9FD" }}><Icon name="refresh" size={36} color="#7C5CE6" strokeWidth={2.4} /></span><span>Racheter</span></button>
            </div>
            <div className="tr-sec" style={{ paddingTop: 4 }}>Rayons</div>
            <div className="tr-cats">{sections.map((sec) => <Tile key={sec.name} sec={sec} onClick={() => setAisle(sec)} />)}</div>
          </>}
          {stab === "offers" && (offerItems.length === 0
            ? <div className="t-empty"><div className="ic"><Icon name="percent" size={34} /></div><b>Pas de promo pour le moment</b><p>Revenez bientôt : les réductions de {v.name} apparaîtront ici.</p></div>
            : offerSections.map((sec) => <div key={sec.name}>
              <div className="tr-head" style={{ paddingTop: 18 }}><b>{sec.name}</b><button onClick={() => setAisle({ ...sec })} aria-label={"Tout voir : " + sec.name}><Icon name="arrow_right" size={20} /></button></div>
              <div className="tr-rail">{sec.list.map((p) => <ProductCard key={p.id} p={p} width={150} grid showShop={false} onOpen={setProduct} onQuickAdd={quick} inCart={qtyOf(p.id)} />)}</div>
            </div>))}
          {stab === "again" && (boughtIds === null ? <div className="t-empty"><span className="spinner" /></div>
            : boughtIds.length === 0 ? <div className="t-empty">
              <svg width="150" height="120" viewBox="0 0 150 120" fill="none"><path d="M20 50h110l-12 52a8 8 0 0 1-8 6H40a8 8 0 0 1-8-6z" fill="#8B6CF0" /><path d="M14 44h122v12H14z" rx="6" fill="#7C5CE6" /><circle cx="58" cy="30" r="14" fill="#F5A524" /><path d="M78 40c0-16 8-28 24-30-2 14-10 26-24 30z" fill="#00B492" /><path d="M95 44l-8-30" stroke="#E5484D" strokeWidth="6" strokeLinecap="round" /></svg>
              <b>Recommander, tout simplement</b><p>Les articles que vous commandez ici apparaîtront pour les reprendre en un geste.</p>
              <button className="t-nomatch-btn" onClick={() => setStab("aisles")}>Voir les rayons</button>
            </div>
            : <div className="tr-grid">{items.filter((p) => boughtIds.includes(Number(p.id))).map((p) => <ProductCard key={p.id} p={p} width="100%" grid showShop={false} onOpen={setProduct} onQuickAdd={quick} inCart={qtyOf(p.id)} />)}</div>)}
          <div style={{ height: 90 }} />
        </div>
      </div>}

      {catsPage && <div className="tr-page">
        <div className="hd"><button className="t-back" onClick={() => setCatsPage(false)} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><b>Catégories</b></div>
        <div className="sb" onClick={() => { setCatsPage(false); setQ(""); }} role="button"><Icon name="search" size={22} color="var(--t-text)" /><span style={{ color: "var(--t-sub)", fontSize: 16 }}>Que cherchez-vous ?</span></div>
        <div className="t-scr"><div className="tr-cats">{sections.map((sec) => <Tile key={sec.name} sec={sec} onClick={() => { setCatsPage(false); setAisle(sec); }} />)}</div></div>
      </div>}

      {aisle && <div className="tr-page">
        <div className="hd"><button className="t-back" onClick={() => { setAisle(null); setAisleQ(""); }} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><b>{aisle.name}</b></div>
        <div className="sb"><Icon name="search" size={22} color="var(--t-text)" /><input placeholder={`Rechercher chez ${v.name}`} value={aisleQ} onChange={(e) => setAisleQ(e.target.value)} /></div>
        <div className="t-scr">
          <div className="tr-grid">
            {aisle.list.filter((p) => !aisleQ || (p.name + " " + (p.description || "")).toLowerCase().includes(aisleQ.toLowerCase()))
              .map((p) => <ProductCard key={p.id} p={p} width="100%" grid showShop={false} onOpen={setProduct} onQuickAdd={quick} inCart={qtyOf(p.id)} />)}
          </div>
        </div>
      </div>}

      {infoSheet && <Sheet onClose={() => setInfoSheet(null)}>
        <div style={{ padding: "6px 20px 18px", textAlign: "center" }}>
          <div style={{ width: 96, height: 96, margin: "6px auto 10px", borderRadius: 48, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={infoSheet === "points" ? "gift" : "award"} size={52} color="var(--acc)" /></div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{infoSheet === "points" ? "Gagnez des points" : "Carte de fidélité"}</div>
          <div className="t-card" style={{ margin: "18px 0 0", padding: "18px 16px", fontSize: 15, lineHeight: 1.5 }}>
            {infoSheet === "points" ? `1 point pour chaque tranche de ${fmt(loyaltyRules().per || 0)} commandée, dans toutes les boutiques. Dès ${loyaltyRules().min || 0} points, utilisez-les comme réduction au paiement.`
              : `Dépensez au moins ${fmt(card?.min_spend || 0).replace("FCFA", "F")} chez ${v.name} pour gagner un tampon. Au bout de ${card?.punches_required || 0} tampons, ${fmt(card?.reward_amount || 0).replace("FCFA", "F")} sont déduits automatiquement de votre commande.`}
          </div>
        </div>
        <div style={{ padding: "4px 16px 16px" }}><button className="t-cta center" style={{ width: "100%", justifyContent: "center", fontSize: 17 }} onClick={() => setInfoSheet(null)}>Compris</button></div>
      </Sheet>}

      {listOpen && <div className="tr-page">
        <div className="hd"><button className="t-back" onClick={() => setListOpen(false)} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><b>Ma liste de courses</b></div>
        <div className="t-scr">
          <p style={{ padding: "0 16px", fontSize: 14, color: "var(--t-sub)" }}>Un article par ligne : nous trouvons tout chez {v.name}.</p>
          <textarea className="t-note" style={{ margin: "12px 16px 0", width: "calc(100% - 32px)", minHeight: 110 }} autoFocus placeholder={"lait\nriz\ntomates"} value={listText} onChange={(e) => setListText(e.target.value)} />
          {listLines.map((ln) => {
            const found = items.filter((p) => norm(p.name + " " + (p.description || "") + " " + p.cat).includes(norm(ln)));
            return <div key={ln}>
              <div className="tr-head" style={{ paddingTop: 20 }}><b>{ln}</b><span className="t-sub" style={{ fontSize: 13 }}>{found.length ? `${found.length} article${found.length > 1 ? "s" : ""}` : "introuvable"}</span></div>
              {found.length > 0 && <div className="tr-rail">{found.map((p) => <ProductCard key={p.id} p={p} width={150} grid showShop={false} onOpen={setProduct} onQuickAdd={quick} inCart={qtyOf(p.id)} />)}</div>}
            </div>;
          })}
          <div style={{ height: 40 }} />
        </div>
      </div>}

      {closedSheet && <ClosedSheet st={st} onStay={() => setClosedSheet(false)} onClose={() => setClosedSheet(false)} onLeave={() => { setClosedSheet(false); onBack?.(); }} />}

      {outP && <ProductSheet p={outP} storeName={v.name} parked={entered} onStore={enterStore} onClose={() => onBack?.()} retail={retail} similar={similarTo(outP)} onOpen={(x) => { enterStore(); setProduct(x); }} />}
      {product && <ProductSheet key={product.id} p={product} storeName={v.name} onClose={() => setProduct(null)} retail={retail} similar={similarTo(product)} onOpen={setProduct} />}

      {/* Infos boutique (comme Toters) */}
      {info && <Sheet onClose={() => setInfo(false)} title={v.name}>
        <div style={{ padding: "4px 20px 20px" }}>
          {(detail?.description || v.description) && <p style={{ fontSize: 14, color: "var(--t-sub)", lineHeight: 1.5, marginBottom: 14 }}>{detail?.description || v.description}</p>}
          {(detail?.address || v.loc) && <a className="ti-row" style={{ textDecoration: "none" }} target="_blank" rel="noreferrer"
            href={detail?.latitude ? `https://www.google.com/maps?q=${detail.latitude},${detail.longitude}` : `https://www.google.com/maps/search/${encodeURIComponent([detail?.address, detail?.city].filter(Boolean).join(", ") || v.loc)}`}>
            <span className="ic"><Icon name="map_pin" size={20} color="var(--t-sub)" /></span><span>{[detail?.address, detail?.city].filter(Boolean).join(", ") || v.loc}</span><Icon name="arrow_up_right" size={20} />
          </a>}
          <button className="ti-row" onClick={() => setHoursOpen((x) => !x)}>
            <span className="ic"><Icon name="clock" size={20} color="var(--t-sub)" /></span><span>{st.open ? (detail?.closes_at ? `Ouvert jusqu'à ${hm(String(detail.closes_at).slice(-8))}` : "Ouvert") : st.preorder ? st.label : "Fermé"}</span><Icon name={hoursOpen ? "chevron_up" : "chevron_down"} size={20} />
          </button>
          {hoursOpen && <div style={{ padding: "0 0 10px 54px" }}>
            {hours.length ? [1, 2, 3, 4, 5, 6, 0].map((d) => {
              const h = hours.find((x) => Number(x.day) === d);
              const today = new Date().getDay() === d;
              return <div key={d} className="t-row" style={{ fontWeight: today ? 700 : 400, fontSize: 14 }}><span>{DAYS[d]}</span><span style={{ color: !h || Number(h.is_closed) ? "var(--t-mut)" : "inherit" }}>{!h || Number(h.is_closed) ? "Fermé" : `${hm(h.open_time)} – ${hm(h.close_time)}`}</span></div>;
            }) : <div className="t-sub" style={{ fontSize: 14 }}>Horaires non renseignés</div>}
          </div>}
          <div className="ti-row" style={{ cursor: "default" }}><span className="ic"><Icon name="cash" size={20} color="var(--t-sub)" /></span><span>Paiement en espèces à la livraison{v.minOrder > 0 ? ` · minimum ${fmt(v.minOrder).replace("FCFA", "F")}` : ""}</span></div>
          <button className="ti-row" onClick={() => { setInfo(false); loadReviews(); }}>
            <span className="ic"><Icon name="star_full" size={20} color="var(--acc)" /></span><span>{v.rating > 0 ? <><b>{Number(v.rating).toFixed(1)}</b> <span className="t-sub">({v.reviewsCount || 0} avis)</span></> : "Pas encore de note"}</span><Icon name="chevron_right" size={20} />
          </button>
        </div>
      </Sheet>}

      {/* Avis (page comme Toters) */}
      {reviews && <div className="tr-page" style={{ background: "var(--t-page)" }}>
        <div className="hd" style={{ background: "var(--card)" }}><button className="t-back" onClick={() => setReviews(null)} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><b>{v.name}</b></div>
        <div className="t-scr" style={{ background: "var(--t-page)" }}>
          <div style={{ background: "var(--card)", marginBottom: 14 }}>
            <div className="tv-top">
              <span className="big">{v.rating > 0 ? Number(v.rating).toFixed(1) : "–"}</span>
              <div><div style={{ display: "flex", gap: 3 }}>{[1, 2, 3, 4, 5].map((k) => <Icon key={k} name="star_full" size={26} color={k <= Math.round(v.rating || 0) ? "var(--acc)" : "#DDD"} />)}</div>
                <div className="t-sub" style={{ fontSize: 13 }}>Sur {v.reviewsCount || reviews.length} avis</div></div>
            </div>
            <div className="tv-bars">
              {[5, 4, 3, 2, 1].map((n) => {
                const pc = reviews.length ? Math.round((reviews.filter((r) => r.rating === n).length / reviews.length) * 100) : 0;
                const col = n >= 4 ? "var(--acc)" : n === 3 ? "#F5A524" : "#E5484D";
                return <div key={n} className="tv-bar"><span className="st">{Array.from({ length: n }).map((_, k) => <Icon key={k} name="star_full" size={13} color={col} />)}</span><span className="tr"><i style={{ width: pc + "%", background: col }} /></span><span className="pc">{pc} %</span></div>;
              })}
            </div>
          </div>
          {reviews.length === 0 && <div className="t-empty"><p>Pas encore d'avis pour cette boutique.</p></div>}
          {reviews.map((r, i) => (
            <div key={i} className="tv-card">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><b style={{ fontSize: 15 }}>{r.name}</b><span style={{ display: "flex", gap: 1 }}>{[1, 2, 3, 4, 5].map((k) => <Icon key={k} name="star_full" size={13} color={k <= r.rating ? "var(--acc)" : "#DDD"} />)}</span><span className="t-mut" style={{ marginLeft: "auto" }}>{r.date}</span></div>
              {r.text && <div style={{ fontSize: 14, color: "var(--t-sub)", lineHeight: 1.45, marginTop: 6 }}>{r.text}</div>}
              {r.reply && <div style={{ marginTop: 8, padding: "10px 12px", borderRadius: 12, background: "var(--t-bg2)", fontSize: 14 }}><b style={{ color: "var(--acc)" }}>Réponse :</b> {r.reply}</div>}
            </div>
          ))}
          <div style={{ height: 30 }} />
        </div>
      </div>}
    </div>
  );
}
