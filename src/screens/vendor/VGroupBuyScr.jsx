import DatePicker from "../../components/DatePicker";
import { useState } from "react";
import Select from "../../components/Select";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";
function VGroupBuyScr({onBack}){
  const [offers,setOffers]=useState([
    {id:1,product:"Pack Ménage Complet",price:8500,discount:20,min:5,current:3,ends:"20 Mars 2026",active:true},
    {id:2,product:"Riz Parfumé 25kg",price:18000,discount:15,min:10,current:7,ends:"25 Mars 2026",active:true},
    {id:3,product:"Doliprane 1000mg x16",price:2500,discount:10,min:20,current:20,ends:"15 Fév 2026",active:false},
  ]);
  const [creating,setCreating]=useState(false);const [newOffer,setNewOffer]=useState({product:"",discount:15,min:5,ends:""});
  const toggle=(id)=>{setOffers(prev=>prev.map(o=>o.id===id?{...o,active:!o.active}:o));toast.success("Offre mise à jour")};
  const create=()=>{if(!newOffer.product){toast.error("Sélectionnez un produit");return}setOffers(prev=>[{id:Date.now(),...newOffer,price:0,current:0,active:true},...prev]);setCreating(false);toast.success("Offre groupée créée 👥")};
  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>👥 Achats groupés</h2><button onClick={()=>setCreating(true)} style={{fontSize:20,background:"none",border:"none",cursor:"pointer",color:"var(--text)"}}>+</button></div>
    {creating&&<div style={{padding:14,background:"var(--card)",border:"2px solid #F97316",borderRadius:16,marginBottom:14}}>
      <h4 style={{fontSize:14,fontWeight:700,marginBottom:10}}>Nouvelle offre groupée</h4>
      <div className="field"><label>Produit <span style={{color:"#EF4444"}}>*</span></label><Select value={newOffer.product} onChange={v=>setNewOffer({...newOffer,product:v})} placeholder="— Choisir —" options={["Pack Ménage Complet","Riz Parfumé 25kg","Écouteurs Bluetooth Pro"]}/></div>
      <div className="field-row"><div className="field"><label>Réduction (%) <span style={{color:"#EF4444"}}>*</span></label><input type="number" value={newOffer.discount} onChange={e=>setNewOffer({...newOffer,discount:parseInt(e.target.value)||0})}/></div><div className="field"><label>Min. participants <span style={{color:"#EF4444"}}>*</span></label><input type="number" value={newOffer.min} onChange={e=>setNewOffer({...newOffer,min:parseInt(e.target.value)||0})}/></div></div>
      <div className="field"><label>Date fin</label><DatePicker value={newOffer.ends} onChange={v=>setNewOffer({...newOffer,ends:v})}/></div>
      <div style={{display:"flex",gap:8}}><button onClick={()=>setCreating(false)} style={{flex:1,padding:10,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Annuler</button><button onClick={create} style={{flex:1,padding:10,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Créer</button></div>
    </div>}
    {offers.map(o=><div key={o.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <h4 style={{fontSize:14,fontWeight:700}}>{o.product}</h4>
        <div className={`toggle ${o.active?"on":""}`} onClick={()=>toggle(o.id)} style={{transform:"scale(.8)"}}/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:8,fontSize:12,color:"var(--sub)"}}>
        <span>🏷️ -{o.discount}%</span><span>👥 {o.current}/{o.min}</span><span>📅 {o.ends}</span>
      </div>
      <div style={{height:6,background:"var(--border)",borderRadius:3,overflow:"hidden"}}><div style={{width:`${Math.min((o.current/o.min)*100,100)}%`,height:"100%",background:o.current>=o.min?"#10B981":"#F97316",borderRadius:3}}/></div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--muted)",marginTop:4}}><span>{o.current>=o.min?"✅ Objectif atteint !":"En cours..."}</span><span>{o.min-o.current>0?`${o.min-o.current} restants`:""}</span></div>
    </div>)}
  </div>);
}
export default VGroupBuyScr;
