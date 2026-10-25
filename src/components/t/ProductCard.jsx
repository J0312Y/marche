import Img from "../Img";
import Icon from "../Icon";
import { fmt } from "../../utils/helpers";

/** Carte produit verticale (tendances, populaires) avec bouton « + » */
/** grid : variante « commerce de détail » de Toters (prix au-dessus du nom, rupture en rouge) */
export default function ProductCard({ p, onOpen, onQuickAdd, showShop = true, inCart = 0, width, grid = false }) {
  const oos = p.stock !== null && p.stock !== undefined && p.stock >= 0 && p.stock <= 0;
  const w = width || 150;
  return (
    <div className={"t-prod" + (grid ? " grid" : "") + (oos ? " oos" : "")} style={{ width: w }} onClick={() => onOpen(p)}>
      <div className="ph" style={{ width: w, height: typeof w === "number" ? w : "auto", aspectRatio: "1" }}>
        {p.photo ? <Img src={p.photo} alt={p.name} fit="cover" style={{ width: "100%", height: "100%" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--t-bg2)" }}><Icon name="bag" size={36} color="var(--t-mut)" /></div>}
        {p.old > p.price && <span className="t-off">−{Math.round((1 - p.price / p.old) * 100)} %</span>}
        {oos ? (grid ? null : <span className="na-pill">Indisponible</span>)
          : onQuickAdd && <button className="t-plus" onClick={(e) => { e.stopPropagation(); onQuickAdd(p); }} aria-label="Ajouter">
            {inCart > 0 ? <span className="n">{inCart}</span> : <Icon name="plus" size={20} color="var(--acc)" strokeWidth={2.6} />}
          </button>}
      </div>
      {showShop && <div className="shop">{p.vendor}</div>}
      {grid ? <>
        <div className={"pr" + (p.old > p.price ? " promo" : "")} style={{ marginTop: 8 }}>{fmt(p.price)}{p.old > p.price && <span className="old">{fmt(p.old)}</span>}</div>
        <div className="nm" style={{ marginTop: 2 }}>{p.name}</div>
        {oos && <div className="oos-t">Rupture de stock</div>}
      </> : <>
        <div className="nm" style={showShop ? undefined : { marginTop: 8 }}>{p.name}{p.calories != null && p.calories !== "" && <span style={{ fontSize: 12, color: "var(--t-sub)", marginLeft: 6 }}>{p.calories} cal</span>}</div>
        <div className={"pr" + (p.old > p.price && !showShop ? " promo" : "")}>{fmt(p.price)}{p.old > p.price && <span className="old">{fmt(p.old)}</span>}</div>
        {showShop && p.old > p.price && <div className="save">ÉCONOMISEZ {fmt(p.old - p.price).replace("FCFA", "F")}</div>}
      </>}
    </div>
  );
}
