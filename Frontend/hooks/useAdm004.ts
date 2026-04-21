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

// Key cho storage
const STORAGE_KEY = 'ADM004_FORM_DATA';

// ====== COMMENTED OUT FOR MANUAL TESTING ======
// TODO: Enable validation after testing sessionStorage flow
// Full Zod Schema (commented for testing)
// const employeeSchema = z.object({...})

// No validation schema for testing - form will submit without validation

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
  const isEditMode = !!employeeId;

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
    defaultValues: {
      departmentId: '',
      certificationId: '',
    },
  });

  // sessionStorage để lưu dữ liệu form
  const formData = watch();
  useEffect(() => {
    if (Object.keys(formData).length > 0 && initialized) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      // DEBUG: Hiển thị sessionStorage data lên console
      console.log('📝 [ADM004] Form Data Changed - Saving to sessionStorage:', formData);
      console.log('🔍 [ADM004] sessionStorage Content:', sessionStorage.getItem(STORAGE_KEY));
    }
  }, [formData, initialized]);

  // Tự động xóa các trường chứng chỉ khi không chọn chứng chỉ
  const certificationId = watch('certificationId');
  useEffect(() => {
    if (!certificationId) {
      setValue('certificationStartDate', '');
      setValue('certificationEndDate', '');
      setValue('score', '');
    }
  }, [certificationId, setValue]);

  /**
   * Tải dữ liệu ban đầu (Departments, Certifications, và Employee nếu là Edit).
   * Chỉ chạy một lần khi component mount
   */
  useEffect(() => {
    const initData = async () => {
      console.log('🔄 [ADM004] initData EXECUTING...');
      setLoading(true);
      try {
        const [depts, certs] = await Promise.all([
          employeeApi.getDepartments(),
          employeeApi.getCertifications(),
        ]);
        setDepartments(depts);
        setCertifications(certs);
        console.log('✅ [ADM004] Loaded departments and certifications');

        // Kiểm tra sessionStorage trước để lưu dữ liệu (Trường hợp làm mới hoặc quay lại từ ADM005)
        const savedData = sessionStorage.getItem(STORAGE_KEY);
        console.log('🔄 [ADM004] Init Data - isEditMode:', isEditMode, '| employeeId:', employeeId);
        console.log('🔄 [ADM004] Saved sessionStorage data:', savedData);
        
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          reset(parsedData);
          console.log('✅ [ADM004] Loaded from sessionStorage:', parsedData);
        } else if (isEditMode) {
          // Nếu không có dữ liệu đã lưu và đang ở chế độ chỉnh sửa, tải từ API
          const detail = await employeeApi.getEmployeeDetail(parseInt(employeeId));
          reset(detail);
          console.log('✅ [ADM004] Loaded from API (Edit mode):', detail);
        } else {
          console.log('✅ [ADM004] Fresh form (Add mode)');
        }
        setInitialized(true);
      } catch (err) {
        console.error('❌ [ADM004] Failed to init data:', err);
        setError(getMessage('ER023'));
        setInitialized(true);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []); // Empty dependency - run only once on mount

  /**
   * Xử lý gửi form tới trang xác nhận (ADM005).
   */
  const onSubmit: SubmitHandler<EmployeeFormValues> = (values) => {
    console.log('🎯 [ADM004] onSubmit handler TRIGGERED');
    // Lưu vào sessionStorage để ADM005 lấy ra xử lý tiếp
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    console.log('📤 [ADM004] Form Submitted - Navigating to ADM005');
    console.log('📤 [ADM004] Form data sent to sessionStorage:', values);
    router.push('/employees/adm005');
  };

  /**
   * Xử lý quay lại trang danh sách.
   */
  const handleBack = () => {
    console.log('⬅️ [ADM004] Back button clicked - Clearing sessionStorage');
    sessionStorage.removeItem(STORAGE_KEY);
    router.push('/employees/adm002');
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit, (error) => {
      console.log('❌ [ADM004] handleSubmit validation FAILED:', error);
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
  };
}
