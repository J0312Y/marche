import { useState } from "react";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";
import Icon from "../../components/Icon";

function ReferralScr({ onBack }) {
  const [referralCode] = useState("JOELDY2026");
  const [stats] = useState({
    invited: 7,
    joined: 4,
    earned: 4000,
  });

  const shareUrl = `https://lamuka.cg/r/${referralCode}`;

  const shareToWhatsApp = () => {
    const msg = encodeURIComponent(
      `Salut ! Rejoins-moi sur Lamuka Market — le marketplace de Brazza pour commander tout ce qu'on aime \n\nUtilise mon code ${referralCode} et reçois 500 F en bonus !\n\n${shareUrl}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    toast.success("Lien copié !");
  };

  return (
    <div className="scr" style={{ paddingBottom: 80 }}>
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 14 }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, flex: 1 }}>Parrainage</h2>
      </div>

      {/* Hero */}
      <div style={{ margin: "0 16px 14px", padding: 24, background: "linear-gradient(135deg,#F97316,#EC4899)", borderRadius: 20, color: "#fff", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}><Icon name="gift" size={18}/></div>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Invitez vos amis</div>
        <div style={{ fontSize: 13, opacity: .9, marginBottom: 16 }}>Vous recevez <b>1 000 F</b>, ils reçoivent <b>500 F</b></div>

        {/* Referral code box */}
        <div onClick={copyLink} style={{ padding: 14, background: "rgba(0,0,0,.2)", borderRadius: 12, marginBottom: 12, cursor: "pointer", border: "2px dashed rgba(255,255,255,.3)" }}>
          <div style={{ fontSize: 10, opacity: .7, marginBottom: 4 }}>VOTRE CODE</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>{referralCode}</div>
          <div style={{ fontSize: 10, opacity: .7, marginTop: 4 }}>Tap pour copier</div>
        </div>

        <button onClick={shareToWhatsApp} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "#25D366", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="#fff"><path d="M16 2C8.27 2 2 8.27 2 16c0 2.78.81 5.37 2.2 7.55L2 30l6.6-2.16C10.74 29.21 13.3 30 16 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm7.13 17.1c-.4-.2-2.32-1.14-2.68-1.27-.36-.13-.62-.2-.88.2-.26.4-1.03 1.27-1.27 1.53-.23.26-.46.3-.86.1-.4-.2-1.67-.62-3.18-1.96-1.18-1.05-1.97-2.35-2.2-2.75-.23-.4-.02-.62.17-.82.18-.18.4-.46.6-.7.2-.23.26-.4.4-.66.13-.26.06-.5-.03-.7-.1-.2-.88-2.12-1.21-2.91-.32-.76-.64-.66-.88-.67h-.75c-.26 0-.66.1-1 .5-.34.4-1.31 1.28-1.31 3.11 0 1.83 1.34 3.6 1.53 3.86.2.26 2.64 4.03 6.4 5.65.9.39 1.6.62 2.14.8.9.29 1.71.25 2.36.15.72-.11 2.32-.95 2.65-1.87.32-.92.32-1.7.23-1.87-.1-.17-.36-.27-.76-.47z"/></svg> Partager sur WhatsApp
        </button>
      </div>

      {/* Stats */}
      <div style={{ margin: "0 16px 14px", padding: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}><Icon name="chart_pie" size={16}/>{" "}Mon parrainage</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
          <div style={{ textAlign: "center", padding: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#F97316" }}>{stats.invited}</div>
            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>Invités</div>
          </div>
          <div style={{ textAlign: "center", padding: 10, borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#10B981" }}>{stats.joined}</div>
            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>Inscrits</div>
          </div>
          <div style={{ textAlign: "center", padding: 10 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#3B82F6" }}>{fmt(stats.earned)}</div>
            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600 }}>Gagnés</div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ margin: "0 16px 14px", padding: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}><Icon name="info" size={16}/>{" "}Comment ça marche</div>
        {[
          { n: 1, t: "Partagez votre code", d: "Envoyez à vos amis via WhatsApp, SMS ou tout autre moyen" },
          { n: 2, t: "Votre ami s'inscrit", d: "Il utilise votre code pendant l'inscription" },
          { n: 3, t: "Vous gagnez 1 000 F", d: "Crédité dans votre wallet dès sa première commande" },
        ].map(s => (
          <div key={s.n} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: s.n < 3 ? "1px solid var(--border)" : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F97316", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{s.n}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{s.t}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent referrals (mock) */}
      <div style={{ margin: "0 16px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, padding: "0 4px" }}> Amis parrainés</div>
        {[
          { name: "Marie K.", date: "il y a 3 jours", status: "joined", reward: 1000 },
          { name: "Patrick M.", date: "il y a 1 semaine", status: "joined", reward: 1000 },
          { name: "Bruno T.", date: "il y a 2 semaines", status: "joined", reward: 1000 },
          { name: "Sarah N.", date: "il y a 1 mois", status: "joined", reward: 1000 },
          { name: "Jean L.", date: "il y a 1 mois", status: "pending", reward: 0 },
        ].map((r, i) => (
          <div key={i} style={{ padding: 12, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{r.name[0]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>{r.date}</div>
            </div>
            {r.status === "joined" ? (
              <div style={{ fontSize: 13, fontWeight: 700, color: "#10B981" }}>+{fmt(r.reward)}</div>
            ) : (
              <div style={{ fontSize: 10, color: "var(--muted)", fontStyle: "italic" }}>En attente</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReferralScr;
