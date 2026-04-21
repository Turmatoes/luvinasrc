/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm004.ts, April 20, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { DepartmentDTO, CertificationDTO, EmployeeFormValues } from '@/types/employee';
import { getMessage } from '@/lib/utils/messageHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEmployeeSchema } from '@/lib/validation/employee';
import { getStorageKey, getSessionData, setEmployeeToSession, clearSessionData } from '@/lib/utils/sessionStorage';

// Key cho storage
const STORAGE_KEY = getStorageKey('ADM004');

/**
 * Custom Hook useAdm004 quản lý logic cho màn hình Nhập liệu nhân viên (Add/Edit).
 * Tích hợp React Hook Form, Zod và sessionStorage.
 * 
 * @returns Object chứa các trạng thái và hàm xử lý form
 */
export function useAdm004() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get('id');
  const modeBack = searchParams.get('mode');
  const isEditMode = !!employeeId;
  const isBackFromADM005 = modeBack === 'back';

  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [certifications, setCertifications] = useState<CertificationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema(isEditMode)),
    defaultValues: {
      employeeLoginId: '',
      departmentId: '',
      employeeName: '',
      employeeNameKana: '',
      employeeBirthDate: '',
      employeeEmail: '',
      employeeTelephone: '',
      employeeLoginPassword: '',
      employeeLoginPasswordConfirm: '',
      certificationId: '',
      certificationStartDate: '',
      certificationEndDate: '',
      score: '',
    },
  });

  /**
  * Xử lý khi thay đổi chứng chỉ.
  * Nếu người dùng bỏ chọn chứng chỉ, xóa giá trị các trường liên quan.
  */
  const handleCertificationChange = (value: string) => {
    if (!value) {
      setValue('certificationStartDate', '');
      setValue('certificationEndDate', '');
      setValue('score', '');
    }
  };

  /**
   * Tải dữ liệu danh mục (Master Data).
   */
  const loadMasterData = async () => {
    const [depts, certs] = await Promise.all([
      employeeApi.getDepartments(),
      employeeApi.getCertifications(),
    ]);
    setDepartments(depts);
    setCertifications(certs);
  };

  /**
   * Logic khởi tạo màn hình (ADM004).
   * Phân tách rõ ràng các trường hợp: Quay lại từ ADM005, Edit Mode, và Add Mode.
   */
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        // Fetch data phòng ban và chứng chỉ 
        await loadMasterData();

        if (isBackFromADM005) {
          // TH 1: Quay lại từ màn hình confirm (adm005 -> adm004)
          const savedData = getSessionData(STORAGE_KEY);
          if (savedData) {
            reset(savedData);
            // Xóa session ngay sau khi đọc để hỗ trợ kịch bản "Clear on Refresh" 
            clearSessionData(STORAGE_KEY);
          }
        } else {
          if (isEditMode) {
            // Trường hợp chỉnh sửa (Edit) (adm003 -> adm004)
            const detail = await employeeApi.getEmployeeDetail(parseInt(employeeId));
            reset(detail);
          } else {
            // Trường hợp thêm mới (Add) (adm002 -> adm004)
            // Đảm bảo xóa dữ liệu cũ nếu không phải quay lại từ confirm
            clearSessionData(STORAGE_KEY);
          }
        }
        setInitialized(true);
      } catch (err) {
        console.error('Lỗi khởi tạo:', err);
        setError(getMessage('ER023'));
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [employeeId, isEditMode, isBackFromADM005, reset]);

  /**
   * Xử lý gửi form tới trang xác nhận (adm004 -> adm005)
   */
  const onSubmit: SubmitHandler<EmployeeFormValues> = (values) => {
    // Chỉ lưu dữ liệu từ form vào sessionStorage (employeeId đã được quản lý riêng qua Router)
    setEmployeeToSession(STORAGE_KEY, values);

    // Employee ID KHÔNG được truyền qua session mà phải truyền qua router (URL params)
    const nextPath = employeeId ? `/employees/adm005?id=${employeeId}` : '/employees/adm005';
    router.push(nextPath);
  };

  /**
   * Xử lý quay lại trang danh sách (adm002 -> adm004)
   */
  const handleBack = () => {
    clearSessionData(STORAGE_KEY);
    router.push('/employees/adm002');
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit, (error) => {
    }),
    errors,
    setValue,
    watch,
    departments,
    certifications,
    loading,
    error,
    isEditMode,
    handleBack,
    handleCertificationChange,
  };
}
