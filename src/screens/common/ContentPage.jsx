import { useEffect, useState } from "react";
import Icon from "../../components/Icon";
import api from "../../api/client";
import CONTACT, { whatsappLink, telLink } from "../../config/contact";

const KEY = (slug) => "lk-page-" + slug;

/** Texte d'une page gérée dans le panneau (« Informations › Pages de texte ») : « ## » titre, « - » liste, ligne vide = paragraphe */
export function PageBody({ text }) {
  return String(text || "").split(/\n\s*\n/).map((block, i) => {
    const lines = block.split("\n").filter((l) => l.trim());
    const items = lines.filter((l) => l.startsWith("- "));
    return (
      <div key={i} style={{ marginBottom: 12 }}>
        {lines.filter((l) => !l.startsWith("- ")).map((l, k) => l.startsWith("## ")
          ? <h4 key={k} style={{ fontSize: 16, fontWeight: 700, margin: "6px 0 6px" }}>{l.slice(3)}</h4>
          : <p key={k} style={{ fontSize: 15, color: "var(--t-sub)", lineHeight: 1.6, margin: "0 0 6px" }}>{l}</p>)}
        {items.length > 0 && <ul style={{ margin: "0 0 0 18px", padding: 0 }}>{items.map((l, k) => <li key={k} style={{ fontSize: 15, color: "var(--t-sub)", lineHeight: 1.6 }}>{l.slice(2)}</li>)}</ul>}
      </div>
    );
  });
}

/** Bloc « Nous contacter » (coordonnées du panneau) */
export function ContactCard() {
  if (!CONTACT.phone && !CONTACT.email && !CONTACT.whatsapp) return null;
  const Row = ({ icon, label, sub, href }) => (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid var(--t-line)", color: "inherit", textDecoration: "none" }}>
      <Icon name={icon} size={20} color="var(--acc-d)" /><span style={{ flex: 1 }}><b style={{ fontWeight: 600, display: "block" }}>{label}</b><span className="t-sub" style={{ fontSize: 13 }}>{sub}</span></span><Icon name="chevron_right" size={18} color="var(--t-mut)" />
    </a>
  );
  return (
    <div className="t-card tk-box">
      <div className="tk-h">Nous contacter</div>
      {CONTACT.hours && <div className="t-sub" style={{ fontSize: 13, marginBottom: 6 }}>{CONTACT.hours}</div>}
      {CONTACT.whatsapp && <Row icon="chat" label="WhatsApp" sub={CONTACT.phoneDisplay || "Écrire au support"} href={whatsappLink("Bonjour Lamuka")} />}
      {CONTACT.phone && <Row icon="phone" label="Appeler" sub={CONTACT.phoneDisplay} href={telLink()} />}
      {CONTACT.email && <Row icon="mail" label="E-mail" sub={CONTACT.email} href={`mailto:${CONTACT.email}`} />}
    </div>
  );
}

/** Page de texte : conditions, confidentialité, livraison, à propos */
export default function ContentPage({ slug, fallbackTitle, onBack, children }) {
  const [p, setP] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY(slug)) || "null"); } catch { return null; } });
  const [err, setErr] = useState(false);
  useEffect(() => {
    api.get(`/pages/${slug}`, { noAuth: true }).then((r) => { if (r?.body) { setP(r); try { localStorage.setItem(KEY(slug), JSON.stringify(r)); } catch {} } }).catch(() => setErr(true));
  }, [slug]);
  const date = p?.updated_at ? new Date(String(p.updated_at).replace(" ", "T")).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : null;
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "var(--t-bg2)" }}>
      <div className="t-head" style={{ background: "var(--card)" }}><button className="t-back" onClick={onBack} aria-label="Retour"><Icon name="arrow_left" size={24} /></button><h1>{p?.title || fallbackTitle}</h1></div>
      <div className="t-scr gray">
        <div className="t-card tk-box" style={{ padding: 20 }}>
          {p ? <><PageBody text={p.body} />{date && <div className="t-mut" style={{ fontSize: 13, marginTop: 8 }}>Mis à jour le {date}</div>}</>
            : <div className="t-sub">{err ? "Page indisponible pour le moment. Vérifiez votre connexion." : "Chargement…"}</div>}
        </div>
        {children}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}
