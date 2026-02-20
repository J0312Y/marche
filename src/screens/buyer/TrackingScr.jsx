

function TrackingScr({onBack,go}){
  return(<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="track-map"><div className="map-grid"/><div className="map-road"/><div className="map-route"/><div className="map-pin" style={{top:"calc(45% - 16px)",left:"13%"}}>📍</div><div className="map-driver">🛵</div><div className="map-pin" style={{top:"calc(45% - 16px)",left:"48%"}}>🏠</div><div className="map-label">🟢 En route · 12 min</div><div style={{position:"absolute",top:12,left:12}}><button onClick={onBack} style={{width:38,height:38,borderRadius:12,background:"#fff",border:"none",cursor:"pointer",fontSize:16,boxShadow:"0 2px 8px rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button></div></div>
    <div className="scr" style={{padding:20}}>
      <div className="track-driver"><div className="td-av">🧑</div><div className="td-info"><h4>Patrick Moukala</h4><p>🛵 Honda PCX · BZ-4521</p><div className="td-r">⭐ 4.8 · 342 livraisons</div></div></div>
      <div className="track-actions"><button className="ta-call" onClick={()=>alert("📞 Appel...")}>📞 Appeler</button><button className="ta-chat" onClick={()=>go("chatDriver")}>💬 Discuter</button></div>
      <div className="eta-box"><h4>Livraison en cours</h4><div className="eta-bar"><div className="eta-fill" style={{width:"65%"}}/></div><div className="eta-info"><span>Départ: <b>Marché Total</b></span><span>Arrivée: <b>~12 min</b></span></div></div>
      <div className="track-detail"><span className="tdi">📦</span><div className="tdt"><h5>#LMK-2026-0214</h5><p>3 articles · 231 500 FCFA</p></div></div>
      <div className="track-detail"><span className="tdi">📍</span><div className="tdt"><h5>Retrait</h5><p>Marché Total, Brazzaville</p></div></div>
      <div className="track-detail"><span className="tdi">🏠</span><div className="tdt"><h5>Livraison</h5><p>Quartier Bacongo, Rue 14</p></div></div>
    </div>
  </div>);
}

/* 20 ── CHAT WITH DRIVER ── */

export default TrackingScr;
