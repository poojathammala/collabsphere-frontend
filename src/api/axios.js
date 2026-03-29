import axios from 'axios';

// Get API base URL from environment variable or use relative path for same-origin requests
const baseURL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cs_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
