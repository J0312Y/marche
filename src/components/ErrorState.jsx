import Icon from "./Icon";

/**
 * ErrorState — Inline error UI for sections that failed to load
 * Use inside a component instead of crashing when API fails
 * 
 * Usage:
 *   {loading ? <Skeleton/> :
 *    error   ? <ErrorState onRetry={reload}/> :
 *              <YourData/>}
 */
function ErrorState({
  title = "Chargement impossible",
  message = "Vérifiez votre connexion et réessayez",
  onRetry,
  icon = "wifi",
  compact = false,
}) {
  return (
    <div style={{
      padding: compact ? "20px 14px" : "30px 16px",
      textAlign: "center",
      background: "var(--card)",
      border: "1px dashed var(--border)",
      borderRadius: 14,
      margin: "8px 0",
    }}>
      <div style={{
        width: compact ? 40 : 48,
        height: compact ? 40 : 48,
        borderRadius: 12,
        background: "rgba(239,68,68,0.08)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
      }}>
        <Icon name={icon} size={compact ? 18 : 22} color="#EF4444"/>
      </div>
      
      <div style={{
        fontSize: compact ? 12 : 13,
        fontWeight: 700,
        color: "var(--text)",
        marginBottom: 4,
      }}>{title}</div>
      
      <div style={{
        fontSize: compact ? 10 : 11,
        color: "var(--muted)",
        marginBottom: onRetry ? 12 : 0,
        lineHeight: 1.4,
      }}>{message}</div>
      
      {onRetry && (
        <button onClick={onRetry} style={{
          padding: "7px 16px",
          background: "#F97316",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
        }}>
          <Icon name="refresh" size={11} color="#fff"/>
          Réessayer
        </button>
      )}
    </div>
  );
}

export default ErrorState;
