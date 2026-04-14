/**
 * InvoiceView — Receipt/invoice modal (dark mode compatible)
 * Supports: status (delivered, cancelled, failed, refunded)
 * Supports: payment method display
 */
function InvoiceView({ order, onClose }) {
  if (!order) return null;
  const o = order;
  const items = o.items || [{ name: "Article 1", qty: 1, price: o.amount || 25000 }];
  const subtotal = items.reduce((s, it) => s + (it.price||0) * (it.qty||1), 0);
  const delivery = o.delivery || 1500;
  const discount = o.discount || 0;
  const total = subtotal + delivery - discount;
  const fmt = (n) => n?.toLocaleString("fr-FR") + " F";
  const now = new Date();
  const date = o.date || now.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  const status = o.status || "delivered";
  const isCancelled = status === "cancelled" || status === "cancel" || status === "Annulée";
  const isFailed = status === "failed" || status === "Échec livraison";
  const isRefunded = status === "refunded";
  const refundMethod = o.refundMethod; // "wallet" | "momo" | null
  const isNegative = isCancelled || isFailed || isRefunded;

  const paymentLabel = o.payment === "cash" ? "💵 Cash à la livraison"
    : o.payment === "airtel" ? "📱 Airtel Money"
    : o.payment === "mtn" ? "📱 MTN MoMo"
    : o.payment === "kolo" ? "📱 Kolo Pay"
    : o.payment || "📱 Mobile Money";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fadeInFast .2s ease" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 360, background: "var(--card)", borderRadius: 20, overflow: "hidden", maxHeight: "85vh", overflowY: "auto", border: "1px solid var(--border)", animation: "scaleIn .25s cubic-bezier(.4,0,.2,1)", position: "relative" }}>

        {/* Stamp for cancelled/failed */}
        {isNegative && <div style={{ position: "absolute", top: 50, right: -15, transform: "rotate(30deg)", padding: "6px 40px", fontSize: 14, fontWeight: 900, letterSpacing: 2, color: "#EF4444", border: "3px solid #EF4444", borderRadius: 4, opacity: .25, zIndex: 5, pointerEvents: "none", textTransform: "uppercase" }}>
          {isCancelled ? "ANNULÉE" : isFailed ? "ÉCHEC" : "REMBOURSÉ"}
        </div>}

        {/* Header */}
        <div style={{ padding: "20px 20px 12px", textAlign: "center", borderBottom: "2px dashed var(--border)" }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🛒</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Lamuka Market</h3>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>Le Marketplace du Congo 🇨🇬</p>
          <div style={{ marginTop: 8, padding: "4px 12px", background: isNegative ? "rgba(239,68,68,0.08)" : "var(--light)", borderRadius: 8, display: "inline-block", fontSize: 11, fontWeight: 700, color: isNegative ? "#EF4444" : "#F97316" }}>
            {isNegative ? (isCancelled ? "ANNULÉE" : "ÉCHEC") : "REÇU"} {o.id || "#LMK-" + String(Math.floor(Math.random() * 9000) + 1000)}
          </div>
        </div>

        {/* Status banner for negative states */}
        {isNegative && <div style={{ margin: "12px 20px 0", padding: 12, borderRadius: 12, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>{isCancelled ? "🚫" : isFailed ? "❌" : "💸"}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#EF4444" }}>
                {isCancelled ? "Commande annulée" : isFailed ? "Livraison échouée" : "Commande remboursée"}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
                {isCancelled ? "Annulée par le client ou le vendeur."
                  : isFailed ? "Client absent ou refus de paiement."
                  : "Le montant a été remboursé."}
              </div>
            </div>
          </div>
          {o.failReason && <div style={{ marginTop: 8, padding: "6px 10px", background: "var(--card)", borderRadius: 8, fontSize: 11, color: "var(--muted)" }}>
            <b>Raison :</b> {o.failReason}
          </div>}
        </div>}

        {/* Info */}
        <div style={{ padding: "12px 20px", fontSize: 12, color: "var(--muted)" }}>
          {[["Date", date], ["Client", o.client || "Joeldy Tsina"], ["Vendeur", o.vendor || "Mode Afrique"], ["Paiement", paymentLabel],
            ...(isNegative ? [["Statut", isCancelled ? "🚫 Annulée" : isFailed ? "❌ Échec livraison" : "💸 Remboursé"]]
            : o.payment === "cash" && status !== "delivered" ? [["Statut", "⏳ Paiement à la livraison"]]
            : o.payment === "cash" && status === "delivered" ? [["Statut", "✅ Payé en espèces"]]
            : [["Statut", "✅ Payé"]])
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span>{l}</span>
              <b style={{ color: l === "Statut" ? (isNegative ? "#EF4444" : v.includes("⏳") ? "#F59E0B" : "#10B981") : l === "Paiement" && o.payment === "cash" ? "#F59E0B" : "var(--text)" }}>{v}</b>
            </div>
          ))}
        </div>

        {/* Group order info */}
        {o.isGroup&&<div style={{ margin: "0 20px 8px", padding: 10, background: "rgba(59,130,246,0.04)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.1)" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#3B82F6", marginBottom: 4 }}>🤝 Commande de groupe</div>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>{o.groupMembers?.join(", ")||"Plusieurs participants"}</div>
        </div>}

        {/* Items */}
        <div style={{ padding: "8px 20px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", opacity: isNegative ? .5 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", padding: "6px 0" }}>
            <span style={{ flex: 2 }}>Article</span><span style={{ flex: 0.5, textAlign: "center" }}>Qté</span><span style={{ flex: 1, textAlign: "right" }}>Prix</span>
          </div>
          {items.map((it, i) => (<>
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i ? "1px solid var(--border)" : "none", fontSize: 12 }}>
              <span style={{ flex: 2, color: "var(--text)", fontWeight: 500 }}>{it.name}</span>
              <span style={{ flex: 0.5, textAlign: "center", color: "var(--muted)" }}>×{it.qty||1}</span>
              <span style={{ flex: 1, textAlign: "right", fontWeight: 600, color: "var(--text)" }}>{fmt((it.price||0) * (it.qty||1))}</span>
            </div>
            {it.sides&&it.sides.length>0&&it.sides.map((si,si_i)=>(
              <div key={"s"+si_i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0 3px 16px", fontSize: 11, color: "var(--muted)" }}>
                <span style={{ flex: 2 }}>↳ {si.name}{si.qty>1?" ×"+si.qty:""}</span>
                <span style={{ flex: 0.5 }}></span>
                <span style={{ flex: 1, textAlign: "right" }}>{si.price>0?"+"+fmt(si.price*(si.qty||1)):"Gratuit"}</span>
              </div>
            ))}
          </>))}
        </div>

        {/* Totals */}
        <div style={{ padding: "12px 20px", opacity: isNegative ? .5 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "var(--muted)" }}>Sous-total</span><span style={{ color: "var(--text)" }}>{fmt(subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "var(--muted)" }}>Livraison</span><span style={{ color: "var(--text)" }}>{fmt(delivery)}</span></div>
          {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: "#F59E0B" }}><span>Réduction</span><span>-{fmt(discount)}</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, paddingTop: 8, borderTop: "2px solid var(--border)", color: isNegative ? "var(--muted)" : "#F97316", textDecoration: isNegative ? "line-through" : "none" }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
          {isNegative && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, paddingTop: 4, color: isRefunded ? "#10B981" : "#EF4444" }}>
            <span>{isFailed && o.payment === "cash" ? "Non facturé" : isRefunded ? "Remboursé" : "Annulé"}</span>
            <span>{isFailed && o.payment === "cash" ? "0 F" : fmt(total)}</span>
          </div>}
          {isRefunded && refundMethod && <div style={{ marginTop: 8, padding: 10, background: "rgba(16,185,129,0.06)", borderRadius: 10, border: "1px solid rgba(16,185,129,0.15)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#10B981", marginBottom: 4 }}>
              {refundMethod === "wallet" ? "💰 Crédité sur votre wallet Lamuka" : "📱 Remboursé via Mobile Money"}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>
              {refundMethod === "wallet" 
                ? "Le montant est disponible immédiatement pour vos prochains achats."
                : "Le remboursement sera effectué sous 24-48h sur votre numéro Mobile Money."}
            </div>
          </div>}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px 20px", textAlign: "center", borderTop: "2px dashed var(--border)" }}>
          <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 10 }}>
            {isNegative
              ? isCancelled ? "Cette commande a été annulée. Aucun montant n'a été débité."
              : isFailed && o.payment === "cash" ? "Aucun paiement effectué. Le colis est retourné au vendeur."
              : isRefunded && refundMethod === "wallet" ? "Montant crédité sur votre wallet Lamuka. Utilisez-le pour vos prochains achats."
              : isRefunded ? "Remboursement envoyé via Mobile Money sous 24-48h."
              : isFailed ? "Le montant sera remboursé sous 24-48h."
              : "Le remboursement a été effectué."
              : o.payment === "cash" && status !== "delivered" ? "Paiement en espèces au livreur à la réception de votre commande." : "Merci pour votre achat sur Lamuka Market !"}
          </p>
          <p style={{ fontSize: 9, color: "var(--muted)", opacity: .6 }}>www.lamuka.market · support@lamuka.market · +242 064 663 469</p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, padding: "0 20px 20px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "var(--text)" }}>Fermer</button>
          <button onClick={() => { window.print?.(); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: isNegative ? "var(--muted)" : "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🖨️ Imprimer</button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceView;
