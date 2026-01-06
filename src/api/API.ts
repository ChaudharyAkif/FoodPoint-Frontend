import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Reads from .env
  headers: {
    'Content-Type': 'multipart/form-data', // default for file uploads
  },
});

export default API;
