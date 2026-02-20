/**
 * AppBar - Barre de navigation supérieure
 * @param {function} onBack - Action retour (affiche ←)
 * @param {string} title - Titre central
 * @param {React.ReactNode} right - Élément à droite (bouton, icône)
 */
function AppBar({ onBack, title, right }) {
  return (
    <div className="appbar">
      {onBack ? <button onClick={onBack}>←</button> : <div style={{ width: 38 }} />}
      <h2>{title}</h2>
      {right || <div style={{ width: 38 }} />}
    </div>
  );
}

export default AppBar;
