/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * page.tsx, April 13, 2026 nxplong
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth/token';

/**
 * Trang chủ ứng dụng.
 * Tự động chuyển hướng đến trang đăng nhập hoặc trang danh sách nhân viên dựa trên trạng thái xác thực.
 * 
 * @returns null (component không render gì cả)
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace('/employees/adm002');
    } else {
      router.replace('/adm001');
    }
  }, [router]);

  return null;
}
