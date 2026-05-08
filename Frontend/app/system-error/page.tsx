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

  // Ẩn các tham số query trên URL ngay sau khi component mount để chỉ hiển thị /system-error
  React.useEffect(() => {
    if (typeof window !== 'undefined' && (searchParams.get('message') || searchParams.get('code'))) {
      window.history.replaceState(null, '', '/system-error');
    }
  }, [searchParams]);

  /**
   * Xử lý khi nhấn nút OK.
   * Nếu người dùng chưa đăng nhập (không có token), đưa về màn hình Login (ADM001).
   * Nếu đã đăng nhập, đưa về màn hình Danh sách (ADM002).
   */
  const handleOK = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      router.push('/adm001');
    } else {
      router.push('/employees/adm002');
    }
  };

  return (
    <div className="notification-box" style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: '#fff5f5', borderRadius: '0', marginTop: '0', boxShadow: 'none' }}>
      <h1 className="title note-err" style={{ fontSize: '24px', color: '#d9534f', marginBottom: '30px' }}>
        {message}
      </h1>
      <div style={{ paddingTop: '15px' }}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleOK}
          style={{ padding: '8px 30px', cursor: 'pointer' }}
        >
          OK
        </button>
      </div>
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
