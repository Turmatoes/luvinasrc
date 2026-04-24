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
export const ERR_SUCCESS = 'OK';
export const ERR_NOT_FOUND = '404';
export const ERR_SERVER_ERROR = '500';

export const CODE_ER001 = 'ER001'; // Required
export const CODE_ER002 = 'ER002'; // Required Select
export const CODE_ER003 = 'ER003'; // Already Exists
export const CODE_ER004 = 'ER004'; // Not Found (FK)
export const CODE_ER005 = 'ER005'; // Format Email
export const CODE_ER006 = 'ER006'; // Max Length
export const CODE_ER007 = 'ER007'; // Min/Max Length
export const CODE_ER008 = 'ER008'; // Half-size Number
export const CODE_ER009 = 'ER009'; // Katakana
export const CODE_ER011 = 'ER011'; // Date Format
export const CODE_ER012 = 'ER012'; // Date Range
export const CODE_ER013 = 'ER013'; // Employee Not Found
export const CODE_ER014 = 'ER014'; // Auth Failed
export const CODE_ER018 = 'ER018'; // Positive Integer
export const CODE_ER019 = 'ER019'; // Login ID Format
export const CODE_ER021 = 'ER021'; // Invalid Sort
