import { useState } from "react";
import { ADDRS } from "../../data";

function AddressesScr({onBack}){
  const [addrs,setAddrs]=useState(ADDRS.map(a=>({...a})));
  const [adding,setAdding]=useState(false);
  const remove=id=>setAddrs(addrs.filter(a=>a.id!==id));
  const setDefault=id=>setAddrs(addrs.map(a=>({...a,def:a.id===id})));
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Mes adresses</h2><div style={{width:38}}/></div>
    {addrs.map(a=><div key={a.id} className={`addr-card ${a.def?"def":""}`}>
      <div className="ai">{a.def?"🏠":"🏢"}</div>
      <div className="ab"><h4>{a.label}{a.def&&<span className="def-badge">Par défaut</span>}</h4><p>{a.addr}<br/>{a.city}, Congo</p></div>
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {!a.def&&<button style={{padding:"4px 8px",borderRadius:6,border:"1px solid #E8E6E1",background:"#fff",fontSize:10,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setDefault(a.id)}>Par défaut</button>}
        <button style={{padding:"4px 8px",borderRadius:6,border:"1px solid rgba(239,68,68,.2)",background:"#fff",fontSize:10,color:"#EF4444",cursor:"pointer",fontFamily:"inherit"}} onClick={()=>remove(a.id)}>Supprimer</button>
      </div>
    </div>)}
    {adding&&<div style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
      <div className="field"><label>Nom</label><input placeholder="Ex: Bureau"/></div>
      <div className="field"><label>Adresse</label><input placeholder="Rue, numéro..."/></div>
      <div className="field-row"><div className="field"><label>Quartier</label><input placeholder="Bacongo"/></div><div className="field"><label>Ville</label><input placeholder="Brazzaville"/></div></div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button style={{flex:1,padding:10,borderRadius:10,border:"1px solid #E8E6E1",background:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setAdding(false)}>Annuler</button>
        <button className="btn-primary" style={{flex:1}} onClick={()=>setAdding(false)}>Enregistrer</button>
      </div>
    </div>}
    {!adding&&<button className="btn-outline" style={{marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>setAdding(true)}>+ Ajouter une adresse</button>}
  </div>);
}

/* ── LANGUAGE ── */

export default AddressesScr;
