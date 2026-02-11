import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ message, ...error.response?.data });
  }
);

// URL APIs
export const urlAPI = {
  shorten: (data) => api.post('/url/shorten', data),
  getDetails: (shortCode) => api.get(`/url/${shortCode}`),
  getAll: (params) => api.get('/url', { params }),
  delete: (shortCode) => api.delete(`/url/${shortCode}`),
  update: (shortCode, data) => api.put(`/url/${shortCode}`, data),
};

// Analytics APIs
export const analyticsAPI = {
  getUrlAnalytics: (shortCode, days = 7) => api.get(`/analytics/${shortCode}?days=${days}`),
  getOverallStats: () => api.get('/analytics/stats'),
};

export default api;
