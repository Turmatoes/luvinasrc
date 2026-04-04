'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Clear all login sessions from both local and session storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login page
    router.replace('/login');
  }, [router]);

  return null;
}
