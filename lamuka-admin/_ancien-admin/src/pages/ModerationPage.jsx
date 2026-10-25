import { useState, useMemo } from "react";
import { useI18n } from "../i18n";
import { REPORTED_ARTICLES, REPORTED_REVIEWS, SUPPORT_TICKETS } from "../data";
import { useToast, ConfirmModal, StatusBadge, EmptyState, DetailDrawer, SupportThread, BulkBar } from "../components/UI";
import { Trash2, Shield, Star, MessageSquare, Check, Package } from "lucide-react";

const PRIO_BADGE = { high: "badge-danger", medium: "badge-warning", low: "badge-info" };
const STATUS_BADGE = { open: "badge-danger", in_progress: "badge-warning", closed: "badge-success" };

const TICKET_THREADS = {
  st1: [
    { from: "client", sender: "Celine Nzaba", text: "Bonjour, je souhaite un remboursement pour la commande #LMK-0889. L'article ne correspond pas à la description.", time: "10:30" },
    { from: "admin", sender: "Admin", text: "Bonjour Celine, nous avons bien reçu votre demande. Pouvez-vous nous envoyer une photo du produit reçu ?", time: "11:15" },
    { from: "client", sender: "Celine Nzaba", text: "Voici la photo. Comme vous pouvez voir, c'est complètement différent.", time: "11:30" },
  ],
  st2: [
    { from: "vendor", sender: "David Nsonde", text: "Mon compte est bloqué depuis ce matin. Je ne peux plus accéder à mon tableau de bord.", time: "08:00" },
  ],
  st3: [
    { from: "client", sender: "Paul Mokoko", text: "Le livreur a pris ma commande il y a 2h et ne répond plus.", time: "14:00" },
    { from: "admin", sender: "Admin", text: "Nous avons contacté le livreur. Il a eu un problème de véhicule.", time: "14:30" },
    { from: "admin", sender: "Admin", text: "Un nouveau livreur va prendre en charge votre commande.", time: "15:00" },
    { from: "client", sender: "Paul Mokoko", text: "OK merci. Quand est-ce que je serai livré ?", time: "15:15" },
    { from: "admin", sender: "Admin", text: "D'ici 30 minutes maximum. Nous vous tenons informé.", time: "15:20" },
  ],
  st4: [
    { from: "vendor", sender: "Mama Ngudi", text: "Bonjour, je suis en plan Pro et je voudrais savoir comment ajouter un deuxième magasin.", time: "09:00" },
  ],
};

export default function ModerationPage() {
  const { t, lang } = useI18n();
  const toast = useToast();
  const [tab, setTab] = useState("articles");
  const [articles, setArticles] = useState(REPORTED_ARTICLES);
  const [reviews, setReviews] = useState(REPORTED_REVIEWS);
  const [tickets, setTickets] = useState(SUPPORT_TICKETS);
  const [threads, setThreads] = useState(TICKET_THREADS);
  const [threadDetail, setThreadDetail] = useState(null);
  const [articlePreview, setArticlePreview] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedArticles, setSelectedArticles] = useState(new Set());

  const dismissArticle = (id) => { setArticles(prev => prev.filter(a => a.id !== id)); toast.info(lang === "fr" ? "Signalement ignoré" : "Report dismissed"); };
  const removeArticle = (id) => { setArticles(prev => prev.filter(a => a.id !== id)); toast.success(lang === "fr" ? "Article retiré" : "Article removed"); setConfirmAction(null); };
  const dismissReview = (id) => { setReviews(prev => prev.filter(r => r.id !== id)); toast.info(lang === "fr" ? "Signalement ignoré" : "Report dismissed"); };
  const deleteReview = (id) => { setReviews(prev => prev.filter(r => r.id !== id)); toast.success(lang === "fr" ? "Avis supprimé" : "Review deleted"); setConfirmAction(null); };
  const resolveTicket = (id) => { setTickets(prev => prev.map(tk => tk.id === id ? { ...tk, status: "closed" } : tk)); toast.success(lang === "fr" ? "Ticket résolu" : "Ticket resolved"); };

  const sendThreadMessage = (text, attachment) => {
    if (!threadDetail) return;
    const msg = { from: "admin", sender: "Admin", text, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }), attachment: attachment || null };
    const key = threadDetail.id;
    setThreads(prev => ({ ...prev, [key]: [...(prev[key] || []), msg] }));
    // Mark as in_progress if open
    if (threadDetail.status === "open") {
      setTickets(prev => prev.map(tk => tk.id === key ? { ...tk, status: "in_progress" } : tk));
      setThreadDetail({ ...threadDetail, status: "in_progress" });
    }
  };

  const bulkRemoveArticles = () => { setArticles(prev => prev.filter(a => !selectedArticles.has(a.id))); setSelectedArticles(new Set()); toast.success(lang === "fr" ? `${selectedArticles.size} articles retirés` : `${selectedArticles.size} articles removed`); };

  return (
    <div className="fade-in">
      <h1 className="page-title">{t("moderation")}</h1>
      <p className="page-subtitle">{articles.length} {lang === "fr" ? "articles" : "articles"} · {reviews.length} {lang === "fr" ? "avis" : "reviews"} · {tickets.filter(tk => tk.status !== "closed").length} tickets</p>

      <div className="tab-bar">
        <button className={`tab-btn ${tab === "articles" ? "active" : ""}`} onClick={() => setTab("articles")}>
          {lang === "fr" ? "Articles signalés" : "Reported Articles"} {articles.length > 0 && <span className="badge badge-danger" style={{ marginLeft: 6 }}>{articles.length}</span>}
        </button>
        <button className={`tab-btn ${tab === "reviews" ? "active" : ""}`} onClick={() => setTab("reviews")}>
          {lang === "fr" ? "Avis signalés" : "Reported Reviews"} {reviews.length > 0 && <span className="badge badge-warning" style={{ marginLeft: 6 }}>{reviews.length}</span>}
        </button>
        <button className={`tab-btn ${tab === "tickets" ? "active" : ""}`} onClick={() => setTab("tickets")}>
          Tickets ({tickets.filter(tk => tk.status !== "closed").length})
        </button>
      </div>

      {/* ═══ REPORTED ARTICLES ═══ */}
      {tab === "articles" && (
        <>
          <BulkBar selected={selectedArticles.size} total={articles.length} onSelectAll={() => setSelectedArticles(new Set(articles.map(a => a.id)))} onClear={() => setSelectedArticles(new Set())} lang={lang}>
            <button className="btn btn-sm btn-danger" onClick={bulkRemoveArticles}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Trash2 size={13} />{lang === "fr" ? "Retirer sélection" : "Remove selected"}</span></button>
          </BulkBar>
          <div className="card">
            {articles.length === 0 ? <EmptyState icon={<Shield size={40} />} title={lang === "fr" ? "Aucun article signalé" : "No reported articles"} /> : (
              <div className="data-table-wrapper"><table className="data-table"><thead><tr>
                <th style={{ width: 30 }}><input type="checkbox" checked={articles.length > 0 && articles.every(a => selectedArticles.has(a.id))} onChange={e => setSelectedArticles(e.target.checked ? new Set(articles.map(a => a.id)) : new Set())} /></th>
                <th>Article</th><th>{lang === "fr" ? "Commerçant" : "Vendor"}</th><th>{lang === "fr" ? "Motif" : "Reason"}</th><th>{lang === "fr" ? "Signalements" : "Reports"}</th><th>Actions</th>
              </tr></thead><tbody>
                {articles.map(a => (
                  <tr key={a.id}>
                    <td><input type="checkbox" checked={selectedArticles.has(a.id)} onChange={() => setSelectedArticles(prev => { const s = new Set(prev); s.has(a.id) ? s.delete(a.id) : s.add(a.id); return s; })} /></td>
                    <td><button className="btn btn-ghost" style={{ fontWeight: 600, textDecoration: "underline", padding: 0, fontSize: 13 }} onClick={() => setArticlePreview(a)}>{a.article}</button></td>
                    <td style={{ fontSize: 13 }}>{a.vendor}</td>
                    <td><span className="badge badge-danger">{a.reason}</span></td>
                    <td><strong>{a.reports}</strong>×</td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-sm btn-danger" onClick={() => setConfirmAction({ type: "removeArticle", id: a.id, name: a.article })}><Trash2 size={13} /></button>
                        <button className="btn btn-sm btn-outline" onClick={() => dismissArticle(a.id)}>✓ {lang === "fr" ? "Ignorer" : "Dismiss"}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody></table></div>
            )}
          </div>
        </>
      )}

      {/* ═══ REPORTED REVIEWS ═══ */}
      {tab === "reviews" && (
        <div className="card">
          {reviews.length === 0 ? <EmptyState icon={<Star size={40} />} title={lang === "fr" ? "Aucun avis signalé" : "No reported reviews"} /> : (
            <div style={{ padding: 0 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ fontWeight: 600 }}>{r.article}</span><span style={{ margin: "0 8px", color: "var(--text-3)" }}>·</span><span style={{ display: "flex", alignItems: "center", gap: 2, color: "var(--warning)" }}>{Array.from({ length: r.rating }, (_, i) => <Star key={i} size={12} fill="currentColor" />)}</span></div>
                    <span className="badge badge-danger">{r.reason}</span>
                  </div>
                  <div style={{ background: "var(--surface-2)", padding: 12, borderRadius: 10, fontSize: 13, marginBottom: 12, fontStyle: "italic" }}>"{r.review}"</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "var(--text-3)" }}>{r.reviewer} · {r.date}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-sm btn-danger" onClick={() => setConfirmAction({ type: "deleteReview", id: r.id, name: r.article })}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Trash2 size={13} />{lang === "fr" ? "Supprimer" : "Delete"}</span></button>
                      <button className="btn btn-sm btn-outline" onClick={() => dismissReview(r.id)}>✓ {lang === "fr" ? "Conserver" : "Keep"}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ SUPPORT TICKETS ═══ */}
      {tab === "tickets" && (
        <div className="card">
          <div className="data-table-wrapper"><table className="data-table"><thead><tr>
            <th>{lang === "fr" ? "Sujet" : "Subject"}</th><th>{lang === "fr" ? "De" : "From"}</th>
            <th>{lang === "fr" ? "Priorité" : "Priority"}</th><th>{lang === "fr" ? "Statut" : "Status"}</th>
            <th><MessageSquare size={14} /></th><th>Actions</th>
          </tr></thead><tbody>
            {tickets.map(tk => (
              <tr key={tk.id}>
                <td><div style={{ fontWeight: 600 }}>{tk.subject}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>{tk.date}</div></td>
                <td style={{ fontSize: 12 }}>{tk.from}</td>
                <td><span className={`badge ${PRIO_BADGE[tk.priority]}`}>{tk.priority}</span></td>
                <td><span className={`badge ${STATUS_BADGE[tk.status]}`}>{tk.status === "open" ? (lang === "fr" ? "Ouvert" : "Open") : tk.status === "in_progress" ? (lang === "fr" ? "En cours" : "In Progress") : (lang === "fr" ? "Fermé" : "Closed")}</span></td>
                <td>{(threads[tk.id] || []).length}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-sm btn-primary" onClick={() => setThreadDetail(tk)}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageSquare size={13} />{lang === "fr" ? "Ouvrir" : "Open"}</span></button>
                    {tk.status !== "closed" && <button className="btn btn-sm btn-success" onClick={() => resolveTicket(tk.id)}>✓</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody></table></div>
        </div>
      )}

      {/* Article Preview Drawer */}
      <DetailDrawer open={!!articlePreview} onClose={() => setArticlePreview(null)} title={articlePreview?.article}
        footer={articlePreview && <>
          <button className="btn btn-danger" onClick={() => { removeArticle(articlePreview.id); setArticlePreview(null); }}><span style={{ display: "flex", alignItems: "center", gap: 4 }}><Trash2 size={13} />{lang === "fr" ? "Retirer" : "Remove"}</span></button>
          <button className="btn btn-outline" onClick={() => { dismissArticle(articlePreview.id); setArticlePreview(null); }}>✓ {lang === "fr" ? "Ignorer" : "Dismiss"}</button>
        </>}>
        {articlePreview && (
          <div>
            <div style={{ width: "100%", height: 200, background: "var(--surface-2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "var(--text-3)" }}><Package size={48} /></div>
            <div className="form-label">{lang === "fr" ? "Commerçant" : "Vendor"}</div>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{articlePreview.vendor}</div>
            <div className="form-label">{lang === "fr" ? "Motif de signalement" : "Report Reason"}</div>
            <span className="badge badge-danger" style={{ marginBottom: 12 }}>{articlePreview.reason}</span>
            <div className="form-label">{lang === "fr" ? "Nombre de signalements" : "Report Count"}</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{articlePreview.reports}</div>
            <div className="form-label">Date</div>
            <div style={{ fontSize: 13 }}>{articlePreview.date}</div>
          </div>
        )}
      </DetailDrawer>

      {/* Thread Drawer */}
      <DetailDrawer open={!!threadDetail} onClose={() => setThreadDetail(null)} title={threadDetail?.subject} width="min(560px, 95vw)"
        footer={threadDetail && threadDetail.status !== "closed" && (
          <button className="btn btn-success" onClick={() => { resolveTicket(threadDetail.id); setThreadDetail({ ...threadDetail, status: "closed" }); }}>✓ {lang === "fr" ? "Résoudre" : "Resolve"}</button>
        )}>
        {threadDetail && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <span className={`badge ${PRIO_BADGE[threadDetail.priority]}`}>{threadDetail.priority}</span>
              <span className={`badge ${STATUS_BADGE[threadDetail.status]}`}>{threadDetail.status}</span>
              <span style={{ fontSize: 12, color: "var(--text-3)" }}>{threadDetail.from}</span>
            </div>
            <div style={{ flex: 1, minHeight: 300, border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
              <SupportThread messages={threads[threadDetail.id] || []} onSend={sendThreadMessage} lang={lang} />
            </div>
          </div>
        )}
      </DetailDrawer>

      <ConfirmModal open={!!confirmAction}
        title={confirmAction?.type === "removeArticle" ? (lang === "fr" ? "Retirer cet article ?" : "Remove this article?") : (lang === "fr" ? "Supprimer cet avis ?" : "Delete this review?")}
        message={confirmAction?.name} danger
        confirmText={confirmAction?.type === "removeArticle" ? (lang === "fr" ? "Retirer" : "Remove") : (lang === "fr" ? "Supprimer" : "Delete")}
        onConfirm={() => confirmAction.type === "removeArticle" ? removeArticle(confirmAction.id) : deleteReview(confirmAction.id)}
        onCancel={() => setConfirmAction(null)} />
    </div>
  );
}
