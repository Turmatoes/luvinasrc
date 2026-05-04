/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm002.ts, April 22, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { departmentApi } from '@/lib/api/department.api';
import { EmployeeListResponse, DepartmentDTO, SortDirection, SortKey } from '@/types/employee';
import { getMessage } from '@/lib/utils/messageHelper';
import { LIMIT_PER_PAGE, MAX_EMPLOYEE_NAME_LENGTH, ERR_SYSTEM, CODE_ER006, PARAM_NAME, PARAM_DEPT, PARAM_PAGE, PARAM_SORT_NAME, PARAM_SORT_CERT, PARAM_SORT_DATE } from '@/lib/constants/config';
import { redirectToSystemError } from '@/lib/utils/errorHelper';
import { LABELS } from '@/lib/constants/messages';

const DEFAULT_SORT: Record<SortKey, SortDirection> = {
  employeeName: 'asc',
  certificationName: 'asc',
  certificationEndDate: 'asc',
};

interface SearchFormState {
  employeeName: string;
  departmentId: number | null;
}

export function useAdm002() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // --- 1. Đọc trạng thái từ URL ---
  const urlParams = useMemo(() => {
    return {
      employeeName: searchParams.get(PARAM_NAME) || '',
      departmentId: searchParams.get(PARAM_DEPT) ? parseInt(searchParams.get(PARAM_DEPT)!) : null,
      currentPage: searchParams.get(PARAM_PAGE) ? parseInt(searchParams.get(PARAM_PAGE)!) : 1,
      sort: {
        employeeName: (searchParams.get(PARAM_SORT_NAME) as SortDirection) || DEFAULT_SORT.employeeName,
        certificationName: (searchParams.get(PARAM_SORT_CERT) as SortDirection) || DEFAULT_SORT.certificationName,
        certificationEndDate: (searchParams.get(PARAM_SORT_DATE) as SortDirection) || DEFAULT_SORT.certificationEndDate,
      } as Record<SortKey, SortDirection>,
    };
  }, [searchParams]);

  // --- 2. Trạng thái Local cho Form (chưa submit) ---
  const [searchForm, setSearchForm] = useState<SearchFormState>({
    employeeName: urlParams.employeeName,
    departmentId: urlParams.departmentId,
  });

  // Derived state: Đồng bộ searchForm khi URL thay đổi (trường hợp nhấn Back/Forward)
  // Cách này tối ưu hơn useEffect vì nó cập nhật ngay trong quá trình render, không gây ra extra render sau khi paint.
  const prevUrlParamsRef = useRef(urlParams);
  if (
    prevUrlParamsRef.current.employeeName !== urlParams.employeeName ||
    prevUrlParamsRef.current.departmentId !== urlParams.departmentId
  ) {
    prevUrlParamsRef.current = urlParams;
    setSearchForm({
      employeeName: urlParams.employeeName,
      departmentId: urlParams.departmentId,
    });
  }

  // --- 3. Trạng thái dữ liệu ---
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const [employeeNameError, setEmployeeNameError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  /**
   * Hàm helper để cập nhật URL dựa trên các tham số mới.
   */
  const updateUrl = useCallback((params: {
    name?: string;
    dept?: number | null;
    page?: number;
    sort?: Record<SortKey, SortDirection>;
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.name !== undefined) {
      if (params.name) newParams.set(PARAM_NAME, params.name);
      else newParams.delete(PARAM_NAME);
    }
    
    if (params.dept !== undefined) {
      if (params.dept) newParams.set(PARAM_DEPT, params.dept.toString());
      else newParams.delete(PARAM_DEPT);
    }

    if (params.page !== undefined) {
      newParams.set(PARAM_PAGE, params.page.toString());
    }

    if (params.sort !== undefined) {
      newParams.set(PARAM_SORT_NAME, params.sort.employeeName);
      newParams.set(PARAM_SORT_CERT, params.sort.certificationName);
      newParams.set(PARAM_SORT_DATE, params.sort.certificationEndDate);
    }

    router.replace(`${pathname}?${newParams.toString()}`);
  }, [pathname, router, searchParams]);

  /**
   * Tải danh mục phòng ban
   */
  const loadMasterData = async () => {
    try {
      const depts = await departmentApi.getDepartments();
      setDepartments(depts);
    } catch (err) {
      console.error('Lỗi khi tải danh sách phòng ban:', err);
      redirectToSystemError(ERR_SYSTEM);
    }
  };

  /**
   * Logic chính để tải danh sách nhân viên từ API Service.
   */
  const loadEmployees = useCallback(async () => {
    setEmployeeError(null);
    try {
      const response = await employeeApi.getEmployees({
        employeeName: urlParams.employeeName.trim() || null,
        departmentId: urlParams.departmentId,
        offset: (urlParams.currentPage - 1) * LIMIT_PER_PAGE,
        limit: LIMIT_PER_PAGE,
        sortEmployeeName: urlParams.sort.employeeName,
        sortCertificationName: urlParams.sort.certificationName,
        sortEndDate: urlParams.sort.certificationEndDate,
      });
      
      const employees = response.employees ?? [];
      const totalPages = response.totalRecords > 0 ? Math.ceil(response.totalRecords / LIMIT_PER_PAGE) : 0;

      // Nếu trang hiện tại vượt quá tổng số trang (do xóa dữ liệu), quay về trang cuối
      if (response.totalRecords > 0 && employees.length === 0 && urlParams.currentPage > totalPages) {
        updateUrl({ page: totalPages });
        return;
      }

      setData({
        ...response,
        employees,
      });
    } catch (err: unknown) {
      console.error('Lỗi khi tải danh sách nhân viên:', err);
      const errorCode = (err as any)?.response?.data?.code ?? ERR_SYSTEM;
      if (errorCode === ERR_SYSTEM) {
        redirectToSystemError(ERR_SYSTEM);
      } else {
        setEmployeeError(getMessage(errorCode));
      }
      setData(null);
    }
  }, [urlParams, updateUrl]);

  /**
   * Logic khởi tạo và tải dữ liệu (gộp chung vào 1 useEffect để rõ ràng từng bước).
   */
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        if (!initialized) {
          // Bước 1: Load master data (phòng ban) trong lần đầu tiên
          await loadMasterData();
          setInitialized(true);
        }
        // Bước 2: Luôn load lại employees khi có sự thay đổi từ urlParams
        await loadEmployees();
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [loadEmployees, initialized]);

  // --- Các hàm xử lý sự kiện (Actions) ---

  /**
   * Xử lý tìm kiếm nhân viên.
   */
  const handleSearch = (name: string, deptId: number | null) => {
    const normalizedName = name.trim();

    if (normalizedName.length > MAX_EMPLOYEE_NAME_LENGTH) {
      setEmployeeNameError(getMessage(CODE_ER006, [LABELS.FULL_NAME, MAX_EMPLOYEE_NAME_LENGTH]));
      return;
    }

    setEmployeeNameError(null);
    updateUrl({
      name: normalizedName,
      dept: deptId,
      page: 1, // Reset về trang 1 khi tìm kiếm mới
    });
  };

  /**
   * Xử lý thay đổi trang.
   */
  const handlePageChange = (page: number) => {
    updateUrl({ page });
  };

  /**
   * Xử lý sắp xếp.
   */
  const handleSort = (key: SortKey) => {
    const newSort = {
      ...urlParams.sort,
      [key]: urlParams.sort[key] === 'asc' ? 'desc' : 'asc',
    };
    updateUrl({
      page: 1,
      sort: newSort,
    });
  };

  /**
   * Xử lý thay đổi phòng ban.
   */
  const handleDepartmentChange = (deptId: number | null) => {
    setSearchForm(prev => ({ ...prev, departmentId: deptId }));
  };

  /**
   * Xử lý thay đổi tên nhân viên.
   */
  const handleEmployeeNameChange = (name: string) => {
    setSearchForm(prev => ({ ...prev, employeeName: name }));
    if (name.trim().length <= MAX_EMPLOYEE_NAME_LENGTH) {
      setEmployeeNameError(null);
    }
  };

  /**
   * Tính toán danh sách số trang hiển thị.
   */
  const pageNumbers = useMemo(() => {
    const total = data ? Math.ceil(data.totalRecords / LIMIT_PER_PAGE) : 0;
    const current = urlParams.currentPage;
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (total <= 1) return [];

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < total - 1) pages.push('...');
      pages.push(total);
    }
    return pages;
  }, [data, urlParams.currentPage]);

  return {
    data,
    departments,
    loading,
    departmentError,
    employeeError,
    employeeNameError,
    searchForm,
    filters: urlParams,
    totalPages: data ? Math.ceil(data.totalRecords / LIMIT_PER_PAGE) : 0,
    pageNumbers,
    handleSearch,
    handlePageChange,
    handleSort,
    handleDepartmentChange,
    handleEmployeeNameChange,
    searchParams,
  };
}
