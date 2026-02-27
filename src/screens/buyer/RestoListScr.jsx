import { P, VENDORS } from "../../data";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";

function RestoListScr({go,onBack,favs,toggleFav,isFav}){
  const restos=VENDORS.filter(v=>v.type==="restaurant");
  const restoProducts=P.filter(p=>p.type==="restaurant");
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>🍽️ Restaurants</h2><div style={{width:38}}/></div>
    <div className="info-box blue" style={{margin:"0 20px 14px"}}><span>🍽️</span><span style={{fontSize:11}}>Commandez à manger et faites-vous livrer rapidement</span></div>
    <div style={{padding:"0 20px"}}>
      {restos.map(v=><div key={v.id} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10,cursor:"pointer"}} onClick={()=>go("vendor",v)}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{width:48,height:48,borderRadius:14,overflow:"hidden",background:"linear-gradient(135deg,#F59E0B,#D97706)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{v.logo?<img src={v.logo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:v.avatar}</div>
          <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><h4 style={{fontSize:14,fontWeight:700}}>{v.name}</h4>{v.verified&&<span style={{color:"#6366F1",fontSize:10}}>✓</span>}</div>
            <p style={{fontSize:11,color:"#908C82"}}>📍 {v.loc} · ⭐ {v.rating} · {v.products} plats</p></div>
          <div style={{textAlign:"right"}}><div style={{color:"#10B981",fontWeight:700,fontSize:12}}>🕐 {v.eta}</div></div>
        </div>
      </div>)}
    </div>
    <div style={{padding:"0 20px"}}><div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Plats populaires</div></div>
    <div className="pgrid">{restoProducts.map(p=><div key={p.id} className="pcard" onClick={()=>go("detail",p)}><div className="pimg"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>{p.tags[0]&&<span className="tag" onClick={e=>{e.stopPropagation();go("reviews",p)}}>{p.tags[0]}</span>}<span className="fav" onClick={e=>{e.stopPropagation();toggleFav(p.id)}} style={{color:isFav(p.id)?"#EF4444":"inherit",fontSize:isFav(p.id)?16:14}}>{isFav(p.id)?"❤️":"♡"}</span></div><div className="pbody"><h4>{p.name}</h4><div className="pv">{p.va} {p.vendor}</div><div className="pp">{fmt(p.price)}</div><div className="pr" onClick={e=>{e.stopPropagation();go("reviews",p)}}>⭐ {p.rating} ({p.reviews})</div></div></div>)}</div>
  </div>);
}

/* 5c ── ALL PRODUCTS ── */

export default RestoListScr;
