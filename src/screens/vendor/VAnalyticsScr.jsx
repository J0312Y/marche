import { useState } from "react";
import Icon from "../../components/Icon";
import { useLoad } from "../../hooks/useData";
import vendorService from "../../services/vendorService";

const fmt = (n) => Math.round(n || 0).toLocaleString("fr-FR") + " F";
const STATUS_LABELS = { pending: "Nouvelles", confirmed: "Confirmées", preparing: "En préparation", ready: "Prêtes", assigned: "Livreur assigné", picked_up: "Récupérées", delivering: "En livraison", delivered: "Livrées", cancelled: "Annulées", refunded: "Retours" };

// Indicateurs réels calculés par l'API /vendor/analytics (ventes encaissées uniquement)
function VAnalyticsScr({onBack}){
  const [period,setPeriod]=useState("week");
  const { data, loading, error } = useLoad(() => vendorService.getAnalytics(period), [period]);
  const top = data?.top_products || [];
  const byStatus = (data?.orders_by_status || []).filter(s => parseInt(s.count) > 0);
  const totalOrders = byStatus.reduce((s, x) => s + (parseInt(x.count) || 0), 0);

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2><Icon name="chart_pie" size={16}/>{" "}Statistiques</h2><div style={{width:38}}/></div>

    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[["week","7 jours"],["month","Ce mois"],["year","Cette année"]].map(([k,l])=><button key={k} onClick={()=>setPeriod(k)} style={{flex:1,padding:8,borderRadius:10,border:period===k?"2px solid #F97316":"1px solid var(--border)",background:period===k?"rgba(249,115,22,0.06)":"var(--card)",color:period===k?"#F97316":"var(--text)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>)}
    </div>

    {loading ? <div style={{display:"flex",justifyContent:"center",padding:40}}><div className="spinner"/></div> : <>
      {error&&<div className="info-box yellow" style={{marginBottom:12}}><span><Icon name="info" size={16}/></span><span style={{fontSize:12}}>{error}</span></div>}

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14}}>
        {[["money",fmt(data?.revenue),"Ventes encaissées"],["package",data?.order_count??0,"Commandes payées"],["cart",fmt(data?.avg_order_value),"Panier moyen"]].map(([ic,v,l])=>
          <div key={l} style={{padding:"10px 6px",textAlign:"center",background:"var(--card)",border:"1px solid var(--border)",borderRadius:12}}>
            <Icon name={ic} size={14}/><div style={{fontSize:13,fontWeight:700,marginTop:2}}>{v}</div><div style={{fontSize:9,color:"var(--muted)"}}>{l}</div>
          </div>)}
      </div>

      {/* Top products */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:10}}><Icon name="crown" size={16}/>{" "}Meilleures ventes</div>
        {top.length===0&&<div style={{fontSize:12,color:"var(--muted)"}}>Pas encore de vente sur cette période.</div>}
        {top.map((p,i)=>(
          <div key={p.name+i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderTop:i?"1px solid var(--border)":"none"}}>
            <div><div style={{fontSize:13,fontWeight:600}}>{i+1}. {p.name}</div><div style={{fontSize:10,color:"var(--muted)"}}>{parseInt(p.sold)||0} vendu{(parseInt(p.sold)||0)>1?"s":""}</div></div>
            <span style={{fontSize:12,fontWeight:700,color:"#F97316"}}>{fmt(p.revenue)}</span>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      <div style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:10}}><Icon name="package" size={16}/>{" "}Commandes par statut ({totalOrders})</div>
        {byStatus.length===0&&<div style={{fontSize:12,color:"var(--muted)"}}>Aucune commande sur cette période.</div>}
        {byStatus.map(s=>{const pct=totalOrders?Math.round((parseInt(s.count)/totalOrders)*100):0;return(
          <div key={s.status} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
              <span style={{fontWeight:500}}>{STATUS_LABELS[s.status]||s.status}</span><span style={{color:"var(--muted)"}}>{s.count}</span>
            </div>
            <div style={{height:5,borderRadius:3,background:"var(--light)"}}><div style={{width:`${pct}%`,height:"100%",borderRadius:3,background:"#F97316"}}/></div>
          </div>);})}
      </div>
    </>}
  </div>);
}
export default VAnalyticsScr;
