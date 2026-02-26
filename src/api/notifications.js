import api from './client';

const notifications = {
  getAll: (unread_only = false, page = 1) =>
    api.get(`/notifications?page=${page}${unread_only ? '&unread_only=1' : ''}`),
  count: () => api.get('/notifications/count'),
  read: (id) => api.put(`/notifications/${id}/read`),
  readAll: () => api.put('/notifications/read-all'),
};

export default notifications;
