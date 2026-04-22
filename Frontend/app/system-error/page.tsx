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
  const code = searchParams.get('code') || 'ER023';

  return (
    <main>
      <div className="container">
        <nav className="nav-bar">
          <div className="content-main">
            <div className="d-flex" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <a className="navbar-brand">
                  <Image src="/assets/images/Logo-Luvina.svg" title="Logo" alt="logo" width={100} height={40} />
                </a>
                <h5 className="title-brand" style={{ marginLeft: '15px', fontSize: '18px', fontWeight: 'bold' }}>Luvina Software</h5>
              </div>
              <ul className="navbar-nav flex-row d-flex" style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}>
                <li className="nav-item" style={{ marginRight: '15px' }}>
                  <a href="/logout" style={{ textDecoration: 'none' }}>ログアウト</a>
                </li>
                <li className="nav-item">
                  <a href="/employees/adm002" style={{ textDecoration: 'none' }}>トップ</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        
        <div className="content">
          <div className="content-main">
            <div className="notification-box" style={{ padding: '50px 20px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '8px', marginTop: '30px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <h1 className="title note-err" style={{ fontSize: '24px', color: '#d9534f', marginBottom: '30px' }}>
                {message} ({code})
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
          </div>
        </div>

        <footer className="footer" style={{ marginTop: 'auto', padding: '20px 0', textAlign: 'center' }}>
          <div className="content-main">
            <p>Copyright © 2010 ルビナソフトウエア株式会社. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
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
