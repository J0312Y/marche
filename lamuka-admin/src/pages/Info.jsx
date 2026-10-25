import { useEffect, useState } from "react";
import { Plus, ArrowUp, ArrowDown } from "lucide-react";
import api from "../api";
import { useLoad, useAction, PageHead, Card, Badge, Modal, Confirm, Btn, Field, fmt } from "../ui";

// Réglages affichés dans l'app et sur le site (table settings)
const CONTACT = [
  ["contact_company", "Société", "Lamuka Tech"], ["contact_phone", "Téléphone du support", "+242 06X XXX XXX"],
  ["contact_whatsapp", "WhatsApp", "+242 06X XXX XXX"], ["contact_email", "E-mail du support", "support@…"],
  ["contact_hours", "Horaires du support", "Ex. : du lundi au samedi, de 8 h à 20 h"], ["contact_address", "Adresse", "Ville, pays"],
  ["app_store_url", "Lien Google Play", "Vide tant que l'app n'est pas publiée"],
];
const RULES = [
  ["Fidélité", [["loyalty_spend_per_point", "Montant pour 1 point", "F dépensés (hors livraison) pour gagner 1 point", "F"], ["loyalty_min_points", "Seuil d'utilisation", "Points nécessaires avant de pouvoir les utiliser (1 point = 1 F)", "pts"]]],
  ["Parrainage", [["referral_bonus_referrer", "Bonus du parrain", "Crédité sur le porte-monnaie du parrain", "F"], ["referral_bonus_referee", "Bonus du filleul", "Crédité au nouveau client", "F"]]],
  ["Commerçants", [["commission_rate", "Commission par défaut", "Appliquée aux nouveaux commerces ; modifiable commerce par commerce", "%"]]],
  ["Coursier", [["errand_max_budget", "Budget d'achat maximum", "Montant qu'un livreur peut avancer pour un achat", "F"], ["errand_max_weight_kg", "Poids maximum", "Affiché aux clients avant d'envoyer un colis", "kg"]]],
];
// Mentions légales de l'émetteur des factures (vides tant que non renseignées)
const INVOICE = [
  ["invoice_company_name", "Raison sociale", "Ex. : Lamuka Tech SARL (vide = nom de la société ci-dessus)"],
  ["invoice_address", "Adresse du siège", "Vide = adresse ci-dessus"],
  ["invoice_rccm", "RCCM", "Ex. : CG-BZV-01-2026-B12-00000"],
  ["invoice_niu", "NIU", "Numéro d'identification unique"],
  ["invoice_vat_mention", "Mention TVA", "Ex. : TVA non applicable"],
  ["invoice_footer", "Pied de facture", "Texte libre (conditions, remerciement…)"],
];
const AUD = { client: "Clients", vendor: "Commerçants", driver: "Livreurs" };
const PAGES = { terms: "Conditions d'utilisation", privacy: "Confidentialité", delivery: "Livraison et retours", about: "À propos" };

/** Vitesses mesurées sur les trajets des livreurs (30 jours), heure par heure */
function TrafficStats() {
  const { data } = useLoad(() => api.get("/admin/traffic"), []);
  if (!data) return null;
  const now = data.now || {};
  const byKey = Object.fromEntries((data.hours || []).map((h) => [`${h.weekend}-${h.hour}`, h]));
  const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 h → 22 h
  return (
    <div style={{ marginTop: 16 }}>
      <p className="small"><b>Maintenant :</b> {now.speed_kmh} km/h {now.source === "learned" ? `(mesuré sur ${now.samples} trajets)` : "(réglage)"}{now.rush ? " · heure de pointe" : ""}</p>
      <p className="muted small">{data.total ? `${data.total} mesures sur 30 jours. ` : "Aucune mesure pour l'instant : elles s'accumulent pendant les livraisons. "}Une case verte utilise la vitesse réelle (au moins {data.min_samples} mesures).</p>
      {[0, 1].map((we) => (
        <div key={we} style={{ marginTop: 8 }}>
          <div className="small muted">{we ? "Week-end" : "Semaine"}</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${hours.length}, 1fr)`, gap: 3, marginTop: 4 }}>
            {hours.map((h) => { const x = byKey[`${we}-${h}`]; const ok = x && x.samples >= data.min_samples; return (
              <div key={h} title={x ? `${h} h : ${x.speed_kmh} km/h (${x.samples} mesures)` : `${h} h : pas de mesure`} style={{ textAlign: "center", padding: "6px 0", borderRadius: 6, fontSize: 11, background: ok ? "#D1FADF" : x ? "#FEF0C7" : "#F2F4F7", color: "#344054" }}>
                <div style={{ fontWeight: 600 }}>{h}h</div><div>{x ? Math.round(x.speed_kmh) : "–"}</div>
              </div>); })}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Cartes des réglages (hook : appelé à chaque rendu de la page) */
function useSettingsCards() {
  const { data, reload } = useLoad(() => api.get("/admin/settings"), []);
  const { run, busy } = useAction();
  const [v, setV] = useState({});
  useEffect(() => { if (Array.isArray(data)) setV(Object.fromEntries(data.map((s) => [s.key, s.value]))); }, [data]);
  const val = (k) => v[k] ?? "";
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const save = async (keys, msg) => { if (await run(() => api.post("/admin/settings", Object.fromEntries(keys.map((k) => [k, String(v[k] ?? "").trim()]))), msg)) reload(); };
  const tips = String(val("tip_presets"));
  if (!data) return <p className="muted">Chargement…</p>;
  return { contact: (
    <Card title="Coordonnées et application" action={<Btn size="sm" disabled={busy} onClick={() => save(CONTACT.map(([k]) => k), "Coordonnées enregistrées")}>Enregistrer</Btn>}>
      <p className="muted small">Affichées dans l'app (Aide, Support, pages) et sur le site.</p>
      <div className="form-grid" style={{ marginTop: 12 }}>{CONTACT.map(([k, l, ph]) => <Field key={k} label={l}><input value={val(k)} onChange={set(k)} placeholder={ph} /></Field>)}</div>
    </Card>
  ), rules: (
    <div className="stack wide">
      {RULES.map(([title, rows]) => (
        <Card key={title} title={title} action={<Btn size="sm" disabled={busy} onClick={() => save(rows.map(([k]) => k), "Règles enregistrées")}>Enregistrer</Btn>}>
          <div className="form-grid">{rows.map(([k, l, h, u]) => <Field key={k} label={l} hint={h}><div className="money"><input type="number" min="0" value={val(k)} onChange={set(k)} /><span>{u}</span></div></Field>)}</div>
          {title === "Fidélité" && <p className="muted small">Exemple : une commande de 12 000 F rapporte {Math.floor(12000 / Math.max(1, Number(val("loyalty_spend_per_point")) || 100))} points.</p>}
        </Card>
      ))}
      <Card title="Attribution des livreurs" action={<Btn size="sm" disabled={busy} onClick={() => save(["dispatch_mode", "dispatch_offer_seconds", "dispatch_own_seconds", "dispatch_max_km", "dispatch_max_offers"], "Attribution enregistrée")}>Enregistrer</Btn>}>
        <p className="muted small">Au plus proche : chaque course est proposée à un seul livreur à la fois, le plus proche du point de retrait. S'il refuse ou ne répond pas à temps, elle passe au suivant ; après le nombre de livreurs indiqué, ou si personne n'est assez proche, elle est proposée à tous. Un commerçant peut aussi confier une commande à l'un de ses livreurs attitrés : sans réponse de sa part, Lamuka prend le relais.</p>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <Field label="Mode"><select value={val("dispatch_mode") || "auto"} onChange={set("dispatch_mode")}><option value="auto">Au plus proche, un livreur à la fois</option><option value="broadcast">Proposée à tous les livreurs en même temps</option></select></Field>
          <Field label="Temps pour répondre" hint="Livreur choisi par Lamuka"><div className="money"><input type="number" min="15" max="300" value={val("dispatch_offer_seconds")} onChange={set("dispatch_offer_seconds")} /><span>s</span></div></Field>
          <Field label="Temps pour répondre (livreur attitré)" hint="Livreur choisi par le commerçant"><div className="money"><input type="number" min="30" max="900" value={val("dispatch_own_seconds")} onChange={set("dispatch_own_seconds")} /><span>s</span></div></Field>
          <Field label="Distance maximale" hint="Entre le livreur et le point de retrait"><div className="money"><input type="number" min="0.5" max="30" step="0.5" value={val("dispatch_max_km")} onChange={set("dispatch_max_km")} /><span>km</span></div></Field>
          <Field label="Livreurs sollicités un par un" hint="Ensuite, proposée à tous"><div className="money"><input type="number" min="1" max="10" value={val("dispatch_max_offers")} onChange={set("dispatch_max_offers")} /><span>livreurs</span></div></Field>
        </div>
      </Card>
      <Card title="Circulation" action={<Btn size="sm" disabled={busy} onClick={() => save(["traffic_base_speed_kmh", "traffic_rush_factor", "traffic_rush_hours", "traffic_learn_min_samples"], "Circulation enregistrée")}>Enregistrer</Btn>}>
        <p className="muted small">Sert à estimer les temps de trajet (heure d'arrivée du client, temps affiché sur les itinéraires du livreur). Dès qu'assez de vrais trajets sont mesurés pour une heure de la journée, leur vitesse remplace ces réglages.</p>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <Field label="Vitesse moyenne en ville" hint="Hors heures de pointe"><div className="money"><input type="number" min="5" max="60" value={val("traffic_base_speed_kmh")} onChange={set("traffic_base_speed_kmh")} /><span>km/h</span></div></Field>
          <Field label="Ralentissement aux heures de pointe" hint="1,5 = trajets 50 % plus longs"><div className="money"><input type="number" min="1" max="4" step="0.1" value={val("traffic_rush_factor")} onChange={set("traffic_rush_factor")} /><span>×</span></div></Field>
          <Field label="Heures de pointe" hint="Plages séparées par des virgules, ex. 07:00-09:00,16:30-19:00"><input value={val("traffic_rush_hours")} onChange={set("traffic_rush_hours")} placeholder="07:00-09:00,16:30-19:00" /></Field>
          <Field label="Mesures nécessaires" hint="Trajets mesurés à une heure donnée avant d'utiliser leur vitesse réelle"><div className="money"><input type="number" min="5" value={val("traffic_learn_min_samples")} onChange={set("traffic_learn_min_samples")} /><span>mesures</span></div></Field>
        </div>
        <TrafficStats />
      </Card>
      <Card title="Carte" action={<Btn size="sm" disabled={busy} onClick={() => save(["map_update_days"], "Carte enregistrée")}>Enregistrer</Btn>}>
        <p className="muted small">La carte de Brazzaville (OpenStreetMap : rues, ruelles, commerces) est renouvelée automatiquement chaque semaine sur le serveur. L'application télécharge la nouvelle carte (environ 12 Mo) quand elle a assez changé : plus le délai est court, plus les noms de rues ajoutés arrivent vite, mais plus les clients consomment de données.</p>
        <div className="form-grid" style={{ marginTop: 12 }}>
          <Field label="Mettre à jour la carte dans l'app" hint="Quand la carte en ligne a au moins ce nombre de jours de plus que celle du téléphone"><div className="money"><input type="number" min="1" max="365" value={val("map_update_days")} onChange={set("map_update_days")} /><span>jours</span></div></Field>
        </div>
      </Card>
      <Card title="Facturation" action={<Btn size="sm" disabled={busy} onClick={() => save(INVOICE.map(([k]) => k).concat("invoice_email_on_delivery"), "Facturation enregistrée")}>Enregistrer</Btn>}>
        <p className="muted small">En tête de chaque facture remise au client après la livraison (numéro FAC-année-00001, continu). Un champ vide n'apparaît pas sur la facture.</p>
        {(!String(val("invoice_rccm")).trim() || !String(val("invoice_niu")).trim()) && <p className="small" style={{ color: "#B54708", marginTop: 8 }}>RCCM et NIU non renseignés : les factures ne sont pas encore valables légalement.</p>}
        <div className="form-grid" style={{ marginTop: 12 }}>{INVOICE.map(([k, l, ph]) => <Field key={k} label={l}><input value={val(k)} onChange={set(k)} placeholder={ph} /></Field>)}</div>
        <label className="check" style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <input type="checkbox" checked={String(val("invoice_email_on_delivery")) === "1"} onChange={(e) => setV({ ...v, invoice_email_on_delivery: e.target.checked ? "1" : "0" })} />
          Envoyer la facture par e-mail au client à la livraison
        </label>
      </Card>
      <Card title="Pourboires" action={<Btn size="sm" disabled={busy} onClick={() => save(["tip_presets"], "Pourboires enregistrés")}>Enregistrer</Btn>}>
        <Field label="Montants proposés au client après la livraison" hint="Séparés par des virgules, en F. 0 = « Pas de pourboire »."><input value={tips} onChange={set("tip_presets")} placeholder="0,200,500,1000" /></Field>
        <div className="chips">{tips.split(",").map((t) => t.trim()).filter((t) => t !== "" && !isNaN(t)).map((t) => <button key={t} type="button">{Number(t) === 0 ? "Pas de pourboire" : fmt(t)}</button>)}</div>
      </Card>
    </div>
  ) };
}

function FaqEdit({ f, onClose, onDone }) {
  const [x, setX] = useState({ audience: f.audience || "client", question: f.question || "", answer: f.answer || "", is_active: f.id ? String(f.is_active) === "1" : true });
  const { run, busy } = useAction();
  const save = async () => { if (await run(() => (f.id ? api.put(`/admin/faqs/${f.id}`, { ...x, is_active: x.is_active ? 1 : 0 }) : api.post("/admin/faqs", { ...x, is_active: x.is_active ? 1 : 0 })), f.id ? "Question enregistrée" : "Question ajoutée")) onDone(); };
  return (
    <Modal title={f.id ? "Modifier la question" : "Nouvelle question"} onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Annuler</Btn><Btn disabled={busy || x.question.trim().length < 5 || x.answer.trim().length < 5} onClick={save}>Enregistrer</Btn></>}>
      <Field label="Pour"><div className="seg">{Object.entries(AUD).map(([k, l]) => <button key={k} className={x.audience === k ? "on" : ""} onClick={() => setX({ ...x, audience: k })}>{l}</button>)}</div></Field>
      <Field label="Question"><input value={x.question} maxLength={200} onChange={(e) => setX({ ...x, question: e.target.value })} autoFocus /></Field>
      <Field label="Réponse"><textarea rows={6} value={x.answer} maxLength={3000} onChange={(e) => setX({ ...x, answer: e.target.value })} /></Field>
      <label className="check"><input type="checkbox" checked={x.is_active} onChange={(e) => setX({ ...x, is_active: e.target.checked })} />Affichée</label>
    </Modal>
  );
}

function Faq() {
  const { data, reload } = useLoad(() => api.get("/admin/faqs"), []);
  const { run, busy } = useAction();
  const [aud, setAud] = useState("client");
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  const rows = (Array.isArray(data) ? data : []).filter((f) => f.audience === aud);
  const move = async (i, d) => { const ids = rows.map((f) => f.id); const j = i + d; [ids[i], ids[j]] = [ids[j], ids[i]]; if (await run(() => api.put("/admin/faqs", { ids }))) reload(); };
  return (
    <Card title="Questions fréquentes" action={<Btn size="sm" onClick={() => setEdit({ audience: aud })}><Plus size={16} />Nouvelle question</Btn>}>
      <p className="muted small">Clients : écran Aide de l'app et site. Commerçants et livreurs : l'aide de leur espace.</p>
      <div className="seg page-seg" style={{ marginTop: 12 }}>{Object.entries(AUD).map(([k, l]) => <button key={k} className={aud === k ? "on" : ""} onClick={() => setAud(k)}>{l} <small>{(Array.isArray(data) ? data : []).filter((f) => f.audience === k).length}</small></button>)}</div>
      <ul className="faq-list">
        {rows.map((f, i) => (
          <li key={f.id}>
            <div className="bn-order"><button className="icon-btn" disabled={i === 0 || busy} onClick={() => move(i, -1)} aria-label="Monter"><ArrowUp size={15} /></button><button className="icon-btn" disabled={i === rows.length - 1 || busy} onClick={() => move(i, 1)} aria-label="Descendre"><ArrowDown size={15} /></button></div>
            <button className="faq-item" onClick={() => setEdit(f)}><b>{f.question}</b><span className="clamp">{f.answer}</span></button>
            {String(f.is_active) !== "1" && <Badge tone="mut">Masquée</Badge>}
            <Btn kind="link" onClick={() => setDel(f)}>Supprimer</Btn>
          </li>
        ))}
        {!rows.length && <li className="muted">Aucune question pour ce public.</li>}
      </ul>
      {edit && <FaqEdit f={edit} onClose={() => setEdit(null)} onDone={() => { setEdit(null); reload(); }} />}
      {del && <Confirm title="Supprimer cette question ?" danger confirm="Supprimer" busy={busy} text={del.question} onCancel={() => setDel(null)} onConfirm={async () => { if (await run(() => api.del(`/admin/faqs/${del.id}`), "Question supprimée")) { setDel(null); reload(); } }} />}
    </Card>
  );
}

/** Rendu identique à l'app : « ## » titre, « - » liste, ligne vide = paragraphe */
export function PageBody({ text }) {
  const blocks = String(text || "").split(/\n\s*\n/);
  return <div className="page-body">{blocks.map((b, i) => {
    const lines = b.split("\n").filter((l) => l.trim());
    if (!lines.length) return null;
    return lines.map((l, k) => l.startsWith("## ") ? <h4 key={i + "-" + k}>{l.slice(3)}</h4>
      : l.startsWith("- ") ? <li key={i + "-" + k}>{l.slice(2)}</li> : <p key={i + "-" + k}>{l}</p>);
  })}</div>;
}

function Pages() {
  const { data, reload } = useLoad(() => api.get("/admin/pages/all"), []);
  const { run, busy } = useAction();
  const [slug, setSlug] = useState("terms");
  const [x, setX] = useState(null);
  const page = (Array.isArray(data) ? data : []).find((p) => p.slug === slug);
  useEffect(() => { if (page) setX({ title: page.title, body: page.body }); }, [page?.slug, page?.updated_at]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Card title="Pages de texte" action={<Btn size="sm" disabled={busy || !x} onClick={async () => { if (await run(() => api.put(`/admin/pages/${slug}`, x), "Page enregistrée")) reload(); }}>Enregistrer</Btn>}>
      <div className="seg page-seg" style={{ maxWidth: 680 }}>{Object.entries(PAGES).map(([k, l]) => <button key={k} className={slug === k ? "on" : ""} onClick={() => setSlug(k)}>{l}</button>)}</div>
      {x && <div className="page-edit">
        <div className="stack wide">
          <Field label="Titre"><input value={x.title} maxLength={120} onChange={(e) => setX({ ...x, title: e.target.value })} /></Field>
          <Field label="Texte" hint="« ## Titre » pour une section, « - » pour une liste, une ligne vide entre deux paragraphes."><textarea rows={22} value={x.body} onChange={(e) => setX({ ...x, body: e.target.value })} /></Field>
        </div>
        <div className="page-prev"><small className="muted">Aperçu dans l'app</small><h3>{x.title}</h3><PageBody text={x.body} /></div>
      </div>}
    </Card>
  );
}

export default function Info() {
  const [tab, setTab] = useState("contact");
  const s = useSettingsCards();
  return (
    <div className="page">
      <PageHead title="Informations" sub="Coordonnées, règles, questions fréquentes et textes affichés dans l'app et sur le site" />
      <div className="seg page-seg" style={{ maxWidth: 620 }}>{[["contact", "Coordonnées"], ["rules", "Règles"], ["faq", "Questions fréquentes"], ["pages", "Pages de texte"]].map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}</div>
      {tab === "faq" ? <Faq /> : tab === "pages" ? <Pages /> : (s?.[tab] || s)}
    </div>
  );
}
