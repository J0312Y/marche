import { useState, useRef, useEffect } from "react";

/**
 * Custom Select — replaces native <select> with styled dropdown
 * Adapts to dark mode via CSS variables
 * 
 * Props:
 *  - value: current selected value
 *  - onChange: (value) => void
 *  - options: [{value, label, icon?}] or ["string", "string"]
 *  - placeholder: "Choisir..."
 *  - disabled: boolean
 */
function Select({ value, onChange, options = [], placeholder = "Choisir...", disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Normalize options
  const opts = options.map(o => typeof o === "string" ? { value: o, label: o } : o);
  const selected = opts.find(o => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Trigger */}
      <div
        onClick={() => !disabled && setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 14px", borderRadius: 14,
          border: open ? "2px solid #F97316" : "1px solid var(--border)",
          background: "var(--light)", cursor: disabled ? "default" : "pointer",
          opacity: disabled ? 0.5 : 1, transition: "border .15s",
          fontSize: 14, color: selected ? "var(--text)" : "var(--muted)",
          fontFamily: "inherit", fontWeight: selected ? 500 : 400,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {selected?.icon && <span style={{ fontSize: 16 }}>{selected.icon}</span>}
          {selected ? selected.label : placeholder}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}>
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: "calc(100% + 4px)",
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,.15)",
          zIndex: 50, maxHeight: 220, overflowY: "auto",
          animation: "selectFadeIn .15s ease",
        }}>
          {opts.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <div
                key={o.value + "-" + i}
                onClick={() => { onChange(o.value); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "11px 14px", cursor: "pointer",
                  background: isSelected ? "rgba(249,115,22,0.06)" : "transparent",
                  borderBottom: i < opts.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "background .1s",
                  fontSize: 13, fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? "#F97316" : "var(--text)",
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "var(--light)" }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent" }}
              >
                {o.icon && <span style={{ fontSize: 16 }}>{o.icon}</span>}
                <span style={{ flex: 1 }}>{o.label}</span>
                {isSelected && <span style={{ fontSize: 12, color: "#F97316" }}>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Select;
