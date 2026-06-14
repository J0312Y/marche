import { useData } from "../../hooks";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";

function RestoListScr({go,onBack,favs,toggleFav,isFav}){
  const { P, VENDORS } = useData();
  const restos=VENDORS.filter(v=>v.type==="restaurant");
  const restoProducts=P.filter(p=>p.type==="restaurant");
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2><Icon name="utensils" size={16}/>{" "}Restaurants</h2><div style={{width:38}}/></div>
    <div className="info-box blue" style={{margin:"0 20px 14px"}}><span><Icon name="utensils" size={18}/></span><span style={{fontSize:11}}>Commandez à manger et faites-vous livrer rapidement</span></div>
    <div style={{padding:"0 16px"}}>
      {restos.map(v=><div key={v.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10,cursor:"pointer"}} onClick={()=>go("vendor",v)}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{width:48,height:48,borderRadius:14,overflow:"hidden",background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div>
          <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><h4 style={{fontSize:14,fontWeight:700}}>{v.name}</h4>{v.verified&&<span style={{color:"#F97316",fontSize:10}}></span>}</div>
            <p style={{fontSize:11,color:"var(--muted)"}}><Icon name="location" size={16}/>{" "}{v.loc} ·  {v.rating} · {v.products} plats</p></div>
          <div style={{textAlign:"right"}}>
            <span style={{padding:"2px 6px",borderRadius:4,background:v.isOpen?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",color:v.isOpen?"#10B981":"#EF4444",fontSize:9,fontWeight:700}}>{v.isOpen?"Ouvert":"Fermé"}</span>
            <div style={{color:"#F97316",fontWeight:700,fontSize:12,marginTop:4}}> {v.eta}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {v.deliveryFee!==undefined&&<span style={{padding:"3px 8px",borderRadius:6,background:"var(--light)",fontSize:10,color:"var(--sub)"}}><Icon name="truck" size={16}/>{" "}{v.deliveryFee===0?"Gratuit":fmt(v.deliveryFee)}</span>}
          {v.minOrder&&<span style={{padding:"3px 8px",borderRadius:6,background:"var(--light)",fontSize:10,color:"var(--sub)"}}>Min. {fmt(v.minOrder)}</span>}
          {v.hours&&<span style={{padding:"3px 8px",borderRadius:6,background:"var(--light)",fontSize:10,color:"var(--sub)"}}> {v.hours}</span>}
        </div>
      </div>)}
    </div>
    <div style={{padding:"0 16px"}}><div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Plats populaires</div></div>
    <div className="pgrid">{restoProducts.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}<span className="fav" onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"var(--muted)",fontSize:14}}>{isFav(p.id) ? <svg width="14" height="14" viewBox="0 0 24 24" fill="#EF4444"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}</span></div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}><Icon name="star_full" size={16}/>{" "}{p.rating} ({p.reviews})</div></div></div>)}</div>
  </div>);
}

/* 5c ── ALL PRODUCTS ── */

export default RestoListScr;
