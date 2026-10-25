import { useMemo, useRef, useState } from "react";
import useBackClose from "../../hooks/useBackClose";
import Img from "../Img";
import Icon from "../Icon";
import Sheet from "./Sheet";
import ImageViewer from "./ImageViewer";
import { fmt } from "../../utils/helpers";
import { optionsDelta, optionsError } from "../../utils/cartMath";
import { useApp } from "../../context/AppContext";
import { shareProduct } from "../../utils/share";

/**
 * Fiche produit plein écran (monte du bas) : options obligatoires / facultatives, consigne, quantité.
 * Le panier ne contient qu'une boutique (comme Toters) : sinon on propose d'en démarrer un nouveau.
 */
export default function ProductSheet({ p, onClose, storeName, parked = false, onStore }) {
  const [more, setMore] = useState(false);
  const longDesc = (p.description || "").length > 130;
  // Contenance (comme Toters : « 500 g », « 1 pièce »)
  const size = p.weight ? `${p.weight} g` : p.unit && p.unit !== "pièce" ? `1 ${p.unit}` : "";
  useBackClose(true, () => onClose(false));
  // Après un passage par la boutique : l'article revient en glissant
  const wasParked = useRef(false);
  const cls = "t-pd" + (parked ? " parked" : wasParked.current ? " unpark" : "");
  wasParked.current = parked || (wasParked.current && !parked ? true : false);
  const { addToCart, cart, clearCart, isFav, toggleFav } = useApp();
  const groups = p.optionGroups || [];
  const [sel, setSel] = useState([]); // [{group, name}]
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [conflict, setConflict] = useState(null);
  // Défilement comme Toters : la photo reste en place et s'assombrit, le panneau blanc glisse par-dessus
  const [viewer, setViewer] = useState(false);
  const photos = (p.photos && p.photos.length ? p.photos : [p.photo]).filter(Boolean);
  const imgRef = useRef(null), dimRef = useRef(null), dim2Ref = useRef(null), topRef = useRef(null), raf = useRef(0);
  const onScroll = (e) => {
    const sc = e.currentTarget;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const y = Math.max(0, sc.scrollTop), H = imgRef.current?.offsetHeight || 300, T = topRef.current?.offsetHeight || 80;
      const o = String(Math.min(1, y / (H - T)) * 0.5);
      if (dimRef.current) dimRef.current.style.opacity = o;
      if (dim2Ref.current) dim2Ref.current.style.opacity = o;
      topRef.current?.classList.toggle("solid", y >= H - T - 20);
    });
  }; // nom de la boutique déjà dans le panier
  const oos = p.stock !== null && p.stock !== undefined && p.stock >= 0 && p.stock <= 0;

  const unit = (Number(p.price) || 0) + optionsDelta(groups, sel);
  const has = (g, n) => sel.some((s) => s.group === g && s.name === n);
  const toggle = (g, o) => {
    setErr("");
    setSel((cur) => {
      const on = cur.some((s) => s.group === g.key && s.name === o.name);
      // Choix unique facultatif : un second appui retire le choix
      if (g.type === "single") return on && !g.required ? cur.filter((s) => s.group !== g.key) : [...cur.filter((s) => s.group !== g.key), { group: g.key, name: o.name }];
      if (cur.some((s) => s.group === g.key && s.name === o.name)) return cur.filter((s) => !(s.group === g.key && s.name === o.name));
      const n = cur.filter((s) => s.group === g.key).length;
      if (g.max > 0 && n >= g.max) { setErr(`${g.max} choix maximum`); return cur; }
      return [...cur, { group: g.key, name: o.name }];
    });
  };
  const missing = useMemo(() => optionsError(groups, sel), [groups, sel]);

  const doAdd = async () => {
    setBusy(true);
    const ok = await addToCart(p, qty, { options: sel, note: note.trim() });
    setBusy(false);
    if (ok) onClose(true);
  };
  const add = async () => {
    if (missing) { setErr(missing); return; }
    const other = cart.find((c) => c.establishment_id && p.establishmentId && Number(c.establishment_id) !== Number(p.establishmentId));
    if (other) { setConflict(other.establishment_name || "une autre boutique"); return; }
    await doAdd();
  };

  return (
    <div className={cls}>
      {/* Bande du haut : montre le haut de la photo (assombrie) quand le panneau passe dessous, comme Toters */}
      <div className="t-pd-top" ref={topRef}>
        <div className="t-pd-band">{p.photo && <img src={p.photo} alt="" />}<i ref={dim2Ref} /></div>
        <div className="t-store-top">
          <button className="t-round-btn glass" onClick={() => onClose(false)} aria-label="Fermer"><Icon name="close" size={22} /></button>
          <div style={{ display: "flex", gap: 10 }}>
            {onStore && <button className="t-round-btn glass" onClick={onStore} aria-label="Voir la boutique"><Icon name="store" size={20} /></button>}
            <button className="t-round-btn glass" onClick={() => shareProduct(p)} aria-label="Partager"><Icon name="share" size={20} /></button>
            <button className="t-round-btn glass" onClick={() => toggleFav(p.id)} aria-label="Favori"><Icon name={isFav(p.id) ? "heart-fill" : "heart"} size={20} color={isFav(p.id) ? "var(--acc)" : "currentColor"} /></button>
          </div>
        </div>
        <div className="t-pd-title">{p.name}</div>
      </div>
      <div className="t-scr" style={{ background: "var(--card)" }} onScroll={onScroll}>
        <div className="t-pd-img" ref={imgRef} onClick={() => photos.length && setViewer(true)} role="button" aria-label="Agrandir la photo">
          {p.photo ? <Img src={p.photo} alt={p.name} style={{ width: "100%", height: "100%" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="bag" size={64} color="var(--t-mut)" /></div>}
          <div className="t-pd-dim" ref={dimRef} />
        </div>
        <div className="t-pd-sheet">
          {oos ? <span className="t-oos-b">Rupture de stock</span> : p.old > p.price ? <span className="t-off" style={{ position: "static", display: "inline-block", marginBottom: 10 }}>−{Math.round((1 - p.price / p.old) * 100)} %</span> : null}
          <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.25 }}>{p.name}</div>
          {size && <div style={{ fontSize: 14, color: "var(--t-sub)", marginTop: 2 }}>{size}</div>}
          {p.description && <div style={{ fontSize: 15, color: "var(--t-sub)", marginTop: 8, lineHeight: 1.5 }}>
            {longDesc && !more ? <>{p.description.slice(0, 110).trim()}… <span style={{ color: "var(--acc)", fontWeight: 600, cursor: "pointer" }} onClick={() => setMore(true)}>Lire plus</span></> : p.description}
          </div>}
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 10, color: p.old > p.price ? "#E5484D" : undefined }}>
            {fmt(p.price)}{p.old > p.price && <span style={{ fontSize: 14, color: "var(--t-mut)", textDecoration: "line-through", marginLeft: 8, fontWeight: 500 }}>{fmt(p.old)}</span>}
          </div>

          {groups.map((g) => {
            const n = sel.filter((s) => s.group === g.key).length;
            return (
              <div key={g.key} style={{ borderTop: "1px solid var(--t-line)", marginTop: 18 }}>
                <div className="t-opt-h">
                  <b>{g.label}</b>
                  <span className={"t-req" + (g.required && n === 0 ? " need" : "")}>
                    {g.required ? (n > 0 ? "✓ Choisi" : "Obligatoire") : g.type === "multi" && g.max > 0 ? `${g.max} max · Facultatif` : "Facultatif"}
                  </span>
                </div>
                {g.options.map((o) => (
                  <div key={o.name} className="t-opt" onClick={() => toggle(g, o)} role="button">
                    <div className="l">
                      <div>{o.name}</div>
                      {Number(o.price_delta) > 0 && <small>+ {fmt(o.price_delta)}</small>}
                    </div>
                    {g.type === "single" ? <span className={"t-radio" + (has(g.key, o.name) ? " on" : "")} />
                      : <span className={"t-check" + (has(g.key, o.name) ? " on" : "")}>{has(g.key, o.name) && <Icon name="check" size={16} color="#fff" strokeWidth={3} />}</span>}
                  </div>
                ))}
              </div>
            );
          })}

          <div style={{ borderTop: "1px solid var(--t-line)", marginTop: 18, paddingTop: 18 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Une consigne particulière ?</div>
            <textarea className="t-note" maxLength={200} placeholder="Dites-le nous ici." value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div style={{ height: 24 }} />
        </div>
      </div>
      {err && <div style={{ background: "#FEE2E2", color: "#B91C1C", fontSize: 14, fontWeight: 600, padding: "10px 16px", textAlign: "center" }}>{err}</div>}
      {oos ? <div className="t-bottom" style={{ justifyContent: "center", height: 72 }}><span style={{ color: "#E5484D", fontSize: 18, fontWeight: 600 }}>Rupture de stock</span></div>
      : <div className="t-bottom">
        <div className="t-stepper">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Moins" disabled={qty <= 1} style={{ opacity: qty <= 1 ? 0.35 : 1 }}><Icon name="minus" size={24} strokeWidth={2.6} /></button>
          <b>{qty}</b>
          <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Plus"><Icon name="plus" size={24} strokeWidth={2.6} /></button>
        </div>
        <button className="t-cta" disabled={busy || oos} onClick={add}>
          <span>{busy ? "Ajout…" : "Ajouter"}</span><span>{fmt(unit * qty)}</span>
        </button>
      </div>}

      {viewer && <ImageViewer photos={photos} alt={p.name} onClose={() => setViewer(false)} />}
      {conflict && <Sheet onClose={() => setConflict(null)}>
        <div style={{ padding: "10px 20px 22px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Nouveau panier ?</div>
          <div style={{ fontSize: 14, color: "var(--t-sub)", lineHeight: 1.5, marginBottom: 20 }}>
            Votre panier contient des articles de <b style={{ color: "var(--t-text)" }}>{conflict}</b>. Videz-le pour commander chez {storeName || "cette boutique"}.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="t-cta ghost" onClick={() => setConflict(null)}>Annuler</button>
            <button className="t-cta center" onClick={async () => { setConflict(null); await clearCart(); await doAdd(); }}>Nouveau panier</button>
          </div>
        </div>
      </Sheet>}
    </div>
  );
}
