import { useState } from "react";
import { fmt } from "../../utils/helpers";
import toast from "../../utils/toast";
import Icon from "../../components/Icon";
import driverAPI from "../../api/driver";

/**
 * Remise au client (livreur) : code de livraison donné par le client, vérifié par le serveur,
 * puis encaissement en espèces confirmé. Aucune étape simulée.
 */
function DrConfirmScr({ delivery: dl, go, onBack }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [cash, setCash] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const isCash = dl.payment === "cash";
  const gain = (dl.fee || 0) + (dl.tip || 0);
  const ready = code.length === 6 && (!isCash || cash) && !busy;

  const confirm = async () => {
    if (!ready) return;
    setBusy(true);
    try { await driverAPI.deliver(dl.id, code); }
    catch (e) {
      setBusy(false);
      if (e.status === 422 && /code/i.test(e.message || "")) { setErr(e.message); setCode(""); }
      else toast.error(e.message || "Impossible de confirmer la livraison");
      return;
    }
    setBusy(false);
    setDone(true);
  };

  if (done) return (
    <div className="t-scr gray" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        <span style={{ width: 84, height: 84, borderRadius: 42, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={40} color="var(--acc)" /></span>
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 18 }}>Livraison terminée</div>
        <div className="t-sub" style={{ fontSize: 15, marginTop: 6 }}>Commande {dl.ref} remise à {dl.client.name}</div>
        <div className="t-card" style={{ width: "100%", margin: "24px 0 0", padding: "6px 16px" }}>
          {isCash && <div className="t-row" style={{ padding: "12px 0", borderBottom: "1px solid var(--t-line)" }}><span className="t-sub" style={{ fontSize: 15 }}>Espèces encaissées</span><b>{fmt(dl.total)}</b></div>}
          <div className="t-row" style={{ padding: "12px 0" }}><span className="t-sub" style={{ fontSize: 15 }}>Votre gain</span><b style={{ color: "var(--acc-d)", fontSize: 18 }}>+{fmt(gain)}</b></div>
        </div>
      </div>
      <div className="t-bottom" style={{ display: "flex", gap: 8 }}>
        <button className="t-cta ghost" onClick={() => go("drRateVendor", { name: dl.vendor?.name || "Commerce" })}><span>Noter le commerce</span></button>
        <button className="t-cta center" onClick={onBack}><span>Terminer</span></button>
      </div>
    </div>
  );

  return (
    <div className="t-scr gray" style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div className="t-head">
        <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
        <h1>Remise au client</h1>
      </div>
      <div style={{ flex: 1 }}>
        <div className="t-card tk-box">
          <div className="t-sub" style={{ fontSize: 13, fontWeight: 600 }}>Commande {dl.ref}</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 4 }}>{dl.client.name}</div>
          {dl.client.addr && <div className="t-sub" style={{ fontSize: 14, marginTop: 2 }}>{dl.client.addr}</div>}
        </div>

        <div className="t-card tk-box">
          <div className="tk-h" style={{ marginBottom: 4 }}>Code de livraison</div>
          <div className="t-sub" style={{ fontSize: 14, marginBottom: 12 }}>Demandez au client le code à 6 chiffres affiché dans son suivi de commande.</div>
          <input className="t-input" value={code} inputMode="numeric" maxLength={6} placeholder="••••••" autoFocus aria-label="Code de livraison"
            onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErr(""); }}
            style={{ height: 56, fontSize: 24, fontWeight: 700, letterSpacing: 10, textAlign: "center", borderColor: err ? "#E11D48" : undefined }} />
          {err && <div style={{ color: "#E11D48", fontSize: 13, marginTop: 6 }}>{err}</div>}
        </div>

        {isCash && <div className="t-card tk-box">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="cash" size={22} color="var(--acc)" /></span>
            <div style={{ flex: 1 }}><div style={{ fontSize: 15, fontWeight: 600 }}>À encaisser en espèces</div><div className="t-sub">Comptez avant de valider</div></div>
            <b style={{ fontSize: 18 }}>{fmt(dl.total)}</b>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--t-line)", cursor: "pointer", fontSize: 15 }}>
            <input type="checkbox" checked={cash} onChange={(e) => setCash(e.target.checked)} style={{ width: 22, height: 22, accentColor: "var(--acc)" }} />
            J'ai reçu {fmt(dl.total)} du client
          </label>
        </div>}
      </div>
      <div className="t-bottom">
        <button className="t-cta center" disabled={!ready} onClick={confirm}><span>{busy ? "Vérification…" : "Valider la livraison"}</span></button>
      </div>
    </div>
  );
}

export default DrConfirmScr;
