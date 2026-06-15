import { useApp } from "../context/AppContext";
import Icon from "./Icon";

/**
 * GuestPrompt — Bottom sheet that prompts a guest user to log in.
 * 
 * Usage:
 *   const { requireAuth, GuestPromptUI } = useGuestPrompt();
 *   
 *   return <>
 *     <button onClick={() => requireAuth("checkout", () => proceedCheckout())}>Buy</button>
 *     <GuestPromptUI/>
 *   </>;
 */

const REASONS = {
  checkout: {
    title: "Connectez-vous pour commander",
    desc: "Créez un compte gratuit en 30 secondes pour finaliser votre commande.",
    icon: "creditCard",
  },
  favorite: {
    title: "Connectez-vous pour aimer",
    desc: "Créez un compte gratuit pour sauvegarder vos articles préférés et les retrouver sur tous vos appareils.",
    icon: "heart",
  },
  follow: {
    title: "Connectez-vous pour suivre",
    desc: "Créez un compte pour suivre cette boutique et être notifié des nouveautés et promos.",
    icon: "store",
  },
  chat: {
    title: "Connectez-vous pour discuter",
    desc: "Vous devez avoir un compte pour échanger avec un vendeur ou un livreur.",
    icon: "chat",
  },
  review: {
    title: "Connectez-vous pour laisser un avis",
    desc: "Seuls les clients vérifiés peuvent noter et commenter les produits.",
    icon: "star_full",
  },
  comment: {
    title: "Connectez-vous pour commenter",
    desc: "Créez un compte pour participer à la conversation.",
    icon: "chat",
  },
  orders: {
    title: "Connectez-vous pour voir vos commandes",
    desc: "L'historique de vos commandes est lié à votre compte personnel.",
    icon: "package",
  },
  profile: {
    title: "Connectez-vous pour accéder à votre profil",
    desc: "Vos informations personnelles sont privées et nécessitent un compte.",
    icon: "user",
  },
  wallet: {
    title: "Connectez-vous pour accéder au portefeuille",
    desc: "Votre solde, cartes et historique de paiement nécessitent un compte.",
    icon: "wallet",
  },
  follow: {
    title: "Connectez-vous pour suivre",
    desc: "Suivez vos boutiques préférées et recevez leurs nouveautés.",
    icon: "user",
  },
  vendor: {
    title: "Connectez-vous pour vendre",
    desc: "Pour ouvrir une boutique sur Lamuka, créez d'abord votre compte.",
    icon: "store",
  },
  driver: {
    title: "Connectez-vous pour livrer",
    desc: "Pour devenir livreur Lamuka, créez d'abord votre compte.",
    icon: "truck",
  },
  default: {
    title: "Connectez-vous pour continuer",
    desc: "Cette action nécessite un compte Lamuka.",
    icon: "shield",
  },
};

function GuestPrompt({ reason = "default", onClose, onLogin }) {
  const r = REASONS[reason] || REASONS.default;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 480, padding: "24px 24px 32px", animation: "slideUp .3s ease" }}>
        <div style={{ width: 40, height: 4, background: "#E5E7EB", borderRadius: 2, margin: "0 auto 20px" }} />

        <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.05))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", color: "#F97316" }}>
          <Icon name={r.icon} size={36} color="#F97316" />
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, textAlign: "center", letterSpacing: -.4, color: "#1A1F2E" }}>{r.title}</h2>
        <p style={{ fontSize: 13, color: "#6B7280", textAlign: "center", marginTop: 8, lineHeight: 1.5, padding: "0 8px" }}>{r.desc}</p>

        <div style={{ marginTop: 24 }}>
          <button onClick={onLogin} style={{ width: "100%", padding: "14px 16px", border: "none", borderRadius: 14, background: "#F97316", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Se connecter / Créer un compte
          </button>
          <button onClick={onClose} style={{ width: "100%", padding: "14px 16px", border: "none", background: "transparent", color: "#6B7280", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
            Continuer en visite
          </button>
        </div>

        <div style={{ marginTop: 16, padding: "12px 14px", background: "#F9FAFB", borderRadius: 10, fontSize: 11, color: "#6B7280", textAlign: "center", lineHeight: 1.5 }}>
          C'est rapide : numéro de téléphone + code SMS, c'est tout.
        </div>
      </div>
    </div>
  );
}

export default GuestPrompt;
