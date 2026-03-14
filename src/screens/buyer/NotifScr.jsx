import { useState } from "react";
import { useLoad } from "../../hooks";
import { social } from "../../services";
import Loading from "../../components/Loading";
import toast from "../../utils/toast";

const DETAILS = {
  n1: { full: "Votre commande #LMK-0214 est en cours de livraison.\n\nLivreur : Patrick Moukala\nVéhicule : 🛵 Honda PCX\nEstimation : 15-20 min\n\nArticles :\n• 📱 Galaxy A54 × 1\n• 🥬 Panier Bio × 3\n\nTotal : 231 500 FCFA", action: "tracking", actionLabel: "📍 Suivre la livraison" },
  n2: { full: "Profitez des soldes de février !\n\n🏪 Tech Congo : -15% sur toute l'électronique\n👔 Mode Afrique : -20% sur les vêtements\n🧁 Pâtisserie La Congolaise : -10% sur les gâteaux\n\nOffre valable jusqu'au 28 Février 2026.", action: "flash", actionLabel: "🛍️ Voir les offres" },
  n3: { full: "Commande #LMK-0210 livrée avec succès !\n\nArticle : 👜 Sac à Main Cuir\nVendeur : Mode Afrique\nLivré le : 10 Fév 2026 à 14h32\nMontant : 42 000 FCFA\n\nSatisfait ? Laissez un avis pour aider les autres acheteurs.", action: "orders", actionLabel: "📦 Voir mes commandes" },
  n4: { full: "Mode Afrique vous a répondu :\n\n\"Merci pour votre commande ! Le sac en cuir est disponible en marron et noir. N'hésitez pas à commander.\"", action: "chatVendor", actionLabel: "💬 Voir la conversation" },
  n5: { full: "Vous avez reçu votre Sac à Main Cuir il y a une semaine.\n\nQu'en pensez-vous ? Votre avis aide les autres acheteurs et le vendeur à s'améliorer.\n\n⭐ Notez de 1 à 5 étoiles\n📸 Ajoutez des photos (optionnel)",
    action: "reviews",
    actionData: {id:"p8",name:"Sac à Main Cuir",price:42000,img:"👜",vendor:"Mode Afrique",va:"👔",rating:4.7,reviews:51,tags:["Artisanal"],type:"boutique",photo:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop"},
    actionLabel: "✏️ Laisser un avis" },
};

function NotifScr({ onBack, go }) {
  const { data, loading } = useLoad(() => social.getNotifications());
  const raw = data?.notifications || data || [];
  const [notifs, setNotifs] = useState(null);
  const [expanded, setExpanded] = useState(null);

  // Init local state from loaded data
  const items = notifs || raw;
  if (!notifs && raw.length > 0 && items === raw) {
    // Will trigger on next interaction
  }

  const markRead = (id) => {
    const updated = (notifs || raw).map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
  };

  const markAllRead = () => {
    setNotifs((notifs || raw).map(n => ({ ...n, read: true })));toast.success('Toutes les notifications lues ✅');
  };

  const handleClick = (n) => {
    if (!n.read) markRead(n.id);
    setExpanded(expanded === n.id ? null : n.id);
  };

  const handleAction = (n) => {
    const d = DETAILS[n.id];
    if (d?.action && go) go(d.action, d.actionData || undefined);
  };

  const unreadCount = items.filter(n => !n.read).length;

  return (
    <div className="scr">
      <div className="appbar">
        <button onClick={onBack}>←</button>
        <h2>Notifications {unreadCount > 0 && <span style={{ fontSize: 13, color: "#6366F1", fontWeight: 600 }}>({unreadCount})</span>}</h2>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ fontSize: 11, color: "#6366F1", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
            Tout lire
          </button>
        )}
      </div>

      {loading ? <Loading /> : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🔔</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Aucune notification</h3>
          <p style={{ fontSize: 13, color: "#908C82" }}>Vous serez notifié des mises à jour de vos commandes</p>
        </div>
      ) : (
        <div style={{ paddingBottom: 80 }}>
          {/* Today */}
          {items.filter(n => n.time.includes("min") || n.time.includes("h")).length > 0 && (
            <div style={{ padding: "10px 20px 4px", fontSize: 12, fontWeight: 700, color: "#908C82" }}>Aujourd'hui</div>
          )}

          {items.map(n => {
            const isOpen = expanded === n.id;
            const detail = DETAILS[n.id];
            return (
              <div key={n.id} onClick={() => handleClick(n)} style={{
                padding: "14px 20px", borderBottom: "1px solid #F5F4F1", cursor: "pointer",
                background: !n.read ? "rgba(99,102,241,0.03)" : "transparent",
                transition: "background .15s",
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  {/* Unread dot */}
                  {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366F1", flexShrink: 0, marginTop: 8 }} />}

                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: !n.read ? "rgba(99,102,241,0.08)" : "#F5F4F1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0,
                  }}>{n.icon}</div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h4 style={{ fontSize: 14, fontWeight: !n.read ? 700 : 600, color: "#191815", margin: 0 }}>{n.title}</h4>
                      <span style={{ fontSize: 10, color: "#C4C1BA", flexShrink: 0, marginLeft: 8 }}>
                        {isOpen ? "▾" : "›"}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "#5E5B53", margin: "3px 0 0", lineHeight: 1.4 }}>{n.desc}</p>
                    <div style={{ fontSize: 11, color: "#C4C1BA", marginTop: 4 }}>{n.time}</div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && detail && (
                  <div style={{
                    marginTop: 12, marginLeft: !n.read ? 20 : 0, padding: 14,
                    background: "#F9F8F6", borderRadius: 14, border: "1px solid #E8E6E1",
                  }}>
                    <div style={{ fontSize: 13, color: "#5E5B53", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                      {detail.full}
                    </div>
                    {detail.action && go && (
                      <button onClick={(e) => { e.stopPropagation(); handleAction(n); }} style={{
                        marginTop: 12, width: "100%", padding: "11px 0", borderRadius: 12,
                        border: "none", background: "#6366F1", color: "#fff",
                        fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      }}>
                        {detail.actionLabel}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NotifScr;
