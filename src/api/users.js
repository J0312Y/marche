import api from './client';

const users = {
  me: () => api.get('/users/me'),
  update: (data) => api.put('/users/me', data),
  updatePassword: (new_password) => api.put('/users/password', { new_password }),
  changePassword: (current_password, new_password) => api.put('/users/me/password', { current_password, new_password }),
  uploadAvatar: (file) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return api.upload('/users/avatar', fd);
  },
  registrationStatus: () => api.get('/users/me/registration-status'),
};

export default users;
