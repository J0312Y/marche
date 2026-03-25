import { useState, useEffect } from "react";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";
import { validatePayPhone, getPhonePlaceholder } from "../../utils/phoneValidation";

const genCode=()=>"GIFT-"+Math.random().toString(36).substring(2,6).toUpperCase();

function GiftCardScr({onBack}){
  const [tab,setTab]=useState("send"); // send | history | redeem
  const [amount,setAmount]=useState(null);
  const [to,setTo]=useState("");
  const [toMethod,setToMethod]=useState("mtn");
  const [toErr,setToErr]=useState("");
  const [msg,setMsg]=useState("");
  const [done,setDone]=useState(false);
  const [generatedCode,setGeneratedCode]=useState("");
  const [history,setHistory]=useState(()=>{
    try{return JSON.parse(localStorage.getItem("lk-giftcards")||"[]")}catch{return[]}
  });
  const [redeemCode,setRedeemCode]=useState("");

  useEffect(()=>{localStorage.setItem("lk-giftcards",JSON.stringify(history))},[history]);

  const amounts=[5000,10000,25000,50000];

  const send=()=>{
    if(!amount){toast.error("Choisissez un montant");return}
    {const err=validatePayPhone(to,toMethod);if(err){setToErr(err);toast.error(err);return}}
    const code=genCode();
    setGeneratedCode(code);
    const card={id:Date.now(),code,amount,to,msg:msg||"",date:new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}),status:"active"};
    setHistory(p=>[card,...p]);
    // Save to redeemable codes
    const codes=JSON.parse(localStorage.getItem("lk-gift-codes")||"[]");
    codes.push({code,amount,remaining:amount,from:"Vous"});
    localStorage.setItem("lk-gift-codes",JSON.stringify(codes));
    setDone(true);
    toast.success("Carte cadeau envoyée ! 🎁");
  };

  const redeem=()=>{
    if(!redeemCode.trim()){toast.error("Entrez un code");return}
    const codes=JSON.parse(localStorage.getItem("lk-gift-codes")||"[]");
    const found=codes.find(c=>c.code.toLowerCase()===redeemCode.trim().toLowerCase());
    if(found&&found.remaining>0){
      // Add to wallet
      const wallet=JSON.parse(localStorage.getItem("lk-gift-wallet")||"[]");
      if(!wallet.find(w=>w.code===found.code)){
        wallet.push(found);
        localStorage.setItem("lk-gift-wallet",JSON.stringify(wallet));
        toast.success("🎉 "+fmt(found.remaining)+" ajoutés à votre compte !");
      } else {
        toast.info("Ce code est déjà dans votre compte");
      }
    } else {
      toast.error("Code invalide ou expiré");
    }
    setRedeemCode("");
  };

  const copyCode=(code)=>{
    navigator.clipboard?.writeText(code);
    toast.success("Code copié ! 📋");
  };

  const shareCard=()=>{
    const text=`🎁 Vous avez reçu une carte cadeau Lamuka Market de ${fmt(amount)} !\n\nCode : ${generatedCode}\n${msg?"\nMessage : "+msg+"\n":""}\nUtilisez ce code dans le panier pour payer vos achats.\n\nTéléchargez Lamuka Market : https://lamuka.market`;
    if(navigator.share){
      navigator.share({title:"Carte Cadeau Lamuka",text}).catch(()=>{});
    } else {
      navigator.clipboard?.writeText(text);
      toast.success("Message copié ! 📋");
    }
  };

  // ── Done screen ──
  if(done)return(<div className="scr" style={{padding:16,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%"}}>
    <div style={{width:240,padding:24,background:"linear-gradient(135deg,#F97316,#FB923C)",borderRadius:20,color:"#fff",textAlign:"center",marginBottom:20,boxShadow:"0 8px 32px rgba(249,115,22,.25)"}}>
      <div style={{fontSize:28,marginBottom:4}}>🎁</div>
      <div style={{fontSize:10,opacity:.8}}>Carte Cadeau Lamuka</div>
      <div style={{fontSize:28,fontWeight:800,margin:"8px 0"}}>{fmt(amount)}</div>
      <div style={{padding:"6px 14px",background:"rgba(255,255,255,.2)",borderRadius:8,fontSize:16,fontWeight:800,letterSpacing:2,display:"inline-block"}}>{generatedCode}</div>
      <div style={{fontSize:10,opacity:.7,marginTop:8}}>Pour: +242 {to}</div>
    </div>

    <h3 style={{fontSize:18,fontWeight:700,marginBottom:4}}>Carte envoyée ! ✅</h3>
    <p style={{fontSize:12,color:"var(--muted)",textAlign:"center",maxWidth:260}}>Un SMS sera envoyé à +242 {to} avec le code. Vous pouvez aussi partager le code directement.</p>

    <div style={{display:"flex",gap:8,marginTop:16,width:"100%",maxWidth:280}}>
      <button onClick={()=>copyCode(generatedCode)} style={{flex:1,padding:12,borderRadius:12,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>📋 Copier</button>
      <button onClick={shareCard} style={{flex:1,padding:12,borderRadius:12,border:"none",background:"#F97316",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>📤 Partager</button>
    </div>

    <button onClick={()=>{setDone(false);setAmount(null);setTo("");setMsg("")}} style={{marginTop:12,padding:"8px 20px",borderRadius:10,border:"1px solid var(--border)",background:"var(--card)",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>Envoyer une autre carte</button>
    <button onClick={onBack} style={{marginTop:8,fontSize:12,color:"var(--muted)",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Retour au profil</button>
  </div>);

  return(<div className="scr" style={{padding:16,paddingBottom:20}}>
    <div className="appbar" style={{padding:0,marginBottom:10}}><button onClick={onBack}>←</button><h2>🎁 Carte Cadeau</h2><div style={{width:38}}/></div>

    {/* Tabs */}
    <div style={{display:"flex",gap:4,marginBottom:14,background:"var(--light)",borderRadius:12,padding:3}}>
      {[["send","🎁 Offrir"],["redeem","🎟️ Utiliser"],["history","📋 Historique"]].map(([k,l])=>(
        <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:8,borderRadius:10,border:"none",background:tab===k?"var(--card)":"transparent",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:tab===k?"var(--text)":"var(--muted)",boxShadow:tab===k?"0 1px 3px rgba(0,0,0,.08)":"none"}}>{l}</button>
      ))}
    </div>

    {/* ── Send tab ── */}
    {tab==="send"&&<>
      <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:36,marginBottom:6}}>🎁</div><p style={{fontSize:12,color:"var(--muted)"}}>Offrez du shopping à vos proches</p></div>
      <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>Choisir le montant</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
        {amounts.map(a=><div key={a} onClick={()=>setAmount(a)} style={{padding:14,borderRadius:14,border:amount===a?"2px solid #F97316":"1px solid var(--border)",background:amount===a?"rgba(249,115,22,0.06)":"var(--card)",cursor:"pointer",textAlign:"center"}}><div style={{fontSize:18,fontWeight:800,color:amount===a?"#F97316":"var(--text)"}}>{fmt(a)}</div></div>)}
      </div>
      <div style={{fontSize:13,fontWeight:700,marginBottom:6}}>Opérateur du destinataire</div>
      <div style={{display:"flex",gap:6,marginBottom:10}}>
        {[["airtel","Airtel","🟠"],["mtn","MTN","🟡"]].map(([k,n,ic])=>(
          <div key={k} onClick={()=>{setToMethod(k);setToErr("")}} style={{flex:1,padding:"8px 4px",textAlign:"center",borderRadius:10,border:toMethod===k?"2px solid #F97316":"1px solid var(--border)",background:toMethod===k?"rgba(249,115,22,0.06)":"var(--card)",cursor:"pointer"}}>
            <div style={{fontSize:16}}>{ic}</div><div style={{fontSize:10,fontWeight:600,marginTop:2}}>{n}</div>
          </div>
        ))}
      </div>
      <div className="field"><label>Numéro du destinataire <span style={{color:"#EF4444"}}>*</span></label>
        <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13,fontWeight:600,flexShrink:0}}>+242</span><input value={to} onChange={e=>{const v=e.target.value.replace(/[^0-9]/g,"").slice(0,9);setTo(v);setToErr("")}} placeholder={getPhonePlaceholder(toMethod)} type="tel" maxLength={11}/></div>
        {toErr&&<div style={{fontSize:11,color:"#EF4444",marginTop:4}}>{toErr}</div>}
      </div>
      <div className="field"><label>Message <span style={{color:"var(--muted)",fontWeight:400}}>(optionnel)</span></label><input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Joyeux anniversaire ! 🎂"/></div>
      <button className="btn-primary" onClick={send}>🎁 Envoyer — {amount?fmt(amount):"..."}</button>
    </>}

    {/* ── Redeem tab ── */}
    {tab==="redeem"&&<>
      <div style={{textAlign:"center",padding:"20px 0 16px"}}><div style={{fontSize:36,marginBottom:6}}>🎟️</div><h3 style={{fontSize:16,fontWeight:700}}>Utiliser une carte cadeau</h3><p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Entrez le code reçu par SMS ou message</p></div>
      <div className="field"><label>Code carte cadeau</label><input value={redeemCode} onChange={e=>setRedeemCode(e.target.value.toUpperCase())} placeholder="GIFT-XXXX" style={{textAlign:"center",fontSize:18,fontWeight:700,letterSpacing:2}}/></div>
      <button className="btn-primary" onClick={redeem}>✅ Ajouter à mon compte</button>

      {/* Show wallet */}
      {(()=>{
        const wallet=JSON.parse(localStorage.getItem("lk-gift-wallet")||"[]");
        return wallet.length>0&&<div style={{marginTop:16}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:8}}>💳 Mes cartes actives</div>
          {wallet.map(w=>(
            <div key={w.code} style={{padding:12,background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,fontWeight:700,fontFamily:"monospace"}}>{w.code}</div><div style={{fontSize:10,color:"var(--muted)"}}>De: {w.from}</div></div>
              <span style={{fontSize:14,fontWeight:800,color:"#10B981"}}>{fmt(w.remaining)}</span>
            </div>
          ))}
          <div style={{fontSize:10,color:"var(--muted)",marginTop:4}}>💡 Appliqué automatiquement dans le panier ou utilisez le code en tant que coupon.</div>
        </div>;
      })()}
    </>}

    {/* ── History tab ── */}
    {tab==="history"&&<>
      {history.length===0?<div style={{textAlign:"center",padding:"40px 0",color:"var(--muted)"}}>
        <div style={{fontSize:36,marginBottom:8}}>📋</div>
        <div style={{fontSize:14,fontWeight:600}}>Aucune carte envoyée</div>
        <div style={{fontSize:12,marginTop:4}}>Envoyez votre première carte cadeau !</div>
      </div>
      :history.map(card=>(
        <div key={card.id} style={{padding:14,background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontSize:16,fontWeight:800,color:"#F97316"}}>{fmt(card.amount)}</span>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:card.status==="active"?"rgba(16,185,129,0.08)":"rgba(var(--muted-rgb),.08)",color:card.status==="active"?"#10B981":"var(--muted)",fontWeight:600}}>{card.status==="active"?"✅ Active":"Utilisée"}</span>
          </div>
          <div style={{fontSize:12,color:"var(--muted)"}}>Pour: +242 {card.to} · {card.date}</div>
          {card.msg&&<div style={{fontSize:11,color:"var(--sub)",marginTop:4,fontStyle:"italic"}}>"{card.msg}"</div>}
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>
            <div style={{padding:"4px 10px",background:"var(--light)",borderRadius:6,fontSize:13,fontWeight:800,fontFamily:"monospace",letterSpacing:1}}>{card.code}</div>
            <button onClick={()=>copyCode(card.code)} style={{padding:"4px 10px",borderRadius:6,border:"1px solid var(--border)",background:"var(--card)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)"}}>📋 Copier</button>
          </div>
        </div>
      ))}
    </>}
  </div>);
}
export default GiftCardScr;
