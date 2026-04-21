/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeInputForm.tsx, April 20, 2026 nxplong
 */
'use client';

import React, { useRef } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ja } from 'date-fns/locale';
import { DepartmentDTO, CertificationDTO, EmployeeFormValues } from '@/types/employee';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

registerLocale('ja', ja);

interface EmployeeInputFormProps {
  register: UseFormRegister<EmployeeFormValues>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<EmployeeFormValues>;
  setValue: UseFormSetValue<EmployeeFormValues>;
  watch: UseFormWatch<EmployeeFormValues>;
  departments: DepartmentDTO[];
  certifications: CertificationDTO[];
  isEditMode: boolean;
  handleBack: () => void;
  handleCertificationChange: (value: string) => void;
}

/**
 * Component Form nhập liệu nhân viên (ADM004).
 * Chứa giao diện và kết nối với React Hook Form.
 * 
 * @param props Các props được truyền từ useAdm004
 * @returns Component giao diện Form
 */
export default function EmployeeInputForm({
  register,
  handleSubmit,
  errors,
  setValue,
  watch,
  departments,
  certifications,
  isEditMode,
  handleBack,
  handleCertificationChange,
}: EmployeeInputFormProps) {
  // Giá trị DatePickers cho các trường Date
  const birthDateVal = watch('employeeBirthDate');
  const birthDate = birthDateVal ? new Date(birthDateVal) : null;

  const certStartVal = watch('certificationStartDate');
  const certificationStartDate = certStartVal ? new Date(certStartVal) : null;

  const certEndVal = watch('certificationEndDate');
  const certificationEndDate = certEndVal ? new Date(certEndVal) : null;

  const certificationId = watch('certificationId');
  const isCertDisabled = !certificationId;

  const birthDateRef = useRef<DatePicker>(null);
  const certificationStartDateRef = useRef<DatePicker>(null);
  const certificationEndDateRef = useRef<DatePicker>(null);

  /**
   * Chuyển đổi Date sang định dạng YYYY/MM/DD để lưu vào state.
   */
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
  };

  /**
   * Hiển thị lỗi cho từng trường.
   */
  const renderError = (fieldName: keyof EmployeeFormValues) => {
    const error = errors[fieldName];
    if (!error) return null;

    // Thêm dấu chấm than nếu là lỗi không nhập vào trường
    let message = error.message;
    if (message?.includes('ください') && !message.endsWith('！')) {
      message += '！';
    }

    return <div className="invalid-feedback">{message}</div>;
  };


  return (
    <div className="row">
      <form className="c-form box-shadow" onSubmit={handleSubmit}>
        <ul className="show-data">
          <li className="title">{isEditMode ? '会員情報編集' : '会員情報登録'}</li>

          {/* アカウント名*/}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">アカウント名:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeLoginId ? 'is-invalid' : ''}`}
                {...register('employeeLoginId')}
                disabled={isEditMode}
              />
              {renderError('employeeLoginId')}
            </div>
          </li>

          {/* グループ */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">グループ:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <select
                className={`form-control ${errors.departmentId ? 'is-invalid-no-icon' : ''}`}
                {...register('departmentId')}
              >
                <option value="">選択してください</option>
                {departments.map(dept => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              {renderError('departmentId')}
            </div>
          </li>

          {/* 氏名 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">氏名:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeName ? 'is-invalid border-danger' : ''}`}
                {...register('employeeName')}
              />
              {renderError('employeeName')}
            </div>
          </li>

          {/* カタカナ氏名 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">カタカナ氏名:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeNameKana ? 'is-invalid border-danger' : ''}`}
                {...register('employeeNameKana')}
              />
              {renderError('employeeNameKana')}
            </div>
          </li>

          {/* 生年月日 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">生年月日:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <DatePicker
                  ref={birthDateRef}
                  locale="ja"
                  placeholderText='yyyy/MM/dd'
                  selected={birthDate}
                  onChange={(date: Date | null) => setValue('employeeBirthDate', formatDate(date), { shouldValidate: true })}
                  dateFormat="yyyy/MM/dd"
                  className={`form-control ${errors.employeeBirthDate ? 'is-invalid-no-icon' : ''}`}
                />
                <span className="glyphicon glyphicon-calendar" onClick={() => birthDateRef.current?.setFocus()}></span>
              </div>
              {renderError('employeeBirthDate')}
            </div>
          </li>

          {/* メールアドレス */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">メールアドレス:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeEmail ? 'is-invalid border-danger' : ''}`}
                {...register('employeeEmail')}
              />
              {renderError('employeeEmail')}
            </div>
          </li>

          {/* 電話番号 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">電話番号:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.employeeTelephone ? 'is-invalid border-danger' : ''}`}
                {...register('employeeTelephone')}
              />
              {renderError('employeeTelephone')}
            </div>
          </li>

          {/* パスワード */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">パスワード:{!isEditMode && <span className="note-red">*</span>}</i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="password"
                className={`form-control ${errors.employeeLoginPassword ? 'is-invalid border-danger' : ''}`}
                {...register('employeeLoginPassword')}
              />
              {renderError('employeeLoginPassword')}
            </div>
          </li>

          {/* パスワード確認 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">パスワード（確認）:</i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="password"
                className={`form-control ${errors.employeeLoginPasswordConfirm ? 'is-invalid border-danger' : ''}`}
                {...register('employeeLoginPasswordConfirm')}
              />
              {renderError('employeeLoginPasswordConfirm')}
            </div>
          </li>

          <li className="title mt-12"><a href="#!">日本語能力</a></li>

          {/* 資格 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">資格:</i>
            </label>
            <div className="col-sm col-sm-10">
              <select
                className={`form-control ${errors.certificationId ? 'is-invalid-no-icon' : ''}`}
                {...register('certificationId', {
                  onChange: (e) => handleCertificationChange(e.target.value)
                })}
              >
                <option value="">選択してください</option>
                {certifications.map(cert => (
                  <option key={cert.certificationId} value={cert.certificationId}>
                    {cert.certificationName}
                  </option>
                ))}
              </select>
            </div>
          </li>

          {/* 資格交付日 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">資格交付日:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <DatePicker
                  ref={certificationStartDateRef}
                  locale="ja"
                  placeholderText='yyyy/MM/dd'
                  selected={certificationStartDate}
                  onChange={(date: Date | null) => setValue('certificationStartDate', formatDate(date), { shouldValidate: true })}
                  dateFormat="yyyy/MM/dd"
                  className={`form-control ${errors.certificationStartDate ? 'is-invalid-no-icon' : ''}`}
                  disabled={isCertDisabled}
                />
                <span className="glyphicon glyphicon-calendar" onClick={() => certificationStartDateRef.current?.setFocus()}></span>
              </div>
              {renderError('certificationStartDate')}
            </div>
          </li>

          {/* 失効日 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">失効日:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <DatePicker
                  ref={certificationEndDateRef}
                  locale="ja"
                  placeholderText='yyyy/MM/dd'
                  selected={certificationEndDate}
                  onChange={(date: Date | null) => setValue('certificationEndDate', formatDate(date), { shouldValidate: true })}
                  dateFormat="yyyy/MM/dd"
                  className={`form-control ${errors.certificationEndDate ? 'is-invalid-no-icon' : ''}`}
                  disabled={isCertDisabled}
                />
                <span className="glyphicon glyphicon-calendar" onClick={() => certificationEndDateRef.current?.setFocus()}></span>
              </div>
              {renderError('certificationEndDate')}
            </div>
          </li>

          {/* 点数 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">点数:</i>
            </label>
            <div className="col-sm col-sm-10">
              <input
                type="text"
                className={`form-control ${errors.score ? 'is-invalid border-danger' : ''}`}
                {...register('score')}
                disabled={isCertDisabled}
              />
              {renderError('score')}
            </div>
          </li>

          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button
                type="submit"
                className="btn btn-primary btn-sm"
              >
                確認
              </button>
              <button type="button" onClick={handleBack} className="btn btn-secondary btn-sm">戻る</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
