'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { MESSAGES } from '@/lib/constants/messages';

export default function EmployeeCompletePage() {
  useAuth();
  const router = useRouter();
  return (
    <div className="box-shadow">
      <div className="notification-box">
        <h1 className="msg-title">{MESSAGES.MSG001} or {MESSAGES.MSG002} or {MESSAGES.MSG003}</h1>
        <div className="notification-box-btn">
          <button type="button" onClick={() => router.push('/employees/adm002')} className="btn btn-primary btn-sm">OK</button>

        </div>
      </div>
    </div>
  );
}

