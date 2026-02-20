/**
 * Tag - Étiquette produit (Best-seller, Promo, Nouveau...)
 * @param {string} label - Texte du tag
 * @param {function} onClick - Action au clic
 */
function Tag({ label, onClick }) {
  if (!label) return null;
  return (
    <span
      className="tag"
      onClick={onClick ? e => { e.stopPropagation(); onClick(); } : undefined}
    >
      {label}
    </span>
  );
}

export default Tag;
