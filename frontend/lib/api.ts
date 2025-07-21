// api/lib.ts

import axios from 'axios';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:3007';

const api = axios.create({
  baseURL: GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally: Add auth token if needed
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// ====================== AUTH ======================
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const registerUser = (name: string, email: string) =>
  api.post('/users', { name, email });

// ====================== USERS ======================
export const getUsers = () => api.get('/users');

export const getUserById = (id: number) => api.get(`/users/${id}`);

// ====================== EVENTS ======================
export const getEvents = async () => {
  const res = await api.get('/events');
  return res.data;
};

export const fetchEvents = (eventId: number) => api.get(`/events/${eventId}`);

export const fetchAllEvents = async () => {
  const res = await api.get('/events');
  return res.data;
};

export const createEvent = (event: {
  name: string;
  description: string;
  shortDescription: string;
  date: string;
  location: string;
  capacity: number;
  image?: string;
}) => api.post('/events', event);

// ====================== REGISTRATIONS ======================
export const createRegistration = (userId: number, eventId: string) =>
  api.post('/registrations', { userId, eventId });

export const getRegistrations = () => api.get('/registrations');

// ====================== NOTIFICATIONS ======================
export const sendNotification = (userId: number, message: string) =>
  api.post('/notifications', { userId, message });

// ====================== EMAILS ======================
export const sendEmail = (userId: number, subject: string, body: string) =>
  api.post('/emails', { userId, subject, body });

// ====================== AUDIT LOGS (if applicable) ======================
export const getAuditLogs = () => api.get('/auditlogs');

// ====================== HEALTH CHECK (optional) ======================
export const healthCheck = () => api.get('/health');

export default api;
