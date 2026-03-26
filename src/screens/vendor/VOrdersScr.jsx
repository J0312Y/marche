import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import Img from "../../components/Img";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonCards } from "../../components/Loading";
import { fmt } from "../../utils/helpers";

const ST={new:{bg:"rgba(59,130,246,0.08)",color:"#3B82F6",label:"🆕 Nouvelle"},preparing:{bg:"rgba(245,158,11,0.08)",color:"#F59E0B",label:"🔄 Préparation"},shipped:{bg:"rgba(139,92,246,0.08)",color:"#FB923C",label:"🚚 Expédiée"},delivered:{bg:"rgba(16,185,129,0.08)",color:"#10B981",label:"✅ Livrée"}};

function VOrdersScr({go,onBack}){
  const [filter,setFilter]=useState("all");
  const { data, loading } = useLoad(() => vendor.getOrders(filter), [filter]);
  const orders = data?.orders || [];
  const counts = data?.counts || { all:0, new:0, preparing:0, shipped:0, delivered:0 };
  return(<PullToRefresh onRefresh={async()=>{toast.success("Commandes actualisées 🛍️")}}><div className="scr">
    <div className="appbar">{onBack&&<button onClick={onBack}>←</button>}<h2>Commandes ({counts.all})</h2><div style={{width:38}}/></div>
    <div className="vo-filter">{[["all","Tous",counts.all],["new","🆕",counts.new],["preparing","🔄",counts.preparing],["shipped","🚚",counts.shipped],["delivered","✅",counts.delivered]].map(([k,l,c])=><button key={k} className={filter===k?"on":""} onClick={()=>setFilter(k)}>{l} {c}</button>)}</div>
    <div style={{padding:"0 16px 20px"}}>
      {loading?<SkeletonCards/>:orders.length===0?<div style={{textAlign:"center",padding:"50px 0"}}><div style={{fontSize:40,marginBottom:8}}>📭</div><div style={{fontSize:14,fontWeight:600}}>Aucune commande</div></div>
      :orders.map(o=>{
        const st=ST[o.status]||ST.new;
        return(<div key={o.id} onClick={()=>go("vOrderDetail",o)} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10,cursor:"pointer",transition:"all .15s"}}>
          {/* Header: ref + status */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:13,fontWeight:700,fontFamily:"monospace"}}>{o.ref}</span>
            <span style={{padding:"4px 10px",borderRadius:8,background:st.bg,color:st.color,fontSize:11,fontWeight:600}}>{st.label}</span>
          </div>
          {/* Client + payment */}
          <div style={{fontSize:12,color:"var(--sub)",marginBottom:8}}>👤 {o.client} · {o.payment==="cash"?<span style={{color:"#F59E0B",fontWeight:700}}>💵 Cash à la livraison</span>:o.payment}</div>
          {/* Items — compact row with small thumbnails */}
          <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
            {o.items.map((it,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 8px 4px 4px",background:"var(--light)",borderRadius:10,fontSize:11,fontWeight:500}}>
                <div style={{width:28,height:28,borderRadius:6,overflow:"hidden",flexShrink:0,background:"var(--border)"}}>
                  <Img src={it.photo} emoji={it.img} style={{width:"100%",height:"100%"}} fit="cover"/>
                </div>
                {it.qty}× {it.name.length>16?it.name.substring(0,16)+"…":it.name}
              </div>
            ))}
          </div>
          {/* Footer: total + date */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:15,fontWeight:700,color:"#F97316"}}>{fmt(o.total)}</span>
            <span style={{fontSize:11,color:"var(--muted)"}}>{o.date}</span>
          </div>
        </div>);
      })}
    </div>
  </div></PullToRefresh>);
}

export default VOrdersScr;
