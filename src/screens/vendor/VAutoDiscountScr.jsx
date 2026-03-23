import { useState } from "react";
import toast from "../../utils/toast";

function VAutoDiscountScr({onBack}){
  const [rules,setRules]=useState([
    {id:1,type:"cart_min",condition:50000,discount:10,unit:"%",active:true,desc:"Panier > 50 000 F → -10%"},
    {id:2,type:"free_delivery",condition:15000,discount:0,unit:"",active:true,desc:"Panier > 15 000 F → Livraison gratuite"},
    {id:3,type:"qty",condition:3,discount:5,unit:"%",active:false,desc:"3+ articles → -5%"},
  ]);
  const [adding,setAdding]=useState(false);
  const [newType,setNewType]=useState("cart_min");
  const [newCond,setNewCond]=useState("");
  const [newDisc,setNewDisc]=useState("");

  const toggle=(id)=>setRules(p=>p.map(r=>r.id===id?{...r,active:!r.active}:r));
  const remove=(id)=>setRules(p=>p.filter(r=>r.id!==id));

  const TYPES={cart_min:"Panier minimum",free_delivery:"Livraison gratuite",qty:"Quantité minimum",first_order:"1ère commande"};

  const addRule=()=>{
    const cond=parseInt(newCond)||0;
    const disc=parseInt(newDisc)||0;
    let desc="";
    if(newType==="cart_min") desc=`Panier > ${cond.toLocaleString("fr-FR")} F → -${disc}%`;
    else if(newType==="free_delivery") desc=`Panier > ${cond.toLocaleString("fr-FR")} F → Livraison gratuite`;
    else if(newType==="qty") desc=`${cond}+ articles → -${disc}%`;
    else desc=`1ère commande → -${disc}%`;
    setRules(p=>[...p,{id:Date.now(),type:newType,condition:cond,discount:disc,unit:"%",active:true,desc}]);
    setAdding(false);setNewCond("");setNewDisc("");
    toast.success("Remise ajoutée ✅");
  };

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={adding?()=>setAdding(false):onBack}>←</button><h2>💰 Remises auto</h2><div style={{width:38}}/></div>
    <p style={{fontSize:12,color:"var(--muted)",marginBottom:14}}>Remises appliquées automatiquement au panier du client</p>

    {adding?<>
      <label style={{display:"block",fontSize:12,fontWeight:600,color:"var(--sub)",marginBottom:8}}>Type de remise</label>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {Object.entries(TYPES).map(([k,v])=><div key={k} onClick={()=>setNewType(k)} style={{padding:"8px 14px",borderRadius:10,border:newType===k?"2px solid #F97316":"1px solid var(--border)",background:newType===k?"rgba(249,115,22,0.06)":"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",color:newType===k?"#F97316":"var(--text)"}}>{v}</div>)}
      </div>
      <div className="field"><label>{newType==="qty"?"Quantité minimum":"Montant minimum (FCFA)"}</label><input value={newCond} onChange={e=>setNewCond(e.target.value.replace(/\D/g,""))} placeholder={newType==="qty"?"3":"15000"} inputMode="numeric"/></div>
      {newType!=="free_delivery"&&<div className="field"><label>Réduction (%)</label><input value={newDisc} onChange={e=>setNewDisc(e.target.value.replace(/\D/g,""))} placeholder="10" inputMode="numeric"/></div>}
      <button onClick={addRule} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Ajouter la remise</button>
    </>:<>
      {rules.map(r=>(
        <div key={r.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
          <div className={`toggle${r.active?" on":""}`} onClick={()=>toggle(r.id)} style={{flexShrink:0}}><div/></div>
          <div style={{flex:1,opacity:r.active?1:.5}}>
            <div style={{fontSize:13,fontWeight:600}}>{r.desc}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{TYPES[r.type]}</div>
          </div>
          <button onClick={()=>remove(r.id)} style={{background:"none",border:"none",fontSize:16,cursor:"pointer",color:"var(--muted)"}}>🗑️</button>
        </div>
      ))}
      <button onClick={()=>setAdding(true)} style={{width:"100%",padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",marginTop:8}}>+ Nouvelle remise</button>
    </>}
  </div>);
}
export default VAutoDiscountScr;
