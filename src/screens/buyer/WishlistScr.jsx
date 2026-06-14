import { useData } from "../../hooks";
import { useApp } from "../../context/AppContext";
import Icon from "../../components/Icon";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import Img from "../../components/Img";
import { fmt } from "../../utils/helpers";

function WishlistScr({go,onBack,favs,toggleFav}){
  const { isGuest, exitGuestToLogin, setTab } = useApp();
  if (isGuest) return (
    <div className="scr" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px",textAlign:"center",minHeight:"100vh"}}>
      <div style={{width:80,height:80,borderRadius:24,background:"rgba(249,115,22,0.1)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,color:"#F97316"}}>
        <Icon name="user" size={36} color="#F97316"/>
      </div>
      <h2 style={{fontSize:20,fontWeight:800,letterSpacing:-.4,marginBottom:10}}>Connexion requise</h2>
      <p style={{fontSize:13,color:"var(--muted)",marginBottom:24,maxWidth:280,lineHeight:1.5}}>Connectez-vous pour accéder à cette section de votre profil.</p>
      <button onClick={()=>exitGuestToLogin()} style={{padding:"12px 28px",borderRadius:14,border:"none",background:"#F97316",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Se connecter</button>
      <button onClick={()=>setTab(0)} style={{marginTop:10,padding:"10px",border:"none",background:"transparent",color:"var(--muted)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Retour à l\'accueil</button>
    </div>
  );

  const { P } = useData();
  const items=P.filter(p=>favs.includes(p.id));
  return(<PullToRefresh onRefresh={async()=>{toast.success("Favoris actualisés ")}}><div className="scr" style={{padding:16}}><div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={()=>onBack&&onBack()}>←</button><h2>Mes favoris ({items.length})</h2><div style={{width:38}}/></div>
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
