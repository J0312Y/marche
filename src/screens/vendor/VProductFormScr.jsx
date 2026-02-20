import { useState } from "react";
import { CATS } from "../../data";

function VProductFormScr({product:p,onBack}){
  const isEdit=!!p;
  const [active,setActive]=useState(isEdit?p.active:true);
  const [showDelete,setShowDelete]=useState(false);
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>{isEdit?"Modifier":"Ajouter"} un article</h2><div style={{width:38}}/></div>
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Photos</div>
    <div className="pf-photos">{isEdit&&<div className="pf-photo">{p.img}<div className="pf-del">✕</div></div>}<div className="pf-photo add">+</div></div>
    <div className="field"><label>Nom de l'article</label><input defaultValue={isEdit?p.name:""} placeholder="Ex: Poulet DG, Robe Wax, Doliprane..."/></div>
    <div className="field"><label>Description</label><textarea rows={3} defaultValue={isEdit?"Robe en wax africain, coupe moderne, tailles S-XL":""} placeholder="Décrivez votre article..."/></div>
    <div className="field-row"><div className="field"><label>Prix (FCFA)</label><input type="number" defaultValue={isEdit?p.price:""} placeholder="25000"/></div><div className="field"><label>Prix barré</label><input type="number" placeholder="Optionnel"/></div></div>
    <div className="field-row"><div className="field"><label>Catégorie</label><select defaultValue={isEdit?p.cat:""}><option value="">Choisir...</option>{CATS.map(c=><option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}</select></div><div className="field"><label>Stock</label><input type="number" defaultValue={isEdit?p.stock:""} placeholder="0"/></div></div>
    <div style={{fontSize:14,fontWeight:700,margin:"16px 0 10px"}}>Variantes</div>
    <div className="pf-variants">{["S","M","L","XL"].map(s=><div key={s} className="pf-variant"><input defaultValue={s} style={{flex:"0 0 60px"}}/><input placeholder="Stock" style={{flex:"0 0 60px"}}/><span style={{fontSize:12,color:"#908C82"}}>unités</span></div>)}</div>
    <div className="field"><label>Tags</label><input defaultValue={isEdit?"Mode, Wax, Africain":""} placeholder="Séparer par des virgules"/></div>
    <div className="field"><label>Poids (g)</label><input type="number" defaultValue="250" placeholder="Pour calcul livraison"/></div>
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"16px 0"}}><div className={`toggle ${active?"on":""}`} onClick={()=>setActive(!active)}/><span style={{fontSize:14,fontWeight:500}}>Article actif</span></div>
    <button className="btn-primary" style={{marginBottom:14}}>{isEdit?"💾 Enregistrer":"➕ Ajouter l'article"}</button>
    {isEdit&&!showDelete&&<button className="btn-outline" style={{color:"#EF4444",borderColor:"rgba(239,68,68,.3)"}} onClick={()=>setShowDelete(true)}>🗑️ Supprimer cet article</button>}
    {isEdit&&showDelete&&<div style={{padding:16,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#EF4444",marginBottom:6}}>⚠️ Supprimer "{p.name}" ?</div>
      <p style={{fontSize:12,color:"#5E5B53",marginBottom:12}}>Ce produit sera retiré de votre boutique. Cette action est irréversible.</p>
      <div style={{display:"flex",gap:10}}>
        <button style={{flex:1,padding:12,borderRadius:12,border:"1px solid #E8E6E1",background:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setShowDelete(false)}>Annuler</button>
        <button style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#EF4444",color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={onBack}>🗑️ Confirmer</button>
      </div>
    </div>}
  </div>);
}

/* V6 ── VENDOR WALLET ── */

export default VProductFormScr;
