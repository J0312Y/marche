import { useState } from "react";
import { Star } from "lucide-react";
import api from "../api";
import { usePaged, useAction, PageHead, Toolbar, Tabs, Table, Pager, Badge, Modal, Btn, Field, fmt, dt, fullName } from "../ui";

const ART_REASONS = ["Contenu inapproprié", "Produit interdit à la vente", "Photo ou description trompeuse", "Prix manifestement erroné", "Doublon d'un autre article"];
const REV_REASONS = ["Propos injurieux ou haineux", "Données personnelles (téléphone, adresse)", "Publicité ou spam", "Sans rapport avec la commande"];

/** Motif obligatoire, avec des motifs courants à un clic */
function Reason({ title, text, presets, confirm, busy, onCancel, onConfirm }) {
  const [why, setWhy] = useState("");
  return (
    <Modal title={title} onClose={onCancel} footer={<><Btn kind="ghost" onClick={onCancel}>Annuler</Btn><Btn kind="danger" disabled={busy || why.trim().length < 5} onClick={() => onConfirm(why.trim())}>{busy ? "…" : confirm}</Btn></>}>
      <p className="muted">{text}</p>
      <div className="chips">{presets.map((p) => <button key={p} className={why === p ? "on" : ""} onClick={() => setWhy(p)}>{p}</button>)}</div>
      <Field label="Motif"><textarea rows={3} value={why} maxLength={255} onChange={(e) => setWhy(e.target.value)} /></Field>
    </Modal>
  );
}

function ArticlesTab() {
  const [q, setQ] = useState("");
  const [st, setSt] = useState("online");
  const { rows, total, page, setPage, limit, loading, error, reload } = usePaged("/admin/articles", "articles", { search: q, status: st });
  const { run, busy } = useAction();
  const [block, setBlock] = useState(null);
  const unblock = async (a) => { if (await run(() => api.put(`/admin/articles/${a.id}/unblock`), "Article remis en ligne")) reload(); };
  return (
    <>
      <Toolbar search={q} onSearch={setQ} placeholder="Article ou commerce…">
        <Tabs value={st} onChange={setSt} items={[["online", "En ligne"], ["blocked", "Retirés par Lamuka"], ["all", "Tous"]]} />
      </Toolbar>
      <Table rows={rows} loading={loading} error={error} empty={st === "blocked" ? "Aucun article retiré." : "Aucun article."} cols={[
        { k: "img", label: "", w: 56, render: (a) => (a.thumbnail_url || a.image) ? <img className="thumb" src={a.thumbnail_url || a.image} alt="" /> : <span className="thumb empty" /> },
        { k: "name", label: "Article", render: (a) => <><b>{a.name}</b>{a.description && <small className="block clamp">{a.description}</small>}</> },
        { k: "store", label: "Commerce", render: (a) => <>{a.establishment_name}<small className="block">{a.menu_section || a.category_name || ""}</small></> },
        { k: "price", label: "Prix", right: true, render: (a) => fmt(a.price) },
        { k: "st", label: "État", render: (a) => a.blocked_at ? <><Badge tone="bad">Retiré</Badge><small className="block">{a.blocked_reason}</small></> : String(a.is_active) === "1" ? <Badge tone="ok">En ligne</Badge> : <Badge tone="mut">Masqué par le commerce</Badge> },
        { k: "x", label: "", right: true, render: (a) => a.blocked_at
          ? <Btn kind="ghost" size="sm" disabled={busy} onClick={() => unblock(a)}>Remettre en ligne</Btn>
          : <Btn kind="danger" size="sm" onClick={() => setBlock(a)}>Retirer</Btn> },
      ]} />
      <Pager page={page} total={total} limit={limit} setPage={setPage} />
      {block && <Reason title={`Retirer « ${block.name} » ?`} presets={ART_REASONS} confirm="Retirer de l'app" busy={busy}
        text={`L'article disparaît de l'app et des paniers. ${block.establishment_name} est prévenu avec le motif et ne peut pas le remettre en ligne lui-même.`}
        onCancel={() => setBlock(null)} onConfirm={async (reason) => { if (await run(() => api.put(`/admin/articles/${block.id}/block`, { reason }), "Article retiré de l'app")) { setBlock(null); reload(); } }} />}
    </>
  );
}

const Stars = ({ n }) => <span className="stars" aria-label={`${n} sur 5`}>{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill={i <= n ? "#F5A524" : "none"} color={i <= n ? "#F5A524" : "#C9D2CE"} />)}</span>;

function ReviewsTab() {
  const [q, setQ] = useState("");
  const [st, setSt] = useState("published");
  const [low, setLow] = useState(false);
  const { rows, total, page, setPage, limit, loading, error, reload } = usePaged("/admin/reviews", "reviews", { search: q, status: st, max_rating: low ? 2 : "" });
  const { run, busy } = useAction();
  const [hide, setHide] = useState(null);
  const restore = async (r) => { if (await run(() => api.put(`/admin/reviews/${r.id}/restore`), "Avis rétabli")) reload(); };
  return (
    <>
      <Toolbar search={q} onSearch={setQ} placeholder="Texte de l'avis, commerce, client…">
        <Tabs value={st} onChange={setSt} items={[["published", "Publiés"], ["rejected", "Masqués"]]} />
        <label className="check"><input type="checkbox" checked={low} onChange={(e) => setLow(e.target.checked)} />1 ou 2 étoiles</label>
      </Toolbar>
      <Table rows={rows} loading={loading} error={error} empty="Aucun avis." cols={[
        { k: "r", label: "Note", w: 96, render: (r) => <Stars n={Number(r.rating)} /> },
        { k: "c", label: "Avis", render: (r) => <>{r.comment ? <span className="pre">{r.comment}</span> : <span className="muted">(note sans commentaire)</span>}{r.vendor_reply && <small className="block">Réponse du commerce : {r.vendor_reply}</small>}{r.moderation_note && <small className="block bad">Masqué : {r.moderation_note}</small>}</> },
        { k: "on", label: "Sur", render: (r) => <>{r.establishment_name || "—"}{r.article_name && <small className="block">{r.article_name}</small>}</> },
        { k: "by", label: "Client", render: (r) => <>{fullName(r.first_name, r.last_name)}<small className="block">{dt(r.created_at)}{String(r.is_verified_purchase) === "1" ? " · commande vérifiée" : ""}</small></> },
        { k: "x", label: "", right: true, render: (r) => r.status === "rejected"
          ? <Btn kind="ghost" size="sm" disabled={busy} onClick={() => restore(r)}>Rétablir</Btn>
          : <Btn kind="danger" size="sm" onClick={() => setHide(r)}>Masquer</Btn> },
      ]} />
      <Pager page={page} total={total} limit={limit} setPage={setPage} />
      {hide && <Reason title="Masquer cet avis ?" presets={REV_REASONS} confirm="Masquer l'avis" busy={busy}
        text="L'avis disparaît de l'app et ne compte plus dans la note du commerce. Le motif reste dans l'historique ; vous pourrez le rétablir."
        onCancel={() => setHide(null)} onConfirm={async (reason) => { if (await run(() => api.put(`/admin/reviews/${hide.id}/hide`, { reason }), "Avis masqué")) { setHide(null); reload(); } }} />}
    </>
  );
}

export default function Moderation() {
  const [tab, setTab] = useState(() => (window.location.hash.includes("avis") ? "reviews" : "articles"));
  return (
    <div className="page">
      <PageHead title="Modération" sub="Retirer un article ou masquer un avis qui ne respecte pas les règles de Lamuka" />
      <div className="seg page-seg">
        {[["articles", "Articles des commerces"], ["reviews", "Avis des clients"]].map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>)}
      </div>
      {tab === "articles" ? <ArticlesTab /> : <ReviewsTab />}
    </div>
  );
}
