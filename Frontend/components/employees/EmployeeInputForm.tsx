/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeInputForm.tsx, April 20, 2026 Ame
 */
'use client';

import React, { useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DepartmentDTO, CertificationDTO, EmployeeFormValues } from '@/types/employee';
import { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

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
}: EmployeeInputFormProps) {
  // Watch values for DatePickers
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

  return (
    <div className="row">
      <form className="c-form box-shadow" onSubmit={handleSubmit}>
        <ul>
          <li className="title">{isEditMode ? '会員情報編集' : '会員情報登録'}</li>
          
          {/* Hiển thị lỗi tổng hợp nếu có */}
          {Object.keys(errors).length > 0 && (
            <li className="box-err">
              <div className="box-err-content">
                入力内容に不備があります。各項目のメッセージを確認してください。
              </div>
            </li>
          )}

          {/* アカウント名 (Login ID) */}
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
              {errors.employeeLoginId && <div className="invalid-feedback">{errors.employeeLoginId.message}</div>}
            </div>
          </li>

          {/* グループ (Department) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">グループ:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <select 
                className={`form-control ${errors.departmentId ? 'is-invalid' : ''}`}
                {...register('departmentId')}
              >
                <option value="">選択してください</option>
                {departments.map(dept => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              {errors.departmentId && <div className="invalid-feedback">{errors.departmentId.message}</div>}
            </div>
          </li>

          {/* 氏名 (Full Name) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">氏名:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="text" 
                className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}
                {...register('employeeName')}
              />
              {errors.employeeName && <div className="invalid-feedback">{errors.employeeName.message}</div>}
            </div>
          </li>

          {/* カタカナ氏名 (Kana Name) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">カタカナ氏名:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="text" 
                className={`form-control ${errors.employeeNameKana ? 'is-invalid' : ''}`}
                {...register('employeeNameKana')}
              />
              {errors.employeeNameKana && <div className="invalid-feedback">{errors.employeeNameKana.message}</div>}
            </div>
          </li>

          {/* 生年月日 (Birth Date) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">生年月日:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <DatePicker 
                  ref={birthDateRef}
                  placeholderText='yyyy/MM/dd' 
                  selected={birthDate} 
                  onChange={(date: Date | null) => setValue('employeeBirthDate', formatDate(date))} 
                  dateFormat="yyyy/MM/dd" 
                  className={`form-control ${errors.employeeBirthDate ? 'is-invalid' : ''}`}
                />
                <span className="glyphicon glyphicon-calendar" onClick={() => birthDateRef.current?.setFocus()}></span>
              </div>
              {errors.employeeBirthDate && <div className="text-danger small mt-1">{errors.employeeBirthDate.message}</div>}
            </div>
          </li>

          {/* メールアドレス (Email) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">メールアドレス:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="text" 
                className={`form-control ${errors.employeeEmail ? 'is-invalid' : ''}`}
                {...register('employeeEmail')}
              />
              {errors.employeeEmail && <div className="invalid-feedback">{errors.employeeEmail.message}</div>}
            </div>
          </li>

          {/* 電話番号 (Telephone) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">電話番号:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="text" 
                className={`form-control ${errors.employeeTelephone ? 'is-invalid' : ''}`}
                {...register('employeeTelephone')}
              />
              {errors.employeeTelephone && <div className="invalid-feedback">{errors.employeeTelephone.message}</div>}
            </div>
          </li>

          {/* パスワード (Password) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">パスワード:{!isEditMode && <span className="note-red">*</span>}</i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="password" 
                className={`form-control ${errors.employeeLoginPassword ? 'is-invalid' : ''}`}
                {...register('employeeLoginPassword')}
              />
              {errors.employeeLoginPassword && <div className="invalid-feedback">{errors.employeeLoginPassword.message}</div>}
            </div>
          </li>

          {/* パスワード確認 (Confirm Password) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">パスワード（確認）:</i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="password" 
                className={`form-control ${errors.employeeLoginPasswordConfirm ? 'is-invalid' : ''}`}
                {...register('employeeLoginPasswordConfirm')}
              />
              {errors.employeeLoginPasswordConfirm && <div className="invalid-feedback">{errors.employeeLoginPasswordConfirm.message}</div>}
            </div>
          </li>

          <li className="title mt-12"><a href="#!">日本語能力</a></li>

          {/* 資格 (Certification) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">資格:</i>
            </label>
            <div className="col-sm col-sm-10">
              <select 
                className={`form-control ${errors.certificationId ? 'is-invalid' : ''}`}
                {...register('certificationId')}
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

          {/* 資格交付日 (Certification Start Date) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">資格交付日:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <DatePicker 
                  ref={certificationStartDateRef}
                  placeholderText='yyyy/MM/dd' 
                  selected={certificationStartDate} 
                  onChange={(date: Date | null) => setValue('certificationStartDate', formatDate(date))} 
                  dateFormat="yyyy/MM/dd" 
                  className={`form-control ${errors.certificationStartDate ? 'is-invalid' : ''}`}
                  disabled={isCertDisabled}
                />
                <span className="glyphicon glyphicon-calendar" onClick={() => certificationStartDateRef.current?.setFocus()}></span>
              </div>
              {errors.certificationStartDate && <div className="text-danger small mt-1">{errors.certificationStartDate.message}</div>}
            </div>
          </li>

          {/* 失効日 (Certification End Date) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">失効日:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <DatePicker 
                  ref={certificationEndDateRef}
                  placeholderText='yyyy/MM/dd' 
                  selected={certificationEndDate} 
                  onChange={(date: Date | null) => setValue('certificationEndDate', formatDate(date))} 
                  dateFormat="yyyy/MM/dd" 
                  className={`form-control ${errors.certificationEndDate ? 'is-invalid' : ''}`}
                  disabled={isCertDisabled}
                />
                <span className="glyphicon glyphicon-calendar" onClick={() => certificationEndDateRef.current?.setFocus()}></span>
              </div>
              {errors.certificationEndDate && <div className="text-danger small mt-1">{errors.certificationEndDate.message}</div>}
            </div>
          </li>

          {/* 点数 (Score) */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">点数:</i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="text" 
                className={`form-control ${errors.score ? 'is-invalid' : ''}`}
                {...register('score')}
                disabled={isCertDisabled}
              />
              {errors.score && <div className="invalid-feedback">{errors.score.message}</div>}
            </div>
          </li>

          <li className="form-group row d-flex">
            <div className="btn-group col-sm col-sm-10 ml">
              <button type="submit" className="btn btn-primary btn-sm">確認</button>
              <button type="button" onClick={handleBack} className="btn btn-secondary btn-sm">戻る</button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
