/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm006.ts, April 29, 2026 nxplong
 */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MESSAGES } from '@/lib/constants/messages';

/**
 * Custom Hook useAdm006 quản lý logic cho màn hình Hoàn tất tác vụ (ADM006).
 * - Xác định thông báo cần hiển thị dựa trên tham số 'type' từ URL.
 * - Xử lý điều hướng khi nhấn nút OK.
 */
export function useAdm006() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy loại tác vụ (add, edit, delete) từ query parameter
  const type = searchParams.get('type');

  // Xác định mã tin nhắn tương ứng với tác vụ
  let messageCode = 'MSG001'; // Mặc định là đăng ký (Add)
  if (type === 'edit') {
    messageCode = 'MSG002'; // Cập nhật (Edit)
  } else if (type === 'delete') {
    messageCode = 'MSG003'; // Xóa (Delete)
  }

  // Lấy nội dung tin nhắn từ hằng số
  const displayMessage = MESSAGES[messageCode];

  /**
   * Xử lý khi người dùng nhấn nút OK.
   * Điều hướng quay lại màn hình danh sách nhân viên (ADM002).
   */
  const handleOk = () => {
    router.push('/employees/adm002');
  };

  return {
    displayMessage,
    handleOk,
  };
}
