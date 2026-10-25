import { useState } from "react";
import Icon from "../../components/Icon";
import Img from "../../components/Img";
import Sheet from "../../components/t/Sheet";
import PullToRefresh from "../../components/PullToRefresh";
import { SkeletonList } from "../../components/Loading";
import { useLoad } from "../../hooks";
import { vendorAPI } from "../../api";
import toast from "../../utils/toast";

const ago = (s) => {
  const d = s ? new Date(String(s).replace(" ", "T")) : null;
  if (!d || isNaN(d)) return "";
  const h = Math.floor((Date.now() - d) / 3600000);
  return h < 1 ? "à l'instant" : h < 24 ? `il y a ${h} h` : h < 48 ? "hier" : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

/** Questions des clients sur vos articles (« Demandez aux acheteurs ») : répondre, voir les réponses des clients. */
function VQuestionsScr({ onBack }) {
  const [filter, setFilter] = useState("todo"); // todo | all
  const { data, loading, reload } = useLoad(() => vendorAPI.questions(), []);
  const [form, setForm] = useState(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const all = data?.questions || [];
  const list = filter === "todo" ? all.filter((q) => !q.vendor_answer) : all;

  const send = async () => {
    setBusy(true);
    try { await vendorAPI.answerQuestion(form.id, text.trim()); toast.success("Réponse publiée : le client est prévenu"); setForm(null); reload(); }
    catch (e) { toast.error(e?.message || "Envoi impossible"); }
    setBusy(false);
  };

  return (
    <PullToRefresh onRefresh={reload}>
      <div className="t-scr gray" style={{ minHeight: "100%" }}>
        <div className="t-sticky">
          <div className="t-head">
            <button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button>
            <h1>Questions des clients</h1>
          </div>
          <div className="t-chips">
            <button className={"t-chip" + (filter === "todo" ? " on" : "")} onClick={() => setFilter("todo")}>À répondre{data?.unanswered ? ` (${data.unanswered})` : ""}</button>
            <button className={"t-chip" + (filter === "all" ? " on" : "")} onClick={() => setFilter("all")}>Toutes ({all.length})</button>
          </div>
        </div>
        {loading && !data ? <div style={{ padding: 16 }}><SkeletonList hasImage /></div>
          : !list.length ? <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontWeight: 600 }}>{filter === "todo" ? "Aucune question en attente" : "Pas encore de question"}</div>
            <div className="t-sub" style={{ marginTop: 4 }}>Les clients posent leurs questions depuis la fiche de vos articles. Répondre vite rassure et fait vendre.</div>
          </div>
          : list.map((q) => (
            <div key={q.id} className="t-card tk-box">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Img src={q.thumbnail_url || q.image} style={{ width: 40, height: 40, borderRadius: 8, flexShrink: 0 }} fit="cover" />
                <div className="t-sub" style={{ fontSize: 13, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.article_name}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 10, lineHeight: 1.4 }}>{q.question}</div>
              <div className="t-mut">{q.first_name || "Client"} · {ago(q.created_at)}</div>
              {q.answers.map((a) => (
                <div key={a.id} style={{ marginTop: 8, padding: "8px 10px", background: a.role === "vendor" ? "var(--acc-l)" : "var(--t-bg2)", borderRadius: 10, fontSize: 14, lineHeight: 1.45 }}>
                  {a.answer}<div className="t-mut">{a.role === "vendor" ? "Votre réponse" : `${a.first_name || "Un client"} · a acheté l'article`} · {ago(a.created_at)}</div>
                </div>
              ))}
              <button className={"t-cta center" + (q.vendor_answer ? " ghost" : "")} style={{ width: "100%", height: 42, justifyContent: "center", marginTop: 10 }} onClick={() => { setText(""); setForm(q); }}>
                {q.vendor_answer ? "Ajouter une réponse" : "Répondre"}
              </button>
            </div>
          ))}
        <div style={{ height: 20 }} />
      </div>
      {form && <Sheet onClose={() => setForm(null)}>
        <div style={{ padding: "6px 20px 18px" }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Votre réponse</div>
          <div className="t-sub" style={{ marginTop: 4, fontSize: 14 }}>{form.question}</div>
          <textarea className="t-note" style={{ marginTop: 14 }} rows={3} autoFocus maxLength={500} value={text} onChange={(e) => setText(e.target.value)} placeholder="Répondez clairement : taille, matière, compatibilité, délai…" />
          <button className="t-cta center" style={{ width: "100%", height: 50, justifyContent: "center", marginTop: 12 }} disabled={busy || text.trim().length < 2} onClick={send}>{busy ? "Envoi…" : "Publier la réponse"}</button>
        </div>
      </Sheet>}
    </PullToRefresh>
  );
}

export default VQuestionsScr;
