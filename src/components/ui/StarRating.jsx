/**
 * StarRating - Affiche étoiles cliquables
 * @param {number} rating - Note (ex: 4.7)
 * @param {number} reviews - Nombre d'avis
 * @param {function} onClick - Navigation vers avis
 * @param {boolean} showCount - Afficher le nombre d'avis
 */
function StarRating({ rating, reviews, onClick, showCount = true }) {
  return (
    <div
      className="pr"
      onClick={onClick ? e => { e.stopPropagation(); onClick(); } : undefined}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      ⭐ {rating}{showCount && reviews != null && ` (${reviews})`}
    </div>
  );
}

export default StarRating;
