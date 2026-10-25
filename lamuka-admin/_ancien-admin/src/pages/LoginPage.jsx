import { useState } from "react";
import { X as XIcon, ArrowRight } from "lucide-react";

export default function LoginPage({ onLogin, lang = "fr", branding }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const appName = branding?.appName || "Lamuka";
  const appLogo = branding?.appLogo || null;
  const appSub = branding?.appSubtitle || "Super Admin Dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError(lang === "fr" ? "Veuillez remplir tous les champs" : "Please fill all fields");
      return;
    }
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      // Mock: any email with password "admin" works
      if (password.length >= 4) {
        onLogin({ name: "Joeldy Tsina", email, phone: "+242 064663469", role: "super_admin" });
      } else {
        setError(lang === "fr" ? "Email ou mot de passe incorrect" : "Invalid email or password");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1A1916 0%, #2D2B26 50%, #1A1916 100%)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, animation: "fadeIn 0.4s ease" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          {appLogo ? (
            <img src={appLogo} alt="logo" style={{ width: 64, height: 64, borderRadius: 18, objectFit: "cover", marginBottom: 16, boxShadow: "0 8px 32px rgba(99,102,241,0.3)" }} />
          ) : (
            <div style={{ width: 64, height: 64, borderRadius: 18, background: "#6366F1", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 28, marginBottom: 16, boxShadow: "0 8px 32px rgba(99,102,241,0.3)" }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" fill="currentColor" opacity="0.15"/>
                <path d="M16 2L4 8v16l12 6 12-6V8L16 2z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <path d="M4 8l12 6 12-6M16 14v16" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="16" cy="14" r="3" fill="currentColor"/>
              </svg>
            </div>
          )}
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>{appName} Admin</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>{appSub}</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {lang === "fr" ? "Connexion" : "Sign In"}
          </h2>
          <p style={{ fontSize: 13, color: "#908C82", marginBottom: 24 }}>
            {lang === "fr" ? "Connectez-vous à votre compte admin" : "Sign in to your admin account"}
          </p>

          {error && (
            <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.08)", color: "#EF4444", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center" }}>
              <XIcon size={14} style={{ marginRight: 4 }} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#5E5B53", marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@lamuka.com"
                autoFocus
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #E8E6E1", fontSize: 14, outline: "none", fontFamily: "inherit", transition: "all 0.2s" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#5E5B53", marginBottom: 6 }}>
                {lang === "fr" ? "Mot de passe" : "Password"}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #E8E6E1", fontSize: 14, outline: "none", fontFamily: "inherit", transition: "all 0.2s" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px", borderRadius: 12, border: "none",
                background: loading ? "#A5B4FC" : "#6366F1", color: "#fff",
                fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
              }}
            >
              {loading ? (
                <span>{lang === "fr" ? "Connexion..." : "Signing in..."}</span>
              ) : (
                <span style={{ display: "inline-flex", alignItems: "center" }}>{lang === "fr" ? "Se connecter" : "Sign In"} <ArrowRight size={14} style={{ marginLeft: 4 }} /></span>
              )}
            </button>
          </form>

          <p style={{ fontSize: 11, color: "#C4C1B9", textAlign: "center", marginTop: 20 }}>
            {lang === "fr"
              ? "Mot de passe oublié ? Contactez l'administrateur système."
              : "Forgot password? Contact the system administrator."}
          </p>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11, marginTop: 24 }}>
          © 2026 {appName} Tech · Brazzaville, Congo
        </p>
      </div>
    </div>
  );
}
