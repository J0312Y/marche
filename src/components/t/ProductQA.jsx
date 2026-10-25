import { useEffect, useState } from "react";
import { questionsAPI } from "../../api";
import Sheet from "./Sheet";
import toast from "../../utils/toast";
import { useApp } from "../../context/AppContext";

const ago = (s) => {
  const d = s ? new Date(String(s).replace(" ", "T")) : null;
  if (!d || isNaN(d)) return "";
  const days = Math.floor((Date.now() - d) / 86400000);
  return days < 1 ? "aujourd'hui" : days < 2 ? "hier" : days < 30 ? `il y a ${days} jours` : d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

/**
 * « Demandez aux acheteurs » (comme Taobao) : questions sur l'article, réponses de la boutique
 * et des clients qui l'ont reçu (ils sont prévenus par notification).
 */
export default function ProductQA({ p }) {
  const { requireLogin } = useApp();
  const [data, setData] = useState({ questions: [], can_answer: false });
  const [all, setAll] = useState(false);
  const [form, setForm] = useState(null); // { mode: 'ask' } | { mode: 'answer', q }
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => questionsAPI.list(p.id).then((d) => setData({ questions: d?.questions || [], can_answer: !!d?.can_answer })).catch(() => {});
  useEffect(() => { load(); }, [p.id]);

  const open = (f) => requireLogin("question", () => { setText(""); setForm(f); });
  const send = async () => {
    if (busy) return;
    setBusy(true);
    try {
      if (form.mode === "ask") { await questionsAPI.ask(p.id, text.trim()); toast.success("Question envoyée : la boutique et des clients vont vous répondre"); }
      else { await questionsAPI.answer(form.q.id, text.trim()); toast.success("Merci pour votre réponse !"); }
      setForm(null); load();
    } catch (e) { toast.error(e?.message || "Envoi impossible"); }
    setBusy(false);
  };
  const qs = all ? data.questions : data.questions.slice(0, 3);

  return (
    <div>
      <div className="t-opt-h"><b>Questions{data.questions.length ? ` (${data.questions.length})` : ""}</b><span className="t-sub" style={{ fontSize: 13 }}>Réponses de la boutique et des clients</span></div>
      {qs.map((q) => (
        <div key={q.id} style={{ padding: "10px 0", borderTop: "1px solid var(--t-line)" }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 6, background: "var(--acc)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>Q</span>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{q.question}<div className="t-mut" style={{ fontWeight: 400 }}>{q.first_name} · {ago(q.created_at)}</div></div>
          </div>
          {q.answers.map((a) => (
            <div key={a.id} style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 6, background: "var(--t-bg2)", color: "var(--t-sub)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>R</span>
              <div style={{ flex: 1, fontSize: 14, lineHeight: 1.45 }}>{a.answer}
                <div className="t-mut">{a.role === "vendor" ? <b style={{ color: "var(--acc-d)" }}>La boutique</b> : <><b>{a.first_name}</b> · a acheté cet article</>} · {ago(a.created_at)}</div>
              </div>
            </div>
          ))}
          {!q.answers.length && <div className="t-mut" style={{ marginTop: 6, marginLeft: 30 }}>Pas encore de réponse</div>}
          {data.can_answer && <button className="t-pill-btn" style={{ marginTop: 8, marginLeft: 30 }} onClick={() => open({ mode: "answer", q })}>Répondre</button>}
        </div>
      ))}
      {data.questions.length > 3 && !all && <button className="t-pill-btn" style={{ marginTop: 6 }} onClick={() => setAll(true)}>Voir les {data.questions.length} questions</button>}
      {!data.questions.length && <div className="t-sub" style={{ fontSize: 14, marginBottom: 6 }}>Une question sur la taille, la matière, l'utilisation ? Les clients qui l'ont reçu vous répondent.</div>}
      <button className="t-cta ghost center" style={{ width: "100%", height: 44, justifyContent: "center", marginTop: 10 }} onClick={() => open({ mode: "ask" })}>Poser une question</button>

      {form && <Sheet onClose={() => setForm(null)}>
        <div style={{ padding: "6px 20px 18px" }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{form.mode === "ask" ? "Votre question" : "Votre réponse"}</div>
          <div className="t-sub" style={{ marginTop: 4, fontSize: 14 }}>{form.mode === "ask" ? `Sur « ${p.name} ». La boutique et des clients qui l'ont reçu seront prévenus.` : form.q.question}</div>
          <textarea className="t-note" style={{ marginTop: 14 }} rows={3} autoFocus maxLength={form.mode === "ask" ? 300 : 500} value={text} onChange={(e) => setText(e.target.value)}
            placeholder={form.mode === "ask" ? "Ex. : la taille correspond-elle ? Est-ce lavable ?" : "Partagez votre expérience avec cet article"} />
          <button className="t-cta center" style={{ width: "100%", height: 50, justifyContent: "center", marginTop: 12 }} disabled={busy || text.trim().length < (form.mode === "ask" ? 5 : 2)} onClick={send}>{busy ? "Envoi…" : "Envoyer"}</button>
        </div>
      </Sheet>}
    </div>
  );
}
