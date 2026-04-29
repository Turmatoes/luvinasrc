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
import { getAdm002ReturnUrl } from '@/lib/utils/queryHelper';

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
        // 2. Xử lý logic khởi tạo dữ liệu Form
        if (isBackFromADM005) {
          // Trường hợp quay lại từ màn hình xác nhận (ADM005 -> ADM004): 
          // Chỉ lúc này mới dùng dữ liệu từ session
          const savedData = getSessionData(STORAGE_KEY);
          if (savedData) {
            reset(savedData);
          }
          // Xóa session ngay sau khi dữ liệu được load thành công lên màn adm004
          clearSessionData(STORAGE_KEY);

          // Xóa mode=back khỏi URL để tránh F5 bị lặp lại logic back
          const newUrl = employeeId ? `/employees/adm004?id=${employeeId}` : '/employees/adm004';
          router.replace(newUrl);
        } else if (isEditMode) {
          // Trường hợp KHÔNG phải quay lại từ confirm và đang ở chế độ Chỉnh sửa (Edit): 
          // Luôn fetch mới từ API (đúng logic "đẩy data từ DB lên")
          const detail = await employeeApi.getEmployeeDetail(parseInt(employeeId!));

          if (detail.code === ERR_SUCCESS) {
            const dto = detail.employeeDTO;
            // Ánh xạ từ EmployeeDTO (Backend) sang EmployeeFormValues (Frontend)
            const formattedDetail: EmployeeFormValues = {
              employeeName: dto.employeeName,
              employeeNameKana: dto.employeeNameKana,
              employeeBirthDate: dto.employeeBirthDate ? dto.employeeBirthDate.replace(/-/g, '/') : '',
              employeeEmail: dto.employeeEmail,
              employeeTelephone: dto.employeeTelephone,
              employeeLoginId: dto.employeeLoginId,
              employeeLoginPassword: '', // Mật khẩu không trả về từ API
              employeeLoginPasswordConfirm: '',
              departmentId: dto.departmentId ? dto.departmentId.toString() : '',
              certificationId: dto.certificationId ? dto.certificationId.toString() : '',
              certificationStartDate: dto.certificationStartDate ? dto.certificationStartDate.replace(/-/g, '/') : '',
              certificationEndDate: dto.certificationEndDate ? dto.certificationEndDate.replace(/-/g, '/') : '',
              score: dto.score ? dto.score.toString() : '',
            };
            reset(formattedDetail);
          } else {
            redirectToSystemError(detail.code);
          }
        } else {
          // Trường hợp Thêm mới (Add) và không phải back từ confirm: Form trống
          reset(DEFAULT_FORM_VALUES);
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
      // Đính kèm employeeId nếu đang ở chế độ Edit
      const payload = isEditMode ? { ...values, employeeId: parseInt(employeeId!) } : values;

      // Gọi API Validate từ Backend
      const res = await employeeApi.validateEmployee(payload);

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
      setEmployeeToSession(STORAGE_KEY, payload);
      // Chuyển sang màn hình xác nhận, đính kèm ID (nếu có) và giữ các tham số tìm kiếm/sắp xếp
      const nextPath = employeeId 
        ? `/employees/adm005?id=${employeeId}&${searchParams.toString()}` 
        : `/employees/adm005?${searchParams.toString()}`;
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
   * Xử lý khi nhấn nút "Quay lại" (戻る).
   * Điều hướng người dùng về màn hình phù hợp tùy theo chế độ (Add/Edit).
   */
  const handleBack = () => {
    // Xóa sạch dữ liệu tạm lưu trong session storage của màn hình ADM004
    clearSessionData(STORAGE_KEY);
    
    if (isEditMode) {
      // Nếu đang chỉnh sửa: Quay lại màn hình Chi tiết nhân viên (ADM003) và giữ nguyên các tham số
      router.push(`/employees/adm003?id=${employeeId}&${searchParams.toString()}`);
    } else {
      // Nếu đang thêm mới: Quay lại màn hình Danh sách nhân viên (ADM002) và khôi phục trạng thái tìm kiếm
      router.push(getAdm002ReturnUrl(searchParams));
    }
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
