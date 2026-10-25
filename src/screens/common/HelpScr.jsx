import { useState } from "react";
import Icon from "../../components/Icon";
import { useApp } from "../../context/AppContext";
import { useAppInfo, faqFor } from "../../config/appInfo";
import { ContactCard } from "./ContentPage";

const TITLE = { client: "Questions fréquentes", vendor: "Aide aux commerçants", driver: "Aide aux livreurs" };

/** Questions fréquentes gérées dans le panneau (Informations › Questions fréquentes), selon l'espace ouvert */
export default function HelpScr({ onBack, audience }) {
  const { mode } = useApp();
  const aud = audience || (mode === "vendor" ? "vendor" : mode === "driver" ? "driver" : "client");
  const info = useAppInfo();
  const faq = faqFor(info, aud);
  const [open, setOpen] = useState(0);
  const [q, setQ] = useState("");
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const shown = q.trim() ? faq.filter((f) => norm(f.question + " " + f.answer).includes(norm(q.trim()))) : faq;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>{TITLE[aud]}</h1></div>
      <div className="t-scr gray">
        {faq.length > 4 && <div style={{ padding: "12px 16px 0" }}><div className="t-search" style={{ margin: 0 }}><Icon name="search" size={18} color="var(--t-text)" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une question" style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15 }} /></div></div>}
        <div className="t-card tk-box" style={{ padding: "4px 16px" }}>
          {!info ? <div className="t-sub" style={{ padding: "14px 0" }}>Chargement…</div>
            : !shown.length ? <div className="t-sub" style={{ padding: "14px 0" }}>{q ? "Aucune question ne correspond." : "Aucune question pour le moment."}</div>
            : shown.map((f, i) => (
              <div key={f.id} style={{ borderTop: i ? "1px solid var(--t-line)" : "none" }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 0", background: "none", border: "none", textAlign: "left", font: "inherit", color: "inherit", cursor: "pointer" }}>
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 600 }}>{f.question}</span>
                  <Icon name="chevron_down" size={18} color="var(--t-mut)" style={{ transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </button>
                {open === i && <div className="t-sub" style={{ fontSize: 14.5, lineHeight: 1.6, whiteSpace: "pre-line", paddingBottom: 14 }}>{f.answer}</div>}
              </div>
            ))}
        </div>
        <ContactCard />
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
