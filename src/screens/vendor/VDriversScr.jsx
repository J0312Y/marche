import { useState } from "react";
import Icon from "../../components/Icon";
import Sheet from "../../components/t/Sheet";
import { useLoad } from "../../hooks";
import vendorAPI from "../../api/vendor";
import toast from "../../utils/toast";
import { fmtPhone } from "../../utils/phoneValidation";

/**
 * Livreurs attitrés du commerce : livreurs validés par Lamuka, ajoutés par leur numéro.
 * À l'acceptation d'une commande, le commerçant peut la leur confier.
 */
export default function VDriversScr({ onBack }) {
  const { data, reload } = useLoad(() => vendorAPI.ownDrivers());
  const drivers = data?.drivers || [];
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState(null);

  const add = async () => {
    setBusy(true);
    try { await vendorAPI.addOwnDriver(phone.trim()); toast.success("Livreur ajouté"); setPhone(""); reload(); }
    catch (e) { toast.error(e?.message || "Ajout impossible"); }
    setBusy(false);
  };
  const remove = async () => {
    setBusy(true);
    try { await vendorAPI.removeOwnDriver(del.id); toast.success("Livreur retiré"); setDel(null); reload(); }
    catch (e) { toast.error(e?.message || "Impossible de retirer ce livreur"); }
    setBusy(false);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}>
        <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>Mes livreurs</h1>
      </div>
      <div className="t-scr gray">
        <p className="tk-hint" style={{ margin: "14px 20px 4px", color: "var(--t-sub)" }}>
          Vous travaillez avec des livreurs de confiance ? Ajoutez-les : en acceptant une commande, vous pourrez la leur confier. S'ils ne répondent pas, Lamuka trouve un autre livreur.
        </p>
        <div className="t-card tk-box">
          <div className="tk-h" style={{ marginBottom: 8 }}>Ajouter un livreur</div>
          <div className="t-sub" style={{ fontSize: 13, marginBottom: 10 }}>Il doit être inscrit et validé comme livreur sur Lamuka.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input className="t-input" style={{ flex: 1 }} inputMode="tel" placeholder="Numéro du livreur" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <button className="t-cta center" style={{ flex: "0 0 auto", padding: "0 18px" }} disabled={busy || phone.replace(/\D/g, "").length < 9} onClick={add}>Ajouter</button>
          </div>
        </div>
        {drivers.length > 0 && <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
          {drivers.map((d) => (
            <div key={d.id} className="t-row" style={{ alignItems: "center", gap: 12, padding: "12px 0" }}>
              <span style={{ width: 40, height: 40, borderRadius: 20, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--acc)", overflow: "hidden", flexShrink: 0 }}>
                {d.avatar ? <img src={d.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (d.first_name || "?")[0]}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <b style={{ display: "block" }}>{[d.first_name, d.last_name].filter(Boolean).join(" ")}</b>
                <small className="t-sub">{fmtPhone(d.phone)} · {d.busy ? "En course" : d.online ? "En ligne" : "Hors ligne"}</small>
              </span>
              <button className="t-round-btn" onClick={() => setDel(d)} aria-label="Retirer"><Icon name="trash" size={18} /></button>
            </div>
          ))}
        </div>}
        {data && !drivers.length && <div className="t-empty" style={{ padding: "30px 20px" }}><b>Aucun livreur attitré</b><p>Vos commandes sont confiées aux livreurs Lamuka les plus proches.</p></div>}
      </div>
      {del && <Sheet onClose={() => !busy && setDel(null)}>
        <div style={{ padding: "10px 20px 22px" }}>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Retirer {del.first_name} ?</div>
          <div className="t-sub" style={{ fontSize: 14, marginBottom: 18 }}>Il reste livreur Lamuka, mais vous ne pourrez plus lui confier directement vos commandes.</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="t-cta ghost" onClick={() => setDel(null)} disabled={busy}>Garder</button>
            <button className="t-cta center" style={{ background: "#DC2626" }} onClick={remove} disabled={busy}>Retirer</button>
          </div>
        </div>
      </Sheet>}
    </div>
  );
}
