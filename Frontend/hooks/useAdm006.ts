/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm006.ts, May 08, 2026 nxplong
 */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MESSAGES } from '@/lib/constants/messages';
import { MODE_ADD, MODE_EDIT, MODE_DELETE, PARAM_TYPE } from '@/lib/constants/config';

/**
 * Custom Hook useAdm006 quản lý logic cho màn hình Hoàn tất (ADM006).
 */
export function useAdm006() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ---------------------------------------------------------
  // 7.1 HIỂN THỊ BAN ĐẦU
  // ---------------------------------------------------------

  // Lấy loại tác vụ (add, edit, delete) từ query parameter để hiển thị message
  const type = searchParams.get(PARAM_TYPE);

  /**
   * Xác định nội dung tin nhắn cần hiển thị:
   * - TH add mới thì hiển thị: ユーザの登録が完了しました。(MSG001)
   * - TH edit thì hiển thị: ユーザ của 更新 が完了しました。(MSG002)
   * - TH delete thì hiển thị: ユーザ của 削除 が完了しました。(MSG003)
   */
  const getDisplayMessage = () => {
    if (type === MODE_EDIT) return MESSAGES.MSG002;
    if (type === MODE_DELETE) return MESSAGES.MSG003;
    return MESSAGES.MSG001; // Mặc định là đăng ký mới
  };

  const displayMessage = getDisplayMessage();

  // ---------------------------------------------------------
  // 7.2 ACTION OK
  // ---------------------------------------------------------

  /**
   * Di chuyển về màn hình danh sách ADM002, reset về trang 1.
   */
  const handleOk = () => {
    router.push('/employees/adm002');
  };

  return {
    displayMessage,
    handleOk,
  };
}
