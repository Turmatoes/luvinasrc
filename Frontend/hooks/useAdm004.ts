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
import { departmentApi } from '@/lib/api/department.api';
import { certificationApi } from '@/lib/api/certification.api';
import { DepartmentDTO, CertificationDTO, EmployeeFormValues } from '@/types/employee';
import { getMessage } from '@/lib/utils/messageHelper';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEmployeeSchema } from '@/lib/validation/employee';
import { getStorageKey, getSessionData, setEmployeeToSession, clearSessionData } from '@/lib/utils/sessionStorage';
import { redirectToSystemError } from '@/lib/utils/errorHelper';
import { ERR_SYSTEM, ERR_SUCCESS, CODE_ER003, CODE_ER004, CODE_ER012 } from '@/lib/constants/config';
import { LABELS } from '@/lib/constants/messages';

// Key cho storage
const STORAGE_KEY = getStorageKey('ADM004');

const DEFAULT_FORM_VALUES: EmployeeFormValues = {
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
};

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

  const [initialized, setInitialized] = useState(false);

  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema(isEditMode)),
    defaultValues: DEFAULT_FORM_VALUES,
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
   * Tải dữ liệu danh mục phòng ban và chứng chỉ
   */
  const loadMasterData = async () => {
    const [depts, certs] = await Promise.all([
      departmentApi.getDepartments(),
      certificationApi.getCertifications(),
    ]);
    setDepartments(depts);
    setCertifications(certs);
  };

  /**
   * Logic khởi tạo màn hình (ADM004).
   * Hỗ trợ khôi phục từ session khi quay lại từ ADM005.
   */
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        // Tải dữ liệu danh mục phòng ban và chứng chỉ
        await loadMasterData();
        // TH 1: Quay lại từ màn hình confirm (adm005 -> adm004)
        if (isBackFromADM005) {
          const employeeData = getSessionData(STORAGE_KEY);
          if (employeeData) {
            reset(employeeData);
          }
          // Xóa session ngay sau khi dữ liệu được load thành công lên màn adm004
          clearSessionData(STORAGE_KEY);

          // Xóa mode=back khỏi URL để tránh F5 bị lặp lại logic back
          const newUrl = employeeId ? `/employees/adm004?id=${employeeId}` : '/employees/adm004';
          router.replace(newUrl);
        } else {
          if (isEditMode) {
            // Trường hợp chỉnh sửa (Edit): Luôn fetch mới từ API
            const detail = await employeeApi.getEmployeeDetail(parseInt(employeeId));
            reset(detail);
          } else {
            // Trường hợp thêm mới (Add): Form trống
            reset(DEFAULT_FORM_VALUES);
          }
          // Luôn đảm bảo session sạch khi vào mới
          clearSessionData(STORAGE_KEY);
        }

        setInitialized(true);
      } catch (err) {
        console.error('Lỗi khởi tạo:', err);
        redirectToSystemError(ERR_SYSTEM);
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
  const onSubmit: SubmitHandler<EmployeeFormValues> = async (values) => {
    setLoading(true);
    try {
      // Gọi API Validate từ Backend
      const res = await employeeApi.validateEmployee(values);

      if (res.code !== ERR_SUCCESS) {
        // Thông báo lỗi từ Backend (Format chuẩn: {code: "ERxxx", params: [...]})
        const errorCode = res.code;
        const errorParams = res.params || [];
        const errorMessage = getMessage(errorCode, errorParams);

        // Map lỗi về đúng field
        if (errorCode === CODE_ER003) {
          setError('employeeLoginId', { message: errorMessage });
        } else if (errorCode === CODE_ER004) {
          if (errorParams.includes(LABELS.GROUP)) setError('departmentId', { message: errorMessage });
          else setError('certificationId', { message: errorMessage });
        } else if (errorCode === CODE_ER012) {
          setError('certificationEndDate', { message: errorMessage });
        } else {
          // Lỗi hệ thống hoặc các lỗi khác không map được -> Redirect sang màn hình lỗi
          redirectToSystemError(errorCode);
        }
        setLoading(false);
        return;
      }

      // Nếu Validate OK (Nút 確認) -> Lưu session và chuyển trang
      setEmployeeToSession(STORAGE_KEY, values);
      const nextPath = employeeId ? `/employees/adm005?id=${employeeId}` : '/employees/adm005';
      router.push(nextPath);
    } catch (err) {
      console.error('Lỗi validate:', err);
      // Gọi đến System Error khi gặp lỗi
      redirectToSystemError(ERR_SYSTEM);
    } finally {
      setLoading(false);
    }
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

    isEditMode,
    handleBack,
    handleCertificationChange,
  };
}
