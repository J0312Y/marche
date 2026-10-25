/**
 * Order & Payment Service
 */
import { ordersAPI, paymentsAPI } from '../api';

export default {
  getAll: async (status, page = 1) => {
    return ordersAPI.getAll(status, page);
  },

  getDetail: async (id) => {
    return ordersAPI.getDetail(id);
  },

  create: async (data) => {
    return ordersAPI.create(data);
  },

  cancel: async (id, reason) => {
    return ordersAPI.cancel(id, reason);
  },

  track: async (id) => {
    return ordersAPI.track(id);
  },

  // ── Paiements ──
  initiatePayment: async (orderId, method, phone) => {
    return paymentsAPI.initiate(orderId, method, phone);
  },

  getPaymentStatus: async (id) => {
    return paymentsAPI.getStatus(id);
  },
};
