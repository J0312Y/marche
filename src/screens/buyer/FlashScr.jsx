import { useData } from "../../hooks";
import Img from "../../components/Img";
import { fmt, disc } from "../../utils/helpers";
import Icon from "../../components/Icon";

// Articles en promotion : prix barré réel (old_price) et stock réel — aucun compte à rebours ni stock inventé
function FlashScr({go,onBack}){
  const { P } = useData();
  const promos=P.filter(p=>p.old&&p.old>p.price);
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2><Icon name="tag" size={16}/>{" "}Promotions</h2><div style={{width:38}}/></div>
    <div style={{padding:"0 16px 20px"}}>
      {promos.length===0&&<div style={{textAlign:"center",padding:"50px 10px",color:"var(--muted)",fontSize:13}}><Icon name="tag" size={26}/><div style={{marginTop:8}}>Aucune promotion en ce moment.</div></div>}
      {promos.map(p=>{
        const stock=parseInt(p.stock);
        const low=stock>0&&stock<=5;
        return(<div key={p.id} onClick={()=>go("detail",p)} style={{display:"flex",gap:12,padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:10,cursor:"pointer"}}>
          <div style={{width:80,height:80,borderRadius:12,overflow:"hidden",flexShrink:0,position:"relative",background:"var(--light)"}}>
            <Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/>
            <div style={{position:"absolute",top:4,left:4,padding:"2px 6px",borderRadius:4,background:"#EF4444",color:"#fff",fontSize:9,fontWeight:700}}>-{disc(p)}%</div>
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:3,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{p.name}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:4}}>{p.vendor}</div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style={{fontSize:15,fontWeight:700,color:"#EF4444"}}>{fmt(p.price)}</span>
              <span style={{fontSize:11,color:"var(--muted)",textDecoration:"line-through"}}>{fmt(p.old)}</span>
            </div>
            {stock===0&&<div style={{fontSize:10,color:"#EF4444",fontWeight:600}}>Rupture de stock</div>}
            {low&&<div style={{fontSize:10,color:"#F59E0B",fontWeight:600}}>Plus que {stock} en stock</div>}
          </div>
        </div>);
      })}
    </div>
  </div>);
}
export default FlashScr;
