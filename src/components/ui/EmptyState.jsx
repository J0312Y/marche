/**
 * EmptyState - Affichage quand liste vide
 * @param {string} icon - Emoji
 * @param {string} title - Titre
 * @param {string} subtitle - Sous-titre
 */
function EmptyState({ icon = "📭", title = "Rien ici", subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: 48, marginBottom: 10 }}>{icon}</div>
      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h3>
      {subtitle && <p style={{ fontSize: 13, color: "#908C82", marginTop: 4 }}>{subtitle}</p>}
    </div>
  );
}

export default EmptyState;
