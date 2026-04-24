/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * page.tsx, April 13, 2026 nxplong
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAdm002 } from '@/hooks/useAdm002';
import EmployeeListForm from '@/components/employees/EmployeeListForm';
import { Suspense } from 'react';

/**
 * Nội dung trang danh sách nhân viên.
 */
function EmployeeListContent() {
  // Xác thực người dùng
  useAuth();

  // Sử dụng custom hook để lấy toàn bộ dữ liệu và các hàm xử lý
  const hookData = useAdm002();

  return <EmployeeListForm {...hookData} />;
}

/**
 * Trang danh sách nhân viên bọc trong Suspense.
 */
export default function EmployeeListPage() {
  return (
    <Suspense fallback={<div className="text-center py-4">ローディング中...</div>}>
      <EmployeeListContent />
    </Suspense>
  );
}
