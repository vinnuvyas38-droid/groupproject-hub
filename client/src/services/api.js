// services/api.js
// The ONLY file in the frontend that makes HTTP calls.
// Every other file imports functions from here instead of using Axios directly.
// This keeps all API logic in one place — easy to debug, easy to change.

import axios from 'axios';

// Create one Axios instance with our base config.
// VITE_API_URL comes from client/.env (default: http://localhost:5000/api)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 second timeout — if the server doesn't respond, stop waiting
});

// ── Error interceptor ───────────────────────────────────────────────────────
// Runs on EVERY failed response. Turns Axios errors into friendly messages
// so our components don't need to parse error objects.
api.interceptors.response.use(
  // Success — just pass the response through
  (response) => response,

  // Error — turn it into a readable message
  (error) => {
    // If the server sent a JSON error body, use its message
    if (error.response && error.response.data) {
      const data = error.response.data;
      const friendlyError = new Error(data.message || 'Something went wrong.');
      friendlyError.status = error.response.status;
      friendlyError.errors = data.errors || []; // field-level errors from Zod
      return Promise.reject(friendlyError);
    }

    // Network error — the server is unreachable
    if (error.request) {
      const networkError = new Error(
        'Cannot connect to the server. Please check your internet connection and make sure the backend is running.'
      );
      networkError.status = 0;
      networkError.errors = [];
      return Promise.reject(networkError);
    }

    // Something else went wrong (e.g. bug in our code)
    return Promise.reject(new Error('An unexpected error occurred.'));
  }
);

// ── PROJECT endpoints ────────────────────────────────────────────────────────
export const projectApi = {
  getAll:   ()               => api.get('/projects'),
  getOne:   (id)             => api.get(`/projects/${id}`),
  create:   (data)           => api.post('/projects', data),
  update:   (id, data)       => api.put(`/projects/${id}`, data),
  delete:   (id)             => api.delete(`/projects/${id}`),
};

// ── MEMBER endpoints ─────────────────────────────────────────────────────────
export const memberApi = {
  getAll:   (projectId)            => api.get(`/projects/${projectId}/members`),
  create:   (projectId, data)      => api.post(`/projects/${projectId}/members`, data),
  update:   (projectId, id, data)  => api.put(`/projects/${projectId}/members/${id}`, data),
  delete:   (projectId, id)        => api.delete(`/projects/${projectId}/members/${id}`),
};

// ── TASK endpoints ───────────────────────────────────────────────────────────
export const taskApi = {
  getAll:   (projectId, params)    => api.get(`/projects/${projectId}/tasks`, { params }),
  create:   (projectId, data)      => api.post(`/projects/${projectId}/tasks`, data),
  update:   (projectId, id, data)  => api.put(`/projects/${projectId}/tasks/${id}`, data),
  delete:   (projectId, id)        => api.delete(`/projects/${projectId}/tasks/${id}`),
};

// ── MEETING NOTE endpoints ───────────────────────────────────────────────────
export const noteApi = {
  getAll:   (projectId, params)    => api.get(`/projects/${projectId}/notes`, { params }),
  create:   (projectId, data)      => api.post(`/projects/${projectId}/notes`, data),
  update:   (projectId, id, data)  => api.put(`/projects/${projectId}/notes/${id}`, data),
  delete:   (projectId, id)        => api.delete(`/projects/${projectId}/notes/${id}`),
};

// ── MILESTONE endpoints ─────────────────────────────────────────────────────
export const milestoneApi = {
  getAll:   (projectId)            => api.get(`/projects/${projectId}/milestones`),
  create:   (projectId, data)      => api.post(`/projects/${projectId}/milestones`, data),
  update:   (projectId, id, data)  => api.put(`/projects/${projectId}/milestones/${id}`, data),
  delete:   (projectId, id)        => api.delete(`/projects/${projectId}/milestones/${id}`),
};

// ── DASHBOARD endpoint ──────────────────────────────────────────────────────
export const dashboardApi = {
  get: (projectId) => api.get(`/projects/${projectId}/dashboard`),
};

// ── MEMBER SUMMARY endpoint (differentiator) ────────────────────────────────
export const summaryApi = {
  getMembers: (projectId) => api.get(`/projects/${projectId}/summary/members`),
};

export default api;

