import axios, { AxiosInstance } from 'axios';
import { envConfig, localStorageConfig } from '../config';

const ACCESS_TOKEN = localStorageConfig.accessToken;
const REFRESH_TOKEN = localStorageConfig.refreshToken;
const TIMEOUT = 1 * 60 * 1000;

const apiClient: AxiosInstance = axios.create({
  baseURL: envConfig.serverURL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (err) => {
    const status = err?.response?.status ?? err?.status;
    if (status === 401 || status === 403) {
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        // Không có refresh token thì không gọi refresh endpoint.
        if (!refreshToken) {
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          return Promise.reject(err);
        }
        const { data } = await axios.post(`${envConfig.serverURL}/auth/refresh-token`, {
          refresh_token: refreshToken,
        });
        const newAccessToken = data?.data?.access_token;
        if (newAccessToken) {
          localStorage.setItem(ACCESS_TOKEN, newAccessToken);
          const originalRequest = err.config;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
      }
    }
    return Promise.reject(err);
  }
);

export default apiClient;
