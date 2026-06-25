import { useEffect, useState } from "react";
import Icon from "./Icon";

// ════════════════════════════════════════════════════════════
//  PlanUpgradeCelebration — Animation de bienvenue après upgrade
// ════════════════════════════════════════════════════════════

const PLAN_INFO = {
  pro: {
    name: "Pro",
    emoji: "",
    gradient: "linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%)",
    accentBg: "rgba(249, 115, 22, 0.1)",
    accent: "#F97316",
    welcome: "Bienvenue chez les Pros !",
    benefits: [
      { icon: "lightning", text: "Articles illimités" },
      { icon: "coin", text: "Commission réduite à 4%" },
      { icon: "shield", text: "Badge vérifié" },
      { icon: "chart_pie", text: "Analytics avancés" },
      { icon: "headphones", text: "Support prioritaire" },
      { icon: "tag", text: "Promotions illimitées" },
    ],
    cta: "C'est parti !",
    tagline: "Vos ventes vont décoller — bonnes ventes !",
  },
  enterprise: {
    name: "Enterprise",
    emoji: "",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #92400E 100%)",
    accentBg: "rgba(245, 158, 11, 0.12)",
    accent: "#F59E0B",
    welcome: "Bienvenue dans l'élite !",
    benefits: [
      { icon: "store", text: "Multi-établissements" },
      { icon: "coin", text: "Commission minimale 2%" },
      { icon: "globe", text: "Site web vendor (CMS)" },
      { icon: "tool", text: "API complète" },
      { icon: "user", text: "Manager dédié 24/7" },
      { icon: "mail", text: "Email marketing illimité" },
      { icon: "chart_pie", text: "Analytics premium" },
      { icon: "key", text: "Domaine personnalisé" },
    ],
    cta: "Démarrer en grand !",
    tagline: "Bienvenue dans la première division — l'aventure commence !",
  },
};

export default function PlanUpgradeCelebration({ plan, onDone }) {
  const info = PLAN_INFO[plan] || PLAN_INFO.pro;
  const [phase, setPhase] = useState(0); // 0=intro, 1=show benefits, 2=ready

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 700);
    const t2 = setTimeout(() => setPhase(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 200,
      background: info.gradient,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      animation: "celebFade 0.4s ease-out",
    }}>
      <style>{`
        @keyframes celebFade { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        @keyframes celebConfetti {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes celebPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes celebShine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        @keyframes celebSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes celebFloatStar {
          0% { transform: translate(0,0) rotate(0); opacity: 1; }
          100% { transform: translate(var(--tx),var(--ty)) rotate(720deg); opacity: 0; }
        }
        .celeb-confetti-piece {
          position: absolute;
          width: 10px; height: 14px;
          top: -20px;
          animation: celebConfetti linear forwards;
        }
        .celeb-benefit-item {
          animation: celebSlideUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      {/* Confetti animation */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 50 }).map((_, i) => {
          const colors = ["#fff", "#FFD700", "#FFB6C1", "#90EE90", "#87CEEB", "#FFA500"];
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className="celeb-confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                background: color,
                animationDuration: `${3 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
                borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "0",
              }}
            />
          );
        })}
      </div>

      {/* Hero Icon */}
      <div style={{
        flex: "0 0 auto", paddingTop: 60, paddingBottom: 30,
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 80,
          animation: phase >= 0 ? "celebPulse 1.8s ease-in-out infinite" : "none",
          filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.25))",
        }}>
          {info.emoji}
        </div>
        <div style={{
          marginTop: 14,
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 3,
          opacity: 0.85,
          textTransform: "uppercase",
        }}>
          Plan {info.name} Activé
        </div>
        <h1 style={{
          color: "#fff",
          fontSize: 26,
          fontWeight: 800,
          marginTop: 8,
          letterSpacing: -0.6,
          textShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}>
          {info.welcome}
        </h1>
      </div>

      {/* Benefits card */}
      <div style={{
        flex: "1 1 auto",
        margin: "0 18px",
        padding: "20px 18px",
        background: "rgba(255,255,255,0.96)",
        borderRadius: 22,
        backdropFilter: "blur(20px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.5s ease-out",
        overflow: "auto",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
          color: info.accent, textTransform: "uppercase",
          marginBottom: 12, textAlign: "center",
        }}>✨ Vous débloquez maintenant</div>

        <div style={{ display: "grid", gap: 10 }}>
          {info.benefits.map((b, idx) => (
            <div
              key={idx}
              className="celeb-benefit-item"
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 12px",
                background: info.accentBg,
                borderRadius: 12,
                animationDelay: `${0.8 + idx * 0.08}s`,
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: info.accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 3px 8px ${info.accent}40`,
              }}>
                <Icon name={b.icon} size={14} color="#fff"/>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: "#191815",
                flex: 1,
              }}>{b.text}</div>
              <div style={{
                fontSize: 16, color: info.accent, fontWeight: 800,
              }}>✓</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 18,
          padding: 12,
          background: "linear-gradient(135deg, rgba(0,0,0,0.04), rgba(0,0,0,0.01))",
          borderRadius: 12,
          textAlign: "center",
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 0.5s ease-out",
        }}>
          <div style={{ fontSize: 12, color: "#5E5B53", fontStyle: "italic", lineHeight: 1.5 }}>
            « {info.tagline} »
          </div>
        </div>
      </div>

      {/* CTA button at the bottom */}
      <div style={{
        flex: "0 0 auto",
        padding: "18px",
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease-out 0.2s",
      }}>
        <button
          onClick={onDone}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            border: "none",
            background: "#fff",
            color: info.accent,
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span style={{ position: "relative", zIndex: 2 }}>{info.cta} →</span>
          <span style={{
            position: "absolute",
            top: 0, left: 0,
            width: "50%", height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            animation: "celebShine 2.5s ease-in-out infinite",
          }}/>
        </button>
      </div>
    </div>
  );
}
