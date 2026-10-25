/**
 * Buyer Service — Loyalty, Referrals, Gift Cards, Alerts, Subscriptions, Stats, Group Buys
 */
import { buyerAPI } from '../api';

export default {
  getLoyalty: async () => {
    return buyerAPI.loyalty();
  },
  checkin: async () => {
    return buyerAPI.checkin();
  },
  getReferral: async () => {
    return buyerAPI.referral();
  },
  getGiftCards: async () => {
    return buyerAPI.giftCards();
  },
  sendGiftCard: async (data) => {
    return buyerAPI.sendGiftCard(data);
  },
  redeemGiftCard: async (code) => {
    return buyerAPI.redeemGiftCard(code);
  },
  getPriceAlerts: async () => {
    return buyerAPI.priceAlerts();
  },
  createPriceAlert: async (articleId, targetPrice) => {
    return buyerAPI.createPriceAlert(articleId, targetPrice);
  },
  deletePriceAlert: async (id) => {
    return buyerAPI.deletePriceAlert(id);
  },
  getSubscriptions: async () => {
    return buyerAPI.subscriptions();
  },
  createSubscription: async (data) => {
    return buyerAPI.createSubscription(data);
  },
  cancelSubscription: async (id) => {
    return buyerAPI.cancelSubscription(id);
  },
  getStats: async () => {
    return buyerAPI.stats();
  },
  getGroupBuys: async () => {
    return buyerAPI.groupBuys();
  },
  joinGroupBuy: async (id) => {
    return buyerAPI.joinGroupBuy(id);
  },
  getPaymentHistory: async (page) => {
    return buyerAPI.paymentHistory(page);
  },
  getProfile: async () => {
    return buyerAPI.profile();
  },
  updateProfile: async (data) => {
    return buyerAPI.updateProfile(data);
  },
  returnOrder: async (id, reason) => {
    return buyerAPI.returnOrder(id, reason);
  },
};
