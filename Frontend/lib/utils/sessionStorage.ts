/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * sessionStorage.ts, April 21, 2026 nxplong
 */

import { SESSION_TIMEOUT } from '../constants/config';

type ScreenKey = 'ADM002' | 'ADM004';

const SESSION_KEYS: Record<ScreenKey, string> = {
  ADM002: 'ADM002_LIST_STATE',
  ADM004: 'ADM004_FORM_DATA',
};

/**
 * Interface cho dữ liệu lưu trong session kèm thời gian hết hạn
 */
interface SessionItem<T> {
  value: T;
  expiry: number;
}

/**
 * Lấy storage key cho từng màn hình
 */
export const getStorageKey = (screen: ScreenKey): string => {
  return SESSION_KEYS[screen];
};

/**
 * Đẩy dữ liệu vào sessionStorage kèm timestamp hết hạn
 */
export const setEmployeeToSession = (key: string, data: any): void => {
  if (typeof window !== 'undefined') {
    const item: SessionItem<any> = {
      value: data,
      expiry: new Date().getTime() + SESSION_TIMEOUT,
    };
    sessionStorage.setItem(key, JSON.stringify(item));
  }
};

/**
 * Lấy dữ liệu từ sessionStorage và kiểm tra timeout
 */
export const getSessionData = (key: string): any | null => {
  if (typeof window !== 'undefined') {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) return null;

    try {
      const item: SessionItem<any> = JSON.parse(itemStr);
      const now = new Date().getTime();

      // Kiểm tra xem đã hết hạn chưa
      if (now > item.expiry) {
        sessionStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (e) {
      // Trường hợp dữ liệu cũ không đúng format SessionItem
      return null;
    }
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
