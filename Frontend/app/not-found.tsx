/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * not-found.tsx, May 7, 2026 nxplong
 */
'use client';

import { useEffect } from 'react';
import { redirectToSystemError } from '@/lib/utils/errorHelper';
import { CODE_ER022 } from '@/lib/constants/config';

/**
 * Component xử lý khi người dùng truy cập trang không tồn tại (404).
 * Sẽ tự động chuyển hướng về trang System Error với mã lỗi ER022.
 */
export default function NotFound() {
  useEffect(() => {
    // Chuyển hướng ngay lập tức về trang System Error
    redirectToSystemError(CODE_ER022);
  }, []);

  return null;
}
