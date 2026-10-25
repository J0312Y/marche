import { useState, useMemo } from "react";
import { useI18n } from "../i18n";
import { ALL_ORDERS } from "../dataExtended";
import { ALL_DRIVERS } from "../dataExtended";
import { fmtCFA } from "../data";
import { useToast, ConfirmModal, Pagination, SearchBar, StatusBadge, DetailDrawer, EmptyState, DateRangePicker, ExportButtons, BulkBar } from "../components/UI";
import { Package, Sparkles, ChefHat, Truck, CheckCircle, Bike, Eye, Star, X as XIcon } from "lucide-react";

const STATUS_FLOW = { new: "preparing", preparing: "shipped", shipped: "delivered" };
const STATUS_LABELS = { fr: { new: "Nouvelle", preparing: "En préparation", shipped: "En livraison", delivered: "Livrée", cancelled: "Annulée" }, en: { new: "New", preparing: "Preparing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" } };
const PER_PAGE = 6;
const ZONES = ["Bacongo", "Poto-Poto", "Moungali", "Ouenzé", "Talangaï", "Mfilou", "Makélékélé"];

export default function OrdersPage() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());

  const counts = useMemo(() => ({ all: orders.length, new: orders.filter(o => o.status === "new").length, preparing: orders.filter(o => o.status === "preparing").length, shipped: orders.filter(o => o.status === "shipped").length, delivered: orders.filter(o => o.status === "delivered").length, cancelled: orders.filter(o => o.status === "cancelled").length }), [orders]);

  const filtered = useMemo(() => {
    let list = tab === "all" ? orders : orders.filter(o => o.status === tab);
    if (search) { const q = search.toLowerCase(); list = list.filter(o => o.ref.toLowerCase().includes(q) || o.client.toLowerCase().includes(q) || o.vendor.toLowerCase().includes(q)); }
    if (zoneFilter !== "all") list = list.filter(o => o.zone === zoneFilter);
    if (startDate) list = list.filter(o => o.date >= startDate);
    if (endDate) list = list.filter(o => o.date <= endDate + "T23:59");
    return list;
  }, [orders, tab, search, zoneFilter, startDate, endDate]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const advanceStatus = (id) => { setOrders(prev => prev.map(o => o.id === id && STATUS_FLOW[o.status] ? { ...o, status: STATUS_FLOW[o.status] } : o)); toast.success(lang === "fr" ? "Statut mis à jour" : "Status updated"); };
  const cancelOrder = (id) => { setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "cancelled" } : o)); setCancelConfirm(null); toast.success(lang === "fr" ? "Commande annulée" : "Order cancelled"); };
  const assignDriver = (orderId, driverName) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, driver: driverName, status: o.status === "new" ? "preparing" : o.status } : o)); setAssignModal(null); toast.success(lang === "fr" ? `Livreur ${driverName} assigné` : `Driver ${driverName} assigned`); };

  const toggleSelect = (id) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const bulkAdvance = () => { selected.forEach(id => advanceStatus(id)); setSelected(new Set()); };

  const exportData = filtered.map(o => ({ ref: o.ref, client: o.client, vendor: o.vendor, total: o.total, zone: o.zone, status: o.status, date: o.date, driver: o.driver || "—" }));

  const availableDrivers = ALL_DRIVERS.filter(d => d.status === "active" && d.available);

  return (
    <div className="fade-in">
      <h1 className="page-title">{t("orders")}</h1>
      <p className="page-subtitle">{counts.new} {lang === "fr" ? "nouvelles" : "new"} · {counts.preparing} {lang === "fr" ? "en préparation" : "preparing"}</p>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[[<Package size={20} />, counts.all, t("all")], [<Sparkles size={20} />, counts.new, lang === "fr" ? "Nouvelles" : "New"], [<ChefHat size={20} />, counts.preparing, lang === "fr" ? "Préparation" : "Preparing"], [<Truck size={20} />, counts.shipped, lang === "fr" ? "Livraison" : "Shipping"], [<CheckCircle size={20} />, counts.delivered, lang === "fr" ? "Livrées" : "Delivered"]].map(([ic, v, l], i) => (
          <div key={i} className="stat-card" style={{ padding: 14, cursor: "pointer" }} onClick={() => { setTab(i === 0 ? "all" : ["", "new", "preparing", "shipped", "delivered"][i]); setPage(1); }}>
            <div style={{ marginBottom: 4, display: "flex", alignItems: "center" }}>{ic}</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{l}</div>
          </div>
        ))}
      </div>

      <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder={lang === "fr" ? "Rechercher par réf, client, vendeur..." : "Search by ref, client, vendor..."}>
        <select className="form-input" style={{ maxWidth: 150, padding: "6px 10px", fontSize: 12, cursor: "pointer" }} value={zoneFilter} onChange={e => { setZoneFilter(e.target.value); setPage(1); }}>
          <option value="all">{lang === "fr" ? "Toutes zones" : "All zones"}</option>
          {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
        <DateRangePicker startDate={startDate} endDate={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
        <ExportButtons data={exportData} filename="commandes-lamuka" columns={["ref", "client", "vendor", "total", "zone", "status", "date", "driver"]} lang={lang} />
      </SearchBar>

      <BulkBar selected={selected.size} total={filtered.length} onSelectAll={() => setSelected(new Set(filtered.map(o => o.id)))} onClear={() => setSelected(new Set())} lang={lang}>
        <button className="btn btn-sm btn-primary" onClick={bulkAdvance}>→ {lang === "fr" ? "Avancer statut" : "Advance Status"}</button>
      </BulkBar>

      <div className="card">
        {paginated.length === 0 ? (
          <EmptyState title={lang === "fr" ? "Aucune commande" : "No orders"} subtitle={search ? (lang === "fr" ? "Essayez d'autres termes" : "Try different terms") : undefined} />
        ) : (
          <div className="data-table-wrapper"><table className="data-table"><thead><tr>
            <th style={{ width: 30 }}><input type="checkbox" checked={paginated.length > 0 && paginated.every(o => selected.has(o.id))} onChange={e => { const ids = paginated.map(o => o.id); setSelected(prev => { const s = new Set(prev); if (e.target.checked) ids.forEach(id => s.add(id)); else ids.forEach(id => s.delete(id)); return s; }); }} /></th>
            <th>Réf</th><th>Client</th><th>{lang === "fr" ? "Commerçant" : "Vendor"}</th><th>Total</th><th>Zone</th><th>{lang === "fr" ? "Livreur" : "Driver"}</th><th>{t("status")}</th><th>Actions</th>
          </tr></thead><tbody>
            {paginated.map(o => (
              <tr key={o.id}>
                <td><input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleSelect(o.id)} /></td>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 12 }}>{o.ref}</td>
                <td><div style={{ fontWeight: 600, fontSize: 13 }}>{o.client}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>{o.phone}</div></td>
                <td style={{ fontSize: 13 }}>{o.vendor}</td>
                <td style={{ fontWeight: 700, fontFamily: "var(--font-mono)", fontSize: 13 }}>{fmtCFA(o.total)}</td>
                <td><span className="badge badge-neutral">{o.zone}</span></td>
                <td>
                  {o.driver ? <span style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Bike size={14} /> {o.driver}</span> :
                    o.status !== "cancelled" && o.status !== "delivered" ? <button className="btn btn-sm btn-outline" style={{ fontSize: 11 }} onClick={() => setAssignModal(o)}>+ {lang === "fr" ? "Assigner" : "Assign"}</button> : <span style={{ color: "var(--text-3)", fontSize: 12 }}>—</span>
                  }
                </td>
                <td><StatusBadge status={o.status} label={STATUS_LABELS[lang]?.[o.status] || o.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-sm btn-ghost" onClick={() => setDetail(o)}><Eye size={15} /></button>
                    {STATUS_FLOW[o.status] && <button className="btn btn-sm btn-primary" onClick={() => advanceStatus(o.id)}>→</button>}
                    {o.status !== "cancelled" && o.status !== "delivered" && <button className="btn btn-sm btn-ghost" style={{ color: "var(--danger)" }} onClick={() => setCancelConfirm(o)}>✗</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table></div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />
      </div>

      {/* Order Detail Drawer */}
      <DetailDrawer open={!!detail} onClose={() => setDetail(null)} title={detail?.ref}
        footer={detail && STATUS_FLOW[detail.status] && <button className="btn btn-primary" onClick={() => { advanceStatus(detail.id); setDetail({ ...detail, status: STATUS_FLOW[detail.status] }); }}>→ {STATUS_LABELS[lang]?.[STATUS_FLOW[detail.status]]}</button>}>
        {detail && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <StatusBadge status={detail.status} label={STATUS_LABELS[lang]?.[detail.status]} />
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>{detail.date}</span>
            </div>
            {/* Timeline */}
            <div style={{ marginBottom: 24 }}>
              {["new", "preparing", "shipped", "delivered"].map((s, i, arr) => {
                const idx = arr.indexOf(detail.status);
                const done = i <= idx; const active = i === idx;
                return (<div key={s} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 8 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? "var(--success)" : "var(--surface-2)", border: active ? "2px solid var(--primary)" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: done ? "#fff" : "var(--text-3)" }}>{done ? "✓" : i + 1}</div>
                    {i < 3 && <div style={{ width: 2, height: 16, background: done ? "var(--success)" : "var(--border)" }} />}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: done ? "var(--text)" : "var(--text-3)", paddingTop: 2 }}>{STATUS_LABELS[lang]?.[s]}</div>
                </div>);
              })}
            </div>
            <div className="form-label">Client</div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>{detail.client}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>{detail.phone} · {detail.zone}</div>
            <div className="form-label">{lang === "fr" ? "Articles" : "Items"}</div>
            {detail.items.map((item, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}><span style={{ fontSize: 13 }}>{item.name} × {item.qty}</span><span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", fontSize: 12 }}>{fmtCFA(item.price * item.qty)}</span></div>))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontWeight: 800, fontSize: 16, borderTop: "2px solid var(--border)", marginTop: 4 }}><span>Total</span><span>{fmtCFA(detail.total + detail.delivery_fee)}</span></div>
            {detail.driver && <div style={{ marginTop: 16 }}><div className="form-label">{lang === "fr" ? "Livreur" : "Driver"}</div><div style={{ fontWeight: 600 }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Bike size={14} /> {detail.driver}</span></div></div>}
          </div>
        )}
      </DetailDrawer>

      {/* Assign Driver Modal */}
      {assignModal && (
        <div className="modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3><span style={{ display: "flex", alignItems: "center", gap: 6 }}><Bike size={18} /> {lang === "fr" ? "Assigner un livreur" : "Assign Driver"}</span></h3><button className="modal-close" onClick={() => setAssignModal(null)}><XIcon size={16} /></button></div>
            <div className="modal-body">
              <p style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 16 }}>{assignModal.ref} — {assignModal.client}</p>
              {availableDrivers.length === 0 ? (
                <EmptyState icon={<Bike size={40} />} title={lang === "fr" ? "Aucun livreur disponible" : "No drivers available"} />
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {availableDrivers.map(d => (
                    <button key={d.id} className="btn btn-outline" style={{ justifyContent: "flex-start", padding: "12px 14px" }} onClick={() => assignDriver(assignModal.id, d.name)}>
                      <span style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><Bike size={14} /> {d.name}</span>
                      <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 8, display: "flex", alignItems: "center", gap: 2 }}>{d.vehicle} · <Star size={12} />{d.rating} · {d.zones.join(", ")}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal open={!!cancelConfirm} title={lang === "fr" ? "Annuler cette commande ?" : "Cancel this order?"} message={cancelConfirm ? `${cancelConfirm.ref} — ${cancelConfirm.client}` : ""} confirmText={lang === "fr" ? "Annuler la commande" : "Cancel Order"} danger onConfirm={() => cancelOrder(cancelConfirm?.id)} onCancel={() => setCancelConfirm(null)} />
    </div>
  );
}
