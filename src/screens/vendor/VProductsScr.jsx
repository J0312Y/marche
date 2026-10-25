import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import Img from "../../components/Img";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonList } from "../../components/Loading";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";

const FILTERS = [["all", "Tous"], ["on", "Visibles"], ["off", "Masqués"], ["out", "En rupture"]];

/** Catalogue du commerce (GET /vendor/articles) : visibilité par article, accès à la fiche. */
function VProductsScr({ go, onBack }) {
  const [filter, setFilter] = useState("all");
  const [toggles, setToggles] = useState({});
  const { data, loading, reload } = useLoad(() => vendor.getArticles());
  // Champs de l'API : is_active, stock (-1 = illimité), total_sold, category_name, menu_section
  const products = (data || []).map((p) => ({
    ...p,
    section: p.menu_section || p.category_name || "Autres",
    sold: parseInt(p.total_sold || 0, 10),
    photo: p.thumbnail_url || p.image,
    stock: p.stock === null || p.stock === undefined ? -1 : Number(p.stock),
    active: toggles[p.id] !== undefined ? toggles[p.id] : Number(p.is_active) === 1,
    blocked: !!p.blocked_at, // retiré par l'équipe Lamuka : reste hors ligne
  }));

  const toggle = async (p, ev) => {
    ev.stopPropagation();
    if (p.blocked) { toast.error("Article retiré par l'équipe Lamuka : contactez le support pour le remettre en ligne"); return; }
    const next = !p.active;
    setToggles((t) => ({ ...t, [p.id]: next }));
    try { await vendor.updateArticle(p.id, { is_active: next ? 1 : 0 }); toast.success(next ? "Article visible par les clients" : "Article masqué"); }
    catch { setToggles((t) => ({ ...t, [p.id]: !next })); toast.error("Impossible de modifier l'article"); }
  };

  const shown = products.filter((p) => filter === "all" || (filter === "on" ? p.active : filter === "off" ? !p.active : p.stock === 0));
  const sections = [];
  shown.forEach((p) => { let s = sections.find((x) => x.name === p.section); if (!s) sections.push(s = { name: p.section, items: [] }); s.items.push(p); });

  return (
    <PullToRefresh onRefresh={reload}>
      <div className="t-scr gray" style={{ minHeight: "100%" }}>
        <div className="t-sticky">
          <div className="t-head">
            {onBack && <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>}
            <h1>Catalogue{products.length ? ` (${products.length})` : ""}</h1>
            {products.length > 0 && <button className="t-pill-btn" style={{ height: 36, marginLeft: "auto", marginRight: 8 }} onClick={() => go("vSections")}><Icon name="grid_plus" size={16} />Rayons</button>}
            <button className="t-pill-btn" style={{ height: 36, background: "var(--acc)", color: "#fff" }} onClick={() => go("vAddProduct")}><Icon name="plus" size={16} color="#fff" />Ajouter</button>
          </div>
          <div className="t-chips" style={{ display: "flex", gap: 8, padding: "0 16px 12px", overflowX: "auto" }}>
            {FILTERS.map(([k, l]) => <button key={k} className={"t-chip" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>{l}</button>)}
          </div>
        </div>

        {loading ? <div style={{ padding: 16 }}><SkeletonList hasImage /></div>
          : shown.length === 0
            ? <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ fontWeight: 600 }}>{products.length ? "Aucun article ici" : "Votre catalogue est vide"}</div>
              <div className="t-sub" style={{ marginTop: 4 }}>{products.length ? "Changez de filtre." : "Ajoutez vos premiers articles pour commencer à vendre."}</div>
            </div>
            : sections.map((s) => (
              <div key={s.name}>
                <div className="tk-h" style={{ margin: "18px 16px 0" }}>{s.name}</div>
                <div className="t-card tk-box" style={{ padding: "0 16px" }}>
                  {s.items.map((p, i) => (
                    <div key={p.id} onClick={() => go("vEditProduct", p)} role="button" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: i ? "1px solid var(--t-line)" : "none", cursor: "pointer", opacity: p.active ? 1 : 0.55 }}>
                      <Img src={p.photo} style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0 }} fit="cover" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                        <div style={{ fontSize: 15, marginTop: 2 }}>{fmt(Number(p.price) || 0)}</div>
                        {p.blocked && <div style={{ fontSize: 13, color: "#B42318", fontWeight: 600, marginTop: 2 }}>Retiré par Lamuka · {p.blocked_reason}</div>}
                        <div className="t-mut">{p.stock === 0 ? <span style={{ color: "#B42318" }}>En rupture</span> : p.stock > 0 ? `${p.stock} en stock` : "Toujours disponible"}{p.sold ? ` · ${p.sold} vendu${p.sold > 1 ? "s" : ""}` : ""}</div>
                      </div>
                      <button className={"t-toggle" + (p.active ? " on" : "")} style={p.blocked ? { opacity: 0.4 } : undefined} onClick={(ev) => toggle(p, ev)} aria-label={p.blocked ? "Article retiré par Lamuka" : p.active ? "Masquer l'article" : "Afficher l'article"} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        <div style={{ height: 20 }} />
      </div>
    </PullToRefresh>
  );
}

export default VProductsScr;
