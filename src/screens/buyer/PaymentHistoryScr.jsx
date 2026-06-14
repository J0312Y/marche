import { fmt } from "../../utils/helpers";
import { useApp } from "../../context/AppContext";
import Icon from "../../components/Icon";

const PAYMENTS=[
  {id:"pay1",type:"+",label:"Recharge Airtel Money",amount:50000,date:"14 Fév 2026",status:"Effectué",icon:""},
  {id:"pay2",type:"-",label:"Commande #LMK-0214",amount:231500,date:"14 Fév 2026",status:"Payé",icon:"package"},
  {id:"pay3",type:"-",label:"Commande #LMK-0210",amount:42000,date:"10 Fév 2026",status:"Payé",icon:"package"},
  {id:"pay4",type:"+",label:"Remboursement #LMK-0198",amount:18000,date:"8 Fév 2026",status:"Crédité",icon:"↩️"},
  {id:"pay5",type:"-",label:"Commande #LMK-0205",amount:18000,date:"5 Fév 2026",status:"Payé",icon:"package"},
  {id:"pay6",type:"+",label:"Recharge MTN MoMo",amount:100000,date:"1 Fév 2026",status:"Effectué",icon:""},
  {id:"pay7",type:"-",label:"Commande #LMK-0180",amount:5500,date:"28 Jan 2026",status:"Payé",icon:"package"},
];

function PaymentHistoryScr({onBack,go}){
  const { isGuest, exitGuestToLogin } = useApp();
  if (isGuest) return (
    <div className="scr" style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"60px 24px 100px",textAlign:"center",minHeight:"100%",boxSizing:"border-box"}}>
      <div style={{width:80,height:80,borderRadius:24,background:"rgba(249,115,22,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,color:"#F97316"}}>
        <Icon name="wallet" size={36} color="#F97316"/>
      </div>
      <h2 style={{fontSize:20,fontWeight:800,letterSpacing:-.4,marginBottom:10}}>Connexion requise</h2>
      <p style={{fontSize:13,color:"var(--muted)",marginBottom:24,maxWidth:280,lineHeight:1.5}}>Connectez-vous pour accéder à votre portefeuille et solde.</p>
      <button onClick={()=>exitGuestToLogin()} style={{padding:"12px 28px",borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Se connecter</button>
      <button onClick={()=>onBack&&onBack()} style={{marginTop:10,padding:"10px",border:"none",background:"transparent",color:"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Retour</button>
    </div>
  );

  const income=PAYMENTS.filter(p=>p.type==="+").reduce((s,p)=>s+p.amount,0);
  const spent=PAYMENTS.filter(p=>p.type==="-").reduce((s,p)=>s+p.amount,0);

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={()=>onBack&&onBack()}>←</button><h2>Historique paiements</h2><div style={{width:38}}/></div>

    {/* Summary */}
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <div style={{flex:1,padding:12,background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.12)",borderRadius:14,textAlign:"center"}}>
        <div style={{fontSize:10,color:"var(--muted)"}}>Rechargements</div>
        <div style={{fontSize:15,fontWeight:700,color:"#10B981"}}>{fmt(income)}</div>
      </div>
      <div style={{flex:1,padding:12,background:"rgba(249,115,22,0.06)",border:"1px solid rgba(249,115,22,0.12)",borderRadius:14,textAlign:"center"}}>
        <div style={{fontSize:10,color:"var(--muted)"}}>Dépensé</div>
        <div style={{fontSize:15,fontWeight:700,color:"#F97316"}}>{fmt(spent)}</div>
      </div>
    </div>

    {/* Transactions */}
    {PAYMENTS.map(p=>(
      <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
        <div style={{width:40,height:40,borderRadius:12,background:p.type==="+"?"rgba(16,185,129,0.08)":"rgba(249,115,22,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}><Icon name={p.icon} size={20}/></div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600}}>{p.label}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:1}}>{p.date} · {p.status}</div>
        </div>
        <div style={{fontSize:14,fontWeight:700,color:p.type==="+"?"#10B981":"var(--text)"}}>{p.type}{fmt(p.amount)}</div>
      </div>
    ))}
  </div>);
}
export default PaymentHistoryScr;
