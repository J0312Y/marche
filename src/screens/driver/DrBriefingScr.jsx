import { useState } from "react";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";

/**
 * DrBriefingScr — order details before starting delivery
 * Shown after driver accepts a request, before opening the map/navigation
 */
function DrBriefingScr({ delivery: dl, go, onBack }) {
  if (!dl) return null;
  const fee = (dl.fee || 0) + (dl.tip || 0);

  return (
    <div className="scr" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: .5 }}>COURSE ACCEPTÉE</div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{dl.ref}</div>
        </div>
        <div style={{ padding: "6px 12px", borderRadius: 10, background: "rgba(16,185,129,0.1)", color: "#10B981", fontSize: 13, fontWeight: 800 }}>+{fmt(fee)}</div>
      </div>

      {/* Stats row */}
      <div style={{ margin: "0 16px 14px", padding: 14, background: "#1F2937", borderRadius: 16, display: "flex", justifyContent: "space-around", color: "#fff" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 700, letterSpacing: .5, marginBottom: 3 }}>DISTANCE</div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{dl.distance}</div>
        </div>
        <div style={{ width: 1, background: "rgba(255,255,255,.15)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 700, letterSpacing: .5, marginBottom: 3 }}>DURÉE</div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{dl.eta}</div>
        </div>
        <div style={{ width: 1, background: "rgba(255,255,255,.15)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 700, letterSpacing: .5, marginBottom: 3 }}>ARTICLES</div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>{dl.items?.length || 0}</div>
        </div>
      </div>

      {/* Route */}
      <div style={{ margin: "0 16px 14px", padding: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}><Icon name="store" size={18}/></div>
            <div style={{ width: 2, flex: 1, background: "var(--border)", margin: "4px 0" }} />
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}></div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Pickup */}
            <div style={{ paddingBottom: 14, borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#10B981", letterSpacing: .5, marginBottom: 4 }}>RÉCUPÉRATION</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{dl.vendor?.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{dl.pickup || "Adresse vendeur"}</div>
              <button onClick={() => window.location.href = `tel:${dl.vendor?.phone}`} style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--light)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}><Icon name="phone" size={16}/>{" "}Appeler</button>
            </div>
            {/* Drop */}
            <div style={{ paddingTop: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#F97316", letterSpacing: .5, marginBottom: 4 }}>LIVRAISON</div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{dl.client?.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{dl.client?.addr}</div>
              <button onClick={() => window.location.href = `tel:${dl.client?.phone}`} style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--light)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}><Icon name="phone" size={16}/>{" "}Appeler</button>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ margin: "0 16px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}><Icon name="package" size={16}/>{" "}Articles à livrer</div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          {dl.items?.map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < dl.items.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", background: "var(--light)", flexShrink: 0 }}>
                <Img src={it.photo} emoji={it.img} style={{ width: "100%", height: "100%" }} fit="cover" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{it.name}</div>
                {it.sides?.length > 0 && <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>+ {it.sides.length} accompagnement{it.sides.length > 1 ? "s" : ""}</div>}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>×{it.qty}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      {dl.note && <div style={{ margin: "0 16px 14px", padding: 12, background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.12)", borderRadius: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", marginBottom: 4 }}> Note du client</div>
        <div style={{ fontSize: 12, color: "var(--sub)" }}>{dl.note}</div>
      </div>}

      {/* Payment info */}
      <div style={{ margin: "0 16px 14px", padding: 14, background: dl.payment === "cash" ? "rgba(245,158,11,0.06)" : "var(--card)", border: dl.payment === "cash" ? "1px solid rgba(245,158,11,0.2)" : "1px solid var(--border)", borderRadius: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, marginBottom: 2 }}>{dl.payment === "cash" ? "À ENCAISSER" : "PAIEMENT"}</div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{dl.payment === "cash" ? "Cash à la livraison" : "Déjà payé"}</div>
          </div>
          {dl.payment === "cash" && <div style={{ fontSize: 20, fontWeight: 800, color: "#F59E0B" }}>{fmt(dl.total)}</div>}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: 16, background: "var(--bg)", borderTop: "1px solid var(--border)", maxWidth: 500, margin: "0 auto" }}>
        <button onClick={() => go("drDelivery", { ...dl, status: "pickup" })} style={{ width: "100%", padding: 16, borderRadius: 14, border: "none", background: "#10B981", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}><Icon name="rocket" size={16}/>{" "}Démarrer la course</button>
      </div>
    </div>
  );
}

export default DrBriefingScr;
