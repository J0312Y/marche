import { useState, useMemo, useEffect } from "react";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";

// ═══════════════════════════════════════════════════════
//  MOCK CLIENTS DATA
// ═══════════════════════════════════════════════════════

const CLIENTS = [
  { id: 1, name: "David Tsaty", phone: "+242 064 12 34 56", email: "david.tsaty@gmail.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", orders: 127, total: 1200000, lastOrder: 2, zone: "Bacongo", since: "Janv 2024", segment: "vip", rank: 1 },
  { id: 2, name: "Marie Ngoma", phone: "+242 055 22 33 44", email: "m.ngoma@yahoo.fr", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", orders: 84, total: 480000, lastOrder: 5, zone: "Poto-Poto", since: "Mars 2024", segment: "fan" },
  { id: 3, name: "Jean-Paul Nkaya", phone: "+242 064 55 66 77", email: "jp.nkaya@gmail.com", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face", orders: 62, total: 350000, lastOrder: 3, zone: "Moungali", since: "Mai 2025", segment: "regular" },
  { id: 4, name: "Patrick Mbemba", phone: "+242 055 88 99 00", email: "patrick.m@hotmail.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face", orders: 38, total: 215000, lastOrder: 8, zone: "Bacongo", since: "Juil 2025", segment: "regular" },
  { id: 5, name: "Grace Mouanda", phone: "+242 064 11 22 33", email: "grace.m@gmail.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face", orders: 24, total: 138000, lastOrder: 12, zone: "Talangaï", since: "Sept 2025", segment: "regular" },
  { id: 6, name: "Celine Nzaba", phone: "+242 055 44 55 66", email: "celine.nzaba@gmail.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face", orders: 18, total: 92000, lastOrder: 45, zone: "Moungali", since: "Nov 2024", segment: "inactive" },
  { id: 7, name: "Alain Mboumba", phone: "+242 064 77 88 99", email: "alain.mboumba@yahoo.fr", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face", orders: 12, total: 64000, lastOrder: 58, zone: "Ouenzé", since: "Août 2024", segment: "inactive" },
  { id: 8, name: "Jeanne Okamba", phone: "+242 055 12 34 56", email: "jeanne.o@gmail.com", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face", orders: 3, total: 18000, lastOrder: 1, zone: "Bacongo", since: "Cette semaine", segment: "new" },
  { id: 9, name: "Paul Nkaya", phone: "+242 064 99 88 77", email: "paul.nkaya@gmail.com", avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face", orders: 2, total: 14000, lastOrder: 0, zone: "Mfilou", since: "Cette semaine", segment: "new" },
  { id: 10, name: "Cecile Mbongo", phone: "+242 055 66 77 88", email: "cecile.mbongo@yahoo.fr", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face", orders: 1, total: 6500, lastOrder: 2, zone: "Talangaï", since: "Il y a 3 jours", segment: "new" },
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
//  LOCAL STORAGE HELPERS (real persistence)
// ═══════════════════════════════════════════════════════

const LS_MESSAGES = "vendor-broadcasts";
const LS_PROMOS = "vendor-promos";

const loadFromLS = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
};
const saveToLS = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
};

// ═══════════════════════════════════════════════════════
//  CSV EXPORT — REAL DOWNLOAD
// ═══════════════════════════════════════════════════════

const exportClientsCSV = (clients) => {
  const headers = ["Nom", "Téléphone", "Email", "Zone", "Segment", "Commandes", "Total FCFA", "Inscrit", "Dernière commande (jours)"];
  const rows = clients.map(c => [
    c.name, c.phone, c.email, c.zone,
    SEGMENT_COLORS[c.segment]?.label || c.segment,
    c.orders, c.total, c.since, c.lastOrder,
  ]);
  const csv = [
    headers.join(","),
    ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
  ].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `clients-mode-afrique-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// ═══════════════════════════════════════════════════════
//  MODAL WRAPPER
// ═══════════════════════════════════════════════════════

const CLOSE_BTN = {
  width: 30, height: 30, borderRadius: 8,
  border: "1px solid var(--border)", background: "var(--card)",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  flexShrink: 0,
};

function Modal({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 200,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      animation: "fadeInFast .2s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 500,
        background: "var(--card)",
        borderRadius: "20px 20px 0 0",
        maxHeight: "90vh", overflowY: "auto",
        animation: "slideUp .25s ease",
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border)", margin: "12px auto 0" }}/>
        {children}
      </div>
      <style>{`@keyframes slideUp {from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}

function EmptyState({ icon, label }) {
  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <div style={{ display: "inline-flex", padding: 14, borderRadius: 12, background: "var(--light)", marginBottom: 10 }}>
        <Icon name={icon} size={22} color="var(--muted)"/>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  BROADCAST MODAL
// ═══════════════════════════════════════════════════════

function BroadcastModal({ onClose, onSent, clients }) {
  const [target, setTarget] = useState("all");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const targetCount = useMemo(() => {
    if (target === "all") return clients.length;
    return clients.filter(c => c.segment === target).length;
  }, [target, clients]);

  const send = () => {
    if (!message.trim()) return toast.error("Veuillez écrire un message");
    setSending(true);
    setTimeout(() => {
      const history = loadFromLS(LS_MESSAGES);
      const newBroadcast = {
        id: Date.now(),
        message: message.trim(),
        target,
        targetLabel: target === "all" ? "Tous" : SEGMENT_COLORS[target]?.label || target,
        recipients: targetCount,
        date: new Date().toISOString(),
      };
      saveToLS(LS_MESSAGES, [newBroadcast, ...history]);
      onSent(newBroadcast);
      setSending(false);
      onClose();
    }, 800);
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "20px 20px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>Broadcast</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Envoyer un message à plusieurs clients</div>
          </div>
          <button onClick={onClose} style={CLOSE_BTN}><Icon name="close" size={14}/></button>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 6 }}>DESTINATAIRES</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
          {[
            { id: "all", label: "Tous", count: clients.length },
            { id: "vip", label: "VIP", count: clients.filter(c => c.segment === "vip").length },
            { id: "new", label: "Nouveaux", count: clients.filter(c => c.segment === "new").length },
            { id: "inactive", label: "Inactifs", count: clients.filter(c => c.segment === "inactive").length },
          ].map(t => (
            <button key={t.id} onClick={() => setTarget(t.id)} style={{
              padding: "10px 12px", borderRadius: 10,
              border: target === t.id ? "1.5px solid #F97316" : "1px solid var(--border)",
              background: target === t.id ? "rgba(249,115,22,0.06)" : "var(--card)",
              color: target === t.id ? "#F97316" : "var(--text)",
              fontSize: 11, fontWeight: target === t.id ? 700 : 600,
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}>
              <div>{t.label}</div>
              <div style={{ fontSize: 9, opacity: 0.7, fontWeight: 500 }}>{t.count} client{t.count > 1 ? "s" : ""}</div>
            </button>
          ))}
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 6 }}>MESSAGE</div>
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Bonjour ! Découvrez nos nouvelles collections..." maxLength={500} style={{
          width: "100%", minHeight: 110, padding: 12,
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)", color: "var(--text)",
          fontSize: 13, fontFamily: "inherit", resize: "none",
          outline: "none", boxSizing: "border-box",
        }}/>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, marginBottom: 14 }}>
          <div style={{ fontSize: 10, color: "var(--muted)" }}>{targetCount} destinataire{targetCount > 1 ? "s" : ""}</div>
          <div style={{ fontSize: 10, color: message.length > 450 ? "#F97316" : "var(--muted)" }}>{message.length}/500</div>
        </div>

        <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", marginBottom: 14, display: "flex", alignItems: "flex-start", gap: 8 }}>
          <Icon name="info" size={14} color="#3B82F6"/>
          <div style={{ fontSize: 11, color: "#1D4ED8", lineHeight: 1.5 }}>
            Les messages sont envoyés via notification in-app et SMS. Coût estimé : <b>{targetCount * 25} FCFA</b>
          </div>
        </div>

        <button onClick={send} disabled={sending || !message.trim()} style={{
          width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
          background: sending || !message.trim() ? "#E5E7EB" : "#F97316",
          color: sending || !message.trim() ? "var(--muted)" : "#fff",
          fontSize: 13, fontWeight: 700,
          cursor: sending || !message.trim() ? "not-allowed" : "pointer",
          fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {sending ? <><div className="spinner" style={{ width: 14, height: 14 }}/>Envoi...</> : <><Icon name="mail" size={14} color="#fff"/>Envoyer à {targetCount} client{targetCount > 1 ? "s" : ""}</>}
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════
//  PROMO MODAL
// ═══════════════════════════════════════════════════════

function PromoModal({ onClose, onSent, clients, singleClient }) {
  const [code, setCode] = useState(singleClient ? `${singleClient.name.split(" ")[0].toUpperCase()}10` : "PROMO" + Math.floor(Math.random() * 9999));
  const [discount, setDiscount] = useState(15);
  const [validity, setValidity] = useState(30);
  const [target, setTarget] = useState(singleClient ? "single" : "all");
  const [sending, setSending] = useState(false);

  const targetCount = useMemo(() => {
    if (target === "single") return 1;
    if (target === "all") return clients.length;
    return clients.filter(c => c.segment === target).length;
  }, [target, clients]);

  const send = () => {
    if (!code.trim()) return toast.error("Veuillez entrer un code");
    setSending(true);
    setTimeout(() => {
      const history = loadFromLS(LS_PROMOS);
      const newPromo = {
        id: Date.now(),
        code: code.trim().toUpperCase(),
        discount, validity,
        target: singleClient ? "single" : target,
        targetLabel: singleClient ? singleClient.name : (target === "all" ? "Tous" : SEGMENT_COLORS[target]?.label || target),
        recipients: targetCount,
        clientId: singleClient?.id,
        clientName: singleClient?.name,
        date: new Date().toISOString(),
        expiresAt: new Date(Date.now() + validity * 86400000).toISOString(),
      };
      saveToLS(LS_PROMOS, [newPromo, ...history]);
      onSent(newPromo);
      setSending(false);
      onClose();
    }, 800);
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "20px 20px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>Offrir une promo</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{singleClient ? `Pour ${singleClient.name}` : "Créer un code de réduction"}</div>
          </div>
          <button onClick={onClose} style={CLOSE_BTN}><Icon name="close" size={14}/></button>
        </div>

        {/* Preview */}
        <div style={{
          background: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
          borderRadius: 14, padding: 16, color: "#fff", marginBottom: 16,
          textAlign: "center", boxShadow: "0 6px 20px rgba(249,115,22,0.25)",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.85, letterSpacing: 1 }}>CODE PROMO</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 2, marginTop: 4, fontFamily: "monospace" }}>{code || "_____"}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 8 }}>
            <div style={{ fontSize: 11, opacity: 0.9 }}><b style={{ fontSize: 16 }}>-{discount}%</b> sur tout</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>·</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>Valable <b style={{ fontSize: 16 }}>{validity}j</b></div>
          </div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 6 }}>CODE</div>
        <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} maxLength={16} placeholder="PROMO15" style={{
          width: "100%", padding: "10px 12px",
          border: "1px solid var(--border)", borderRadius: 10,
          background: "var(--card)", color: "var(--text)",
          fontSize: 14, fontWeight: 700, fontFamily: "monospace",
          outline: "none", boxSizing: "border-box",
          letterSpacing: 1, marginBottom: 14,
        }}/>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5 }}>REMISE</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#F97316" }}>-{discount}%</span>
        </div>
        <input type="range" min="5" max="50" step="5" value={discount} onChange={e => setDiscount(parseInt(e.target.value))} style={{ width: "100%", marginBottom: 14, accentColor: "#F97316" }}/>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5 }}>VALIDITÉ</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text)" }}>{validity} jours</span>
        </div>
        <input type="range" min="7" max="90" step="7" value={validity} onChange={e => setValidity(parseInt(e.target.value))} style={{ width: "100%", marginBottom: 14, accentColor: "#F97316" }}/>

        {!singleClient && (
          <>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 6 }}>POUR QUI ?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
              {[
                { id: "all", label: "Tous", count: clients.length },
                { id: "vip", label: "VIP only", count: clients.filter(c => c.segment === "vip").length },
                { id: "new", label: "Nouveaux", count: clients.filter(c => c.segment === "new").length },
                { id: "inactive", label: "Inactifs", count: clients.filter(c => c.segment === "inactive").length },
              ].map(t => (
                <button key={t.id} onClick={() => setTarget(t.id)} style={{
                  padding: "10px 12px", borderRadius: 10,
                  border: target === t.id ? "1.5px solid #F97316" : "1px solid var(--border)",
                  background: target === t.id ? "rgba(249,115,22,0.06)" : "var(--card)",
                  color: target === t.id ? "#F97316" : "var(--text)",
                  fontSize: 11, fontWeight: target === t.id ? 700 : 600,
                  cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                }}>
                  <div>{t.label}</div>
                  <div style={{ fontSize: 9, opacity: 0.7, fontWeight: 500 }}>{t.count} client{t.count > 1 ? "s" : ""}</div>
                </button>
              ))}
            </div>
          </>
        )}

        <button onClick={send} disabled={sending} style={{
          width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
          background: sending ? "#E5E7EB" : "#F97316",
          color: sending ? "var(--muted)" : "#fff",
          fontSize: 13, fontWeight: 700,
          cursor: sending ? "not-allowed" : "pointer", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {sending ? <><div className="spinner" style={{ width: 14, height: 14 }}/>Création...</> : <><Icon name="gift" size={14} color="#fff"/>Créer et envoyer à {targetCount} client{targetCount > 1 ? "s" : ""}</>}
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════
//  SINGLE MESSAGE MODAL
// ═══════════════════════════════════════════════════════

function SingleMessageModal({ client, onClose, onSent }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const QUICK_TEMPLATES = [
    { label: "Remerciement", text: `Bonjour ${client.name.split(" ")[0]}, merci pour votre fidélité ! 🙏 Nous apprécions vraiment vos commandes.` },
    { label: "Nouveauté", text: `Bonjour ${client.name.split(" ")[0]}, nous avons de nouveaux produits qui pourraient vous plaire. Venez les découvrir !` },
    { label: "Promo perso", text: `Bonjour ${client.name.split(" ")[0]}, vous bénéficiez d'une réduction exclusive de 15% sur votre prochaine commande. Code : MERCI15` },
  ];

  const send = () => {
    if (!message.trim()) return toast.error("Veuillez écrire un message");
    setSending(true);
    setTimeout(() => {
      const history = loadFromLS(LS_MESSAGES);
      const newMsg = {
        id: Date.now(),
        message: message.trim(),
        target: "single",
        targetLabel: client.name,
        recipients: 1,
        clientId: client.id,
        clientName: client.name,
        date: new Date().toISOString(),
      };
      saveToLS(LS_MESSAGES, [newMsg, ...history]);
      onSent(newMsg);
      setSending(false);
      onClose();
    }, 600);
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "20px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
            <img src={client.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text)" }}>{client.name}</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>{client.phone}</div>
          </div>
          <button onClick={onClose} style={CLOSE_BTN}><Icon name="close" size={14}/></button>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 6 }}>MODÈLES RAPIDES</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 14, overflowX: "auto", scrollbarWidth: "none" }} className="hide-scroll">
          {QUICK_TEMPLATES.map((t, i) => (
            <button key={i} onClick={() => setMessage(t.text)} style={{
              flexShrink: 0, padding: "8px 12px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--card)",
              color: "var(--text)", fontSize: 11, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>{t.label}</button>
          ))}
        </div>

        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={`Écrivez votre message à ${client.name.split(" ")[0]}...`} maxLength={500} style={{
          width: "100%", minHeight: 110, padding: 12,
          border: "1px solid var(--border)", borderRadius: 12,
          background: "var(--card)", color: "var(--text)",
          fontSize: 13, fontFamily: "inherit", resize: "none",
          outline: "none", boxSizing: "border-box",
        }}/>
        <div style={{ textAlign: "right", fontSize: 10, color: "var(--muted)", marginTop: 4, marginBottom: 14 }}>{message.length}/500</div>

        <button onClick={send} disabled={sending || !message.trim()} style={{
          width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
          background: sending || !message.trim() ? "#E5E7EB" : "#F97316",
          color: sending || !message.trim() ? "var(--muted)" : "#fff",
          fontSize: 13, fontWeight: 700,
          cursor: sending || !message.trim() ? "not-allowed" : "pointer",
          fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}>
          {sending ? <><div className="spinner" style={{ width: 14, height: 14 }}/>Envoi...</> : <><Icon name="mail" size={14} color="#fff"/>Envoyer le message</>}
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════
//  HISTORY MODAL
// ═══════════════════════════════════════════════════════

function HistoryModal({ onClose, messages, promos, onClear }) {
  const [tab, setTab] = useState("messages");

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "20px 20px 8px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)" }}>Historique</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Messages et promos envoyés</div>
          </div>
          <button onClick={onClose} style={CLOSE_BTN}><Icon name="close" size={14}/></button>
        </div>

        <div style={{ display: "flex", gap: 4, background: "#F3F4F6", padding: 3, borderRadius: 10, marginBottom: 14 }}>
          {[{ id: "messages", label: `Messages (${messages.length})` }, { id: "promos", label: `Promos (${promos.length})` }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
              background: tab === t.id ? "var(--card)" : "transparent",
              color: tab === t.id ? "var(--text)" : "var(--muted)",
              fontSize: 11, fontWeight: tab === t.id ? 700 : 600,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: tab === t.id ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ maxHeight: 320, overflowY: "auto" }}>
          {tab === "messages" && (
            messages.length === 0 ? <EmptyState icon="mail" label="Aucun message envoyé"/> :
            messages.map(m => (
              <div key={m.id} style={{ padding: 12, marginBottom: 8, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, padding: "2px 7px", background: "rgba(249,115,22,0.1)", color: "#F97316", borderRadius: 4, fontWeight: 700 }}>{m.targetLabel}</span>
                  <span style={{ fontSize: 10, color: "var(--muted)" }}>{m.recipients} destinataire{m.recipients > 1 ? "s" : ""}</span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text)", marginTop: 4, lineHeight: 1.5 }}>{m.message}</div>
                <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 6 }}>{new Date(m.date).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            ))
          )}
          {tab === "promos" && (
            promos.length === 0 ? <EmptyState icon="gift" label="Aucune promo créée"/> :
            promos.map(p => {
              const expired = new Date(p.expiresAt) < new Date();
              return (
                <div key={p.id} style={{ padding: 12, marginBottom: 8, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 800, color: "#F97316", letterSpacing: 1 }}>{p.code}</div>
                    <span style={{ fontSize: 10, padding: "2px 7px", background: expired ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)", color: expired ? "#DC2626" : "#047857", borderRadius: 4, fontWeight: 700 }}>{expired ? "EXPIRÉ" : "ACTIF"}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text)" }}>-{p.discount}% · {p.recipients} destinataire{p.recipients > 1 ? "s" : ""} · Validité {p.validity}j</div>
                  <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 4 }}>Cible : {p.targetLabel} · {new Date(p.date).toLocaleDateString("fr-FR")}</div>
                </div>
              );
            })
          )}
        </div>

        {((tab === "messages" && messages.length > 0) || (tab === "promos" && promos.length > 0)) && (
          <button onClick={() => {
            if (confirm("Effacer tout l'historique ?")) {
              onClear(tab);
              toast.success("Historique effacé");
            }
          }} style={{
            width: "100%", padding: 10, borderRadius: 10,
            border: "1px solid var(--border)", background: "transparent",
            color: "#DC2626", fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", marginTop: 12,
          }}>Effacer l'historique</button>
        )}
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════

function VClientsScr({ onBack, go }) {
  const [filter, setFilter] = useState("all");
  const [messages, setMessages] = useState(() => loadFromLS(LS_MESSAGES));
  const [promos, setPromos] = useState(() => loadFromLS(LS_PROMOS));
  
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [singleMsgClient, setSingleMsgClient] = useState(null);
  const [singlePromoClient, setSinglePromoClient] = useState(null);

  const filtered = useMemo(() => {
    if (filter === "all") return CLIENTS;
    return CLIENTS.filter(c => c.segment === filter);
  }, [filter]);

  const handleSent = (msg) => {
    setMessages([msg, ...messages]);
    toast.success(`Message envoyé à ${msg.recipients} client${msg.recipients > 1 ? "s" : ""}`);
  };

  const handlePromoSent = (promo) => {
    setPromos([promo, ...promos]);
    toast.success(`Code ${promo.code} créé pour ${promo.recipients} client${promo.recipients > 1 ? "s" : ""}`);
  };

  const handleExport = () => {
    exportClientsCSV(CLIENTS);
    toast.success(`${CLIENTS.length} clients exportés en CSV`);
  };

  const handleRelance = (client) => {
    const msg = {
      id: Date.now(),
      message: `Bonjour ${client.name.split(" ")[0]}, vous nous manquez ! Voici un code -15% pour votre retour : RELANCE15`,
      target: "single",
      targetLabel: client.name,
      recipients: 1,
      clientId: client.id,
      clientName: client.name,
      date: new Date().toISOString(),
    };
    const newMessages = [msg, ...messages];
    saveToLS(LS_MESSAGES, newMessages);
    setMessages(newMessages);
    toast.success(`Relance envoyée à ${client.name}`);
  };

  const handleClearHistory = (type) => {
    if (type === "messages") {
      saveToLS(LS_MESSAGES, []);
      setMessages([]);
    } else if (type === "promos") {
      saveToLS(LS_PROMOS, []);
      setPromos([]);
    }
  };

  return (
    <div className="scr" style={{ background: "#F9FAFB", minHeight: "100vh", paddingBottom: 80 }}>
      
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
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{CLIENTS.length} clients · {messages.length + promos.length} actions envoyées</div>
        </div>
        <button onClick={() => setShowHistory(true)} style={{
          width: 36, height: 36, borderRadius: 10,
          border: "1px solid var(--border)", background: "var(--card)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <Icon name="clock" size={16} />
          {(messages.length + promos.length > 0) && (
            <div style={{
              position: "absolute", top: -4, right: -4,
              minWidth: 16, height: 16, padding: "0 4px",
              borderRadius: 8, background: "#F97316",
              color: "#fff", fontSize: 9, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{messages.length + promos.length}</div>
          )}
        </button>
      </div>

      <div style={{ padding: 14 }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { value: "12 400", label: "Abonnés total", icon: "user", color: "#F97316", delta: "+24%" },
            { value: "247", label: "Nouveaux cette sem.", icon: "plus", color: "#10B981", delta: "+247" },
            { value: "3 421", label: "Clients actifs (30j)", icon: "package", color: "#3B82F6", delta: "+18%" },
            { value: "28K F", label: "Panier moyen / client", icon: "coin", color: "#F59E0B", delta: "+12%" },
          ].map((k, i) => (
            <div key={i} style={{ background: "var(--card)", padding: 12, borderRadius: 14, border: "0.5px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: `${k.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={k.icon} size={14} color={k.color} />
                </div>
                <span style={{ fontSize: 9, padding: "2px 6px", background: "rgba(16,185,129,0.1)", color: "#047857", borderRadius: 4, fontWeight: 700 }}>{k.delta}</span>
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, color: "var(--text)", letterSpacing: -0.3 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 8 }}>ACTIONS RAPIDES</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", scrollbarWidth: "none" }} className="hide-scroll">
          {[
            { label: "Broadcast", icon: "mail", color: "#F97316", action: () => setShowBroadcast(true) },
            { label: "Offrir promo", icon: "gift", color: "#10B981", action: () => setShowPromo(true) },
            { label: "Exporter CSV", icon: "document", color: "#3B82F6", action: handleExport },
            { label: "Historique", icon: "clock", color: "#8B5CF6", action: () => setShowHistory(true) },
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

        <div style={{ display: "flex", gap: 4, background: "#F3F4F6", padding: 3, borderRadius: 10, marginBottom: 14 }}>
          {[
            { id: "all", label: "Tous", count: CLIENTS.length },
            { id: "vip", label: "VIP", count: CLIENTS.filter(c => c.segment === "vip").length },
            { id: "new", label: "Nouveaux", count: CLIENTS.filter(c => c.segment === "new").length },
            { id: "inactive", label: "Inactifs", count: CLIENTS.filter(c => c.segment === "inactive").length },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              flex: 1, padding: "7px 0", borderRadius: 8, border: "none",
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

        <div style={{ background: "var(--card)", borderRadius: 14, border: "0.5px solid var(--border)", overflow: "hidden", marginBottom: 16 }}>
          {filtered.length === 0 ? <EmptyState icon="user" label="Aucun client dans cette catégorie"/> :
            filtered.map((c, i, arr) => {
              const seg = SEGMENT_COLORS[c.segment];
              const isInactive = c.segment === "inactive";
              return (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 12px",
                  borderBottom: i < arr.length - 1 ? "0.5px solid var(--border)" : "none",
                }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", border: `2px solid ${seg.bg}` }}>
                      <img src={c.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: isInactive ? "grayscale(0.5)" : "none" }}/>
                    </div>
                    <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: "50%", background: seg.bg, border: "2px solid var(--card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name={seg.icon} size={9} color="#fff" />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{c.name}</div>
                      {c.rank && <span style={{ fontSize: 9, padding: "1px 5px", background: "rgba(245,158,11,0.15)", color: "#B45309", borderRadius: 4, fontWeight: 700 }}>#{c.rank}</span>}
                    </div>
                    {isInactive ? (
                      <div style={{ fontSize: 10, color: "#DC2626", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                        <Icon name="clock" size={10} color="#DC2626" />Inactif depuis {c.lastOrder} jours
                      </div>
                    ) : (
                      <div style={{ fontSize: 10, color: c.segment === "vip" ? "#B45309" : "var(--muted)", marginTop: 2 }}>
                        {c.orders} commande{c.orders > 1 ? "s" : ""} · {fmt(c.total)}
                      </div>
                    )}
                  </div>
                  {isInactive ? (
                    <button onClick={() => handleRelance(c)} style={{
                      padding: "6px 11px", borderRadius: 8, border: "none", background: "#F97316",
                      color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    }}>Relancer</button>
                  ) : (
                    <>
                      <button onClick={() => setSingleMsgClient(c)} style={{
                        width: 30, height: 30, borderRadius: 8,
                        border: "0.5px solid var(--border)", background: "var(--card)",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}><Icon name="chat" size={13} color="var(--muted)" /></button>
                      <button onClick={() => setSinglePromoClient(c)} style={{
                        width: 30, height: 30, borderRadius: 8,
                        border: "0.5px solid var(--border)", background: "var(--card)",
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                      }}><Icon name="gift" size={13} color="var(--muted)" /></button>
                    </>
                  )}
                </div>
              );
            })}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: 0.5, marginBottom: 8 }}>RÉPARTITION GÉOGRAPHIQUE</div>
        <div style={{ background: "var(--card)", borderRadius: 14, border: "0.5px solid var(--border)", padding: 14, marginBottom: 16 }}>
          {ZONES.map((z, i) => (
            <div key={z.name} style={{ marginBottom: i < ZONES.length - 1 ? 12 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "var(--text)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="location" size={11} color={z.color} />{z.name}
                </span>
                <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{z.count.toLocaleString("fr-FR")} ({z.pct}%)</span>
              </div>
              <div style={{ height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: z.pct + "%", height: "100%", background: z.gradient, borderRadius: 3, transition: "width .4s ease" }}/>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: "linear-gradient(135deg, #FFF7ED 0%, var(--card) 100%)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: 14, padding: 14 }}>
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

      {/* MODALS - REAL FUNCTIONALITY */}
      {showBroadcast && <BroadcastModal clients={CLIENTS} onClose={() => setShowBroadcast(false)} onSent={handleSent}/>}
      {showPromo && <PromoModal clients={CLIENTS} onClose={() => setShowPromo(false)} onSent={handlePromoSent}/>}
      {showHistory && <HistoryModal messages={messages} promos={promos} onClose={() => setShowHistory(false)} onClear={handleClearHistory}/>}
      {singleMsgClient && <SingleMessageModal client={singleMsgClient} onClose={() => setSingleMsgClient(null)} onSent={handleSent}/>}
      {singlePromoClient && <PromoModal clients={CLIENTS} singleClient={singlePromoClient} onClose={() => setSinglePromoClient(null)} onSent={handlePromoSent}/>}
    </div>
  );
}

export default VClientsScr;
