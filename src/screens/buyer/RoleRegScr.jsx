import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import { useApp } from "../../context/AppContext";
import { vendor as vendorService, driver as driverService } from "../../services";
import { TYPE_LABEL } from "../../config/storeTypes";
import { loadZones, quarterNames, citiesText } from "../../utils/zone";
import { fmtPhone } from "../../utils/phoneValidation";
import api from "../../api/client";

const TYPE_ICON = {
  restaurant: "utensils", patisserie: "cupcake", supermarche: "cart", pharmacie: "pill", boutique: "store",
  service: "tool", fleurs: "gift", beaute: "sparkle", auto: "car", gaz: "flame", maison: "home",
};
const VEHICLES = [["moto", "Moto", "bike"], ["voiture", "Voiture", "car"], ["velo", "Vélo", "bicycle"], ["pied", "À pied", "user"]];

/**
 * Inscription commerçant (role="vendor") ou livreur (role="driver").
 * Un seul écran, uniquement les informations enregistrées par le serveur ;
 * le nom et le téléphone viennent du compte. La demande reste « en attente » jusqu'à validation.
 */
export default function RoleRegScr({ role = "vendor", onBack, onPending, go }) {
  const { user, showToast } = useApp();
  const isVendor = role === "vendor";
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  // Commerce
  const [type, setType] = useState("");
  const [shop, setShop] = useState("");
  const [desc, setDesc] = useState("");
  // Livreur
  const [vehicle, setVehicle] = useState("moto");
  const [brand, setBrand] = useState("");
  const [plate, setPlate] = useState("");
  const [zones, setZones] = useState([]);
  const [quarters, setQuarters] = useState(quarterNames);

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  // Demande précédente refusée : on rappelle le motif (la nouvelle demande repart de zéro, pièces comprises)
  const [refused, setRefused] = useState(null);
  useEffect(() => {
    api.get(`/registrations/documents?role=${role}`).then((r) => { if (r?.status === "rejected") setRefused(r.review_note || "Dossier incomplet"); }).catch(() => {});
  }, [role]);

  useEffect(() => {
    if (isVendor) return;
    loadZones();
    const upd = () => setQuarters(quarterNames());
    window.addEventListener("lk-zones", upd);
    return () => window.removeEventListener("lk-zones", upd);
  }, [isVendor]);

  const motorized = vehicle === "moto" || vehicle === "voiture";
  const toggleZone = (z) => { setZones((p) => (p.includes(z) ? p.filter((x) => x !== z) : [...p, z])); setErr(""); };

  const check = () => {
    if (isVendor) {
      if (!type) return "Choisissez le type de commerce";
      if (shop.trim().length < 2) return "Indiquez le nom du commerce";
    } else {
      if (motorized && !plate.trim()) return "Indiquez la plaque d'immatriculation";
      if (!zones.length) return "Choisissez au moins un quartier";
    }
    return "";
  };
  const ready = !check();

  const submit = async () => {
    const e = check();
    if (e) { setErr(e); return; }
    setBusy(true);
    try {
      if (isVendor) await vendorService.register(shop.trim(), type, "starter", desc.trim() || undefined);
      else await driverService.register({
        vehicle_type: vehicle,
        vehicle_brand: motorized ? brand.trim() || null : null,
        vehicle_plate: motorized ? plate.trim().toUpperCase() : null,
        zones,
      });
      onPending?.(role);
      go("regStatus", { role, sent: true, replace: true });
    } catch (x) {
      setErr(x.message || "La demande n'a pas pu être envoyée");
      showToast?.(x.message || "Erreur", "error");
    }
    setBusy(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}>
        <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
        <h1>{isVendor ? "Vendre sur Lamuka" : "Livrer avec Lamuka"}</h1>
      </div>

      <div className="t-scr gray">
        {refused && <div className="tk-note" style={{ margin: "14px 16px 0", alignItems: "flex-start" }}><Icon name="info" size={16} color="var(--acc-d)" />
          <span><b>Votre demande précédente a été refusée</b> : {refused}. Vous pouvez la refaire ci-dessous ; il faudra renvoyer vos pièces.</span></div>}
        <p className="tk-hint" style={{ margin: "16px 20px 4px", color: "var(--t-sub)" }}>
          {isVendor
            ? `Recevez des commandes des clients${citiesText() ? " de " + citiesText() : ""}. Lamuka s'occupe de la livraison.`
            : "Livrez les commandes et les courses près de chez vous, aux heures qui vous conviennent."}
        </p>

        {isVendor ? <>
          <div className="t-card tk-box">
            <div className="tk-h">Type de commerce</div>
            <div className="tk-kinds">
              {Object.entries(TYPE_LABEL).map(([k, label]) => (
                <button key={k} className={type === k ? "on" : ""} onClick={() => { setType(k); setErr(""); }}>
                  <Icon name={TYPE_ICON[k] || "store"} size={24} color={type === k ? "var(--acc)" : "var(--t-text)"} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="t-card tk-box">
            <div className="t-field"><label>Nom du commerce</label>
              <input className="t-input" placeholder="Ex. : Chez Mama Ngudi" autoCapitalize="words" maxLength={80} value={shop} onChange={(e) => { setShop(e.target.value); setErr(""); }} /></div>
            <div className="t-field" style={{ marginBottom: 0 }}><label>Ce que vous vendez <span className="t-mut" style={{ fontWeight: 400 }}>(facultatif)</span></label>
              <textarea className="t-note" maxLength={500} placeholder="Vos spécialités, vos produits phares…" value={desc} onChange={(e) => setDesc(e.target.value)} /></div>
          </div>
        </> : <>
          <div className="t-card tk-box">
            <div className="tk-h">Comment livrez-vous ?</div>
            <div className="tk-kinds" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
              {VEHICLES.map(([k, label, ic]) => (
                <button key={k} className={vehicle === k ? "on" : ""} onClick={() => { setVehicle(k); setErr(""); }}>
                  <Icon name={ic} size={24} color={vehicle === k ? "var(--acc)" : "var(--t-text)"} /><span>{label}</span>
                </button>
              ))}
            </div>
            {motorized && <div className="tk-two" style={{ marginTop: 14 }}>
              <div className="t-field" style={{ marginBottom: 0 }}><label>Marque</label>
                <input className="t-input" placeholder={vehicle === "moto" ? "Ex. : Haojue" : "Ex. : Toyota"} maxLength={40} value={brand} onChange={(e) => setBrand(e.target.value)} /></div>
              <div className="t-field" style={{ marginBottom: 0 }}><label>Plaque</label>
                <input className="t-input" placeholder="Ex. : 123-AB-4" autoCapitalize="characters" maxLength={15} value={plate} onChange={(e) => { setPlate(e.target.value); setErr(""); }} /></div>
            </div>}
          </div>
          <div className="t-card tk-box">
            <div className="tk-h" style={{ marginBottom: 4 }}>Où voulez-vous livrer ?</div>
            <div className="t-sub" style={{ fontSize: 13, marginBottom: 12 }}>Vous recevrez en priorité les livraisons de ces quartiers.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quarters.map((z) => (
                <button key={z} className={"t-chip" + (zones.includes(z) ? " on" : "")} onClick={() => toggleZone(z)}>
                  {zones.includes(z) && <Icon name="check" size={14} color="var(--acc-d)" />}{z}
                </button>
              ))}
            </div>
          </div>
        </>}

        <div className="t-card tk-box">
          <div className="tk-h">Vos coordonnées</div>
          <div className="t-row"><span className="t-sub">Nom</span><span>{name || "—"}</span></div>
          <div className="t-row"><span className="t-sub">Téléphone</span><span>{fmtPhone(user?.phone) || "—"}</span></div>
          <button className="t-pill-btn" style={{ marginTop: 8 }} onClick={() => go("editProfile")}>Modifier</button>
          <div className="tk-note"><Icon name="info" size={16} color="var(--acc-d)" />
            <span>{isVendor
              ? "Étape suivante : photographier votre pièce d'identité (recto et verso) et votre commerce. L'équipe Lamuka vérifie ensuite votre dossier."
              : `Étape suivante : photographier votre pièce d'identité (recto et verso), une photo de vous${motorized ? " et votre permis de conduire" : ""}. L'équipe Lamuka vérifie ensuite votre dossier.`}</span>
          </div>
        </div>
        <div style={{ height: 8 }} />
      </div>

      <div className="t-bottom" style={{ flexDirection: "column", alignItems: "stretch", gap: 8 }}>
        {err && <div style={{ color: "#E11D48", fontSize: 13 }}>{err}</div>}
        <button className="t-cta center" disabled={busy} style={{ flex: "0 0 auto", width: "100%", ...(!ready ? { opacity: .55 } : null) }} onClick={submit}>
          <span>{busy ? "Envoi…" : "Continuer : mes pièces"}</span>
        </button>
      </div>
    </div>
  );
}
