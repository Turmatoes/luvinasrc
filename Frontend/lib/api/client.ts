/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * client.ts, April 13, 2026 nxplong
 */
import axios from 'axios';
import { redirectToSystemError } from '../utils/errorHelper';
import { ERR_SYSTEM } from '../constants/config';

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
 */
export function setupInterceptors(client: ReturnType<typeof axios.create>) {
  client.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
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
    (response) => {
      const data = response.data;
      // Kiểm tra code trực tiếp - format chuẩn: {code: "", params: []}
      if (data?.code === ERR_SYSTEM) {
        redirectToSystemError(ERR_SYSTEM);
      }
      return response;
    },
    (error) => {
      const responseData = error.response?.data;
      const errorCode = responseData?.code;

      // Xử lý lỗi hệ thống ER023 hoặc Status 500
      if (errorCode === ERR_SYSTEM || error.response?.status === 500) {
        redirectToSystemError(errorCode || ERR_SYSTEM);
        return new Promise(() => { }); // Chặn lỗi tiếp tục lan truyền
      }

      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('token_type');
          window.location.href = '/adm001';
        }
      }
      return Promise.reject(error);
    }
  );
}

setupInterceptors(apiClient);

export { apiClient };

