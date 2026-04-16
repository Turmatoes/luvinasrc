/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * layout.tsx, April 13, 2026 nxplong
 */
'use client'
import './globals.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { usePathname } from 'next/navigation';

/**
 * Component layout chính của ứng dụng.
 * Bao gồm Header, Footer và nội dung trang.
 * 
 * @param children Nội dung trang
 * @returns Component layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showHeaderFooter = !pathname.includes('/adm001');

  return (
    <html lang="ja">
      <body>
        {showHeaderFooter ? (
          <main>
            <div className="container">
              <Header />
              <div className="content">
                <div className="content-main">
                  {children}
                </div>
              </div>
              <Footer />
            </div>
          </main>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
