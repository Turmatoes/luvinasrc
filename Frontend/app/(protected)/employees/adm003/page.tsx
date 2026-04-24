/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * page.tsx, April 20, 2026 nxplong
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAdm003 } from '@/hooks/useAdm003';
import EmployeeDetailForm from '@/components/employees/EmployeeDetailForm';
import { Suspense } from 'react';

/**
 * Nội dung trang Chi tiết nhân viên (ADM003).
 * Kết nối dữ liệu từ Hook useAdm003 vào giao diện.
 */
function EmployeeDetailContent() {
  // Xác thực người dùng
  useAuth();

  // Sử dụng Hook để lấy dữ liệu chi tiết nhân viên
  const { employee, loading, error, handleEdit, handleDelete, handleBack } = useAdm003();

  // Trạng thái Loading
  if (loading) {
    return <div className="text-center py-4">ローディング中...</div>;
  }

  if (!employee) return null;

  // Giao diện hiển thị thông tin chi tiết nhân viên
  return (
    <EmployeeDetailForm
      employee={employee}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleBack={handleBack}
    />
  );
}

/**
 * Bọc trong Suspense để hỗ trợ useSearchParams trong Next.js Client Component.
 */
export default function EmployeeDetailPage() {
  return (
    <Suspense fallback={<div>ローディング中...</div>}>
      <EmployeeDetailContent />
    </Suspense>
  );
}
