/**
 * Order & Payment Service
 */
import { USE_MOCK, delay } from './config';
import { ordersAPI, paymentsAPI } from '../api';

const mockOrders = [
  { id: "o1", ref: "#LMK-0214", status: "shipped", total: 92000, date: "14 Fév 14:42", items: [{ name: "Robe Wax Moderne", qty: 2, price: 25000, img: "" }, { name: "Sac à Main Cuir", qty: 1, price: 42000, img: "" }], payment: "Airtel Money", vendor: "Mode Afrique", delivery_fee: 2500 },
  { id: "o2", ref: "#LMK-0210", status: "delivered", total: 18000, date: "12 Fév 10:30", items: [{ name: "Chemise Bogolan", qty: 1, price: 18000, img: "" }], payment: "MTN MoMo", vendor: "Mode Afrique", delivery_fee: 2500 },
  { id: "o3", ref: "#LMK-0205", status: "delivered", total: 5500, date: "10 Fév 12:15", items: [{ name: "Poulet DG", qty: 1, price: 5500, img: "" }], payment: "Kolo Wallet", vendor: "Chez Mama Ngudi", delivery_fee: 1500 },
];

export default {
  getAll: async (status, page = 1) => {
    if (USE_MOCK) { await delay(); const items = status ? mockOrders.filter(o => o.status === status) : mockOrders; return { orders: items, pagination: { page, total: items.length, has_more: false } }; }
    return ordersAPI.getAll(status, page);
  },

  getDetail: async (id) => {
    if (USE_MOCK) { await delay(); const o = mockOrders.find(o => o.id === id); if (!o) throw new Error("Commande introuvable"); return o; }
    return ordersAPI.getDetail(id);
  },

  create: async (data) => {
    if (USE_MOCK) {
      await delay(600);
      const order = { id: "o" + Date.now(), ref: "#LMK-" + String(Math.floor(Math.random() * 9999)).padStart(4, "0"), status: "pending", ...data, date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) };
      mockOrders.unshift(order);
      return order;
    }
    return ordersAPI.create(data);
  },

  cancel: async (id, reason) => {
    if (USE_MOCK) { await delay(); const o = mockOrders.find(o => o.id === id); if (o) o.status = "cancelled"; return; }
    return ordersAPI.cancel(id, reason);
  },

  track: async (id) => {
    if (USE_MOCK) {
      await delay();
      return { order_id: id, status: "shipped", steps: [
        { status: "confirmed", label: "Commande confirmée", time: "14:42", done: true },
        { status: "preparing", label: "En préparation", time: "14:55", done: true },
        { status: "shipped", label: "En livraison", time: "15:20", done: true },
        { status: "delivered", label: "Livré", time: null, done: false },
      ], driver: { name: "Patrick", phone: "+242 06X XXX", lat: -4.270, lng: 15.285 } };
    }
    return ordersAPI.track(id);
  },

  // ── Paiements ──
  initiatePayment: async (orderId, method, phone) => {
    if (USE_MOCK) { await delay(800); return { payment_id: "pay_" + Date.now(), status: "pending", redirect_url: null }; }
    return paymentsAPI.initiate(orderId, method, phone);
  },

  getPaymentStatus: async (id) => {
    if (USE_MOCK) { await delay(); return { status: "success" }; }
    return paymentsAPI.getStatus(id);
  },
};
