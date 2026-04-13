'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth/token';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      router.replace('/employees/ADM002');
    } else {
      router.replace('/ADM001');
    }
  }, [router]);

  return null;
}
