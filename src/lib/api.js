import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding Auth Token
API.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

/* ==========================================================================
   AUTH API
   ========================================================================== */
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');
export const changePassword = (data) => API.put('/auth/change-password', data);

/* ==========================================================================
   COMPANIES API
   ========================================================================== */
export const getCompanies = () => API.get('/companies');
export const getCompany = (id) => API.get(`/companies/${id}`);
export const createCompany = (data) => API.post('/companies', data);
export const updateCompany = (id, data) => API.put(`/companies/${id}`, data);
export const deleteCompany = (id) => API.delete(`/companies/${id}`);

/* ==========================================================================
   COVER LETTERS API
   ========================================================================== */
export const createCoverLetter = (data) => API.post('/cover-letters', data);
export const getCoverLetters = (params) => API.get('/cover-letters', { params });
export const getCoverLetter = (id) => API.get(`/cover-letters/${id}`);
export const deleteCoverLetter = (id) => API.delete(`/cover-letters/${id}`);

/* ==========================================================================
   TAGS API
   ========================================================================== */
export const createTag = (data) => API.post('/tags', data);
export const getTags = (params) => API.get('/tags', { params });
export const getTag = (id) => API.delete(`/tags/${id}`);
export const deleteTag = (id) => API.delete(`/tags/${id}`);

/* ==========================================================================
   DASHBOARD STATS
   ========================================================================== */
export const getDashboardStats = () => API.get('/dashboard/stats');

export default API;