// Smart push notifications — contextual + personalized
const NOTIFS = [
  // ABANDONED CART
  { id:"n1", icon:"🛒", title:"Votre panier vous attend", body:"Poulet DG ×1 — Finalisez votre commande maintenant", time:"il y a 2h", type:"cart", action:"cart", unread:true, color:"#F97316" },

  // PRICE DROP
  { id:"n2", icon:"", title:"Prix réduit sur un produit favori", body:"Sac à Main Cuir : -20% (était 52 000 F, maintenant 42 000 F)", time:"il y a 5h", type:"price_drop", action:"detail", unread:true, color:"#10B981" },

  // RESTAURANT OPENED
  { id:"n3", icon:"✅", title:"Chez Mama Ngudi est ouverte", body:"Votre restaurant préféré vient d'ouvrir. Commandez maintenant !", time:"il y a 6h", type:"vendor_open", action:"vendor", unread:false },

  // PROMO PERSO
  { id:"n4", icon:"🎁", title:"Promo spéciale pour vous", body:"-15% sur les restaurants ce week-end. Code : WEEKEND15", time:"hier", type:"promo", action:"home", unread:false, color:"#EC4899" },

  // LOYALTY
  { id:"n5", icon:"⭐", title:"550 points gagnés !", body:"Votre commande #LMK-2026-0214 vous rapporte 550 Lamuka Points", time:"hier", type:"loyalty", action:"loyalty", unread:false, color:"#F59E0B" },

  // WEATHER-BASED
  { id:"n6", icon:"️", title:"Il pleut à Brazzaville", body:"Restez au chaud, on livre ! Frais de livraison réduits aujourd'hui", time:"il y a 2 jours", type:"weather", action:"home", unread:false, color:"#3B82F6" },

  // DELIVERY UPDATE
  { id:"n7", icon:"🛍️", title:"Commande livrée", body:"#LMK-2026-0213 — Notez votre expérience pour gagner 50 points", time:"il y a 2 jours", type:"delivery", action:"orders", unread:false },

  // BIRTHDAY (mock)
  { id:"n8", icon:"🧁", title:"Joyeux anniversaire ! ", body:"1 500 F vous sont offerts. Profitez-en sur votre prochaine commande", time:"il y a 3 jours", type:"birthday", action:"home", unread:false, color:"#EC4899" },

  // STREAK
  { id:"n9", icon:"🔥", title:"7 jours de streak !", body:"Bravo ! Récupérez vos 1 000 points bonus", time:"il y a 1 semaine", type:"streak", action:"loyalty", unread:false, color:"#EF4444" },

  // FRIEND JOINED
  { id:"n10", icon:"🤝", title:"Marie K. a rejoint Lamuka", body:"Votre parrainage est validé. +1 000 F crédités sur votre wallet", time:"il y a 1 semaine", type:"referral", action:"referral", unread:false, color:"#10B981" },
];

export default NOTIFS;
