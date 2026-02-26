import api from './client';

const favorites = {
  getAll: () => api.get('/favorites'),
  toggle: (article_id) => api.post(`/favorites/toggle/${article_id}`),
};

export default favorites;
