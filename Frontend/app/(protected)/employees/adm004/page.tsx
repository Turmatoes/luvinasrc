/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * page.tsx (ADM004), April 20, 2026 nxplong
 */
'use client';

import { Suspense } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdm004 } from '@/hooks/useAdm004';
import EmployeeInputForm from '@/components/employees/EmployeeInputForm';

/**
 * Thành phần chính của trang nhập liệu/chỉnh sửa nhân viên.
 * Sử dụng Suspense để bao bọc các thành phần sử dụng useSearchParams.
 */
function EmployeeFormContainer() {
  // Xác thực người dùng
  useAuth();

  // Sử dụng custom hook để lấy toàn bộ logic xử lý
  const {
    register,
    handleSubmit,
    control,
    onSubmit,
    errors,
    departments,
    certifications,
    loading,
    errorVisible,
    handleBack,
    isEdit,
    isCertSelected
  } = useAdm004();

  return (
    <EmployeeInputForm
      register={register}
      control={control}
      errors={errors}
      departments={departments}
      certifications={certifications}
      onSubmit={handleSubmit(onSubmit)}
      handleBack={handleBack}
      isEdit={isEdit}
      errorVisible={errorVisible}
      loading={loading}
      isCertSelected={isCertSelected}
    />
  );
}

/**
 * Trang ADM004 - Nhập liệu/Chỉnh sửa nhân viên.
 * Tầng Page cực kỳ sạch bóng logic, chỉ đóng vai trò Container.
 */
export default function EmployeeInputPage() {
  return (
    <Suspense fallback={<div className="text-center py-4">Đang tải cấu hình...</div>}>
      <EmployeeFormContainer />
    </Suspense>
  );
}
