import { useState, useMemo } from "react";
import { Users, ShoppingBag, Store, Bike, KeyRound, Eye, Lock, Unlock, X as XIcon } from "lucide-react";
import { useI18n } from "../i18n";
import { ALL_USERS } from "../data";
import { useToast, ConfirmModal, Pagination, SearchBar, StatusBadge, DetailDrawer, EmptyState, AddUserModal } from "../components/UI";

const ROLE_BADGE = { client: "badge-info", vendor: "badge-primary", driver: "badge-success", admin: "badge-warning" };
const PER_PAGE = 8;

// Extended user data for detail
const USERS_EXT = [
  ...ALL_USERS,
  { id: "u6", name: "Mama Ngudi", email: "mamangudi@mail.com", phone: "+242 06 888 111", role: "vendor", status: "active", orders: 567, lastActive: "Aujourd'hui", shop: "Chez Mama Ngudi", plan: "pro", revenue: 620000 },
  { id: "u7", name: "Pierre Loutaya", email: "pierre@mail.com", phone: "+242 06 222 333", role: "vendor", status: "active", orders: 890, lastActive: "Aujourd'hui", shop: "Supermarché Central", plan: "enterprise", revenue: 1500000 },
  { id: "u8", name: "Aminata Diallo", email: "aminata@mail.com", phone: "+242 06 444 555", role: "client", status: "active", orders: 34, lastActive: "Hier" },
  { id: "u9", name: "Bruno Mpassi", email: "bruno@mail.com", phone: "+242 06 666 777", role: "client", status: "active", orders: 12, lastActive: "26 Fév" },
  { id: "u10", name: "Joeldy Tsina", email: "joeldytsina94@gmail.com", phone: "+242 064663469", role: "admin", status: "active", orders: 0, lastActive: "Aujourd'hui" },
];

export default function UsersPage() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const [users, setUsers] = useState(USERS_EXT);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [banConfirm, setBanConfirm] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);

  const counts = useMemo(() => ({
    all: users.length,
    client: users.filter(u => u.role === "client").length,
    vendor: users.filter(u => u.role === "vendor").length,
    driver: users.filter(u => u.role === "driver").length,
    admin: users.filter(u => u.role === "admin").length,
  }), [users]);

  const filtered = useMemo(() => {
    let list = tab === "all" ? users : users.filter(u => u.role === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q));
    }
    return list;
  }, [users, tab, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleBan = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id !== id) return u;
      const newStatus = u.status === "banned" ? "active" : "banned";
      return { ...u, status: newStatus };
    }));
    const user = users.find(u => u.id === id);
    const wasBanned = user?.status === "banned";
    toast.success(wasBanned
      ? (lang === "fr" ? `${user.name} débanni` : `${user.name} unbanned`)
      : (lang === "fr" ? `${user.name} banni` : `${user.name} banned`)
    );
    setBanConfirm(null);
  };

  return (
    <div className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h1 className="page-title">{t("users")}</h1>
        <button className="btn btn-primary" onClick={() => setShowAddUser(true)}>+ {lang === "fr" ? "Ajouter un utilisateur" : "Add User"}</button>
      </div>
      <p className="page-subtitle">{counts.all} {lang === "fr" ? "utilisateurs au total" : "total users"}</p>

      {/* Role counts */}
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          [<Users size={20} />, counts.all, t("all"), "all"],
          [<ShoppingBag size={20} />, counts.client, "Clients", "client"],
          [<Store size={20} />, counts.vendor, lang === "fr" ? "Commerçants" : "Vendors", "vendor"],
          [<Bike size={20} />, counts.driver, lang === "fr" ? "Livreurs" : "Drivers", "driver"],
          [<KeyRound size={20} />, counts.admin, "Admins", "admin"],
        ].map(([ic, v, l, target], i) => (
          <div key={i} className="stat-card" style={{ padding: 14, cursor: "pointer", borderColor: tab === target ? "var(--primary)" : undefined }} onClick={() => { setTab(target); setPage(1); }}>
            <div style={{ marginBottom: 4 }}>{ic}</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 11, color: "var(--text-3)" }}>{l}</div>
          </div>
        ))}
      </div>

      <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder={lang === "fr" ? "Rechercher par nom, email, téléphone..." : "Search by name, email, phone..."} />

      <div className="card">
        {paginated.length === 0 ? (
          <EmptyState icon={<Users size={40} />} title={t("noResults")} />
        ) : (
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{lang === "fr" ? "Nom" : "Name"}</th>
                  <th>{t("email")}</th>
                  <th>{t("phone")}</th>
                  <th>{t("role")}</th>
                  <th>{t("status")}</th>
                  <th>{lang === "fr" ? "Activité" : "Activity"}</th>
                  <th>{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ fontSize: 12, color: "var(--text-2)" }}>{u.email}</td>
                    <td style={{ fontSize: 12, fontFamily: "var(--font-mono)" }}>{u.phone}</td>
                    <td><span className={`badge ${ROLE_BADGE[u.role]}`}>{u.role}</span></td>
                    <td><StatusBadge status={u.status} label={u.status === "active" ? (lang === "fr" ? "Actif" : "Active") : u.status === "banned" ? (lang === "fr" ? "Banni" : "Banned") : u.status} /></td>
                    <td style={{ fontSize: 12, color: "var(--text-3)" }}>{u.lastActive}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-sm btn-ghost" onClick={() => setDetail(u)}><Eye size={15} /></button>
                        {u.role !== "admin" && (
                          <button
                            className={`btn btn-sm ${u.status === "banned" ? "btn-success" : "btn-danger"}`}
                            onClick={() => setBanConfirm(u)}
                          >
                            {u.status === "banned" ? t("unban") : t("ban")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />
      </div>

      {/* User detail drawer */}
      <DetailDrawer open={!!detail} onClose={() => setDetail(null)} title={detail?.name}>
        {detail && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <span className={`badge ${ROLE_BADGE[detail.role]}`}>{detail.role}</span>
              <StatusBadge status={detail.status} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div>
                <div className="form-label">{t("email")}</div>
                <div style={{ fontSize: 13, wordBreak: "break-all" }}>{detail.email}</div>
              </div>
              <div>
                <div className="form-label">{t("phone")}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{detail.phone}</div>
              </div>
              <div>
                <div className="form-label">{lang === "fr" ? "Commandes" : "Orders"}</div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>{detail.orders}</div>
              </div>
              <div>
                <div className="form-label">{lang === "fr" ? "Dernière activité" : "Last Active"}</div>
                <div style={{ fontSize: 13 }}>{detail.lastActive}</div>
              </div>
            </div>

            {detail.role === "vendor" && (
              <div style={{ background: "var(--surface-2)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                <div className="form-label">{lang === "fr" ? "Établissement" : "Shop"}</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{detail.shop}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className={`badge ${detail.plan === "enterprise" ? "badge-warning" : detail.plan === "pro" ? "badge-primary" : "badge-info"}`}>{detail.plan}</span>
                  {detail.revenue && <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13 }}>{detail.revenue.toLocaleString("fr-FR")} F</span>}
                </div>
              </div>
            )}

            {detail.role !== "admin" && (
              <div style={{ marginTop: 16 }}>
                <button
                  className={`btn ${detail.status === "banned" ? "btn-success" : "btn-danger"}`}
                  style={{ width: "100%" }}
                  onClick={() => { toggleBan(detail.id); setDetail({ ...detail, status: detail.status === "banned" ? "active" : "banned" }); }}
                >
                  {detail.status === "banned"
                    ? <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Unlock size={14} />{t("unban")}</span>
                    : <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Lock size={14} />{t("ban")}</span>
                  }
                </button>
              </div>
            )}
          </div>
        )}
      </DetailDrawer>

      <ConfirmModal
        open={!!banConfirm}
        title={banConfirm?.status === "banned" ? (lang === "fr" ? "Débannir cet utilisateur ?" : "Unban this user?") : (lang === "fr" ? "Bannir cet utilisateur ?" : "Ban this user?")}
        message={banConfirm?.name}
        confirmText={banConfirm?.status === "banned" ? t("unban") : t("ban")}
        danger={banConfirm?.status !== "banned"}
        onConfirm={() => toggleBan(banConfirm?.id)}
        onCancel={() => setBanConfirm(null)}
      />

      <AddUserModal
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
        lang={lang}
        onAdd={(newUser) => {
          setUsers(prev => [newUser, ...prev]);
          toast.success(lang === "fr" ? `${newUser.name} créé avec succès` : `${newUser.name} created successfully`);
        }}
      />
    </div>
  );
}
