

function DrNavigationScr({delivery:dl,go,onBack}){
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="dr-nav-map" style={{flex:1}}>
      <div className="map-grid"/>
      {/* Roads */}
      <div style={{position:"absolute",top:"35%",left:0,right:0,height:8,background:"rgba(255,255,255,.6)",borderRadius:4}}/>
      <div style={{position:"absolute",top:"55%",left:"5%",right:"20%",height:8,background:"rgba(255,255,255,.6)",borderRadius:4,transform:"rotate(3deg)"}}/>
      <div style={{position:"absolute",top:"20%",left:"30%",width:8,height:"60%",background:"rgba(255,255,255,.6)",borderRadius:4}}/>
      {/* Route */}
      <div style={{position:"absolute",top:"35%",left:"20%",width:"30%",height:4,background:"repeating-linear-gradient(90deg,#10B981 0,#10B981 8px,transparent 8px,transparent 14px)",borderRadius:2,animation:"rpulse 2s infinite"}}/>
      <div style={{position:"absolute",top:"35%",left:"50%",width:4,height:"20%",background:"repeating-linear-gradient(180deg,#10B981 0,#10B981 8px,transparent 8px,transparent 14px)",borderRadius:2}}/>
      {/* Me */}
      <div className="dr-nav-me" style={{top:"calc(35% - 22px)",left:"18%"}}>🛵</div>
      {/* Destination */}
      <div style={{position:"absolute",top:"48%",left:"48%",fontSize:32,filter:"drop-shadow(0 2px 6px rgba(0,0,0,.2))"}}>🏠</div>
      {/* Turn direction */}
      <div className="dr-nav-dir">↗ Tourner à droite · 200m</div>
      {/* Top bar */}
      <div style={{position:"absolute",top:12,left:12,right:12,display:"flex",justifyContent:"space-between"}}>
        <button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div style={{padding:"8px 14px",borderRadius:12,background:"#fff",boxShadow:"0 2px 8px rgba(0,0,0,.1)",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>⏱️ {dl.eta} · {dl.distance}</div>
      </div>
      {/* Bottom info */}
      <div className="dr-nav-info">
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏠</div>
          <div style={{flex:1}}><h3>{dl.client.name}</h3><p>{dl.client.addr}</p></div>
          <div style={{display:"flex",gap:6}}>
            <button style={{width:38,height:38,borderRadius:10,border:"none",background:"#10B981",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>alert("📞 Appel")}>📞</button>
            <button style={{width:38,height:38,borderRadius:10,border:"none",background:"#6366F1",color:"#fff",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>go("drChatClient",dl)}>💬</button>
          </div>
        </div>
      </div>
    </div>
  </div>);
}

/* D5 ── DRIVER → VENDOR CHAT ── */

export default DrNavigationScr;
