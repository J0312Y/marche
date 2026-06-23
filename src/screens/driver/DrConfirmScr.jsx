import { useState, useRef } from "react";
import { fmt } from "../../utils/helpers";
import toast from "../../utils/toast";
import SuccessAnimation from "../../components/SuccessAnimation";
import { validatePayPhone, getPhonePlaceholder, isPayPhoneValid } from "../../utils/phoneValidation";
import Icon from "../../components/Icon";
import { verifyOrderPin, getOrderPin } from "../../utils/deliveryPin";

function DrConfirmScr({delivery:dl,go,onBack}){
  const [method,setMethod]=useState(null);
  const [code,setCode]=useState("");
  const [pinAttempts,setPinAttempts]=useState(0);
  const [pinError,setPinError]=useState(false);
  const [pinShake,setPinShake]=useState(false);
  const pinInputRefs = useRef([]);
  const [photoTaken,setPhotoTaken]=useState(false);
  const [signed,setSigned]=useState(false);
  const [done,setDone]=useState(false);
  const [showCelebration,setShowCelebration]=useState(false);
  const [cashCollected,setCashCollected]=useState(false);
  const [cashReversed,setCashReversed]=useState(false);
  const isCash=dl.payment==="cash";
  const vendorAmount=dl.total-(dl.fee||2000);

  // PIN verification state
  const pinComplete = code.length === 4;
  const pinValid = pinComplete && verifyOrderPin(dl.ref, code);
  const pinInvalid = pinComplete && !pinValid;

  // Handle each digit input
  const handlePinChange = (idx, val) => {
    const digit = val.replace(/\D/g, "").slice(-1); // take last char only
    const arr = code.padEnd(4, " ").split("").slice(0, 4);
    arr[idx] = digit;
    const newCode = arr.join("").trim();
    setCode(newCode);
    setPinError(false);
    // Auto-focus next
    if (digit && idx < 3) {
      pinInputRefs.current[idx + 1]?.focus();
    }
    // Auto-verify when 4 digits entered
    if (newCode.length === 4 && idx === 3) {
      setTimeout(() => {
        if (!verifyOrderPin(dl.ref, newCode)) {
          setPinError(true);
          setPinShake(true);
          setPinAttempts(a => a + 1);
          setTimeout(() => setPinShake(false), 400);
        }
      }, 100);
    }
  };

  const handlePinPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length > 0) {
      setCode(pasted);
      setPinError(false);
      if (pasted.length === 4) {
        if (!verifyOrderPin(dl.ref, pasted)) {
          setPinError(true);
          setPinShake(true);
          setPinAttempts(a => a + 1);
          setTimeout(() => setPinShake(false), 400);
        }
      }
    }
  };

  const handlePinKey = (idx, e) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      pinInputRefs.current[idx - 1]?.focus();
    }
  };

  // Cash reversal screen
  if(showCelebration)return(<SuccessAnimation title="Livraison réussie !" subtitle={`+${fmt(dl.fee||0)} gagnés`} hint={isCash?"Encaissement en cours...":"Bravo !"} duration={2000} onDone={()=>setShowCelebration(false)}/>);
  if(done&&isCash&&!cashReversed)return(<div className="scr" style={{padding:16}}>
    <div className="appbar" style={{padding:0,marginBottom:12}}><div style={{width:38}}/><h2>Reverser au vendeur</h2><div style={{width:38}}/></div>
    <div style={{textAlign:"center",marginBottom:16}}>
      <div style={{fontSize:48,marginBottom:6}}></div>
      <h3 style={{fontSize:18,fontWeight:700}}>Envoyez l'argent au vendeur</h3>
      <p style={{fontSize:12,color:"var(--muted)",marginTop:4}}>Vous avez collecté <b style={{color:"#F59E0B"}}>{fmt(dl.total)}</b> en espèces</p>
    </div>

    {/* Breakdown */}
    <div style={{padding:16,background:"var(--card)",border:"1px solid var(--border)",borderRadius:16,marginBottom:14}}>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span style={{color:"var(--muted)"}}>Montant collecté</span><b>{fmt(dl.total)}</b></div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6,color:"#10B981"}}><span>− Vos frais de livraison</span><b>- {fmt(dl.fee||2000)}</b></div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:800,paddingTop:8,borderTop:"2px solid var(--border)",color:"#F97316"}}><span>À envoyer au vendeur</span><span>{fmt(vendorAmount)}</span></div>
    </div>

    {/* Vendor info */}
    <div style={{padding:14,background:"rgba(249,115,22,0.04)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:14,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
        <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,#F97316,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{dl.vendor.avatar||""}</div>
        <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{dl.vendor.name}</div><div style={{fontSize:12,color:"var(--muted)"}}>{dl.vendor.phone}</div></div>
      </div>
      <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>Envoyez <b style={{color:"#F97316"}}>{fmt(vendorAmount)}</b> via Airtel Money ou MTN MoMo au numéro ci-dessus.</div>
    </div>

    {/* Deadline */}
    <div style={{padding:12,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:12,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:18}}>⏰</span>
      <div style={{fontSize:12,color:"var(--muted)"}}><b style={{color:"#EF4444"}}>Délai : 24h maximum.</b> Les retards répétés entraînent la suspension du compte.</div>
    </div>

    {/* Your earnings */}
    <div style={{padding:14,background:"rgba(16,185,129,0.04)",border:"1px solid rgba(16,185,129,0.15)",borderRadius:14,marginBottom:14,textAlign:"center"}}>
      <div style={{fontSize:11,color:"var(--muted)"}}>Vos gains sur cette livraison</div>
      <div style={{fontSize:24,fontWeight:800,color:"#10B981",marginTop:2}}>{fmt(dl.fee||2000)}</div>
      {dl.tip>0&&<div style={{fontSize:12,color:"#F59E0B",marginTop:2}}>+ {fmt(dl.tip)} pourboire</div>}
    </div>

    <div className="bottom-action-bar"><button className="btn-primary" style={{background:"#10B981"}} onClick={()=>{setCashReversed(true);toast.success("Reversement confirmé — merci !")}}><Icon name="check_circle" size={16}/>{" "}J'ai envoyé {fmt(vendorAmount)} au vendeur</button></div>
    <div style={{textAlign:"center",marginTop:8}}><span style={{fontSize:10,color:"var(--muted)"}}>Le vendeur confirmera la réception dans son app</span></div>
  </div>);

  // Done screen (standard or after cash reversal)
  if(done&&(!isCash||cashReversed))return(<div style={{display:"flex",flexDirection:"column",height:"100%",justifyContent:"center"}}>
    <div style={{textAlign:"center",padding:"40px 24px"}}>
      <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(16,185,129,0.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:48,animation:"splash-pop .5s ease"}}><Icon name="sparkle" size={18}/></div>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:6}}>Livraison terminée !</h2>
      <p style={{fontSize:14,color:"var(--sub)",marginBottom:4}}>{dl.ref} livré à <b>{dl.client.name}</b></p>
      {isCash&&<div style={{padding:8,background:"rgba(16,185,129,0.06)",borderRadius:10,marginBottom:8,fontSize:12,color:"#10B981",fontWeight:600}}><Icon name="check_circle" size={16}/>{" "}{fmt(vendorAmount)} reversé à {dl.vendor.name}</div>}
      <div style={{display:"flex",justifyContent:"center",gap:20,margin:"20px 0",padding:16,background:"var(--light)",borderRadius:16}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#F97316"}}>{fmt(dl.fee)}</div><div style={{fontSize:11,color:"var(--muted)"}}>Course</div></div>
        {dl.tip>0&&<div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#F59E0B"}}>{fmt(dl.tip)}</div><div style={{fontSize:11,color:"var(--muted)"}}>Pourboire</div></div>}
        <div style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:700,color:"#F97316"}}>{fmt(dl.fee+dl.tip)}</div><div style={{fontSize:11,color:"var(--muted)"}}>Total gagné</div></div>
      </div>
      <button onClick={()=>go("drRateVendor",{name:dl?.vendor?.name||"Commerce",avatar:dl?.vendor?.avatar||""})} style={{width:"100%",padding:14,borderRadius:14,border:"1px solid var(--border)",background:"var(--card)",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",color:"var(--text)",marginBottom:8}}><Icon name="star_full" size={16}/>{" "}Évaluer le commerce</button>
      <div className="bottom-action-bar"><button className="btn-primary" style={{background:"#F97316"}} onClick={onBack}> Retour au dashboard</button></div>
    </div>
  </div>);

  return(<>
    <div className="appbar"><button onClick={onBack}>←</button><h2>Confirmer livraison</h2><div style={{width:38}}/></div>
    <div className="scr" style={{padding:16}}>
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontSize:48,marginBottom:8}}><Icon name="package" size={18}/></div>
        <h3 style={{fontSize:18,fontWeight:700}}>Livraison à {dl.client.name}</h3>
        <p style={{fontSize:13,color:"var(--muted)"}}>{dl.client.addr}</p>
      </div>

      <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Méthode de confirmation</div>
      <div className="dr-confirm-options">
        {[["code","","Code PIN"],["photo","","Photo"],["signature","️","Signature"]].map(([k,i,l])=>
          <div key={k} className={`dr-confirm-opt ${method===k?"on":""}`} onClick={()=>setMethod(k)}>
            <div className="dco-icon">{i}</div><div className="dco-label">{l}</div>
          </div>)}
      </div>

      {method==="code"&&<div style={{marginTop:14}}>
        <div style={{padding:"10px 12px",background:"rgba(249,115,22,0.05)",border:"1px solid rgba(249,115,22,0.15)",borderRadius:10,marginBottom:12,display:"flex",alignItems:"flex-start",gap:8}}>
          <Icon name="info" size={13} color="#F97316"/>
          <div style={{fontSize:11,color:"var(--text)",lineHeight:1.5,flex:1}}>
            Demandez le <b>code à 4 chiffres</b> au client. Il le voit dans son app sur la page de suivi.
          </div>
        </div>

        <style>{`@keyframes shake-pin{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}50%{transform:translateX(6px)}75%{transform:translateX(-4px)}}`}</style>

        <div style={{
          display:"flex",
          gap:8,
          justifyContent:"center",
          marginBottom:10,
          animation: pinShake ? "shake-pin 0.4s ease" : "none",
        }}>
          {[0,1,2,3].map(i=>{
            const digit = code[i] || "";
            return(
              <input
                key={i}
                ref={el => pinInputRefs.current[i] = el}
                value={digit}
                onChange={e => handlePinChange(i, e.target.value)}
                onKeyDown={e => handlePinKey(i, e)}
                onPaste={i === 0 ? handlePinPaste : undefined}
                inputMode="numeric"
                maxLength={1}
                autoComplete="off"
                style={{
                  width:54, height:62,
                  borderRadius:14,
                  border:`2.5px solid ${pinValid ? "#10B981" : pinInvalid ? "#EF4444" : digit ? "#F97316" : "var(--border)"}`,
                  background: pinValid ? "rgba(16,185,129,0.06)" : pinInvalid ? "rgba(239,68,68,0.06)" : digit ? "rgba(249,115,22,0.04)" : "var(--card)",
                  fontSize:28, fontWeight:800,
                  fontFamily:"monospace",
                  textAlign:"center",
                  color: pinValid ? "#047857" : pinInvalid ? "#DC2626" : "var(--text)",
                  outline:"none",
                  transition:"all 0.15s ease",
                  boxSizing:"border-box",
                }}
              />
            );
          })}
        </div>

        {/* Verification feedback */}
        {pinValid && (
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            padding:"8px 12px",
            background:"rgba(16,185,129,0.08)",
            borderRadius:10,
            color:"#047857",
            fontSize:12, fontWeight:700,
            marginBottom:8,
          }}>
            <Icon name="check_circle" size={14} color="#10B981"/>
            Code vérifié — Identité confirmée
          </div>
        )}
        {pinInvalid && (
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            padding:"8px 12px",
            background:"rgba(239,68,68,0.08)",
            borderRadius:10,
            color:"#DC2626",
            fontSize:12, fontWeight:700,
            marginBottom:8,
          }}>
            <Icon name="x_circle" size={14} color="#DC2626"/>
            Code incorrect{pinAttempts>0?` · ${pinAttempts} tentative${pinAttempts>1?"s":""}`:""}
          </div>
        )}

        {/* After 3 failed attempts → suggest alternative */}
        {pinAttempts >= 3 && (
          <div style={{
            padding:"12px",
            background:"rgba(245,158,11,0.06)",
            border:"1px solid rgba(245,158,11,0.2)",
            borderRadius:12,
            marginBottom:8,
          }}>
            <div style={{fontSize:11,fontWeight:700,color:"#B45309",marginBottom:6,display:"flex",alignItems:"center",gap:5}}>
              <Icon name="alert_triangle" size={12} color="#B45309"/>
              Plusieurs codes incorrects
            </div>
            <div style={{fontSize:11,color:"var(--text)",lineHeight:1.5,marginBottom:8}}>
              Le client peut consulter son code dans l'app sur la page de suivi de commande. Sinon, utilisez une autre méthode de confirmation.
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>{setMethod("photo");setCode("");setPinAttempts(0);setPinError(false);}} style={{flex:1,padding:"7px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",color:"var(--text)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                Photo à la place
              </button>
              <button onClick={()=>{setMethod("signature");setCode("");setPinAttempts(0);setPinError(false);}} style={{flex:1,padding:"7px 10px",borderRadius:8,border:"1px solid var(--border)",background:"var(--card)",color:"var(--text)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                Signature
              </button>
            </div>
          </div>
        )}
      </div>}

      {method==="photo"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>Prenez une photo du colis remis au client</p>
        <input id="dr-photo-confirm" type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>{
          const f=e.target.files?.[0];if(!f)return;
          const reader=new FileReader();
          reader.onload=()=>{setPhotoTaken(reader.result);toast.success("Photo prise")};
          reader.readAsDataURL(f);e.target.value="";
        }}/>
        {!photoTaken?<div onClick={()=>document.getElementById("dr-photo-confirm")?.click()} style={{height:160,background:"var(--light,#F5F4F1)",border:"2px dashed var(--border,#E8E6E1)",borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <div style={{width:56,height:56,borderRadius:16,background:"rgba(249,115,22,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:6}}><Icon name="camera" size={18}/></div>
          <div style={{fontSize:13,fontWeight:600,color:"var(--muted,#908C82)"}}>Appuyer pour prendre la photo</div>
        </div>
        :<div style={{height:160,borderRadius:18,overflow:"hidden",position:"relative",border:"2px solid #F97316"}}>
          <img src={photoTaken} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
          <div style={{position:"absolute",top:8,right:8,padding:"4px 10px",borderRadius:8,background:"#F59E0B",color:"#fff",fontSize:10,fontWeight:700}}><Icon name="check_circle" size={16}/>{" "}Photo prise</div>
          <div onClick={()=>setPhotoTaken(false)} style={{position:"absolute",bottom:8,right:8,padding:"4px 10px",borderRadius:8,background:"rgba(239,68,68,.9)",color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer"}}>️ Reprendre</div>
        </div>}
      </div>}

      {method==="signature"&&<div style={{marginTop:14}}>
        <p style={{fontSize:13,color:"var(--muted)",marginBottom:10}}>Le client signe sur l'écran</p>
        {!signed?<div onClick={()=>setSigned(true)} style={{height:140,background:"var(--card)",border:"2px dashed #E8E6E1",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
          <div style={{fontSize:13,color:"var(--muted)"}}>️ Appuyer ici pour signer</div>
        </div>
        :<div style={{height:140,background:"rgba(249,115,22,0.04)",border:"2px solid #F97316",borderRadius:18,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
          <div style={{fontFamily:"cursive",fontSize:24,color:"var(--text)",opacity:.6}}>Marie Koumba</div>
          <div onClick={()=>setSigned(false)} style={{position:"absolute",bottom:8,right:8,fontSize:11,color:"#EF4444",cursor:"pointer",fontWeight:600}}>️ Effacer</div>
          <div style={{position:"absolute",top:8,right:8}}><span style={{padding:"3px 8px",borderRadius:6,background:"rgba(249,115,22,0.1)",color:"#F97316",fontSize:10,fontWeight:600}}> Signé</span></div>
        </div>}
      </div>}

      {!method&&<div className="info-box yellow" style={{marginTop:14}}><span><Icon name="info" size={18}/></span><span>Choisissez une méthode de confirmation pour valider la livraison</span></div>}

      {/* Cash collection confirmation */}
      {isCash&&method&&<div style={{marginTop:14,padding:14,background:"rgba(245,158,11,0.06)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:14}}>
        <div style={{fontSize:13,fontWeight:700,color:"#F59E0B",marginBottom:6}}><Icon name="wallet" size={16}/>{" "}Paiement en espèces</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>Montant à collecter : <b style={{color:"#F59E0B",fontSize:16}}>{fmt(dl.total)}</b></div>
        <div onClick={()=>setCashCollected(!cashCollected)} style={{display:"flex",alignItems:"center",gap:10,padding:10,background:cashCollected?"rgba(16,185,129,0.06)":"var(--card)",border:cashCollected?"1px solid rgba(16,185,129,0.2)":"1px solid var(--border)",borderRadius:10,cursor:"pointer"}}>
          <div style={{width:22,height:22,borderRadius:6,border:cashCollected?"none":"2px solid var(--border)",background:cashCollected?"#10B981":"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:12,fontWeight:700}}>{cashCollected&&""}</div>
          <span style={{fontSize:13,fontWeight:600,color:cashCollected?"#10B981":"var(--text)"}}>J'ai bien reçu {fmt(dl.total)} du client</span>
        </div>
      </div>}

      <div className="bottom-action-bar">
        {(() => {
          // Compute eligibility for validation based on chosen method
          const methodReady = method === "code" ? pinValid
                            : method === "photo" ? !!photoTaken
                            : method === "signature" ? signed
                            : false;
          const canValidate = methodReady && (!isCash || cashCollected);
          return (
            <button
              className="btn-primary"
              style={{background: canValidate ? "#F97316" : "var(--border)", color: canValidate ? "var(--card)" : "var(--muted)"}}
              onClick={() => {
                if (canValidate) {
                  setDone(true);
                  setShowCelebration(true);
                  toast.success(isCash ? "Paiement collecté — Reversez au vendeur" : "Livraison confirmée");
                }
              }}
              disabled={!canValidate}
            >
              <Icon name="check_circle" size={16}/>{" "}Valider la livraison
            </button>
          );
        })()}
      </div>
    </div>
  </>);
}

/* D4 ── GPS NAVIGATION ── */

export default DrConfirmScr;
