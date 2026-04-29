'use client';
/**
 * Copyright(C) 2010 Luvina Software Company
 * 
 * page.tsx (ADM006), April 29, 2026 nxplong
 */
import { useAuth } from '@/hooks/useAuth';
import { useAdm006 } from '@/hooks/useAdm006';
import EmployeeCompleteForm from '@/components/employees/EmployeeCompleteForm';
import { Suspense } from 'react';

/**
 * Nội dung trang hoàn tất (ADM006).
 * Kết nối logic từ Hook useAdm006 vào giao diện EmployeeCompleteForm.
 */
function EmployeeCompleteContent() {
  // Xác thực người dùng
  useAuth();

  // Sử dụng Hook để lấy dữ liệu tin nhắn và hàm xử lý
  const { displayMessage, handleOk } = useAdm006();

  return (
    <EmployeeCompleteForm
      displayMessage={displayMessage}
      handleOk={handleOk}
    />
  );
}

/**
 * Bọc trong Suspense để hỗ trợ useRouter và client-side rendering
 */
export default function EmployeeCompletePage() {
  return (
    <Suspense fallback={<div className="text-center py-4">ローディング中...</div>}>
      <EmployeeCompleteContent />
    </Suspense>
  );
}
