import { useState } from "react";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";

const DEALS = [
  { id: "gb1", name: "Galaxy A54", photo: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=200&h=200&fit=crop", price: 185000, groupPrice: 148000, minPeople: 5, joined: 3, ends: "2j 14h", vendor: "Tech Congo" },
  { id: "gb2", name: "Pack Ménage x3", photo: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&h=200&fit=crop", price: 25500, groupPrice: 18000, minPeople: 10, joined: 7, ends: "1j 6h", vendor: "Super U Bacongo" },
  { id: "gb3", name: "Croissants x12", photo: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=200&h=200&fit=crop", price: 6000, groupPrice: 4200, minPeople: 8, joined: 8, ends: "5h 30m", full: true, vendor: "Pâtisserie La Congolaise" },
];

function GroupBuyScr({ onBack, go }) {
  const [joined, setJoined] = useState({});

  const join = (deal) => {
    if (joined[deal.id]) return;
    setJoined(p => ({ ...p, [deal.id]: true }));
    toast.success("Vous avez rejoint l'achat groupé ! 🎉");
  };

  return (<div className="scr" style={{ padding: 16, paddingBottom: 20 }}>
    <div className="appbar" style={{ padding: 0, marginBottom: 10 }}><button onClick={onBack}>←</button><h2>🤝 Achats Groupés</h2><div style={{ width: 38 }} /></div>

    <div style={{ padding: 14, background: "linear-gradient(135deg,rgba(99,102,241,0.06),rgba(168,85,247,0.06))", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 16, marginBottom: 14 }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>💡 Comment ça marche ?</div>
      <div style={{ fontSize: 12, color: "var(--sub)", lineHeight: 1.6 }}>Rejoignez un groupe d'achat pour obtenir des prix réduits. Plus on est nombreux, moins c'est cher ! Le prix groupé s'applique dès que le nombre minimum est atteint.</div>
    </div>

    {DEALS.map(d => {
      const pct = Math.round((d.joined / d.minPeople) * 100);
      const discount = Math.round((1 - d.groupPrice / d.price) * 100);
      const isFull = d.full || d.joined >= d.minPeople;
      const didJoin = joined[d.id];

      return (<div key={d.id} style={{ padding: 14, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <div style={{ width: 70, height: 70, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
            <img src={d.photo} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{d.name}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{d.vendor}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#10B981" }}>{fmt(d.groupPrice)}</span>
              <span style={{ fontSize: 12, color: "var(--muted)", textDecoration: "line-through" }}>{fmt(d.price)}</span>
              <span style={{ padding: "2px 6px", borderRadius: 6, background: "rgba(16,185,129,0.08)", color: "#10B981", fontSize: 10, fontWeight: 700 }}>-{discount}%</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>{d.joined}/{d.minPeople} participants</span>
            <span style={{ color: "var(--muted)" }}>⏰ {d.ends}</span>
          </div>
          <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: isFull ? "#10B981" : "#6366F1", borderRadius: 3, transition: "width .5s" }} />
          </div>
        </div>

        {/* Participants */}
        <div style={{ display: "flex", alignItems: "center", gap: -4, marginBottom: 10 }}>
          {Array(Math.min(d.joined, 5)).fill(0).map((_, i) => (
            <div key={i} style={{ width: 28, height: 28, borderRadius: "50%", background: ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#EC4899"][i % 5], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff", fontWeight: 700, border: "2px solid var(--card)", marginLeft: i > 0 ? -6 : 0 }}>{String.fromCharCode(65 + i)}</div>
          ))}
          {d.joined > 5 && <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 4 }}>+{d.joined - 5}</span>}
          <span style={{ flex: 1 }} />
          {isFull && <span style={{ padding: "3px 8px", borderRadius: 6, background: "rgba(16,185,129,0.08)", color: "#10B981", fontSize: 10, fontWeight: 700 }}>✅ Complet</span>}
        </div>

        {/* Action */}
        {isFull ? (
          <button style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: "#10B981", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }} onClick={() => toast.success("Commande groupée validée ! 🎉")}>
            🛍️ Commander au prix groupé — {fmt(d.groupPrice)}
          </button>
        ) : didJoin ? (
          <div style={{ width: "100%", padding: 12, borderRadius: 12, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#6366F1" }}>
            ✅ Vous participez — en attente de {d.minPeople - d.joined} personnes
          </div>
        ) : (
          <button onClick={() => join(d)} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: "#6366F1", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            🤝 Rejoindre · Économisez {fmt(d.price - d.groupPrice)}
          </button>
        )}
      </div>);
    })}
  </div>);
}

export default GroupBuyScr;
