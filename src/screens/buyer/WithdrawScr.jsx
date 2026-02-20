import { useState } from "react";
import { fmt } from "../../utils/helpers";

function WithdrawScr({onBack,mode}){
  const [method,setMethod]=useState(null);const [amount,setAmount]=useState("");const [done,setDone]=useState(false);
  const color=mode==="driver"?"#10B981":"#6366F1";
  if(done)return(<div className="scr" style={{padding:20,textAlign:"center"}}><div style={{padding:"40px 0"}}><div style={{fontSize:48,marginBottom:10}}>✅</div><h3 style={{fontSize:18,fontWeight:700}}>Demande envoyée</h3><p style={{fontSize:14,color,fontWeight:700,marginTop:8}}>{fmt(parseInt(amount)||0)}</p><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Versement sous 24-48h sur votre compte.</p><button className="btn-primary" style={{marginTop:20,background:color}} onClick={onBack}>OK</button></div></div>);
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}><div className="appbar"><button onClick={onBack}>←</button><h2>Retrait</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:20}}>
      <div className="field"><label>Montant (FCFA)</label><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Ex: 50000"/></div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>{[10000,25000,50000,100000].map(v=><button key={v} style={{flex:1,padding:10,borderRadius:10,border:amount===String(v)?`2px solid ${color}`:"1px solid #E8E6E1",background:amount===String(v)?`${color}08`:"#fff",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>setAmount(String(v))}>{fmt(v)}</button>)}</div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Retirer vers</div>
      {[["airtel","📱","Airtel Money","06X XXX XXX"],["mtn","📱","MTN MoMo","06X XXX XXX"],["kolo","🟣","Kolo Pay","06X XXX XXX"]].map(([k,i,n,p])=><div key={k} className="setting-item" style={{cursor:"pointer",border:method===k?`2px solid ${color}`:"1px solid #E8E6E1",marginBottom:6}} onClick={()=>setMethod(k)}><span style={{fontSize:20}}>{i}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:500}}>{n}</div><div style={{fontSize:11,color:"#908C82"}}>{p}</div></div>{method===k&&<span style={{color,fontWeight:700}}>✓</span>}</div>)}
    </div>
    <div style={{padding:"14px 20px",borderTop:"1px solid #E8E6E1",background:"#fff",flexShrink:0}}><button className="btn-primary" style={{background:amount&&method?color:"#E8E6E1",color:amount&&method?"#fff":"#908C82"}} onClick={()=>amount&&method&&setDone(true)}>Retirer {amount?fmt(parseInt(amount)):""}</button></div>
  </div>);
}

/* 27 ── SETTINGS ── */

export default WithdrawScr;
