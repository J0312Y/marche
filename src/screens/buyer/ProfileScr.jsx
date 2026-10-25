import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import Sheet from "../../components/t/Sheet";
import { useApp } from "../../context/AppContext";
import { buyer as buyerSvc } from "../../services";
import CONTACT, { whatsappLink, telLink } from "../../config/contact";
import { loyaltyRules } from "../../config/appInfo";
import AppVersion from "../../components/t/AppVersion";

const Tile = ({ icon, label, onClick, badge }) => (
  <button className="ta-tile" onClick={onClick}>
    <span className="ic"><Icon name={icon} size={22} strokeWidth={1.8} color="var(--t-sub)" />{badge && <span className="bd">{badge}</span>}</span>
    <span className="lb">{label}</span>
  </button>
);
const Li = ({ icon, label, onClick, right, danger }) => (
  <button className="t-li" onClick={onClick} style={danger ? { color: "#DC2626" } : undefined}>
    <span className="ic" style={danger ? { background: "#FEE2E2", color: "#DC2626" } : undefined}><Icon name={icon} size={20} color={danger ? "#DC2626" : "var(--t-sub)"} /></span>
    <span>{label}</span>{right}
  </button>
);

/**
 * Compte « Toters » : invité → Support, Langue, Aide, Connexion ; connecté → profil, points, raccourcis, espaces vendeur / livreur.
 */
export default function ProfileScr({ go, userRole, vendorStatus, driverStatus, onLogout }) {
  const { user, requireLogin, lang, unreadCount } = useApp();
  const [support, setSupport] = useState(false);
  const [points, setPoints] = useState(null);
  const [confirmOut, setConfirmOut] = useState(false);
  useEffect(() => { if (user) buyerSvc.getLoyalty().then((r) => setPoints(r?.points ?? 0)).catch(() => {}); }, [user]);

  const hasVendor = (userRole === "vendor" || userRole === "both") && vendorStatus === "approved";
  const hasDriver = (userRole === "driver" || userRole === "both") && driverStatus === "approved";
  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  return (
    <div className="t-scr gray">
      {!user && <div style={{ height: 64, background: "var(--card)" }} />}
      {user && <div style={{ background: "var(--card)", padding: "22px 20px 18px", display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }} onClick={() => go("editProfile")} role="button">
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
          {user.avatar ? <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <b style={{ fontSize: 20, color: "var(--acc)" }}>{(user.first_name || "?")[0]}</b>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 21, fontWeight: 700 }}>{name || "Mon compte"}</div>
          <div className="t-sub" style={{ fontSize: 14 }}>{user.phone}</div>
        </div>
        <Icon name="edit" size={20} color="var(--t-mut)" />
      </div>}

      {user && <div className="t-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "none", cursor: "pointer" }} onClick={() => go("loyalty")} role="button">
        <span style={{ width: 40, height: 40, borderRadius: 10, background: "var(--acc-l)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="coin" size={22} color="var(--acc)" /></span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Mes points</div>
          <div className="t-sub" style={{ fontSize: 13 }}>{points === null ? "…" : loyaltyRules().min != null && points >= loyaltyRules().min ? `${points} points · ${points} F de réduction` : `${points} points${loyaltyRules().min ? ` · utilisables dès ${loyaltyRules().min}` : ""}`}</div>
        </div>
        <Icon name="chevron_right" size={20} color="var(--t-mut)" />
      </div>}

      <div className="t-group ta-tiles">
        {user && <Tile icon="heart" label="Favoris" onClick={() => go("wishlist")} />}
        {user && <Tile icon="map_pin" label="Adresses" onClick={() => go("addresses")} />}
        <Tile icon="headphones" label="Support" onClick={() => setSupport(true)} />
        <Tile icon="globe" label="Langue" badge={lang === "en" ? "En" : "Fr"} onClick={() => go("language")} />
      </div>

      {user && <div className="t-group">
        <Li icon="list" label="Mes commandes" onClick={() => go("orders")} />
        <Li icon="bike" label="Mes courses" onClick={() => go("coursier")} />
        <Li icon="tag" label="Codes promo" onClick={() => go("promos")} />
        <Li icon="chat" label="Messages" onClick={() => go("chatList")} />
        <Li icon="bell" label="Notifications" onClick={() => go("notif")} right={unreadCount > 0 ? <span style={{ flex: "0 0 auto", minWidth: 22, textAlign: "center", padding: "2px 8px", borderRadius: 10, background: "var(--acc)", color: "#fff", fontSize: 12, fontWeight: 700 }}>{unreadCount}</span> : null} />
      </div>}

      {user && <div className="t-group">
        {hasVendor ? <Li icon="store" label="Espace commerçant" onClick={() => go("switchVendor")} />
          : ["pending", "suspended"].includes(vendorStatus) ? <Li icon="store" label={vendorStatus === "suspended" ? "Commerce suspendu" : "Demande commerçant en cours"} onClick={() => go("regStatus", { role: "vendor" })} />
          : <Li icon="store" label="Vendre sur Lamuka" onClick={() => go("vendorReg")} />}
        {/* Demande refusée : le compte redevient client, on peut refaire une demande depuis le début */}
        {hasDriver ? <Li icon="truck" label="Espace livreur" onClick={() => go("switchDriver")} />
          : ["pending", "suspended"].includes(driverStatus) ? <Li icon="truck" label={driverStatus === "suspended" ? "Compte livreur suspendu" : "Demande livreur en cours"} onClick={() => go("regStatus", { role: "driver" })} />
          : <Li icon="truck" label="Devenir livreur" onClick={() => go("driverReg")} />}
      </div>}

      <div className="t-group">
        <div className="gh">Centre d'aide</div>
        <Li icon="help" label="Questions fréquentes" onClick={() => go("help")} />
        <Li icon="truck" label="Livraison et retours" onClick={() => go("deliveryPolicy")} />
        <Li icon="document" label="Mentions légales" onClick={() => go("terms")} />
        <Li icon="shield" label="Confidentialité" onClick={() => go("privacy")} />
      </div>

      <div className="t-group">
        {user ? <>
          <Li icon="settings" label="Paramètres" onClick={() => go("settings")} />
          <Li icon="logout" label="Se déconnecter" danger onClick={() => setConfirmOut(true)} />
        </> : <button className="t-li" onClick={() => requireLogin("login")} style={{ color: "var(--acc)" }}>
          <span className="ic" style={{ background: "var(--acc-l)" }}><Icon name="logout" size={20} color="var(--acc)" /></span><span style={{ fontWeight: 500 }}>Connexion / Inscription</span>
        </button>}
      </div>

      <AppVersion />

      {support && <Sheet onClose={() => setSupport(false)} title="Support">
        <div style={{ padding: "6px 20px 24px" }}>
          <p className="t-sub" style={{ fontSize: 14, marginBottom: 12 }}>Une question sur une commande ? Notre équipe vous répond.</p>
          <a className="t-li" href={whatsappLink("Bonjour Lamuka, j'ai besoin d'aide")} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}><span className="ic"><Icon name="chat" size={20} color="#16A34A" /></span><span>WhatsApp</span><Icon name="chevron_right" size={18} color="var(--t-mut)" /></a>
          <a className="t-li" href={telLink()} style={{ textDecoration: "none" }}><span className="ic"><Icon name="phone" size={20} color="var(--acc)" /></span><span>{CONTACT.phoneDisplay}</span><Icon name="chevron_right" size={18} color="var(--t-mut)" /></a>
          <a className="t-li" href={`mailto:${CONTACT.email}`} style={{ textDecoration: "none" }}><span className="ic"><Icon name="mail" size={20} color="var(--t-sub)" /></span><span>{CONTACT.email}</span><Icon name="chevron_right" size={18} color="var(--t-mut)" /></a>
        </div>
      </Sheet>}

      {confirmOut && <Sheet onClose={() => setConfirmOut(false)}>
        <div style={{ padding: "10px 20px 22px" }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Se déconnecter ?</div>
          <div className="t-sub" style={{ fontSize: 14, marginBottom: 18 }}>Vous pourrez toujours parcourir les boutiques.</div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="t-cta ghost" onClick={() => setConfirmOut(false)}>Annuler</button>
            <button className="t-cta center" style={{ background: "#DC2626" }} onClick={() => { setConfirmOut(false); onLogout(); }}>Se déconnecter</button>
          </div>
        </div>
      </Sheet>}
    </div>
  );
}
