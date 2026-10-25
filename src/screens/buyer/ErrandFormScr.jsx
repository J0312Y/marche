import { useEffect, useState } from "react";
import LocationPicker from "../../components/t/LocationPicker";
import Sheet from "../../components/t/Sheet";
import { RouteMap, RouteStops } from "../../components/t/Route";
import { zoneOf, deliveryCity } from "../../utils/zone";
import Icon from "../../components/Icon";
import { useApp } from "../../context/AppContext";
import { addressesAPI, errandsAPI } from "../../api";
import { fmt } from "../../utils/helpers";
import { fmtPhone } from "../../utils/phoneValidation";
import { appInfo } from "../../config/appInfo";

// Nature du colis (le texte part dans la description de la course)
const KINDS = [
  ["document", "Documents"], ["key", "Clés"], ["bag", "Vêtements"],
  ["phone", "Électronique"], ["utensils", "Repas"], ["package", "Autre"],
];

const EMPTY = { lat: null, lng: null, quarter: "", place: "", name: "", phone: "" };
const phoneOk = (p) => !p || /^0[456]\d{7}$/.test(p);
const fromSaved = (a) => ({ lat: Number(a.latitude), lng: Number(a.longitude), quarter: a.quarter || "", place: [a.label, a.address].filter(Boolean).join(" · "), savedId: Number(a.id) });

/**
 * Lieu d'une étape : adresses enregistrées, carte, repère, contact sur place.
 */
function StopSheet({ title, pin, value, saved, mine, me, onSave, onClose }) {
  const [v, setV] = useState({ ...EMPTY, ...value });
  const [map, setMap] = useState(!value.lat && saved.length === 0);
  const [forMe, setForMe] = useState(mine && (!value.name || value.name === me.name));
  const [err, setErr] = useState("");
  const set = (k) => (e) => { setV({ ...v, [k]: k === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 9) : e.target.value }); setErr(""); };

  const save = () => {
    if (!v.lat) { setErr("Placez le lieu sur la carte"); return; }
    const out = forMe ? { ...v, name: me.name, phone: me.phone } : v;
    if (!forMe && !phoneOk(out.phone)) { setErr("Numéro à 9 chiffres commençant par 04, 05 ou 06"); return; }
    onSave(out);
  };

  if (map) return <LocationPicker title={title} here={pin} cta="Confirmer ce lieu" hint="Placez l'épingle à l'endroit exact : le coursier s'y rendra." initial={v.lat ? { lat: v.lat, lng: v.lng } : null}
    onClose={() => (v.lat ? setMap(false) : onClose())}
    onConfirm={(p) => { setMap(false); setV({ ...v, savedId: null, lat: p.lat, lng: p.lng, quarter: p.quarter, place: v.savedId ? "" : v.place || p.road || "" }); }} />;

  return (
    <Sheet onClose={onClose} title={title} maxHeight="94%">
      <div style={{ padding: "4px 16px 16px" }}>
        {saved.length > 0 && <div className="t-chips" style={{ padding: "0 0 12px", margin: 0 }}>
          {saved.map((a) => (
            <button key={a.id} className={"t-chip" + (v.savedId === Number(a.id) ? " on" : "")} onClick={() => setV({ ...v, ...fromSaved(a) })}>
              <Icon name={a.label === "Bureau" ? "briefcase" : a.label === "Maison" ? "home" : "map_pin"} size={15} color="var(--acc)" />{a.label || a.quarter}
            </button>
          ))}
        </div>}
        <button className="ta-spot" onClick={() => setMap(true)}>
          <span style={{ width: 40, height: 40, borderRadius: 20, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="map_pin" size={20} color="var(--acc)" /></span>
          <span>{v.lat ? <><b>{v.quarter || "Lieu choisi"}</b><small>{zoneOf(v.lat, v.lng) || deliveryCity()} · Modifier sur la carte</small></> : <><b>Choisir sur la carte</b><small>Indispensable pour le coursier</small></>}</span>
          <Icon name="chevron_right" size={20} color="var(--t-sub)" />
        </button>
        <div className="t-field"><label>Rue, repère</label>
          <input className="t-input" placeholder="Ex. : avenue de la Paix, portail bleu" value={v.place} onChange={set("place")} /></div>
        {mine && <div className="tk-seg">
          <button className={forMe ? "on" : ""} onClick={() => setForMe(true)}>C'est pour moi</button>
          <button className={!forMe ? "on" : ""} onClick={() => setForMe(false)}>Pour quelqu'un d'autre</button>
        </div>}
        {(!mine || !forMe) && <div className="tk-two">
          <div className="t-field"><label>{mine ? "Destinataire" : "Contact sur place"}</label>
            <input className="t-input" placeholder="Nom" autoCapitalize="words" value={v.name} onChange={set("name")} /></div>
          <div className="t-field"><label>Téléphone</label>
            <input className="t-input" type="tel" inputMode="numeric" placeholder="06X XXX XXX" value={v.phone} onChange={set("phone")} /></div>
        </div>}
        {err && <div style={{ color: "#E11D48", fontSize: 13, marginBottom: 10 }}>{err}</div>}
        <button className="t-cta center" style={{ width: "100%", height: 52, fontSize: 17 }} onClick={save}>Valider ce lieu</button>
      </div>
    </Sheet>
  );
}

/**
 * Nouvelle course : « send » (envoyer un colis) ou « buy » (faire un achat).
 * Trajet (Récupérer → Livrer) en tête, nature du colis ou liste d'achats, récapitulatif, paiement en espèces.
 */
// « Refaire » une course : mêmes lieux, contacts et description
const fromErrand = (e, k) => ({ lat: e[k + "_lat"] ? Number(e[k + "_lat"]) : null, lng: e[k + "_lng"] ? Number(e[k + "_lng"]) : null, quarter: "", place: e[k + "_address"] || "", name: e[k + "_contact"] || "", phone: String(e[k + "_phone"] || "").replace(/^\+242/, "") });

export default function ErrandFormScr({ type = "send", onBack, go, again = null }) {
  const { showToast, user } = useApp();
  const isBuy = type === "buy";
  const me = { name: [user?.first_name, user?.last_name].filter(Boolean).join(" "), phone: (user?.phone || "").replace(/^\+242/, "") };
  const [saved, setSaved] = useState([]);
  const [pickup, setPickup] = useState(again ? fromErrand(again, "pickup") : EMPTY);
  const [dropoff, setDropoff] = useState(again ? fromErrand(again, "dropoff") : { ...EMPTY, name: me.name, phone: me.phone });
  const [edit, setEdit] = useState(null); // "a" | "b"
  // « Refaire » un colis : description enregistrée « type — précisions » → type re-sélectionné
  const againParts = !isBuy && again?.description ? String(again.description).split(" — ") : [];
  const againKind = againParts.length && KINDS.some(([, l]) => l === againParts[0]) ? againParts[0] : "";
  const [kind, setKind] = useState(againKind);
  const [desc, setDesc] = useState(againKind ? againParts.slice(1).join(" — ") : again?.description || "");
  const [store, setStore] = useState(again?.store_name || "");
  const [budget, setBudget] = useState(again?.items_budget ? String(Number(again.items_budget)) : "");
  const [quote, setQuote] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    addressesAPI.getAll().then((r) => {
      const list = (Array.isArray(r) ? r : r?.addresses || []).filter((a) => a.latitude && zoneOf(Number(a.latitude), Number(a.longitude)));
      setSaved(list);
      const d = list.find((a) => Number(a.is_default) === 1) || list[0];
      if (d && !again) setDropoff((x) => ({ ...x, ...fromSaved(d) }));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    errandsAPI.quote({ pickup_lat: pickup.lat, pickup_lng: pickup.lng, dropoff_lat: dropoff.lat, dropoff_lng: dropoff.lng })
      .then(setQuote).catch(() => setQuote(null));
  }, [pickup.lat, pickup.lng, dropoff.lat, dropoff.lng]);

  const stopSub = (s) => [s.place, s.name && s.phone ? `${s.name} · ${fmtPhone(s.phone)}` : s.name].filter(Boolean).join("\n");
  const ready = dropoff.lat && (isBuy ? store.trim().length >= 2 && desc.trim().length >= 3 : pickup.lat && kind && (kind !== "Autre" || desc.trim().length >= 3));

  const submit = async () => {
    if (!isBuy && !pickup.lat) { setEdit("a"); return; }
    if (!dropoff.lat) { setEdit("b"); return; }
    if (isBuy && store.trim().length < 2) { showToast("Indiquez le magasin", "error"); return; }
    if (isBuy && desc.trim().length < 3) { showToast("Indiquez ce qu'il faut acheter", "error"); return; }
    if (!isBuy && !kind) { showToast("Que transportez-vous ?", "error"); return; }
    if (!isBuy && kind === "Autre" && desc.trim().length < 3) { showToast("Décrivez le colis", "error"); return; }
    const where = (s) => [s.place, s.quarter && `Quartier ${s.quarter}`].filter(Boolean).join(", ");
    setBusy(true);
    try {
      const r = await errandsAPI.create({
        type,
        description: isBuy ? desc.trim() : [kind, desc.trim()].filter(Boolean).join(" — "),
        store_name: isBuy ? store.trim() : undefined,
        items_budget: isBuy && budget ? Number(budget) : 0,
        pickup_address: isBuy ? [store.trim(), where(pickup)].filter(Boolean).join(", ") : where(pickup),
        pickup_lat: pickup.lat, pickup_lng: pickup.lng,
        pickup_contact: pickup.name || undefined, pickup_phone: pickup.phone ? "+242" + pickup.phone : undefined,
        dropoff_address: where(dropoff), dropoff_lat: dropoff.lat, dropoff_lng: dropoff.lng,
        dropoff_contact: dropoff.name || undefined,
        dropoff_phone: dropoff.phone ? "+242" + dropoff.phone : user?.phone,
      });
      showToast("Course demandée");
      go("errandDetail", { id: r?.errand?.id, replace: true });
    } catch (e) { showToast(e.message || "Erreur", "error"); }
    setBusy(false);
  };

  const stops = [
    isBuy
      ? { kind: "a", title: "Acheter chez", main: store.trim() || pickup.quarter, empty: !store.trim() && !pickup.lat ? "Le magasin de votre choix" : null,
          sub: pickup.lat ? `Quartier ${pickup.quarter}` : "Position facultative", onClick: () => setEdit("a") }
      : { kind: "a", title: "Récupérer chez", main: pickup.quarter ? `Quartier ${pickup.quarter}` : "", empty: !pickup.lat ? "Choisir le lieu de retrait" : null, sub: stopSub(pickup), onClick: () => setEdit("a") },
    { kind: "b", title: "Livrer à", main: dropoff.quarter ? `Quartier ${dropoff.quarter}` : "", empty: !dropoff.lat ? "Choisir le lieu de livraison" : null, sub: stopSub(dropoff), onClick: () => setEdit("b") },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>{isBuy ? "Faire un achat" : "Envoyer un colis"}</h1></div>
      <div className="t-scr gray">
        <div className="t-card tk-box">
          {(pickup.lat || dropoff.lat) && <RouteMap a={pickup} b={dropoff} height={150} style={{ margin: "0 0 4px" }} />}
          <RouteStops stops={stops} />
        </div>

        {isBuy ? <div className="t-card tk-box">
          <div className="tk-h">Magasin</div>
          <input className="t-input" placeholder="Ex. : Supermarché Park'n'Shop, Pharmacie Mavré" value={store} onChange={(e) => setStore(e.target.value)} />
          <div className="tk-h" style={{ marginTop: 16 }}>Liste d'achats</div>
          <textarea className="t-note" maxLength={1000} placeholder={"Un article par ligne, ex. :\n2 baguettes\n1 lait Nido 400 g"} value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="tk-h" style={{ marginTop: 16 }}>Budget estimé <span className="t-mut" style={{ fontWeight: 400 }}>(facultatif)</span></div>
          <div className="tk-money"><input inputMode="numeric" placeholder="0" value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g, "").slice(0, 6))} /><span>FCFA</span></div>
          <div className="tk-note"><Icon name="info" size={16} color="var(--acc-d)" /><span>Le coursier avance l'argent. Vous le remboursez à la livraison, sur présentation du ticket de caisse.</span></div>
        </div> : <div className="t-card tk-box">
          <div className="tk-h">Que transportez-vous ?</div>
          <div className="tk-kinds">
            {KINDS.map(([ic, label]) => (
              <button key={label} className={kind === label ? "on" : ""} onClick={() => setKind(label)}>
                <Icon name={ic} size={24} color={kind === label ? "var(--acc)" : "var(--t-text)"} /><span>{label}</span>
              </button>
            ))}
          </div>
          <textarea className="t-note" style={{ marginTop: 12, minHeight: 64 }} maxLength={500} placeholder={kind === "Autre" ? "Décrivez le colis" : "Précisions pour le coursier (facultatif)"} value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="tk-note"><Icon name="weight" size={16} color="var(--acc-d)" /><span>{appInfo()?.errand?.max_weight_kg ? `${appInfo().errand.max_weight_kg} kg maximum, d` : "D"}oit tenir à l'arrière d'une moto.</span></div>
        </div>}

        <div className="t-card tk-box">
          <div className="tk-h">Récapitulatif</div>
          <div className="t-row"><span className="t-sub">Frais de course</span><b>{quote ? fmt(quote.fee) : "…"}</b></div>
          {quote?.distance_km ? <div className="t-row"><span className="t-sub">Distance</span><span>{Number(quote.distance_km).toFixed(1)} km</span></div> : null}
          {isBuy && <div className="t-row"><span className="t-sub">Achats</span><span>{budget ? `≈ ${fmt(budget)}` : "Selon le ticket"}</span></div>}
          <div className="tk-pay"><Icon name="cash" size={20} color="var(--acc)" /><span>Paiement en espèces à la livraison</span></div>
        </div>
        <div style={{ height: 8 }} />
      </div>
      <div className="t-bottom">
        <button className="t-cta" disabled={busy} style={!ready ? { opacity: .55 } : undefined} onClick={submit}>
          <span>{busy ? "Envoi…" : "Demander un coursier"}</span><span>{quote ? fmt(quote.fee) : ""}</span>
        </button>
      </div>

      {edit && <StopSheet key={edit}
        title={edit === "a" ? (isBuy ? "Où se trouve le magasin ?" : "Où récupérer le colis ?") : "Où livrer ?"}
        pin={edit === "a" ? (isBuy ? "Le magasin est ici" : "Le colis est récupéré ici") : "Le colis est livré ici"}
        value={edit === "a" ? pickup : dropoff} saved={edit === "a" && isBuy ? [] : saved}
        mine={edit === "b"} me={me}
        onClose={() => setEdit(null)}
        onSave={(v) => { (edit === "a" ? setPickup : setDropoff)(v); setEdit(null); }} />}
    </div>
  );
}
