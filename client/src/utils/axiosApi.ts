import axios from "axios";
import { API_BASE_URL } from "./constants";
import { initializeSocket } from "../lib/socket";

const axiosApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

axiosApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    },
    (error) => {
      return Promise.reject(error)
    }
);

axiosApi.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      
      if(error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const response = await axiosApi.get(`/auth/refresh`, {
              withCredentials: true,
            }
          )
  
          localStorage.setItem('access_token', response.data.access_token);
          axiosApi.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token;
        
          originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access_token;
          return axiosApi(originalRequest);
        } catch (error) {
          localStorage.removeItem('access_token');
          window.location.href = '/login';
          console.error('Could not refresh access token:', error);
          return Promise.reject(error);
        }
      }
    }
)

export default axiosApi;