import { useState, useEffect } from "react";
import { useData } from "../../hooks";
import Img from "../../components/Img";
import { fmt, disc } from "../../utils/helpers";

function FlashScr({go,onBack}){
  const { P } = useData();
  const [t,setT]=useState({h:2,m:14,s:37});
  useEffect(()=>{const i=setInterval(()=>setT(p=>{let s=p.s-1,m=p.m,h=p.h;if(s<0){s=59;m--}if(m<0){m=59;h--}if(h<0){h=0;m=0;s=0}return{h,m,s}}),1000);return()=>clearInterval(i)},[]);
  const promos=P.filter(p=>p.old);
  // Fake stock levels for urgency
  const stocks=[15,3,8,22,1,6];
  const maxStock=30;
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>⚡ Offres Flash</h2><div style={{width:38}}/></div>
    {/* Global timer banner */}
    <div style={{margin:"0 16px 12px",padding:14,background:"linear-gradient(135deg,#EF4444,#DC2626)",borderRadius:16,color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div><div style={{fontSize:15,fontWeight:700}}>⚡ Vente Flash</div><div style={{fontSize:11,opacity:.8,marginTop:2}}>Se termine bientôt !</div></div>
      <div style={{display:"flex",gap:4}}>
        {[String(t.h).padStart(2,"0"),String(t.m).padStart(2,"0"),String(t.s).padStart(2,"0")].map((v,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:32,height:32,borderRadius:8,background:"rgba(255,255,255,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800}}>{v}</div>
            {i<2&&<span style={{fontWeight:700}}>:</span>}
          </div>
        ))}
      </div>
    </div>
    {/* Products with individual timers and stock */}
    <div style={{padding:"0 16px 80px"}}>
      {promos.map((p,idx)=>{
        const stock=stocks[idx%stocks.length];
        const pct=Math.round((stock/maxStock)*100);
        const urgent=stock<=5;
        return(<div key={p.id} onClick={()=>go("detail",p)} style={{display:"flex",gap:12,padding:12,background:"#fff",border:urgent?"2px solid rgba(239,68,68,0.3)":"1px solid #E8E6E1",borderRadius:16,marginBottom:10,cursor:"pointer",position:"relative"}}>
          {urgent&&<div style={{position:"absolute",top:-6,right:12,padding:"2px 8px",borderRadius:6,background:"#EF4444",color:"#fff",fontSize:9,fontWeight:700}}>🔥 Dernières pièces</div>}
          <div style={{width:80,height:80,borderRadius:12,overflow:"hidden",flexShrink:0,position:"relative",background:"#F5F4F1"}}>
            <Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>
            <div style={{position:"absolute",top:4,left:4,padding:"2px 6px",borderRadius:4,background:"#EF4444",color:"#fff",fontSize:9,fontWeight:700}}>-{disc(p)}%</div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:3,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div>
            <div style={{fontSize:11,color:"#908C82",marginBottom:4}}>{p.vendor}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <span style={{fontSize:15,fontWeight:700,color:"#EF4444"}}>{fmt(p.price)}</span>
              <span style={{fontSize:11,color:"#908C82",textDecoration:"line-through"}}>{fmt(p.old)}</span>
            </div>
            {/* Stock bar */}
            <div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:2}}>
                <span style={{color:urgent?"#EF4444":"#908C82",fontWeight:600}}>{stock} restants</span>
                <span style={{color:"#908C82"}}>{maxStock-stock} vendus</span>
              </div>
              <div style={{height:4,background:"#E8E6E1",borderRadius:2,overflow:"hidden"}}>
                <div style={{width:`${100-pct}%`,height:"100%",background:urgent?"#EF4444":"#F59E0B",borderRadius:2,transition:"width .5s"}}/>
              </div>
            </div>
          </div>
        </div>);
      })}
    </div>
  </div>);
}
export default FlashScr;
