import axios, { AxiosInstance } from 'axios';

// Definicja instancji Axios
const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // URL backendu
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
  

export default apiClient;
