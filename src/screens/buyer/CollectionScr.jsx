import Icon from "../../components/Icon";
import StoreCard from "../../components/t/StoreCard";
import ProductCard from "../../components/t/ProductCard";
import { useData } from "../../hooks";
import { useApp } from "../../context/AppContext";
import useFollowed from "../../hooks/useFollowed";
import { applyFilter, sortStores } from "../../config/verticals";

/**
 * Page de collection (Toters « Now on Toters 💥 ») : titre, sous-titre gris, liste.
 * data : { title, subtitle, filter } (boutiques) ou { title, subtitle, items: "trending" } (articles)
 */
export default function CollectionScr({ data = {}, go, onBack }) {
  const { VENDORS, P } = useData();
  const { cart } = useApp();
  const { isFollowed, toggle } = useFollowed();
  const stores = VENDORS.filter((v) => v.status === undefined || v.status === "active");
  const list = data.filter === "new"
    ? [...stores].sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))).slice(0, 12)
    : sortStores(applyFilter(stores, data.filter));
  const off = (p) => (p.old > p.price ? 1 - p.price / p.old : 0);
  const typeOf = (p) => VENDORS.find((v) => Number(v.id) === Number(p.establishmentId))?.type;
  const items = data.items === "trending" ? P.filter((p) => p.photo).sort((a, b) => (b.sold || 0) - (a.sold || 0) || (b.rating || 0) - (a.rating || 0)).slice(0, 30)
    : data.items === "deals" ? P.filter((p) => off(p) > 0).sort((a, b) => off(b) - off(a))
    : data.items === "grocery" ? P.filter((p) => off(p) > 0 && ["supermarche", "pharmacie"].includes(typeOf(p)))
    : [];
  const qty = (id) => cart.filter((c) => Number(c.article_id) === Number(id)).reduce((s, c) => s + (parseInt(c.quantity, 10) || 1), 0);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--card)" }}>
      <div className="t-head"><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1 className="tc-h" style={{ marginLeft: 0 }}>{data.title}</h1></div>
      <div className="t-scr">
        {data.subtitle && <p style={{ padding: "0 16px 16px", fontSize: 15, color: "var(--t-sub)", lineHeight: 1.45 }}>{data.subtitle}</p>}
        {data.items ? <div className="tr-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {items.map((p) => <ProductCard key={p.id} p={p} width="100%" onOpen={(x) => go("detail", x)} onQuickAdd={(x) => go("detail", x)} inCart={qty(p.id)} />)}
        </div>
          : list.length ? list.map((v) => <StoreCard key={v.id} v={v} onOpen={(x) => go("vendor", x)} fav={isFollowed(v.id)} onFav={toggle} />)
          : <div className="t-empty"><div className="ic"><Icon name="store" size={34} /></div><b>Rien pour le moment</b><p>Revenez bientôt.</p></div>}
        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}
