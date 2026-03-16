import { fmt } from "../../utils/helpers";

const PAYMENTS=[
  {id:"pay1",type:"+",label:"Recharge Airtel Money",amount:50000,date:"14 Fév 2026",status:"Effectué",icon:"📥"},
  {id:"pay2",type:"-",label:"Commande #LMK-0214",amount:231500,date:"14 Fév 2026",status:"Payé",icon:"🛍️"},
  {id:"pay3",type:"-",label:"Commande #LMK-0210",amount:42000,date:"10 Fév 2026",status:"Payé",icon:"🛍️"},
  {id:"pay4",type:"+",label:"Remboursement #LMK-0198",amount:18000,date:"8 Fév 2026",status:"Crédité",icon:"↩️"},
  {id:"pay5",type:"-",label:"Commande #LMK-0205",amount:18000,date:"5 Fév 2026",status:"Payé",icon:"🛍️"},
  {id:"pay6",type:"+",label:"Recharge MTN MoMo",amount:100000,date:"1 Fév 2026",status:"Effectué",icon:"📥"},
  {id:"pay7",type:"-",label:"Commande #LMK-0180",amount:5500,date:"28 Jan 2026",status:"Payé",icon:"🛍️"},
];

function PaymentHistoryScr({onBack}){
  const income=PAYMENTS.filter(p=>p.type==="+").reduce((s,p)=>s+p.amount,0);
  const spent=PAYMENTS.filter(p=>p.type==="-").reduce((s,p)=>s+p.amount,0);

  return(<div className="scr" style={{padding:16,paddingBottom:80}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>Historique paiements</h2><div style={{width:38}}/></div>

    {/* Summary */}
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <div style={{flex:1,padding:12,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.12)",borderRadius:14,textAlign:"center"}}>
        <div style={{fontSize:10,color:"#908C82"}}>Rechargements</div>
        <div style={{fontSize:15,fontWeight:700,color:"#10B981"}}>{fmt(income)}</div>
      </div>
      <div style={{flex:1,padding:12,background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.12)",borderRadius:14,textAlign:"center"}}>
        <div style={{fontSize:10,color:"#908C82"}}>Dépensé</div>
        <div style={{fontSize:15,fontWeight:700,color:"#6366F1"}}>{fmt(spent)}</div>
      </div>
    </div>

    {/* Transactions */}
    {PAYMENTS.map(p=>(
      <div key={p.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #F5F4F1"}}>
        <div style={{width:40,height:40,borderRadius:12,background:p.type==="+"?"rgba(16,185,129,0.08)":"rgba(99,102,241,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{p.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600}}>{p.label}</div>
          <div style={{fontSize:11,color:"#908C82",marginTop:1}}>{p.date} · {p.status}</div>
        </div>
        <div style={{fontSize:14,fontWeight:700,color:p.type==="+"?"#10B981":"#191815"}}>{p.type}{fmt(p.amount)}</div>
      </div>
    ))}
  </div>);
}
export default PaymentHistoryScr;
