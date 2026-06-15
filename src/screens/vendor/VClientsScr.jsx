import { useState, useMemo } from "react";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";

// ═══════════════════════════════════════════════════════
//  MOCK CLIENTS DATA
// ═══════════════════════════════════════════════════════

const CLIENTS = [
  { id: 1, name: "David Tsaty", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", orders: 127, total: 1200000, lastOrder: 2, zone: "Bacongo", since: "Janv 2024", segment: "vip", rank: 1 },
  { id: 2, name: "Marie Ngoma", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", orders: 84, total: 480000, lastOrder: 5, zone: "Poto-Poto", since: "Mars 2024", segment: "fan" },
  { id: 3, name: "Jean-Paul Nkaya", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face", orders: 62, total: 350000, lastOrder: 3, zone: "Moungali", since: "Mai 2025", segment: "regular" },
  { id: 4, name: "Patrick Mbemba", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face", orders: 38, total: 215000, lastOrder: 8, zone: "Bacongo", since: "Juil 2025", segment: "regular" },
  { id: 5, name: "Grace Mouanda", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", orders: 24, total: 138000, lastOrder: 12, zone: "Talangaï", since: "Sept 2025", segment: "regular" },
  { id: 6, name: "Celine Nzaba", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face", orders: 18, total: 92000, lastOrder: 45, zone: "Moungali", since: "Nov 2024", segment: "inactive" },
  { id: 7, name: "Alain Mboumba", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face", orders: 12, total: 64000, lastOrder: 58, zone: "Ouenzé", since: "Août 2024", segment: "inactive" },
  { id: 8, name: "Jeanne Okamba", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face", orders: 3, total: 18000, lastOrder: 1, zone: "Bacongo", since: "Cette semaine", segment: "new" },
  { id: 9, name: "Paul Nkaya", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face", orders: 2, total: 14000, lastOrder: 0, zone: "Mfilou", since: "Cette semaine", segment: "new" },
  { id: 10, name: "Cecile Mbongo", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face", orders: 1, total: 6500, lastOrder: 2, zone: "Talangaï", since: "Il y a 3 jours", segment: "new" },
];

const SEGMENT_COLORS = {
  vip:      { bg: "#F59E0B", bgLight: "rgba(245,158,11,0.1)", text: "#B45309", label: "VIP", icon: "crown" },
  fan:      { bg: "#EF4444", bgLight: "rgba(239,68,68,0.1)", text: "#B91C1C", label: "FAN", icon: "heart" },
  regular:  { bg: "#3B82F6", bgLight: "rgba(59,130,246,0.1)", text: "#1D4ED8", label: "RÉGULIER", icon: "star_full" },
  inactive: { bg: "#EF4444", bgLight: "rgba(239,68,68,0.1)", text: "#DC2626", label: "INACTIF", icon: "clock" },
  new:      { bg: "#10B981", bgLight: "rgba(16,185,129,0.1)", text: "#047857", label: "NOUVEAU", icon: "sparkle" },
};

const ZONES = [
  { name: "Bacongo", count: 4247, pct: 34, color: "#F97316", gradient: "linear-gradient(90deg, #F97316, #EA580C)" },
  { name: "Poto-Poto", count: 3102, pct: 25, color: "#3B82F6", gradient: "linear-gradient(90deg, #3B82F6, #2563EB)" },
  { name: "Talangaï", count: 2641, pct: 22, color: "#8B5CF6", gradient: "linear-gradient(90deg, #8B5CF6, #7C3AED)" },
  { name: "Moungali", count: 2410, pct: 19, color: "#10B981", gradient: "linear-gradient(90deg, #10B981, #059669)" },
];

// ═══════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════

function VClientsScr({ onBack, go }) {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return CLIENTS;
    return CLIENTS.filter(c => c.segment === filter);
  }, [filter]);

  return (
    <div className="scr" style={{ background: "#F9FAFB", minHeight: "100vh", paddingBottom: 80 }}>
      
      {/* ═══════ HEADER ═══════ */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#fff",
        borderBottom: "0.5px solid var(--border)",
        padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button onClick={() => onBack && onBack()} style={{
          width: 36, height: 36, borderRadius: 10,
          border: "1px solid var(--border)", background: "var(--card)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="arrow_left" size={16} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3, color: "var(--text)" }}>Mes clients</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>Gestion et fidélisation</div>
        </div>
        <button onClick={() => toast.success("Export en cours...")} style={{
          width: 36, height: 36, borderRadius: 10,
          border: "1px solid var(--border)", background: "var(--card)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="document" size={16} />
        </button>
      </div>

      <div style={{ padding: 14 }}>

        {/* ═══════ KPI CARDS ═══════ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { value: "12 400", label: "Abonnés total", icon: "user", color: "#F97316", delta: "+24%" },
            { value: "247", label: "Nouveaux cette sem.", icon: "plus", color: "#10B981", delta: "+247" },
            { value: "3 421", label: "Clients actifs (30j)", icon: "package", color: "#3B82F6", delta: "+18%" },
            { value: "28K F", label: "Panier moyen / client", icon: "coin", color: "#F59E0B", delta: "+12%" },
          ].map((k, i) => (
            <div key={i} style={{
              background: "var(--card)", padding: 12, borderRadius: 14,
              border: "0.5px solid var(--border)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 9,
                  background: `${k.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name={k.icon} size={14} color={k.color} />
                </div>
                <span style={{
                  fontSize: 9, padding: "2px 6px",
                  background: "rgba(16,185,129,0.1)", color: "#047857",
                  borderRadius: 4, fontWeight: 700,
                }}>{k.delta}</span>
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* ═══════ QUICK ACTIONS ═══════ */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 8 }}>ACTIONS RAPIDES</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", scrollbarWidth: "none" }} className="hide-scroll">
          {[
            { label: "Broadcast", icon: "mail", color: "#F97316", action: () => toast.success("Composer message broadcast") },
            { label: "Offrir promo", icon: "gift", color: "#10B981", action: () => toast.success("Créer une promo exclusive") },
            { label: "Exporter", icon: "document", color: "#3B82F6", action: () => toast.success("Export CSV en cours...") },
            { label: "Segments", icon: "target", color: "#8B5CF6", action: () => toast.success("Gérer les segments clients") },
          ].map((a, i) => (
            <button key={i} onClick={a.action} style={{
              flexShrink: 0, padding: "10px 12px", borderRadius: 10,
              border: "0.5px solid var(--border)", background: "var(--card)",
              color: "var(--text)", fontSize: 11, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 5,
            }}>
              <Icon name={a.icon} size={13} color={a.color} />
              {a.label}
            </button>
          ))}
        </div>

        {/* ═══════ FILTER TABS ═══════ */}
        <div style={{
          display: "flex", gap: 4,
          background: "#F3F4F6", padding: 3, borderRadius: 10,
          marginBottom: 14,
        }}>
          {[
            { id: "all", label: "Tous", count: CLIENTS.length },
            { id: "vip", label: "VIP", count: CLIENTS.filter(c => c.segment === "vip").length },
            { id: "new", label: "Nouveaux", count: CLIENTS.filter(c => c.segment === "new").length },
            { id: "inactive", label: "Inactifs", count: CLIENTS.filter(c => c.segment === "inactive").length },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              flex: 1, padding: "7px 0", borderRadius: 8,
              border: "none",
              background: filter === t.id ? "var(--card)" : "transparent",
              color: filter === t.id ? "var(--text)" : "var(--muted)",
              fontSize: 11, fontWeight: filter === t.id ? 700 : 600,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: filter === t.id ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
            }}>
              {t.label} {t.count > 0 && <span style={{ opacity: 0.6, fontWeight: 500 }}>({t.count})</span>}
            </button>
          ))}
        </div>

        {/* ═══════ CLIENT LIST ═══════ */}
        <div style={{
          background: "var(--card)", borderRadius: 14,
          border: "0.5px solid var(--border)",
          overflow: "hidden", marginBottom: 16,
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 30, textAlign: "center" }}>
              <div style={{ display: "inline-flex", padding: 14, borderRadius: 12, background: "var(--light)", color: "var(--muted)", marginBottom: 10 }}>
                <Icon name="user" size={22} color="var(--muted)" />
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>Aucun client dans cette catégorie</div>
            </div>
          ) : filtered.map((c, i, arr) => {
            const seg = SEGMENT_COLORS[c.segment];
            const isInactive = c.segment === "inactive";
            
            return (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 12px",
                borderBottom: i < arr.length - 1 ? "0.5px solid var(--border)" : "none",
              }}>
                {/* Avatar with segment badge */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: "50%",
                    overflow: "hidden",
                    border: `2px solid ${seg.bg}`,
                  }}>
                    <img src={c.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: isInactive ? "grayscale(0.5)" : "none" }}/>
                  </div>
                  <div style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 18, height: 18, borderRadius: "50%",
                    background: seg.bg, border: "2px solid var(--card)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={seg.icon} size={9} color="#fff" />
                  </div>
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{c.name}</div>
                    {c.rank && (
                      <span style={{
                        fontSize: 9, padding: "1px 5px",
                        background: "rgba(245,158,11,0.15)", color: "#B45309",
                        borderRadius: 4, fontWeight: 700,
                      }}>#{c.rank}</span>
                    )}
                  </div>
                  {isInactive ? (
                    <div style={{ fontSize: 10, color: "#DC2626", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="clock" size={10} color="#DC2626" />
                      Inactif depuis {c.lastOrder} jours
                    </div>
                  ) : (
                    <div style={{ fontSize: 10, color: c.segment === "vip" ? "#B45309" : "var(--muted)", marginTop: 2 }}>
                      {c.orders} commande{c.orders > 1 ? "s" : ""} · {fmt(c.total)}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                {isInactive ? (
                  <button onClick={() => toast.success(`Relance envoyée à ${c.name}`)} style={{
                    padding: "6px 11px", borderRadius: 8,
                    border: "none", background: "#F97316",
                    color: "#fff", fontSize: 10, fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>Relancer</button>
                ) : (
                  <>
                    <button onClick={() => toast.success(`Message à ${c.name}`)} style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: "0.5px solid var(--border)", background: "var(--card)",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name="chat" size={13} color="var(--muted)" />
                    </button>
                    <button onClick={() => toast.success(`Promo offerte à ${c.name}`)} style={{
                      width: 30, height: 30, borderRadius: 8,
                      border: "0.5px solid var(--border)", background: "var(--card)",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon name="gift" size={13} color="var(--muted)" />
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* ═══════ GEOGRAPHIC ═══════ */}
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 8 }}>RÉPARTITION GÉOGRAPHIQUE</div>
        <div style={{
          background: "var(--card)", borderRadius: 14,
          border: "0.5px solid var(--border)",
          padding: 14, marginBottom: 16,
        }}>
          {ZONES.map((z, i) => (
            <div key={z.name} style={{ marginBottom: i < ZONES.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--text)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="location" size={11} color={z.color} />
                  {z.name}
                </span>
                <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{z.count.toLocaleString("fr-FR")} ({z.pct}%)</span>
              </div>
              <div style={{ height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                <div style={{
                  width: z.pct + "%", height: "100%",
                  background: z.gradient,
                  borderRadius: 3,
                  transition: "width .4s ease",
                }}/>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════ INSIGHTS ═══════ */}
        <div style={{
          background: "linear-gradient(135deg, #FFF7ED 0%, #fff 100%)",
          border: "1px solid rgba(249,115,22,0.15)",
          borderRadius: 14, padding: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="sparkle" size={14} color="#F97316"/>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>Insights IA</div>
          </div>
          <div style={{ fontSize: 11, color: "var(--text)", lineHeight: 1.6 }}>
            <div style={{ marginBottom: 6 }}>• <b>2 clients VIP</b> n'ont pas commandé depuis 15 jours — envoyez-leur une attention</div>
            <div style={{ marginBottom: 6 }}>• <b>Bacongo</b> représente 34% de votre clientèle — ciblez vos promos ici</div>
            <div>• <b>247 nouveaux abonnés</b> cette semaine — accueillez-les avec un message de bienvenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VClientsScr;
