/*
 * Copyright(C) 2010 Luvina Software Company
 *
 * useAdm002.ts, May 08, 2026 nxplong
 */
'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { employeeApi } from '@/lib/api/employee.api';
import { departmentApi } from '@/lib/api/department.api';
import { EmployeeListResponse, DepartmentDTO, SortDirection, SortKey } from '@/types/employee';
import { getMessage } from '@/lib/utils/messageHelper';
import {
  LIMIT_PER_PAGE, MAX_EMPLOYEE_NAME_LENGTH, ERR_SYSTEM, CODE_ER006,
  PARAM_NAME, PARAM_DEPT, PARAM_PAGE, PARAM_SORT_NAME, PARAM_SORT_CERT, PARAM_SORT_DATE
} from '@/lib/constants/config';
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

  // ---------------------------------------------------------
  // 3.1 & 3.2 HIỂN THỊ BAN ĐẦU & BINDING DATA
  // ---------------------------------------------------------

  // Đọc điều kiện search ban đầu từ URL (Mặc định: rỗng, page 1, sort ASC)
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

  // Các State quản lý dữ liệu và trạng thái hiển thị
  const [data, setData] = useState<EmployeeListResponse | null>(null);
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const [employeeNameError, setEmployeeNameError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // State cục bộ cho Form tìm kiếm
  const [searchForm, setSearchForm] = useState<SearchFormState>({
    employeeName: urlParams.employeeName,
    departmentId: urlParams.departmentId,
  });

  // Đồng bộ lại form khi URL thay đổi (nhấn Back/Forward)
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

  /**
   * Cập nhật URL (Helper dùng chung cho các Action Search/Sort/Paging)
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
    if (params.page !== undefined) newParams.set(PARAM_PAGE, params.page.toString());
    if (params.sort !== undefined) {
      newParams.set(PARAM_SORT_NAME, params.sort.employeeName);
      newParams.set(PARAM_SORT_CERT, params.sort.certificationName);
      newParams.set(PARAM_SORT_DATE, params.sort.certificationEndDate);
    }

    router.replace(`${pathname}?${newParams.toString()}`);
  }, [pathname, router, searchParams]);

  /**
   * 3.1 Gọi API list departments
   */
  const loadMasterData = async () => {
    try {
      const depts = await departmentApi.getDepartments();
      setDepartments(depts);
    } catch (err) {
      console.error('Lỗi khi tải danh sách phòng ban:', err);
      // TH API trả về lỗi: Hiển thị message lỗi "部門を取得できません" 
      redirectToSystemError(ERR_SYSTEM);
    }
  };

  /**
   * 3.1 & 3.2 Gọi API list employees và Binding dữ liệu
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

      // Xử lý quay lại trang cuối nếu trang hiện tại bị trống do lọc/xóa
      if (response.totalRecords > 0 && employees.length === 0 && urlParams.currentPage > totalPages) {
        updateUrl({ page: totalPages });
        return;
      }

      // Binding dữ liệu vào bảng nhân viên
      setData({ ...response, employees });
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
   * Khởi chạy logic hiển thị ban đầu
   */
  // Khởi tạo Master data và tải danh sách nhân viên khi màn hình được load hoặc các tham số tìm kiếm thay đổi
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      try {
        if (!initialized) {
          // Load master data (phòng ban) 
          await loadMasterData();
          setInitialized(true);
        }
        // Luôn load lại employees khi có sự thay đổi từ urlParams
        await loadEmployees();
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, [loadEmployees, initialized]);

  // ---------------------------------------------------------
  // 3.3 ACTION SEARCH
  // ---------------------------------------------------------
  const handleSearch = (name: string, deptId: number | null) => {
    const searchingName = name.trim();
    if (searchingName.length > MAX_EMPLOYEE_NAME_LENGTH) {
      setEmployeeNameError(getMessage(CODE_ER006, [LABELS.FULL_NAME, MAX_EMPLOYEE_NAME_LENGTH]));
      return;
    }
    setEmployeeNameError(null);
    updateUrl({
      name: searchingName,
      dept: deptId,
      page: 1, // Reset page hiện tại = 1
      // Giữ nguyên điều kiện sort (đã được giữ trong updateUrl khi không truyền sort mới)
    });
  };

  // ---------------------------------------------------------
  // 3.4 ACTION SORT
  // ---------------------------------------------------------
  const handleSort = (key: SortKey) => {
    const newSort = {
      ...urlParams.sort,
      [key]: urlParams.sort[key] === 'asc' ? 'desc' : 'asc', // Đảo ngược giá trị sort hiện tại
    };
    updateUrl({
      page: 1, // Reset page hiện tại = 1
      sort: newSort,
      // Giữ nguyên điều kiện tìm kiếm
    });
  };

  // ---------------------------------------------------------
  // 3.5 ACTION PAGING
  // ---------------------------------------------------------
  const handlePageChange = (page: number) => {
    // Gọi lại API giữ nguyên điều kiện search và sort
    updateUrl({ page });
  };

  // Tính toán danh sách số trang hiển thị (3.2 Handling paging control)
  const pageNumbers = useMemo(() => {
    const total = data ? Math.ceil(data.totalRecords / LIMIT_PER_PAGE) : 0;
    const current = urlParams.currentPage;
    const pages: (number | string)[] = [];
    if (total <= 1) return []; // TH tổng số record <= 20, ko hiển thị paging

    const maxVisible = 5;
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

  // ---------------------------------------------------------
  // 3.6 & 3.7 ACTION ADD & VIEW DETAIL
  // ---------------------------------------------------------

  // Hành động chuyển đổi dữ liệu Form (Search input)
  const handleDepartmentChange = (deptId: number | null) => {
    setSearchForm(prev => ({ ...prev, departmentId: deptId }));
  };

  const handleEmployeeNameChange = (name: string) => {
    setSearchForm(prev => ({ ...prev, employeeName: name }));
    if (name.trim().length <= MAX_EMPLOYEE_NAME_LENGTH) setEmployeeNameError(null);
  };

  // Trả về các giá trị cho Component (ADM002 Page)
  return {
    data,
    departments,
    loading,
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
