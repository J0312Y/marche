/**
 * Badge - Pastille de réduction
 * @param {number} discount - Pourcentage (ex: 15)
 * @param {string} text - Texte personnalisé (si pas discount)
 */
function Badge({ discount, text }) {
  return (
    <span className="badge">
      {text || (discount > 0 ? `-${discount}%` : null)}
    </span>
  );
}

export default Badge;
