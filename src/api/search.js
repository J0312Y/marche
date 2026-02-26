import api from './client';

const search = {
  getHistory: () => api.get('/search/history'),
  clearHistory: () => api.delete('/search/history'),
  markViewed: (article_id) => api.post(`/search/viewed/${article_id}`),
  getRecentlyViewed: () => api.get('/search/viewed'),
};

export default search;
