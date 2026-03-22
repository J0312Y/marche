/**
 * Error state screens — no network, 404, server error, empty
 */
function NoNetwork({ onRetry }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", height: "100%" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>📡</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>Pas de connexion</h3>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 20, maxWidth: 260 }}>
        Vérifiez votre connexion internet et réessayez.
      </p>
      {onRetry && <button onClick={onRetry} style={{ padding: "10px 28px", borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🔄 Réessayer</button>}
    </div>
  );
}

function NotFound({ onBack, message }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", height: "100%" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>Page introuvable</h3>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 20, maxWidth: 260 }}>
        {message || "Cette page n'existe pas ou a été supprimée."}
      </p>
      {onBack && <button onClick={onBack} style={{ padding: "10px 28px", borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>← Retour</button>}
    </div>
  );
}

function ServerError({ onRetry }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", height: "100%" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>Erreur serveur</h3>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 20, maxWidth: 260 }}>
        Une erreur est survenue. Notre équipe est prévenue. Réessayez dans quelques instants.
      </p>
      {onRetry && <button onClick={onRetry} style={{ padding: "10px 28px", borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🔄 Réessayer</button>}
    </div>
  );
}

function Maintenance() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", height: "100%" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔧</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>Maintenance en cours</h3>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, maxWidth: 260 }}>
        Lamuka Market est en cours de maintenance. Nous revenons très vite !
      </p>
    </div>
  );
}

export { NoNetwork, NotFound, ServerError, Maintenance };
