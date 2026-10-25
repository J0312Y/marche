import { useState, useMemo } from "react";
import { Bike, CheckCircle, Clock, Pause, Play, MapPin, FileText, Star, Eye, Map, AlertTriangle, X as XIcon } from "lucide-react";
import { useI18n } from "../i18n";
import { ALL_DRIVERS } from "../dataExtended";
import { fmtCFA } from "../data";
import { useToast, ConfirmModal, StatusBadge, SearchBar, DetailDrawer, EmptyState, DocumentViewer } from "../components/UI";
import { DRIVER_DOCS, DOC_LABELS, DOC_ICONS } from "../mockDocs";

const ALL_ZONES = ["Bacongo", "Poto-Poto", "Moungali", "Ouenzé", "Talangaï", "Mfilou", "Makélékélé", "Madibou", "Djiri"];

export default function DriversPage() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const [drivers, setDrivers] = useState(ALL_DRIVERS);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [zoneModal, setZoneModal] = useState(null);
  const [docsModal, setDocsModal] = useState(null);
  const [docPreview, setDocPreview] = useState(null);

  const filtered = useMemo(() => {
    let list = tab === "all" ? drivers : drivers.filter(d => d.status === tab);
    if (search) { const q = search.toLowerCase(); list = list.filter(d => d.name.toLowerCase().includes(q) || d.phone.includes(q)); }
    return list;
  }, [drivers, tab, search]);

  const counts = { all: drivers.length, active: drivers.filter(d => d.status === "active").length, pending: drivers.filter(d => d.status === "pending").length, suspended: drivers.filter(d => d.status === "suspended").length };

  const approveDriver = (id) => { setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: "active" } : d)); toast.success(lang === "fr" ? "Livreur approuvé" : "Driver approved"); };
  const suspendDriver = (id) => { setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: "suspended", available: false } : d)); toast.warning(lang === "fr" ? "Livreur suspendu" : "Driver suspended"); setConfirm(null); };
  const reactivateDriver = (id) => { setDrivers(prev => prev.map(d => d.id === id ? { ...d, status: "active" } : d)); toast.success(lang === "fr" ? "Livreur réactivé" : "Driver reactivated"); };

  const toggleZone = (driverId, zone) => {
    setDrivers(prev => prev.map(d => {
      if (d.id !== driverId) return d;
      const zones = d.zones.includes(zone) ? d.zones.filter(z => z !== zone) : [...d.zones, zone];
      return { ...d, zones };
    }));
    if (zoneModal) {
      const d = drivers.find(d => d.id === driverId);
      if (d) {
        const zones = d.zones.includes(zone) ? d.zones.filter(z => z !== zone) : [...d.zones, zone];
        setZoneModal({ ...d, zones });
      }
    }
  };

  const approveDoc = (driverId, docKey) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, docs: { ...d.docs, [docKey]: true } } : d));
    if (docsModal?.id === driverId) setDocsModal(prev => ({ ...prev, docs: { ...prev.docs, [docKey]: true } }));
    toast.success(lang === "fr" ? "Document approuvé" : "Document approved");
  };

  const rejectDoc = (driverId, docKey) => {
    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, docs: { ...d.docs, [docKey]: false } } : d));
    if (docsModal?.id === driverId) setDocsModal(prev => ({ ...prev, docs: { ...prev.docs, [docKey]: false } }));
    toast.warning(lang === "fr" ? "Document rejeté" : "Document rejected");
  };

  const docCount = (docs) => Object.values(docs).filter(Boolean).length;

  return (
    <div className="fade-in">
      <h1 className="page-title">{t("drivers")}</h1>
      <p className="page-subtitle">{counts.active} {lang === "fr" ? "actifs" : "active"} · {counts.pending} {lang === "fr" ? "en attente" : "pending"}</p>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          [<Bike size={20} />, counts.all, t("all"), "all"],
          [<CheckCircle size={20} />, counts.active, lang === "fr" ? "Actifs" : "Active", "active"],
          [<Clock size={20} />, counts.pending, lang === "fr" ? "En attente" : "Pending", "pending"],
          [<Pause size={20} />, counts.suspended, lang === "fr" ? "Suspendus" : "Suspended", "suspended"],
        ].map(([ic, v, l, target], i) => (
          <div key={i} className="stat-card" style={{ padding: 14, cursor: "pointer", borderColor: tab === target ? "var(--primary)" : undefined }} onClick={() => setTab(target)}>
            <div style={{ fontSize: 20 }}>{ic}</div><div style={{ fontSize: 20, fontWeight: 800 }}>{v}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>{l}</div>
          </div>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder={lang === "fr" ? "Rechercher par nom, téléphone..." : "Search by name, phone..."} />

      <div className="card">
        {filtered.length === 0 ? <EmptyState icon={<Bike size={40} />} title={lang === "fr" ? "Aucun livreur" : "No drivers"} /> : (
          <div className="data-table-wrapper"><table className="data-table"><thead><tr>
            <th>{lang === "fr" ? "Livreur" : "Driver"}</th><th>{lang === "fr" ? "Véhicule" : "Vehicle"}</th>
            <th><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={14} /> Zones</span></th>
            <th><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><FileText size={14} /> Docs</span></th>
            <th><Star size={14} /></th><th>{t("status")}</th><th>Actions</th>
          </tr></thead><tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td><div style={{ fontWeight: 600 }}>{d.name}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>{d.phone}</div></td>
                <td style={{ fontSize: 12 }}>{d.vehicle}<br /><span style={{ color: "var(--text-3)" }}>{d.plate}</span></td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => setZoneModal(d)} title={lang === "fr" ? "Gérer les zones" : "Manage zones"}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Map size={14} /> {d.zones.length}/{ALL_ZONES.length}</span>
                  </button>
                </td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => setDocsModal(d)}
                    style={{ color: docCount(d.docs) === 4 ? "var(--success)" : docCount(d.docs) >= 2 ? "var(--warning)" : "var(--danger)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><FileText size={14} /> {docCount(d.docs)}/4</span>
                  </button>
                </td>
                <td>{d.rating > 0 ? d.rating : "—"}</td>
                <td><StatusBadge status={d.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => setDetail(d)}><Eye size={15} /></button>
                    {d.status === "pending" && <button className="btn btn-sm btn-success" onClick={() => approveDriver(d.id)}>✓</button>}
                    {d.status === "active" && <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => setConfirm(d)}><Pause size={15} /></button>}
                    {d.status === "suspended" && <button className="btn btn-sm btn-success" onClick={() => reactivateDriver(d.id)}><Play size={15} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table></div>
        )}
      </div>

      {/* ═══ ZONE ASSIGNMENT MODAL ═══ */}
      {zoneModal && (
        <div className="modal-overlay" onClick={() => setZoneModal(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Map size={18} /> Zones — {zoneModal.name}</span></h3>
              <button className="modal-close" onClick={() => setZoneModal(null)}><XIcon size={16} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 16 }}>
                {lang === "fr" ? "Sélectionnez les zones où ce livreur peut effectuer des livraisons :" : "Select zones where this driver can deliver:"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {ALL_ZONES.map(zone => {
                  const active = zoneModal.zones.includes(zone);
                  return (
                    <button key={zone} onClick={() => {
                      const zones = active ? zoneModal.zones.filter(z => z !== zone) : [...zoneModal.zones, zone];
                      setZoneModal({ ...zoneModal, zones });
                      toggleZone(zoneModal.id, zone);
                    }} style={{
                      padding: "10px 14px", borderRadius: 10, border: `2px solid ${active ? "var(--primary)" : "var(--border)"}`,
                      background: active ? "var(--primary-light)" : "var(--surface)", cursor: "pointer",
                      fontFamily: "inherit", fontSize: 13, fontWeight: active ? 700 : 400,
                      color: active ? "var(--primary)" : "var(--text-2)", transition: "all 0.15s",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      <span style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${active ? "var(--primary)" : "var(--border)"}`, background: active ? "var(--primary)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800 }}>
                        {active ? "✓" : ""}
                      </span>
                      {zone}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, fontSize: 12, color: "var(--text-3)" }}>
                {lang === "fr" ? `${zoneModal.zones.length} zone(s) assignée(s)` : `${zoneModal.zones.length} zone(s) assigned`}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => { setZoneModal(null); toast.success(lang === "fr" ? "Zones mises à jour" : "Zones updated"); }}>
                ✓ {lang === "fr" ? "Terminé" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DOCUMENTS VIEWER MODAL ═══ */}
      {docsModal && (
        <div className="modal-overlay" onClick={() => setDocsModal(null)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><FileText size={18} /> Documents — {docsModal.name}</span></h3>
              <button className="modal-close" onClick={() => setDocsModal(null)}><XIcon size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <StatusBadge status={docsModal.status} />
                <span style={{ fontSize: 13, color: "var(--text-3)" }}>{docCount(docsModal.docs)}/4 {lang === "fr" ? "documents vérifiés" : "documents verified"}</span>
              </div>
              {Object.entries(DOC_LABELS[lang] || DOC_LABELS.fr).filter(([k]) => ["id_card", "license", "insurance", "photo"].includes(k)).map(([key, label]) => {
                const driverDocs = DRIVER_DOCS[docsModal.id] || {};
                const doc = driverDocs[key];
                const verified = doc?.verified;
                return (
                  <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14, background: verified ? "var(--success-light)" : "var(--surface-2)", borderRadius: 12, marginBottom: 8, border: verified ? "1px solid rgba(16,185,129,0.2)" : "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 24 }}>{DOC_ICONS[key]}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{label}</div>
                        <div style={{ fontSize: 11, color: "var(--text-3)" }}>
                          {doc?.name || "—"} · {doc?.size || "—"} · {doc?.date || "—"}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {verified ? (
                        <span className="badge badge-success">✓ {lang === "fr" ? "Vérifié" : "Verified"}</span>
                      ) : doc?.file ? (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => approveDoc(docsModal.id, key)}>✓</button>
                          <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => rejectDoc(docsModal.id, key)}>✗</button>
                        </>
                      ) : (
                        <span className="badge badge-danger">✗ {lang === "fr" ? "Manquant" : "Missing"}</span>
                      )}
                      {doc?.file && (
                        <button className="btn btn-sm btn-outline" title={lang === "fr" ? "Voir le document" : "View document"} onClick={() => setDocPreview(doc)}><Eye size={15} /></button>
                      )}
                    </div>
                  </div>
                );
              })}
              {docCount(docsModal.docs) < 4 && (
                <div style={{ padding: 12, background: "var(--warning-light)", borderRadius: 10, fontSize: 12, marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={14} /> {lang === "fr" ? `${4 - docCount(docsModal.docs)} document(s) manquant(s) ou non vérifié(s)` : `${4 - docCount(docsModal.docs)} document(s) missing or unverified`}
                </div>
              )}
            </div>
            <div className="modal-footer">
              {docsModal.status === "pending" && docCount(docsModal.docs) === 4 && (
                <button className="btn btn-success" onClick={() => { approveDriver(docsModal.id); setDocsModal(null); }}>
                  ✓ {lang === "fr" ? "Approuver le livreur" : "Approve Driver"}
                </button>
              )}
              <button className="btn btn-outline" onClick={() => setDocsModal(null)}>{lang === "fr" ? "Fermer" : "Close"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      <DetailDrawer open={!!detail} onClose={() => setDetail(null)} title={detail?.name}
        footer={detail && (<>
          {detail.status === "pending" && <button className="btn btn-success" onClick={() => { approveDriver(detail.id); setDetail(null); }}>✓ {t("approve")}</button>}
          {detail.status === "active" && <button className="btn btn-outline" style={{ color: "var(--danger)" }} onClick={() => { setConfirm(detail); setDetail(null); }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Pause size={15} /> {t("suspend")}</span></button>}
          {detail.status === "suspended" && <button className="btn btn-success" onClick={() => { reactivateDriver(detail.id); setDetail(null); }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Play size={15} /> {t("reactivate")}</span></button>}
        </>)}>
        {detail && (<div>
          <StatusBadge status={detail.status} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            <div><div className="form-label">{lang === "fr" ? "Téléphone" : "Phone"}</div><div style={{ fontWeight: 600 }}>{detail.phone}</div></div>
            <div><div className="form-label">{lang === "fr" ? "Véhicule" : "Vehicle"}</div><div style={{ fontWeight: 600 }}>{detail.vehicle}</div></div>
            <div><div className="form-label">Plaque</div><div style={{ fontWeight: 600 }}>{detail.plate}</div></div>
            <div><div className="form-label"><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Star size={14} /> Rating</span></div><div style={{ fontWeight: 600 }}>{detail.rating || "—"}</div></div>
            <div><div className="form-label">{lang === "fr" ? "Livraisons" : "Deliveries"}</div><div style={{ fontWeight: 700, fontSize: 18 }}>{detail.deliveries}</div></div>
            <div><div className="form-label">{lang === "fr" ? "Gains" : "Earnings"}</div><div style={{ fontWeight: 700, fontSize: 18 }}>{fmtCFA(detail.earnings)}</div></div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="form-label"><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><MapPin size={14} /> Zones</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {detail.zones.length > 0 ? detail.zones.map(z => <span key={z} className="badge badge-info">{z}</span>) : <span style={{ color: "var(--text-3)", fontSize: 13 }}>—</span>}
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div className="form-label"><span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><FileText size={14} /> Documents ({docCount(detail.docs)}/4)</span></div>
            {Object.entries(DOC_LABELS[lang] || DOC_LABELS.fr).map(([key, label]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13 }}>{label}</span>
                <span style={{ fontWeight: 700, color: detail.docs[key] ? "var(--success)" : "var(--danger)" }}>{detail.docs[key] ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
        </div>)}
      </DetailDrawer>

      <DocumentViewer open={!!docPreview} onClose={() => setDocPreview(null)} doc={docPreview} lang={lang} />

      <ConfirmModal open={!!confirm} title={lang === "fr" ? "Suspendre ce livreur ?" : "Suspend this driver?"} message={confirm?.name} danger confirmText={t("suspend")} onConfirm={() => suspendDriver(confirm?.id)} onCancel={() => setConfirm(null)} />
    </div>
  );
}
