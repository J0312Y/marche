import { useState, useMemo } from "react";
import { useI18n } from "../i18n";
import { ACTIVITY_LOG, ACTION_ICONS } from "../dataExtended";
import { Pagination, SearchBar, EmptyState } from "../components/UI";
import { ClipboardList, User, Clock, FileText } from "lucide-react";

const ACTION_LABELS = {
  fr: { approve_vendor: "Commerçant approuvé", approve_withdrawal: "Retrait approuvé", suspend_vendor: "Commerçant suspendu", delete_review: "Avis supprimé", remove_article: "Article retiré", approve_plan: "Plan approuvé", ban_user: "Utilisateur banni", update_settings: "Paramètres modifiés", send_notification: "Notification envoyée", approve_driver: "Livreur approuvé", reject_vendor: "Commerçant rejeté", unban_user: "Utilisateur débanni" },
  en: { approve_vendor: "Vendor approved", approve_withdrawal: "Withdrawal approved", suspend_vendor: "Vendor suspended", delete_review: "Review deleted", remove_article: "Article removed", approve_plan: "Plan approved", ban_user: "User banned", update_settings: "Settings updated", send_notification: "Notification sent", approve_driver: "Driver approved", reject_vendor: "Vendor rejected", unban_user: "User unbanned" },
};

const ACTION_BADGE = {
  approve_vendor: "badge-success", approve_withdrawal: "badge-success", approve_driver: "badge-success",
  approve_plan: "badge-success", unban_user: "badge-success",
  suspend_vendor: "badge-danger", ban_user: "badge-danger", remove_article: "badge-danger",
  delete_review: "badge-danger", reject_vendor: "badge-danger",
  update_settings: "badge-info", send_notification: "badge-info",
};

const PER_PAGE = 8;

export default function ActivityLogPage() {
  const { lang } = useI18n();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  const actionTypes = useMemo(() => {
    const types = new Set(ACTIVITY_LOG.map(a => a.action));
    return ["all", ...types];
  }, []);

  const filtered = useMemo(() => {
    let list = ACTIVITY_LOG;
    if (filter !== "all") list = list.filter(a => a.action === filter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => a.target.toLowerCase().includes(q) || a.detail.toLowerCase().includes(q) || a.admin.toLowerCase().includes(q));
    }
    return list;
  }, [filter, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="fade-in">
      <h1 className="page-title">{lang === "fr" ? "Journal d'activité" : "Activity Log"}</h1>
      <p className="page-subtitle">{lang === "fr" ? "Historique de toutes les actions admin" : "History of all admin actions"}</p>

      <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder={lang === "fr" ? "Rechercher dans les logs..." : "Search logs..."}>
        <select
          className="form-input"
          style={{ maxWidth: 220, cursor: "pointer" }}
          value={filter}
          onChange={e => { setFilter(e.target.value); setPage(1); }}
        >
          <option value="all">{lang === "fr" ? "Toutes les actions" : "All actions"}</option>
          {actionTypes.filter(a => a !== "all").map(a => (
            <option key={a} value={a}>{ACTION_LABELS[lang]?.[a] || a}</option>
          ))}
        </select>
      </SearchBar>

      <div className="card">
        {paginated.length === 0 ? (
          <EmptyState icon={<ClipboardList size={40} />} title={lang === "fr" ? "Aucun log trouvé" : "No logs found"} />
        ) : (
          <div style={{ padding: 0 }}>
            {paginated.map(log => (
              <div key={log.id} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 20px", borderBottom: "1px solid var(--border)", transition: "background 0.15s" }}>
                {/* Timeline dot */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 2 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)" }}>
                    <FileText size={16} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span className={`badge ${ACTION_BADGE[log.action] || "badge-neutral"}`}>
                      {ACTION_LABELS[lang]?.[log.action] || log.action}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{log.target}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-2)", marginBottom: 4 }}>{log.detail}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", display: "flex", gap: 12 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><User size={11} /> {log.admin}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {log.date}</span>
                    <span style={{ fontFamily: "var(--font-mono)" }}>IP: {log.ip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} lang={lang} />
      </div>
    </div>
  );
}
