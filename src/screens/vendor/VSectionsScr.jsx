import { useEffect, useState } from "react";
import toast from "../../utils/toast";
import Img from "../../components/Img";
import Icon from "../../components/Icon";
import Sheet from "../../components/t/Sheet";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonList } from "../../components/Loading";

/** Clé de comparaison des rayons (même règle que Sections_lib::key côté serveur) : « Boisson » = « boissons » */
const sectionKey = (n) => String(n || "").replace(/&/g, " et ").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim()
  .split(" ").map((w) => (w.length > 3 ? w.replace(/[sx]$/, "") : w)).join(" ");

/** Rayons dans l'ordre de l'API (sort_order) : [{name, own, items}] */
function buildSections(articles) {
  const out = [];
  (articles || []).forEach((p) => {
    const own = !!(p.menu_section && p.menu_section.trim());
    const name = own ? p.menu_section : p.category_name || "Autres";
    let s = out.find((x) => x.name === name); // même regroupement que la page boutique
    if (!s) out.push(s = { name, own, items: [] });
    s.own = s.own || own;
    s.items.push({ id: Number(p.id), name: p.name, photo: p.thumbnail_url || p.image, active: Number(p.is_active) === 1 });
  });
  const seen = {};
  out.forEach((s) => { const k = sectionKey(s.name); s.duplicateOf = seen[k] || null; if (!seen[k]) seen[k] = s.name; });
  return out;
}

const move = (list, i, d) => { const j = i + d; if (j < 0 || j >= list.length) return list; const n = [...list]; [n[i], n[j]] = [n[j], n[i]]; return n; };

function Arrows({ onUp, onDown, first, last, label }) {
  return (
    <span style={{ display: "flex", gap: 4, flexShrink: 0 }}>
      <button className="t-round-btn" disabled={first} style={{ width: 36, height: 36, opacity: first ? 0.3 : 1 }} onClick={(e) => { e.stopPropagation(); onUp(); }} aria-label={"Monter " + label}><Icon name="chevron_up" size={20} /></button>
      <button className="t-round-btn" disabled={last} style={{ width: 36, height: 36, opacity: last ? 0.3 : 1 }} onClick={(e) => { e.stopPropagation(); onDown(); }} aria-label={"Descendre " + label}><Icon name="chevron_down" size={20} /></button>
    </span>
  );
}

/** Rayons du commerce : ordre des rayons et des articles, renommer, fusionner, retirer. */
function VSectionsScr({ onBack }) {
  const { data, loading, reload } = useLoad(() => vendor.getArticles());
  const [sections, setSections] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [open, setOpen] = useState(null); // rayon déplié (articles)
  const [edit, setEdit] = useState(null); // rayon dans la feuille d'actions
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (data) { setSections(buildSections(data)); setDirty(false); } }, [data]);

  const reorder = (fn) => { setSections(fn); setDirty(true); };
  const saveOrder = async () => {
    setBusy(true);
    try { await vendor.orderSections(sections.map((s) => ({ name: s.name, ids: s.items.map((p) => p.id) }))); setDirty(false); toast.success("Ordre enregistré : vos clients voient vos rayons dans cet ordre"); }
    catch { toast.error("Impossible d'enregistrer l'ordre"); }
    setBusy(false);
  };

  // Renommer / fusionner / retirer (to = null) : l'ordre en cours est enregistré d'abord pour ne pas le perdre
  const rename = async (from, to, done) => {
    setBusy(true);
    try {
      if (dirty) await vendor.orderSections(sections.map((s) => ({ name: s.name, ids: s.items.map((p) => p.id) })));
      await vendor.renameSection(from, to);
      toast.success(done);
      setEdit(null); reload();
    } catch (e) { toast.error(e?.message || "Impossible de modifier le rayon"); }
    setBusy(false);
  };

  const openEdit = (s) => { setEdit(s); setNewName(s.name); };

  return (
    <div className="t-scr gray" style={{ minHeight: "100%" }}>
      <div className="t-sticky">
        <div className="t-head">
          {onBack && <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>}
          <h1>Mes rayons</h1>
          {dirty && <button className="t-pill-btn" style={{ height: 36, background: "var(--acc)", color: "#fff" }} disabled={busy} onClick={saveOrder}><Icon name="check" size={16} color="#fff" />Enregistrer</button>}
        </div>
      </div>
      <div className="t-sub" style={{ padding: "4px 16px 0" }}>Vos clients voient vos articles rangés dans cet ordre. Touchez un rayon pour ranger ses articles.</div>

      {loading && !sections.length ? <div style={{ padding: 16 }}><SkeletonList /></div>
        : !sections.length
          ? <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontWeight: 600 }}>Aucun rayon pour l'instant</div>
            <div className="t-sub" style={{ marginTop: 4 }}>Indiquez un rayon (section) quand vous ajoutez un article.</div>
          </div>
          : <div className="t-card tk-box" style={{ padding: "0 16px", marginTop: 14 }}>
            {sections.map((s, i) => (
              <div key={s.name} style={{ borderTop: i ? "1px solid var(--t-line)" : "none" }}>
                <div role="button" onClick={() => setOpen(open === s.name ? null : s.name)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", cursor: "pointer" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                    <div className="t-mut">{s.items.length} article{s.items.length > 1 ? "s" : ""}{!s.own ? " · nom de la catégorie" : ""}</div>
                    {s.duplicateOf && <button className="t-chip on" style={{ height: 28, marginTop: 6 }} disabled={busy} onClick={(e) => { e.stopPropagation(); rename(s.name, s.duplicateOf, `« ${s.name} » fusionné dans « ${s.duplicateOf} »`); }}>Doublon de « {s.duplicateOf} » : fusionner</button>}
                  </div>
                  <Arrows label={s.name} first={i === 0} last={i === sections.length - 1} onUp={() => reorder((l) => move(l, i, -1))} onDown={() => reorder((l) => move(l, i, 1))} />
                  <button className="t-round-btn" style={{ width: 36, height: 36 }} onClick={(e) => { e.stopPropagation(); openEdit(s); }} aria-label={"Modifier le rayon " + s.name}><Icon name="more_h" size={20} /></button>
                </div>
                {open === s.name && <div style={{ padding: "0 0 10px 8px" }}>
                  {s.items.map((p, j) => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", opacity: p.active ? 1 : 0.55 }}>
                      <Img src={p.photo} style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} fit="cover" />
                      <div style={{ flex: 1, minWidth: 0, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                      <Arrows label={p.name} first={j === 0} last={j === s.items.length - 1}
                        onUp={() => reorder((l) => l.map((x, k) => (k === i ? { ...x, items: move(x.items, j, -1) } : x)))}
                        onDown={() => reorder((l) => l.map((x, k) => (k === i ? { ...x, items: move(x.items, j, 1) } : x)))} />
                    </div>
                  ))}
                </div>}
              </div>
            ))}
          </div>}
      <div style={{ height: 20 }} />

      {edit && <Sheet onClose={() => setEdit(null)}>
        <div style={{ padding: "6px 20px 18px" }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{edit.name}</div>
          <div className="t-sub" style={{ marginTop: 4 }}>{edit.items.length} article{edit.items.length > 1 ? "s" : ""}</div>

          <div style={{ fontWeight: 600, marginTop: 18 }}>Renommer</div>
          <div className="t-field" style={{ marginTop: 8 }}><input className="t-input" value={newName} maxLength={80} onChange={(e) => setNewName(e.target.value)} placeholder="Nom du rayon" /></div>
          <button className="t-cta center" style={{ width: "100%", height: 48, justifyContent: "center", marginTop: 10 }} disabled={busy || !newName.trim() || newName.trim() === edit.name}
            onClick={() => rename(edit.name, newName, "Rayon renommé")}>Renommer</button>

          {sections.length > 1 && <>
            <div style={{ fontWeight: 600, marginTop: 20 }}>Fusionner dans un autre rayon</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {sections.filter((x) => x.name !== edit.name).map((x) => <button key={x.name} className="t-chip" style={{ height: 32 }} disabled={busy} onClick={() => rename(edit.name, x.name, `Articles déplacés dans « ${x.name} »`)}>{x.name}</button>)}
            </div>
          </>}

          {edit.own && <button className="t-cta ghost center" style={{ width: "100%", height: 48, justifyContent: "center", marginTop: 20, color: "#B42318" }} disabled={busy}
            onClick={() => rename(edit.name, null, "Rayon retiré : les articles sont rangés par catégorie")}>Retirer ce rayon</button>}
          {edit.own && <div className="t-mut" style={{ marginTop: 6, textAlign: "center" }}>Les articles ne sont pas supprimés : ils s'affichent sous leur catégorie.</div>}
        </div>
      </Sheet>}
    </div>
  );
}

export default VSectionsScr;
