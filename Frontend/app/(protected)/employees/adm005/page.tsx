/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * page.tsx, April 21, 2026 nxplong
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAdm005 } from '@/hooks/useAdm005';
import { Suspense } from 'react';
import EmployeeConfirmForm from '@/components/employees/EmployeeConfirmForm';

/**
 * Trang Xác nhận Thông tin nhân viên (ADM005 - Confirmation).
 * Kết nối logic từ useAdm005 vào giao diện hiển thị.
 */
function EmployeeConfirmPageContent() {
  // Xác thực người dùng
  useAuth();

  // Sử dụng Hook để quản lý toàn bộ logic nghiệp vụ
  const {
    formData,
    departments,
    certifications,
    loading,
    handleOK,
    handleBack,
  } = useAdm005();

  if (loading || !formData) {
    return <div className="text-center py-4">ローディング中...</div>;
  }

  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">
            <p>情報確認</p>
            <p>入力された情報をＯＫボタンクリックでＤＢへ保存してください</p>
          </li>
          <EmployeeConfirmForm
            formData={formData}
            departments={departments}
            certifications={certifications}
          />
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="button" onClick={handleOK} className="btn btn-primary btn-sm">OK</button>
              <button type="button" onClick={handleBack} className="btn btn-secondary btn-sm">戻る</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}

/**
 * Bọc trong Suspense để hỗ trợ useRouter và client-side rendering
 */
export default function EmployeeConfirmPage() {
  return (
    <Suspense fallback={<div>ローディング中...</div>}>
      <EmployeeConfirmPageContent />
    </Suspense>
  );
}

