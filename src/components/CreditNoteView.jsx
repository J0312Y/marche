import { P } from "../data";
/**
 * CreditNoteView — Avoir / Note de crédit (remboursement)
 * Separate document from original receipt
 */
function CreditNoteView({ order, onClose, refundMethod }) {
  const findPhoto=(name)=>{if(!name)return null;const clean=name.replace(/^[^a-zA-ZÀ-ÿ]+ /,"");const p=P.find(x=>x.name.includes(clean)||clean.includes(x.name));return p?.photo||null};
  if (!order) return null;
  const o = order;
  const items = o.items || [{ name: "Article 1", qty: 1, price: o.amount || 25000 }];
  const subtotal = items.reduce((s, it) => s + (it.price||0) * (it.qty||1), 0);
  const delivery = o.delivery || 1500;
  const discount = o.discount || 0;
  const total = subtotal + delivery - discount;
  const fmt = (n) => n?.toLocaleString("fr-FR") + " F";
  const now = new Date();
  const date = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const refId = (o.id || "#LMK-0000").replace("#LMK-", "#AVR-").replace("#CMD-", "#AVR-");
  const method = refundMethod || "wallet";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fadeInFast .2s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 360, background: "var(--card)", borderRadius: 20, overflow: "hidden", maxHeight: "85vh", overflowY: "auto", border: "1px solid var(--border)", animation: "scaleIn .25s cubic-bezier(.4,0,.2,1)", position: "relative" }}>

        {/* Watermark */}
        <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%) rotate(-20deg)", fontSize: 48, fontWeight: 900, color: "rgba(16,185,129,0.06)", pointerEvents: "none", zIndex: 0, whiteSpace: "nowrap", letterSpacing: 4 }}>AVOIR</div>

        {/* Header */}
        <div style={{ padding: "20px 20px 12px", textAlign: "center", borderBottom: "2px dashed var(--border)", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>💸</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Lamuka Market</h3>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>Note de crédit / Avoir</p>
          <div style={{ marginTop: 8, padding: "4px 12px", background: "rgba(16,185,129,0.08)", borderRadius: 8, display: "inline-block", fontSize: 11, fontWeight: 700, color: "#10B981" }}>
            AVOIR {refId}
          </div>
        </div>

        {/* Reference to original */}
        <div style={{ margin: "12px 20px 0", padding: 10, background: "rgba(59,130,246,0.04)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.1)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>📄</span>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>Réf. commande originale : <b style={{ color: "var(--text)" }}>{o.id || "#LMK-0000"}</b></div>
        </div>

        {/* Info */}
        <div style={{ padding: "12px 20px", fontSize: 12, color: "var(--muted)", position: "relative", zIndex: 1 }}>
          {[
            ["Date avoir", date],
            ["Client", o.client || "Joeldy Tsina"],
            ["Vendeur", o.vendor || "Mode Afrique"],
            ["Motif", o.cancelReason || "Annulation client"],
            ["Remboursement", method === "wallet" ? "💰 Wallet Lamuka" : "📱 Mobile Money"],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>{l}</span>
              <b style={{ color: l === "Remboursement" ? "#10B981" : "var(--text)" }}>{v}</b>
            </div>
          ))}
        </div>

        {/* Items refunded */}
        <div style={{ padding: "8px 20px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", padding: "6px 0" }}>
            <span style={{ flex: 2 }}>Article remboursé</span><span style={{ flex: 0.5, textAlign: "center" }}>Qté</span><span style={{ flex: 1, textAlign: "right" }}>Montant</span>
          </div>
          {items.map((it, i) => (<>
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: i ? "1px solid var(--border)" : "none", fontSize: 12 }}>
              {(()=>{const ph=findPhoto(it.name);return ph?<img src={ph} style={{width:28,height:28,borderRadius:6,objectFit:"cover",flexShrink:0}} alt=""/>:<div style={{width:28,height:28,borderRadius:6,background:"var(--light)",flexShrink:0}}/>})()}
              <span style={{ flex: 2, color: "var(--text)", fontWeight: 500 }}>{it.name.replace(/^[^a-zA-ZÀ-ÿ]+ /,"")}</span>
              <span style={{ flex: 0.5, textAlign: "center", color: "var(--muted)" }}>×{it.qty||1}</span>
              <span style={{ flex: 1, textAlign: "right", fontWeight: 600, color: "#10B981" }}>-{fmt((it.price||0) * (it.qty||1))}</span>
            </div>
            {it.sides&&it.sides.length>0&&it.sides.map((si,si_i)=>(
              <div key={"s"+si_i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0 3px 16px", fontSize: 11, color: "var(--muted)" }}>
                <span style={{ flex: 2 }}>↳ {si.name}{si.qty>1?" ×"+si.qty:""}</span>
                <span style={{ flex: 0.5 }}></span>
                <span style={{ flex: 1, textAlign: "right" }}>-{si.price>0?fmt(si.price*(si.qty||1)):"Gratuit"}</span>
              </div>
            ))}
          </>))}
        </div>

        {/* Totals */}
        <div style={{ padding: "12px 20px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "var(--muted)" }}>Sous-total</span><span style={{ color: "#10B981" }}>-{fmt(subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "var(--muted)" }}>Livraison</span><span style={{ color: "#10B981" }}>-{fmt(delivery)}</span></div>
          {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "var(--muted)" }}>Réduction annulée</span><span style={{ color: "var(--text)" }}>+{fmt(discount)}</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, paddingTop: 8, borderTop: "2px solid var(--border)", color: "#10B981" }}>
            <span>Total remboursé</span><span>-{fmt(total)}</span>
          </div>
        </div>

        {/* Refund method detail */}
        <div style={{ margin: "0 20px 12px", padding: 14, borderRadius: 14, background: method === "wallet" ? "rgba(16,185,129,0.06)" : "rgba(59,130,246,0.06)", border: `1px solid ${method === "wallet" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.15)"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: method === "wallet" ? "rgba(16,185,129,0.1)" : "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              {method === "wallet" ? "💰" : "📱"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: method === "wallet" ? "#10B981" : "#3B82F6" }}>
                {method === "wallet" ? "Crédité sur Wallet Lamuka" : "Envoyé via Mobile Money"}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                {method === "wallet" ? "Disponible immédiatement pour vos achats" : "Délai de traitement : 24-48h ouvrées"}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px 20px", textAlign: "center", borderTop: "2px dashed var(--border)" }}>
          <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 10 }}>Ce document fait office d'avoir. Conservez-le pour toute réclamation.</p>
          <p style={{ fontSize: 9, color: "var(--muted)", opacity: .6 }}>www.lamuka.market · support@lamuka.market · +242 064 663 469</p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, padding: "0 20px 20px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "var(--text)" }}>Fermer</button>
          <button onClick={() => { window.print?.(); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#10B981", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🖨️ Imprimer</button>
        </div>
      </div>
    </div>
  );
}

export default CreditNoteView;
