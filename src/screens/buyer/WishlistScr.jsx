import { useState } from "react";
import { useData } from "../../hooks";
import { useApp } from "../../context/AppContext";
import useFollowed from "../../hooks/useFollowed";
import Icon from "../../components/Icon";
import StoreCard from "../../components/t/StoreCard";
import ProductCard from "../../components/t/ProductCard";

/**
 * Favoris : boutiques (cœur sur les cartes) et articles.
 */
export default function WishlistScr({ go, onBack }) {
  const { P, VENDORS } = useData();
  const { favs } = useApp();
  const { isFollowed, toggle } = useFollowed();
  const [tab, setTab] = useState("stores");
  const stores = VENDORS.filter((v) => isFollowed(v.id));
  const items = P.filter((p) => favs.includes(p.id));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--card)" }}>
      <div className="t-head"><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Favoris</h1></div>
      <div className="t-seg">
        <button className={tab === "stores" ? "on" : ""} onClick={() => setTab("stores")}>Boutiques ({stores.length})</button>
        <button className={tab === "items" ? "on" : ""} onClick={() => setTab("items")}>Articles ({items.length})</button>
      </div>
      <div className="t-scr" style={{ paddingTop: 16 }}>
        {tab === "stores" && (stores.length ? stores.map((v) => <StoreCard key={v.id} v={v} onOpen={(x) => go("vendor", x)} fav onFav={toggle} />)
          : <div className="t-empty"><div className="ic"><Icon name="heart" size={34} /></div><b>Aucune boutique favorite</b><p>Touchez le cœur d'une boutique pour la retrouver ici.</p></div>)}
        {tab === "items" && (items.length ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 16px" }}>
          {items.map((p) => <ProductCard key={p.id} p={p} width="100%" onOpen={(x) => go("detail", x)} />)}
        </div> : <div className="t-empty"><div className="ic"><Icon name="heart" size={34} /></div><b>Aucun article favori</b><p>Touchez le cœur sur la fiche d'un article.</p></div>)}
        <div style={{ height: 30 }} />
      </div>
    </div>
  );
}
