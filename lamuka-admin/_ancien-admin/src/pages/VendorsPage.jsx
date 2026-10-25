import { useState } from "react";
import { Store, UtensilsCrossed, Cake, Pill, ShoppingCart, Wrench, FileText, Eye, Pause, Play, Star, Check, X as XIcon, CheckCircle } from "lucide-react";
import { useI18n } from "../i18n";
import { PENDING_VENDORS, ALL_VENDORS, PLAN_REQUESTS, fmtCFA } from "../data";
import { useToast } from "../components/UI";
import { DocumentViewer } from "../components/UI";
import { VENDOR_DOCS, DOC_LABELS as VDOC_LABELS, DOC_ICONS } from "../mockDocs";

const TYPE_ICONS = { boutique: <Store size={14} />, restaurant: <UtensilsCrossed size={14} />, patisserie: <Cake size={14} />, pharmacie: <Pill size={14} />, supermarche: <ShoppingCart size={14} />, service: <Wrench size={14} /> };
const TYPE_LABELS = { boutique: "Boutique", restaurant: "Restaurant", patisserie: "Pâtisserie", pharmacie: "Pharmacie", supermarche: "Supermarché", service: "Service" };
const PLAN_COLORS = { starter: "badge-info", pro: "badge-primary", enterprise: "badge-warning" };
const STATUS_BADGES = { active: "badge-success", pending: "badge-warning", suspended: "badge-danger" };

const VENDOR_DOC_KEYS = ["registre", "niu", "id_card", "photo", "sanitaire"];

export default function VendorsPage({ onOpenDetail }) {
  const { t, lang } = useI18n();
  const toast = useToast();
  const [tab, setTab] = useState("pending");
  const [pendingList, setPending] = useState(PENDING_VENDORS);
  const [planReqs, setPlanReqs] = useState(PLAN_REQUESTS);
  const [vendorList] = useState(ALL_VENDORS);
  const [detail, setDetail] = useState(null);
  const [docsModal, setDocsModal] = useState(null);
  const [docPreview, setDocPreview] = useState(null);

  const handleApprove = (id) => { setPending(prev => prev.filter(v => v.id !== id)); toast.success(lang === "fr" ? "Commerçant approuvé" : "Vendor approved"); };
  const handleReject = (id) => { setPending(prev => prev.filter(v => v.id !== id)); toast.success(lang === "fr" ? "Inscription rejetée" : "Registration rejected"); };
  const handleApprovePlan = (id) => { setPlanReqs(prev => prev.filter(r => r.id !== id)); toast.success(lang === "fr" ? "Plan approuvé" : "Plan approved"); };

  return (
    <div className="fade-in">
      <h1 className="page-title">{t("vendors")}</h1>
      <p className="page-subtitle">
        {lang === "fr"
          ? `${pendingList.length} inscriptions en attente · ${planReqs.length} demandes d'upgrade`
          : `${pendingList.length} pending registrations · ${planReqs.length} upgrade requests`}
      </p>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
          {t("pendingVendors")} {pendingList.length > 0 && <span className="badge badge-danger" style={{ marginLeft: 6 }}>{pendingList.length}</span>}
        </button>
        <button className={`tab-btn ${tab === "upgrades" ? "active" : ""}`} onClick={() => setTab("upgrades")}>
          {t("planUpgradeRequests")} {planReqs.length > 0 && <span className="badge badge-warning" style={{ marginLeft: 6 }}>{planReqs.length}</span>}
        </button>
        <button className={`tab-btn ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
          {t("allVendors")} ({vendorList.length})
        </button>
      </div>

      {/* ═══ PENDING VENDORS ═══ */}
      {tab === "pending" && (
        <div className="card">
          {pendingList.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><CheckCircle size={40} /></div>
              <div className="empty-text">{lang === "fr" ? "Aucune inscription en attente" : "No pending registrations"}</div>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t("vendorName")}</th>
                    <th>{t("vendorType")}</th>
                    <th>{lang === "fr" ? "Propriétaire" : "Owner"}</th>
                    <th>{t("plan")}</th>
                    <th>{lang === "fr" ? "Documents" : "Docs"}</th>
                    <th>{t("date")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingList.map(v => (
                    <tr key={v.id}>
                      <td style={{ fontWeight: 600 }}>{v.name}</td>
                      <td><span style={{ display: "flex", alignItems: "center", gap: 4 }}>{TYPE_ICONS[v.type]}{TYPE_LABELS[v.type] || v.type}</span></td>
                      <td>
                        <div>{v.owner}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{v.phone}</div>
                      </td>
                      <td><span className={`badge ${PLAN_COLORS[v.plan]}`}>{v.plan}</span></td>
                      <td>
                        <button className="btn btn-sm btn-outline" onClick={() => setDocsModal(v)}
                          style={{ color: v.docs ? "var(--success)" : "var(--danger)" }}>
                          <FileText size={14} style={{ marginRight: 4 }} />{v.docs ? (lang === "fr" ? "Voir" : "View") : (lang === "fr" ? "Manquants" : "Missing")}
                        </button>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--text-3)" }}>{v.date}</td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-sm btn-success" onClick={() => handleApprove(v.id)}><Check size={14} /> {t("approve")}</button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleReject(v.id)}><XIcon size={14} /> {t("reject")}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══ PLAN UPGRADE REQUESTS ═══ */}
      {tab === "upgrades" && (
        <div className="card">
          {planReqs.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><CheckCircle size={40} /></div>
              <div className="empty-text">{lang === "fr" ? "Aucune demande d'upgrade" : "No upgrade requests"}</div>
            </div>
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{lang === "fr" ? "Établissement" : "Shop"}</th>
                    <th>{t("currentPlan")}</th>
                    <th>{t("requestedPlan")}</th>
                    <th>{t("amount")}</th>
                    <th>{t("method")}</th>
                    <th>{t("paymentProof")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {planReqs.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{r.vendor}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>{r.owner}</div>
                      </td>
                      <td><span className={`badge ${PLAN_COLORS[r.current]}`}>{r.current}</span></td>
                      <td>
                        <span className={`badge ${PLAN_COLORS[r.requested]}`}>{r.requested}</span>
                        <span style={{ margin: "0 4px", color: "var(--text-3)" }}>←</span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{fmtCFA(r.amount)}</td>
                      <td>{r.method}</td>
                      <td>
                        {r.proof
                          ? <span className="badge badge-success"><Check size={14} /> {lang === "fr" ? "Reçu" : "Received"}</span>
                          : <span className="badge badge-danger"><XIcon size={14} /> {lang === "fr" ? "Absent" : "Missing"}</span>}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-sm btn-success" onClick={() => handleApprovePlan(r.id)} disabled={!r.proof}>
                            {t("approveUpgrade")}
                          </button>
                          <button className="btn btn-sm btn-outline" onClick={() => handleApprovePlan(r.id)}>
                            {t("rejectUpgrade")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══ ALL VENDORS ═══ */}
      {tab === "all" && (
        <div className="card">
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t("vendorName")}</th>
                  <th>{t("vendorType")}</th>
                  <th>{t("plan")}</th>
                  <th>{t("status")}</th>
                  <th>{lang === "fr" ? "Revenus" : "Revenue"}</th>
                  <th>{t("totalOrders")}</th>
                  <th><Star size={14} /></th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {vendorList.map(v => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{v.name}</div>
                      <div style={{ fontSize: 11, color: "var(--text-3)" }}>{v.owner}</div>
                    </td>
                    <td><span style={{ display: "flex", alignItems: "center", gap: 4 }}>{TYPE_ICONS[v.type]}{TYPE_LABELS[v.type]}</span></td>
                    <td><span className={`badge ${PLAN_COLORS[v.plan]}`}>{v.plan}</span></td>
                    <td>
                      <span className={`badge ${STATUS_BADGES[v.status]}`}>
                        {lang === "fr"
                          ? (v.status === "active" ? "Actif" : v.status === "suspended" ? "Suspendu" : v.status)
                          : v.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600, fontFamily: "var(--font-mono)", fontSize: 12 }}>{fmtCFA(v.revenue)}</td>
                    <td>{v.orders}</td>
                    <td>{v.rating}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => setDetail(v)}><Eye size={15} /></button>
                        {v.status === "active"
                          ? <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }}><Pause size={15} /></button>
                          : <button className="btn btn-sm btn-ghost" style={{ color: "var(--success)" }}><Play size={15} /></button>}
                        {onOpenDetail && <button className="btn btn-sm btn-primary" onClick={() => onOpenDetail(v)}><FileText size={14} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ DETAIL MODAL ═══ */}
      {detail && (
        <div className="modal-overlay" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{detail.name}</h3>
              <button className="modal-close" onClick={() => setDetail(null)}><XIcon size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div><div className="form-label">{t("vendorType")}</div><div style={{ fontWeight: 600 }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}>{TYPE_ICONS[detail.type]}{TYPE_LABELS[detail.type]}</span></div></div>
                <div><div className="form-label">{t("plan")}</div><span className={`badge ${PLAN_COLORS[detail.plan]}`}>{detail.plan}</span></div>
                <div><div className="form-label">{t("status")}</div><span className={`badge ${STATUS_BADGES[detail.status]}`}>{detail.status}</span></div>
                <div><div className="form-label"><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Star size={14} /> Rating</span></div><div style={{ fontWeight: 600 }}>{detail.rating}/5</div></div>
                <div><div className="form-label">{lang === "fr" ? "Revenus totaux" : "Total Revenue"}</div><div style={{ fontWeight: 700, fontSize: 18 }}>{fmtCFA(detail.revenue)}</div></div>
                <div><div className="form-label">{t("totalOrders")}</div><div style={{ fontWeight: 700, fontSize: 18 }}>{detail.orders}</div></div>
              </div>
              <div className="form-label">{lang === "fr" ? "Propriétaire" : "Owner"}</div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{detail.owner}</div>
              <div className="form-label">{lang === "fr" ? "Inscrit le" : "Registered"}</div>
              <div style={{ color: "var(--text-3)" }}>{detail.date}</div>
            </div>
            <div className="modal-footer">
              {onOpenDetail && <button className="btn btn-primary" onClick={() => { setDetail(null); onOpenDetail(detail); }}><FileText size={14} style={{ marginRight: 4 }} />{lang === "fr" ? "Fiche complète" : "Full Detail"}</button>}
              {detail.status === "active"
                ? <button className="btn btn-danger">{t("suspend")}</button>
                : <button className="btn btn-success">{t("reactivate")}</button>}
              <button className="btn btn-outline" onClick={() => setDetail(null)}>{t("cancel")}</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ VENDOR DOCUMENTS MODAL ═══ */}
      {docsModal && (
        <div className="modal-overlay" onClick={() => setDocsModal(null)}>
          <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><span style={{ display: "flex", alignItems: "center", gap: 6 }}><FileText size={18} /> Documents — {docsModal.name}</span></h3>
              <button className="modal-close" onClick={() => setDocsModal(null)}><XIcon size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <span className={`badge ${PLAN_COLORS[docsModal.plan]}`}>{docsModal.plan}</span>
                <span className="badge badge-neutral"><span style={{ display: "flex", alignItems: "center", gap: 4 }}>{TYPE_ICONS[docsModal.type]}{TYPE_LABELS[docsModal.type]}</span></span>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>{docsModal.owner}</span>
              </div>
              {VENDOR_DOC_KEYS.map(key => {
                const docs = VENDOR_DOCS[docsModal.id] || {};
                const doc = docs[key];
                if (!doc) return null;
                // Skip sanitaire for non-food types
                if (key === "sanitaire" && !["restaurant", "patisserie", "supermarche"].includes(docsModal.type)) return null;
                const label = (VDOC_LABELS[lang] || VDOC_LABELS.fr)[key] || key;
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14, background: doc.verified ? "var(--success-light)" : "var(--surface-2)", borderRadius: 12, marginBottom: 8, border: doc.verified ? "1px solid rgba(16,185,129,0.2)" : "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{DOC_ICONS[key]}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                          {doc.name} · {doc.size} · {doc.date}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {doc.verified ? (
                        <span className="badge badge-success"><Check size={14} /></span>
                      ) : doc.file ? (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => toast.success(lang === "fr" ? "Document approuvé" : "Doc approved")}><Check size={14} /></button>
                          <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => toast.warning(lang === "fr" ? "Document rejeté" : "Doc rejected")}><XIcon size={14} /></button>
                        </>
                      ) : (
                        <span className="badge badge-danger"><XIcon size={14} /></span>
                      )}
                      {doc.file && (
                        <button className="btn btn-sm btn-outline" onClick={() => setDocPreview(doc)} title={lang === "fr" ? "Voir" : "View"}><Eye size={15} /></button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="modal-footer">
              <button className="btn btn-success" onClick={() => { handleApprove(docsModal.id); setDocsModal(null); }}>
                <Check size={14} /> {lang === "fr" ? "Approuver le commerçant" : "Approve Vendor"}
              </button>
              <button className="btn btn-outline" onClick={() => setDocsModal(null)}>{lang === "fr" ? "Fermer" : "Close"}</button>
            </div>
          </div>
        </div>
      )}

      <DocumentViewer open={!!docPreview} onClose={() => setDocPreview(null)} doc={docPreview} lang={lang} />
    </div>
  );
}
