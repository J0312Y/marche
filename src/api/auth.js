import api from './client';

const auth = {
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  verifyOTP: (phone, code) => api.post('/auth/verify-otp', { phone, code }),
  social: (provider, provider_id, email, name, avatar) =>
    api.post('/auth/social', { provider, provider_id, email, name, avatar }),
  completeProfile: (data) => api.post('/auth/complete-profile', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
};

export default auth;
