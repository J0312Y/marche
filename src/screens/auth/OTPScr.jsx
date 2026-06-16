import { useState, useEffect } from "react";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";

function OTPScr({ onDone, provider, onEditNumber }) {
  const [timer, setTimer] = useState(45);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTimer(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  const isSocial = !!provider;
  const providerName = provider === "google" ? "Google" : provider === "apple" ? "Apple" : provider === "facebook" ? "Facebook" : "";
  const providerEmail = provider === "google" ? "j***@gmail.com" : provider === "apple" ? "j***@icloud.com" : "j***@facebook.com";

  const handleInput = (val, idx) => {
    const v = val.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[idx] = v;
    setCode(next);
    setError("");
    if (v && idx < 5) {
      const el = document.querySelector(`[data-otp="${idx + 1}"]`);
      el?.focus();
    }
  };

  const handlePaste = (e, idx) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      setError("");
      document.querySelector(`[data-otp="5"]`)?.focus();
    }
  };

  const handleVerify = () => {
    const full = code.join("");
    if (full.length < 6) {
      setError("Entrez les 6 chiffres du code");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onDone();
    }, 800);
  };

  const handleResend = () => {
    setTimer(45);
    setCode(["", "", "", "", "", ""]);
    setError("");
    toast.success("Nouveau code envoyé");
    document.querySelector(`[data-otp="0"]`)?.focus();
  };

  const targetDisplay = isSocial ? providerEmail : "+242 064 XXX XXX";

  return (
    <div className="auth">
      {/* ═══ Back button ═══ */}
      {onEditNumber && (
        <button onClick={onEditNumber} style={{
          width: 38, height: 38, borderRadius: 12,
          border: "1px solid var(--border)", background: "var(--card)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 14, alignSelf: "flex-start",
        }}>
          <Icon name="arrow_left" size={16}/>
        </button>
      )}

      {/* ═══ HERO ICON ═══ */}
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ display: "inline-flex", position: "relative" }}>
          <div style={{
            position: "absolute", inset: -12,
            background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)",
            borderRadius: "50%",
          }}/>
          <div style={{
            position: "relative",
            width: 72, height: 72, borderRadius: 22,
            background: isSocial
              ? (provider === "google" ? "linear-gradient(135deg, #4285F4, #34A853)"
                : provider === "apple" ? "linear-gradient(135deg, #1F2937, #000)"
                : "linear-gradient(135deg, #1877F2, #0D5DC4)")
              : "linear-gradient(135deg, #F97316, #EA580C)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 10px 30px rgba(249,115,22,0.25)",
          }}>
            {isSocial ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* ═══ TITLE + SUBTITLE ═══ */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", margin: "0 0 6px", letterSpacing: -0.4 }}>
          {isSocial ? `Vérification ${providerName}` : "Vérification OTP"}
        </h2>
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
          {isSocial ? "Un code de vérification a été envoyé à votre email" : "Nous avons envoyé un code à 6 chiffres au"}<br/>
          <b style={{ color: "var(--text)", fontWeight: 700 }}>{targetDisplay}</b>
        </div>
        {!isSocial && onEditNumber && (
          <button onClick={onEditNumber} style={{
            marginTop: 8, padding: "5px 12px",
            background: "rgba(249,115,22,0.08)", border: "none",
            borderRadius: 7, fontSize: 11, color: "#F97316", fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <Icon name="edit" size={11} color="#F97316"/>
            Modifier le numéro
          </button>
        )}
      </div>

      {/* ═══ OTP INPUTS ═══ */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 14 }}>
        {code.map((v, i) => (
          <input
            key={i}
            data-otp={i}
            value={v}
            onChange={e => handleInput(e.target.value, i)}
            onPaste={e => handlePaste(e, i)}
            onKeyDown={e => {
              if (e.key === "Backspace" && !v && i > 0) {
                const el = document.querySelector(`[data-otp="${i - 1}"]`);
                el?.focus();
              }
            }}
            style={{
              width: 40, height: 50, borderRadius: 12,
              border: error ? "2px solid #EF4444" : v ? "2px solid #F97316" : "2px solid var(--border)",
              background: v ? "rgba(249,115,22,0.06)" : "var(--light)",
              textAlign: "center", fontSize: 22, fontWeight: 700,
              fontFamily: "inherit", color: "var(--text)",
              outline: "none", transition: "all .15s",
            }}
            maxLength={1}
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {error && (
        <div style={{
          fontSize: 11, color: "#EF4444",
          textAlign: "center", marginBottom: 10,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
        }}>
          <Icon name="info" size={12} color="#EF4444"/>
          {error}
        </div>
      )}

      {/* ═══ TIMER ═══ */}
      <div style={{
        textAlign: "center", fontSize: 12, color: "var(--muted)",
        marginBottom: 16, display: "flex",
        alignItems: "center", justifyContent: "center", gap: 5,
      }}>
        {timer > 0 ? (
          <>
            <Icon name="clock" size={12} color="var(--muted)"/>
            Renvoyer le code dans <b style={{ color: "var(--text)", fontWeight: 700, fontFamily: "monospace" }}>00:{String(timer).padStart(2, "0")}</b>
          </>
        ) : (
          <b onClick={handleResend} style={{
            color: "#F97316", cursor: "pointer", fontWeight: 700,
            display: "inline-flex", alignItems: "center", gap: 4,
          }}>
            <Icon name="refresh" size={12} color="#F97316"/>
            Renvoyer le code
          </b>
        )}
      </div>

      {/* ═══ VERIFY BUTTON ═══ */}
      <button
        onClick={handleVerify}
        disabled={verifying || code.join("").length < 6}
        className="btn-primary"
        style={{
          opacity: verifying || code.join("").length < 6 ? 0.6 : 1,
          cursor: verifying || code.join("").length < 6 ? "not-allowed" : "pointer",
          marginBottom: 14,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
      >
        {verifying ? (
          <>
            <div className="spinner" style={{ width: 14, height: 14 }}/>
            Vérification...
          </>
        ) : "Vérifier le code"}
      </button>

      {/* ═══ HELP CARD ═══ */}
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 14, padding: 12,
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, color: "var(--text)",
          marginBottom: 8,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <Icon name="info" size={13} color="#F97316"/>
          Vous n'avez pas reçu le code ?
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {[
            { num: 1, text: isSocial ? "Vérifiez votre boîte mail et les spams" : "Vérifiez vos messages SMS et le dossier spam", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
            { num: 2, text: "Assurez-vous d'avoir du réseau", color: "#10B981", bg: "rgba(16,185,129,0.1)" },
            { num: 3, text: "Patientez 1 minute avant de renvoyer", color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
          ].map(tip => (
            <div key={tip.num} style={{
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 11, color: "var(--sub)",
            }}>
              <span style={{
                width: 18, height: 18, borderRadius: 6,
                background: tip.bg, color: tip.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontWeight: 700, fontSize: 9,
              }}>{tip.num}</span>
              {tip.text}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <button onClick={() => window.location.href = "tel:+242064663469"} style={{
            flex: 1, padding: "7px 10px",
            border: "1px solid var(--border)", background: "var(--card)",
            borderRadius: 8, fontSize: 11, fontWeight: 600,
            color: "var(--text)", cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <Icon name="chat" size={11}/>
            Support
          </button>
          <button onClick={() => window.open("https://wa.me/242064663469", "_blank")} style={{
            flex: 1, padding: "7px 10px",
            border: "1px solid var(--border)", background: "var(--card)",
            borderRadius: 8, fontSize: 11, fontWeight: 600,
            color: "var(--text)", cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <svg width="11" height="11" viewBox="0 0 32 32" fill="#25D366">
              <path d="M16 2C8.27 2 2 8.27 2 16c0 2.78.81 5.37 2.2 7.55L2 30l6.6-2.16C10.74 29.21 13.3 30 16 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm7.13 17.1c-.4-.2-2.32-1.14-2.68-1.27-.36-.13-.62-.2-.88.2-.26.4-1.03 1.27-1.27 1.53-.23.26-.46.3-.86.1-.4-.2-1.67-.62-3.18-1.96-1.18-1.05-1.97-2.35-2.2-2.75-.23-.4-.02-.62.17-.82.18-.18.4-.46.6-.7.2-.23.26-.4.4-.66.13-.26.06-.5-.03-.7-.1-.2-.88-2.12-1.21-2.91-.32-.76-.64-.66-.88-.67h-.75c-.26 0-.66.1-1 .5-.34.4-1.31 1.28-1.31 3.11 0 1.83 1.34 3.6 1.53 3.86.2.26 2.64 4.03 6.4 5.65.9.39 1.6.62 2.14.8.9.29 1.71.25 2.36.15.72-.11 2.32-.95 2.65-1.87.32-.92.32-1.7.23-1.87-.1-.17-.36-.27-.76-.47z"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>

      {/* ═══ TRUST BADGE ═══ */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "8px 12px",
        background: "rgba(16,185,129,0.06)",
        borderRadius: 8,
      }}>
        <Icon name="shield" size={12} color="#10B981"/>
        <span style={{ fontSize: 10, color: "#047857", fontWeight: 600 }}>
          Code chiffré · Expire dans 10 min
        </span>
      </div>
    </div>
  );
}

export default OTPScr;
