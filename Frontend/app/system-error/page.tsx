/*
 * Copyright(C) 2010 Luvina Software Company
 * 
 * page.tsx, April 22, 2026 nxplong
 */
'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

/**
 * Nội dung trang System Error.
 */
function SystemErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Lấy message từ query params, nếu không có dùng mặc định
  const message = searchParams.get('message') || 'システムエラーが発生しました。';

  return (
    <div className="notification-box" style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', marginTop: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h1 className="title note-err" style={{ fontSize: '24px', color: '#d9534f', marginBottom: '30px' }}>
        {message}
      </h1>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => router.push('/employees/adm002')}
        style={{ padding: '8px 30px', cursor: 'pointer' }}
      >
        OK
      </button>
    </div>
  );
}

/**
 * Trang lỗi hệ thống (ADM006 - System Error).
 */
export default function SystemErrorPage() {
  return (
    <Suspense fallback={<div className="text-center py-4">ローディング中...</div>}>
      <SystemErrorContent />
    </Suspense>
  );
}
