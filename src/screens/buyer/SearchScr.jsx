import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../components/Icon";
import Img from "../../components/Img";
import Sheet from "../../components/t/Sheet";
import HeaderCart from "../../components/t/HeaderCart";
import { StoreLogo } from "../../components/t/StoreCard";
import { useData } from "../../hooks";
import { collectionsAPI } from "../../api";
import { fmt } from "../../utils/helpers";
import { storeStatus, etaLabel } from "../../utils/storeStatus";
import VERTICALS from "../../config/verticals";
import TYPE_LABEL from "../../config/storeTypes";
import useBackClose from "../../hooks/useBackClose";
import { useApp } from "../../context/AppContext";

const RECENT_KEY = "lk-recent-searches";
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const readRecent = () => { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; } };

const KINDS = [{ id: "all", label: "Tout" }, ...VERTICALS.filter((v) => v.id !== "all" && v.id !== "coursier")];
const SORTS = [{ id: "reco", label: "Recommandé", icon: "smile" }, { id: "popular", label: "Populaire", icon: "heart" }, { id: "rating", label: "Note", icon: "star_o" },
  { id: "price_asc", label: "Prix croissant", icon: "arrow_up" }, { id: "price_desc", label: "Prix décroissant", icon: "chevron_down" }];
// Tri rapide des articles, visible au-dessus des résultats (comme Taobao)
const QUICK_SORTS = [["reco", "Pertinence"], ["popular", "Meilleures ventes"], ["price_asc", "Prix ↑"], ["price_desc", "Prix ↓"]];
// Mots d'une caractéristique d'article (options, étiquettes) : filtres rapides sous la recherche
const traitsOf = (p) => {
  const out = new Set();
  (p.optionGroups || []).forEach((g) => (g.options || []).forEach((o) => o.name && out.add(o.name.trim())));
  (p.tags || []).forEach((t) => t && out.add(String(t).trim()));
  return out;
};
// Suggestions « d'après vos visites » : rayon, catégorie et début du nom des derniers articles vus
const suggestFrom = (viewed) => {
  const seen = new Set(), out = [];
  const add = (s) => { const v = String(s || "").trim(); const k = norm(v); if (v.length >= 3 && !seen.has(k)) { seen.add(k); out.push(v); } };
  viewed.slice(0, 5).forEach((p) => { add(p.name?.split(/\s+/).slice(0, 3).join(" ")); add(p.menu_section); add(p.cat); });
  return out.slice(0, 8);
};
// Tranches de prix des articles (FCFA)
const PRICES = [{ id: "low", label: "Petit prix", ok: (p) => p < 2000 }, { id: "mid", label: "Prix moyen", ok: (p) => p >= 2000 && p <= 8000 }, { id: "high", label: "Haut de gamme", ok: (p) => p > 8000 }];
// Fonds pastel des collections (comme Toters)
const PASTELS = ["#CDEFE6", "#F6D9B5", "#D9D2F6", "#C9E7F6", "#DCEBCB", "#F6CFD3", "#D5DADF", "#F2E6B8"];

/**
 * Recherche « Toters » : recherches récentes + collections, puis résultats en deux onglets Boutiques / Articles,
 * filtres par univers, tri et filtres (feuille).
 * data : { category } (catégorie ronde de l'accueil) ou { tab: 'items' }
 */
export default function SearchScr({ go, onBack, defaultTab, category, fromTab }) {
  const { P, VENDORS, CATS } = useData();
  const { recentlyViewed = [] } = useApp();
  const suggestions = useMemo(() => suggestFrom(recentlyViewed), [recentlyViewed]);
  const [trait, setTrait] = useState(null); // filtre rapide (ex. « Noir », « XL », « Bio »)
  const [q, setQ] = useState("");
  const [tab, setTab] = useState(defaultTab === "items" || category ? "items" : "stores");
  const [coll, setColl] = useState(category ? { title: category.name, category_id: Number(category.id) } : null);
  const [collections, setCollections] = useState([]);
  const [recent, setRecent] = useState(readRecent);
  const [kind, setKind] = useState("all");
  const [sort, setSort] = useState("reco");
  const [price, setPrice] = useState(null);
  const [cats, setCats] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { collectionsAPI.getAll().then((r) => setCollections(r?.collections || [])).catch(() => {}); }, []);

  const vendorOf = (p) => VENDORS.find((v) => Number(v.id) === Number(p.establishmentId));
  // Catégories du filtre : seulement celles qui ont des articles, et sans doublon de nom (« Pâtisserie » / « Pâtisseries »)
  const filterCats = useMemo(() => {
    const used = new Set(P.map((p) => Number(p.category_id)));
    const m = new Map();
    CATS.filter((c) => used.has(Number(c.id))).forEach((c) => {
      const k = norm(c.name).trim().replace(/s$/, "");
      if (!m.has(k)) m.set(k, { ...c, ids: [Number(c.id)] });
      else { const g = m.get(k); g.ids.push(Number(c.id)); if (!g.photo && c.photo) g.photo = c.photo; }
    });
    return [...m.values()].sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [P, CATS]);
  const term = norm(q.trim());
  const filtering = price || cats.length > 0 || sort !== "reco";

  const results = useMemo(() => {
    if (!term && !coll && !filtering) return null;
    let items = P, stores = VENDORS;
    if (coll) {
      if (coll.category_id) items = items.filter((p) => Number(p.category_id) === Number(coll.category_id));
      if (coll.commerce_type) { items = items.filter((p) => p.type === coll.commerce_type); stores = stores.filter((v) => v.type === coll.commerce_type); }
      if (coll.keyword) { const k = norm(coll.keyword); items = items.filter((p) => norm(p.name + " " + p.description + " " + p.cat).includes(k)); }
      if (coll.category_id || coll.keyword) { const ids = new Set(items.map((p) => Number(p.establishmentId))); stores = stores.filter((v) => ids.has(Number(v.id))); }
    }
    if (term) {
      items = items.filter((p) => norm(p.name + " " + (p.description || "") + " " + p.cat + " " + p.vendor).includes(term));
      const ids = new Set(items.map((p) => Number(p.establishmentId)));
      stores = stores.filter((v) => norm(v.name + " " + (v.description || "") + " " + v.type).includes(term) || ids.has(Number(v.id)));
    }
    if (kind !== "all") { stores = stores.filter((v) => v.type === kind); items = items.filter((p) => vendorOf(p)?.type === kind); }
    // Prix / catégories : s'appliquent aux articles, et aux boutiques qui en proposent
    if (price || cats.length) {
      const pr = PRICES.find((x) => x.id === price);
      items = items.filter((p) => (!pr || pr.ok(Number(p.price) || 0)) && (!cats.length || cats.includes(Number(p.category_id))));
      const ids = new Set(items.map((p) => Number(p.establishmentId)));
      stores = stores.filter((v) => ids.has(Number(v.id)));
    }
    const open = (v) => (v?.isOpenNow !== false ? 1 : 0);
    if (sort === "popular") {
      items = [...items].sort((a, b) => (b.sold || 0) - (a.sold || 0));
      stores = [...stores].sort((a, b) => (b.products || 0) - (a.products || 0));
    } else if (sort === "price_asc" || sort === "price_desc") {
      const d = sort === "price_asc" ? 1 : -1;
      items = [...items].sort((a, b) => d * ((Number(a.price) || 0) - (Number(b.price) || 0)));
    } else if (sort === "rating") {
      items = [...items].sort((a, b) => (vendorOf(b)?.rating || 0) - (vendorOf(a)?.rating || 0));
      stores = [...stores].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      items = [...items].sort((a, b) => open(vendorOf(b)) - open(vendorOf(a)) || (b.sold || 0) - (a.sold || 0));
      stores = [...stores].sort((a, b) => open(b) - open(a) || (b.rating || 0) - (a.rating || 0));
    }
    return { items, stores };
  }, [term, coll, kind, sort, price, cats, P, VENDORS]); // eslint-disable-line react-hooks/exhaustive-deps
  // Filtres rapides : caractéristiques présentes dans au moins 2 articles trouvés (sans être dans tous)
  const traits = useMemo(() => {
    const list = results?.items || [];
    if (list.length < 3) return [];
    const n = new Map();
    list.forEach((p) => traitsOf(p).forEach((t) => n.set(t, (n.get(t) || 0) + 1)));
    return [...n.entries()].filter(([, c]) => c >= 2 && c < list.length).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);
  }, [results]);
  useEffect(() => { if (trait && !traits.includes(trait)) setTrait(null); }, [traits]); // eslint-disable-line react-hooks/exhaustive-deps
  const shownItems = results ? (trait ? results.items.filter((p) => traitsOf(p).has(trait)) : results.items) : [];

  const remember = (s) => {
    const v = s.trim(); if (v.length < 2) return;
    const next = [v, ...recent.filter((x) => norm(x) !== norm(v))].slice(0, 8);
    setRecent(next); try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
  };
  const openStore = (v) => { remember(q); go("vendor", v); };
  const openItem = (p) => { remember(q); go("detail", p); };
  const reset = () => { setQ(""); setColl(null); setKind("all"); setSort("reco"); setPrice(null); setCats([]); setTrait(null); };

  // Collections : celles du serveur, sinon les catégories du catalogue
  const shownColls = collections.length ? collections : CATS.map((c) => ({ id: "c" + c.id, title: c.name, image: c.photo, category_id: c.id }));
  // Bouton retour Android : depuis des résultats de l'onglet Recherche, on revient à la recherche vide (comme Toters)
  useBackClose(!!fromTab && !!(results || coll), reset);
  const count = results ? (tab === "stores" ? results.stores.length : shownItems.length) : 0;
  const showBack = (!fromTab || coll || results) && !(category && !onBack);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--card)" }}>
      <div className="ts-head">
        {showBack && <button className="t-back" onClick={() => { if (fromTab && (results || coll)) { reset(); return; } if (coll && !category) { setColl(null); return; } onBack ? onBack() : reset(); }} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>}
        <div className="ts-box" onClick={() => inputRef.current?.focus()}>
          <Icon name="search" size={24} strokeWidth={2.2} color="var(--t-text)" />
          <input ref={inputRef} placeholder={coll ? `Rechercher dans ${coll.title}` : suggestions[0] ? `Ex. : ${suggestions[0]}` : "Boutique ou article…"} value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { remember(q); e.currentTarget.blur(); } }} />
          {q && <button className="ts-clear" onClick={(e) => { e.stopPropagation(); setQ(""); inputRef.current?.focus(); }} aria-label="Effacer"><Icon name="close" size={16} strokeWidth={2.6} /></button>}
          <button className={"ts-filter" + (filtering ? " on" : "")} onClick={(e) => { e.stopPropagation(); setFilterOpen(true); }} aria-label="Trier et filtrer"><Icon name="sliders" size={24} strokeWidth={1.8} /></button>
        </div>
        <HeaderCart />
      </div>

      {results && <>
        <div className="t-seg ts-seg">
          <button className={tab === "stores" ? "on" : ""} onClick={() => setTab("stores")}>Boutiques</button>
          <button className={tab === "items" ? "on" : ""} onClick={() => setTab("items")}>Articles</button>
        </div>
      </>}

      <div className="t-scr">
        {!results && <>
          {recent.length > 0 && <>
            <div className="ts-h">Recherches récentes</div>
            <div className="ts-recent">
              {recent.map((r) => <button key={r} onClick={() => { setQ(r); remember(r); }}>{r}</button>)}
            </div>
          </>}
          {suggestions.length > 0 && <>
            <div className="ts-h" style={{ marginTop: recent.length ? 30 : 18 }}>D'après vos visites</div>
            <div className="ts-recent">
              {suggestions.map((s) => <button key={s} onClick={() => { setQ(s); setTab("items"); remember(s); }}><Icon name="sparkle" size={14} color="var(--acc)" /> {s}</button>)}
            </div>
          </>}
          <div className="ts-h" style={{ marginTop: recent.length || suggestions.length ? 30 : 18 }}>Collections</div>
          <div className="ts-coll">
            {shownColls.map((c, i) => (
              <button key={c.id} onClick={() => { setColl({ title: c.title, category_id: c.category_id ? Number(c.category_id) : null, keyword: c.keyword, commerce_type: c.commerce_type }); setTab(c.commerce_type && !c.category_id && !c.keyword ? "stores" : "items"); }}>
                <div className="pill" style={{ background: c.color && c.color !== "#FFF1E6" ? c.color : PASTELS[i % PASTELS.length] }}>
                  {c.image && <span className="pic"><Img src={c.image} alt="" style={{ width: "100%", height: "100%" }} /></span>}
                </div>
                <b>{c.title}</b>
              </button>
            ))}
          </div>
        </>}

        {results && <>
          {coll && <div style={{ padding: "14px 16px 0", fontSize: 20, fontWeight: 600 }}>{coll.title}</div>}
          <div className="ts-kinds">
            {KINDS.map((k) => <button key={k.id} className={kind === k.id ? "on" : ""} onClick={() => setKind(k.id)}>{k.label}</button>)}
          </div>
          {tab === "items" && <div className="ts-kinds" style={{ paddingTop: 8 }}>
            {QUICK_SORTS.map(([k, l]) => <button key={k} className={sort === k ? "on" : ""} onClick={() => setSort(k)}>{l}</button>)}
          </div>}
          {tab === "items" && traits.length > 0 && <div className="t-chips" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "8px 16px 0" }}>
            {traits.map((t) => <button key={t} className={"t-chip" + (trait === t ? " on" : "")} style={{ height: 32 }} onClick={() => setTrait(trait === t ? null : t)}>{t}</button>)}
          </div>}
          <div className="ts-count">{count} résultat{count > 1 ? "s" : ""}{q.trim() ? ` pour « ${q.trim()} »` : ""}</div>
        </>}

        {results && tab === "stores" && (results.stores.length === 0
          ? <div className="t-empty"><div className="ic"><Icon name="store" size={34} /></div><b>Aucune boutique trouvée</b><p>Essayez un autre mot.</p></div>
          : results.stores.map((v) => {
            const st = storeStatus(v);
            return (
              <div key={v.id} className="ts-store" onClick={() => openStore(v)} role="button">
                <span className="logo"><StoreLogo v={v} size={56} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nm">{v.name}</div>
                  <div className="sub">{[TYPE_LABEL[v.type], st.open ? etaLabel(v) : null].filter(Boolean).join(" • ")}</div>
                  <div className="rt">{v.rating > 0 ? <><Icon name="star_full" size={18} color="var(--acc)" />{Number(v.rating).toFixed(1)}</> : <span style={{ color: "var(--acc)", fontWeight: 600 }}>Nouveau</span>}</div>
                  {!st.open && <span className="closed">{st.preorder ? "Précommande" : "Fermé actuellement"}</span>}
                </div>
              </div>
            );
          }))}

        {results && tab === "items" && (shownItems.length === 0
          ? <div className="t-empty"><div className="ic"><Icon name="bag" size={34} /></div><b>Aucun article trouvé</b><p>Vérifiez l'orthographe ou cherchez une boutique.</p></div>
          : shownItems.map((p) => {
            const v = vendorOf(p);
            const st = storeStatus(v);
            const oos = p.stock !== null && p.stock !== undefined && p.stock >= 0 && p.stock <= 0;
            return (
              <div key={p.id} className="ts-item" onClick={() => openItem(p)} role="button">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nm">{p.name}</div>
                  <div className="pr">{fmt(p.price)}{p.old > p.price && <s>{fmt(p.old)}</s>}</div>
                  <div className="sub">{p.vendor}{p.cat ? ` • Dans ${p.cat}` : ""}</div>
                  {p.sold > 0 && <div className="sub">{p.sold >= 1000 ? `${Math.floor(p.sold / 1000)} k+` : p.sold} vendu{p.sold > 1 ? "s" : ""}{Number(p.rating) > 0 ? <> • <Icon name="star_full" size={12} color="#F5A623" /> {Number(p.rating).toFixed(1)}</> : ""}</div>}
                  {(!st.open || oos) && <span className="closed">{oos ? "Rupture de stock" : "Fermé actuellement"}</span>}
                </div>
                <div className="ph">{p.photo ? <Img src={p.photo} alt="" style={{ width: "100%", height: "100%" }} /> : <Icon name="bag" size={28} color="var(--t-mut)" />}</div>
              </div>
            );
          }))}
        <div style={{ height: 40 }} />
      </div>

      {filterOpen && <FilterSheet sort={sort} price={price} cats={cats} CATS={filterCats} onClose={() => setFilterOpen(false)}
        onApply={(f) => { setSort(f.sort); setPrice(f.price); setCats(f.cats); setFilterOpen(false); }} />}
    </div>
  );
}

/** Feuille « Trier par / Filtrer par / Catégories » (comme Toters) */
function FilterSheet({ sort: s0, price: p0, cats: c0, CATS, onClose, onApply }) {
  const [sort, setSort] = useState(s0);
  const [price, setPrice] = useState(p0);
  const [cats, setCats] = useState(c0);
  // Une ligne peut regrouper plusieurs catégories du même nom (ids)
  const toggleCat = (ids) => setCats((c) => (ids.some((x) => c.includes(x)) ? c.filter((x) => !ids.includes(x)) : [...c, ...ids]));
  return (
    <Sheet onClose={onClose} maxHeight="94%">
      <div className="ts-filters">
        <h3>Trier par</h3>
        {SORTS.map((o) => (
          <button key={o.id} className="ts-row" onClick={() => setSort(o.id)}>
            <Icon name={o.icon} size={26} strokeWidth={1.6} /><span>{o.label}</span><i className={"radio" + (sort === o.id ? " on" : "")} />
          </button>
        ))}
        <h3>Filtrer par</h3>
        <div className="chips">
          {PRICES.map((o) => <button key={o.id} className={price === o.id ? "on" : ""} onClick={() => setPrice(price === o.id ? null : o.id)}>{o.label}</button>)}
        </div>
        {CATS.length > 0 && <h3>Catégories</h3>}
        {CATS.map((c) => (
          <button key={c.id} className="ts-row" onClick={() => toggleCat(c.ids || [Number(c.id)])}>
            <span className="cimg">{c.photo ? <Img src={c.photo} alt="" style={{ width: "100%", height: "100%" }} /> : <Icon name="bag" size={22} color="var(--t-mut)" />}</span>
            <span>{c.name}</span><i className={"box" + ((c.ids || [Number(c.id)]).some((x) => cats.includes(x)) ? " on" : "")} />
          </button>
        ))}
      </div>
      <div className="ts-apply"><button className="t-cta center" onClick={() => onApply({ sort, price, cats })}>Appliquer</button></div>
    </Sheet>
  );
}
