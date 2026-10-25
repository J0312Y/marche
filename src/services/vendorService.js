/**
 * Vendor Service — Dashboard, Commandes, Articles, Promos, Livraisons, Wallet, etc.
 */
import { vendorAPI, imagesAPI } from '../api';

export default {
  // ── Inscription ──
  register: async (name, type, plan, description) => {
    return vendorAPI.register(name, type, plan, description);
  },

  // ── Dashboard ──
  getDashboard: async (period = 'month', establishmentId) => {
    return vendorAPI.dashboard(period, establishmentId);
  },

  // ── Commandes ──
  getOrders: async (status, page = 1) => {
    return vendorAPI.orders(status, page);
  },

  getOrderDetail: async (id) => {
    return vendorAPI.orderDetail(id);
  },

  updateOrderStatus: async (id, status, message, extra) => {
    return vendorAPI.updateOrderStatus(id, status, message, extra);
  },

  // ── Articles ──
  getArticles: async () => {
    return vendorAPI.articles();
  },

  createArticle: async (data) => {
    return vendorAPI.createArticle(data);
  },

  updateArticle: async (id, data) => {
    return vendorAPI.updateArticle(id, data);
  },

  deleteArticle: async (id) => {
    return vendorAPI.deleteArticle(id);
  },

  // ── Rayons ──
  orderSections: async (sections) => {
    return vendorAPI.orderSections(sections);
  },

  renameSection: async (from, to) => {
    return vendorAPI.renameSection(from, to);
  },

  // ── Images articles ──
  uploadImage: async (articleId, file) => {
    return imagesAPI.upload(articleId, file);
  },

  uploadImageBase64: async (articleId, base64) => {
    return imagesAPI.uploadBase64(articleId, base64);
  },

  getArticleImages: async (articleId) => {
    return imagesAPI.list(articleId);
  },

  reorderImages: async (articleId, ids) => {
    return imagesAPI.reorder(articleId, ids);
  },

  setMainImage: async (imageId) => {
    return imagesAPI.setPrimary(imageId);
  },

  deleteImage: async (imageId) => {
    return imagesAPI.delete(imageId);
  },

  analyzeImage: async (file) => {
    return imagesAPI.analyze(file);
  },

  // ── Promos ──
  getPromos: async () => {
    return vendorAPI.promos();
  },

  createPromo: async (data) => {
    return vendorAPI.createPromo(data);
  },

  updatePromo: async (id, data) => {
    return vendorAPI.updatePromo(id, data);
  },
  deletePromo: async (id) => {
    return vendorAPI.deletePromo(id);
  },

  // ── Livraisons ──
  getDeliveries: async () => {
    return vendorAPI.deliveries();
  },

  assignDriver: async (deliveryId, driverId) => {
    return vendorAPI.assignDriver(deliveryId, driverId);
  },

  assignDriverToOrder: async (orderId, driverId) => {
    return vendorAPI.assignDriverToOrder(orderId, driverId);
  },

  trackDelivery: async (deliveryId) => {
    return vendorAPI.trackDelivery(deliveryId);
  },

  // ── Équipe ──
  getTeam: async () => {
    return vendorAPI.team();
  },

  inviteMember: async (phone, role) => {
    return vendorAPI.inviteMember(phone, role);
  },

  removeMember: async (id) => {
    return vendorAPI.removeMember(id);
  },

  // ── Boutiques multi ──
  getShops: async () => {
    return vendorAPI.shops();
  },

  createShop: async (data) => {
    return vendorAPI.createShop(data);
  },

  getShop: async (id) => {
    return vendorAPI.getShop(id);
  },

  updateShop: async (id, data) => {
    return vendorAPI.updateShop(id, data);
  },

  // ── Wallet ──
  getWallet: async () => {
    return vendorAPI.wallet();
  },

  vendorWithdraw: async (amount, method, phone) => {
    return vendorAPI.withdraw(amount, method, phone);
  },

  submitCommissionProof: async (formData) => {
    return vendorAPI.submitCommissionProof(formData);
  },

  // ── Rapports ──
  getReports: async (period = 'month') => {
    return vendorAPI.reports(period);
  },

  // ── Avis ──
  getReviews: async (page = 1) => {
    return vendorAPI.reviews(page);
  },

  replyReview: async (reviewId, reply) => {
    return vendorAPI.replyReview(reviewId, reply);
  },

  // ── Abonnés ──
  getFollowers: async (page = 1) => {
    return vendorAPI.followers(page);
  },

  // ── Messages / Chats ──
  getChats: async () => {
    return vendorAPI.chats ? vendorAPI.chats() : Promise.resolve([]);
  },

  // ── Notifications ──
  getNotifications: async () => {
    const { default: notifAPI } = await import("../api/notifications.js");
    return notifAPI.getAll();
  },

  // ── Paramètres ──
  getSettings: async () => {
    return vendorAPI.settings();
  },

  updateSettings: async (data) => {
    return vendorAPI.updateSettings(data);
  },

  // ── Publicités ──
  getAds: async () => {
    return vendorAPI.ads();
  },

  createAd: async (data) => {
    return vendorAPI.createAd(data);
  },

  updateAd: async (id, data) => {
    return vendorAPI.updateAd(id, data);
  },

  deleteAd: async (id) => {
    return vendorAPI.deleteAd(id);
  },

  // ── Stories ──
  getStories: async () => {
    return vendorAPI.stories();
  },

  createStory: async (formData) => {
    return vendorAPI.createStory(formData);
  },

  deleteStory: async (id) => {
    return vendorAPI.deleteStory(id);
  },

  // ── Q&A ──
  getQuestions: async () => {
    return vendorAPI.questions();
  },

  answerQuestion: async (id, answer) => {
    return vendorAPI.answerQuestion(id, answer);
  },

  // ── Remises auto ──
  getAutoDiscounts: async () => {
    return vendorAPI.autoDiscounts();
  },

  createAutoDiscount: async (data) => {
    return vendorAPI.createAutoDiscount(data);
  },

  updateAutoDiscount: async (id, data) => {
    return vendorAPI.updateAutoDiscount(id, data);
  },

  deleteAutoDiscount: async (id) => {
    return vendorAPI.deleteAutoDiscount(id);
  },

  // ── Achats groupés ──
  getGroupBuys: async () => {
    return vendorAPI.groupBuys();
  },

  createGroupBuy: async (data) => {
    return vendorAPI.createGroupBuy(data);
  },

  deleteGroupBuy: async (id) => {
    return vendorAPI.deleteGroupBuy(id);
  },

  // ── Email Marketing ──
  getEmailCampaigns: async () => {
    return vendorAPI.emailCampaigns();
  },

  createEmailCampaign: async (data) => {
    return vendorAPI.createEmailCampaign(data);
  },

  sendEmailCampaign: async (id) => {
    return vendorAPI.sendEmailCampaign(id);
  },

  deleteEmailCampaign: async (id) => {
    return vendorAPI.deleteEmailCampaign(id);
  },

  // ── Website / CMS ──
  getWebsitePages: async () => {
    return vendorAPI.websitePages();
  },

  createPage: async (data) => {
    return vendorAPI.createPage(data);
  },

  updatePage: async (id, data) => {
    return vendorAPI.updatePage(id, data);
  },

  deletePage: async (id) => {
    return vendorAPI.deletePage(id);
  },

  // ── Analytics ──
  getAnalytics: async (period = 'month') => {
    return vendorAPI.analytics(period);
  },

  // ── Calendrier ──
  getCalendarOrders: async (year, month) => {
    return vendorAPI.calendarOrders(year, month);
  },

  // ── Factures ──
  getInvoices: async () => {
    return vendorAPI.invoices();
  },

  createInvoice: async (orderId) => {
    return vendorAPI.createInvoice(orderId);
  },

  // ── Stock ──
  getStock: async () => {
    return vendorAPI.stock();
  },

  updateStock: async (id, quantity) => {
    return vendorAPI.updateStock(id, quantity);
  },

  // ── Retours ──
  getReturns: async () => {
    return vendorAPI.returns();
  },

  handleReturn: async (id, action) => {
    return vendorAPI.handleReturn(id, action);
  },

  // ── Clients (CRM) ──
  broadcastClients: async (title, message) => {
    return vendorAPI.broadcastClients(title, message);
  },
  getClients: async (page = 1) => {
    return vendorAPI.clients(page);
  },

  getClientDetail: async (id) => {
    return vendorAPI.clientDetail(id);
  },

  // ── Certification ──
  getCertificationStatus: async () => {
    return vendorAPI.certificationStatus();
  },

  applyCertification: async (data) => {
    return vendorAPI.applyCertification(data);
  },

  // ── Domaine ──
  getDomain: async () => {
    return vendorAPI.domain();
  },

  updateDomain: async (data) => {
    return vendorAPI.updateDomain(data);
  },

  // ── Classement ──
  getRanking: async (period = 'month') => {
    return vendorAPI.ranking(period);
  },

  // ── SEO ──
  getProductSeo: async () => {
    return vendorAPI.productSeo();
  },

  updateProductSeo: async (id, data) => {
    return vendorAPI.updateProductSeo(id, data);
  },

  // ── Import/Export ──
  importProducts: async (formData) => {
    return vendorAPI.importProducts(formData);
  },

  exportProducts: async (format = 'csv') => {
    return vendorAPI.exportProducts(format);
  },

  exportOrders: async (format = 'csv') => {
    return vendorAPI.exportOrders(format);
  },

  // ── Livreurs ──
  getAvailableDrivers: async () => {
    return vendorAPI.availableDrivers();
  },

  inviteDriver: async (data) => {
    return vendorAPI.inviteDriver(data);
  },

  getDriverHistory: async (id) => {
    return vendorAPI.driverHistory(id);
  },

  // ── Business Advisor ──
  getAdvisor: async () => {
    return vendorAPI.advisor();
  },

  // ── Images profil ──
  uploadLogo: async (formData) => {
    return vendorAPI.uploadLogo(formData);
  },

  uploadCover: async (formData) => {
    return vendorAPI.uploadCover(formData);
  },
};
