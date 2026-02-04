import axios from 'axios';

const Api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor Request: Menyisipkan Token secara otomatis
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor Response: Proteksi jika Token Invalid/Expired
Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Jika Server mengirim status 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Hapus data sesi di browser
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Lempar kembali ke halaman login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default Api;