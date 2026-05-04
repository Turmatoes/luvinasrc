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

export const CODE_ER001 = 'ER001';
export const CODE_ER002 = 'ER002';
export const CODE_ER003 = 'ER003';
export const CODE_ER004 = 'ER004';
export const CODE_ER005 = 'ER005';
export const CODE_ER006 = 'ER006';
export const CODE_ER007 = 'ER007';
export const CODE_ER008 = 'ER008';
export const CODE_ER009 = 'ER009';
export const CODE_ER011 = 'ER011';
export const CODE_ER012 = 'ER012';
export const CODE_ER013 = 'ER013';
export const CODE_ER017 = 'ER017';
export const CODE_ER014 = 'ER014';
export const CODE_ER018 = 'ER018';
export const CODE_ER019 = 'ER019';
export const CODE_ER021 = 'ER021';

// Các chế độ thực hiện tác vụ (ADM006)
export const MODE_ADD = 'add';
export const MODE_EDIT = 'edit';
export const MODE_DELETE = 'delete';

// Các tham số query string
export const PARAM_ID = 'id';
export const PARAM_MODE = 'mode';
export const PARAM_TYPE = 'type';

// Các tham số tìm kiếm và sắp xếp (ADM002)
export const PARAM_NAME = 'name';
export const PARAM_DEPT = 'dept';
export const PARAM_PAGE = 'page';
export const PARAM_SORT_NAME = 'sortName';
export const PARAM_SORT_CERT = 'sortCert';
export const PARAM_SORT_DATE = 'sortDate';

// Các giá trị đặc biệt của tham số
export const MODE_BACK = 'back';
