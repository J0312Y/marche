import api from './client';

const cart = {
  get: () => api.get('/cart'),
  add: (article_id, quantity = 1, note) => api.post('/cart', { article_id, quantity, note }),
  updateQty: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
  count: () => api.get('/cart/count'),
};

export default cart;
