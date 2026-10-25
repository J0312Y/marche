import { useState } from "react";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";
import driverReviewsAPI from "../../api/driverReviews";
import { useAction } from "../../hooks/useData";
import FEATURES from "../../config/features";
import { appInfo } from "../../config/appInfo";

const LABELS = ["", "Mauvaise", "Passable", "Bien", "Très bien", "Excellente"];

/**
 * Note du livreur après une livraison (POST /driver-reviews, une seule fois par livraison).
 * Le pourboire passe par le portefeuille : proposé seulement quand le Mobile Money est actif.
 */
function RateDriverScr({ onBack, onDone, driver = {} }) {
  const [rating, setRating] = useState(driver?.rating || 0);
  const [tip, setTip] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const name = driver?.name || "votre livreur";
  const { run, loading } = useAction();

  const submit = async () => {
    if (!rating) return;
    try { await run(() => driverReviewsAPI.create(driver?.deliveryId, rating, comment.trim() || undefined, tip > 0 ? tip : undefined)); }
    catch (err) { toast.error(err.message || "Impossible d'envoyer la note"); return; }
    setDone(true);
  };

  if (done) return (
    <div className="t-scr gray" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <span style={{ width: 84, height: 84, borderRadius: 42, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={40} color="var(--acc)" /></span>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 18 }}>Merci !</div>
        <div className="t-sub" style={{ fontSize: 15, marginTop: 6 }}>Votre note aide {name} et les autres clients.</div>
      </div>
      <div className="t-bottom"><button className="t-cta center" onClick={onDone || onBack}><span>Retour à l'accueil</span></button></div>
    </div>
  );

  return (
    <div className="t-scr gray" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="t-head">
        <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
        <h1>Noter la livraison</h1>
      </div>
      <div style={{ flex: 1 }}>
        <div className="t-card tk-box" style={{ textAlign: "center", padding: "24px 16px" }}>
          <span className="tk-av" style={{ width: 64, height: 64, fontSize: 24, margin: "0 auto" }}>{name.charAt(0).toUpperCase()}</span>
          <div style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>{name}</div>
          <div className="t-sub" style={{ marginTop: 2 }}>Comment s'est passée la livraison ?</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} aria-label={`${s} étoile${s > 1 ? "s" : ""}`} aria-pressed={rating >= s}
                style={{ width: 48, height: 48, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                <Icon name="star_full" size={38} color={rating >= s ? "#F5A524" : "#D5D7DD"} />
              </button>
            ))}
          </div>
          <div style={{ height: 22, marginTop: 6, fontWeight: 600, color: "var(--t-text)" }}>{LABELS[rating]}</div>
        </div>

        {FEATURES.mobileMoney && <div className="t-card tk-box">
          <div className="tk-h">Pourboire (facultatif)</div>
          <div style={{ display: "flex", gap: 8 }}>
            {(appInfo()?.delivery?.tips || []).map((t) => <button key={t} className={"t-chip" + (tip === t ? " on" : "")} style={{ flex: 1, justifyContent: "center" }} onClick={() => setTip(t)}>{t ? `${t} F` : "Aucun"}</button>)}
          </div>
        </div>}

        <div className="t-card tk-box">
          <div className="tk-h">Un commentaire ? <span className="t-mut" style={{ fontWeight: 400 }}>(facultatif)</span></div>
          <textarea className="t-note" style={{ minHeight: 84 }} maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Ponctualité, amabilité, état de la commande…" />
        </div>
      </div>
      <div className="t-bottom">
        <button className="t-cta center" disabled={!rating || loading} onClick={submit}><span>{!rating ? "Choisissez une note" : loading ? "Envoi…" : "Envoyer ma note"}</span></button>
      </div>
    </div>
  );
}

export default RateDriverScr;
