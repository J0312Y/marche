import { useState, useRef, useEffect } from "react";
import toast from "../../utils/toast";

const BOT_RESPONSES = {
  "commande": "📦 Pour suivre votre commande, allez dans **Commandes** > cliquez sur la commande > **Suivre la livraison**. Si vous avez un problème, donnez-moi votre numéro de commande (ex: #LMK-XXXX).",
  "livraison": "🚚 La livraison standard prend 1-3 jours à Brazzaville. Les frais dépendent de votre zone :\n• Bacongo/Poto-Poto : 1 500 F\n• Moungali/Ouenzé : 2 000 F\n• Talangaï/Mfilou : 2 500 F\nLivraison gratuite dès 15 000 FCFA !",
  "paiement": "💳 Nous acceptons :\n• Airtel Money\n• MTN Mobile Money\n• Kolo Pay (wallet)\nLe paiement est sécurisé et instantané.",
  "retour": "↩️ Vous avez 7 jours pour retourner un article. Allez dans **Commandes** > commande concernée > **Retour / Remboursement**. Le remboursement est traité sous 48h.",
  "vendeur": "🏪 Pour devenir vendeur sur Lamuka :\n1. Allez dans **Profil** > **Devenir commerçant**\n2. Remplissez vos infos\n3. Uploadez vos documents\n4. Choisissez un plan\nValidation sous 24-48h !",
  "promo": "🏷️ Consultez les promotions dans l'onglet **Recherche** ou la section **Ventes Flash** sur l'accueil. Utilisez un code promo dans le panier avant de commander.",
  "contact": "📞 Contactez-nous :\n• WhatsApp : +242 064 663 469\n• Email : support@lamuka.market\n• Chat : ici même !\nDisponible Lun-Sam, 8h-20h.",
};

const QUICK_REPLIES = [
  ["📦", "Suivre ma commande"],
  ["🚚", "Frais de livraison"],
  ["💳", "Paiement"],
  ["↩️", "Retour / Remboursement"],
  ["🏪", "Devenir vendeur"],
  ["🏷️", "Promos"],
  ["📞", "Contact"],
];

function findResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, resp] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(key)) return resp;
  }
  if (lower.includes("merci") || lower.includes("ok")) return "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions.";
  if (lower.includes("bonjour") || lower.includes("salut") || lower.includes("hello")) return "Bonjour ! 👋 Je suis Lamu, l'assistant Lamuka Market. Comment puis-je vous aider ?";
  return "Je ne suis pas sûr de comprendre votre question. Voici ce que je peux vous aider avec :\n• Suivi de commande\n• Livraison & frais\n• Paiement\n• Retours\n• Devenir vendeur\n\nOu contactez notre support : +242 064 663 469";
}

function ChatBotScr({ onBack }) {
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Bonjour ! 👋 Je suis **Lamu**, votre assistant Lamuka Market.\n\nComment puis-je vous aider ?", time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" }) }, [msgs, typing]);

  const send = (text) => {
    const msg = text || inp.trim();
    if (!msg) return;
    const now = new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });
    setMsgs(p => [...p, { from: "user", text: msg, time: now }]);
    setInp("");
    setTyping(true);
    setTimeout(() => {
      const resp = findResponse(msg);
      setMsgs(p => [...p, { from: "bot", text: resp, time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }) }]);
      setTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="scr" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="appbar"><button onClick={onBack}>←</button><h2>🤖 Assistant Lamu</h2><div style={{ width: 38 }} /></div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
            {m.from === "bot" && <div style={{ width: 28, height: 28, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, marginRight: 6, flexShrink: 0, marginTop: 2 }}>🤖</div>}
            <div style={{
              maxWidth: "78%", padding: "10px 14px", borderRadius: 16,
              background: m.from === "user" ? "#F97316" : "var(--light)",
              color: m.from === "user" ? "#fff" : "var(--text)",
              borderBottomRightRadius: m.from === "user" ? 4 : 16,
              borderBottomLeftRadius: m.from === "bot" ? 4 : 16,
            }}>
              <div style={{ fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-line" }}>
                {m.text.split("**").map((part, j) => j % 2 === 1 ? <b key={j}>{part}</b> : part)}
              </div>
              <div style={{ fontSize: 9, opacity: .5, marginTop: 4, textAlign: "right" }}>{m.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0" }}>
            <div style={{ width: 28, height: 28, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ padding: "8px 14px", background: "var(--light)", borderRadius: 16, display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: "var(--muted)", animation: `typingDot .8s ease-in-out ${i * .2}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div style={{ padding: "6px 12px", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", flexShrink: 0 }}>
        {QUICK_REPLIES.map(([ic, label]) => (
          <button key={label} onClick={() => send(label)} style={{
            padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border)",
            background: "var(--card)", fontSize: 11, fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0, color: "var(--text)",
          }}>{ic} {label}</button>
        ))}
      </div>

      {/* Input */}
      <div className="chat-input">
        <input placeholder="Posez votre question..." value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} />
        <button onClick={() => send()} style={{ background: "#F97316" }}>➤</button>
      </div>
    </div>
  );
}

export default ChatBotScr;
