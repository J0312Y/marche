import { useState, useMemo } from "react";
import Icon from "../../components/Icon";
import toast from "../../utils/toast";
import { fmt } from "../../utils/helpers";
import { useLoad, useAction } from "../../hooks/useData";
import vendor from "../../services/vendorService";

// Segments calculés à partir des vraies commandes du client
const SEGMENTS = {
  vip:      { color: "#F59E0B", label: "VIP" },
  regular:  { color: "#3B82F6", label: "Régulier" },
  new:      { color: "#10B981", label: "Nouveau" },
  inactive: { color: "#EF4444", label: "Inactif" },
};

const daysSince = (d) => {
  if (!d) return null;
  const t = new Date(String(d).replace(" ", "T"));
  return isNaN(t) ? null : Math.floor((Date.now() - t.getTime()) / 86400000);
};

const fromApi = (c) => {
  const orders = parseInt(c.order_count) || 0;
  const total = parseFloat(c.total_spent) || 0;
  const last = daysSince(c.last_order_date);
  const segment = last !== null && last > 60 ? "inactive" : orders >= 5 || total >= 200000 ? "vip" : orders >= 2 ? "regular" : "new";
  return {
    id: c.id,
    name: [c.first_name, c.last_name].filter(Boolean).join(" ") || "Client",
    phone: c.phone || "",
    avatar: c.avatar || null,
    orders, total, lastOrder: last, segment,
  };
};

const exportCSV = (clients) => {
  const headers = ["Nom", "Téléphone", "Segment", "Commandes", "Total FCFA", "Dernière commande (jours)"];
  const rows = clients.map(c => [c.name, c.phone, SEGMENTS[c.segment].label, c.orders, c.total, c.lastOrder ?? ""]);
  const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `clients-lamuka-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

function BroadcastModal({ count, onClose }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const { run, loading } = useAction();
  const send = async () => {
    if (!title.trim() || !message.trim()) { toast.error("Titre et message requis"); return; }
    let res;
    try { res = await run(() => vendor.broadcastClients(title.trim(), message.trim())); }
    catch (err) { toast.error(err.message || "Envoi impossible"); return; }
    toast.success(`Notification envoyée à ${res?.total_clients ?? count} client${(res?.total_clients ?? count) > 1 ? "s" : ""}`);
    onClose();
  };
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 500, background: "var(--card)", borderRadius: "20px 20px 0 0", padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Notifier mes clients</h3>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Une notification sera envoyée aux {count} client{count > 1 ? "s" : ""} ayant déjà commandé chez vous.</p>
        <div className="field"><label>Titre</label><input value={title} maxLength={60} onChange={e => setTitle(e.target.value)} placeholder="Nouvel arrivage !" /></div>
        <div className="field"><label>Message</label><textarea rows={3} value={message} maxLength={200} onChange={e => setMessage(e.target.value)} placeholder="Découvrez nos nouveautés de la semaine…" /></div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>Annuler</button>
          <button className="btn-primary" style={{ flex: 2 }} disabled={loading} onClick={send}>{loading ? "Envoi…" : "Envoyer"}</button>
        </div>
      </div>
    </div>
  );
}

function VClientsScr({ onBack }) {
  const { data, loading, error } = useLoad(() => vendor.getClients());
  const clients = useMemo(() => (data?.clients || (Array.isArray(data) ? data : [])).map(fromApi), [data]);
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("all");
  const [showBroadcast, setShowBroadcast] = useState(false);

  const filtered = clients.filter(c =>
    (segment === "all" || c.segment === segment) &&
    (!search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)));
  const totalRevenue = clients.reduce((s, c) => s + c.total, 0);

  return (<div className="scr" style={{ padding: 16, paddingBottom: 20 }}>
    <div className="appbar" style={{ padding: 0, marginBottom: 12 }}><button onClick={onBack}>←</button><h2>Mes clients</h2><div style={{ width: 38 }} /></div>

    {loading && <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div className="spinner" /></div>}
    {error && <div className="info-box yellow" style={{ marginBottom: 12 }}><span><Icon name="info" size={16} /></span><span style={{ fontSize: 12 }}>{error}</span></div>}

    {!loading && !error && <>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {[["Clients", clients.length], ["Chiffre d'affaires", fmt(totalRevenue)], ["VIP", clients.filter(c => c.segment === "vip").length]].map(([l, v]) =>
          <div key={l} style={{ flex: 1, textAlign: "center", padding: "10px 4px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{v}</div><div style={{ fontSize: 10, color: "var(--muted)" }}>{l}</div>
          </div>)}
      </div>

      {clients.length > 0 && <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setShowBroadcast(true)} style={{ flex: 1, padding: 10, borderRadius: 12, border: "none", background: "#F97316", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Icon name="bell" size={14} color="#fff" /> Notifier mes clients</button>
        <button onClick={() => exportCSV(filtered)} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Export CSV</button>
      </div>}

      {clients.length > 0 && <>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un nom ou un numéro…" style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--light)", color: "var(--text)", fontSize: 13, marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12 }}>
          {[["all", "Tous"], ...Object.entries(SEGMENTS).map(([k, v]) => [k, v.label])].map(([k, l]) =>
            <button key={k} onClick={() => setSegment(k)} style={{ padding: "6px 12px", borderRadius: 20, border: segment === k ? "1px solid #F97316" : "1px solid var(--border)", background: segment === k ? "rgba(249,115,22,0.08)" : "var(--card)", color: segment === k ? "#F97316" : "var(--text)", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>{l}</button>)}
        </div>
      </>}

      {clients.length === 0 && <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", fontSize: 13 }}><Icon name="user" size={26} /><div style={{ marginTop: 8 }}>Pas encore de client.<br />Vos clients apparaîtront ici après leur première commande.</div></div>}
      {clients.length > 0 && filtered.length === 0 && <div style={{ textAlign: "center", padding: 30, color: "var(--muted)", fontSize: 13 }}>Aucun client ne correspond.</div>}

      {filtered.map(c => {
        const seg = SEGMENTS[c.segment];
        return (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 8 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, overflow: "hidden", background: "rgba(249,115,22,0.1)", color: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
              {c.avatar ? <img src={c.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : c.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</span>
                <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: seg.color + "18", color: seg.color, fontWeight: 700 }}>{seg.label}</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.orders} commande{c.orders > 1 ? "s" : ""} · {fmt(c.total)}{c.lastOrder !== null ? ` · il y a ${c.lastOrder} j` : ""}</div>
            </div>
            {c.phone && <button aria-label="Appeler" onClick={() => { window.location.href = "tel:" + c.phone; }} style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "rgba(16,185,129,0.1)", color: "#10B981", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="phone" size={16} /></button>}
          </div>
        );
      })}
    </>}

    {showBroadcast && <BroadcastModal count={clients.length} onClose={() => setShowBroadcast(false)} />}
  </div>);
}

export default VClientsScr;
