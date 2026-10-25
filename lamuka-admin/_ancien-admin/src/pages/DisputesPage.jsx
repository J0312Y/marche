import { useState, useMemo } from "react";
import { Scale, ClipboardList, Circle, CheckCircle, Eye, MessageSquare, Wallet, RefreshCw, ArrowUp, X as XIcon } from "lucide-react";
import { useI18n } from "../i18n";
import { fmtCFA } from "../data";
import { useToast, ConfirmModal, Pagination, SearchBar, StatusBadge, DetailDrawer, EmptyState, SupportThread, DateRangePicker, ExportButtons } from "../components/UI";

const DISPUTES_DATA = [
  { id: "d1", ref: "#LMK-0889", client: "Celine Nzaba", vendor: "Mode Afrique", amount: 92000, reason: "Article non conforme", reasonEn: "Item not as described", status: "open", priority: "high", date: "2026-02-28", messages: [
    { from: "client", sender: "Celine Nzaba", text: "La robe reçue ne correspond pas à la photo. Couleur différente et taille trop petite.", time: "10:30" },
    { from: "admin", sender: "Admin", text: "Bonjour Celine, nous avons contacté le commerçant. Pouvez-vous envoyer une photo du produit reçu ?", time: "11:15" },
    { from: "client", sender: "Celine Nzaba", text: "Voici la photo. Comme vous pouvez voir, c'est complètement différent.", time: "11:30", attachment: { type: "image", name: "photo_recue.jpg", size: "340 KB", data: null } },
  ]},
  { id: "d2", ref: "#LMK-0876", client: "Patrick Okamba", vendor: "TechZone Congo", amount: 45000, reason: "Produit défectueux", reasonEn: "Defective product", status: "in_progress", priority: "medium", date: "2026-02-27", messages: [
    { from: "client", sender: "Patrick Okamba", text: "Les écouteurs ne fonctionnent que d'un côté.", time: "14:00" },
    { from: "admin", sender: "Admin", text: "Nous organisons un échange. Le livreur passera demain.", time: "15:30" },
  ]},
  { id: "d3", ref: "#LMK-0854", client: "Marie Kongo", vendor: "Chez Mama Ngudi", amount: 11000, reason: "Commande jamais livrée", reasonEn: "Order never delivered", status: "open", priority: "high", date: "2026-02-26", messages: [
    { from: "client", sender: "Marie Kongo", text: "Ça fait 3 jours que j'attends ma commande. Le livreur ne répond plus.", time: "09:00" },
  ]},
  { id: "d4", ref: "#LMK-0821", client: "Paul Mokoko", vendor: "Supermarché Central", amount: 18500, reason: "Articles manquants", reasonEn: "Missing items", status: "resolved", priority: "low", date: "2026-02-24", resolution: "refund", messages: [
    { from: "client", sender: "Paul Mokoko", text: "Il manque 2 packs d'eau dans ma commande.", time: "16:00" },
    { from: "admin", sender: "Admin", text: "Remboursement partiel de 7 000 F effectué.", time: "17:00" },
  ]},
  { id: "d5", ref: "#LMK-0798", client: "Aminata Diallo", vendor: "Grill Master", amount: 16000, reason: "Qualité insatisfaisante", reasonEn: "Poor quality", status: "resolved", priority: "low", date: "2026-02-22", resolution: "exchange", messages: [
    { from: "client", sender: "Aminata Diallo", text: "Les brochettes étaient froides et pas fraîches.", time: "20:00" },
    { from: "admin", sender: "Admin", text: "Échange effectué avec succès.", time: "21:00" },
  ]},
];

const PRIO_BADGE = { high: "badge-danger", medium: "badge-warning", low: "badge-info" };
const PER_PAGE = 5;

export default function DisputesPage() {
  const { lang } = useI18n();
  const toast = useToast();
  const [disputes, setDisputes] = useState(DISPUTES_DATA);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const counts = useMemo(() => ({
    all: disputes.length,
    open: disputes.filter(d => d.status === "open").length,
    in_progress: disputes.filter(d => d.status === "in_progress").length,
    resolved: disputes.filter(d => d.status === "resolved").length,
  }), [disputes]);

  const filtered = useMemo(() => {
    let list = tab === "all" ? disputes : disputes.filter(d => d.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.ref.toLowerCase().includes(q) || d.client.toLowerCase().includes(q) || d.vendor.toLowerCase().includes(q));
    }
    if (startDate) list = list.filter(d => d.date >= startDate);
    if (endDate) list = list.filter(d => d.date <= endDate);
    return list;
  }, [disputes, tab, search, startDate, endDate]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const resolveDispute = (id, resolution) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, status: "resolved", resolution } : d));
    if (detail?.id === id) setDetail({ ...detail, status: "resolved", resolution });
    toast.success(lang === "fr" ? `Litige résolu — ${resolution === "refund" ? "Remboursement" : "Échange"}` : `Dispute resolved — ${resolution}`);
    setConfirmAction(null);
  };

  const escalateDispute = (id) => {
    setDisputes(prev => prev.map(d => d.id === id ? { ...d, priority: "high", status: "in_progress" } : d));
    toast.warning(lang === "fr" ? "Litige escaladé" : "Dispute escalated");
  };

  const sendMessage = (text, attachment) => {
    if (!detail) return;
    const msg = { from: "admin", sender: "Admin", text, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), attachment: attachment || null };
    const updated = { ...detail, messages: [...detail.messages, msg] };
    setDetail(updated);
    setDisputes(prev => prev.map(d => d.id === detail.id ? updated : d));
  };

  const exportData = filtered.map(d => ({ ref: d.ref, client: d.client, vendor: d.vendor, amount: d.amount, reason: lang === "fr" ? d.reason : d.reasonEn, status: d.status, date: d.date }));

  return (
    <div className="fade-in">
      <h1 className="page-title">{lang === "fr" ? "Litiges & Remboursements" : "Disputes & Refunds"}</h1>
      <p className="page-subtitle">
        {counts.open} {lang === "fr" ? "ouverts" : "open"} · {counts.in_progress} {lang === "fr" ? "en cours" : "in progress"}
      </p>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          [<ClipboardList size={20} />, counts.all, lang === "fr" ? "Total" : "Total", "all"],
          [<Circle size={20} style={{ fill: "var(--danger)", color: "var(--danger)" }} />, counts.open, lang === "fr" ? "Ouverts" : "Open", "open"],
          [<Circle size={20} style={{ fill: "var(--warning)", color: "var(--warning)" }} />, counts.in_progress, lang === "fr" ? "En cours" : "In Progress", "in_progress"],
          [<CheckCircle size={20} />, counts.resolved, lang === "fr" ? "Résolus" : "Resolved", "resolved"],
        ].map(([ic, v, l, target], i) => (
          <div key={i} className="stat-card" style={{ padding: 14, cursor: "pointer", borderColor: tab === target ? "var(--primary)" : undefined }} onClick={() => { setTab(target); setPage(1); }}>
            <div style={{ fontSize: 20 }}>{ic}</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{l}</div>
          </div>
        ))}
      </div>

      <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder={lang === "fr" ? "Rechercher par réf, client, vendeur..." : "Search by ref, client, vendor..."}>
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
        <ExportButtons data={exportData} filename={lang === "fr" ? "litiges-lamuka" : "disputes-lamuka"} columns={["ref", "client", "vendor", "amount", "reason", "status", "date"]} lang={lang} />
      </SearchBar>

      <div className="card">
        {paginated.length === 0 ? (
          <EmptyState icon={<Scale size={40} />} title={lang === "fr" ? "Aucun litige" : "No disputes"} />
        ) : (
          <div className="data-table-wrapper"><table className="data-table"><thead><tr>
            <th>Réf</th><th>Client</th><th>{lang === "fr" ? "Commerçant" : "Vendor"}</th>
            <th>{lang === "fr" ? "Montant" : "Amount"}</th><th>{lang === "fr" ? "Motif" : "Reason"}</th>
            <th>{lang === "fr" ? "Priorité" : "Priority"}</th><th>{lang === "fr" ? "Statut" : "Status"}</th>
            <th><MessageSquare size={16} /></th><th>Actions</th>
          </tr></thead><tbody>
            {paginated.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 12 }}>{d.ref}</td>
                <td style={{ fontSize: 13 }}>{d.client}</td>
                <td style={{ fontSize: 13 }}>{d.vendor}</td>
                <td style={{ fontWeight: 600, fontFamily: "var(--font-mono)", fontSize: 12 }}>{fmtCFA(d.amount)}</td>
                <td><span className="badge badge-neutral" style={{ fontSize: 11 }}>{lang === "fr" ? d.reason : d.reasonEn}</span></td>
                <td><span className={`badge ${PRIO_BADGE[d.priority]}`}>{d.priority}</span></td>
                <td><StatusBadge status={d.status} label={d.status === "open" ? (lang === "fr" ? "Ouvert" : "Open") : d.status === "in_progress" ? (lang === "fr" ? "En cours" : "In progress") : (lang === "fr" ? "Résolu" : "Resolved")} /></td>
                <td>{d.messages.length}</td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-sm btn-primary" onClick={() => setDetail(d)}><Eye size={15} /></button>
                    {d.status !== "resolved" && (
                      <button className="btn btn-sm btn-success" onClick={() => setConfirmAction({ type: "refund", dispute: d })}><Wallet size={14} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table></div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />
      </div>

      {/* Dispute Detail Drawer */}
      <DetailDrawer open={!!detail} onClose={() => setDetail(null)} title={detail?.ref} width="min(560px, 95vw)"
        footer={detail && detail.status !== "resolved" && (
          <>
            <button className="btn btn-success" onClick={() => setConfirmAction({ type: "refund", dispute: detail })}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Wallet size={14} />{lang === "fr" ? "Rembourser" : "Refund"}</span></button>
            <button className="btn btn-primary" onClick={() => setConfirmAction({ type: "exchange", dispute: detail })}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><RefreshCw size={14} />{lang === "fr" ? "Échanger" : "Exchange"}</span></button>
            <button className="btn btn-outline" onClick={() => escalateDispute(detail.id)}><span style={{ display: "flex", alignItems: "center", gap: 6 }}><ArrowUp size={14} />{lang === "fr" ? "Escalader" : "Escalate"}</span></button>
          </>
        )}
      >
        {detail && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Info */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <StatusBadge status={detail.status} />
                <span className={`badge ${PRIO_BADGE[detail.priority]}`}>{detail.priority}</span>
                {detail.resolution && <span className="badge badge-success">{detail.resolution}</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                <div><span style={{ color: "var(--text-3)" }}>Client: </span><strong>{detail.client}</strong></div>
                <div><span style={{ color: "var(--text-3)" }}>{lang === "fr" ? "Commerçant" : "Vendor"}: </span><strong>{detail.vendor}</strong></div>
                <div><span style={{ color: "var(--text-3)" }}>{lang === "fr" ? "Montant" : "Amount"}: </span><strong>{fmtCFA(detail.amount)}</strong></div>
                <div><span style={{ color: "var(--text-3)" }}>Date: </span><strong>{detail.date}</strong></div>
              </div>
              <div style={{ marginTop: 12, padding: "8px 12px", background: "var(--surface-2)", borderRadius: 10, fontSize: 13 }}>
                <strong>{lang === "fr" ? "Motif" : "Reason"}: </strong>{lang === "fr" ? detail.reason : detail.reasonEn}
              </div>
            </div>
            {/* Thread */}
            <div style={{ flex: 1, minHeight: 300, border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
              <SupportThread messages={detail.messages} onSend={sendMessage} lang={lang} />
            </div>
          </div>
        )}
      </DetailDrawer>

      <ConfirmModal
        open={!!confirmAction}
        title={confirmAction?.type === "refund" ? (lang === "fr" ? "Rembourser le client ?" : "Refund client?") : (lang === "fr" ? "Organiser un échange ?" : "Arrange exchange?")}
        message={confirmAction ? `${confirmAction.dispute.ref} — ${confirmAction.dispute.client} — ${fmtCFA(confirmAction.dispute.amount)}` : ""}
        confirmText={confirmAction?.type === "refund" ? (lang === "fr" ? "Rembourser" : "Refund") : (lang === "fr" ? "Échanger" : "Exchange")}
        onConfirm={() => resolveDispute(confirmAction.dispute.id, confirmAction.type)}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
