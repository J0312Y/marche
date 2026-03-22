import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import Img from "../../components/Img";
import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import { SkeletonList } from "../../components/Loading";
import { fmt } from "../../utils/helpers";

function VProductsScr({go,onBack}){
  const [filter,setFilter]=useState("all");
  const { data: allProducts, loading } = useLoad(() => vendor.getArticles());
  const [toggles,setToggles]=useState({});
  const products = (allProducts||[]).map(p=>({...p, active: toggles[p.id]!==undefined ? toggles[p.id] : p.active}));
  const toggleActive=(id,e)=>{e.stopPropagation();setToggles(prev=>({...prev,[id]:!products.find(p=>p.id===id)?.active}))};
  const filtered=filter==="all"?products:filter==="active"?products.filter(p=>p.active&&p.stock>0):filter==="low"?products.filter(p=>p.stock>0&&p.stock<=5):products.filter(p=>p.stock===0);
  return(<PullToRefresh onRefresh={async()=>{toast.success("Produits actualisés 📦")}}><div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>Mes Articles ({products.length})</h2><button onClick={()=>go("vAddProduct")}>+</button></div>
    <div className="vo-filter">{[["all","Tous"],["active","Actifs"],["low","Stock faible"],["out","Rupture"]].map(([k,l])=><button key={k} className={filter===k?"on":""} onClick={()=>setFilter(k)}>{l}</button>)}</div>
    <div style={{padding:"0 16px 20px"}}>{loading?<SkeletonList hasImage/>:filtered.map(p=><div key={p.id} className="vp-card" onClick={()=>go("vEditProduct",p)}>
      <div className="vp-img"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
      <div className="vp-info"><h4>{p.name}</h4><div className="vp-meta"><span>{p.cat}</span><span>{p.sold} vendus</span></div><div className="vp-price">{fmt(p.price)}</div><div className={`vp-stock ${p.stock===0?"out":p.stock<=5?"low":"ok"}`}>{p.stock===0?"⛔ Rupture":p.stock<=5?`⚠️ ${p.stock} restants`:`✅ ${p.stock} en stock`}</div></div>
      <div className="vp-toggle" onClick={e=>toggleActive(p.id,e)}><div className={`toggle ${p.active?"on":""}`}/></div>
    </div>)}</div>
  </div></PullToRefresh>);
}

export default VProductsScr;
