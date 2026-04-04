'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useGuest } from '@/hooks/useAuth';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  useGuest();

  useEffect(() => {
    // Clear all login sessions from both local and session storage
    // as requested: "clear tất cả login session khỏi local storage"
    localStorage.clear();
    sessionStorage.clear();
  }, []);

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <div className="login100-pic js-tilt" data-tilt>
            <Image src="/assets/images/img-01.png" alt="IMG" width={400} height={300} />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

