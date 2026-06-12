const COUPONS=[
  {id:"c1",code:"LAMUKA20",discount:20,desc:"20% sur tout le site",expires:"28 Fév 2026",min:15000},
  {id:"c2",code:"TECH10",discount:10,desc:"10% sur l'Électronique",expires:"14 Mars 2026",min:50000},
  {id:"c3",code:"NOUVEAU",discount:15,desc:"15% première commande",expires:"31 Mars 2026",min:0},
  {id:"c4",code:"FREESHIP",discount:0,desc:"Livraison gratuite",expires:"20 Fév 2026",min:25000,free:true},


  // Personalized codes
  { code: "BIRTHDAY2026", discount: 1500, type: "fixed", min: 5000, label: "🎂 Joyeux anniversaire !", desc: "1 500 F offerts pour votre anniversaire", expiresIn: 7, isPersonal: true, color: "#EC4899" },
  { code: "WELCOMEBACK", discount: 1000, type: "fixed", min: 3000, label: "👋 Vous nous avez manqué", desc: "1 000 F pour votre retour", expiresIn: 14, isPersonal: true, color: "#3B82F6" },
  { code: "JOELDY10", discount: 10, type: "percent", max: 5000, label: "🎁 Code personnel Joeldy", desc: "10% sur votre prochaine commande", expiresIn: 30, isPersonal: true, color: "#F97316" },
  { code: "WEEKEND15", discount: 15, type: "percent", max: 3000, label: "🌴 Spécial week-end", desc: "15% sur les restaurants ce week-end", expiresIn: 3, color: "#10B981" },
  { code: "FREEDELIV", discount: 100, type: "delivery", min: 8000, label: "🚚 Livraison offerte", desc: "Livraison gratuite > 8 000 F", expiresIn: 5, color: "#6366F1" },
  { code: "ETUDIANT20", discount: 20, type: "percent", max: 4000, label: "🎓 Réduction étudiant", desc: "20% pour les étudiants vérifiés", expiresIn: 60, color: "#8B5CF6" },
];
export default COUPONS;
