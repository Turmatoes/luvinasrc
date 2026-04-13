/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * token.ts, April 13, 2026 nxplong
 */

/**
 * Lưu token vào session storage.
 * 
 * @param token Token cần lưu
 * @param tokenType Loại token
 */
export function storeToken(token: string, tokenType: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('access_token', token);
    sessionStorage.setItem('token_type', tokenType);
  }
}

/**
 * Lấy token từ session storage.
 * 
 * @returns Object chứa access token và token type, hoặc null nếu không có token
 */
export function getToken(): { accessToken: string; tokenType: string } | null {
  if (typeof window === 'undefined') return null;

  const accessToken = sessionStorage.getItem('access_token');
  const tokenType = sessionStorage.getItem('token_type');

  if (accessToken && tokenType) {
    return { accessToken, tokenType };
  }
  return null;
}

/**
 * Xóa token khỏi session storage.
 */
export function removeToken() {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('token_type');
  }
}

/**
 * Kiểm tra xem token đã hết hạn chưa.
 * 
 * @param token Token cần kiểm tra
 * @returns true nếu token đã hết hạn, ngược lại false
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

