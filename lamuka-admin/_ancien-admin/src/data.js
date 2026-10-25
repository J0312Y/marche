// ═══ MOCK DATA — Lamuka Admin Dashboard ═══

export const ADMIN_STATS = {
  totalRevenue: 12850000,
  totalOrders: 1847,
  activeVendors: 142,
  activeUsers: 3420,
  newSignups: 87,
  pendingApprovals: 12,
  openTickets: 8,
  avgDeliveryTime: 38,
  growthRevenue: 18.5,
  growthOrders: 12.3,
  growthVendors: 8.7,
  growthUsers: 22.1,
  conversionRate: 3.8,
  avgBasket: 32500,
  retention: 64,
  gmv: 48500000,
  platformFees: 4850000,
  netRevenue: 3200000,
};

export const REVENUE_CHART = [
  { name: "Jan", revenue: 8200000, orders: 1200 },
  { name: "Fév", revenue: 9500000, orders: 1380 },
  { name: "Mar", revenue: 10100000, orders: 1450 },
  { name: "Avr", revenue: 9800000, orders: 1390 },
  { name: "Mai", revenue: 11200000, orders: 1580 },
  { name: "Jun", revenue: 12850000, orders: 1847 },
];

export const ORDER_CHART = [
  { name: "Lun", orders: 82, revenue: 2450000 },
  { name: "Mar", orders: 95, revenue: 2800000 },
  { name: "Mer", orders: 78, revenue: 2100000 },
  { name: "Jeu", orders: 110, revenue: 3200000 },
  { name: "Ven", orders: 125, revenue: 3800000 },
  { name: "Sam", orders: 145, revenue: 4500000 },
  { name: "Dim", orders: 65, revenue: 1900000 },
];

export const COMMERCE_STATS = [
  { type: "boutique", label: "Boutiques", count: 52, revenue: 4200000, icon: "🏪" },
  { type: "restaurant", label: "Restaurants", count: 38, revenue: 3800000, icon: "🍽️" },
  { type: "patisserie", label: "Pâtisseries", count: 15, revenue: 1200000, icon: "🧁" },
  { type: "pharmacie", label: "Pharmacies", count: 12, revenue: 1800000, icon: "💊" },
  { type: "supermarche", label: "Supermarchés", count: 18, revenue: 1500000, icon: "🛒" },
  { type: "service", label: "Services", count: 7, revenue: 350000, icon: "🔧" },
];

export const PENDING_VENDORS = [
  { id: "pv1", name: "Chez Mama Rose", type: "restaurant", owner: "Rose Mbemba", phone: "+242 06 456 7890", plan: "starter", date: "2026-02-27", docs: true, status: "pending" },
  { id: "pv2", name: "TechZone Congo", type: "boutique", owner: "Patrick Okamba", phone: "+242 06 234 5678", plan: "pro", date: "2026-02-26", docs: true, status: "pending" },
  { id: "pv3", name: "Pharmacie du Centre", type: "pharmacie", owner: "Dr. Marie Nzaba", phone: "+242 05 678 1234", plan: "pro", date: "2026-02-25", docs: false, status: "pending" },
  { id: "pv4", name: "Beauté Africaine", type: "boutique", owner: "Celine Tsoumou", phone: "+242 06 789 4561", plan: "starter", date: "2026-02-25", docs: true, status: "pending" },
  { id: "pv5", name: "Service Express", type: "service", owner: "Jean Nganga", phone: "+242 04 321 6789", plan: "starter", date: "2026-02-24", docs: true, status: "pending" },
];

export const ALL_VENDORS = [
  { id: "v1", name: "Mode Afrique", type: "boutique", owner: "Aminata Diallo", plan: "pro", status: "active", revenue: 850000, orders: 234, rating: 4.7, date: "2025-11-10" },
  { id: "v2", name: "Chez Mama Ngudi", type: "restaurant", owner: "Mama Ngudi", plan: "starter", status: "active", revenue: 620000, orders: 567, rating: 4.9, date: "2025-10-05" },
  { id: "v3", name: "Supermarché Central", type: "supermarche", owner: "Pierre Loutaya", plan: "enterprise", status: "active", revenue: 1500000, orders: 890, rating: 4.3, date: "2025-09-15" },
  { id: "v4", name: "Pâtisserie Délice", type: "patisserie", owner: "Sylvie Koumba", plan: "pro", status: "active", revenue: 430000, orders: 178, rating: 4.8, date: "2025-12-01" },
  { id: "v5", name: "Pharma Santé", type: "pharmacie", owner: "Dr. Alain Mouanga", plan: "pro", status: "active", revenue: 780000, orders: 456, rating: 4.5, date: "2025-08-20" },
  { id: "v6", name: "E-Shop Congo", type: "boutique", owner: "David Nsonde", plan: "starter", status: "suspended", revenue: 120000, orders: 45, rating: 3.2, date: "2025-11-30" },
  { id: "v7", name: "Grill Master", type: "restaurant", owner: "Chef Bruno", plan: "pro", status: "active", revenue: 920000, orders: 678, rating: 4.6, date: "2025-07-12" },
];

export const PLAN_REQUESTS = [
  { id: "pr1", vendor: "Chez Mama Ngudi", owner: "Mama Ngudi", current: "starter", requested: "pro", date: "2026-02-27", amount: 15000, method: "Airtel Money", proof: true },
  { id: "pr2", vendor: "E-Fashion BZV", owner: "Claire Massamba", current: "pro", requested: "enterprise", date: "2026-02-26", amount: 50000, method: "MTN MoMo", proof: true },
  { id: "pr3", vendor: "Bio Market", owner: "Paul Mokoko", current: "starter", requested: "pro", date: "2026-02-25", amount: 15000, method: "Orange Money", proof: false },
];

export const TRANSACTIONS = [
  { id: "tx1", type: "commission", vendor: "Mode Afrique", amount: 42500, method: "auto", date: "2026-02-28 14:30", status: "completed" },
  { id: "tx2", type: "subscription", vendor: "Grill Master", plan: "pro", amount: 15000, method: "Airtel", date: "2026-02-28 12:15", status: "completed" },
  { id: "tx3", type: "withdrawal", vendor: "Supermarché Central", amount: 250000, method: "MTN MoMo", phone: "+242 06 XXX", date: "2026-02-28 10:00", status: "pending" },
  { id: "tx4", type: "commission", vendor: "Chez Mama Ngudi", amount: 18700, method: "auto", date: "2026-02-27 18:45", status: "completed" },
  { id: "tx5", type: "withdrawal", vendor: "Pharma Santé", amount: 180000, method: "Airtel", phone: "+242 05 XXX", date: "2026-02-27 16:30", status: "pending" },
  { id: "tx6", type: "commission", vendor: "Pâtisserie Délice", amount: 12300, method: "auto", date: "2026-02-27 14:00", status: "completed" },
  { id: "tx7", type: "subscription", vendor: "TechZone Congo", plan: "pro", amount: 15000, method: "MTN", date: "2026-02-27 09:20", status: "failed" },
  { id: "tx8", type: "withdrawal", vendor: "Mode Afrique", amount: 350000, method: "Orange", phone: "+242 06 XXX", date: "2026-02-26 15:10", status: "completed" },
];

export const REPORTED_ARTICLES = [
  { id: "ra1", article: "iPhone 15 Pro Max", vendor: "E-Shop Congo", reason: "Contrefaçon suspectée", reporter: "Client anonyme", reports: 5, date: "2026-02-27" },
  { id: "ra2", article: "Crème éclaircissante", vendor: "Beauté Plus", reason: "Produit dangereux", reporter: "3 clients", reports: 3, date: "2026-02-26" },
  { id: "ra3", article: "Air Jordan 1", vendor: "Sneakers BZV", reason: "Photo trompeuse", reporter: "Client #452", reports: 2, date: "2026-02-25" },
];

export const REPORTED_REVIEWS = [
  { id: "rr1", article: "Poulet DG", review: "Vraiment dégueulasse, j'ai vomi toute la nuit !!!", reviewer: "User anonyme", rating: 1, reason: "Langage inapproprié", date: "2026-02-27" },
  { id: "rr2", article: "Robe Wax", review: "ARNAQUE TOTALE allez pas chez eux", reviewer: "Marie K.", rating: 1, reason: "Diffamation", date: "2026-02-26" },
];

export const SUPPORT_TICKETS = [
  { id: "st1", subject: "Remboursement commande #LMK-0889", from: "Client - Celine Nzaba", priority: "high", status: "open", date: "2026-02-28", messages: 3 },
  { id: "st2", subject: "Mon compte commerçant est bloqué", from: "Vendeur - David Nsonde", priority: "high", status: "open", date: "2026-02-28", messages: 1 },
  { id: "st3", subject: "Livreur ne répond plus", from: "Client - Paul Mokoko", priority: "medium", status: "in_progress", date: "2026-02-27", messages: 5 },
  { id: "st4", subject: "Comment ajouter un 2e magasin ?", from: "Vendeur - Mama Ngudi", priority: "low", status: "open", date: "2026-02-27", messages: 1 },
  { id: "st5", subject: "Produit reçu cassé", from: "Client - Jean Batchi", priority: "medium", status: "in_progress", date: "2026-02-26", messages: 4 },
];

export const RECENT_ACTIVITY = [
  { icon: "🏪", text: "Chez Mama Rose a demandé l'inscription", textEn: "Chez Mama Rose registration request", time: "5 min" },
  { icon: "💰", text: "Retrait 250 000 F — Supermarché Central", textEn: "Withdrawal 250,000 F — Supermarché Central", time: "32 min" },
  { icon: "📦", text: "142 commandes aujourd'hui (+12%)", textEn: "142 orders today (+12%)", time: "1h" },
  { icon: "⚠️", text: "iPhone 15 signalé (contrefaçon)", textEn: "iPhone 15 reported (counterfeit)", time: "2h" },
  { icon: "⭐", text: "Grill Master atteint 4.6★ (678 avis)", textEn: "Grill Master reached 4.6★ (678 reviews)", time: "3h" },
  { icon: "🚀", text: "Mama Ngudi upgrade Starter → Pro", textEn: "Mama Ngudi upgrade Starter → Pro", time: "4h" },
];

export const USER_GROWTH = [
  { name: "Sep", clients: 1800, vendors: 85, drivers: 22 },
  { name: "Oct", clients: 2100, vendors: 98, drivers: 28 },
  { name: "Nov", clients: 2500, vendors: 112, drivers: 35 },
  { name: "Déc", clients: 2850, vendors: 125, drivers: 42 },
  { name: "Jan", clients: 3100, vendors: 135, drivers: 48 },
  { name: "Fév", clients: 3420, vendors: 142, drivers: 55 },
];

export const ALL_USERS = [
  { id: "u1", name: "Celine Nzaba", email: "celine@mail.com", phone: "+242 06 456 789", role: "client", status: "active", orders: 23, lastActive: "Aujourd'hui" },
  { id: "u2", name: "Patrick Okamba", email: "patrick@mail.com", phone: "+242 06 234 567", role: "client", status: "active", orders: 45, lastActive: "Hier" },
  { id: "u3", name: "Marie Kongo", email: "marie@mail.com", phone: "+242 05 678 123", role: "client", status: "banned", orders: 2, lastActive: "12 Fév" },
  { id: "u4", name: "Jean Moukala", email: "jean@mail.com", phone: "+242 04 321 678", role: "driver", status: "active", orders: 0, lastActive: "Aujourd'hui" },
  { id: "u5", name: "Sylvie Massamba", email: "sylvie@mail.com", phone: "+242 06 789 456", role: "driver", status: "active", orders: 0, lastActive: "Aujourd'hui" },
];

export const fmt = (n) => n?.toLocaleString("fr-FR") || "0";
export const fmtCFA = (n) => fmt(n) + " F";
