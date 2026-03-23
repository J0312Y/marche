import { useState, useRef, useEffect } from "react";
import toast from "../../utils/toast";

/* ═══ LOCAL FALLBACK — 30+ keywords ═══ */
const LOCAL = {
  "commande":{r:"📦 Pour suivre votre commande : **Commandes** > cliquez dessus > **Suivre la livraison**. Donnez-moi le numéro (#LMK-XXXX) pour plus de détails."},
  "livraison":{r:"🚚 Livraison standard : 1-3 jours à Brazzaville.\n• Bacongo/Poto-Poto : 1 500 F\n• Moungali/Ouenzé : 2 000 F\n• Talangaï/Mfilou : 2 500 F\nGratuite dès 15 000 FCFA !"},
  "paiement":{r:"💳 Modes de paiement :\n• Airtel Money\n• MTN Mobile Money\n• Kolo Pay (wallet intégré)\nTout est sécurisé et instantané."},
  "retour":{r:"↩️ Retours possibles sous 7 jours. Allez dans **Commandes** > commande concernée > **Retour / Remboursement**. Remboursement sous 48h."},
  "vendeur":{r:"🏪 Pour devenir vendeur :\n1. **Profil** > Devenir commerçant\n2. Remplissez vos infos\n3. Uploadez vos documents\n4. Choisissez un plan\nValidation sous 24-48h !"},
  "promo":{r:"🏷️ Les promos sont dans l'onglet **Recherche** et la section **Ventes Flash** sur l'accueil. Utilisez un code promo dans le panier."},
  "contact":{r:"📞 Contactez-nous :\n• WhatsApp : +242 064 663 469\n• Email : support@lamuka.market\n• Chat : ici même !\nDisponible Lun-Sam, 8h-20h."},
  "prix":{r:"💰 Les prix sont en FCFA et fixés par chaque vendeur. Utilisez les **Alertes de prix** pour être notifié quand un article baisse."},
  "kolo":{r:"💜 Kolo Pay est le wallet intégré de Lamuka. Rechargez via Airtel/MTN et payez en un clic. Bonus : cashback sur certains achats !"},
  "groupe":{r:"🤝 Les **achats groupés** permettent d'obtenir -20% quand 5 personnes achètent le même produit. Partagez le lien pour recruter !"},
  "fidélité":{r:"⭐ Programme fidélité : gagnez des points à chaque achat. 100 pts = 1 000 FCFA de réduction. Consultez vos points dans **Profil** > **Fidélité**."},
  "carte cadeau":{r:"🎁 Offrez une carte cadeau Lamuka ! Montant au choix, le destinataire l'utilise comme bon de réduction."},
  "parrainage":{r:"👥 Parrainez vos amis et gagnez 2 000 FCFA par filleul inscrit. Votre ami reçoit aussi 1 000 FCFA. Allez dans **Profil** > **Parrainage**."},
  "livreur":{r:"🛵 Pour devenir livreur Lamuka :\n1. **Profil** > Devenir livreur\n2. Infos personnelles + véhicule\n3. Documents (permis, ID)\n4. Gagnez dès votre première livraison !"},
  "compte":{r:"👤 Gérez votre compte dans **Profil** : modifier vos infos, adresses, mot de passe, notifications et préférences."},
  "adresse":{r:"📍 Ajoutez/modifiez vos adresses dans **Profil** > **Adresses**. Vous pouvez en avoir plusieurs (maison, bureau, etc.)."},
  "notification":{r:"🔔 Gérez vos notifications dans **Paramètres**. Vous recevez des alertes pour : commandes, promos, livraisons et messages."},
  "annuler":{r:"❌ Pour annuler une commande : **Commandes** > sélectionnez la commande > **Annuler**. Possible tant qu'elle n'est pas en livraison."},
  "horaire":{r:"🕐 Lamuka Market est disponible 24h/24. Les horaires de livraison dépendent de chaque commerce (généralement 8h-20h)."},
  "sécurité":{r:"🔒 Vos données sont protégées. Paiements chiffrés, pas de stockage de numéros Mobile Money. Politique complète dans **Paramètres** > **Confidentialité**."},
  "langue":{r:"🌐 Lamuka est disponible en Français, English et Lingala. Changez dans **Paramètres** > **Langue**."},
  "bug":{r:"🐛 Désolé pour ce désagrément ! Essayez de redémarrer l'app. Si le problème persiste, contactez-nous : support@lamuka.market avec une capture d'écran."},
  "restaurant":{r:"🍽️ Pour commander à manger : accueil > **Commander à manger** ou cherchez un restaurant. Livraison en 30-45 min !"},
  "pharmacie":{r:"💊 Trouvez une pharmacie dans la barre de recherche. Livraison express disponible pour les médicaments."},
  "avis":{r:"⭐ Laissez un avis après chaque commande livrée. Cela aide les autres acheteurs et les vendeurs à s'améliorer !"},
  "flash":{r:"⚡ Les **Ventes Flash** sont des offres limitées dans le temps avec de grosses réductions. Consultez-les sur l'accueil !"},
};

const GREETINGS = ["bonjour","salut","hello","hi","yo","hey","bonsoir","bjr","coucou","mbote"];
const THANKS = ["merci","thanks","ok","d'accord","super","parfait","bien","top","nice"];

function findLocal(msg) {
  const lower = msg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  if (GREETINGS.some(g => lower.includes(g))) return "Bonjour ! 👋 Je suis **Lamu**, votre assistant Lamuka Market. Comment puis-je vous aider aujourd'hui ?";
  if (THANKS.some(t => lower.includes(t))) return "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions.";
  for (const [key, data] of Object.entries(LOCAL)) {
    if (lower.includes(key.normalize("NFD").replace(/[\u0300-\u036f]/g,""))) return data.r;
  }
  return null;
}

/* ═══ SYSTEM PROMPT ═══ */
const SYSTEM = `Tu es Lamu, l'assistant IA de Lamuka Market — le marketplace #1 du Congo 🇨🇬.

CONTEXTE:
- Lamuka Market est une app mobile de e-commerce pour Brazzaville et Pointe-Noire
- Modes de paiement : Airtel Money, MTN Mobile Money, Kolo Pay (wallet intégré)
- Monnaie : FCFA
- Livraison : 1-3 jours, frais 1 500 - 2 500 F selon la zone, gratuite dès 15 000 F
- Catégories : restaurants, boutiques, pharmacies, pâtisseries, supermarchés, services
- Programme fidélité : points à chaque achat, 100 pts = 1 000 F
- Parrainage : 2 000 F par filleul
- Retours : 7 jours, remboursement sous 48h
- Plans vendeur : Starter (gratuit, 5%), Pro (9 900 F/mois, 3%), Enterprise (sur mesure, 2%)
- Support : WhatsApp +242 064 663 469, email support@lamuka.market

RÈGLES:
- Réponds toujours en français, de manière amicale et concise
- Utilise des emojis modérément
- Si on te pose une question hors sujet, ramène poliment vers Lamuka
- Mets les éléments importants en **gras**
- Maximum 3-4 phrases par réponse sauf si on demande des détails
- Tu peux comprendre le lingala basique (mbote = bonjour, etc.)`;

/* ═══ QUICK REPLIES ═══ */
const QUICK_REPLIES = [
  ["📦", "Suivre ma commande"],
  ["🚚", "Frais de livraison"],
  ["💳", "Paiement"],
  ["↩️", "Retour / Remboursement"],
  ["🏪", "Devenir vendeur"],
  ["🏷️", "Promos"],
  ["📞", "Contact"],
  ["🛵", "Devenir livreur"],
];

function ChatBotScr({ onBack }) {
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Bonjour ! 👋 Je suis **Lamu**, votre assistant intelligent Lamuka Market.\n\nPosez-moi n'importe quelle question sur vos commandes, la livraison, les paiements, ou tout autre sujet !", time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }) },
  ]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const [isAI, setIsAI] = useState(true);
  const scrollRef = useRef(null);
  const historyRef = useRef([]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" }) }, [msgs, typing]);

  const addMsg = (from, text) => {
    const time = new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });
    setMsgs(p => [...p, { from, text, time }]);
    historyRef.current.push({ role: from === "bot" ? "assistant" : "user", content: text });
  };

  const callAI = async (userMsg) => {
    try {
      const messages = [
        ...historyRef.current.slice(-10),
        { role: "user", content: userMsg }
      ];

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM,
          messages,
        }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || null;
      if (!text) throw new Error("Empty response");
      return text;
    } catch (e) {
      console.warn("Lamu AI fallback:", e.message);
      return null;
    }
  };

  const send = async (text) => {
    const msg = text || inp.trim();
    if (!msg || typing) return;
    setInp("");
    addMsg("user", msg);
    setTyping(true);

    // Try AI first
    let response = await callAI(msg);
    
    // Fallback to local if AI fails
    if (!response) {
      response = findLocal(msg);
      if (!response) response = "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ? Sinon, contactez notre support : **+242 064 663 469** (WhatsApp).";
      if (isAI) { setIsAI(false); }
    } else {
      if (!isAI) setIsAI(true);
    }

    setTyping(false);
    addMsg("bot", response);
  };

  return (
    <div className="scr" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="appbar">
        <button onClick={onBack}>←</button>
        <h2 style={{display:"flex",alignItems:"center",gap:6}}>
          🤖 Lamu {isAI&&<span style={{fontSize:8,padding:"2px 6px",borderRadius:4,background:"rgba(16,185,129,0.1)",color:"#10B981",fontWeight:600}}>IA</span>}
        </h2>
        <div style={{ width: 38 }} />
      </div>

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
