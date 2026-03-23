import toast from "../../utils/toast";

import Select from "../../components/Select";

import { VEHICLE_PHOTO } from "../../data/images";
function DrVehicleScr({onBack}){
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Mon véhicule</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:14}}><div style={{width:120,height:80,borderRadius:16,overflow:"hidden",margin:"0 auto 8px"}}><img src={VEHICLE_PHOTO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/></div><h3 style={{fontSize:20,fontWeight:700}}>Honda PCX</h3><p style={{fontSize:13,color:"var(--muted)"}}>Plaque : BZ-4521</p></div>
    <div className="field"><label>Type de véhicule <span style={{color:"#EF4444"}}>*</span></label><Select value="moto" onChange={()=>{}} options={[{value:"moto",label:"🛵 Moto / Scooter"},{value:"voiture",label:"🚗 Voiture"},{value:"velo",label:"🚲 Vélo"}]}/></div>
    <div className="field-row"><div className="field"><label>Marque <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="Honda PCX"/></div><div className="field"><label>Année <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="2022"/></div></div>
    <div className="field-row"><div className="field"><label>Plaque <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="BZ-4521"/></div><div className="field"><label>Couleur <span style={{color:"#EF4444"}}>*</span></label><input defaultValue="Noir"/></div></div>
    <div style={{fontSize:14,fontWeight:700,margin:"14px 0 10px"}}>Documents</div>
    {[["🪪","Permis de conduire","Valide jusqu'au 12/2027","✅"],["📄","Carte grise","BZ-4521","✅"],["🛡️","Assurance","AXA Congo · Exp. 06/2026","✅"]].map(([i,t,d,s])=><div key={t} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
      <span style={{fontSize:22}}>{i}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t}</div><div style={{fontSize:11,color:"var(--muted)"}}>{d}</div></div><span style={{fontSize:14}}>{s}</span>
    </div>)}
    <button className="btn-primary" style={{marginTop:10}} onClick={()=>toast.success("Véhicule mis à jour ✅")}>💾 Enregistrer</button>
  </div>);
}

/* D12 ── DRIVER ZONES ── */

export default DrVehicleScr;
