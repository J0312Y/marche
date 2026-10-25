/**
 * User Service — Adresses, Portefeuille, Coupons
 */
import { addressesAPI, walletsAPI, couponsAPI } from '../api';

export default {
  // ── Adresses ──
  getAddresses: async () => {
    return addressesAPI.getAll();
  },
  createAddress: async (data) => {
    return addressesAPI.create(data);
  },
  updateAddress: async (id, data) => {
    return addressesAPI.update(id, data);
  },
  deleteAddress: async (id) => {
    return addressesAPI.delete(id);
  },
  setDefaultAddress: async (id) => {
    return addressesAPI.setDefault(id);
  },

  // ── Portefeuille ──
  getWalletBalance: async () => {
    return walletsAPI.getBalance();
  },
  topUp: async (amount, method, phone) => {
    return walletsAPI.topup(amount, method, phone);
  },
  withdraw: async (amount, method, phone) => {
    return walletsAPI.withdraw(amount, method, phone);
  },
  getTransactions: async (type, page = 1) => {
    return walletsAPI.transactions(type, page);
  },

  // ── Coupons ──
  getCoupons: async () => {
    return couponsAPI.getAll();
  },
  verifyCoupon: async (code, subtotal) => {
    return couponsAPI.verify(code, subtotal);
  },
};
