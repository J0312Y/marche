import { useState } from "react";
import { V_PRODUCTS } from "../../data/vendorData";

function VCreatePromoScr({onBack}){
  const [type,setType]=useState("percent");const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>🎉</div><h3 style={{fontSize:18,fontWeight:700}}>Promotion créée !</h3><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Votre promotion est maintenant active.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>← Retour aux promotions</button></div></div>);
  return(<><div className="appbar"><button onClick={onBack}>←</button><h2>Nouvelle promotion</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div className="field"><label>Nom de la promotion</label><input placeholder="Ex: Soldes Février"/></div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Type de réduction</div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>{[["percent","Pourcentage (%)"],["amount","Montant fixe (FCFA)"]].map(([k,l])=><button key={k} style={{flex:1,padding:12,borderRadius:12,border:type===k?"2px solid #6366F1":"1px solid #E8E6E1",background:type===k?"rgba(99,102,241,0.04)":"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setType(k)}>{l}</button>)}</div>
      <div className="field-row"><div className="field"><label>{type==="percent"?"Réduction (%)":"Montant (FCFA)"}</label><input type="number" placeholder={type==="percent"?"Ex: 20":"Ex: 5000"}/></div><div className="field"><label>Code promo</label><input placeholder="Ex: LAMUKA20"/></div></div>
      <div className="field-row"><div className="field"><label>Date début</label><input type="date"/></div><div className="field"><label>Date fin</label><input type="date"/></div></div>
      <div className="field"><label>Produits concernés</label><select><option>Tous les produits</option>{V_PRODUCTS.map(p=><option key={p.id}>{p.name}</option>)}</select></div>
      <div className="field-row"><div className="field"><label>Utilisation max</label><input type="number" placeholder="50"/></div><div className="field"><label>Min. commande (FCFA)</label><input type="number" placeholder="Optionnel"/></div></div>
      <div style={{paddingTop:24,paddingBottom:16}}><button className="btn-primary" onClick={()=>setDone(true)}>🎉 Créer la promotion</button></div>
    </div>
  </>);
}

/* V12 ── VENDOR DELIVERY ── */
/* V12a ── ASSIGN DRIVER TO ORDER ── */

export default VCreatePromoScr;
