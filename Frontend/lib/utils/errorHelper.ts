/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * errorHelper.ts, April 22, 2026 nxplong
 */
import { getMessage } from './messageHelper';

/**
 * Điều hướng người dùng về trang lỗi hệ thống.
 * @param code Mã lỗi (mặc định ER023)
 * @param message Thông báo lỗi (mặc định lấy từ MESSAGES)
 */
export function redirectToSystemError(code: string = 'ER023', message?: string) {
  if (typeof window !== 'undefined') {
    const errorMsg = message || getMessage(code);
    const encodedMsg = encodeURIComponent(errorMsg);
    window.location.href = `/system-error?message=${encodedMsg}&code=${code}`;
  }
}
