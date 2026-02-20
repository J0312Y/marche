

function DrVehicleScr({onBack}){
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Mon véhicule</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:64,marginBottom:8}}>🛵</div><h3 style={{fontSize:20,fontWeight:700}}>Honda PCX</h3><p style={{fontSize:13,color:"#908C82"}}>Plaque : BZ-4521</p></div>
    <div className="field"><label>Type de véhicule</label><select defaultValue="moto"><option value="moto">🛵 Moto / Scooter</option><option value="voiture">🚗 Voiture</option><option value="velo">🚲 Vélo</option></select></div>
    <div className="field-row"><div className="field"><label>Marque</label><input defaultValue="Honda PCX"/></div><div className="field"><label>Année</label><input defaultValue="2022"/></div></div>
    <div className="field-row"><div className="field"><label>Plaque</label><input defaultValue="BZ-4521"/></div><div className="field"><label>Couleur</label><input defaultValue="Noir"/></div></div>
    <div style={{fontSize:14,fontWeight:700,margin:"14px 0 10px"}}>Documents</div>
    {[["🪪","Permis de conduire","Valide jusqu'au 12/2027","✅"],["📄","Carte grise","BZ-4521","✅"],["🛡️","Assurance","AXA Congo · Exp. 06/2026","✅"]].map(([i,t,d,s])=><div key={t} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:8}}>
      <span style={{fontSize:22}}>{i}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t}</div><div style={{fontSize:11,color:"#908C82"}}>{d}</div></div><span style={{fontSize:14}}>{s}</span>
    </div>)}
    <button className="btn-primary" style={{marginTop:10}}>💾 Enregistrer</button>
  </div>);
}

/* D12 ── DRIVER ZONES ── */

export default DrVehicleScr;
