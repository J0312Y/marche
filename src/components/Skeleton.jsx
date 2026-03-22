/**
 * Skeleton — shimmer loading placeholders
 * Usage: <Skeleton type="product-grid" /> or <Skeleton type="list" count={5} />
 */
function Skeleton({ type = "product-grid", count = 4 }) {
  const shimmer = {
    background: "linear-gradient(90deg, var(--light) 25%, var(--border) 50%, var(--light) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    borderRadius: 12,
  };

  if (type === "product-grid") return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 16px" }}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} style={{ background: "var(--card)", borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div style={{ ...shimmer, height: 140, borderRadius: 0 }} />
          <div style={{ padding: 10 }}>
            <div style={{ ...shimmer, height: 14, width: "80%", marginBottom: 8 }} />
            <div style={{ ...shimmer, height: 10, width: "60%", marginBottom: 8 }} />
            <div style={{ ...shimmer, height: 16, width: "50%" }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (type === "list") return (
    <div style={{ padding: "0 16px" }}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ ...shimmer, width: 48, height: 48, borderRadius: 14, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ ...shimmer, height: 14, width: "70%", marginBottom: 8 }} />
            <div style={{ ...shimmer, height: 10, width: "45%" }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (type === "detail") return (
    <div>
      <div style={{ ...shimmer, height: 280, borderRadius: 0 }} />
      <div style={{ padding: 16 }}>
        <div style={{ ...shimmer, height: 12, width: "40%", marginBottom: 10 }} />
        <div style={{ ...shimmer, height: 22, width: "75%", marginBottom: 10 }} />
        <div style={{ ...shimmer, height: 12, width: "30%", marginBottom: 16 }} />
        <div style={{ ...shimmer, height: 28, width: "50%", marginBottom: 16 }} />
        <div style={{ ...shimmer, height: 60, width: "100%", marginBottom: 12 }} />
        <div style={{ ...shimmer, height: 60, width: "100%" }} />
      </div>
    </div>
  );

  if (type === "stories") return (
    <div style={{ display: "flex", gap: 12, padding: "0 16px", overflowX: "auto" }}>
      {Array(6).fill(0).map((_, i) => (
        <div key={i} style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ ...shimmer, width: 52, height: 52, borderRadius: 16, marginBottom: 4 }} />
          <div style={{ ...shimmer, height: 8, width: 40, margin: "0 auto" }} />
        </div>
      ))}
    </div>
  );

  if (type === "hero") return (
    <div style={{ padding: "0 16px" }}>
      <div style={{ ...shimmer, height: 140, borderRadius: 16, marginBottom: 16 }} />
    </div>
  );

  return null;
}

export default Skeleton;
