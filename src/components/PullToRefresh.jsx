import { useState, useRef, useCallback } from "react";

/**
 * PullToRefresh — Wrap scrollable content to add pull-to-refresh gesture
 * 
 * Usage:
 *   <PullToRefresh onRefresh={async () => { await reload(); }}>
 *     <div className="scr">...</div>
 *   </PullToRefresh>
 */
function PullToRefresh({ onRefresh, children }) {
  const [pulling, setPulling] = useState(false);
  const [pullDist, setPullDist] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const scrollRef = useRef(null);

  const THRESHOLD = 60;

  const onTouchStart = useCallback((e) => {
    // Only start pull if scrolled to top
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.querySelector('.scr') || el;
    if (scrollable.scrollTop > 5) return;
    startY.current = e.touches[0].clientY;
    setPulling(true);
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!pulling || refreshing) return;
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) {
      setPullDist(Math.min(diff * 0.5, 100));
    }
  }, [pulling, refreshing]);

  const onTouchEnd = useCallback(async () => {
    if (!pulling) return;
    if (pullDist >= THRESHOLD && !refreshing) {
      setRefreshing(true);
      setPullDist(THRESHOLD);
      try {
        await onRefresh?.();
      } catch {}
      setRefreshing(false);
    }
    setPulling(false);
    setPullDist(0);
  }, [pulling, pullDist, refreshing, onRefresh]);

  const show = pullDist > 10;

  return (
    <div
      ref={scrollRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* Pull indicator */}
      <div style={{
        height: show ? pullDist : 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: pulling ? "none" : "height .3s ease",
        overflow: "hidden", flexShrink: 0,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "#6366F1",
          animation: refreshing ? "spin .6s linear infinite" : "none",
          transform: `rotate(${pullDist * 3}deg)`,
          opacity: show ? 1 : 0,
          transition: "opacity .2s",
        }} />
      </div>
      {children}
    </div>
  );
}

export default PullToRefresh;
