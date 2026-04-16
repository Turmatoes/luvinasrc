/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * page.tsx, April 13, 2026 nxplong
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth/token';

/**
 * Trang xử lý đăng xuất.
 * Xóa token và chuyển hướng về trang đăng nhập.
 * 
 * @returns Component hiển thị trạng thái đăng xuất
 */
export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    removeToken();
    router.push('/adm001');
  }, [router]);

  return <div>Logging out...</div>;
}

