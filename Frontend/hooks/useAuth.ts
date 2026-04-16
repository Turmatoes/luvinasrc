/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAuth.ts, April 13, 2026 nxplong
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isTokenExpired } from '@/lib/auth/token';

/**
 * Hook xác thực người dùng.
 * Kiểm tra token và chuyển hướng đến trang đăng nhập nếu không có token hoặc token đã hết hạn.
 */
const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired(token?.accessToken)) {
      router.push('/adm001');
    }
  }, [router]);
};

const useGuest = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token?.accessToken)) {
      router.push('/employees/adm002');
    }
  }, [router]);
}


export { useAuth, useGuest };
