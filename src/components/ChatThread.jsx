/**
 * ChatThread — écran de conversation commun (acheteur, vendeur, livreur)
 * Messages réels uniquement : chargés depuis l'API et rafraîchis toutes les 5 s.
 */
import { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import { useChat } from "../hooks/useChat";

function Avatar({ src, name }) {
  return (
    <div className="ch-av" style={{ overflow: "hidden", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--acc-l)", color: "var(--acc)", fontWeight: 700, fontSize: 15 }}>
      {src ? <img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : (name || "?").charAt(0).toUpperCase()}
    </div>
  );
}

export default function ChatThread({ target, title, subtitle, avatar, phone, onBack, quickReplies = [], accent = "var(--acc)" }) {
  const { other, messages, loading, error, sending, send } = useChat(target);
  const [inp, setInp] = useState("");
  const bodyRef = useRef(null);

  const name = title || [other?.first_name, other?.last_name].filter(Boolean).join(" ") || "Conversation";
  const pic = avatar || other?.avatar || null;

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages.length]);

  const submit = async (text) => {
    const msg = (text ?? inp).trim();
    if (!msg || sending) return;
    if (text === undefined) setInp("");
    await send(msg);
  };

  return (<>
    <div className="chat-head">
      <button onClick={onBack} aria-label="Retour" style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}>
        <Icon name="arrow_left" size={16} />
      </button>
      <Avatar src={pic} name={name} />
      <div className="ch-info">
        <h4>{name}</h4>
        {subtitle && <p style={{ fontSize: 11, color: "var(--muted)" }}>{subtitle}</p>}
      </div>
      {phone && <button className="ch-call" aria-label="Appeler" onClick={() => { window.location.href = `tel:${phone}`; }}><Icon name="phone" size={18} /></button>}
    </div>

    <div className="chat-body" ref={bodyRef}>
      {loading && <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)", fontSize: 13 }}>Chargement de la conversation…</div>}

      {!loading && error && messages.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
          <Icon name="info" size={22} />
          <div style={{ fontSize: 13, marginTop: 8 }}>{error}</div>
        </div>
      )}

      {!loading && !error && messages.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
          <Icon name="chat" size={26} />
          <div style={{ fontSize: 13, marginTop: 8 }}>Aucun message pour l'instant.<br />Écrivez à {name} pour démarrer la conversation.</div>
          {quickReplies.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginTop: 14 }}>
            {quickReplies.map((q) => <button key={q} onClick={() => submit(q)} style={{ padding: "8px 14px", borderRadius: 20, border: `1px solid ${accent}`, background: "transparent", color: accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{q}</button>)}
          </div>}
        </div>
      )}

      {messages.map((m) => (
        <div key={m.id} className={`msg ${m.from === "user" ? "user" : "bot"}`} style={m.from === "user" && accent !== "#F97316" ? { background: accent } : undefined}>
          {m.type === "image" && m.fileUrl && <img src={m.fileUrl} alt="" style={{ maxWidth: "100%", maxHeight: 180, borderRadius: 10, marginBottom: 4 }} />}
          {m.text && m.text.split("\n").map((line, j, arr) => <span key={j}>{line}{j < arr.length - 1 && <br />}</span>)}
          <div className="msg-time">
            {m.failed ? "Non envoyé" : m.pending ? "Envoi…" : m.time}
          </div>
        </div>
      ))}
    </div>

    <div className="chat-input">
      <input placeholder="Écrire un message…" value={inp} maxLength={2000} onChange={(e) => setInp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} disabled={!!error && messages.length === 0} />
      <button onClick={() => submit()} aria-label="Envoyer" disabled={!inp.trim() || sending} style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: inp.trim() ? 1 : 0.5 }}>
        <Icon name="send" size={18} color="#fff" />
      </button>
    </div>
  </>);
}
