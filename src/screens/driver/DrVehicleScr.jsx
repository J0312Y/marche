import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";
import driverService from "../../services/driverService";

const TYPES = [["moto", "Moto"], ["voiture", "Voiture"], ["velo", "Vélo"], ["pied", "À pied"]];

/** Mon véhicule : champs du profil livreur (vehicle_type, vehicle_brand, vehicle_plate) */
export default function DrVehicleScr({ onBack, go }) {
  const [v, setV] = useState(null);
  const [f, setF] = useState({ vehicle_type: "moto", vehicle_brand: "", vehicle_plate: "" });
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    driverService.getVehicle().then((r) => { setV(r || {}); setF({ vehicle_type: r?.vehicle_type || "moto", vehicle_brand: r?.vehicle_brand || "", vehicle_plate: r?.vehicle_plate || "" }); }).catch(() => setV({}));
  }, []);
  const motor = f.vehicle_type === "moto" || f.vehicle_type === "voiture";
  const save = async () => {
    setBusy(true);
    try { await driverService.updateVehicle({ ...f, vehicle_plate: motor ? f.vehicle_plate.trim() : "" }); toast.success("Véhicule enregistré"); }
    catch (e) { toast.error(e?.message || "Enregistrement impossible"); }
    setBusy(false);
  };
  const input = { width: "100%", height: 48, borderRadius: 12, border: "1px solid var(--t-line)", padding: "0 14px", fontSize: 16, background: "var(--card)", color: "var(--t-text)", fontFamily: "inherit" };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Mon véhicule</h1></div>
      <div className="t-scr gray">
        {v === null ? <div style={{ display: "flex", justifyContent: "center", padding: 30 }}><div className="spinner" /></div> : <>
          <div className="t-card tk-box">
            <div className="tk-h">Moyen de transport</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>{TYPES.map(([k, l]) => <button key={k} className={"t-chip" + (f.vehicle_type === k ? " on" : "")} onClick={() => setF({ ...f, vehicle_type: k })}>{l}</button>)}</div>
            {f.vehicle_type !== "pied" && <label style={{ display: "block", marginTop: 16 }}><span className="t-sub" style={{ fontSize: 14 }}>Marque et modèle</span><input style={{ ...input, marginTop: 6 }} value={f.vehicle_brand} maxLength={80} onChange={(e) => setF({ ...f, vehicle_brand: e.target.value })} placeholder="Ex. : Haojue HJ125" /></label>}
            {motor && <label style={{ display: "block", marginTop: 12 }}><span className="t-sub" style={{ fontSize: 14 }}>Plaque d'immatriculation</span><input style={{ ...input, marginTop: 6, textTransform: "uppercase" }} value={f.vehicle_plate} maxLength={20} onChange={(e) => setF({ ...f, vehicle_plate: e.target.value.toUpperCase() })} /></label>}
          </div>
          <div className="t-card tk-box" onClick={() => go?.("drDocuments")} role="button" style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
            <Icon name="document" size={22} color="var(--acc-d)" /><span style={{ flex: 1 }}><b style={{ fontWeight: 600, display: "block" }}>Mes documents</b><span className="t-sub" style={{ fontSize: 13 }}>Pièce d'identité, permis, carte grise</span></span><Icon name="chevron_right" size={18} color="var(--t-mut)" />
          </div>
          <div style={{ padding: "4px 16px 20px" }}><button className="t-cta center" disabled={busy} onClick={save}><span>{busy ? "Enregistrement…" : "Enregistrer"}</span></button></div>
        </>}
      </div>
    </div>
  );
}
