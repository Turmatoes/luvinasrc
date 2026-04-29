/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeConfirmForm.tsx, April 24, 2026 nxplong
 */

import React from 'react';
import { EmployeeFormValues } from '@/types/employee';

interface EmployeeConfirmFormProps {
  formData: EmployeeFormValues;
  departments: Record<string, string>;
  certifications: Record<string, string>;
}

/**
 * Component hiển thị danh sách thông tin nhân viên để xác nhận (ADM005).
 * @param formData - Đối tượng chứa dữ liệu thông tin nhân viên
 * @param departments - Đối tượng chứa thông tin phòng ban
 * @param certifications - Đối tượng chứa thông tin chứng chỉ
 */
const EmployeeConfirmForm: React.FC<EmployeeConfirmFormProps> = ({
  formData,
  departments,
  certifications,
}) => {
  return (
    <>
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
      <li className="form-group row d-flex bor-none">
        <label className="col-form-label col-sm-2">電話番号</label>
        <div className="col-sm col-sm-10">{formData.employeeTelephone || '-'}</div>
      </li>

      {/* Hiển thị thông tin chứng chỉ nếu có chọn */}
      <li className="title mt-12">
        <a href="#!">日本語能力</a>
      </li>
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">資格</label>
        <div className="col-sm col-sm-10">
          {(formData.certificationId && certifications[formData.certificationId]) || ''}
        </div>
      </li>
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">資格交付日</label>
        <div className="col-sm col-sm-10">{formData.certificationStartDate || ''}</div>
      </li>
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">失効日</label>
        <div className="col-sm col-sm-10">{formData.certificationEndDate || ''}</div>
      </li>
      <li className="form-group row d-flex">
        <label className="col-form-label col-sm-2">点数</label>
        <div className="col-sm col-sm-10">{formData.score || ''}</div>
      </li>
    </>
  );
};

export default EmployeeConfirmForm;
