import { useState } from "react";
import Img from "../../components/Img";
import { V_PRODUCTS } from "../../data/vendorData";
import { fmt } from "../../utils/helpers";

function VProductsScr({go,onBack}){
  const [filter,setFilter]=useState("all");
  const [products,setProducts]=useState(V_PRODUCTS.map(p=>({...p})));
  const toggleActive=(id,e)=>{e.stopPropagation();setProducts(ps=>ps.map(p=>p.id===id?{...p,active:!p.active}:p))};
  const filtered=filter==="all"?products:filter==="active"?products.filter(p=>p.active&&p.stock>0):filter==="low"?products.filter(p=>p.stock>0&&p.stock<=5):products.filter(p=>p.stock===0);
  return(<div className="scr">
    <div className="appbar"><button onClick={onBack}>←</button><h2>Mes Articles ({products.length})</h2><button onClick={()=>go("vAddProduct")}>+</button></div>
    <div className="vo-filter">{[["all","Tous"],["active","Actifs"],["low","Stock faible"],["out","Rupture"]].map(([k,l])=><button key={k} className={filter===k?"on":""} onClick={()=>setFilter(k)}>{l}</button>)}</div>
    <div style={{padding:"0 20px 100px"}}>{filtered.map(p=><div key={p.id} className="vp-card" onClick={()=>go("vEditProduct",p)}>
      <div className="vp-img"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
      <div className="vp-info"><h4>{p.name}</h4><div className="vp-meta"><span>{p.cat}</span><span>{p.sold} vendus</span></div><div className="vp-price">{fmt(p.price)}</div><div className={`vp-stock ${p.stock===0?"out":p.stock<=5?"low":"ok"}`}>{p.stock===0?"⛔ Rupture":p.stock<=5?`⚠️ ${p.stock} restants`:`✅ ${p.stock} en stock`}</div></div>
      <div className="vp-toggle" onClick={e=>toggleActive(p.id,e)}><div className={`toggle ${p.active?"on":""}`}/></div>
    </div>)}</div>
  </div>);
}

/* V5 ── ADD/EDIT PRODUCT ── */

export default VProductsScr;
