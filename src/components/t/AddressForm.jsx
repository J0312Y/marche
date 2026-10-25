import { useState } from "react";
import Sheet from "./Sheet";
import Icon from "../Icon";
import { addressesAPI } from "../../api";
import { deliveryCity } from "../../utils/zone";

const LABELS = [["Maison", "home"], ["Bureau", "briefcase"], ["Autre", "map_pin"]];

/**
 * Détails d'une adresse après le choix sur la carte : nom (Maison / Bureau / Autre), rue, repère.
 * spot : { lat, lng, quarter, zone } ; onSaved(address) une fois enregistrée côté serveur.
 */
export default function AddressForm({ spot, onSaved, onClose, onMove, makeDefault = true }) {
  const [label, setLabel] = useState("Maison");
  const [other, setOther] = useState("");
  const [street, setStreet] = useState(spot.road || "");
  const [notes, setNotes] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (label === "Autre" && !other.trim()) { setErr("Donnez un nom à cette adresse"); return; }
    setBusy(true); setErr("");
    const body = {
      label: label === "Autre" ? other.trim() : label,
      address: street.trim() || `Quartier ${spot.quarter}`,
      quarter: spot.quarter, city: spot.zone || deliveryCity(),
      latitude: spot.lat, longitude: spot.lng,
      instructions: notes.trim() || null, is_default: makeDefault ? 1 : 0,
    };
    try {
      const r = await addressesAPI.create(body);
      onSaved?.({ ...body, id: r?.id ?? r?.address?.id });
    } catch (e) { setErr(e.message || "Impossible d'enregistrer l'adresse"); }
    finally { setBusy(false); }
  };

  return (
    <Sheet onClose={busy ? undefined : onClose} title="Détails de l'adresse" maxHeight="94%">
      <div style={{ padding: "6px 16px 16px" }}>
        <button className="ta-spot" onClick={onMove}>
          <Icon name="map_pin" size={22} color="var(--acc)" />
          <span><b>{spot.quarter}</b><small>{spot.zone || deliveryCity()} · position sur la carte</small></span>
          <span className="t-pill-btn">Modifier</span>
        </button>
        <div className="ta-lab">
          {LABELS.map(([l, ic]) => (
            <button key={l} className={label === l ? "on" : ""} onClick={() => setLabel(l)}><Icon name={ic} size={18} color={label === l ? "var(--acc)" : "var(--t-sub)"} />{l}</button>
          ))}
        </div>
        {label === "Autre" && <div className="t-field"><input className="t-input" placeholder="Nom de l'adresse (ex. : Chez maman)" value={other} onChange={(e) => { setOther(e.target.value); setErr(""); }} /></div>}
        <div className="t-field"><input className="t-input" placeholder="Rue, numéro, immeuble (facultatif)" value={street} onChange={(e) => setStreet(e.target.value)} /></div>
        <div className="t-field"><textarea className="t-note" style={{ minHeight: 80 }} maxLength={250} placeholder="Indications pour le livreur (portail bleu, en face de la pharmacie…)" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
        {err && <div style={{ color: "#E5484D", fontSize: 14, marginBottom: 10 }}>{err}</div>}
        <button className="t-cta center" style={{ width: "100%", height: 52, justifyContent: "center", fontSize: 17 }} disabled={busy} onClick={save}>{busy ? "Enregistrement…" : "Enregistrer l'adresse"}</button>
      </div>
    </Sheet>
  );
}
