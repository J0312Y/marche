import { useEffect, useRef, useState } from "react";
import Sheet from "./Sheet";
import { useApp } from "../../context/AppContext";
import authService from "../../services/authService";

const REASONS = {
  checkout: "Connectez-vous pour passer commande",
  favorite: "Connectez-vous pour garder vos favoris",
  orders: "Connectez-vous pour voir vos commandes",
  errand: "Connectez-vous pour demander une course",
  login: "Connexion ou inscription",
};

// Drapeau du Congo-Brazzaville (vert / jaune / rouge en diagonale)
export const FlagCG = () => (
  <span className="t-flag">
    <svg width="34" height="24" viewBox="0 0 34 24"><polygon points="0,0 22,0 0,24" fill="#009543" /><polygon points="22,0 34,0 34,0 12,24 0,24" fill="#FBDE4A" /><polygon points="34,0 34,24 12,24" fill="#DC241F" /></svg>
  </span>
);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Connexion sans quitter l'écran : numéro → (inscription ou compte sans e-mail) adresse e-mail
 * → code reçu par e-mail → (nouveau compte) prénom/nom.
 * Ouverte par requireLogin(reason, onDone) ; onDone est appelé une fois connecté.
 */
export default function LoginSheet() {
  const { loginSheet, closeLoginSheet, login, showToast } = useApp();
  const [step, setStep] = useState("phone"); // phone | email | code | name
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [mode, setMode] = useState("login");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(null); // { token, user }
  const [resendIn, setResendIn] = useState(0);
  const refs = useRef([]);
  // Le champ prend la main une fois la feuille montée (sinon la page saute pour le montrer)
  const phoneRef = useRef(null);
  const lastRef = useRef(null);
  useEffect(() => {
    if (!loginSheet) return;
    const t = setTimeout(() => phoneRef.current?.focus({ preventScroll: true }), 320);
    return () => clearTimeout(t);
  }, [loginSheet]);
  const codeRef = useRef(["", "", "", "", "", ""]);
  useEffect(() => { codeRef.current = code; }, [code]);

  useEffect(() => {
    if (loginSheet) { setStep("phone"); setPhone(""); setEmail(""); setSentTo(""); setCode(["", "", "", "", "", ""]); setErr(""); setFirst(""); setLast(""); setPending(null); }
  }, [loginSheet]);
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  if (!loginSheet) return null;
  const full = "+242" + phone;

  // Envoi du code ; le serveur choisit l'adresse (celle du compte, sinon celle saisie)
  const request = async (m, mail) => {
    setErr(""); setBusy(true);
    try {
      const r = await authService.sendOTP(full, m, mail || undefined);
      setMode(m); setSentTo(r?.to || "+242 " + phone); setStep("code"); setResendIn(45);
      setTimeout(() => refs.current[0]?.focus({ preventScroll: true }), 150);
    } catch (e) {
      if (e.errors?.code === "email_required") { setMode(m); setStep("email"); }
      else setErr(e.message || "Impossible d'envoyer le code");
    } finally { setBusy(false); }
  };

  const sendCode = async () => {
    if (phone.length !== 9 || !/^0[456]/.test(phone)) { setErr("Numéro à 9 chiffres commençant par 04, 05 ou 06"); return; }
    setErr(""); setBusy(true);
    let m = "login";
    try { const c = await authService.checkPhone(full); if (!c?.exists) m = "signup"; } catch { m = "signup"; }
    setBusy(false);
    if (m === "signup") { setMode(m); setStep("email"); return; } // nouveau compte : l'adresse d'abord
    request(m);
  };

  const sendToEmail = () => {
    const mail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(mail)) { setErr("Adresse e-mail invalide"); return; }
    request(mode, mail);
  };

  const finish = async (token, user, isNew) => {
    await login(token, user, isNew, { inPlace: true });
    const done = loginSheet.onDone;
    closeLoginSheet();
    showToast("Bienvenue" + (user?.first_name ? " " + user.first_name : "") + " !");
    done?.();
  };

  const verify = async (digits) => {
    setBusy(true); setErr("");
    try {
      const r = await authService.verifyOTP(full, digits, mode);
      if (r.is_new || !r.user?.first_name) { setPending({ token: r.token, user: r.user }); setStep("name"); }
      else await finish(r.token, r.user, false);
    } catch (e) {
      setErr(e.message || "Code invalide");
      setCode(["", "", "", "", "", ""]);
      setTimeout(() => refs.current[0]?.focus({ preventScroll: true }), 50);
    } finally { setBusy(false); }
  };

  const onDigit = (i, v) => {
    const d = v.replace(/\D/g, "");
    if (d.length > 1) { // collage du code entier
      const arr = d.slice(0, 6).split("");
      const next = ["", "", "", "", "", ""].map((_, k) => arr[k] || "");
      setCode(next);
      if (arr.length === 6) verify(arr.join(""));
      return;
    }
    // codeRef : saisie rapide → on part toujours des chiffres déjà tapés, pas d'un état périmé
    const next = [...codeRef.current]; next[i] = d; codeRef.current = next; setCode(next);
    if (d && i < 5) refs.current[i + 1]?.focus({ preventScroll: true });
    if (next.every(Boolean)) verify(next.join(""));
  };

  const saveName = async () => {
    if (first.trim().length < 2) { setErr("Entrez votre prénom"); return; }
    setBusy(true); setErr("");
    try {
      // Le jeton doit être actif pour compléter le profil
      const { setToken } = await import("../../api/client");
      setToken(pending.token);
      const u = await authService.completeProfile({ first_name: first.trim(), last_name: last.trim() });
      await finish(pending.token, u || { ...pending.user, first_name: first.trim() }, true);
    } catch (e) { setErr(e.message || "Erreur"); }
    finally { setBusy(false); }
  };

  return (
    <Sheet onClose={busy ? undefined : closeLoginSheet}>
      <div style={{ padding: "10px 20px 24px" }}>
        {step === "phone" && <>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Numéro de téléphone</div>
          <div className="t-sub" style={{ marginBottom: 18, fontSize: 14 }}>{REASONS[loginSheet.reason] || REASONS.login}</div>
          <div className="t-phone">
            <FlagCG />
            <span style={{ fontSize: 18, color: "var(--t-text)" }}>+242</span>
            <input ref={phoneRef} inputMode="numeric" type="tel" autoComplete="tel-national" enterKeyHint="go" placeholder="06X XXX XXX" value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 9)); setErr(""); }}
              onKeyDown={(e) => e.key === "Enter" && sendCode()} />
          </div>
          {err && <div style={{ color: "#E11D48", fontSize: 13, marginTop: 8 }}>{err}</div>}
          <button className="t-cta center" style={{ width: "100%", marginTop: 18 }} disabled={busy || phone.length !== 9} onClick={sendCode}>
            {busy ? <span className="spinner" /> : "Continuer"}
          </button>
          <p className="t-mut" style={{ textAlign: "center", marginTop: 14, lineHeight: 1.5 }}>Vous recevrez un code de connexion par e-mail. En continuant, vous acceptez nos conditions d'utilisation.</p>
        </>}

        {step === "email" && <>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Votre adresse e-mail</div>
          <div className="t-sub" style={{ marginBottom: 18, fontSize: 14, lineHeight: 1.45 }}>
            {mode === "signup" ? "Nous y envoyons votre code de connexion." : "Ajoutez votre adresse e-mail : votre code de connexion y sera envoyé."} Compte : <b style={{ color: "var(--t-text)" }}>+242 {phone}</b> · <span style={{ color: "var(--acc)", fontWeight: 700, cursor: "pointer" }} onClick={() => { setStep("phone"); setErr(""); }}>Modifier</span>
          </div>
          <input className="t-input" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" autoFocus enterKeyHint="go" placeholder="exemple@gmail.com" value={email}
            onChange={(e) => { setEmail(e.target.value.replace(/\s/g, "")); setErr(""); }} onKeyDown={(e) => e.key === "Enter" && sendToEmail()} />
          {err && <div style={{ color: "#E11D48", fontSize: 13, marginTop: 8 }}>{err}</div>}
          <button className="t-cta center" style={{ width: "100%", marginTop: 18 }} disabled={busy || !email.includes("@")} onClick={sendToEmail}>
            {busy ? <span className="spinner" /> : "Recevoir le code"}
          </button>
        </>}

        {step === "code" && <>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Code de vérification</div>
          <div className="t-sub" style={{ marginBottom: 20, fontSize: 14 }}>Entrez le code envoyé à <b style={{ color: "var(--t-text)" }}>{sentTo}</b> · <span style={{ color: "var(--acc)", fontWeight: 700, cursor: "pointer" }} onClick={() => setStep("phone")}>Modifier</span>{sentTo.includes("@") && <><br />Pensez à regarder dans les courriers indésirables.</>}</div>
          <div className="t-otp">
            {code.map((c, i) => (
              <input key={i} ref={(el) => (refs.current[i] = el)} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={6} value={c} disabled={busy}
                onChange={(e) => onDigit(i, e.target.value)}
                onKeyDown={(e) => { if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus(); }} />
            ))}
          </div>
          {err && <div style={{ color: "#E11D48", fontSize: 13, marginTop: 12, textAlign: "center" }}>{err}</div>}
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
            {busy ? <span className="t-mut">Vérification…</span>
              : resendIn > 0 ? <span className="t-mut">Renvoyer le code dans {resendIn} s</span>
              : <span style={{ color: "var(--acc)", fontWeight: 700, cursor: "pointer" }} onClick={async () => { try { await authService.sendOTP(full, mode, email.trim().toLowerCase() || undefined); setResendIn(45); showToast("Code renvoyé"); } catch (e) { setErr(e.message); } }}>Renvoyer le code</span>}
          </div>
        </>}

        {step === "name" && <>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Comment vous appelez-vous ?</div>
          <div className="t-sub" style={{ marginBottom: 18, fontSize: 14 }}>Votre nom est communiqué au livreur.</div>
          <div className="t-field"><input className="t-input" autoFocus placeholder="Prénom" autoCapitalize="words" autoComplete="given-name" enterKeyHint="next" value={first} onChange={(e) => { setFirst(e.target.value); setErr(""); }} onKeyDown={(e) => e.key === "Enter" && lastRef.current?.focus()} /></div>
          <div className="t-field"><input ref={lastRef} className="t-input" placeholder="Nom (facultatif)" autoCapitalize="words" autoComplete="family-name" enterKeyHint="done" value={last} onChange={(e) => setLast(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveName()} /></div>
          {err && <div style={{ color: "#E11D48", fontSize: 13, marginBottom: 8 }}>{err}</div>}
          <button className="t-cta center" style={{ width: "100%" }} disabled={busy} onClick={saveName}>{busy ? <span className="spinner" /> : "Terminer"}</button>
        </>}
      </div>
    </Sheet>
  );
}
