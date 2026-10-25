/**
 * Cart Service
 */
import { cartAPI } from '../api';

export default {
  get: async () => {
    return cartAPI.get();
  },

  // options : [{group, name}] — le serveur valide et calcule le supplément
  add: async (articleId, quantity = 1, note = '', options = []) => {
    return cartAPI.add(articleId, quantity, note, options);
  },

  merge: async (items) => {
    return cartAPI.merge(items);
  },

  updateQty: async (itemId, quantity) => {
    return cartAPI.updateQty(itemId, quantity);
  },

  remove: async (itemId) => {
    return cartAPI.remove(itemId);
  },

  clear: async () => {
    return cartAPI.clear();
  },

  count: async () => {
    return cartAPI.count();
  },
};
