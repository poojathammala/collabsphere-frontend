import api from './axios';

// Auth
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// Users
export const userApi = {
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.put('/users/me', data),
  getById: (id) => api.get(`/users/${id}`),
  search: (query) => api.get(`/users/search?query=${encodeURIComponent(query)}`),
  searchBySkill: (skill) => api.get(`/users/search/skill?skill=${encodeURIComponent(skill)}`),
  getAll: () => api.get('/users'),
  getPostsByUser: (id) => api.get(`/posts/user/${id}`),
};

// Posts
export const postApi = {
  create: (data) => api.post('/posts', data),
  getAll: (page = 0, size = 20) => api.get(`/posts?page=${page}&size=${size}`),
  getById: (id) => api.get(`/posts/${id}`),
  getMyPosts: () => api.get('/posts/me'),
  search: (query) => api.get(`/posts/search?query=${encodeURIComponent(query)}`),
  getByType: (type) => api.get(`/posts/type/${type}`),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.post(`/posts/${id}/like`),
};

// Comments
export const commentApi = {
  add: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  getByPost: (postId) => api.get(`/posts/${postId}/comments`),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};

// Collaboration
export const collabApi = {
  sendRequest: (data) => api.post('/collaborations/request', data),
  getIncoming: () => api.get('/collaborations/incoming'),
  getSent: () => api.get('/collaborations/sent'),
  updateStatus: (id, data) => api.put(`/collaborations/${id}/status`, data),
};
