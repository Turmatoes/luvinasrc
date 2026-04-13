/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * client.ts, April 13, 2026 nxplong
 */
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085/api';

/**
 * Axios client instance với base URL và headers đã được cấu hình.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Thiết lập interceptors cho axios client.
 * @param client Axios client instance
 */
export function setupInterceptors(client: ReturnType<typeof axios.create>) {
  client.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('access_token');
        if (token) {
          if (config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('token_type');
          window.location.href = '/ADM001';
        }
      }
      return Promise.reject(error);
    }
  );
}

setupInterceptors(apiClient);

export { apiClient };

