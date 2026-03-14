import { useState } from "react";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";

function VCreatePromoScr({onBack}){
  const { data: products } = useLoad(() => vendor.getArticles());
  const [name,setName]=useState("");const [discount,setDiscount]=useState("");
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Nouvelle promo</h2><div style={{width:38}}/></div>
    <div className="field"><label>Nom de la promotion</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Soldes de Mars"/></div>
    <div className="field-row"><div className="field"><label>Réduction (%)</label><input type="number" value={discount} onChange={e=>setDiscount(e.target.value)} placeholder="20"/></div><div className="field"><label>Code (optionnel)</label><input placeholder="PROMO20"/></div></div>
    <div className="field"><label>Produits concernés</label><select><option>Tous les produits</option>{(products||[]).map(p=><option key={p.id}>{p.name}</option>)}</select></div>
    <div className="field-row"><div className="field"><label>Date début</label><input type="date"/></div><div className="field"><label>Date fin</label><input type="date"/></div></div>
    <div className="field"><label>Commande minimum (FCFA)</label><input type="number" placeholder="0"/></div>
    <button className="btn-primary" style={{marginTop:16}} onClick={onBack}>🏷️ Créer la promotion</button>
  </div>);
}

export default VCreatePromoScr;
