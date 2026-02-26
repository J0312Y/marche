import api from './client';

const chat = {
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conv_id, page = 1) => api.get(`/chat/${conv_id}/messages?page=${page}`),
  send: (conv_id, content, type = 'text') => api.post(`/chat/${conv_id}/send`, { content, type }),
  markRead: (conv_id) => api.put(`/chat/${conv_id}/read`),
};

export default chat;
