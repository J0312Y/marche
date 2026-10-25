/**
 * Driver Service — Dashboard, Livraisons, Zones, Véhicule, Wallet, Stats
 */
import { driverAPI } from '../api';

export default {
  // ── Inscription ──
  register: async (data) => {
    return driverAPI.register(data);
  },

  // ── Dashboard ──
  getDashboard: async () => {
    return driverAPI.dashboard();
  },

  // ── Livraisons ──
  getAvailable: async () => {
    return driverAPI.available();
  },

  acceptDelivery: async (id) => {
    return driverAPI.acceptDelivery(id);
  },

  pickup: async (id, code) => {
    return driverAPI.pickup(id, code);
  },

  deliver: async (id, code) => {
    return driverAPI.deliver(id, code);
  },

  getHistory: async (page = 1) => {
    return driverAPI.history(page);
  },

  // ── Localisation ──
  updateLocation: async (lat, lng) => {
    return driverAPI.updateLocation(lat, lng);
  },

  setAvailability: async (available) => {
    return driverAPI.setAvailability(available);
  },

  // ── Zones ──
  getZones: async () => {
    return driverAPI.zones();
  },

  addZone: async (zoneName) => {
    return driverAPI.addZone(zoneName);
  },

  removeZone: async (id) => {
    return driverAPI.removeZone(id);
  },

  // ── Véhicule ──
  getVehicle: async () => {
    return driverAPI.vehicle();
  },

  updateVehicle: async (data) => {
    return driverAPI.updateVehicle(data);
  },

  // ── Wallet ──
  getWallet: async () => {
    return driverAPI.wallet();
  },

  driverWithdraw: async (amount, method, phone) => {
    return driverAPI.withdraw(amount, method, phone);
  },

  submitSubscriptionProof: async (formData) => {
    return driverAPI.submitSubscriptionProof(formData);
  },

  // ── Stats ──
  getStats: async (period = 'month') => {
    return driverAPI.stats(period);
  },

  // ── Documents ──
  getDocuments: async () => {
    return driverAPI.documents();
  },

  uploadDocument: async (formData) => {
    return driverAPI.uploadDocument(formData);
  },

  // ── Settings ──
  getSettings: async () => {
    return driverAPI.settings();
  },

  updateSettings: async (data) => {
    return driverAPI.updateSettings(data);
  },

  // ── Rate vendor ──
  rateVendor: async (deliveryId, rating, comment) => {
    return driverAPI.rateVendor(deliveryId, rating, comment);
  },

  // ── Checklist ──
  completeChecklist: async (id) => {
    return driverAPI.completeChecklist(id);
  },

  // ── Images profil ──
  uploadAvatar: async (formData) => {
    return driverAPI.uploadAvatar(formData);
  },

  uploadCover: async (formData) => {
    return driverAPI.uploadCover(formData);
  },

  // ── Notifications ──
  getNotifications: async () => {
    const { default: notifAPI } = await import("../api/notifications.js");
    return notifAPI.getAll();
  },
};
