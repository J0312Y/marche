import { useState } from "react";
import Img from "../../components/Img";
import { P, REVIEWS } from "../../data";
import { fmt } from "../../utils/helpers";

function CompareScr({product:p,onBack}){
  const [other,setOther]=useState(null);
  const [picking,setPicking]=useState(!p);
  const [slot,setSlot]=useState(p?2:1);
  const [prod1,setProd1]=useState(p||null);
  const [prod2,setProd2]=useState(null);

  const pickProduct=(pr)=>{
    if(slot===1){setProd1(pr);setSlot(2);setPicking(true)}
    else{setProd2(pr);setPicking(false)}
  };
  const canCompare=prod1&&prod2;
  const rows=canCompare?[["Prix",fmt(prod1.price),fmt(prod2.price)],["Note",`⭐ ${prod1.rating}`,`⭐ ${prod2.rating}`],["Avis",`${prod1.reviews}`,`${prod2.reviews}`],["Commerce",prod1.vendor,prod2.vendor],["Catégorie",prod1.cat,prod2.cat],["Livraison",prod1.eta||"1-3 jours",prod2.eta||"1-3 jours"]]:[];

  if(picking)return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={()=>{if(canCompare||prod1)setPicking(false);else onBack()}}>←</button><h2>Choisir {slot===1?"1er":"2ème"} article</h2><div style={{width:38}}/></div>
    <div style={{fontSize:12,color:"#908C82",marginBottom:14}}>Sélectionnez un article à comparer :</div>
    {P.filter(x=>slot===2?x.id!==(prod1?.id):true).map(x=><div key={x.id} style={{display:"flex",alignItems:"center",gap:12,padding:12,background:"#fff",border:"1px solid #E8E6E1",borderRadius:14,marginBottom:8,cursor:"pointer"}} onClick={()=>pickProduct(x)}>
      <div style={{width:44,height:44,borderRadius:12,background:"#F5F4F1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}><Img src={x.photo} emoji={x.img} style={{width:44,height:44,borderRadius:12}} fit="cover"/></div>
      <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{x.name}</div><div style={{fontSize:11,color:"#908C82"}}>{x.vendor} · ⭐ {x.rating}</div></div>
      <div style={{fontSize:13,fontWeight:700,color:"#6366F1",flexShrink:0}}>{fmt(x.price)}</div>
    </div>)}
  </div>);

  return(<div className="scr" style={{padding:20}}><div className="appbar" style={{padding:0,marginBottom:16}}><button onClick={onBack}>←</button><h2>Comparer</h2><div style={{width:38}}/></div>
    <div className="compare">
      <div className="compare-col" style={{cursor:"pointer"}} onClick={()=>{setSlot(1);setPicking(true)}}>{prod1?<><div className="ci"><Img src={prod1.photo} emoji={prod1.img} style={{width:"100%",height:80,borderRadius:12}} fit="cover"/></div><h4>{prod1.name}</h4><div className="cp">{fmt(prod1.price)}</div></>:<><div style={{fontSize:28,marginBottom:6}}>➕</div><h4 style={{color:"#908C82"}}>Choisir</h4></>}</div>
      <div className="compare-col" style={{cursor:"pointer"}} onClick={()=>{setSlot(2);setPicking(true)}}>{prod2?<><div className="ci"><Img src={prod2.photo} emoji={prod2.img} style={{width:"100%",height:80,borderRadius:12}} fit="cover"/></div><h4>{prod2.name}</h4><div className="cp">{fmt(prod2.price)}</div></>:<><div style={{fontSize:28,marginBottom:6}}>➕</div><h4 style={{color:"#908C82"}}>Choisir</h4></>}</div>
    </div>
    {canCompare?rows.map(([l,v1,v2])=><div key={l} className="compare-row"><div className="cr-label">{l}</div><div className="cr-val">{v1}</div><div className="cr-val">{v2}</div></div>)
    :<div style={{textAlign:"center",padding:"30px 0",color:"#908C82",fontSize:13}}>Sélectionnez 2 articles pour les comparer</div>}
    {canCompare&&<div style={{display:"flex",gap:8,marginTop:14}}>
      <button className="btn-outline" style={{flex:1}} onClick={()=>{setProd2(null);setSlot(2);setPicking(true)}}>🔄 Changer article 2</button>
    </div>}
  </div>);
}

/* 13 ── REVIEWS ── */

export default CompareScr;
