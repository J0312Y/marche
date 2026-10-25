/**
 * Catalog Service — Catégories, Articles, Établissements, Recherche
 */
import { categoriesAPI, articlesAPI, establishmentsAPI, searchAPI } from '../api';

export default {
  // ── Catégories ──
  getCategories: async (type) => {
    return categoriesAPI.getAll(type);
  },

  getCategoryDetail: async (id, page = 1) => {
    return categoriesAPI.getDetail(id, page);
  },

  // ── Articles ──
  searchArticles: async (filters = {}) => {
    const res = await articlesAPI.search(filters);
    return res?.articles ? res : { articles: res || [], pagination: res?.pagination };
  },

  getArticle: async (id) => {
    return articlesAPI.getDetail(id);
  },

  getPopular: async () => {
    return articlesAPI.getPopular();
  },

  getFlashSales: async () => {
    return articlesAPI.getFlash();
  },

  // ── Établissements ──
  getEstablishments: async (filters = {}) => {
    const res = await establishmentsAPI.getAll(filters);
    return res?.establishments || res || [];
  },

  getEstablishment: async (id) => {
    return establishmentsAPI.getDetail(id);
  },

  getEstablishmentArticles: async (id, page = 1) => {
    return establishmentsAPI.getArticles(id, page);
  },

  getNearby: async (lat, lng, radius = 10) => {
    return establishmentsAPI.getNearby(lat, lng, radius);
  },

  // ── Recherche ──
  getSearchHistory: async () => {
    return searchAPI.getHistory();
  },

  clearSearchHistory: async () => {
    return searchAPI.clearHistory();
  },

  markViewed: async (articleId) => {
    return searchAPI.markViewed(articleId);
  },

  getRecentlyViewed: async () => {
    return searchAPI.getRecentlyViewed();
  },
};
