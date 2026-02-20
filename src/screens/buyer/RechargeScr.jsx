import { useState } from "react";
import { fmt } from "../../utils/helpers";

function RechargeScr({onBack}){
  const [method,setMethod]=useState(null);const [amount,setAmount]=useState("");const [done,setDone]=useState(false);
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Rechargement réussi</h3><p style={{fontSize:14,color:"#10B981",fontWeight:700,marginTop:8}}>{fmt(parseInt(amount)||0)} ajoutés</p><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Votre solde Kolo Pay a été mis à jour.</p><button className="btn-primary" style={{marginTop:20}} onClick={onBack}>OK</button></div></div>);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Recharger Kolo Pay</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div className="field"><label>Montant (FCFA)</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Ex: 10000"/></div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>{[5000,10000,25000,50000].map(v=><button key={v} style={{flex:1,padding:10,borderRadius:10,border:amount===String(v)?"2px solid #6366F1":"1px solid #E8E6E1",background:amount===String(v)?"rgba(99,102,241,0.04)":"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setAmount(String(v))}>{fmt(v)}</button>)}</div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Moyen de paiement</div>
      {[["airtel","📱","Airtel Money"],["mtn","📱","MTN MoMo"],["kolo","🟣","Kolo Pay"]].map(([k,i,n])=><div key={k} className="setting-item" style={{cursor:"pointer",border:method===k?"2px solid #6366F1":"1px solid #E8E6E1",marginBottom:6}} onClick={()=>setMethod(k)}><span style={{fontSize:20}}>{i}</span><span className="si-t">{n}</span>{method===k&&<span style={{color:"#6366F1",fontWeight:700}}>✓</span>}</div>)}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" style={{background:amount&&method?"#6366F1":"#E8E6E1",color:amount&&method?"#fff":"#908C82"}} onClick={()=>amount&&method&&setDone(true)}>Recharger {amount?fmt(parseInt(amount)):""}</button></div>
  </div>);
}

/* ── WITHDRAW (shared vendor/driver) ── */

export default RechargeScr;
