/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * page.tsx, April 20, 2026 nxplong
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAdm004 } from '@/hooks/useAdm004';
import EmployeeInputForm from '@/components/employees/EmployeeInputForm';
import { Suspense } from 'react';

/**
 * Trang Nhập liệu Nhân viên (ADM004 - Add/Edit).
 * Kết nối logic từ useAdm004 vào giao diện EmployeeInputForm.
 */
function EmployeeInputPageContent() {
  // Xác thực người dùng
  useAuth();

  // Sử dụng Hook để quản lý toàn bộ logic nghiệp vụ
  const hookData = useAdm004();

  const { loading, error } = hookData;

  if (loading) {
    return <div className="text-center py-4">Loading data...</div>;
  }

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Giao diện Form nhập liệu */}
      <EmployeeInputForm {...hookData} />
    </>
  );
}

/**
 * Bọc trong Suspense để hỗ trợ useSearchParams trong Next.js Client Component.
 */
export default function EmployeeEditPage() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <EmployeeInputPageContent />
    </Suspense>
  );
}
