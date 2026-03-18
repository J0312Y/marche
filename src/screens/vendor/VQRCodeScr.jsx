import toast from "../../utils/toast";
function VQRCodeScr({onBack}){
  const url="https://lamuka.market/shop/mode-afrique";
  const copy=()=>{try{navigator.clipboard.writeText(url);toast.success("Lien copié 📋")}catch(e){toast.info(url)}};
  return(<div className="scr" style={{padding:16,paddingBottom:80}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>📱 QR Code</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",padding:20}}>
      <p style={{fontSize:13,color:"var(--muted)",marginBottom:20}}>Les clients scannent ce QR code pour accéder directement à votre boutique.</p>
      {/* SVG QR Code placeholder */}
      <div style={{width:200,height:200,margin:"0 auto 20px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <svg viewBox="0 0 200 200" width="160" height="160">
          {/* QR pattern */}
          {Array(15).fill(0).map((_,r)=>Array(15).fill(0).map((_,c)=>{
            const isCorner=(r<4&&c<4)||(r<4&&c>10)||(r>10&&c<4);
            const isFilled=isCorner||Math.random()>0.5;
            return isFilled?<rect key={r+"-"+c} x={c*13+2} y={r*13+2} width={11} height={11} rx={2} fill="var(--text)" opacity={isCorner?1:.7}/>:null;
          }))}
        </svg>
        <div style={{position:"absolute",width:40,height:40,borderRadius:10,background:"#6366F1",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,fontWeight:800}}>LM</div>
      </div>
      <h3 style={{fontSize:16,fontWeight:700,marginBottom:4}}>Mode Afrique</h3>
      <p style={{fontSize:12,color:"var(--muted)",marginBottom:16}}>{url}</p>
      <div style={{display:"flex",gap:8,maxWidth:280,margin:"0 auto"}}>
        <button onClick={copy} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>📋 Copier le lien</button>
        <button onClick={()=>toast.success("QR téléchargé 📥")} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#6366F1",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📥 Télécharger</button>
      </div>
    </div>
    <div style={{padding:14,background:"var(--light)",borderRadius:14,margin:"10px 0"}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>💡 Utilisations</div>
      {[["🏪","Imprimez et collez à l'entrée de votre commerce"],["📦","Ajoutez sur vos emballages et sacs"],["📱","Partagez sur vos réseaux sociaux"],["🧾","Intégrez sur vos cartes de visite"]].map(([i,t])=><div key={t} style={{display:"flex",gap:8,padding:"4px 0",fontSize:12,color:"var(--sub)"}}><span>{i}</span><span>{t}</span></div>)}
    </div>
  </div>);
}
export default VQRCodeScr;
