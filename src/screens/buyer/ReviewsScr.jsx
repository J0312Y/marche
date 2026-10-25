import { useEffect, useRef, useState } from "react";
import { useGuestGate } from "../../hooks/useGuestGate";
import toast from "../../utils/toast";
import reviewsAPI from "../../api/reviews";
import Icon from "../../components/Icon";
import Img from "../../components/Img";
import ImageViewer from "../../components/t/ImageViewer";
import { mapReview, reviewTags } from "../../utils/reviews";
import shrinkPhoto from "../../utils/shrinkPhoto";

const Stars = ({ n, size = 16 }) => <span style={{ display: "inline-flex", gap: 1 }}>{[1, 2, 3, 4, 5].map((s) => <Icon key={s} name={s <= n ? "star_full" : "star_o"} size={size} color={s <= n ? "#F5A623" : "var(--t-mut)"} />)}</span>;

/** Une carte d'avis : note, étiquettes, texte, photos, réponse de la boutique */
export function ReviewCard({ r, onPhoto }) {
  return (
    <div style={{ padding: "14px 0", borderTop: "1px solid var(--t-line)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <b style={{ fontSize: 15 }}>{r.name}</b>
        {r.verified && <span style={{ fontSize: 12, color: "var(--acc-d)", background: "var(--acc-l)", borderRadius: 6, padding: "2px 6px", fontWeight: 500 }}>Achat vérifié</span>}
        <span className="t-mut" style={{ marginLeft: "auto" }}>{r.date}</span>
      </div>
      <div style={{ marginTop: 4 }}><Stars n={r.rating} size={14} /></div>
      {r.tags.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>{r.tags.map((t) => <span key={t} style={{ fontSize: 12, color: "var(--t-sub)", background: "var(--t-bg2)", borderRadius: 6, padding: "3px 8px" }}>{t}</span>)}</div>}
      {r.text && <div style={{ fontSize: 15, lineHeight: 1.45, marginTop: 8 }}>{r.text}</div>}
      {r.photos.length > 0 && <div className="t-chips" style={{ display: "flex", gap: 6, marginTop: 8, overflowX: "auto", padding: 0 }}>
        {r.photos.map((ph, j) => <button key={ph} onClick={() => onPhoto(r.photos, j)} style={{ border: "none", padding: 0, background: "none", flexShrink: 0 }} aria-label="Agrandir la photo"><Img src={ph} style={{ width: 76, height: 76, borderRadius: 10 }} fit="cover" /></button>)}
      </div>}
      {r.reply && <div style={{ marginTop: 10, background: "var(--t-bg2)", borderRadius: 10, padding: "10px 12px", fontSize: 14, lineHeight: 1.45 }}><b>Réponse de la boutique</b><div style={{ marginTop: 2 }}>{r.reply}</div></div>}
    </div>
  );
}

/** Avis d'un article : résumé (note, étiquettes citées, photos des clients), filtres, rédaction avec photos. */
function ReviewsScr({ product: p, onBack, go }) {
  const { gate, GateUI } = useGuestGate(go);
  const [stats, setStats] = useState(null);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | photos | 5 | tag:<étiquette>
  const [viewer, setViewer] = useState(null); // { photos, start }

  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [photos, setPhotos] = useState([]); // [{ url, uploading }]
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const TAGS = reviewTags(p.type || p.commerce_type);

  const load = async (pg = 1, f = filter) => {
    setLoading(true);
    try {
      const rows = await reviewsAPI.getByArticle(p.id, pg, f === "photos" ? "photos" : "newest");
      const mapped = (rows?.reviews || rows || []).map(mapReview);
      setList((cur) => (pg === 1 ? mapped : [...cur, ...mapped]));
      setMore(mapped.length >= 20); setPage(pg);
    } catch { if (pg === 1) setList([]); }
    setLoading(false);
  };
  const loadStats = () => reviewsAPI.getStats(p.id).then(setStats).catch(() => {});
  useEffect(() => { loadStats(); }, [p.id]);
  useEffect(() => { load(1, filter); }, [p.id, filter === "photos"]);

  const shown = list.filter((r) => filter === "5" ? r.rating === 5 : filter.startsWith("tag:") ? r.tags.includes(filter.slice(4)) : true);
  const total = stats?.total ?? Number(p.reviews) ?? 0;
  const dist = stats?.distribution || {};
  const avg = total ? [1, 2, 3, 4, 5].reduce((s, k) => s + k * (Number(dist[k]) || 0), 0) / total : 0;

  const addPhotos = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 6 - photos.length);
    e.target.value = "";
    for (const f of files) {
      const key = Math.random().toString(36).slice(2);
      setPhotos((cur) => [...cur, { key, url: URL.createObjectURL(f), uploading: true }]);
      try {
        const r = await reviewsAPI.uploadPhoto(await shrinkPhoto(f));
        setPhotos((cur) => cur.map((x) => (x.key === key ? { key, url: r.url, uploading: false } : x)));
      } catch (err) {
        setPhotos((cur) => cur.filter((x) => x.key !== key));
        toast.error(err?.message || "Photo non envoyée");
      }
    }
  };
  const reset = () => { setWriting(false); setRating(0); setText(""); setTags([]); setPhotos([]); };
  const submit = async () => {
    if (!rating || busy || photos.some((x) => x.uploading)) return;
    setBusy(true);
    try {
      await reviewsAPI.create({ article_id: p.id, rating, comment: text.trim() || null, tags, images: photos.map((x) => x.url) });
      toast.success("Merci ! Votre avis est publié");
      reset(); loadStats(); load(1, filter);
    } catch (err) { toast.error(err?.message || "Impossible de publier l'avis"); }
    setBusy(false);
  };

  return (
    <div className="t-scr" style={{ minHeight: "100%", background: "var(--card)" }}>
      <div className="t-sticky">
        <div className="t-head">
          <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
          <h1 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Avis{total ? ` (${total})` : ""}</h1>
        </div>
      </div>
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 0 14px" }}>
          <div style={{ textAlign: "center", minWidth: 84 }}>
            <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1 }}>{total ? avg.toFixed(1) : "–"}</div>
            <div style={{ marginTop: 6 }}><Stars n={Math.round(avg)} size={14} /></div>
            <div className="t-mut" style={{ marginTop: 4 }}>{total} avis</div>
          </div>
          <div style={{ flex: 1 }}>{[5, 4, 3, 2, 1].map((k) => { const n = Number(dist[k]) || 0; return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, height: 18 }}>
              <span className="t-mut" style={{ width: 10 }}>{k}</span>
              <div style={{ flex: 1, height: 6, background: "var(--t-bg2)", borderRadius: 3, overflow: "hidden" }}><div style={{ width: total ? `${(n / total) * 100}%` : 0, height: "100%", background: "#F5A623" }} /></div>
            </div>); })}</div>
        </div>

        {stats?.photos?.length > 0 && <>
          <div style={{ fontWeight: 600, margin: "4px 0 8px" }}>Photos des clients</div>
          <div className="t-chips" style={{ display: "flex", gap: 6, overflowX: "auto", padding: 0, paddingBottom: 6 }}>
            {stats.photos.map((ph, j) => <button key={ph} onClick={() => setViewer({ photos: stats.photos, start: j })} style={{ border: "none", padding: 0, background: "none", flexShrink: 0 }} aria-label="Agrandir la photo"><Img src={ph} style={{ width: 84, height: 84, borderRadius: 10 }} fit="cover" /></button>)}
          </div>
        </>}

        {!writing
          ? <button className="t-cta ghost center" style={{ width: "100%", height: 48, justifyContent: "center", margin: "12px 0" }} onClick={() => gate("review", () => setWriting(true))}><Icon name="edit" size={18} />Écrire un avis</button>
          : <div className="t-card" style={{ padding: 16, margin: "12px 0", border: "1px solid var(--t-line)", borderRadius: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b style={{ fontSize: 16 }}>Votre avis</b><button className="t-pill-btn" onClick={reset}>Annuler</button></div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              {[1, 2, 3, 4, 5].map((s) => <button key={s} onClick={() => setRating(s)} aria-label={`${s} étoile${s > 1 ? "s" : ""}`} style={{ border: "none", background: "none", padding: 2, cursor: "pointer" }}><Icon name={s <= rating ? "star_full" : "star_o"} size={32} color={s <= rating ? "#F5A623" : "var(--t-mut)"} /></button>)}
            </div>
            {rating > 0 && <div style={{ fontSize: 14, color: "var(--t-sub)", marginTop: 2 }}>{["", "Décevant", "Moyen", "Bien", "Très bien", "Excellent"][rating]}</div>}
            <div style={{ fontWeight: 600, marginTop: 14 }}>Ce que vous avez aimé</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
              {TAGS.map((t) => <button key={t} className={"t-chip" + (tags.includes(t) ? " on" : "")} style={{ height: 32 }} onClick={() => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))}>{t}</button>)}
            </div>
            <textarea className="t-note" style={{ marginTop: 14 }} maxLength={1000} rows={3} placeholder="Racontez votre expérience (facultatif)" value={text} onChange={(e) => setText(e.target.value)} />
            <div style={{ fontWeight: 600, marginTop: 14 }}>Photos <span className="t-mut">(facultatif, 6 max)</span></div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {photos.map((ph) => (
                <div key={ph.key} style={{ position: "relative", width: 72, height: 72, borderRadius: 10, overflow: "hidden", opacity: ph.uploading ? 0.5 : 1 }}>
                  <img src={ph.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {!ph.uploading && <button onClick={() => setPhotos((cur) => cur.filter((x) => x.key !== ph.key))} aria-label="Retirer la photo" style={{ position: "absolute", top: 3, right: 3, width: 22, height: 22, borderRadius: "50%", border: "none", background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="close" size={14} color="#fff" /></button>}
                </div>
              ))}
              {photos.length < 6 && <button onClick={() => fileRef.current?.click()} aria-label="Ajouter une photo" style={{ width: 72, height: 72, borderRadius: 10, border: "1.5px dashed var(--t-line)", background: "var(--t-bg2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon name="camera" size={24} color="var(--t-sub)" /></button>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={addPhotos} />
            <button className="t-cta center" style={{ width: "100%", height: 50, justifyContent: "center", marginTop: 16 }} disabled={!rating || busy || photos.some((x) => x.uploading)} onClick={submit}>
              {!rating ? "Choisissez une note" : photos.some((x) => x.uploading) ? "Envoi des photos…" : busy ? "Publication…" : "Publier mon avis"}
            </button>
          </div>}

        <div className="t-chips" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 0 10px" }}>
          {[["all", "Tous"], ["photos", "Avec photos"], ["5", "5 étoiles"]].map(([k, l]) => <button key={k} className={"t-chip" + (filter === k ? " on" : "")} onClick={() => setFilter(k)}>{l}</button>)}
          {(stats?.tags || []).map((t) => <button key={t.tag} className={"t-chip" + (filter === "tag:" + t.tag ? " on" : "")} onClick={() => setFilter("tag:" + t.tag)}>{t.tag} ({t.count})</button>)}
        </div>

        {shown.map((r) => <ReviewCard key={r.id} r={r} onPhoto={(ph, start) => setViewer({ photos: ph, start })} />)}
        {!loading && !shown.length && <div className="t-sub" style={{ textAlign: "center", padding: "30px 0" }}>{total ? "Aucun avis pour ce filtre." : "Pas encore d'avis. Soyez le premier à donner le vôtre !"}</div>}
        {more && !filter.startsWith("tag:") && filter !== "5" && <button className="t-cta ghost center" style={{ width: "100%", height: 44, justifyContent: "center", margin: "8px 0" }} disabled={loading} onClick={() => load(page + 1)}>{loading ? "Chargement…" : "Voir plus d'avis"}</button>}
        <div style={{ height: 24 }} />
      </div>
      {viewer && <ImageViewer photos={viewer.photos} start={viewer.start} onClose={() => setViewer(null)} />}
      <GateUI />
    </div>
  );
}

export default ReviewsScr;
