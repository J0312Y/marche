

function OrderDetailScr({order:o,onBack,go}){
  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>{o.ref}</h2><div style={{width:38}}/></div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span className={`ost ${o.sc}`} style={{fontSize:13}}>{o.status}</span><span style={{fontSize:12,color:"#908C82"}}>{o.date}</span></div>
    <div style={{marginBottom:16}}>{o.items.map((item,i)=><div key={i} style={{padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:8,fontSize:14,fontWeight:500}}>{item}</div>)}</div>
    <div style={{padding:16,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:16}}>
      <div className="cs-row"><span>Sous-total</span><b>{o.total} FCFA</b></div>
      <div className="cs-row"><span>Livraison</span><b>2 500 FCFA</b></div>
      <div className="cs-row tot"><span>Total</span><span className="ctp">{parseInt(o.total.replace(/\s/g,""))+2500} FCFA</span></div>
    </div>
    {o.sc==="ship"&&<button className="btn-primary" onClick={()=>go("tracking")}>📍 Suivre ma livraison</button>}
  </div>);
}

/* 19 ── TRACKING ── */

export default OrderDetailScr;
