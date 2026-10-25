/**
 * Social Service — Favoris, Followers, Avis, Chat, Notifications
 */
import { favoritesAPI, followersAPI, reviewsAPI, chatAPI, notificationsAPI, driverReviewsAPI } from '../api';

export default {
  // ── Favoris ──
  getFavorites: async () => {
    return favoritesAPI.getAll();
  },
  toggleFavorite: async (articleId) => {
    return favoritesAPI.toggle(articleId);
  },

  // ── Followers ──
  getFollowing: async () => {
    return followersAPI.getFollowing();
  },
  toggleFollow: async (establishmentId) => {
    return followersAPI.toggle(establishmentId);
  },
  isFollowing: async (establishmentId) => {
    return followersAPI.check(establishmentId);
  },

  // ── Avis ──
  getArticleReviews: async (articleId, page = 1, sort = 'newest') => {
    return reviewsAPI.getByArticle(articleId, page, sort);
  },
  getReviewStats: async (articleId) => {
    return reviewsAPI.getStats(articleId);
  },
  createReview: async (data) => {
    return reviewsAPI.create(data);
  },
  createDriverReview: async (deliveryId, rating, comment, tip) => {
    return driverReviewsAPI.create(deliveryId, rating, comment, tip);
  },

  // ── Chat ──
  getConversations: async () => {
    return chatAPI.getConversations();
  },
  getMessages: async (convId, page = 1) => {
    return chatAPI.getMessages(convId, page);
  },
  sendMessage: async (convId, content, type = 'text') => {
    return chatAPI.send(convId, content, type);
  },
  markRead: async (convId) => {
    return chatAPI.markRead(convId);
  },

  // ── Notifications ──
  getNotifications: async (unreadOnly = false, page = 1) => {
    return notificationsAPI.getAll(unreadOnly, page);
  },
  getUnreadCount: async () => {
    return notificationsAPI.count();
  },
  markNotifRead: async (id) => {
    return notificationsAPI.read(id);
  },
  markAllRead: async () => {
    return notificationsAPI.readAll();
  },
};
