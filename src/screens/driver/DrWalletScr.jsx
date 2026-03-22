import { D_HISTORY, D_STATS } from "../../data/driverData";
import { fmt } from "../../utils/helpers";

function DrWalletScr({go,onBack}){
  const balance=D_HISTORY.reduce((s,h)=>s+h.fee+h.tip,0);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Mes gains</h2><div style={{width:38}}/></div>
    <div className="vw-card" style={{background:"linear-gradient(135deg,#F97316,#EA580C)"}}><div className="vw-lbl">Solde disponible</div><div className="vw-bal">{fmt(balance)}</div><div className="vw-pend">Cette semaine: {fmt(D_STATS.week.earned)}</div></div>
    <div className="vw-btns"><button className="vw-withdraw" style={{background:"#F97316"}} onClick={()=>go("drWithdraw")}>💸 Retirer vers MoMo</button><button className="vw-history" onClick={()=>go("drHistory")}>📊 Détails</button></div>
    <div style={{padding:"0 16px"}}><div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Résumé Février</div>
      {[["Courses","64 × 2 500 FCFA",fmt(160000)],["Pourboires","23 reçus",fmt(12000)],["Bonus","10+ livrais./sem.",fmt(5000)],["Commission Lamuka","-15%","-"+fmt(24000)],["Boost","3 jours","-"+fmt(3000)],["Net versé","",""]].map(([l,d,v],i)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderTop:i?"1px solid var(--border)":"none",fontSize:13,...(i===5?{fontWeight:700,fontSize:15}:{})}}><div><span>{l}</span>{d&&<span style={{display:"block",fontSize:11,color:"var(--muted)"}}>{d}</span>}</div><b style={{color:i===3||i===4?"#EF4444":i===5?"#10B981":"var(--text)"}}>{i===5?fmt(150000):v}</b></div>)}
    </div></div>
    <div style={{padding:"0 16px"}}><div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Derniers paiements</div>
      {D_HISTORY.slice(0,4).map(h=><div key={h.id} className="vw-tx"><div className="tx-icon plus">↓</div><div className="tx-info"><h5>{h.ref} · {h.client}</h5><p>{h.date}</p></div><div className="tx-amt plus">+{fmt(h.fee+h.tip)}</div></div>)}
    </div>
  </div>);
}

/* D9 ── DRIVER NOTIFICATIONS ── */

export default DrWalletScr;
