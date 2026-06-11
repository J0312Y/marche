import { useState } from "react";
import { D_DELIVERIES, D_HISTORY, D_STATS } from "../../data/driverData";
import { DRIVER_PHOTO } from "../../data/images";
import { fmt } from "../../utils/helpers";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import SuccessAnimation from "../../components/SuccessAnimation";
import CountUp from "../../components/CountUp";
import PayLogo from "../../components/PayLogos";
import { validatePayPhone, getPhonePlaceholder, isPayPhoneValid } from "../../utils/phoneValidation";

function DrDashboardScr({go}){
  const [online,setOnline]=useState(true);
  const [period,setPeriod]=useState("today");
  const [boosted,setBoosted]=useState(false);
  const [boostPay,setBoostPay]=useState(false);
  const [boostMethod,setBoostMethod]=useState("airtel");
  const [boostPhone,setBoostPhone]=useState("");
  const [boostPaying,setBoostPaying]=useState(false);
  const [dismissed,setDismissed]=useState([]);
  const d=D_STATS[period];
  const allPending=D_DELIVERIES.filter(x=>x.status==="pending"&&!dismissed.includes(x.id));
  const allActive=D_DELIVERIES.filter(x=>x.status==="active");
  const active=allActive[0];
  const pending=allPending[0];
  // Daily goal — saved in localStorage
  const [goal,setGoal]=useState(()=>{try{return parseInt(localStorage.getItem("lk-driver-goal"))||10000}catch{return 10000}});
  const [showGoalModal,setShowGoalModal]=useState(false);
  const [tempGoal,setTempGoal]=useState(goal);
  const [accepting,setAccepting]=useState(null);
  const [refusing,setRefusing]=useState(null);
  const saveGoal=()=>{const n=parseInt(tempGoal)||10000;setGoal(n);try{localStorage.setItem("lk-driver-goal",String(n))}catch{}setShowGoalModal(false);toast.success(`Objectif fixé à ${fmt(n)} 🎯`)};
  return(<><PullToRefresh onRefresh={async()=>{toast.success("Dashboard actualisé 🛵")}}><div className="scr">
    {/* Minimal header */}
    <div style={{padding:"16px 16px 12px",display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:42,height:42,borderRadius:"50%",background:"#1F2937",color:"#fff",overflow:"hidden",flexShrink:0}}>
        <img src={DRIVER_PHOTO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:16,fontWeight:800,lineHeight:1.1}}>Patrick</div>
        <div style={{fontSize:11,color:"#F59E0B",fontWeight:600,marginTop:2}}>★ Niveau Or</div>
      </div>
      <div onClick={()=>setOnline(!online)} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 10px 5px 12px",borderRadius:20,background:online?"rgba(16,185,129,0.1)":"var(--light)",border:`1px solid ${online?"rgba(16,185,129,0.2)":"var(--border)"}`,cursor:"pointer"}}>
        <span style={{fontSize:11,fontWeight:700,color:online?"#10B981":"var(--muted)"}}>{online?"En ligne":"Hors ligne"}</span>
        <div style={{width:30,height:18,borderRadius:9,background:online?"#10B981":"var(--border)",position:"relative",transition:"all .2s"}}>
          <div style={{width:14,height:14,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:online?14:2,transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
        </div>
      </div>
      <button onClick={()=>go("drNotif")} style={{width:38,height:38,borderRadius:"50%",background:"var(--card)",border:"1px solid var(--border)",cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,position:"relative"}}>
        🔔<div style={{position:"absolute",top:8,right:9,width:7,height:7,borderRadius:"50%",background:"#EF4444"}}/>
      </button>
    </div>

    {/* GAINS DU JOUR — black card with bar chart */}
    <div style={{margin:"0 16px 12px",padding:18,background:"#1F2937",borderRadius:18,position:"relative",overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.5)",fontWeight:700,letterSpacing:1,marginBottom:4}}>GAINS DU JOUR</div>
          <div style={{fontSize:32,fontWeight:800,color:"#fff",lineHeight:1,marginBottom:8}}><CountUp to={d.earned||0} format={fmt} duration={1500}/></div>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}>
            <span style={{color:(d.vsYesterday||0)>=0?"#10B981":"#EF4444",fontWeight:700}}>{(d.vsYesterday||0)>=0?"▲":"▼"} {Math.abs(d.vsYesterday||0)}%</span>
            <span style={{color:"rgba(255,255,255,0.5)"}}>vs hier · {d.deliveries||0} livraisons</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"flex-end",gap:3,height:56,flexShrink:0}}>
          {(()=>{const days=d.dailyEarnings||[6500,8200,5400,11000,6800,9500,7900,10200,7400,d.earned||0];const max=Math.max(...days,1);return days.map((v,i)=><div key={i} title={fmt(v)} style={{width:5,height:Math.max((v/max)*100,8)+"%",background:i===days.length-1?"#10B981":"rgba(255,255,255,0.25)",borderRadius:2,transition:"height .4s ease"}}/>)})()}
        </div>
      </div>
    </div>
    

    {/* Dernière livraison */}
    {D_HISTORY.length>0&&(()=>{const last=D_HISTORY[0];return(
      <div style={{margin:"10px 16px",padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,display:"flex",alignItems:"center",gap:12,boxShadow:"0 2px 8px rgba(0,0,0,0.03)"}}>
        <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16,color:"#10B981"}}>✓</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>Dernière livraison</div>
          <div style={{fontSize:11,color:"var(--muted)",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{last.vendor} · {last.date}</div>
        </div>
        <div style={{fontSize:15,fontWeight:800,color:"#10B981",flexShrink:0}}>+{fmt(last.fee||last.earned||2000)}</div>
      </div>
    )})()}

    {/* Cards row: Objectif + En cours */}
    <div style={{display:"flex",gap:8,margin:"0 16px 10px"}}>
      {/* Objectif circulaire */}
      {(()=>{const earned=d.earned||0;const pct=Math.min(Math.round((earned/goal)*100),100);const C=2*Math.PI*38;return(
        <div onClick={()=>{setTempGoal(goal);setShowGoalModal(true)}} style={{flex:1,padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,textAlign:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.03)",cursor:"pointer",position:"relative"}}>
          <div style={{position:"relative",width:96,height:96,margin:"0 auto 8px"}}>
            <svg width="96" height="96" style={{transform:"rotate(-90deg)"}}>
              <circle cx="48" cy="48" r="38" fill="none" stroke="var(--light)" strokeWidth="9"/>
              <circle cx="48" cy="48" r="38" fill="none" stroke="#10B981" strokeWidth="9" strokeDasharray={C} strokeDashoffset={C-(pct/100)*C} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s ease"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
              <div style={{fontSize:18,fontWeight:800}}>{pct}%</div>
            </div>
          </div>
          <div style={{fontSize:11,fontWeight:600}}>Objectif {fmt(goal)}</div>
          <div style={{fontSize:10,color:"#F59E0B",fontWeight:600,marginTop:2}}>+2 000 F bonus à {fmt(goal)}</div>
        </div>
      )})()}

      {/* En cours */}
      <div style={{flex:1,padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,boxShadow:"0 2px 8px rgba(0,0,0,0.03)",cursor:active?"pointer":"default"}} onClick={()=>active&&go("drDelivery",active)}>
        {active?<>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#10B981"}}/>
            <div style={{fontSize:9,fontWeight:700,color:"var(--muted)",letterSpacing:.5}}>EN COURS</div>
          </div>
          <div style={{fontSize:14,fontWeight:700,marginBottom:2,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{active.vendor.name}</div>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:14,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>→ {active.client.name}</div>
          <div style={{height:5,background:"var(--light)",borderRadius:3,overflow:"hidden",marginBottom:6}}>
            <div style={{width:"65%",height:"100%",background:"#10B981",borderRadius:3,transition:"width 1s ease"}}/>
          </div>
          <div style={{fontSize:11,color:"#10B981",fontWeight:600}}>Arrive dans {active.eta}</div>
        </>:<>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:"var(--muted)"}}/>
            <div style={{fontSize:9,fontWeight:700,color:"var(--muted)",letterSpacing:.5}}>AUCUNE LIVRAISON</div>
          </div>
          <div style={{padding:"24px 0",textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:6,opacity:.4}}>🛵</div>
            <div style={{fontSize:11,color:"var(--muted)"}}>En attente de demande</div>
          </div>
        </>}
      </div>
    </div>

    {/* Boost card */}
    <div style={{margin:"0 16px 10px",padding:12,background:boosted?"linear-gradient(135deg,rgba(245,158,11,0.1),rgba(245,158,11,0.03))":"var(--card)",border:boosted?"1px solid rgba(245,158,11,0.25)":"1px solid var(--border)",borderRadius:14,display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:36,height:36,borderRadius:10,background:boosted?"#F59E0B":"var(--light)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{boosted?"🔥":"🚀"}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:700,color:boosted?"#F59E0B":"var(--text)"}}>{boosted?"Boost actif — Priorité max":"Boost · Commandes prioritaires"}</div>
        <div style={{fontSize:10,color:"var(--muted)",marginTop:1}}>{boosted?"Expire ce soir à 23h59":"1 000 FCFA/jour"}</div>
      </div>
      <button onClick={()=>{if(boosted){setBoosted(false);toast.success("Boost désactivé")}else{setBoostPay(true)}}} style={{padding:"6px 12px",borderRadius:10,border:"none",background:boosted?"rgba(239,68,68,0.08)":"#F59E0B",color:boosted?"#EF4444":"#fff",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{boosted?"Arrêter":"Activer"}</button>
    </div>

    {/* Pending request */}
    {/* Multi-livraisons en cours */}
    {allActive.length>1&&<div style={{margin:"0 16px 10px",padding:12,background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:14}}>
      <div style={{fontSize:13,fontWeight:700,color:"#F97316",marginBottom:8}}>📦 {allActive.length} livraisons en cours</div>
      {allActive.map((dl,i)=><div key={dl.id} onClick={()=>go("drDelivery",dl)} style={{display:"flex",alignItems:"center",gap:10,padding:8,background:"var(--card)",borderRadius:10,marginBottom:i<allActive.length-1?6:0,cursor:"pointer",border:"1px solid var(--border)"}}>
        <span style={{fontSize:16}}>{dl.payment==="cash"?"💵":"📦"}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12,fontWeight:600,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{dl.vendor.name} → {dl.client.name}</div>
          <div style={{fontSize:10,color:"var(--muted)"}}>{dl.distance} · {dl.eta}</div>
        </div>
        <span style={{fontSize:13,fontWeight:700,color:"#F97316"}}>{fmt(dl.fee)}</span>
        <span style={{color:"var(--muted)",fontSize:12}}>›</span>
      </div>)}
    </div>}

    {/* Pending requests */}
    {allPending.length>1&&<div style={{margin:"0 16px 8px",padding:8,background:"rgba(59,130,246,0.04)",borderRadius:10,fontSize:11,color:"#3B82F6",fontWeight:600,textAlign:"center"}}>{allPending.length} demandes en attente</div>}

    {pending&&<div style={{margin:"0 16px 14px",padding:16,background:"var(--card)",border:"2px solid rgba(249,115,22,0.25)",borderRadius:16,boxShadow:"0 4px 14px rgba(249,115,22,0.08)"}}>
      {/* Top row: badge + timer */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{display:"flex",gap:6}}>
          <span style={{padding:"4px 10px",borderRadius:8,background:"rgba(16,185,129,0.08)",color:"#10B981",fontSize:10,fontWeight:800,letterSpacing:.5}}>{pending.isGroup?"🤝 GROUPE":pending.items?.[0]?.name?.toLowerCase()?.includes("colis")?"COLIS":"COURSE"}</span>
          {pending.payment==="cash"&&<span style={{padding:"4px 8px",borderRadius:8,background:"rgba(245,158,11,0.08)",color:"#F59E0B",fontSize:10,fontWeight:700}}>💵 Cash</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:14,background:"rgba(239,68,68,0.08)"}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#EF4444",animation:"pulse 1s infinite"}}/>
          <span style={{fontSize:11,fontWeight:700,color:"#EF4444",fontVariantNumeric:"tabular-nums"}}>0:09</span>
        </div>
      </div>

      {/* Title + Distance/Time on left, Fee on right */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:14}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:17,fontWeight:800,lineHeight:1.2,marginBottom:4}}>{pending.pickup}</div>
          <div style={{fontSize:12,color:"var(--muted)"}}>{pending.distance} · {pending.eta}</div>
        </div>
        <div style={{fontSize:20,fontWeight:800,color:"#10B981",flexShrink:0,marginLeft:12}}>+{fmt(pending.fee+pending.tip)}</div>
      </div>

      {/* Actions */}
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>{setRefusing(pending);setTimeout(()=>{setDismissed(p=>[...p,pending.id]);setRefusing(null)},1400)}} style={{padding:"14px 22px",borderRadius:14,border:"1px solid var(--border)",background:"transparent",color:"var(--text)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Refuser</button>
        <button onClick={()=>{setAccepting(pending);setTimeout(()=>{setAccepting(null);go("drBriefing",pending)},1600)}} style={{flex:1,padding:"14px",borderRadius:14,border:"none",background:"#10B981",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 12px rgba(16,185,129,0.25)"}}>Accepter</button>
      </div>
    </div>}

{/* Quick stats */}
    <div className="sec" style={{marginTop:6}}><h3>Dernières livraisons</h3><span onClick={()=>go("drHistory")}>Voir tout</span></div>
    <div style={{padding:"0 16px 20px"}}>{D_HISTORY.slice(0,3).map(h=><div key={h.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border)"}}>
      <div style={{width:36,height:36,borderRadius:10,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>✅</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{h.vendor} → {h.client}</div><div style={{fontSize:11,color:"var(--muted)"}}>{h.date} · {h.duration} · {h.distance}</div></div>
      <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:"#F97316"}}>+{fmt(h.fee+h.tip)}</div><div style={{fontSize:11,color:"#F59E0B"}}>{"★".repeat(h.rating)}</div></div>
    </div>)}</div>
  {refusing&&<SuccessAnimation
      type="error"
      title="Course refusée"
      subtitle={`${refusing.distance} · ${refusing.eta}`}
      hint="En attente de la prochaine demande..."
      duration={0}
    />}
    {accepting&&<SuccessAnimation
      title="Course acceptée !"
      subtitle={`+${fmt((accepting.fee||0)+(accepting.tip||0))} · ${accepting.distance}`}
      hint="Préparation des détails..."
      duration={0}
    />}

    {showGoalModal&&<div onClick={()=>setShowGoalModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:9999,display:"flex",alignItems:"flex-end",animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:500,margin:"0 auto",background:"var(--card)",borderRadius:"24px 24px 0 0",padding:20,animation:"slideUp .3s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{width:36,height:4,borderRadius:2,background:"var(--border)",margin:"0 auto 16px"}}/>
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:32,marginBottom:6}}>🎯</div>
          <h3 style={{fontSize:18,fontWeight:800,marginBottom:4}}>Votre objectif du jour</h3>
          <p style={{fontSize:12,color:"var(--muted)"}}>Définissez combien vous souhaitez gagner aujourd'hui</p>
        </div>

        <div style={{padding:18,background:"var(--light)",borderRadius:16,marginBottom:14,textAlign:"center"}}>
          <div style={{fontSize:10,color:"var(--muted)",fontWeight:700,letterSpacing:1,marginBottom:6}}>OBJECTIF</div>
          <div style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:6}}>
            <input type="number" value={tempGoal} onChange={e=>setTempGoal(e.target.value)} inputMode="numeric" style={{fontSize:32,fontWeight:800,color:"#10B981",background:"transparent",border:"none",outline:"none",textAlign:"center",width:140,fontFamily:"inherit"}}/>
            <span style={{fontSize:16,fontWeight:700,color:"var(--text)"}}>FCFA</span>
          </div>
          <div style={{fontSize:11,color:"#F59E0B",fontWeight:600,marginTop:6}}>+{fmt(Math.round((parseInt(tempGoal)||0)*0.2))} bonus si atteint</div>
        </div>

        {/* Quick presets */}
        <div style={{fontSize:11,fontWeight:700,color:"var(--muted)",marginBottom:8}}>OBJECTIFS RAPIDES</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14}}>
          {[5000,10000,15000,20000,25000,30000].map(v=>{const sel=parseInt(tempGoal)===v;return(
            <button key={v} onClick={()=>setTempGoal(v)} style={{padding:"10px 8px",borderRadius:10,border:sel?"2px solid #10B981":"1px solid var(--border)",background:sel?"rgba(16,185,129,0.06)":"var(--card)",color:sel?"#10B981":"var(--text)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{fmt(v)}</button>
          )})}
        </div>

        <div style={{padding:10,background:"rgba(59,130,246,0.04)",borderRadius:10,fontSize:11,color:"var(--sub)",marginBottom:14,lineHeight:1.5}}>
          💡 Conseil : commencez petit (5-10k F) et augmentez progressivement. Vous gagnez 20% de bonus en atteignant votre objectif.
        </div>

        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowGoalModal(false)} style={{padding:"14px 22px",borderRadius:14,border:"1px solid var(--border)",background:"transparent",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Annuler</button>
          <button onClick={saveGoal} style={{flex:1,padding:14,borderRadius:14,border:"none",background:"#10B981",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 12px rgba(16,185,129,0.25)"}}>Enregistrer</button>
        </div>
      </div>
    </div>}
    </div></PullToRefresh>

    {/* Boost Payment Modal */}
    {boostPay&&<div onClick={()=>!boostPaying&&setBoostPay(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeInFast .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:340,background:"var(--card)",borderRadius:20,padding:20,animation:"scaleIn .25s cubic-bezier(.4,0,.2,1)"}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:32,marginBottom:6}}>🚀</div>
          <h3 style={{fontSize:16,fontWeight:700}}>Activer le Boost</h3>
          <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Commandes prioritaires pendant 24h</p>
        </div>
        <div style={{padding:14,background:"var(--light)",borderRadius:14,textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:10,color:"var(--muted)"}}>Prix du boost</div>
          <div style={{fontSize:26,fontWeight:800,color:"#F59E0B"}}>1 000 F</div>
          <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>Valable 24h · Non remboursable</div>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:12}}>
          {[["airtel","Airtel"],["mtn","MTN"],["kolo","Kolo"]].map(([k,n])=>(
            <div key={k} onClick={()=>setBoostMethod(k)} style={{flex:1,padding:"8px 4px",textAlign:"center",borderRadius:10,border:boostMethod===k?"2px solid #F59E0B":"1px solid var(--border)",background:boostMethod===k?"rgba(245,158,11,0.06)":"var(--card)",cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"center"}}><PayLogo method={k} size={24}/></div><div style={{fontSize:9,fontWeight:600,marginTop:2}}>{n}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",border:"1px solid var(--border)",borderRadius:12,background:"var(--light)",marginBottom:14}}>
          <span style={{fontSize:13,fontWeight:600,flexShrink:0}}>+242</span>
          <input value={boostPhone} onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,"").slice(0,9);setBoostPhone(v)}} placeholder={getPhonePlaceholder(boostMethod)} type="tel" maxLength={11} style={{flex:1,border:"none",background:"transparent",fontSize:14,outline:"none",fontFamily:"inherit",color:"var(--text)"}}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setBoostPay(false)} disabled={boostPaying} style={{flex:1,padding:11,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Annuler</button>
          <button onClick={()=>{const err=validatePayPhone(boostPhone,boostMethod);if(err){toast.error(err);return}setBoostPaying(true);setTimeout(()=>{setBoostPaying(false);setBoostPay(false);setBoosted(true);toast.success("🔥 Boost activé ! Priorité max pendant 24h")},3000)}} disabled={boostPaying||!isPayPhoneValid(boostPhone,boostMethod)} style={{flex:1,padding:11,borderRadius:12,border:"none",background:isPayPhoneValid(boostPhone,boostMethod)?"#F59E0B":"var(--border)",color:isPayPhoneValid(boostPhone,boostMethod)?"#fff":"var(--muted)",fontSize:13,fontWeight:700,cursor:isPayPhoneValid(boostPhone,boostMethod)?"pointer":"not-allowed",fontFamily:"inherit"}}>
            {boostPaying?"⏳ Validation...":"💳 Payer 1 000 F"}
          </button>
        </div>
      </div>
    </div>}
  </>);
}

/* D2 ── ACTIVE DELIVERY (multi-step) ── */

export default DrDashboardScr;
