import api from './client';

const followers = {
  getFollowing: () => api.get('/followers'),
  toggle: (establishment_id) => api.post(`/followers/toggle/${establishment_id}`),
  check: (establishment_id) => api.get(`/followers/check/${establishment_id}`),
};

export default followers;
