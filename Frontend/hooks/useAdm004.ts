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
import { ERR_SYSTEM, ERR_SUCCESS, CODE_ER003, CODE_ER004, CODE_ER012, PARAM_ID, PARAM_MODE, MODE_BACK } from '@/lib/constants/config';
import { LABELS } from '@/lib/constants/messages';
import { getAdm002ReturnUrl } from '@/lib/utils/queryHelper';

// Key cho storage
const STORAGE_KEY = getStorageKey('ADM004');

// Form dữ liệu trống mặc định cho màn adm004
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
  const employeeId = searchParams.get(PARAM_ID);
  const modeBack = searchParams.get(PARAM_MODE);
  const isEditMode = !!employeeId;
  const isBackFromADM005 = modeBack === MODE_BACK;

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
   * Hàm helper để khởi tạo dữ liệu cho Form dựa trên luồng di chuyển của người dùng.
   * Tách ra ngoài để useEffect ngắn gọn và dễ theo dõi theo requirement.
   */
  const initializeFormData = useCallback(async () => {
    // Luồng 1: Từ màn hình Danh sách (ADM002) sang màn hình Thêm mới (ADM004)
    // Đặc điểm: Không ở chế độ Edit và không phải quay lại từ màn hình xác nhận
    if (!isEditMode && !isBackFromADM005) {
      reset(DEFAULT_FORM_VALUES);
    } 
    
    // Luồng 2: Từ màn hình Chi tiết (ADM003) sang màn hình Chỉnh sửa (ADM004)
    // Đặc điểm: Đang ở chế độ Edit và không phải quay lại từ màn hình xác nhận
    else if (isEditMode && !isBackFromADM005) {
      const detail = await employeeApi.getEmployeeDetail(parseInt(employeeId!));
      if (detail.code === ERR_SUCCESS) {
        const dto = detail.employeeDTO;
        const formattedDetail: EmployeeFormValues = {
          employeeName: dto.employeeName,
          employeeNameKana: dto.employeeNameKana,
          employeeBirthDate: dto.employeeBirthDate ? dto.employeeBirthDate.replace(/-/g, '/') : '',
          employeeEmail: dto.employeeEmail,
          employeeTelephone: dto.employeeTelephone,
          employeeLoginId: dto.employeeLoginId,
          employeeLoginPassword: '',
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
    }

    // Luồng 3: Từ màn hình Xác nhận (ADM005) quay về màn hình Nhập liệu (ADM004)
    // Đặc điểm: Có tham số mode=back trên URL, lấy lại dữ liệu từ session
    else if (isBackFromADM005) {
      const savedData = getSessionData(STORAGE_KEY);
      if (savedData) {
        reset(savedData);
      }
      // Xóa session ngay sau khi dữ liệu được khôi phục thành công
      clearSessionData(STORAGE_KEY);
    }
  }, [isEditMode, isBackFromADM005, employeeId, reset]);

  /**
   * Logic khởi tạo màn hình (ADM004).
   * Hỗ trợ khôi phục từ session khi quay lại từ ADM005.
   */
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        // 1. Tải dữ liệu danh mục phòng ban và chứng chỉ
        await loadMasterData();
        
        // 2. Khởi tạo dữ liệu Form theo các luồng nghiệp vụ (Requirement)
        await initializeFormData();

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
  }, [initializeFormData]);

  // --- Các hàm xử lý sự kiện (Actions) ---

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
      // Chuyển sang màn hình xác nhận
      const params = new URLSearchParams(searchParams.toString());
      if (employeeId) {
        params.set(PARAM_ID, employeeId);
      }
      // Xóa mode=back nếu có (vì đây là chiều đi tới ADM005)
      params.delete(PARAM_MODE);

      router.push(`/employees/adm005?${params.toString()}`);
    } catch (err) {
      console.error('Lỗi validate:', err);
      // Redirect sang màn hình system_error với mã lỗi ER014
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
    // Tạo đối tượng params từ searchParams hiện tại
    const params = new URLSearchParams(searchParams.toString());
    // Luôn xóa mode=back khi điều hướng thoát khỏi ADM004
    params.delete(PARAM_MODE);

    if (isEditMode) {
      // Nếu đang chỉnh sửa: Quay lại màn hình Chi tiết nhân viên (ADM003)
      // Đảm bảo ID chỉ xuất hiện một lần và đã xóa mode=back
      params.set(PARAM_ID, employeeId!);
      router.push(`/employees/adm003?${params.toString()}`);
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
