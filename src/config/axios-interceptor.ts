import axios from 'axios';
import { envConfig, localStorageConfig } from '../config';

const ACCESS_TOKEN = localStorageConfig.accessToken;
const REFRESH_TOKEN = localStorageConfig.refreshToken;
const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;
axios.defaults.baseURL = envConfig.serverURL;

const setupAxiosInterceptors = (onUnauthenticated: any) => {
  const onRequestSuccess = async (config: any) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  const onResponseSuccess = (response: any) => response;

  const onResponseError = async (err: any) => {
    if (err) {
      let status = null;
      if (err.status) {
        status = err.status || err.response.status;
      } else if (err.response != null) {
        status = err.response.status;
      }

      if (status === 403 || status === 401) {
        try {
          const refreshToken = localStorage.getItem(REFRESH_TOKEN);

          const newAccessToken = await axios.post(`${envConfig.serverURL}/auth/refresh-token`, {
            refreshToken,
          });

          localStorage.setItem(ACCESS_TOKEN, newAccessToken.data.accessToken);
          const originalRequest = err.config;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken.data.data.accessToken}`;
          return axios(originalRequest);
        } catch (error) {
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          onUnauthenticated();
        }
      }
    }
    return Promise.reject(err);
  };

  axios.interceptors.request.use(onRequestSuccess);
  axios.interceptors.response.use(onResponseSuccess, onResponseError);
};

export default setupAxiosInterceptors;