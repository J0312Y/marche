import { CATS } from "../../data";

function CategoriesScr({go,onBack}){
  return(<div className="scr"><div className="appbar"><button onClick={onBack}>←</button><h2>Catégories</h2><div style={{width:38}}/></div>
    <div className="cat-full" style={{paddingBottom:100}}>{CATS.map(c=><div key={c.id} className="cat-card" onClick={()=>{go("search")}}><span className="cci">{c.icon}</span><div style={{minWidth:0,flex:1}}><h4>{c.name}</h4><p>{c.count} produits</p></div></div>)}</div>
  </div>);
}

/* 7 ── SEARCH ── */

export default CategoriesScr;
