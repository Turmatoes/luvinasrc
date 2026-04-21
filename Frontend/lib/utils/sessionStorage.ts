/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * sessionStorage.ts, April 21, 2026 nxplong
 */

type ScreenKey = 'ADM002' | 'ADM004';

const SESSION_KEYS: Record<ScreenKey, string> = {
  ADM002: 'ADM002_LIST_STATE',
  ADM004: 'ADM004_FORM_DATA',
};

/**
 * Lấy storage key cho từng màn hình
 */
export const getStorageKey = (screen: ScreenKey): string => {
  return SESSION_KEYS[screen];
};

/**
 * Đẩy dữ liệu vào sessionStorage
 */
export const putSessionData = (key: string, data: any): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, JSON.stringify(data));
  }
};

/**
 * Lấy dữ liệu từ sessionStorage
 */
export const getSessionData = (key: string): any | null => {
  if (typeof window !== 'undefined') {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

/**
 * Xóa dữ liệu khỏi sessionStorage
 */
export const clearSessionData = (key: string): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(key);
  }
};
