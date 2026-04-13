/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * messageHelper.ts, April 13, 2026 nxplong
 */
import { MESSAGES } from '../constants/messages';

/**
 * Lấy thông báo theo mã và thay thế các tham số.
 * 
 * @param code Mã thông báo (ví dụ: 'ER001', 'MSG005')
 * @param params Các tham số để thay thế {0}, {1}, etc. theo thứ tự
 * @returns Thông báo đã được định dạng hoặc mã nếu không tìm thấy trong dictionary
 */
export function getMessage(code: string, params: (string | number)[] = []): string {
  let message = MESSAGES[code] || code;

  if (!params || params.length === 0) {
    return message;
  }

  params.forEach((param, index) => {
    const placeholder = `{${index}}`;
    message = message.replace(placeholder, String(param));
  });

  return message;
}

/**
 * Kiểm tra xem một chuỗi có phải là mã thông báo không.
 * 
 * @param value Chuỗi cần kiểm tra
 * @returns true nếu là mã thông báo, ngược lại false
 */
export function isMessageCode(value: string): boolean {
  return value in MESSAGES;
}
