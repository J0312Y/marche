import { useState } from "react";
import toast from "../../utils/toast";
import { fmt, getVendorPromo } from "../../utils/helpers";
import Img from "../../components/Img";
import { useData } from "../../hooks";
import Icon from "../../components/Icon";

// Cart onboarding tutorial - shows only on first cart open
const showCartTutorial = () => {
  try { return !localStorage.getItem("lk-cart-tutorial"); } catch { return false; }
};

function CartScr({cart,setCart,go,appliedCoupon,setAppliedCoupon}){
  const [showTuto,setShowTuto]=useState(showCartTutorial());
  const [swipeX,setSwipeX]=useState({});
  const [swipeStart,setSwipeStart]=useState(null);
  const [swipeActive,setSwipeActive]=useState(null);
  const removeItem=(i)=>{const n=[...cart];n.splice(i,1);setCart(n);try{toast.info("️ Article retiré")}catch{}};
  const { VENDORS } = useData();
  const getItem=(c)=>c.product||c;
  const getPrice=(c)=>{const p=getItem(c);const vp=getVendorPromo(p,VENDORS);return vp?vp.promoPrice:(p.price||0)};
  const sub=cart.reduce((s,c)=>s+(getPrice(c)+(c.sidesTotal||0))*(c.qty||1),0);
  const del=2500;

  // Calculate discount
  const discountAmount=appliedCoupon?(appliedCoupon.free?0:Math.round(sub*appliedCoupon.discount/100)):0;
  const freeDelivery=appliedCoupon?.free||false;
  const finalDelivery=freeDelivery?0:del;
  const total=sub-discountAmount+finalDelivery;

  const updQty=(i,d)=>{const n=[...cart];n[i].qty=(n[i].qty||1)+d;if(n[i].qty<1)n.splice(i,1);setCart(n)};

  return(<><div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><h2>Panier ({cart.length})</h2></div>
    {cart.length===0?<div style={{textAlign:"center",padding:"60px 0"}}><div style={{width:72,height:72,borderRadius:20,background:"rgba(249,115,22,0.08)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}><svg width="40" height="40" viewBox="0 0 64 64" fill="none"><path d="M16 16h5l6 26h16l6-20H24" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".4"/><circle cx="28" cy="50" r="3" fill="#F97316" opacity=".4"/><circle cx="42" cy="50" r="3" fill="#F97316" opacity=".4"/></svg></div><h3 style={{marginTop:14,fontSize:18,fontWeight:700}}>Votre panier est vide</h3><p style={{fontSize:13,color:"var(--muted)",marginTop:6}}>Découvrez nos produits</p></div>
    :cart.map((c,i)=>{const p=getItem(c);const vp=getVendorPromo(p,VENDORS);const price=vp?vp.promoPrice:(p.price||0);
    return(
      <div key={i} style={{position:"relative",marginBottom:10,overflow:"hidden",borderRadius:14}}>
        {/* Red delete background revealed when swiping */}
        <div style={{position:"absolute",inset:0,background:"#EF4444",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:24,color:"#fff",fontWeight:700,fontSize:13,gap:8}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          Supprimer
        </div>
        {/* Foreground item — translates left on touch */}
        <div className="cart-item" style={{margin:0,position:"relative",background:"var(--card)",transform:`translateX(${swipeX[i]||0}px)`,transition:swipeActive===i?"none":"transform .25s ease"}}
          onTouchStart={e=>{setSwipeStart(e.touches[0].clientX);setSwipeActive(i)}}
          onTouchMove={e=>{if(swipeStart==null)return;const dx=e.touches[0].clientX-swipeStart;if(dx<0)setSwipeX(p=>({...p,[i]:Math.max(dx,-120)}))}}
          onTouchEnd={()=>{const x=swipeX[i]||0;if(x<-80){removeItem(i);setSwipeX(p=>({...p,[i]:0}))}else{setSwipeX(p=>({...p,[i]:0}))}setSwipeStart(null);setSwipeActive(null)}}
          onMouseDown={e=>{setSwipeStart(e.clientX);setSwipeActive(i)}}
          onMouseMove={e=>{if(swipeStart==null||swipeActive!==i)return;const dx=e.clientX-swipeStart;if(dx<0)setSwipeX(p=>({...p,[i]:Math.max(dx,-120)}))}}
          onMouseUp={()=>{const x=swipeX[i]||0;if(x<-80){removeItem(i);setSwipeX(p=>({...p,[i]:0}))}else{setSwipeX(p=>({...p,[i]:0}))}setSwipeStart(null);setSwipeActive(null)}}
          onMouseLeave={()=>{if(swipeActive===i){setSwipeX(p=>({...p,[i]:0}));setSwipeStart(null);setSwipeActive(null)}}}>
        <div className="cart-img"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%",borderRadius:12}} fit="cover"/></div>
        <div className="cart-info">
          <h4>{p.name}</h4>
          {c.sides&&c.sides.length>0&&<div style={{fontSize:10,color:"#F97316",marginTop:1}}>{c.sides.map(s=>s.name+(s.qty>1?" ×"+s.qty:"")).join(", ")}</div>}
          <div className="cv">{p.vendor||""}{vp&&<span style={{marginLeft:6,fontSize:10,color:"#10B981",fontWeight:600}}><Icon name="tag" size={16}/>{" "}-{vp.promoDiscount}%</span>}</div>
          <div className="cart-bot">
            <span className="cp">{fmt((price+(c.sidesTotal||0))*(c.qty||1))}{vp&&<span style={{marginLeft:4,fontSize:10,color:"var(--muted)",textDecoration:"line-through"}}>{fmt(p.price*(c.qty||1))}</span>}</span>
            <div className="qty"><button onClick={()=>updQty(i,-1)}>−</button><span>{c.qty||1}</span><button onClick={()=>updQty(i,1)}>+</button></div>
          </div>
        </div>
        </div>
      </div>)})}

    <div onClick={()=>go("groupOrder")} style={{padding:12,background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.12)",borderRadius:14,marginBottom:10,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
      <span style={{fontSize:20}}><Icon name="handshake" size={18}/></span>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>Commander en groupe</div><div style={{fontSize:11,color:"var(--muted)"}}>Invitez vos amis à ajouter leurs plats</div></div>
      <span style={{color:"#F97316",fontSize:12,fontWeight:600}}>→</span>
    </div>

    {/* Coupon section */}
    {cart.length>0&&<div style={{marginTop:10}}>
      {appliedCoupon?(
        <div style={{padding:14,background:"rgba(249,115,22,0.04)",border:"2px solid #10B981",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}><Icon name="tag" size={18}/></span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#F97316"}}>{appliedCoupon.code}</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>
                {appliedCoupon.free?"Livraison gratuite":`-${appliedCoupon.discount}% = -${fmt(discountAmount)}`}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>go("coupons")} style={{padding:"6px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Changer</button>
            <button onClick={()=>setAppliedCoupon(null)} style={{padding:"6px 10px",borderRadius:8,border:"1px solid rgba(239,68,68,0.3)",background:"transparent",color:"#EF4444",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}></button>
          </div>
        </div>
      ):(
        <div className="coupon" style={{cursor:"pointer"}} onClick={()=>go("coupons")}>
          <div className="coupon-left" style={{width:50,fontSize:16}}><Icon name="tag" size={18}/></div>
          <div className="coupon-right">
            <h4 style={{fontSize:13}}>Ajouter un code promo</h4>
            <p>Coupons disponibles</p>
          </div>
          <span style={{color:"#F97316",fontWeight:700,fontSize:18}}>›</span>
        </div>
      )}
    </div>}
  </div>

  {cart.length>0&&<div className="cart-summary">
    <div className="cs-row"><span>Sous-total</span><b>{fmt(sub)}</b></div>

    {/* Discount line */}
    {discountAmount>0&&<div className="cs-row" style={{color:"#10B981"}}>
      <span><Icon name="tag" size={16}/>{" "}Réduction ({appliedCoupon.code})</span>
      <b>-{fmt(discountAmount)}</b>
    </div>}

    <div className="cs-row">
      <span>Livraison</span>
      <b style={freeDelivery?{textDecoration:"line-through",color:"var(--muted)"}:{}}>
        {fmt(del)}
      </b>
      {freeDelivery&&<span style={{color:"#F59E0B",fontWeight:700,fontSize:12,marginLeft:6}}>GRATUIT</span>}
    </div>

    <div className="cs-row tot"><span>Total</span><span className="ctp">{fmt(total)}</span></div>

    {(discountAmount>0||freeDelivery)&&<div style={{textAlign:"center",fontSize:11,color:"#10B981",fontWeight:600,marginTop:4}}>
       Vous économisez {fmt(discountAmount+(freeDelivery?del:0))} !
    </div>}

    <button className="btn-primary" style={{marginTop:14}} onClick={()=>go("checkout")}>Passer la commande</button>
  </div>}

  {showTuto&&<div onClick={()=>{setShowTuto(false);try{localStorage.setItem("lk-cart-tutorial","1")}catch{}}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:9999,display:"flex",alignItems:"flex-end"}}>
    <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:500,margin:"0 auto",background:"var(--card)",borderRadius:"24px 24px 0 0",padding:24}}>
      <div style={{width:36,height:4,borderRadius:2,background:"var(--border)",margin:"0 auto 16px"}}/>
      <div style={{textAlign:"center",marginBottom:18}}>
        <div style={{fontSize:48,marginBottom:8}}><Icon name="cart" size={18}/></div>
        <h3 style={{fontSize:18,fontWeight:800,marginBottom:4}}>Bienvenue dans votre panier !</h3>
        <p style={{fontSize:12,color:"var(--muted)"}}>Quelques astuces rapides</p>
      </div>
      {[
        {icon:"",t:"Glisser pour supprimer",d:"Glissez un article vers la gauche pour le retirer du panier"},
        {icon:"",t:"Sauvegarder pour plus tard",d:"Le cœur met de côté sans supprimer du panier"},
        {icon:"handshake",t:"Commander en groupe",d:"Partagez avec vos amis et payez chacun votre part"},
        {icon:"creditCard",t:"Paiement sécurisé",d:"Airtel, MTN, Orange Money ou cash à la livraison"},
      ].map((it,i)=>(
        <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<3?"1px solid var(--border)":"none"}}>
          <div style={{fontSize:24}}>{it.icon}</div>
          <div>
            <div style={{fontSize:13,fontWeight:700}}>{it.t}</div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>{it.d}</div>
          </div>
        </div>
      ))}
      <button onClick={()=>{setShowTuto(false);try{localStorage.setItem("lk-cart-tutorial","1")}catch{}}} style={{width:"100%",marginTop:18,padding:14,borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>J'ai compris <Icon name="sparkle" size={16}/></button>
    </div>
  </div>}
  </>);
}

export default CartScr;
