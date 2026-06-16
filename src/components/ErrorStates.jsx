import Icon from "./Icon";

function NoNetwork({ onRetry }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", minHeight: 400 }}>
      <div style={{ width: 96, height: 96, borderRadius: 28, background: "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"/>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"/>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
          <line x1="12" y1="20" x2="12.01" y2="20"/>
        </svg>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: "var(--text)", letterSpacing: -0.3 }}>Pas de connexion</h3>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 20, maxWidth: 280 }}>Vérifiez votre connexion Internet et réessayez.</p>
      {onRetry && (
        <button onClick={onRetry} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="refresh" size={14} color="#fff"/>Réessayer
        </button>
      )}
    </div>
  );
}

function NotFound({ onBack, message }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", minHeight: 400 }}>
      <div style={{ width: 96, height: 96, borderRadius: 28, background: "rgba(107,114,128,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: "var(--text)", letterSpacing: -0.3 }}>Page introuvable</h3>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 20, maxWidth: 280 }}>{message || "Cette page n'existe pas ou a été supprimée."}</p>
      {onBack && (
        <button onClick={onBack} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="arrow_left" size={14} color="#fff"/>Retour
        </button>
      )}
    </div>
  );
}

function ServerError({ onRetry, message }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", minHeight: 400 }}>
      <div style={{ width: 96, height: 96, borderRadius: 28, background: "rgba(245,158,11,0.08)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6, color: "var(--text)", letterSpacing: -0.3 }}>Une erreur est survenue</h3>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 20, maxWidth: 280 }}>{message || "Nos serveurs rencontrent un problème. Veuillez réessayer dans un instant."}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="refresh" size={14} color="#fff"/>Réessayer
        </button>
      )}
    </div>
  );
}

function EmptyState({ icon = "package", title, message, action, actionLabel }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", minHeight: 300 }}>
      <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        <Icon name={icon} size={34} color="var(--muted)"/>
      </div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>{title}</h3>
      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginBottom: 16, maxWidth: 260 }}>{message}</p>
      {action && actionLabel && (
        <button onClick={action} style={{ padding: "10px 22px", borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{actionLabel}</button>
      )}
    </div>
  );
}

export { NoNetwork, NotFound, ServerError, EmptyState };
export default { NoNetwork, NotFound, ServerError, EmptyState };
