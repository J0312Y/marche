import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Icon from "../../components/Icon";
import GuestBlockedView from "../../components/GuestBlockedView";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";
import { USER_SUBSCRIPTIONS, FREQUENCY_LABELS } from "../../data/subscriptions";
import SuccessAnimation from "../../components/SuccessAnimation";

function SubscriptionsScr({ onBack, go }) {
  const { isGuest, exitGuestToLogin } = useApp();
  if (isGuest) return (<GuestBlockedView
      icon="repeat"
      title="Vos abonnements simplifiés"
      subtitle="Connectez-vous pour gérer vos abonnements et livraisons récurrentes."
      benefits={["Livraisons automatiques", "Économies garanties", "Modification facile"]}
      accent="#10B981"
      onGoHome={()=>onBack&&onBack()}
    />);

  const [subs, setSubs] = useState(USER_SUBSCRIPTIONS);
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [action, setAction] = useState(null);

  const toggleStatus = (id) => {
    setSubs(p => p.map(s => s.id === id ? { ...s, status: s.status === "active" ? "paused" : "active" } : s));
    const newStatus = subs.find(s => s.id === id)?.status === "active" ? "paused" : "active";
    toast.success(newStatus === "active" ? "Abonnement réactivé" : "⏸️ Abonnement en pause");
    setShowActionsFor(null);
  };

  const skipNext = (id) => {
    toast.info("⏭️ Prochaine livraison reportée d'une semaine");
    setShowActionsFor(null);
  };

  const deliverNow = (id) => {
    setAction("delivered");
    setTimeout(() => setAction(null), 2000);
    setShowActionsFor(null);
  };

  const cancel = (id) => {
    if (window.confirm("Supprimer cet abonnement ?")) {
      setSubs(p => p.filter(s => s.id !== id));
      toast.success("Abonnement supprimé");
      setShowActionsFor(null);
    }
  };

  if (action === "delivered") return <SuccessAnimation title="Commande ajoutée !" subtitle="Livraison prévue dans la journée" duration={2000} onDone={() => setAction(null)} />;

  const activeSubs = subs.filter(s => s.status === "active");
  const totalMonthly = activeSubs.reduce((sum, s) => {
    const mult = s.frequency === "weekly" ? 4 : s.frequency === "biweekly" ? 2 : s.frequency === "monthly" ? 1 : 30;
    return sum + s.total * mult;
  }, 0);

  return (
    <div className="scr" style={{ paddingBottom: 100 }}>
      <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={()=>onBack&&onBack()} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", cursor: "pointer", fontSize: 14 }}>←</button>
        <h2 style={{ fontSize: 18, fontWeight: 800, flex: 1 }}>Mes abonnements</h2>
      </div>

      {/* Stats card */}
      <div style={{ margin: "0 16px 14px", padding: 18, background: "linear-gradient(135deg,#1F2937,#374151)", borderRadius: 18, color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>BUDGET MENSUEL</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{fmt(totalMonthly)}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{activeSubs.length} abonnement{activeSubs.length > 1 ? "s" : ""} actif{activeSubs.length > 1 ? "s" : ""}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>ÉCONOMISÉ</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#10B981" }}>{fmt(subs.reduce((s, x) => s + (x.totalSaved || 0), 0))}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>depuis le début</div>
          </div>
        </div>
      </div>

      {/* Subscriptions list */}
      <div style={{ padding: "0 16px" }}>
        {subs.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 12, animation: "emptyBounce 2s ease-in-out infinite" }}><Icon name="package" size={18}/></div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Aucun abonnement</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Créez un abonnement depuis une commande passée pour économiser du temps</div>
          </div>
        ) : (
          subs.map(s => {
            const freq = FREQUENCY_LABELS[s.frequency];
            const isPaused = s.status === "paused";
            return (
              <div key={s.id} style={{ marginBottom: 10, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", opacity: isPaused ? .7 : 1 }}>
                <div style={{ padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{s.vendorIcon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{s.vendor}</div>
                    </div>
                    <button onClick={() => setShowActionsFor(showActionsFor === s.id ? null : s.id)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)", background: "var(--light)", cursor: "pointer", fontSize: 15 }}>⋯</button>
                  </div>

                  {/* Items preview */}
                  <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
                    {s.items.slice(0, 3).map((it, i) => (
                      <span key={i} style={{ padding: "3px 8px", borderRadius: 6, background: "var(--light)", fontSize: 11 }}>{it.img} {it.name} ×{it.qty}</span>
                    ))}
                    {s.items.length > 3 && <span style={{ padding: "3px 8px", borderRadius: 6, background: "var(--light)", fontSize: 11, color: "var(--muted)" }}>+{s.items.length - 3}</span>}
                  </div>

                  {/* Info grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "10px 0", borderTop: "1px solid var(--border)" }}>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--muted)", fontWeight: 700, letterSpacing: .5 }}>FRÉQUENCE</div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}><Icon name={freq.icon} size={20}/> {freq.short}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--muted)", fontWeight: 700, letterSpacing: .5 }}>MONTANT</div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2, color: "#F97316" }}>{fmt(s.total)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--muted)", fontWeight: 700, letterSpacing: .5 }}>PROCHAINE</div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{isPaused ? "⏸️ En pause" : ` ${s.nextDate}`}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, color: "var(--muted)", fontWeight: 700, letterSpacing: .5 }}>LIVRAISONS</div>
                      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{s.totalOrders} fois</div>
                    </div>
                  </div>

                  {/* Actions menu */}
                  {showActionsFor === s.id && (
                    <div style={{ marginTop: 10, padding: 10, background: "var(--light)", borderRadius: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <button onClick={() => toggleStatus(s.id)} style={{ padding: 10, borderRadius: 8, border: "none", background: "var(--card)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{isPaused ? "▶️ Réactiver" : "⏸️ Mettre en pause"}</button>
                      <button onClick={() => skipNext(s.id)} style={{ padding: 10, borderRadius: 8, border: "none", background: "var(--card)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>⏭️ Sauter prochaine</button>
                      <button onClick={() => deliverNow(s.id)} style={{ padding: 10, borderRadius: 8, border: "none", background: "rgba(16,185,129,0.1)", color: "#10B981", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}><Icon name="rocket" size={16}/>{" "}Livrer maintenant</button>
                      <button onClick={() => cancel(s.id)} style={{ padding: 10, borderRadius: 8, border: "none", background: "rgba(239,68,68,0.08)", color: "#EF4444", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>️ Supprimer</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* CTA */}
        <div onClick={() => { toast.info("Créez un abonnement depuis une commande passée"); go("orders"); }} style={{ marginTop: 14, padding: 16, background: "rgba(249,115,22,0.04)", border: "2px dashed rgba(249,115,22,0.2)", borderRadius: 14, textAlign: "center", cursor: "pointer" }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}></div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#F97316" }}>Créer un nouvel abonnement</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Depuis vos commandes passées</div>
        </div>

        {/* Benefits */}
        <div style={{ margin: "20px 0 0", padding: 14, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}><Icon name="sparkle" size={16}/>{" "}Avantages</div>
          {[
            { icon: "", t: "Économisez 5-10%", d: "Réduction automatique sur les abonnements" },
            { icon: "", t: "Livraison gratuite", d: "À partir de 3 livraisons consécutives" },
            { icon: "⏰", t: "Gain de temps", d: "Plus besoin de recommander chaque semaine" },
            { icon: "", t: "Bonus fidélité", d: "+2× Lamuka Points sur les abonnements" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 20 }}><Icon name={b.icon} size={20}/></div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{b.t}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{b.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionsScr;
