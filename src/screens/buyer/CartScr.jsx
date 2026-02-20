import { fmt } from "../../utils/helpers";

function CartScr({cart,setCart,go}){
  const sub=cart.reduce((s,c)=>s+c.product.price*c.qty,0);const del=2500;
  const updQty=(i,d)=>{const n=[...cart];n[i].qty+=d;if(n[i].qty<1)n.splice(i,1);setCart(n)};
  return(<><div className="scr" style={{padding:20}}>
    <div className="appbar" style={{padding:0,marginBottom:16}}><h2>Panier ({cart.length})</h2></div>
    {cart.length===0?<div style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:56}}>🛒</div><h3 style={{marginTop:14,fontSize:18,fontWeight:700}}>Votre panier est vide</h3><p style={{fontSize:13,color:"#908C82",marginTop:6}}>Découvrez nos produits</p></div>
    :cart.map((c,i)=><div key={i} className="cart-item"><div className="cart-img">{c.product.img}</div><div className="cart-info"><h4>{c.product.name}</h4><div className="cv">{c.product.vendor}</div><div className="cart-bot"><span className="cp">{fmt(c.product.price*c.qty)}</span><div className="qty"><button onClick={()=>updQty(i,-1)}>−</button><span>{c.qty}</span><button onClick={()=>updQty(i,1)}>+</button></div></div></div></div>)}
    {cart.length>0&&<div style={{marginTop:10}}><div className="coupon" style={{cursor:"pointer"}} onClick={()=>go("coupons")}><div className="coupon-left" style={{width:50,fontSize:16}}>🏷️</div><div className="coupon-right"><h4 style={{fontSize:13}}>Ajouter un code promo</h4><p>3 coupons disponibles</p></div></div></div>}
  </div>
  {cart.length>0&&<div className="cart-summary"><div className="cs-row"><span>Sous-total</span><b>{fmt(sub)}</b></div><div className="cs-row"><span>Livraison</span><b>{fmt(del)}</b></div><div className="cs-row tot"><span>Total</span><span className="ctp">{fmt(sub+del)}</span></div><button className="btn-primary" style={{marginTop:14}} onClick={()=>go("checkout")}>Passer la commande</button></div>}
  </>);
}

/* 16 ── CHECKOUT ── */

export default CartScr;
