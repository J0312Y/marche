import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonWallet } from "../../components/Loading";
import { fmt } from "../../utils/helpers";

function VWalletScr({go,onBack}){
  const { data, loading } = useLoad(() => vendor.getWallet());
  if(loading||!data) return <div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Portefeuille</h2><div style={{width:38}}/></div><SkeletonWallet/></div>;
  const { balance, pending, transactions=[] } = data;
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Portefeuille</h2><div style={{width:38}}/></div>
    <div className="wallet-bal" style={{textAlign:"center",padding:20,background:"linear-gradient(135deg,#6366F1,#4F46E5)",borderRadius:20,color:"#fff",marginBottom:12}}>
      <div style={{fontSize:12,opacity:.8}}>Solde disponible</div>
      <div style={{fontSize:32,fontWeight:800,margin:"6px 0"}}>{fmt(balance)}</div>
      {pending>0&&<div style={{fontSize:12,opacity:.7}}>⏳ {fmt(pending)} en attente</div>}
      <button style={{marginTop:12,padding:"10px 24px",borderRadius:12,border:"2px solid rgba(255,255,255,.3)",background:"transparent",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={()=>go("vWithdraw")}>💸 Retirer</button>
    </div>
    <h3 style={{fontSize:15,fontWeight:700,marginBottom:12}}>Historique</h3>
    {transactions.map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #F5F4F1"}}>
      <div style={{width:36,height:36,borderRadius:10,background:t.type==="+"?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:t.type==="+"?"#10B981":"#EF4444"}}>{t.type}</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t.label}</div><div style={{fontSize:11,color:"#908C82"}}>{t.date} · {t.status}</div></div>
      <div style={{fontSize:14,fontWeight:700,color:t.type==="+"?"#10B981":"#EF4444"}}>{t.type}{fmt(t.amount)}</div>
    </div>)}
  </div>);
}

export default VWalletScr;
