/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * EmployeeInputForm.tsx, April 20, 2026 nxplong
 */
'use client';

import React from 'react';
import { Controller, UseFormRegister, Control, FieldErrors } from 'react-hook-form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DepartmentDTO, CertificationDTO } from '@/types/employee';
import { FormValues } from '@/hooks/useAdm004';

interface EmployeeInputFormProps {
  register: UseFormRegister<FormValues>;
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
  departments: DepartmentDTO[];
  certifications: CertificationDTO[];
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  handleBack: () => void;
  isEdit: boolean;
  errorVisible: string | null;
  loading: boolean;
  isCertSelected: boolean;
}

/**
 * Component hiển thị Form nhập liệu nhân viên (ADM004).
 * Thiết kế khớp hoàn toàn với MockHTML/adm004.html.
 */
export default function EmployeeInputForm({
  register,
  control,
  errors,
  departments,
  certifications,
  onSubmit,
  handleBack,
  isEdit,
  errorVisible,
  loading,
  isCertSelected
}: EmployeeInputFormProps) {

  return (
    <div className="row">
      <form className="c-form box-shadow" onSubmit={onSubmit}>
        <ul>
          <li className="title">{isEdit ? '会員情報編集' : '会員情報入力'}</li>
          
          {errorVisible && (
            <li className="box-err">
              <div className="box-err-content">{errorVisible}</div>
            </li>
          )}

          {/* Аカウント名 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">アカウント名:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="text" 
                className={`form-control ${errors.employeeLoginId ? 'is-invalid' : ''}`}
                {...register('employeeLoginId')} 
              />
              {errors.employeeLoginId && (
                <div className="invalid-feedback d-block">{errors.employeeLoginId.message}</div>
              )}
            </div>
          </li>

          {/* グループ */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">グループ:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <select 
                className={`form-control ${errors.departmentId ? 'is-invalid' : ''}`}
                {...register('departmentId', { valueAsNumber: true })}
              >
                <option value="">選択してください</option>
                {departments.map(dept => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <div className="invalid-feedback d-block">{errors.departmentId.message}</div>
              )}
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
                className={`form-control ${errors.employeeName ? 'is-invalid' : ''}`}
                {...register('employeeName')} 
              />
              {errors.employeeName && (
                <div className="invalid-feedback d-block">{errors.employeeName.message}</div>
              )}
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
                className={`form-control ${errors.employeeNameKana ? 'is-invalid' : ''}`}
                {...register('employeeNameKana')} 
              />
              {errors.employeeNameKana && (
                <div className="invalid-feedback d-block">{errors.employeeNameKana.message}</div>
              )}
            </div>
          </li>

          {/* 生年月日 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">生年月日:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10 d-flex flex-column">
              <div className="datepicker-wrapper">
                <Controller
                  control={control}
                  name="employeeBirthDate"
                  render={({ field }) => (
                    <DatePicker
                      placeholderText="yyyy/MM/dd"
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date: Date | null) => {
                        const formatted = date ? date.toISOString().split('T')[0].replace(/-/g, '/') : '';
                        field.onChange(formatted);
                      }}
                      dateFormat="yyyy/MM/dd"
                      className={`form-control ${errors.employeeBirthDate ? 'is-invalid' : ''}`}
                    />
                  )}
                />
              </div>
              {errors.employeeBirthDate && (
                <div className="invalid-feedback d-block">{errors.employeeBirthDate.message}</div>
              )}
            </div>
          </li>

          {/* メールアドレス */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">メールアドレス:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="email" 
                className={`form-control ${errors.employeeEmail ? 'is-invalid' : ''}`}
                {...register('employeeEmail')} 
              />
              {errors.employeeEmail && (
                <div className="invalid-feedback d-block">{errors.employeeEmail.message}</div>
              )}
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
                className={`form-control ${errors.employeeTelephone ? 'is-invalid' : ''}`}
                {...register('employeeTelephone')} 
              />
              {errors.employeeTelephone && (
                <div className="invalid-feedback d-block">{errors.employeeTelephone.message}</div>
              )}
            </div>
          </li>

          {/* パスワード */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">パスワード:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="password" 
                autoComplete="new-password"
                className={`form-control ${errors.employeeLoginPassword ? 'is-invalid' : ''}`}
                {...register('employeeLoginPassword')} 
              />
              {errors.employeeLoginPassword && (
                <div className="invalid-feedback d-block">{errors.employeeLoginPassword.message}</div>
              )}
            </div>
          </li>

          {/* パスワード（確認） */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">パスワード（確認）:</i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="password" 
                autoComplete="new-password"
                className={`form-control ${errors.employeeLoginPasswordConfirm ? 'is-invalid' : ''}`}
                {...register('employeeLoginPasswordConfirm')} 
              />
              {errors.employeeLoginPasswordConfirm && (
                <div className="invalid-feedback d-block">{errors.employeeLoginPasswordConfirm.message}</div>
              )}
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
                className={`form-control ${errors.certifications?.[0]?.certificationId ? 'is-invalid' : ''}`}
                {...register(`certifications.0.certificationId`, { valueAsNumber: true })}
              >
                <option value={0}>選択してください</option>
                {certifications.map(c => (
                  <option key={c.certificationId} value={c.certificationId}>{c.certificationName}</option>
                ))}
              </select>
              {errors.certifications?.[0]?.certificationId && (
                <div className="invalid-feedback d-block">{errors.certifications[0].certificationId.message}</div>
              )}
            </div>
          </li>

          {/* 資格交付日 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">資格交付日:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <div className="datepicker-wrapper">
                <Controller
                  control={control}
                  name={`certifications.0.certificationStartDate`}
                  render={({ field }) => (
                    <DatePicker
                      placeholderText="yyyy/MM/dd"
                      disabled={!isCertSelected}
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date: Date | null) => field.onChange(date ? date.toISOString().split('T')[0].replace(/-/g, '/') : '')}
                      dateFormat="yyyy/MM/dd"
                      className={`form-control ${errors.certifications?.[0]?.certificationStartDate ? 'is-invalid' : ''}`}
                    />
                  )}
                />
              </div>
              {errors.certifications?.[0]?.certificationStartDate && (
                <div className="invalid-feedback d-block">{errors.certifications[0].certificationStartDate.message}</div>
              )}
            </div>
          </li>

          {/* 失効日 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">失効日:<span className="note-red">*</span></i>
            </label>
            <div className="col-sm col-sm-10">
              <div className="datepicker-wrapper">
                <Controller
                  control={control}
                  name={`certifications.0.certificationEndDate`}
                  render={({ field }) => (
                    <DatePicker
                      placeholderText="yyyy/MM/dd"
                      disabled={!isCertSelected}
                      selected={field.value ? new Date(field.value) : null}
                      onChange={(date: Date | null) => field.onChange(date ? date.toISOString().split('T')[0].replace(/-/g, '/') : '')}
                      dateFormat="yyyy/MM/dd"
                      className={`form-control ${errors.certifications?.[0]?.certificationEndDate ? 'is-invalid' : ''}`}
                    />
                  )}
                />
              </div>
              {errors.certifications?.[0]?.certificationEndDate && (
                <div className="invalid-feedback d-block">{errors.certifications[0].certificationEndDate.message}</div>
              )}
            </div>
          </li>

          {/* 点数 */}
          <li className="form-group row d-flex">
            <label className="col-form-label col-sm-2">
              <i className="relative">点数:</i>
            </label>
            <div className="col-sm col-sm-10">
              <input 
                type="number" 
                disabled={!isCertSelected}
                className={`form-control ${errors.certifications?.[0]?.score ? 'is-invalid' : ''}`}
                {...register(`certifications.0.score`, { valueAsNumber: true })}
              />
              {errors.certifications?.[0]?.score && (
                <div className="invalid-feedback d-block">{errors.certifications[0].score.message}</div>
              )}
            </div>
          </li>

          {/* Nút hành động */}
          <li className="form-group row d-flex mt-4">
            <div className="btn-group col-sm col-sm-10 ml">
              <button 
                type="submit" 
                className="btn btn-primary btn-sm"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : '確認'}
              </button>
              <button 
                type="button" 
                onClick={handleBack} 
                className="btn btn-secondary btn-sm"
              >
                戻る
              </button>
            </div>
          </li>
        </ul>
      </form>
    </div>
  );
}
