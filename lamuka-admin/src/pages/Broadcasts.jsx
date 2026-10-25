import { useState } from "react";
import { Send } from "lucide-react";
import api from "../api";
import { useLoad, useAction, PageHead, Card, Table, Badge, Confirm, Btn, Field, num, dt } from "../ui";

const AUD = [["all", "Tout le monde"], ["clients", "Clients"], ["vendors", "Commerçants"], ["drivers", "Livreurs"]];
const AUD_LABEL = { ...Object.fromEntries(AUD), test: "Essai (moi seul)" };
const SCREENS = { loyalty: "Mes points (fidélité)", promos: "Codes promo", coursier: "Coursier", vendorReg: "Devenir commerçant", driverReg: "Devenir livreur" };
const ACTIONS = { none: "Ouvrir la liste des notifications", store: "Ouvrir un commerce", screen: "Ouvrir un écran de l'app", url: "Ouvrir un lien web" };

function Compose({ onSent }) {
  const [f, setF] = useState({ title: "", body: "", audience: "all", action_type: "none", action_value: "" });
  const [q, setQ] = useState("");
  const [ask, setAsk] = useState(false);
  const { run, busy } = useAction();
  const count = useLoad(() => api.get("/admin/broadcasts/count", { audience: f.audience }), [f.audience]);
  const stores = useLoad(() => (f.action_type === "store" ? api.get("/admin/establishments", { status: "active", limit: 50, ...(q.trim() ? { search: q.trim() } : {}) }) : Promise.resolve(null)), [f.action_type, q]);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const ready = f.title.trim() && f.body.trim() && (f.action_type === "none" || f.action_value.trim());
  const body = (audience) => ({ ...f, title: f.title.trim(), body: f.body.trim(), audience });
  const c = count.data;
  const send = async () => {
    const r = await run(() => api.post("/admin/broadcasts", body(f.audience)), "Notification envoyée");
    setAsk(false);
    if (r) { setF({ title: "", body: "", audience: f.audience, action_type: "none", action_value: "" }); onSent(); }
  };
  const test = async () => { if (await run(() => api.post("/admin/broadcasts", body("test")), "Essai envoyé sur votre compte")) onSent(); };
  return (
    <div className="notif-grid">
      <Card title="Nouveau message">
        <div className="stack wide">
          <Field label="Titre" hint={`${f.title.length}/80`}><input value={f.title} maxLength={80} onChange={set("title")} placeholder="Ex. : La livraison est offerte ce week-end" /></Field>
          <Field label="Message" hint={`${f.body.length}/300`}><textarea rows={4} value={f.body} maxLength={300} onChange={set("body")} placeholder="Ex. : Chez tous nos restaurants partenaires, du vendredi au dimanche." /></Field>
          <Field label="Destinataires">
            <div className="seg">{AUD.map(([k, l]) => <button key={k} className={f.audience === k ? "on" : ""} onClick={() => setF({ ...f, audience: k })}>{l}</button>)}</div>
          </Field>
          <p className="count-line">{count.loading ? "Calcul…" : c ? <><b>{num(c.recipients)}</b> compte{c.recipients > 1 ? "s" : ""} : le message apparaîtra dans leur écran Notifications. <b>{num(c.with_push)}</b> le recevr{c.with_push > 1 ? "ont" : "a"} aussi en alerte sur le téléphone (notifications activées).</> : "—"}</p>
          <Field label="Quand on touche la notification">
            <select value={f.action_type} onChange={(e) => setF({ ...f, action_type: e.target.value, action_value: "" })}>{Object.entries(ACTIONS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          </Field>
          {f.action_type === "store" && <Field label="Commerce"><div className="pick-store"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un commerce…" />
            <select value={f.action_value} onChange={set("action_value")}><option value="">{stores.loading ? "Chargement…" : "Choisir…"}</option>{(stores.data?.establishments || []).map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div></Field>}
          {f.action_type === "screen" && <Field label="Écran"><select value={f.action_value} onChange={set("action_value")}><option value="">Choisir…</option>{Object.entries(SCREENS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>}
          {f.action_type === "url" && <Field label="Lien"><input value={f.action_value} onChange={set("action_value")} placeholder="https://…" /></Field>}
          <div className="inline">
            <Btn kind="ghost" disabled={busy || !ready} onClick={test}>Envoyer un essai à moi</Btn>
            <Btn disabled={busy || !ready || !c?.recipients} onClick={() => setAsk(true)}><Send size={16} />Envoyer à {c ? num(c.recipients) : "…"} compte{c?.recipients > 1 ? "s" : ""}</Btn>
          </div>
        </div>
      </Card>
      <div className="phone-prev">
        <small className="top">Aperçu sur le téléphone</small>
        <div className="push-card"><img src="/favicon.png" alt="" /><div style={{ minWidth: 0, flex: 1 }}><div style={{ display: "flex", gap: 6 }}><b>{f.title.trim() || "Titre du message"}</b><span className="when">maintenant</span></div><p>{f.body.trim() || "Le texte du message s'affiche ici."}</p></div></div>
      </div>
      {ask && <Confirm title={`Envoyer à ${num(c.recipients)} compte${c.recipients > 1 ? "s" : ""} ?`} confirm="Envoyer" busy={busy} onCancel={() => setAsk(false)} onConfirm={send}
        text={`« ${f.title.trim()} » — ${AUD_LABEL[f.audience].toLowerCase()}. Un message envoyé ne peut pas être retiré des téléphones.`} />}
    </div>
  );
}

export default function Broadcasts() {
  const hist = useLoad(() => api.get("/admin/broadcasts"), []);
  const rows = Array.isArray(hist.data) ? hist.data : [];
  return (
    <div className="page">
      <PageHead title="Notifications" sub="Envoyer un message aux utilisateurs de l'app : promotion, nouveauté, information importante" />
      <Compose onSent={hist.reload} />
      <h3 className="sub-h" style={{ margin: "28px 0 10px" }}>Messages envoyés</h3>
      <Table rows={rows} loading={hist.loading} error={hist.error} empty="Aucun message envoyé pour l'instant." cols={[
        { k: "t", label: "Message", render: (b) => <><b>{b.title}</b><small className="block clamp">{b.body}</small></> },
        { k: "a", label: "Destinataires", render: (b) => b.audience === "test" ? <Badge tone="mut">Essai</Badge> : AUD_LABEL[b.audience] },
        { k: "n", label: "Comptes", right: true, render: (b) => num(b.recipients) },
        { k: "p", label: "Alertes téléphone", right: true, render: (b) => num(b.pushed) },
        { k: "d", label: "Envoyé", render: (b) => <>{dt(b.created_at)}{b.sender && <small className="block">par {b.sender}</small>}</> },
      ]} />
    </div>
  );
}
