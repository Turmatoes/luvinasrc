/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * page.tsx, April 21, 2026 nxplong
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAdm005 } from '@/hooks/useAdm005';
import { Suspense } from 'react';

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
    handleConfirm,
    handleBack,
  } = useAdm005();

  if (loading || !formData) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">
            <p>情報確認</p>
            <p>入力された情報をＯＫボタンクリックでＤＢへ保存してください</p>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">アカウント名</label>
            <div className="col-sm col-sm-10">{formData.employeeLoginId || '-'}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">グループ</label>
            <div className="col-sm col-sm-10">
              {departments[formData.departmentId] || formData.departmentId || '-'}
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">氏名</label>
            <div className="col-sm col-sm-10">{formData.employeeName || '-'}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">カタカナ氏名</label>
            <div className="col-sm col-sm-10">{formData.employeeNameKana || '-'}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">生年月日</label>
            <div className="col-sm col-sm-10">{formData.employeeBirthDate || '-'}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">メールアドレス</label>
            <div className="col-sm col-sm-10">{formData.employeeEmail || '-'}</div>
          </li>
          <li className="form-group row d-flex  bor-none">
            <label className="col-form-label col-sm-2">電話番号</label>
            <div className="col-sm col-sm-10">{formData.employeeTelephone || '-'}</div>
          </li>
          <li className="title mt-12"><a href="#!">日本語能力</a></li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">資格</label>
            <div className="col-sm col-sm-10">
              {certifications[formData.certificationId || ''] || (formData.certificationId ? 'Unknown' : '-') || '-'}
            </div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">資格交付日</label>
            <div className="col-sm col-sm-10">{formData.certificationStartDate || '-'}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">失効日</label>
            <div className="col-sm col-sm-10">{formData.certificationEndDate || '-'}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">点数</label>
            <div className="col-sm col-sm-10">{formData.score || '-'}</div>
          </li>
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="button" onClick={handleConfirm} className="btn btn-primary btn-sm">OK</button>
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
    <Suspense fallback={<div>Loading page...</div>}>
      <EmployeeConfirmPageContent />
    </Suspense>
  );
}

