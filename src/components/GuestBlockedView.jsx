import { useApp } from "../context/AppContext";
import Icon from "./Icon";

/**
 * GuestBlockedView — Professional empty-state for guest-gated screens
 * 
 * Usage:
 *   <GuestBlockedView 
 *     icon="package"
 *     title="Suivez vos commandes"
 *     subtitle="Créez un compte pour accéder à l'historique"
 *     benefits={["Suivi en temps réel", "Historique complet", "Notifications"]}
 *     accent="#F97316"
 *   />
 */
function GuestBlockedView({
  icon = "shield",
  title = "Connexion requise",
  subtitle = "Connectez-vous pour accéder à cette section.",
  benefits = [],
  accent = "#F97316",
  onGoHome,
}) {
  const { exitGuestToLogin } = useApp();

  // Lighter and darker shades from accent color
  const lightBg = accent === "#F97316" 
    ? "linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 60%)"
    : `linear-gradient(180deg, ${accent}10 0%, #FFFFFF 60%)`;

  return (
    <div style={{
      minHeight: "100%",
      background: lightBg,
      padding: "32px 20px 100px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>

      {/* HERO ICON with decorative ring */}
      <div style={{
        position: "relative",
        marginTop: 24,
        marginBottom: 28,
      }}>
        {/* Outer decorative ring */}
        <div style={{
          position: "absolute",
          inset: -12,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent}20 0%, transparent 70%)`,
        }}/>
        {/* Main icon container */}
        <div style={{
          width: 92, height: 92,
          borderRadius: 28,
          background: `linear-gradient(135deg, ${accent}, ${accent}dd)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 12px 32px ${accent}40, 0 4px 12px ${accent}30`,
          position: "relative",
          color: "#fff",
        }}>
          <Icon name={icon} size={46} color="#fff"/>
        </div>
      </div>

      {/* TITLE */}
      <h1 style={{
        fontSize: 24,
        fontWeight: 800,
        letterSpacing: -0.6,
        color: "#1A1F2E",
        textAlign: "center",
        marginBottom: 10,
        lineHeight: 1.2,
      }}>{title}</h1>

      {/* SUBTITLE */}
      <p style={{
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 1.55,
        maxWidth: 320,
        margin: 0,
        marginBottom: 24,
      }}>{subtitle}</p>

      {/* BENEFITS CARD */}
      {benefits.length > 0 && (
        <div style={{
          width: "100%",
          maxWidth: 360,
          background: "#FFFFFF",
          border: "1px solid #EDEDF0",
          borderRadius: 18,
          padding: "18px 18px 14px",
          marginBottom: 24,
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}>
          <div style={{
            fontSize: 11,
            color: "#9CA3AF",
            fontWeight: 700,
            letterSpacing: 0.6,
            marginBottom: 12,
            textAlign: "center",
          }}>EN VOUS CONNECTANT, VOUS AUREZ ACCÈS À</div>
          {benefits.map((benefit, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 0",
              borderTop: i > 0 ? "1px solid #F3F4F6" : "none",
            }}>
              <div style={{
                width: 26, height: 26,
                borderRadius: 8,
                background: `${accent}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: accent,
                flexShrink: 0,
              }}>
                <Icon name="check" size={14} color={accent}/>
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#1A1F2E",
              }}>{benefit}</div>
            </div>
          ))}
        </div>
      )}

      {/* PRIMARY CTA */}
      <button onClick={() => exitGuestToLogin()} style={{
        width: "100%",
        maxWidth: 360,
        padding: "15px 20px",
        borderRadius: 14,
        border: "none",
        background: accent,
        color: "#fff",
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: `0 8px 20px ${accent}40`,
        marginBottom: 10,
        transition: "transform .1s",
      }}>
        Créer un compte gratuit
      </button>

      {/* SECONDARY CTA */}
      <button onClick={() => exitGuestToLogin()} style={{
        width: "100%",
        maxWidth: 360,
        padding: "12px 20px",
        borderRadius: 12,
        border: "none",
        background: "transparent",
        color: accent,
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "inherit",
        marginBottom: 16,
      }}>
        J'ai déjà un compte · Se connecter
      </button>

      {/* TRUST INDICATOR */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        background: "#F9FAFB",
        borderRadius: 100,
        fontSize: 11,
        color: "#6B7280",
        fontWeight: 600,
      }}>
        <Icon name="shield" size={14} color="#10B981"/>
        Inscription en 30 secondes · 100% sécurisé
      </div>

      {/* RETURN TO HOME */}
      {onGoHome && (
        <button onClick={onGoHome} style={{
          marginTop: 24,
          padding: "10px 18px",
          border: "none",
          background: "transparent",
          color: "#6B7280",
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}>
          <Icon name="chevron_right_thin" size={14} color="#6B7280" style={{transform:"rotate(180deg)"}}/>
          Continuer à explorer
        </button>
      )}
    </div>
  );
}

export default GuestBlockedView;
