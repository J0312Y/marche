/**
 * FavButton - Bouton favori ♡/❤️
 * @param {string} productId - ID du produit
 * @param {function} toggleFav - Toggle favori
 * @param {function} isFav - Vérifie si favori
 * @param {string} size - "sm" | "md" (default: "md")
 */
function FavButton({ productId, toggleFav, isFav, size = "md" }) {
  const active = isFav(productId);
  const s = size === "sm" ? 28 : 32;
  const fs = size === "sm" ? 12 : 14;
  return (
    <span
      className="fav"
      onClick={e => { e.stopPropagation(); toggleFav(productId); }}
      style={{
        width: s, height: s, fontSize: active ? fs + 2 : fs,
        color: active ? "#EF4444" : "inherit"
      }}
    >
      {active ? "❤️" : "♡"}
    </span>
  );
}

export default FavButton;
