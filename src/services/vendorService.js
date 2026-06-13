/**
 * Vendor Service — Dashboard, Commandes, Articles, Promos, Livraisons, Wallet, etc.
 */
import { USE_MOCK, delay } from './config';
import { vendorAPI, imagesAPI } from '../api';
import { V_ORDERS, V_PRODUCTS, V_WALLET, V_REVIEWS, V_PROMOS, V_STATS, V_NOTIFS } from '../data/vendorData';

let _mockProducts = V_PRODUCTS.map(p => ({ ...p }));

export default {
  // ── Inscription ──
  register: async (name, type, plan, description) => {
    if (USE_MOCK) { await delay(600); return { establishment_id: "e" + Date.now(), name, type, plan, status: "active" }; }
    return vendorAPI.register(name, type, plan, description);
  },

  // ── Dashboard ──
  getDashboard: async (period = 'month', establishmentId) => {
    if (USE_MOCK) {
      await delay();
      const s = V_STATS[period === 'today' ? 'today' : period === 'week' ? 'week' : 'month'];
      const chart = period === 'today' 
        ? [8000, 15000, 22000, 28000, 18000, 12000, 7000] // hourly today
        : period === 'week' 
        ? V_STATS.chartWeek 
        : V_STATS.chartMonth || V_STATS.chartWeek;
      return {
        stats: s,
        chart,
        top_products: V_STATS.topProducts,
        new_orders: V_ORDERS.filter(o => o.status === "new").length,
        recent_orders: V_ORDERS.slice(0, 3),
      };
    }
    return vendorAPI.dashboard(period, establishmentId);
  },

  // ── Commandes ──
  getOrders: async (status, page = 1) => {
    if (USE_MOCK) {
      await delay();
      const items = status && status !== 'all' ? V_ORDERS.filter(o => o.status === status) : V_ORDERS;
      return { orders: items, counts: { all: V_ORDERS.length, new: V_ORDERS.filter(o => o.status === "new").length, preparing: V_ORDERS.filter(o => o.status === "preparing").length, shipped: V_ORDERS.filter(o => o.status === "shipped").length, delivered: V_ORDERS.filter(o => o.status === "delivered").length }, pagination: { page, total: items.length, has_more: false } };
    }
    return vendorAPI.orders(status, page);
  },

  getOrderDetail: async (id) => {
    if (USE_MOCK) { await delay(); const o = V_ORDERS.find(o => o.id === id); if (!o) throw new Error("Commande introuvable"); return o; }
    return vendorAPI.orderDetail(id);
  },

  updateOrderStatus: async (id, status, message) => {
    if (USE_MOCK) { await delay(); const o = V_ORDERS.find(o => o.id === id); if (o) o.status = status; return { success: true }; }
    return vendorAPI.updateOrderStatus(id, status, message);
  },

  // ── Articles ──
  getArticles: async () => {
    if (USE_MOCK) { await delay(); return _mockProducts; }
    return vendorAPI.articles();
  },

  createArticle: async (data) => {
    if (USE_MOCK) {
      await delay(600);
      const article = {
        id: "vp" + Date.now(),
        name: data.name,
        description: data.description,
        price: data.price,
        old_price: data.old_price,
        cat: data.category,
        stock: data.stock,
        weight: data.weight,
        tags: data.tags,
        is_active: data.is_active !== 0,
        active: data.is_active !== 0,
        sold: 0,
        variants: data.variants || [],
        img: "",
      };
      _mockProducts.unshift(article);
      return article;
    }
    return vendorAPI.createArticle(data);
  },

  updateArticle: async (id, data) => {
    if (USE_MOCK) {
      await delay(400);
      const idx = _mockProducts.findIndex(p => p.id === id);
      if (idx >= 0) {
        _mockProducts[idx] = {
          ..._mockProducts[idx],
          name: data.name || _mockProducts[idx].name,
          description: data.description,
          price: data.price || _mockProducts[idx].price,
          old_price: data.old_price,
          cat: data.category || _mockProducts[idx].cat,
          stock: data.stock !== undefined ? data.stock : _mockProducts[idx].stock,
          weight: data.weight,
          tags: data.tags || _mockProducts[idx].tags,
          is_active: data.is_active !== 0,
          active: data.is_active !== 0,
          variants: data.variants || [],
        };
        return _mockProducts[idx];
      }
      return { id, ...data };
    }
    return vendorAPI.updateArticle(id, data);
  },

  deleteArticle: async (id) => {
    if (USE_MOCK) { await delay(); _mockProducts = _mockProducts.filter(p => p.id !== id); return; }
    return vendorAPI.deleteArticle(id);
  },

  // ── Images articles ──
  uploadImage: async (articleId, file) => {
    if (USE_MOCK) {
      await delay(500);
      return { id: "img" + Date.now(), url: URL.createObjectURL(file), thumbnail: URL.createObjectURL(file), full: URL.createObjectURL(file), analysis: { score: 78, label: "Bonne", issues: [] } };
    }
    return imagesAPI.upload(articleId, file);
  },

  uploadImageBase64: async (articleId, base64) => {
    if (USE_MOCK) { await delay(500); return { id: "img" + Date.now(), url: base64.substring(0, 50) + "..." }; }
    return imagesAPI.uploadBase64(articleId, base64);
  },

  getArticleImages: async (articleId) => {
    if (USE_MOCK) { await delay(); return { images: [], count: 0, max: 6, remaining: 6 }; }
    return imagesAPI.list(articleId);
  },

  reorderImages: async (articleId, ids) => {
    if (USE_MOCK) { await delay(); return; }
    return imagesAPI.reorder(articleId, ids);
  },

  setMainImage: async (imageId) => {
    if (USE_MOCK) { await delay(); return; }
    return imagesAPI.setPrimary(imageId);
  },

  deleteImage: async (imageId) => {
    if (USE_MOCK) { await delay(); return; }
    return imagesAPI.delete(imageId);
  },

  analyzeImage: async (file) => {
    if (USE_MOCK) { await delay(300); return { analysis: { score: 82, label: "Excellente", brightness: 130, contrast: 45, sharpness: 88, issues: [] }, recommendations: [{ type: "ok", icon: "", title: "Excellente qualité !", detail: "" }] }; }
    return imagesAPI.analyze(file);
  },

  // ── Promos ──
  getPromos: async () => {
    if (USE_MOCK) { await delay(); return V_PROMOS; }
    return vendorAPI.promos();
  },

  createPromo: async (data) => {
    if (USE_MOCK) { await delay(); return { id: "pr" + Date.now(), ...data, used: 0 }; }
    return vendorAPI.createPromo(data);
  },

  deletePromo: async (id) => {
    if (USE_MOCK) { await delay(); return; }
    return vendorAPI.deletePromo(id);
  },

  // ── Livraisons ──
  getDeliveries: async () => {
    if (USE_MOCK) { await delay(); return []; }
    return vendorAPI.deliveries();
  },

  assignDriver: async (deliveryId, driverId) => {
    if (USE_MOCK) { await delay(); return { success: true }; }
    return vendorAPI.assignDriver(deliveryId, driverId);
  },

  trackDelivery: async (deliveryId) => {
    if (USE_MOCK) { await delay(); return { status: "en_route", driver: { name: "Patrick", lat: -4.270, lng: 15.285 } }; }
    return vendorAPI.trackDelivery(deliveryId);
  },

  // ── Équipe ──
  getTeam: async () => {
    if (USE_MOCK) { await delay(); return []; }
    return vendorAPI.team();
  },

  inviteMember: async (phone, role) => {
    if (USE_MOCK) { await delay(); return { success: true }; }
    return vendorAPI.inviteMember(phone, role);
  },

  removeMember: async (id) => {
    if (USE_MOCK) { await delay(); return; }
    return vendorAPI.removeMember(id);
  },

  // ── Boutiques multi ──
  getShops: async () => {
    if (USE_MOCK) { await delay(); return [{ id: "s1", name: "Mode Afrique", type: "boutique", status: "active", articles_count: 6 }]; }
    return vendorAPI.shops();
  },

  createShop: async (data) => {
    if (USE_MOCK) { await delay(); return { id: "s" + Date.now(), ...data }; }
    return vendorAPI.createShop(data);
  },

  getShop: async (id) => {
    if (USE_MOCK) { await delay(); return { id, name: "Mode Afrique", type: "boutique" }; }
    return vendorAPI.getShop(id);
  },

  updateShop: async (id, data) => {
    if (USE_MOCK) { await delay(); return { id, ...data }; }
    return vendorAPI.updateShop(id, data);
  },

  // ── Wallet ──
  getWallet: async () => {
    if (USE_MOCK) { await delay(); return { balance: 385000, pending: 110000, transactions: V_WALLET }; }
    return vendorAPI.wallet();
  },

  vendorWithdraw: async (amount, method, phone) => {
    if (USE_MOCK) { await delay(600); return { success: true }; }
    return vendorAPI.withdraw(amount, method, phone);
  },

  // ── Rapports ──
  getReports: async (period = 'month') => {
    if (USE_MOCK) {
      await delay();
      // Return full V_STATS object - screens pick the right period
      return V_STATS;
    }
    return vendorAPI.reports(period);
  },

  // ── Avis ──
  getReviews: async (page = 1) => {
    if (USE_MOCK) { await delay(); return { reviews: V_REVIEWS, pagination: { page, total: V_REVIEWS.length, has_more: false } }; }
    return vendorAPI.reviews(page);
  },

  // ── Abonnés ──
  getFollowers: async (page = 1) => {
    if (USE_MOCK) { await delay(); return { followers: [], total: 1200 }; }
    return vendorAPI.followers(page);
  },

  // ── Notifications ──
  getNotifications: async () => {
    if (USE_MOCK) { await delay(); return V_NOTIFS; }
    // Uses same endpoint as buyer notifs but filtered server-side
    return vendorAPI.settings(); // placeholder
  },

  // ── Paramètres ──
  getSettings: async () => {
    if (USE_MOCK) { await delay(); return { delivery_enabled: true, min_order: 5000, auto_accept: false }; }
    return vendorAPI.settings();
  },

  updateSettings: async (data) => {
    if (USE_MOCK) { await delay(); return { ...data }; }
    return vendorAPI.updateSettings(data);
  },
};
