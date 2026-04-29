/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeDetailForm.tsx, April 24, 2026 nxplong
 */
import React from 'react';

interface EmployeeDetailFormProps {
  employee: any;
  handleEdit: () => void;
  handleDelete: () => void;
  handleBack: () => void;
}

/**
 * Component hiển thị form chi tiết nhân viên (ADM003).
 * @param employee - Đối tượng chứa thông tin nhân viên
 * @param handleEdit - Hàm xử lý khi nhấn nút chỉnh sửa
 * @param handleDelete - Hàm xử lý khi nhấn nút xóa
 * @param handleBack - Hàm xử lý khi nhấn nút quay lại
 */
export default function EmployeeDetailForm({
  employee,
  handleEdit,
  handleDelete,
  handleBack,
}: EmployeeDetailFormProps) {
  // Kiểm tra nếu employee không tồn tại thì không hiển thị gì cả
  if (!employee) return null;

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
          <li className="title mt-12"><a href="#!">日本語能力</a></li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">資格</label>
            <div className="col-sm col-sm-10">{employee.certificationName || ''}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">資格交付日</label>
            <div className="col-sm col-sm-10">{employee.certificationStartDate || ''}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">失効日</label>
            <div className="col-sm col-sm-10">{employee.certificationEndDate || ''}</div>
          </li>
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">点数</label>
            <div className="col-sm col-sm-10">{employee.score || ''}</div>
          </li>
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
