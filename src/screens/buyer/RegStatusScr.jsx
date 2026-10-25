import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "../../components/Icon";
import { useApp } from "../../context/AppContext";
import api from "../../api/client";
import { auth } from "../../services";
import CONTACT, { whatsappLink } from "../../config/contact";

// Conseils de prise de vue, pièce par pièce
const HINTS = {
  id_front: "CNI ou passeport, face avec la photo. Les 4 coins visibles, sans reflet.",
  id_back: "L'autre face de la même pièce.",
  selfie: "Votre visage, de face, bien éclairé. Le livreur est reconnu à la livraison.",
  license: "Permis de conduire en cours de validité.",
  vehicle_doc: "Carte grise du véhicule (facultatif).",
  shopfront: "La devanture ou l'intérieur de votre commerce, avec l'enseigne si possible.",
  business_doc: "RCCM, patente ou autorisation (facultatif, accélère la validation).",
};

/** Vignette d'une pièce (servie par l'API, avec la session) */
function Thumb({ id }) {
  const [src, setSrc] = useState(null);
  useEffect(() => {
    let url = null, alive = true;
    fetch(`${api.BASE_URL}/registrations/documents/${id}/file`, { headers: { Authorization: `Bearer ${api.getToken()}` } })
      .then((r) => (r.ok ? r.blob() : null)).then((b) => { if (b && alive) { url = URL.createObjectURL(b); setSrc(url); } }).catch(() => {});
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [id]);
  return <span style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden", background: "var(--t-bg2)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    {src ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Icon name="document" size={20} color="var(--t-mut)" />}
  </span>;
}

/**
 * Demande commerçant / livreur : statut réel, pièces justificatives (photo, état, motif d'un refus),
 * renvoi de la demande après correction.
 */
export default function RegStatusScr({ role = "vendor", sent, onBack, go }) {
  const { vendorStatus, driverStatus, setVendorStatus, setDriverStatus, setUserRole, switchTo, showToast } = useApp();
  const isVendor = role === "vendor";
  const appStatus = isVendor ? vendorStatus : driverStatus;
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(null); // type de pièce en cours d'envoi, ou "refresh" / "resubmit"
  const [err, setErr] = useState("");
  const inputRef = useRef(null);
  const target = useRef(null);

  const load = useCallback(() => api.get(`/registrations/documents?role=${role}`).then(setFile).catch(() => setFile(null)), [role]);
  useEffect(() => { load(); }, [load]);

  const syncStatus = async () => {
    try {
      const me = await auth.getMe();
      if (me.role) setUserRole?.(me.role);
      if (me.vendor_status) setVendorStatus(me.vendor_status);
      if (me.driver_status) setDriverStatus(me.driver_status);
    } catch {}
  };
  const refresh = async () => { setBusy("refresh"); await Promise.all([syncStatus(), load()]); setBusy(null); };

  const status = file?.status === "active" ? "approved" : file?.status || appStatus;
  const approved = status === "approved";
  const rejected = status === "rejected";
  const suspended = status === "suspended";
  const editable = file && (status === "pending" || rejected);
  const space = isVendor ? "Espace commerçant" : "Espace livreur";

  const pick = (type) => { target.current = type; setErr(""); inputRef.current?.click(); };
  const send = async (f) => {
    const type = target.current;
    if (!f || !type) return;
    setBusy(type);
    try {
      const fd = new FormData(); fd.append("role", role); fd.append("type", type); fd.append("file", f);
      await api.upload("/registrations/documents", fd);
      await load();
      showToast?.("Pièce envoyée");
    } catch (x) { setErr(x.message || "La photo n'a pas pu être envoyée"); }
    setBusy(null);
  };
  const resubmit = async () => {
    setBusy("resubmit"); setErr("");
    try { await api.post("/registrations/resubmit", { role }); await Promise.all([syncStatus(), load()]); showToast?.("Demande renvoyée"); }
    catch (x) { setErr(x.message); }
    setBusy(null);
  };

  const docs = file?.documents || [];
  const byType = Object.fromEntries(docs.map((d) => [d.type, d]));
  const rows = file ? [...file.required.map((t) => [t, true]), ...file.optional.map((t) => [t, false])] : [];
  const missing = file ? file.required.filter((t) => !byType[t]).length : 0;

  const title = approved ? "Demande acceptée" : rejected ? "Demande à corriger" : suspended ? "Compte suspendu"
    : !file?.complete ? "Ajoutez vos pièces" : sent ? "Demande envoyée" : "Demande en cours d'examen";
  const text = approved ? `Votre ${space} est prêt.`
    : rejected ? (file?.review_note ? `Motif : ${file.review_note}.` : "Votre demande n'a pas été retenue.") + " Corrigez les pièces signalées puis renvoyez votre demande."
    : suspended ? "Votre compte est suspendu. Contactez l'équipe Lamuka."
    : !file?.complete ? `Encore ${missing || file?.refused?.length || 0} pièce${(missing || file?.refused?.length) > 1 ? "s" : ""} à photographier. L'équipe Lamuka examine votre demande dès que le dossier est complet.`
    : "L'équipe Lamuka vérifie vos pièces, en général sous 48 h. Vous recevrez une notification dès qu'elle sera traitée.";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}>
        <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
        <h1>{isVendor ? "Demande commerçant" : "Demande livreur"}</h1>
      </div>

      <div className="t-scr gray">
        <div className="t-card tk-box" style={{ textAlign: "center", padding: "26px 20px" }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", background: rejected || suspended ? "#FEE2E2" : "var(--acc-l)" }}>
            <Icon name={approved ? "check_circle" : rejected || suspended ? "info" : !file?.complete ? "document" : "clock"} size={28} color={rejected || suspended ? "#DC2626" : "var(--acc)"} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{title}</div>
          <div className="t-sub" style={{ fontSize: 14, lineHeight: 1.5 }}>{text}</div>
        </div>

        {file && !approved && <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
          <div className="tk-h" style={{ margin: "14px 0 2px" }}>Pièces justificatives</div>
          <div className="t-sub" style={{ marginBottom: 6 }}>Photos nettes, prises à la lumière. Elles ne sont vues que par l'équipe Lamuka.</div>
          {rows.map(([t, req]) => {
            const d = byType[t];
            const chip = !d ? (req ? ["À ajouter", "var(--t-sub)", "var(--t-bg2)"] : ["Facultatif", "var(--t-mut)", "var(--t-bg2)"])
              : d.status === "accepted" ? ["Conforme", "var(--acc-d)", "var(--acc-l)"]
              : d.status === "refused" ? ["À refaire", "#B42318", "#FDECEA"] : ["Envoyée", "#1D4ED8", "#E8EFFE"];
            return (
              <div key={t} data-doc={t} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--t-line)" }}>
                {d ? <Thumb id={d.id} /> : <span style={{ width: 48, height: 48, borderRadius: 10, border: "1.5px dashed var(--t-line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="camera" size={20} color="var(--t-mut)" /></span>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{file.labels[t]}</div>
                  <div className="t-sub" style={{ lineHeight: 1.35 }}>{d?.status === "refused" && d.note ? <b style={{ color: "#B42318", fontWeight: 600 }}>{d.note}</b> : HINTS[t]}</div>
                  <span style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, color: chip[1], background: chip[2] }}>{chip[0]}</span>
                </div>
                {editable && d?.status !== "accepted" && <button className="t-pill-btn" style={{ height: 36, flexShrink: 0 }} disabled={!!busy} onClick={() => pick(t)}>{busy === t ? "Envoi…" : d ? "Refaire" : "Ajouter"}</button>}
              </div>
            );
          })}
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; send(f); }} />
        </div>}
        {err && <div className="t-card tk-box" style={{ color: "#B42318", fontSize: 14 }}>{err}</div>}

        <div className="t-group">
          <a className="t-li" href={whatsappLink(`Bonjour Lamuka, je suis ma demande ${isVendor ? "commerçant" : "livreur"}`)} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <span className="ic"><Icon name="chat" size={20} color="#16A34A" /></span><span>Une question ? WhatsApp</span>
          </a>
          <a className="t-li" href={`mailto:${CONTACT.email}`} style={{ textDecoration: "none" }}>
            <span className="ic"><Icon name="mail" size={20} color="var(--t-sub)" /></span><span>{CONTACT.email}</span>
          </a>
        </div>
      </div>

      <div className="t-bottom">
        {approved
          ? <button className="t-cta center" onClick={() => switchTo(isVendor ? "vendor" : "driver")}><span>Ouvrir mon {space}</span></button>
          : rejected
            ? <button className="t-cta center" disabled={!!busy || !file?.complete} onClick={resubmit}><span>{busy === "resubmit" ? "Envoi…" : file?.complete ? "Renvoyer ma demande" : "Corrigez les pièces signalées"}</span></button>
            : <button className="t-cta center" disabled={!!busy} onClick={refresh}><span>{busy === "refresh" ? "Vérification…" : "Actualiser"}</span></button>}
      </div>
    </div>
  );
}
