import { useState } from "react";
import toast from "../../utils/toast";

function GamificationScr({onBack}){
  const [spun,setSpun]=useState(false);
  const [prize,setPrize]=useState(null);
  const [rotation,setRotation]=useState(0);
  const [checkedIn,setCheckedIn]=useState([true,true,true,false,false,false,false]);
  const [missions]=useState([
    {id:1,name:"Première commande",desc:"Passez votre première commande",reward:500,done:true},
    {id:2,name:"Avis utile",desc:"Laissez un avis sur un produit",reward:200,done:true},
    {id:3,name:"Partagez Lamuka",desc:"Parrainez un ami",reward:1000,done:false,progress:"0/1"},
    {id:4,name:"Panier de 30 000 F",desc:"Commandez pour 30 000 F ou plus",reward:300,done:false,progress:"18 000/30 000"},
    {id:5,name:"5 commandes",desc:"Atteignez 5 commandes ce mois",reward:800,done:false,progress:"3/5"},
  ]);

  const PRIZES=["500 pts","200 pts","Livraison gratuite","100 pts","1 000 pts","Coupon -10%","50 pts","2 000 pts"];

  const spin=()=>{
    if(spun)return;
    const idx=Math.floor(Math.random()*PRIZES.length);
    const deg=1800+(idx*(360/PRIZES.length));
    setRotation(deg);
    setTimeout(()=>{setPrize(PRIZES[idx]);setSpun(true);toast.success("🎉 Vous avez gagné : "+PRIZES[idx]+" !")},3500);
  };

  const todayIdx=3;

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>🎮 Récompenses</h2><div style={{width:38}}/></div>

    {/* Daily check-in */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>📅 Connexion quotidienne</div>
      <div style={{display:"flex",gap:4}}>
        {["L","M","M","J","V","S","D"].map((d,i)=>(
          <div key={i} onClick={()=>{if(i===todayIdx&&!checkedIn[i]){const n=[...checkedIn];n[i]=true;setCheckedIn(n);toast.success("+50 pts — Check-in jour "+String(i+1)+" !")}}} style={{flex:1,padding:"8px 0",textAlign:"center",borderRadius:10,background:checkedIn[i]?"#F97316":i===todayIdx?"rgba(249,115,22,0.08)":"var(--light)",color:checkedIn[i]?"#fff":i===todayIdx?"#F97316":"var(--muted)",cursor:i===todayIdx&&!checkedIn[i]?"pointer":"default",fontSize:11,fontWeight:700}}>
            <div>{d}</div>
            <div style={{fontSize:8,marginTop:2}}>{checkedIn[i]?"✓":"50"}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:10,color:"var(--muted)",marginTop:6,textAlign:"center"}}>7 jours consécutifs = Bonus 500 pts 🎁</div>
    </div>

    {/* Lucky wheel */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14,textAlign:"center"}}>
      <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>🎡 Roue de la chance</div>
      <div style={{position:"relative",width:180,height:180,margin:"0 auto 14px"}}>
        <div style={{width:"100%",height:"100%",borderRadius:"50%",background:`conic-gradient(${PRIZES.map((p,i)=>`${["#F97316","#FB923C","#F59E0B","#FDBA74","#F97316","#FB923C","#F59E0B","#FDBA74"][i]} ${i*(360/PRIZES.length)}deg ${(i+1)*(360/PRIZES.length)}deg`).join(",")})`,transform:`rotate(${rotation}deg)`,transition:rotation>0?"transform 3.5s cubic-bezier(.2,.8,.3,1)":"none"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:50,height:50,borderRadius:"50%",background:"var(--card)",border:"3px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 2px 8px rgba(0,0,0,.1)"}}>🎯</div>
        <div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",fontSize:20}}>▼</div>
      </div>
      {prize?<div style={{fontSize:16,fontWeight:700,color:"#F97316"}}>🎉 {prize}</div>
      :<button onClick={spin} style={{padding:"10px 30px",borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Tourner !</button>}
    </div>

    {/* Missions */}
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>🎯 Missions</div>
    {missions.map(m=>(
      <div key={m.id} style={{padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:6,display:"flex",alignItems:"center",gap:10,opacity:m.done?.6:1}}>
        <div style={{width:36,height:36,borderRadius:10,background:m.done?"rgba(16,185,129,0.08)":"rgba(249,115,22,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{m.done?"✅":"🎯"}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,textDecoration:m.done?"line-through":"none"}}>{m.name}</div>
          <div style={{fontSize:10,color:"var(--muted)"}}>{m.desc}{m.progress&&!m.done?` · ${m.progress}`:""}</div>
        </div>
        <span style={{fontSize:11,fontWeight:700,color:m.done?"#10B981":"#F97316"}}>+{m.reward} pts</span>
      </div>
    ))}
  </div>);
}
export default GamificationScr;
