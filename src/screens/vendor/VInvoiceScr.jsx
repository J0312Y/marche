import { useState } from "react";
import toast from "../../utils/toast";
import InvoiceView from "../../components/InvoiceView";

const INVOICES = [
  {id:"INV-001",ref:"#LMK-2026-0214",client:"Marie Koumba",date:"14 Fév 2026",total:231500,items:[{name:"📱 Galaxy A54",qty:1,price:185000},{name:"🥬 Panier Bio",qty:3,price:4500}],payment:"Airtel Money",status:"paid"},
  {id:"INV-002",ref:"#LMK-2026-0210",client:"Paul Ngoma",date:"10 Fév 2026",total:42000,items:[{name:"👜 Sac Cuir",qty:1,price:42000}],payment:"MTN MoMo",status:"paid"},
  {id:"INV-003",ref:"#LMK-2026-0205",client:"Grace Okemba",date:"5 Fév 2026",total:18000,items:[{name:"👔 Chemise Bogolan",qty:1,price:18000}],payment:"Kolo Pay",status:"pending"},
];

function VInvoiceScr({onBack}){
  const [viewInvoice,setViewInvoice]=useState(null);
  const fmt=(n)=>n?.toLocaleString("fr-FR")+" F";
  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>🧾 Factures</h2><div style={{width:38}}/></div>

    <div style={{display:"flex",gap:8,marginBottom:14}}>
      {[["Toutes",INVOICES.length],["Payées",INVOICES.filter(i=>i.status==="paid").length],["En attente",INVOICES.filter(i=>i.status==="pending").length]].map(([l,c])=>
        <div key={l} style={{flex:1,textAlign:"center",padding:"10px 0",background:"var(--card)",border:"1px solid var(--border)",borderRadius:12}}>
          <div style={{fontSize:16,fontWeight:700}}>{c}</div>
          <div style={{fontSize:10,color:"var(--muted)"}}>{l}</div>
        </div>
      )}
    </div>

    {INVOICES.map(inv=>(
      <div key={inv.id} onClick={()=>setViewInvoice(inv)} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,cursor:"pointer"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:13,fontWeight:700}}>{inv.ref}</span>
          <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:inv.status==="paid"?"rgba(16,185,129,0.08)":"rgba(245,158,11,0.08)",color:inv.status==="paid"?"#10B981":"#F59E0B",fontWeight:600}}>{inv.status==="paid"?"✅ Payée":"⏳ En attente"}</span>
        </div>
        <div style={{fontSize:12,color:"var(--muted)"}}>{inv.client} · {inv.date}</div>
        <div style={{fontSize:14,fontWeight:700,color:"#F97316",marginTop:4}}>{fmt(inv.total)}</div>
      </div>
    ))}

    {viewInvoice&&<InvoiceView order={{id:viewInvoice.ref,client:viewInvoice.client,vendor:"Ma Boutique",amount:viewInvoice.total,items:viewInvoice.items,delivery:1500,payment:viewInvoice.payment,status:viewInvoice.status||"delivered"}} onClose={()=>setViewInvoice(null)}/>}
  </div>);
}
export default VInvoiceScr;
