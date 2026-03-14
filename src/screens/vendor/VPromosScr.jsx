import { useLoad } from "../../hooks";
import { vendor } from "../../services";
import Loading from "../../components/Loading";

function VPromosScr({go,onBack}){
  const { data: V_PROMOS, loading } = useLoad(() => vendor.getPromos());
  return(<div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Promotions</h2><button onClick={()=>go("vCreatePromo")}>+</button></div>
    {loading?<Loading/>:(V_PROMOS||[]).map(p=><div key={p.id} style={{padding:14,background:"#fff",border:"1px solid #E8E6E1",borderRadius:16,marginBottom:10}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
        <h4 style={{fontSize:14,fontWeight:700}}>{p.name}</h4>
        <span style={{padding:"3px 8px",borderRadius:6,background:p.active?"rgba(16,185,129,0.08)":"rgba(239,68,68,0.08)",color:p.active?"#10B981":"#EF4444",fontSize:10,fontWeight:700}}>{p.active?"Active":"Expirée"}</span>
      </div>
      <div style={{fontSize:12,color:"#5E5B53"}}>{p.discount}{p.type} · {p.products}</div>
      <div style={{fontSize:11,color:"#908C82",marginTop:4}}>Du {p.start} au {p.end} · {p.used} utilisations</div>
    </div>)}
  </div>);
}

export default VPromosScr;
