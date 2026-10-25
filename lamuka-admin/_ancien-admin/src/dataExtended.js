// ═══ EXTENDED MOCK DATA — New pages ═══

export const ALL_ORDERS = [
  { id: "o1", ref: "#LMK-0912", client: "Celine Nzaba", phone: "+242 06 456 789", vendor: "Mode Afrique", items: [{ name: "Robe Wax", qty: 2, price: 25000 }, { name: "Sac Cuir", qty: 1, price: 42000 }], total: 92000, delivery_fee: 2500, payment: "Airtel Money", status: "new", date: "2026-02-28 15:30", zone: "Bacongo", driver: null },
  { id: "o2", ref: "#LMK-0911", client: "Patrick Okamba", phone: "+242 06 234 567", vendor: "Chez Mama Ngudi", items: [{ name: "Poulet DG", qty: 2, price: 5500 }], total: 11000, delivery_fee: 1500, payment: "MTN MoMo", status: "preparing", date: "2026-02-28 14:15", zone: "Poto-Poto", driver: null },
  { id: "o3", ref: "#LMK-0910", client: "Marie Kongo", phone: "+242 05 678 123", vendor: "Supermarché Central", items: [{ name: "Pack Eau 6L", qty: 3, price: 3500 }, { name: "Riz 5kg", qty: 1, price: 8000 }], total: 18500, delivery_fee: 2000, payment: "Orange Money", status: "shipped", date: "2026-02-28 12:00", zone: "Moungali", driver: "Jean Moukala" },
  { id: "o4", ref: "#LMK-0909", client: "Paul Mokoko", phone: "+242 04 321 678", vendor: "Pharma Santé", items: [{ name: "Doliprane 500mg", qty: 2, price: 3000 }], total: 6000, delivery_fee: 1500, payment: "Kolo Wallet", status: "delivered", date: "2026-02-28 10:30", zone: "Talangaï", driver: "Sylvie Massamba" },
  { id: "o5", ref: "#LMK-0908", client: "David Nsonde", phone: "+242 06 789 456", vendor: "Pâtisserie Délice", items: [{ name: "Gâteau Chocolat", qty: 1, price: 25000 }], total: 25000, delivery_fee: 2500, payment: "Airtel Money", status: "delivered", date: "2026-02-27 18:45", zone: "Ouenzé", driver: "Jean Moukala" },
  { id: "o6", ref: "#LMK-0907", client: "Aminata Diallo", phone: "+242 06 111 222", vendor: "Grill Master", items: [{ name: "Brochettes x10", qty: 1, price: 12000 }, { name: "Frites", qty: 2, price: 2000 }], total: 16000, delivery_fee: 1500, payment: "MTN MoMo", status: "cancelled", date: "2026-02-27 16:00", zone: "Bacongo", driver: null, cancel_reason: "Client absent" },
  { id: "o7", ref: "#LMK-0906", client: "Jean Batchi", phone: "+242 06 333 444", vendor: "Mode Afrique", items: [{ name: "Chemise Bogolan", qty: 1, price: 18000 }], total: 18000, delivery_fee: 2000, payment: "Airtel Money", status: "delivered", date: "2026-02-27 14:20", zone: "Mfilou", driver: "Sylvie Massamba" },
  { id: "o8", ref: "#LMK-0905", client: "Claire Massamba", phone: "+242 06 555 666", vendor: "TechZone Congo", items: [{ name: "Écouteurs Bluetooth", qty: 1, price: 15000 }], total: 15000, delivery_fee: 2000, payment: "Orange Money", status: "new", date: "2026-02-28 16:10", zone: "Poto-Poto", driver: null },
  { id: "o9", ref: "#LMK-0904", client: "Rose Mbemba", phone: "+242 06 777 888", vendor: "Chez Mama Ngudi", items: [{ name: "Saka-saka", qty: 1, price: 4000 }, { name: "Poisson braisé", qty: 1, price: 6000 }], total: 10000, delivery_fee: 1500, payment: "MTN MoMo", status: "preparing", date: "2026-02-28 13:50", zone: "Moungali", driver: null },
  { id: "o10", ref: "#LMK-0903", client: "Bruno Mpassi", phone: "+242 06 999 000", vendor: "Pharma Santé", items: [{ name: "Vitamine C 1000mg", qty: 3, price: 5000 }], total: 15000, delivery_fee: 2000, payment: "Kolo Wallet", status: "shipped", date: "2026-02-28 11:30", zone: "Talangaï", driver: "Jean Moukala" },
];

export const ALL_DRIVERS = [
  { id: "d1", name: "Jean Moukala", phone: "+242 04 321 678", vehicle: "Moto Honda CG 125", plate: "BZV-1234", status: "active", zones: ["Bacongo", "Poto-Poto", "Moungali"], deliveries: 234, rating: 4.7, earnings: 198000, available: true, docs: { id_card: true, license: true, insurance: true, photo: true }, date: "2025-10-15" },
  { id: "d2", name: "Sylvie Massamba", phone: "+242 06 789 456", vehicle: "Moto Yamaha DT", plate: "BZV-5678", status: "active", zones: ["Talangaï", "Ouenzé", "Mfilou"], deliveries: 189, rating: 4.8, earnings: 156000, available: true, docs: { id_card: true, license: true, insurance: true, photo: true }, date: "2025-11-02" },
  { id: "d3", name: "Patrick Mbou", phone: "+242 06 444 555", vehicle: "Vélo électrique", plate: "—", status: "active", zones: ["Bacongo", "Makélékélé"], deliveries: 87, rating: 4.5, earnings: 72000, available: false, docs: { id_card: true, license: false, insurance: false, photo: true }, date: "2025-12-10" },
  { id: "d4", name: "Albert Ngoma", phone: "+242 05 222 333", vehicle: "Moto TVS", plate: "BZV-9012", status: "pending", zones: [], deliveries: 0, rating: 0, earnings: 0, available: false, docs: { id_card: true, license: true, insurance: false, photo: false }, date: "2026-02-25" },
  { id: "d5", name: "Blaise Nkouka", phone: "+242 06 666 777", vehicle: "Moto Boxer", plate: "BZV-3456", status: "suspended", zones: ["Poto-Poto"], deliveries: 56, rating: 3.1, earnings: 45000, available: false, docs: { id_card: true, license: true, insurance: true, photo: true }, date: "2025-09-20" },
];

export const CATEGORIES = [
  { id: 1, name: "Mode", icon: "👗", type: "boutique", articles: 145, sort: 0, active: true },
  { id: 2, name: "Électronique", icon: "📱", type: "boutique", articles: 89, sort: 1, active: true },
  { id: 3, name: "Beauté", icon: "💄", type: "boutique", articles: 67, sort: 2, active: true },
  { id: 4, name: "Maison", icon: "🏠", type: "boutique", articles: 34, sort: 3, active: true },
  { id: 5, name: "Plats", icon: "🍽️", type: "restaurant", articles: 230, sort: 0, active: true },
  { id: 6, name: "Boissons", icon: "🥤", type: "restaurant", articles: 56, sort: 1, active: true },
  { id: 7, name: "Gâteaux", icon: "🎂", type: "patisserie", articles: 45, sort: 0, active: true },
  { id: 8, name: "Viennoiseries", icon: "🥐", type: "patisserie", articles: 28, sort: 1, active: true },
  { id: 9, name: "Médicaments", icon: "💊", type: "pharmacie", articles: 120, sort: 0, active: true },
  { id: 10, name: "Parapharmacie", icon: "🧴", type: "pharmacie", articles: 45, sort: 1, active: true },
  { id: 11, name: "Alimentation", icon: "🛒", type: "supermarche", articles: 310, sort: 0, active: true },
  { id: 12, name: "Hygiène", icon: "🧼", type: "supermarche", articles: 85, sort: 1, active: true },
  { id: 13, name: "Réparation", icon: "🔧", type: "service", articles: 12, sort: 0, active: true },
  { id: 14, name: "Couture", icon: "🧵", type: "service", articles: 8, sort: 1, active: false },
];

export const BANNERS = [
  { id: "b1", title: "Soldes de Mars", image: "🏷️", link: "/promo/mars", position: "home_top", active: true, start: "2026-03-01", end: "2026-03-15", clicks: 1234 },
  { id: "b2", title: "Livraison gratuite > 20 000F", image: "🚚", link: "/promo/delivery", position: "home_middle", active: true, start: "2026-02-15", end: "2026-03-31", clicks: 876 },
  { id: "b3", title: "Nouveaux restaurants", image: "🍽️", link: "/restaurants", position: "home_bottom", active: false, start: "2026-02-01", end: "2026-02-28", clicks: 2345 },
];

export const ACTIVITY_LOG = [
  { id: "al1", admin: "Joeldy", action: "approve_vendor", target: "TechZone Congo", detail: "Inscription approuvée", date: "2026-02-28 15:45", ip: "41.75.xxx.xxx" },
  { id: "al2", admin: "Joeldy", action: "approve_withdrawal", target: "Mode Afrique — 350 000 F", detail: "Retrait approuvé via Orange Money", date: "2026-02-28 14:20", ip: "41.75.xxx.xxx" },
  { id: "al3", admin: "Joeldy", action: "suspend_vendor", target: "E-Shop Congo", detail: "Suspendu : produits contrefaits", date: "2026-02-27 16:30", ip: "41.75.xxx.xxx" },
  { id: "al4", admin: "Joeldy", action: "delete_review", target: "Avis #r456 sur Poulet DG", detail: "Langage inapproprié", date: "2026-02-27 14:10", ip: "41.75.xxx.xxx" },
  { id: "al5", admin: "Joeldy", action: "remove_article", target: "iPhone 15 Pro Max — E-Shop Congo", detail: "Contrefaçon confirmée (5 signalements)", date: "2026-02-27 11:00", ip: "41.75.xxx.xxx" },
  { id: "al6", admin: "Joeldy", action: "approve_plan", target: "Mama Ngudi — Starter → Pro", detail: "Paiement Airtel confirmé", date: "2026-02-26 15:30", ip: "41.75.xxx.xxx" },
  { id: "al7", admin: "Joeldy", action: "ban_user", target: "Marie Kongo", detail: "Abus de remboursements", date: "2026-02-26 10:15", ip: "41.75.xxx.xxx" },
  { id: "al8", admin: "Joeldy", action: "update_settings", target: "Zones de livraison", detail: "Madibou désactivé", date: "2026-02-25 17:00", ip: "41.75.xxx.xxx" },
  { id: "al9", admin: "Joeldy", action: "send_notification", target: "Tous les utilisateurs", detail: "🎉 Soldes de février !", date: "2026-02-25 09:00", ip: "41.75.xxx.xxx" },
  { id: "al10", admin: "Joeldy", action: "approve_driver", target: "Patrick Mbou", detail: "Documents validés", date: "2026-02-24 14:45", ip: "41.75.xxx.xxx" },
];

export const ACTION_ICONS = {
  approve_vendor: "✅", approve_withdrawal: "💰", suspend_vendor: "⏸️", delete_review: "🗑️",
  remove_article: "🚫", approve_plan: "⬆️", ban_user: "🔨", update_settings: "⚙️",
  send_notification: "📤", approve_driver: "🏍️", reject_vendor: "❌", unban_user: "🔓",
};
