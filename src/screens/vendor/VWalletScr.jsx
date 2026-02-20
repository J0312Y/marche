import { V_WALLET } from "../../data/vendorData";
import { fmt } from "../../utils/helpers";

function VWalletScr({go,onBack}){
  const balance=V_WALLET.filter(t=>t.type==="+").reduce((s,t)=>s+t.amount,0)-V_WALLET.filter(t=>t.type==="-").reduce((s,t)=>s+t.amount,0);
  const pending=V_WALLET.filter(t=>t.status==="En attente").reduce((s,t)=>s+t.amount,0);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Portefeuille</h2><div style={{width:38}}/></div>
    <div className="vw-card"><div className="vw-lbl">Solde disponible</div><div className="vw-bal">{fmt(balance)}</div><div className="vw-pend">En attente: {fmt(pending)}</div></div>
    <div className="vw-btns"><button className="vw-withdraw" onClick={()=>go("vWithdraw")}>💸 Retirer</button><button className="vw-history" onClick={()=>go("vReports")}>📊 Rapports</button></div>
    <div style={{padding:"0 20px",marginBottom:8}}><div style={{fontSize:14,fontWeight:700}}>Transactions récentes</div></div>
    {V_WALLET.map(t=><div key={t.id} className="vw-tx"><div className={`tx-icon ${t.type==="+"?"plus":"minus"}`}>{t.type==="+"?"↓":"↑"}</div><div className="tx-info"><h5>{t.label}</h5><p>{t.date} · {t.status}</p></div><div className={`tx-amt ${t.type==="+"?"plus":"minus"}`}>{t.type}{fmt(t.amount)}</div></div>)}
  </div>);
}

/* V7 ── VENDOR STATS ── */

export default VWalletScr;
