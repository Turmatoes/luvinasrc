/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * page.tsx, April 20, 2026 nxplong
 */
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAdm003 } from '@/hooks/useAdm003';
import { Suspense } from 'react';

/**
 * Nội dung trang Chi tiết nhân viên (ADM003).
 * Kết nối dữ liệu từ Hook useAdm003 vào giao diện.
 */
function EmployeeDetailContent() {
  // Xác thực người dùng
  useAuth();

  // Sử dụng Hook để lấy dữ liệu chi tiết
  const { employee, loading, error, handleEdit, handleDelete, handleBack } = useAdm003();

  // Trạng thái Loading
  if (loading) {
    return <div className="text-center py-4">ローディング中...</div>;
  }

  // Trạng thái Error
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!employee) return null;

  // Giao diện hiển thị thông tin chi tiết
  return (
    <div className="row">
      <form className="c-form box-shadow">
        <ul className="show-data">
          <li className="title">情報確認</li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">アカウント名</label>
            <div className="col-sm col-sm-10">{employee.employeeLoginId}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">グループ</label>
            <div className="col-sm col-sm-10">{employee.departmentName}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">氏名</label>
            <div className="col-sm col-sm-10">{employee.employeeName}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">カタカナ氏名</label>
            <div className="col-sm col-sm-10">{employee.employeeNameKana}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">生年月日</label>
            <div className="col-sm col-sm-10">{employee.employeeBirthDate}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">メールアドレス</label>
            <div className="col-sm col-sm-10">{employee.employeeEmail}</div>
          </li>
          <li className="form-group row d-flex bor-none">
            <label className="col-form-label col-sm-2">電話番号</label>
            <div className="col-sm col-sm-10">{employee.employeeTelephone}</div>
          </li>
          {employee.certificationName && (
            <>
              <li className="title mt-12"><a href="#!">日本語能力</a></li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">資格</label>
                <div className="col-sm col-sm-10">{employee.certificationName}</div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">資格交付日</label>
                <div className="col-sm col-sm-10">{employee.certificationStartDate}</div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">失効日</label>
                <div className="col-sm col-sm-10">{employee.certificationEndDate}</div>
              </li>
              <li className="form-group row d-flex">
                <label className="col-form-label col-sm-2">点数</label>
                <div className="col-sm col-sm-10">{employee.score}</div>
              </li>
            </>
          )}
          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="button" onClick={handleEdit} className="btn btn-primary btn-sm">編集</button>
              <button type="button" onClick={handleDelete} className="btn btn-secondary btn-sm">削除</button>
              <button type="button" onClick={handleBack} className="btn btn-secondary btn-sm">戻る</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
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
