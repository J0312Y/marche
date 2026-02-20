import { fmt, disc } from "../../utils/helpers";

/**
 * ProductCard - Carte produit dans les grilles
 * @param {object} product - Objet produit {id, name, img, price, old, rating, reviews, vendor, va, tags, eta}
 * @param {function} onPress - Clic sur la carte (→ détail)
 * @param {function} onReview - Clic sur les étoiles (→ avis)
 * @param {function} toggleFav - Toggle favori
 * @param {function} isFav - Vérifie si favori
 */
function ProductCard({ product: p, onPress, onReview, toggleFav, isFav }) {
  const d = disc(p);
  const fav = isFav && isFav(p.id);

  return (
    <div className="pcard" onClick={onPress}>
      <div className="pimg">
        <span className="pe">{p.img}</span>
        {d > 0 && <span className="badge">-{d}%</span>}
        {p.tags && p.tags[0] && (
          <span className="tag" onClick={onReview ? e => { e.stopPropagation(); onReview(); } : undefined}>
            {p.tags[0]}
          </span>
        )}
        {toggleFav && (
          <span className="fav"
            onClick={e => { e.stopPropagation(); toggleFav(p.id); }}
            style={{ color: fav ? "#EF4444" : "inherit", fontSize: fav ? 16 : 14 }}
          >
            {fav ? "❤️" : "♡"}
          </span>
        )}
      </div>
      <div className="pbody">
        <h4>{p.name}</h4>
        <div className="pv">
          {p.va} {p.vendor}
          {p.eta && <span style={{ marginLeft: 4, color: "#10B981", fontSize: 10 }}>🕐 {p.eta}</span>}
        </div>
        <div className="pp">
          {fmt(p.price)}
          {p.old && <span className="po">{fmt(p.old)}</span>}
        </div>
        <div className="pr"
          onClick={onReview ? e => { e.stopPropagation(); onReview(); } : undefined}
        >
          ⭐ {p.rating}{p.reviews != null && ` (${p.reviews})`}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
