import { useState } from "react";
import toast from "../../utils/toast";
import { LEVELS, STREAK_REWARDS, getLevel, getNextLevel } from "../../data/loyalty";
import { fmt } from "../../utils/helpers";
import CountUp from "../../components/CountUp";
import SuccessAnimation from "../../components/SuccessAnimation";

function LoyaltyScr({ onBack, go }) {
  // Read from localStorage or default
  const [loyalty, setLoyalty] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("lk-loyalty") || "{}");
    } catch { return {}; }
  });
  const points = loyalty.points ?? 2450;
  const lifetime = loyalty.lifetimePoints ?? 8200;
  const streak = loyalty.streakDays ?? 4;
  const lastCheckIn = loyalty.lastCheckIn;

  const level = getLevel(lifetime);
  const next = getNextLevel(lifetime);
  const isMaxLevel = next.id === level.id;
  const progress = isMaxLevel ? 100 : Math.round(((lifetime - level.min) / (next.min - level.min)) * 100);

  const [showClaim, setShowClaim] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);

  const today = new Date().toDateString();
  const canCheckIn = lastCheckIn !== today;

  const handleCheckIn = () => {
    const day = (streak % 7);
    const reward = STREAK_REWARDS[day];
    const newLoyalty = {
      points: points + reward,
      lifetimePoints: lifetime + reward,
      streakDays: streak + 1,
      lastCheckIn: today,
    };
    setLoyalty(newLoyalty);
    localStorage.setItem("lk-loyalty", JSON.stringify(newLoyalty));
    setClaimedAmount(reward);
    setShowClaim(true);
  };

  if (showClaim) return <SuccessAnimation
    title={`+${claimedAmount} points !`}
    subtitle={`Jour ${streak + 1} du streak 🔥`}
    hint="Continuez demain pour gagner plus"
    duration={2000}
    onDone={() => setShowClaim(false)}
  />;

  return (
    <div className="scr" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 14 }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, flex: 1 }}>Lamuka Points</h2>
      </div>

      {/* Hero card with level + points */}
      <div style={{ margin: "0 16px 14px", padding: 20, background: `linear-gradient(135deg, ${level.color}22 0%, ${level.color}08 100%)`, border: `2px solid ${level.color}33`, borderRadius: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, fontSize: 100, opacity: .15 }}>{level.icon}</div>
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 10, color: level.color, fontWeight: 800, letterSpacing: 1, marginBottom: 4 }}>NIVEAU {level.name.toUpperCase()}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 800, color: level.color }}>
              <CountUp to={points} duration={1500} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--sub)" }}>points</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>≈ {fmt(points)} de réduction</div>

          {/* Progress to next level */}
          {!isMaxLevel && <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 6 }}>
              <span style={{ color: "var(--muted)" }}>{lifetime} / {next.min} pts vers</span>
              <span style={{ color: next.color, fontWeight: 700 }}>{next.icon} {next.name}</span>
            </div>
            <div style={{ height: 8, background: "rgba(0,0,0,.06)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${level.color}, ${next.color})`, borderRadius: 4, transition: "width 1s ease" }} />
            </div>
          </div>}
        </div>
      </div>

      {/* Daily check-in */}
      <div style={{ margin: "0 16px 14px", padding: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>🔥 Connexion quotidienne</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Streak : {streak} jour{streak > 1 ? "s" : ""} {streak >= 7 ? "🎉" : ""}</div>
          </div>
          {canCheckIn ? (
            <button onClick={handleCheckIn} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "#F97316", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Récupérer</button>
          ) : (
            <span style={{ padding: "8px 12px", borderRadius: 10, background: "rgba(16,185,129,0.08)", color: "#10B981", fontSize: 11, fontWeight: 700 }}>✓ Reçu</span>
          )}
        </div>
        {/* 7-day calendar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
          {STREAK_REWARDS.map((reward, i) => {
            const completed = i < (streak % 7);
            const isToday = i === (streak % 7);
            return (
              <div key={i} style={{
                padding: "8px 4px", borderRadius: 10, textAlign: "center",
                background: completed ? "rgba(16,185,129,0.08)" : isToday ? "rgba(249,115,22,0.08)" : "var(--light)",
                border: isToday ? "2px solid #F97316" : "1px solid transparent",
              }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: "var(--muted)", marginBottom: 2 }}>J{i + 1}</div>
                <div style={{ fontSize: 13 }}>{completed ? "✓" : reward >= 1000 ? "🎁" : "🔥"}</div>
                <div style={{ fontSize: 8, fontWeight: 700, color: completed ? "#10B981" : isToday ? "#F97316" : "var(--muted)", marginTop: 2 }}>+{reward}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Use points CTA */}
      <div style={{ margin: "0 16px 14px", padding: 16, background: "linear-gradient(135deg,#F97316,#EA580C)", borderRadius: 16, color: "#fff", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 28 }}>💰</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Utiliser mes points</div>
          <div style={{ fontSize: 11, opacity: .85, marginTop: 2 }}>Réduction au prochain achat</div>
        </div>
        <span style={{ fontSize: 20 }}>›</span>
      </div>

      {/* Levels overview */}
      <div style={{ margin: "0 16px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, padding: "0 4px" }}>📊 Tous les niveaux</div>
        {LEVELS.map(l => {
          const isCurrent = l.id === level.id;
          return (
            <div key={l.id} style={{ padding: 14, background: isCurrent ? `${l.color}08` : "var(--card)", border: `1px solid ${isCurrent ? l.color + "33" : "var(--border)"}`, borderRadius: 14, marginBottom: 6, display: "flex", gap: 12 }}>
              <div style={{ fontSize: 28 }}>{l.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: isCurrent ? l.color : "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                  {l.name}
                  {isCurrent && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: l.color, color: "#fff", fontWeight: 700 }}>ACTUEL</span>}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>À partir de {l.min.toLocaleString()} pts</div>
                <ul style={{ marginTop: 6, paddingLeft: 18, fontSize: 11, color: "var(--sub)" }}>
                  {l.perks.map((p, i) => <li key={i} style={{ marginBottom: 2 }}>{p}</li>)}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LoyaltyScr;
