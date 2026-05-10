/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm004.ts, May 08, 2026 nxplong
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

// Key cho storage lưu tạm dữ liệu khi di chuyển giữa các màn hình (ADM004 <-> ADM005)
const STORAGE_KEY = getStorageKey('ADM004');

// Giá trị mặc định cho form
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
 * Custom Hook useAdm004 quản lý logic cho màn hình Nhập liệu nhân viên (ADM004).
 */
export function useAdm004() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get(PARAM_ID);
  const modeBack = searchParams.get(PARAM_MODE);

  // Xác định MH là Edit hay Add dựa trên ID trong router (5.1)
  const isEditMode = !!employeeId;
  const isBackFromADM005 = modeBack === MODE_BACK;

  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [certifications, setCertifications] = useState<CertificationDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Khởi tạo React Hook Form với Zod (Xử lý tương tác và validate tức thì - 5.2)
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
    mode: 'onChange', // Thực hiện validate ngay khi user tương tác (5.2)
  });

  // ---------------------------------------------------------
  // 5.1 HIỂN THỊ BAN ĐẦU
  // ---------------------------------------------------------

  /**
   * Tải dữ liệu danh mục phòng ban và chứng chỉ để binding vào các dropdown list.
   */
  const loadMasterData = async () => {
    try {
      const [depts, certs] = await Promise.all([
        departmentApi.getDepartments(),
        certificationApi.getCertifications(),
      ]);
      setDepartments(depts);
      setCertifications(certs);
    } catch (err) {
      console.error('Lỗi tải Master Data:', err);
      // TH API trả về lỗi: Hiển thị thông báo lỗi lên MH
    }
  };

  /**
   * Khởi tạo dữ liệu Form theo các luồng nghiệp vụ.
   */
  const initializeFormData = useCallback(async () => {
    // Trường hợp 1: Không phải từ MH confirm quay về (Lần đầu vào MH)
    if (!isBackFromADM005) {
      if (isEditMode) {
        // Nếu là mode edit: Gọi API get employee tương ứng với ID
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
            employeeLoginPassword: '', // Edit hiển thị ban đầu ko yêu cầu nhập password (5.2)
            employeeLoginPasswordConfirm: '',
            departmentId: dto.departmentId ? dto.departmentId.toString() : '',
            certificationId: dto.certificationId ? dto.certificationId.toString() : '',
            certificationStartDate: dto.certificationStartDate ? dto.certificationStartDate.replace(/-/g, '/') : '',
            certificationEndDate: dto.certificationEndDate ? dto.certificationEndDate.replace(/-/g, '/') : '',
            score: dto.score ? dto.score.toString() : '',
          };
          reset(formattedDetail);
        } else {
          // TH API trả về lỗi hoặc ko tồn tại data: Di chuyển sang MH system error
          redirectToSystemError(detail.code);
        }
      } else {
        // Nếu là mode add: Để rỗng các hạng mục nhập trên MH
        reset(DEFAULT_FORM_VALUES);
      }
    }
    // Trường hợp 2: Từ MH confirm quay về (Nhấn nút "Quay lại" tại ADM005)
    else {
      // Lấy data từ MH confirm trả lại (qua session), binding lên các hạng mục nhập
      const savedData = getSessionData(STORAGE_KEY);
      if (savedData) {
        reset(savedData);
      }
      clearSessionData(STORAGE_KEY);
    }
  }, [isEditMode, isBackFromADM005, employeeId, reset]);

  // Thực hiện tải Master data và khởi tạo Form data khi màn hình được load
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        // Tải dữ liệu danh mục phòng ban và chứng chỉ
        await loadMasterData();
        // Khởi tạo dữ liệu cho MH ADM004
        await initializeFormData();
        setInitialized(true);
      } catch (err) {
        // TH API trả về lỗi: Di chuyển sang MH system error
        redirectToSystemError(ERR_SYSTEM);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [initializeFormData]);

  // ---------------------------------------------------------
  // 5.2 TƯƠNG TÁC VỚI CÁC HẠNG MỤC NHẬP
  // ---------------------------------------------------------

  /**
   * Xử lý chứng chỉ tiếng Nhật (Enable/Disable các trường liên quan).
   */
  const handleCertificationChange = (value: string) => {
    // Khi dropdown tên loại chứng chỉ thay đổi từ có giá trị về rỗng: 
    // Disable và clear data 3 hạng mục ngày, điểm (thực hiện qua UI binding)
    if (!value) {
      setValue('certificationStartDate', '');
      setValue('certificationEndDate', '');
      setValue('score', '');
    }
  };

  // ---------------------------------------------------------
  // 5.3 ACTION CANCEL (Nút 戻る)
  // ---------------------------------------------------------

  const handleBack = () => {
    // Xóa session data trước khi quay lại để đảm bảo trạng thái sạch
    clearSessionData(STORAGE_KEY);
    
    const params = new URLSearchParams(searchParams.toString());
    params.delete(PARAM_MODE);

    if (isEditMode) {
      // TH edit: Di chuyển về MH view chi tiết (gửi kèm ID qua router)
      params.set(PARAM_ID, employeeId!);
      router.push(`/employees/adm003?${params.toString()}`);
    } else {
      // TH add mới: Di chuyển về MH list ADM002, page như trước khi di chuyển
      router.push(getAdm002ReturnUrl(searchParams));
    }
  };

  // ---------------------------------------------------------
  // 5.4 ACTION CONFIRM (Nút 確認)
  // ---------------------------------------------------------

  const onSubmit: SubmitHandler<EmployeeFormValues> = async (values) => {
    setLoading(true);
    try {
      const payload = isEditMode ? { ...values, employeeId: parseInt(employeeId!) } : values;

      // Gọi API Validate từ Backend để kiểm tra dữ liệu tổng thể trước khi sang Confirm
      const res = await employeeApi.validateEmployee(payload);

      if (res.code !== ERR_SUCCESS) {
        // Nếu có lỗi thông báo lỗi: Hiển thị ngay dưới hạng mục (xử lý qua setError của Hook Form)
        const errorMessage = getMessage(res.code, res.params || []);

        if (res.code === CODE_ER003) {
          setError('employeeLoginId', { message: errorMessage });
        } else if (res.code === CODE_ER004) {
          if ((res.params || []).includes(LABELS.GROUP)) setError('departmentId', { message: errorMessage });
          else setError('certificationId', { message: errorMessage });
        } else if (res.code === CODE_ER012) {
          setError('certificationEndDate', { message: errorMessage });
        } else {
          // Các lỗi hệ thống khác
          redirectToSystemError(res.code);
        }
        return;
      }

      // Nếu ko lỗi: Lưu dữ liệu vào session và di chuyển sang MH confirm ADM005
      setEmployeeToSession(STORAGE_KEY, payload);
      const params = new URLSearchParams(searchParams.toString());
      if (isEditMode) params.set(PARAM_ID, employeeId!);
      params.delete(PARAM_MODE);
      // Di chuyển sang MH confirm ADM005 gửi kèm ID tương ứng qua router
      router.push(`/employees/adm005?${params.toString()}`);
    } catch (err) {
      // TH API trả về lỗi: Di chuyển sang MH system error
      redirectToSystemError(ERR_SYSTEM);
    } finally {
      // Dừng hiển thị trạng thái loading
      setLoading(false);
    }
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
    isEditMode,
    handleBack,
    handleCertificationChange,
  };
}
