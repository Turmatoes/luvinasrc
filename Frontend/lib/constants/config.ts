/*
 * config.ts
 */

/**
 * Các cấu hình chung tĩnh của hệ thống Frontend
 */
export const MAX_FULLNAME_LENGTH = 125;
export const LIMIT_PER_PAGE = 20;
export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 phút tính bằng ms

// Độ dài các trường
export const MAX_LOGIN_ID_LENGTH = 50;
export const MAX_EMPLOYEE_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 100;
export const MAX_TELEPHONE_LENGTH = 50;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 50;

// Các mã lỗi hệ thống
export const ERR_SYSTEM = 'ER023';
export const ERR_SUCCESS = '200';
