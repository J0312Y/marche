/**
 * SkeletonCard — Loading placeholder for product cards
 * Use during initial data fetch on home carousels
 */
function SkeletonCard({ width = 148 }) {
  return (
    <div style={{
      minWidth: width,
      maxWidth: width,
      flexShrink: 0,
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, var(--light) 0%, rgba(0,0,0,0.04) 50%, var(--light) 100%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.4s ease-in-out infinite;
        }
      `}</style>
      <div className="skeleton-shimmer" style={{ width: "100%", aspectRatio: "1 / 1" }}/>
      <div style={{ padding: "8px 10px" }}>
        <div className="skeleton-shimmer" style={{ height: 10, borderRadius: 4, marginBottom: 8 }}/>
        <div className="skeleton-shimmer" style={{ height: 12, width: "60%", borderRadius: 4, marginBottom: 6 }}/>
        <div className="skeleton-shimmer" style={{ height: 8, width: "40%", borderRadius: 4 }}/>
      </div>
    </div>
  );
}

/**
 * SkeletonRow — horizontal scrollable row of skeleton cards
 */
export function SkeletonRow({ count = 4, width = 148 }) {
  return (
    <div style={{ display: "flex", gap: 10, overflowX: "hidden", padding: "4px 16px 18px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} width={width} />
      ))}
    </div>
  );
}

/**
 * SkeletonSectionHeader — loading state for section headers
 */
export function SkeletonSectionHeader() {
  return (
    <div style={{ padding: "6px 16px 0", marginBottom: 8 }}>
      <style>{`
        @keyframes sk-shimmer {
          0% { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
        .sk-bg {
          background: linear-gradient(90deg, var(--light) 0%, rgba(0,0,0,0.04) 50%, var(--light) 100%);
          background-size: 200% 100%;
          animation: sk-shimmer 1.4s ease-in-out infinite;
        }
      `}</style>
      <div className="sk-bg" style={{ height: 18, width: 140, borderRadius: 4 }}/>
    </div>
  );
}

export default SkeletonCard;
