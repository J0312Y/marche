import { useState } from "react";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";
import COUPONS from "../../data/coupons";
import Icon from "../../components/Icon";

function PromosScr({ onBack, go }) {
  const [copied, setCopied] = useState(null);
  const [filter, setFilter] = useState("all"); // all | personal | active

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    toast.success(` Code "${code}" copié !`);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = COUPONS.filter(c => {
    if (filter === "personal") return c.isPersonal;
    if (filter === "active") return (c.expiresIn || 99) <= 14;
    return true;
  });

  const personalCount = COUPONS.filter(c => c.isPersonal).length;

  return (
    <div className="scr" style={{ paddingBottom: 100 }}>
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 14 }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, flex: 1 }}>Mes promos</h2>
      </div>

      {/* Hero card with personal codes count */}
      {personalCount > 0 && (
        <div style={{ margin: "0 16px 14px", padding: 18, background: "linear-gradient(135deg,#F97316,#EC4899)", borderRadius: 18, color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}><Icon name="gift" size={18}/></div>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{personalCount} promo{personalCount > 1 ? "s" : ""} pour vous</div>
          <div style={{ fontSize: 12, opacity: .9, marginTop: 4 }}>Codes exclusifs réservés à Joeldy</div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, padding: "0 16px 12px", overflowX: "auto", scrollbarWidth: "none" }} className="hide-scroll">
        {[
          ["all", "Toutes", COUPONS.length],
          ["personal", " Personnelles", COUPONS.filter(c => c.isPersonal).length],
          ["active", "⏰ Expirent bientôt", COUPONS.filter(c => (c.expiresIn || 99) <= 14).length],
        ].map(([k, l, n]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, border: filter === k ? "2px solid #F97316" : "1px solid var(--border)", background: filter === k ? "rgba(249,115,22,0.06)" : "var(--card)", color: filter === k ? "#F97316" : "var(--sub)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{l} <span style={{ opacity: .6 }}>({n})</span></button>
        ))}
      </div>

      {/* Coupon list */}
      <div style={{ padding: "0 16px" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 12, animation: "emptyBounce 2s ease-in-out infinite" }}><Icon name="tag" size={18}/></div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--muted)" }}>Aucune promo disponible</div>
          </div>
        ) : (
          filtered.map(c => {
            const color = c.color || "#F97316";
            const expiresUrgent = (c.expiresIn || 99) <= 7;
            return (
              <div key={c.code} style={{ marginBottom: 10, position: "relative", background: "var(--card)", border: `1.5px solid ${color}40`, borderRadius: 16, overflow: "hidden", display: "flex" }}>
                {/* Left strip — discount */}
                <div style={{ width: 96, background: `linear-gradient(135deg,${color}22,${color}08)`, padding: 14, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRight: `2px dashed ${color}40`, position: "relative" }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>
                    {c.type === "percent" ? `-${c.discount}%` : c.type === "delivery" ? "" : `-${(c.discount / 1000).toFixed(0)}K`}
                  </div>
                  <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 4, textAlign: "center" }}>
                    {c.type === "delivery" ? "GRATUIT" : c.type === "fixed" ? `${fmt(c.discount).replace("FCFA", "").trim()}` : "RÉDUC"}
                  </div>
                  {/* Notch cutouts for ticket look */}
                  <div style={{ position: "absolute", top: -8, right: -8, width: 16, height: 16, borderRadius: "50%", background: "var(--bg)" }}/>
                  <div style={{ position: "absolute", bottom: -8, right: -8, width: 16, height: 16, borderRadius: "50%", background: "var(--bg)" }}/>
                </div>

                {/* Right content */}
                <div style={{ flex: 1, padding: 12, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{c.label}</h4>
                      {c.isPersonal && <span style={{ padding: "1px 5px", borderRadius: 4, background: color + "20", color, fontSize: 8, fontWeight: 800 }}>PERSO</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, lineHeight: 1.4 }}>{c.desc}</div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div onClick={() => copyCode(c.code)} style={{ flex: 1, padding: "6px 10px", border: `1px dashed ${color}`, borderRadius: 8, background: color + "08", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", minWidth: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: 1, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.code}</span>
                      <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: "auto", flexShrink: 0 }}>{copied === c.code ? " Copié" : ""}</span>
                    </div>
                    {c.expiresIn && (
                      <div style={{ fontSize: 9, color: expiresUrgent ? "#EF4444" : "var(--muted)", fontWeight: 700, whiteSpace: "nowrap" }}>
                        {expiresUrgent && "⏰ "}
                        {c.expiresIn}j
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* How to use */}
      <div style={{ margin: "16px", padding: 14, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}><Icon name="info" size={16}/>{" "}Comment utiliser</div>
        <div style={{ fontSize: 11, color: "var(--sub)", lineHeight: 1.6 }}>
          1. Copiez le code de la promo<br />
          2. Ajoutez vos articles au panier<br />
          3. Collez le code à l'étape paiement<br />
          4. La réduction est appliquée automatiquement !
        </div>
      </div>
    </div>
  );
}

export default PromosScr;
