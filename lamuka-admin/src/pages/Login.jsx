import { useState } from "react";
import api, { setToken } from "../api";

/** Connexion administrateur : e-mail + mot de passe ; mot de passe oublié → code par e-mail → nouveau mot de passe. */
export default function Login({ onDone }) {
  const [step, setStep] = useState("login"); // login | forgot | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [next, setNext] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const go = (s) => { setStep(s); setErr(""); setInfo(""); setCode(""); setNext(""); };
  const call = async (fn) => { setBusy(true); setErr(""); try { await fn(); } catch (x) { setErr(x.message); } setBusy(false); };

  const login = (e) => { e.preventDefault(); call(async () => {
    const r = await api.post("/admin-auth/login", { email: email.trim(), password });
    setToken(r.token); onDone(r.user);
  }); };
  const forgot = (e) => { e.preventDefault(); call(async () => {
    await api.post("/admin-auth/forgot", { email: email.trim() });
    setStep("reset"); setInfo("Si cette adresse correspond à un compte administrateur, un code à 6 chiffres vient d'y être envoyé.");
  }); };
  const reset = (e) => { e.preventDefault(); call(async () => {
    await api.post("/admin-auth/reset", { email: email.trim(), code, password: next });
    setPassword(""); go("login"); setInfo("Mot de passe enregistré. Connectez-vous.");
  }); };

  return (
    <div className="login">
      <div className="login-card">
        <div className="login-brand"><img src="/favicon.png" alt="" /><div><b>lamuka</b><small>Administration</small></div></div>
        {step === "login" && (
          <form onSubmit={login}>
            <h1>Connexion</h1>
            <p className="muted">Accès réservé à l'équipe Lamuka.</p>
            {info && <p className="ok-msg">{info}</p>}
            <label className="field"><span>E-mail</span><input type="email" autoComplete="username" autoFocus value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} placeholder="prenom@lamuka-tech.com" /></label>
            <label className="field"><span>Mot de passe</span>
              <div className="pw-in"><input type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setErr(""); }} />
                <button type="button" onClick={() => setShow(!show)}>{show ? "Masquer" : "Afficher"}</button></div>
            </label>
            {err && <p className="err">{err}</p>}
            <button className="btn pri wide" disabled={busy || !mailOk || !password}>{busy ? "Connexion…" : "Se connecter"}</button>
            <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); go("forgot"); }}>Mot de passe oublié ?</a>
          </form>
        )}
        {step === "forgot" && (
          <form onSubmit={forgot}>
            <h1>Mot de passe oublié</h1>
            <p className="muted">Indiquez l'e-mail de votre compte : vous recevrez un code pour choisir un nouveau mot de passe.</p>
            <label className="field"><span>E-mail</span><input type="email" autoFocus value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} /></label>
            {err && <p className="err">{err}</p>}
            <button className="btn pri wide" disabled={busy || !mailOk}>{busy ? "Envoi…" : "Recevoir le code"}</button>
            <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); go("login"); }}>Retour à la connexion</a>
          </form>
        )}
        {step === "reset" && (
          <form onSubmit={reset}>
            <h1>Nouveau mot de passe</h1>
            {info && <p className="muted">{info}</p>}
            <label className="field"><span>Code reçu</span><input className="code-in" autoFocus inputMode="numeric" maxLength={6} placeholder="••••••" value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }} /></label>
            <label className="field"><span>Nouveau mot de passe</span>
              <div className="pw-in"><input type={show ? "text" : "password"} autoComplete="new-password" value={next} onChange={(e) => { setNext(e.target.value); setErr(""); }} />
                <button type="button" onClick={() => setShow(!show)}>{show ? "Masquer" : "Afficher"}</button></div>
              <small className="muted">Au moins 10 caractères, avec des lettres et des chiffres.</small>
            </label>
            {err && <p className="err">{err}</p>}
            <button className="btn pri wide" disabled={busy || code.length !== 6 || next.length < 10}>{busy ? "Enregistrement…" : "Enregistrer"}</button>
            <a href="#" className="login-link" onClick={(e) => { e.preventDefault(); go("forgot"); }}>Renvoyer un code</a>
          </form>
        )}
      </div>
      <p className="login-foot">© {new Date().getFullYear()} Lamuka Tech · Brazzaville</p>
    </div>
  );
}
