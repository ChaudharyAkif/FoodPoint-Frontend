import axios from 'axios';
import { getToken, clearAuthData } from '../context/AuthContext';

// Create axios instance
// const axiosInstance = axios.create({

//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:2000/api",
//   headers: {
//     "Content-Type": "application/json",
//   }
// });
// src/api/axiosInstance.ts
const axiosInstance = axios.create({
  baseURL: 'https://friskingly-unpursued-effie.ngrok-free.dev/api',
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth safely
      clearAuthData();

      // Redirect to login
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
