/**
 * LoadingSpinner — Fallback Suspense pendant le chargement des chunks
 */
export default function LoadingSpinner() {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", height: "100%", gap: 16, padding: 40
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: "3px solid #E8E6E1", borderTopColor: "#6366F1",
        animation: "spin 0.8s linear infinite"
      }} />
      <span style={{ fontSize: 13, color: "#908C82", fontWeight: 500 }}>Chargement...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
