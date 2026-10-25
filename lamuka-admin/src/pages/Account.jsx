import { useState } from "react";
import api from "../api";
import { useLoad, useAction, PageHead, Card, Btn, Field } from "../ui";

/** Mon compte : e-mail de connexion et mot de passe (le mot de passe actuel est demandé pour chaque changement) */
export default function Account() {
  const { data: me, reload } = useLoad(() => api.get("/admin/account"), []);
  const { run, busy } = useAction();
  const [mail, setMail] = useState({ email: "", current: "" });
  const [pw, setPw] = useState({ current: "", next: "", again: "" });
  const [pwErr, setPwErr] = useState("");

  const saveMail = async (e) => {
    e.preventDefault();
    if (await run(() => api.put("/admin/account", { current_password: mail.current, email: mail.email.trim() }), "Adresse e-mail modifiée")) { setMail({ email: "", current: "" }); reload(); }
  };
  const savePw = async (e) => {
    e.preventDefault();
    if (pw.next !== pw.again) { setPwErr("Les deux mots de passe ne correspondent pas"); return; }
    setPwErr("");
    if (await run(() => api.put("/admin/account", { current_password: pw.current, new_password: pw.next }), "Mot de passe modifié")) setPw({ current: "", next: "", again: "" });
  };

  return (
    <div className="page narrow">
      <PageHead title="Mon compte" sub="Identifiants de connexion au panneau d'administration" />
      <Card title="Adresse e-mail">
        <p className="muted">Actuelle : <b>{me?.email || "—"}</b>. C'est votre identifiant de connexion, et l'adresse qui reçoit le code en cas de mot de passe oublié.</p>
        <form className="stack" onSubmit={saveMail}>
          <Field label="Nouvelle adresse"><input type="email" value={mail.email} onChange={(e) => setMail({ ...mail, email: e.target.value })} /></Field>
          <Field label="Mot de passe actuel"><input type="password" autoComplete="current-password" value={mail.current} onChange={(e) => setMail({ ...mail, current: e.target.value })} /></Field>
          <div><Btn disabled={busy || !mail.email.includes("@") || !mail.current}>Changer d'adresse</Btn></div>
        </form>
      </Card>
      <Card title="Mot de passe">
        <form className="stack" onSubmit={savePw}>
          <Field label="Mot de passe actuel"><input type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></Field>
          <Field label="Nouveau mot de passe" hint="Au moins 10 caractères, avec des lettres et des chiffres. Vos autres sessions seront fermées."><input type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></Field>
          <Field label="Confirmer le nouveau mot de passe"><input type="password" autoComplete="new-password" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} /></Field>
          {pwErr && <p className="err">{pwErr}</p>}
          <div><Btn disabled={busy || !pw.current || pw.next.length < 10 || !pw.again}>Changer le mot de passe</Btn></div>
        </form>
      </Card>
    </div>
  );
}
