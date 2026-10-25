import { useEffect, useState } from "react";
import api from "../api";
import { useLoad, useAction, PageHead, Card, Btn, Field, fmt } from "../ui";

/** Réglages réellement lus par le serveur (les autres lignes de la table « settings » ne sont pas utilisées). */
const FEES = [
  ["delivery_base_fee", "Frais de livraison de base", "Montant fixe de chaque course, avant la distance."],
  ["delivery_per_km", "Frais par kilomètre", "Ajouté pour chaque kilomètre entre le commerce et le client."],
];

export default function Settings({ go }) {
  const { data, reload } = useLoad(() => api.get("/admin/settings"), []);
  const { run, busy } = useAction();
  const [v, setV] = useState({});
  useEffect(() => { if (Array.isArray(data)) setV(Object.fromEntries(data.map((s) => [s.key, s.value]))); }, [data]);
  const val = (k) => v[k] ?? "";
  const save = async (keys) => {
    const body = Object.fromEntries(keys.map((k) => [k, String(v[k] ?? "").trim()]));
    if (await run(() => api.post("/admin/settings", body), "Réglages enregistrés")) reload();
  };
  const base = Number(val("delivery_base_fee")) || 0, perKm = Number(val("delivery_per_km")) || 0;

  return (
    <div className="page narrow">
      <PageHead title="Paramètres" sub="Réglages appliqués immédiatement dans l'application" />
      {!data ? <p className="muted">Chargement…</p> : <>
        <Card title="Frais de livraison par défaut" action={<Btn size="sm" disabled={busy} onClick={() => save(FEES.map(([k]) => k))}>Enregistrer</Btn>}>
          <div className="form-grid">
            {FEES.map(([k, l, h]) => <Field key={k} label={l} hint={h}><div className="money"><input type="number" min="0" step="50" value={val(k)} onChange={(e) => setV({ ...v, [k]: e.target.value })} /><span>F</span></div></Field>)}
          </div>
          <p className="muted small">Exemple : une course de 3 km coûte {fmt(base + 3 * perKm)} ({fmt(base)} + 3 × {fmt(perKm)}). Le montant, arrondi aux 500 F supérieurs, va au livreur ; un commerce peut l'offrir à ses clients. Ces frais s'appliquent aux villes qui n'ont pas leurs propres frais.</p>
        </Card>
        <Card title="Zones de livraison">
          <div className="inline between">
            <p className="muted small">Villes desservies, leur contour, leurs quartiers et leurs frais propres.</p>
            <Btn kind="ghost" size="sm" onClick={() => go?.("zones")}>Gérer les zones</Btn>
          </div>
        </Card>
        <Card title="Configuré sur le serveur">
          <ul className="plain">
            <li><b>Code de connexion</b> : envoyé par e-mail depuis support@lamuka-tech.com (fichier config/mail.php).</li>
            <li><b>Notifications</b> : Firebase, projet lamuka-market (fichier config/firebase-service-account.json).</li>
            <li><b>Commission</b> : 10 % par défaut, modifiable commerce par commerce dans « Commerces ».</li>
          </ul>
        </Card>
      </>}
    </div>
  );
}
