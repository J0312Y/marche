import { useState } from "react";
import toast from "../../utils/toast";
function QRScanScr({onBack,go}){
  const [scanned,setScanned]=useState(false);
  const mockScan=()=>{setScanned(true);toast.success("Commerce trouvé ! 🏪");setTimeout(()=>go("vendor",{id:"v1",name:"Tech Congo"}),1000)};
  return(<div className="scr" style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Scanner QR</h2><div style={{width:38}}/></div>
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:20,textAlign:"center"}}>
      {!scanned?<>
        <div onClick={mockScan} style={{width:200,height:200,borderRadius:24,border:"3px solid #6366F1",position:"relative",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--card)"}}>
          <div style={{position:"absolute",top:-2,left:-2,width:40,height:40,borderTop:"4px solid #6366F1",borderLeft:"4px solid #6366F1",borderRadius:"12px 0 0 0"}}/>
          <div style={{position:"absolute",top:-2,right:-2,width:40,height:40,borderTop:"4px solid #6366F1",borderRight:"4px solid #6366F1",borderRadius:"0 12px 0 0"}}/>
          <div style={{position:"absolute",bottom:-2,left:-2,width:40,height:40,borderBottom:"4px solid #6366F1",borderLeft:"4px solid #6366F1",borderRadius:"0 0 0 12px"}}/>
          <div style={{position:"absolute",bottom:-2,right:-2,width:40,height:40,borderBottom:"4px solid #6366F1",borderRight:"4px solid #6366F1",borderRadius:"0 0 12px 0"}}/>
          <div style={{width:160,height:2,background:"#6366F1",opacity:.5,position:"absolute",animation:"scanLine 2s ease-in-out infinite"}}/>
          <div style={{fontSize:48,opacity:.3}}>📷</div>
        </div>
        <p style={{fontSize:14,fontWeight:600,marginTop:16}}>Scannez un QR code</p>
        <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Pointez vers le QR code d'un commerce Lamuka</p>
        <button onClick={mockScan} style={{marginTop:20,padding:"10px 24px",borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>📱 Simuler un scan</button>
      </>:<div>
        <div style={{fontSize:56,marginBottom:10}}>✅</div>
        <h3 style={{fontSize:18,fontWeight:700}}>Commerce trouvé !</h3>
        <p style={{fontSize:13,color:"var(--muted)",marginTop:4}}>Redirection vers Tech Congo...</p>
      </div>}
    </div>
  </div>);
}
export default QRScanScr;
