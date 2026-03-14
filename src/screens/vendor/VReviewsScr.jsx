import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import Loading from "../../components/Loading";

function VReviewsScr({onBack}){
  const { data, loading } = useLoad(() => vendor.getReviews());
  const V_REVIEWS = data?.reviews || data || [];
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Avis clients ({V_REVIEWS.length})</h2><div style={{width:38}}/></div>
    {loading?<Loading/>:V_REVIEWS.map((r,i)=><div key={i} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        <div><b>{r.client}</b><span style={{marginLeft:8,fontSize:11,color:"#908C82"}}>{r.date}</span></div>
        <div style={{color:"#F59E0B"}}>{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
      </div>
      <div style={{fontSize:12,color:"#5E5B53",marginBottom:6}}>{r.text}</div>
      <div style={{fontSize:11,color:"#908C82"}}>📦 {r.product}</div>
      {r.replied&&<div style={{marginTop:8,padding:10,background:"#F5F4F1",borderRadius:10,fontSize:12,color:"#5E5B53"}}>↩️ {r.reply}</div>}
      {!r.replied&&<button style={{marginTop:8,padding:"6px 12px",borderRadius:8,border:"1px solid #6366F1",background:"transparent",color:"#6366F1",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Répondre</button>}
    </div>)}
  </div>);
}

export default VReviewsScr;
