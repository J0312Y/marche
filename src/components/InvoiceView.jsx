import { useState } from "react";

/**
 * InvoiceView — Receipt/invoice modal for orders
 */
function InvoiceView({ order, onClose }) {
  if (!order) return null;
  const o = order;
  const items = o.items || [{ name: "Article 1", qty: 1, price: o.amount || 25000 }];
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const delivery = o.delivery || 1500;
  const discount = o.discount || 0;
  const total = subtotal + delivery - discount;
  const fmt = (n) => n?.toLocaleString("fr-FR") + " F";
  const now = new Date();
  const date = now.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 150, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 20, overflow: "hidden", maxHeight: "85vh", overflowY: "auto" }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 12px", textAlign: "center", borderBottom: "2px dashed #E8E6E1" }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🛒</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "#191815" }}>Lamuka Market</h3>
          <p style={{ fontSize: 11, color: "#908C82" }}>Le Marketplace du Congo 🇨🇬</p>
          <div style={{ marginTop: 8, padding: "4px 12px", background: "#F5F4F1", borderRadius: 8, display: "inline-block", fontSize: 11, fontWeight: 700, color: "#F97316" }}>
            REÇU #{o.id || "LMK-" + String(Math.floor(Math.random() * 9000) + 1000)}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "12px 20px", fontSize: 12, color: "#5E5B53" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Date</span><b style={{ color: "#191815" }}>{date}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Client</span><b style={{ color: "#191815" }}>{o.client || "Joeldy Tsina"}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>Vendeur</span><b style={{ color: "#191815" }}>{o.vendor || "Mode Afrique"}</b></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span>Paiement</span><b style={{ color: "#191815" }}>{o.payment || "Airtel Money"}</b></div>
        </div>

        {/* Items */}
        <div style={{ padding: "8px 20px", borderTop: "1px solid #E8E6E1", borderBottom: "1px solid #E8E6E1" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#908C82", fontWeight: 700, textTransform: "uppercase", padding: "6px 0" }}>
            <span style={{ flex: 2 }}>Article</span><span style={{ flex: 0.5, textAlign: "center" }}>Qté</span><span style={{ flex: 1, textAlign: "right" }}>Prix</span>
          </div>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i ? "1px solid #F5F4F1" : "none", fontSize: 12 }}>
              <span style={{ flex: 2, color: "#191815", fontWeight: 500 }}>{it.name}</span>
              <span style={{ flex: 0.5, textAlign: "center", color: "#908C82" }}>×{it.qty}</span>
              <span style={{ flex: 1, textAlign: "right", fontWeight: 600, color: "#191815" }}>{fmt(it.price * it.qty)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ padding: "12px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "#908C82" }}>Sous-total</span><span>{fmt(subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "#908C82" }}>Livraison</span><span>{fmt(delivery)}</span></div>
          {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: "#F59E0B" }}><span>Réduction</span><span>-{fmt(discount)}</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, paddingTop: 8, borderTop: "2px solid #E8E6E1", color: "#F97316" }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px 20px", textAlign: "center", borderTop: "2px dashed #E8E6E1" }}>
          <p style={{ fontSize: 10, color: "#908C82", marginBottom: 10 }}>Merci pour votre achat sur Lamuka Market !</p>
          <p style={{ fontSize: 9, color: "#C4C1BA" }}>www.lamuka.market · support@lamuka.market · +242 064 663 469</p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, padding: "0 20px 20px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #E8E6E1", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#191815" }}>Fermer</button>
          <button onClick={() => { window.print?.(); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🖨️ Imprimer</button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceView;
