import { useEffect, useState } from "react";
import reviewsAPI from "../../api/reviews";
import Icon from "../Icon";
import Img from "../Img";
import ImageViewer from "./ImageViewer";
import { mapReview } from "../../utils/reviews";
import { ReviewCard } from "../../screens/buyer/ReviewsScr";

/** Bloc « Avis » de la fiche article (comme Taobao) : note, étiquettes citées, photos des clients, 2 derniers avis. */
export default function ProductReviews({ p, onAll }) {
  const [stats, setStats] = useState(null);
  const [last, setLast] = useState([]);
  const [viewer, setViewer] = useState(null);
  useEffect(() => {
    let on = true;
    reviewsAPI.getStats(p.id).then((s) => on && setStats(s)).catch(() => {});
    reviewsAPI.getByArticle(p.id, 1).then((r) => on && setLast((r?.reviews || r || []).slice(0, 2).map(mapReview))).catch(() => {});
    return () => { on = false; };
  }, [p.id]);
  const total = stats?.total || 0;
  const dist = stats?.distribution || {};
  const avg = total ? [1, 2, 3, 4, 5].reduce((s, k) => s + k * (Number(dist[k]) || 0), 0) / total : 0;

  return (
    <div>
      <div className="t-opt-h" style={{ cursor: "pointer" }} onClick={onAll} role="button">
        <b>Avis{total ? ` (${total})` : ""}</b>
        <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--t-sub)", fontSize: 14 }}>
          {total > 0 && <><Icon name="star_full" size={16} color="#F5A623" /><b style={{ color: "var(--t-text)" }}>{avg.toFixed(1)}</b></>}
          {total > 0 ? "Tout voir" : "Donner mon avis"}<Icon name="chevron_right" size={18} />
        </span>
      </div>
      {total === 0 && <div className="t-sub" style={{ fontSize: 14 }}>Pas encore d'avis sur cet article.</div>}
      {stats?.tags?.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {stats.tags.map((t) => <span key={t.tag} style={{ fontSize: 13, color: "var(--acc-d)", background: "var(--acc-l)", borderRadius: 8, padding: "4px 8px" }}>{t.tag} {t.count}</span>)}
      </div>}
      {stats?.photos?.length > 0 && <div className="t-chips" style={{ display: "flex", gap: 6, overflowX: "auto", padding: 0, marginBottom: 4 }}>
        {stats.photos.map((ph, j) => <button key={ph} onClick={() => setViewer(j)} style={{ border: "none", padding: 0, background: "none", flexShrink: 0, position: "relative" }} aria-label="Photo d'un client">
          <Img src={ph} style={{ width: 84, height: 84, borderRadius: 10 }} fit="cover" />
          {j === 0 && <span style={{ position: "absolute", left: 4, top: 4, fontSize: 11, background: "rgba(0,0,0,.55)", color: "#fff", borderRadius: 5, padding: "1px 5px" }}>Photos clients</span>}
        </button>)}
      </div>}
      {last.map((r) => <ReviewCard key={r.id} r={r} onPhoto={(ph, start) => setViewer({ photos: ph, start })} />)}
      {viewer !== null && <ImageViewer photos={typeof viewer === "number" ? stats.photos : viewer.photos} start={typeof viewer === "number" ? viewer : viewer.start} onClose={() => setViewer(null)} />}
    </div>
  );
}
