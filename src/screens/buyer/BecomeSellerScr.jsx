import { useState } from "react";
import toast from "../../utils/toast";

function BecomeSellerScr({ onBack, go }) {
  const [contactSent, setContactSent] = useState(false);

  return (
    <div className="scr" style={{ paddingBottom: 20 }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#F97316,#EA580C)", borderRadius: "0 0 32px 32px", padding: "20px 20px 32px", textAlign: "center", position: "relative", color: "#fff" }}>
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 12, border: "none", background: "rgba(255,255,255,.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16 }}>←</button>
        </div>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "24px auto 16px" }}>
          <svg width="36" height="36" viewBox="0 0 64 64" fill="none"><path d="M20 20h3l5 22h14l5-16H26" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="29" cy="48" r="3" fill="#fff"/><circle cx="41" cy="48" r="3" fill="#fff"/></svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Devenir Vendeur</h2>
        <p style={{ fontSize: 14, opacity: .85 }}>Commencez à vendre sur Lamuka Market</p>
      </div>

      {/* Why sell */}
      <div style={{ padding: "24px 20px 8px" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Pourquoi vendre sur Lamuka ?</h3>

        {[
          ["👥", "#10B981", "Des milliers de clients", "Accédez à une base de clients en pleine croissance à Brazzaville et Pointe-Noire"],
          ["📈", "#F97316", "Développez votre activité", "Outils et statistiques pour booster vos ventes"],
          ["💳", "#3B82F6", "Paiements sécurisés", "Airtel Money, MTN MoMo — paiement rapide et garanti"],
          ["🚚", "#8B5CF6", "Livraison intégrée", "Réseau de livreurs Lamuka ou vos propres livreurs"],
        ].map(([icon, color, title, desc], i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* How to get started */}
      <div style={{ padding: "8px 20px 20px" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Comment commencer</h3>

        {[
          ["1", "Créez votre compte", "Inscrivez-vous gratuitement en 2 minutes"],
          ["2", "Vérifiez votre identité", "Uploadez vos documents (pièce d'identité, photo)"],
          ["3", "Configurez votre boutique", "Ajoutez vos produits, logo et informations"],
          ["4", "Commencez à vendre", "Recevez des commandes et développez votre business"],
        ].map(([num, title, desc], i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16, position: "relative" }}>
            {i < 3 && <div style={{ position: "absolute", left: 19, top: 40, width: 2, height: 28, background: "rgba(249,115,22,0.15)" }} />}
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 800, flexShrink: 0 }}>{num}</div>
            <div style={{ paddingTop: 2 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Plans preview */}
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ padding: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📋 Nos plans</div>
          {[
            ["Starter", "Gratuit", "Idéal pour débuter · 5% commission"],
            ["Pro", "9 900 F/mois", "Boutique avancée · 3% commission"],
            ["Enterprise", "Sur mesure", "API, CMS, support dédié"],
          ].map(([name, price, desc], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>{desc}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: i === 0 ? "#10B981" : "#F97316" }}>{price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: "0 20px 20px" }}>
        <button onClick={() => go("roleReg")} style={{ width: "100%", padding: 16, borderRadius: 16, border: "none", background: "#F97316", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", marginBottom: 10 }}>
          Commencer à vendre
        </button>
        <button onClick={() => {
          if (!contactSent) {
            setContactSent(true);
            toast.success("Notre équipe vous contactera sous 24h !");
          }
        }} style={{ width: "100%", padding: 14, borderRadius: 16, border: "2px solid #F97316", background: "transparent", color: "#F97316", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {contactSent ? "✅ Demande envoyée !" : "Contacter l'équipe commerciale"}
        </button>
      </div>
    </div>
  );
}

export default BecomeSellerScr;
