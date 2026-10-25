import { useState } from "react";
import PullToRefresh from "../../components/PullToRefresh";
import toast from "../../utils/toast";
import ImageCropper from "../../components/ImageCropper";
import Icon from "../../components/Icon";
import AppVersion from "../../components/t/AppVersion";
import { useLoad, useAction } from "../../hooks";
import vendor from "../../services/vendorService";
import { fmt } from "../../utils/helpers";
import { TYPE_LABEL } from "../../config/storeTypes";

const storeTypeLabel = (t) => TYPE_LABEL[t] || "";

/** Onglet « Commerce » : vitrine (logo, couverture), gestion et compte. */
function VProfileScr({ go, onSwitch, onLogout }) {
  const [logoLocal, setLogo] = useState(null);
  const [coverLocal, setCover] = useState(null);
  const [cropSrc, setCropSrc] = useState(null);
  const { run: runUpload } = useAction();
  const { data, reload } = useLoad(() => vendor.getDashboard("month"));
  const e = data?.establishment || {};
  const logo = logoLocal || e.avatar;
  const cover = coverLocal || e.cover_image;

  const upload = async (field, blob, name, setter, ok) => {
    try {
      const fd = new FormData();
      fd.append(field, blob, name);
      const res = await runUpload(() => (field === "logo" ? vendor.uploadLogo(fd) : vendor.uploadCover(fd)));
      if (res?.url) setter(res.url);
      toast.success(ok);
    } catch (err) { toast.error(err.message || "Échec de l'envoi"); }
  };
  const onCover = (f) => { setCover(URL.createObjectURL(f)); upload("cover", f, f.name, setCover, "Couverture mise à jour"); };
  const onLogo = async (dataUrl) => {
    setCropSrc(null); setLogo(dataUrl);
    upload("logo", await fetch(dataUrl).then((r) => r.blob()), "logo.jpg", setLogo, "Logo mis à jour");
  };

  const Row = ({ icon, label, sub, onClick }) => (
    <button className="t-li" onClick={onClick}>
      <span className="ic"><Icon name={icon} size={20} /></span>
      <span>{label}{sub && <span className="t-sub" style={{ display: "block" }}>{sub}</span>}</span>
      <Icon name="chevron_right" size={20} color="var(--t-mut)" />
    </button>
  );

  return (
    <PullToRefresh onRefresh={reload}>
      <div className="t-scr gray" style={{ minHeight: "100%" }}>
        <div style={{ position: "relative", height: 150, background: cover ? `#333 url(${cover}) center/cover` : "var(--acc-l)" }}>
          <label className="t-pill-btn" style={{ position: "absolute", right: 12, top: "calc(12px + env(safe-area-inset-top, 0px))", background: "rgba(0,0,0,.55)", color: "#fff" }}>
            <Icon name="camera" size={16} color="#fff" />Couverture
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(ev) => { const f = ev.target.files?.[0]; if (f) { onCover(f); ev.target.value = ""; } }} />
          </label>
        </div>
        <div className="t-card" style={{ margin: "-36px 16px 0", position: "relative", padding: "0 16px 16px", textAlign: "center" }}>
          <label style={{ display: "inline-block", marginTop: -32, cursor: "pointer", position: "relative" }}>
            <span className="tk-av" style={{ width: 72, height: 72, borderRadius: 18, fontSize: 28, border: "3px solid var(--card)" }}>{logo ? <img src={logo} alt="" /> : (e.name || "L").charAt(0)}</span>
            <span style={{ position: "absolute", right: -4, bottom: -4, width: 28, height: 28, borderRadius: 14, background: "var(--card)", boxShadow: "0 1px 4px rgba(0,0,0,.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="camera" size={15} /></span>
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={(ev) => { const f = ev.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setCropSrc(r.result); r.readAsDataURL(f); ev.target.value = ""; } }} />
          </label>
          <div style={{ fontSize: 19, fontWeight: 700, marginTop: 8 }}>{e.name || "Mon commerce"}</div>
          <div className="t-sub">{[storeTypeLabel(e.type), e.address].filter(Boolean).join(" · ")}</div>
          <div style={{ display: "flex", borderTop: "1px solid var(--t-line)", marginTop: 14, paddingTop: 12 }}>
            {[["Ventes du mois", fmt(Number(data?.revenue) || 0)], ["Commandes", String(Number(data?.total_orders) || 0)], ["Note", Number(e.total_reviews) ? `${Number(e.rating).toFixed(1)} / 5` : "—"]].map(([l, v], i) => (
              <div key={l} style={{ flex: 1, borderLeft: i ? "1px solid var(--t-line)" : "none" }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{v}</div>
                <div className="t-mut">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="tk-h" style={{ margin: "22px 16px 0" }}>Gestion</div>
        <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
          <Row icon="list" label="Catalogue" sub="Articles, prix, photos, options" onClick={() => go("vProducts")} />
          <Row icon="tag" label="Promotions" sub="Codes promo" onClick={() => go("vPromos")} />
          <Row icon="chart_pie" label="Statistiques" onClick={() => go("vStats")} />
          <Row icon="document" label="Relevés mensuels" sub="Ventes, commission, montant à recevoir" onClick={() => go("vStatements")} />
          <Row icon="bike" label="Mes livreurs" sub="Vos livreurs de confiance" onClick={() => go("vDrivers")} />
          <Row icon="user" label="Mes clients" onClick={() => go("vClients")} />
          <Row icon="star_full" label="Avis clients" onClick={() => go("vReviews")} />
        </div>

        <div className="tk-h" style={{ margin: "22px 16px 0" }}>Réglages</div>
        <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
          <Row icon="settings" label="Paramètres du commerce" sub="Horaires, livraison, carte de fidélité" onClick={() => go("vSettings")} />
          <Row icon="help" label="Aide" onClick={() => go("help")} />
          <Row icon="repeat" label="Passer en mode client" onClick={onSwitch} />
          <button className="t-li" onClick={onLogout} style={{ color: "#B42318" }}>
            <span className="ic" style={{ color: "#B42318" }}><Icon name="logout" size={20} /></span>
            <span>Se déconnecter</span>
          </button>
        </div>
        <AppVersion style={{ paddingBottom: 24 }} />
        {cropSrc && <ImageCropper src={cropSrc} shape="square" onCancel={() => setCropSrc(null)} onConfirm={onLogo} />}
      </div>
    </PullToRefresh>
  );
}

export default VProfileScr;
