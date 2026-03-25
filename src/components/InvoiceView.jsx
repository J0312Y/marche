/**
 * InvoiceView — Receipt/invoice modal (dark mode compatible)
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
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 360, background: "var(--card)", borderRadius: 20, overflow: "hidden", maxHeight: "85vh", overflowY: "auto", border: "1px solid var(--border)" }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 12px", textAlign: "center", borderBottom: "2px dashed var(--border)" }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🛒</div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Lamuka Market</h3>
          <p style={{ fontSize: 11, color: "var(--muted)" }}>Le Marketplace du Congo 🇨🇬</p>
          <div style={{ marginTop: 8, padding: "4px 12px", background: "var(--light)", borderRadius: 8, display: "inline-block", fontSize: 11, fontWeight: 700, color: "#F97316" }}>
            REÇU {o.id || "#LMK-" + String(Math.floor(Math.random() * 9000) + 1000)}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: "12px 20px", fontSize: 12, color: "var(--muted)" }}>
          {[["Date", date], ["Client", o.client || "Joeldy Tsina"], ["Vendeur", o.vendor || "Mode Afrique"], ["Paiement", o.payment || "Airtel Money"]].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span>{l}</span><b style={{ color: "var(--text)" }}>{v}</b></div>
          ))}
        </div>

        {/* Items */}
        <div style={{ padding: "8px 20px", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", padding: "6px 0" }}>
            <span style={{ flex: 2 }}>Article</span><span style={{ flex: 0.5, textAlign: "center" }}>Qté</span><span style={{ flex: 1, textAlign: "right" }}>Prix</span>
          </div>
          {items.map((it, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderTop: i ? "1px solid var(--border)" : "none", fontSize: 12 }}>
              <span style={{ flex: 2, color: "var(--text)", fontWeight: 500 }}>{it.name}</span>
              <span style={{ flex: 0.5, textAlign: "center", color: "var(--muted)" }}>×{it.qty}</span>
              <span style={{ flex: 1, textAlign: "right", fontWeight: 600, color: "var(--text)" }}>{fmt(it.price * it.qty)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div style={{ padding: "12px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "var(--muted)" }}>Sous-total</span><span style={{ color: "var(--text)" }}>{fmt(subtotal)}</span></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span style={{ color: "var(--muted)" }}>Livraison</span><span style={{ color: "var(--text)" }}>{fmt(delivery)}</span></div>
          {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, color: "#F59E0B" }}><span>Réduction</span><span>-{fmt(discount)}</span></div>}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, paddingTop: 8, borderTop: "2px solid var(--border)", color: "#F97316" }}>
            <span>Total</span><span>{fmt(total)}</span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px 20px", textAlign: "center", borderTop: "2px dashed var(--border)" }}>
          <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 10 }}>Merci pour votre achat sur Lamuka Market !</p>
          <p style={{ fontSize: 9, color: "var(--muted)", opacity: .6 }}>www.lamuka.market · support@lamuka.market · +242 064 663 469</p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, padding: "0 20px 20px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "var(--text)" }}>Fermer</button>
          <button onClick={() => { window.print?.(); }} style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🖨️ Imprimer</button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceView;
