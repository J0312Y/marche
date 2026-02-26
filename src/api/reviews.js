import api from './client';

const reviews = {
  getByArticle: (article_id, page = 1, sort = 'newest') =>
    api.get(`/reviews?article_id=${article_id}&page=${page}&sort=${sort}`),
  getByEstablishment: (establishment_id, page = 1) =>
    api.get(`/reviews?establishment_id=${establishment_id}&page=${page}`),
  create: (data) => api.post('/reviews', data),
  getStats: (article_id) => api.get(`/reviews/stats/${article_id}`),
};

export default reviews;
