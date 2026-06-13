import { useData } from "../../hooks";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";

function WishlistScr({go,onBack,favs,toggleFav}){
  const { P } = useData();
  const items=P.filter(p=>favs.includes(p.id));
  return(<PullToRefresh onRefresh={async()=>{toast.success("Favoris actualisés ")}}><div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>Mes favoris ({items.length})</h2><div style={{width:38}}/></div>
    {items.length===0?<div style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:64,animation:"emptyBounce 2s ease-in-out infinite",marginBottom:10}}></div><h3 style={{fontSize:16,fontWeight:700}}>Aucun favori</h3><p style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Appuyez sur  pour ajouter des articles ici</p></div>
    :items.map(p=><div key={p.id} className="wish-item">
      <div className="wish-img"><Img src={p.photo} emoji={p.img} style={{width:"100%",height:"100%"}} fit="cover"/></div>
      <div className="wish-info"><h4>{p.name}</h4><div className="wv">{p.va} {p.vendor}</div><div className="wp">{fmt(p.price)}</div><div className="wr"><Icon name="star_full" size={16}/>{" "}{p.rating}</div></div>
      <div className="wish-actions"><button onClick={()=>go("detail",p)}><Icon name="package" size={18}/></button><button onClick={()=>toggleFav(p.id)}>️</button></div>
    </div>)}
  </div></PullToRefresh>);
}

/* 23 ── NOTIFICATIONS ── */

export default WishlistScr;
