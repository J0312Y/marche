import { useState } from "react";
import { useLoad, useData } from "../../hooks";
import { user as userSvc } from "../../services";
import { fmt, getVendorPromo } from "../../utils/helpers";
import Loading from "../../components/Loading";

function CouponsScr({onBack,cart=[],appliedCoupon,onApply}){
  const [manualCode,setManualCode]=useState("");
  const [error,setError]=useState("");
  const [verifying,setVerifying]=useState(null);
  const { data: COUPONS, loading } = useLoad(() => userSvc.getCoupons());
  const { VENDORS } = useData();

  const getItem=(c)=>c.product||c;
  const getPrice=(c)=>{const p=getItem(c);const vp=getVendorPromo(p,VENDORS);return vp?vp.promoPrice:(p.price||0)};
  const subtotal=cart.reduce((s,c)=>s+getPrice(c)*(c.qty||1),0);

  const applyCoupon=async(coupon)=>{
    setError("");setVerifying(coupon.code);
    try{
      await userSvc.verifyCoupon(coupon.code,subtotal);
      onApply(coupon);
    }catch(err){
      setError(err.message||"Code invalide");
    }finally{setVerifying(null)}
  };

  const applyManual=async()=>{
    if(!manualCode.trim())return;
    setError("");setVerifying(manualCode);
    try{
      const result=await userSvc.verifyCoupon(manualCode.trim().toUpperCase(),subtotal);
      const coupon=(COUPONS||[]).find(c=>c.code===manualCode.trim().toUpperCase())||{code:manualCode.trim().toUpperCase(),discount:result.discount,free:result.free_delivery,desc:`${result.discount}% de réduction`};
      onApply(coupon);
    }catch(err){
      setError(err.message||"Code invalide");
    }finally{setVerifying(null)}
  };

  const removeCoupon=()=>{onApply(null)};

  return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>🏷️ Codes Promo</h2><div style={{width:38}}/></div>

    {/* Applied coupon banner */}
    {appliedCoupon&&<div style={{padding:14,background:"rgba(16,185,129,0.06)",border:"1px solid rgba(16,185,129,0.15)",borderRadius:14,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:22}}>✅</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#10B981"}}>Code appliqué : {appliedCoupon.code}</div>
          <div style={{fontSize:12,color:"#908C82"}}>{appliedCoupon.free?"Livraison gratuite":`-${appliedCoupon.discount}% de réduction`}</div>
        </div>
      </div>
      <button onClick={removeCoupon} style={{padding:"6px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Retirer</button>
    </div>}

    {/* Manual code input */}
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <input value={manualCode} onChange={e=>setManualCode(e.target.value.toUpperCase())} placeholder="Entrer un code promo..." onKeyDown={e=>e.key==="Enter"&&applyManual()} style={{flex:1,padding:"12px 14px",borderRadius:12,border:"1px solid #E8E6E1",fontSize:13,fontFamily:"inherit",outline:"none"}}/>
      <button onClick={applyManual} disabled={!manualCode.trim()||!!verifying} style={{padding:"12px 20px",borderRadius:12,border:"none",background:manualCode.trim()?"#6366F1":"#E8E6E1",color:manualCode.trim()?"#fff":"#908C82",fontSize:13,fontWeight:700,cursor:manualCode.trim()?"pointer":"not-allowed",fontFamily:"inherit"}}>
        {verifying===manualCode?"⏳":"Appliquer"}
      </button>
    </div>

    {/* Error */}
    {error&&<div style={{padding:10,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:10,marginBottom:14,fontSize:12,fontWeight:600,color:"#EF4444",display:"flex",alignItems:"center",gap:6}}>
      ⚠️ {error}
    </div>}

    {/* Available coupons */}
    <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>Coupons disponibles</div>

    {loading?<Loading/>:(COUPONS||[]).map(c=>{
      const isApplied=appliedCoupon?.code===c.code;
      const meetsMin=subtotal>=c.min;
      return(<div key={c.id} style={{padding:16,background:isApplied?"rgba(16,185,129,0.04)":"#fff",border:isApplied?"2px solid #10B981":"1px solid #E8E6E1",borderRadius:16,marginBottom:10,transition:"all .2s"}}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
          {/* Left badge */}
          <div style={{width:56,minHeight:56,borderRadius:12,background:c.free?"linear-gradient(135deg,#10B981,#059669)":"linear-gradient(135deg,#6366F1,#A855F7)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",color:"#fff",flexShrink:0}}>
            {c.free?<><span style={{fontSize:16}}>🚚</span><span style={{fontSize:9,fontWeight:600}}>GRATUIT</span></>
            :<><span style={{fontSize:20,fontWeight:800}}>{c.discount}%</span><span style={{fontSize:9,fontWeight:600}}>REMISE</span></>}
          </div>

          {/* Info */}
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:2}}>{c.desc}</div>
            <div style={{fontSize:11,color:"#908C82",marginBottom:4}}>
              Expire le {c.expires}{c.min>0&&` · Min. ${fmt(c.min)}`}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{padding:"3px 10px",borderRadius:6,background:"#F5F4F1",fontSize:12,fontWeight:700,fontFamily:"monospace",color:"#5E5B53",letterSpacing:.5}}>{c.code}</span>
              {!meetsMin&&c.min>0&&<span style={{fontSize:10,color:"#EF4444"}}>Min. {fmt(c.min)} requis</span>}
            </div>
          </div>
        </div>

        {/* Action button */}
        <div style={{marginTop:12}}>
          {isApplied?(
            <button onClick={removeCoupon} style={{width:"100%",padding:"10px 0",borderRadius:10,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              ✕ Retirer ce code
            </button>
          ):(<button onClick={()=>applyCoupon(c)} disabled={!meetsMin||!!verifying} style={{width:"100%",padding:"10px 0",borderRadius:10,border:"none",background:meetsMin?"#6366F1":"#E8E6E1",color:meetsMin?"#fff":"#908C82",fontSize:13,fontWeight:700,cursor:meetsMin?"pointer":"not-allowed",fontFamily:"inherit",transition:"all .2s"}}>
            {verifying===c.code?"⏳ Vérification...":meetsMin?"🏷️ Appliquer ce code":`🔒 Minimum ${fmt(c.min)}`}
          </button>)}
        </div>
      </div>);
    })}

    {/* Info */}
    <div style={{padding:12,background:"#F5F4F1",borderRadius:12,marginTop:10}}>
      <div style={{fontSize:11,color:"#908C82",lineHeight:1.5}}>
        💡 Un seul code promo peut être appliqué par commande. Le sous-total actuel du panier est de <b>{fmt(subtotal)}</b>.
      </div>
    </div>
  </div>);
}

export default CouponsScr;
