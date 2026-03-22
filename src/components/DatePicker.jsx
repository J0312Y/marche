import { useState } from "react";

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS = ["Lu","Ma","Me","Je","Ve","Sa","Di"];

function DatePicker({ value, onChange, label, placeholder = "Choisir une date" }) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const sel = value ? new Date(value) : null;
  const [viewMonth, setViewMonth] = useState(sel ? sel.getMonth() : today.getMonth());
  const [viewYear, setViewYear] = useState(sel ? sel.getFullYear() : today.getFullYear());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); } else setViewMonth(viewMonth - 1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); } else setViewMonth(viewMonth + 1); };

  const pick = (d) => {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const isToday = (d) => d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (d) => sel && d === sel.getDate() && viewMonth === sel.getMonth() && viewYear === sel.getFullYear();

  const formatted = sel ? `${sel.getDate()} ${MONTHS[sel.getMonth()].slice(0, 3)} ${sel.getFullYear()}` : "";

  return (
    <>
      <div onClick={() => setOpen(true)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--light)", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, fontFamily: "inherit", color: value ? "var(--text)" : "var(--muted)" }}>
        {formatted || placeholder}
        <span style={{ fontSize: 16 }}>📅</span>
      </div>

      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 160, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 320, background: "var(--card)", borderRadius: 20, overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,.2)" }}>
          {/* Header */}
          <div style={{ padding: "16px 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={prev} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{MONTHS[viewMonth]} {viewYear}</div>
            <button onClick={next} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 12px 6px" }}>
            {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "var(--muted)", padding: 4 }}>{d}</div>)}
          </div>

          {/* Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 12px 16px", gap: 2 }}>
            {cells.map((d, i) => d ? (
              <div key={i} onClick={() => pick(d)} style={{
                textAlign: "center", padding: "8px 0", borderRadius: 10, fontSize: 13, fontWeight: isSelected(d) ? 700 : 500, cursor: "pointer",
                background: isSelected(d) ? "#F97316" : isToday(d) ? "rgba(249,115,22,0.08)" : "transparent",
                color: isSelected(d) ? "#fff" : isToday(d) ? "#F97316" : "var(--text)",
                transition: "all .15s",
              }}>{d}</div>
            ) : <div key={i} />)}
          </div>

          {/* Footer */}
          <div style={{ padding: "0 16px 16px", display: "flex", gap: 8 }}>
            <button onClick={() => setOpen(false)} style={{ flex: 1, padding: 10, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "var(--text)" }}>Annuler</button>
            <button onClick={() => { pick(today.getDate()); setViewMonth(today.getMonth()); setViewYear(today.getFullYear()); }} style={{ flex: 1, padding: 10, borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Aujourd'hui</button>
          </div>
        </div>
      </div>}
    </>
  );
}

export default DatePicker;
