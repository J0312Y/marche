import { useState } from "react";

const DAYS=["Lu","Ma","Me","Je","Ve","Sa","Di"];
const ORDERS_DATA={
  "2026-03-17":[{ref:"#0301",client:"Marie K.",total:"25 000 F",status:"done"},{ref:"#0302",client:"Paul N.",total:"12 000 F",status:"done"}],
  "2026-03-18":[{ref:"#0303",client:"Grace O.",total:"45 000 F",status:"done"}],
  "2026-03-19":[{ref:"#0304",client:"Jean M.",total:"8 500 F",status:"done"},{ref:"#0305",client:"Alice B.",total:"32 000 F",status:"done"},{ref:"#0306",client:"Patrick M.",total:"15 000 F",status:"done"}],
  "2026-03-21":[{ref:"#0307",client:"Diane L.",total:"67 000 F",status:"prep"}],
  "2026-03-22":[{ref:"#0308",client:"Michel N.",total:"18 000 F",status:"prep"},{ref:"#0309",client:"Sophie K.",total:"42 000 F",status:"new"}],
  "2026-03-23":[{ref:"#0310",client:"Alain M.",total:"5 500 F",status:"new"},{ref:"#0311",client:"Claire O.",total:"28 000 F",status:"new"},{ref:"#0312",client:"Bruno T.",total:"91 000 F",status:"new"}],
  "2026-03-25":[{ref:"#0313",client:"Eva K.",total:"14 000 F",status:"new"}],
};

function VCalendarScr({onBack}){
  const today=new Date();
  const [month,setMonth]=useState(today.getMonth());
  const [year,setYear]=useState(today.getFullYear());
  const [selDate,setSelDate]=useState(today.toISOString().split("T")[0]);

  const daysInMonth=new Date(year,month+1,0).getDate();
  const firstDay=(new Date(year,month,1).getDay()+6)%7;
  const cells=[];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);

  const MONTHS=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  const dateKey=(d)=>`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const isToday=(d)=>d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
  const selectedOrders=ORDERS_DATA[selDate]||[];
  const statusCol={new:"#F97316",prep:"#F59E0B",done:"#10B981"};
  const statusLbl={new:"Nouvelle",prep:"Préparation",done:"Livrée"};

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><button onClick={onBack}>←</button><h2>📅 Calendrier</h2><div style={{width:38}}/></div>

    {/* Month nav */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <button onClick={()=>{if(month===0){setMonth(11);setYear(year-1)}else setMonth(month-1)}} style={{width:32,height:32,borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",fontSize:12}}>‹</button>
      <span style={{fontSize:15,fontWeight:700}}>{MONTHS[month]} {year}</span>
      <button onClick={()=>{if(month===11){setMonth(0);setYear(year+1)}else setMonth(month+1)}} style={{width:32,height:32,borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",cursor:"pointer",fontSize:12}}>›</button>
    </div>

    {/* Day headers */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
      {DAYS.map(d=><div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"var(--muted)",padding:4}}>{d}</div>)}
    </div>

    {/* Calendar grid */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:16}}>
      {cells.map((d,i)=>{
        if(!d) return <div key={i}/>;
        const dk=dateKey(d);
        const orders=ORDERS_DATA[dk];
        const isSel=dk===selDate;
        return(<div key={i} onClick={()=>setSelDate(dk)} style={{textAlign:"center",padding:"6px 0",borderRadius:10,cursor:"pointer",background:isSel?"#F97316":isToday(d)?"rgba(249,115,22,0.08)":"transparent",color:isSel?"#fff":isToday(d)?"#F97316":"var(--text)",fontSize:13,fontWeight:isSel||isToday(d)?700:400,position:"relative"}}>
          {d}
          {orders&&<div style={{display:"flex",justifyContent:"center",gap:2,marginTop:2}}>
            {orders.slice(0,3).map((_,j)=><div key={j} style={{width:4,height:4,borderRadius:2,background:isSel?"#fff":"#F97316"}}/>)}
          </div>}
        </div>);
      })}
    </div>

    {/* Selected date orders */}
    <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>{selDate===today.toISOString().split("T")[0]?"Aujourd'hui":new Date(selDate).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})} · {selectedOrders.length} commande{selectedOrders.length!==1?"s":""}</div>
    {selectedOrders.length===0?<div style={{textAlign:"center",padding:24,color:"var(--muted)"}}>Aucune commande ce jour</div>
    :selectedOrders.map((o,i)=>(
      <div key={i} style={{padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:13,fontWeight:600}}>{o.client} · {o.ref}</div>
          <div style={{fontSize:14,fontWeight:700,color:"#F97316",marginTop:2}}>{o.total}</div>
        </div>
        <span style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:statusCol[o.status]+"12",color:statusCol[o.status],fontWeight:600}}>{statusLbl[o.status]}</span>
      </div>
    ))}
  </div>);
}
export default VCalendarScr;
