/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm004.ts, April 20, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { DepartmentDTO, CertificationDTO, EmployeeFormValues } from '@/types/employee';
import { getMessage } from '@/lib/utils/messageHelper';

// Key cho storage
const STORAGE_KEY = 'ADM004_FORM_DATA';

// Zod Schema cho xử lí validate
const employeeSchema = z.object({
  employeeLoginId: z.string().min(1, { message: 'ER001' }).max(50, { message: 'ER006' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'ER019' }),
  departmentId: z.string().min(1, { message: 'ER001' }),
  employeeName: z.string().min(1, { message: 'ER001' }).max(125, { message: 'ER006' }),
  employeeNameKana: z.string().min(1, { message: 'ER001' }).max(125, { message: 'ER006' })
    .regex(/^[\u30A0-\u30FF]+$/, { message: 'ER009' }),
  employeeBirthDate: z.string().min(1, { message: 'ER001' }),
  employeeEmail: z.string().min(1, { message: 'ER001' }).email({ message: 'ER001' }).max(125, { message: 'ER006' }),
  employeeTelephone: z.string().min(1, { message: 'ER001' }).max(50, { message: 'ER006' })
    .regex(/^[0-9]+$/, { message: 'ER001' }), // Simple numeric check
  employeeLoginPassword: z.string().optional(),
  employeeLoginPasswordConfirm: z.string().optional(),
  certificationId: z.string().optional(),
  certificationStartDate: z.string().optional(),
  certificationEndDate: z.string().optional(),
  score: z.string().optional(),
}).refine((data) => {
  // Logic so khớp mật khẩu nếu được cung cấp (cho chế độ Thêm hoặc nếu thay đổi trong Chỉnh sửa)
  if (data.employeeLoginPassword && data.employeeLoginPassword !== data.employeeLoginPasswordConfirm) {
    return false;
  }
  return true;
}, {
  message: 'ER017',
  path: ['employeeLoginPasswordConfirm'],
});

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

  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      departmentId: '',
      certificationId: '',
    },
  });

  // sessionStorage để lưu dữ liệu form
  const formData = watch();
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

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
   */
  const initData = useCallback(async () => {
    setLoading(true);
    try {
      const [depts, certs] = await Promise.all([
        employeeApi.getDepartments(),
        employeeApi.getCertifications(),
      ]);
      setDepartments(depts);
      setCertifications(certs);

      // Kiểm tra sessionStorage trước để lưu dữ liệu (Trường hợp làm mới)
      const savedData = sessionStorage.getItem(STORAGE_KEY);
      if (savedData) {
        reset(JSON.parse(savedData));
      } else if (isEditMode) {
        // Nếu không có dữ liệu đã lưu và đang ở chế độ chỉnh sửa, tải từ API
        const detail = await employeeApi.getEmployeeDetail(parseInt(employeeId));
        reset(detail);
      }
    } catch (err) {
      console.error('Failed to init ADM004 data:', err);
      setError(getMessage('ER023'));
    } finally {
      setLoading(false);
    }
  }, [isEditMode, employeeId, reset]);

  useEffect(() => {
    initData();
  }, [initData]);

  /**
   * Xử lý gửi form tới trang xác nhận (ADM005).
   */
  const onSubmit = (values: EmployeeFormValues) => {
    // Lưu vào sessionStorage để ADM005 lấy ra xử lý tiếp
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    router.push('/employees/adm005');
  };

  /**
   * Xử lý quay lại trang danh sách.
   */
  const handleBack = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    router.push('/employees/adm002');
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
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
