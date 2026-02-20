/**
 * MenuItem - Ligne de menu (profil, settings)
 * @param {string} icon - Emoji icône
 * @param {string} title - Titre
 * @param {string} subtitle - Info à droite (compteur, valeur)
 * @param {function} onPress
 */
function MenuItem({ icon, title, subtitle, onPress }) {
  return (
    <div className="menu-item" onClick={onPress}>
      <div className="mi-i">{icon}</div>
      <span className="mi-t">{title}</span>
      {subtitle && <span className="mi-s">{subtitle}</span>}
      <span className="mi-c">›</span>
    </div>
  );
}

export default MenuItem;
