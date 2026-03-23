import { useState } from "react";
import toast from "../../utils/toast";

const STOCK = [
  {id:1,name:"Galaxy A54",img:"📱",stock:15,min:5,status:"ok",lastRestock:"12 Mar"},
  {id:2,name:"Robe Wax Moderne",img:"👗",stock:8,min:5,status:"ok",lastRestock:"10 Mar"},
  {id:3,name:"Écouteurs Bluetooth",img:"🎧",stock:3,min:5,status:"low",lastRestock:"8 Mar"},
  {id:4,name:"Doliprane 1000mg",img:"💊",stock:2,min:10,status:"critical",lastRestock:"5 Mar"},
  {id:5,name:"Riz Parfumé 25kg",img:"🍚",stock:0,min:3,status:"out",lastRestock:"1 Mar"},
  {id:6,name:"Pack Ménage Complet",img:"🧹",stock:4,min:5,status:"low",lastRestock:"28 Fév"},
];

function VStockScr({onBack}){
  const [items,setItems]=useState(STOCK);
  const [filter,setFilter]=useState("all");
  const filtered=filter==="all"?items:items.filter(i=>i.status===filter);
  const statusColors={ok:"#10B981",low:"#F59E0B",critical:"#EF4444",out:"#EF4444"};
  const statusLabels={ok:"En stock",low:"Stock faible",critical:"Critique",out:"Rupture"};

  const restock=(id)=>{
    setItems(prev=>prev.map(i=>i.id===id?{...i,stock:i.min*3,status:"ok",lastRestock:"Aujourd'hui"}:i));
    toast.success("Stock réapprovisionné ✅");
  };

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>📦 Gestion Stock</h2><div style={{width:38}}/></div>

    {/* Summary */}
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[["all","Tous",items.length,"var(--text)"],["low","⚠️ Faible",items.filter(i=>i.status==="low").length,"#F59E0B"],["critical","🔴 Critique",items.filter(i=>i.status==="critical").length,"#EF4444"],["out","Rupture",items.filter(i=>i.status==="out").length,"#EF4444"]].map(([k,l,c,col])=>
      <div key={k} onClick={()=>setFilter(k)} style={{flex:1,padding:"8px 4px",textAlign:"center",borderRadius:10,border:filter===k?`2px solid ${col}`:"1px solid var(--border)",background:filter===k?col+"08":"var(--card)",cursor:"pointer"}}>
        <div style={{fontSize:16,fontWeight:700,color:col}}>{c}</div>
        <div style={{fontSize:9,color:"var(--muted)"}}>{l}</div>
      </div>)}
    </div>

    {/* Items */}
    {filtered.map(item=>(
      <div key={item.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>{item.img}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600}}>{item.name}</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
              <span style={{fontSize:12,fontWeight:700,color:statusColors[item.status]}}>{item.stock} unités</span>
              <span style={{fontSize:10,padding:"1px 6px",borderRadius:4,background:statusColors[item.status]+"12",color:statusColors[item.status],fontWeight:600}}>{statusLabels[item.status]}</span>
            </div>
            <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>Min: {item.min} · Dernier: {item.lastRestock}</div>
          </div>
          {item.stock<=item.min&&<button onClick={()=>restock(item.id)} style={{padding:"6px 12px",borderRadius:8,border:"none",background:"#F97316",color:"#fff",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Réappro.</button>}
        </div>
        {/* Stock bar */}
        <div style={{marginTop:8,height:4,borderRadius:2,background:"var(--light)"}}>
          <div style={{width:`${Math.min((item.stock/item.min)*50,100)}%`,height:"100%",borderRadius:2,background:statusColors[item.status],transition:"width .3s"}}/>
        </div>
      </div>
    ))}
  </div>);
}
export default VStockScr;
